// =========================================================================
// fv.js (ファーストビューのスクロール連動アニメーションモジュール)
// =========================================================================
// 役割：カフェ外観（FV）における入店アニメーション（昼・通常モード）と、
// 全季節を巡った後の退店アニメーション（夜・冬モード）、および
// SP表示時のFV固定解除（Infoセクションへの接続）を一括管理する。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

/**
 * ファーストビュー（入店・退店）アニメーションの初期化関数
 */
export const initFvAnimation = () => {
  // DOM要素の取得
  const fv = document.querySelector('.js-fv');
  const triggerSpace = document.querySelector('.js-fv-trigger');
  const reverseTriggerSpace = document.querySelector('.js-fv-reverse-trigger');
  const exterior = document.querySelector('.js-fv-exterior');
  const text = document.querySelector('.js-fv-text');
  const doorSp = document.querySelector('.js-door-sp');
  const doorPc = document.querySelector('.js-door-pc');
  const infoSection = document.querySelector('.js-section-info');
  const signOpen = document.querySelectorAll('.js-sign-open');
  const signClose = document.querySelectorAll('.js-sign-close');
  const cat = document.querySelector('.js-cat');
  const decoSnowman = document.querySelectorAll('.js-deco-snowman');
  const decoPlant = document.querySelectorAll('.js-deco-plant');
  const roadMain = document.querySelectorAll('.js-road-main');
  const windowGlass = document.querySelectorAll('.js-window-glass');
  const windowReflectedLight = document.querySelectorAll('.js-window-reflected-light');
  const insideCafe = document.querySelectorAll('.js-inside-cafe');

  if (!fv || !triggerSpace || !reverseTriggerSpace || !exterior || !text || !doorSp || !doorPc || !infoSection) return;

  // =========================================
  // 共通ヘルパー関数
  // =========================================

  /**
   * FV要素全体を非表示にする
   * ※入店完了後〜退店開始前の間、店内の前景・背景レイヤーを見せるために使用
   */
  const hideFv = () => {
    gsap.set(fv, {
      autoAlpha: 0,
      overwrite: "auto",
    });
  };

  /**
   * FV要素全体を表示する
   */
  const showFv = () => {
    gsap.set(fv, {
      autoAlpha: 1,
      overwrite: "auto",
    });
  };

  /**
   * カフェ外観を入店時（昼・通常モード）の見た目に切り替える
   * OPEN看板・観葉植物・猫を表示し、窓や道路の色をSVG本来の初期色へリセットする。
   */
  const setOpenMode = () => {
    // 表示：OPEN看板、観葉植物、猫
    gsap.set([signOpen, decoPlant, cat], { autoAlpha: 1 });

    // 非表示：CLOSE看板、雪だるま
    gsap.set([signClose, decoSnowman], { autoAlpha: 0 });

    // 色変化を初期化（インラインのfillを消去してSVG本来の色に戻す）
    gsap.set([windowGlass, windowReflectedLight, insideCafe, roadMain], { clearProps: "fill" });
  };

  /**
   * カフェ外観を退店時（夜・冬モード）の見た目に切り替える
   * CLOSE看板・雪だるまを表示し、猫を非表示、窓・店内を暖かい照明色に、道路を雪道カラーに変更する。
   */
  const setCloseMode = () => {
    // 非表示：OPEN看板、観葉植物、猫
    gsap.set([signOpen, decoPlant, cat], { autoAlpha: 0 });

    // 表示：CLOSE看板、雪だるま
    gsap.set([signClose, decoSnowman], { autoAlpha: 1 });

    // 窓ガラス、反射光、店内を夜の照明色にする
    gsap.set(windowGlass, { fill: "#FFE0B2" });
    gsap.set(windowReflectedLight, { fill: "#fceacf" });
    gsap.set(insideCafe, { fill: "#FFE0B2" });

    // 道路を雪道カラーにする
    gsap.set(roadMain, { fill: "#E8F0F2" });
  };

  // =========================================
  // 初期状態の設定（PC/SP共通）
  // =========================================
  // 初期状態としてOPENモードを適用しておく
  setOpenMode();

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

    // ズームの中心を入口（右側のドア付近）にセット
    gsap.set(exterior, {
      transformOrigin: isPc ? "37% 70%" : "80% 70%",
    });

    // ドアの右端を回転（開閉）の軸にする
    gsap.set([doorPc, doorSp], {
      transformOrigin: "right center",
    });

    // -----------------------------------------
    // 入店アニメーション（タイトル消去 ➔ ドアを開きながらズームイン）
    // -----------------------------------------
    const enterTl = gsap.timeline({
      defaults: {
        ease: GSAP_EASING.UI,
      },
      scrollTrigger: {
        trigger: triggerSpace,
        containerAnimation: hTween,
        start: isPc ? "left left" : "top top",
        end: isPc ? "right center" : "bottom center",
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          setOpenMode();
          showFv();
        },
        onLeave: hideFv,
        onEnterBack: () => {
          setOpenMode();
          showFv();
        },
      }
    });

    // スクロール開始と同時に、タイトルテキストが上へフワッと消える
    enterTl.fromTo(text, {
      autoAlpha: 1,
      y: 0,
    }, {
      autoAlpha: 0,
      y: -30,
      duration: 1
    }, 0);

    // テキストが消え始めた直後（0.5秒の位置）から、入口ドアへ向かってズームイン
    enterTl.fromTo(exterior, {
      scale: 1,
    }, {
      scale: isPc ? 3.5 : 2,
      duration: 4
    }, 0.5);

    // ドアを奥へ開く（scaleXを縮小させつつフェードアウト）
    enterTl.fromTo([doorPc, doorSp], {
      scaleX: 1,
      autoAlpha: 1,
    }, {
      scaleX: 0,
      autoAlpha: 0,
      duration: 3,
      ease: GSAP_EASING.DOOR,
    }, 1);

    // -----------------------------------------
    // 退店アニメーション（ドアを閉じながらズームアウト ➔ タイトル再表示）
    // -----------------------------------------
    const exitTl = gsap.timeline({
      defaults: {
        ease: GSAP_EASING.UI,
        immediateRender: false, // ページ読み込み時に入店前の状態が退店のfrom状態で上書きされるのを防ぐ
      },
      scrollTrigger: {
        trigger: reverseTriggerSpace,
        containerAnimation: hTween,
        start: isPc ? "left right" : "top bottom",
        end: isPc ? "right right" : "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          setCloseMode();
          showFv();
        },
        onEnterBack: () => {
          setCloseMode();
          showFv();
        },
        onLeaveBack: hideFv,
      }
    });

    // カフェ外観全体が見えるようにズームアウト
    exitTl.fromTo(exterior, {
      scale: isPc ? 3.5 : 2,
    }, {
      scale: 1,
      duration: 4
    }, 0);

    // 開いていたドアを閉じる
    exitTl.fromTo([doorPc, doorSp], {
      scaleX: 0,
      autoAlpha: 0,
    }, {
      scaleX: 1,
      autoAlpha: 1,
      duration: 3,
      ease: GSAP_EASING.DOOR,
    }, 0.5);

    // 退店完了間際にタイトルテキストが再びフワッと現れる
    exitTl.fromTo(text, {
      autoAlpha: 0,
      y: -30,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 1
    }, 3.5);

    // -----------------------------------------
    // SP版のみ：FV固定解除処理（Infoセクションへの自然なスクロール遷移）
    // -----------------------------------------
    if (!isPc) {
      ScrollTrigger.create({
        trigger: reverseTriggerSpace,
        start: "bottom bottom",
        onEnter: () => {
          // 下スクロール時：退店アニメーション完了地点でfixedを解除し、Infoセクション直上に絶対配置する
          const infoAbsoluteY = infoSection.getBoundingClientRect().top + window.scrollY;
          const targetTop = infoAbsoluteY - window.innerHeight;

          gsap.set(fv, {
            position: "absolute",
            top: targetTop,
          });
        },
        onLeaveBack: () => {
          // 上スクロール時：退店トリガー空間に戻ってきたら再びfixed（CSSのデフォルト）に戻す
          gsap.set(fv, {
            clearProps: "position,top"
          });
        }
      });
    }

    // -----------------------------------------
    // クリーンアップ処理（ブレイクポイント切り替え時）
    // -----------------------------------------
    return () => {
      // コールバック内で動的に変更されたFVのスタイル（表示状態・配置）をリセット
      gsap.set(fv, {
        clearProps: "opacity,visibility,position,top"
      });
      gsap.set([doorPc, doorSp], {
        clearProps: "transform"
      });
      // 外観の看板・装飾・色を初期状態（OPENモード）に戻す
      setOpenMode();
    };
  });
};