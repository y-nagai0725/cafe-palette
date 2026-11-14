// =========================================================================
// header.js (ヘッダー機能モジュール)
// =========================================================================
// 役割：SP時のハンバーガーメニューの開閉アニメーション、および
// それに伴うスクロール禁止制御（is-noscroll）を一括管理する。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { COLORS, BREAKPOINTS, GSAP_EASING } from '../utils/constants';
import { debounce } from '../utils/debounce';
import { lockScroll, unlockScroll } from '../utils/scrollbar';

gsap.registerPlugin(ScrollToPlugin, MorphSVGPlugin);

export const initHeaderNav = () => {
  // DOM要素の取得
  const header = document.querySelector('.js-header');
  const hamburger = document.querySelector('.js-hamburger');
  const logo = document.querySelector('.js-header-logo');
  const links = document.querySelectorAll('.js-header-nav-link');
  const nav = document.querySelector('.js-header-nav');
  const lineTop = document.querySelector('.js-line-top');
  const lineMiddle = document.querySelector('.js-line-middle');
  const lineBottom = document.querySelector('.js-line-bottom');

  if (!header || !hamburger) return;

  let mm = gsap.matchMedia();

  // =========================================
  // ハンバーガーメニューの開閉処理 (SP幅のみ有効)
  // =========================================
  mm.add(`(width < ${BREAKPOINTS.LG}px)`, () => {

    // メニュー開閉のタイムラインを作成（初期状態は一時停止＆逆再生状態にしておく）
    const tl = gsap.timeline({
      paused: true,
      reversed: true,
      defaults: {
        ease: GSAP_EASING.UI,
      }
    });

    // -----------------------------------------
    // ボタンの変形 & 真ん中の線をフワッと消す
    // -----------------------------------------
    tl.to(lineTop, {
      morphSVG: "#cross-top",
      duration: 0.3,
    }, 0).to(lineMiddle, {
      autoAlpha: 0,
      duration: 0.3,
    }, 0).to(lineBottom, {
      morphSVG: "#cross-bottom",
      duration: 0.3,
    }, 0);

    // -----------------------------------------
    // サイトロゴとボタンの色変化（背景と同化しないように白へ）
    // -----------------------------------------
    tl.to([logo, hamburger], {
      color: COLORS.BG,
      duration: 0.3,
    }, 0);

    // -----------------------------------------
    // メニュー背景の円形展開（clip-path）アニメーション
    // -----------------------------------------

    /**
     * ハンバーガーボタンの中心座標を計算し、CSS変数としてnav要素にセットする関数
     * ※デバイスの回転やリサイズ時に、円の広がる起点がズレないようにするため
     */
    const calculateCenter = () => {
      // ボタンの中心座標を計算
      const rect = hamburger.getBoundingClientRect();
      const centerX = rect.left + (rect.width / 2);
      const centerY = rect.top + (rect.height / 2);

      // nav要素のstyle属性として、CSS変数をセット
      nav.style.setProperty('--cx', `${centerX}px`);
      nav.style.setProperty('--cy', `${centerY}px`);
    };

    // 最初に1回実行して、初期値をセット
    calculateCenter();

    // デバウンス処理を加えた関数を作成し、リサイズ時にのみ再計算を行う
    const debouncedUpdate = debounce(calculateCenter, 200);
    window.addEventListener('resize', debouncedUpdate);

    // メニュー背景の展開アニメーション
    tl.fromTo(nav, {
      clipPath: "circle(0px at var(--cx) var(--cy))"
    }, {
      clipPath: "circle(150% at var(--cx) var(--cy))",
      duration: 0.5,
    }, 0);

    // -----------------------------------------
    // ナビゲーションリンクの表示（staggerで時差をつけてフワッと出す）
    // -----------------------------------------
    tl.fromTo(links, {
      autoAlpha: 0,
      y: 20
    }, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.4,
    }, "-=0.3");

    // =========================================
    // イベント制御関数群
    // =========================================

    /**
     * ハンバーガーボタンのクリックで、メニューの開閉をする関数
     */
    const toggleMenu = async () => {
      if (tl.reversed()) {
        // メニューを開く：即座に背景スクロールを禁止し、アニメーションを再生
        lockScroll();
        tl.play();
      } else {
        // メニューを閉じる：アニメーションの逆再生完了を待ち、完全に閉じてからスクロールを許可する
        await tl.reverse();
        unlockScroll();
      }
    };

    /**
     * リンクやロゴをクリックした時にメニューを自動で閉じる関数
     */
    const closeMenu = async () => {
      if (!tl.reversed()) {
        await tl.reverse();
        unlockScroll();
      }
    };

    // イベントリスナーの登録
    hamburger.addEventListener('click', toggleMenu);
    logo.addEventListener('click', closeMenu);
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // -----------------------------------------
    // クリーンアップ処理（PC幅に切り替わった時用）
    // -----------------------------------------
    return () => {
      // 登録したイベントリスナーをすべて解除する
      hamburger.removeEventListener('click', toggleMenu);
      window.removeEventListener('resize', debouncedUpdate);
      logo.removeEventListener('click', closeMenu);
      links.forEach(link => {
        link.removeEventListener('click', closeMenu);
      });

      // PC幅になった瞬間に、もしスクロール禁止状態のままなら解除する
      if (document.body.classList.contains('is-noscroll')) {
        unlockScroll();
      }
    };
  });
};