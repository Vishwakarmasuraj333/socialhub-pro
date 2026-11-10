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
let inputIssues = [];

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(path.join(__dirname, '..'), file);

  if (relPath.includes('(auth)')) return; // Auth pages have dark canvas bg by design

  // Look for text-white on inputs, textareas, selects
  const lines = content.split('\n');
  lines.forEach((line, lineIdx) => {
    if (line.includes('text-white') && (line.includes('input') || line.includes('textarea') || line.includes('select') || line.includes('placeholder-') || line.includes('rounded-xl'))) {
      if (!line.includes('dark:text-white') && !line.includes('bg-maroon') && !line.includes('bg-gradient')) {
        inputIssues.push({
          file: relPath,
          line: lineIdx + 1,
          code: line.trim(),
        });
      }
    }
  });
});

console.log(`Found ${inputIssues.length} lines with un-scoped text-white in dashboard/public inputs:`);
inputIssues.forEach((iss) => {
  console.log(`${iss.file}:${iss.line}: ${iss.code.slice(0, 110)}`);
});

