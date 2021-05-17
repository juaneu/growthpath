export class OrganizationFilter {
  constructor(public name?: string) {}

  toMap(): any {
    const map = new Map();

    if (this.name != null && this.name !== '') {
      map.set('name.contains', this.name);
    }

    return map;
  }
}
