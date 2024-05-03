const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();

const route = require('./route.js');
const { addUser, findUser, getRoomUsers, removeUser } = require("./users.js");

app.use(cors({ origin: "*"}))
app.use(route)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
io.setMaxListeners(15);
io.on('connection', (socket) => {
    socket.on('join', ({name, room}) => {
        socket.join(room);

        const { user } = addUser({ name, room });
        
        socket.emit("message", {
            data: {user:{ name: "Beksii" }, message: `Hey, my love ${user.name}😍🥰~!`}
        })
        socket.broadcast.to(user.room).emit('message', {
            data: {user:{ name: "Beksii"}, message: `${name} has joined🤩`}
        })
        console.log(user)

        io.to(user.room).emit('room', { data: {users: getRoomUsers(user.room) }})
    })

    socket.on("sendMessage", ({message, params}) => {
        const user = findUser(params)

        if (user) {
            io.to(user.room).emit('message', { data: {user, message}})
        }
        console.log(message)

    })
    socket.on('leftroom', ({ params }) => {

        const user = removeUser(params);
        if (user) {
            const { room, name } = user

            io.to(room).emit("message", { data: { user: {name: "Beksii"}, message: `${name} left room`}})
            io.to(user.room).emit('room', {
                data: {users: getRoomUsers(room)}
            })
        }

    })

    io.on('disconnect', () => {
        console.log("Disconnect")
    })
})

server.listen(5000,"0.0.0.0", () => {
    console.log('server is running!!! yeaah')
})