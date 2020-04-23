/**
 * @File   : i18n.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 11/2/2018, 11:44:01 AM
 * @Description:
 */
interface ILanguage {
  value: 'cn' | 'en';
  label: string;
}

export const languages: ILanguage[] = [
  {
    value: 'cn',
    label: '简体中文'
  },
  {
    value: 'en',
    label: 'English'
  }
];

export const langObj: {[lang: string]: ILanguage} = {};
languages.forEach(l => {
  langObj[l.value] = l;
});

export const langList = languages.map(l => l.value);

export const langRegexLines = new RegExp(
  `(@(${langList.join('|')})[\\s\\S]+?)(?=@(${langList.join('|')})|$)`, 'g'
);

export const langRegexLine = new RegExp(`@(${langList.join('|')})\\s([\\S\\s]*)`);

export const langRegexLineWithHeader = new RegExp(`@(${langList.join('|')})\\s+(.+)\\s+([\\s\\S]*)`);

export const parseText = text => {
  const langsText: {en?: string, cn?: string} = {};

  const lines = text.match(langRegexLines);
  if (lines) {
    lines.forEach(line => {
      const res = langRegexLine.exec(line);
      langsText[res[1]] = res[2];
    });
  }

  if (!langsText.en && !langsText.cn) {
    langsText.en = text;
    langsText.cn = text;
  } else if (!langsText.en) {
    langsText.en = langsText.cn;
  } else if (!langsText.cn) {
    langsText.cn = langsText.en;
  }

  return langsText;
};

class LanguageManager {
  public lang = 'cn';

  get current(): ILanguage {
    return langObj[this.lang];
  }
}

export default new LanguageManager();
