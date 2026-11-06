// =========================================================================
// common.js (共通機能モジュール)
// =========================================================================
// 役割：ページトップへの戻るリンクや、グローバルナビゲーションからの
// ページ内リンク（スムーススクロール）の処理を一括管理する。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { GSAP_EASING, BREAKPOINTS } from '../utils/constants';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

/**
 * トップへ戻るリンクのスムーススクロール処理
 * 画面の一番上（y: 0）までアニメーションしながら移動する。
 */
export const initPageTop = () => {
  const pageTopLinks = document.querySelectorAll('.js-page-top');
  if (!pageTopLinks.length) return;

  pageTopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      gsap.to(window, {
        scrollTo: {
          y: 0,
          autoKill: true, // ユーザーがマウスホイール等でスクロールしたら移動をキャンセルする
        },
        duration: 1,
        ease: GSAP_EASING.SCROLL
      });
    });
  });
};

/**
 * 内部リンクのスムーススクロール処理
 * PC（横スクロール）とSP（縦スクロール）で計算方法を分岐して目的のセクションへ移動する。
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

      // クリックされた瞬間の画面幅でPCかSPかを判定する
      const isPc = window.innerWidth >= BREAKPOINTS.LG;

      if (isPc) {
        // 横スクロールのScrollTriggerを取得
        const hScollTrigger = ScrollTrigger.getById("hScrollTrigger");

        if (hScollTrigger) {
          // 「横スクロールが開始される縦のスクロール位置（一番上）」を取得
          const startScroll = hScollTrigger.start;

          // 開始位置 + 目的のセクションの左からの距離（offsetLeft）を足して、縦スクロールの着地点を計算する
          const targetScroll = startScroll + targetElement.offsetLeft;

          gsap.to(window, {
            scrollTo: {
              y: targetScroll,
              autoKill: true,
            },
            duration: 1,
            ease: GSAP_EASING.SCROLL
          });
        }
      } else {
        // SP時は通常の縦スクロール。固定ヘッダーに隠れないように高さをoffsetYで引く
        const headerHeight = header.offsetHeight;
        gsap.to(window, {
          scrollTo: {
            y: targetElement,
            offsetY: headerHeight,
            autoKill: true,
          },
          duration: 1,
          ease: GSAP_EASING.SCROLL
        });
      }
    });
  });
};