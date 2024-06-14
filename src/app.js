import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import cors from 'cors';

const app = express();
const server = createServer(app);

const PORT = 5001;

app.use(
  cors({
    origin: 'http://15.164.171.110:5001', // 허용할 클라이언트 도메인
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
  res.send('hello world');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  //서버 실행 후 파일 읽기
  try {
    const assets = await loadGameAssets();
    //console.log(assets);
    console.log('Assets loaded successfully');
  } catch (err) {
    console.error('Failed to load game assets: ', err);
  }
});
