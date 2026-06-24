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

// Assessment is per-lesson (each lesson carries its own inline quiz + practice).
// The topic keeps the larger end-of-topic projects, shown on the topic overview page.
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
  projects: [
    {
      id: 'foundations-proj-1',
      difficulty: 'starter',
      title: 'Receipt & Change Calculator',
      brief:
        'Build a console program that prices a small shopping basket — subtotal, tax, total, and the change owed from cash tendered. It is the most realistic first program you can write with only variables, arithmetic, and formatting, and it forces you to pick the right numeric type for money.',
      requirements: [
        'Declare a `const decimal TaxRate` (e.g. 0.08m) at the top — a named constant, not a magic number.',
        'Hardcode (or read) 2-3 items as `(name, unitPrice, quantity)` and compute the subtotal with `decimal` arithmetic — explain in a comment why `decimal` is correct for money and `double` is not.',
        'Compute tax = subtotal * TaxRate and total = subtotal + tax.',
        'Read a `cashGiven` amount and compute change = cashGiven - total; if it is negative, print `"Insufficient funds"` instead.',
        'Print a tidy, aligned receipt using string interpolation with currency formatting (`{total:C}`), one line per item plus subtotal, tax, total, and change.',
      ],
      stretch: [
        'Add a tip: read a tip percentage and add a tip line before the total.',
        'Round half-to-even and show the rounding behaviour with `Math.Round(value, 2, MidpointRounding.ToEven)`.',
        'Support a discount code that takes a flat amount or a percentage off the subtotal.',
      ],
      concepts: [
        'variables and the decimal type for money',
        'named constants (const)',
        'arithmetic operators and precedence',
        'string interpolation + currency formatting ({0:C})',
        'basic validation (negative change)',
      ],
    },
    {
      id: 'foundations-proj-2',
      difficulty: 'intermediate',
      title: 'Interactive Profile Card Generator',
      brief:
        'Build a program that interviews the user (name, birth year, city, favourite language), validates the input, then prints a neatly formatted multi-line "profile card". This is the canonical input → process → output program every developer writes first, and it makes you handle the reality that user input is text that might be wrong.',
      requirements: [
        'Read several values with `Console.ReadLine()`. Parse the birth year with `int.TryParse` (the Try-pattern) and re-prompt or print a clear error on bad input — never let the program crash on `"abc"`.',
        'Compute the user\'s age from the birth year and a `const int CurrentYear`.',
        'Guard against nonsense: a birth year in the future or more than 120 years ago prints a friendly message instead of a silly age.',
        'Print a bordered, aligned profile card using string interpolation and `\\n`, e.g. a box with name, age, city, and language.',
        'Keep all the "magic" values (current year, max age) as named constants at the top.',
      ],
      stretch: [
        'Loop the whole interview until the user types `done`, collecting several profiles.',
        'Add string polish: trim whitespace, title-case the name, and reject an empty name.',
        'Print the card width dynamically so the border matches the longest line.',
      ],
      concepts: [
        'Console input and the input → process → output shape',
        'int.TryParse (Try-pattern) for expected bad input',
        'string interpolation, escapes, and formatting',
        'named constants and simple validation/guards',
        'computing derived values (age)',
      ],
    },
  ],
};
