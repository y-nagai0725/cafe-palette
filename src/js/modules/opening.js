// =========================================================================
// opening.js (オープニングアニメーション制御モジュール)
// =========================================================================
// 役割：ページ読み込み完了（load）と最低表示時間（1.5秒）の両方を待機し、
// ローディング演出からタイトル変形・幕開け演出へのスムーズな遷移と、
// 完了後のスクロールロック解除・ScrollTriggerの再計算を行う。
// =========================================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { GSAP_EASING } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

/**
 * オープニングアニメーションの初期化・実行関数
 */
export const initOpening = async () => {
  const opening = document.querySelector('.js-opening');

  // もし要素がなければ、念のためスクロール禁止だけ解除して終了
  if (!opening) {
    document.body.classList.remove('is-noscroll');
    return;
  }

  // OP用のcircle要素のみをMorphSVGで操作可能にするためpath要素へ変換
  MorphSVGPlugin.convertToPath('.js-opening-circle');

  // アニメーション対象要素の取得（※必ずconvertToPathの後に取得する）
  const circleWraps = document.querySelectorAll('.js-opening-circle-wrap');
  const circleElements = document.querySelectorAll('.js-opening-circle');

  // MorphSVGによる変形先のpath要素（「Cafe Palette」の11文字）
  const titlePaths = document.querySelectorAll('.js-opening-title-path');

  // 初期設定：回転の中心をSVG全体の中心（50% 50%）にセット
  gsap.set(circleWraps, {
    transformOrigin: '50% 50%',
  });

  // =========================================
  // ローディングアニメーション（無限ループ演出）
  // =========================================
  const loadingTl = gsap.timeline({
    repeat: -1,
  });

  // 外枠（g要素）を時差（stagger）で回転させつつ、内側の円を拡縮・明滅させる
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

  /**
   * ページの読み込み（loadイベント）完了を待つ関数
   * @returns {Promise<void>} 読み込み完了時に解決されるPromise
   */
  const waitLoad = () => {
    return new Promise((resolve) => {
      // すでに読み込みが完了している場合（キャッシュ等）は即座にresolveする
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve, { once: true });
      }
    });
  };

  /**
   * 指定した時間（ミリ秒）だけ待機する関数
   * @param {number} ms - 待機する時間（ミリ秒）
   * @returns {Promise<void>} 指定時間経過後に解決されるPromise
   */
  const waitTime = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  // ページ読み込み完了と最低表示時間（1.5秒）の両方が終わるまで待機
  await Promise.all([waitLoad(), waitTime(1500)]);

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

  // 11個の円を対応する文字パスへ順番に変形させ、0.4秒の余韻の後に円形クリップで幕を閉じる
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