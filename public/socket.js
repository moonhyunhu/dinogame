import { CLIENT_VERSION } from './constants.js';

const socket = io('http://localhost:3000', {
  query: {
    //현재 event 핸들러에서는 client_version을 체크하지만
    //connection 에서는 client_version을 체크를 안하기 때문에
    //이 코드를 추가하면 connection에서도 버전체크를 하게된다.
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

//connenction 이벤트 발생할때 클라이언트에서도 메세지를 받는데 그 안에 uuid데이터를 userId에 담는다
socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };
