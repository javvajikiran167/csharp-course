import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';

export const loops: Topic = {
  slug: 'loops',
  title: 'Loops & Iteration',
  subtitle:
    'while, for, foreach, do-while, break/continue/return, nested loops and complexity — repetition is half of programming.',
  status: 'unlocked',
  lessons: [
    lesson01,
    lesson02,
    lesson03,
    lesson04,
    lesson05,
    lesson06,
    lesson07,
  ],
};
