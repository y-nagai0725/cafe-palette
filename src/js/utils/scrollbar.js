// =========================================================================
// scrollbar.js (スクロールバー幅の計測・スクロールロック制御ユーティリティ)
// =========================================================================
// 役割：スクロール禁止（.is-noscroll）の切り替え時に、スクロールバーの有無によって
// 固定ヘッダー等がガタつくのを防ぐため、スクロールバー幅の計測とCSS変数制御を行う。
// =========================================================================

/**
 * 現在のブラウザ環境におけるスクロールバーの幅（px）を計測して返す関数
 * ※初期状態でbodyにoverflow: hiddenが付与されていても正確に計測できるよう、
 *  画面外に一時的なダミー要素を生成して差分を算出する。
 * @returns {number} スクロールバーの幅（px）
 */
export const getScrollbarWidth = () => {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';
  div.style.position = 'absolute';
  div.style.top = '-9999px';
  document.body.appendChild(div);

  const scrollbarWidth = div.offsetWidth - div.clientWidth;

  document.body.removeChild(div);
  return scrollbarWidth;
};

/**
 * スクロールバーの幅をルート要素（html）のCSS変数（--scrollbar-width）にセットする関数
 */
export const setScrollbarWidthVar = () => {
  const scrollbarWidth = getScrollbarWidth();
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
};

/**
 * ルート要素（html）のCSS変数（--scrollbar-width）を0pxにリセットする関数
 */
export const resetScrollbarWidthVar = () => {
  document.documentElement.style.setProperty('--scrollbar-width', '0px');
};

/**
 * 背面のスクロールを禁止し、スクロールバー消失分の余白補正を適用する関数
 * （モーダル展開時やハンバーガーメニュー展開時に使用）
 */
export const lockScroll = () => {
  setScrollbarWidthVar();
  document.body.classList.add('is-noscroll');
};

/**
 * 背面のスクロール禁止を解除し、スクロールバーの余白補正をリセットする関数
 * （オープニング完了時、モーダル閉鎖時、ハンバーガーメニュー閉鎖時に使用）
 */
export const unlockScroll = () => {
  document.body.classList.remove('is-noscroll');
  resetScrollbarWidthVar();
};