// =========================================================================
// message.js (Messageセクションのアニメーション制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS } from '../utils/constants';
import { getReverseScrollAmount } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

export const initMessage = () => {
  const messageSection = document.querySelector('.p-message');
  const triggerSpace = document.querySelector('.js-message-trigger');
  const text = document.querySelector('.js-fade-text');
  const steam = messageSection?.querySelector('.p-message__bg svg');

  if (!messageSection || !triggerSpace || !text || !steam) return;

  // 初期状態をセット
  gsap.set(steam, { autoAlpha: 0 });
  gsap.set(text, { autoAlpha: 0, y: 30 });

  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`,
  }, (context) => {
    const { isPc } = context.conditions;

    // 表示判定フラグ
    let isSteamVisible = false;
    let isTextVisible = false;

    const triggerConfig = {
      id: "messageTrigger",
      trigger: triggerSpace,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // 進行度
        const p = self.progress;

        // 湯気（steam）の表示判定 (進行度が 0.2 を超えたら発火)
        if (p > 0.2 && !isSteamVisible) {
          gsap.to(steam, {
            autoAlpha: 0.1,
            duration: 1.6,
            ease: "power1.inOut",
            overwrite: "auto"
          });
          isSteamVisible = true;
        } else if (p <= 0.2 && isSteamVisible) {
          gsap.to(steam, {
            autoAlpha: 0,
            duration: 0.8,
            overwrite: "auto"
          });
          isSteamVisible = false;
        }

        // テキスト（text）の表示判定 (進行度が 0.5 を超えたら発火)
        if (p > 0.5 && !isTextVisible) {
          gsap.to(text, {
            autoAlpha: 1,
            y: 0,
            duration: 1.6,
            ease: "power2.out",
            overwrite: "auto"
          });
          isTextVisible = true;
        } else if (p <= 0.5 && isTextVisible) {
          gsap.to(text, {
            autoAlpha: 0,
            y: 30,
            duration: 0.8,
            overwrite: "auto"
          });
          isTextVisible = false;
        }
      }
    };

    if (isPc) {
      const hTween = gsap.getById('hScroll');
      if (!hTween) return;
      triggerConfig.containerAnimation = hTween;
      triggerConfig.start = 'left right';
      triggerConfig.end = 'right right';
    } else {
      triggerConfig.pin = messageSection;
      triggerConfig.pinSpacing = false;
      triggerConfig.start = 'top bottom';
      triggerConfig.end = 'bottom bottom';
    }

    const tl = gsap.timeline({
      scrollTrigger: triggerConfig
    });

    if (isPc) {
      // Messageセクションを逆スクロールさせて画面に固定する
      tl.fromTo(messageSection,
        {
          x: () => 0,
        },
        {
          x: () => getReverseScrollAmount("messageTrigger"),
          ease: "none",
          immediateRender: false,
          duration: 1,
        },
        0
      );
    }

    return () => {
      gsap.set(messageSection, { clearProps: "transform,x,y" });
    };
  });
};