export interface IDocumentType {
  id?: number;
  name?: string;
}

export class DocumentType implements IDocumentType {
  constructor(public id?: number, public name?: string) {}
}

export function getDocumentTypeIdentifier(documentType: IDocumentType): number | undefined {
  return documentType.id;
}
