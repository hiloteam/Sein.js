const fs = require('fs');
const path = require('path');

const CONFIG = {
  categories: []
};
 
const root = path.resolve(__dirname);
const dirList = fs.readdirSync(root);

console.log(dirList);

dirList.forEach(dir => {
  if (dir === 'assets' || fs.statSync(path.join(root, dir)).isFile()) {
    return;
  }

  CONFIG.categories.push({
    path: dir,
    label: {
      en: dir,
      cn: ''
    }
  });
  const c = CONFIG[dir] = [];

  const fileList = fs.readdirSync(path.join(root, dir));

  fileList.forEach(f => {
    c.push({
      path: f.replace('.md', ''),
      label: {
        en: f.replace('.md', ''),
        cn: fs.readFileSync(path.join(root, dir, f), {encoding: 'utf8'}).split('\n')[0].replace('# ', '')
      }
    })
  });
});

const res = 'export default ' + JSON.stringify(CONFIG).replace(/"/g, "'");

// fs.writeFileSync(path.join(root, 'config.ts'), res);
