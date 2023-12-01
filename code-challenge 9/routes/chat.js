const express = require('express');
function ChatRouter(database) {
    var router = express.Router();

    // Rendering the main view where all the messages are shown
    router.get('/', async (req, res) => {
        // Fetch all the messages from the database
        let messages = await database.collections.messages.find({}).toArray();
        res.render('index', {messages: messages, currentUser: req.cookies.username || ''});
    });
    
    return router;
}

module.exports = ChatRouter;