#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 *
 * This script monitors the size of bundle files across different platforms
 * and compares them with previous builds to track changes over time.
 *
 * Usage:
 *   node scripts/monitor-bundle-size.js [--threshold=SIZE_KB] [--report]
 *
 * Options:
 *   --threshold=N  Set size threshold warning in KB (default: 500)
 *   --report       Generate HTML report with size history
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const thresholdArg = args.find((arg) => arg.startsWith("--threshold="));
const sizeThresholdKB = thresholdArg
  ? parseInt(thresholdArg.split("=")[1], 10)
  : 500; // Default threshold: 500KB
const generateReport = args.includes("--report");

// Files to monitor by platform
const filesToMonitor = {
  browser: [
    path.join(__dirname, "..", "dist", "browser", "index.js"),
    path.join(__dirname, "..", "dist", "browser", "index.esm.js"),
  ],
  server: [
    path.join(__dirname, "..", "dist", "server", "index.js"),
    path.join(__dirname, "..", "dist", "server", "index.esm.js"),
  ],
  nextjs: [
    path.join(__dirname, "..", "dist", "nextjs", "index.js"),
    path.join(__dirname, "..", "dist", "nextjs", "index.esm.js"),
  ],
  reactNative: [
    path.join(__dirname, "..", "dist", "react-native", "index.js"),
    path.join(__dirname, "..", "dist", "react-native", "index.esm.js"),
  ],
  core: [
    path.join(__dirname, "..", "dist", "index.js"),
    path.join(__dirname, "..", "dist", "index.esm.js"),
  ],
};

// Store historical bundle sizes
const HISTORY_FILE = path.join(
  __dirname,
  "..",
  ".kiro",
  "settings",
  "bundle-size-history.json"
);
const REPORT_FILE = path.join(
  __dirname,
  "..",
  "dist",
  "bundle-size-report.html"
);

// Load previous bundle sizes if available
function loadBundleSizeHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn("Could not load bundle size history:", error.message);
  }
  return {
    history: [],
    current: {
      date: new Date().toISOString(),
      sizes: {
        browser: {},
        server: {},
        nextjs: {},
        reactNative: {},
        core: {},
      },
    },
  };
}

// Save current bundle sizes
function saveBundleSizeHistory(history) {
  try {
    // Ensure directory exists
    const dir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf8");
  } catch (error) {
    console.error("Could not save bundle size history:", error.message);
  }
}

// Generate HTML report
function generateHtmlReport(history) {
  if (!history.history || history.history.length === 0) {
    console.log("No historical data available for report generation");
    return;
  }

  // Ensure history.current exists and has proper structure
  if (!history.current) {
    history.current = {
      date: new Date().toISOString(),
      sizes: {},
    };
  }

  if (!history.current.sizes) {
    history.current.sizes = {};
  }

  // Make sure all platforms exist in current sizes
  const allPlatforms = ["browser", "server", "nextjs", "reactNative", "core"];
  for (const platform of allPlatforms) {
    if (!history.current.sizes[platform]) {
      history.current.sizes[platform] = {};
    }
  }

  // Extract platforms and files from the most recent entry
  const platforms = Object.keys(history.current.sizes);
  const files = {};
  for (const platform of platforms) {
    files[platform] = Object.keys(history.current.sizes[platform] || {});
  }

  // Prepare data for charts
  const chartData = {};
  for (const platform of platforms) {
    chartData[platform] = {};
    for (const file of files[platform]) {
      chartData[platform][file] = {
        labels: [],
        data: [],
      };

      // Add current data
      chartData[platform][file].labels.push(
        new Date(history.current.date).toLocaleDateString()
      );
      chartData[platform][file].data.push(
        history.current.sizes[platform][file]
      );

      // Add historical data (in reverse to show chronological order)
      for (let i = history.history.length - 1; i >= 0; i--) {
        const entry = history.history[i];
        if (
          entry &&
          entry.sizes &&
          entry.sizes[platform] &&
          entry.sizes[platform][file] !== undefined
        ) {
          chartData[platform][file].labels.push(
            new Date(entry.date).toLocaleDateString()
          );
          chartData[platform][file].data.push(entry.sizes[platform][file]);
        }
      }

      // Limit to last 10 entries for readability
      if (chartData[platform][file].labels.length > 10) {
        chartData[platform][file].labels =
          chartData[platform][file].labels.slice(-10);
        chartData[platform][file].data =
          chartData[platform][file].data.slice(-10);
      }
    }
  }

  // Generate HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>D-Sports Wallet Bundle Size Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .platform-section {
      margin-bottom: 40px;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .chart-container {
      position: relative;
      height: 300px;
      margin-bottom: 30px;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .summary-table th, .summary-table td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }
    .summary-table th {
      background-color: #f2f2f2;
    }
    .size-increase {
      color: #e74c3c;
    }
    .size-decrease {
      color: #27ae60;
    }
    .size-unchanged {
      color: #7f8c8d;
    }
    .threshold-warning {
      background-color: #fff3cd;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>D-Sports Wallet Bundle Size Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
    
    <h2>Summary</h2>
    <table class="summary-table">
      <tr>
        <th>Platform</th>
        <th>File</th>
        <th>Current Size (KB)</th>
        <th>Previous Size (KB)</th>
        <th>Change</th>
      </tr>
      ${platforms
        .map((platform) =>
          files[platform]
            .map((file) => {
              const currentSize =
                history.current.sizes[platform] &&
                history.current.sizes[platform][file]
                  ? history.current.sizes[platform][file]
                  : 0;
              let previousSize = null;
              let previousDate = null;

              if (history.history && history.history.length > 0) {
                // Find the most recent history entry with this file
                for (let i = history.history.length - 1; i >= 0; i--) {
                  const entry = history.history[i];
                  if (
                    entry &&
                    entry.sizes &&
                    entry.sizes[platform] &&
                    entry.sizes[platform][file] !== undefined
                  ) {
                    previousSize = entry.sizes[platform][file];
                    previousDate = new Date(entry.date).toLocaleDateString();
                    break;
                  }
                }
              }

              let changeHtml = "";
              if (previousSize !== null) {
                const diff = (currentSize - previousSize).toFixed(2);
                const percentChange = (
                  ((currentSize - previousSize) / previousSize) *
                  100
                ).toFixed(2);

                if (diff > 0) {
                  changeHtml = `<span class="size-increase">+${diff} KB (${percentChange}%)</span>`;
                } else if (diff < 0) {
                  changeHtml = `<span class="size-decrease">${diff} KB (${percentChange}%)</span>`;
                } else {
                  changeHtml = `<span class="size-unchanged">No change</span>`;
                }
              } else {
                changeHtml = "<span>N/A</span>";
              }

              const isOverThreshold = currentSize > sizeThresholdKB;

              return `
            <tr${isOverThreshold ? ' class="threshold-warning"' : ""}>
              <td>${platform}</td>
              <td>${file}</td>
              <td>${currentSize} KB${isOverThreshold ? " ⚠️" : ""}</td>
              <td>${previousSize !== null ? `${previousSize} KB (${previousDate})` : "N/A"}</td>
              <td>${changeHtml}</td>
            </tr>
          `;
            })
            .join("")
        )
        .join("")}
    </table>
    
    ${platforms
      .map(
        (platform) => `
      <div class="platform-section">
        <h2>${platform.charAt(0).toUpperCase() + platform.slice(1)} Platform</h2>
        ${files[platform]
          .map(
            (file) => `
          <h3>${file}</h3>
          <div class="chart-container">
            <canvas id="chart-${platform}-${file.replace(".", "-")}"></canvas>
          </div>
        `
          )
          .join("")}
      </div>
    `
      )
      .join("")}
  </div>
  
  <script>
    // Chart configuration
    const chartConfigs = {
      ${platforms
        .map((platform) =>
          files[platform]
            .map(
              (file) => `
          'chart-${platform}-${file.replace(".", "-")}': {
            labels: ${JSON.stringify(chartData[platform][file].labels)},
            data: ${JSON.stringify(chartData[platform][file].data)}
          }
        `
            )
            .join(",")
        )
        .join(",")}
    };
    
    // Create all charts
    document.addEventListener('DOMContentLoaded', function() {
      for (const [chartId, config] of Object.entries(chartConfigs)) {
        const ctx = document.getElementById(chartId).getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: config.labels,
            datasets: [{
              label: 'Bundle Size (KB)',
              data: config.data,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Size (KB)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Date'
                }
              }
            }
          }
        });
      }
    });
  </script>
</body>
</html>
  `;

  fs.writeFileSync(REPORT_FILE, html, "utf8");
  console.log(`Bundle size report generated at: ${REPORT_FILE}`);
}

// Monitor bundle sizes
async function monitorBundleSizes() {
  console.log("Monitoring bundle sizes across platforms...\n");

  const bundleSizes = {};
  let hasWarnings = false;

  // Load history
  const historyData = loadBundleSizeHistory();

  // Monitor each platform's files
  for (const [platform, files] of Object.entries(filesToMonitor)) {
    console.log(`\n=== ${platform.toUpperCase()} PLATFORM ===`);
    bundleSizes[platform] = {};

    for (const file of files) {
      try {
        if (!fs.existsSync(file)) {
          console.log(`File not found: ${file} - skipping`);
          continue;
        }

        const content = fs.readFileSync(file, "utf8");
        const fileSizeKB = parseFloat((content.length / 1024).toFixed(2));
        const fileName = path.basename(file);

        // Store bundle size
        bundleSizes[platform][fileName] = fileSizeKB;

        console.log(`\n${fileName} (${fileSizeKB} KB):`);

        // Size threshold warning
        if (fileSizeKB > sizeThresholdKB) {
          console.log(
            `  ⚠️ Bundle size exceeds threshold of ${sizeThresholdKB} KB`
          );
          hasWarnings = true;
        }

        // Compare with previous size if available
        let previousSize = null;
        let previousDate = null;

        if (historyData.history && historyData.history.length > 0) {
          // Find the most recent history entry with this file
          for (let i = historyData.history.length - 1; i >= 0; i--) {
            const entry = historyData.history[i];
            if (
              entry.sizes[platform] &&
              entry.sizes[platform][fileName] !== undefined
            ) {
              previousSize = entry.sizes[platform][fileName];
              previousDate = new Date(entry.date).toLocaleDateString();
              break;
            }
          }
        }

        if (previousSize !== null) {
          const diff = (fileSizeKB - previousSize).toFixed(2);
          const percentChange = (
            ((fileSizeKB - previousSize) / previousSize) *
            100
          ).toFixed(2);

          if (diff > 0) {
            console.log(
              `  ⚠️ Size increased by ${diff} KB (${percentChange}%) since ${previousDate}`
            );
            if (parseFloat(diff) > 10) {
              console.log(
                `  ❗ Large increase detected! Consider optimizing the bundle.`
              );
              hasWarnings = true;
            }
          } else if (diff < 0) {
            console.log(
              `  ✅ Size decreased by ${Math.abs(diff)} KB (${Math.abs(percentChange)}%) since ${previousDate}`
            );
          } else {
            console.log(`  ℹ️ Size unchanged since ${previousDate}`);
          }
        } else {
          console.log(`  ℹ️ First size measurement for this file`);
        }
      } catch (error) {
        console.error(`Error monitoring ${file}:`, error);
      }
    }
  }

  // Update history
  const currentEntry = {
    date: new Date().toISOString(),
    sizes: bundleSizes,
  };

  if (!historyData.history) {
    historyData.history = [];
  }

  // Add current entry to history
  historyData.history.push(historyData.current || {});

  // Limit history to last 20 entries
  if (historyData.history.length > 20) {
    historyData.history = historyData.history.slice(-20);
  }

  // Set current entry
  historyData.current = currentEntry;

  // Save updated history
  saveBundleSizeHistory(historyData);

  // Generate report if requested
  if (generateReport) {
    generateHtmlReport(historyData);
  }

  console.log("\n=== SUMMARY ===");
  console.log("\nBundle Size Summary:");
  for (const [platform, sizes] of Object.entries(bundleSizes)) {
    console.log(`\n${platform.toUpperCase()}:`);
    for (const [file, size] of Object.entries(sizes)) {
      console.log(
        `  ${file}: ${size} KB${size > sizeThresholdKB ? " ⚠️" : ""}`
      );
    }
  }

  if (hasWarnings) {
    console.log(
      "\n⚠️ Some bundle size warnings were detected. Review the output above."
    );
  } else {
    console.log("\n✅ All bundle sizes are within acceptable limits.");
  }

  console.log(
    "\nSize history updated. Run with --report to generate a visual report."
  );

  return !hasWarnings;
}

// Run the monitoring
monitorBundleSizes()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Monitoring failed:", error);
    process.exit(1);
  });
