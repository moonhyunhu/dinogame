import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../init/assets.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current Users: ', getUser());
};

// 스테이지에 따른 더 높은 점수 획득
// 1스테이지에서는 1점씩 추가 1000점까지
// 2스테이지에서는 2점씩 추가 2000점까지

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected: ${uuid} with socket ID ${socket.id}`);
  console.log('Current Users: ', getUser());

  //접속하자마자 게임 시작이니까 처음 실행하자마자 1스테이지의 정보를 줘야함
  

  createStage(uuid);

  //emit 본인의 메서드 본인에게 전송
  socket.emit('connection', { uuid });

  
};

export const handlerEvent = (io, socket, data) => {
  //버전이 아예 없을 때 조건도 추가 가능
  //클라이언트가 실행했을때 넘겨준 버전이 서버에 실행 가능한 버전 배열에 없는 경우
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    //허용한 버전이 없는경우 클라이언트에게 response로 fail반환
    return;
  }

  //클라이언트는 핸들러 id를 메세지에 포함시켜서 보내줘야 함
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'Fail', message: 'Handler not found' });
    return;
  }

  //찾았으면 해당 이벤트 실행시키는 함수
  //userId와 payload는 무조건 받아야 함
  const response = handler(data.userId, data.payload);

  //유저 전체에게 보내야 한다면 io.emit사용
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }
  //한명의 해당 유저에게 보내는 메세지
  socket.emit('response', response);
};
