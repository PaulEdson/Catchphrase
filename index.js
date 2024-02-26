const express = require('express');
const { createServer } = require('node:http');
//needed for sendFile
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

//retrieving index.html
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

//retrieving canvas.js script file
app.get('/canvas.js', (req, res) => {
  res.sendFile(join(__dirname, 'canvas.js'));
});

//style sheet
app.get('/style.css', (req, res) =>{
  res.sendFile(join(__dirname, 'style.css'));
});

//logging connection and disconnection to terminal
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

//sending messages and images between clients
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });
    try{
      socket.on('image message', (imageData) => {
        console.log('image sent');
        io.emit('image message', imageData);
      });
    }
    catch(e){
      console.log(e.message);
    }
});

server.listen(8080, () => {
  console.log('server running at http://localhost:8080');
});

