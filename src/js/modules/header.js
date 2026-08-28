// =========================================================================
// header.js (ヘッダー機能モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { COLORS, BREAKPOINTS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollToPlugin, MorphSVGPlugin);

export const initHeaderNav = () => {
  const header = document.querySelector('.l-header');
  const logo = document.querySelector('.js-header-logo');
  const links = document.querySelectorAll('.js-nav-link');
  const hamburger = document.querySelector('.js-hamburger');
  const nav = document.querySelector('.js-nav');
  const lineTop = document.querySelector('.js-line-top');
  const lineMiddle = document.querySelector('.js-line-middle');
  const lineBottom = document.querySelector('.js-line-bottom');

  if (!header || !logo || !links.length || !hamburger || !nav || !lineTop || !lineMiddle || !lineBottom) return;

  let mm = gsap.matchMedia();

  // =========================================
  // 内部リンクのスムーススクロールの処理
  // =========================================
  links.forEach(link => {
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

  // =========================================
  // ハンバーガーメニューの開閉処理 (SPのみ)
  // =========================================
  mm.add(`(width < ${BREAKPOINTS.LG}px)`, () => {

    // タイムラインを作成（初期状態は一時停止＆逆再生状態にしておく）
    const tl = gsap.timeline({
      paused: true,
      reversed: true,
      defaults: {
        ease: GSAP_EASING.UI,
      }
    });

    // =========================================
    // ボタンの変形 & 真ん中の線をフワッと消す
    // =========================================
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

    // =========================================
    // サイトロゴとボタンの色変化
    // =========================================
    tl.to([logo, hamburger], {
      color: COLORS.BG,
      duration: 0.3,
    }, 0);

    // =========================================
    // メニュー背景のclip-pathアニメーション
    // =========================================
    // 動的にボタンの中心座標を計算する関数
    const calculateCenter = () => {
      // ボタンの中心座標を計算する
      const rect = hamburger.getBoundingClientRect();
      const centerX = rect.left + (rect.width / 2);
      const centerY = rect.top + (rect.height / 2);

      // nav要素のstyle属性として、CSS変数をセットする
      nav.style.setProperty('--cx', `${centerX}px`);
      nav.style.setProperty('--cy', `${centerY}px`);
    };

    // リサイズ用のデバウンス処理
    let timer;
    const debouncedUpdate = () => {
      clearTimeout(timer);
      timer = setTimeout(calculateCenter, 200);
    };

    // 最初に1回実行して、初期値をセット
    calculateCenter();

    // 画面リサイズ時に、デバウンス処理を加えた関数を呼び出す
    window.addEventListener('resize', debouncedUpdate);

    // メニューの展開
    tl.fromTo(nav, {
      clipPath: "circle(0px at var(--cx) var(--cy))"
    }, {
      clipPath: "circle(150% at var(--cx) var(--cy))",
      duration: 0.5,
    }, 0);

    // =========================================
    // ナビゲーションリンクの表示
    // =========================================
    tl.fromTo(links,
      {
        autoAlpha: 0,
        y: 20
      },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.4,
      },
      "-=0.3"
    );

    // =========================================
    // メニュー開閉処理
    // =========================================
    const toggleMenu = () => {
      // 逆再生状態なら再生、再生状態なら逆再生する
      if (tl.reversed()) {
        document.body.classList.add('is-noscroll');
        tl.play();
      } else {
        tl.reverse();
        document.body.classList.remove('is-noscroll');
      }
    };

    // ボタンクリック時のイベント
    hamburger.addEventListener('click', toggleMenu);

    // =========================================
    // リンクやロゴをクリックした時にメニューを自動で閉じる処理
    // =========================================
    const closeMenu = () => {
      if (!tl.reversed()) {
        tl.reverse();
        document.body.classList.remove('is-noscroll');
      }
    };

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    logo.addEventListener('click', closeMenu);

    // クリーンアップ処理
    return () => {
      // PCサイズになったらイベントを解除する
      hamburger.removeEventListener('click', toggleMenu);
      window.removeEventListener('resize', debouncedUpdate);
      links.forEach(link => {
        link.removeEventListener('click', closeMenu);
      });
      logo.removeEventListener('click', closeMenu);

      // スクロール禁止設定を解除する
      if (document.body.classList.contains('is-noscroll')) {
        document.body.classList.remove('is-noscroll');
      }
    };
  });
};