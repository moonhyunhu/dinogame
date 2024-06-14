import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

//모듈의 위치 즉 assetes.js의 위치를 나타냄 meta.url fileURLToPath에 넣으면 절대경로 찾을 수 있음
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../assets');

//파일 읽어오는 함수
//비동기 병렬로 읽기
const readFileAsync = (filename) => {
  //병렬로 처리하지만 마지막에 끝나는 작업까지 기다리기 위해 promise사용
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

//Promise.all()
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
