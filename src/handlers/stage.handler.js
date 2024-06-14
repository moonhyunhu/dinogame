import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  //유저는 스테이지를 하나씩 올라갈 수 있다. 1->2 O, 1->3 X
  //유저는 일정 점수가 되면 다음 스테이지로 이동
  //currentStage, targetStage두개를 넘겨야 함

  //유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  //오름차순 -> 가장 큰 스테이지 ID를 확인 <-유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id); //id 기준 오름차순 정렬
  //서버에서 보내주는 현재 유저의 스테이지 위치
  const currentStage = currentStages[currentStages.length - 1];
  //[length-1] 가장 마지막 스테이지의 id를 currentStageId에 저장

  //클라이언트 vs 서버 비교
  //서버에서 보내준 스테이지id와 payload에 담긴 스테이지id가 다른경우
  if (currentStage.id !== payload.currentStage) {
    return { status: 'Fail', message: 'Current Stage mismatch' };
  }

  //점수 검증 로직
  const serverTime = Date.now(); // 현재 타임스탬프를 받아옴
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  //만약 1스테이지 -> 2스테이지로 넘어가는 과정
  //오차범위 5 임의로 정함
  //2스테이지를 가려면 elapsedTime이 최소 100은 넘어야하고 오차 범위 105까지의 조건을 줌
  //100이 안됐는데 2스테이를 간다거나 105가 됐는데도 2스테이지를 안넘어가는 것은 오류이기 때문
  //지연시간때문에 딜레이가 생긴 경우
  //하드 코딩
  if (elapsedTime < 10 || elapsedTime > 11) {
    return { status: 'Fail', message: 'Invalid elapsed time' };
  }

  //targetStage에 대한 검증 게임 에셋에 존재하는가?
  const { stages } = getGameAssets();
  //some 조건이 한개라도 맞으면 true반환
  //!사용해서 false가 나오는데 그러면 status: fail을 리턴하는 조건문
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'Fais', message: 'Target stage not found' };
  }

  //위에 검증을 모두 통과했을 때 userId와 payload에 targetStage를 setStage함수에 넣는다.
  //새로운 스테이지에 진입하면 serverTime을 다시 시작해야하기 때문
  setStage(userId, payload.targetStage, serverTime);
  console.log('Stage: ', getStage(userId));


  return { status: 'success', message: payload.targetStage };
};
