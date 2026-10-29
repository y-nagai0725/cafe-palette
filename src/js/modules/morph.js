// =========================================================================
// morph.js (MorphSVGを使った背景変形アニメーションモジュール)
// =========================================================================

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

export const initMorphBg = () => {
  // =========================================
  // Messageセクション:コーヒーの湯気
  // =========================================
  const steamWave = document.querySelector('.js-steam-wave');
  if (steamWave) {
    gsap.to(steamWave, {
      morphSVG: "#steam-wave-target",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

};