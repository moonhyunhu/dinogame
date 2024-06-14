import { sendEvent } from './socket.js';
//import { getGameAssets } from '../src/init/assets.js';


class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  //점수가 소수점 뒷자리까지 계산이 되기때문에 0이 아닌 true로 설정

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001;
    // 점수가 100점 이상이 될 시 서버에 메세지 전송
    if (Math.floor(this.score) === 10 && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, { currentStage: 1000, targetStage: 1001 });
    }
    if (Math.floor(this.score) === 20 && !this.stageChange) {
      this.stageChange = true;
      sendEvent(11, { currentStage: 1001, targetStage: 1002 });
    }
    if (Math.floor(this.score) === 30 && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, { currentStage: 1002, targetStage: 1003 });
    }
    if (Math.floor(this.score) === 40 && !this.stageChange) {
      this.stageChange = true;
      sendEvent(11, { currentStage: 1003, targetStage: 1004 });
    }
    if (Math.floor(this.score) === 50 && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, { currentStage: 1004, targetStage: 1005 });
    }
    if (Math.floor(this.score) === 60 && !this.stageChange) {
      this.stageChange = true;
      sendEvent(11, { currentStage: 1005, targetStage: 1006 });
    }
  }

  getItem(itemId) {
    if (itemId === 1) {
      this.score += 1;
    }
    if (itemId === 2) {
      this.score += 2;
    }
    if (itemId === 3) {
      this.score += 3;
    }
    if (itemId === 4) {
      this.score += 4;
    }
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
