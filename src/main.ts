import {
  createCountryCheckboxes,
  extractInputData,
  makeCountryAvatars,
  toggleCheckboxes,
  updateCustomInput,
} from './selectorsUtil';
import { generateTableBody, sortTableBy } from './tableUtil';
import { fetchComps, hashCode, makeToast, Sponsor } from './util';

const arrayResponseHashes: { [key: string]: Sponsor } = {};

const clearPreviousHashedItems = () => Object.keys(arrayResponseHashes).forEach((k) => delete arrayResponseHashes[k]);

const extractSponsorItems = (sponsors: Sponsor[], countryCode: string) => {
  sponsors.forEach((sponsor: Sponsor) => {
    // check if hash is in the array, otherwise add a new sponsor
    const respHash = hashCode(JSON.stringify(sponsor));
    if (!arrayResponseHashes[respHash]) {
      sponsor.language = countryCode;
      arrayResponseHashes[respHash] = sponsor;
    } else {
      // I find the existing sponsor and I add the language to the codes
      const existingRow = arrayResponseHashes[respHash];
      existingRow.language += `, ${countryCode}`;
    }
  });
};

/**
 * onclick button handler
 */
const getCompetitionData = () => {
  const { cupArray: cups, countries, url: baseEndpoint } = extractInputData();
  if (!cups.length || !countries.length || !baseEndpoint) {
    let text = 'You miss: ';
    if (!baseEndpoint) text += 'the endpoint to use - ';
    if (!cups.length) text += 'the desidered cup - ';
    if (!countries.length) text += 'a min. of 1 country - ';

    const sendToast = document.querySelector('#pk-codes-chips');
    sendToast.appendChild(makeToast(text.substring(0, text.length - 2)));    
    return;
  }

  const apiCalls = [];
  clearPreviousHashedItems();

  //loop through comp and countries
  cups.forEach((competitionId) => {
    countries.forEach((countryCode) => {
      const url = baseEndpoint.replace('{competition}', competitionId).replace('{countryCode}', countryCode);

      const apiCall = fetch(url)
        .then((response) => response.json() as Promise<Sponsor[]>)
        .then((sponsors) => {
          extractSponsorItems(sponsors, countryCode);
        });
      apiCalls.push(apiCall);
    });
  });
  // as soon as all the api calls are done...
  Promise.all(apiCalls).then(() => {
    console.info(`all your urls are belong to us`);
    generateTableBody(Object.values(arrayResponseHashes));
  });
};

/** listeners setup section */
const dropdownSelectors = ['#baseUrl', '#competitionId'];
dropdownSelectors.forEach((selector) => {
  document
    .querySelector(selector)
    .querySelector('pk-menu')
    .addEventListener('pkSelect', (event: CustomEvent<{ item: HTMLPkMenuItemElement }>) =>
      updateCustomInput(event, selector),
    );
});

createCountryCheckboxes();
document.querySelector('#select-all-checkboxes').addEventListener('click', () => toggleCheckboxes(true));
document.querySelector('#clear-all-checkboxes').addEventListener('click', () => toggleCheckboxes(false));

document.getElementById('get-competition-button').addEventListener('click', getCompetitionData);
document.addEventListener('pkTableSortBy', (ev: CustomEvent) => sortTableBy(ev, arrayResponseHashes));

/**
 * first load setup
 */
(async () => {
  const comps = await fetchComps();
  const dpComps = document.querySelector<HTMLElement>('#competitionId').querySelector<HTMLPkMenuElement>('pk-menu');
  comps
    .sort((c, c1) => (Number.parseInt(c.id, 10) > Number.parseInt(c1.id, 10) ? 1 : -1))
    .forEach((cp) => {
      const menuItem = document.createElement('pk-menu-item');
      menuItem.value = cp.id;
      menuItem.setAttribute('printValue', `${cp.id}: ${cp.code}`);
      menuItem.textContent = `${cp.id}: ${cp.translations.name.EN}`;
      dpComps.appendChild(menuItem);
    });
})();
