import { Raw } from 'typeorm';
import { STRING_UTILITIES } from '@common/application/services';

const like = (pattern: string) => {
  return Raw(value => `LOWER(${value}) Like '%${STRING_UTILITIES.lowerCaseAndTrim(pattern)}%'`);
};

const take = (pattern: string, take = 5) => {
  return pattern ? take : undefined;
};

export const TYPE_ORM_UTILITIES = {
  like,
  take,
};
