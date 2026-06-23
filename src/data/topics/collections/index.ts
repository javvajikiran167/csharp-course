import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';

export const collections: Topic = {
  slug: "collections",
  title: "Collections",
  subtitle: "Arrays, List<T>, Dictionary<TKey,TValue>, HashSet<T>, and Stack/Queue — the data containers every C# developer reaches for daily, and how to choose between them.",
  status: 'unlocked',
  lessons: [
    {
      ...lesson01,
      questions: [
        {
          "id": "collections-q1",
    "kind": "mcq",
    "prompt": "You write `int[] scores = new int[3];` and then need to append a fourth value. Which statement is **true** about C# arrays?",
    "options": [
      {
        "label": "Arrays are fixed-size: there is no `Add`/`Append`, so you must allocate a new array (or use `List<T>`).",
        "correct": true
      },
      {
        "label": "You can call `scores.Add(4)` just like a Python list.",
        "correct": false
      },
      {
        "label": "Arrays grow automatically when you index past the end, e.g. `scores[3] = 4`.",
        "correct": false
      },
      {
        "label": "`scores[3] = 4` silently does nothing because index 3 is out of range.",
        "correct": false
      }
    ],
    "explanation": "A C# array's length is fixed at creation and never changes — unlike a Python `list`. There is no `Add`/`Append`; writing `scores[3] = 4` throws `IndexOutOfRangeException`. To grow, you allocate a new, larger array (`Array.Resize` does exactly this under the hood by copying) or, far more commonly, you use `List<T>`, whose auto-resizing backing array is the whole reason `List<T>` exists."
  },
  {
    "id": "collections-q2",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "int[] nums = [10, 20, 30, 40];\nint sum = 0;\nforeach (int n in nums)\n{\n    sum += n;\n}\nConsole.WriteLine($\"{nums.Length} items, sum={sum}\");",
    "options": [
      {
        "label": "4 items, sum=100",
        "correct": true
      },
      {
        "label": "3 items, sum=100",
        "correct": false
      },
      {
        "label": "4 items, sum=90",
        "correct": false
      },
      {
        "label": "items, sum=100",
        "correct": false
      }
    ],
    "explanation": "`[10, 20, 30, 40]` is a collection expression (C# 12+, fully available on .NET 10) target-typed to `int[]`, giving 4 elements. `Length` (the array's count property) is 4, and `foreach` adds them: 10+20+30+40 = 100. Note arrays use `.Length`, while `List<T>` uses `.Count` — a small but common slip."
        }
      ],
      challenges: [
        {
          "id": "collections-p1",
          "difficulty": "easy",
          "title": "Weekly Temperature Log (Arrays)",
          "prompt": "You're building a tiny weather dashboard. Create a fixed-size `double[]` named `temps` that holds exactly 7 daily temperatures for one week. Initialize it with these readings: 18.5, 21.0, 19.8, 22.3, 20.1, 17.6, 23.4.\n\nThen, using a `for` loop:\n- Print each day as `Day 1: 18.5C` ... `Day 7: 23.4C` (use the index + 1 for the day number).\n\nAfter the loop, compute and print:\n- The total of all readings.\n- The average, formatted to one decimal place, like `Average: 20.4C`.\n\nFinally, write a one-line comment explaining what happens if you tried to assign an 8th value with `temps[7] = 25.0;` — and DO NOT actually run that line.",
          "hints": [
            "Use a collection expression to initialize: `double[] temps = [18.5, 21.0, ...];`",
            "`temps.Length` gives you 7; valid indices are 0..6.",
            "Format to one decimal with an interpolated string: `$\"Average: {avg:F1}C\"`.",
            "`temps[7]` would throw `IndexOutOfRangeException` because the array's size is fixed at 7 — that fixed size is exactly why `List<T>` exists."
          ]
        }
      ]
    },
    {
      ...lesson02,
      questions: [
        {
          "id": "collections-q3",
    "kind": "mcq",
    "prompt": "You need a 3-row table where each row has a **different** number of columns (e.g. a list of tags per user). Which type fits best?",
    "options": [
      {
        "label": "A jagged array `string[][]` — an array of arrays, where each inner array can have its own length.",
        "correct": true
      },
      {
        "label": "A rectangular array `string[,]` — every row must have the same number of columns.",
        "correct": false
      },
      {
        "label": "A single-dimensional `string[]` — multidimensional data is impossible in C#.",
        "correct": false
      },
      {
        "label": "`string[,,]` — you always need three dimensions for rows of varying length.",
        "correct": false
      }
    ],
    "explanation": "A jagged array `string[][]` is literally an array whose elements are themselves arrays, so each inner array can have a different length (`rows[0].Length` can differ from `rows[1].Length`). A rectangular `int[,]` stores a true grid in one contiguous block and forces every row to share the same column count — perfect for a fixed grid (a chessboard, a matrix), wrong for ragged rows."
  },
  {
    "id": "collections-q4",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "int[,] grid = new int[2, 3];\ngrid[0, 0] = 1;\ngrid[1, 2] = 9;\nConsole.WriteLine($\"{grid.GetLength(0)}x{grid.GetLength(1)} = {grid.Length}\");\nConsole.WriteLine(grid[1, 2]);",
    "options": [
      {
        "label": "2x3 = 6\n9",
        "correct": true
      },
      {
        "label": "3x2 = 6\n9",
        "correct": false
      },
      {
        "label": "2x3 = 5\n9",
        "correct": false
      },
      {
        "label": "2x3 = 6\n0",
        "correct": false
      }
    ],
    "explanation": "A rectangular array `new int[2, 3]` has 2 rows and 3 columns. `GetLength(0)` is the size of the first dimension (2), `GetLength(1)` the second (3), and `Length` is the **total** element count, 2*3 = 6. Unassigned cells default to 0, but we set `grid[1, 2] = 9`, so the second line prints 9. Use `GetLength(dim)` for per-dimension sizes; `Length` alone gives the flat total."
        }
      ],
      challenges: [
        {
          "id": "collections-p2",
          "difficulty": "easy",
          "title": "Seating Chart vs Variable-Length Rows (Multidimensional & Jagged)",
          "prompt": "A small theatre has a rectangular main floor and an irregular balcony.\n\nPart A — Rectangular `int[,]`:\nModel the main floor as a 3-row by 4-seat grid using `int[,] floor = new int[3, 4];`. Fill it so each seat holds a ticket price: row 0 = 50, row 1 = 40, row 2 = 30 (every seat in a row has that row's price). Then loop over it with nested `for` loops and print the grid, one row per line, like `50 50 50 50`.\nAlso print `Total seats: 12` using the array's dimensions (not a hard-coded 12).\n\nPart B — Jagged `int[][]`:\nThe balcony has uneven rows: row 0 has 2 seats, row 1 has 5 seats, row 2 has 3 seats. Build a jagged array and fill every balcony seat with the price 25. Loop over it and print each row's seat count, like `Balcony row 0 has 2 seats`.\n\nWrite a one-sentence comment explaining when you'd pick `int[,]` over `int[][]`.",
          "hints": [
            "For `int[,]`, the total count is `floor.GetLength(0) * floor.GetLength(1)`.",
            "`floor.GetLength(0)` is the number of rows; `floor.GetLength(1)` is the number of columns.",
            "A jagged array is an array of arrays: `int[][] balcony = new int[3][];` then `balcony[0] = new int[2];` etc.",
            "Rectangular `int[,]` fits true grids where every row is the same width (a chessboard, a matrix); jagged `int[][]` fits rows of differing length."
          ]
        }
      ]
    },
    {
      ...lesson03,
      questions: [
        {
          "id": "collections-q5",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "List<string> queue = [\"alice\", \"bob\"];\nqueue.Add(\"carol\");\nqueue.Insert(0, \"zoe\");\nqueue.Remove(\"bob\");\nConsole.WriteLine(string.Join(\", \", queue));\nConsole.WriteLine(queue.Count);",
    "options": [
      {
        "label": "zoe, alice, carol\n3",
        "correct": true
      },
      {
        "label": "alice, carol, zoe\n3",
        "correct": false
      },
      {
        "label": "zoe, alice, bob, carol\n4",
        "correct": false
      },
      {
        "label": "zoe, alice, carol\n4",
        "correct": false
      }
    ],
    "explanation": "Start: [alice, bob]. `Add(\"carol\")` appends to the end -> [alice, bob, carol]. `Insert(0, \"zoe\")` puts zoe at index 0, shifting the rest -> [zoe, alice, bob, carol]. `Remove(\"bob\")` removes the first matching value -> [zoe, alice, carol]. `Count` is the number of items, 3. `Insert` and `Remove` in the middle are O(n) because elements shift; `Add` at the end is amortized O(1)."
  },
  {
    "id": "collections-q6",
    "kind": "mcq",
    "prompt": "On a `List<T>`, what is the difference between `Count` and `Capacity`?",
    "options": [
      {
        "label": "`Count` = number of items currently held; `Capacity` = size of the internal backing array. They differ, and relying on `Capacity` for program logic is a bug.",
        "correct": true
      },
      {
        "label": "They are always equal, so it doesn't matter which you use.",
        "correct": false
      },
      {
        "label": "`Capacity` is the item count; `Count` is the memory size in bytes.",
        "correct": false
      },
      {
        "label": "`Count` is the backing-array size; `Capacity` is how many items are stored.",
        "correct": false
      }
    ],
    "explanation": "`Count` is the number of elements actually stored. `Capacity` is the length of the internal array `List<T>` keeps behind the scenes; when `Count` would exceed `Capacity`, the list allocates a bigger array (roughly doubling) and copies. They are usually different. Use `Count` for logic. If you know the final size up front, pass it as `new List<T>(capacity)` to avoid repeated reallocation in a tight loop."
        }
      ],
      challenges: [
        {
          "id": "collections-p3",
          "difficulty": "easy",
          "title": "Shopping Cart (List<T> Basics)",
          "prompt": "Build a shopping cart for an e-commerce checkout using `List<string>`.\n\n1. Start with an empty cart: `List<string> cart = [];`.\n2. `Add` three items: \"Keyboard\", \"Mouse\", \"Monitor\".\n3. The customer realizes they want a \"USB Cable\" to appear FIRST in the cart — use `Insert` to put it at index 0.\n4. They change their mind about the \"Mouse\" — `Remove` it by value.\n5. Print the final cart with a `foreach`, numbered like `1. USB Cable`, `2. Keyboard`, ...\n6. Print `Items in cart: <n>` using the `Count` property.\n7. Print whether the cart `Contains` a \"Monitor\" (`True`/`False`).\n\nThen add a short comment: explain in your own words the difference between the `Count` property and the `Capacity` property of a `List<T>`.",
          "hints": [
            "`cart.Insert(0, \"USB Cable\")` shifts everything else right — that's an O(n) operation.",
            "`cart.Remove(\"Mouse\")` removes the first matching value and returns a bool; `RemoveAt(index)` removes by position.",
            "Use a manual counter or `for (int i = 0; ...)` to print the numbering.",
            "`Count` is how many items are actually in the list; `Capacity` is how big the internal backing array currently is (it doubles as the list grows)."
          ]
        }
      ]
    },
    {
      ...lesson04,
      questions: [
        {
          "id": "collections-q7",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "var ages = new Dictionary<string, int>\n{\n    [\"ana\"] = 30,\n    [\"ben\"] = 25\n};\n\nif (ages.TryGetValue(\"ana\", out int a))\n    Console.WriteLine($\"ana={a}\");\n\nConsole.WriteLine(ages.GetValueOrDefault(\"zoe\"));\nConsole.WriteLine(ages.GetValueOrDefault(\"zoe\", -1));",
    "options": [
      {
        "label": "ana=30\n0\n-1",
        "correct": true
      },
      {
        "label": "ana=30\nnull\n-1",
        "correct": false
      },
      {
        "label": "ana=30\n0\n0",
        "correct": false
      },
      {
        "label": "ana=30\n-1\n-1",
        "correct": false
      }
    ],
    "explanation": "`TryGetValue(\"ana\", out a)` finds the key, sets `a = 30`, returns true. `GetValueOrDefault(\"zoe\")` misses, returning `default(int)` which is 0 (not null — `int` is a value type). `GetValueOrDefault(\"zoe\", -1)` lets you choose the fallback, here -1. Contrast with the indexer `ages[\"zoe\"]`, which would **throw** `KeyNotFoundException` — unlike Python's `dict.get()`, the C# indexer does not silently miss."
  },
  {
    "id": "collections-q8",
    "kind": "mcq",
    "prompt": "Reading a value from a `Dictionary<TKey,TValue>` when the key **might not exist**: which approach is the idiomatic, exception-safe choice?",
    "options": [
      {
        "label": "`if (dict.TryGetValue(key, out var v)) { ... }` — one lookup, no exception on a miss.",
        "correct": true
      },
      {
        "label": "`var v = dict[key];` — the indexer returns null when the key is missing.",
        "correct": false
      },
      {
        "label": "`if (dict.ContainsKey(key)) v = dict[key];` — this is preferred because it hashes the key only once.",
        "correct": false
      },
      {
        "label": "Wrap `dict[key]` in a try/catch and treat `KeyNotFoundException` as the normal path.",
        "correct": false
      }
    ],
    "explanation": "`TryGetValue` is the canonical pattern: it does a single hash lookup, returns a bool for hit/miss, and assigns the value via `out` — no exception. The bare indexer **throws** `KeyNotFoundException` on a miss (it never returns null for value types). `ContainsKey` followed by the indexer works but hashes the key twice. Using try/catch for ordinary control flow is slow and poor style."
        },
        {
          "id": "collections-q14",
          "kind": "fill",
          "prompt": "Fill in the method call that safely reads `count` from a dictionary, assigning it via an `out` variable and returning a bool for hit/miss (no exception on a missing key).",
          "template": "if (wordCounts.___(\"hello\", out int count)) { Console.WriteLine(count); }",
          "accept": [
            "TryGetValue"
          ]
        }
      ],
      challenges: [
        {
          "id": "collections-p4",
          "difficulty": "medium",
          "title": "Word Frequency Counter (Dictionary<TKey,TValue>)",
          "prompt": "You're writing a text-analytics helper for a content app. Given this sentence string:\n\n`\"the cat sat on the mat the cat ran\"`\n\nSplit it into words on spaces and count how many times each word appears, using a `Dictionary<string, int>`.\n\nRequirements:\n- Use the safe upsert idiom `counts[word] = counts.GetValueOrDefault(word) + 1;` — do NOT use the throwing indexer for reading.\n- After counting, print each word and its count, one per line, like `the: 3`.\n- Then demonstrate safe lookup: use `TryGetValue` to look up the word \"cat\" and print `cat appears 2 times`, and look up the word \"dog\" (absent) and print `dog not found` instead of crashing.\n- Add a comment explaining why `counts[\"dog\"]` (the indexer) would be dangerous here, and how this differs from Python's `dict.get(\"dog\")`.",
          "hints": [
            "`sentence.Split(' ')` returns a `string[]` you can `foreach` over.",
            "`GetValueOrDefault(word)` returns 0 for an int value type when the key is missing — no exception.",
            "`if (counts.TryGetValue(\"cat\", out int n)) { ... } else { ... }` is the canonical safe pattern.",
            "The indexer `counts[\"dog\"]` throws `KeyNotFoundException` on a missing key — unlike Python's `dict.get()` which returns `None`/a default. Dictionary iteration order is NOT guaranteed, so don't depend on it."
          ]
        }
      ]
    },
    {
      ...lesson05,
      questions: [
        {
          "id": "collections-q9",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "var seen = new HashSet<int> { 1, 2, 3 };\nbool addedNew = seen.Add(4);\nbool addedDup = seen.Add(2);\nConsole.WriteLine($\"{addedNew} {addedDup}\");\nConsole.WriteLine(seen.Count);\nConsole.WriteLine(seen.Contains(3));",
    "options": [
      {
        "label": "True False\n4\nTrue",
        "correct": true
      },
      {
        "label": "True True\n5\nTrue",
        "correct": false
      },
      {
        "label": "True False\n5\nTrue",
        "correct": false
      },
      {
        "label": "True False\n4\nFalse",
        "correct": false
      }
    ],
    "explanation": "`HashSet<T>.Add` returns `true` only if the item was actually inserted. Adding 4 (new) returns true; adding 2 (already present) returns false and changes nothing. So the set is {1, 2, 3, 4}: `Count` is 4, and `Contains(3)` is true. `Add` returning a bool makes a HashSet a clean way to ask 'have I seen this before?' in dedup and visited-set code — a frequent interview trick."
  },
  {
    "id": "collections-q10",
    "kind": "mcq",
    "prompt": "Which scenario is the **best** fit for a `HashSet<T>` rather than a `List<T>` or `Dictionary<TKey,TValue>`?",
    "options": [
      {
        "label": "You need fast membership tests and automatic de-duplication of values, with no associated data and no ordering.",
        "correct": true
      },
      {
        "label": "You need to look up a full record (a `User` object) by its id.",
        "correct": false
      },
      {
        "label": "You must preserve insertion order and access items by integer index.",
        "correct": false
      },
      {
        "label": "You need the items kept permanently sorted as you insert them.",
        "correct": false
      }
    ],
    "explanation": "`HashSet<T>` stores **unique** values with average O(1) `Add`/`Contains`/`Remove`, and supports set operations (`UnionWith`, `IntersectWith`, `ExceptWith`) — ideal for 'have I processed this id?', visited-sets, and dedup. If you need a value mapped to a key, use `Dictionary`. If you need index access or insertion order, use `List`. If you need items kept sorted, use `SortedSet<T>` (O(log n), tree-backed)."
        },
        {
          "id": "collections-q15",
          "kind": "fill",
          "prompt": "A method parameter should accept the **weakest** interface that still lets it `foreach` over the items, so callers can pass an array, a `List<T>`, or a LINQ query. Fill in that interface.",
          "template": "public int CountItems(___<string> items) => items.Count();",
          "accept": [
            "IEnumerable",
            "IEnumerable<string>"
          ]
        }
      ],
      challenges: [
        {
          "id": "collections-p5",
          "difficulty": "medium",
          "title": "Deduplicating Email Recipients (HashSet<T>)",
          "prompt": "A marketing tool keeps accidentally emailing people twice. Fix it with `HashSet<T>`.\n\nGiven two recipient lists:\n- `string[] listA = [\"ann@x.com\", \"bob@x.com\", \"cara@x.com\", \"ann@x.com\"];`\n- `string[] listB = [\"bob@x.com\", \"dan@x.com\", \"cara@x.com\"];`\n\nDo all of the following:\n1. Build a `HashSet<string>` from `listA` and print how many UNIQUE addresses it contains (note the duplicate \"ann@x.com\").\n2. Demonstrate a fast membership test: print whether \"bob@x.com\" is present (`True`).\n3. Compute the people in BOTH lists (intersection) and print them — use a copy and `IntersectWith`.\n4. Compute everyone across both lists with no duplicates (union) and print the total count — use `UnionWith`.\n5. Compute who is in `listA` but NOT in `listB` (difference) and print them — use `ExceptWith`.\n\nAdd a comment noting why a `HashSet` has no indexer (`set[0]` doesn't compile) and why its iteration order is not guaranteed.",
          "hints": [
            "`HashSet<string> setA = [..listA];` (collection expression with spread) or `new HashSet<string>(listA)` dedups automatically.",
            "Set operations MUTATE the set they're called on, so make a copy first: `var both = new HashSet<string>(setA); both.IntersectWith(listB);`.",
            "`UnionWith`, `IntersectWith`, and `ExceptWith` all accept any `IEnumerable<T>`, so you can pass the raw arrays.",
            "A set is unordered and stores items by hash bucket, so there's no meaningful 'position' to index by, and enumeration order can differ from insertion order."
          ]
        },
        {
          "id": "collections-p8",
          "difficulty": "hard",
          "title": "In-Memory User Index (Dictionary + List + custom key)",
          "prompt": "Build a tiny in-memory 'repository' like the ones behind a web API, combining several collection types.\n\nDefine `record User(int Id, string Name, string City);` (a record so equality and hashing are correct for free).\n\nGiven this seed data (build it as a `List<User>`):\n`[ new(1,\"Ann\",\"Paris\"), new(2,\"Bob\",\"Lyon\"), new(3,\"Cara\",\"Paris\"), new(4,\"Dan\",\"Nice\"), new(5,\"Eve\",\"Lyon\") ]`\n\nImplement and demonstrate:\n1. Build a `Dictionary<int, User>` indexed by `Id` so you can do O(1) lookups. Use `TryAdd` while building and assert no duplicate ids slipped in.\n2. Write a lookup that, given an id, prints the user via `TryGetValue` — show both a hit (id 3) and a miss (id 99 -> `No user 99`).\n3. Build a 'users by city' index of type `Dictionary<string, List<User>>`: for each user, get-or-create the list for their city and add them. Then print each city followed by its members, like `Paris: Ann, Cara`.\n4. Use a `HashSet<string>` to print the set of DISTINCT cities.\n\nAdd a comment explaining why making `User` a `record` matters if you ever put `User` instances directly into a `HashSet<User>` or use them as dictionary keys.",
          "hints": [
            "`if (!byId.TryAdd(u.Id, u)) throw new InvalidOperationException($\"Duplicate id {u.Id}\");` enforces uniqueness while building.",
            "For the grouping index, the get-or-create idiom: `if (!byCity.TryGetValue(u.City, out var list)) { list = []; byCity[u.City] = list; } list.Add(u);`",
            "Build distinct cities by spreading the users' cities into a set, or `foreach` and `Add` to a `HashSet<string>` (Add is a no-op if already present).",
            "A `record` auto-generates value-based `Equals` and `GetHashCode`, so two `User`s with the same field values are 'equal' in a set/dictionary. A plain `class` would compare by reference, silently breaking set membership and key lookups."
          ]
        }
      ]
    },
    {
      ...lesson06,
      questions: [
        {
          "id": "collections-q11",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "var stack = new Stack<string>();\nstack.Push(\"a\");\nstack.Push(\"b\");\nstack.Push(\"c\");\n\nvar queue = new Queue<string>();\nqueue.Enqueue(\"a\");\nqueue.Enqueue(\"b\");\nqueue.Enqueue(\"c\");\n\nConsole.WriteLine($\"{stack.Pop()} {queue.Dequeue()}\");",
    "options": [
      {
        "label": "c a",
        "correct": true
      },
      {
        "label": "a c",
        "correct": false
      },
      {
        "label": "a a",
        "correct": false
      },
      {
        "label": "c c",
        "correct": false
      }
    ],
    "explanation": "A `Stack<T>` is LIFO (last-in, first-out): after pushing a, b, c, `Pop()` returns the most recent, 'c'. A `Queue<T>` is FIFO (first-in, first-out): after enqueuing a, b, c, `Dequeue()` returns the oldest, 'a'. So it prints 'c a'. Stacks back undo/DFS/expression evaluation; queues back work pipelines/BFS/scheduling."
        },
        {
          "id": "collections-q16",
          "kind": "mcq",
          "prompt": "You call `Pop()` (or `Dequeue()`) on an **empty** `Stack<T>`/`Queue<T>`. What is the safe, idiomatic way to read the next item only if one exists, without throwing?",
          "options": [
            {
              "label": "Check `Count > 0` first, or use `TryPop(out var x)` / `TryDequeue(out var x)`, which return false instead of throwing on an empty collection.",
              "correct": true
            },
            {
              "label": "`Pop()` returns `null` on an empty stack, so just null-check the result.",
              "correct": false
            },
            {
              "label": "`Peek()` is guaranteed to never throw, so call it before every `Pop()`.",
              "correct": false
            },
            {
              "label": "Empty stacks auto-grow, so `Pop()` simply returns `default(T)` and you can ignore the case.",
              "correct": false
            }
          ],
          "explanation": "`Pop()`/`Dequeue()`/`Peek()` all throw `InvalidOperationException` when the collection is empty — they never return null or `default`. Guard with `if (stack.Count > 0)`, or prefer the `Try*` family added for exactly this: `TryPop(out var x)` and `TryDequeue(out var x)` return `false` (and set the out var to `default`) instead of throwing, mirroring `Dictionary.TryGetValue`."
        }
      ],
      challenges: [
        {
          "id": "collections-p6",
          "difficulty": "medium",
          "title": "Balanced Brackets & Print Queue (Stack<T> & Queue<T>)",
          "prompt": "Two classic real-world structures in one exercise.\n\nPart A — Bracket checker (Stack<T>):\nWrite a method `bool IsBalanced(string s)` that returns whether the brackets in `s` are balanced. Support `()`, `[]`, and `{}`. Use a `Stack<char>`: push opening brackets; on a closing bracket, `Pop` and verify it matches the expected opener (and that the stack isn't empty). At the end the stack must be empty. Ignore any non-bracket characters.\nTest it on: `\"(a[b]{c})\"` -> True, `\"([)]\"` -> False, `\"(((\"` -> False, `\"\"` -> True. Print each result.\n\nPart B — Print job scheduler (Queue<T>):\nA printer processes jobs first-in, first-out. `Enqueue` these jobs in order: \"report.pdf\", \"invoice.docx\", \"photo.png\". Then loop while the queue is not empty, `Dequeue` each, and print `Printing: report.pdf` etc. After the loop print `All jobs done. Remaining: 0`.\n\nAdd a comment contrasting LIFO (Stack) vs FIFO (Queue) and naming one real use for each.",
          "hints": [
            "For matching, keep a small map of closer->opener, e.g. check `top == '(' for ')'`. A `switch` expression also works.",
            "Guard before popping: if a closing bracket arrives and `stack.Count == 0`, it's already unbalanced.",
            "`Stack<T>`: `Push`, `Pop`, `Peek`, `Count`. `Queue<T>`: `Enqueue`, `Dequeue`, `Peek`, `Count`.",
            "Stack = LIFO (undo history, DFS, expression parsing); Queue = FIFO (print/work queues, BFS, scheduling)."
          ]
        }
      ]
    },
    {
      ...lesson07,
      questions: [
        {
          "id": "collections-q12",
    "kind": "mcq",
    "prompt": "You loop over a `List<int>` with `foreach` and call `list.Remove(x)` inside the loop. What happens?",
    "options": [
      {
        "label": "It throws `InvalidOperationException` (\"Collection was modified; enumeration operation may not execute\").",
        "correct": true
      },
      {
        "label": "It works fine; `foreach` snapshots the list before iterating.",
        "correct": false
      },
      {
        "label": "It silently skips the next element but does not throw.",
        "correct": false
      },
      {
        "label": "It throws `IndexOutOfRangeException` once the list shrinks.",
        "correct": false
      }
    ],
    "explanation": "Modifying a collection (Add/Remove/Insert/Clear) while a `foreach` is enumerating it throws `InvalidOperationException` because the enumerator detects the structural change. Correct fixes: iterate a copy (`foreach (var x in list.ToList())`), use `list.RemoveAll(predicate)` for conditional removal, or use a classic `for` loop iterating **backwards** by index so removals don't disturb the unvisited part."
  },
  {
    "id": "collections-q13",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "List<int> nums = [5, 1, 4, 2, 3];\nnums.Sort();\nList<int> evens = nums.FindAll(n => n % 2 == 0);\nnums.Sort((x, y) => y.CompareTo(x));\nConsole.WriteLine(string.Join(\",\", evens));\nConsole.WriteLine(string.Join(\",\", nums));",
    "options": [
      {
        "label": "2,4\n5,4,3,2,1",
        "correct": true
      },
      {
        "label": "4,2\n5,4,3,2,1",
        "correct": false
      },
      {
        "label": "2,4\n1,2,3,4,5",
        "correct": false
      },
      {
        "label": "4,2\n1,2,3,4,5",
        "correct": false
      }
    ],
    "explanation": "`Sort()` orders ascending in place -> [1,2,3,4,5]. `FindAll(predicate)` returns a **new** list of matches, in current order, so `evens` is [2,4]. Then `nums.Sort((x, y) => y.CompareTo(x))` uses a custom comparator to sort descending in place -> [5,4,3,2,1]. Because `FindAll` ran before the second sort, `evens` keeps its [2,4] order. These built-in helpers (`Sort`, `FindAll`) preview what LINQ's `OrderBy`/`Where` will generalize."
        }
      ],
      challenges: [
        {
          "id": "collections-p7",
    "difficulty": "medium",
    "title": "Leaderboard: Iterate, Sort, and Filter",
    "prompt": "Build a game leaderboard report from a `List<int>` of scores using ONLY built-in collection helpers (no LINQ yet).\n\nStart with: `List<int> scores = [42, 88, 17, 88, 5, 73, 60];`\n\n1. Print the scores in their original order with a `foreach`, space-separated.\n2. Make a COPY of the list and `Sort()` it ascending; print it. (Use a copy so the original order is preserved.)\n3. Sort the copy in DESCENDING order using a custom comparison `copy.Sort((a, b) => b.CompareTo(a));` and print it.\n4. Use `FindAll` with a predicate to get every score `>= 60` (a 'qualifying' score) and print how many qualified plus the qualifying scores.\n5. Use `Find` to print the FIRST score that is greater than 50.\n6. Use `Exists` to print whether any score equals 100 (`True`/`False`).\n\nAdd a comment: name two of these helpers (`Sort`, `FindAll`, `Find`, `Exists`) and note that LINQ (coming later) will generalize `FindAll`/`Find` into `Where`/`First`.",
    "hints": [
      "Copy a list with `var copy = new List<int>(scores);` so `Sort()` (which sorts in place) doesn't disturb the original.",
      "`List<T>.Sort()` orders ascending by default; pass a `Comparison<T>` lambda `(a,b) => b.CompareTo(a)` to reverse it.",
      "`FindAll(s => s >= 60)` returns a new `List<int>`; `Find(s => s > 50)` returns the first match (or `default`, i.e. 0, if none).",
      "`Exists(s => s == 100)` returns a bool. These are the pre-LINQ ancestors of `Where`, `First`/`FirstOrDefault`, and `Any`."
    ]
  },
  {
    "id": "collections-p9",
    "difficulty": "hard",
    "title": "Safe Mutation While Iterating + LRU-ish Cache",
    "prompt": "This problem targets two classic bugs and a real caching pattern.\n\nPart A — The 'collection modified' trap:\nStart with `List<int> nums = [1,2,3,4,5,6,7,8,9,10];`. You must remove every even number. First, write a comment showing the WRONG approach (a `foreach` that calls `nums.Remove(n)` inside) and explain the exact exception it throws. Then implement TWO correct fixes and print the result of each on a fresh copy of the list:\n- Fix 1: `nums.RemoveAll(n => n % 2 == 0);`\n- Fix 2: iterate by index in REVERSE with a `for` loop, calling `RemoveAt(i)` when even.\nBoth must produce `1 3 5 7 9`.\n\nPart B — A bounded recently-used cache:\nBuild a simple cache that remembers at most 3 keys in insertion/use order. Use a `Dictionary<string,int>` for values plus a `Queue<string>` (or `List<string>`) to track order. Implement a `Put(key, value)` that: stores the value; if adding a NEW key pushes the count above 3, evicts the OLDEST key (dequeue it and remove it from the dictionary), printing `Evicted: <key>`. Demonstrate by putting keys a=1, b=2, c=3, d=4 (d should evict a), then print the remaining keys and the dictionary count (`3`).",
    "hints": [
      "Modifying a `List<T>` inside a `foreach` over it throws `InvalidOperationException: Collection was modified; enumeration operation may not execute`.",
      "`RemoveAll(predicate)` is the cleanest in-place filter; the reverse `for` loop works because removing at index `i` doesn't disturb the not-yet-visited lower indices.",
      "For the cache, only enqueue a key into the order-tracker when it's genuinely new (not already in the dictionary), so updates don't double-count it.",
      "Eviction: `var oldest = order.Dequeue(); dict.Remove(oldest);` once `dict.Count` exceeds the capacity of 3."
    ]
  },
  {
    "id": "collections-p10",
    "difficulty": "hard",
    "title": "Mini Analytics Pipeline (Interface-typed API, multiple collections)",
    "prompt": "Capstone: write a small, well-typed analytics module the way a senior dev would for a service layer — programming to interfaces and choosing the right collection for each job. NO LINQ; use loops and the collection methods from this topic.\n\nModel an order line as `record Order(int Id, string Product, string Category, int Quantity, decimal Price);`.\n\nSeed (as a `List<Order>`):\n`[ new(1,\"Pen\",\"Office\",10,1.50m), new(2,\"Notebook\",\"Office\",5,3.00m), new(3,\"Mouse\",\"Tech\",2,25.00m), new(4,\"Pen\",\"Office\",7,1.50m), new(5,\"Keyboard\",\"Tech\",3,45.00m), new(6,\"Mouse\",\"Tech\",1,25.00m) ]`\n\nWrite these methods, each taking the WEAKEST sensible interface as its parameter (`IEnumerable<Order>` or `IReadOnlyList<Order>`) and returning a read-only type where appropriate:\n1. `IReadOnlyDictionary<string, decimal> RevenueByCategory(IEnumerable<Order> orders)` — total `Quantity * Price` per category. Build it with a `Dictionary` and the get-or-default upsert pattern, then return it.\n2. `IReadOnlySet<string> DistinctProducts(IEnumerable<Order> orders)` — a `HashSet` of product names.\n3. `IReadOnlyList<KeyValuePair<string,int>> TopProductsByQuantity(IEnumerable<Order> orders)` — total quantity per product, returned as a `List<KeyValuePair<string,int>>` SORTED by quantity descending (use `List.Sort` with a comparison). \n\nIn `Main`, call each and print a small report. Finally, add a comment: explain why accepting `IEnumerable<Order>` in parameters but returning `IReadOnly*` types is a deliberate design choice (what it lets callers pass, and what it prevents them from doing to your internal state).",
    "hints": [
      "Accept `IEnumerable<Order>` so callers can pass an array, a `List`, a `HashSet`, or a future LINQ query interchangeably — you only need to `foreach`.",
      "Upsert pattern: `totals[o.Category] = totals.GetValueOrDefault(o.Category) + o.Quantity * o.Price;`.",
      "To return a sorted view: copy the dictionary entries into `var list = new List<KeyValuePair<string,int>>(perProduct);` then `list.Sort((a,b) => b.Value.CompareTo(a.Value));` and return it as `IReadOnlyList<...>`.",
      "Returning `IReadOnly*`/`IReadOnlySet` hands callers a read-only VIEW: they can enumerate and read, but can't `Add`/`Remove` and accidentally corrupt the module's internal collections. A `Dictionary` implements `IReadOnlyDictionary`, so you can just return it typed as the interface."
          ]
        }
      ]
    }
  ],
  projects: [
  {
    "id": "collections-proj-1",
    "difficulty": "starter",
    "title": "CSV Sales Importer & Summary Report",
    "brief": "Build a small console tool that reads a comma-separated list of daily sales numbers, loads them into a List<T>, and prints a tidy summary report (count, total, average, min, max, and the days above average). This mirrors the everyday 'parse some input, accumulate it, compute aggregates' loop that shows up constantly in business and reporting code.",
    "requirements": [
      "Start from a single input string of comma-separated integers (e.g. \"120,340,90,560,210\") representing one sale amount per day; split and parse each value into a List<int>.",
      "Use List<int> (not a fixed array) to hold the parsed values, and explain in a code comment why a growable List<T> fits unknown-length input better than an array.",
      "Print Count using the List<T>.Count property (not LINQ Count()).",
      "Compute and print total, average, minimum, and maximum using a single foreach (or for) loop over the list — no LINQ yet.",
      "Iterate the list a second time to print every day index (1-based) whose amount is strictly above the average.",
      "Use Add to append values as you parse, and demonstrate indexing (list[0], list[^1]) when printing the first and last day.",
      "Handle empty input gracefully: if the list is empty, print a clear message instead of dividing by zero.",
      "Build the list with modern collection-expression / target-typed syntax where natural (e.g. List<int> results = [];) and target .NET 10 / C# 14."
    ],
    "stretch": [
      "Pre-size the list with new List<int>(capacity) when the number of entries is known up front, and add a comment on why this avoids repeated reallocation as List<T> doubles its backing array.",
      "Add a second parallel List<string> of day labels (Mon, Tue, ...) and report the highest-grossing day by name.",
      "Use Insert to keep a 'running top 3' list sorted as you go, and RemoveAt to drop anything past index 2.",
      "Round the average to 2 decimals and format currency with amount.ToString(\"C\") using the current culture.",
      "Refactor the aggregation into a method that accepts IReadOnlyList<int> so callers can pass either an array or a List<int>."
    ],
    "concepts": [
      "List<T>",
      "Add / indexing",
      "Count property vs Count()",
      "foreach iteration",
      "parsing input",
      "collection expressions",
      "index-from-end ^1",
      "capacity vs count"
    ]
  },
  {
    "id": "collections-proj-2",
    "difficulty": "intermediate",
    "title": "Log Analyzer: Counts, Unique Visitors & a BFS Crawl Queue",
    "brief": "Build a console log-analysis tool that ingests a batch of web request records and produces the kind of report an on-call engineer actually wants: hits per endpoint (Dictionary), the set of unique visitor IPs (HashSet), and a breadth-first crawl of internal links using a Queue. It exercises the four workhorse collections together the way real backend code does, including the safe-access idioms that come up in interviews.",
    "requirements": [
      "Model a request record as a record type (e.g. record Request(string Ip, string Endpoint, IReadOnlyList<string> OutboundLinks)) and seed a List<Request> of sample data in code.",
      "Build a Dictionary<string,int> mapping endpoint -> hit count using the GetValueOrDefault counting idiom (counts[ep] = counts.GetValueOrDefault(ep) + 1;), and print endpoints sorted by descending count.",
      "Use TryGetValue (not the throwing indexer) anywhere you read a count back out, and add a callout comment explaining why dict[missingKey] throws KeyNotFoundException unlike Python's dict.get().",
      "Collect unique visitor IPs in a HashSet<string>; report the unique-visitor total and demonstrate O(1) membership with a 'have we seen this IP?' check.",
      "Use HashSet set operations: given an allow-list and a block-list HashSet, compute and print which visiting IPs are blocked (IntersectWith on a copy) and which are brand-new (ExceptWith).",
      "Implement a breadth-first crawl: starting from one endpoint, use a Queue<string> plus a 'visited' HashSet<string> to traverse OutboundLinks level by level without revisiting a node, printing the visit order.",
      "Never mutate a collection while iterating it with foreach; if you must remove entries, use RemoveAll, iterate a copy, or loop by index — and note this in a comment.",
      "Choose method signatures deliberately: accept IEnumerable<Request> in your analysis methods and return IReadOnlyDictionary<string,int> / IReadOnlyList<T> so callers can't mutate internal state.",
      "Target .NET 10 / C# 14; use collection expressions ([], [..a, ..b]) for sample/seed data where it reads cleanly."
    ],
    "stretch": [
      "Swap the plain Dictionary for a SortedDictionary<string,int> (or sort with OrderByDescending) and discuss in comments the order-guarantee vs performance trade-off (hash O(1) unordered vs tree O(log n) sorted).",
      "Make the counting concurrent: process the records across tasks using a ConcurrentDictionary<string,int> with AddOrUpdate, and explain why a plain Dictionary is unsafe for concurrent writes.",
      "Add an LRU-style cache or memoization using a Dictionary keyed by endpoint to avoid recomputing an expensive per-endpoint metric.",
      "Group requests by IP into a Dictionary<string,List<string>> (ip -> endpoints visited) and print each visitor's path.",
      "Add a Stack<string> 'navigation history' so a synthetic user can Push pages and Pop a Back button, contrasting LIFO (Stack) with the FIFO (Queue) used by the crawler.",
      "Return the analysis as a small DTO and prove the returned IReadOnlyDictionary really blocks mutation by attempting (and commenting out) a write."
    ],
    "concepts": [
      "Dictionary<TKey,TValue>",
      "TryGetValue / GetValueOrDefault",
      "HashSet<T> + set operations",
      "Queue<T> BFS",
      "Stack<T> LIFO",
      "visited-set pattern",
      "records as keys/equality",
      "IEnumerable / IReadOnly* signatures",
      "safe iteration / RemoveAll",
      "ConcurrentDictionary (stretch)"
    ]
  }
],
};
