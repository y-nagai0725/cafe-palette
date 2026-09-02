import '../scss/style.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPageTop, initSectionLinks } from './modules/common';
import { initHeaderNav } from './modules/header';
import { initHorizontalScroll } from './modules/horizontal';
import { initForeground } from './modules/foreground';
import { initSeasonPanels } from './modules/season';
import { initMorphBg } from './modules/morph';
import { initParticleCanvas } from './modules/canvasEngine';
import { Petal, Bubble, Leaf, Snow } from './modules/particles';
import { initMessage } from './modules/message';

const init = () => {
  initPageTop();
  initSectionLinks();
  initHeaderNav();
  initHorizontalScroll();
  initForeground();
  initSeasonPanels();
  initMorphBg();

  // 春セクション：Petal（桜）を60枚
  initParticleCanvas('.js-spring-canvas', Petal, 60);

  // 夏セクション：Bubble（泡）を40個
  initParticleCanvas('.js-summer-canvas', Bubble, 40);

  // 秋セクション：Leaf（落ち葉）を40枚
  initParticleCanvas('.js-autumn-canvas', Leaf, 40);

  // 冬セクション：Snow（粉雪）を100個
  initParticleCanvas('.js-winter-canvas', Snow, 100);

  initMessage();
};

init();