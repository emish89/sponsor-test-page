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
