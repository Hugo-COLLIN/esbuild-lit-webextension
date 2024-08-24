// TODO: Make functions more generic (not only for Phind)

import {logWaitList} from "../../shared/utils/consoleMessages";
import {sleep} from "../../shared/utils/jsShorteners";

export async function clickOnListElt(index, selector = '.table-responsive tr') {
  let list = document.querySelectorAll(selector);
  while (list.length === 0) {
    logWaitList();
    await sleep(1000);
    list = document.querySelectorAll(selector);
  }
  list[index].click();
}

export async function clickElements(cssSelector = '.fe-chevron-down') {
  const possibleElements = document.querySelectorAll('[name^="answer-"]');
  possibleElements.forEach((element) => {
    const btn = element.querySelector(cssSelector);
    if (btn) btn.click();
  });
}

// --- Generic functions ---
/**
 *
 * @param actionsList {Array<{selector: string, scope: string}>} List of queryselectors to click on one after the other
 * @param content {HTMLElement} The content of the page
 * @returns {Promise<HTMLElement | null | undefined>} The last element clicked on
 */
export async function selectAndClick(actionsList, content) {
  let element;
  for (const query of actionsList) {
    switch (query.scope) {
      case 'content':
        element = content.querySelector(query.selector);
        break;
      case 'document':
        element = document.querySelector(query.selector);
        break;
      default:
        console.warn("Unknown scope: " + query.scope + ". Defaulting to content for query: " + query.selector + ".");
        return content.querySelector(query.selector);
    }

    if (element) {
      element.click ? element.click() : element.parentNode?.click();
      await sleep(10);
    }
  }
  return element;
}
