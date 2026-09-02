// =========================================================================
// common.js (共通機能モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { GSAP_EASING, BREAKPOINTS } from '../utils/constants';

gsap.registerPlugin(ScrollToPlugin);

export const initPageTop = () => {
  const pageTopLinks = document.querySelectorAll('.js-page-top');
  if (!pageTopLinks.length) return;

  pageTopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // デフォルトのリンク移動をキャンセル

      // 画面の一番上まで戻る
      gsap.to(window, {
        scrollTo: 0,
        duration: 1,
        ease: GSAP_EASING.SMOOTH
      });
    });
  });
};

/**
 * 内部リンクのスムーススクロールの処理
 */
export const initSectionLinks = () => {
  const header = document.querySelector('.l-header');
  const sectionLinks = document.querySelectorAll('.js-section-link');
  if (!header || !sectionLinks.length) return;

  let mm = gsap.matchMedia();

  sectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      mm.add({
        isPc: `(width >= ${BREAKPOINTS.LG}px)`,
        isSp: `(width < ${BREAKPOINTS.LG}px)`
      }, (context) => {
        let { isPc } = context.conditions;

        if (isPc) {
          const container = document.querySelector('.js-scroll-container');
          const targetScroll = container.offsetTop + targetElement.offsetLeft;

          gsap.to(window, {
            scrollTo: targetScroll,
            duration: 1,
            ease: GSAP_EASING.SMOOTH
          });
        } else {
          const headerHeight = header.offsetHeight;
          gsap.to(window, {
            scrollTo: {
              y: targetElement,
              offsetY: headerHeight
            },
            duration: 1,
            ease: GSAP_EASING.SMOOTH
          });
        }
      });
    });
  });
};