export interface TestResult {
    name: string;
    duration: string;
    status: 'failed' | 'passed' | 'flaky' | 'skipped';
  }
  
  export interface Report {
    failed: TestResult[];
  }
  