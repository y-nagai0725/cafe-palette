// =========================================================================
// particles.js (パーティクルの設計図モジュール)
// =========================================================================
// 役割：背景のCanvasに描画する四季（桜・泡・落ち葉・粉雪）および夜空（星）の
// 各パーティクルの座標・動き（update）・描画方法（draw）をクラスとして定義する。
// =========================================================================

/**
 * 春の桜（Petal）クラス
 * 回転しながら斜め下へゆったりと舞い落ちる楕円形のパーティクル
 */
export class Petal {
  /**
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   */
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 5 + 5;

    // 1秒間あたりの移動ピクセル数（速度）
    this.speedY = Math.random() * 50 + 30;
    this.speedX = Math.random() * 30 - 15;

    this.angle = Math.random() * 360;
    this.angleSpeed = Math.random() * 0.002 - 0.001;
  }

  /**
   * 経過時間に応じて座標と回転角度を更新する
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   * @param {number} deltaTime - 前フレームからの経過時間（ミリ秒）
   */
  update(w, h, deltaTime) {
    // 経過時間(ms)を「秒」に変換して移動量を計算
    const dtSec = deltaTime / 1000;
    this.y += this.speedY * dtSec;
    this.x += this.speedX * dtSec;
    this.angle += this.angleSpeed * deltaTime;

    // 画面下端を出たら上端へ戻す
    if (this.y > h + this.size) {
      this.y = -this.size;
      this.x = Math.random() * w;
    }
  }

  /**
   * Canvasに桜の花びらを描画する
   * @param {CanvasRenderingContext2D} ctx - Canvas 2Dコンテキスト
   */
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
 * 画面下から上へ向かって浮かび上がる半透明の円形パーティクル
 */
export class Bubble {
  /**
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   */
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 4 + 2;
    this.speedY = Math.random() * 50 + 30;
    this.speedX = Math.random() * 30 - 15;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  /**
   * 経過時間に応じて座標を更新する
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   * @param {number} deltaTime - 前フレームからの経過時間（ミリ秒）
   */
  update(w, h, deltaTime) {
    const dtSec = deltaTime / 1000;
    this.y -= this.speedY * dtSec;
    this.x += this.speedX * dtSec;

    // 画面上端を出たら下端へ戻す
    if (this.y < -this.size) {
      this.y = h + this.size;
      this.x = Math.random() * w;
    }
  }

  /**
   * Canvasに泡を描画する
   * @param {CanvasRenderingContext2D} ctx - Canvas 2Dコンテキスト
   */
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
 * 3色の紅葉カラーからランダムに生成され、回転しながら舞い落ちるパーティクル
 */
export class Leaf {
  /**
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   */
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

  /**
   * 経過時間に応じて座標と回転角度を更新する
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   * @param {number} deltaTime - 前フレームからの経過時間（ミリ秒）
   */
  update(w, h, deltaTime) {
    const dtSec = deltaTime / 1000;
    this.y += this.speedY * dtSec;
    this.x += this.speedX * dtSec;
    this.angle += this.angleSpeed * deltaTime;

    // 画面下端を出たら上端へ戻す
    if (this.y > h + this.size) {
      this.y = -this.size;
      this.x = Math.random() * w;
    }
  }

  /**
   * Canvasに落ち葉を描画する
   * @param {CanvasRenderingContext2D} ctx - Canvas 2Dコンテキスト
   */
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
 * 画面上から下へ静かに降り積もる白い円形パーティクル
 */
export class Snow {
  /**
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   */
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 30 + 10;
    this.speedX = Math.random() * 30 - 15;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  /**
   * 経過時間に応じて座標を更新する
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   * @param {number} deltaTime - 前フレームからの経過時間（ミリ秒）
   */
  update(w, h, deltaTime) {
    const dtSec = deltaTime / 1000;
    this.y += this.speedY * dtSec;
    this.x += this.speedX * dtSec;

    // 画面下端を出たら上端へ戻す
    if (this.y > h + this.size) {
      this.y = -this.size;
      this.x = Math.random() * w;
    }
  }

  /**
   * Canvasに粉雪を描画する
   * @param {CanvasRenderingContext2D} ctx - Canvas 2Dコンテキスト
   */
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
 * 位置を固定したまま、正弦波（Math.sin）を用いてサイズ・明度・透明度が変化し瞬くパーティクル
 */
export class Star {
  /**
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   */
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

  /**
   * 経過時間に応じて星の輝き（サイズ・色・透明度）を更新する
   * @param {number} w - Canvasの描画幅
   * @param {number} h - Canvasの描画高さ
   * @param {number} deltaTime - 前フレームからの経過時間（ミリ秒）
   */
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

  /**
   * Canvasに星を描画する
   * @param {CanvasRenderingContext2D} ctx - Canvas 2Dコンテキスト
   */
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