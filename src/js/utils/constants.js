// =========================================================================
// constants.js (サイト全体で使う共通定数モジュール)
// =========================================================================
// 役割：ブレイクポイント、カラーコード、GSAPのイージングなど、
// 複数ファイルで使い回す値を変数として一元管理する。
// =========================================================================

/**
 * メディアクエリのブレイクポイント（px）
 * @type {Object}
 */
export const BREAKPOINTS = {
  LG: 1024,
};

/**
 * サイト全体のテーマカラー
 * @type {Object}
 */
export const COLORS = {
  BG: "#fdfbf7",
  TEXT: "#4a3b32",
  SPRING: "#f5d5d8",
  SPRING_SIDE: "#DB8E93",
  SPRING_WAVE: "#f8bbd0",
  SUMMER: "#6bb6d6",
  SUMMER_SIDE: "#519bbb",
  SUMMER_WAVE: "#81d4fa",
  AUTUMN: "#d98a59",
  AUTUMN_SIDE: "#b16d43",
  AUTUMN_WAVE: "#e6a87c",
  WINTER: "#e8f0f2",
  WINTER_SIDE: "#c9e2e9",
  WINTER_WAVE: "#cee5eb",
  NIGHT: "#1a233a",
  BOARD_CHALK: "#d9d9d9",
};

/**
 * GSAPのイージング（ease）設定
 * @type {Object}
 */
export const GSAP_EASING = {
  // UIの開閉・要素の表示・非表示など、ユーザーの操作に対するサクッとしたレスポンス用
  UI: "power2.out",

  // スムーススクロール用
  SCROLL: "power3.inOut",

  // ふわふわとした無限ループアニメーション用（湯気、波、コンテンツ上下など）
  FLOAT: "sine.inOut",
};

/**
 * カフェの営業時間
 * 時計アニメーションの計算基準として使用
 * @type {Object}
 */
export const CAFE_HOURS = {
  OPEN: "10:00",
  CLOSE: "19:00"
};