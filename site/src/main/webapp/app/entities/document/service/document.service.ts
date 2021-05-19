import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocument, getDocumentIdentifier } from '../document.model';

export type EntityResponseType = HttpResponse<IDocument>;
export type EntityArrayResponseType = HttpResponse<IDocument[]>;

@Injectable({ providedIn: 'root' })
export class DocumentService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/documents');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(document: IDocument): Observable<EntityResponseType> {
    return this.http.post<IDocument>(this.resourceUrl, document, { observe: 'response' });
  }

  update(document: IDocument): Observable<EntityResponseType> {
    return this.http.put<IDocument>(`${this.resourceUrl}/${getDocumentIdentifier(document) as number}`, document, { observe: 'response' });
  }

  partialUpdate(document: IDocument): Observable<EntityResponseType> {
    return this.http.patch<IDocument>(`${this.resourceUrl}/${getDocumentIdentifier(document) as number}`, document, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDocument>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocument[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDocumentToCollectionIfMissing(documentCollection: IDocument[], ...documentsToCheck: (IDocument | null | undefined)[]): IDocument[] {
    const documents: IDocument[] = documentsToCheck.filter(isPresent);
    if (documents.length > 0) {
      const documentCollectionIdentifiers = documentCollection.map(documentItem => getDocumentIdentifier(documentItem)!);
      const documentsToAdd = documents.filter(documentItem => {
        const documentIdentifier = getDocumentIdentifier(documentItem);
        if (documentIdentifier == null || documentCollectionIdentifiers.includes(documentIdentifier)) {
          return false;
        }
        documentCollectionIdentifiers.push(documentIdentifier);
        return true;
      });
      return [...documentsToAdd, ...documentCollection];
    }
    return documentCollection;
  }
}
