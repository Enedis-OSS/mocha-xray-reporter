//FIXME default values not taken into account
export class XrayReporterOptions {
  jiraProjectId: string;
  ticketPrefix: string = '@TICKET-';
  stepPrefix: string = '@STEP-';
  reportPath: string = 'xray.json';
  manualId: string = '@MANUAL';
  screenshotDir: string = 'cypress/screenshots';
}
