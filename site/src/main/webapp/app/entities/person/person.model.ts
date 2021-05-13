import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IUnit } from 'app/entities/unit/unit.model';

export interface IPerson {
  id?: number;
  name?: string;
  jobDescription?: string;
  email?: string;
  acronym?: string;
  birthDate?: dayjs.Dayjs | null;
  imageContentType?: string | null;
  image?: string | null;
  user?: IUser | null;
  area?: IUnit | null;
}

export class Person implements IPerson {
  constructor(
    public name?: string,
    public jobDescription?: string,
    public email?: string,
    public acronym?: string,
    public birthDate?: dayjs.Dayjs | null,
    public imageContentType?: string | null,
    public image?: string | null,
    public user?: IUser | null,
    public area?: IUnit | null
  ) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
