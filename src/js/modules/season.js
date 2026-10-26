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
  const sections = document.querySelectorAll('.js-season-panel');
  if (!sections.length) return;

  let mm = gsap.matchMedia();

  // 各セクションごとにループしてアニメーションを設定していく
  sections.forEach((section) => {
    // 固定用の親コンテナ
    const content = section.querySelector('.js-season-content');
    if (!content) return;

    // アニメーションさせる中身（テキストと画像）
    const contentText = content.querySelector('.js-season-text');
    const contentImage = content.querySelector('.js-season-image');

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
    const playAnimation = () => {
      animationTl.restart();
    };

    // リセット処理：タイムラインの0秒地点（初期状態）に巻き戻して一時停止
    const resetAnimation = () => {
      animationTl.pause(0);
      gsap.set([contentImage, contentText], { autoAlpha: 0 });
    };

    // 初期設定
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
        onEnterBack: playAnimation,
        onLeave: resetAnimation,
        onLeaveBack: resetAnimation,
      };

      if (isPc) {
        // PC用：x軸方向に-50%, y軸方向に25%ずらす
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
        // SP用：y軸方向に-10%ずらす
        gsap.set(content, { xPercent: 0, yPercent: -10 });

        // コンテンツのピン留め（固定）処理
        ScrollTrigger.create({
          ...triggerConfig,
          pin: content,
          start: "top center",
          end: "bottom center",
        });
      }

      return () => {
        // ブレイクポイント切り替え時は親の位置スタイルをクリアし、中身をリセット状態に戻す
        gsap.set(content, {
          clearProps: "all"
        });
        resetAnimation();
      };
    });
  });
};