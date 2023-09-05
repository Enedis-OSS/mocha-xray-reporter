import { XrayEvidenceModel } from './xray-evidence.model';
import { Typed, TypedSerializer } from 'ts-typed';

export class XrayStepModel {
  status: string;
  actualResult: string;

  @Typed(XrayEvidenceModel)
  evidences: XrayEvidenceModel[] = [];

  constructor(step?: Partial<XrayStepModel>) {
    Object.assign(this, step);
  }

  toJSON(): XrayStepModel {
    return TypedSerializer.serialize(this);
  }
}
