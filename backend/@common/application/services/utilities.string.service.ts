const upperCaseAndTrim = (text: string) => {
  if (text && typeof text === 'string') return text.toUpperCase().trim();
  else return text;
};

const lowerCaseAndTrim = (text: string) => {
  if (text && typeof text === 'string') return text.toLowerCase().trim();
  else return text;
};

const trim = (text: string) => {
  if (text && typeof text === 'string') return text.trim();
  else return text;
};

const capitalize = (text: string) => {
  if (text && typeof text === 'string') return `${text[0].toUpperCase()}${text.slice(1)}`;
  else return text;
};

const formatForJson = (text: string) => {
  text = lowerCaseAndTrim(text);
  if (text && typeof text === 'string') {
    text = text.replace(/á/g, 'a');
    text = text.replace(/é/g, 'e');
    text = text.replace(/í/g, 'i');
    text = text.replace(/ó/g, 'o');
    text = text.replace(/ú/g, 'u');
    text = text.replace(/ñ/g, 'n');
    text = text.replace(/ñ/g, 'n');
    text = text.replace(/ü/g, 'u');
    text = text.replace(/:/g, '');
    text = text.replace(/¿/g, '');
    text = text.replace(/\?/g, '');
    const dtspl = text.split(' ');
    let newTxt = '';
    let tieneVineta = false;
    dtspl.forEach((r, i) => {
      if (!i) {
        if (r.includes('.') && !isNaN(+r.split('.')[0])) {
          tieneVineta = true;
        } else {
          newTxt += lowerCaseAndTrim(r);
        }
      } else {
        if (tieneVineta) {
          if (i === 1) newTxt += lowerCaseAndTrim(r);
          else newTxt += capitalize(lowerCaseAndTrim(r));
        } else {
          newTxt += capitalize(lowerCaseAndTrim(r));
        }
      }
    });
    return newTxt;
  } else return text;
};

const enumToString = (object: object) => {
  return Object.keys(object)
    .map(key => object[key])
    .filter(value => typeof value === 'string') as string[];
};

const addEllipsis = (st: string, length: number) => {
  const existValue = [undefined, null].indexOf(st) >= 0;
  const overLength = st.length > length;
  return existValue ? st : overLength ? `${st.slice(0, length - 3).trim()}...` : st;
};

export const STRING_UTILITIES = {
  upperCaseAndTrim,
  lowerCaseAndTrim,
  trim,
  capitalize,
  formatForJson,
  enumToString,
  addEllipsis,
};
