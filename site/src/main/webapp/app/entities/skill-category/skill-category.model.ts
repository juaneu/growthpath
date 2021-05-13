import { ISkill } from 'app/entities/skill/skill.model';
import { IUnit } from 'app/entities/unit/unit.model';

export interface ISkillCategory {
  id?: number;
  name?: string;
  skills?: ISkill[] | null;
  unit?: IUnit | null;
}

export class SkillCategory implements ISkillCategory {
  constructor(public id?: number, public name?: string, public skills?: ISkill[] | null, public unit?: IUnit | null) {}
}

export function getSkillCategoryIdentifier(skillCategory: ISkillCategory): number | undefined {
  return skillCategory.id;
}
