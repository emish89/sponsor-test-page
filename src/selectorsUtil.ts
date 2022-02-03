export const updateCustomInput = (
  event: CustomEvent<{ item: HTMLPkMenuItemElement }>,
  selectorID: string,
) => {
  const tE = event.target as HTMLElement;
  for (let i = 0; i < tE.children.length; i += 1) {
    const child = tE.children[i];
    if (child.tagName.toLowerCase() === 'pk-menu-item')
      tE.children[i].setAttribute('selected', 'false');
  }

  const targetElement = event.detail.item;
  targetElement.setAttribute('selected', 'true');
  const itemValue = targetElement.getAttribute('value');
  if (itemValue) {
    const baseUrl = document.querySelector(selectorID);
    baseUrl.setAttribute('pk-value', itemValue);
    const textSection = baseUrl.querySelector(`${selectorID}Selection`);
    textSection.textContent = targetElement.getAttribute('printValue');
  }
};

export const extractInputData = () => {
  //get values from inputs
  const inputValue = document
    .querySelector<HTMLInputElement>('#competitionId')
    .getAttribute('pk-value');
  const inputCountryCodes =
    document.querySelector<HTMLInputElement>('#countryCodes').value;
  const baseUrl = document
    .querySelector<HTMLInputElement>('#baseUrl')
    .getAttribute('pk-value');
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
