export type Sponsor = {
  code: string;
  language?: string;
  colour: string;
  competitionId: string;
  image: string;
  introText: {
    translations: { [key: string]: string };
  };
  links: { [key: string]: string };
  mainSponsor: string;
  name: string;
  secondaryColour: string;
  tags: string[];
  type: string;
};
export type Competition = {
  code: string;
  id: string;
  images: { FULL_LOGO: string };
  translations: { name: { EN: string } };
};
/**
 * super simple hashing function
 */
export const hashCode = (input: string) => {
  var hash = 0;
  for (var i = 0; i < input.length; i++) {
    var char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    // Convert to 32bit integer
    hash = hash & hash;
  }
  return hash;
};

export function compareValues<T>(key: string, order = 'ASC') {
  return function innerSort(a: T, b: T) {
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
/**
 * fetch competitions for compDropdown
 */
export const fetchComps = async () => {
  const comps = window.localStorage.getItem('compList');
  if (!comps) {
    const fetchComps = await fetch('https://comp.uefa.com/v2/competitions?regions=CONTINENTAL&regions=WORLDWIDE')
      .then((resp) => resp.json() as Promise<Competition[]>)
      .then((data) => data);
    console.log(fetchComps);
    window.localStorage.setItem('compList', JSON.stringify(fetchComps));
    return fetchComps;
  }
  return JSON.parse(comps) as Competition[];
};

export const makeToast = (titleText: string) => {
  const prevToasts = document.querySelectorAll('pk-toast');
  prevToasts.forEach((pt) => pt.parentNode.removeChild(pt));

  const pkToast = document.createElement('pk-toast');
  const pkToastItem = document.createElement('pk-toast-item');
  pkToastItem.appearance = 'warning';
  pkToastItem.dismiss = 'mixed';
  pkToastItem.closeButton = true;
  pkToastItem.dismissDelay = 3000;
  const icon = document.createElement('div');
  icon.slot = 'icon';
  const pkicon = document.createElement('pk-icon');
  pkicon.name = 'support-alert';
  pkicon.color = 'support-02';
  icon.appendChild(pkicon);
  const title = document.createElement('div');
  title.slot = 'title';
  title.textContent = titleText;
  pkToastItem.append(icon, title);
  pkToast.append(pkToastItem);
  return pkToast;
};
