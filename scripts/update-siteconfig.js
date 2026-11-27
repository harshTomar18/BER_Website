import fs from 'fs';

let code = fs.readFileSync('src/config/siteConfig.js', 'utf8');
code = code.replace(/\/images\/suppliers\/([a-zA-Z0-9_\-]+)\.png/g, '/images/suppliers/$1.webp');
code = code.replace(/&w=1000&q=80/g, '&w=500&q=70&auto=format');
code = code.replace(/&w=1400&q=80/g, '&w=800&q=75&auto=format');
fs.writeFileSync('src/config/siteConfig.js', code);
console.log('siteConfig.js updated successfully');
