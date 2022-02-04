import { compareValues, Sponsor } from './util';

const makePkCells = (columnKey: string, appendItems: Node[]) => {
  const newItem = document.createElement('pk-table-cell');
  newItem.setAttribute('column-key', columnKey);
  newItem.withDivider = true;
  newItem.classList.add('pk-text--wrap', 'pk-text--break');
  newItem.style.setProperty('--pk-cell--justify-content', 'space-evenly');
  appendItems.forEach((ap) => newItem.appendChild(ap));
  if (appendItems.length > 1) newItem.classList.add('pk-flex--column');
  return newItem;
};

const makePkCell = (columnKey: string, appendItem: Node) => makePkCells(columnKey, [appendItem]);

const createPkIdentifier = (propValue: string, bgColor = 'white', color = 'black', columnKey?: string) => {
  const pkIdentifier = document.createElement('pk-identifier');
  const pkId = document.createElement('span');
  pkId.setAttribute('slot', 'primary');
  pkId.classList.add('pk-text--wrap', 'pk-text--break');
  pkId.textContent = propValue;
  pkIdentifier.appendChild(pkId);
  if (columnKey) {
    const pkSec = document.createElement('span');
    pkSec.setAttribute('slot', 'secondary');
    pkSec.textContent = columnKey;
    pkIdentifier.primarySize = '24';
    pkIdentifier.appendChild(document.createElement('pk-divider'));
    pkIdentifier.appendChild(pkSec);
  }
  pkIdentifier.alignment = 'center';
  pkIdentifier.style.setProperty('--pk-identifier-primary--color', color);
  pkIdentifier.style.setProperty('--pk-identifier--bg-color', bgColor);
  return pkIdentifier;
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
  const pkIdentifier = createPkIdentifier(propValue, bgColor, color);
  newRow.appendChild(makePkCell(columnKey, pkIdentifier));
};
export const printColumnItems = (newRow: HTMLElement, columnKey: string, pkIdentifiers: HTMLPkIdentifierElement[]) => {
  newRow.appendChild(makePkCells(columnKey, pkIdentifiers));
};
/**
 * print column from list of values
 */
export const printColumnList = (
  newRow: HTMLElement,
  columnKey: string,
  propObj: { [key: string]: string },
  addCopyButton?: boolean,
) => {
  const ul = document.createElement('pk-data-card');
  ul.style.width = 'fit-content';
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
    if (addCopyButton) {
      const suffix = document.createElement('span');
      suffix.classList.add('clickable-identifiers');
      suffix.slot = 'suffix';
      const icon = document.createElement('pk-icon');
      icon.name = 'actions-copy';
      suffix.appendChild(icon);
      suffix.addEventListener('click', () => navigator.clipboard.writeText(propObj[key]));
      pkIdentifier.appendChild(suffix);
    }
    li.appendChild(pkIdentifier);
    header.appendChild(li);
  }
  ul.appendChild(header);
  newRow.appendChild(newRow.tagName === 'PK-TABLE-ROW' ? makePkCell(columnKey, ul) : ul);
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
  printColumnItems(newRow, 'info', [
    createPkIdentifier(sponsor.mainSponsor, '', '', 'mainSponsor'),
    createPkIdentifier(sponsor.code, '', '', 'code'),
    createPkIdentifier(sponsor.name, '', '', 'name'),
    createPkIdentifier(sponsor.type, '', '', 'type'),
  ]);
  printColumnItems(newRow, 'colors', [
    createPkIdentifier(sponsor.colour, sponsor.colour, sponsor.secondaryColour, 'main'),
    createPkIdentifier(sponsor.secondaryColour, sponsor.secondaryColour, sponsor.colour, 'secondary'),
  ]);

  // image cell
  var img = document.createElement('img');
  img.src = sponsor.image;
  const lastNode = newRow.children.item(newRow.children.length - 1);
  lastNode.appendChild(img);

  const btn = document.createElement('pk-button');
  btn.classList.remove('adaptive-width');
  btn.textContent = 'Open links';
  btn.addEventListener('click', () => {
    const e = document.querySelector<HTMLElement>('#urls-showing');
    e.innerHTML = '';
    printColumnList(e, 'links', sponsor.links, true);
    const e2 = document.querySelector('pk-overlay');
    e2.isOpen = true;
  });
  const urlsCell = makePkCell('links', btn);
  newRow.appendChild(urlsCell);

  printColumnList(newRow, 'introText', sponsor.introText.translations);
  const tagItems = sponsor.tags.reduce((now, tg, i) => Object.assign(now, { [i]: tg }), {});
  printColumnList(newRow, 'tags', tagItems);

  return newRow;
};

/**
 * generate PkTableBody from array of sponsors
 * @param sponsors
 */
export const generateTableBody = (sponsors: Sponsor[]) => {
  const tbodyRef = document.getElementById('sponsor-table').getElementsByTagName('pk-table-body')[0];
  //cleanup old table
  tbodyRef.innerHTML = '';
  const hideEmpty = sponsors.length ? 'none' : 'block';
  document.querySelector<HTMLElement>('#noContentFound').style.display = hideEmpty;
  sponsors.forEach((sp) => tbodyRef.appendChild(mapSponsor(sp)));
};

/**
 * sort PkTableBody
 * @param event
 * @param items
 */
export const sortTableBy = (event: CustomEvent, items: { [key: string]: Sponsor }) => {
  const tableElement = document.querySelector<HTMLElement>('pk-table');
  const tableBodyElement = tableElement.querySelector<HTMLElement>('pk-table-body');
  tableBodyElement.style.height = `${tableBodyElement.offsetHeight}px`;
  const sortSponsors = Object.values(items).sort(compareValues(event.detail.columnKey, event.detail.order));
  generateTableBody(sortSponsors);
};
