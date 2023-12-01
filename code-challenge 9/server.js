const DatabaseService = require('./database/database.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// Step 1: Import new router, socket.io, http, cookie-parser, and ChatService
const ChatRouter = require('./routes/chat.js');
const { Server } = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');
const ChatService = require('./chat.js');

async function setupServer() {

    const PORT = 3000;
    const app = express();
    // Step 2: Setup http and socket.io servers
    const server = http.createServer(app);
    const io = new Server(server);

    app.use(bodyParser());
    // Step 3: Setup cookie-parser
    app.use(cookieParser());
    
    app.set('view engine', 'ejs');
    const database = new DatabaseService.Database();
    await database.setup();
    // Step 4: Setup Chat service
    const chatService = new ChatService(database, io);
    chatService.setup();
    // Step 5: Setup chat router
    app.use('/', ChatRouter(database));

    server.listen(PORT, () => {
        console.log(`Server Started on port ${PORT}`);
    });

    app.use(express.static(path.join(__dirname, 'public')));

    process.on('SIGTERM', () => {
        app.close(() => {
            database.client.close();
        });
    });
}

setupServer();