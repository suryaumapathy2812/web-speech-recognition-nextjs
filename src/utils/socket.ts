
import { io, Socket } from 'socket.io-client';

let socket: Socket;


if (process.env.NODE_ENV === 'production') {

  socket = io(process.env.WEB_SOCKET_ENDPOINT as string, {
    transports: ['websocket'],
    upgrade: false,
  });

} else {

  const globalWithSocket = global as typeof globalThis & {
    socket: Socket;
  };

  if (!globalWithSocket.socket) {
    globalWithSocket.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      upgrade: false,
    });
  }

  socket = globalWithSocket.socket
}

export default socket;
