// the payment popup
document.addEventListener('DOMContentLoaded', function () {
    const buySellSelect = document.getElementById('buy_sell');
    const buyBox = document.getElementById('buy_box');
    const sellBox = document.getElementById('sell_box');
    const buyButton = document.querySelector('.buy');
    const sellButton = document.querySelector('.sell');

    buySellSelect.addEventListener('change', function () {
        const selectedOption = buySellSelect.value;

         // Hide both boxes by default
         buyBox.style.display = 'none';
         sellBox.style.display = 'none';
 
         // Show the selected box
         if (selectedOption === 'buy') {
             buyBox.style.display = 'flex';
         } else if (selectedOption === 'sell') {
             sellBox.style.display = 'flex';
             document.getElementById('bn1').style.display = 'flex';
         }
    });

    // Add event listener for the Buy button
    buyButton.addEventListener('click', function () {
        // Reset the input fields to default values
        resetInputFields(buyBox);

        // Display an announcement
        displayAnnouncement('Buy action done!');
    });

    // Add event listener for the Sell button
    sellButton.addEventListener('click', function () {
        // Reset the input fields to default values
        resetInputFields(sellBox);

        // Display an announcement
        displayAnnouncement('Sell action done!');
    });

    // Function to reset input fields to default values
    function resetInputFields(box) {
        const inputField = box.querySelector('input[type="number"]');
        inputField.value = ''; // Set the default value as needed
    }

    // Function to display an announcement
    function displayAnnouncement(message) {
        alert(message); // You can replace this with your own announcement UI
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const connectWalletButton = document.getElementById('connect_wallet1');
    const dashboardButton = document.getElementById('connect_wallet2');
    const walletConnectSection = document.querySelector('.wallet_connect');
    const confirmButton = document.getElementById('confirmButton');
    const signOutButton = document.getElementById('signOutButton');

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // Show/hide the "Dashboard" and "Connect Wallet" buttons based on login status
    if (isLoggedIn) {
        dashboardButton.style.display = 'flex';
        connectWalletButton.style.display = 'none';
    } else {
        dashboardButton.style.display = 'none';
        connectWalletButton.style.display = 'flex';
    }

    connectWalletButton.addEventListener('click', () => {
        // Show the wallet connect section
        walletConnectSection.style.display = 'flex';

    });

    confirmButton.addEventListener('click', () => {
        // Hide the wallet connect section
        walletConnectSection.style.display = 'none';
        connectWalletButton.style.display = 'none';

        // Show the "Dashboard" button
        dashboardButton.style.display = 'flex';

        window.location.href = 'dashboard';

        // Set the login status in local storage
        localStorage.setItem('isLoggedIn', 'true');
    });

    signOutButton.addEventListener('click', (event) => {
        // Prevent the default behavior of the link (assuming it's a real link)
        event.preventDefault();

        // Log out functionality
        logout();

        // Remove the login status from local storage
        localStorage.removeItem('isLoggedIn');

        // Hide the "Dashboard" button
        dashboardButton.style.display = 'none';

        // Show the "Connect Wallet" button
        connectWalletButton.style.display = 'flex';
    });

    function logout() {
    
        // After logout, redirect to the home page or any other appropriate page
        window.location.href = '/';
    }
    
});