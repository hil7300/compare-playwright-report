import { chromium } from 'playwright';
import path from 'path';
import { Report, TestResult } from '../types';

export async function parseHtmlReport(reportPath: string): Promise<Report> {
  // Launch a headless browser instance
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Load the report HTML file in the browser
  const reportUrl = `file://${path.resolve(reportPath)}`;
  await page.goto(reportUrl);

  // Extract the failed tests from the loaded page
  const failedTests: TestResult[] = await page.$$eval(
    '.test-file-test.test-file-test-outcome-unexpected',
    (elements) =>
      elements.map((element) => ({
        name: (element.querySelector('.test-file-title') as HTMLElement)?.innerText.trim(),
        duration: (element.querySelector('.test-duration') as HTMLElement)?.innerText.trim(),
        status: 'failed',
      }))
  );

  // Print the failed tests in a readable format
  console.log("Failed Tests:", JSON.stringify(failedTests, null, 2));

  // Close the browser
  await browser.close();

  return { failed: failedTests };
}
