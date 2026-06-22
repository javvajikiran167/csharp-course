import type { Lesson } from '@/data/types';

export const lesson07: Lesson = {
  "slug": "deferred-execution",
  "number": 7,
  "title": "Deferred Execution & ToList()",
  "objective": "Understand LINQ's lazy evaluation — the biggest LINQ gotcha — and when to force execution with ToList/ToArray.",
  "blocks": [
    {
      "kind": "lead",
      "text": "When you write a LINQ query, **nothing happens yet**. You haven't fetched, filtered, or computed a single thing — you've written down a *recipe*. The work only happens when someone actually asks for the results. Misunderstanding this one fact is responsible for more LINQ bugs than everything else combined."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open with the recipe metaphor and *physically* demonstrate it: declare a query, mutate the source, THEN enumerate, and watch the audience be surprised by the output. The surprise is the lesson.",
        "Drill the mental model before any API: `Where`/`Select`/`OrderBy` build an object; `foreach`/`ToList`/`Count`/`First` run it. Get students to sort every LINQ method into 'lazy' vs 'eager' out loud.",
        "The capture-by-reference gotcha (variable modified after the query is defined, and the loop-variable version) is the single highest-value demo. Make them predict the output before you run it.",
        "Be precise about *what* runs how many times. In the multiple-enumeration demo the projection lambda runs 7 times (3 + 3 + 1) because the query is enumerated three times. In the fixed version it runs 3 times — once per element in a *single* pass — NOT once. The teaching contrast is '3 (one pass) vs 7 (three passes)', not '1 vs 7'. Getting this wrong is the most common mistake people make explaining this topic.",
        "Connect to their day jobs: deferred execution is WHY EF Core can turn a C# query into one SQL statement, and ALSO why naive code accidentally runs the query (or the SQL) twice. Tease IQueryable here; full treatment is next lesson.",
        "Keep the fix simple and repeatable: 'materialize once at the boundary with ToList()/ToArray() when you need a stable snapshot or will iterate more than once.' Say it three times.",
        "Python bridge: generators (`yield`)/`map`/`filter` are lazy too and re-run if you iterate a fresh generator — but a Python list comprehension is eager. LINQ method syntax behaves like the generator side by default."
      ]
    },
    {
      "kind": "paragraph",
      "text": "Coming from Python, you've already met laziness — you just may not have named it. A list comprehension `[n*2 for n in nums if n > 2]` runs **immediately** and hands you a finished list. But `map`, `filter`, and any `yield`-based generator are **lazy**: they describe work that only happens as you iterate, and a generator is exhausted after one pass. LINQ's fluent methods behave like that lazy side by default — and unlike a one-shot generator, a LINQ query object is *re-runnable*, which is both a superpower and a trap."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The query is a recipe, not the result",
      "id": "recipe-not-result"
    },
    {
      "kind": "paragraph",
      "text": "Operators like `Where`, `Select`, `OrderBy`, `Take`, and `Skip` are **deferred**: each one returns a small query object that *remembers what to do* and points back at its source. Building the chain costs almost nothing and touches zero elements. The lambdas you passed in don't run until something **enumerates** the query — a `foreach` loop, or a method that walks it like `ToList()`, `Count()`, or `First()`. Watch the order things actually happen:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "int[] numbers = [1, 2, 3, 4, 5];\n\n// Building the query runs NO lambdas. It just records the recipe.\nvar query = numbers.Where(n =>\n{\n    Console.WriteLine($\"  checking {n}\");\n    return n % 2 == 0;\n});\n\nConsole.WriteLine(\"Query defined. Nothing has run yet.\");\nConsole.WriteLine(\"Now enumerating with foreach:\");\n\nforeach (var n in query)\n    Console.WriteLine($\"got {n}\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Query defined. Nothing has run yet.\nNow enumerating with foreach:\n  checking 1\n  checking 2\ngot 2\n  checking 3\n  checking 4\ngot 4\n  checking 5"
    },
    {
      "kind": "paragraph",
      "text": "Two things to notice. First, `\"Query defined\"` prints **before** any `checking` line — proof the filter lambda didn't run when we wrote the query. Second, the work is **interleaved**: element 2 is checked and *immediately* yielded before element 3 is ever looked at. LINQ pulls one element through the whole pipeline at a time. That streaming behavior is what lets you run a query over a multi-gigabyte file or an infinite sequence without loading it all into memory."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Iterate twice, run the query twice",
      "id": "iterate-twice"
    },
    {
      "kind": "paragraph",
      "text": "Because the query is just a recipe, **every** time you enumerate it, the whole recipe runs again from scratch. This is the part that bites people in production: a query that hits a database or reads a file will do that work *once per enumeration*. Here a side-effecting `Select` increments a counter so the re-execution is visible."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "var source = new List<int> { 10, 20, 30 };\n\nint timesRun = 0;\nvar query = source.Select(x =>\n{\n    timesRun++;\n    return x + 1;\n});\n\nvar count = query.Count();      // enumeration #1 — walks all 3\nvar list  = query.ToList();     // enumeration #2 — walks all 3 again\nvar first = query.First();      // enumeration #3 — walks until it has 1\n\nConsole.WriteLine($\"Count={count}, First={first}, list has {list.Count}\");\nConsole.WriteLine($\"Projection lambda ran {timesRun} times\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Count=3, First=11, list has 3\nProjection lambda ran 7 times"
    },
    {
      "kind": "paragraph",
      "text": "Three elements, but the projection ran **seven** times: 3 for `Count()`, 3 for `ToList()`, and 1 for `First()` (which stops as soon as it has an element) — that's 3 + 3 + 1 = 7. Now imagine that lambda is a database round-trip or an HTTP call instead of `x + 1`. Calling `.Count()` and then iterating the same query silently **doubles your database load** — and your tooling will flag it. ReSharper and the Roslyn analyzers literally warn **\"Possible multiple enumeration of IEnumerable\"** when they see it."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The modified-after gotcha (capture by reference)",
      "text": "A deferred query closes over the **variables** it uses, not the **values** they had when you wrote it. So if you change those variables *after* defining the query but *before* enumerating it, the query uses the new values. This surprises everyone exactly once."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "int[] nums = [1, 2, 3, 4, 5, 6];\n\nint threshold = 2;\nvar bigger = nums.Where(n => n > threshold);  // recipe captures `threshold`, not the value 2\n\nthreshold = 4;                                // changed BEFORE we enumerate\n\nConsole.WriteLine(string.Join(\", \", bigger)); // uses threshold == 4, not 2"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "5, 6"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Same trap inside a loop",
      "text": "The classic version: build several queries inside a `for` loop that all close over the loop variable, store them in a list, then enumerate them *after* the loop ends — and every query sees the loop variable's final value. The fix is the same as below: force execution **inside** the loop (e.g. `ToList()` each iteration), or copy the value into a fresh local before capturing it. (Note: `foreach` loop variables get a fresh copy per iteration in modern C#, but a `for` counter does not.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Forcing execution: ToList, ToArray, Count and friends",
      "id": "forcing-execution"
    },
    {
      "kind": "paragraph",
      "text": "To turn a recipe into a finished, stable result, you **materialize** it — you run the query once and capture the output into a real collection in memory. The materializing operators are the *eager* ones: they have to walk the whole sequence to do their job, so they execute immediately and return concrete data instead of another query."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Deferred (lazy) — build the recipe",
          "items": [
            "`Where`, `Select`, `SelectMany`, `OfType`",
            "`OrderBy` / `ThenBy`, `Take`, `Skip`, `Distinct`",
            "`GroupBy`, `Join`, `Reverse`, `Concat`",
            "Return another query; run nothing until enumerated",
            "Re-run on every enumeration"
          ]
        },
        {
          "title": "Eager — run it now, return data",
          "items": [
            "`ToList`, `ToArray`, `ToDictionary`, `ToHashSet`",
            "`Count`, `Sum`, `Average`, `Min`/`Max`",
            "`First`/`FirstOrDefault`, `Single`, `Last`, `Any`/`All`",
            "`foreach` (the loop itself enumerates)",
            "Walk the source once, hand back a finished value"
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "Calling `ToList()` (or `ToArray()`) at the right moment fixes both problems above in one move. You snapshot the results *now*, so later mutations can't change them and re-iterating won't re-run the source. Here is the same multiple-enumeration scenario, fixed — watch the counter drop from 7 to 3:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "var source = new List<int> { 10, 20, 30 };\n\nint timesRun = 0;\nList<int> results = source\n    .Select(x => { timesRun++; return x + 1; })\n    .ToList();                  // the query executes ONCE, here\n\nvar count = results.Count;      // List<T>.Count — a property, no re-run\nvar first = results[0];         // indexing a list, no re-run\n\nConsole.WriteLine($\"Count={count}, First={first}\");\nConsole.WriteLine($\"Projection lambda ran {timesRun} times (once per element, in a single pass)\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Count=3, First=11\nProjection lambda ran 3 times (once per element, in a single pass)"
    },
    {
      "kind": "paragraph",
      "text": "Read that carefully: the lambda still runs **3 times** — once for each of the three elements — because `ToList()` has to project every element to build the list. The win isn't fewer-than-three; it's that we made **one** pass instead of three. Before, the same lambda ran 7 times across three separate enumerations; now it runs 3 times in a single pass, and every later `results.Count` and `results[0]` reads the finished list for free. That's the whole point of materializing: do the expensive walk **once**, then reuse the result as ordinary data."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Don't confuse Count() the method with Count the property",
      "text": "`Enumerable.Count()` (the LINQ **method**) enumerates the sequence to count it — that's a full re-run on a deferred query. But once you've materialized to a `List<T>` or array, `.Count` (the **property**) and `.Length` are instant O(1) reads. After `ToList()`, prefer the property."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Streaming vs buffering operators",
      "id": "streaming-vs-buffering"
    },
    {
      "kind": "paragraph",
      "text": "Not all deferred operators are equally lazy. **Streaming** operators (`Where`, `Select`, `Take`, `SelectMany`) can yield each result as soon as they compute it — they hold at most one element at a time. **Buffering** operators have to consume the *entire* input before they can yield even their first result. `OrderBy` is the classic example: it can't know which element comes first until it has seen them all, so it pulls everything into memory and sorts. `Reverse`, `GroupBy`, and `Distinct` buffer too (`Distinct` keeps a running set of what it has seen). This has a practical payoff: filter *before* you sort so you don't pay to sort rows you're about to throw away."
    },
    {
      "kind": "examples",
      "intro": "Two real-world consequences of streaming, both impossible with an eager language feature like a Python list comprehension over the same data:",
      "examples": [
        {
          "label": "Streaming lets you query an infinite sequence — Take stops it",
          "code": "var firstThreeEvens = Naturals()\n    .Where(n => n % 2 == 0)\n    .Take(3);                        // streaming: stops pulling after 3\n\nConsole.WriteLine(string.Join(\", \", firstThreeEvens));\n\nstatic IEnumerable<int> Naturals()\n{\n    int n = 0;\n    while (true) yield return n++;   // never ends\n}",
          "output": "0, 2, 4"
        },
        {
          "label": "A buffering operator would hang forever on that same source",
          "code": "// Naturals().OrderBy(n => n)  // would try to read ALL infinite\n//                             // elements before yielding one → hangs.\n// Lesson: OrderBy/Reverse/GroupBy/Distinct must see every element first,\n// so never put them in front of an unbounded source."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Performance: lazy by default, materialize on purpose",
      "id": "performance"
    },
    {
      "kind": "list",
      "items": [
        "**Streaming is cheap on memory.** A `Where(...).Select(...)` over a million-row file processes one row at a time — you never hold the million rows. Calling `ToList()` on it allocates the whole result set, so materialize only when you actually need the snapshot.",
        "**Multiple enumeration is the real cost.** Re-running an in-memory query is wasted CPU; re-running a database query is a *second SQL round-trip*. If you'll touch the results more than once, materialize once and reuse.",
        "**Filter before you order and before you materialize.** `Where().OrderBy()` sorts fewer elements than `OrderBy().Where()`, and pulling fewer rows into a list is less allocation. Shape the query, then snapshot.",
        "**Don't put side effects in lazy operators.** Because `Where`/`Select` can re-run (or not run at all on the un-yielded tail), an I/O call or state mutation inside them can happen zero times, once, or many times. Keep LINQ as pure filtering/projection; use a plain `foreach` for side effects.",
        "**Return concrete collections from methods.** Returning a raw deferred `IEnumerable<T>` leaks the recipe to your caller, who may enumerate it twice (or after the underlying data changed). Return `List<T>` or `IReadOnlyList<T>` so the work is done and stable."
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: stay lazy while composing, materialize once at the boundary",
      "text": "Keep the query as `IEnumerable<T>` (or `IQueryable<T>`) while you're still building `Where`/`Select`/`OrderBy`/paging onto it — that's where laziness pays off. Then call `ToList()`/`ToArray()` **exactly once**, at the moment you need a result you'll iterate more than once, return to a caller, or protect from later mutation. Lazy to compose, eager to deliver."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A preview: IEnumerable vs IQueryable",
      "id": "ienumerable-vs-iqueryable"
    },
    {
      "kind": "paragraph",
      "text": "Everything so far has been **LINQ to Objects** — queries over in-memory collections, typed as `IEnumerable<T>`, where the lambdas run as compiled C#. But deferred execution has a second, more powerful form. When you query a database with EF Core, the query is typed as `IQueryable<T>`, and your `Where`/`Select`/`OrderBy` aren't run as C# at all — they're recorded as an **expression tree** and *translated into SQL* when you finally materialize."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "IEnumerable<T> — LINQ to Objects",
          "items": [
            "Source is an in-memory collection",
            "Lambdas run as compiled C# (delegates)",
            "Deferred: runs when you enumerate it",
            "Filtering happens in your process' memory",
            "This whole lesson"
          ]
        },
        {
          "title": "IQueryable<T> — LINQ to a provider (EF Core)",
          "items": [
            "Source is a database / remote provider",
            "Lambdas captured as expression trees, not run directly",
            "Deferred: translated to SQL and sent on `ToListAsync()`",
            "Filtering/paging happen **in the database**",
            "Next lesson, in depth"
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "The same gotchas apply, just with higher stakes. Materializing **too early** — `dbContext.Orders.ToList().Where(o => o.IsPaid)` — pulls the *entire* table into memory and filters in C#; keep it `IQueryable` so `Where` becomes a SQL `WHERE`. And **multiple enumeration** of an `IQueryable` means the SQL runs twice. We'll dig into all of it next lesson; for now, just hold the idea that 'a query is a recipe, not the result' is the foundation both forms are built on."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A LINQ query is a **recipe, not a result** — deferred operators (`Where`, `Select`, `OrderBy`, `Take`...) build a query object and run nothing until you enumerate it.",
        "Enumerating it **re-runs the whole query** every time. `Count()` then `foreach` over the same deferred query does the work twice — and over a database, that's two SQL calls.",
        "Deferred queries capture **variables, not values**: change a captured variable before enumerating and the results change with it (the modified-after / loop-variable gotcha).",
        "**Eager** operators force execution now: `ToList`, `ToArray`, `ToDictionary`, `Count`, `Sum`, `First`, `Any`, and `foreach`. Materialize **once** when you need a stable snapshot or will iterate more than once — that turns three passes into one (the lambda still runs once per element, but only on a single pass).",
        "**Streaming** operators (`Where`, `Select`, `Take`) yield one element at a time — great for huge or infinite sequences; **buffering** ones (`OrderBy`, `Distinct`, `GroupBy`, `Reverse`) must read everything first, so filter before you sort and never put them in front of an unbounded source.",
        "Keep it lazy while composing, materialize at the boundary, and never bury side effects in a lazy query. The same rules scale up to `IQueryable<T>`/EF Core — coming next."
      ]
    }
  ]
};
