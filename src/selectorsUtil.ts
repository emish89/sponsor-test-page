import { countryCodes, defaultSelectedCountries } from './data';
import { compareValues } from './util';

export const getCountryCheckboxes = () => {
  const checkboxContainer = document.querySelector('#countryCheckboxes');
  return checkboxContainer.querySelectorAll('pk-checkbox') as NodeListOf<HTMLPkCheckboxElement>;
};

function getCheckedCheckboxes() {
  const checkboxes = getCountryCheckboxes();
  const list: HTMLPkCheckboxElement[] = [];
  checkboxes.forEach((ac) => {
    if (ac.checked) list.push(ac);
  });
  return list;
}

export const toggleCheckboxes = async (check: boolean) => {
  if (check) {
    const sidePanel = document.querySelector('pk-side-panel');
    await sidePanel.toggle();
  }
  const checkboxes = getCountryCheckboxes();
  checkboxes.forEach((cb) => (cb.checked = check));
};

export const makeCountryAvatars = () => {
  const pkChip = document.querySelector('#pk-codes-chips');
  const checkboxes = getCountryCheckboxes();
  const ch: Node[] = [];
  for (let index = 0; index < checkboxes.length; index++) {
    const ac = checkboxes[index];
    const wrapper = document.createElement('div');
    wrapper.classList.add('icon-wrapper');
    wrapper.dataset.countryValue = ac.value;
    if (!defaultSelectedCountries.includes(ac.value)) wrapper.style.display = 'none';
    const container = document.createElement('div');
    container.classList.add('icon-container', 'pk-flex--column');
    const chip = document.createElement('pk-avatar');
    chip.type = 'image';
    chip.size = 48;
    chip.style.padding = 'var(--pk-spacing-xs2)';
    chip.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${ac.value}.svg`;
    chip.title = ac.value;
    const code = document.createElement('span');
    code.textContent = ac.value;
    container.append(chip, code);
    wrapper.appendChild(container);
    ch.push(wrapper);
  }
  pkChip.append(...ch);
};

const setupCheckboxEventListeners = () => {
  const checkboxes = getCountryCheckboxes();
  checkboxes.forEach((ck) => {
    ck.addEventListener('checkboxChange', (event: CustomEvent<{ isChecked: boolean }>) => {
      const pkAvatar = document
        .querySelector('#pk-codes-chips')
        .querySelector(`div[data-country-value="${(event.target as HTMLPkCheckboxElement).value}"]`) as HTMLElement;
      pkAvatar.style.display = event.detail.isChecked ? 'block' : 'none';
    });
  });
};

export const createCountryCheckboxes = () => {
  const checkboxContainer = document.querySelector('#countryCheckboxes');
  const sortedCc = countryCodes.sort(compareValues('isoCode'));
  sortedCc.forEach((p) => {
    const e = document.createElement('span');
    e.slot = 'suffix';
    const pkCheckbox = document.createElement('pk-checkbox');
    pkCheckbox.name = p.name;
    pkCheckbox.value = p.isoCode;
    if (defaultSelectedCountries.includes(p.isoCode)) pkCheckbox.checked = true;
    const id = document.createElement('pk-identifier');
    // badge
    const prefix = document.createElement('span');
    prefix.setAttribute('slot', 'prefix');
    const badge = document.createElement('pk-badge');
    badge.src = `http://purecatamphetamine.github.io/country-flag-icons/3x2/${p.isoCode}.svg`;
    prefix.appendChild(badge);
    // content slots
    const primary = document.createElement('span');
    primary.setAttribute('slot', 'primary');
    primary.textContent = p.name;
    const secondary = document.createElement('span');
    secondary.setAttribute('slot', 'secondary');
    secondary.textContent = p.isoCode;
    e.appendChild(pkCheckbox);
    // appends
    id.appendChild(prefix);
    id.appendChild(primary);
    id.appendChild(secondary);
    id.appendChild(e);
    checkboxContainer.appendChild(id);
  });
  setupCheckboxEventListeners();
  makeCountryAvatars();
};

/** inputs section */
export const updateCustomInput = (event: CustomEvent<{ item: HTMLPkMenuItemElement }>, selectorID: string) => {
  const tE = event.target as HTMLElement;
  for (let i = 0; i < tE.children.length; i += 1) {
    const child = tE.children[i];
    if (child.tagName.toLowerCase() === 'pk-menu-item') tE.children[i].setAttribute('selected', 'false');
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
  const inputValue = document.querySelector<HTMLInputElement>('#competitionId').getAttribute('pk-value');
  const inputCountryCodes = getCheckedCheckboxes().map((p) => p.value);
  const baseUrl = document.querySelector<HTMLInputElement>('#baseUrl').getAttribute('pk-value');
  const competitionIdArray = [inputValue].filter(Boolean);

  const countryCodesArray = inputCountryCodes.map((cc) => cc.trim().toUpperCase()).filter(Boolean);
  return {
    cupArray: competitionIdArray,
    countries: countryCodesArray,
    url: baseUrl,
  };
};
