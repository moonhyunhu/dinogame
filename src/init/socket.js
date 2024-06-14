import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
  const io = new SocketIO({
    cors: {
      origin: 'http://15.164.171.110:5001', // 허용할 클라이언트 도메인
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });
  io.attach(server);

  registerHandler(io);
};

export default initSocket;
