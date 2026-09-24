// =========================================================================
// constants.js (サイト全体で使う共通定数)
// =========================================================================

/**
 * メディアクエリのブレイクポイント（px）
 */
export const BREAKPOINTS = {
  LG: 1024,
};

/**
 * サイト全体のテーマカラー
 */
export const COLORS = {
  BG: "#fdfbf7",
  TEXT: "#4a3b32",
  SPRING: "#f2b4b8",
  SPRING_SIDE: "#DB8E93",
  SUMMER: "#6bb6d6",
  SUMMER_SIDE: "#519bbb",
  AUTUMN: "#d98a59",
  AUTUMN_SIDE: "#b16d43",
  WINTER: "#e8f0f2",
  WINTER_SIDE: "#c9e2e9",
};

/**
 * GSAPのease
 */
export const GSAP_EASING = {
  // UIの開閉など、ユーザーの操作に対するサクッとしたレスポンス用
  UI: "power2.out",

  // スムーススクロールや、景色がゆっくり変わるようなエモい演出用
  SMOOTH: "power3.inOut",

  // ちょっとリッチで強めの余韻を残したい時用
  EXPO: "expo.out"
};