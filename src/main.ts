import { printColourColumns, printColumn, printColumnList } from './tableUtil';
import { hashCode, Sponsor } from './util';

const extractInputData = () => {
  //get values from inputs
  const inputValue =
    document.querySelector<HTMLInputElement>('#competitionId').value;
  const inputCountryCodes =
    document.querySelector<HTMLInputElement>('#countryCodes').value;
  const baseUrl = document.querySelector<HTMLInputElement>('#baseUrl').value;
  let countryCodesArray = inputCountryCodes.split(',');
  const competitionIdArray = [inputValue].filter(Boolean);

  countryCodesArray = countryCodesArray
    .map((cc) => cc.trim().toUpperCase())
    .filter(Boolean);
  return {
    cupArray: competitionIdArray,
    countries: countryCodesArray,
    url: baseUrl,
  };
};

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

const mapSponsor = (sponsor: Sponsor) => {
  const newRow = document.createElement('pk-table-row');
  newRow.id = sponsor.code;

  // Insert a cell at the end of the row
  printColumn(newRow, sponsor.language, 'language');
  printColumn(newRow, sponsor.code, 'code');

  printColourColumns(newRow, sponsor.colour, sponsor.secondaryColour);

  // image cell
  const image = document.createElement('pk-table-cell');
  var img = document.createElement('img');
  img.src = sponsor.image;
  image.appendChild(img);
  image.setAttribute('column-key', 'image');
  image.style.backgroundColor = 'white';
  image.style.color = 'black';
  newRow.appendChild(image);

  printColumnList(newRow, 'introText', sponsor.introText.translations);
  printColumnList(newRow, 'links', sponsor.links);

  printColumn(newRow, sponsor.mainSponsor, 'mainSponsor');
  printColumn(newRow, sponsor.name, 'name');

  const tagItems = sponsor.tags.reduce(
    (now, tg, i) => Object.assign(now, { [i]: tg }),
    {},
  );
  printColumnList(newRow, 'tags', tagItems);
  printColumn(newRow, sponsor.type, 'type');

  return newRow;
};

const generateTableBody = (sponsors: Sponsor[]) => {
  const tbodyRef = document
    .getElementById('sponsor-table')
    .getElementsByTagName('pk-table-body')[0];
  //cleanup old table
  tbodyRef.innerHTML = '';

  sponsors.forEach((sp) => tbodyRef.appendChild(mapSponsor(sp)));
};
/**
 * onclick button handler
 */
const getCompetitionData = () => {
  const { cupArray: cups, countries, url: baseEndpoint } = extractInputData();
  if (!cups.length || !countries.length) {
    alert('Please enter at least 1 country and the desidered cup');
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

function compareValues(key: string, order = 'ASC') {
  return function innerSort(a: Sponsor, b: Sponsor) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'DESC' ? comparison * -1 : comparison;
  };
}

const sortTableBy = (event: CustomEvent) => {
  const tableElement = document.querySelector<HTMLElement>('pk-table');
  const tableBodyElement =
    tableElement.querySelector<HTMLElement>('pk-table-body');
  tableBodyElement.style.height = `${tableBodyElement.offsetHeight}px`;
  const sortSponsors = Object.values(arrayResponseHashes).sort(
    compareValues(event.detail.columnKey, event.detail.order),
  );
  generateTableBody(sortSponsors);
};

/** listeners setup section */
document
  .getElementById('get-competition-button')
  .addEventListener('click', getCompetitionData);
document.addEventListener('pkTableSortBy', sortTableBy);

/**
 * WIP
 * SECTION
 */

//   const getCellValue = (tr, idx) =>
//   tr.children[idx].innerText || tr.children[idx].textContent;

// /*
//       comparer function for values in the index column
//     */
// const comparer = (idx, asc) => (a, b) =>
//   ((v1, v2) =>
//     v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
//       ? v1 - v2
//       : v1.toString().localeCompare(v2))(
//     getCellValue(asc ? a : b, idx),
//     getCellValue(asc ? b : a, idx),
//   );

// /*
//       function to order the table based on content of the column
//     */
// const orderTable = (th) => {
//   const table = th.closest('table');
//   const tbody = table.querySelector('tbody');
//   Array.from(tbody.querySelectorAll('tr'))
//     .sort(
//       comparer(
//         Array.from(th.parentNode.children).indexOf(th),
//         (this.asc = !this.asc),
//       ),
//     )
//     .forEach((tr) => tbody.appendChild(tr));
// };
// // set listener on th click to order by this parameter
// document.querySelectorAll('th').forEach((th) =>
//   th.addEventListener('click', () => {
//     orderTable(th);
//   }),
// );
