// =========================================================================
// main.js (アプリケーション全体のエントリーポイント)
// =========================================================================
// 役割：全体スタイルの読み込み、ブラウザのスクロール復元制御、および
// 各機能・アニメーションモジュールの適切な順序での初期化を一括管理する。
// =========================================================================

import '../scss/style.scss';
import { initOpening } from './modules/opening';
import { initHorizontalScroll } from './modules/horizontal';
import { initPageTop, initSectionLinks } from './modules/common';
import { initHeaderNav } from './modules/header';
import { initBackground } from './modules/background';
import { initForeground } from './modules/foreground';
import { initFvAnimation } from './modules/fv';
import { initSeasonPanels } from './modules/season';
import { initExitAnimation } from './modules/exit';
import { initMessage } from './modules/message';

// =========================================
// ブラウザのスクロール制御（リロード・戻る/進む対策）
// =========================================

/**
 * ページリロード時にスクロール位置を確実に最上部（0, 0）へリセットする関数
 * ※ScrollTriggerを多用する構造上、途中位置でリロードされるとアニメーションや
 *  レイヤーの表示状態にズレが生じるのを防ぐため。
 */
const setupScrollRestoration = () => {
  // ブラウザの標準機能（自動で元のスクロール位置に戻す機能）をオフにする
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // ページアンロード（リロード等）時に確実に一番上へ戻す
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
};

// =========================================
// アプリケーションの初期化
// =========================================

/**
 * 全モジュールの初期化を順番に実行するメイン関数
 */
const init = () => {
  // スクロール位置の復元対策とオープニング演出の開始
  setupScrollRestoration();
  initOpening();

  // ページ全体の横スクロール（id: "hScroll"）の生成
  // ※後続のモジュールが containerAnimation として "hScroll" を参照するため、必ず先に初期化する
  initHorizontalScroll();

  // 共通UI（スムーススクロール・ヘッダーナビ）の初期化
  initPageTop();
  initSectionLinks();
  initHeaderNav();

  // 背景・前景レイヤーおよび各セクションのスクロール連動アニメーション初期化
  initBackground();
  initForeground();
  initFvAnimation();
  initSeasonPanels();
  initExitAnimation();
  initMessage();
};

init();