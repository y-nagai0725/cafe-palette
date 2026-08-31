// =========================================================================
// morph.js (MorphSVGを使った背景変形アニメーションモジュール)
// =========================================================================

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { GSAP_EASING } from '../utils/constants';

// プラグインを登録！
gsap.registerPlugin(MorphSVGPlugin);

export const initMorphBg = () => {
  // 動かす対象のパスを取得する
  const springWave = document.querySelector('.js-spring-wave');

  if (!springWave) return;

  // =========================================
  // 波のループアニメーション
  // =========================================
  gsap.to(springWave, {
    morphSVG: "#spring-wave-target", // ターゲットの形（ID）を指定
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
};