/**
 * @file validate-documentation.js
 * @description Script to validate documentation examples and generate a report
 * @module scripts/documentation
 * @author D-Sports Engineering Team
 * @version 1.0.0
 * @since 2025-07-23
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const config = {
  // Directories to check
  directories: [
    'src/components',
    'src/core',
    'src/utils',
    'src/hooks',
    'src/contexts',
    'src/services',
    'data',
    'scripts'
  ],
  // File extensions to check
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  // Patterns to extract examples
  examplePattern: /```(?:typescript|tsx|javascript|jsx)?\s*([\s\S]*?)```/g,
  // Output file
  outputFile: 'documentation-examples-validation-report.md',
  // TypeScript compiler options
  tsConfig: 'tsconfig.json'
};

/**
 * Extracts code examples from a file
 * 
 * @param {string} filePath - Path to the file
 * @returns {Array<{code: string, lineNumber: number}>} Array of code examples
 */
function extractExamples(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const examples = [];
    let match;
    
    // Find all JSDoc comments
    const jsdocPattern = /\/\*\*[\s\S]*?\*\//g;
    let jsdocMatch;
    
    while ((jsdocMatch = jsdocPattern.exec(content)) !== null) {
      const jsdocContent = jsdocMatch[0];
      const jsdocStartLine = content.substring(0, jsdocMatch.index).split('\n').length;
      
      // Find examples within this JSDoc comment
      while ((match = config.examplePattern.exec(jsdocContent)) !== null) {
        const code = match[1].trim();
        // Calculate line number (approximate)
        const linesBefore = jsdocContent.substring(0, match.index).split('\n').length;
        const lineNumber = jsdocStartLine + linesBefore - 1;
        
        examples.push({ code, lineNumber });
      }
    }
    
    return examples;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

/**
 * Validates a TypeScript code example
 * 
 * @param {string} code - Code example to validate
 * @returns {Object} Validation result
 */
function validateTypeScriptExample(code) {
  try {
    // Create a temporary file
    const tempFile = path.join('temp', 'example.ts');
    fs.mkdirSync('temp', { recursive: true });
    
    // Add imports that might be needed for examples
    const codeWithImports = `
// Auto-generated imports for validation
import React from 'react';
import { useState, useEffect } from 'react';
// Example code starts here
${code}
`;
    
    fs.writeFileSync(tempFile, codeWithImports);
    
    // Run TypeScript compiler to check for errors
    try {
      execSync(`npx tsc --noEmit --jsx react ${tempFile}`, { stdio: 'pipe' });
      return { valid: true, errors: [] };
    } catch (error) {
      const errorOutput = error.stderr.toString();
      const errorLines = errorOutput.split('\n')
        .filter(line => line.includes('error TS'))
        .map(line => line.trim());
      
      return { valid: false, errors: errorLines };
    }
  } catch (error) {
    console.error('Error validating TypeScript example:', error);
    return { valid: false, errors: [error.message] };
  } finally {
    // Clean up
    try {
      fs.unlinkSync(path.join('temp', 'example.ts'));
      fs.rmdirSync('temp');
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Gets all files in a directory recursively
 * 
 * @param {string} dir - Directory to scan
 * @param {string[]} extensions - File extensions to include
 * @returns {string[]} Array of file paths
 */
function getFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively scan subdirectories
      results = results.concat(getFiles(filePath, extensions));
    } else {
      // Check if file has one of the specified extensions
      if (extensions.some(ext => filePath.endsWith(ext))) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

/**
 * Validates examples in all files
 * 
 * @returns {Object} Validation report
 */
function validateExamples() {
  const report = {
    totalFiles: 0,
    filesWithExamples: 0,
    totalExamples: 0,
    validExamples: 0,
    invalidExamples: 0,
    fileResults: []
  };
  
  // Process each directory
  config.directories.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        console.warn(`Directory ${dir} does not exist, skipping...`);
        return;
      }
      
      const files = getFiles(dir, config.extensions);
      report.totalFiles += files.length;
      
      // Check each file for examples
      files.forEach(file => {
        const examples = extractExamples(file);
        
        if (examples.length > 0) {
          report.filesWithExamples++;
          report.totalExamples += examples.length;
          
          const fileResult = {
            file,
            totalExamples: examples.length,
            validExamples: 0,
            invalidExamples: 0,
            examples: []
          };
          
          // Validate each example
          examples.forEach(example => {
            const validation = validateTypeScriptExample(example.code);
            
            if (validation.valid) {
              report.validExamples++;
              fileResult.validExamples++;
            } else {
              report.invalidExamples++;
              fileResult.invalidExamples++;
            }
            
            fileResult.examples.push({
              lineNumber: example.lineNumber,
              valid: validation.valid,
              errors: validation.errors,
              code: example.code
            });
          });
          
          report.fileResults.push(fileResult);
        }
      });
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error);
    }
  });
  
  return report;
}

/**
 * Formats the validation report as Markdown
 * 
 * @param {Object} report - Validation report
 * @returns {string} Markdown formatted report
 */
function formatReportAsMarkdown(report) {
  const date = new Date().toISOString().split('T')[0];
  let markdown = `# Documentation Examples Validation Report\n\n`;
  markdown += `Generated on: ${date}\n\n`;
  
  // Overall statistics
  markdown += `## Overall Statistics\n\n`;
  markdown += `- Total Files: ${report.totalFiles}\n`;
  markdown += `- Files with Examples: ${report.filesWithExamples}\n`;
  markdown += `- Total Examples: ${report.totalExamples}\n`;
  markdown += `- Valid Examples: ${report.validExamples}\n`;
  markdown += `- Invalid Examples: ${report.invalidExamples}\n\n`;
  
  // Validation status
  const validationStatus = report.invalidExamples === 0 ? '✅' : '❌';
  markdown += `## Validation Status: ${validationStatus}\n\n`;
  
  if (report.invalidExamples > 0) {
    markdown += `### Invalid Examples\n\n`;
    
    // List files with invalid examples
    report.fileResults
      .filter(fileResult => fileResult.invalidExamples > 0)
      .forEach(fileResult => {
        markdown += `#### ${fileResult.file}\n\n`;
        
        // List invalid examples in this file
        fileResult.examples
          .filter(example => !example.valid)
          .forEach(example => {
            markdown += `- Line ${example.lineNumber}:\n`;
            markdown += `  - Errors:\n`;
            example.errors.forEach(err => {
              markdown += `    - ${err}\n`;
            });
            markdown += `  - Code:\n`;
            markdown += `\`\`\`typescript\n${example.code}\n\`\`\`\n\n`;
          });
      });
  }
  
  // Recommendations
  markdown += `## Recommendations\n\n`;
  
  if (report.invalidExamples > 0) {
    markdown += `- ❌ Fix the ${report.invalidExamples} invalid examples\n`;
    markdown += `- 🔍 Ensure all examples are valid TypeScript/JavaScript code\n`;
    markdown += `- 🧪 Test examples in different environments\n`;
  } else {
    markdown += `- ✅ All examples are valid\n`;
    markdown += `- 🔍 Continue maintaining examples as code changes\n`;
  }
  
  return markdown;
}

/**
 * Main function to run the example validation
 */
function main() {
  console.log('Validating documentation examples...');
  
  // Validate examples
  const report = validateExamples();
  
  // Format report as Markdown
  const markdown = formatReportAsMarkdown(report);
  
  // Write report to file
  fs.writeFileSync(config.outputFile, markdown);
  
  console.log(`Documentation examples validation report generated: ${config.outputFile}`);
  console.log(`Total examples: ${report.totalExamples}`);
  console.log(`Valid examples: ${report.validExamples}`);
  console.log(`Invalid examples: ${report.invalidExamples}`);
  
  // Exit with error if there are invalid examples
  if (report.invalidExamples > 0) {
    console.error(`❌ ${report.invalidExamples} invalid examples found`);
    process.exit(1);
  } else {
    console.log(`✅ All examples are valid`);
  }
}

// Run the script
main();