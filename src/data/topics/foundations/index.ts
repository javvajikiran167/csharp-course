import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';
import { lesson08 } from './lesson-08';
import { lesson09 } from './lesson-09';

export const foundations: Topic = {
  slug: 'foundations',
  title: 'Foundations of C#',
  subtitle:
    'From why C# exists, through what actually happens when you press Run, to building a working interactive program from scratch.',
  status: 'unlocked',
  lessons: [
    lesson01,
    lesson02,
    lesson03,
    lesson04,
    lesson05,
    lesson06,
    lesson07,
    lesson08,
    lesson09,
  ],
};
