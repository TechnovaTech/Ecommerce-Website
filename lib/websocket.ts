import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'
import { NextApiResponse } from 'next'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export const initSocket = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...')
    
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    // Real-time events
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('join-room', (room) => {
        socket.join(room)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })

    res.socket.server.io = io
  }
  return res.socket.server.io
}