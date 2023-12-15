// Imports
const DatabaseService = require('./database/database.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PinsRouter = require('./routes/article.js');
const AuthRouter = require('./routes/auth.js');
const ArticleRouter = require('./routes/article.js');


async function setupServer() {
    // Express Setup
    const PORT = 2000;
    const app = express();
    app.use(bodyParser());
    
    // Setting the view engine to render ejs templates
    app.set('view engine', 'ejs');

    app.set('views', path.join(__dirname, 'views'));

    // we have to use this line to give the access to css and assets
    app.use(express.static(path.join(__dirname, 'views')));

    const database = new DatabaseService.Database();
    await database.setup();

    // The next 2 lines are for the authentication. 
    app.use('/', AuthRouter(database));
    app.use('/', ArticleRouter(database));

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