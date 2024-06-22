const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require('bcrypt');
const path = require('path');
const mysql = require('mysql');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Note: secure should be true in production when using HTTPS
}));

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'maisondart',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 2
});

// Use the pool to execute queries
const executeQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(sql, params, (error, results, fields) => {
                connection.release();
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    });
};

const generateUserId = async () => {
    while (true) {
        const randomNumber = Math.floor(Math.random() * 1000);
        const userId = `CU${String(randomNumber).padStart(3, '0')}`;

        const rows = await executeQuery('SELECT userId FROM msUser WHERE userId = ?', [userId]);
        if (rows.length === 0) {
            return userId;
        }
    }
};

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login?message=Please login first');
};

app.get('/home', (req, res) => {
    res.render(path.join(__dirname, 'public', '/home.ejs'));
});

app.get('/login', (req, res) => {
    const message = req.query.message;
    res.render(path.join(__dirname, 'public', '/login.ejs'), { message });
});


// Example artist profile route
app.get('/artist/:id', isAuthenticated, async (req, res) => {
    const artistID = req.params.id;
    try {
        // Query to fetch artist and their products
        const query = `
            SELECT ma.artistID, ma.artistName, ma.artistImage, 
            mp.productImage, mp.productName, mp.productDescription, mp.productPrice, mp.productID
            FROM msartist ma
            INNER JOIN msproduct mp ON ma.artistID = mp.storeID
            WHERE ma.artistID = ?
        `;
        
        const rows = await executeQuery(query, [artistID]);

        if (!rows.length) {
            return res.status(404).send('Artist not found');
        }

        // Group products by artistID
        const artist = {
            artistID: rows[0].artistID,
            artistName: rows[0].artistName,
            artistImage: rows[0].artistImage,
            products: rows.map(row => ({
                productImage: row.productImage,
                productName: row.productName,
                productDescription: row.productDescription,
                productPrice: row.productPrice,
                productID: row.productID
            }))
        };

        res.render(path.join(__dirname, 'public', '/artist_page.ejs'), { artist });
    } catch (error) {
        console.error('Error fetching artist and products:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/auctions', isAuthenticated, async (req, res) => {
    try {
        // Query to fetch auction data along with product details
        const query = `
            SELECT ma.productID, mp.productImage, ad.bidPrice, ma.auctionEndDate
            FROM msauction ma
            INNER JOIN msproduct mp ON ma.productID = mp.productID
            LEFT JOIN auctiondetail ad ON mp.productID = ad.productID
        `;
        const rows = await executeQuery(query);

        res.render(path.join(__dirname, 'public', '/auction_2.ejs'), { auctions: rows });
    } catch (error) {
        console.error('Error fetching auction data:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/shop', isAuthenticated, async (req, res) => {
    const itemsPerPage = 15;
    const currentPage = parseInt(req.query.page) || 1;
    const offset = (currentPage - 1) * itemsPerPage;

    try {
        const rows = await executeQuery('SELECT ProductID, ProductName, ProductImage, ProductPrice, ProductDescription FROM msproduct LIMIT ? OFFSET ?', [itemsPerPage, offset]);

        if (!rows.length && currentPage > 1) {
            return res.redirect('/shop?page=1');
        }

        const totalProducts = await executeQuery('SELECT COUNT(*) as count FROM msproduct');
        const totalPages = Math.ceil(totalProducts[0].count / itemsPerPage);

        res.render(path.join(__dirname, 'public', '/shop.ejs'), { products: rows, currentPage, totalPages });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/product/:id', isAuthenticated, async (req, res) => {
    const productId = req.params.id;
    try {
        const rows = await executeQuery('SELECT * FROM msproduct p JOIN msartist a on p.StoreID=a.ArtistID WHERE ProductID = ?', [productId]);

        if (!rows.length) {
            return res.status(404).send('Product not found');
        }

        res.render(path.join(__dirname, 'public', '/product.ejs'), { product: rows[0] });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/profile', isAuthenticated, async (req, res) => {
    const userId = req.session.userId; // Retrieve userID from session

    try {
        // Fetch user information from msuser table
        const userQuery = 'SELECT userName, userEmail, userPhoneNumber, userAddress FROM msuser WHERE userID = ?';
        const userRows = await executeQuery(userQuery, [userId]);

        if (!userRows.length) {
            return res.status(404).send('User not found');
        }

        const user = userRows[0];

        // Fetch orders with product details from orderdetail and msproduct tables
        const ordersQuery = `
            SELECT od.orderID, p.productID, p.productName, p.productDescription, p.productPrice, p.productImage, od.orderStatus
            FROM orderdetail od
            INNER JOIN msproduct p ON od.productID = p.productID
            WHERE od.userID = ?
            ORDER BY od.orderDate DESC
        `;
        const ordersRows = await executeQuery(ordersQuery, [userId]);

        // Group orders by orderID
        const ordersMap = new Map();
        ordersRows.forEach(row => {
            if (!ordersMap.has(row.orderID)) {
                ordersMap.set(row.orderID, {
                    orderID: row.orderID,
                    orderStatus: row.orderStatus,
                    products: []
                });
            }
            ordersMap.get(row.orderID).products.push({
                productID: row.productID,
                productName: row.productName,
                productDescription: row.productDescription,
                productPrice: row.productPrice,
                productImage: row.productImage
            });
        });

        // Convert orders map to array
        const orders = Array.from(ordersMap.values());

        // Render the profile page with user and orders data
        res.render(path.join(__dirname, 'public', 'user.ejs'), { user, orders });
    } catch (error) {
        console.error('Error fetching user data or orders:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/cart', isAuthenticated, async (req, res) => {
    const userId = req.session.userId;

    try {
        // Fetch the cart items for the user, joining the product and artist information
        const cartItems = await executeQuery(`
            SELECT c.ArtistID, a.ArtistName, c.ProductID, p.ProductName, p.ProductDescription, p.ProductPrice, p.ProductImage, c.Quantity
            FROM mscart c
            JOIN msproduct p ON c.ProductID = p.ProductID
            JOIN msartist a ON c.ArtistID = a.ArtistID
            WHERE c.UserID = ?
            ORDER BY a.ArtistName
        `, [userId]);

        // Group the cart items by artist
        const groupedCartItems = cartItems.reduce((acc, item) => {
            if (!acc[item.ArtistID]) {
                acc[item.ArtistID] = {
                    artistName: item.ArtistName,
                    products: []
                };
            }
            acc[item.ArtistID].products.push(item);
            return acc;
        }, {});

        res.render(path.join(__dirname,'public','/cart.ejs'), { groupedCartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Assuming you have set up your app with necessary imports and configurations

// GET route to render the payment page
app.get('/payment', isAuthenticated, async (req, res) => {
    const { userId } = req.session; // Retrieve userID from session

    if (!userId) {
        return res.redirect('/login'); // Redirect if user is not authenticated
    }

    try {
        // Fetch data from temporary_table joined with msproduct and msUser for the current user
        const sql = `
            SELECT ma.artistName, mp.ProductName, mp.ProductPrice, mp.ProductImage, tt.userID, mu.userAddress
            FROM temporary_table tt
            INNER JOIN msproduct mp ON tt.productID = mp.ProductID
            INNER JOIN msartist ma ON mp.storeID = ma.artistID
            LEFT JOIN msuser mu ON tt.userID = mu.userID
            WHERE tt.userID = ?
        `;
        const items = await executeQuery(sql, [userId]);

        // Calculate total price
        let totalPrice = 0;
        items.forEach(item => {
            totalPrice += item.ProductPrice;
        });

        // Group items by artistName for rendering in the template
        const groupedProducts = {};

        items.forEach(item => {
            if (!groupedProducts[item.artistName]) {
                groupedProducts[item.artistName] = {
                    artistName: item.artistName,
                    products: []
                };
            }
            groupedProducts[item.artistName].products.push({
                productImage: item.ProductImage,
                productName: item.ProductName,
                productDesc: item.productDescription || '', // Assuming this field exists in temporary_table
                productPrice: item.ProductPrice
            });
        });

        // Retrieve the userAddress from the first item (assuming all items have the same userID and userAddress)
        const userAddress = items.length > 0 ? items[0].userAddress : '';

        res.render(path.join(__dirname, 'public', '/payment.ejs'), { groupedProducts, totalPrice, userAddress }); // Pass totalPrice and userAddress to the template
    } catch (error) {
        console.error('Error fetching data from temporary_table:', error);
        res.status(500).send('Error fetching data from temporary_table'); // Handle error appropriately
    }
});







app.post('/signup', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userId = await generateUserId();
        const user = { name: req.body.name, email: req.body.email, password: hashedPassword };

        await executeQuery('INSERT INTO msUser (UserID, UserName, UserEmail, UserPassword) VALUES (?, ?, ?, ?)', [userId, user.name, user.email, user.password]);

        req.session.userId = userId;

        console.log('User signed up:', user);
        res.redirect('/home');
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const rows = await executeQuery('SELECT * FROM msUser WHERE userEmail = ?', [email]);
        const user = rows[0];

        if (!user) {
            console.log('User not found');
            return res.status(400).send('Cannot find user');
        }

        const passwordMatch = await bcrypt.compare(password, user.UserPassword);

        if (passwordMatch) {
            req.session.userId = user.UserID;
            console.log('Login successful');
            res.redirect('/home');
        } else {
            console.log('Incorrect password');
            res.status(400).send('Incorrect password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

app.post('/add-to-cart', isAuthenticated, async (req, res) => {
    const { productId, artistId } = req.body;
    const userId = req.session.userId;

    if (!productId || !userId) {
        return res.status(400).send('Product ID and User ID are required');
    }

    try {
        await executeQuery('INSERT INTO mscart (UserId, ProductId, ArtistID, Quantity) VALUES (?, ?, ?, ?)', [userId, productId, artistId, 1]);
        res.status(200).send({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send('Failed to add product to cart');
    }
});

app.post('/checkout', isAuthenticated, async (req, res) => {
    const { userId } = req.session; // Retrieve userID from session
    const { items } = req.body; // Expecting items array in the request body

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    try {
        // Delete all existing entries in temporary_table for the current user
        await executeQuery('DELETE FROM temporary_table WHERE userID = ?', [userId]);

        // Insert each selected item into temporary_table
        const insertQueries = items.map(item => {
            const { artistID, productName, productDescription, productPrice, productID } = item;
            const sql = 'INSERT INTO temporary_table (userID, artistID, productName, productDesc, productPrice, productID) VALUES (?, ?, ?, ?, ?, ?)';
            return executeQuery(sql, [userId, artistID, productName, productDescription, productPrice, productID]);
        });

        // Execute all insert queries in parallel
        await Promise.all(insertQueries);

        console.log('Items inserted into temporary_table successfully');
        res.json({ success: true, message: 'Items inserted into temporary_table successfully' });
    } catch (error) {
        console.error('Error inserting items into temporary_table:', error);
        res.status(500).json({ success: false, message: 'Error inserting items into temporary_table' });
    }
});

app.post('/submitBid', isAuthenticated, async (req, res) => {
    const { productID, bidPrice } = req.body;
    const userID = req.session.userId; // Assuming user ID is stored in session
    const bidDate = new Date();

    try {
        // First, get the current highest bid for the product
        const highestBidQuery = `
            SELECT MAX(bidPrice) AS highestBid
            FROM auctiondetail
            WHERE productID = ?
        `;
        const [highestBidResult] = await executeQuery(highestBidQuery, [productID]);
        const highestBid = highestBidResult.highestBid || 0; // Default to 0 if no bids yet

        // Check if the new bid price is higher than the current highest bid
        if (bidPrice <= highestBid) {
            return res.status(400).json({ error: 'Bid must be higher than the current highest bid.' });
        }

        // Delete the lowest bid if there's a new higher bid
        const deleteLowestBidQuery = `
            DELETE FROM auctiondetail
            WHERE productID = ? AND bidPrice = (
                SELECT MIN(bidPrice)
                FROM auctiondetail
                WHERE productID = ?
            )
            LIMIT 1
        `;
        await executeQuery(deleteLowestBidQuery, [productID, productID]);

        // Insert the new bid into the auctiondetail table
        const insertQuery = `
            INSERT INTO auctiondetail (productID, userID, bidPrice, bidDate)
            VALUES (?, ?, ?, ?)
        `;
        await executeQuery(insertQuery, [productID, userID, bidPrice, bidDate]);
        res.json({ message: 'Bid submitted successfully!' });
    } catch (error) {
        console.error('Error submitting bid:', error);
        res.status(500).json({ error: 'Failed to submit bid. Please try again.' });
    }
});

app.post('/placeOrder', async (req, res) => {
    const { userId } = req.session; // Retrieve userID from session

    if (!userId) {
        return res.status(401).send('User not authenticated');
    }

    try {
        // Check if userAddress and userPhoneNumber are empty in msuser table
        const userData = await executeQuery('SELECT userAddress, userPhoneNumber FROM msuser WHERE userID = ?', [userId]);
        const { userAddress, userPhoneNumber } = userData[0];

        if (!userAddress || !userPhoneNumber) {
            return res.redirect('/profile');
        }

        const { shippingAddress } = req.body;

        // Fetch productIDs from temporary_table
        const sqlProductIDs = `
            SELECT productID
            FROM temporary_table
            WHERE userID = ?
        `;
        const productIDResults = await executeQuery(sqlProductIDs, [userId]);
        const productIDs = productIDResults.map(result => result.productID);

        // Generate orderID (e.g., O001, O002, etc.)
        const orderIDResult = await executeQuery('SELECT MAX(orderID) AS maxOrderID FROM orderdetail');
        let orderID;
        if (orderIDResult[0].maxOrderID) {
            const maxOrderID = parseInt(orderIDResult[0].maxOrderID.slice(1)) + 1;
            orderID = `O${String(maxOrderID).padStart(3, '0')}`;
        } else {
            orderID = 'O001';
        }

        // Get current date
        const orderDate = new Date().toISOString().split('T')[0];

        // Insert into orderdetail table
        const insertPromises = productIDs.map(productID => {
            const sqlInsertOrderDetail = `
                INSERT INTO orderdetail (userID, productID, orderID, orderDate)
                VALUES (?, ?, ?, ?)
            `;
            return executeQuery(sqlInsertOrderDetail, [userId, productID, orderID, orderDate]);
        });

        await Promise.all(insertPromises);

        // Delete records from temporary_table
        const sqlDeleteTempTable = `
            DELETE FROM temporary_table
            WHERE userID = ?
        `;
        await executeQuery(sqlDeleteTempTable, [userId]);

        // Delete records from mscart
        const sqlDeleteCart = `
            DELETE FROM mscart
            WHERE userID = ?
        `;
        await executeQuery(sqlDeleteCart, [userId]);

        res.status(200).send('Order placed successfully');
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).send('Error placing order');
    }
});


app.post('/updateProfile', isAuthenticated, async (req, res) => {
    const userId = req.session.userId; // Assuming user ID is stored in session
    const { userPhoneNumber, userAddress } = req.body;

    try {
        await executeQuery('UPDATE msUser SET userPhoneNumber = ?, userAddress = ? WHERE userID = ?', [userPhoneNumber, userAddress, userId]);
        console.log('Success update profile')
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed');
        }
        res.clearCookie('connect.sid'); // or your session cookie name
        res.status(200).send('Logged out');
    });
});

app.post('/changePassword', isAuthenticated, async (req, res) => {
    const userId = req.session.userId;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
        return res.status(400).send('New password and confirmation do not match');
    }

    try {
        // Fetch the current password from the database
        const rows = await executeQuery('SELECT userPassword FROM msuser WHERE userID = ?', [userId]);
        const user = rows[0];

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Verify the current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.userPassword);

        if (!passwordMatch) {
            return res.status(400).send('Current password is incorrect');
        }

        // Hash the new password
        const salt = await bcrypt.genSalt();
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await executeQuery('UPDATE msuser SET userPassword = ? WHERE userID = ?', [hashedNewPassword, userId]);

        res.send('Password changed successfully');
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/deleteCartItem/:productID', isAuthenticated, async (req, res) => {
    const { userId } = req.session;
    const { productID } = req.params;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    try {
        // Delete the item from mscart
        const sql = 'DELETE FROM mscart WHERE userID = ? AND productID = ?';
        await executeQuery(sql, [userId, productID]);

        console.log(`Product with productID ${productID} deleted from mscart`);
        res.sendStatus(204); // Send 204 No Content if successful
    } catch (error) {
        console.error('Error deleting item from mscart:', error);
        res.status(500).json({ success: false, message: 'Error deleting item from mscart' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
