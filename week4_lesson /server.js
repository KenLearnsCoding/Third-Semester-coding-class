// Documentation: https://nodejs.org/en/docs/guides/getting-started-guide
const http = require('http');	// Importing a module for creating the server
const { json } = require('node:stream/consumers');
const hostname = '127.0.0.1';	// Set the IP/hostname for accessing the server
const port = 3000;	// Set the port for accessing the server

const server = http.createServer((req, res) => {	// Set the servers entry point function
  res.statusCode = 200;	// Set the responses HTTP Status Code
  res.setHeader('Content-Type', 'application/json');	// Set the responses header
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  let response = {
    name: "jane",
    age: 24
  };

  res.end(JSON.stringify(response));
});

server.listen(port, hostname, () => { // Tell the server to start listing on that port and hostname, with a callback when its ready
  console.log(`Server running at http://${hostname}:${port}/`);
});	
