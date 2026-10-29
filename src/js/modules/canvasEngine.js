// =========================================================================
// canvasEngine.js (Canvasアニメーションの共通エンジンモジュール)
// =========================================================================

export const initParticleCanvas = (canvasSelector) => {
  const canvas = document.querySelector(canvasSelector);
  if (!canvas) return;

  // 2Dコンテキストを取得する
  const ctx = canvas.getContext('2d');

  let particles = [];
  let width, height;
  let isAnimating = false;
  let animationFrameId = null; // アニメーションを止めるためのID
  let lastTime = 0; // 前回描画した時間（タイムスタンプ）

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
  // アニメーションループ処理
  // =========================================
  const loop = (timestamp) => {
    if (!isAnimating) return;

    // 初回実行時は timestamp が NaN にならないようにする
    if (!lastTime) lastTime = timestamp;

    // 前回のフレームからの経過時間（ミリ秒）を計算
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
      // 経過時間を渡して、どのモニターでも同じ速度で動くようにする
      particle.update(width, height, deltaTime);
      particle.draw(ctx);
    });

    animationFrameId = requestAnimationFrame(loop);
  };

  // 外部から呼ばれる「変更メソッド」
  const changeParticles = (ParticleClass, count) => {
    particles = []; // パーティクルをリセット
    lastTime = 0; // 時間をリセット

    if (ParticleClass && count > 0) {
      for (let i = 0; i < count; i++) {
        particles.push(new ParticleClass(width, height));
      }
      if (!isAnimating) {
        isAnimating = true;
        animationFrameId = requestAnimationFrame(loop);
      }
    } else {
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // アニメーションを確実に停止
      }
      ctx.clearRect(0, 0, width, height);
    }
  };

  // イベントやアニメーションを完全に破棄するメソッド
  const destroy = () => {
    isAnimating = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', debouncedResize);
    particles = [];
    ctx.clearRect(0, 0, width, height);
  };

  return {
    changeParticles,
    destroy
  };
};