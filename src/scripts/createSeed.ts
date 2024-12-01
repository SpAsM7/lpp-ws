import { generateTestData } from './generateTestData';
import * as fs from 'fs';
import * as path from 'path';

async function createSeedFile() {
  const sql = await generateTestData(1); // Generate 3 test accounts
  
  const scriptsDir = path.join(process.cwd(), 'src', 'scripts');
  const dummyPath = path.join(scriptsDir, 'dummy.sql');
  
  fs.writeFileSync(dummyPath, '-- Generated Test Data\n' + sql);
  console.log('✅ Test data written to src/scripts/dummy.sql');
}

createSeedFile().catch(console.error);