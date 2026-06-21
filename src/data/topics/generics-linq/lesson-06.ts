import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  "slug": "linq-grouping",
  "number": 6,
  "title": "GroupBy, Join & Aggregation",
  "objective": "Transform collections like a database query.",
  "blocks": [
    {
      "kind": "lead",
      "text": "You already know how to filter with `Where` and transform with `Select` — now we reach the part of LINQ that makes junior developers feel like database wizards: grouping rows into buckets, joining two collections on a shared key, and collapsing thousands of records into a handful of meaningful numbers, all without writing a single SQL file."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Students coming from Python will reach for `itertools.groupby` as a mental model. Emphasise early that C# GroupBy does NOT require pre-sorting — this is a very common Python-to-C# gotcha.",
        "The `Join` operator looks intimidating at first glance because it has four arguments. Walk through the lambda parameters one by one, naming the role of each before showing the full call.",
        "Aggregation methods (Sum, Average, Min, Max, Count) are the easiest win — Python devs already know these as built-ins. Build confidence here before tackling GroupBy.",
        "Deferred execution bites especially hard with GroupBy. If a student mutates the source list between the GroupBy call and the foreach, they will see surprising results. Make this concrete with a live demo or the code example below.",
        "For the IQueryable vs IEnumerable distinction, remind students that in EF Core the GroupBy and Join calls get translated to SQL GROUP BY and JOIN. The in-memory examples here use the same syntax — the power is that skills transfer directly to database work.",
        "Each code block in this lesson is a self-contained compilable file. The first block (Aggregation.cs) defines the shared `orders` and `customers` lists and the record types; the subsequent blocks each restate the same data at the top for clarity. In a real project all of this would live in one file or class.",
        "The `Thread.CurrentThread.CurrentCulture = new CultureInfo(\"en-US\");` line at the top of each snippet ensures the `:C` format specifier always renders as `$` regardless of the developer's OS locale. Without it, the same code prints `₹` on an Indian machine, `£` on a UK machine, and so on. Point this out explicitly — it is a common source of confusion when students run code from tutorials."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Aggregation — Collapsing a Collection to a Single Value",
      "id": "aggregation"
    },
    {
      "kind": "paragraph",
      "text": "Before we group anything, let us look at the simplest transformation: turning an entire sequence into one number (or string, or bool). LINQ ships with `Sum`, `Average`, `Min`, `Max`, `Count`, and the general-purpose `Aggregate`. If you have used Python's `sum()`, `min()`, `max()`, and `functools.reduce()`, these will feel completely natural — the only difference is that in LINQ you pass a *selector lambda* that picks which field to aggregate over."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Aggregation.cs",
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Globalization;\nusing System.Linq;\nusing System.Threading;\n\n// Force en-US so currency always renders as $ regardless of OS locale\nThread.CurrentThread.CurrentCulture = new CultureInfo(\"en-US\");\n\nvar orders = new List<Order>\n{\n    new(1,  101, \"North\", \"Hardware\",  450.00m, true),\n    new(2,  102, \"South\", \"Software\",  120.00m, true),\n    new(3,  101, \"North\", \"Hardware\",  830.00m, true),\n    new(4,  103, \"East\",  \"Services\",  275.00m, false),\n    new(5,  102, \"South\", \"Software\",  560.00m, true),\n    new(6,  104, \"North\", \"Services\",  990.00m, true),\n    new(7,  103, \"East\",  \"Hardware\",   95.00m, true),\n    new(8,  104, \"West\",  \"Software\", 1200.00m, false),\n};\n\n// --- Basic aggregates ---\ndecimal grandTotal   = orders.Sum(o => o.Total);\ndecimal average      = orders.Average(o => o.Total);\ndecimal largest      = orders.Max(o => o.Total);\ndecimal smallest     = orders.Min(o => o.Total);\nint     completedQty = orders.Count(o => o.IsCompleted);\n\nConsole.WriteLine($\"Grand total:    {grandTotal:C}\");\nConsole.WriteLine($\"Average order:  {average:C}\");\nConsole.WriteLine($\"Largest order:  {largest:C}\");\nConsole.WriteLine($\"Smallest order: {smallest:C}\");\nConsole.WriteLine($\"Completed:      {completedQty}\");\n\n// --- General-purpose reduce with Aggregate ---\n// Build a comma-separated list of completed order IDs\nstring completedIds = orders\n    .Where(o => o.IsCompleted)\n    .Select(o => o.Id.ToString())\n    .Aggregate((acc, id) => $\"{acc}, {id}\");\n\nConsole.WriteLine($\"Completed IDs:  {completedIds}\");\n\n// --- Type declarations go after top-level statements ---\npublic record Order(\n    int Id,\n    int CustomerId,\n    string Region,\n    string Category,\n    decimal Total,\n    bool IsCompleted);\n\npublic record Customer(int Id, string Name, string Region);"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why records are declared at the bottom",
      "text": "In a C# **top-level program** (no explicit `class Program`), type declarations such as `record` and `class` must appear **after** all top-level executable statements. The compiler enforces this — place them at the end of the file. This is purely a file-layout rule; the types are still visible everywhere in the file at runtime."
    },
    {
      "kind": "output",
      "output": "Grand total:    $4,520.00\nAverage order:  $565.00\nLargest order:  $1,200.00\nSmallest order: $95.00\nCompleted:      6\nCompleted IDs:  1, 2, 3, 5, 6, 7",
      "label": "Aggregation output"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Prefer Any() over Count() > 0",
      "text": "When you just want to know *whether* any element matches a condition, use `Any(predicate)` instead of `Count(predicate) > 0`. `Any()` stops at the first match, making it O(1) in the best case. `Count()` must traverse the entire sequence — and for a database-backed `IQueryable<T>` that means issuing a `COUNT(*)` SQL query. Prefer `orders.Any(o => o.Total > 1000m)` over `orders.Count(o => o.Total > 1000m) > 0`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "GroupBy — Sorting Records into Labelled Buckets",
      "id": "groupby"
    },
    {
      "kind": "paragraph",
      "text": "Think of `GroupBy` as the LINQ equivalent of an SQL `GROUP BY` clause. You hand it a *key selector* — a lambda that picks the field to group on — and it returns a sequence of **groups**, where each group is itself a sequence containing all elements that share the same key. In Python you might reach for `itertools.groupby`, but there is one critical difference: **Python's `groupby` requires the input to be pre-sorted by the grouping key, or it creates multiple groups for the same key. C# LINQ's `GroupBy` has no such requirement** — it hashes the keys internally and collects all matching elements regardless of order."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "GroupBy.cs",
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Globalization;\nusing System.Linq;\nusing System.Threading;\n\nThread.CurrentThread.CurrentCulture = new CultureInfo(\"en-US\");\n\nvar orders = new List<Order>\n{\n    new(1,  101, \"North\", \"Hardware\",  450.00m, true),\n    new(2,  102, \"South\", \"Software\",  120.00m, true),\n    new(3,  101, \"North\", \"Hardware\",  830.00m, true),\n    new(4,  103, \"East\",  \"Services\",  275.00m, false),\n    new(5,  102, \"South\", \"Software\",  560.00m, true),\n    new(6,  104, \"North\", \"Services\",  990.00m, true),\n    new(7,  103, \"East\",  \"Hardware\",   95.00m, true),\n    new(8,  104, \"West\",  \"Software\", 1200.00m, false),\n};\n\n// --- Group orders by Region, compute per-region summary ---\nvar regionSummaries = orders\n    .GroupBy(o => o.Region)\n    .Select(g => new\n    {\n        Region     = g.Key,\n        OrderCount = g.Count(),\n        TotalSales = g.Sum(o => o.Total),\n        AvgOrder   = g.Average(o => o.Total)\n    })\n    .OrderByDescending(s => s.TotalSales);\n\nConsole.WriteLine(\"=== Sales by Region ===\");\nforeach (var s in regionSummaries)\n    Console.WriteLine($\"  {s.Region,-6}  orders={s.OrderCount}  total={s.TotalSales,9:C}  avg={s.AvgOrder:C}\");\n\n// --- Group by Category AND Region (composite key using anonymous type) ---\nvar categoryRegion = orders\n    .GroupBy(o => new { o.Category, o.Region })\n    .Select(g => new\n    {\n        g.Key.Category,\n        g.Key.Region,\n        Total = g.Sum(o => o.Total)\n    })\n    .OrderBy(r => r.Category)\n    .ThenBy(r => r.Region);\n\nConsole.WriteLine();\nConsole.WriteLine(\"=== Category + Region Breakdown ===\");\nforeach (var r in categoryRegion)\n    Console.WriteLine($\"  {r.Category,-10} {r.Region,-6}  {r.Total:C}\");\n\npublic record Order(\n    int Id,\n    int CustomerId,\n    string Region,\n    string Category,\n    decimal Total,\n    bool IsCompleted);"
    },
    {
      "kind": "output",
      "output": "=== Sales by Region ===\n  North   orders=3  total=$2,270.00  avg=$756.67\n  West    orders=1  total=$1,200.00  avg=$1,200.00\n  South   orders=2  total=  $680.00  avg=$340.00\n  East    orders=2  total=  $370.00  avg=$185.00\n\n=== Category + Region Breakdown ===\n  Hardware   East    $95.00\n  Hardware   North   $1,280.00\n  Services   East    $275.00\n  Services   North   $990.00\n  Software   South   $680.00\n  Software   West    $1,200.00",
      "label": "GroupBy output"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Python devs: GroupBy does NOT pre-sort",
      "text": "If you come from Python, `itertools.groupby` only groups **consecutive** elements with the same key — so you must `sorted()` the list first or you get duplicate groups. **C# `GroupBy` has no such restriction.** It hashes the keys and gathers all matching elements in one pass, regardless of their order in the source. You will never accidentally create two `\"North\"` groups in C# the way you can in Python. This also means C# `GroupBy` is generally O(n) — it is efficient even on large, unsorted collections."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Join — Matching Two Collections on a Shared Key",
      "id": "join"
    },
    {
      "kind": "paragraph",
      "text": "SQL developers reach for `JOIN` constantly. LINQ provides `Join` for an **inner join** (only elements that match on both sides appear in the result) and `GroupJoin` for a **left outer join** (all elements from the left side appear, with an empty group when there is no match). The syntax has four arguments: the second collection, a key selector for the *outer* sequence, a key selector for the *inner* sequence, and a *result selector* that assembles the final output from the matched pair."
    },
    {
      "kind": "paragraph",
      "text": "Notice in the data below that order 6 belongs to customer 104 (Delta Systems) but was placed from the **North** region — the order's region and the customer's home region are independent fields. Keeping that distinction in mind will help you read the join output correctly."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Join.cs",
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Globalization;\nusing System.Linq;\nusing System.Threading;\n\nThread.CurrentThread.CurrentCulture = new CultureInfo(\"en-US\");\n\nvar orders = new List<Order>\n{\n    new(1,  101, \"North\", \"Hardware\",  450.00m, true),\n    new(2,  102, \"South\", \"Software\",  120.00m, true),\n    new(3,  101, \"North\", \"Hardware\",  830.00m, true),\n    new(4,  103, \"East\",  \"Services\",  275.00m, false),\n    new(5,  102, \"South\", \"Software\",  560.00m, true),\n    new(6,  104, \"North\", \"Services\",  990.00m, true),   // order placed from North\n    new(7,  103, \"East\",  \"Hardware\",   95.00m, true),\n    new(8,  104, \"West\",  \"Software\", 1200.00m, false),\n};\n\nvar customers = new List<Customer>\n{\n    new(101, \"Acme Corp\",     \"North\"),\n    new(102, \"Beta Ltd\",      \"South\"),\n    new(103, \"Gamma Inc\",     \"East\"),\n    new(104, \"Delta Systems\", \"West\"),\n    new(105, \"Echo Tech\",     \"North\"),  // no orders — tests left-join behaviour\n};\n\n// --- Inner Join: orders matched to their customer name ---\nvar ordersWithCustomer = orders.Join(\n    customers,                              // inner sequence\n    o  => o.CustomerId,                     // outer key (from orders)\n    c  => c.Id,                             // inner key (from customers)\n    (o, c) => new                           // result selector\n    {\n        OrderId      = o.Id,\n        CustomerName = c.Name,\n        o.Region,     // the ORDER's region, not the customer's home region\n        o.Total\n    }\n);\n\nConsole.WriteLine(\"=== Orders with Customer Names ===\");\nforeach (var row in ordersWithCustomer.OrderBy(r => r.OrderId))\n    Console.WriteLine($\"  Order {row.OrderId}  {row.CustomerName,-15}  {row.Region,-6}  {row.Total:C}\");\n\n// --- GroupJoin (LEFT outer join): every customer, even those with no orders ---\nvar customerActivity = customers.GroupJoin(\n    orders,\n    c => c.Id,\n    o => o.CustomerId,\n    (c, customerOrders) => new\n    {\n        c.Name,\n        OrderCount = customerOrders.Count(),\n        TotalSpent = customerOrders.Sum(o => o.Total)\n    }\n).OrderByDescending(a => a.TotalSpent);\n\nConsole.WriteLine();\nConsole.WriteLine(\"=== Customer Activity (including zero-order customers) ===\");\nforeach (var a in customerActivity)\n    Console.WriteLine($\"  {a.Name,-15}  orders={a.OrderCount}  spent={a.TotalSpent:C}\");\n\npublic record Order(\n    int Id,\n    int CustomerId,\n    string Region,\n    string Category,\n    decimal Total,\n    bool IsCompleted);\n\npublic record Customer(int Id, string Name, string Region);"
    },
    {
      "kind": "output",
      "output": "=== Orders with Customer Names ===\n  Order 1  Acme Corp        North   $450.00\n  Order 2  Beta Ltd         South   $120.00\n  Order 3  Acme Corp        North   $830.00\n  Order 4  Gamma Inc        East    $275.00\n  Order 5  Beta Ltd         South   $560.00\n  Order 6  Delta Systems    North   $990.00\n  Order 7  Gamma Inc        East    $95.00\n  Order 8  Delta Systems    West    $1,200.00\n\n=== Customer Activity (including zero-order customers) ===\n  Delta Systems    orders=2  spent=$2,190.00\n  Acme Corp        orders=2  spent=$1,280.00\n  Beta Ltd         orders=2  spent=$680.00\n  Gamma Inc        orders=2  spent=$370.00\n  Echo Tech        orders=0  spent=$0.00",
      "label": "Join and GroupJoin output"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Combining Everything — A Real Reporting Pipeline",
      "id": "pipeline"
    },
    {
      "kind": "paragraph",
      "text": "Real-world LINQ queries rarely use just one operator. A typical business report filters, joins, groups, aggregates, and projects — all chained into one readable pipeline. The following example answers a question a product manager might actually ask: *\"Which regions generated more than \\$500 in completed software orders, ranked by revenue?\"* Notice how each step in the chain is narrow and easy to read in isolation."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Pipeline.cs",
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Globalization;\nusing System.Linq;\nusing System.Threading;\n\nThread.CurrentThread.CurrentCulture = new CultureInfo(\"en-US\");\n\nvar orders = new List<Order>\n{\n    new(1,  101, \"North\", \"Hardware\",  450.00m, true),\n    new(2,  102, \"South\", \"Software\",  120.00m, true),\n    new(3,  101, \"North\", \"Hardware\",  830.00m, true),\n    new(4,  103, \"East\",  \"Services\",  275.00m, false),\n    new(5,  102, \"South\", \"Software\",  560.00m, true),\n    new(6,  104, \"North\", \"Services\",  990.00m, true),\n    new(7,  103, \"East\",  \"Hardware\",   95.00m, true),\n    new(8,  104, \"West\",  \"Software\", 1200.00m, false),\n};\n\nvar customers = new List<Customer>\n{\n    new(101, \"Acme Corp\",     \"North\"),\n    new(102, \"Beta Ltd\",      \"South\"),\n    new(103, \"Gamma Inc\",     \"East\"),\n    new(104, \"Delta Systems\", \"West\"),\n    new(105, \"Echo Tech\",     \"North\"),\n};\n\nvar report = orders\n    // Step 1 — only completed software orders\n    .Where(o => o.IsCompleted && o.Category == \"Software\")\n    // Step 2 — join in the customer name\n    .Join(customers,\n          o => o.CustomerId,\n          c => c.Id,\n          (o, c) => new { c.Name, o.Region, o.Total })\n    // Step 3 — group by region\n    .GroupBy(x => x.Region)\n    // Step 4 — compute per-region aggregates\n    .Select(g => new\n    {\n        Region      = g.Key,\n        Revenue     = g.Sum(x => x.Total),\n        OrderCount  = g.Count(),\n        Customers   = g.Select(x => x.Name).Distinct().ToList()\n    })\n    // Step 5 — apply the business threshold\n    .Where(s => s.Revenue >= 500m)\n    // Step 6 — sort\n    .OrderByDescending(s => s.Revenue)\n    .ToList();   // <-- materialise ONCE, right at the end\n\nConsole.WriteLine(\"=== Completed Software Orders >= $500 by Region ===\");\nforeach (var row in report)\n{\n    var names = string.Join(\", \", row.Customers);\n    Console.WriteLine($\"  {row.Region,-6}  revenue={row.Revenue,9:C}  orders={row.OrderCount}  ({names})\");\n}\n\npublic record Order(\n    int Id,\n    int CustomerId,\n    string Region,\n    string Category,\n    decimal Total,\n    bool IsCompleted);\n\npublic record Customer(int Id, string Name, string Region);"
    },
    {
      "kind": "output",
      "output": "=== Completed Software Orders >= $500 by Region ===\n  South   revenue=  $680.00  orders=2  (Beta Ltd)",
      "label": "Pipeline output"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why only South appears",
      "text": "Let's trace the filter: completed software orders are orders 2 (`South`, $120) and 5 (`South`, $560). Order 8 is `Software` but `IsCompleted = false`, so it is excluded. The only region with completed software orders is South, with revenue $120 + $560 = $680 — which clears the $500 threshold. This is a good exercise to run mentally before trusting a pipeline: trace one record all the way through each step."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "ToLookup — The Faster Alternative When You Need Repeated Key Access",
      "id": "tolookup"
    },
    {
      "kind": "paragraph",
      "text": "`GroupBy` is perfect when you need to iterate over groups once. But if you need to **look up** a specific group many times (for example, finding all orders for a given customer ID inside a loop), doing repeated `GroupBy` is wasteful. `ToLookup` builds the groups **eagerly and once**, then stores them in a dictionary-like structure that supports O(1) key lookup. Think of `ILookup<TKey, TElement>` as a `Dictionary<TKey, List<TElement>>` that never throws on a missing key — it just returns an empty sequence."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Lookup.cs",
      "code": "using System;\nusing System.Collections.Generic;\nusing System.Globalization;\nusing System.Linq;\nusing System.Threading;\n\nThread.CurrentThread.CurrentCulture = new CultureInfo(\"en-US\");\n\nvar orders = new List<Order>\n{\n    new(1,  101, \"North\", \"Hardware\",  450.00m, true),\n    new(2,  102, \"South\", \"Software\",  120.00m, true),\n    new(3,  101, \"North\", \"Hardware\",  830.00m, true),\n    new(4,  103, \"East\",  \"Services\",  275.00m, false),\n    new(5,  102, \"South\", \"Software\",  560.00m, true),\n    new(6,  104, \"North\", \"Services\",  990.00m, true),\n    new(7,  103, \"East\",  \"Hardware\",   95.00m, true),\n    new(8,  104, \"West\",  \"Software\", 1200.00m, false),\n};\n\nvar customers = new List<Customer>\n{\n    new(101, \"Acme Corp\",     \"North\"),\n    new(102, \"Beta Ltd\",      \"South\"),\n    new(103, \"Gamma Inc\",     \"East\"),\n    new(104, \"Delta Systems\", \"West\"),\n    new(105, \"Echo Tech\",     \"North\"),\n};\n\n// Build the lookup ONCE\nILookup<int, Order> ordersByCustomer = orders.ToLookup(o => o.CustomerId);\n\n// Now look up any customer ID cheaply, as many times as needed\nforeach (var customer in customers)\n{\n    var custOrders = ordersByCustomer[customer.Id];  // O(1) lookup; empty if no orders\n    var total = custOrders.Sum(o => o.Total);\n    Console.WriteLine($\"{customer.Name,-15}  orders={custOrders.Count()}  total={total:C}\");\n}\n\n// Accessing a key that doesn't exist returns an empty sequence — no exception\nvar phantom = ordersByCustomer[9999];\nConsole.WriteLine($\"Orders for customer 9999: {phantom.Count()}\");\n\npublic record Order(\n    int Id,\n    int CustomerId,\n    string Region,\n    string Category,\n    decimal Total,\n    bool IsCompleted);\n\npublic record Customer(int Id, string Name, string Region);"
    },
    {
      "kind": "output",
      "output": "Acme Corp        orders=2  total=$1,280.00\nBeta Ltd         orders=2  total=$680.00\nGamma Inc        orders=2  total=$370.00\nDelta Systems    orders=2  total=$2,190.00\nEcho Tech        orders=0  total=$0.00\nOrders for customer 9999: 0",
      "label": "ToLookup output"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "GroupBy — use when…",
          "items": [
            "You need to **iterate** over all groups in sequence",
            "The grouping is **deferred** as part of a larger LINQ pipeline",
            "You are building up to a `.Select(g => new { g.Key, ... })` projection",
            "The query will run on `IQueryable<T>` (EF Core translates it to SQL `GROUP BY`)",
            "You only need the grouped result **once**"
          ]
        },
        {
          "title": "ToLookup — use when…",
          "items": [
            "You need **repeated random-access** by key inside a loop or method",
            "You want a **built-once, read-many** structure (like a cached dictionary of lists)",
            "You want safe key access — **no KeyNotFoundException** on missing keys",
            "The data is in memory and you want to **avoid re-running GroupBy** multiple times",
            "You are building a rule engine or report that joins two in-memory collections by ID"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Multiple Enumeration — the Silent Performance Killer",
      "text": "Because LINQ is **deferred**, holding an un-materialised `IEnumerable<T>` and iterating it more than once re-executes the pipeline every single time. When that pipeline is backed by a database `IQueryable<T>`, each iteration fires a new SQL query — potentially hundreds of round trips inside a loop. The fix is simple: call `.ToList()` or `.ToArray()` **once** at the boundary where you leave the data-access layer, then pass the concrete `List<T>` around. If you see `Count()` called on the same query that is then iterated in a `foreach`, that is a red flag: materialise first, then call `list.Count` (the O(1) property, not the LINQ method) on the resulting list."
    },
    {
      "kind": "examples",
      "intro": "Short self-contained snippets you can paste and run:",
      "examples": [
        {
          "label": "Aggregate with seed — running total",
          "code": "decimal[] payments = [150m, 200m, 75m, 300m];\ndecimal runningTotal = payments.Aggregate(0m, (acc, p) => acc + p);\nConsole.WriteLine(runningTotal);",
          "output": "725"
        },
        {
          "label": "GroupBy into a Dictionary",
          "code": "var words = new[] { \"apple\", \"avocado\", \"banana\", \"blueberry\", \"cherry\" };\nvar byFirstLetter = words\n    .GroupBy(w => w[0])\n    .ToDictionary(g => g.Key, g => g.ToList());\nforeach (var kvp in byFirstLetter)\n    Console.WriteLine($\"{kvp.Key}: {string.Join(\", \", kvp.Value)}\");",
          "output": "a: apple, avocado\nb: banana, blueberry\nc: cherry"
        },
        {
          "label": "Cross-join two lists (SelectMany)",
          "code": "var sizes   = new[] { \"S\", \"M\", \"L\" };\nvar colours = new[] { \"Red\", \"Blue\" };\nvar skus = sizes.SelectMany(s => colours, (s, c) => $\"{s}-{c}\");\nforeach (var sku in skus) Console.WriteLine(sku);",
          "output": "S-Red\nS-Blue\nM-Red\nM-Blue\nL-Red\nL-Blue"
        }
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**Aggregation methods** (`Sum`, `Average`, `Min`, `Max`, `Count`) collapse a sequence to a single value; `Aggregate` is the general reduce when none of the built-ins fit.",
        "**`GroupBy`** groups all elements sharing the same key into an `IGrouping<TKey, TElement>` — it does **not** require pre-sorted input (unlike Python's `itertools.groupby`).",
        "Combine `GroupBy` with `Select(g => new { g.Key, ... })` to project each group into a summary object, just like SQL `GROUP BY` with aggregate functions.",
        "**`Join`** performs an inner join on two sequences using matching key selectors; **`GroupJoin`** performs a left outer join, preserving all elements from the outer sequence even when no match exists.",
        "**`ToLookup`** is the right tool when you need to look up groups by key repeatedly — it is built eagerly once and returns an empty sequence (never throws) for missing keys.",
        "**LINQ is deferred**: the pipeline does not execute until you enumerate it (`foreach`, `ToList()`, `Count()`, `Any()`, etc.). Materialise with `.ToList()` at the right boundary — once, where you own the data context.",
        "Prefer **`Any(predicate)`** over `Count(predicate) > 0` for existence checks — `Any` short-circuits; `Count` always traverses the full sequence.",
        "Keep lambdas **pure** — no side effects, no mutation, no logging inside a LINQ chain. Deferred execution makes the timing of side effects unpredictable.",
        "In a C# **top-level program**, `record` and `class` declarations must appear **after** all top-level executable statements — put them at the bottom of the file.",
        "Use `Thread.CurrentThread.CurrentCulture = new CultureInfo(\"en-US\")` (or `CultureInfo.InvariantCulture`) when you need currency or number formatting to be consistent across all developer machines."
      ]
    }
  ]
};
