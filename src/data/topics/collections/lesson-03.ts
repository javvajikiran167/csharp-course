import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  "slug": "list",
  "number": 3,
  "title": "List&lt;T&gt; — The Default Resizable Collection",
  "objective": "Use List&lt;T&gt; — the collection you reach for 90% of the time — including Add, Insert, Remove, indexing, capacity, and performance characteristics.",
  "blocks": [
    {
      "kind": "lead",
      "text": "In Python you reach for `list` without a second thought; in C#, the thing you reach for that often is **`List<T>`** — a growable, strongly-typed, indexable sequence that quietly powers nearly every business app, web API, and data pipeline you'll ever ship."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor everything on the Python comparison: students already know `list`, so the job is mapping that intuition onto a *typed*, *array-backed* container. Lead with 'this is your Python list, but it only holds one type and there's a hidden array underneath.'",
        "The single biggest aha-moment is **Count vs Capacity**. Spend real time on it — draw the doubling array on a whiteboard. It explains amortized O(1) Add, why pre-sizing matters, and shows up in interviews constantly.",
        "Reference-semantics (passing a List to a method mutates the caller's list) trips up beginners who think they passed a copy. The Python parallel is exact (Python lists are also passed by reference), so lean on that — it's reassuring, not new.",
        "Don't drown them in every method. Add / indexer / foreach / Remove vs RemoveAt / Contains / IndexOf is the core kit. AddRange, Insert, and capacity are the 'now you're fluent' tier.",
        "The 'modify-during-foreach throws' demo is worth running live — the exception message is memorable and the fix (RemoveAll / reverse for-loop / iterate a copy) is a reusable pattern.",
        "Watch for the decimal-scale gotcha in the discount demo: `100m * 0.90m` prints `90.00`, not `90.0`, because `decimal` tracks scale. Students often think their correct code is buggy. It's a great segue to 'use ToString(\"F2\")/\"C\" for money display'.",
        "Keep array-vs-List framed as 'when does List lose?' Arrays win on fixed size and hot paths; List wins everywhere else. Resist making it a false binary."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Your Python list, now with a type",
      "id": "python-list-now-typed"
    },
    {
      "kind": "paragraph",
      "text": "A Python `list` can hold anything: `[1, \"two\", 3.0, None]` is perfectly legal. C#'s `List<T>` makes a deliberate trade: it holds **exactly one type**, fixed when you declare it, checked by the compiler. The `<T>` is the type parameter — `List<int>`, `List<string>`, `List<Customer>`. Try to put the wrong type in and your code won't even build. That feels restrictive coming from Python, but it's the whole point: in a 200-file ASP.NET Core codebase, knowing a variable is *definitely* a list of `Order` and nothing else is what lets the compiler, your IDE, and the next developer catch mistakes before they reach production."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Three ways to create a List<int> — all equivalent results.\nList<int> scores = new();                 // empty, target-typed 'new()'\nList<int> primes = new List<int>();        // classic, explicit\nList<int> fib = [0, 1, 1, 2, 3, 5];        // collection expression (C# 12+)\n\n// A list of a custom type works exactly the same.\nList<string> roles = [\"admin\", \"editor\", \"viewer\"];\n\nConsole.WriteLine(fib.Count);              // 6  (Python: len(fib))\nConsole.WriteLine(roles[0]);               // admin (zero-indexed, like Python)\nConsole.WriteLine(roles[^1]);              // viewer (^1 = last item)",
      "filename": "Creating.cs"
    },
    {
      "kind": "output",
      "output": "6\nadmin\nviewer"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Prefer the modern initializers",
      "text": "`List<int> x = [];` and `List<int> x = [1, 2, 3];` (collection expressions) are the current idiomatic style on .NET 8 and later — cleaner than `new List<int>()`. Note they're **target-typed**: the compiler reads the type from the left-hand side, so `var x = [1, 2, 3];` does **not** compile (error `CS9176: There is no target type for the collection expression`). Write the type explicitly, or use `int[] x = [1, 2, 3];` / `List<int> x = [1, 2, 3];`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The core toolkit: Add, index, foreach",
      "id": "core-toolkit"
    },
    {
      "kind": "paragraph",
      "text": "`Add` appends one item to the end (Python's `.append()`). `AddRange` appends a whole sequence (Python's `.extend()`). You read and write items by their zero-based index with `[]`, and you iterate with `foreach`, which is the C# `for ... in`. These four operations cover the overwhelming majority of real list code."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "List<string> cart = [];\n\ncart.Add(\"Keyboard\");                       // append one\ncart.Add(\"Mouse\");\ncart.AddRange([\"Monitor\", \"USB-C Cable\"]);  // append several (Python: extend)\n\ncart[1] = \"Wireless Mouse\";                  // overwrite by index\n\nConsole.WriteLine($\"Items in cart: {cart.Count}\");\nforeach (string item in cart)               // Python: for item in cart\n{\n    Console.WriteLine($\"- {item}\");\n}\n\n// Need the index too? enumerate-style with a classic for loop:\nfor (int i = 0; i < cart.Count; i++)\n{\n    Console.WriteLine($\"{i}: {cart[i]}\");\n}",
      "filename": "CoreToolkit.cs"
    },
    {
      "kind": "output",
      "output": "Items in cart: 4\n- Keyboard\n- Wireless Mouse\n- Monitor\n- USB-C Cable\n0: Keyboard\n1: Wireless Mouse\n2: Monitor\n3: USB-C Cable"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The indexer throws — it does not clamp or return null",
      "text": "Reading `cart[10]` on a 4-item list throws `ArgumentOutOfRangeException`, just like Python raises `IndexError`. There's no silent `None`. Always check `index < list.Count` (or use a safe method like `FirstOrDefault`) when the index comes from user input or external data."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Inserting, removing, and searching",
      "id": "insert-remove-search"
    },
    {
      "kind": "paragraph",
      "text": "Beyond appending, you'll often place items at a position, take them out, or check whether something is present. The key distinction beginners miss: **`Remove(value)` removes by *value*** (the first matching item), while **`RemoveAt(index)` removes by *position***. `Contains` answers yes/no; `IndexOf` tells you *where* (and returns `-1` if absent, the same convention as Python's `str.find`)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "List<string> queue = [\"Alice\", \"Bob\", \"Carol\"];\n\nqueue.Insert(1, \"Dave\");          // -> Alice, Dave, Bob, Carol  (shifts the rest right)\n\nqueue.Remove(\"Bob\");              // remove by VALUE (first match) -> Alice, Dave, Carol\nqueue.RemoveAt(0);               // remove by INDEX -> Dave, Carol\n\nbool hasCarol = queue.Contains(\"Carol\");   // membership test, like 'in' in Python\nint pos = queue.IndexOf(\"Carol\");          // position, or -1 if not found\nint missing = queue.IndexOf(\"Zoe\");        // -1\n\nConsole.WriteLine(string.Join(\", \", queue));\nConsole.WriteLine($\"hasCarol={hasCarol}, pos={pos}, missing={missing}\");\n\n// Remove MANY by condition in one call (idiomatic, returns count removed):\nList<int> nums = [1, 2, 3, 4, 5, 6];\nint removed = nums.RemoveAll(n => n % 2 == 0);   // drop all evens\nConsole.WriteLine($\"removed {removed}: {string.Join(\", \", nums)}\");",
      "filename": "InsertRemoveSearch.cs"
    },
    {
      "kind": "output",
      "output": "Dave, Carol\nhasCarol=True, pos=1, missing=-1\nremoved 3: 1, 3, 5"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Never modify a list while you foreach over it",
      "text": "Calling `Add`/`Remove` inside a `foreach` over that same list throws `InvalidOperationException: Collection was modified; enumeration operation may not execute`. This is one of the most common beginner runtime errors. The fixes: use `list.RemoveAll(predicate)` (best for conditional removal), iterate a snapshot with `foreach (var x in list.ToList())`, or loop **backwards** with a `for` loop by index so removals don't shift items you haven't visited yet."
    },
    {
      "kind": "examples",
      "intro": "Three safe ways to delete-while-iterating — pick the one that reads best for the situation:",
      "examples": [
        {
          "label": "RemoveAll with a predicate (cleanest)",
          "code": "List<int> orders = [10, -5, 30, -1, 40];\norders.RemoveAll(amount => amount < 0);   // strip invalid amounts\nConsole.WriteLine(string.Join(\", \", orders));",
          "output": "10, 30, 40"
        },
        {
          "label": "Iterate a copy with ToList()",
          "code": "List<string> users = [\"ok1\", \"banned\", \"ok2\"];\nforeach (string u in users.ToList())      // snapshot — safe to mutate original\n{\n    if (u == \"banned\") users.Remove(u);\n}\nConsole.WriteLine(string.Join(\", \", users));",
          "output": "ok1, ok2"
        },
        {
          "label": "Reverse for-loop by index",
          "code": "List<int> data = [1, 2, 3, 4, 5];\nfor (int i = data.Count - 1; i >= 0; i--) // backwards: removals don't shift unseen items\n{\n    if (data[i] % 2 == 0) data.RemoveAt(i);\n}\nConsole.WriteLine(string.Join(\", \", data));",
          "output": "1, 3, 5"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Count vs Capacity: how a List grows",
      "id": "count-vs-capacity"
    },
    {
      "kind": "paragraph",
      "text": "Here's the secret under the hood, and it's the thing interviewers love to probe. A `List<T>` is **not** a magic stretchy thing — it's a plain fixed-size array with a counter. **`Count`** is how many items you've actually put in. **`Capacity`** is how big the internal array currently is. When you `Add` an item and `Count` would exceed `Capacity`, the list allocates a **new array roughly double the size**, copies everything over, and points at the new one. Most `Add`s are cheap O(1); the occasional resize is O(n), but because doublings happen rarely, the *average* cost stays O(1) — this is called **amortized O(1)**."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "List<int> list = [];\nint lastCapacity = -1;\n\nfor (int i = 0; i < 10; i++)\n{\n    list.Add(i);\n    if (list.Capacity != lastCapacity)\n    {\n        Console.WriteLine($\"After Add #{i + 1}: Count={list.Count}, Capacity={list.Capacity}\");\n        lastCapacity = list.Capacity;\n    }\n}",
      "filename": "Growth.cs"
    },
    {
      "kind": "output",
      "output": "After Add #1: Count=1, Capacity=4\nAfter Add #5: Count=5, Capacity=8\nAfter Add #9: Count=9, Capacity=16",
      "label": "Watch Capacity double: 4 -> 8 -> 16 as Count crosses each threshold"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Pre-size when you know roughly how many items you'll add",
      "text": "If you're about to load 10,000 rows from a database into a list, `new List<Row>(10_000)` allocates the backing array **once** instead of growing-and-copying it through ~12 doublings. In hot paths and large loops this is a real, measurable win. Pass the expected count to the constructor: `new List<T>(capacity)`. Note `Capacity` and `Count` are different — never use `Capacity` in your logic; it's an implementation detail."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Performance cheat-sheet: which operations cost what",
      "id": "big-o"
    },
    {
      "kind": "paragraph",
      "text": "Because a `List<T>` is an array underneath, its costs are predictable — and worth memorizing, because they explain *why* you sometimes reach for a `Dictionary` or `HashSet` instead. Indexing is instant. Appending is amortized-instant. But anything that shifts elements (insert/remove in the middle) or scans for a value (`Contains`/`IndexOf`) walks the array."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "O(1) — constant, cheap",
          "items": [
            "**`list[i]`** read or write — direct array access by index.",
            "**`Add(item)`** — append to the end (amortized O(1); the rare resize is O(n)).",
            "**`Count`** — it's just a stored field, not a count-up.",
            "**`RemoveAt(Count - 1)`** — removing the *last* item shifts nothing."
          ]
        },
        {
          "title": "O(n) — scans or shifts the array",
          "items": [
            "**`Contains` / `IndexOf` / `Remove(value)`** — linear search from the front.",
            "**`Insert(i, x)` / `RemoveAt(i)`** in the middle — shifts every later element.",
            "**`foreach` / `RemoveAll`** — touch every element once.",
            "If you do `Contains` in a hot loop, a **`HashSet<T>`** (O(1) lookup) is the right tool."
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When List beats an array (and when it doesn't)",
      "id": "list-vs-array"
    },
    {
      "kind": "paragraph",
      "text": "A C# array (`int[]`) is a **fixed-size** block of memory — its length is set at creation and can never change. There is no `Add`, no `Insert`, no `Remove`; to 'grow' an array you must allocate a new one (which is exactly what `List<T>` does for you internally). Coming from Python this surprises people: a C# array is *not* a Python list. So when do you pick which?"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Reach for List<T> (the 90% case)",
          "items": [
            "You don't know the final size up front — building up results, reading rows, collecting user input.",
            "You need to Add / Insert / Remove items over time.",
            "It's normal business/web/app code where clarity beats micro-optimization.",
            "You'll hand it to LINQ, model binding, or a service method.",
            "Default answer: if unsure, use `List<T>`."
          ]
        },
        {
          "title": "Reach for an array T[] (the niche)",
          "items": [
            "The size is fixed and known (a chess board `Cell[64]`, RGBA pixel buffer, week of 7 days).",
            "A hot path / tight loop where you want zero growth overhead and best cache locality.",
            "Low-level/interop, serialization buffers, or game/Unity inner loops (often with `Span<T>`).",
            "You explicitly want callers to be unable to add/remove items.",
            "You profiled and proved `List<T>` was the bottleneck."
          ]
        }
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Array: fixed size, no Add. Trying to grow it is a compile-time impossibility.\nint[] week = new int[7];     // exactly 7 slots, all 0\nweek[0] = 42;\n// week.Add(99);             // does not compile — arrays have no Add\n\n// To 'append' to an array you allocate a new one — exactly what List does for you:\nArray.Resize(ref week, 8);   // creates a NEW 8-element array under the hood\nweek[7] = 99;\n\nConsole.WriteLine($\"Length={week.Length}, last={week[7]}\");\n\n// Conversions are easy and common at boundaries:\nList<int> dynamic = [.. week];   // array -> List (spread)\nint[] back = dynamic.ToArray();  // List -> array\nConsole.WriteLine($\"List count={dynamic.Count}, array len={back.Length}\");",
      "filename": "ArrayVsList.cs"
    },
    {
      "kind": "output",
      "output": "Length=8, last=99\nList count=8, array len=8"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Lists are passed by reference",
      "id": "pass-by-reference"
    },
    {
      "kind": "paragraph",
      "text": "When you pass a `List<T>` to a method, you pass a **reference** to the same list — not a copy. The method's parameter and your variable point at the *same* object, so any `Add`/`Remove`/`item[i] = ...` the method does is visible to the caller afterward. This is identical to Python, where passing a list to a function and calling `.append()` mutates the original. It's powerful but a classic source of surprise bugs: a helper you thought was 'just reading' the list quietly mutates it."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "void ApplyDiscount(List<decimal> prices, decimal pct)\n{\n    for (int i = 0; i < prices.Count; i++)\n        prices[i] *= (1 - pct);     // mutates the CALLER's list — same object\n}\n\nList<decimal> cart = [100m, 50m, 25m];\nApplyDiscount(cart, 0.10m);          // 10% off\nConsole.WriteLine(string.Join(\", \", cart));   // caller sees the change\n\n// Best practice: if a method only READS, declare the weakest interface that works.\n// IReadOnlyList<T> documents intent AND blocks accidental mutation at compile time.\ndecimal Total(IReadOnlyList<decimal> items)\n{\n    decimal sum = 0m;\n    foreach (decimal x in items) sum += x;   // can read & index, but no Add/Remove\n    return sum;\n}\nConsole.WriteLine(Total(cart));",
      "filename": "PassByReference.cs"
    },
    {
      "kind": "output",
      "output": "90.00, 45.00, 22.50\n157.50"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Why does it print 90.00, not 90.0?",
      "text": "`decimal` is built for money, and it **tracks scale** (the number of digits after the point). Here `1 - 0.10m` is `0.90m` (two decimal places), so `100m * 0.90m` is `90.00` — the scales add up. That's not a bug; it's `decimal` faithfully preserving precision (very different from `double`, which would give `90`). When you *display* money, don't rely on the default `ToString()` — format it explicitly with `value.ToString(\"C\")` (currency, e.g. `$90.00`) or `value.ToString(\"F2\")` (fixed 2 decimals)."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Accept the weakest type; return a protected one",
      "text": "In real APIs, take **`IEnumerable<T>`** (just iterating) or **`IReadOnlyList<T>`** (iterating + indexing) as parameters — this lets callers pass arrays, lists, or LINQ queries interchangeably, and signals you won't mutate their data. When *returning* internal state, return `IReadOnlyList<T>` (or a copy) so callers can't reach in and corrupt your object's private list. Returning a live, mutable `List<T>` from a property is a leak of internal state and a frequent code-review rejection."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Real-world flavor",
      "text": "`List<T>` is the default container almost everywhere in professional .NET: an ASP.NET Core endpoint binds a JSON array into a `List<OrderItem>`; a repository materializes an EF Core query with `await query.ToListAsync()`; a background job collects results into a list before saving; a game loads its current wave of enemies into one. When you graduate to *looking things up by key*, you'll switch to `Dictionary<TKey, TValue>`; for *uniqueness/membership*, `HashSet<T>` — both coming up next. But `List<T>` remains the one you'll type the most."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**`List<T>` is your Python `list`, but homogeneous and type-checked** — it holds exactly one element type, enforced by the compiler.",
        "Create it with `[]` / `[1, 2, 3]` (collection expressions) or `new()`. Collection expressions are **target-typed**, so `var x = [1, 2, 3];` won't compile (`CS9176`) — give it an explicit type.",
        "Core kit: **`Add`** (append), **`AddRange`** (extend), **`[i]`** indexing, **`foreach`** to iterate. The indexer **throws** out of range — it never returns null.",
        "**`Remove(value)`** deletes by value; **`RemoveAt(index)`** deletes by position; **`Contains`** tests membership; **`IndexOf`** returns the position or **`-1`**.",
        "Never mutate a list during a `foreach` over it (throws `InvalidOperationException`). Use **`RemoveAll(predicate)`**, iterate a `ToList()` copy, or loop backwards by index.",
        "**`Count`** (items you added) is not **`Capacity`** (size of the hidden backing array). The array doubles when full, giving **amortized O(1)** `Add`. **Pre-size** with `new List<T>(capacity)` when the count is known.",
        "Performance: **indexing and end-`Add` are O(1)**; **`Insert`/`Remove` in the middle and `Contains`/`IndexOf` are O(n)**. Repeated membership checks belong in a `HashSet<T>`.",
        "Use an **array** only for fixed-size data or profiled hot paths; otherwise default to **`List<T>`**.",
        "Lists are **passed by reference** — methods can mutate the caller's list. Accept **`IEnumerable<T>`/`IReadOnlyList<T>`** in parameters and avoid handing out your live internal list.",
        "`decimal` preserves **scale**: `100m * 0.90m` prints `90.00`, not `90.0`. Format money for display with `\"C\"` or `\"F2\"` rather than trusting the default `ToString()`."
      ]
    }
  ]
};
