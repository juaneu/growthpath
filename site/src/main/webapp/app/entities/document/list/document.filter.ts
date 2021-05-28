export class DocumentFilter {
  constructor(public personId?: number) {}

  toMap(): any {
    const map = new Map();

    if (this.personId != null) {
      map.set('personId.equals', this.personId);
    }

    return map;
  }
}
