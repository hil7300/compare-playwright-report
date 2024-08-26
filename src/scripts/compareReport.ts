import fs from 'fs/promises';
import path from 'path';
import { parseHtmlReport } from '../utils/parseHtmlReport';

const reportPaths = {
  previous: 'C:\\Users\\Hil\\Desktop\\Projects\\Compare Report\\compare-playwright-report\\reports\\report_2024-08-23.html',
  current: 'C:\\Users\\Hil\\Desktop\\Projects\\Compare Report\\compare-playwright-report\\reports\\report_2024-08-24.html'
};

async function generateComparisonReport(prevReportPath: string, currReportPath: string, outputPath: string) {
  try {
    // Parse both reports
    const [prevReport, currReport] = await Promise.all([
      parseHtmlReport(prevReportPath),
      parseHtmlReport(currReportPath)
    ]);

    // Extract the names of failed tests
    const prevFailedTestNames = new Set(prevReport.failed.map(test => test.name));
    const currFailedTests = currReport.failed.filter(test => !prevFailedTestNames.has(test.name));

    // Generate HTML for the new failed tests
    let html = '<html><head><title>New Failed Tests Report</title></head><body><h1>New Failed Tests</h1><ul>';

    currFailedTests.forEach(test => {
      html += `<li><strong>${test.name}</strong> - Duration: ${test.duration}</li>`;
    });

    html += '</ul></body></html>';

    // Write the HTML report to a file
    await fs.writeFile(outputPath, html, 'utf8');

    console.log(`Comparison report generated: ${outputPath}`);
  } catch (error) {
    console.error('Error processing reports:', error);
  }
}

async function main() {
  const outputFolder = 'C:\\Users\\Hil\\Desktop\\Projects\\Compare Report\\compare-playwright-report\\reports\\';
  const outputPath = path.join(outputFolder, 'new_failed_tests_comparison.html');

  await generateComparisonReport(
    reportPaths.previous,
    reportPaths.current,
    outputPath
  );
}

main();
