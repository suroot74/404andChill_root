const fs = require('fs');
const path = require('path');

// Directories to scan
const directories = {
  gifs: 'assets/gifs/',
  backgrounds: 'assets/backgrounds/',
  midi: 'assets/midi/',
};

// Result object
const assets = {};

// Scan each directory
Object.entries(directories).forEach(([key, dir]) => {
  const files = fs.readdirSync(dir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.gif', '.jpg', '.jpeg', '.png', '.mid', '.midi'].includes(ext); // Add supported extensions
  });

  assets[key] = files;
});

// Write JSON file
const outputFile = './assets/assets.json';
fs.writeFileSync(outputFile, JSON.stringify(assets, null, 2));
console.log(`Assets JSON generated at ${outputFile}`);
