// =========================================================================
// message.js (Messageセクションのアニメーション制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initMessage = () => {
  const messageSection = document.querySelector('.p-message');
  const text = document.querySelector('.js-fade-text');

  if (!messageSection  || !text) return;

  gsap.set(text, { autoAlpha: 0 });

  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`,
  }, (context) => {
    const { isPc } = context.conditions;

    const showText = gsap.fromTo(text,
      {
        autoAlpha: 0,
        y: 30
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.5,
        ease: GSAP_EASING.UI,
      }
    );

    const triggerConfig = {
      trigger: messageSection,
      animation: showText,
      toggleActions: 'play none none reverse',
    };

    if (isPc) {
      const hTween = gsap.getById('hScroll');

      ScrollTrigger.create({
        ...triggerConfig,
        containerAnimation: hTween,
        start: 'left center',
      });

    } else {
      ScrollTrigger.create({
        ...triggerConfig,
        start: 'top center',
      });
    }
  });
};