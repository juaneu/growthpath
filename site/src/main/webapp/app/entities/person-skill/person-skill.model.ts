import { IPerson } from 'app/entities/person/person.model';
import { ISkill } from 'app/entities/skill/skill.model';
import { SkillLevel } from 'app/entities/enumerations/skill-level.model';

export interface IPersonSkill {
  id?: number;
  comments?: string | null;
  level?: SkillLevel;
  person?: IPerson | null;
  skill?: ISkill | null;
}

export class PersonSkill implements IPersonSkill {
  constructor(
    public id?: number,
    public comments?: string | null,
    public level?: SkillLevel,
    public person?: IPerson | null,
    public skill?: ISkill | null
  ) {}
}

export function getPersonSkillIdentifier(personSkill: IPersonSkill): number | undefined {
  return personSkill.id;
}
