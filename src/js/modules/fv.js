// =========================================================================
// fv.js (ファーストビューのスクロール連動アニメーション)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initFvAnimation = () => {
  const fv = document.querySelector('.js-fv');
  const triggerSpace = document.querySelector('.js-fv-trigger');
  const reverseTriggerSpace = document.querySelector('.js-fv-reverse-trigger');
  const exterior = document.querySelector('.js-fv-exterior');
  const text = document.querySelector('.js-fv-text');
  const doorSp = document.querySelector('.js-door-sp');
  const doorPc = document.querySelector('.js-door-pc');
  const signOpen = document.querySelectorAll('.js-sign-open');
  const signClose = document.querySelectorAll('.js-sign-close');
  const decoSnowman = document.querySelectorAll('.js-deco-snowman');
  const decoPlant = document.querySelectorAll('.js-deco-plant');
  const infoSection = document.querySelector('.js-section-info');

  if (!fv || !triggerSpace || !reverseTriggerSpace || !exterior || !text || !doorSp || !doorPc || !infoSection) return;

  // =========================================
  // 共通ヘルパー関数
  // =========================================

  // FV要素を非表示にする
  const hideFv = () => {
    gsap.set(fv, {
      autoAlpha: 0,
      overwrite: "auto",
    });
  };

  // FV要素を表示する
  const showFv = () => {
    gsap.set(fv, {
      autoAlpha: 1,
      overwrite: "auto",
    });
  };

  // 入店時（OPEN看板・観葉植物）の表示
  const setOpenMode = () => {
    gsap.set([signOpen, decoPlant], { autoAlpha: 1 });
    gsap.set([signClose, decoSnowman], { autoAlpha: 0 });
  };

  // 退店時（CLOSE看板・雪だるま）の表示
  const setCloseMode = () => {
    gsap.set([signOpen, decoPlant], { autoAlpha: 0 });
    gsap.set([signClose, decoSnowman], { autoAlpha: 1 });
  };

  // =========================================
  // 初期状態の設定（PC/SP共通）
  // =========================================
  // 初期状態としてOPENモードを適用
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

    // PC時は横スクロールTweenを取得する
    const hTween = isPc ? gsap.getById("hScroll") : undefined;
    if (isPc && !hTween) return;

    // ズームの中心を入口（右のドア付近）にセット
    gsap.set(exterior, {
      transformOrigin: isPc ? "37% 70%" : "80% 70%",
    });

    // ドアの右端を回転の軸にする
    gsap.set([doorPc, doorSp], {
      transformOrigin: "right center",
    });

    // -----------------------------------------
    // 1. 入店アニメーション
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

    // スクロール開始と同時に、テキストがフワッと消える
    enterTl.fromTo(text, {
      autoAlpha: 1,
      y: 0,
    }, {
      autoAlpha: 0,
      y: -30,
      duration: 1
    }, 0);

    // テキストが消え始めた直後（0.5秒）から、ドアにズームイン
    enterTl.fromTo(exterior, {
      scale: 1,
    }, {
      scale: isPc ? 3.5 : 2,
      duration: 4
    }, 0.5);

    // ドアを開く
    enterTl.fromTo([doorPc, doorSp], {
      scaleX: 1,
      autoAlpha: 1,
    }, {
      scaleX: 0,
      autoAlpha: 0,
      duration: 3,
      ease: "power1.inOut"
    }, 1);

    // -----------------------------------------
    // 2. 退店アニメーション
    // -----------------------------------------
    const exitTl = gsap.timeline({
      defaults: {
        ease: GSAP_EASING.UI,
        immediateRender: false, // 読み込み時に退店のfrom状態で上書きされるのを防ぐ
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

    // ズームアウト
    exitTl.fromTo(exterior, {
      scale: isPc ? 3.5 : 2,
    }, {
      scale: 1,
      duration: 4
    }, 0);

    // ドアを閉じる
    exitTl.fromTo([doorPc, doorSp], {
      scaleX: 0,
      autoAlpha: 0,
    }, {
      scaleX: 1,
      autoAlpha: 1,
      duration: 3,
      ease: "power1.inOut"
    }, 0.5);

    // テキストがフワッと現れる
    exitTl.fromTo(text, {
      autoAlpha: 0,
      y: -30,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 1
    }, 3.5);

    // -----------------------------------------
    // 3. SP版のみ：FV固定解除処理（Infoセクションへの遷移）
    // -----------------------------------------
    if (!isPc) {
      ScrollTrigger.create({
        trigger: reverseTriggerSpace,
        start: "bottom bottom",
        onEnter: () => {
          // 下スクロール時：fixedを解除し、Infoセクション直上に配置
          const infoAbsoluteY = infoSection.getBoundingClientRect().top + window.scrollY;
          const targetTop = infoAbsoluteY - window.innerHeight;

          gsap.set(fv, {
            position: "absolute",
            top: targetTop,
          });
        },
        onLeaveBack: () => {
          // 上スクロール時：トリガー空間に戻ってきたら再びfixed（CSSのデフォルト）に戻す
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
      // 看板と装飾を初期状態（OPENモード）に戻す
      setOpenMode();
    };
  });
};