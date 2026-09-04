// =========================================================================
// fv.js (ファーストビューのスクロール連動アニメーション)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initFvAnimation = () => {
  const fv = document.querySelector('.js-fv');
  const triggerSpace = document.querySelector('.js-fv-trigger'); // 透明な空間
  const exterior = document.querySelector('.js-fv-exterior');
  const text = document.querySelector('.js-fv-text');
  const doorLeft = document.querySelector('.js-door-left');
  const doorRight = document.querySelector('.js-door-right');

  if (!fv || !triggerSpace || !exterior || !text || !doorLeft || !doorRight) return;

  // ズームの中心をドアの真ん中にセット
  gsap.set(exterior, { transformOrigin: "50% 63%" });

  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    const triggerConfig = {
      id: "fvTrigger",
      trigger: triggerSpace, // 透明な空間をスクロールしている間だけ動く
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

    // =========================================
    // スクロールに連動するタイムライン
    // =========================================
    const tl = gsap.timeline({
      defaults: {
        ease: GSAP_EASING.UI,
      },
      scrollTrigger: {
        ...triggerConfig,
        onLeave: () => {
          gsap.to(fv, {
            autoAlpha: 0,
            duration: 0.8,
            ease: GSAP_EASING.UI,
            overwrite: "auto",
            onComplete: () => {
              gsap.set(fv, {
                display: "none",
                overwrite: "auto",
              });
            },
          });
        },
        onEnterBack: () => {
          gsap.set(fv, {
            display: "block",
            autoAlpha: 1,
            overwrite: "auto",
          });
        },
      }
    });

    // =========================================
    // タイムラインの演出
    // =========================================
    // pc表示時のみのアニメーション
    if (isPc) {
      // fvTriggerのスクロール量を取得
      const getFvTriggerScrollAmount = () => {
        // 全体の横スクロールの距離を取得
        const hScrollTrigger = ScrollTrigger.getById("hScrollTrigger");
        const totalScrollAmount = hScrollTrigger.end - hScrollTrigger.start;

        // 親の横スクロールTweenの「全体の時間（duration）」を取得
        const hTween = gsap.getById("hScroll");
        const duration = hTween.duration();

        // fvTriggerのアニメーション時間を取得して、durationで割って「割合」を出す
        const fvTrigger = ScrollTrigger.getById("fvTrigger");
        const ratio = (fvTrigger.end - fvTrigger.start) / duration;

        // fvTriggerのスクロール量 = 全体の距離 * 割合
        return Math.round(totalScrollAmount * ratio);
      };

      // FV自体を逆方向にスクロールさせて固定しているように見せる
      tl.to(fv, {
        x: getFvTriggerScrollAmount,
        ease: "none",
        duration: 4.5,
      }, 0);
    }

    // スクロール開始と同時に、テキストがフワッと消える
    tl.to(text, {
      autoAlpha: 0,
      y: -30,
      duration: 1
    }, 0);

    // テキストが消え始めた直後（0.5秒）から、ドアにズームイン
    tl.to(exterior, {
      scale: 5,
      duration: 4
    }, 0.5);

    // ズームの後半（2.5秒目）、ドアが開く
    tl.to(doorLeft, {
      x: -250,
      duration: 2
    }, 2.5);
    tl.to(doorRight, {
      x: 250,
      duration: 2
    }, 2.5);
  });

};