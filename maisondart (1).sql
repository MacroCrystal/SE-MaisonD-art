-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 22 Jun 2024 pada 06.01
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maisondart`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `auctiondetail`
--

CREATE TABLE `auctiondetail` (
  `productID` varchar(10) DEFAULT NULL,
  `userID` varchar(10) DEFAULT NULL,
  `bidPrice` int(11) DEFAULT NULL,
  `bidDate` date DEFAULT NULL,
  `auctionID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `bank`
--

CREATE TABLE `bank` (
  `bankName` varchar(50) DEFAULT NULL,
  `bankBalance` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bank`
--

INSERT INTO `bank` (`bankName`, `bankBalance`) VALUES
('Bank', 10000000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `msartist`
--

CREATE TABLE `msartist` (
  `ArtistID` varchar(10) DEFAULT NULL,
  `ArtistName` varchar(50) DEFAULT NULL,
  `ArtistCity` varchar(50) DEFAULT NULL,
  `ArtistDescription` varchar(255) DEFAULT NULL,
  `ArtistImage` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `msartist`
--

INSERT INTO `msartist` (`ArtistID`, `ArtistName`, `ArtistCity`, `ArtistDescription`, `ArtistImage`) VALUES
('S001', 'Cefli Art Store', 'Jakarta Barat', 'Cefli Art Store is a hub for contemporary art, offering a vibrant collection of modern masterpieces in Jakarta Barat. Known for innovative pieces that captivate and inspire art enthusiasts.', 0x68747470733a2f2f7777772e6d61737465726f696c7061696e74696e672e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031382f30312f41646f626553746f636b5f3137393436363833392d31303234783638332e6a706567),
('S002', 'Rayean Gallery', 'Jakarta Barat', 'Rayean Gallery, nestled in Jakarta Barat, showcases exquisite artworks that blend tradition with modernity. A destination for art lovers seeking unique, thought-provoking pieces that tell captivating stories.', 0x68747470733a2f2f6437686674786469767878766d2e636c6f756466726f6e742e6e65742f3f6865696768743d353830267175616c6974793d383026726573697a655f746f3d66696c6c267372633d687474707325334125324625324661727473792d6d656469612d75706c6f6164732e73332e616d617a6f6e6177732e636f6d253246617466534f336c47736548484a4e476a333144646f772532353246637573746f6d2d437573746f6d5f53697a655f5f5f74686f6d61732d686f65706b65722d77696c6c656d2d64652d6b6f6f6e696e672d696e2d6869732d656173742d68616d70746f6e2d73747564696f2d313939372e6a70672677696474683d383639),
('S003', 'Loefi Hands', 'Jakarta Barat', 'Loefi Hands, located in Jakarta Barat, celebrates artistic craftsmanship with a diverse range of sculptures and paintings. Each piece reflects meticulous attention to detail and a passion for artistic excellence.', 0x68747470733a2f2f7777772e696e6b737465722e636f6d2f77702d636f6e74656e742f75706c6f6164732f4368617261637465726973746963732d6f662d616e2d6172746973742e6a7067);

-- --------------------------------------------------------

--
-- Struktur dari tabel `msauction`
--

CREATE TABLE `msauction` (
  `auctionID` varchar(10) DEFAULT NULL,
  `productID` varchar(10) DEFAULT NULL,
  `auctionEndDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `msauction`
--

INSERT INTO `msauction` (`auctionID`, `productID`, `auctionEndDate`) VALUES
('AU001', 'P001', '2024-06-23'),
('AU001', 'P003', '2024-06-23'),
('AU001', 'P004', '2024-06-23');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mscart`
--

CREATE TABLE `mscart` (
  `UserID` varchar(10) DEFAULT NULL,
  `ProductID` varchar(10) DEFAULT NULL,
  `ArtistID` varchar(10) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `mscategory`
--

CREATE TABLE `mscategory` (
  `CategoryID` varchar(10) DEFAULT NULL,
  `CategoryName` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `mscategory`
--

INSERT INTO `mscategory` (`CategoryID`, `CategoryName`) VALUES
('C1', 'Painting'),
('C2', 'Literature'),
('C3', 'Sculpture');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mspaymenttype`
--

CREATE TABLE `mspaymenttype` (
  `paymentTypeID` varchar(10) DEFAULT NULL,
  `paymentTypeName` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `mspaymenttype`
--

INSERT INTO `mspaymenttype` (`paymentTypeID`, `paymentTypeName`) VALUES
('PT001', 'Cash on Delivery'),
('PT002', 'Virtual Account BCA');

-- --------------------------------------------------------

--
-- Struktur dari tabel `msproduct`
--

CREATE TABLE `msproduct` (
  `StoreID` varchar(10) DEFAULT NULL,
  `ProductID` varchar(10) DEFAULT NULL,
  `ProductName` varchar(50) DEFAULT NULL,
  `CategoryID` varchar(10) DEFAULT NULL,
  `ProductPrice` int(11) DEFAULT NULL,
  `ProductStock` int(11) DEFAULT NULL,
  `ProductDescription` varchar(255) DEFAULT NULL,
  `ProductImage` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `msproduct`
--

INSERT INTO `msproduct` (`StoreID`, `ProductID`, `ProductName`, `CategoryID`, `ProductPrice`, `ProductStock`, `ProductDescription`, `ProductImage`) VALUES
('S001', 'P001', 'Ethereal Symphony', 'C1', 1500000, 1, 'Vibrant colors dance, evoking celestial melodies, orchestrating a mesmerizing harmony on the canvas of the mind\'s eye.', 0x68747470733a2f2f352e696d696d672e636f6d2f64617461352f53482f4f482f4d592d35393530313231302f612d3332372d353030783530302e6a7067),
('S001', 'P002', 'Whispering Dreams', 'C2', 800000, 1, 'Pages weave tales, whispering dreams into the reader\'s soul, crafting worlds where imagination roams free, boundless and infinite.', 0x68747470733a2f2f696d672e6672656570696b2e636f6d2f667265652d766563746f722f61627374726163742d656c6567616e742d77696e7465722d626f6f6b2d636f7665725f32332d323134383739383734352e6a70673f73697a653d333338266578743d6a70672667613d4741312e312e313134313333353530372e313731373937373630302673656d743d6169735f75736572),
('S001', 'P003', 'Sands of Time', 'C3', 2200000, 1, 'Carved essence captures fleeting moments, frozen in eternal sand, telling tales of time\'s passage, shaping history in silence.', 0x68747470733a2f2f692e70696e696d672e636f6d2f31323030782f64652f34342f66362f64653434663639663939356563356464346163303133356366326363336364312e6a7067),
('S001', 'P004', 'Celestial Melody', 'C1', 1700000, 1, 'Brush strokes choreograph a cosmic dance, melodies painted in hues, weaving constellations, singing the song of the universe.', 0x68747470733a2f2f7777772e6672616e6b6c696e61727473747564696f2e636f6d2e61752f63646e2f73686f702f66696c65732f54757271756f6973652d4d6f6f6e2d313230636d2d782d313030636d2d4d616c742d5465616c2d54657874757265642d41627374726163742d5061696e74696e672d41627374726163742d4672616e6b6f2d6172742d6672616e6b6f2d6172746973742d345f32303438782e6a70673f763d31363838323433333835),
('S001', 'P005', 'Echoes of Eternity', 'C2', 900000, 1, 'Words echo through time, etching eternity in the mind, revealing the essence of existence in their timeless cadence.', 0x68747470733a2f2f7374322e6465706f73697470686f746f732e636f6d2f313035353038392f353932332f762f3435302f6465706f73697470686f746f735f35393233323231352d73746f636b2d696c6c757374726174696f6e2d6d6f6465726e2d766563746f722d626f6f6b2d636f7665722d74656d706c6174652e6a7067),
('S001', 'P006', 'Sculpted Serenity', 'C3', 2300000, 1, 'Stone whispers tranquility, sculpted into serene, timeless forms, inviting contemplation amidst the chaos of existence, embodying inner peace.', 0x68747470733a2f2f6d2e6d656469612d616d617a6f6e2e636f6d2f696d616765732f492f373132324132533643584c2e5f41435f5546313030302c313030305f514c38305f2e6a7067),
('S001', 'P007', 'Midnight Sonata', 'C1', 1600000, 1, 'Darkness illuminated by notes, a sonata painted in stars, composing nocturnal symphonies that awaken the soul to beauty.', 0x68747470733a2f2f63646e31312e626967636f6d6d657263652e636f6d2f732d783439706f2f696d616765732f7374656e63696c2f3135303078313530302f70726f64756374732f3130353434372f3234373236352f313638313232353934363139335f494d472d313432385f5f32393831382e313638363939373031352e6a70673f633d3226696d6279706173733d6f6e),
('S001', 'P008', 'Pages of Destiny', 'C2', 850000, 1, 'Destiny unfolds in the turning of each eloquent page, revealing the tapestry of life\'s intricate design.', 0x68747470733a2f2f7374322e6465706f73697470686f746f732e636f6d2f313035353038392f353837382f762f3435302f6465706f73697470686f746f735f35383738303638312d73746f636b2d696c6c757374726174696f6e2d6d6f6465726e2d766563746f722d626f6f6b2d636f7665722d74656d706c6174652e6a7067),
('S001', 'P009', 'Harmony in Stone', 'C3', 2400000, 1, 'Stones harmonize, sculpted into symphonies of nature\'s silent songs, resonating with the rhythms of the earth.', 0x68747470733a2f2f69302e77702e636f6d2f7777772e736f686f67616c6c65726965732e6e65742f77702d636f6e74656e742f75706c6f6164732f323032312f30322f4d432d44616e636572732d352e6a70673f6669743d31303830253243313038302673736c3d31),
('S002', 'P010', 'Frozen Embrace', 'C1', 2000000, 1, 'Ice captures love\'s warmth, an eternal embrace in frozen time, immortalizing passion in crystalline perfection.', 0x68747470733a2f2f64316565336f616a3562357565682e636c6f756466726f6e742e6e65742f7468756d62732f363830784155544f5f6f726967696e616c5f61727469636c655f323032315f30375f363065633466316235643536362e6a706567),
('S002', 'P011', 'Glimmering Horizons', 'C2', 1400000, 1, 'Horizons shimmer, painted in hues of dawn\'s golden promise, beckoning to distant realms of possibility and hope.', 0x68747470733a2f2f696d672e6672656570696b2e636f6d2f7072656d69756d2d766563746f722f766563746f722d6d6f6465726e2d626f6f6b2d636f7665722d64657369676e2d636f6d70616e792d616e6e75616c2d7265706f72745f3831323437322d3539352e6a7067),
('S002', 'P012', 'Whispers of Wisdom', 'C3', 750000, 1, 'Wisdom\'s whispers echo through the ages in written verses, guiding seekers on the path of enlightenment and understanding.', 0x68747470733a2f2f7777772e6369656c6f2e636f2e7a612f3134393439392d686f6d655f64656661756c742f6d6574616c2d7363756c70747572652d6669677572652e6a7067),
('S002', 'P013', 'Dancing Shadows', 'C1', 1300000, 1, 'Shadows dance, painting tales of light and darkness entwined, revealing the beauty found within life\'s contrasts.', 0x68747470733a2f2f726f79616c746861696172742e636f6d2f77702d636f6e74656e742f75706c6f6164732f323032302f30392f6275792d61627374726163742d6172742d6f6e6c696e652d37353978313032342e6a7067),
('S002', 'P014', 'Echoes of the Ancients', 'C2', 2100000, 1, 'Ancient whispers carved in stone, echoing tales of bygone eras, preserving the legacy of civilizations long past.', 0x68747470733a2f2f692e70696e696d672e636f6d2f373336782f37312f62652f64372f37316265643765323238353563333033303962343765653961333038333030312e6a7067),
('S002', 'P015', 'Infinite Canvas', 'C3', 850000, 1, 'Words paint infinite realms upon the canvas of imagination, where dreams take flight and stories never end.', 0x68747470733a2f2f63646e32302e70616d6f6e6f2e636f6d2f702f732f312f332f313331393834395f7161306d7036683979702f6d6f6465726e2d6f7267616e69632d636572616d69632d6172742d7363756c70747572652d62792d6d697269616d2d6361737469676c69612e6a7067),
('S002', 'P016', 'Sculpted Whispers', 'C1', 2250000, 1, 'Whispers sculpted in marble, secrets shared in silent stone, embodying the timeless truths of human existence.', 0x68747470733a2f2f6431366b6436677a616c6b6f67622e636c6f756466726f6e742e6e65742f6d6167617a696e655f696d616765732f54682543332541396f646f72652d526f7573736561752d4d6172652d61752d437225433325413970757363756c652d632e2d313835302e6a7067),
('S002', 'P017', 'Serenade of Colors', 'C2', 1200000, 1, 'Colors serenade the eyes, orchestrating emotions in vivid hues, inviting viewers to immerse themselves in the artist\'s palette.', 0x68747470733a2f2f6968312e726564627562626c652e6e65742f696d6167652e313838393639393533362e373935332f686a2c373530782d7061642c37353078313030302c6638663866382e6a7067),
('S002', 'P018', 'Chronicles of Destiny', 'C3', 950000, 1, 'Destiny\'s saga unfolds, chronicled in pages of fate\'s embrace, revealing the interplay of choice and consequence.', 0x68747470733a2f2f6d2e6d656469612d616d617a6f6e2e636f6d2f696d616765732f492f36316c5943315863534f4c2e5f41435f55463839342c313030305f514c38305f2e6a7067),
('S003', 'P019', 'Whispering Meadows', 'C1', 1250000, 1, 'A tranquil landscape, where whispers of nature dance amidst swaying grasses, inviting serenity and peace to weary souls.', 0x68747470733a2f2f7777772e616e746971756573616e64746865617274732e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031372f30362f68656164655f6a756e676c655f6f7263686964732e6a7067),
('S003', 'P020', 'Enchanted Echoes', 'C2', 850000, 1, 'Pages alive with tales of enchantment, weaving dreams and fantasies into the fabric of reality, beckoning to wanderers of imagination.', 0x68747470733a2f2f696d616765732e74656d706c6174652e6e65742f32383030312f446f776e6c6f61642d56696e746167652d426f6f6b636f7665722d74656d706c6174652e6a7067),
('S003', 'P021', 'Carved Harmony', 'C3', 2300000, 1, 'Stone shaped into symphonies, sculpted with care and precision, resonating with the harmony of the universe, calming restless spirits.', 0x68747470733a2f2f6172747061726b2e636f6d2e61752f77702d636f6e74656e742f75706c6f6164732f323032322f31322f546f7363612d3630783532783135636d2d363030783630302e6a7067),
('S003', 'P022', 'Rainbow Cascade', 'C1', 1800000, 1, 'Colors cascade like a waterfall, blending and merging in a vibrant dance, painting life with the hues of joy.', 0x68747470733a2f2f6173736574732e626c75657468756d622e636f6d2e61752f6d656469612f696d6167652f66696c6c2f3736362f3736362f65794a705a434936496e5677624739685a484d7662476c7a64476c755a7938304d5467794e54677662576c75623238746257467a615767745a6e4a686257566b4c5731765a47567962693168596e4e30636d466a6443316859334a3562476c6a4c584268615735306157356e4c586470644767745a3239735a4331735a57466d4c5739754c57466a636e6c7361574d74634746775a5849746447686c4c573135633352705979316b636d5668625331696248566c64476831625749744f446b354d433571634763694c434a7a644739795957646c496a6f6963335276636d55694c434a745a5852685a4746305953493665794a6d6157786c626d46745a534936496d3170626d39764c57316863326c6f4c575a795957316c5a4331746232526c636d347459574a7a64484a685933517459574e79655778705979317759576c7564476c755a7931336158526f4c57647662475174624756685a6931766269316859334a3562476c6a4c584268634756794c58526f5a53317465584e3061574d745a484a6c59573074596d78315a58526f645731694c5467354f544175616e426e4969776962576c745a5639306558426c496a7075645778736658303f7369676e61747572653d36386435633734643761366431393337623838313132313064643035336135656163376330626439616335336666386262383637363737653362383363363631),
('S003', 'P023', 'Whispers of the Woods', 'C2', 950000, 1, 'Secrets of the forest, whispered through ancient trees, weaving tales of magic and mystery, stirring the imagination.', 0x68747470733a2f2f692e70696e696d672e636f6d2f6f726967696e616c732f38622f62622f33662f38626262336634613664386338336534353730356531653330303536636561342e6a7067),
('S003', 'P024', 'Stone Serenade', 'C3', 2150000, 1, 'Melodies sculpted in silence, echoing through solid rock, telling stories of love and longing, frozen in timeless beauty.', 0x68747470733a2f2f7777772e677265636172696465612e636f6d2f333538362d6c617267655f64656661756c742f6d6f6465726e2d7363756c70747572652d6c6f6e67696e672e6a7067),
('S003', 'P025', 'Dreamscape Symphony', 'C1', 1400000, 1, 'Dreams composed in paint, swirling and dancing across the canvas, orchestrating a symphony of imagination and wonder.', 0x68747470733a2f2f696d616765732e736161746368696172742e636f6d2f736161746368692f313833373434362f6172742f383831333531392f373837363931322d47584655435957532d372e6a7067),
('S003', 'P026', 'Echoes of Infinity', 'C2', 800000, 1, 'Words echo through eternity, stretching beyond the limits of time, resonating with the boundless expanse of the cosmos.', 0x68747470733a2f2f7777772e637573746f6d7363656e652e636f2f77702d636f6e74656e742f75706c6f6164732f323032302f31312f4f6c645f426f6f6b5f436f7665725f4d6f636b75702d7468756d626e61696c2d312e6a7067),
('S003', 'P027', 'Eternal Embrace', 'C3', 2500000, 1, 'Love immortalized in stone, entwined in an eternal embrace, defying the passage of time with everlasting devotion.', 0x68747470733a2f2f63757261746f7269616c2e622d63646e2e6e65742f323032312f30392f4c574533342d4669677572655f31322d6d61696e2e6a7067);

-- --------------------------------------------------------

--
-- Struktur dari tabel `msshippingtype`
--

CREATE TABLE `msshippingtype` (
  `shippingTypeID` varchar(10) DEFAULT NULL,
  `shippingTypeName` varchar(50) DEFAULT NULL,
  `shippingTypePrice` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `msuser`
--

CREATE TABLE `msuser` (
  `UserID` varchar(10) NOT NULL CHECK (`UserID` regexp '^CU[0-9]{3}$'),
  `UserName` varchar(50) DEFAULT NULL,
  `UserAddress` varchar(255) DEFAULT NULL,
  `UserPhoneNumber` varchar(20) DEFAULT NULL,
  `UserEmail` varchar(50) DEFAULT NULL,
  `UserPassword` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `msuser`
--

INSERT INTO `msuser` (`UserID`, `UserName`, `UserAddress`, `UserPhoneNumber`, `UserEmail`, `UserPassword`) VALUES
('CU490', 'broooooooooooo', 'hahahha', '1123', 'bro@gmail.com', '$2b$10$9WvQQIIvx8eB8oXsDXkmGOTvvXela6ZYd/6vdHZ4MvNW2kpFBP9iS'),
('CU499', 'Anton', NULL, NULL, 'antony@gmail.com', '$2b$10$DfcQb1wHP/Ax3QDmkNOCDuIkx36XI..7jYO1UvjyjydfnkHlCe2EO'),
('CU519', 'yohanes imanuel', 'Tanjung Duren Barat', '087880879147', 'yohanes@gmail.com', '$2b$10$zzCJA.2EHNmjWI6YIphrLufq26ONL3YA53kK/iG/KQsUS3wpSeit6'),
('CU531', 'fanes', NULL, NULL, 'fanes@gmail.com', '$2b$10$PXLVB9yE5UGAdNaq/XeNiuOzx/WY7E.0srFSXE.1k/CV0VzaIbCVe'),
('CU693', 'joni', NULL, NULL, 'jonibyur@gmail.com', '$2b$10$dLvP8kKtlZjD0PZwbryEGOM5ZMl48Tv8qPBSxChd6k0gGfnWyCgZu'),
('CU800', 'jisung', NULL, NULL, 'jisung@gmail.com', '$2b$10$rx8L6TZAt2wrQ4c/iGql2OYofnNMbtHtRG4Sx6gVXM/J6C9M7Z9y6'),
('CU924', 'Joseph', NULL, NULL, 'joseph@gmail.com', '$2b$10$/aFYGzmlfHxtP/aqashRmOlcapA1gf3VzJp/nG5zIW.h6EFxbVJ7e'),
('CU943', 'Hizkia Imanuel', 'Tanjung Duren Barat', '123456789', 'hizkia@gmail.com', '$2b$10$lpY1M54HF8c1tAvwN5ocu.ypGm35CE5BekN8w/yjoFfB7JiVeLU7a');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orderdetail`
--

CREATE TABLE `orderdetail` (
  `orderID` varchar(10) DEFAULT NULL,
  `userID` varchar(10) DEFAULT NULL,
  `productID` varchar(10) DEFAULT NULL,
  `orderDate` date DEFAULT NULL,
  `orderStatus` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `temporary_table`
--

CREATE TABLE `temporary_table` (
  `userID` varchar(10) DEFAULT NULL,
  `artistID` varchar(10) DEFAULT NULL,
  `productID` varchar(10) DEFAULT NULL,
  `productName` varchar(50) DEFAULT NULL,
  `productDesc` varchar(255) DEFAULT NULL,
  `productPrice` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `msuser`
--
ALTER TABLE `msuser`
  ADD PRIMARY KEY (`UserID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
