// =========================================================================
// canvasEngine.js (Canvasアニメーションの共通エンジンモジュール)
// =========================================================================

export const initParticleCanvas = (canvasSelector, ParticleClass, particleCount) => {
  // canvas要素を取得する
  const canvas = document.querySelector(canvasSelector);
  if (!canvas) return;

  // 2Dコンテキストを取得する
  const ctx = canvas.getContext('2d');

  const particles = [];

  let width, height;

  // =========================================
  // リサイズとデバウンス処理
  // =========================================
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    // スマホなどの高画質画面（Retina）で絵がぼやけないようにする
    const dpr = window.devicePixelRatio || 1;

    // 「実際の画素数」を画面サイズ×ピクセル比に設定
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
  };

  // 画面がリサイズされた時、再度サイズ調整を行うようにする
  window.addEventListener('resize', debouncedResize);

  // =========================================
  // 指定された設計図（ParticleClass）で配列を作る
  // =========================================
  for (let i = 0; i < particleCount; i++) {
    particles.push(new ParticleClass(width, height));
  }

  // =========================================
  // アニメーションループ処理
  // =========================================
  const loop = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update(width, height);
      particle.draw(ctx);
    });

    requestAnimationFrame(loop);
  };

  loop();
};