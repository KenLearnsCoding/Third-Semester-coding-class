const fs = require('fs');

class ChatService {
    database = null; 
    io = null; 
    bannedWords = null;
    
    constructor(database, io) {
        this.database = database; 
        this.io = io; 
        this.bannedWords = JSON.parse(fs.readFileSync('banned_words.json'));
    }

    setup() {
        this.io.on('connection', (socket) => {

            // data comes from main.js
            socket.on('newMessage', async (data) => {
                console.log(data);
                // Insert data to MongoDB only if no banned words are found
                await this.database.collections.messages.insertOne(data);
                this.io.emit('newMessage', data);
            });
            
            socket.on('typing', async (data) => {
                this.io.emit('typing', { status: data.status, id: socket.id });
            });
        });
    }
    
}

module.exports = ChatService;
