import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Path to the input JSON file (relative to the script location)
const __filename = fileURLToPath(import.meta.url);
const inputFilePath = path.join(path.dirname(__filename), '..', 'service_urls.json');

// Read the JSON file
const jsonData = readFileSync(inputFilePath, 'utf8');

// Parse and stringify to ensure valid JSON, then encode to base64
const base64Encoded = Buffer.from(JSON.stringify(JSON.parse(jsonData))).toString('base64');

// Output the base64 encoded string
console.log(base64Encoded);