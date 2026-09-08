// =========================================================================
// exit.js (冬セクションからのディープズーム退店アニメーション)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS } from '../utils/constants';
import { getReverseScrollAmount } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

export const initExitAnimation = () => {
  const triggerSpace = document.querySelector('.js-exit-trigger');
  const winterSection = document.querySelector('#winter');
  const winterSectionBg = winterSection?.querySelector('.p-season-panel__bg');
  const messageSection = document.querySelector('#message');
  const messageSectionBg = messageSection?.querySelector('.p-message__bg');
  const zoomTarget = document.querySelector('.js-zoom-target');
  const content = winterSection?.querySelector('.p-season-panel__content');
  const contentTitle = winterSection?.querySelector('.p-season-panel__title');
  const contentText = winterSection?.querySelector('.p-season-panel__text');
  const contentDummyImg = winterSection?.querySelector('.p-season-panel__dummy-img');

  if (!triggerSpace || !winterSection || !messageSection || !zoomTarget) return;

  const winterSectionBgColor = window.getComputedStyle(winterSectionBg).backgroundColor;
  const messageSectionBgColor = window.getComputedStyle(messageSectionBg).backgroundColor;

  // winterセクションの背景色をセット
  gsap.set(triggerSpace, {
    backgroundColor: winterSectionBgColor,
  });

  // ズームの中心をカップの真ん中にセット
  gsap.set(zoomTarget, { transformOrigin: "50% 50%" });

  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    const triggerConfig = {
      id: "exitTrigger",
      trigger: triggerSpace,
      scrub: true,
      invalidateOnRefresh: true,
    };

    if (isPc) {
      const hTween = gsap.getById("hScroll");
      if (!hTween) return;
      triggerConfig.containerAnimation = hTween;
      triggerConfig.start = "left center";
      triggerConfig.end = "right left";
    } else {
      triggerConfig.pin = content;
      triggerConfig.start = "top center";
      triggerConfig.end = "bottom top";
    }

    const tl = gsap.timeline({
      scrollTrigger: triggerConfig
    });

    if (isPc) {
      // コーヒーカップを画面に留めるために逆スクロールさせる
      tl.fromTo(content,
        {
          x: () => window.innerWidth
        },
        {
          x: () => window.innerWidth + getReverseScrollAmount("exitTrigger"),
          ease: "none",
          duration: 4,
          immediateRender: false,
        },
        0
      );
    }

    // コーヒーカップ以外のコンテンツをフワッと消す
    tl.to([contentTitle, contentText, contentDummyImg], {
      autoAlpha: 0,
      scale: 0.8,
      duration: 0.5,
      overwrite: "auto",
    }, 0);

    // コーヒーカップを画面全体を覆うまで超巨大化させる
    tl.to(zoomTarget, {
      scale: 80,
      duration: 4,
      ease: "power2.in",
    }, 0);

    // 画面が完全にSVGのコーヒー色で覆われたタイミング（3秒目）で、
    // 裏側のトリガー空間の背景色をMessageセクションと同じ色に切り替える
    tl.set(triggerSpace, {
      backgroundColor: messageSectionBgColor
    }, 3);

    // アニメーション完了時（4秒目）に、巨大化したSVGを非表示にする
    tl.set(zoomTarget, {
      autoAlpha: 0
    }, 4);

    return () => {
      gsap.set(content, { clearProps: "transform,x,y,xPercent,yPercent" });
    };
  });
};