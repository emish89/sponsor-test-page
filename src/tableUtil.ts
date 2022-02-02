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
