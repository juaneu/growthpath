export class UnitFilter {
  constructor(public name?: string, public organizationId?: number) {}

  toMap(): any {
    const map = new Map();

    if (this.name != null && this.name !== '') {
      map.set('name.contains', this.name);
    }

    if (this.organizationId != null) {
      map.set('organizationId.equals', this.organizationId);
    }

    return map;
  }
}
