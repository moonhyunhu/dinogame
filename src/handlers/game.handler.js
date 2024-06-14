import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const gameStart = (uuid, payload) => {
  //접속하자마자 게임 시작이니까 처음 실행하자마자 1스테이지의 정보를 줘야함
  const { stages } = getGameAssets();

  clearStage(uuid);
  //stages 배열에서 0번째 = 첫번째 스테이지
  //원래 클라이언트에서 오는 어떠한 정보도 서버에 바로 저장하지 않는다
  //검증되지않았고 변질될 우려가 있기 때문이다
  //이번 과제에서는 신뢰한다는 가정하에 저장
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  //클라이언트는 게임 종료 시 타임스탬프와 총 점수 전달
  //:내용은 timestamp지만 이름을 gameEndTime으로 사용한다는 의미 as랑 비슷한듯?
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'Fail', message: 'No stages found for user' };
  }

  //각 스테이지의 지속 시간을 계산하여 총 점수 계산
  //반복문이 끝났다면 마지막 스테이지까지 클리어함
  //반복문이 끝나지않았다면 그 이전 스테이지에 대한 타임스탬프를 가져옴
  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration; //1초당 1점
  });
  const floorScore = Math.floor(totalScore);
  //점수와 타임스탬프 검증
  //score = 종료시 payload로 넘어온 점수
  //totalScore = 종료시 서버에서 계산된 점수
  //오차범위 5 임의로 지정
  //abs는 절댓값을 준다
  // (score - totalScore)는 -5에서 5 사이의 값이 있다는 뜻
  // 그 값이 5보다 크면 오류 리턴
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'Fail', message: 'Score verification failed' };
  }

  //DB에 저장한다는 가정
  //저장
  //saveResult(userId, score, timestamp)

  return { status: 'success1', message: 'Game ended', floorScore };
};
