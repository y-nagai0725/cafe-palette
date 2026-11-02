// =========================================================================
// opening.js (オープニングアニメーション制御モジュール)
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

export const initOpening = async () => {
  const opening = document.querySelector('.js-opening');

  // もし要素がなければ、念のためスクロール禁止だけ解除して終了
  if (!opening) {
    document.body.classList.remove('is-noscroll');
    return;
  }

  // OP用のcircle要素のみをMorphSVGで操作可能にするためpathへ変換
  MorphSVGPlugin.convertToPath('.js-opening-circle');

  // アニメーション対象要素取得
  const circleWraps = document.querySelectorAll('.js-opening-circle-wrap');
  const circleElements = document.querySelectorAll('.js-opening-circle');

  // morphSVGによる変形先のpath要素(「Cafe Palette」の文字)
  const titlePaths = document.querySelectorAll('.js-opening-title-path');

  // 確実にスクロール禁止にしておく＆リロード時に一番上へ戻しておく
  document.body.classList.add('is-noscroll');
  window.scrollTo(0, 0);

  // 初期設定
  gsap.set(circleWraps, {
    transformOrigin: '50% 50%',
  });

  // =========================================
  // ローディングアニメーション（無限ループ演出）
  // =========================================
  const loadingTl = gsap.timeline({
    repeat: -1,
  });

  loadingTl.fromTo(circleWraps, {
    rotation: 0
  }, {
    rotation: 360,
    duration: 1.5,
    stagger: 0.02,
    ease: 'power4.inOut',
  }, 0).fromTo(circleElements, {
    scale: 1,
    autoAlpha: 1
  }, {
    keyframes: {
      scale: [1, 0.66, 1],
      autoAlpha: [1, 0.66, 1],
    },
    duration: 1.5,
    stagger: 0.02,
    ease: 'power4.inOut',
  }, 0);

  // =========================================
  // 読み込み完了 ＆ 最低待機時間（1.5秒） ＆ ループの区切りを待つ
  // =========================================

  // ページのloadイベント完了を待つPromise
  const waitLoad = new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve, { once: true });
    }
  });

  // 最低限表示させる時間（1.5秒）を待つPromise
  const waitMinTime = new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  // ページ読み込み完了と最低表示時間の両方が終わるまで待機
  await Promise.all([waitLoad, waitMinTime]);

  // 現在再生中のローディングアニメーションが1周の区切り（onRepeat）に来るまで待って停止
  await new Promise((resolve) => {
    loadingTl.eventCallback('onRepeat', () => {
      loadingTl.pause();
      resolve();
    });
  });

  // =========================================
  // タイトル表示とOP要素フェードアウトアニメーション
  // =========================================
  const displayTitleTl = gsap.timeline();

  await displayTitleTl.to(circleElements, {
    morphSVG: (index) => titlePaths[index],
    duration: 0.3,
    stagger: 0.1,
    ease: 'back.out(2.5)',
  }).fromTo(opening, {
    clipPath: 'circle(100% at 50% 50%)'
  }, {
    clipPath: 'circle(0% at 50% 50%)',
    duration: 0.6,
    ease: GSAP_EASING.UI,
  }, "+=0.4");

  // =========================================
  // アニメーション完了後の後片付け（非表示化 ＆ スクロール解除）
  // =========================================
  gsap.set(opening, { display: 'none' });

  // スクロール禁止を解除
  document.body.classList.remove('is-noscroll');

  // スクロールバーの表示等でレイアウトが変わる可能性があるため、ScrollTriggerを再計算
  ScrollTrigger.refresh();
};