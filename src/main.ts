import { extractInputData, updateCustomInput } from './selectorsUtil';
import { generateTableBody, sortTableBy } from './tableUtil';
import { fetchComps, hashCode, Sponsor } from './util';

const arrayResponseHashes: { [key: string]: Sponsor } = {};

const clearPreviousHashedItems = () =>
  Object.keys(arrayResponseHashes).forEach(
    (k) => delete arrayResponseHashes[k],
  );

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
    alert(
      'Please select min. 1 country, the desidered cup and the endpoint host',
    );
    return;
  }

  const apiCalls = [];
  clearPreviousHashedItems();

  //loop through comp and countries
  cups.forEach((competitionId) => {
    countries.forEach((countryCode) => {
      const url = baseEndpoint
        .replace('{competition}', competitionId)
        .replace('{countryCode}', countryCode);

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
    .addEventListener(
      'pkSelect',
      (event: CustomEvent<{ item: HTMLPkMenuItemElement }>) =>
        updateCustomInput(event, selector),
    );
});

document
  .getElementById('get-competition-button')
  .addEventListener('click', getCompetitionData);
document.addEventListener('pkTableSortBy', (ev: CustomEvent) =>
  sortTableBy(ev, arrayResponseHashes),
);

/**
 * first load setup
 */
(async () => {
  const comps = await fetchComps();
  const dpComps = document
    .querySelector<HTMLElement>('#competitionId')
    .querySelector<HTMLPkMenuElement>('pk-menu');
  comps
    .sort((c, c1) =>
      Number.parseInt(c.id, 10) > Number.parseInt(c1.id, 10) ? 1 : -1,
    )
    .forEach((cp) => {
      const menuItem = document.createElement('pk-menu-item');
      menuItem.value = cp.id;
      menuItem.setAttribute('printValue', `${cp.id}: ${cp.code}`);
      menuItem.textContent = `${cp.id}: ${cp.translations.name.EN}`;
      dpComps.appendChild(menuItem);
    });
})();
