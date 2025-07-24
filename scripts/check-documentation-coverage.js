/**
 * @file check-documentation-coverage.js
 * @description Script to check documentation coverage across the codebase
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
  // Patterns that indicate documentation
  docPatterns: [
    /\/\*\*[\s\S]*?\*\//g, // JSDoc comments
    /@file/g,
    /@description/g,
    /@param/g,
    /@returns/g,
    /@component/g,
    /@interface/g,
    /@property/g,
    /@example/g
  ],
  // Output file
  outputFile: 'documentation-coverage-report.md',
  // Minimum coverage threshold (percentage)
  minCoverage: 80
};

/**
 * Checks if a file has documentation
 * 
 * @param {string} filePath - Path to the file
 * @returns {boolean} True if the file has documentation, false otherwise
 */
function hasDocumentation(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return config.docPatterns.some(pattern => pattern.test(content));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
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
 * Generates a documentation coverage report
 * 
 * @returns {Object} Coverage report data
 */
function generateCoverageReport() {
  const report = {
    totalFiles: 0,
    documentedFiles: 0,
    undocumentedFiles: [],
    directoryCoverage: {},
    overallCoverage: 0
  };
  
  // Process each directory
  config.directories.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        console.warn(`Directory ${dir} does not exist, skipping...`);
        return;
      }
      
      const files = getFiles(dir, config.extensions);
      const dirReport = {
        totalFiles: files.length,
        documentedFiles: 0,
        undocumentedFiles: [],
        coverage: 0
      };
      
      // Check each file for documentation
      files.forEach(file => {
        const hasDoc = hasDocumentation(file);
        if (hasDoc) {
          dirReport.documentedFiles++;
        } else {
          dirReport.undocumentedFiles.push(file);
          report.undocumentedFiles.push(file);
        }
      });
      
      // Calculate directory coverage
      dirReport.coverage = dirReport.totalFiles > 0 
        ? (dirReport.documentedFiles / dirReport.totalFiles) * 100 
        : 100;
      
      // Update overall counts
      report.totalFiles += dirReport.totalFiles;
      report.documentedFiles += dirReport.documentedFiles;
      
      // Store directory report
      report.directoryCoverage[dir] = dirReport;
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error);
    }
  });
  
  // Calculate overall coverage
  report.overallCoverage = report.totalFiles > 0 
    ? (report.documentedFiles / report.totalFiles) * 100 
    : 100;
  
  return report;
}

/**
 * Formats the coverage report as Markdown
 * 
 * @param {Object} report - Coverage report data
 * @returns {string} Markdown formatted report
 */
function formatReportAsMarkdown(report) {
  const date = new Date().toISOString().split('T')[0];
  let markdown = `# Documentation Coverage Report\n\n`;
  markdown += `Generated on: ${date}\n\n`;
  
  // Overall coverage
  const coverageStatus = report.overallCoverage >= config.minCoverage ? '✅' : '❌';
  markdown += `## Overall Coverage: ${report.overallCoverage.toFixed(2)}% ${coverageStatus}\n\n`;
  markdown += `- Total Files: ${report.totalFiles}\n`;
  markdown += `- Documented Files: ${report.documentedFiles}\n`;
  markdown += `- Undocumented Files: ${report.totalFiles - report.documentedFiles}\n\n`;
  
  // Directory coverage
  markdown += `## Directory Coverage\n\n`;
  markdown += `| Directory | Files | Documented | Coverage | Status |\n`;
  markdown += `|-----------|-------|------------|----------|--------|\n`;
  
  Object.entries(report.directoryCoverage).forEach(([dir, dirReport]) => {
    const status = dirReport.coverage >= config.minCoverage ? '✅' : '❌';
    markdown += `| ${dir} | ${dirReport.totalFiles} | ${dirReport.documentedFiles} | ${dirReport.coverage.toFixed(2)}% | ${status} |\n`;
  });
  
  // Undocumented files
  if (report.undocumentedFiles.length > 0) {
    markdown += `\n## Undocumented Files\n\n`;
    report.undocumentedFiles.forEach(file => {
      markdown += `- ${file}\n`;
    });
  }
  
  // Recommendations
  markdown += `\n## Recommendations\n\n`;
  
  if (report.overallCoverage < config.minCoverage) {
    markdown += `- ❌ Overall documentation coverage is below the minimum threshold of ${config.minCoverage}%\n`;
    markdown += `- 🔍 Focus on documenting files in directories with low coverage\n`;
    
    // Find directories with lowest coverage
    const lowCoverageDirs = Object.entries(report.directoryCoverage)
      .filter(([_, dirReport]) => dirReport.coverage < config.minCoverage)
      .sort(([_, a], [_, b]) => a.coverage - b.coverage)
      .slice(0, 3)
      .map(([dir, _]) => dir);
    
    if (lowCoverageDirs.length > 0) {
      markdown += `- 🎯 Priority directories to document: ${lowCoverageDirs.join(', ')}\n`;
    }
  } else {
    markdown += `- ✅ Overall documentation coverage meets the minimum threshold of ${config.minCoverage}%\n`;
    markdown += `- 🔍 Continue maintaining documentation as code changes\n`;
  }
  
  return markdown;
}

/**
 * Main function to run the documentation coverage check
 */
function main() {
  console.log('Checking documentation coverage...');
  
  // Generate coverage report
  const report = generateCoverageReport();
  
  // Format report as Markdown
  const markdown = formatReportAsMarkdown(report);
  
  // Write report to file
  fs.writeFileSync(config.outputFile, markdown);
  
  console.log(`Documentation coverage report generated: ${config.outputFile}`);
  console.log(`Overall coverage: ${report.overallCoverage.toFixed(2)}%`);
  
  // Exit with error if coverage is below threshold
  if (report.overallCoverage < config.minCoverage) {
    console.error(`❌ Documentation coverage is below the minimum threshold of ${config.minCoverage}%`);
    process.exit(1);
  } else {
    console.log(`✅ Documentation coverage meets the minimum threshold of ${config.minCoverage}%`);
  }
}

// Run the script
main();