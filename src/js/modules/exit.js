// =========================================================================
// exit.js (冬セクションからのコーヒーカップへのディープズームアニメーション)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initExitAnimation = () => {
  const triggerSpace = document.querySelector('.js-season-exit-trigger');
  const foreground = document.querySelector('.js-foreground');

  if (!triggerSpace || !foreground) return;

  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    const triggerConfig = {
      trigger: triggerSpace,
      scrub: true,
    };

    if (isPc) {
      const hTween = gsap.getById("hScroll");
      if (!hTween) return;

      triggerConfig.containerAnimation = hTween;
      triggerConfig.start = "left center";
      triggerConfig.end = "right left";
    } else {
      triggerConfig.start = "top center";
      triggerConfig.end = "bottom top";
    }

    const tl = gsap.timeline({
      scrollTrigger: triggerConfig,
    });

    // 前景レイヤーのコーヒーカップ（のコーヒー部分）を中心にする
    gsap.set(foreground, {
      transformOrigin: isPc ? "50% 76%" : "50% 67.4%",
    });

    tl.fromTo(foreground, {
      scale: 1,
    }, {
      scale: isPc ? 150 : 300,
      ease: "expo.in",
    }, 0);

    return () => {
      // TODO クリーンアップ処理必要ならば書く
    };
  });
};