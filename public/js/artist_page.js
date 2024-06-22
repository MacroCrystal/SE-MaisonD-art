document.addEventListener("DOMContentLoaded", function() {
    var followBtn = document.getElementById("followBtn");
    followBtn.addEventListener("click", function() {
        if (this.textContent === "+ Follow") {
            this.textContent = "Unfollow"; // Change text content to "Unfollow"
            this.style.backgroundColor = "#F4EDE8";
            this.style.color = "#370C0C"; // Change text color to #370C0C
        } else {
            this.textContent = "+ Follow"; // Change text content back to "Follow"
            this.style.backgroundColor = "transparent"; // Reset background color
            this.style.color = "#F4EDE8"; // Reset text color
        }
    });
});

