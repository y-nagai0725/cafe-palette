// =========================================================================
// debounce.js (連続発火を防ぐデバウンス処理のユーティリティモジュール)
// =========================================================================

/**
 * デバウンス関数
 * 連続してイベントが発生した際、指定した時間（wait）だけイベントが発生しなかった時に
 * 初めて関数（func）を実行する。
 *
 * @param {Function} func - 実行したい関数
 * @param {number} wait - 待機時間（ミリ秒）デフォルトは200ms
 * @returns {Function} デバウンス化された実行用関数
 */
export const debounce = (func, wait = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, wait);
  };
};