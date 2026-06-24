import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';

// Assessment is per-lesson (each lesson carries its own inline quiz + practice).
// The topic keeps the larger end-of-topic projects, shown on the topic overview page.
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
  projects: [
    {
      id: 'loops-proj-1',
      difficulty: 'starter',
      title: 'ASCII Pattern Printer',
      brief:
        'Build a console tool that draws text shapes — a right triangle, a pyramid, and a hollow square — at a size the user chooses. Patterns are the classic way to truly internalize nested loops: the outer loop is rows, the inner loop is columns, and the relationship between them is the whole puzzle.',
      requirements: [
        'Read an integer `size` from the user with `int.TryParse` and reject non-numbers or sizes below 1.',
        'Print a left-aligned right triangle of `*` with `size` rows using a nested `for` loop (row r prints r stars).',
        'Print a centered pyramid of `size` rows — each row has leading spaces plus an odd number of stars — using nested loops and arithmetic on the loop variables.',
        'Print a hollow square of side `size`: stars only on the border, spaces inside — use a condition on the row/column indices to decide border vs interior.',
        'Keep each shape in its own method (e.g. `void Triangle(int n)`) so `Main` just calls them.',
      ],
      stretch: [
        'Add a diamond (pyramid + inverted pyramid).',
        'Let the user pick the fill character instead of `*`.',
        'Add a number triangle (row r prints 1..r) to practice using the inner index as a value, not just a counter.',
      ],
      concepts: [
        'nested for loops (rows × columns)',
        'using loop variables in arithmetic and conditions',
        'break/continue and boundary conditions',
        'extracting loops into methods',
        'int.TryParse input validation',
      ],
    },
    {
      id: 'loops-proj-2',
      difficulty: 'intermediate',
      title: 'Number Theory Explorer',
      brief:
        'Build a menu-driven console app that answers number questions: list primes up to N, compute a factorial, print a Fibonacci sequence, and find a GCD — each implemented with loops, not library calls. This is the kind of loop-and-accumulator reasoning that underlies real algorithms and shows up constantly in interviews.',
      requirements: [
        'Show a menu in a loop (1 Primes, 2 Factorial, 3 Fibonacci, 4 GCD, 5 Quit) and keep running until the user quits — a classic `while (true)` with a `break` on quit.',
        'Primes up to N: for each candidate, test divisibility with an inner loop and use `break` to stop early once a divisor is found; print all primes ≤ N.',
        'Factorial of n: accumulate a running product with a `for` loop; guard against negative input and note (in a comment) where `long` overflows.',
        'Fibonacci: print the first n terms by carrying two running variables and updating them each iteration (no recursion).',
        'GCD of a and b: use the Euclidean algorithm with a `while` loop (`while (b != 0) { (a, b) = (b, a % b); }`).',
        'Validate every numeric input with `int.TryParse`; bad input returns to the menu instead of crashing.',
      ],
      stretch: [
        'Replace the trial-division primes with the Sieve of Eratosthenes and compare how much faster it is for large N — a concrete lesson in complexity.',
        'Add `continue` to skip even numbers > 2 in the prime check.',
        'Detect and report perfect numbers (equal to the sum of their proper divisors) up to N.',
      ],
      concepts: [
        'while / for / do-while and the menu loop',
        'break and continue for early exit and skipping',
        'accumulator pattern (running product / sum / pair)',
        'nested loops and basic time complexity (trial division vs sieve)',
        'input validation in a long-running loop',
      ],
    },
  ],
};
