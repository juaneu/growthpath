import { IPerson } from 'app/entities/person/person.model';
import { IOrganization } from 'app/entities/organization/organization.model';

export interface IUnit {
  id?: number;
  name?: string;
  acronym?: string;
  color?: string;
  responsable?: IPerson | null;
  organization?: IOrganization | null;
}

export class Unit implements IUnit {
  constructor(
    public id?: number,
    public name?: string,
    public acronym?: string,
    public color?: string,
    public responsable?: IPerson | null,
    public organization?: IOrganization | null
  ) {}
}

export function getUnitIdentifier(unit: IUnit): number | undefined {
  return unit.id;
}
