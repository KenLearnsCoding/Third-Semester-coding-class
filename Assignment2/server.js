// Imports
const DatabaseService = require('./database/database.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PinsRouter = require('./routes/article.js');
const AuthRouter = require('./routes/auth.js');


async function setupServer() {
    // Express Setup
    const PORT = 3000;
    const app = express();
    app.use(bodyParser());
    
    // Setting the view engine to render ejs templates
    app.set('view engine', 'ejs');

    app.set('views', path.join(__dirname, 'views'));

    // we have to use this line to give the access to css and assets
    app.use(express.static(path.join(__dirname, 'views')));

    const database = new DatabaseService.Database();
    await database.setup();

    // line 27-61 are the routes of the pages for non-registered or non-sign in users
    app.get('/', async (req, res) => {
        const style = "css/home.css";
        res.render('home', { title: 'Home', style: style } );
    
    });
    
    app.get('/purchase', async (re, res) => {
        const style = "css/purchase.css";
        const total_amount_buy = '';
        res.render('purchase', {
            title: 'Purchase', 
            price: 'price', 
            style: style, 
            totalBuy: total_amount_buy
        });
    
    });
    
    app.get('/market', async (re, res) => {
        const style = "./css/market.css";
        res.render('market', {title: 'Market', style: style});
    });
    
    app.get('/learn', async (re, res) => {
        const style = "./css/learn.css";
        const coin = "";
        const coin_explanation = "";
        res.render('learn', {
            title: 'Learn',
            coin: coin, 
            coin_explanation: coin_explanation, 
            style: style
        });
    });

    app.get('/profile', async (re, res) => {
        const style = "css/profile.css";
        res.render('profile', {title: 'Dash Board', style: style});  
    });

    // The next 2 lines are for the authentication. 
    app.use('/', AuthRouter(database));
    app.use('/article', PinsRouter(database));

    app.listen(PORT, () => {
        console.log(`Server Started on port ${PORT}`);
    });

    app.use(express.static(path.join(__dirname, 'public')));

    process.on('SIGTERM', () => {
        app.close(() => {
            // If the app is shutdown we close the database connection
            database.client.close();
        });
    });
}

setupServer();