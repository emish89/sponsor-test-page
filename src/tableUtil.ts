const makePkCell = (
  columnKey: string,
  colour: string,
  bgColor: string,
  appendItems: Node,
) => {
  const newItem = document.createElement('pk-table-cell');
  newItem.setAttribute('column-key', columnKey);
  newItem.setAttribute('sortable', 'true')
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
  const propText = document.createTextNode(propValue);
  newRow.appendChild(makePkCell(columnKey, color, bgColor, propText));
};

/**
 * print column from list of values
 */
export const printColumnList = (
  newRow: HTMLElement,
  columnKey: string,
  propObj: { [key: string]: string },
) => {
  var ul = document.createElement('ul');
  for (var key in propObj) {
    var li = document.createElement('li');
    var prefix = document.createElement('span');
    prefix.setAttribute('slot', 'prefix');
    prefix.textContent = key;
    var pkId = document.createElement('span');
    pkId.setAttribute('slot', 'primary');
    pkId.textContent = ': ' + propObj[key];
    li.appendChild(prefix);
    li.appendChild(pkId);
    ul.appendChild(li);
  }
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
