// =========================================================================
// exit.js (冬セクションからのコーヒーカップへのディープズームアニメーション)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS } from '../utils/constants';

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

    // PC時は横スクロールTweenを取得する
    const hTween = isPc ? gsap.getById("hScroll") : undefined;
    if (isPc && !hTween) return;

    // 前景レイヤーのコーヒーカップを中心にする
    gsap.set(foreground, {
      transformOrigin: isPc ? "50% 76%" : "50% 67.4%",
    });

    // スクロール連動でコーヒーカップへズーム
    gsap.fromTo(foreground, {
      scale: 1,
    }, {
      scale: isPc ? 150 : 300,
      ease: "expo.in",
      scrollTrigger: {
        trigger: triggerSpace,
        containerAnimation: hTween,
        start: isPc ? "left center" : "top center",
        end: isPc ? "right left" : "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      }
    });
  });
};