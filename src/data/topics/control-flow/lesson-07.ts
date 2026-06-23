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
};
