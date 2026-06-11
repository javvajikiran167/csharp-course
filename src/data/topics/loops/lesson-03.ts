import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  slug: 'foreach',
  number: 3,
  title: 'foreach Loops',
  objective:
    'Walk every element of a collection cleanly — the loop you will use the most in real C# code.',
  blocks: [
    {
      kind: 'lead',
      text:
        '**`foreach`** says: *"for each element in this collection, run this body."* No index variable, no off-by-one risk, no `.Length` to remember. It is the loop most C# developers reach for first when the answer is *"do something with every item."*',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Mental model**: "for each ITEM in COLLECTION" — read it like English',
        'No index variable — **`foreach` is read-only on the index/position**; you cannot reassign the loop variable',
        '**You CAN mutate the contents** (`person.Name = "x"`) but **cannot replace the slot** in the underlying collection',
        'Show that `foreach` works on arrays, `List<T>`, `Dictionary<K,V>`, `HashSet<T>`, strings — anything `IEnumerable<T>`',
        '**Cannot modify the collection while iterating** — common runtime exception in real codebases',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The shape',
    },
    {
      kind: 'code',
      filename: 'foreach-basics.cs',
      code: `string[] names = { "Alice", "Bob", "Charlie" };

foreach (string name in names)
{
    Console.WriteLine($"Hello, {name}!");
}`,
    },
    {
      kind: 'output',
      output: `Hello, Alice!
Hello, Bob!
Hello, Charlie!`,
    },
    {
      kind: 'paragraph',
      text:
        'Read it as **"for each `string` named `name` in `names`"**. The type can be inferred — `foreach (var name in names)` works the same.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'When `foreach` is better than `for`',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Use `foreach`',
          items: [
            'You only need **each element**, not its index',
            'The collection is **non-indexed** (HashSet, Dictionary, LINQ result)',
            'Cleaner code, **no off-by-one risk**',
            'The compiler picks the right enumerator automatically',
          ],
        },
        {
          title: 'Use `for` instead',
          items: [
            'You need the **index** in the body (e.g. printing `"3rd: ..."`)',
            'You want to **modify the collection slot** (assign back via `arr[i] = ...`)',
            'You step **non-1** (every other, reverse)',
            'You loop over a range of numbers, not a collection',
          ],
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Variations across every kind of collection',
    },
    {
      kind: 'examples',
      intro: '`foreach` works on every collection type — the syntax stays the same:',
      examples: [
        {
          label: 'Array',
          code: `int[] scores = { 85, 92, 78, 95, 88 };
foreach (int s in scores)
{
    Console.WriteLine(s);
}`,
        },
        {
          label: 'List<T>',
          code: `var fruits = new List<string> { "apple", "banana", "cherry" };
foreach (var fruit in fruits)
{
    Console.WriteLine(fruit);
}`,
        },
        {
          label: 'Dictionary — pairs of keys and values',
          code: `var ages = new Dictionary<string, int>
{
    ["Alice"] = 30,
    ["Bob"] = 25,
};

foreach (var (name, age) in ages)
{
    Console.WriteLine($"{name}: {age}");
}`,
        },
        {
          label: 'HashSet<T>',
          code: `var seen = new HashSet<string> { "x", "y", "z" };
foreach (var item in seen)
{
    Console.WriteLine(item);
}`,
        },
        {
          label: 'String — iterate characters',
          code: `string word = "hello";
foreach (char c in word)
{
    Console.Write($"{c}-");
}
// h-e-l-l-o-`,
        },
        {
          label: 'LINQ result — non-materialized',
          code: `var evens = new[] { 1, 2, 3, 4, 5, 6 }.Where(n => n % 2 == 0);
foreach (var n in evens)
{
    Console.WriteLine(n);
}`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The biggest gotcha — modifying the collection mid-loop',
    },
    {
      kind: 'paragraph',
      text:
        '**You cannot add to, or remove from, a collection while iterating it with `foreach`.** Doing so throws `InvalidOperationException` at runtime — the iterator detects the change and refuses to continue.',
    },
    {
      kind: 'code',
      filename: 'wrong.cs',
      code: `var fruits = new List<string> { "apple", "banana", "cherry" };

// ❌ Throws InvalidOperationException
foreach (var f in fruits)
{
    if (f == "banana") fruits.Remove(f);
}`,
    },
    {
      kind: 'code',
      filename: 'right.cs',
      code: `// ✅ Filter into a new list (LINQ — preview)
fruits = fruits.Where(f => f != "banana").ToList();

// ✅ Or iterate in reverse with a for loop
for (int i = fruits.Count - 1; i >= 0; i--)
{
    if (fruits[i] == "banana") fruits.RemoveAt(i);
}`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Why reverse iteration works',
      text:
        'When you remove from a list, items after the deleted index **shift down by one**. A forward `for` loop with `i++` would skip the next item. **Reverse iteration** (`i--` from the end) avoids this — you only ever touch indices that have not moved.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The loop variable is `readonly`',
    },
    {
      kind: 'code',
      code: `string[] names = { "Alice", "Bob" };

foreach (string name in names)
{
    name = name.ToUpper();   // ❌ compile error CS1656 — cannot assign
    Console.WriteLine(name);
}

// ✅ For mutating arrays, use a for loop:
for (int i = 0; i < names.Length; i++)
{
    names[i] = names[i].ToUpper();
}`,
    },

    {
      kind: 'keyTakeaways',
      items: [
        '`foreach (var item in collection)` — runs the body for **every element** in order',
        'Works on **any IEnumerable<T>** — arrays, `List<T>`, `Dictionary<K,V>`, `HashSet<T>`, strings, LINQ results',
        '**No off-by-one risk**, no `.Length`, no index variable to manage',
        '**Cannot reassign** the loop variable inside the body',
        '**Cannot Add/Remove** from the collection while iterating — throws `InvalidOperationException`',
        'If you need the index, use **`for`** (Lesson 2); if you need to remove items, use **reverse `for`** or **filter into a new collection**',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int[] nums = { 1, 2, 3, 4 };
int total = 0;
foreach (var n in nums)
{
    total += n;
}
Console.WriteLine(total);`,
      options: [
        { label: '4' },
        { label: '10', correct: true },
        { label: '1234' },
        { label: 'Compile error' },
      ],
      explanation:
        '`foreach` visits each element: 1, 2, 3, 4. They are added to `total` → 1 + 2 + 3 + 4 = 10.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        "You write a `foreach` over a `List<int>` and call `list.RemoveAt(0)` inside the body. What happens?",
      options: [
        { label: 'The list is emptied silently.' },
        {
          label: 'Throws `InvalidOperationException` on the next iteration — the iterator detects the mutation.',
          correct: true,
        },
        { label: 'The loop skips the next item.' },
        { label: 'Compile error.' },
      ],
      explanation:
        '`List<T>` (and most `IEnumerable<T>` implementations) detect structural changes during enumeration and throw `InvalidOperationException: Collection was modified`. To remove items safely, **iterate backward with a `for` loop** or **filter into a new list**.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt: "When should you NOT use `foreach`?",
      options: [
        { label: 'When you need to print every item.' },
        { label: 'When you need the index of each item during the loop.', correct: true },
        { label: 'When working with a List<T>.' },
        { label: 'When working with a HashSet<T>.' },
      ],
      explanation:
        "`foreach` does not give you an index. If you need to print `\"Item 0: ...\"`, `\"Item 1: ...\"`, etc., use **`for (int i = 0; i < ...; i++)`** or use **`collection.Select((item, i) => ...)`** with LINQ (covered in the LINQ topic).",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Sum of numbers',
      prompt:
        "Given an array `int[] nums = { 4, 8, 15, 16, 23, 42 };`, use `foreach` to sum the numbers and print the total.",
      hints: [
        '`int total = 0;` then `foreach (var n in nums) total += n;`',
        'Expected total: 108.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Find the max with foreach',
      prompt:
        "Given an array of integers, use `foreach` to find the maximum value WITHOUT calling `Max()`. Start with the first element as the running max, then update as you see larger ones.",
      hints: [
        '`int max = nums[0]; foreach (var n in nums) if (n > max) max = n;`',
        'Make sure the array is not empty.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Word frequency counter',
      prompt:
        "Take a sentence (e.g., `\"the cat sat on the mat\"`). Split into words. Use a `Dictionary<string,int>` to count how many times each word appears. Iterate with `foreach` to build the dictionary, then `foreach` again to print each word and its count.",
      hints: [
        '`string[] words = sentence.Split(\' \');`',
        '`if (counts.ContainsKey(word)) counts[word]++; else counts[word] = 1;`',
      ],
    },
  ],
};
