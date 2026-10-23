// =========================================================================
// foreground.js (前景レイヤーの表示制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { BREAKPOINTS, COLORS, GSAP_EASING, CAFE_HOURS } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(DrawSVGPlugin);

export const initForeground = () => {
  const header = document.querySelector('.l-header');
  const foreground = document.querySelector('.js-foreground');
  const springSection = document.querySelector('#spring');
  const summerSection = document.querySelector('#summer');
  const autumnSection = document.querySelector('#autumn');
  const winterSection = document.querySelector('#winter');
  const exitTriggerSpace = document.querySelector('.js-season-exit-trigger');
  const cushionTop = document.querySelectorAll('.js-cushion-top');
  const cushionSide = document.querySelectorAll('.js-cushion-side');
  const clockLong = document.querySelector('.js-clock-long');
  const clockShort = document.querySelector('.js-clock-short');

  if (!header || !foreground || !springSection || !summerSection || !autumnSection || !winterSection || !cushionTop || !cushionSide || !clockLong || !clockShort) return;

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

  // ヘッダーの背景を透明にする
  const setHeaderTransparent = () => {
    header.classList.add('is-transparent');
  }

  // ヘッダーの背景を元に戻す
  const setHeaderDefault = () => {
    header.classList.remove('is-transparent');
  };

  // 時間文字列("HH:MM")から、GSAPで回す角度を計算する関数
  const calcClockAngles = (openTimeStr, closeTimeStr) => {
    // "10:30" を hours: 10, minutes: 30 の数値に変換する関数
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return { hours, minutes };
    };

    const open = parseTime(openTimeStr);
    const close = parseTime(closeTimeStr);

    // 開始時の角度（0時ちょうどを0度とする）
    // 短針は1時間に30度、1分に0.5度進む
    const startShort = (open.hours % 12) * 30 + open.minutes * 0.5;
    // 長針は1分に6度進む
    const startLong = open.minutes * 6;

    // 開店から閉店までのトータル経過時間を「分」で計算
    const totalMinutes = (close.hours * 60 + close.minutes) - (open.hours * 60 + open.minutes);

    // 進ませる角度の計算
    const rotateShort = totalMinutes * 0.5;
    const rotateLong = totalMinutes * 6;

    return {
      startShort,
      endShort: startShort + rotateShort,
      startLong,
      endLong: startLong + rotateLong
    };
  };

  // 角度計算を実行
  const angles = calcClockAngles(CAFE_HOURS.OPEN, CAFE_HOURS.CLOSE);

  // transform: translateX(-50%) をGSAP側で設定
  gsap.set([clockLong, clockShort], { xPercent: -50 });

  // 開店時間の位置に針をセット
  gsap.set(clockShort, { rotation: angles.startShort });
  gsap.set(clockLong, { rotation: angles.startLong });

  let mm = gsap.matchMedia();

  // =========================================
  // 前景レイヤー表示・非表示設定
  // =========================================
  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    const triggerConfig = {
      trigger: springSection,
      endTrigger: exitTriggerSpace,
      scrub: true,
      onEnter: showForeground,
      onLeave: hideForeground,
      onEnterBack: showForeground,
      onLeaveBack: hideForeground,
    };

    if (isPc) {
      // 横スクロールTweenを取得する
      const hTween = gsap.getById("hScroll");
      if (!hTween) return;

      triggerConfig.containerAnimation = hTween;
      triggerConfig.start = "left center";
      triggerConfig.end = "right left";
    } else {
      triggerConfig.start = "top center";
      triggerConfig.end = "bottom top";
    }

    ScrollTrigger.create(triggerConfig);
  });

  // =========================================
  // 時計のアニメーション設定
  // =========================================
  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    const triggerConfig = {
      trigger: springSection,
      endTrigger: winterSection,
      scrub: true,
      onEnter: setHeaderTransparent,
      onLeave: setHeaderDefault,
      onEnterBack: setHeaderTransparent,
      onLeaveBack: setHeaderDefault,
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

    const tl = gsap.timeline({
      scrollTrigger: triggerConfig,
    });

    tl.to(clockShort, {
      rotation: angles.endShort,
      ease: "none"
    }, 0).to(clockLong, {
      rotation: angles.endLong,
      ease: "none"
    }, 0);
  });

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

  // 黒板に文字を描く処理
  const drawSeasonBoard = (seasonId, device) => {
    const targetBoard = document.querySelector(`.js-board-${seasonId}-${device}`);

    if (!targetBoard) return;

    // 文字のpath要素
    const stringPath = targetBoard.querySelectorAll('.js-board-string');

    // 文字周りの装飾path要素
    const decorationPath = targetBoard.querySelectorAll('.js-board-decoration');

    const tl = gsap.timeline();

    // 「文字のパスを描く」→「塗りつぶす」、の処理を1文字ずつ順番に実行する
    stringPath.forEach(path => {
      tl.fromTo(path, {
        drawSVG: "0%",
      }, {
        drawSVG: "100%",
      }).fromTo(path, {
        fill: "none",
      }, {
        fill: COLORS.BOARD_CHALK, // 黒板のチョークの色で塗りつぶす
      });
    });

    // 装飾要素は全て同時に描く
    tl.fromTo(decorationPath, {
      drawSVG: "0%",
    }, {
      drawSVG: "100%",
    });

    // タイムラインを返す
    return tl;
  };

  // =========================================
  // 季節セクションのアニメーション設定
  // =========================================
  [springSection, summerSection, autumnSection, winterSection].forEach(section => {
    // セクションのidを取得
    const seasonId = section.id;

    mm.add({
      isPc: `(width >= ${BREAKPOINTS.LG}px)`,
      isSp: `(width < ${BREAKPOINTS.LG}px)`
    }, (context) => {
      let { isPc } = context.conditions;
      const device = isPc ? 'pc' : 'sp';

      // PC/SP 共通のトリガー設定
      const triggerCommonConfig = {
        trigger: section,
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          changeCushionColor(seasonId);
          toggleSeasonBoard(seasonId, device, true);
        },
        onEnterBack: () => {
          changeCushionColor(seasonId);
          toggleSeasonBoard(seasonId, device, true);
        },
        onLeave: () => {
          toggleSeasonBoard(seasonId, device, false);
        },
        onLeaveBack: () => {
          toggleSeasonBoard(seasonId, device, false);
        },
      };

      // 上書き用トリガー設定
      const triggerConfig = {};

      if (isPc) {
        // PC用
        const hTween = gsap.getById("hScroll");
        if (!hTween) return;

        triggerConfig.containerAnimation = hTween;
        triggerConfig.start = "left center";
        triggerConfig.end = "right center";
        triggerConfig.onEnter = () => {
          triggerCommonConfig.onEnter();
          // 季節の棚アイテムを表示
          toggleShelfItems(seasonId, true);
        };
        triggerConfig.onEnterBack = () => {
          triggerCommonConfig.onEnterBack();
          toggleShelfItems(seasonId, true);
        };
        triggerConfig.onLeave = () => {
          triggerCommonConfig.onLeave();
          // 季節の棚アイテムを非表示
          toggleShelfItems(seasonId, false);
        };
        triggerConfig.onLeaveBack = () => {
          triggerCommonConfig.onLeaveBack();
          toggleShelfItems(seasonId, false);
        };
      } else {
        // SP用
        triggerConfig.start = "top center";
        triggerConfig.end = "bottom center";
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          ...triggerCommonConfig,
          ...triggerConfig,
        },
      });

      tl.add(drawSeasonBoard(seasonId, device));
      tl.set({}, {}, "+=0.5"); // 描画終了後に少し余韻を設ける

      return () => {
        // TODO クリーンアップ処理必要ならば書く
      };
    });
  });
};