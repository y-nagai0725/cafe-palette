import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 横スクロールコンテナ内での逆スクロール量（px）を計算する
 * @param {string} triggerId - 計算対象のScrollTriggerのID
 * @returns {number} 逆スクロールさせるピクセル量
 */
export const getReverseScrollAmount = (triggerId) => {
  const hScrollTrigger = ScrollTrigger.getById("hScrollTrigger");
  const hTween = gsap.getById("hScroll");
  const targetTrigger = ScrollTrigger.getById(triggerId);

  // 要素が取得できなかったら0を返す
  if (!hScrollTrigger || !hTween || !targetTrigger) return 0;

  const totalScrollAmount = hScrollTrigger.end - hScrollTrigger.start;
  const duration = hTween.duration();
  const ratio = (targetTrigger.end - targetTrigger.start) / duration;

  return Math.round(totalScrollAmount * ratio);
};