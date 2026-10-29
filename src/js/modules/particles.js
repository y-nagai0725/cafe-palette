// =========================================================================
// particles.js (パーティクルの設計図モジュール)
// =========================================================================

/**
 * 春の桜（Petal）クラス
 */
export class Petal {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 5 + 5;

    // 1秒間あたりの移動ピクセル数（速度）を想定
    this.speedY = Math.random() * 50 + 30;
    this.speedX = Math.random() * 30 - 15;

    this.angle = Math.random() * 360;
    this.angleSpeed = Math.random() * 0.002 - 0.001;
  }

  update(w, h, deltaTime) {
    // 経過時間(ms)を考慮して移動量を計算 (deltaTime / 1000 で「秒」にする)
    const dtSec = deltaTime / 1000;
    this.y += this.speedY * dtSec;
    this.x += this.speedX * dtSec;
    this.angle += this.angleSpeed * deltaTime;

    if (this.y > h + this.size) {
      this.y = -this.size;
      this.x = Math.random() * w;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(242, 180, 184, 0.8)';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * 夏の泡（Bubble）クラス
 */
export class Bubble {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 4 + 2;
    this.speedY = Math.random() * 50 + 30;
    this.speedX = Math.random() * 30 - 15;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update(w, h, deltaTime) {
    const dtSec = deltaTime / 1000;
    this.y -= this.speedY * dtSec;
    this.x += this.speedX * dtSec;

    if (this.y < -this.size) {
      this.y = h + this.size;
      this.x = Math.random() * w;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * 秋の落ち葉（Leaf）クラス
 */
export class Leaf {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 8 + 6;
    this.speedY = Math.random() * 80 + 40;
    this.speedX = Math.random() * 100 - 50;
    this.angle = Math.random() * 360;
    this.angleSpeed = Math.random() * 0.003 - 0.0015;

    const colors = [
      'rgba(217, 138, 89, 0.8)',
      'rgba(198, 40, 40, 0.7)',
      'rgba(249, 168, 37, 0.7)'
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(w, h, deltaTime) {
    const dtSec = deltaTime / 1000;
    this.y += this.speedY * dtSec;
    this.x += this.speedX * dtSec;
    this.angle += this.angleSpeed * deltaTime;

    if (this.y > h + this.size) {
      this.y = -this.size;
      this.x = Math.random() * w;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * 冬の粉雪（Snow）クラス
 */
export class Snow {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 30 + 10;
    this.speedX = Math.random() * 30 - 15;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update(w, h, deltaTime) {
    const dtSec = deltaTime / 1000;
    this.y += this.speedY * dtSec;
    this.x += this.speedX * dtSec;

    if (this.y > h + this.size) {
      this.y = -this.size;
      this.x = Math.random() * w;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}