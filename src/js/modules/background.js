// =========================================================================
// background.js (背景レイヤーの表示制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, COLORS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initBackground = () => {
  const background = document.querySelector('.js-background');
  const wave = document.querySelector('.js-wave');
  const springSection = document.querySelector('#spring');
  const summerSection = document.querySelector('#summer');
  const autumnSection = document.querySelector('#autumn');
  const winterSection = document.querySelector('#winter');

  if (!background || !wave || !springSection || !summerSection || !autumnSection || !winterSection) return;

  // 背景レイヤー表示処理
  const showBackground = () => {
    gsap.to(background, {
      autoAlpha: 1,
      duration: 1,
      ease: GSAP_EASING.UI,
    });
  };

  // 背景レイヤー非表示処理
  const hideBackground = () => {
    gsap.to(background, {
      autoAlpha: 0,
      duration: 1,
      ease: GSAP_EASING.UI,
    });
  };

  let mm = gsap.matchMedia();

  // =========================================
  // 背景レイヤー表示・非表示設定
  // =========================================
  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    const triggerConfig = {
      trigger: springSection,
      endTrigger: winterSection,
      onEnter: showBackground,
      onLeave: hideBackground,
      onEnterBack: showBackground,
      onLeaveBack: hideBackground,
    };

    if (isPc) {
      const hTween = gsap.getById("hScroll");

      if (!hTween) return;

      triggerConfig.containerAnimation = hTween;
      triggerConfig.start = "left center";
      triggerConfig.end = "right center";
    } else {
      triggerConfig.start = "top center";
      triggerConfig.end = "bottom center";
    }

    ScrollTrigger.create(triggerConfig);
  });

  // 背景色と波の色を変更する
  const changeColor = (backgroundColor, waveColor) => {
    gsap.to(background, {
      backgroundColor: backgroundColor,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
    gsap.to(wave, {
      fill: waveColor,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  // TODO canvasのパーティクルアニメーションを変更する処理
  const changeCanvasAnimation = () => {

  };

  // =========================================
  // 季節セクション毎のアニメーション設定
  // =========================================
  [springSection, summerSection, autumnSection, winterSection].forEach(section => {
    // セクションのidを取得
    const seasonId = section.id;
    const upperCaseSeasonId = seasonId.toUpperCase();

    // 季節の背景色と波の色を取得
    const bgColor = COLORS[`${upperCaseSeasonId}`];
    const waveColor = COLORS[`${upperCaseSeasonId}_WAVE`];

    mm.add({
      isPc: `(width >= ${BREAKPOINTS.LG}px)`,
      isSp: `(width < ${BREAKPOINTS.LG}px)`
    }, (context) => {
      let { isPc } = context.conditions;

      const triggerConfig = {
        trigger: section,
        invalidateOnRefresh: true,
        onEnter: () => {
          changeColor(bgColor, waveColor);
          changeCanvasAnimation();
        },
        onEnterBack: () => {
          changeColor(bgColor, waveColor);
          changeCanvasAnimation();
        },
      };

      if (isPc) {
        // PC用
        const hTween = gsap.getById("hScroll");
        if (!hTween) return;

        triggerConfig.containerAnimation = hTween;
        triggerConfig.start = "left center";
        triggerConfig.end = "right center";
      } else {
        // SP用
        triggerConfig.start = "top center";
        triggerConfig.end = "bottom center";
      }

      ScrollTrigger.create(triggerConfig);

      return () => {
        // TODO クリーンアップ処理必要ならば書く
      };
    });
  });
}