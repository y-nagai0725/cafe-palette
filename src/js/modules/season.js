// =========================================================================
// season.js (四季セクションのアニメーション制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS } from '../utils/constants';
import { getReverseScrollAmount } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

export const initSeasonPanels = () => {
  // すべての四季セクションを取得する
  const sections = document.querySelectorAll('.js-season-panel');
  const sectionContents = document.querySelectorAll('.js-season-content');
  if (!sections.length || !sectionContents.length) return;

  // =========================================
  // ScrollTrigger 連動設定 (PC / SP 振り分け)
  // =========================================
  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`
  }, (context) => {
    let { isPc } = context.conditions;

    // PC時はページ全体の横スクロールTweenを取得する
    const hTween = isPc ? gsap.getById("hScroll") : undefined;
    if (isPc && !hTween) return;

    // 各セクションごとにループしてアニメーションを設定していく
    sections.forEach((section) => {
      const content = section.querySelector('.js-season-content');
      const contentText = section.querySelector('.js-season-text');
      const contentImage = section.querySelector('.js-season-image');

      if (!content || !contentText || !contentImage) return;

      // -----------------------------------------
      // 1. ポップアップ＆ふわふわアニメーションの作成
      // -----------------------------------------
      const animationTl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "elastic.out(1, 0.7)"
        }
      });

      animationTl
        .fromTo(contentImage,
          { scale: 0, rotation: -25, y: 40, autoAlpha: 0 },
          { scale: 1, rotation: 0, y: 0, autoAlpha: 1, duration: 1 }
        )
        .fromTo(contentText,
          { scale: 0, y: 30, autoAlpha: 0 },
          { scale: 1, y: 0, autoAlpha: 1, duration: 0.8 },
          "-=0.6"
        )
        .to([contentImage, contentText], {
          y: -8,
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });

      // 再生処理：常に先頭から再生し直す
      const playAnimation = () => animationTl.restart();

      // リセット処理：タイムラインの0秒地点（初期状態）に巻き戻して一時停止
      const resetAnimation = () => animationTl.pause(0);

      // -----------------------------------------
      // 2. コンテンツの初期位置調整 (PC / SP)
      // -----------------------------------------
      gsap.set(content, {
        xPercent: isPc ? -50 : 0,
        yPercent: isPc ? 25 : -10,
      });

      // -----------------------------------------
      // 3. ScrollTriggerの設定（固定 ＆ 再生制御）
      // -----------------------------------------
      // ScrollTrigger用のid作成（例: "sectionTrigger-spring"）
      const sectionTriggerId = `sectionTrigger-${section.id}`;

      const triggerConfig = {
        id: sectionTriggerId,
        trigger: section,
        containerAnimation: hTween,
        start: isPc ? "left center" : "top center",
        end: isPc ? "right center" : "bottom center",
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: playAnimation,
        onEnterBack: playAnimation,
        onLeave: resetAnimation,
        onLeaveBack: resetAnimation,
      };

      if (isPc) {
        // PC用：セクションが左に動く分、コンテンツを右に動かして疑似固定する
        gsap.fromTo(content, {
          x: 0,
        }, {
          x: () => getReverseScrollAmount(sectionTriggerId),
          ease: "none",
          scrollTrigger: triggerConfig,
        });
      } else {
        // SP用：標準のpin機能でコンテンツをピン留め（固定）する
        ScrollTrigger.create({
          ...triggerConfig,
          pin: content,
        });
      }
    });

    return () => {
      // pin機能でのtransform設定をリセット
      gsap.set(sectionContents, { clearProps: "transform" });
    };
  });
};