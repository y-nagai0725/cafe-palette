// =========================================================================
// springCanvas.js (春セクションの桜パーティクルモジュール)
// =========================================================================

export const initSpringCanvas = () => {
  // canvas要素を取得する
  const canvas = document.querySelector('.js-spring-canvas');
  if (!canvas) return;

  // 2Dコンテキストを取得する
  const ctx = canvas.getContext('2d');

  let width, height;

  // =========================================
  // 画面サイズに合わせてスケッチブックの大きさを調整する処理
  // =========================================
  const resize = () => {
    // 画面の幅と高さを取得
    width = window.innerWidth;
    height = window.innerHeight;
    console.log(width);

    // スマホなどの高画質画面（Retina）で絵がぼやけないようにする
    const dpr = window.devicePixelRatio || 1;

    // スケッチブックの「実際の画素数」を画面サイズ×ピクセル比に設定
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // CSS上の「見た目のサイズ」は画面サイズそのままに設定
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // 描画の基準スケールをピクセル比に合わせて拡大しておく
    ctx.scale(dpr, dpr);
  };

  // 最初に1回サイズ調整を実行
  resize();

  // リサイズ用のデバウンス処理
  let timer;
  const debouncedResize = () => {
    clearTimeout(timer);
    timer = setTimeout(resize, 200);
  }

  // 画面がリサイズされた時、もう一度サイズ調整を行うようにする
  window.addEventListener('resize', debouncedResize);

  // =========================================
  // 花びらクラス
  // =========================================
  class Petal {
    constructor() {
      // 初期位置（画面内のランダムな場所）
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      // 花びらのサイズ
      this.size = Math.random() * 5 + 5; // 5〜10pxのランダム

      // 落ちるスピードと、左右に揺れるスピード
      this.speedY = Math.random() * 1 + 0.5; // 下へ落ちる速度
      this.speedX = Math.random() * 1 - 0.5; // 左右の揺れ

      // 回転の角度と、回るスピード
      this.angle = Math.random() * 360;
      this.angleSpeed = Math.random() * 0.02 - 0.01;
    }

    // =========================================
    // 位置を更新するメソッド
    // =========================================
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.angle += this.angleSpeed;

      // 画面の下まで落ちきったら、また上から降らせる
      if (this.y > height + this.size) {
        this.y = -this.size; // 画面の少し上に戻す
        this.x = Math.random() * width; // 横位置は新しくランダム
      }
    }

    // =========================================
    // Canvasに描画するメソッド
    // =========================================
    draw() {
      ctx.save();
      // 花びらの中心位置に基準点を移動して、回転させる
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // 花びらの色（少し透け感のあるさくら色）
      ctx.fillStyle = 'rgba(242, 180, 184, 0.8)';
      ctx.beginPath();

      // 「楕円（ellipse）」を使って花びらっぽく表現する
      // ctx.ellipse(x, y, x半径, y半径, 回転, 開始角, 終了角)
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // =========================================
  // 花びらを大量に生成
  // =========================================
  const particles = [];
  const particleCount = 60; // 花びらの数

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Petal());
  }

  // =========================================
  // アニメーションループ
  // =========================================
  const loop = () => {
    // 画面をクリアする
    ctx.clearRect(0, 0, width, height);

    // 配列の中のすべての花びらを一つずつ動かして描く
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // 画面更新のタイミングで loop を実行
    requestAnimationFrame(loop);
  };

  // アニメーションループをスタートさせる
  loop();
};