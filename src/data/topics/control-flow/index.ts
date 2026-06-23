import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';

// Assessment is per-lesson: each lesson carries its own inline quiz (`questions`)
// and practice problems (`challenges`), shown at the end of the lesson. The topic
// keeps only the larger end-of-topic projects, shown on the topic overview page.
export const controlFlow: Topic = {
  slug: 'control-flow',
  title: 'Control Flow',
  subtitle:
    'Make decisions in code with if/else, ternary, switch, and pattern matching — the heart of every program logic problem.',
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
      id: 'control-flow-proj-1',
      difficulty: 'starter',
      title: 'Report Card Generator',
      brief:
        'Build a console tool that turns a list of subject scores into a printed report card with per-subject letter grades, an overall average, and a pass/fail verdict. This is the realistic first version of any grading or scoring feature, and it exercises every branching construct from this topic.',
      requirements: [
        'Hardcode (or read) several subjects and their 0-100 scores — e.g. an array/list of `(string subject, int score)`.',
        'Validate each score with a **guard clause**: an out-of-range score (`< 0` or `> 100`) prints `"Invalid score for {subject}"` and is skipped, not graded.',
        'Convert each valid score to a letter grade (A/B/C/D/F) using a **switch expression with relational patterns** (`>= 90 => "A"`, etc.).',
        'Print a tidy report: one line per subject (`Math: 88 (B)`), then the overall average, then `"PASS"` if the average is `>= 60` else `"FAIL"` chosen with a ternary or if/else.',
        'Use at least one ternary `?:` somewhere it improves readability (e.g. the pass/fail string).',
      ],
      stretch: [
        'Add a GPA on a 4.0 scale (A=4, B=3, ...) computed from the letter grades.',
        'Print simple class statistics: highest, lowest, and how many subjects passed.',
        'Add a "+/-" modifier (e.g. 88 -> B+, 83 -> B, 81 -> B-) using nested relational patterns or a richer switch expression.',
      ],
      concepts: [
        'if / else if chains (ordered most-specific first)',
        'guard clauses (early return / skip)',
        'switch expression with relational patterns',
        'ternary operator',
        'boolean logic and comparison operators',
      ],
    },
    {
      id: 'control-flow-proj-2',
      difficulty: 'intermediate',
      title: 'ATM Menu Simulator',
      brief:
        'Build a menu-driven ATM that lets a user check balance, deposit, and withdraw, with full input validation and a running session. This mirrors the request-validate-act loop at the heart of almost every interactive app, and leans hard on switch statements and guard clauses.',
      requirements: [
        'Show a numbered menu (1 Balance, 2 Deposit, 3 Withdraw, 4 Quit) and read the user choice each round in a loop until they quit.',
        'Dispatch on the menu choice with a **switch statement** (or switch expression) — include a `default` arm that handles an unrecognized option gracefully.',
        'Track a `decimal balance`. Deposits must be positive (guard-clause reject otherwise). Withdrawals must be positive AND not exceed the balance — reject with a clear message using `&&` and short-circuit ordering.',
        'Validate that the menu input actually parses to a number using `int.TryParse` (the Try-pattern) rather than crashing on bad input.',
        'Keep the happy path flat: validate with guard clauses at the top of each operation, then perform the action.',
      ],
      stretch: [
        'Add a PIN check at startup: 3 attempts, then lock — driven by a counter and conditional logic.',
        'Maintain and print a transaction history (a list of strings) on demand.',
        'Add a daily withdrawal limit and enforce it with combined boolean conditions.',
      ],
      concepts: [
        'switch statement with default',
        'menu/dispatch loop',
        'guard clauses & input validation',
        'short-circuit boolean logic (&&, ||)',
        'Try-pattern (int.TryParse) for expected bad input',
      ],
    },
    {
      id: 'control-flow-proj-3',
      difficulty: 'advanced',
      title: 'Text-Adventure Command Parser',
      brief:
        'Build the command interpreter for a tiny text adventure: the player types commands like "go north" or "take key", and the engine responds based on the current room and inventory. The parsing-and-dispatch core is pure control flow, and it is the perfect showcase for pattern matching over tuples and properties.',
      requirements: [
        'Model state with enums/records: a `Room` (with exits) and a small inventory (a `List<string>`).',
        'Parse each command into a verb + optional noun (split the input string), then dispatch with a **switch expression over the `(verb, noun)` tuple** plus `when` guards for conditional cases (e.g. `("go", dir) when CurrentRoom.HasExit(dir) => ...`).',
        'Support at least: `go <direction>` (move if the exit exists, else "You can\'t go that way"), `take <item>` (only if the item is in the room), `inventory` (list carried items), and `look` (describe the room).',
        'Use **property patterns** somewhere meaningful — e.g. match on a room\'s state `{ IsLocked: true } => ...`.',
        'Reject unknown commands with a friendly default arm, and keep the main loop running until the player types `quit`.',
      ],
      stretch: [
        'Add locked doors that require a key in the inventory — a `when` guard checking both the exit and the item.',
        'Add a win condition (reach a specific room with a specific item) checked with combined boolean logic.',
        'Add list patterns to match multi-word commands more expressively.',
      ],
      concepts: [
        'tuple pattern matching in switch expressions',
        'property patterns',
        'when guards',
        'enums and state modeling',
        'parsing + dispatch loop',
        'combined boolean conditions',
      ],
    },
  ],
};
