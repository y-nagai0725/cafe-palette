// =========================================================================
// morph.js (MorphSVGを使った背景変形アニメーションモジュール)
// =========================================================================

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

export const initMorphBg = () => {

  // =========================================
  // 春セクションの波
  // =========================================
  const springWave = document.querySelector('.js-spring-wave');
  if (springWave) {
    gsap.to(springWave, {
      morphSVG: "#spring-wave-target",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  // =========================================
  // 夏セクションの波
  // =========================================
  const summerWave = document.querySelector('.js-summer-wave');
  if (summerWave) {
    gsap.to(summerWave, {
      morphSVG: "#summer-wave-target",
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  // =========================================
  // 🍁 秋セクションの波
  // =========================================
  const autumnWave = document.querySelector('.js-autumn-wave');
  if (autumnWave) {
    gsap.to(autumnWave, {
      morphSVG: "#autumn-wave-target",
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

};