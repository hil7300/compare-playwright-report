import path from 'path';
import { parseHtmlReport } from '../utils/parseHtmlReport';
import fs from 'fs/promises';

const reportPaths = [
  'C:\\Users\\Hil\\Desktop\\Projects\\Compare Report\\compare-playwright-report\\reports\\report_2024-08-24.html',
  'C:\\Users\\Hil\\Desktop\\Projects\\Compare Report\\compare-playwright-report\\reports\\report_2024-08-25.html'
];

async function generateHtmlReport(reportPath: string, outputPath: string) {
  try {
    const report = await parseHtmlReport(reportPath);

    let html = '<html><head><title>Failed Tests Report</title></head><body><h1>Failed Tests</h1><ul>';

    report.failed.forEach(test => {
      html += `<li><strong>${test.name}</strong> - Duration: ${test.duration}</li>`;
    });

    html += '</ul></body></html>';

    // Write the HTML report to a file
    await fs.writeFile(outputPath, html, 'utf8');

    console.log(`Report generated: ${outputPath}`);
  } catch (error) {
    console.error('Error processing report:', error);
  }
}

async function main() {
  const outputFolder = 'C:\\Users\\Hil\\Desktop\\Projects\\Compare Report\\reports\\';
  
  // Generate HTML reports for each reportPath
  for (const reportPath of reportPaths) {
    const dateMatch = reportPath.match(/report_(\d{4}-\d{2}-\d{2})\.html/);
    if (dateMatch) {
      const date = dateMatch[1];
      const outputPath = path.join(outputFolder, `newly_failed_tests_${date}.html`);
      await generateHtmlReport(reportPath, outputPath);
    }
  }
}

main();
