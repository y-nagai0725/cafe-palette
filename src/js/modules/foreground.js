// =========================================================================
// foreground.js (前景レイヤーの表示制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initForeground = () => {
  const foreground = document.querySelector('.js-foreground');
  const springSection = document.querySelector('#spring');
  const winterSection = document.querySelector('#winter');

  if (!foreground || !springSection || !winterSection) return;

  // 前景レイヤー表示処理
  const showForeground = () => {
    gsap.to(foreground, {
      autoAlpha: 1,
      duration: 1,
      ease: GSAP_EASING.UI,
    });
  };

  // 前景レイヤー非表示処理
  const hideForeground = () => {
    gsap.to(foreground, {
      autoAlpha: 0,
      duration: 1,
      ease: GSAP_EASING.UI,
    });
  };

  let mm = gsap.matchMedia();

  // =========================================
  // 前景レイヤー表示・非表示設定
  // =========================================
  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    // PC・SP両方で共通する設定
    const triggerConfig = {
      trigger: springSection,
      endTrigger: winterSection,
      onEnter: showForeground,
      onLeave: hideForeground,
      onEnterBack: showForeground,
      onLeaveBack: hideForeground,
    };

    // 条件分岐で追加・上書きする
    if (isPc) {
      // 横スクロールTweenを取得する
      const hTween = gsap.getById("hScroll");

      // もし取得できなかったら処理をストップ
      if (!hTween) return;

      triggerConfig.containerAnimation = hTween;
      triggerConfig.start = "left center";
      triggerConfig.end = "right center";
    } else {
      triggerConfig.start = "top center";
      triggerConfig.end = "bottom center";
    }

    // 設定を渡してScrollTrigger作成
    ScrollTrigger.create(triggerConfig);
  });
};