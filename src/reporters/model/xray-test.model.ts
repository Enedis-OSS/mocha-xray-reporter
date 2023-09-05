import { XrayStepModel } from './xray-step.model';
import { Typed, TypedSerializer } from 'ts-typed';
import { JiraStatus } from './jira-status.enum';

export class XrayTestModel {
  testKey: string;
  start: string;
  finish: string;
  status: JiraStatus;
  @Typed(XrayStepModel)
  steps: XrayStepModel[] = [];

  constructor(report?: Partial<XrayTestModel>) {
    Object.assign(this, report);
  }

  toJSON(): XrayTestModel {
    return TypedSerializer.serialize(this);
  }
}
