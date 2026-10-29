// =========================================================================
// foreground.js (前景レイヤーの表示制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { BREAKPOINTS, COLORS, GSAP_EASING, CAFE_HOURS } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export const initForeground = () => {
  const header = document.querySelector('.js-header');
  const foreground = document.querySelector('.js-foreground');
  const springSection = document.querySelector('.js-section-spring');
  const summerSection = document.querySelector('.js-section-summer');
  const autumnSection = document.querySelector('.js-section-autumn');
  const winterSection = document.querySelector('.js-section-winter');
  const exitTriggerSpace = document.querySelector('.js-season-exit-trigger');
  const cushionTop = document.querySelectorAll('.js-cushion-top');
  const cushionSide = document.querySelectorAll('.js-cushion-side');
  const clockLong = document.querySelector('.js-clock-long');
  const clockShort = document.querySelector('.js-clock-short');
  const allShelfItems = document.querySelectorAll('[class*="js-shelf-item-"]');
  const allBoards = document.querySelectorAll('[class*="js-board-"]');

  if (!header || !foreground || !springSection || !summerSection || !autumnSection || !winterSection || !exitTriggerSpace) return;

  const seasonSections = [springSection, summerSection, autumnSection, winterSection];

  // =========================================
  // 共通ヘルパー関数
  // =========================================

  // 前景レイヤー表示・非表示処理
  const showForeground = () => {
    gsap.to(foreground, {
      autoAlpha: 1,
      duration: 1,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  const showForegroundInstantly = () => {
    gsap.set(foreground, {
      autoAlpha: 1,
      overwrite: "auto",
    });
  };

  const hideForegroundInstantly = () => {
    gsap.set(foreground, {
      autoAlpha: 0,
      overwrite: "auto",
    });
  };

  // ヘッダーの背景切り替え
  const setHeaderTransparent = () => {
    header.classList.add('is-transparent');
  };

  const setHeaderDefault = () => {
    header.classList.remove('is-transparent');
  };

  // クッションカラー変更処理
  const changeCushionColor = (seasonId) => {
    const upperCaseSeasonId = seasonId.toUpperCase();
    const cushionColor = COLORS[upperCaseSeasonId];
    const cushionSideColor = COLORS[upperCaseSeasonId + "_SIDE"];

    if (!cushionColor || !cushionSideColor) return;

    gsap.to(cushionTop, {
      fill: cushionColor,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
    gsap.to(cushionSide, {
      fill: cushionSideColor,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  // 季節の棚アイテム表示・非表示
  const toggleShelfItems = (seasonId, isShow) => {
    const targetItems = document.querySelectorAll(`.js-shelf-item-${seasonId}`);
    if (!targetItems.length) return;

    gsap.to(targetItems, {
      autoAlpha: isShow ? 1 : 0,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  // 季節の黒板表示・非表示
  const toggleSeasonBoard = (seasonId, device, isShow) => {
    const targetBoard = document.querySelector(`.js-board-${seasonId}-${device}`);
    if (!targetBoard) return;

    gsap.to(targetBoard, {
      autoAlpha: isShow ? 1 : 0,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  // 黒板描画アニメーションのタイムラインを作成して返す関数
  const createBoardDrawTl = (seasonId, device) => {
    const targetBoard = document.querySelector(`.js-board-${seasonId}-${device}`);
    const tl = gsap.timeline();

    if (!targetBoard) return tl;

    const stringPath = targetBoard.querySelectorAll('.js-board-string');
    const decorationPath = targetBoard.querySelectorAll('.js-board-decoration');

    // 「文字のパスを描く」→「塗りつぶす」を1文字ずつ順番に実行
    stringPath.forEach(path => {
      tl.fromTo(path, {
        drawSVG: "0%",
      }, {
        drawSVG: "100%",
      }).fromTo(path, {
        fill: "none",
      }, {
        fill: COLORS.BOARD_CHALK,
      });
    });

    // 装飾要素は全て同時に描く
    tl.fromTo(decorationPath, {
      drawSVG: "0%",
    }, {
      drawSVG: "100%",
    });

    // 描画終了後に少し余韻を設ける
    tl.set({}, {}, "+=0.5");

    return tl;
  };

  // 時間文字列("HH:MM")から、GSAPで回す角度を計算する関数
  const calcClockAngles = (openTimeStr, closeTimeStr) => {
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return { hours, minutes };
    };

    const open = parseTime(openTimeStr);
    const close = parseTime(closeTimeStr);

    const startShort = (open.hours % 12) * 30 + open.minutes * 0.5;
    const startLong = open.minutes * 6;

    const totalMinutes = (close.hours * 60 + close.minutes) - (open.hours * 60 + open.minutes);

    const rotateShort = totalMinutes * 0.5;
    const rotateLong = totalMinutes * 6;

    return {
      startShort,
      endShort: startShort + rotateShort,
      startLong,
      endLong: startLong + rotateLong
    };
  };

  // =========================================
  // 初期状態の設定
  // =========================================
  const angles = calcClockAngles(CAFE_HOURS.OPEN, CAFE_HOURS.CLOSE);

  gsap.set([clockLong, clockShort], { xPercent: -50 });
  gsap.set(clockShort, { rotation: angles.startShort });
  gsap.set(clockLong, { rotation: angles.startLong });

  // =========================================
  // ScrollTrigger 連動設定 (PC / SP 振り分け)
  // =========================================
  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;
    const device = isPc ? 'pc' : 'sp';

    // PC時は横スクロールTweenを取得する
    const hTween = isPc ? gsap.getById("hScroll") : null;
    if (isPc && !hTween) return;

    // -----------------------------------------
    // 1. 前景レイヤー全体の表示・非表示制御
    // -----------------------------------------
    ScrollTrigger.create({
      trigger: springSection,
      endTrigger: exitTriggerSpace,
      containerAnimation: isPc ? hTween : undefined,
      start: isPc ? "left center" : "top center",
      end: isPc ? "right left" : "bottom top",
      scrub: true,
      onEnter: showForeground,
      onLeave: hideForegroundInstantly,
      onEnterBack: showForegroundInstantly,
      onLeaveBack: hideForegroundInstantly,
    });

    // -----------------------------------------
    // 2. 時計の針アニメーション＆ヘッダー背景透過制御
    // -----------------------------------------
    const clockTl = gsap.timeline({
      scrollTrigger: {
        trigger: springSection,
        endTrigger: winterSection,
        containerAnimation: isPc ? hTween : undefined,
        start: isPc ? "left center" : "top center",
        end: isPc ? "right center" : "bottom center",
        scrub: true,
        onEnter: setHeaderTransparent,
        onLeave: setHeaderDefault,
        onEnterBack: setHeaderTransparent,
        onLeaveBack: setHeaderDefault,
      },
    });

    clockTl.to(clockShort, {
      rotation: angles.endShort,
      ease: "none"
    }, 0).to(clockLong, {
      rotation: angles.endLong,
      ease: "none"
    }, 0);

    // -----------------------------------------
    // 3. 各季節セクションの連動演出（クッション・棚・黒板）
    // -----------------------------------------
    seasonSections.forEach(section => {
      const seasonId = section.id;

      const boardTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          containerAnimation: isPc ? hTween : undefined,
          start: isPc ? "left center" : "top center",
          end: isPc ? "right center" : "bottom center",
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            changeCushionColor(seasonId);
            toggleSeasonBoard(seasonId, device, true);
            if (isPc) toggleShelfItems(seasonId, true);
          },
          onEnterBack: () => {
            changeCushionColor(seasonId);
            toggleSeasonBoard(seasonId, device, true);
            if (isPc) toggleShelfItems(seasonId, true);
          },
          onLeave: () => {
            toggleSeasonBoard(seasonId, device, false);
            if (isPc) toggleShelfItems(seasonId, false);
          },
          onLeaveBack: () => {
            toggleSeasonBoard(seasonId, device, false);
            if (isPc) toggleShelfItems(seasonId, false);
          },
        },
      });

      boardTl.add(createBoardDrawTl(seasonId, device));
    });

    // -----------------------------------------
    // クリーンアップ処理（ブレイクポイント切り替え時）
    // -----------------------------------------
    return () => {
      // コールバック内で動的に実行された単発Tweenを停止＆スタイルクリア
      gsap.killTweensOf([foreground, cushionTop, cushionSide, allShelfItems, allBoards]);
      gsap.set([foreground, allShelfItems, allBoards], {
        clearProps: "opacity,visibility"
      });
      gsap.set([cushionTop, cushionSide], {
        clearProps: "fill"
      });

      // ヘッダーの透過クラスを初期状態（解除）に戻す
      setHeaderDefault();
    };
  });
};