// socketio.ts
import { Server as SocketIOServer, Socket } from 'socket.io'
import { Server } from 'http'

let io: SocketIOServer

export const initializeSocketIO = (httpServer: Server) => {
    io = new SocketIOServer(httpServer)

    io.on('connection', (socket: Socket) => {
        console.log('Client connected')

        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })
}

export const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.IO has not been initialized')
    }
    return io
}
