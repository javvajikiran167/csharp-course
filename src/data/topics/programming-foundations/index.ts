import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';
import { lesson08 } from './lesson-08';

export const programmingFoundations: Topic = {
  slug: 'programming-foundations',
  title: 'Programming Foundations',
  subtitle:
    'The ideas common to every programming language — what a program is, how computers store data, how logic works, and how code becomes a running app. Zero C# required; the perfect on-ramp before Lesson 1.',
  status: 'unlocked',
  lessons: [
    {
      ...lesson01,
      questions: [
        {
          id: 'pf-q1',
          kind: 'mcq',
          prompt: 'Which statement best describes what a computer program is?',
          options: [
            { label: 'A precise, ordered list of instructions a computer follows literally', correct: true },
            { label: 'A machine that thinks for itself and fills in missing steps' },
            { label: 'A document that explains how a computer works' },
            { label: 'A physical part inside the computer' },
          ],
          explanation:
            'A program is an ordered list of instructions executed exactly as written. The computer supplies no judgement of its own — that is why precision matters so much.',
        },
        {
          id: 'pf-q2',
          kind: 'mcq',
          prompt:
            'Your program runs without crashing but gives the wrong total. Following "the computer does exactly what you say, not what you mean," what is the most likely cause?',
          options: [
            { label: 'You told it to do something that differs from what you actually wanted', correct: true },
            { label: 'The computer hardware is broken' },
            { label: 'Programs randomly produce wrong answers sometimes' },
            { label: 'The programming language has a bug' },
          ],
          explanation:
            'A wrong-but-not-crashing result is a classic logic error: the machine faithfully did what you instructed, which was not what you meant. Debugging is finding that gap.',
        },
      ],
      challenges: [
        {
          id: 'pf-p1',
          difficulty: 'easy',
          title: 'Spot the program',
          prompt:
            'In your own words (3–4 sentences), describe a daily task as a program: list its inputs, its ordered steps, and its output. Examples: brewing coffee, getting to work, logging into a website.',
          hints: ['Inputs are what you start with; the output is the end result.', 'Be precise about order — could the steps be swapped?'],
        },
        {
          id: 'pf-p2',
          difficulty: 'easy',
          title: 'Exactly what you say',
          prompt:
            'Write step-by-step instructions for making a jam sandwich, precise enough for someone who takes every word literally and assumes nothing. Then find three places a literal-minded robot would still go wrong.',
          hints: ['Did you say to open the jar? To use a knife, not your hand?', 'This is the "does what you say, not what you mean" rule in action.'],
        },
      ],
    },
    {
      ...lesson02,
      questions: [
        {
          id: 'pf-q3',
          kind: 'mcq',
          prompt: 'What makes a language "high-level" rather than "low-level"?',
          options: [
            { label: 'It is further from the hardware, handling fiddly details for you', correct: true },
            { label: 'It is newer than low-level languages' },
            { label: 'It produces faster programs in every case' },
            { label: 'It can only be used by expert programmers' },
          ],
          explanation:
            '"Level" measures distance from the hardware, not quality or age. High-level languages like C# and Python manage memory details for you so you can focus on the problem.',
        },
        {
          id: 'pf-q4',
          kind: 'mcq',
          prompt: 'C# is a compiled language. What practical advantage does that give over a purely interpreted one?',
          options: [
            { label: 'Many mistakes are caught before the program runs, at your desk', correct: true },
            { label: 'Compiled programs never have any bugs' },
            { label: 'You never need to test compiled programs' },
            { label: 'Compiled code does not need a computer to run' },
          ],
          explanation:
            'Compiling checks your whole program ahead of time, so a category of errors (typos, type mismatches, missing pieces) surfaces before the program ever runs — not in front of a user.',
        },
      ],
      challenges: [
        {
          id: 'pf-p11',
          difficulty: 'easy',
          title: 'High-level vs low-level',
          prompt:
            'List three everyday jobs a high-level language like C# or Python does for you that you would have to handle yourself in a low-level language (think memory, hardware, fiddly bookkeeping). For each, write one sentence on why having it handled lets you focus on the actual problem.',
          hints: ['Think about managing memory by hand vs. having it managed.', 'You come from Python — what has Python always done quietly for you?'],
        },
      ],
    },
    {
      ...lesson03,
      questions: [
        {
          id: 'pf-q5',
          kind: 'fill',
          prompt: 'Fill in the standard unit: a group of 8 bits is called one ___.',
          template: '8 bits = 1 ___',
          accept: ['byte'],
          explanation: 'Eight bits form a byte, which has 2⁸ = 256 possible on/off patterns — the foundational unit of computer memory.',
        },
        {
          id: 'pf-q6',
          kind: 'mcq',
          prompt: 'Why do programming languages have data "types"?',
          options: [
            { label: 'Because a pattern of bits has no meaning on its own — the type says how to interpret it', correct: true },
            { label: 'To make programs longer and harder to write' },
            { label: 'Because computers cannot store text, only numbers — types convert everything to numbers' },
            { label: 'Types are decorative and have no real effect' },
          ],
          explanation:
            'The same bits can be read as a number, a character, or flags. A type is the program\'s agreement on how to interpret a chunk of memory, which is what makes the data meaningful.',
        },
      ],
      challenges: [
        {
          id: 'pf-p4',
          difficulty: 'easy',
          title: 'Binary counting',
          prompt:
            'By hand, write the numbers 0 through 5 in binary (base-2). Then explain in one sentence why a single byte (8 bits) can represent 256 different patterns.',
          hints: ['0, 1, 10, 11, 100, …', '256 = 2 multiplied by itself 8 times.'],
        },
      ],
    },
    {
      ...lesson04,
      questions: [
        {
          id: 'pf-q7',
          kind: 'predict',
          prompt: 'Both values here are text (strings), not numbers.',
          code: 'Console.WriteLine("5" + "3");',
          options: [
            { label: '53', correct: true },
            { label: '8' },
            { label: '"5" + "3"' },
            { label: '15' },
          ],
          explanation:
            'With the `+` operator, text is *joined*, not added. "5" and "3" are text, so they concatenate into "53". If they were the numbers 5 and 3, the result would be 8.',
        },
        {
          id: 'pf-q8',
          kind: 'mcq',
          prompt: 'In most programming languages, what does a single `=` mean?',
          options: [
            { label: 'Assign: put the value on the right into the variable on the left', correct: true },
            { label: 'Test whether two values are equal' },
            { label: 'Subtract the right value from the left' },
            { label: 'Nothing — it is only used in mathematics' },
          ],
          explanation:
            'A single `=` assigns ("becomes"). That is why `score = score + 5` makes sense: read the current value, add 5, store it back. Testing equality uses a different symbol (`==` in C#).',
        },
        {
          id: 'pf-q9',
          kind: 'mcq',
          prompt: 'C# uses static typing. What does that mean?',
          options: [
            { label: "A variable's type is fixed when declared and checked before the program runs", correct: true },
            { label: 'Variables can hold any type and change type at any time' },
            { label: 'Types are decided only while the program is running' },
            { label: 'You never have to think about types in C#' },
          ],
          explanation:
            'Static typing fixes each variable\'s type up front and checks every use at compile time. This trades a little extra typing for safety, especially in large codebases — a key reason C# suits enterprise work.',
        },
      ],
      challenges: [
        {
          id: 'pf-p3',
          difficulty: 'easy',
          title: 'Classify the value',
          prompt:
            'For each value, name the most sensible type (whole number, decimal, text, or true/false): a person\'s age; a product price like 19.99; an email address; whether a user is subscribed; the number of items in a cart.',
          hints: ['Money usually needs a decimal type.', 'Yes/no facts are booleans.'],
        },
        {
          id: 'pf-p5',
          difficulty: 'medium',
          title: 'Assign, don\'t equate',
          prompt:
            'Trace this pseudocode by hand and state the final value of `x`:\n\n• x = 3\n• x = x + 4\n• x = x * 2\n• x = x - 1\n\nThen rewrite step 2 in words using "becomes" instead of "=".',
          hints: ['Work one line at a time, carrying the value forward.', '"x becomes x plus 4."'],
        },
      ],
    },
    {
      ...lesson05,
      questions: [
        {
          id: 'pf-q10',
          kind: 'mcq',
          prompt: 'Every program is built from just three control blocks. Which set names them?',
          options: [
            { label: 'Sequence, selection, repetition', correct: true },
            { label: 'Input, output, storage' },
            { label: 'Variables, types, functions' },
            { label: 'Compile, run, debug' },
          ],
          explanation:
            'All logic reduces to sequence (steps in order), selection (choosing a path with conditions), and repetition (loops). Everything else is these three composed together.',
        },
        {
          id: 'pf-q11',
          kind: 'mcq',
          prompt: 'A condition like `age >= 18` always evaluates to one of how many possible values, and of what type?',
          options: [
            { label: 'Two values — true or false (a boolean)', correct: true },
            { label: 'Any number from 0 to 18' },
            { label: 'A piece of text describing the age' },
            { label: 'It depends on the computer' },
          ],
          explanation:
            'Comparisons produce a boolean: exactly true or false. That is why decisions rely on the `bool` type, and why these conditions can be combined with AND, OR, and NOT.',
        },
        {
          id: 'pf-q12',
          kind: 'mcq',
          prompt: 'What causes an infinite loop?',
          options: [
            { label: 'The loop\'s stopping condition is never reached, so it repeats forever', correct: true },
            { label: 'The loop body contains too many instructions' },
            { label: 'The computer runs out of memory' },
            { label: 'You used the wrong variable name' },
          ],
          explanation:
            'A loop must make progress toward its exit condition. If the condition can never become false (e.g., a counter that never changes), the loop runs forever and the program appears to freeze.',
        },
      ],
      challenges: [
        {
          id: 'pf-p7',
          difficulty: 'medium',
          title: 'Boolean conditions',
          prompt:
            'For a value `age`, write the true/false conditions for: "is a teenager" (13–19 inclusive), "is a minor" (under 18), and "is exactly 21". Use AND where needed. State whether each is true when age = 16.',
          hints: ['A teenager needs two conditions joined with AND: age >= 13 AND age <= 19.', 'Equality uses ==.'],
        },
      ],
    },
    {
      ...lesson06,
      questions: [
        {
          id: 'pf-q13',
          kind: 'mcq',
          prompt:
            'You are told to "build a tip calculator" and feel stuck because it is too big. What is the right first move?',
          options: [
            { label: 'Decompose it — break the problem into small, ordered steps until each is obvious', correct: true },
            { label: 'Start typing C# immediately and hope it works out' },
            { label: 'Pick a different, easier problem' },
            { label: 'Memorise more language syntax first' },
          ],
          explanation:
            'Decomposition is the master skill: split the problem until each step is small enough to be obvious. If a step still feels hard, it is not small enough — split again. This plan (an algorithm) comes before code.',
        },
        {
          id: 'pf-q15',
          kind: 'mcq',
          prompt:
            'You must find one name in a sorted list of a million names. The "check every entry from the top" method needs up to a million steps. About how many does the "jump to the middle and discard half each time" method need?',
          options: [
            { label: 'About 20', correct: true },
            { label: 'About 500,000 — half the list' },
            { label: 'Exactly the same, a million' },
            { label: 'It cannot be done on a sorted list' },
          ],
          explanation:
            'Halving the search space each step (binary search) reaches one item among a million in roughly 20 steps (2²⁰ ≈ 1,000,000). Both algorithms are correct, but their work grows very differently as data grows — the essence of efficiency. The halving trick requires the list to be sorted.',
        },
      ],
      challenges: [
        {
          id: 'pf-p8',
          difficulty: 'medium',
          title: 'Decompose a real task',
          prompt:
            'Write pseudocode (numbered steps) for an algorithm that takes a list of test scores and reports the average. Identify which steps are sequence, which is repetition, and where a decision might be needed (e.g., an empty list).',
          hints: ['You will need a running total and a count.', 'Summing the list is a loop (repetition).'],
        },
        {
          id: 'pf-p10',
          difficulty: 'hard',
          title: 'Design before you code',
          prompt:
            'Write complete pseudocode for a "guess the number" game: the computer picks a secret number 1–100; the player guesses repeatedly; after each guess the program says "higher", "lower", or "correct" and stops when correct. Mark every use of sequence, selection, and repetition. You will build this for real in a later topic.',
          hints: ['The repeated guessing is a loop that ends when the guess is correct (watch for an infinite loop).', 'Each "higher/lower/correct" response is a selection.'],
        },
      ],
    },
    {
      ...lesson07,
      questions: [
        {
          id: 'pf-q14',
          kind: 'mcq',
          prompt:
            'A program compiles, runs, and prints an answer — but the answer is wrong. Which kind of error is this?',
          options: [
            { label: 'A logic error', correct: true },
            { label: 'A compile-time error' },
            { label: 'A runtime error (crash)' },
            { label: 'No error at all — the program ran' },
          ],
          explanation:
            'A logic error produces a wrong result with no error message: the code is valid and runs, but the instructions do not match your intent. Only checking output against expectations reveals it.',
        },
        {
          id: 'pf-q16',
          kind: 'mcq',
          prompt:
            'You misspell a command and the compiler refuses to build the program, underlining it in red before it ever runs. Which kind of error is this?',
          options: [
            { label: 'A compile-time error', correct: true },
            { label: 'A runtime error' },
            { label: 'A logic error' },
            { label: 'Not an error, just a warning' },
          ],
          explanation:
            'Breaking a language rule (a typo, a missing piece, a type mismatch) is a compile-time error: the compiler catches it before the program runs. A runtime error happens while running (e.g., divide by zero); a logic error runs fine but gives a wrong answer.',
        },
      ],
      challenges: [
        {
          id: 'pf-p9',
          difficulty: 'hard',
          title: 'Find the logic error',
          prompt:
            'This pseudocode is meant to compute a 15% tip on a $80 bill but prints 1200 instead of 12. Find the logic error and fix it:\n\n• bill = 80\n• percent = 15\n• tip = bill * percent\n• show tip\n\nExplain why the original ran without crashing.',
          hints: ['15% means 15/100, not 15.', 'It compiles and runs fine — it just does the wrong arithmetic, the definition of a logic error.'],
        },
      ],
    },
    {
      ...lesson08,
      questions: [
        {
          id: 'pf-q17',
          kind: 'mcq',
          prompt: 'What is the difference between the .NET SDK and a code editor like VS Code?',
          options: [
            { label: 'The SDK builds and runs your C# code; the editor is where you write and read it', correct: true },
            { label: 'They are two names for the same program' },
            { label: 'The editor compiles your code and the SDK only displays it' },
            { label: 'You need neither to run C# — the browser does it' },
          ],
          explanation:
            'The .NET SDK is the toolchain that compiles and runs your program (`dotnet build`, `dotnet run`); the editor is just a comfortable place to write the text. They work together but do different jobs.',
        },
        {
          id: 'pf-q18',
          kind: 'fill',
          prompt: 'Fill in the command that creates a new console app in the current folder.',
          template: 'dotnet new ___',
          accept: ['console'],
          explanation: 'The `dotnet new console` command scaffolds a minimal C# console application — your starting point for a first program. You then run it with `dotnet run`.',
        },
      ],
      challenges: [
        {
          id: 'pf-p12',
          difficulty: 'easy',
          title: 'Verify your toolkit',
          prompt:
            'After installing the .NET SDK, run `dotnet --version` and write down the version you get (it should be a .NET 10 release). Then, in two or three sentences, describe in plain words what happens between typing `dotnet run` and seeing output on screen — connect it back to the "compile then run" idea from the previous lesson.',
          hints: ['If the version command is not found, the SDK is not on your PATH yet.', '`dotnet run` first builds (compiles) your code, then executes the result.'],
        },
      ],
    },
  ],

  // ── Two projects ──
  projects: [
    {
      id: 'pf-proj-1',
      difficulty: 'starter',
      title: 'Run, read, and remix Hello World',
      brief:
        'Make the toolkit real. Install the .NET SDK and an editor, create your first console app, and prove you can change what it does — connecting every Topic 00 idea to output on your own screen.',
      requirements: [
        'Install the .NET SDK and verify it with `dotnet --version`.',
        'Create a console app with `dotnet new console` and run it with `dotnet run`.',
        'Change the message to print your own name, then run it again and confirm the output changed.',
        'Add two more `Console.WriteLine(...)` lines so the program prints three lines in a deliberate order.',
        'In a comment at the top of `Program.cs`, name which Topic 00 idea each line demonstrates (instruction, value/type, sequence).',
      ],
      stretch: [
        'Print a line that *joins* text and a number, e.g. a label followed by a count, and predict the output before running.',
        'Deliberately introduce a typo (misspell `Console`), run it, read the compile error, then fix it — and write down which error family it was.',
      ],
      concepts: ['the .NET SDK', 'compile → run', 'instructions', 'types', 'sequence'],
    },
    {
      id: 'pf-proj-2',
      difficulty: 'starter',
      title: 'Algorithm design portfolio (on paper)',
      brief:
        'Practice the thinking that matters most before syntax can get in the way. Produce clear, language-free algorithms for three everyday problems — the skill that separates confident programmers from stuck ones.',
      requirements: [
        'Pick three problems, e.g.: convert Celsius to Fahrenheit, find the largest of three numbers, and check whether a word is a palindrome.',
        'For each, write numbered pseudocode with explicit inputs and output.',
        'Label every step as sequence, selection, or repetition.',
        'For each, list the types of the values involved (whole number, decimal, text, true/false).',
        'Note at least one edge case per problem (e.g., what if two numbers tie for largest?).',
      ],
      stretch: [
        'For "find the largest of three", write a second, different correct algorithm and argue which is clearer.',
        'Sketch a flowchart (boxes for steps, diamonds for decisions) for one of the three.',
      ],
      concepts: ['decomposition', 'pseudocode', 'algorithms', 'sequence/selection/repetition', 'types'],
    },
  ],
};
