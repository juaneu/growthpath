import { IUser } from 'app/entities/user/user.model';

export interface IOrganization {
  id?: number;
  name?: string;
  logoContentType?: string | null;
  logo?: string | null;
  responsable?: IUser | null;
}

export class Organization implements IOrganization {
  constructor(
    public id?: number,
    public name?: string,
    public logoContentType?: string | null,
    public logo?: string | null,
    public responsable?: IUser | null
  ) {}
}

export function getOrganizationIdentifier(organization: IOrganization): number | undefined {
  return organization.id;
}
