import { ISkillCategory } from 'app/entities/skill-category/skill-category.model';

export interface ISkill {
  id?: number;
  name?: string;
  skillCategory?: ISkillCategory | null;
}

export class Skill implements ISkill {
  constructor(public id?: number, public name?: string, public skillCategory?: ISkillCategory | null) {}
}

export function getSkillIdentifier(skill: ISkill): number | undefined {
  return skill.id;
}
