import '../scss/style.scss';
import { initFvAnimation } from './modules/fv';
import { initPageTop, initSectionLinks } from './modules/common';
import { initHeaderNav } from './modules/header';
import { initHorizontalScroll } from './modules/horizontal';
import { initBackground } from './modules/background';
import { initForeground } from './modules/foreground';
import { initSeasonPanels } from './modules/season';
import { initExitAnimation } from './modules/exit';
import { initMessage } from './modules/message';

const init = () => {
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