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
  const foreground = document.querySelector('.js-foreground');
  const springSection = document.querySelector('#spring');
  const summerSection = document.querySelector('#summer');
  const autumnSection = document.querySelector('#autumn');
  const winterSection = document.querySelector('#winter');
  const cushionTop = document.querySelectorAll('.js-cushion-top');
  const cushionSide = document.querySelectorAll('.js-cushion-side');
  const clockLong = document.querySelector('.js-clock-long');
  const clockShort = document.querySelector('.js-clock-short');

  if (!foreground || !springSection || !summerSection || !autumnSection || !winterSection || !cushionTop || !cushionSide || !clockLong || !clockShort) return;

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
  // 前景レイヤー表示・非表示設定と時計のアニメーション設定
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
      scrub: true,
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

    const tl = gsap.timeline({
      scrollTrigger: {
        ...triggerConfig,
      }
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
  const changeCushionColor = (cushionColor, cushionSideColor) => {
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
  const toggleShelfItems = (targetItems, isShow) => {
    if (!targetItems || !targetItems.length) return;
    gsap.to(targetItems, {
      autoAlpha: isShow ? 1 : 0,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  // 季節の黒板表示・非表示
  const toggleSeasonBoard = (targetBoard, isShow) => {
    if (!targetBoard) return;
    gsap.to(targetBoard, {
      autoAlpha: isShow ? 1 : 0,
      duration: 0.8,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  }

  // 黒板に文字を描く処理
  const drawSeasonBoard = (targetBoard) => {
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
    const upperCaseSeasonId = seasonId.toUpperCase();

    // 季節に対応する棚アイテムを取得
    const targetShelfItems = document.querySelectorAll(`.js-shelf-item-${seasonId}`);

    mm.add({
      isPc: `(width >= ${BREAKPOINTS.LG}px)`,
      isSp: `(width < ${BREAKPOINTS.LG}px)`
    }, (context) => {
      let { isPc } = context.conditions;

      // 季節の黒板要素を取得
      const targetBoard = document.querySelector(`.js-board-${seasonId}-${isPc ? "pc" : "sp"}`);

      const triggerConfig = {
        trigger: section,
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          changeCushionColor(COLORS[`${upperCaseSeasonId}`], COLORS[`${upperCaseSeasonId}_SIDE`]);
          toggleSeasonBoard(targetBoard, true);
        },
        onEnterBack: () => {
          changeCushionColor(COLORS[`${upperCaseSeasonId}`], COLORS[`${upperCaseSeasonId}_SIDE`]);
          toggleSeasonBoard(targetBoard, true);
        },
        onLeave: () => {
          toggleSeasonBoard(targetBoard, false);
        },
        onLeaveBack: () => {
          toggleSeasonBoard(targetBoard, false);
        },

      };

      if (isPc) {
        // PC用
        const hTween = gsap.getById("hScroll");
        if (!hTween) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            ...triggerConfig,
            containerAnimation: hTween,
            start: "left center",
            end: "right center",
            onEnter: () => {
              triggerConfig.onEnter();
              // 季節の棚アイテムを表示
              toggleShelfItems(targetShelfItems, true);
            },
            onEnterBack: () => {
              triggerConfig.onEnterBack();
              toggleShelfItems(targetShelfItems, true);
            },
            onLeave: () => {
              triggerConfig.onLeave();
              // 季節の棚アイテムを非表示
              toggleShelfItems(targetShelfItems, false);
            },
            onLeaveBack: () => {
              triggerConfig.onLeaveBack();
              toggleShelfItems(targetShelfItems, false);
            },
          }
        });

        tl.add(drawSeasonBoard(targetBoard), 0);
      } else {
        // SP用
        const tl = gsap.timeline({
          scrollTrigger: {
            ...triggerConfig,
            start: "top center",
            end: "bottom center",
          }
        });

        tl.add(drawSeasonBoard(targetBoard), 0);
      }

      return () => {
        // TODO クリーンアップ処理必要ならば書く
      };
    });
  });
};