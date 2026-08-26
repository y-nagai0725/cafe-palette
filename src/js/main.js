import '../scss/style.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// =========================================
// 横スクロールのテスト実装
// =========================================

let mm = gsap.matchMedia();

mm.add("(width >= 1024px)", () => {
  const scrollContainer = document.querySelector('.js-scroll-container');
  const track = document.querySelector('.js-horizontal-track');

  if (!scrollContainer || !track) return;

  const scrollWidth = () => track.clientWidth - window.innerWidth;

  gsap.to(track, {
    x: () => -scrollWidth(),
    ease: "none",
    scrollTrigger: {
      trigger: scrollContainer,
      pin: true,
      start: "top top",
      end: () => "+=" + scrollWidth(),
      scrub: 1,
      invalidateOnRefresh: true,
    }
  });
});