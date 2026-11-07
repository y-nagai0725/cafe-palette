// =========================================================================
// exit.js (冬セクションからのコーヒーカップへのディープズームアニメーション)
// =========================================================================
// 役割：全季節（春〜冬）を巡った後、テーブル上のコーヒーカップへ向かって
// 前景レイヤー全体を拡大（ディープズーム）させ、画面全体を
// コーヒー色で満たすことで次のMessageセクションへシームレスに繋げる。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

/**
 * コーヒーカップへのディープズームアニメーション初期化関数
 */
export const initExitAnimation = () => {
  // DOM要素の取得
  const triggerSpace = document.querySelector('.js-season-exit-trigger');
  const foreground = document.querySelector('.js-foreground');

  if (!triggerSpace || !foreground) return;

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

    // 拡大の中心点（transformOrigin）を前景レイヤー内の「コーヒーカップの中央」にセット
    gsap.set(foreground, {
      transformOrigin: isPc ? "50% 76%" : "50% 67.4%",
    });

    // スクロール連動でコーヒーカップの中へ吸い込まれるようにディープズーム
    // ※後半で一気に加速する "expo.in" を使い、画面全体をカップ内のコーヒー色で覆い尽くす
    gsap.fromTo(foreground, {
      scale: 1,
    }, {
      scale: isPc ? 150 : 300,
      ease: "expo.in",
      scrollTrigger: {
        trigger: triggerSpace,
        containerAnimation: hTween,
        start: isPc ? "left center" : "top center",
        end: isPc ? "right left" : "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      }
    });
  });
};