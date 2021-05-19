import { IDocumentType } from 'app/entities/document-type/document-type.model';
import { IPerson } from 'app/entities/person/person.model';

export interface IDocument {
  id?: number;
  fileContentType?: string;
  file?: string;
  comments?: string | null;
  type?: IDocumentType | null;
  person?: IPerson | null;
}

export class Document implements IDocument {
  constructor(
    public id?: number,
    public fileContentType?: string,
    public file?: string,
    public comments?: string | null,
    public type?: IDocumentType | null,
    public person?: IPerson | null
  ) {}
}

export function getDocumentIdentifier(document: IDocument): number | undefined {
  return document.id;
}
