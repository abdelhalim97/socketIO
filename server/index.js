const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const { RateLimiterMemory } = require('rate-limiter-flexible');
const mongoose = require('mongoose')

app.use(cors())

const rateLimiter = new RateLimiterMemory(
    {
        points: 2, // 5 points
        duration: 10, // per second
    });

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})
io.on("connection", (socket) => {
    console.log('socket connected');
    socket.on('send_message', async (data) => {
        try {
            if (data.message === 'test') await rateLimiter.consume(socket.handshake.address)
            socket.broadcast.emit('receive_message', data)
        } catch (rejRes) {
            console.log(rejRes.msBeforeNext);
            socket.emit('blocked', { 'retry-ms': rejRes.msBeforeNext });
        }
    })
})

mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => server.listen(3001, () => {
        console.log('server is running at 3001');
    }))
    .catch(error => handleError(error));

