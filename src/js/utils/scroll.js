// =========================================================================
// scroll.js (スクロール関連の計算ユーティリティモジュール)
// =========================================================================
// 役割：横スクロールの実装に伴う、複雑な移動量などの計算処理をまとめる。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 横スクロールコンテナ内での「要素を固定（逆スクロール）させる」ための移動量（px）を計算する
 *
 * 背景や前景など、横スクロールさせずに画面内に留めたい要素に対して、
 * 全体のスクロール量と対象要素のトリガー幅の比率から、必要な逆向きのX移動量を算出する。
 *
 * @param {string} triggerId - 計算対象となるScrollTriggerのID
 * @returns {number} 逆スクロールさせるピクセル量（計算できない場合は0）
 */
export const getReverseScrollAmount = (triggerId) => {
  // 横スクロールのScrollTrigger
  const hScrollTrigger = ScrollTrigger.getById("hScrollTrigger");

  // 横スクロールのTween
  const hTween = gsap.getById("hScroll");

  // 計算対象となるScrollTrigger
  const targetTrigger = ScrollTrigger.getById(triggerId);

  // 必要な要素が取得できなかったら安全のため0を返す
  if (!hScrollTrigger || !hTween || !targetTrigger) return 0;

  // 全体のスクロール量
  const totalScrollAmount = hScrollTrigger.end - hScrollTrigger.start;

  // 横スクロールアニメーション全体の時間
  const duration = hTween.duration();

  // 全体に対して、対象のトリガーが占める割合
  const ratio = (targetTrigger.end - targetTrigger.start) / duration;

  return Math.round(totalScrollAmount * ratio);
};