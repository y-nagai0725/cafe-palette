// =========================================================================
// message.js (Messageセクションのアニメーション制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';
import { getReverseScrollAmount } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

export const initMessage = () => {
  const messageSection = document.querySelector('.js-section-message');
  const triggerSpace = document.querySelector('.js-message-trigger');
  const text = document.querySelector('.js-message-text');
  const steam = document.querySelector('.js-steam');
  const steamWave = document.querySelector('.js-steam-wave');

  if (!messageSection || !triggerSpace || !text || !steam || !steamWave) return;

  // =========================================
  // 共通ヘルパー関数
  // =========================================

  // Messageセクションを表示する
  const showMessageSection = () => {
    gsap.set(messageSection, {
      autoAlpha: 1,
      overwrite: "auto",
    });
  };

  // Messageセクションを非表示にする
  const hideMessageSection = () => {
    gsap.set(messageSection, {
      autoAlpha: 0,
      overwrite: "auto",
    });
  };

  // =========================================
  // 常時再生アニメーション（PC/SP共通）
  // =========================================
  // 背景の湯気をゆらゆら変形させ続ける
  gsap.to(steamWave, {
    morphSVG: "#steam-wave-target",
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // =========================================
  // ScrollTrigger 連動設定 (PC / SP 振り分け)
  // =========================================
  let mm = gsap.matchMedia();

  mm.add({
    isPc: `(width >= ${BREAKPOINTS.LG}px)`,
    isSp: `(width < ${BREAKPOINTS.LG}px)`,
  }, (context) => {
    const { isPc } = context.conditions;

    // PC時はページ全体の横スクロールTweenを取得する
    const hTween = isPc ? gsap.getById('hScroll') : undefined;
    if (isPc && !hTween) return;

    // 初期状態をセット
    gsap.set(text, { y: 30 });

    // 表示判定フラグ
    let isSteamVisible = false;
    let isTextVisible = false;

    const triggerConfig = {
      id: "messageTrigger",
      trigger: triggerSpace,
      containerAnimation: hTween,
      start: isPc ? "left right" : "top bottom",
      end: isPc ? "right right" : "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onEnter: showMessageSection,
      onLeave: hideMessageSection,
      onEnterBack: showMessageSection,
      onLeaveBack: hideMessageSection,
      onUpdate: (self) => {
        const p = self.progress;

        // 湯気（steam）の表示判定 (進行度が 0.2 を超えたら発火)
        if (p > 0.2 && !isSteamVisible) {
          gsap.to(steam, {
            autoAlpha: 0.1,
            duration: 1.6,
            ease: GSAP_EASING.SMOOTH,
            overwrite: "auto"
          });
          isSteamVisible = true;
        } else if (p <= 0.2 && isSteamVisible) {
          gsap.to(steam, {
            autoAlpha: 0,
            duration: 0.8,
            ease: GSAP_EASING.SMOOTH,
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
            ease: GSAP_EASING.UI,
            overwrite: "auto"
          });
          isTextVisible = true;
        } else if (p <= 0.5 && isTextVisible) {
          gsap.to(text, {
            autoAlpha: 0,
            y: 30,
            duration: 0.8,
            ease: GSAP_EASING.UI,
            overwrite: "auto"
          });
          isTextVisible = false;
        }
      }
    };

    if (isPc) {
      // PC用：Messageセクションを逆スクロールさせて画面に疑似固定する
      gsap.fromTo(messageSection, {
        x: 0,
      }, {
        x: () => getReverseScrollAmount("messageTrigger"),
        ease: "none",
        scrollTrigger: triggerConfig,
      });
    } else {
      // SP用：標準のpin機能でセクションをピン留め（固定）する
      ScrollTrigger.create({
        ...triggerConfig,
        pin: messageSection,
        pinSpacing: false,
      });
    }

    // -----------------------------------------
    // クリーンアップ処理（ブレイクポイント切り替え時）
    // -----------------------------------------
    return () => {
      // onUpdate内で動的に生成された進行中のTweenを停止
      gsap.killTweensOf([steam, text]);
      // 動的に変更されたスタイルとpinのtransformをクリアし、CSSの初期状態に戻す
      gsap.set([messageSection, steam, text], {
        clearProps: "opacity,visibility,transform"
      });
    };
  });
};