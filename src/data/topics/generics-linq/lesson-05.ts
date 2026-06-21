import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  "slug": "linq-query",
  "number": 5,
  "title": "LINQ Query Syntax",
  "objective": "Use the SQL-like query syntax (from/where/select), and know when it reads better than method syntax.",
  "blocks": [
    {
      "kind": "lead",
      "text": "C# has a second way to write LINQ that looks almost exactly like SQL living right inside your code — `from order in orders where order.Total > 100 select order` — and once you see how it maps to the method calls you already know, you get to *choose* the syntax that makes each query read like plain English."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Students just learned method syntax (`Where`/`Select`/`OrderBy`) in the previous lesson. Frame query syntax as a **second skin over the same operators**, not a new thing to memorize — that lowers the anxiety.",
        "The single most important idea to land: **the compiler rewrites query syntax into method calls**. If they internalize this, everything else (why some operators have no keyword, why `let` exists) follows naturally.",
        "Python students know SQL far more often than they know C#. Lean on that: `from/where/select/orderby/group by/join` are literally SQL keywords. This lesson is where their SQL knowledge becomes an asset.",
        "Do the `let` clause live — type the duplicated-expression version first, watch them wince, then introduce `let`. The motivation has to come before the feature.",
        "Resist teaching `join`/`group` deeply here; this lesson is about the *syntax form* and the tradeoff. Joins get their own treatment. Show one join so they see *why* query syntax exists, then move on.",
        "End by being honest that real codebases are ~80% method syntax. You're teaching query syntax so they can READ it and reach for it in the few cases where it genuinely wins.",
        "If a sharp student asks: yes, the compiler optimizes away a trailing *degenerate* `select o` (one that just returns the range variable unchanged) so it doesn't emit a pointless `.Select(o => o)`. You don't need to teach this, but it's why a query of only `from o in xs select o` returns the original sequence's element type cleanly."
      ]
    },
    {
      "kind": "paragraph",
      "text": "In the last lesson we drove LINQ with **method syntax** — chains like `numbers.Where(n => n > 2).Select(n => n * 2)`. That fluent style is what you'll see in most production C#. But C# ships a *second* surface for the exact same engine: **query syntax**, a SQL-flavored mini-language built into the compiler. It's the closest C# ever gets to looking like Python's list comprehensions, and for certain shapes of query it reads dramatically better."
    },
    {
      "kind": "paragraph",
      "text": "If you've written `[n * 2 for n in numbers if n > 2]` in Python, query syntax will feel like home. Python puts the projection first (`n * 2`) and the filter last (`if n > 2`). C# query syntax flips the order to match SQL — the **source comes first**, then filtering, then the projection — so you read top-to-bottom the way the data actually flows."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python comprehension",
          "items": [
            "`result = [n * 2 for n in numbers if n > 2]`",
            "Projection (`n * 2`) is written **first**",
            "Filter (`if n > 2`) trails at the end",
            "One expression; no `orderby`/`group`/`join` keywords",
            "Eagerly builds a list right away"
          ]
        },
        {
          "title": "C# query syntax",
          "items": [
            "`var result = from n in numbers where n > 2 select n * 2;`",
            "Source (`from n in numbers`) is written **first**",
            "Filter (`where n > 2`) comes before the projection",
            "Full keyword set: `where`, `orderby`, `group`, `join`, `let`, `into`",
            "**Deferred** — returns an `IEnumerable<int>` that runs only when enumerated"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The anatomy of a query expression",
      "id": "anatomy"
    },
    {
      "kind": "paragraph",
      "text": "Every query expression **must start with a `from` clause** and **must end with either `select` or `group`**. In between you can stack any number of `where`, `orderby`, `let`, additional `from`, and `join` clauses. The `from` clause is `from <rangeVariable> in <source>` — the range variable (here `o`) is the per-element name you use in the rest of the query, exactly like the loop variable in a Python comprehension."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "QueryBasics.cs",
      "code": "var orders = new[]\n{\n    new Order(\"Espresso\",  3.50m, \"Drinks\"),\n    new Order(\"Croissant\",  4.25m, \"Bakery\"),\n    new Order(\"Latte\",      5.00m, \"Drinks\"),\n    new Order(\"Muffin\",     3.00m, \"Bakery\"),\n    new Order(\"Cold Brew\",  5.50m, \"Drinks\"),\n};\n\n// Query syntax: read it almost like SQL, top to bottom.\nvar pricyDrinks =\n    from o in orders\n    where o.Category == \"Drinks\" && o.Price >= 5.00m\n    orderby o.Price descending\n    select o.Name;\n\nforeach (var name in pricyDrinks)\n    Console.WriteLine(name);\n\nrecord Order(string Name, decimal Price, string Category);",
      "output": "Cold Brew\nLatte"
    },
    {
      "kind": "output",
      "label": "Program output",
      "output": "Cold Brew\nLatte"
    },
    {
      "kind": "paragraph",
      "text": "Notice the rhythm: `from` names the data, `where` filters it, `orderby` sorts it, `select` shapes the result. That `select o.Name` is a **projection** — it's what each element becomes in the output, identical in meaning to the `Select(o => o.Name)` you wrote with method syntax. And just like method syntax, this whole expression is **lazy**: nothing runs until the `foreach` pulls items through."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "It compiles to the methods you already know",
      "id": "compiles-to-methods"
    },
    {
      "kind": "paragraph",
      "text": "Here's the secret that makes query syntax click: **it's pure syntactic sugar.** The C# compiler doesn't have a special LINQ engine for queries — it mechanically rewrites each clause into the same extension-method calls from the previous lesson, *before* type-checking. `from` becomes the source, `where` becomes `.Where(...)`, `orderby` becomes `.OrderBy(...)` / `.OrderByDescending(...)`, and `select` becomes `.Select(...)`. The two snippets below are the **exact same program** — the compiler turns the first into the second."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "What you write (query)",
          "items": [
            "`from o in orders`",
            "`where o.Category == \"Drinks\" && o.Price >= 5.00m`",
            "`orderby o.Price descending`",
            "`select o.Name`"
          ]
        },
        {
          "title": "What the compiler generates (method)",
          "items": [
            "`orders`",
            "`.Where(o => o.Category == \"Drinks\" && o.Price >= 5.00m)`",
            "`.OrderByDescending(o => o.Price)`",
            "`.Select(o => o.Name)`"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why this matters more than it looks",
      "text": "Because query syntax *is* method calls, everything you know transfers instantly. Deferred execution, `IEnumerable<T>` vs `IQueryable<T>`, EF Core translating to SQL — all identical. A query expression against an EF Core `DbSet` becomes `IQueryable` method calls and runs on the database, exactly as the fluent form would. There is **no performance difference** between the two syntaxes; they compile to the same IL."
    },
    {
      "kind": "paragraph",
      "text": "There's one consequence of this rewriting worth internalizing early: **query syntax only has keywords for a subset of LINQ operators.** There's a `where`, but no keyword for `Count`, `Any`, `Take`, `Skip`, `Distinct`, `First`, or `Sum`. When you need those, you either wrap the whole query in parentheses and call the method, or you stop using query syntax. This is the #1 reason method syntax dominates real codebases — many everyday operators simply have no query-keyword."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "MixingSyntax.cs",
      "code": "var orders = new[]\n{\n    new Order(\"Espresso\",  3.50m, \"Drinks\"),\n    new Order(\"Latte\",      5.00m, \"Drinks\"),\n    new Order(\"Cold Brew\",  5.50m, \"Drinks\"),\n    new Order(\"Muffin\",     3.00m, \"Bakery\"),\n};\n\n// No 'count' keyword exists. Wrap the query and call the method.\nint drinkCount =\n    (from o in orders\n     where o.Category == \"Drinks\"\n     select o).Count();\n\n// No 'sum' keyword either — same trick.\ndecimal drinkRevenue =\n    (from o in orders\n     where o.Category == \"Drinks\"\n     select o.Price).Sum();\n\nConsole.WriteLine($\"Drinks: {drinkCount}, revenue: {drinkRevenue:C}\");\n\nrecord Order(string Name, decimal Price, string Category);",
      "output": "Drinks: 3, revenue: $14.00"
    },
    {
      "kind": "output",
      "label": "Program output (en-US culture)",
      "output": "Drinks: 3, revenue: $14.00"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "About that `:C` and en-US",
      "text": "The `C` format specifier means **currency**, and it follows the machine's current culture for the symbol and grouping — `$14.00` on a US machine, `14,00 €` on a German one. The outputs in this lesson assume en-US. In real services you don't leave this to the server's locale: you pass an explicit `CultureInfo` (for example `drinkRevenue.ToString(\"C\", CultureInfo.GetCultureInfo(\"en-US\"))`) so a deployment in another region can't silently change your numbers."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The `let` clause: name an intermediate value",
      "id": "let-clause"
    },
    {
      "kind": "paragraph",
      "text": "Here's where query syntax earns its keep. Suppose you compute something from each element and then want to **filter on it, sort by it, and return it** — three places that all need the same value. In method syntax you'd either repeat the expression three times or thread an anonymous type through a `Select`. The `let` clause lets you name the intermediate value once and reuse it for the rest of the query. There is no direct method-syntax keyword equivalent; the compiler implements `let` by projecting a hidden anonymous type behind the scenes."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "LetClause.cs",
      "code": "var lineItems = new[]\n{\n    new LineItem(\"Latte\",     5.00m, 3),\n    new LineItem(\"Espresso\",  3.50m, 1),\n    new LineItem(\"Cold Brew\", 5.50m, 4),\n    new LineItem(\"Muffin\",    3.00m, 2),\n};\n\nvar bigTickets =\n    from item in lineItems\n    let subtotal = item.UnitPrice * item.Quantity   // name it once\n    where subtotal >= 10.00m                          // filter on it\n    orderby subtotal descending                       // sort by it\n    select $\"{item.Name}: {subtotal:C}\";              // return it\n\nforeach (var line in bigTickets)\n    Console.WriteLine(line);\n\nrecord LineItem(string Name, decimal UnitPrice, int Quantity);",
      "output": "Cold Brew: $22.00\nLatte: $15.00"
    },
    {
      "kind": "output",
      "label": "Program output (en-US culture)",
      "output": "Cold Brew: $22.00\nLatte: $15.00"
    },
    {
      "kind": "paragraph",
      "text": "Without `let`, `item.UnitPrice * item.Quantity` would appear three times — in the `where`, the `orderby`, and the `select`. That's not just verbose; it's a bug magnet, because the day someone changes the formula they have to remember to change all three. For comparison, the equivalent method-syntax version has to introduce an anonymous type to carry `subtotal` alongside `item`, which is noticeably clunkier."
    },
    {
      "kind": "examples",
      "intro": "The same `let` query, written in method syntax. This is essentially what the compiler generates — notice how `let` becomes a `Select` into an anonymous type that carries both the original item and the computed value forward:",
      "examples": [
        {
          "label": "Method syntax equivalent of let",
          "code": "var bigTickets = lineItems\n    .Select(item => new { item, subtotal = item.UnitPrice * item.Quantity })\n    .Where(x => x.subtotal >= 10.00m)\n    .OrderByDescending(x => x.subtotal)\n    .Select(x => $\"{x.item.Name}: {x.subtotal:C}\");",
          "output": "Cold Brew: $22.00\nLatte: $15.00"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Ordering: `orderby`, `descending`, and tie-breakers",
      "id": "orderby"
    },
    {
      "kind": "paragraph",
      "text": "The `orderby` clause sorts the sequence. Ascending is the default; add `descending` to reverse. To break ties on a second key, **comma-separate** the keys — `orderby a.Category, a.Price descending` sorts by category first, then by price within each category. That comma form maps directly to the method chain `OrderBy(...).ThenByDescending(...)`. It's a clean win for query syntax: the multi-key sort reads as one clause instead of an `OrderBy`/`ThenBy` pair you have to assemble in the right order."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "MultiKeyOrder.cs",
      "code": "var menu = new[]\n{\n    new Order(\"Espresso\",  3.50m, \"Drinks\"),\n    new Order(\"Croissant\", 4.25m, \"Bakery\"),\n    new Order(\"Latte\",     5.00m, \"Drinks\"),\n    new Order(\"Muffin\",    3.00m, \"Bakery\"),\n};\n\nvar sorted =\n    from o in menu\n    orderby o.Category, o.Price descending   // category asc, then price desc\n    select $\"{o.Category,-7} {o.Name,-10} {o.Price:C}\";\n\nforeach (var line in sorted)\n    Console.WriteLine(line);\n\nrecord Order(string Name, decimal Price, string Category);",
      "output": "Bakery  Croissant  $4.25\nBakery  Muffin     $3.00\nDrinks  Latte      $5.00\nDrinks  Espresso   $3.50"
    },
    {
      "kind": "output",
      "label": "Program output (en-US culture)",
      "output": "Bakery  Croissant  $4.25\nBakery  Muffin     $3.00\nDrinks  Latte      $5.00\nDrinks  Espresso   $3.50"
    },
    {
      "kind": "paragraph",
      "text": "The `{o.Category,-7}` part is **alignment formatting**: a negative number left-aligns the value in a field that many characters wide (a positive number right-aligns). That's why the columns line up regardless of word length. Note the result within each category: Bakery's Croissant ($4.25) comes before Muffin ($3.00), and Drinks' Latte ($5.00) before Espresso ($3.50) — proof the secondary `descending` price sort is doing its job *inside* each category group, not across the whole list."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Where query syntax genuinely wins: joins and grouping",
      "id": "where-query-wins"
    },
    {
      "kind": "paragraph",
      "text": "For a single `Where` + `Select`, method syntax is shorter and most teams prefer it. Query syntax pulls ahead when you have **multiple data sources** (joins), **a `group ... by`**, or **several `let` bindings** — cases where the method form sprouts nested lambdas, anonymous types, and `DefaultIfEmpty` calls that are hard to read. A `join` clause, in particular, reads like SQL and hides a lot of machinery."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "JoinAndGroup.cs",
      "code": "var customers = new[]\n{\n    new Customer(1, \"Asha\"),\n    new Customer(2, \"Ben\"),\n};\nvar orders = new[]\n{\n    new Order(101, 1, 12.00m),\n    new Order(102, 1,  8.50m),\n    new Order(103, 2, 20.00m),\n};\n\n// Inner join reads almost exactly like SQL.\nvar customerOrders =\n    from c in customers\n    join o in orders on c.Id equals o.CustomerId\n    select new { c.Name, o.Total };\n\nforeach (var row in customerOrders)\n    Console.WriteLine($\"{row.Name} spent {row.Total:C}\");\n\nConsole.WriteLine(\"---\");\n\n// group ... by: total spend per customer, in one pass of clauses.\nvar spendByCustomer =\n    from o in orders\n    group o by o.CustomerId into g\n    select new { CustomerId = g.Key, Total = g.Sum(x => x.Total) };\n\nforeach (var g in spendByCustomer)\n    Console.WriteLine($\"Customer {g.CustomerId}: {g.Total:C}\");\n\nrecord Customer(int Id, string Name);\nrecord Order(int Id, int CustomerId, decimal Total);",
      "output": "Asha spent $12.00\nAsha spent $8.50\nBen spent $20.00\n---\nCustomer 1: $20.50\nCustomer 2: $20.00"
    },
    {
      "kind": "output",
      "label": "Program output (en-US culture)",
      "output": "Asha spent $12.00\nAsha spent $8.50\nBen spent $20.00\n---\nCustomer 1: $20.50\nCustomer 2: $20.00"
    },
    {
      "kind": "paragraph",
      "text": "That `group o by o.CustomerId into g` clause introduces the `into` keyword — a **query continuation** that takes the result of one clause (here, the groups) and feeds it into a fresh query. The range variable `g` is each group; it's an `IGrouping<TKey, TElement>`, with `g.Key` holding the grouping value and the group itself being enumerable, so `g.Sum(x => x.Total)` aggregates the orders inside it. Writing the equivalent join + group in method syntax means `GroupJoin`, `SelectMany`, `DefaultIfEmpty`, and nested lambdas — correct, but far noisier. This is exactly the territory where reaching for query syntax pays off."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: `=` vs `equals`, and the missing keywords",
      "text": "Two traps bite beginners constantly. First, a `join` uses the contextual keyword **`equals`**, not `==`: it's `on c.Id equals o.CustomerId`, and the **left side must reference the outer source, the right side the inner** — swap them and you get a compile error. Second, don't expect a keyword for every operator: there's no `take`, `skip`, `distinct`, `count`, `first`, or `any` in query syntax. Wrap the query in parentheses and call the method (`(from ... select ...).Take(10)`), or just write the whole thing in method syntax."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: pick the syntax per query, stay consistent per file",
      "text": "Default to **method syntax** — it's what most C# developers read fastest and it covers every operator. Switch to **query syntax** when a single query has a join, a `group by`, or two-plus `let` bindings and the method version would be a thicket of nested lambdas. Whichever you pick, **don't mix both styles in one query** if you can avoid it, and keep a single file consistent. The goal is always the reader's comprehension, not cleverness."
    },
    {
      "kind": "paragraph",
      "text": "In real backend work, you'll most often meet query syntax in two places: complex **reporting and dashboard queries** (group-by-and-aggregate over orders, events, or log records), and **EF Core queries with joins** where the SQL-like form maps cleanly onto the generated SQL. For the DTO projections and filter-and-page operations that make up the bulk of an ASP.NET Core API, method syntax stays the pragmatic default. Knowing both means you can *read* any codebase and reach for the clearer tool each time."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Modern note (.NET 10 / C# 14)",
      "text": "Query syntax has been stable for years and is unchanged in C# 14 — its translation rules are part of the language spec. The newer LINQ operators are all **method-only**, with no query keyword: `CountBy` and `Index()` arrived in **.NET 9**, and `LeftJoin`/`RightJoin` are new in **.NET 10**. That's a small reminder that the language team now invests in the fluent surface — query syntax remains the right tool for `join` and `group by`, while brand-new operators show up as methods you call on a chain."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "Query syntax is a **SQL-like surface over the same LINQ operators** — it must start with `from` and end with `select` or `group`.",
        "The compiler **mechanically rewrites query syntax into method calls** (`where`→`.Where`, `orderby`→`.OrderBy`/`.OrderByDescending`, `select`→`.Select`) before type-checking. Same IL, **same performance**, same deferred execution.",
        "Many operators have **no query keyword** (`Count`, `Any`, `Take`, `Skip`, `Distinct`, `First`, `Sum`) — wrap the query in parentheses and call the method, or use method syntax.",
        "The **`let` clause** names an intermediate value once so you can filter, sort, and project on it without repeating the expression; it compiles to a `Select` into an anonymous type.",
        "**`orderby a, b descending`** maps to `OrderBy(...).ThenByDescending(...)`; comma-separated keys give multi-level sorts in one clause.",
        "Query syntax **reads best for joins (`join ... on ... equals ...`), `group ... by ... into`, and multiple `let`s**; method syntax wins for simple filter/project chains and is the everyday default.",
        "Use **`equals`** (not `==`) in a join, with the outer source on the left and inner on the right; default to method syntax and stay consistent within a file."
      ]
    }
  ]
};
