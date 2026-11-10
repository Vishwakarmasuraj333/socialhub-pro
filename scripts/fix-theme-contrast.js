const fs = require('fs');
const path = require('path');

function getFiles(dir, filter = '.tsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file, filter));
    } else if (file.endsWith(filter)) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles(path.join(__dirname, '../src/app'));

files.forEach((file) => {
  const relPath = path.relative(path.join(__dirname, '..'), file);
  if (relPath.includes('(auth)')) return;

  let content = fs.readFileSync(file, 'utf8');

  // Replace text-white on inputs with text-surface-lightText dark:text-white
  content = content.replace(/text-white placeholder-surface-lightMuted/g, 'text-surface-lightText dark:text-white placeholder-surface-lightMuted');
  content = content.replace(/text-xs text-white focus:outline-none/g, 'text-xs text-surface-lightText dark:text-white focus:outline-none');
  content = content.replace(/text-xs text-white placeholder-surface-lightMuted/g, 'text-xs text-surface-lightText dark:text-white placeholder-surface-lightMuted');
  content = content.replace(/text-xs text-white leading-relaxed/g, 'text-xs text-surface-lightText dark:text-white leading-relaxed');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated input theme contrast: ${relPath}`);
});

console.log('✅ All inputs and form fields successfully updated!');
