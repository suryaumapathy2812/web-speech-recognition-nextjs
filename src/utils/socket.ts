
// import { io, Socket } from 'socket.io-client';

// const webSocketEndPoint = process.env.NEXT_PUBLIC_WEB_SOCKET_ENDPOINT as string;
// let socket: Socket;

// if (process.env.NODE_ENV === 'production') {
//   socket = io(webSocketEndPoint, {
//     autoConnect: true,
//     transports: ['websocket'],
//     upgrade: false,
//   });
// } else {
//   const globalWithSocket = global as typeof globalThis & {
//     socket: Socket;
//   };

//   if (!globalWithSocket.socket) {
//     globalWithSocket.socket = io(webSocketEndPoint, {
//       autoConnect: true,
//       transports: ['websocket'],
//       upgrade: false,
//     });
//   }

//   socket = globalWithSocket.socket
// }

// export default socket;
