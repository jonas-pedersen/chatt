const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public' + '/index.html')
})

// IO on connection
io.on('connection', (socket) => {

  // Emitterar ut ett meddelande till alla uppkopplade att någon ny kopplat upp sig
  // Meddelandet skickas ej ut till personen som just kopplade upp sig.
  socket.broadcast.emit('kopplat upp', 'En användare har kopplat upp sig på chatten')
  console.log('a user connected')
  

  // Lyssnar på när händelsen 'chat message' emitteras ut ifrån en klient.
  // Skriver då ut ut det meddelandet här i terminalen.
  socket.on('chat message', (message) => {
    console.log('message: ' + message)
  })

  // Lyssnar på när händelsen "chat message" emitteras ut ifrån någon klient. 
  // Servern emiterar då ut det meddelandet till alla. 
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
  
  // Skriver ut i terminalen när någon har disconnectat. 
  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

  // Lyssnar när någon användare diconnectar. 
  //Emitterar då ut ett meddelande med händelse-taggen "kopplat av"
  socket.on('disconnect', () => {
    io.emit('kopplat av', 'En användare har kopplat ifrån')
  })


})


// Anger vilken port som servern ska lyssna på. Skriver även ut den porten i terminalen.
http.listen(port, () => {
  console.log(`listening on *: ${port}`)
})