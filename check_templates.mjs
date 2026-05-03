#!/usr/bin/env node
import { readFileSync } from 'fs';

const code = readFileSync('src/views/SettingsPage.js', 'utf-8');

let depth = 0;
let inTemplate = false;
for (let i = 0; i < code.length; i++) {
  if (code[i] === '`' && (i === 0 || code[i - 1] !== '\\')) {
    if (!inTemplate && depth > 0) {
      console.log(`ERROR: template starts at ${i} with depth ${depth}`);
    }
    inTemplate = !inTemplate;
  }
  if (inTemplate && code[i] === '$' && code[i + 1] === '{') { depth++; i++; }
  if (inTemplate && code[i] === '}') depth--;
}
console.log('Template depth:', depth, depth === 0 ? 'OK' : 'ERROR');
