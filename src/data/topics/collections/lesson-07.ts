import type { Lesson } from '@/data/types';

export const lesson07: Lesson = {
  "slug": "iterating",
  "number": 7,
  "title": "Iterating, Sorting, and Filtering",
  "objective": "Iterate, sort, and filter collections with built-in helpers (foreach, Sort, comparators, FindAll), and preview how LINQ will generalize this later.",
  "blocks": [
    {
      "kind": "lead",
      "text": "You have a `List<T>` full of orders, scores, or log lines. Now what? In real work you do three things with a collection over and over: **walk through it**, **put it in order**, and **pull out the items you care about**. C# gives you sharp, built-in tools for all three before you ever reach for LINQ — and learning them first makes LINQ feel like the natural next step instead of magic."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Audience is Python devs. Anchor `foreach` to Python's `for x in xs:` — it's the same idea, but emphasize C#'s static element type and the **collection-modified** exception, which Python does NOT throw the same way.",
        "Sequence the lesson as: iterate -> the modification pitfall (this is the emotional hook, demo the crash live) -> sort (Sort, Comparison<T>, reverse, multi-key) -> search (Find/FindAll/Exists family) -> LINQ teaser. Each builds on the last.",
        "Live-demo the InvalidOperationException by deleting in a foreach. Beginners remember crashes. Then show RemoveAll as the fix and feel the relief.",
        "Avoid `:C` currency formatting in any output you promise — it's culture-dependent and will print the wrong symbol on a student's machine. All outputs here use plain numbers / string.Join, which are deterministic. The `decimal` literals print with their trailing zeros preserved (e.g. `540.00`), which is itself a nice teaching aside about decimal vs double.",
        "Stress that List.Sort sorts IN PLACE and returns void — a classic beginner trap (`var sorted = list.Sort();` is a compile error). Contrast with LINQ's OrderBy which returns a new sequence.",
        "Don't over-teach Comparer<T> / IComparer<T> here; the lambda Comparison<T> form covers 95% of cases and keeps cognitive load low. Mention IComparer exists, move on.",
        "The LINQ teaser reuses the `staff` list from the multi-key sort example — if you run it as a standalone file, re-declare `staff` first. The inline comment flags this so nobody is mystified by an 'undefined name'.",
        "End by explicitly naming the next lesson topic (LINQ) so the teaser lands as a promise, not a tangent."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "foreach: the workhorse loop",
      "id": "foreach"
    },
    {
      "kind": "paragraph",
      "text": "`foreach` is C#'s version of Python's `for item in items:`. It asks a collection for an iterator and walks every element, one at a time, in order. You name the element and give it a type (or use `var`), and the loop hands you each value. There's no index to manage and no off-by-one risk — which is exactly why it's the **default** way to iterate in C#. Reach for a classic `for (int i = 0; ...)` loop only when you genuinely need the index."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Iterating.cs",
      "code": "List<string> tickets = [\"#102 login bug\", \"#114 export crash\", \"#119 typo\"];\n\nforeach (string t in tickets)\n    Console.WriteLine($\"Reviewing {t}\");\n\nConsole.WriteLine(\"---\");\n\n// Need the index too? .Index() pairs each item with its position (.NET 9+).\nforeach ((int i, string t) in tickets.Index())\n    Console.WriteLine($\"{i}: {t}\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Reviewing #102 login bug\nReviewing #114 export crash\nReviewing #119 typo\n---\n0: #102 login bug\n1: #114 export crash\n2: #119 typo"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python: for ... in",
          "items": [
            "`for t in tickets:` — element type is dynamic.",
            "`for i, t in enumerate(tickets):` for index + value.",
            "Removing from a list while looping silently skips or misbehaves; no hard error.",
            "Iterates anything iterable (lists, dicts, generators) uniformly."
          ]
        },
        {
          "title": "C#: foreach (T x in xs)",
          "items": [
            "`foreach (string t in tickets)` — element type is checked at compile time.",
            "`foreach ((int i, string t) in tickets.Index())` for index + value.",
            "Modifying the collection mid-loop throws `InvalidOperationException` immediately.",
            "Iterates anything that is `IEnumerable<T>` (List, array, HashSet, Dictionary, LINQ queries)."
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "One detail worth knowing: `foreach` works on **any** type that implements `IEnumerable<T>` — arrays, `List<T>`, `HashSet<T>`, dictionaries, and even lazy LINQ queries. The loop variable is **read-only**: you can read each element and call methods on it, but you can't reassign it (`t = \"x\";` inside the loop won't compile). That immutability is a feature — it's the first hint of the rule we're about to hit head-on."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The trap: don't change a collection while you iterate it",
      "id": "modification-pitfall"
    },
    {
      "kind": "paragraph",
      "text": "Here's the bug that bites nearly every C# beginner exactly once. You're looping over a list and decide to remove items as you go — say, dropping every even number. In Python this quietly produces wrong results. In C#, the runtime notices the collection changed underneath the iterator and **throws** rather than hand you corrupted data."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Pitfall.cs",
      "code": "List<int> nums = [1, 2, 3, 4, 5, 6];\n\nforeach (int n in nums)\n{\n    if (n % 2 == 0)\n        nums.Remove(n);   // mutating the list we're walking -> boom\n}"
    },
    {
      "kind": "output",
      "label": "Runtime exception",
      "output": "Unhandled exception. System.InvalidOperationException: Collection was modified; enumeration operation may not execute."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: \"It worked in Python!\"",
      "text": "Python lets you mutate-while-iterating and just gives you subtly wrong results (it skips elements as indices shift). C# refuses outright with **`Collection was modified; enumeration operation may not execute.`** This is C# protecting you from a silent data bug — treat the exception as a friend, not an obstacle. The cause: `foreach` holds an iterator that records a version stamp of the list, and any structural change (`Add`/`Remove`/`Insert`/`Clear`) bumps that stamp and invalidates the iterator. Note that just **reassigning** an element by index (`nums[0] = 9`) does NOT count as a structural change and is allowed — it's only adding/removing that trips the wire."
    },
    {
      "kind": "paragraph",
      "text": "There are three clean fixes, in rough order of preference. Use the purpose-built method when there is one, and only fall back to manual loops when your removal logic is too complex to express as a single predicate."
    },
    {
      "kind": "examples",
      "intro": "Three correct ways to remove items while \"iterating\":",
      "examples": [
        {
          "label": "Best: RemoveAll with a predicate (one line, no loop)",
          "code": "List<int> a = [1, 2, 3, 4, 5, 6];\na.RemoveAll(n => n % 2 == 0);\nConsole.WriteLine(string.Join(\", \", a));",
          "output": "1, 3, 5"
        },
        {
          "label": "Iterate a snapshot copy, mutate the original",
          "code": "List<int> a = [1, 2, 3, 4, 5, 6];\nforeach (int n in a.ToList())   // ToList() makes an independent copy\n    if (n % 2 == 0) a.Remove(n);\nConsole.WriteLine(string.Join(\", \", a));",
          "output": "1, 3, 5"
        },
        {
          "label": "Loop by index, backwards (so removals don't shift unseen items)",
          "code": "List<int> a = [1, 2, 3, 4, 5, 6];\nfor (int i = a.Count - 1; i >= 0; i--)\n    if (a[i] % 2 == 0) a.RemoveAt(i);\nConsole.WriteLine(string.Join(\", \", a));",
          "output": "1, 3, 5"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice",
      "text": "When you want to **filter a list down in place**, prefer `list.RemoveAll(predicate)` — it's clearer, faster (a single pass), and impossible to get wrong. It also returns the **count of items removed**, which is handy for logging. Save the backwards `for`-loop for cases where each item's removal depends on more than a simple predicate (per-item logging, side effects, conditional ordering)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Sorting in place with List.Sort",
      "id": "sorting"
    },
    {
      "kind": "paragraph",
      "text": "`List<T>.Sort()` orders the list **in place** — it rearranges the existing list and returns `void`. That last part trips people up: `var sorted = scores.Sort();` is a compile error, because `Sort` doesn't hand back a new list. For types that already have a natural order (numbers, strings, dates), calling `Sort()` with no arguments just works. To go descending, sort then `Reverse()`, or pass a comparison that flips the result."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Sorting.cs",
      "code": "List<int> scores = [82, 95, 67, 88, 73];\n\nscores.Sort();                       // ascending, in place\nConsole.WriteLine(string.Join(\", \", scores));\n\nscores.Sort((a, b) => b.CompareTo(a)); // descending via a comparison lambda\nConsole.WriteLine(string.Join(\", \", scores));\n\nscores.Sort();\nscores.Reverse();                    // or: sort ascending, then flip\nConsole.WriteLine(string.Join(\", \", scores));"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "67, 73, 82, 88, 95\n95, 88, 82, 73, 67\n95, 88, 82, 73, 67"
    },
    {
      "kind": "paragraph",
      "text": "The overload doing the heavy lifting is `Sort(Comparison<T>)`. A `Comparison<T>` is just a function that takes two elements and returns an `int`: **negative** if the first should come before the second, **zero** if they're equal in rank, and **positive** if the first should come after. You almost never write that logic by hand — you call `.CompareTo` on a field and let the framework's existing ordering do the work. The direction of the comparison is what controls ascending vs. descending: `a.CompareTo(b)` is ascending, `b.CompareTo(a)` is descending."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CustomSort.cs",
      "code": "List<string> names = [\"Mira\", \"Ana\", \"Christopher\", \"Bo\"];\n\n// Sort by length (shortest first), not alphabetically.\nnames.Sort((a, b) => a.Length.CompareTo(b.Length));\nConsole.WriteLine(string.Join(\", \", names));"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Bo, Ana, Mira, Christopher"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Multi-key sorting: the real-world pattern",
      "id": "multi-key-sort"
    },
    {
      "kind": "paragraph",
      "text": "Business data is rarely sorted by one field. \"Group employees by department, then within each department put the highest paid first, and break ties alphabetically by name\" is a completely ordinary request. You express it by chaining comparisons: compare the primary key, and **only if it ties** (result is `0`) fall through to the next key. This is exactly the logic an order-management screen or a leaderboard runs."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "MultiKeySort.cs",
      "code": "record Employee(string Name, string Dept, int Salary);\n\nList<Employee> staff =\n[\n    new(\"Priya\", \"Eng\",   120),\n    new(\"Sam\",   \"Eng\",   120),\n    new(\"Lee\",   \"Sales\", 90),\n    new(\"Ada\",   \"Eng\",   150),\n];\n\n// Dept ascending, then Salary descending, then Name ascending.\nstaff.Sort((x, y) =>\n{\n    int byDept = string.Compare(x.Dept, y.Dept, StringComparison.Ordinal);\n    if (byDept != 0) return byDept;\n\n    int bySalary = y.Salary.CompareTo(x.Salary); // y vs x => descending\n    if (bySalary != 0) return bySalary;\n\n    return string.Compare(x.Name, y.Name, StringComparison.Ordinal);\n});\n\nforeach (var e in staff)\n    Console.WriteLine($\"{e.Dept,-6} {e.Salary} {e.Name}\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Eng    150 Ada\nEng    120 Priya\nEng    120 Sam\nSales  90 Lee"
    },
    {
      "kind": "paragraph",
      "text": "Two things to notice in that comparison. First, `{e.Dept,-6}` is an **alignment** format spec — the `-6` left-pads the field to 6 characters wide, which is why the salaries line up in neat columns (the same `str.ljust(6)` you'd reach for in Python). Second, we used `StringComparison.Ordinal` rather than the default culture-aware compare. For sorting internal identifiers like department codes you almost always want **ordinal** (a fast, stable, byte-value comparison) — culture-aware sorting can reorder things differently on different machines, which is a real source of \"works on my laptop, fails in CI\" bugs."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Sort is in place and not stable",
      "text": "`List<T>.Sort` mutates the list and uses an **unstable** algorithm (introsort) — equal elements may not keep their original relative order. If stability matters, encode every tie-breaker in your comparison (as above), or use LINQ's `OrderBy`/`ThenBy`, which **are** stable and return a new sequence instead of mutating. There's also a `Sort(IComparer<T>)` overload for when you want a reusable, named comparer object instead of an inline lambda."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Filtering and searching: Find, FindAll, Exists",
      "id": "searching"
    },
    {
      "kind": "paragraph",
      "text": "`List<T>` ships with a small family of search methods that take a **predicate** — a `Func<T, bool>` lambda that returns `true` for matching items. They're the imperative ancestors of the LINQ operators you'll meet next lesson, and they read beautifully. Here's the cheat sheet, then a single example using all of them on a list of orders."
    },
    {
      "kind": "list",
      "items": [
        "**`Find(predicate)`** — returns the **first** matching element (or `default`, e.g. `null` for reference types, if none match). LINQ equivalent: `FirstOrDefault`.",
        "**`FindAll(predicate)`** — returns a **new `List<T>`** of every match (an **empty** list, never `null`, when nothing matches). This is filtering. LINQ equivalent: `Where(...).ToList()`.",
        "**`Exists(predicate)`** — returns `true` if **any** element matches; great for cheap membership checks. LINQ equivalent: `Any`.",
        "**`FindIndex(predicate)`** — returns the **position** of the first match, or `-1`. Also `FindLast` / `FindLastIndex` for searching from the end.",
        "**`TrueForAll(predicate)`** — returns `true` only if **every** element matches. LINQ equivalent: `All`."
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Searching.cs",
      "code": "record Order(int Id, string Customer, decimal Total, bool Shipped);\n\nList<Order> orders =\n[\n    new(101, \"Acme\",     250.00m, true),\n    new(102, \"Globex\",    80.00m, false),\n    new(103, \"Initech\",  540.00m, false),\n    new(104, \"Umbrella\", 120.00m, true),\n];\n\n// Filter: every unshipped order over 100.\nList<Order> bigUnshipped = orders.FindAll(o => !o.Shipped && o.Total > 100m);\nforeach (Order o in bigUnshipped)\n    Console.WriteLine($\"{o.Id} {o.Customer} {o.Total}\");\n\nConsole.WriteLine(\"---\");\n\n// First match, or null.\nOrder? first = orders.Find(o => o.Total > 500m);\nConsole.WriteLine(first is null ? \"none\" : $\"First big: {first.Customer}\");\n\n// Any match? Cheap boolean check.\nConsole.WriteLine($\"Any unshipped? {orders.Exists(o => !o.Shipped)}\");\n\n// Where is it?\nConsole.WriteLine($\"Index of Initech: {orders.FindIndex(o => o.Customer == \"Initech\")}\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "103 Initech 540.00\n---\nFirst big: Initech\nAny unshipped? True\nIndex of Initech: 2"
    },
    {
      "kind": "paragraph",
      "text": "A small but worthwhile aside about that `540.00`: because `Total` is a `decimal` literal written `540.00m`, it prints **with** its trailing zeros — `decimal` remembers scale, unlike `double`, which would show `540`. That faithful money formatting is exactly why `decimal` is the right type for currency in real systems."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Find returns default, not an exception",
      "text": "When nothing matches, `Find` returns `default(T)` — that's `null` for classes/records and `0`/`false`/`'\\0'` for value types. So always handle the no-match case (`if (first is null)`), or you'll hit a `NullReferenceException` later. Watch the value-type gotcha: `numbers.Find(n => n > 100)` returns `0` when nothing matches, which is indistinguishable from genuinely finding a `0` — prefer `FindIndex` (which returns `-1`) for value types. This whole pattern mirrors Python's `next(filter(...), None)` (safe default) versus `next(filter(...))` (raises `StopIteration`)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Where this is all heading: LINQ",
      "id": "linq-teaser"
    },
    {
      "kind": "paragraph",
      "text": "Notice the pattern. `FindAll` filters, `Sort` orders, and we've been pulling out single fields by hand. **LINQ** — Language INtegrated Query, the topic of an upcoming lesson — unifies every one of these into a single, composable, chainable vocabulary that works on **any** `IEnumerable<T>`: lists, arrays, dictionaries, database queries, even data you're streaming over the network. The same answer (\"the highest-paid engineer's name\") that took a custom comparator and a loop becomes a readable pipeline."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "LinqTeaser.cs",
      "code": "// `staff` is the same List<Employee> from the multi-key sort example above.\n// A taste of next lesson: filter -> sort -> project -> take first, all chained.\nstring topEng = staff\n    .Where(e => e.Dept == \"Eng\")           // FindAll, but lazy\n    .OrderByDescending(e => e.Salary)      // Sort, but returns a new sequence\n    .Select(e => e.Name)                   // project: keep just the name\n    .First();                              // Find, but throws if empty\n\nConsole.WriteLine($\"Top engineer: {topEng}\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Top engineer: Ada"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "When to use which",
      "text": "Reach for the built-in `List<T>` methods (`Sort`, `FindAll`, `Exists`) when you want to **mutate a concrete list in place** or you're on a hot path and want zero allocation/ceremony. Reach for **LINQ** when you want to **transform data into something new** without changing the original, chain several steps, or work against an interface like `IEnumerable<T>` / `IQueryable<T>` (the latter is what lets Entity Framework translate your query into SQL). Most production C# leans heavily on LINQ for readability — but knowing the imperative tools underneath makes you far faster at debugging it when a query behaves oddly."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`foreach (T x in xs)` is the default loop — read-only element, works on any `IEnumerable<T>`; use `.Index()` (.NET 9+) when you need the position too.",
        "**Never** `Add`/`Remove`/`Clear` on a collection while a `foreach` is walking it — C# throws `InvalidOperationException: Collection was modified`. Fix with `RemoveAll(predicate)`, iterate a `.ToList()` copy, or loop by index backwards. (Reassigning an element by index is fine — only structural changes throw.)",
        "`List<T>.Sort()` orders **in place** and returns `void` (so `var x = list.Sort();` won't compile). Pass a `Comparison<T>` lambda for custom order; use `a.CompareTo(b)` for ascending, `b.CompareTo(a)` for descending.",
        "Express multi-key sorts by comparing the primary key and falling through to the next key only on a tie (result `0`). `List.Sort` is unstable (introsort); LINQ `OrderBy`/`ThenBy` is stable. Use `StringComparison.Ordinal` for internal codes to stay deterministic across machines.",
        "`Find` (first match, or default), `FindAll` (all matches as a new — possibly empty — list), `Exists` (any match), `FindIndex` (position) take a predicate lambda — and return `default`/`empty`/`false`/`-1` on no match rather than throwing. Prefer `FindIndex` over `Find` for value types to avoid the `default == 0` ambiguity.",
        "These built-ins are the imperative ancestors of LINQ. Next lesson, `Where` / `OrderBy` / `Select` generalize filtering, sorting, and projection into one composable pipeline over any sequence."
      ]
    }
  ]
};
