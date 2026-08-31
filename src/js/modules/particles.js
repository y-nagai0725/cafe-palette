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
    this.speedY = Math.random() * 1 + 0.5; // 下に落ちる
    this.speedX = Math.random() * 1 - 0.5;
    this.angle = Math.random() * 360;
    this.angleSpeed = Math.random() * 0.02 - 0.01;
  }

  update(w, h) {
    this.y += this.speedY;
    this.x += this.speedX;
    this.angle += this.angleSpeed;

    // 下まで落ちたら上に戻す
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
    this.speedY = Math.random() * 1 + 0.5; // 上に向かって昇るスピード
    this.speedX = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.2; // 透明度もランダムにする
  }

  update(w, h) {
    this.y -= this.speedY; // 上に向かって動かす
    this.x += this.speedX;

    // 上まで昇りきったら、下からまた湧き出る
    if (this.y < -this.size) {
      this.y = h + this.size;
      this.x = Math.random() * w;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // 白の半透明
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2); // 丸の泡
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
    this.speedY = Math.random() * 1.5 + 0.5;
    this.speedX = Math.random() * 2 - 1;
    this.angle = Math.random() * 360;
    this.angleSpeed = Math.random() * 0.05 - 0.025;

    // 秋の紅葉カラーを複数用意
    const colors = [
      'rgba(217, 138, 89, 0.8)', // ベースの秋色（オレンジ）
      'rgba(198, 40, 40, 0.7)',  // もみじのような深い赤
      'rgba(249, 168, 37, 0.7)'  // イチョウのような黄色
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(w, h) {
    this.y += this.speedY;
    this.x += this.speedX;
    this.angle += this.angleSpeed;

    if (this.y > h + this.size) {
      this.y = -this.size;
      this.x = Math.random() * w;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color; // ランダムで決めた色を使う
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
    this.speedY = Math.random() * 0.5 + 0.2;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update(w, h) {
    this.y += this.speedY;
    this.x += this.speedX;

    if (this.y > h + this.size) {
      this.y = -this.size;
      this.x = Math.random() * w;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // 白の半透明
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2); // 丸の小さな雪の粒
    ctx.fill();
    ctx.restore();
  }
}