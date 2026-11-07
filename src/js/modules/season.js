// =========================================================================
// season.js (四季セクションのアニメーション制御モジュール)
// =========================================================================
// 役割：各季節セクション（春・夏・秋・冬）において、スクロールに応じた
// メニュー画像とテキストの画面中央への固定表示、および
// 弾むようなポップアップ登場〜ふわふわ漂う無限ループ演出を一括管理する。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';
import { getReverseScrollAmount } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger);

/**
 * 四季セクション（パネル）のアニメーション初期化関数
 */
export const initSeasonPanels = () => {
  // すべての四季セクションとコンテンツ枠を取得する
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

    // PC表示時はページ全体の横スクロールTweenを取得する
    const hTween = isPc ? gsap.getById("hScroll") : undefined;
    if (isPc && !hTween) return;

    // 各季節セクションごとにループしてアニメーションとScrollTriggerを設定する
    sections.forEach((section) => {
      const content = section.querySelector('.js-season-content');
      const contentText = section.querySelector('.js-season-text');
      const contentImage = section.querySelector('.js-season-image');

      if (!content || !contentText || !contentImage) return;

      // -----------------------------------------
      // ポップアップ登場 ＆ ふわふわ無限ループアニメーションの作成
      // -----------------------------------------
      // ※親要素（content）はスクロール固定用のtransformで使用するため、
      // 干渉を防ぐ目的で子要素（contentImage, contentText）を直接アニメーションさせる。
      const animationTl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "elastic.out(1, 0.7)" // 弾むように飛び出すイージング
        }
      });

      animationTl
        // メニュー画像：少し傾いた状態から回転しつつポップアップ
        .fromTo(contentImage,
          { scale: 0, rotation: -25, y: 40, autoAlpha: 0 },
          { scale: 1, rotation: 0, y: 0, autoAlpha: 1, duration: 1 }
        )
        // テキスト：画像の登場に少し重ねて（0.6秒前から）ポップアップ
        .fromTo(contentText,
          { scale: 0, y: 30, autoAlpha: 0 },
          { scale: 1, y: 0, autoAlpha: 1, duration: 0.8 },
          "-=0.6"
        )
        // 登場完了後、そのまま画像とテキストを上下にふわふわ揺らす無限ループへ移行
        .to([contentImage, contentText], {
          y: -8,
          duration: 1.6,
          ease: GSAP_EASING.FLOAT,
          yoyo: true,
          repeat: -1
        });

      /**
       * セクション進入時にアニメーションを先頭から再生する
       */
      const playAnimation = () => animationTl.restart();

      /**
       * セクション退出時にアニメーションを0秒地点（非表示の初期状態）へ巻き戻して停止する
       */
      const resetAnimation = () => animationTl.pause(0);

      // -----------------------------------------
      // コンテンツ枠（content）の初期位置調整 (PC / SP)
      // -----------------------------------------
      gsap.set(content, {
        xPercent: isPc ? -50 : 0,
        yPercent: isPc ? 25 : -10,
      });

      // -----------------------------------------
      // ScrollTriggerの設定（画面固定 ＆ 再生制御）
      // -----------------------------------------
      // 逆スクロール量の計算（getReverseScrollAmount）で参照するための固有ID（例: "sectionTrigger-spring"）
      const sectionTriggerId = `sectionTrigger-${section.id}`;

      /**
       * PC / SP 共通のScrollTrigger基本設定
       * @type {Object}
       */
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
        // PC用：containerAnimation内では標準のpinが使えないため、
        // セクションが左へ動く分だけコンテンツを右へ逆スクロールさせて画面内に疑似固定する
        gsap.fromTo(content, {
          x: 0,
        }, {
          x: () => getReverseScrollAmount(sectionTriggerId),
          ease: "none",
          scrollTrigger: triggerConfig,
        });
      } else {
        // SP用：通常の縦スクロールのため、標準のpin機能でコンテンツを画面内にピン留め（固定）する
        ScrollTrigger.create({
          ...triggerConfig,
          pin: content,
        });
      }
    });

    // -----------------------------------------
    // クリーンアップ処理（ブレイクポイント切り替え時）
    // -----------------------------------------
    return () => {
      // pin機能や逆スクロールで付与されたtransform設定をリセット
      gsap.set(sectionContents, { clearProps: "transform" });
    };
  });
};