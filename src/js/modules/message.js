// =========================================================================
// message.js (Messageセクションのアニメーション制御モジュール)
// =========================================================================
// 役割：ディープズーム直後のMessageセクションにおいて、背景の湯気（MorphSVG）の
// 無限ループ再生と、スクロール進行度（progress）に応じた湯気・テキストの
// 時間差フェードイン演出、および画面固定制御を一括管理する。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { BREAKPOINTS, GSAP_EASING } from '../utils/constants';
import { getReverseScrollAmount } from '../utils/scroll';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

/**
 * Messageセクションのアニメーション初期化関数
 */
export const initMessage = () => {
  // DOM要素の取得
  const messageSection = document.querySelector('.js-section-message');
  const triggerSpace = document.querySelector('.js-message-trigger');
  const text = document.querySelector('.js-message-text');
  const steam = document.querySelector('.js-steam');
  const steamWave = document.querySelector('.js-steam-wave');

  if (!messageSection || !triggerSpace || !text || !steam || !steamWave) return;

  // =========================================
  // 共通ヘルパー関数
  // =========================================

  /**
   * Messageセクション全体を表示する
   */
  const showMessageSection = () => {
    gsap.set(messageSection, {
      autoAlpha: 1,
      overwrite: "auto",
    });
  };

  /**
   * Messageセクション全体を非表示にする
   */
  const hideMessageSection = () => {
    gsap.set(messageSection, {
      autoAlpha: 0,
      overwrite: "auto",
    });
  };

  // =========================================
  // 常時再生アニメーション（PC/SP共通・無限ループ）
  // =========================================
  // 背景の湯気パスをゆらゆらと変形させ続ける
  gsap.to(steamWave, {
    morphSVG: "#steam-wave-target",
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: GSAP_EASING.FLOAT,
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

    // PC表示時はページ全体の横スクロールTweenを取得する
    const hTween = isPc ? gsap.getById('hScroll') : undefined;
    if (isPc && !hTween) return;

    // テキストの初期位置を少し下げておく（下からフワッと浮かび上がらせるため）
    gsap.set(text, { y: 30 });

    // スクロール進行度に応じたアニメーションの重複発火を防ぐ状態管理フラグ
    let isSteamVisible = false;
    let isTextVisible = false;

    /**
     * PC / SP 共通のScrollTrigger設定
     * ※湯気やテキストはスクロール量に直結（scrub）させるのではなく、
     *  一定の進行度を超えた瞬間に固有のアニメーションで再生させる。
     * @type {Object}
     */
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

        // 湯気（steam）の表示・非表示判定 (進行度が 0.2 を境に切り替える)
        if (p > 0.2 && !isSteamVisible) {
          gsap.to(steam, {
            autoAlpha: 0.1,
            duration: 1.6,
            ease: GSAP_EASING.UI,
            overwrite: "auto"
          });
          isSteamVisible = true;
        } else if (p <= 0.2 && isSteamVisible) {
          gsap.to(steam, {
            autoAlpha: 0,
            duration: 0.8,
            ease: GSAP_EASING.UI,
            overwrite: "auto"
          });
          isSteamVisible = false;
        }

        // テキスト（text）の表示・非表示判定 (進行度が 0.5 を境に切り替える)
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
      // PC用：トリガー空間を通過する間、Messageセクションを右へ逆スクロールさせて画面に疑似固定する
      gsap.fromTo(messageSection, {
        x: 0,
      }, {
        x: () => getReverseScrollAmount("messageTrigger"),
        ease: "none",
        scrollTrigger: triggerConfig,
      });
    } else {
      // SP用：標準のpin機能でセクションをピン留め（固定）する
      // ※後続のトリガー空間（.js-message-trigger）自体がスクロール余白を持つため pinSpacing は false にする
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
      // onUpdate内で動的に生成された進行中の単発Tweenを停止
      gsap.killTweensOf([steam, text]);
      // 動的に変更されたスタイルとpinのtransformをクリアし、CSSの初期状態に戻す
      gsap.set([messageSection, steam, text], {
        clearProps: "opacity,visibility,transform"
      });
    };
  });
};