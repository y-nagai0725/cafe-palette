// =========================================================================
// horizontal.js (ページ全体の横スクロール機能モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initHorizontalScroll = () => {
  const scrollContainer = document.querySelector('.js-scroll-container');
  const track = document.querySelector('.js-horizontal-track');
  const foreground = document.querySelector('.js-foreground');
  const background = document.querySelector('.js-background');
  const fv = document.querySelector('.js-fv');
  const fvReverseTrigger = document.querySelector('.js-fv-reverse-trigger');

  if (!scrollContainer || !track || !foreground || !background || !fv || !fvReverseTrigger) return;

  let mm = gsap.matchMedia();

  mm.add(`(width >= ${BREAKPOINTS.LG}px)`, () => {
    const scrollWidth = () => track.clientWidth - window.innerWidth;

    // FVを固定させる（逆スクロールさせる）最大距離を計算
    const getFvFixedAmount = () => {
      // (fvReverseTriggerの右端までの距離) - (FVの幅) を計算
      return fvReverseTrigger.offsetLeft + fvReverseTrigger.offsetWidth - fv.offsetWidth;
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        id: "hScrollTrigger",
        trigger: scrollContainer,
        pin: true,
        start: "top top",
        end: () => "+=" + scrollWidth(),
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    // 横スクロールのアニメーション
    tl.to(track, {
      id: "hScroll",
      x: () => -scrollWidth(),
      ease: "none",
      duration: 1,
    }, 0);

    // [前景, 背景]要素を逆方向にスクロールさせる（固定しているように見せる）
    tl.to([foreground, background], {
      x: () => scrollWidth(),
      ease: "none",
      duration: 1,
    }, 0);

    // FV要素を逆スクロールで固定（退店トリガーの終わりまで）
    tl.to(fv, {
      x: () => getFvFixedAmount(),
      // 全体のスクロール量に対する割合で動かす
      duration: () => getFvFixedAmount() / scrollWidth(),
      ease: "none",
    }, 0);

    return () => {
      gsap.set([track, foreground, background, fv], {
        clearProps: "transform"
      });
    };
  });
};