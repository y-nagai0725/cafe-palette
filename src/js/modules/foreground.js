// =========================================================================
// foreground.js (前景レイヤーの表示制御モジュール)
// =========================================================================
// 役割：店内（前景レイヤー）の表示/非表示、季節に合わせたインテリア（クッション・棚・黒板）の切り替え、
// 時計の針の進行、およびそれに伴うヘッダーの透過処理を一括管理する。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { BREAKPOINTS, COLORS, GSAP_EASING, CAFE_HOURS } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export const initForeground = () => {
  // DOM要素の取得
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

  /**
   * 前景レイヤーをフェードイン表示する
   */
  const showForeground = () => {
    gsap.to(foreground, {
      autoAlpha: 1,
      duration: 1,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  /**
   * 前景レイヤーを即時（アニメーションなしで）表示する
   * ※逆スクロールで戻ってきた際のチラつき防止用
   */
  const showForegroundInstantly = () => {
    gsap.set(foreground, {
      autoAlpha: 1,
      overwrite: "auto",
    });
  };

  /**
   * 前景レイヤーをフェードアウト非表示にする
   */
  const hideForeground = () => {
    gsap.to(foreground, {
      autoAlpha: 0,
      duration: 1,
      ease: GSAP_EASING.UI,
      overwrite: "auto",
    });
  };

  /**
   * ヘッダーの背景を透過させる
   */
  const setHeaderTransparent = () => {
    header.classList.add('is-transparent');
  };

  /**
   * ヘッダーの背景を通常に戻す
   */
  const setHeaderDefault = () => {
    header.classList.remove('is-transparent');
  };

  /**
   * クッションの色を季節のテーマカラーに変更する
   * @param {string} seasonId - 季節のID
   */
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

  /**
   * 季節に応じた棚のアイテムを表示・非表示にする
   * @param {string} seasonId - 季節のID
   * @param {boolean} isShow - 表示する場合はtrue、非表示はfalse
   */
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

  /**
   * 季節に応じた黒板を表示・非表示にする
   * @param {string} seasonId - 季節のID
   * @param {string} device - デバイス種別 ('pc' または 'sp')
   * @param {boolean} isShow - 表示する場合はtrue、非表示はfalse
   */
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

  /**
   * 黒板のチョーク文字やイラストを描画するアニメーションTimelineを作成する
   * @param {string} seasonId - 季節のID
   * @param {string} device - デバイス種別 ('pc' または 'sp')
   * @returns {gsap.core.Timeline} 描画アニメーションのTimelineインスタンス
   */
  const createBoardDrawTl = (seasonId, device) => {
    const targetBoard = document.querySelector(`.js-board-${seasonId}-${device}`);
    const tl = gsap.timeline({
      defaults: {
        ease: "none",
      }
    });

    if (!targetBoard) return tl;

    const stringPath = targetBoard.querySelectorAll('.js-board-string');
    const decorationPath = targetBoard.querySelectorAll('.js-board-decoration');

    // 文字のパスを「なぞって描く」→「塗りつぶす」を1文字ずつ順番に実行
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

    // 装飾要素（イラストなど）は全て同時に描画する
    tl.fromTo(decorationPath, {
      drawSVG: "0%",
    }, {
      drawSVG: "100%",
    });

    // 描画終了後に少し余韻を設ける
    tl.set({}, {}, "+=0.5");

    return tl;
  };

  /**
   * 開店時間と閉店時間から、GSAPで時計の針を回すための角度を計算する
   * @param {string} openTimeStr - 開店時間 (例: "10:00")
   * @param {string} closeTimeStr - 閉店時間 (例: "19:00")
   * @returns {Object} 長針と短針それぞれの開始角度と終了角度を格納したオブジェクト
   */
  const calcClockAngles = (openTimeStr, closeTimeStr) => {
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return { hours, minutes };
    };

    const open = parseTime(openTimeStr);
    const close = parseTime(closeTimeStr);

    // 短針は1時間で30度、1分で0.5度進む
    const startShort = (open.hours % 12) * 30 + open.minutes * 0.5;

    // 長針は1分で6度進む
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

    // PC表示時は横スクロール用のTweenを取得し、各Triggerの containerAnimation に設定する
    const hTween = isPc ? gsap.getById("hScroll") : undefined;
    if (isPc && !hTween) return;

    // -----------------------------------------
    // 前景レイヤー全体の表示・非表示制御
    // -----------------------------------------
    ScrollTrigger.create({
      trigger: springSection,
      endTrigger: exitTriggerSpace,
      containerAnimation: hTween,
      start: isPc ? "left center" : "top center",
      end: isPc ? "right left" : "bottom top",
      scrub: true,
      // 春のエリアに入ったら表示、退店エリアを抜けたら非表示にする
      onEnter: showForeground,
      onLeave: hideForeground,
      onEnterBack: showForegroundInstantly,
      onLeaveBack: hideForeground,
    });

    // -----------------------------------------
    // 時計の針アニメーション ＆ ヘッダー背景透過制御
    // -----------------------------------------
    const clockTl = gsap.timeline({
      scrollTrigger: {
        trigger: springSection,
        endTrigger: winterSection,
        containerAnimation: hTween,
        start: isPc ? "left center" : "top center",
        end: isPc ? "right center" : "bottom center",
        scrub: true, // スクロール量に応じて針を動かす
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
    // 各季節セクションの連動演出（クッション・棚・黒板の切り替え）
    // -----------------------------------------
    seasonSections.forEach(section => {
      const seasonId = section.id;

      const boardTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          containerAnimation: hTween,
          start: isPc ? "left center" : "top center",
          end: isPc ? "right center" : "bottom center",
          scrub: true, // 描画アニメーションをスクロールと連動させる
          invalidateOnRefresh: true,
          // 該当の季節に入ったタイミングで各インテリアを切り替える
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
          // 該当の季節を抜けたら非表示にする
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

      // チョーク描画アニメーションのTimelineを追加
      boardTl.add(createBoardDrawTl(seasonId, device));
    });

    // -----------------------------------------
    // クリーンアップ処理（ブレイクポイント切り替え時）
    // -----------------------------------------
    return () => {
      // コールバック内で動的に実行された単発Tweenを停止し、インラインスタイルをクリアする
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