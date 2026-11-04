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

/**
 * 夜空の星（Star）クラス
 */
export class Star {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;

    // 星の基本サイズ（1px 〜 3px）
    this.baseSize = Math.random() * 2 + 1;
    this.size = this.baseSize;

    // 瞬きの周期（初期角度をバラバラにして、一斉に光らないようにする）
    this.angle = Math.random() * Math.PI * 2;
    this.blinkSpeed = Math.random() * 0.003 + 0.001;

    // 星のベース色相（45〜65のゴールド系、または200〜220の青白い星をランダムに配置）
    this.baseHue = Math.random() < 0.7
      ? Math.random() * 20 + 45
      : Math.random() * 20 + 200;

    this.color = '';
  }

  update(w, h, deltaTime) {
    // 時間経過で角度を進める（位置は動かさない）
    this.angle += this.blinkSpeed * deltaTime;

    // Math.sinの結果（-1 〜 1）を 0.0 〜 1.0 の輝き度合い（twinkle）に変換
    const twinkle = (Math.sin(this.angle) + 1) / 2;

    // 輝きに合わせてサイズを変化させる（基本サイズの 0.5倍 〜 1.4倍）
    this.size = this.baseSize * (0.5 + twinkle * 0.9);

    // 輝きに合わせて色と透明度を変化させる（最大に輝く時は100%に近い純白になり、減光時は色味が乗る）
    const hue = this.baseHue + Math.sin(this.angle * 0.5) * 15;
    const lightness = 70 + twinkle * 30;
    const opacity = 0.2 + twinkle * 0.8;

    this.color = `hsla(${hue}, 90%, ${lightness}%, ${opacity})`;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}