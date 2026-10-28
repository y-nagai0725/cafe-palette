// =========================================================================
// common.js (共通機能モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { GSAP_EASING, BREAKPOINTS } from '../utils/constants';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

/**
 * トップへ戻るリンクのスムーススクロール処理
 */
export const initPageTop = () => {
  const pageTopLinks = document.querySelectorAll('.js-page-top');
  if (!pageTopLinks.length) return;

  pageTopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // 画面の一番上まで戻る
      gsap.to(window, {
        scrollTo: {
          y: 0,
          autoKill: true, //ユーザーのスクロールでキャンセル可能にする
        },
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
  const header = document.querySelector('.js-header');
  const sectionLinks = document.querySelectorAll('.js-section-link');

  if (!header || !sectionLinks.length) return;

  sectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      // クリックされた瞬間の画面幅で判定する
      const isPc = window.innerWidth >= BREAKPOINTS.LG;

      if (isPc) {
        // 横スクロールのScrollTriggerを取得
        const hScollTrigger = ScrollTrigger.getById("hScrollTrigger");

        if (hScollTrigger) {
          // 「横スクロールが開始される縦のスクロール位置」を取得
          const startScroll = hScollTrigger.start;

          // 開始位置 + 目的のセクションの左からの距離
          const targetScroll = startScroll + targetElement.offsetLeft;

          gsap.to(window, {
            scrollTo: {
              y: targetScroll,
              autoKill: true,
            },
            duration: 1,
            ease: GSAP_EASING.SMOOTH
          });
        }
      } else {
        const headerHeight = header.offsetHeight;
        gsap.to(window, {
          scrollTo: {
            y: targetElement,
            offsetY: headerHeight,
            autoKill: true,
          },
          duration: 1,
          ease: GSAP_EASING.SMOOTH
        });
      }
    });
  });
};