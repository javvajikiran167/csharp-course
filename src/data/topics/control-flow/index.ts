import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';

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
  quiz: [
    {
      id: 'control-flow-q1',
      kind: 'predict',
      prompt: 'For value types, `==` and `.Equals()` compare by value. Predict the output:',
      code: 'int x = 5;\nint y = 5;\nConsole.WriteLine(x == y);\nConsole.WriteLine(x.Equals(y));',
      options: [
        { label: 'True\\nTrue', correct: true },
        { label: 'True\\nFalse' },
        { label: 'False\\nTrue' },
        { label: 'Compile error' },
      ],
      explanation:
        'For value types like `int`, both `==` and `.Equals()` compare the underlying value, so both print `True`. The distinction only bites for **reference types** (custom classes, arrays), where `==` compares references by default. Coming from Python: `==` here behaves like Python\'s `==`, while C# reference comparison is closer to Python\'s `is`.',
    },
    {
      id: 'control-flow-q2',
      kind: 'predict',
      prompt: 'Arrays are reference types. Predict the output:',
      code: 'int[] a = { 1, 2, 3 };\nint[] b = { 1, 2, 3 };\nConsole.WriteLine(a == b);\nConsole.WriteLine(a.SequenceEqual(b));',
      options: [
        { label: 'False\\nTrue', correct: true },
        { label: 'True\\nTrue' },
        { label: 'False\\nFalse' },
        { label: 'True\\nFalse' },
      ],
      explanation:
        '`a` and `b` are two distinct arrays in memory with identical contents. `==` on arrays compares **references**, so it is `False`. To compare contents element-by-element, use `a.SequenceEqual(b)` (from `System.Linq`), which is `True`. This reference-vs-value trap is one of the most common beginner surprises in C#.',
    },
    {
      id: 'control-flow-q3',
      kind: 'mcq',
      prompt: 'You write `if (0 < age < 100)` to check age is in range, like you might in Python. What happens in C#?',
      options: [
        { label: 'It works correctly, same as Python.' },
        { label: 'It is a compile error — you cannot compare a `bool` to an `int`.', correct: true },
        { label: 'It compiles but always returns true.' },
        { label: 'It compiles but throws at runtime.' },
      ],
      explanation:
        'C# evaluates `0 < age` first, producing a `bool`, then tries `bool < 100` — comparing a `bool` to an `int`, which the compiler rejects. Unlike Python, C# has **no chained comparison**. The correct form is `age > 0 && age < 100`. (A modern alternative is the relational pattern `age is > 0 and < 100`, covered later in this topic.)',
    },
    {
      id: 'control-flow-q4',
      kind: 'predict',
      prompt: 'In an if / else-if chain, the FIRST matching branch wins. Predict the output:',
      code: 'int score = 85;\n\nif (score >= 50)\n    Console.WriteLine("Pass");\nelse if (score >= 80)\n    Console.WriteLine("Excellent");\nelse\n    Console.WriteLine("Fail");',
      options: [
        { label: 'Pass', correct: true },
        { label: 'Excellent' },
        { label: 'Pass\\nExcellent' },
        { label: 'Fail' },
      ],
      explanation:
        '`85 >= 50` is true, so the first branch runs and the rest of the chain is skipped — even though `>= 80` would also be true. **Order matters**: put the most specific / highest-threshold condition first (`>= 80` before `>= 50`) when you want it to win. This ordering bug is extremely common in grade and tier logic.',
    },
    {
      id: 'control-flow-q5',
      kind: 'predict',
      prompt: 'Without braces, an `if` governs only the single next statement. Predict the output for `age = 15`:',
      code: 'int age = 15;\nif (age >= 18)\n    Console.WriteLine("Adult");\n    Console.WriteLine("Welcome");',
      options: [
        { label: 'Welcome', correct: true },
        { label: '(nothing prints)' },
        { label: 'Adult\\nWelcome' },
        { label: 'Compile error — missing braces' },
      ],
      explanation:
        'Only `Console.WriteLine("Adult")` is inside the `if`; the indentation of the second line is misleading — it is **not** part of the `if` and always runs. So for age 15, only `Welcome` prints. This is the classic "dangling statement" bug; always use braces (`{ }`) even for one-line bodies to make scope explicit.',
    },
    {
      id: 'control-flow-q6',
      kind: 'mcq',
      prompt: 'What is the strongest reason to prefer guard clauses (early `return`) over deeply nested `if` blocks?',
      options: [
        { label: 'Guard clauses run faster at runtime.' },
        { label: 'They keep the happy path flat and readable, and handle each precondition in one place.', correct: true },
        { label: 'Nested ifs produce a compiler warning.' },
        { label: 'Guard clauses use less memory.' },
      ],
      explanation:
        'Performance is identical — the win is **readability and maintainability**. Each precondition is checked and exited up front (`if (input is null) return;`), so the main success path stays at a single indentation level instead of marching rightward. This "return early" style is a frequent code-review and interview talking point.',
    },
    {
      id: 'control-flow-q7',
      kind: 'predict',
      prompt: 'The ternary `?:` is an expression that yields a value. Predict the output:',
      code: 'int n = 7;\nstring parity = n % 2 == 0 ? "even" : "odd";\nConsole.WriteLine($"{n} is {parity}");',
      options: [
        { label: '7 is odd', correct: true },
        { label: '7 is even' },
        { label: '7 is odd\\n7 is even' },
        { label: 'Compile error' },
      ],
      explanation:
        'The ternary `condition ? a : b` evaluates the condition and returns `a` when true, `b` when false. `7 % 2` is `1`, so `n % 2 == 0` is false and `parity` becomes `"odd"`. Use the ternary for short value selection; reach for `if/else` when the branches contain statements or grow complex. Both arms must be type-compatible.',
    },
    {
      id: 'control-flow-q8',
      kind: 'fill',
      prompt: 'Fill in the operator that returns the left value if it is non-null, otherwise the right fallback — used here to default a possibly-null name.',
      template: 'string? input = null;\nstring name = input ___ "Guest";\nConsole.WriteLine(name); // Guest',
      accept: ['??'],
      explanation:
        'The **null-coalescing** operator `??` returns its left operand when it is non-null, otherwise the right. `null ?? "Guest"` is `"Guest"`. Its cousin `??=` assigns only when the left is null (`config ??= LoadDefaults();`), and `?.` (null-conditional) safely short-circuits a member access on null. Together they replace verbose `if (x == null)` null-handling.',
    },
    {
      id: 'control-flow-q9',
      kind: 'mcq',
      prompt: 'How does a C# `switch` STATEMENT differ from C/JavaScript regarding fall-through between cases?',
      options: [
        { label: 'C# silently falls through to the next case, just like C.' },
        { label: 'C# forbids implicit fall-through — each non-empty case must end with `break` (or `return`/`throw`/`goto`).', correct: true },
        { label: 'C# requires `continue` at the end of each case.' },
        { label: 'C# runs every case after the first match.' },
      ],
      explanation:
        'C# does **not** allow implicit fall-through from one non-empty `case` to the next — the compiler errors if you forget `break`. This eliminates the classic C "forgot the break" bug. You *can* stack labels for a shared body (`case 1: case 2: ...;`), and you can jump explicitly with `goto case`, but you can never accidentally drop through.',
    },
    {
      id: 'control-flow-q10',
      kind: 'predict',
      prompt: 'Stacked case labels share one body. Predict the output for `day = "Sun"`:',
      code: 'string day = "Sun";\nswitch (day)\n{\n    case "Sat":\n    case "Sun":\n        Console.WriteLine("Weekend");\n        break;\n    default:\n        Console.WriteLine("Weekday");\n        break;\n}',
      options: [
        { label: 'Weekend', correct: true },
        { label: 'Weekday' },
        { label: 'Weekend\\nWeekday' },
        { label: 'Compile error — empty case "Sat"' },
      ],
      explanation:
        'An **empty** case label (`case "Sat":` with no statements) is allowed to share the body of the case below it, so both `"Sat"` and `"Sun"` print `Weekend`. This is the legal, intentional form of fall-through. The `default` runs only when no case matches.',
    },
    {
      id: 'control-flow-q11',
      kind: 'predict',
      prompt: 'A `switch` EXPRESSION returns a value using `=>` arms and `_` for the default. Predict the output:',
      code: 'int day = 3;\nstring name = day switch\n{\n    1 => "Mon",\n    2 => "Tue",\n    3 => "Wed",\n    _ => "Other",\n};\nConsole.WriteLine(name);',
      options: [
        { label: 'Wed', correct: true },
        { label: 'Other' },
        { label: 'Tue' },
        { label: 'Compile error — missing break' },
      ],
      explanation:
        'A switch **expression** (`day switch { ... }`) evaluates to a value — no `case`/`break`, just `pattern => result` arms separated by commas, with `_` as the discard/default. `day` is `3`, so `name` is `"Wed"`. Switch expressions are exhaustive: if no arm matches and there is no `_`, it throws at runtime, so always include `_` unless every case is provably covered.',
    },
    {
      id: 'control-flow-q12',
      kind: 'predict',
      prompt: 'Relational + logical patterns let an arm test ranges. Predict the output for `score = 72`:',
      code: 'int score = 72;\nstring grade = score switch\n{\n    >= 90 => "A",\n    >= 80 => "B",\n    >= 70 => "C",\n    _ => "F",\n};\nConsole.WriteLine(grade);',
      options: [
        { label: 'C', correct: true },
        { label: 'B' },
        { label: 'F' },
        { label: 'A' },
      ],
      explanation:
        'Switch-expression arms can be **relational patterns** (`>= 70`) and combine with `and`/`or`/`not` as **logical patterns** (e.g. `>= 0 and < 60`). Arms are tested top to bottom, so `72` matches the first arm that is true, `>= 70`, giving `"C"`. This collapses a long if/else-if grade chain into a compact, exhaustive table.',
    },
    {
      id: 'control-flow-q13',
      kind: 'mcq',
      prompt: 'You have a `point` with `X` and `Y` properties and want one arm to match "on the X axis". Which switch-expression pattern does that idiomatically?',
      options: [
        { label: '`point when point.Y == 0 => ...` using a `when` guard or a property pattern `{ Y: 0 }`', correct: true },
        { label: '`case point.Y == 0:` — switch statements only' },
        { label: '`point.Y is 0 break;`' },
        { label: 'You cannot match on a property; you must use nested ifs.' },
      ],
      explanation:
        'A **property pattern** `{ Y: 0 }` matches when `point.Y == 0`; you can nest and combine them (`{ X: 0, Y: 0 } => "origin"`). For arbitrary boolean conditions, add a `when` guard (`var p when p.Y == 0 => ...`). Type patterns (`Circle c => c.Radius`), positional/tuple patterns, and list patterns round out C#\'s pattern-matching toolbox — far more expressive than a value-only `switch`.',
    },
    {
      id: 'control-flow-q14',
      kind: 'predict',
      prompt: '`&&` short-circuits: if the left side is false, the right side is never evaluated. Predict the output:',
      code: 'string? name = null;\nif (name != null && name.Length > 3)\n    Console.WriteLine("long name");\nelse\n    Console.WriteLine("no / short name");',
      options: [
        { label: 'no / short name', correct: true },
        { label: 'long name' },
        { label: 'Throws NullReferenceException' },
        { label: 'Compile error' },
      ],
      explanation:
        '`name != null` is false, so `&&` **short-circuits** and never evaluates `name.Length` — avoiding a `NullReferenceException`. Ordering the null check first is the whole point. (`||` short-circuits the opposite way: a true left side skips the right.) This guard-by-ordering pattern is everywhere; the modern shorthand is `name?.Length > 3`.',
    },
  ],
  practice: [
    {
      id: 'control-flow-p1',
      difficulty: 'easy',
      title: 'Even, Odd, and Sign',
      prompt:
        'Warm-up on basic conditionals. Hardcode an `int n` (test with a few values: 0, 7, -4).\n\n- Print whether `n` is `"even"` or `"odd"` using `n % 2`.\n- On a second line, print `"positive"`, `"negative"`, or `"zero"` using an `if / else if / else` chain.\n\nRun it for all three test values and confirm `0` reports `even` and `zero`.',
      hints: [
        '`n % 2 == 0` is even. Negative numbers are still even/odd by the same rule.',
        'Handle the `zero` case explicitly — it is neither positive nor negative.',
      ],
    },
    {
      id: 'control-flow-p2',
      difficulty: 'easy',
      title: 'FizzBuzz',
      prompt:
        'The classic interview warm-up. Hardcode an `int n` (test 3, 5, 15, 7).\n\n- Divisible by 3 AND 5 -> print `"FizzBuzz"`.\n- Divisible by 3 only -> `"Fizz"`.\n- Divisible by 5 only -> `"Buzz"`.\n- Otherwise -> print the number itself.\n\nUse an `if / else if / else` chain and **check the both-case first**. In a comment, explain why the order of the checks matters.',
      hints: [
        'Check `n % 3 == 0 && n % 5 == 0` (or `n % 15 == 0`) BEFORE the single-divisor cases.',
        'If you check `% 3` first, 15 would wrongly print `Fizz` and never reach the FizzBuzz case.',
      ],
    },
    {
      id: 'control-flow-p3',
      difficulty: 'easy',
      title: 'Leap Year Checker',
      prompt:
        'A year is a leap year if it is divisible by 4, EXCEPT century years, which must be divisible by 400. So 2000 and 2024 are leap years; 1900 and 2023 are not.\n\nHardcode an `int year` and print `"{year} is a leap year"` or `"{year} is not a leap year"`. Express the rule as a single `bool isLeap = ...` using `&&`, `||`, and parentheses.\n\nTest with 2000, 1900, 2024, 2023.',
      hints: [
        'The rule: `(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)`.',
        'Parentheses matter — `&&` binds tighter than `||`, but be explicit so the intent is obvious.',
      ],
    },
    {
      id: 'control-flow-p4',
      difficulty: 'medium',
      title: 'Grade Calculator with Guard Clauses',
      prompt:
        'Read (or hardcode) a `score` from 0-100 and print its letter grade: A (90+), B (80+), C (70+), D (60+), F (below 60).\n\nRequirements:\n- **Guard clause first**: if `score < 0 || score > 100`, print `"Invalid score"` and `return` immediately — do not fall into the grade logic.\n- Then compute the grade with an `if / else if` chain ordered highest threshold first.\n\nTest with -5, 105, 90, 73, 59. In a comment, explain why the guard clause keeps the main logic flat.',
      hints: [
        'Guard: `if (score < 0 || score > 100) { Console.WriteLine("Invalid score"); return; }`',
        'After the guard, you can assume the score is valid — the grade chain has no nesting.',
      ],
    },
    {
      id: 'control-flow-p5',
      difficulty: 'medium',
      title: 'Calculator with a switch Expression',
      prompt:
        'Build a tiny calculator. Given two `double` operands and a `char op` (one of `+ - * /`), compute the result using a **switch expression**:\n\n```\ndouble result = op switch { ... };\n```\n\nRequirements:\n- One arm per operator.\n- A `\'/\'` arm that guards against divide-by-zero — use a `when` guard or check `b` and throw/return a sentinel with a message.\n- A `_` arm that throws `new ArgumentException($"Unknown operator: {op}")`.\n\nTest each operator plus an unknown one. Note in a comment how the switch expression is more compact than an if/else chain here.',
      hints: [
        'Arm syntax: `\'+\' => a + b,` then `\'-\' => a - b,` and so on.',
        'Divide guard: `\'/\' when b != 0 => a / b,` and a following arm or check for `b == 0`.',
      ],
    },
    {
      id: 'control-flow-p6',
      difficulty: 'medium',
      title: 'BMI Categorizer with Relational Patterns',
      prompt:
        'Compute Body Mass Index and categorize it. Given `double weightKg` and `double heightM`, compute `bmi = weightKg / (heightM * heightM)`.\n\nThen map `bmi` to a category using a **switch expression with relational + logical patterns**:\n- `< 18.5` -> `"Underweight"`\n- `>= 18.5 and < 25` -> `"Normal"`\n- `>= 25 and < 30` -> `"Overweight"`\n- `>= 30` -> `"Obese"`\n\nPrint the BMI rounded to one decimal and its category. Test a few weight/height pairs.',
      hints: [
        'Combine bounds with `and`: `>= 18.5 and < 25 => "Normal",`.',
        'Order is flexible because the ranges are disjoint, but keep them readable low-to-high.',
      ],
    },
    {
      id: 'control-flow-p7',
      difficulty: 'medium',
      title: 'Triangle Classifier',
      prompt:
        'Read three side lengths as `double` a, b, c.\n\n- First validate: the three sides form a triangle only if **every pair sums to more than the third** (`a + b > c && a + c > b && b + c > a`). If invalid, print `"Not a triangle"` and stop.\n- If valid, classify as `"Equilateral"` (all three equal), `"Isosceles"` (exactly two equal), or `"Scalene"` (none equal). Order the checks most-specific first.\n\nTest with (3,3,3), (3,3,5), (3,4,5), and (1,1,5).',
      hints: [
        'Validity is one bool combining three comparisons with `&&`.',
        'Equilateral first (all equal), then isosceles (any two equal), else scalene.',
      ],
    },
    {
      id: 'control-flow-p8',
      difficulty: 'hard',
      title: 'Traffic Light State Machine',
      prompt:
        'Model a traffic light that cycles Green -> Yellow -> Red -> Green. Use an `enum Light { Green, Yellow, Red }`.\n\nRequirements:\n- Write `Light Next(Light current)` that returns the next state using a **switch expression** with one arm per state (and a `_` arm that throws for an unexpected value).\n- Write `string Action(Light l)` returning `"Go"`, `"Slow down"`, or `"Stop"`.\n- In `Main`, start at `Green` and print the state + action for 6 transitions, calling `Next` in a loop.\n\nConfirm the cycle repeats correctly. In a comment, explain why a switch expression over an enum is safer than a chain of `if (l == Light.Green)`.',
      hints: [
        'Arm: `Light.Green => Light.Yellow,` etc. The `_` arm guards against an out-of-range enum value.',
        'Enums are just named integers — `(Light)99` is technically possible, which is why the `_` arm matters.',
      ],
    },
    {
      id: 'control-flow-p9',
      difficulty: 'hard',
      title: 'Rock-Paper-Scissors with Tuple Patterns',
      prompt:
        'Decide a Rock-Paper-Scissors round using **tuple pattern matching** — no long if/else.\n\nRequirements:\n- `enum Move { Rock, Paper, Scissors }`.\n- Write `string Winner(Move p1, Move p2)` using a switch on the tuple `(p1, p2)`:\n  - Equal moves -> `"Draw"` (use a `when` guard `var (a, b) when a == b => "Draw"` or list the three tie tuples).\n  - The three winning combinations for player 1 -> `"P1 wins"`.\n  - `_` -> `"P2 wins"`.\n- In `Main`, test all 9 combinations and print each result.\n\nIn a comment, explain how tuple patterns collapse a 3x3 decision table into a few arms.',
      hints: [
        'Switch on a tuple: `(p1, p2) switch { (Move.Rock, Move.Scissors) => "P1 wins", ... }`.',
        'Handle draws first with a `when` guard, then the three P1 wins, then `_ => "P2 wins"`.',
      ],
    },
    {
      id: 'control-flow-p10',
      difficulty: 'hard',
      title: 'Shipping Cost Engine',
      prompt:
        'Interview-grade. Compute a shipping cost from weight and destination using clean, layered control flow — no deeply nested ifs.\n\nGiven `double weightKg` and `string zone` (`"domestic"`, `"intl"`), and a `bool express` flag:\n- **Guard** invalid input up front: weight `<= 0` -> throw `ArgumentOutOfRangeException`; unknown `zone` -> throw `ArgumentException`.\n- Base cost by weight band using a **switch expression with relational patterns**: `<= 1 => 5`, `<= 5 => 12`, `<= 20 => 30`, `_ => 50`.\n- Multiply by a zone factor (`domestic` 1.0, `intl` 2.5) chosen with a switch expression.\n- If `express`, add 50% surcharge.\n- Return the final cost; in `Main`, print a small table of 4-5 scenarios.\n\nIn a comment, explain how you kept the branching readable (guards + switch expressions) instead of one giant nested `if`.',
      hints: [
        'Compose small pieces: a `BaseCost(weight)` switch expression, a `ZoneFactor(zone)` switch expression, then combine.',
        'Apply the express surcharge as a final multiply: `express ? cost * 1.5 : cost`.',
      ],
    },
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
