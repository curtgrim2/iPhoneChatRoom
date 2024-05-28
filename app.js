var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();
app.use(express.static('public', {
  setHeaders: (res, path, stat) => { //Allows CSS to conenct to HTML file
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');


app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


var name;

var totalclients = 0;
const defaultpropic = fs.readFileSync("C:\\Users\\dgrea\\TestChatRoom\\public\\propic3.png");

io.on('connection', (socket) => {
  ++totalclients;
  //var phonenumber = "609-" + (Math.floor(Math.random()*900)+100) +"-" + (Math.floor(Math.random()*8999)+1001);
  socket.on('joining msg', (username) => {
    console.log(username);
    console.log(totalclients);
  	name = username;
    
    //io.emit('chat message', `---${phonenumber} joined the chat---`);

    io.emit('getPropic1',{image:defaultpropic.toString('base64'),totalclients:totalclients});
    io.emit('start time','Testo'); //calls out to the client to execute socket.on (?)
  });


  
  
  socket.on('disconnect', () => { //triggers when page closes/refreshes
    totalclients--;
    console.log('user disconnected');

    //io.emit('chat message', `---${name} left the chat---`);   
  });


  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
  });


  socket.on('defaultpropic', () => {
   // socket.emit('getPropic1',{image:defaultpropic.toString('base64')});
  });
});

server.listen(3000, () => {
  console.log('Server listening on localhost:3000');
});
