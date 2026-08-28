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

  if (!scrollContainer || !track) return;

  let mm = gsap.matchMedia();

  mm.add(`(width >= ${BREAKPOINTS.LG}px)`, () => {
    const scrollWidth = () => track.clientWidth - window.innerWidth;

    // 横スクロールのアニメーション
    gsap.to(track, {
      id: "hScroll",
      x: () => -scrollWidth(),
      ease: "none",
      scrollTrigger: {
        trigger: scrollContainer,
        pin: true,
        start: "top top",
        end: () => "+=" + scrollWidth(),
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });
  });
};