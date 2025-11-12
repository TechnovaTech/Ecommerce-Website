import { NextApiRequest } from 'next'
import { NextApiResponseServerIO, initSocket } from '@/lib/websocket'

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === 'GET') {
    initSocket(res)
    res.status(200).json({ message: 'Socket server initialized' })
  }
}