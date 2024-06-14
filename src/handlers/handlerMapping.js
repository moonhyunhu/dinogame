import { gameEnd, gameStart } from './game.handler.js';
import { moveStageHandler } from './stage.handler.js';

const handleMappings = {
  //11이라는 정해진 key를 바탕으로 value의 이벤트 핸들러를 맵핑해옴
  //11,12 등은 다른 로직으로 짤 수 있지만 기획자, 개발자 모두 알고있고 정해졋다는 가정하에 과제 진행
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
};

export default handleMappings;
