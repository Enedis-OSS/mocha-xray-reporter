import fs from 'fs';
import os from 'os';
import Path from 'path';
import Mocha from 'mocha';
import { XrayReporterOptions } from '../model/xray-reporter-options';
import { XrayTestModel } from '../model/xray-test.model';
import { XrayEvidenceModel } from '../model/xray-evidence.model';
import { XrayStepModel } from '../model/xray-step.model';
import { JiraStatus } from '../model/jira-status.enum';
import { throughDir, writeSync } from '../utils/file-utils';

export class ReporterService {
  private readonly TEST_STATUS_FAILED = "failed"
  private readonly TEST_STATUS_PENDING = "pending"
  private static instance: ReporterService;

  private constructor() {}

  static getInstance(options: { reporterOptions: XrayReporterOptions }): ReporterService {
    if (!ReporterService.instance) {
      ReporterService.instance = new ReporterService();
      const emptyReportFile = {
        ...ReporterService.generateBaseJsonReport(options),
        tests: [],
      };

      const json = JSON.stringify(emptyReportFile, null, 2);
      writeSync(options.reporterOptions.reportPath, json);
    }
    return ReporterService.instance;
  }

  static generateBaseJsonReport(options: { reporterOptions: XrayReporterOptions }) : Object {
    return {
      info: {
        summary: process.env.M2X_JIRA_TEST_EXEC_VERSION
            ? `Automatic tests execution for version ${process.env.M2X_JIRA_TEST_EXEC_VERSION}`
            : null,
      },
      testExecutionKey: process.env.M2X_JIRA_TEST_EXEC_NUMBER
          ? `${options.reporterOptions.jiraProjectId}-${process.env.M2X_JIRA_TEST_EXEC_NUMBER}`
          : null,
    }
  }

  /**
   * Add and organize a Mocha test into a list of already parsed Mocha Tests to use afterward and create xray report
   * @param test A mocha Test
   * @param tickets A Map of Mocha tests organized first by ticket then by step numbers
   * @param options The options of the reporter
   */
  addStepToReport(
    test: Mocha.Test,
    tickets: Map<number, Map<number, Mocha.Test>>,
    options: { reporterOptions: XrayReporterOptions },
  ): void {
    const TICKET_REGEXP = new RegExp(`${options.reporterOptions.ticketPrefix}[0-9]+`, 'g');
    const STEP_REGEXP = new RegExp(`${options.reporterOptions.stepPrefix}[0-9]+`, 'g');

    const ticketMatch = test.title.match(TICKET_REGEXP);
    const stepMatch = test.title.match(STEP_REGEXP);
    if (ticketMatch && stepMatch) {
      const ticketNumber = parseInt(ticketMatch?.[0]?.replace(options.reporterOptions.ticketPrefix, ''), 10);
      const stepNumber = parseInt(stepMatch?.[0]?.replace(options.reporterOptions.stepPrefix, ''));
      const ticket = tickets.get(ticketNumber) || new Map();
      ticket.set(stepNumber, test);
      tickets.set(ticketNumber, ticket);
    }
  }

  /**
   * Return a Xray compatible objet of a Ticket and its steps
   * @param ticketMap A map of the Mocha Tests corresponding to the steps
   * @param ticketNumber the ticket number
   * @param screenshotFiles an array with all the files found in the screenshot folder
   * @param options The options of the reporter
   */
  buildTicketSteps(
    ticketMap: Map<number, Mocha.Test>,
    ticketNumber: number,
    screenshotFiles: string[],
    options: { reporterOptions: XrayReporterOptions },
  ): XrayTestModel {
    const MANUAL_REGEXP = new RegExp(`${options.reporterOptions.manualId}`, 'g');
    const jsonTest = new XrayTestModel({
      testKey: `${options.reporterOptions.jiraProjectId}-${ticketNumber}`,
      steps: [],
    });

    let previousStep = 0;
    let hasTodoSteps = false;
    let hasSkippedSteps = false;
    let hasFailedSteps = false;
    let hasManualSteps = false;
    // Sort the steps to facilitate finding the missing steps
    const sortedTicketSteps = [...ticketMap.keys()].sort((a, b) => a - b);
    for (let stepNumber of sortedTicketSteps) {
      const test = ticketMap.get(stepNumber);
      // Find the missing steps and fill them with TODO status
      for (let i = previousStep + 1; i < stepNumber; i++) {
        const step = new XrayStepModel({
          status: JiraStatus.TODO,
          actualResult: `No automated test for step ${i}`,
          evidences: [],
        });
        jsonTest.steps.push(step);
        hasTodoSteps = true;
      }
      // Find the screenshots for proofs
      const ticketRegex = new RegExp(`${options.reporterOptions.ticketPrefix}${ticketNumber}[^0-9]`)
      const stepRegex = new RegExp(`${options.reporterOptions.stepPrefix}${stepNumber}[^0-9]`)
      const evidences = screenshotFiles
        .filter(screenshotPath =>
            screenshotPath.match(ticketRegex) && screenshotPath.match(stepRegex)
        )
        .filter(screenshotPath => {
          if (fs.existsSync(screenshotPath)) {
            return true;
          }

          console.log(`Screenshot file not found : ${screenshotPath}`);
          return false;
        })
        .map(screenshotPath => {
          const bitmap = fs.readFileSync(screenshotPath);
          const base64 = Buffer.from(bitmap).toString('base64');
          return new XrayEvidenceModel({
            data: base64,
            filename: Path.basename(screenshotPath),
            contentType: 'image/png',
          });
        });
      // Resolve the Step status
      let stepStatus = JiraStatus.PASS;
      switch (true) {
        case test.state === this.TEST_STATUS_FAILED:
          hasFailedSteps = true;
          stepStatus = JiraStatus.FAIL;
          break;
        case test.state === this.TEST_STATUS_PENDING:
          hasSkippedSteps = true;
          stepStatus = JiraStatus.RENONCEMENT;
          break;
        case !!test.title.match(MANUAL_REGEXP):
          hasManualSteps = true;
          stepStatus = JiraStatus.PENDING;
          break;
      }

      jsonTest.steps.push(
        new XrayStepModel({
          status: stepStatus,
          actualResult: `Automatic test step ${stepNumber}${os.EOL}${test.title}${os.EOL}Duration:${test.duration}${os.EOL}${test.body}`,
          evidences,
        }),
      );

      previousStep = stepNumber;
    }
    // Resolve the Ticket status according to its Steps statuses
    switch (true) {
      case hasFailedSteps:
        jsonTest.status = JiraStatus.FAIL;
        break;
      case hasTodoSteps:
        jsonTest.status = JiraStatus.TODO;
        break;
      case hasSkippedSteps:
        jsonTest.status = JiraStatus.RENONCEMENT;
        break;
      case hasManualSteps:
        jsonTest.status = JiraStatus.PENDING;
        break;
      default:
        jsonTest.status = JiraStatus.PASS;
        break;
    }
    return jsonTest;
  }

  /**
   * Write the reports to the configured xray file
   * @param tickets A Map of Mocha tests organised first by ticket then by step numbers
   * @param options The options of the reporter
   */
  writeToReport(
    tickets: Map<number, Map<number, Mocha.Test>>,
    options: { reporterOptions: XrayReporterOptions },
  ): {
    testExecutionKey: string | null;
    tests: XrayTestModel[];
    info: { summary: string };
  } {
    let testResults;
    if (fs.existsSync(options.reporterOptions.reportPath)) {
      // @ts-ignore
      testResults = JSON.parse(
        // @ts-ignore
        fs.readFileSync(options.reporterOptions.reportPath),
      );
      testResults.tests = this.mergeOldAndNewTests(testResults.tests, this.reportFromTickets(tickets, options));
    } else {
      testResults = {
        ...ReporterService.generateBaseJsonReport(options),
        tests: this.reportFromTickets(tickets, options),
      };
    }

    const json = JSON.stringify(testResults, null, 2);
    writeSync(options.reporterOptions.reportPath, json);

    return testResults;
  }

  /**
   * Get a Xray compatible model of the tests from the Map of Mocha tests
   * @param tickets A Map of Mocha tests organised first by ticket then by step numbers
   * @param options The options of the reporter
   */
  reportFromTickets(tickets: Map<number, Map<number, Mocha.Test>>, options: { reporterOptions: XrayReporterOptions }): XrayTestModel[] {
    const screenshotFiles = throughDir(options.reporterOptions.screenshotDir);
    const ticketsNumbers = Array.from(new Map([...tickets].sort()).keys());
    return ticketsNumbers.map(ticketNumber => {
      const ticketMap = tickets.get(ticketNumber);
      const jsonTest = this.buildTicketSteps(ticketMap, ticketNumber, screenshotFiles, options);
      // FIXME This doesn't work anymore with only mocha. Calculate the start and end date another way
      const testsByStartDate = [...ticketMap.values()]
        .filter(test => test.wallClockStartedAt)
        .sort((a, b) => +new Date(a.wallClockStartedAt) - +new Date(b.wallClockStartedAt));
      jsonTest.start = testsByStartDate[0]?.wallClockStartedAt?.substring(0, 19) + "+01:00";
      jsonTest.finish = testsByStartDate[testsByStartDate.length - 1]?.wallClockStartedAt?.substring(0, 19) + "+01:00";
      return jsonTest;
    });
  }

  /**
   * Take result of some tests and resolve with the noe ones, mainly to resolve the Tickets' status according to their Steps
   * @param oldTests
   * @param newTests
   */
  mergeOldAndNewTests(oldTests: XrayTestModel[], newTests: XrayTestModel[]): XrayTestModel[] {
    const result = [...oldTests];
    newTests.forEach(newTest => {
      const existingOldTest = result.find(oldTest => oldTest.testKey === newTest.testKey);
      if (existingOldTest) {
        newTest.steps.forEach((step, index) => {
          if (step.status !== JiraStatus.TODO || existingOldTest.steps.length <= index) {
            existingOldTest.steps[index] = step;
          }
        })
        if (existingOldTest.steps.filter(step => step.status === JiraStatus.FAIL).length) {
          existingOldTest.status = JiraStatus.FAIL
        } else if (existingOldTest.steps.filter(step => step.status === JiraStatus.TODO).length) {
          existingOldTest.status = JiraStatus.TODO
        } else if (existingOldTest.steps.filter(step => step.status === JiraStatus.RENONCEMENT).length) {
          existingOldTest.status = JiraStatus.RENONCEMENT
        } else if (existingOldTest.steps.filter(step => step.status === JiraStatus.PENDING).length) {
          existingOldTest.status = JiraStatus.PENDING
        } else {
          existingOldTest.status = JiraStatus.PASS
        }
      } else {
        result.push(newTest);
      }
    })
    return result;
  }
}
