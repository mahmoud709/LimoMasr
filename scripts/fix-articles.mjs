import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/articles.json');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  
  const lastBracket = content.lastIndexOf(']');
  
  if (lastBracket !== -1) {
    const fixedContent = content.substring(0, lastBracket + 1);
    
    JSON.parse(fixedContent);
    
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log('✅ Successfully fixed articles.json!');
  } else {
    console.log('❌ Could not find the end of the JSON array.');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
