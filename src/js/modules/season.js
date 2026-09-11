// =========================================================================
// season.js (四季セクションのアニメーション制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';
import { getReverseScrollAmount } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

export const initSeasonPanels = () => {
  // すべての四季セクションを取得する
  const sections = document.querySelectorAll('.p-season-panel');
  if (!sections.length) return;

  let mm = gsap.matchMedia();

  // 各セクションごとにループしてアニメーションを設定していく
  sections.forEach((section) => {
    // 冬セクションかどうか
    const isWinter = section.id === 'winter';

    // 固定＆アニメーションさせるコンテンツ
    const content = section.querySelector('.js-season-content');
    if (!content) return;

    // 装飾SVGの初期位置（-50%, -50%）をセット
    const deco = section.querySelector('.p-season-panel__deco');
    if (deco) {
      gsap.set(deco, { xPercent: -50, yPercent: -50 });
    }

    // フワッと順番に出す要素たち
    const elementsToAnimate = content.querySelectorAll('.p-season-panel__title, .p-season-panel__text, .p-season-panel__deco, .p-season-panel__image');

    const playAnimation = () => {
      gsap.fromTo(elementsToAnimate,
        {
          autoAlpha: 0,
          y: 30
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: GSAP_EASING.UI,
          overwrite: "auto",
        }
      );
    };

    const resetAnimation = () => {
      gsap.set(elementsToAnimate, {
        autoAlpha: 0,
        y: 30,
        overwrite: "auto",
      });
    };

    resetAnimation();

    mm.add({
      isPc: `(width >= ${BREAKPOINTS.LG}px)`,
      isSp: `(width < ${BREAKPOINTS.LG}px)`
    }, (context) => {
      let { isPc } = context.conditions;

      // ScrollTrigger用のid作成（例: "sectionTrigger-winter"）
      const sectionTriggerId = "sectionTrigger-" + section.id;

      const triggerConfig = {
        id: sectionTriggerId,
        trigger: section,
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: playAnimation,
        onEnterBack: isWinter ? "" : playAnimation,
        onLeave: isWinter ? "" : resetAnimation,
        onLeaveBack: resetAnimation,
      };

      if (isPc) {
        // PC用
        // x軸方向に-50%, y軸方向に25%ずらす
        gsap.set(content, { xPercent: -50, yPercent: 25 });

        // ページ全体の横スクロールTweenを取得する
        const hTween = gsap.getById("hScroll");
        if (!hTween) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            ...triggerConfig,
            containerAnimation: hTween,
            start: "left center",
            end: "right center",
          }
        });

        // セクションが左に動く分、コンテンツを右に動かして固定する
        tl.fromTo(content,
          {
            x: () => 0,
          },
          {
            x: () => getReverseScrollAmount(sectionTriggerId),
            ease: "none",
            immediateRender: false,
          },
          0
        );

      } else {
        // SP用
        // y軸方向に-25%ずらす
        gsap.set(content, { xPercent: 0, yPercent: -25 });

        // コンテンツのピン留め（固定）処理
        ScrollTrigger.create({
          ...triggerConfig,
          pin: content,
          start: "top center",
          end: "bottom center",
        });
      }

      return () => {
        gsap.set(content, { clearProps: "transform,x,y,xPercent,yPercent" });
      };
    });
  });
};