import '../scss/style.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPageTop } from './modules/common';
import { initHeaderNav } from './modules/header';
import { initHorizontalScroll } from './modules/horizontal';
import { initForeground } from './modules/foreground';

const init = () => {
  initPageTop();
  initHeaderNav();
  initHorizontalScroll();
  initForeground();
};

init();