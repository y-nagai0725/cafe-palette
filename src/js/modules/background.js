// =========================================================================
// background.js (背景レイヤーの表示制御モジュール)
// =========================================================================
// 役割：背景レイヤー全体の表示/非表示、背景の波（SVG）の無限変形ループ、
// およびスクロール位置に応じた背景色・波の色・Canvasパーティクル（四季＆夜空）の
// 切り替え処理を一括管理する。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { BREAKPOINTS, COLORS, GSAP_EASING } from '../utils/constants';
import { initParticleCanvas } from './canvasEngine';
import { Petal, Bubble, Leaf, Snow, Star } from './particles';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

/**
 * 背景レイヤーの初期化・アニメーション設定関数
 * @returns {Function|undefined} モジュール全体を破棄するためのクリーンアップ関数
 */
export const initBackground = () => {
  // DOM要素の取得
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
    ease: GSAP_EASING.FLOAT,
  });

  /**
   * 季節＆夜空のパーティクル設定マップ
   * @type {Object}
   */
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

  /**
   * 背景レイヤーをフェードイン表示する
   */
  const showBackground = () => {
    gsap.to(background, {
      autoAlpha: 1,
      duration: 1,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  /**
   * 背景レイヤーをフェードアウト非表示にする
   * ※完全に非表示になったタイミングでパーティクルの描画ループも停止し、負荷を下げる
   */
  const hideBackground = () => {
    gsap.to(background, {
      autoAlpha: 0,
      duration: 1,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
      onComplete: () => {
        if (canvasController) {
          canvasController.changeParticles(null, 0);
        }
      }
    });
  };

  /**
   * 背景色と波の色（および波の表示・非表示）をテーマに合わせて変更する
   * @param {string} themeId - テーマのID ('spring', 'summer', 'autumn', 'winter', 'night')
   */
  const changeColor = (themeId) => {
    const upperCaseId = themeId.toUpperCase();
    const bgColor = COLORS[upperCaseId];
    const waveColor = COLORS[`${upperCaseId}_WAVE`];

    if (!bgColor) return;

    // 背景色の切り替え
    gsap.to(background, {
      backgroundColor: bgColor,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });

    // 波の色と表示状態の切り替え
    if (waveColor) {
      // 季節セクション：波の色を変えつつ、透明度（0.5）で表示する
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

  /**
   * Canvasのパーティクルアニメーションをテーマに合わせて変更する
   * @param {string} themeId - テーマのID ('spring', 'summer', 'autumn', 'winter', 'night')
   */
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

    // PC表示時は横スクロール用のTweenを取得し、各Triggerの containerAnimation に設定する
    const hTween = isPc ? gsap.getById("hScroll") : undefined;
    if (isPc && !hTween) return;

    // -----------------------------------------
    // 背景レイヤー全体の表示・非表示制御（春セクション以降ずっと表示）
    // -----------------------------------------
    ScrollTrigger.create({
      trigger: springSection,
      containerAnimation: hTween,
      start: isPc ? "left center" : "top center",
      invalidateOnRefresh: true,
      // 春セクションに入ったら表示し、春より前（FV側）へ戻ったら非表示にする
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
      // 退店エリアに入ったら夜空へ切り替え、手前（Messageセクション側）へ戻ったら冬の背景に戻す
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