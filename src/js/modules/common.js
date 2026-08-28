// =========================================================================
// common.js (共通機能モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { GSAP_EASING } from '../utils/constants';

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