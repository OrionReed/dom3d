const fs = require('fs-extra');
const path = require('path');

const MANIFEST_COMMON = 'manifest.json';

// Retrieve the browser name from command-line arguments
const browserName = process.argv[2];

// Validate the input argument
if (!browserName) {
  console.error('Usage: node build.js <browserName>');
  process.exit(1);
}

// Define file paths based on the browser name
const commonManifestPath = path.join(__dirname, MANIFEST_COMMON);
const browserSpecificManifestPath = path.join(__dirname, `manifest-${browserName}.json`);
const outputPath = path.join(__dirname, 'dist', browserName);

// Clear the dist/{browser} directory
fs.removeSync(outputPath);

// Ensure the dist/{browser} directory exists
fs.ensureDirSync(outputPath);

// Copy src to dist/{browser}
const srcPath = path.join(__dirname, 'src');
fs.copySync(srcPath, outputPath);

// Read and parse the JSON files
const commonManifest = JSON.parse(fs.readFileSync(commonManifestPath, 'utf8'));
const browserSpecificManifest = JSON.parse(fs.readFileSync(browserSpecificManifestPath, 'utf8'));

// Merge the two objects
const combinedManifest = { ...commonManifest, ...browserSpecificManifest };

// Write the combined JSON to the output file
const manifestOutputPath = path.join(outputPath, 'manifest.json');
fs.writeFileSync(manifestOutputPath, JSON.stringify(combinedManifest, null, 2), 'utf8');

console.log(`${browserName} build process completed successfully.`);