 const express = require('express')
   , fs = require('fs')
   , app = express()
   , server = require('http').createServer(app)
   , io = require('socket.io').listen(server)
 ;

 let data = {}

 fs.readFile('data.json', 'utf8', function (err, read) {
  if (err) throw err;
  data = JSON.parse(read);
  console.log(data)
});

function zeroCounter () {
  for (sector in sectors ){
    sector.counter = 0;
  }
}



 app.get("/", function(req, res){
 });

 io.sockets.on('connection', function (client) {
   client.emit('loadData', data);
   console.log('servidor ouvindo')
   client.on('connected', function () {
     console.log('Cliente conectado')
     client.broadcast.emit('loadData', data);
   });
   client.on('addSector', function (sector) {
     let update = sector
     client.broadcast.emit('newSector', update);
   });
   client.on('next', function (next) {
     let nextClient = {
       code: next,
       counter: 0
     }
     data.call.push(nextClient)
     client.broadcast.emit('callNext', data);
   });
   client.on('save', function (data) {
     zeroCounter();
     fs.writeFile("data.json", JSON.stringify(data), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Arquivo atualizado!");
    });
  })
 });

 server.listen(3000, function(){
   console.log("Server running");
 });
