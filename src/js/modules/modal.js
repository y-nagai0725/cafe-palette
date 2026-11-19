// =========================================================================
// modal.js (季節限定メニュー詳細モーダル制御モジュール)
// =========================================================================
// 役割：各季節セクションの「MORE」ボタンクリック時にdialog要素のモーダルを開き、
// ローディング演出と画像の非同期デコード待機を経て詳細情報を表示する。
// あわせて開閉に伴う背面スクロールロック制御を一括管理する。
// =========================================================================

import { lockScroll, unlockScroll } from '../utils/scrollbar';
import { waitTime } from '../utils/async';

/**
 * 季節限定メニュー詳細モーダルの初期化関数
 */
export const initModal = () => {
  // DOM要素の取得
  const moreButtons = document.querySelectorAll('.js-more-button');
  const modal = document.querySelector('.js-modal');
  const modalCloseButton = document.querySelector('.js-modal-close');
  const modalLoader = document.querySelector('.js-modal-loader');
  const modalError = document.querySelector('.js-modal-error');
  const modalContents = document.querySelector('.js-modal-contents');
  const modalImage = document.querySelector('.js-modal-image');
  const modalTitle = document.querySelector('.js-modal-title');
  const modalText = document.querySelector('.js-modal-text');

  if (
    !moreButtons.length ||
    !modal ||
    !modalCloseButton ||
    !modalLoader ||
    !modalError ||
    !modalContents ||
    !modalImage ||
    !modalTitle ||
    !modalText
  ) return;

  /**
   * 対象の季節セクションからメニュー詳細情報を取得し、モーダル内へセットして画像のデコード完了を待つ関数
   * @param {string} seasonId - 季節のID ('spring', 'summer', 'autumn', 'winter')
   * @returns {Promise<void>} 画像のデコード完了後に解決されるPromise
   */
  const setSeasonMenuDetail = async (seasonId) => {
    const targetSection = document.getElementById(seasonId);
    if (!targetSection) {
      throw new Error("対象のセクションが見つかりませんでした。");
    }

    const titleElement = targetSection.querySelector('.js-menu-title');
    const textElement = targetSection.querySelector('.js-menu-text');
    const imageElement = targetSection.querySelector('.js-menu-image');

    if (!titleElement || !textElement || !imageElement) {
      throw new Error("詳細情報が見つかりませんでした。");
    }

    // タイトルと説明文をセットし、テキスト領域のスクロール位置を先頭へリセットする
    // ※showModal()実行後の表示状態でリセットすることで、確実にスクロール位置を初期化する
    modalTitle.textContent = titleElement.textContent;
    modalText.textContent = textElement.textContent;
    modalText.scrollTop = 0;

    // メニュー画像をセットし、描画準備（デコード）の完了を待機する
    modalImage.src = imageElement.src;
    modalImage.alt = imageElement.alt;
    await modalImage.decode();
  };

  /**
   * モーダルを開き、ローディング演出の後にメニュー詳細情報を表示する関数
   * @param {string} seasonId - 季節のID ('spring', 'summer', 'autumn', 'winter')
   */
  const openModal = async (seasonId) => {
    // モーダル内の表示状態を初期化（ローダーを表示し、エラー・コンテンツを隠す）
    modalLoader.classList.add('is-loading');
    modalError.textContent = "";
    modalError.classList.remove('is-show');
    modalContents.classList.remove('is-show');

    // 背面のスクロールを禁止（スクロールバー幅の余白補正も適用）
    lockScroll();

    // モーダルを開く
    modal.showModal();

    try {
      // 詳細情報のセット（画像デコード完了）と最低ローディング表示時間（0.6秒）の両方が終わるまで待機
      await Promise.all([setSeasonMenuDetail(seasonId), waitTime(600)]);

      // 詳細コンテンツをフェードイン表示
      modalContents.classList.add('is-show');
    } catch (error) {
      // 取得失敗時などはエラーメッセージを表示
      modalError.textContent = error.message || "情報の読み込みに失敗しました。";
      modalError.classList.add('is-show');
    } finally {
      // 処理完了後、ローダーを非表示にする
      modalLoader.classList.remove('is-loading');
    }
  };

  // =========================================
  // イベントリスナーの登録
  // =========================================

  // MOREボタンクリック時にモーダルを開く
  moreButtons.forEach(button => {
    button.addEventListener('click', () => {
      openModal(button.dataset.seasonId);
    });
  });

  // 閉じる（×）ボタンクリックでモーダルを閉じる
  modalCloseButton.addEventListener('click', () => {
    modal.close();
  });

  // オーバーレイ（背景幕）部分のクリックでモーダルを閉じる
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.close();
    }
  });

  // モーダルが閉じられた際（×ボタン・背景クリック・ESCキーすべて共通）に背面のスクロール禁止を解除
  modal.addEventListener('close', () => {
    unlockScroll();
  });
};