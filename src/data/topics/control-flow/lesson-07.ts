import type { Lesson } from '@/data/types';

export const lesson07: Lesson = {
  slug: 'mini-project-control',
  number: 7,
  title: 'Mini-Project — Number Guessing Game',
  objective:
    'Apply every control-flow construct from the topic — booleans, `if/else`, ternary, `switch`, short-circuit — in one interactive console game.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Time to put it all together. We will build a classic number-guessing game: the computer picks a number, the player guesses, and the program tells them higher / lower / correct. It uses every construct from this topic — and gives you a working program you can show off.",
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Build incrementally** — start with one guess, then add the loop, then add the hint switch',
        'Use the **Random** class from System — `new Random().Next(1, 101)` for 1–100 inclusive of 1, exclusive of 101',
        'Validate `TryParse` on every guess — guards everywhere',
        '**Limit attempts** — gives the game tension and shows `&&` / counter logic',
        'Highlight the **switch expression** for the hint message — modern style',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The spec',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Pick a secret number between **1 and 100** (inclusive).',
        'Give the player **7 attempts**.',
        'On each attempt: read input, validate it is a number, compare to secret.',
        'Print **`Too low`**, **`Too high`**, or **`Correct!`** as the hint.',
        'If the player wins, print attempts used and exit.',
        'If they run out of attempts, reveal the answer.',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Reference solution',
    },
    {
      kind: 'code',
      filename: 'GuessingGame.cs',
      code: `// ── Number Guessing Game ──────────────────────────────
// Uses: bool, comparisons, if/else, ternary, switch expression,
// short-circuit &&, and a while loop.

const int MinValue   = 1;
const int MaxValue   = 100;
const int MaxAttempts = 7;

var rng = new Random();
int secret = rng.Next(MinValue, MaxValue + 1);   // inclusive 1..100

Console.WriteLine($"I'm thinking of a number between {MinValue} and {MaxValue}.");
Console.WriteLine($"You have {MaxAttempts} attempts. Good luck!");

int attempts = 0;
bool won = false;

while (attempts < MaxAttempts && !won)
{
    attempts++;
    Console.Write($"\\nAttempt {attempts}/{MaxAttempts} — guess: ");

    // Guard: empty / non-numeric input does not consume an attempt
    if (!int.TryParse(Console.ReadLine(), out int guess))
    {
        Console.WriteLine("  That wasn't a number — try again.");
        attempts--;
        continue;
    }

    // Guard: out-of-range input
    if (guess < MinValue || guess > MaxValue)
    {
        Console.WriteLine($"  Out of range. Pick between {MinValue} and {MaxValue}.");
        attempts--;
        continue;
    }

    // Hint message via switch expression
    string hint = (guess - secret) switch
    {
        0     => "🎉 Correct!",
        < 0   => "Too low",
        > 0   => "Too high"
    };

    Console.WriteLine($"  {hint}");

    if (guess == secret)
    {
        won = true;
    }
}

Console.WriteLine();
Console.WriteLine(won
    ? $"You won in {attempts} attempt{(attempts == 1 ? "" : "s")}!"
    : $"Out of attempts. The number was {secret}.");`,
    },
    {
      kind: 'output',
      label: '▶ SAMPLE RUN',
      lines: [
        { text: "I'm thinking of a number between 1 and 100." },
        { text: 'You have 7 attempts. Good luck!' },
        { text: '' },
        { text: 'Attempt 1/7 — guess: 50', dim: true },
        { text: '  Too low' },
        { text: 'Attempt 2/7 — guess: 75', dim: true },
        { text: '  Too high' },
        { text: 'Attempt 3/7 — guess: 62', dim: true },
        { text: '  Too low' },
        { text: 'Attempt 4/7 — guess: 68', dim: true },
        { text: '  🎉 Correct!' },
        { text: '' },
        { text: 'You won in 4 attempts!' },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'What every part teaches',
    },
    {
      kind: 'list',
      items: [
        '**`const` constants** — `MinValue`, `MaxValue`, `MaxAttempts` named at the top',
        '**`Random.Next(a, b)`** — produces an int in `[a, b)`; we pass `MaxValue + 1` to include 100',
        '**`while (attempts < MaxAttempts && !won)`** — short-circuit `&&` keeps the loop tight',
        '**`int.TryParse`** + `continue` — guard clauses for bad input without consuming an attempt',
        '**Switch expression** with relational patterns — clean three-way hint',
        '**Ternary** — singular vs plural ("attempt" vs "attempts")',
      ],
    },

    {
      kind: 'callout',
      tone: 'success',
      title: 'You finished Control Flow',
      text:
        'You can now branch with `if/else`, switch on values, write ternary expressions, and reason about short-circuit evaluation. **Next up: Loops & Iteration** — `for`, `while`, `foreach`, and the patterns that drive every data-processing task.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Stretch goals — try these on your own',
    },
    {
      kind: 'list',
      items: [
        '**Difficulty modes** — easy (1-50, 10 attempts), normal (1-100, 7), hard (1-200, 5). Use a `switch` on the chosen difficulty',
        '**Track scores across rounds** — replay loop with a running win count',
        '**"Warm/cold" hint** — within 5 of the secret print `Very warm`, within 15 `Warm`, etc. (switch expression with `when` clauses)',
        '**Replay prompt** — after each game, ask `Play again? (y/n)`',
      ],
    },

    {
      kind: 'keyTakeaways',
      items: [
        'A real interactive program combines **constants, input validation, looping, branching, and string output**',
        '**Guard clauses with `continue`** keep the main loop body clean',
        '**Switch expressions** are the modern way to write 3-way classifications',
        '**`Random.Next(min, maxExclusive)`** — note the upper bound is **exclusive**',
        '**Next up**: Loops & Iteration — `while`, `for`, `foreach`, and complexity awareness',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What range does `new Random().Next(1, 11)` produce?',
      code: `var rng = new Random();
int x = rng.Next(1, 11);
Console.WriteLine(x);`,
      options: [
        { label: '1 to 10 (inclusive)', correct: true },
        { label: '1 to 11 (inclusive)' },
        { label: '0 to 11 (inclusive)' },
        { label: '0 to 10 (inclusive)' },
      ],
      explanation:
        '`Random.Next(min, max)` is **inclusive of min, exclusive of max**. So `Next(1, 11)` returns 1, 2, 3, …, 10. To get 1–100 inclusive, you pass `Next(1, 101)`.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        "In the game, why does `attempts--` appear inside the bad-input guard?",
      options: [
        { label: 'It is a typo.' },
        {
          label: 'So bad input does not count as a real attempt — the player should not be penalized for typos.',
          correct: true,
        },
        { label: 'To make the game harder.' },
        { label: 'It is required by C#.' },
      ],
      explanation:
        'The pattern `attempts++` at the top of the loop, `attempts--` in each guard clause, leaves the count unchanged when the input was invalid. This way a player who types `"asdf"` still has all their guesses.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        "In this loop, why is the order `attempts < MaxAttempts && !won` important?",
      options: [
        { label: 'It is alphabetical.' },
        { label: 'Order does not matter — both evaluate every time.' },
        {
          label: 'Once `won` is true, short-circuit `&&` could still work either way — but checking attempts first is cheap and matches the conceptual stop condition.',
          correct: true,
        },
        { label: 'Reversing the order would cause a compile error.' },
      ],
      explanation:
        'For correctness, either order is fine — both are simple variable reads with no side effects. The convention "primary condition first, override second" makes the intent obvious to the reader: *"keep playing until attempts run out, unless we win early."*',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Type the reference solution',
      prompt:
        "Copy the reference solution into a new project (`dotnet new console -n GuessingGame`) and run it. Confirm it works end-to-end. Try typing nonsense as input — verify the attempts counter is NOT consumed.",
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Add difficulty modes',
      prompt:
        "Before the main loop starts, ask the user to pick `easy`, `normal`, or `hard`. Use a `switch` (statement OR expression — your call) to set `MaxValue` and `MaxAttempts` accordingly. Easy: 1-50, 10 attempts. Normal: 1-100, 7 attempts. Hard: 1-200, 5 attempts.",
      hints: [
        '`MaxValue` and `MaxAttempts` can no longer be `const` — make them `int` variables.',
        'Default to `normal` for unknown input.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Warm / cold hints + replay',
      prompt:
        "Add a warmth indicator using a switch expression on `Math.Abs(guess - secret)`:\n• 0 → `🎉 Correct!`\n• ≤ 5 → `Very warm`\n• ≤ 15 → `Warm`\n• ≤ 30 → `Cool`\n• else → `Cold`\n\nAlso add a 'Play again? (y/n)' loop so the player can start a new round without restarting the program.",
      hints: [
        'Wrap the existing game in an **outer** `while (true)` loop.',
        'At the end, read `y` or `n` and `break` out if not `y`.',
      ],
    },
  ],
};
