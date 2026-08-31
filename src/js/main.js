import '../scss/style.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPageTop } from './modules/common';
import { initHeaderNav } from './modules/header';
import { initHorizontalScroll } from './modules/horizontal';
import { initForeground } from './modules/foreground';
import { initSeasonPanels } from './modules/season';
import { initMorphBg } from './modules/morph';
import { initParticleCanvas } from './modules/canvasEngine';
import { Petal, SummerBubble } from './modules/particles';

const init = () => {
  initPageTop();
  initHeaderNav();
  initHorizontalScroll();
  initForeground();
  initSeasonPanels();
  initMorphBg();

  initParticleCanvas('.js-spring-canvas', Petal, 60);
  initParticleCanvas('.js-summer-canvas', SummerBubble, 40);
};

init();