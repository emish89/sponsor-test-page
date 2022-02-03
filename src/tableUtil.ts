import { compareValues, Sponsor } from './util';

const makePkCell = (columnKey: string, appendItems: Node) => {
  const newItem = document.createElement('pk-table-cell');
  newItem.setAttribute('column-key', columnKey);
  newItem.classList.add('pk-text--wrap', 'pk-text--break');
  newItem.style.setProperty('--pk-cell--justify-content', 'center');
  newItem.appendChild(appendItems);
  return newItem;
};
/*
print column from values
*/
export const printColumn = (
  newRow: HTMLElement,
  propValue: string,
  columnKey: string,
  bgColor = 'white',
  color = 'black',
) => {
  const pkIdentifier = document.createElement('pk-identifier');
  const pkId = document.createElement('span');
  pkId.setAttribute('slot', 'primary');
  pkId.classList.add('pk-text--wrap', 'pk-text--break');
  pkId.textContent = propValue;
  pkIdentifier.appendChild(pkId);
  newRow.appendChild(makePkCell(columnKey, pkIdentifier));
  pkIdentifier.style.setProperty('--pk-identifier-primary--color', color);
  pkIdentifier.style.setProperty('--pk-identifier--bg-color', bgColor);
};

/**
 * print column from list of values
 */
export const printColumnList = (
  newRow: HTMLElement,
  columnKey: string,
  propObj: { [key: string]: string },
) => {
  const ul = document.createElement('pk-data-card');
  const header = document.createElement('div');
  header.setAttribute('slot', 'body');
  for (const key in propObj) {
    const li = document.createElement('pk-list-item');
    li.setAttribute('has-divider', 'true');
    const pkIdentifier = document.createElement('pk-identifier');
    pkIdentifier.style.setProperty('--pk-identifier-primary--color', 'black');
    pkIdentifier.style.setProperty('--pk-identifier--bg-color', 'white');

    const prefix = document.createElement('span');
    prefix.setAttribute('slot', 'prefix');
    prefix.textContent = key;
    const pkId = document.createElement('span');
    pkId.setAttribute('slot', 'primary');
    pkId.textContent = propObj[key];
    pkIdentifier.appendChild(prefix);
    pkIdentifier.appendChild(pkId);
    li.appendChild(pkIdentifier);
    header.appendChild(li);
  }
  ul.appendChild(header);
  newRow.appendChild(makePkCell(columnKey, ul));
};

/**
 * print columns for the 2 colors
 */
export const printColourColumns = (
  newRow: HTMLElement,
  colour: string,
  secondaryColour: string,
) => {
  printColumn(newRow, colour, 'colour', colour, secondaryColour);
  printColumn(
    newRow,
    secondaryColour,
    'secondaryColour',
    secondaryColour,
    colour,
  );
};

/**
 * map sponsor to a PkTableRowItem
 * @param sponsor
 * @returns
 */
export const mapSponsor = (sponsor: Sponsor) => {
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

/**
 * generate PkTableBody from array of sponsors
 * @param sponsors
 */
export const generateTableBody = (sponsors: Sponsor[]) => {
  const tbodyRef = document
    .getElementById('sponsor-table')
    .getElementsByTagName('pk-table-body')[0];
  //cleanup old table
  tbodyRef.innerHTML = '';

  sponsors.forEach((sp) => tbodyRef.appendChild(mapSponsor(sp)));
};

/**
 * sort PkTableBody
 * @param event 
 * @param items 
 */
export const sortTableBy = (event: CustomEvent, items: { [key: string]: Sponsor }) => {
  const tableElement = document.querySelector<HTMLElement>('pk-table');
  const tableBodyElement =
    tableElement.querySelector<HTMLElement>('pk-table-body');
  tableBodyElement.style.height = `${tableBodyElement.offsetHeight}px`;
  const sortSponsors = Object.values(items).sort(
    compareValues(event.detail.columnKey, event.detail.order),
  );
  generateTableBody(sortSponsors);
};
