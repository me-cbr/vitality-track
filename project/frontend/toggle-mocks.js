#!/usr/bin/env node

/**
 * Script para alternar USE_MOCKS entre true/false
 * Uso: node toggle-mocks.js [true|false]
 */

const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src', 'config', 'mockData.js');

const args = process.argv.slice(2);
const targetValue = args[0] === 'false' ? 'false' : 'true'; // default true

try {
  let content = fs.readFileSync(mockDataPath, 'utf8');
  
  // Replace the USE_MOCKS value
  const regex = /export const USE_MOCKS = (true|false)/;
  const newContent = content.replace(regex, `export const USE_MOCKS = ${targetValue}`);
  
  fs.writeFileSync(mockDataPath, newContent, 'utf8');
  
  console.log(`✅ USE_MOCKS definido para: ${targetValue}`);
  console.log(`📝 Arquivo: ${mockDataPath}`);
} catch (error) {
  console.error('❌ Erro ao alterar USE_MOCKS:', error.message);
  process.exit(1);
}
