import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  "slug": "arrays",
  "number": 1,
  "title": "Arrays — Fixed-Size Sequences",
  "objective": "Declare, initialize, access, and iterate arrays, and understand why their fixed size is the reason List<T> exists.",
  "blocks": [
    {
      "kind": "lead",
      "text": "An array is the oldest, simplest, and fastest sequence in C# — a fixed block of memory holding a known number of same-typed values. Master it first, because every richer collection you'll meet later (yes, including the `List<T>` you'll reach for every day) is built on top of one."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "This is lesson 1 of the collections arc. The single most important takeaway to leave students with: an array's length is frozen at creation. Everything about `List<T>` in the next lesson is motivated by that one limitation — keep returning to it.",
        "Audience is Python developers. Their instinct is `list` — growable, heterogeneous, `.append()`. Lead with that mismatch early and explicitly so they don't carry the wrong mental model into every later example.",
        "Don't drown them in `int[,]` multidimensional / jagged arrays here; mention they exist, defer depth. The objective is the 1-D fundamentals plus index/range operators and reference semantics.",
        "Reference-type semantics catches everyone. Demo the aliasing bug live — assign one array to another variable, mutate through the second, show the first changed. It lands far harder as a live surprise than as a sentence.",
        "Collection expressions `[1, 2, 3]` are C# 12 (.NET 8), NOT new in C# 14 — present them as today's idiomatic syntax, but do not claim they're a 14 novelty if a student asks.",
        "If you're short on time, the cuttable section is the older declaration variants (`new int[]{...}`, `{ ... }`). Show them once so students recognize them in old code, then move on — the `[...]` form is what they should write.",
        "The `{ 4, 5, 6 }` shorthand is ONLY legal at the point of declaration. `int[] c; c = { 4, 5, 6 };` does NOT compile. If a student gets a confusing error reassigning with braces, that's why — point them at the collection expression `c = [4, 5, 6];`, which works everywhere."
      ]
    },
    {
      "kind": "paragraph",
      "text": "If you're coming from Python, you've spent your whole life with one container: the list. `nums = [1, 2, 3]`, then `nums.append(4)`, then maybe `nums.append(\"hello\")` because Python doesn't care. C# deliberately gives up that flexibility in exchange for speed and compile-time safety, and it splits Python's one `list` into several specialized types. The most primitive of them — the one that predates all the others — is the **array**."
    },
    {
      "kind": "paragraph",
      "text": "A C# array is a **fixed-size, homogeneous, indexed** block of memory. Fixed-size: you choose its length when you create it, and that length never changes. Homogeneous: an `int[]` holds **only** `int` values — the compiler enforces it, so there's no runtime surprise. Indexed: you reach any element instantly by position. Those three properties are exactly what makes arrays fast, and exactly what makes them rigid."
    },
    {
      "kind": "paragraph",
      "text": "You meet arrays constantly in real production code, even when `List<T>` is the everyday default: a method that returns `string[]` from `text.Split(',')`, the `byte[]` you read off a network socket or a file, the `args` parameter of `Main`, a fixed lookup table of tax brackets that never changes, the pixel buffer in a game frame. Whenever the size is known and stable — or every nanosecond counts — the array is the right tool."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Declaring and initializing arrays",
      "id": "declaring"
    },
    {
      "kind": "paragraph",
      "text": "The type of an array is the element type followed by square brackets: `int[]` is \"array of int\", `string[]` is \"array of string\". There are several ways to create one. Over the years C# has accumulated syntax, so you'll see all of these in real codebases — but in modern .NET 8/10 code you should reach for the last one, the **collection expression**."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// 1. Allocate a fixed length; every slot gets the type's DEFAULT value.\n//    For int that's 0, for bool false, for reference types null.\nint[] a = new int[3];          // => [0, 0, 0]\n\n// 2. Allocate AND fill, the verbose classic form.\nint[] b = new int[] { 1, 2, 3 };\n\n// 3. The old shorthand initializer (only valid AT declaration).\nint[] c = { 4, 5, 6 };\n\n// 4. Collection expression (C# 12+) — the modern idiom. Use this.\nint[] d = [7, 8, 9];"
    },
    {
      "kind": "paragraph",
      "text": "Form 1 is what you use when you know the **size** but not the contents yet — you'll fill the slots in a loop. Notice it doesn't leave the array empty or undefined the way an uninitialized variable in some languages would: C# guarantees every element is set to that type's default (`0`, `false`, `'\\0'`, or `null`). Forms 2–4 are when you know the contents up front. The collection expression `[7, 8, 9]` is **target-typed** — the compiler reads the type on the left (`int[]`) to know what to build."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The brace form { ... } only works at declaration",
      "text": "Form 3, `int[] c = { 4, 5, 6 };`, is special syntax that's **only** legal on the same line you declare the variable. You can't reuse it later: `int[] c; c = { 4, 5, 6 };` is a **compile error**. The collection expression has no such restriction — `int[] c; c = [4, 5, 6];` works anywhere a value is expected (assignments, method arguments, `return`). That's one more reason to default to `[...]`."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "var won't work with a bare [ ... ]",
      "text": "Because a collection expression is target-typed, the compiler needs an explicit type to infer from. Writing `var x = [1, 2, 3];` is a **compile error** — there's nothing on the left to tell the compiler whether you wanted an `int[]`, a `List<int>`, or a `Span<int>`. Write the type out: `int[] x = [1, 2, 3];`. This trips up Python developers used to `x = [1, 2, 3]` just working."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Indexing and Length",
      "id": "indexing"
    },
    {
      "kind": "paragraph",
      "text": "Arrays are **zero-based**, exactly like Python: the first element is at index `0`, and an array of length 5 has valid indices `0` through `4`. You read or write any element by position with square brackets, and you ask how many elements there are with the `Length` property. Note `Length` is a **property, not a method** — no parentheses — and reading it is instant (O(1)); the array always knows its own size."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int[] scores = [88, 92, 79, 100, 67];\n\nConsole.WriteLine(scores[0]);       // first element\nConsole.WriteLine(scores.Length);   // how many elements\n\nscores[2] = 80;                     // arrays are mutable: overwrite in place\nConsole.WriteLine(scores[2]);"
    },
    {
      "kind": "output",
      "output": "88\n5\n80"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The #1 array bug: IndexOutOfRangeException",
      "text": "An array of length 5 has indices 0–4. Asking for `scores[5]` (or any index `< 0` or `>= Length`) throws an **`IndexOutOfRangeException`** at runtime — it does not return `null` or clamp to the end. This is the off-by-one error every developer hits. In Python, `nums[-1]` quietly gives you the last element; in C# a negative index throws. (C# has its own way to count from the end — the `^` operator — which we'll see in a moment.)"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int[] temps = [68, 71, 65];   // valid indices: 0, 1, 2\n\ntry\n{\n    Console.WriteLine(temps[3]);   // boom — there is no index 3\n}\ncatch (IndexOutOfRangeException ex)\n{\n    Console.WriteLine($\"Caught: {ex.Message}\");\n}"
    },
    {
      "kind": "output",
      "output": "Caught: Index was outside the bounds of the array."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Iterating: for vs foreach",
      "id": "iterating"
    },
    {
      "kind": "paragraph",
      "text": "Two loops cover almost everything. Use **`foreach`** when you just need each value and don't care about its position — it's clearer and harder to get wrong. Use a **`for`** loop with an index counter when you need the position itself (to print it, to compare neighbours, or to **write** back into the array — you can't reassign elements through a `foreach` variable)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int[] scores = [88, 92, 79, 100, 67];\n\n// for: you have the index i, so you can use position and mutate.\nfor (int i = 0; i < scores.Length; i++)\n{\n    Console.WriteLine($\"Index {i}: {scores[i]}\");\n}\n\n// foreach: cleaner when you only need the value. (Python's `for x in nums`.)\nforeach (int score in scores)\n{\n    Console.Write(score + \" \");\n}\nConsole.WriteLine();"
    },
    {
      "kind": "output",
      "output": "Index 0: 88\nIndex 1: 92\nIndex 2: 79\nIndex 3: 100\nIndex 4: 67\n88 92 79 100 67 "
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: prefer foreach, and let the bound be Length",
      "text": "Reach for `foreach` by default — it removes the off-by-one risk entirely because there's no index to mismanage. When you genuinely need a `for` loop, always write the condition as `i < scores.Length` (not a hard-coded number like `i < 5`). Tie the loop to the array's actual size and it stays correct even if the array's length changes later — a small habit that prevents a whole class of bugs."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Indices and ranges: the ^ and .. operators",
      "id": "index-range"
    },
    {
      "kind": "paragraph",
      "text": "C# has clean, built-in syntax for \"from the end\" and \"a slice\", and it's genuinely nicer than what most languages offer. The **index-from-end operator `^`** counts backward: `^1` is the **last** element, `^2` the second-to-last, and so on. (`^1` means \"length minus 1\" — that's why the last element is `^1`, not `^0`.) The **range operator `..`** takes a slice: `start..end`, where `start` is **inclusive** and `end` is **exclusive** — the same half-open convention as Python's `nums[1:4]`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int[] scores = [88, 92, 79, 100, 67];\n\nConsole.WriteLine(scores[^1]);   // last element\nConsole.WriteLine(scores[^2]);   // second from the end\n\nint[] middle = scores[1..4];     // indices 1,2,3 (4 is excluded)\nConsole.WriteLine(string.Join(\", \", middle));\n\nint[] firstThree = scores[..3];  // omit start => from the beginning\nConsole.WriteLine(string.Join(\", \", firstThree));\n\nint[] lastTwo = scores[^2..];    // omit end => through the end\nConsole.WriteLine(string.Join(\", \", lastTwo));"
    },
    {
      "kind": "output",
      "output": "67\n100\n92, 79, 100\n88, 92, 79\n100, 67"
    },
    {
      "kind": "paragraph",
      "text": "These aren't just syntax sugar — `^` and `..` are backed by two real types, **`System.Index`** and **`System.Range`**, that you can store in variables and pass around. That means you can compute a slice's bounds once and reuse them, which shows up in parsers, pagination, and buffer code."
    },
    {
      "kind": "examples",
      "intro": "Index and Range are first-class values:",
      "examples": [
        {
          "label": "Store an Index in a variable",
          "code": "int[] nums = [1, 2, 3, 4, 5];\nIndex last = ^1;\nConsole.WriteLine(nums[last]);",
          "output": "5"
        },
        {
          "label": "Store a Range and apply it",
          "code": "int[] nums = [1, 2, 3, 4, 5];\nRange r = 1..3;\nConsole.WriteLine(string.Join(\",\", nums[r]));",
          "output": "2,3"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Slicing an array copies it",
      "text": "When you slice an array with `..`, you get a **brand-new array** containing copies of those elements — changing the slice does not touch the original. (Python's list slicing behaves the same way.) If you want a slice that's a cheap, no-copy **window** over the existing memory, that's what `Span<T>` and `ReadOnlySpan<T>` are for — a performance tool you'll meet later when we talk about hot paths and avoiding allocations."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Arrays are fixed-size — and that's the whole point",
      "id": "fixed-size"
    },
    {
      "kind": "paragraph",
      "text": "Here is the property that defines arrays and motivates everything that follows: **once an array is created, its length cannot change.** There is no `Add`, no `Append`, no `Remove`. An array is a slab of memory sized exactly once, when it's born. So what do you do when you have a 3-element array and need a 4th value? You can't grow it — you allocate a **new, bigger array** and copy the elements over. The helper `Array.Resize` does exactly that under the hood: despite the name, it doesn't resize anything; it creates a new array and reassigns your reference to it."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "string[] names = [\"Ada\", \"Linus\", \"Grace\"];\n\n// \"Resize\" really means: allocate a new array of length 4, copy the old\n// elements in, and point `names` at the new one. The original 3-slot\n// array is now garbage. Note the `ref` — the variable itself is reassigned.\nArray.Resize(ref names, 4);\nnames[3] = \"Dennis\";\n\nConsole.WriteLine(string.Join(\", \", names));\nConsole.WriteLine(names.Length);"
    },
    {
      "kind": "output",
      "output": "Ada, Linus, Grace, Dennis\n4"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "This is why List<T> exists",
      "text": "Doing that allocate-and-copy dance by hand every time you add an item would be miserable and slow. So C# gives you **`List<T>`** (the next lesson), which wraps an array internally and does the resizing **for you** — when the backing array fills up, it allocates a bigger one and copies, automatically. Rule of thumb: if you know the size up front and it won't change, use an **array**; if the collection grows or shrinks, use a **`List<T>`**. `List<T>` is what a Python developer instinctively wants — and now you know what it's built on."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Arrays are reference types",
      "id": "reference-semantics"
    },
    {
      "kind": "paragraph",
      "text": "An array variable doesn't hold the elements directly — it holds a **reference** (a pointer) to the array object living on the heap. The practical consequence: when you assign one array variable to another, you copy the **reference, not the data**. Both variables now point at the **same** array, so a change made through one is visible through the other. This is identical to how Python lists behave (`b = a` aliases, it doesn't copy) — but it surprises developers coming from value-copy languages, so internalize it."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int[] original = [10, 20, 30];\nint[] alias = original;     // copies the REFERENCE, not the elements\n\nalias[0] = 999;             // mutate through `alias`...\nConsole.WriteLine(original[0]);   // ...and `original` sees it too\n\n// Same story when you pass an array to a method: the method gets a\n// reference to YOUR array and can mutate it in place.\nvoid ZeroFirst(int[] data) => data[0] = 0;\nZeroFirst(original);\nConsole.WriteLine(original[0]);"
    },
    {
      "kind": "output",
      "output": "999\n0"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Why this matters in real code",
      "text": "Because passing an array hands a method a live reference to your data, a method can **silently mutate the caller's array**. A `SortInPlace(int[] data)` that calls `Array.Sort(data)` reorders the very array you passed in — there's no copy. That's sometimes exactly what you want and sometimes a nasty surprise. If a method must not change the caller's data, hand it a copy (`SortInPlace([..original])`) or accept a read-only view like `ReadOnlySpan<int>`. The lesson: in C#, \"I passed it to a function\" is not the same as \"it's safe from changes.\""
    },
    {
      "kind": "paragraph",
      "text": "If you need an **independent copy** rather than an alias, copy the contents explicitly — `int[] copy = [..original];` (a collection expression with the spread operator `..`), or `original.ToArray()`, or `Array.Copy`. The spread form is also the modern way to **merge** sequences, which is handy for building test data or combining results."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int[] a = [1, 2];\nint[] b = [3, 4, 5];\n\n// Spread (..) splices each array's elements into a new one.\nint[] all = [..a, 99, ..b];\nConsole.WriteLine(string.Join(\", \", all));"
    },
    {
      "kind": "output",
      "output": "1, 2, 99, 3, 4, 5"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Array  (T[])",
          "items": [
            "**Fixed length** — set once at creation, never changes",
            "No `Add` / `Remove`; \"growing\" = allocate a new array + copy",
            "Fastest indexed access, most compact memory layout",
            "Use when the size is **known and stable**, or in hot/perf-sensitive code",
            "Real-world: fixed lookup tables, byte buffers, game/Unity loops, interop"
          ]
        },
        {
          "title": "List<T>  (next lesson)",
          "items": [
            "**Growable** — `Add`, `Insert`, `Remove` all built in",
            "Backed by an array that auto-resizes when it fills up",
            "Slightly more overhead than a raw array; negligible for ~90% of code",
            "Use when the collection **grows or shrinks** — the everyday default",
            "Real-world: building up query results, request/response DTOs, in-memory lists"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Beyond 1-D (a quick signpost)",
      "text": "Arrays can have more than one dimension. A **rectangular** array `int[,] grid = new int[3, 3];` is a true 2-D grid (think a game board or matrix), and a **jagged** array `int[][] rows;` is an \"array of arrays\" where each row can have its own length. You'll meet these when you need them — for now, the 1-D array is the foundation, and everything you've learned here carries straight over."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "An **array** `T[]` is a **fixed-size, same-typed, zero-indexed** block of memory — the fastest, most primitive sequence in C#.",
        "`new int[n]` fills every slot with the type's **default** (`0`, `false`, `'\\0'`, or `null`) — never garbage. Create a filled array with a collection expression: `int[] x = [1, 2, 3];`. You can't assign `[...]` to `var` — it needs an explicit target type.",
        "Index with `[i]` (0-based) and get the count from the `Length` **property**. An out-of-range index throws **`IndexOutOfRangeException`** — it does not clamp or return null.",
        "Use **`foreach`** when you only need values, a **`for`** loop when you need the index or want to write back. Bound the loop with `< Length`, never a hard-coded number.",
        "**`^`** counts from the end (`^1` is last) and **`..`** slices (start inclusive, end exclusive). Slicing an array produces a **copy**.",
        "Array length is **frozen** at creation — there is no `Add`. `Array.Resize` secretly allocates a new array and copies. That limitation is exactly why **`List<T>`** exists.",
        "Arrays are **reference types**: assigning one array variable to another — or passing it to a method — aliases the same data, so changes are shared. Copy explicitly with `[..original]` or `.ToArray()` when you need independence."
      ]
    }
  ]
};
