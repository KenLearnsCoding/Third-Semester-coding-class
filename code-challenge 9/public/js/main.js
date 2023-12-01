var socket = io();
var socketID = null;
var sendButton = null;
var input = null;
var messages = null;
var typing = null;
var username = getUsername();
setup();
const bannedWords = JSON.parse(fs.readFileSync('./bannedWords.json', 'utf-8'));


function getUsername() {
    // Set Cookie Function Source: https://www.w3schools.com/js/js_cookies.asp
    function setUsernameCookie(username) {
        const d = new Date();
        d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = `username=${username}; ${expires};`;
    }
    // Get Cookie Function Source: https://www.w3schools.com/js/js_cookies.asp
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    let username = getCookie('username');
    if (!username) {
        username = prompt("Please enter your name");
        setUsernameCookie(username);
        window.location.reload();
    }
    // Set the username in the header
    document.getElementById('loggedInUsername').innerText = username;
    return username;
}

function setup() {
    // Grab a reference to all UI elements we will need for the application
    // sendButton, input, typing, messages
    if(!sendButton) {
        sendButton = document.getElementById('newMessageSendButton');
        sendButton.addEventListener('click', sendNewMessage);
    }

    if(!input) {
        input = document.getElementById('newMessageInput');
        input.addEventListener('input', typingMessage);
    }

    if(!typing) {
        typing = document.getElementById('typingStatus');

    }

    if(!messages) {
        messages = document.getElementById('messages');
    }
}

function sendNewMessage() {
    // pass the username from the cookie to the server
    socket.emit('newMessage', { sender: username,content: input.value });
    input.value = "";
}

var currentTypingTimeout = null;

function typingMessage() {
    if (currentTypingTimeout) {
        clearTimeout(currentTypingTimeout);
        currentTypingTimeout = null;
    }

    if (input.value === "") {
        sendButton.disabled = true;
        socket.emit('typing', {username, status: false});
        return
    }else {
        sendButton.disabled = false;
        socket.emit('typing', {username, status: true});
    }

    currentTypingTimeout = setTimeout(() => {
        socket.emit('typing', {username, status: false});
    }, 500);

    
}

// Setup socket io listeners

// Connect to the socket server
socket.on("connect", () => {
    socketID = socket.id;
});

// Setup typing listener
socket.on('typing', (data) => {
    if(data.id === socketID) { return; }
    if (data.status) {
        typing.innerText = "Someone is typing...";
    } else {
        typing.innerText = '';
    }
});

// Setup newMessage listener
socket.on('newMessage', (data) => {
   messages.insertAdjacentHTML('beforeend', `
    <li class='col-6 message
        ${data.sender.toLowerCase() === username.toLowerCase() ? 'ms-auto messages-user-you' : 'messages-user-them'}'
    >
        <p class="content">${data.content}</p>
        <span class="sender">${data.sender}</span>
    </li>
   `);
});



