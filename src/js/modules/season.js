// =========================================================================
// season.js (四季セクションのアニメーション制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initSeasonPanels = () => {
  // すべての四季セクションを取得する
  const sections = document.querySelectorAll('.p-season-panel');
  if (!sections.length) return;

  let mm = gsap.matchMedia();

  // 各セクションごとにループしてアニメーションを設定していく
  sections.forEach((section) => {
    // 固定＆アニメーションさせるコンテンツ
    const content = section.querySelector('.js-season-content');
    if (!content) return;

    // フワッと順番に出す要素たち
    const elementsToAnimate = content.querySelectorAll('.p-season-panel__title, .p-season-panel__text, .p-season-panel__dummy-img');

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
          ease: GSAP_EASING.UI
        }
      );
    };

    const resetAnimation = () => {
      gsap.set(elementsToAnimate, {
        autoAlpha: 0,
        y: 30
      });
    };

    resetAnimation();

    mm.add({
      isPc: `(width >= ${BREAKPOINTS.LG}px)`,
      isSp: `(width < ${BREAKPOINTS.LG}px)`
    }, (context) => {
      let { isPc } = context.conditions;

      if (isPc) {
        // PC用
        const hTween = gsap.getById("hScroll");
        if (!hTween) return;

        const pinTween = gsap.to(content, {
          // セクションが左に動く分、コンテンツを右に動かして固定する
          x: () => window.innerWidth,
          ease: "none"
        });

        ScrollTrigger.create({
          trigger: section,
          containerAnimation: hTween,
          animation: pinTween, // 作った逆スクロールTweenを紐付ける
          start: "left left",
          end: "right left",
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: playAnimation,
          onEnterBack: playAnimation,
          onLeave: resetAnimation,
          onLeaveBack: resetAnimation,
        });
      } else {
        // SP用：コンテンツのピン留め（固定）処理
        ScrollTrigger.create({
          trigger: section,
          pin: content, // コンテンツ（.js-season-content）を固定する
          start: "top top",
          end: "bottom top",
          onEnter: playAnimation,
          onEnterBack: playAnimation,
          onLeave: resetAnimation,
          onLeaveBack: resetAnimation,
        });
      }
    });
  });
};