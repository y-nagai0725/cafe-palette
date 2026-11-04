import '../scss/style.scss';
import { initOpening } from './modules/opening';
import { initFvAnimation } from './modules/fv';
import { initPageTop, initSectionLinks } from './modules/common';
import { initHeaderNav } from './modules/header';
import { initHorizontalScroll } from './modules/horizontal';
import { initBackground } from './modules/background';
import { initForeground } from './modules/foreground';
import { initSeasonPanels } from './modules/season';
import { initExitAnimation } from './modules/exit';
import { initMessage } from './modules/message';

// =========================================
// ブラウザのスクロール制御（リロード・戻る/進む対策）
// =========================================
const setupScrollRestoration = () => {
  // ブラウザの標準機能（自動で元の位置に戻す機能）をオフにする
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // ページリロード時に確実に一番上へ戻す
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
};

const init = () => {
  setupScrollRestoration();
  initOpening();
  initHorizontalScroll();
  initPageTop();
  initSectionLinks();
  initHeaderNav();
  initBackground();
  initForeground();
  initFvAnimation();
  initSeasonPanels();
  initExitAnimation();
  initMessage();
};

init();