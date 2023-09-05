/*
 * Based on https://github.com/mochajs/mocha/blob/master/lib/reporters/json.js under MIT License by :
 * Copyright (c) 2011-2022 OpenJS Foundation and contributors, https://openjsf.org
 */

import Mocha from 'mocha';
import { XrayReporterOptions } from './model/xray-reporter-options';
import { ReporterService } from './service/reporter.service';

const { EVENT_TEST_END, EVENT_RUN_END, EVENT_TEST_PENDING } = Mocha.Runner.constants;

function Reporter(runner, options: { reporterOptions: XrayReporterOptions }) {
  Mocha.reporters.Base.call(this, runner, options);
  const tickets = new Map<number, Map<number, Mocha.Test>>();
  const service = ReporterService.getInstance(options);

  runner.on(EVENT_TEST_END, (test: Mocha.Test) => service.addStepToReport(test, tickets, options));
  runner.on(EVENT_TEST_PENDING, (test: Mocha.Test) => service.addStepToReport(test, tickets, options));
  runner.once(EVENT_RUN_END, () => (runner.testResults = service.writeToReport(tickets, options)), options);
}

module.exports = Reporter;
