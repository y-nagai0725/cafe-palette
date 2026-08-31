import '../scss/style.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPageTop } from './modules/common';
import { initHeaderNav } from './modules/header';
import { initHorizontalScroll } from './modules/horizontal';
import { initForeground } from './modules/foreground';
import { initSeasonPanels } from './modules/season';
import { initMorphBg } from './modules/morph';
import { initSpringCanvas } from './modules/springCanvas';

const init = () => {
  initPageTop();
  initHeaderNav();
  initHorizontalScroll();
  initForeground();
  initSeasonPanels();
  initMorphBg();
  initSpringCanvas();
};

init();