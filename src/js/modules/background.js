// =========================================================================
// background.js (背景レイヤーの表示制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { BREAKPOINTS, COLORS, GSAP_EASING } from '../utils/constants';
import { initParticleCanvas } from './canvasEngine';
import { Petal, Bubble, Leaf, Snow, Star } from './particles';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

export const initBackground = () => {
  const background = document.querySelector('.js-background');
  const wave = document.querySelector('.js-wave');
  const springSection = document.querySelector('.js-section-spring');
  const summerSection = document.querySelector('.js-section-summer');
  const autumnSection = document.querySelector('.js-section-autumn');
  const winterSection = document.querySelector('.js-section-winter');
  const reverseTriggerSpace = document.querySelector('.js-fv-reverse-trigger');

  if (!background || !wave || !springSection || !summerSection || !autumnSection || !winterSection || !reverseTriggerSpace) return;

  const seasonSections = [springSection, summerSection, autumnSection, winterSection];

  // Canvasを初期化し、操作用のコントローラーを受け取る
  const canvasController = initParticleCanvas('.js-canvas');

  // =========================================
  // 背景の波の変形アニメーション（PC/SP共通・無限ループ）
  // =========================================
  gsap.to(wave, {
    morphSVG: "#wave-target",
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // 季節＆夜空のパーティクル設定をまとめたMap
  const particleConfig = {
    spring: { class: Petal, count: 60 },
    summer: { class: Bubble, count: 40 },
    autumn: { class: Leaf, count: 40 },
    winter: { class: Snow, count: 100 },
    night: { class: Star, count: 80 },
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

  // 背景色と波の色（および波の表示・非表示）を変更する
  const changeColor = (themeId) => {
    const upperCaseId = themeId.toUpperCase();
    const bgColor = COLORS[upperCaseId];
    const waveColor = COLORS[`${upperCaseId}_WAVE`];

    if (!bgColor) return;

    gsap.to(background, {
      backgroundColor: bgColor,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });

    if (waveColor) {
      // 季節セクション：波の色を変えつつ、元の透明度（0.5）で表示する
      gsap.to(wave, {
        fill: waveColor,
        autoAlpha: 0.5,
        duration: 0.8,
        ease: GSAP_EASING.UI,
        overwrite: "auto",
      });
    } else {
      // 夜空（waveColorがないテーマ）：波をフワッと非表示にする
      gsap.to(wave, {
        autoAlpha: 0,
        duration: 0.8,
        ease: GSAP_EASING.UI,
        overwrite: "auto",
      });
    }
  };

  // canvasのパーティクルアニメーションを変更する処理
  const changeCanvasAnimation = (themeId) => {
    if (canvasController && particleConfig[themeId]) {
      const config = particleConfig[themeId];
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
    const hTween = isPc ? gsap.getById("hScroll") : undefined;
    if (isPc && !hTween) return;

    // -----------------------------------------
    // 背景レイヤー全体の表示・非表示制御
    // -----------------------------------------
    ScrollTrigger.create({
      trigger: springSection,
      containerAnimation: hTween,
      start: isPc ? "left center" : "top center",
      invalidateOnRefresh: true,
      onEnter: showBackground,
      onLeaveBack: hideBackground,
    });

    // -----------------------------------------
    // 季節セクション毎のアニメーション設定（色・パーティクル切り替え）
    // -----------------------------------------
    seasonSections.forEach(section => {
      const seasonId = section.id;

      ScrollTrigger.create({
        trigger: section,
        containerAnimation: hTween,
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
    // 退店アニメーション以降の背景設定（夜空＆星パーティクル）
    // -----------------------------------------
    ScrollTrigger.create({
      trigger: reverseTriggerSpace,
      containerAnimation: hTween,
      start: isPc ? "left right" : "top bottom",
      invalidateOnRefresh: true,
      onEnter: () => {
        changeColor('night');
        changeCanvasAnimation('night');
      },
      onLeaveBack: () => {
        changeColor('winter');
        changeCanvasAnimation('winter');
      },
    });

    // -----------------------------------------
    // クリーンアップ処理（ブレイクポイント切り替え時）
    // -----------------------------------------
    return () => {
      // 動的に実行された単発Tweenを停止＆スタイルを初期状態へリセット
      gsap.killTweensOf(background);

      // 波は、色と透明度のTweenだけを止める（変形の無限ループは止めない）
      gsap.killTweensOf(wave, "fill,autoAlpha,opacity,visibility");

      gsap.set(background, {
        clearProps: "opacity,visibility,backgroundColor"
      });
      gsap.set(wave, {
        clearProps: "fill,opacity,visibility"
      });

      // パーティクルアニメーションを停止＆クリア
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