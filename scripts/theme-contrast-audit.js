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

const files = getFiles(path.join(__dirname, '../src'));
console.log(`Auditing ${files.length} TSX files for Dark/Light theme text contrast & WCAG compliance...`);

let issues = [];

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(path.join(__dirname, '..'), file);

  // Check 1: inputs, textareas, selects with text-white without dark:text-white
  const formElementRegex = /<(input|textarea|select)[^>]*className=(["'])(.*?)\2[^>]*>/gs;
  let match;
  while ((match = formElementRegex.exec(content)) !== null) {
    const classStr = match[3];
    if (classStr.includes('text-white') && !classStr.includes('dark:text-white')) {
      // Check if it's strictly in a dark-only page like auth, or in dashboard/public
      if (!relPath.includes('(auth)')) {
        issues.push({
          file: relPath,
          element: match[1],
          issue: `Form element has 'text-white' without 'dark:text-white'`,
          classStr,
        });
      }
    }
  }

  // Check 2: Headings with text-white without dark:text-white in dashboard/public
  const headingRegex = /<(h[1-6])[^>]*className=(["'])(.*?)\2[^>]*>/gs;
  while ((match = headingRegex.exec(content)) !== null) {
    const classStr = match[3];
    if (classStr.includes('text-white') && !classStr.includes('dark:text-white') && !classStr.includes('bg-maroon') && !classStr.includes('text-gold')) {
      if (!relPath.includes('(auth)') && !classStr.includes('from-maroon') && !classStr.includes('bg-black')) {
        issues.push({
          file: relPath,
          element: match[1],
          issue: `Heading has 'text-white' without dark:text-white`,
          classStr,
        });
      }
    }
  }
});

console.log(`\nFound ${issues.length} potential text contrast items:\n`);
issues.forEach((iss, i) => {
  console.log(`[${i + 1}] ${iss.file} <${iss.element}>: ${iss.issue}`);
  console.log(`     Classes: ${iss.classStr.slice(0, 100)}...`);
});

