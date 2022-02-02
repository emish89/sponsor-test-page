import { printColourColumns, printColumn, printColumnList } from './tableUtil';
import { hashCode, Sponsor } from './util';

const arrayResponseHashes = [];

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

const mapSponsors = (sponsors: Sponsor[], countryCode: string) => {
  const newRows: Node[] = [];
  sponsors.forEach((sponsor: Sponsor) => {
    // check if hash is in the array, otherwise add a new language row
    const respHash = hashCode(JSON.stringify(sponsor));
    if (!arrayResponseHashes.includes(respHash)) {
      arrayResponseHashes.push(respHash);
      sponsor.language = countryCode;

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

      printColumn(newRow, sponsor.tags.join(' | '), 'tags');
      printColumn(newRow, sponsor.type, 'type');
      newRows.push(newRow);
    }

    // I find the existing row with the sponsor and I add the language to the column
    const existingRow = document.getElementById(sponsor.code);
    if (existingRow) {
      let value = existingRow.getElementsByTagName('pk-table-cell')[0];
      value.innerHTML = `${value}, ${countryCode}`;
    }
  });
  return newRows;
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

  const tbodyRef = document
    .getElementById('sponsor-table')
    .getElementsByTagName('pk-table-body')[0];
  //cleanup old table
  tbodyRef.innerHTML = '';
  arrayResponseHashes.length = 0;

  //loop through comp and countries
  cups.forEach((competitionId) => {
    countries.forEach((countryCode) => {
      const url = baseEndpoint
        .replace('{competition}', competitionId)
        .replace('{countryCode}', countryCode);

      const apiCall = fetch(url)
        .then((response) => response.json() as Promise<Sponsor[]>)
        .then((sponsors) => {
          const rows = mapSponsors(sponsors, countryCode);
          rows.forEach((r) => tbodyRef.appendChild(r));
        });
      apiCalls.push(apiCall);
    });
  });
  // as soon as all the api calls are done...
  Promise.all(apiCalls).then(() => {
    console.info(`all your urls are belong to us`);

    // enable table sorting
    
    // const thToOrderBy = document.getElementById("indexTable");
    // orderTable(thToOrderBy);
  });
};

/** listeners setup section */
document
  .getElementById('get-competition-button')
  .addEventListener('click', getCompetitionData);

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
