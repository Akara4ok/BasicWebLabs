const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const bodyParser = require('body-parser');

const messages = [];
const socketName = new Map();

const addMesage = (name, msg, special) => {
  messages.push({name, msg, special});
  if(messages.length > 20){
    messages.shift(1);
  }
}

const findKeyByValue = (map, searchValue) => {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) {
      return key;
    }
  }
  return null;
}


app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function(req, res){
  res.send(messages);
});

app.post('/setName', function(req, res){
  if(!req?.body?.name){
    return res.status(400).json({"error": "Name is empty"});
  }
  if(findKeyByValue(socketName, req?.body?.name)){
    return res.status(400).send({"error": "User exists"});
  }
  return res.status(200).send({});
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (name, msg) => {
    io.emit('chat message', name, msg);
    addMesage(name, msg, false);
  });

  socket.on('add name', (name) => {
    socketName.set(socket.id, name);
  });

  socket.on('new user', (name) => {
    io.emit('new user', name + " connected!");
    addMesage("", name + " connected!", true);
  });

  socket.on('change name', (name, prevName) => {
    io.emit('change name', prevName + " is " + name + " now!");
    addMesage("", prevName + " is " + name + " now!", true);
  });

  socket.on('disconnect', () => {
    if(socketName.get(socket.id)){
      io.emit('disconnect user', socketName.get(socket.id) + " disconnected!");
      addMesage("", socketName.get(socket.id) + " disconnected!", true);
    }
    socketName.delete(socket.id);
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});