// GoogleSheetToJson.js
const fs = require('fs-extra');
const flat = require('flat');
const { extractSheets } = require('spreadsheet-to-json');
const path = require('path');
const unflatten = flat.unflatten;
const googleSheetTable = ['article', 'menu', 'site_name', 'card', 'calendar'];

const makeFile = file => {
  const fileName = file.key;
  const info = file.target;

  fs.ensureDirSync(path.dirname(path.resolve(__dirname, './src/i18n', `${fileName}.json`)));
  fs.writeJSONSync(
    path.resolve(__dirname, './src/i18n', `${fileName}.json`),
    unflatten(info, { object: true }),
    { spaces: 2 },
  );
};

extractSheets(
  {
    spreadsheetKey: '1YWv7cbCRK6LoT9kXycKqf2vvOiNW1vUzJaiwDW-CN8I',
    credentials: require('./i18n/ygo-i18n-5f88fbf2d03a.json'),
    sheetsToExtract: googleSheetTable,
  },
  (err, data) => {
    console.log(data);
    if (err) throw err;
    let files = [];
    let reads = [];
    let temp = {};
    for (const key in data) {
      temp[key] = {};
      if (Object.hasOwnProperty.call(data, key)) {
        data[key].forEach(list => {
          for (let i = 0; i < Object.keys(list).length; i++) {
            const keySide = Object.keys(list)[i];
            if (keySide === 'key') temp[key][list[keySide]] = '';
            else if (!files.find(el => el === keySide) && keySide !== 'key') {
              files.push(keySide);
            }
          }
        });
      }
    }

    files.forEach(file => {
      reads.push({
        target: temp,
        key: file,
      });
    });
    for (let i = 0; i < reads.length; i++) {
      const readKey = reads[i].key;
      const target = reads[i].target;
      for (const key in target) {
        if (Object.hasOwnProperty.call(target, key)) {
          const tarKeys = data[key].map(el => el.key);
          for (let j = 0; j < tarKeys.length; j++) {
            const tarKey = tarKeys[j];
            reads[i].target[key][tarKey] = data[key].find(el => el['key'] === tarKey)[readKey];
          }
        }
      }
      makeFile(reads[i]);
    }
  },
);
