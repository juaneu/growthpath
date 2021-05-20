import { IUnit } from 'app/entities/unit/unit.model';

export class SkillCategoryFilter {
  constructor(public name?: string, public unit?: IUnit) {}

  myMap(): any {
    const map = new Map();

    // NAME
    if (this.name != null && this.name !== '') {
      map.set('name.contains', this.name);
    }
    // UNIT
    if (this.unit != null && this.unit !== '') {
      map.set('unitId.equals', this.unit);
    }
    return map;
  }
}
