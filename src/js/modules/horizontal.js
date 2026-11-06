// =========================================================================
// horizontal.js (ページ全体の横スクロール機能モジュール)
// =========================================================================
// 役割：PC表示時における全体の横スクロール化（pin留め）と、
// 背景・前景・FVなどの「画面内に固定して見せたい要素」の逆スクロール計算を行う。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREAKPOINTS } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const initHorizontalScroll = () => {
  const scrollContainer = document.querySelector('.js-scroll-container');
  const track = document.querySelector('.js-horizontal-track');
  const foreground = document.querySelector('.js-foreground');
  const background = document.querySelector('.js-background');
  const fv = document.querySelector('.js-fv');
  const fvReverseTrigger = document.querySelector('.js-fv-reverse-trigger');

  if (!scrollContainer || !track || !foreground || !background || !fv || !fvReverseTrigger) return;

  let mm = gsap.matchMedia();

  mm.add(`(width >= ${BREAKPOINTS.LG}px)`, () => {
    // 実際に横へスクロールさせる距離（中身の幅 - 画面幅）
    const scrollWidth = () => track.clientWidth - window.innerWidth;

    /**
     * FVを固定させる（逆スクロールさせる）最大距離を計算する関数
     * @returns {number} (退店トリガーの右端までの距離) - (FVの幅)
     */
    const getFvFixedAmount = () => {
      return fvReverseTrigger.offsetLeft + fvReverseTrigger.offsetWidth - fv.offsetWidth;
    };

    // スクロールコンテナ全体をpin留めするTimeline
    const tl = gsap.timeline({
      scrollTrigger: {
        id: "hScrollTrigger",
        trigger: scrollContainer,
        pin: true,
        start: "top top",
        end: () => "+=" + scrollWidth(),
        scrub: 1, // 1秒の遅延（滑らかさ）を持たせて追従させる
        invalidateOnRefresh: true,
      }
    });

    // -----------------------------------------
    // メイントラックの横スクロールアニメーション
    // -----------------------------------------
    // 画面全体を左へ移動させることで横スクロールを表現する
    tl.to(track, {
      id: "hScroll",
      x: () => -scrollWidth(),
      ease: "none",
      duration: 1,
    }, 0);

    // -----------------------------------------
    // 前景・背景レイヤーの画面固定（逆スクロール）
    // -----------------------------------------
    // メイントラックが左へ動くのと同じ距離だけ右へ動かすことで、画面内にずっと固定されているように見せる
    tl.to([foreground, background], {
      x: () => scrollWidth(),
      ease: "none",
      duration: 1,
    }, 0);

    // -----------------------------------------
    // FV要素の画面固定（途中まで）
    // -----------------------------------------
    // 退店アニメーションが終わるトリガー空間の右端まで、FVを右へ動かして固定し続ける
    tl.to(fv, {
      x: () => getFvFixedAmount(),
      // 全体のスクロールに対する、FVを動かす距離の割合を計算して duration とする
      duration: () => getFvFixedAmount() / scrollWidth(),
      ease: "none",
    }, 0);

    // -----------------------------------------
    // クリーンアップ処理
    // -----------------------------------------
    return () => {
      // SP幅に切り替わった時など、横スクロール関連のインラインスタイルを全消去する
      gsap.set([track, foreground, background, fv], {
        clearProps: "transform"
      });
    };
  });
};