import '../scss/style.scss';

// GSAPの読み込みテスト
import { gsap } from 'gsap';

// 文字が下からフワッと現れる簡単なアニメーション
gsap.to('.test-title', {
  opacity: 1,
  y: -20,
  duration: 1.5,
  ease: 'power2.out',
});