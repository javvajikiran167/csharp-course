import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  slug: 'do-while',
  number: 4,
  title: 'do-while',
  objective:
    'Use `do-while` when the body must run **at least once** before the condition is checked — common for prompts and menus.',
  blocks: [
    {
      kind: 'lead',
      text:
        "`do-while` is `while`'s mirror image: **body first, condition after**. The body always runs at least once. The natural fit is *prompt-the-user, then decide whether to prompt again* — menus, retry loops, input validation.",
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Always runs at least once** — the condition check comes AFTER the body',
        'Mirror image of `while`: same condition, different evaluation timing',
        'Most common real use: **input/menu loops** — ask, decide, ask again',
        '**Do not forget the `;`** at the end of `while (...);` — quirk of the syntax',
        'Show the typical infinite loop guard with `break`',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The shape',
    },
    {
      kind: 'code',
      filename: 'do-while.cs',
      code: `int i = 1;
do
{
    Console.WriteLine($"i = {i}");
    i++;
}
while (i <= 5);    // ← note the semicolon`,
    },
    {
      kind: 'output',
      output: `i = 1
i = 2
i = 3
i = 4
i = 5`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'The semicolon trap',
      text:
        '`while (condition);` ends with a semicolon when used in `do-while`. Forget it and you get a compile error. The semicolon **terminates the do-while statement** — `while (cond) { ... }` does not have one because the block `{ ... }` is the statement.',
    },

    {
      kind: 'heading',
      level: 2,
      text: '`while` vs `do-while` — when each is right',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Use `while`',
          items: [
            'The condition might be **false at the start** — body should not run',
            'Polling: "while still running, check again"',
            'Iterating: "while there is more data, read"',
          ],
        },
        {
          title: 'Use `do-while`',
          items: [
            'The body **must run at least once** before any check',
            'Prompting: "ask the user, then ask if they want again"',
            'Menu loops: show, then decide whether to show again',
            'Initial read into a variable before testing it',
          ],
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The textbook example — menu loop',
    },
    {
      kind: 'code',
      filename: 'menu.cs',
      code: `string? choice;

do
{
    Console.WriteLine("\\n--- MENU ---");
    Console.WriteLine("1) Say hello");
    Console.WriteLine("2) Add two numbers");
    Console.WriteLine("q) Quit");
    Console.Write("> ");
    choice = Console.ReadLine()?.Trim().ToLower();

    switch (choice)
    {
        case "1":
            Console.WriteLine("Hello!");
            break;
        case "2":
            Console.WriteLine("Sum = 42");
            break;
        case "q":
            Console.WriteLine("Bye!");
            break;
        default:
            Console.WriteLine("Unknown choice.");
            break;
    }
}
while (choice != "q");`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'That `break` is NOT a loop break',
      text:
        "Lesson 1 said `break` exits the loop — but the `break` in each `case` above ends the **`switch` case**, not the loop. The menu keeps going; it stops only when the condition `choice != \"q\"` becomes false on the next check. To leave the loop from *inside* a `switch` case, set a flag the condition tests, or call a method and `return`. (`break` doing two different jobs depending on where it sits is a classic source of confusion.)",
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Multiple example variations',
    },
    {
      kind: 'examples',
      intro: 'Four common shapes for `do-while`:',
      examples: [
        {
          label: 'Validated input — keep asking',
          code: `int age;
do
{
    Console.Write("Enter age (0-120): ");
}
while (!int.TryParse(Console.ReadLine(), out age) || age < 0 || age > 120);

Console.WriteLine($"Got age {age}");`,
        },
        {
          label: 'Play-again pattern',
          code: `bool playAgain;
do
{
    Console.WriteLine("Playing the game...");
    Console.Write("Play again? (y/n): ");
    playAgain = Console.ReadLine()?.Trim().ToLower() == "y";
}
while (playAgain);`,
        },
        {
          label: 'Roll a die until a 6 appears',
          code: `var rng = new Random();
int roll;
int count = 0;
do
{
    roll = rng.Next(1, 7);
    count++;
    Console.WriteLine($"Rolled {roll}");
}
while (roll != 6);

Console.WriteLine($"Took {count} rolls.");`,
        },
        {
          label: 'Process at least one item, then check',
          code: `int batchSize = 100;
int processed = 0;
do
{
    // Always process one batch first
    processed += ProcessBatch(batchSize);
}
while (processed < 1000);

static int ProcessBatch(int n) => n;`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The "do once anyway" pitfall',
    },
    {
      kind: 'paragraph',
      text:
        '**`do-while` runs the body even when the condition is already false at the start.** That is the entire point — but it bites if you forget. If the body has destructive effects (delete a file, send an email), make sure that "do at least once" is what you actually want.',
    },
    {
      kind: 'code',
      code: `int x = 100;
do
{
    Console.WriteLine($"x = {x}");
    x--;
}
while (x > 200);     // false immediately — but body STILL ran once
// Output: x = 100`,
    },

    {
      kind: 'keyTakeaways',
      items: [
        '`do { body } while (condition);` — **body always runs at least once**, then the condition is checked',
        'Mirror image of `while` — same condition semantics, different evaluation timing',
        '**Don\'t forget the semicolon** after `while (...)`',
        'Best fit: **menus, prompts, validation loops** — anywhere you need to "do, then decide whether to do again"',
        '**Watch for the "do once even when false" trap** if your body has side effects',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int x = 10;
do
{
    Console.WriteLine(x);
    x++;
}
while (x < 5);`,
      options: [
        { label: 'Nothing — condition false at start' },
        { label: '10', correct: true },
        { label: '10 11 12 13 14' },
        { label: 'Infinite loop' },
      ],
      explanation:
        '`do-while` runs the body **first**, then checks. `x = 10` is printed. Then `x++` makes it 11, and `11 < 5` is false → loop ends. Even though the condition was false from the start, the body ran once.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        "You are writing a menu loop that should always show the menu at least once. Which loop is the right choice?",
      options: [
        { label: '`while` — check the exit condition first' },
        { label: '`do-while` — show the menu, then check if user wants to exit', correct: true },
        { label: '`for` — easier to count iterations' },
        { label: '`foreach` — iterate over the menu items' },
      ],
      explanation:
        '**`do-while`** is the natural fit. The menu is shown, the user picks an option (possibly `q` for quit), and *then* the condition decides whether to loop again. With `while`, you would need a separate "show the first menu" before the loop — clumsy.',
    },
    {
      id: 'q3',
      kind: 'predict',
      prompt: 'What is wrong with this code?',
      code: `int n;
do
{
    Console.Write("Enter a positive number: ");
}
while (int.TryParse(Console.ReadLine(), out n) && n <= 0)`,
      options: [
        { label: 'Logic bug — keeps asking only when valid + non-positive' },
        { label: 'Missing semicolon after `while (...)`', correct: true },
        { label: 'TryParse usage is wrong' },
        { label: 'No bug' },
      ],
      explanation:
        '**`do-while` requires a semicolon** after the closing `while (...)`. Without it, the compiler is still expecting the end of the statement, gives a confusing error. (The logic is also questionable — but the syntax error blocks compilation first.)',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Greet at least once',
      prompt:
        'Use `do-while` to keep greeting the user until they type `quit`. Show the greeting prompt at least once.',
      hints: [
        '`do { Console.Write("..."); choice = Console.ReadLine(); } while (choice != "quit");`',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Sum of valid inputs',
      prompt:
        "Keep reading numbers from the user. Each valid number adds to a running total. Stop when the user enters `done`. Print the total. Use `do-while`.",
      hints: [
        '`do { input = Console.ReadLine(); if (input == "done") break; if (int.TryParse(input, out int n)) total += n; } while (true);`',
        'Or condition `while (input != "done")` — both shapes work.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Roll-until-six game',
      prompt:
        'Simulate rolling a 6-sided die using `Random`. Roll until you get a 6. Count the number of rolls. Use `do-while`. Run the simulation 10,000 times and print the **average number of rolls** — should be close to 6.0 (the theoretical expected value for a geometric distribution with p=1/6).',
      hints: [
        'Inner `do-while`: rolls until 6.',
        'Outer `for` loop: 10,000 simulations.',
        'Average = totalRolls / 10000.0 — watch the integer division trap!',
      ],
    },
  ],
};
