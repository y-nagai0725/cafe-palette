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

  if (!scrollContainer || !track || !foreground) return;

  let mm = gsap.matchMedia();

  mm.add(`(width >= ${BREAKPOINTS.LG}px)`, () => {
    const scrollWidth = () => track.clientWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
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
    }, 0);

    // 前景レイヤーを逆方向にスクロールさせる（固定しているように見せる）
    tl.to(foreground, {
      x: () => scrollWidth(),
      ease: "none",
    }, 0);

    return () => {
      gsap.set([track, foreground], {
        clearProps: "all",
      });
    };
  });
};