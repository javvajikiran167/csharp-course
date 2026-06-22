import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  "slug": "linq-intro",
  "number": 4,
  "title": "LINQ — Method Syntax Basics",
  "objective": "Where, Select, OrderBy, FirstOrDefault — the operators you'll use every day.",
  "blocks": [
    {
      "kind": "lead",
      "text": "If you have ever written `[p for p in people if p.age >= 18]` in Python, you already understand what LINQ does — C# just gives it a name, a richer API, and a superpower that lets it run your filters **inside a database** without changing a single line of code."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Students with Python backgrounds \"get\" LINQ conceptually within minutes once you map it to list comprehensions and filter/map. Spend the first few minutes on that mapping explicitly.",
        "The single hardest idea is **deferred execution**. Do NOT gloss over it. Use the live mutation demo (the pitfall section) — watching the query change because the source changed after it was written is the aha moment.",
        "Watch for students who instinctively write `.Where(x => x.IsActive).Count() > 0`. Correct it to `.Any(x => x.IsActive)` every time you see it — the habit forms fast.",
        "Keep reminding them: `Select` returns `IEnumerable<T>`, not a `List<T>`. The most common beginner surprise is calling `.Count` (property) on an `IEnumerable` and getting a compile error.",
        "The IQueryable vs IEnumerable distinction deserves a mention but can be deferred to the EF Core lesson. Plant the seed here with a one-sentence callout.",
        "The real-pipeline example uses `searchTerm = \"e\"` with `OrdinalIgnoreCase`. Make sure students trace exactly which products match: \"Wireless Keyboard\", \"Ergonomic Chair\", and \"Noise-Cancel Headphones\" — not \"Laptop Stand\" or \"USB-C Hub\" (neither contains the letter e). This is a good exercise in reading filter logic carefully."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What Is LINQ?",
      "id": "what-is-linq"
    },
    {
      "kind": "paragraph",
      "text": "**LINQ** (Language INtegrated Query) is a family of extension methods built into the .NET runtime that lets you filter, transform, sort, and aggregate any collection — arrays, lists, database results, CSV rows, XML nodes — using a consistent, composable API. You write the same code whether the data lives in a `List<T>` in memory or in a PostgreSQL table on the other side of the network."
    },
    {
      "kind": "paragraph",
      "text": "Here is the quick Python-to-C# translation table you will use as a mental model throughout this lesson:"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python",
          "items": [
            "`filter(pred, seq)` or `[x for x in seq if pred(x)]`",
            "`map(fn, seq)` or `[fn(x) for x in seq]`",
            "`sorted(seq, key=fn)`",
            "`next((x for x in seq if pred(x)), None)`",
            "`any(pred(x) for x in seq)`",
            "`all(pred(x) for x in seq)`",
            "`functools.reduce(fn, seq, init)`"
          ]
        },
        {
          "title": "C# LINQ",
          "items": [
            "`.Where(x => pred(x))`",
            "`.Select(x => fn(x))`",
            "`.OrderBy(x => fn(x))`",
            "`.FirstOrDefault(x => pred(x))`",
            "`.Any(x => pred(x))`",
            "`.All(x => pred(x))`",
            "`.Aggregate(init, (acc, x) => fn(acc, x))`"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Method syntax vs query syntax",
      "text": "C# supports two ways to write LINQ: **method syntax** (`.Where(...).Select(...)`) and **query syntax** (`from x in seq where ... select ...`). They compile to identical IL. Professional C# codebases overwhelmingly prefer **method syntax** because it chains naturally in pipelines, integrates with non-LINQ calls, and is what you will read in every open-source .NET repo. This lesson teaches method syntax exclusively."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The Four Operators You Will Use Every Day",
      "id": "four-operators"
    },
    {
      "kind": "paragraph",
      "text": "Let's work with a realistic domain. Imagine you are building the back end for a small e-commerce platform. Here is the data model and a seed list we will use for all the examples in this lesson:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "LinqIntro.cs",
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\n// --- Domain model ---\npublic record Product(\n    int Id,\n    string Name,\n    string Category,\n    decimal Price,\n    bool IsAvailable);\n\n// --- Seed data (used by every example below) ---\nvar products = new List<Product>\n{\n    new(1, \"Wireless Keyboard\",        \"Electronics\", 49.99m,  true),\n    new(2, \"Ergonomic Chair\",          \"Furniture\",   289.00m, true),\n    new(3, \"USB-C Hub\",                \"Electronics\", 34.50m,  true),\n    new(4, \"Standing Desk\",            \"Furniture\",   499.00m, false),\n    new(5, \"Noise-Cancel Headphones\",  \"Electronics\", 199.99m, true),\n    new(6, \"Monitor Arm\",              \"Furniture\",   79.00m,  true),\n    new(7, \"Webcam HD\",                \"Electronics\", 89.00m,  false),\n    new(8, \"Laptop Stand\",             \"Electronics\", 29.99m,  true),\n};"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Where — Filter the Collection",
      "id": "where"
    },
    {
      "kind": "paragraph",
      "text": "`Where` takes a predicate — a lambda that returns `bool` — and returns every element for which the predicate is true. It does **not** modify the original list; it returns a new lazy sequence."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// All available electronics under $100\nvar affordableElectronics = products\n    .Where(p => p.Category == \"Electronics\")\n    .Where(p => p.Price < 100m)\n    .Where(p => p.IsAvailable);\n\nforeach (var p in affordableElectronics)\n    Console.WriteLine($\"{p.Name} — ${p.Price}\");"
    },
    {
      "kind": "output",
      "output": "Wireless Keyboard — $49.99\nUSB-C Hub — $34.50\nLaptop Stand — $29.99"
    },
    {
      "kind": "paragraph",
      "text": "You can combine multiple conditions into a single `Where` call using `&&` — the result is identical and often more readable when the conditions are tightly related:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var affordableElectronics2 = products\n    .Where(p => p.Category == \"Electronics\" && p.Price < 100m && p.IsAvailable);\n\n// Both approaches produce the same results."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Select — Transform Each Element",
      "id": "select"
    },
    {
      "kind": "paragraph",
      "text": "`Select` applies a function to every element and returns the results as a new sequence. The input type and output type do not have to match — this is how you convert domain objects into DTOs, view models, or simple strings for display."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Project to a lightweight summary record\npublic record ProductSummary(string Name, decimal Price, string Tag);\n\nvar summaries = products\n    .Where(p => p.IsAvailable)\n    .Select(p => new ProductSummary(\n        p.Name,\n        p.Price,\n        p.Price > 100m ? \"Premium\" : \"Budget\"));\n\nforeach (var s in summaries)\n    Console.WriteLine($\"{s.Tag,-8} | {s.Name,-30} | ${s.Price:0.00}\");"
    },
    {
      "kind": "output",
      "output": "Budget   | Wireless Keyboard              | $49.99\nPremium  | Ergonomic Chair                | $289.00\nBudget   | USB-C Hub                      | $34.50\nPremium  | Noise-Cancel Headphones        | $199.99\nBudget   | Monitor Arm                    | $79.00\nBudget   | Laptop Stand                   | $29.99"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Select returns IEnumerable<T>, not List<T>",
      "text": "In Python, a list comprehension immediately gives you a `list`. In C#, `Select` returns a **lazy** `IEnumerable<T>`. If you need a concrete `List<T>` — to pass to another method, check `.Count`, or index into it — call `.ToList()` at the end of the chain: `products.Where(...).Select(...).ToList()`. Forgetting this is the single most common beginner mistake."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "OrderBy and ThenBy — Sort the Results",
      "id": "orderby"
    },
    {
      "kind": "paragraph",
      "text": "`OrderBy` sorts ascending; `OrderByDescending` sorts descending. When you need to break ties, chain `ThenBy` or `ThenByDescending` — this is the equivalent of Python's `sorted(seq, key=lambda p: (p.last, p.first))`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Sort available products: cheapest first, then alphabetically by name\nvar sorted = products\n    .Where(p => p.IsAvailable)\n    .OrderBy(p => p.Price)\n    .ThenBy(p => p.Name)\n    .ToList();\n\nforeach (var p in sorted)\n    Console.WriteLine($\"${p.Price,7:0.00}  {p.Name}\");"
    },
    {
      "kind": "output",
      "output": "$  29.99  Laptop Stand\n$  34.50  USB-C Hub\n$  49.99  Wireless Keyboard\n$  79.00  Monitor Arm\n$ 199.99  Noise-Cancel Headphones\n$ 289.00  Ergonomic Chair"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "FirstOrDefault — Find One Element Safely",
      "id": "first-or-default"
    },
    {
      "kind": "paragraph",
      "text": "`FirstOrDefault` returns the first element matching a predicate, or `null` (for reference types) if nothing matches. It is the safe alternative to `First`, which throws `InvalidOperationException` when the sequence is empty. Think of it as Python's `next((x for x in seq if pred(x)), None)`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Look up a product by id — classic \"find or 404\" pattern in an API controller\nint requestedId = 3;\nProduct? found = products.FirstOrDefault(p => p.Id == requestedId);\n\nif (found is null)\n{\n    Console.WriteLine($\"Product {requestedId} not found.\");\n}\nelse\n{\n    Console.WriteLine($\"Found: {found.Name} at ${found.Price}\");\n}\n\n// Safe property access with ?. when you don't branch explicitly\nstring? name = products.FirstOrDefault(p => p.Category == \"Furniture\" && !p.IsAvailable)?.Name;\nConsole.WriteLine($\"Unavailable furniture item: {name ?? \"none\"}\");"
    },
    {
      "kind": "output",
      "output": "Found: USB-C Hub at $34.50\nUnavailable furniture item: Standing Desk"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Always null-check FirstOrDefault results",
      "text": "It is tempting to write `products.FirstOrDefault(p => p.Id == id).Name` in one shot. If nothing matches, you get a `NullReferenceException` at runtime — the compiler cannot protect you here. **Always** guard with `if (result is null)` or use the null-conditional operator `result?.Name`. Similarly, prefer `FirstOrDefault` over `SingleOrDefault` unless your business rule genuinely requires exactly one match — `SingleOrDefault` throws if two rows match, which can be a nasty production surprise."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Deferred Execution — The Most Important Concept in LINQ",
      "id": "deferred-execution"
    },
    {
      "kind": "paragraph",
      "text": "When you write a LINQ chain, **nothing executes**. You are building a description of work — a pipeline — that will run only when something asks for the results. That trigger is called **materialization**, and it happens when you call `.ToList()`, `.ToArray()`, `.Count()`, `.Any()`, iterate with `foreach`, or use any other method that needs the actual values."
    },
    {
      "kind": "paragraph",
      "text": "This is fundamentally different from Python list comprehensions, which execute immediately and give you a list. LINQ queries are lazy, like Python **generators** (`(x for x in seq if cond)`)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var source = new List<Product>(products);  // start with our 8 products\n\n// Build the query — NOT executed yet\nvar expensiveQuery = source.Where(p => p.Price > 200m);\n\n// Add a new product AFTER the query is defined\nsource.Add(new Product(9, \"4K Monitor\", \"Electronics\", 399.00m, true));\n\n// NOW the query runs — and it sees the product we just added!\nvar results = expensiveQuery.ToList();\n\nforeach (var p in results)\n    Console.WriteLine(p.Name);"
    },
    {
      "kind": "output",
      "output": "Ergonomic Chair\nStanding Desk\n4K Monitor"
    },
    {
      "kind": "paragraph",
      "text": "The query saw the `4K Monitor` even though we added it after writing the `Where` clause. This is deferred execution in action. It is a feature — it means database queries built with LINQ can accumulate conditions across multiple method calls before hitting the network — but it can bite you if you forget."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Pitfall: Multiple Enumeration",
      "text": "If you iterate a LINQ query **twice** — for example calling `Count()` and then `foreach` — the underlying pipeline runs **twice**. For an in-memory list that wastes CPU. For a database query it means **two SQL round trips**. Fix: call `.ToList()` once, store the result, and operate on the list. Example: `var list = query.ToList(); int count = list.Count; foreach (var x in list) { ... }`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Putting It All Together — A Real Pipeline",
      "id": "real-pipeline"
    },
    {
      "kind": "paragraph",
      "text": "Real-world LINQ chains combine all four operators and more. Here is the kind of query you will write weekly as a .NET developer — a product search endpoint that filters, sorts, projects to a DTO, and paginates. Notice that `searchTerm = \"e\"` with `OrdinalIgnoreCase` matches products whose names contain the letter e: **Wireless Keyboard**, **Ergonomic Chair**, and **Noise-Cancel Headphones** — but not \"Laptop Stand\" or \"USB-C Hub\", which contain no e."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ProductSearch.cs",
      "code": "public record ProductDto(int Id, string Name, decimal Price, string Category);\n\n// Simulate a search request coming from a UI\nstring? searchTerm  = \"e\";   // free-text filter (case-insensitive)\nstring? category    = null;  // null = all categories\nint     pageNumber  = 1;\nint     pageSize    = 3;\n\nvar results = products\n    // 1. Only available products\n    .Where(p => p.IsAvailable)\n\n    // 2. Optional category filter\n    .Where(p => category == null || p.Category == category)\n\n    // 3. Optional free-text search on name (case-insensitive)\n    .Where(p => searchTerm == null ||\n                p.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))\n\n    // 4. Deterministic sort\n    .OrderBy(p => p.Category)\n    .ThenBy(p => p.Name)\n\n    // 5. Pagination\n    .Skip((pageNumber - 1) * pageSize)\n    .Take(pageSize)\n\n    // 6. Project to DTO — don't expose internal model to callers\n    .Select(p => new ProductDto(p.Id, p.Name, p.Price, p.Category))\n\n    // 7. Materialize exactly once\n    .ToList();\n\nConsole.WriteLine($\"Page {pageNumber} results ({results.Count} items):\");\nforeach (var dto in results)\n    Console.WriteLine($\"  [{dto.Category}] {dto.Name} — ${dto.Price}\");"
    },
    {
      "kind": "output",
      "output": "Page 1 results (3 items):\n  [Electronics] Noise-Cancel Headphones — $199.99\n  [Electronics] Wireless Keyboard — $49.99\n  [Furniture] Ergonomic Chair — $289.00"
    },
    {
      "kind": "examples",
      "intro": "Here are a few more short, idiomatic LINQ patterns you will reach for constantly:",
      "examples": [
        {
          "label": "Any — existence check (always prefer over Count() > 0)",
          "code": "bool hasExpensiveItems = products.Any(p => p.Price > 300m);\nConsole.WriteLine(hasExpensiveItems);",
          "output": "True"
        },
        {
          "label": "All — guard / validation check",
          "code": "bool allPriced = products.All(p => p.Price > 0m);\nConsole.WriteLine(allPriced);",
          "output": "True"
        },
        {
          "label": "ToDictionary — O(1) lookup by key",
          "code": "Dictionary<int, Product> byId = products.ToDictionary(p => p.Id);\nConsole.WriteLine(byId[5].Name);",
          "output": "Noise-Cancel Headphones"
        },
        {
          "label": "Sum / Average — aggregation across available products",
          "code": "decimal total   = products.Where(p => p.IsAvailable).Sum(p => p.Price);\ndecimal average = products.Where(p => p.IsAvailable).Average(p => p.Price);\nConsole.WriteLine($\"Total: ${total:0.00}  |  Avg: ${average:0.00}\");",
          "output": "Total: $682.47  |  Avg: $113.75"
        },
        {
          "label": "GroupBy — aggregate by key",
          "code": "var byCategory = products\n    .GroupBy(p => p.Category)\n    .Select(g => new { Category = g.Key, Count = g.Count(), Max = g.Max(p => p.Price) });\n\nforeach (var row in byCategory)\n    Console.WriteLine($\"{row.Category}: {row.Count} items, max ${row.Max}\");",
          "output": "Electronics: 5 items, max $199.99\nFurniture: 3 items, max $499.00"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "IQueryable — the same code, in the database",
      "text": "Everything you learned here works identically against an **EF Core `DbSet<T>`**, which implements `IQueryable<T>` instead of `IEnumerable<T>`. EF Core translates your `Where`, `Select`, `OrderBy`, and `Skip/Take` calls into optimized SQL, so the database does the filtering — not your server's memory. You will see this in the EF Core module; for now, know that the syntax you just learned is not throw-away homework code — it is production database query code."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**LINQ is lazy** — a query chain is a description of work, not a result. It executes only when you materialize it with `.ToList()`, `.ToArray()`, `.Count()`, `foreach`, or similar.",
        "**`Where`** filters (keep elements matching a predicate), **`Select`** transforms (project each element to a new shape), **`OrderBy`/`ThenBy`** sort, and **`FirstOrDefault`** safely retrieves one element or `null`.",
        "**Always null-check `FirstOrDefault` results** before accessing members — use `if (result is null)` or the null-conditional operator `?.`.",
        "**Prefer `Any(predicate)` over `Count() > 0`** for existence checks — `Any` short-circuits at the first match and is dramatically faster on large sequences.",
        "**Materialize once** with `.ToList()` when you need the results more than once, to avoid re-executing the pipeline multiple times.",
        "**`Select` returns `IEnumerable<T>`, not `List<T>`** — call `.ToList()` at the end of your chain when the caller needs a concrete list.",
        "The same method-syntax LINQ chain runs against in-memory collections (`IEnumerable<T>`) and EF Core database tables (`IQueryable<T>`) — the skills you build here transfer directly to production database queries."
      ]
    }
  ]
};
