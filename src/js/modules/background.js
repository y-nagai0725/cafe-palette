// =========================================================================
// background.js (背景レイヤーの表示制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, COLORS, GSAP_EASING } from '../utils/constants';
import { initParticleCanvas } from './canvasEngine';
import { Petal, Bubble, Leaf, Snow } from './particles';

gsap.registerPlugin(ScrollTrigger);

export const initBackground = () => {
  const background = document.querySelector('.js-background');
  const wave = document.querySelector('.js-wave');
  const springSection = document.querySelector('#spring');
  const summerSection = document.querySelector('#summer');
  const autumnSection = document.querySelector('#autumn');
  const winterSection = document.querySelector('#winter');

  if (!background || !wave || !springSection || !summerSection || !autumnSection || !winterSection) return;

  // Canvasを初期化し、操作用のコントローラーを受け取る
  const canvasController = initParticleCanvas('.js-canvas');

  // 季節ごとのパーティクル設定をまとめたMap
  const particleConfig = {
    spring: {
      class: Petal,
      count: 60
    },
    summer: {
      class: Bubble,
      count: 40
    },
    autumn: {
      class: Leaf,
      count: 40
    },
    winter: {
      class: Snow,
      count: 100
    },
  };

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
  const changeColor = (seasonId) => {
    const upperCaseSeasonId = seasonId.toUpperCase();
    const bgColor = COLORS[`${upperCaseSeasonId}`];
    const waveColor = COLORS[`${upperCaseSeasonId}_WAVE`];

    gsap.to(background, {
      backgroundColor: bgColor,
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

  // canvasのパーティクルアニメーションを変更する処理
  const changeCanvasAnimation = (seasonId) => {
    if (canvasController && particleConfig[seasonId]) {
      const config = particleConfig[seasonId];
      // パーティクルを切り替える
      canvasController.changeParticles(config.class, config.count);
    }
  };

  // =========================================
  // 季節セクション毎のアニメーション設定
  // =========================================
  [springSection, summerSection, autumnSection, winterSection].forEach(section => {
    // セクションのidを取得
    const seasonId = section.id;

    mm.add({
      isPc: `(width >= ${BREAKPOINTS.LG}px)`,
      isSp: `(width < ${BREAKPOINTS.LG}px)`
    }, (context) => {
      let { isPc } = context.conditions;

      const triggerConfig = {
        trigger: section,
        invalidateOnRefresh: true,
        onEnter: () => {
          changeColor(seasonId);
          changeCanvasAnimation(seasonId);
        },
        onEnterBack: () => {
          changeColor(seasonId);
          changeCanvasAnimation(seasonId);
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