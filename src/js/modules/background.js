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
  const springSection = document.querySelector('.js-section-spring');
  const summerSection = document.querySelector('.js-section-summer');
  const autumnSection = document.querySelector('.js-section-autumn');
  const winterSection = document.querySelector('.js-section-winter');

  if (!background || !wave || !springSection || !summerSection || !autumnSection || !winterSection) return;

  const seasonSections = [springSection, summerSection, autumnSection, winterSection];

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

  // =========================================
  // 共通ヘルパー関数
  // =========================================

  // 背景レイヤー表示処理
  const showBackground = () => {
    gsap.to(background, {
      autoAlpha: 1,
      duration: 1,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  // 背景レイヤー非表示処理（同時にパーティクルの描画ループも停止して負荷を下げる）
  const hideBackground = () => {
    gsap.to(background, {
      autoAlpha: 0,
      duration: 1,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
      onComplete: () => {
        // 完全に非表示になったらCanvasのループを止める
        if (canvasController) {
          canvasController.changeParticles(null, 0);
        }
      }
    });
  };

  // 背景色と波の色を変更する
  const changeColor = (seasonId) => {
    const upperCaseSeasonId = seasonId.toUpperCase();
    const bgColor = COLORS[upperCaseSeasonId];
    const waveColor = COLORS[`${upperCaseSeasonId}_WAVE`];

    if (!bgColor || !waveColor) return;

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
      canvasController.changeParticles(config.class, config.count);
    }
  };

  // =========================================
  // ScrollTrigger 連動設定 (PC / SP 振り分け)
  // =========================================
  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    // PC時は横スクロールTweenを取得する
    const hTween = isPc ? gsap.getById("hScroll") : null;
    if (isPc && !hTween) return;

    // -----------------------------------------
    // 1. 背景レイヤー全体の表示・非表示制御
    // -----------------------------------------
    ScrollTrigger.create({
      trigger: springSection,
      endTrigger: winterSection,
      containerAnimation: isPc ? hTween : undefined,
      start: isPc ? "left center" : "top center",
      end: isPc ? "right center" : "bottom center",
      onEnter: showBackground,
      onLeave: hideBackground,
      onEnterBack: showBackground,
      onLeaveBack: hideBackground,
    });

    // -----------------------------------------
    // 2. 季節セクション毎のアニメーション設定（色・パーティクル切り替え）
    // -----------------------------------------
    seasonSections.forEach(section => {
      const seasonId = section.id;

      ScrollTrigger.create({
        trigger: section,
        containerAnimation: isPc ? hTween : undefined,
        start: isPc ? "left center" : "top center",
        end: isPc ? "right center" : "bottom center",
        invalidateOnRefresh: true,
        onEnter: () => {
          changeColor(seasonId);
          changeCanvasAnimation(seasonId);
        },
        onEnterBack: () => {
          changeColor(seasonId);
          changeCanvasAnimation(seasonId);
        },
      });
    });

    // -----------------------------------------
    // クリーンアップ処理（ブレイクポイント切り替え時）
    // -----------------------------------------
    return () => {
      // 動的に実行された単発Tweenを停止＆スタイルを初期状態へリセット
      gsap.killTweensOf([background, wave]);
      gsap.set(background, {
        clearProps: "opacity,visibility,backgroundColor"
      });
      gsap.set(wave, {
        clearProps: "fill"
      });

      // パーティクルアニメーションを停止＆クリア（イベント自体は破棄しない）
      if (canvasController) {
        canvasController.changeParticles(null, 0);
      }
    };
  });

  // モジュール自体を完全に破棄したい場合のためのクリーンアップ関数を返す
  return () => {
    mm.revert();
    if (canvasController) {
      canvasController.destroy();
    }
  };
};