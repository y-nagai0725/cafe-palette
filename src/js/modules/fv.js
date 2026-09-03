// =========================================================================
// fv.js (ファーストビューのスクロール連動アニメーション)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initFvAnimation = () => {
  const fv = document.querySelector('.js-fv');
  const triggerSpace = document.querySelector('.js-fv-trigger'); // 透明な空間
  const exterior = document.querySelector('.js-fv-exterior');
  const text = document.querySelector('.js-fv-text');
  const doorLeft = document.querySelector('.js-door-left');
  const doorRight = document.querySelector('.js-door-right');

  if (!fv || !triggerSpace || !exterior || !text || !doorLeft || !doorRight) return;

  // ズームの中心をドアの真ん中にセット
  gsap.set(exterior, { transformOrigin: "50% 63%" });

  // =========================================
  // スクロールに完全連動（scrub）するタイムライン
  // =========================================
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerSpace, // 透明な空間をスクロールしている間だけ動く
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onLeave: () => {
        gsap.to(fv, {
          autoAlpha: 0,
          duration: 0.8,
          onComplete: () => {
            gsap.set(fv, {
              display: "none"
            });
          },
        });
      },
      onEnterBack: () => {
        gsap.set(fv, {
          display: "block",
          autoAlpha: 1,
          overwrite: true,
        });
      },
    }
  });

  // タイムラインの演出

  // スクロール開始と同時に、テキストがフワッと消える
  tl.to(text, {
    autoAlpha: 0,
    y: -30,
    duration: 1
  }, 0);

  // テキストが消え始めた直後（0.5秒）から、ドアにズームイン
  tl.to(exterior, {
    scale: 5,
    duration: 4
  }, 0.5);

  // ズームの後半（2.5秒目）、ドアが開く
  tl.to(doorLeft, {
    x: -250,
    duration: 2
  }, 2.5);
  tl.to(doorRight, {
    x: 250,
    duration: 2
  }, 2.5);
};