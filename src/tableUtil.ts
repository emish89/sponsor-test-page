const makePkCell = (
  columnKey: string,
  colour: string,
  bgColor: string,
  appendItems: Node,
) => {
  const newItem = document.createElement('pk-table-cell');
  newItem.setAttribute('column-key', columnKey);
  newItem.classList.add('pk-text--wrap');
  newItem.appendChild(appendItems);
  newItem.style.backgroundColor = bgColor;
  newItem.style.color = colour;
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
  pkId.textContent = propValue;  
  pkIdentifier.appendChild(pkId);  
  newRow.appendChild(makePkCell(columnKey, color, bgColor, pkIdentifier));
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
  newRow.appendChild(makePkCell(columnKey, 'black', 'white', ul));
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
