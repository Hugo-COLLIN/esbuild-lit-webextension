import ModalMessage from "../types/ModalMessage";
import {getStorageData} from "../../../../../shared/utils/chromeStorage";

// TODO: shouldn't call from background directory ; move in shared or split? Or change structure?
import {
  clickCounts,
  resetClickCount,
  updateClickIconCount
} from "../../../../../background/interface/icon/clickCount";

const MODAL_SURVEY = '../files/modalMessages/modalSurvey.md';
const MODAL_DONATION = '../files/modalMessages/modalDonation.md';

// Array of modals
const modals = [MODAL_SURVEY, MODAL_DONATION, MODAL_SURVEY, MODAL_DONATION];

/**
 * Check the click count and display the modal if needed
 * @returns {Promise<void>}
 */
export async function handleModalDisplay() {
  const clickIconCount = await getStorageData('clickIconCount');
  const modalIndex = await getStorageData('modalIndex');

  // Display modal if needed
  if (clickIconCount > 0) return;
  await new ModalMessage(modals[modalIndex]).appendModal();

  // Increment modal index
  let nextIndex = (modalIndex + 1) % modals.length;
  resetClickCount(clickCounts[nextIndex]);
  chrome.storage.sync.set({"modalIndex": nextIndex});
  updateClickIconCount();
}



//Mode: loop, keep last modal
