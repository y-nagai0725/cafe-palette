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

  if (!fv || !triggerSpace || !reverseTriggerSpace || !exterior || !text || !doorSp || !doorPc) return;

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

  // 初期状態としてOPENモードを適用しておく
  setOpenMode();

  let mm = gsap.matchMedia();

  // =========================================
  // 入店アニメーション
  // =========================================
  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    // ズームの中心を入口（右のドア付近）にセット
    if (isPc) {
      gsap.set(exterior, { transformOrigin: "37% 70%" });
    } else {
      gsap.set(exterior, { transformOrigin: "80% 70%" });
    }

    // ドアの右端を回転の軸にする
    gsap.set([doorPc, doorSp], {
      transformOrigin: "right center",
    });

    const triggerConfig = {
      trigger: triggerSpace,
      scrub: true,
      invalidateOnRefresh: true,
    };

    if (isPc) {
      const hTween = gsap.getById("hScroll");
      if (!hTween) return;
      triggerConfig.containerAnimation = hTween;
      triggerConfig.start = "left left";
      triggerConfig.end = "right center";
    } else {
      triggerConfig.start = "top top";
      triggerConfig.end = "bottom center";
    }

    const tl = gsap.timeline({
      defaults: {
        ease: GSAP_EASING.UI,
      },
      scrollTrigger: {
        ...triggerConfig,
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
    tl.fromTo(text, {
      autoAlpha: 1,
      y: 0,
    }, {
      autoAlpha: 0,
      y: -30,
      duration: 1
    }, 0);

    // テキストが消え始めた直後（0.5秒）から、ドアにズームイン
    tl.fromTo(exterior, {
      scale: 1,
    }, {
      scale: isPc ? 3.5 : 2,
      duration: 4
    }, 0.5);

    // ドアを開く
    tl.fromTo([doorPc, doorSp], {
      scaleX: 1,
      autoAlpha: 1,
    }, {
      scaleX: 0,
      autoAlpha: 0,
      duration: 3,
      ease: "power1.inOut"
    }, 1);

    return () => {
      gsap.set([exterior, doorPc, doorSp, text, fv], {
        clearProps: "all"
      });
    };
  });

  // =========================================
  // 退店アニメーション
  // =========================================
  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    const triggerConfig = {
      trigger: reverseTriggerSpace,
      scrub: true,
      invalidateOnRefresh: true,
    };

    if (isPc) {
      const hTween = gsap.getById("hScroll");
      if (!hTween) return;
      triggerConfig.containerAnimation = hTween;
      triggerConfig.start = "left right";
      triggerConfig.end = "right left";
    } else {
      triggerConfig.start = "top bottom";
      triggerConfig.end = "bottom top";
    }

    const tl = gsap.timeline({
      defaults: {
        ease: GSAP_EASING.UI,
        immediateRender: false, // 読み込み時に退店のfrom状態で上書きされるのを防ぐ
      },
      scrollTrigger: {
        ...triggerConfig,
        onEnter: () => {
          setCloseMode();
          showFv();
        },
        onLeave: hideFv,
        onEnterBack: () => {
          setCloseMode();
          showFv();
        },
        onLeaveBack: hideFv,
      }
    });

    // ズームアウト
    tl.fromTo(exterior, {
      scale: isPc ? 3.5 : 2,
    }, {
      scale: 1,
      duration: 4
    }, 0);

    // ドアを閉じる
    tl.fromTo([doorPc, doorSp], {
      scaleX: 0,
      autoAlpha: 0,
    }, {
      scaleX: 1,
      autoAlpha: 1,
      duration: 3,
      ease: "power1.inOut"
    }, 0.5);

    // テキストがフワッと現れる
    tl.fromTo(text, {
      autoAlpha: 0,
      y: -30,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 1
    }, 3.5);

    return () => {
      gsap.set([exterior, doorPc, doorSp, text, fv], {
        clearProps: "all"
      });
    };
  });
};