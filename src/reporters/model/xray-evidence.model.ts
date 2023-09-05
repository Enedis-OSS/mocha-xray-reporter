export class XrayEvidenceModel {
  data: string;
  filename: string;
  contentType: string;

  constructor(evidence?: Partial<XrayEvidenceModel>) {
    Object.assign(this, evidence);
  }
}
