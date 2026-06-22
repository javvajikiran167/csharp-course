import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';
import { lesson08 } from './lesson-08';

export const genericsLinq: Topic = {
  slug: "generics-linq",
  title: "Generics & LINQ",
  subtitle: "Write reusable typed code with generics, then transform data with LINQ — the two features that define modern .NET style.",
  status: 'unlocked',
  lessons: [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06, lesson07, lesson08],
  quiz: [
  {
    "id": "generics-linq-q1",
    "kind": "mcq",
    "prompt": "You want to write a single method `Swap` that exchanges two variables of **any** type — `int`, `string`, `Customer`, whatever. Which signature is correct C# 14?",
    "options": [
      {
        "label": "`public void Swap(object a, object b) { var tmp = a; a = b; b = tmp; }`",
        "correct": false
      },
      {
        "label": "`public void Swap<T>(ref T a, ref T b) { var tmp = a; a = b; b = tmp; }`",
        "correct": true
      },
      {
        "label": "`public void Swap<T>(T a, T b) { var tmp = a; a = b; b = tmp; }`",
        "correct": false
      },
      {
        "label": "`public T Swap<T>(T a, T b) => (b, a);`",
        "correct": false
      }
    ],
    "explanation": "The `ref` keyword is essential: without it, `a` and `b` are local copies and the swap never affects the caller. Using `object` loses type safety — you'd need casting and get no compile-time guarantee. The tuple return form changes the method contract entirely. The correct version `public void Swap<T>(ref T a, ref T b)` is a classic generic method that works for any type without boxing or casting."
  },
  {
    "id": "generics-linq-q2",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "public class Stack<T>\n{\n    private readonly List<T> _items = new();\n    public void Push(T item) => _items.Add(item);\n    public T Pop()\n    {\n        var item = _items[^1];\n        _items.RemoveAt(_items.Count - 1);\n        return item;\n    }\n    public int Count => _items.Count;\n}\n\nvar s = new Stack<string>();\ns.Push(\"alpha\");\ns.Push(\"beta\");\ns.Push(\"gamma\");\nConsole.WriteLine(s.Pop());\nConsole.WriteLine(s.Count);",
    "options": [
      {
        "label": "alpha\n2",
        "correct": false
      },
      {
        "label": "gamma\n2",
        "correct": true
      },
      {
        "label": "gamma\n3",
        "correct": false
      },
      {
        "label": "alpha\n3",
        "correct": false
      }
    ],
    "explanation": "`Stack<T>` here is a last-in, first-out structure. After pushing alpha, beta, gamma the top is gamma. `Pop()` removes and returns the last element (`_items[^1]` is the C# index-from-end operator), so it returns `\"gamma\"`. After popping, two items remain (alpha and beta), so `Count` is `2`."
  },
  {
    "id": "generics-linq-q3",
    "kind": "mcq",
    "prompt": "A junior developer writes this generic repository interface:\n\n```csharp\npublic interface IRepository<T>\n{\n    Task<T?> GetByIdAsync(int id);\n    Task AddAsync(T entity);\n}\n```\n\nThe team wants to prevent callers from accidentally passing `int` or `bool` as `T`. Which constraint achieves that?",
    "options": [
      {
        "label": "`where T : struct`",
        "correct": false
      },
      {
        "label": "`where T : new()`",
        "correct": false
      },
      {
        "label": "`where T : class`",
        "correct": true
      },
      {
        "label": "`where T : IComparable<T>`",
        "correct": false
      }
    ],
    "explanation": "`where T : class` restricts `T` to reference types only, which means `int`, `bool`, `DateTime` (all value types / structs) are rejected at compile time. `where T : struct` is the opposite — it allows only value types. `where T : new()` only requires a public parameterless constructor and still allows structs. `where T : IComparable<T>` is about comparison capability, not reference vs value."
  },
  {
    "id": "generics-linq-q4",
    "kind": "mcq",
    "prompt": "You're writing a utility that finds the **maximum** element in any collection, and the elements must support comparison. Which constraint is the most appropriate?",
    "options": [
      {
        "label": "`where T : object`",
        "correct": false
      },
      {
        "label": "`where T : IComparable<T>`",
        "correct": true
      },
      {
        "label": "`where T : new()`",
        "correct": false
      },
      {
        "label": "`where T : class`",
        "correct": false
      }
    ],
    "explanation": "`where T : IComparable<T>` guarantees the compiler that `T` has a `CompareTo(T other)` method, which is exactly what you need to determine which element is larger. Without this constraint `T` is just `object` and you can't call `CompareTo` — the compiler will refuse to compile the call. `new()` is about construction, `class` is about reference types, and `object` is not a valid constraint keyword."
  },
  {
    "id": "generics-linq-q5",
    "kind": "fill",
    "prompt": "Complete the constraint so that `T` must be both a **reference type** AND have a **public parameterless constructor** (required for calling `new T()` inside the method):\n\n```csharp\npublic T CreateDefault<T>() where T : ___, new()\n{\n    return new T();\n}\n```",
    "template": "public T CreateDefault<T>() where T : ___, new()",
    "accept": [
      "class",
      "class, new()",
      "class,new()"
    ],
    "explanation": "`where T : class, new()` combines two constraints: `class` enforces a reference type and `new()` guarantees a public parameterless constructor. The `new()` constraint **must be listed last** when combined with other constraints. With both in place, `new T()` compiles and calling `CreateDefault<int>()` is rejected at compile time."
  },
  {
    "id": "generics-linq-q6",
    "kind": "predict",
    "prompt": "What does this LINQ pipeline print?",
    "code": "var orders = new[]\n{\n    new { Id = 1, Total = 250m,  Status = \"Completed\" },\n    new { Id = 2, Total = 80m,   Status = \"Pending\" },\n    new { Id = 3, Total = 430m,  Status = \"Completed\" },\n    new { Id = 4, Total = 150m,  Status = \"Completed\" },\n};\n\nvar result = orders\n    .Where(o => o.Status == \"Completed\")\n    .OrderByDescending(o => o.Total)\n    .Select(o => $\"#{o.Id}: {o.Total:C0}\")\n    .First();\n\nConsole.WriteLine(result);",
    "options": [
      {
        "label": "#1: $250",
        "correct": false
      },
      {
        "label": "#3: $430",
        "correct": true
      },
      {
        "label": "#4: $150",
        "correct": false
      },
      {
        "label": "#2: $80",
        "correct": false
      }
    ],
    "explanation": "The pipeline: (1) `Where` keeps only Completed orders — ids 1, 3, 4 with totals 250, 430, 150; (2) `OrderByDescending` sorts by Total descending — order is 430, 250, 150; (3) `Select` projects to formatted strings; (4) `First()` takes the first element, which is the highest total: `#3: $430`. The `C0` format specifier formats as currency with zero decimal places."
  },
  {
    "id": "generics-linq-q7",
    "kind": "mcq",
    "prompt": "Your Python colleague writes the following C# and expects it to print the names of users older than 30, but the list never seems to update. What is the **actual** output after the `Add` call?\n\n```csharp\nvar users = new List<(string Name, int Age)>\n{\n    (\"Alice\", 28),\n    (\"Bob\",   35),\n};\n\nvar query = users.Where(u => u.Age > 30);\nusers.Add((\"Carol\", 40));\n\nforeach (var u in query)\n    Console.WriteLine(u.Name);\n```",
    "options": [
      {
        "label": "Bob",
        "correct": false
      },
      {
        "label": "Bob\nCarol",
        "correct": true
      },
      {
        "label": "Alice\nBob\nCarol",
        "correct": false
      },
      {
        "label": "The code throws an InvalidOperationException.",
        "correct": false
      }
    ],
    "explanation": "This is the **deferred execution** feature. The `Where` call does NOT execute immediately — it creates a lazy pipeline that references `users`. When the `foreach` runs the query, `users` already contains Carol (added after the query was defined). Because LINQ iterates the current state of `users` at execution time, Carol IS included. The output is `Bob` then `Carol`. Python beginners expect immediate execution (like a list comprehension), but LINQ is lazy by design."
  },
  {
    "id": "generics-linq-q8",
    "kind": "mcq",
    "prompt": "Which LINQ method is the **most efficient** way to check whether any employee has a salary above $200,000?",
    "options": [
      {
        "label": "`employees.Where(e => e.Salary > 200_000).Count() > 0`",
        "correct": false
      },
      {
        "label": "`employees.Count(e => e.Salary > 200_000) > 0`",
        "correct": false
      },
      {
        "label": "`employees.Any(e => e.Salary > 200_000)`",
        "correct": true
      },
      {
        "label": "`employees.Select(e => e.Salary).Max() > 200_000`",
        "correct": false
      }
    ],
    "explanation": "`Any(predicate)` short-circuits: it stops iterating the moment it finds the first match and returns `true`. `Count()` must traverse **every** element and for `IQueryable<T>` this issues a `COUNT(*)` SQL query over the whole table. `Where().Count() > 0` is doubly wasteful — an intermediate iterator plus a full count. `Max()` also scans everything. `Any()` is the idiomatic, performant choice for existence checks."
  },
  {
    "id": "generics-linq-q9",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "int threshold = 100;\nvar prices = new[] { 50, 120, 80, 200, 95 };\n\nvar expensive = prices.Where(p => p > threshold);\n\nthreshold = 90;\n\nforeach (var p in expensive)\n    Console.Write(p + \" \");",
    "options": [
      {
        "label": "120 200 ",
        "correct": false
      },
      {
        "label": "120 80 200 95 ",
        "correct": false
      },
      {
        "label": "120 200 95 ",
        "correct": true
      },
      {
        "label": "50 120 80 200 95 ",
        "correct": false
      }
    ],
    "explanation": "This demonstrates the **variable capture pitfall**. The lambda `p => p > threshold` captures the **variable** `threshold`, not its value at query-definition time. By the time `foreach` executes the query, `threshold` has been reassigned to `90`. So the filter becomes `p > 90`, which matches 120, 200, and 95. The original value of 100 is irrelevant — the lambda reads `threshold`'s current value at execution time."
  },
  {
    "id": "generics-linq-q10",
    "kind": "mcq",
    "prompt": "You have a list of `Order` objects, each with a `CustomerId` and `Total`. You want to group orders by `CustomerId` and compute the total spent per customer. Which code is correct?",
    "options": [
      {
        "label": "```csharp\norders.GroupBy(o => o.CustomerId)\n      .Select(g => new { CustomerId = g.Key, TotalSpent = g.Sum(o => o.Total) })\n      .ToList();\n```",
        "correct": true
      },
      {
        "label": "```csharp\norders.GroupBy(o => o.CustomerId)\n      .Select(g => new { CustomerId = g, TotalSpent = g.Sum(o => o.Total) })\n      .ToList();\n```",
        "correct": false
      },
      {
        "label": "```csharp\norders.OrderBy(o => o.CustomerId)\n      .GroupBy(o => o.CustomerId)\n      .Select(g => g.Sum(o => o.Total))\n      .ToList();\n```",
        "correct": false
      },
      {
        "label": "```csharp\norders.GroupBy(o => o.CustomerId, o => o.Total)\n      .Select(g => new { CustomerId = g.Key, TotalSpent = g.Key })\n      .ToList();\n```",
        "correct": false
      }
    ],
    "explanation": "The correct pattern: `GroupBy(o => o.CustomerId)` produces `IEnumerable<IGrouping<int, Order>>` where each group's `.Key` is the `CustomerId`. Projecting with `.Select(g => new { CustomerId = g.Key, TotalSpent = g.Sum(o => o.Total) })` computes the sum for each group. Option B incorrectly uses `g` (the whole grouping) as the `CustomerId`. Option C omits `CustomerId` from the result and adds a redundant `OrderBy` (LINQ `GroupBy` does NOT require sorted input unlike Python's `itertools.groupby`). Option D reads `g.Key` as the `TotalSpent`, which would be the customer ID, not the sum."
  },
  {
    "id": "generics-linq-q11",
    "kind": "fill",
    "prompt": "Complete the LINQ query to return **only the names** of products that are in stock (`InStock == true`), sorted alphabetically:\n\n```csharp\nvar names = products\n    .Where(p => p.InStock)\n    .OrderBy(p => p.Name)\n    .___( p => p.Name)\n    .ToList();\n```",
    "template": ".___( p => p.Name)",
    "accept": [
      "Select",
      "select"
    ],
    "explanation": "`Select` is the LINQ projection operator — it transforms each element to a new shape, here extracting just the `Name` string. The pipeline reads: filter to in-stock products, sort by name, then project to strings. `Select` corresponds to Python's `map()` or the expression part of a list comprehension like `[p.Name for p in products if p.InStock]`."
  },
  {
    "id": "generics-linq-q12",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "var employees = new[]\n{\n    new { Name = \"Dana\",  Dept = \"Engineering\", Salary = 95000 },\n    new { Name = \"Eli\",   Dept = \"Marketing\",   Salary = 72000 },\n    new { Name = \"Fiona\", Dept = \"Engineering\", Salary = 110000 },\n    new { Name = \"Greg\",  Dept = \"Marketing\",   Salary = 68000 },\n};\n\nvar report = employees\n    .GroupBy(e => e.Dept)\n    .Select(g => $\"{g.Key}: avg={g.Average(e => e.Salary):F0}\")\n    .OrderBy(s => s);\n\nforeach (var line in report)\n    Console.WriteLine(line);",
    "options": [
      {
        "label": "Engineering: avg=102500\nMarketing: avg=70000",
        "correct": true
      },
      {
        "label": "Marketing: avg=70000\nEngineering: avg=102500",
        "correct": false
      },
      {
        "label": "Engineering: avg=205000\nMarketing: avg=140000",
        "correct": false
      },
      {
        "label": "Engineering: avg=102500.00\nMarketing: avg=70000.00",
        "correct": false
      }
    ],
    "explanation": "Engineering average: (95000 + 110000) / 2 = 102500. Marketing average: (72000 + 68000) / 2 = 70000. The `F0` format specifier rounds to zero decimal places (no `.00`). `OrderBy(s => s)` sorts the resulting strings alphabetically, so `\"Engineering...\"` comes before `\"Marketing...\"`. Output is two lines: `Engineering: avg=102500` then `Marketing: avg=70000`."
  },
  {
    "id": "generics-linq-q13",
    "kind": "mcq",
    "prompt": "A teammate writes the following code to find a user by email and then update their last-login date:\n\n```csharp\nvar user = users.FirstOrDefault(u => u.Email == email);\nuser.LastLoginDate = DateTime.UtcNow;\n```\n\nWhat is the **most serious problem** with this code?",
    "options": [
      {
        "label": "`FirstOrDefault` is slower than `SingleOrDefault` for this use case.",
        "correct": false
      },
      {
        "label": "If no user matches the email, `user` is `null` and `user.LastLoginDate = ...` throws a `NullReferenceException`.",
        "correct": true
      },
      {
        "label": "`DateTime.UtcNow` should be `DateTime.Now` to use local time.",
        "correct": false
      },
      {
        "label": "`FirstOrDefault` requires the collection to be sorted by email first.",
        "correct": false
      }
    ],
    "explanation": "`FirstOrDefault` returns `null` (for reference types) when no element matches — it does **not** throw. Accessing `.LastLoginDate` on a null reference immediately throws `NullReferenceException` at runtime. The fix is to guard: `if (user is null) return;` or use the null-conditional: `user?.LastLoginDate = DateTime.UtcNow;`. `FirstOrDefault` has nothing to do with sorting, and UTC vs local time is a design choice, not a bug. `SingleOrDefault` would actually throw if multiple users share the same email — a different and arguably worse problem."
  },
  {
    "id": "generics-linq-q14",
    "kind": "mcq",
    "prompt": "You are building a Sales Data Analyzer. This code is supposed to print a CSV report of the top 3 customers by total spend. What is the **bug**?\n\n```csharp\nvar records = File.ReadAllLines(\"sales.csv\")\n    .Skip(1)\n    .Select(line => line.Split(','))\n    .Select(cols => new { CustomerId = cols[0], Amount = decimal.Parse(cols[1]) });\n\nvar report = records\n    .GroupBy(r => r.CustomerId)\n    .Select(g => new { CustomerId = g.Key, Total = g.Sum(r => r.Amount) })\n    .OrderByDescending(c => c.Total)\n    .Take(3);\n\n// Print results\nConsole.WriteLine($\"Processed {records.Count()} records\");\nforeach (var c in report)\n    Console.WriteLine($\"{c.CustomerId},{c.Total}\");\n```",
    "options": [
      {
        "label": "`.Skip(1)` skips too many lines — it should be `.Skip(0)`.",
        "correct": false
      },
      {
        "label": "`decimal.Parse` will throw if any field contains whitespace.",
        "correct": false
      },
      {
        "label": "`records` is enumerated **twice**: once for `Count()` and once inside the `report` pipeline — the file is read and parsed twice.",
        "correct": true
      },
      {
        "label": "`.Take(3)` should come before `.OrderByDescending` to be efficient.",
        "correct": false
      }
    ],
    "explanation": "This is the **multiple enumeration** pitfall. `records` is a deferred LINQ pipeline that starts with `File.ReadAllLines`. Every time you enumerate `records`, it reads the file again, re-splits, and re-parses. Calling `records.Count()` causes one full enumeration, and then `report` (which references `records` internally via `GroupBy`) causes a second. Fix: call `records.ToList()` immediately after building the pipeline and use the list for both `Count` and `report`. `.Skip(1)` correctly skips the CSV header. `.Take(3)` after `OrderByDescending` is correct — you must sort before taking the top N."
  }
],
  practice: [
  {
    "id": "generics-linq-p1",
    "difficulty": "easy",
    "title": "Swap Two Values",
    "prompt": "Write a **generic method** `Swap<T>(ref T a, ref T b)` that exchanges the values of two variables without knowing their type. Call it with `int` values (swap 10 and 20), then with `string` values (swap \"hello\" and \"world\"). Print both pairs before and after the swap to confirm it works.\n\nConstraints:\n- One method signature handles all types — no overloads.\n- Use `ref` parameters so the caller's variables actually change.\n- No type constraints needed here.",
    "hints": [
      "A temporary variable `T temp = a;` is all you need inside the method.",
      "Call it like `Swap(ref x, ref y);` — the compiler infers `T` from the arguments.",
      "Notice you never write `Swap<int>(ref x, ref y)` — type inference removes the noise."
    ]
  },
  {
    "id": "generics-linq-p2",
    "difficulty": "easy",
    "title": "Generic Stack",
    "prompt": "Build a `Stack<T>` class that stores items in a `List<T>` field. Implement:\n- `void Push(T item)` — add to the top\n- `T Pop()` — remove and return the top item (throw `InvalidOperationException` with message `\"Stack is empty\"` if empty)\n- `T Peek()` — return the top item without removing it (same guard)\n- `int Count { get; }` — read-only property\n- `bool IsEmpty { get; }` — convenience property\n\nInstantiate a `Stack<string>` and push three job-queue task names onto it. Pop and print them in LIFO order. Then instantiate a `Stack<double>` with three sensor readings to confirm the same class works for a different type.",
    "hints": [
      "The 'top' of the stack is the last element in the list — index `_items.Count - 1`.",
      "Remove the top with `_items.RemoveAt(_items.Count - 1)` after reading the value.",
      "You do NOT need any type constraints — `T` can be anything because you are just storing and returning it, never calling methods on it."
    ]
  },
  {
    "id": "generics-linq-p3",
    "difficulty": "easy",
    "title": "Find the Minimum with a Constraint",
    "prompt": "Write a **generic method** `FindMin<T>(IEnumerable<T> items)` that returns the smallest element in any collection, for any type that supports comparison.\n\nRequirements:\n- Apply the constraint `where T : IComparable<T>` so the compiler knows `T` has a `CompareTo` method.\n- Throw `ArgumentException` with a meaningful message if the collection is empty.\n- Do **not** use `LINQ Min()` — implement the loop yourself.\n\nTest it with three scenarios:\n1. A `List<int>` of five product prices (integers).\n2. A `string[]` of five city names — `IComparable<T>` on strings uses alphabetical order.\n3. A `List<DateTime>` of five appointment dates — return the earliest.\n\nPrint the minimum for each.",
    "hints": [
      "Initialize `T min = items.First();` then loop over the rest with `if (item.CompareTo(min) < 0) min = item;`.",
      "Convert the enumerable to a list or use a `bool foundFirst` flag to handle the first element.",
      "The constraint is what allows you to call `a.CompareTo(b)` — without it the compiler rejects the call because unconstrained `T` only exposes `object` members."
    ]
  },
  {
    "id": "generics-linq-p4",
    "difficulty": "easy",
    "title": "LINQ Basics — Employee Filter Pipeline",
    "prompt": "Given this record:\n```csharp\npublic record Employee(string Name, string Department, decimal Salary, bool IsActive);\n```\nCreate a hard-coded `List<Employee>` with at least eight employees across three departments (Engineering, Marketing, HR), a mix of active/inactive, and salaries ranging from 40 000 to 120 000.\n\nWrite **four separate LINQ queries** (method syntax, not query syntax) and print the results of each:\n1. **Active employees only** — `Where` on `IsActive`.\n2. **Just the names** of active employees, sorted A→Z — chain `Where`, `Select`, `OrderBy`.\n3. **The highest-paid active employee** — use `OrderByDescending` + `FirstOrDefault`, then null-guard the result.\n4. **Count of active employees in Engineering** — chain `Where` twice (or combine predicates with `&&`) then `Count()`.\n\nPrint a labeled header before each result.",
    "hints": [
      "Method syntax: `employees.Where(e => e.IsActive).Select(e => e.Name).OrderBy(n => n)`.",
      "For query 3, always check `if (result is null)` before accessing `.Name` — `FirstOrDefault` returns null when nothing matches.",
      "Two conditions in one `Where` is cleaner than chaining two `Where` calls: `Where(e => e.IsActive && e.Department == \"Engineering\")`."
    ]
  },
  {
    "id": "generics-linq-p5",
    "difficulty": "medium",
    "title": "LINQ Query Syntax — Order Report",
    "prompt": "Given these records:\n```csharp\npublic record Customer(int Id, string Name, string City);\npublic record Order(int Id, int CustomerId, decimal Amount, DateTime PlacedOn);\n```\nCreate at least six customers and twelve orders spread across them. Some customers should have multiple orders; at least one customer should have no orders at all.\n\nWrite the following queries using **query syntax** (`from … in … where … select …`):\n1. A **join query** that pairs each order with its customer's name and city, keeping only orders placed in the last 180 days.\n2. A **group query** that groups orders by customer name and projects `{ CustomerName, OrderCount, TotalSpent }` — include only groups where `TotalSpent > 500`.\n\nThen rewrite **query 1 only** in method syntax and confirm the output is identical.\n\nDiscuss in a code comment (two sentences) when you would prefer query syntax over method syntax.",
    "hints": [
      "Query syntax join: `from o in orders join c in customers on o.CustomerId equals c.Id where o.PlacedOn >= cutoff select new { ... }`.",
      "For the group query: `from o in orders group o by o.CustomerId into g where g.Sum(o => o.Amount) > 500 select new { ... }` — you need `into` to reference the group.",
      "Method syntax equivalent of join: `orders.Join(customers, o => o.CustomerId, c => c.Id, (o, c) => new { ... }).Where(x => x.PlacedOn >= cutoff)`.",
      "Query syntax shines when joins and group-into clauses are involved — it reads closer to SQL. Method syntax is preferred for simple pipelines."
    ]
  },
  {
    "id": "generics-linq-p6",
    "difficulty": "medium",
    "title": "GroupBy, Aggregation & Projection",
    "prompt": "You have sales data:\n```csharp\npublic record Sale(string Region, string Product, int UnitsSold, decimal UnitPrice, DateTime SaleDate);\n```\nCreate a hard-coded `List<Sale>` with at least fifteen entries across three regions (North, South, West) and four products.\n\nWrite LINQ queries (method syntax) to produce:\n1. **Per-region summary** — for each region: `RegionName`, `TotalRevenue` (UnitsSold × UnitPrice summed), `BestSellingProduct` (product with highest total units in that region). Order by `TotalRevenue` descending.\n2. **Monthly trend** — group by year+month (`new { sale.SaleDate.Year, sale.SaleDate.Month }`), output `{ Month (\"yyyy-MM\"), TotalRevenue }` sorted chronologically.\n3. **Top 3 products by total units sold** across all regions — use `GroupBy` → `Select` → `OrderByDescending` → `Take(3)`.\n\nPrint each report with clear headers and formatted numbers (`TotalRevenue:C2` for currency).",
    "hints": [
      "Revenue per sale: `s.UnitsSold * s.UnitPrice`. Use `.Sum(s => s.UnitsSold * s.UnitPrice)` inside the group projection.",
      "For BestSellingProduct inside a region group, you need a nested GroupBy: `g.GroupBy(s => s.Product).OrderByDescending(pg => pg.Sum(s => s.UnitsSold)).First().Key`.",
      "Format month as string inside Select: `$\"{g.Key.Year:D4}-{g.Key.Month:D2}\"`.",
      "Remember: `GroupBy` returns `IEnumerable<IGrouping<TKey, TElement>>`. The group's key is `.Key` and the elements are iterable directly."
    ]
  },
  {
    "id": "generics-linq-p7",
    "difficulty": "medium",
    "title": "Deferred Execution Trap",
    "prompt": "This exercise is designed to make deferred execution **visible** through deliberate experiments. You will write code that demonstrates each of the following scenarios, print what actually happens, and add a comment explaining why:\n\n**Scenario A — Variable capture:** Build a query `var q = numbers.Where(n => n > threshold)` where `threshold = 10`. Print the count. Then change `threshold = 5` and print the count again without rebuilding the query. Observe the difference.\n\n**Scenario B — Multiple enumeration cost:** Create a list of 5 integers. Build a deferred query. Use a `Select` lambda that prints `\"Processing {n}\"` as a side effect AND returns `n * 2`. Enumerate with `foreach` twice. Count how many times \"Processing\" prints — then fix it by materializing with `ToList()` and confirm the processing messages appear only once.\n\n**Scenario C — Source mutation:** Build a deferred query on a `List<string>`. Iterate once (print results). Add a new element to the list. Iterate the same query variable again. Show that the new element appears in the second iteration.\n\nFor each scenario write a `// WHY:` comment explaining the behaviour in one sentence.",
    "hints": [
      "Scenario A: the lambda closes over the `threshold` variable itself, not a copy of its value at query-creation time. Change the variable, change the filter.",
      "Scenario B: every `foreach` re-runs the pipeline from scratch. `ToList()` snapshots the results so subsequent iterations read from the list, not the pipeline.",
      "Scenario C: the query holds a reference to the original list object. When you add to the list, the query sees the addition because it re-reads the list each time it runs.",
      "Avoid side effects in production lambdas — this exercise uses them intentionally to make the invisible visible."
    ]
  },
  {
    "id": "generics-linq-p8",
    "difficulty": "medium",
    "title": "Generic Repository Interface",
    "prompt": "Design and implement a **generic in-memory repository** that could slot into a real ASP.NET Core application.\n\nSteps:\n1. Define a marker interface `IEntity` with a single property `int Id { get; }`.\n2. Define `IRepository<T> where T : class, IEntity` with methods:\n   - `void Add(T entity)`\n   - `T? GetById(int id)`\n   - `IReadOnlyList<T> GetAll()`\n   - `IReadOnlyList<T> Find(Func<T, bool> predicate)`\n   - `void Update(T entity)` — replace the stored entity that has the same `Id`\n   - `bool Delete(int id)` — return `true` if found and removed, `false` if not found\n3. Implement `InMemoryRepository<T>` backed by a `List<T>`.\n4. Create two entity types: `Product(int Id, string Name, decimal Price)` and `Customer(int Id, string Name, string Email)`, both implementing `IEntity`.\n5. Add five products and four customers to separate repository instances. Demonstrate `GetById`, `Find`, `Update`, and `Delete` on each, printing before/after state.\n\nThe constraint `where T : class, IEntity` is load-bearing — explain in a comment why both parts are needed.",
    "hints": [
      "`where T : class` ensures `T` is a reference type so `GetById` can return `T?` (nullable reference). Without it, returning null for a missing value type would not compile.",
      "`where T : IEntity` ensures every `T` has an `Id` property, which `GetById` and `Update` rely on.",
      "For `Update`, use `int idx = _items.FindIndex(e => e.Id == entity.Id); if (idx >= 0) _items[idx] = entity;`.",
      "The `Find` method with `Func<T, bool>` predicate is the in-memory equivalent of EF Core's `Where` — callers pass any lambda they want."
    ]
  },
  {
    "id": "generics-linq-p9",
    "difficulty": "hard",
    "title": "LINQ Pipeline — Sales Data Analyzer (Mini-Project)",
    "prompt": "Build a **console application** that reads a CSV file, analyzes the data with LINQ, and prints a formatted report. This simulates a real business-data tool.\n\n**The CSV** (`sales.csv`) has this header and at least 20 data rows you create:\n```\nOrderId,CustomerId,CustomerName,Region,Product,Category,Quantity,UnitPrice,OrderDate,Status\n```\nStatuses are: `Completed`, `Pending`, `Cancelled`. Include a mix.\n\n**Step 1 — Load:** Read the file with `File.ReadAllLines`, skip the header, split on comma, and parse into a `List<SaleRecord>` (define the record yourself). Parse `Quantity` as `int`, `UnitPrice` as `decimal`, `OrderDate` as `DateTime`.\n\n**Step 2 — Clean:** Filter out `Cancelled` orders before any analysis.\n\n**Step 3 — Report** (all LINQ, method syntax):\n- **A. Summary stats:** total orders, total revenue, average order value, largest single order (print customer + amount).\n- **B. Revenue by Category** — sorted descending, formatted as currency.\n- **C. Top 5 Customers by Revenue** — `CustomerId`, `CustomerName`, total spent, order count.\n- **D. Monthly revenue trend** — group by `yyyy-MM`, sorted chronologically.\n- **E. Pending orders** — list them with days since order date (`(DateTime.Today - o.OrderDate).Days`).\n\n**Step 4 — Edge cases:** If the file is not found, print a friendly error and exit. If a row fails to parse, skip it and count skipped rows; report the count at the end.\n\nAll output must be neatly formatted with headers, separators, and aligned columns.",
    "hints": [
      "Use a `try-catch` inside the row-parsing loop (or `TryParse` for each field) to handle malformed rows gracefully without crashing.",
      "Revenue = `Quantity * UnitPrice`. Compute it inside `Select` as an anonymous-type property so downstream operators can reuse it without recalculating.",
      "Group by month: `.GroupBy(s => new { s.OrderDate.Year, s.OrderDate.Month }).Select(g => new { Month = $\"{g.Key.Year:D4}-{g.Key.Month:D2}\", Revenue = g.Sum(...) }).OrderBy(x => x.Month)`.",
      "For Top 5 Customers, group by `CustomerId`, project `{ CustomerId, CustomerName = g.First().CustomerName, TotalSpent, OrderCount }`, then `OrderByDescending` + `Take(5)`.",
      "Materialize to `List<SaleRecord>` right after loading and cleaning — all five report queries run against that list in memory, so multiple enumeration is not a problem and you avoid re-reading the file."
    ]
  },
  {
    "id": "generics-linq-p10",
    "difficulty": "hard",
    "title": "Generic Result<T> Type with LINQ Integration",
    "prompt": "Many professional .NET teams replace thrown exceptions for **expected failures** with a `Result<T>` type that explicitly carries either a success value or an error message. Build one and integrate it with LINQ.\n\n**Part 1 — Define `Result<T>`:**\n- A generic struct (value type for zero-allocation) with:\n  - `bool IsSuccess`\n  - `T? Value` (valid when `IsSuccess` is true)\n  - `string? Error` (valid when `IsSuccess` is false)\n  - Static factory methods: `Result<T>.Ok(T value)` and `Result<T>.Fail(string error)`\n  - A `Match<TOut>(Func<T, TOut> onSuccess, Func<string, TOut> onFailure)` method\n- Apply constraint `where T : notnull` on the struct and on `Ok`.\n\n**Part 2 — A validation pipeline using LINQ:**\nDefine a `Product` record with `Name`, `Price` (decimal), and `StockQuantity` (int). Write a method:\n```csharp\nstatic Result<Product> ValidateProduct(Product p)\n```\nthat returns `Fail` if: name is null/empty, price ≤ 0, or stock < 0; otherwise returns `Ok(p)`.\n\n**Part 3 — Batch processing with LINQ:**\nCreate a `List<Product>` with 10 products — deliberately include 3 invalid ones. Use LINQ to:\n1. Call `ValidateProduct` on each — project to `IEnumerable<Result<Product>>`.\n2. Separate into `validProducts` and `failures` using two `Where` + `Select` chains.\n3. Print valid products (formatted) and failure messages.\n4. Compute average price of valid products only.\n\n**Part 4 — Chain Results:**\nWrite a method `EnrichProduct(Product p)` that fetches a fake \"supplier name\" (just string-concat for simulation) and returns `Result<EnrichedProduct>`. Chain it: for each valid product from Part 3, call `EnrichProduct` inside a `Select`, then filter to only the successful enrichments. This simulates a real pipeline where each step can independently fail.",
    "hints": [
      "Struct with `where T : notnull`: `public readonly struct Result<T> where T : notnull { ... }`. The `notnull` constraint prevents `Result<int?>` or `Result<string?>` as the success type.",
      "For `Value` on the struct, use `T? Value` — even with `notnull`, adding `?` to the field allows it to hold null in the failure case (this requires `#nullable enable`).",
      "Separate valid/failed: `var valid = results.Where(r => r.IsSuccess).Select(r => r.Value!).ToList();` — the `!` null-forgiving operator is safe here because `IsSuccess` guarantees `Value` is set.",
      "Chain in Part 4: `validProducts.Select(p => EnrichProduct(p)).Where(r => r.IsSuccess).Select(r => r.Value!).ToList()`.",
      "The `Match` method eliminates if/else on `IsSuccess`: `result.Match(p => $\"OK: {p.Name}\", err => $\"ERR: {err}\")`."
    ]
  }
],
  projects: [
  {
    "id": "generics-linq-proj-1",
    "difficulty": "starter",
    "title": "Generic Inventory Filter Library",
    "brief": "Build a small reusable utility library of generic methods and a generic `Repository<T>` class that can store, retrieve, and filter any product-like entity. Students practice writing their first generic methods, applying type constraints, and chaining basic LINQ operators (Where, Select, OrderBy, FirstOrDefault) against an in-memory collection.",
    "requirements": [
      "Define a `Product` record with `Id`, `Name`, `Price` (decimal), `Category` (string), and `StockQuantity` (int).",
      "Write a generic method `T? FindFirst<T>(IEnumerable<T> source, Func<T, bool> predicate)` that returns the first match or null/default — without using LINQ's own `FirstOrDefault` internally.",
      "Write a generic method `IReadOnlyList<T> Filter<T>(IEnumerable<T> source, Func<T, bool> predicate)` that returns a materialized list of all matches.",
      "Write a generic method `IReadOnlyList<T> SortBy<T, TKey>(IEnumerable<T> source, Func<T, TKey> keySelector) where TKey : IComparable<TKey>` that returns elements in ascending order.",
      "Build a generic class `InMemoryRepository<T>` with methods `Add(T item)`, `Remove(Func<T, bool> predicate)`, `GetAll()`, and `Query(Func<T, bool> predicate)` returning `IReadOnlyList<T>`.",
      "Seed the repository with at least 10 `Product` instances across at least 3 categories.",
      "Use LINQ method syntax (Where, Select, OrderBy, FirstOrDefault) in a `InventoryReport` class that produces: (a) all products under a given price threshold, (b) product names sorted alphabetically within each category, (c) the most expensive product in a given category.",
      "Print a formatted console report showing all three query results with clear labels."
    ],
    "stretch": [
      "Add a generic method `TResult Reduce<T, TResult>(IEnumerable<T> source, TResult seed, Func<TResult, T, TResult> accumulator)` and use it to compute the total inventory value (price * stock quantity) without calling LINQ's `Sum` or `Aggregate`.",
      "Add a second entity type `Supplier` (Id, Name, ContactEmail, ProductIds: List<int>) and prove the same `InMemoryRepository<T>` works for it without any changes to the repository class.",
      "Add a `where T : IEquatable<T>` constraint to `FindFirst` and demonstrate that it correctly finds structs by value equality, not just reference equality.",
      "Implement `nameof(InMemoryRepository<>)` (C# 14) in a logging helper that prints the unbound generic name for diagnostics."
    ],
    "concepts": [
      "generic methods",
      "generic classes",
      "type constraints",
      "IComparable<T>",
      "IEquatable<T>",
      "Func<T, TResult>",
      "LINQ Where",
      "LINQ Select",
      "LINQ OrderBy",
      "LINQ FirstOrDefault",
      "deferred execution",
      "ToList materialization",
      "in-memory repository pattern"
    ]
  },
  {
    "id": "generics-linq-proj-2",
    "difficulty": "intermediate",
    "title": "Sales Data Analyzer — CSV Report Engine",
    "brief": "Build a console application that reads a CSV file of sales transactions, models the data with generic types, and produces a multi-section business report using advanced LINQ operators (GroupBy, Join, aggregation, SelectMany). The finished tool reads, transforms, and summarizes real-world shaped data the way a junior .NET developer would in a commercial BI or ERP system.",
    "requirements": [
      "Define records `SaleTransaction` (Id, Date, CustomerId, CustomerName, Region, ProductName, Category, UnitPrice, Quantity) and `Customer` (Id, Name, Region, Tier: enum Bronze/Silver/Gold).",
      "Write a generic `CsvParser<T>` class with a method `IReadOnlyList<T> Parse(string filePath, Func<string[], T> rowMapper)` that reads the file, skips the header, and maps each line using the provided delegate — keeping the parser itself ignorant of any specific type.",
      "Generate (in code, not a real file) at least 30 `SaleTransaction` seed records spanning 3 regions, 4 categories, and 10 distinct customers, then write them to a temp CSV and parse them back through `CsvParser<SaleTransaction>` to prove the round-trip works.",
      "Produce Report Section 1 — Regional Summary: use GroupBy + aggregation to show each region's total revenue, order count, and average order value, sorted by total revenue descending.",
      "Produce Report Section 2 — Top Products per Category: for each category, find the top 3 products by total units sold using GroupBy, OrderByDescending, and Take.",
      "Produce Report Section 3 — Customer Tier Leaderboard: Join the transaction list with a hardcoded list of `Customer` objects; group by customer tier; within each tier list the top 2 customers by spend.",
      "Produce Report Section 4 — Month-over-Month Revenue: group transactions by year-month (use `new { t.Date.Year, t.Date.Month }` as the key), order chronologically, and display revenue for each month.",
      "All four report sections must be computed with LINQ method syntax; no raw loops for aggregation logic.",
      "Guard every `FirstOrDefault` / `SingleOrDefault` call with a null check and a meaningful fallback message.",
      "Write the final report to both the console and a plain-text file `sales-report.txt` in the working directory."
    ],
    "stretch": [
      "Extract a generic `IPipelineStage<TIn, TOut>` interface and implement two stages — `FilterStage<T>` and `ProjectionStage<TIn, TOut>` — then chain them to build one of the report sections without calling LINQ directly in `Program.cs`.",
      "Add a `Result<T>` generic type (with `IsSuccess`, `Value`, `ErrorMessage`) and wrap `CsvParser<T>.Parse` so that malformed rows produce a `Result<T>.Failure` instead of throwing an exception; report how many rows were skipped and why.",
      "Detect and warn about multiple enumeration: refactor one report query that you intentionally wrote to enumerate a source twice, add a comment explaining why it's a bug, then fix it with a single `.ToList()` call and verify the output is identical.",
      "Add an `IAsyncEnumerable<T>` streaming variant of `CsvParser<T>` that yields parsed rows one at a time, and use `await foreach` with a LINQ-style filter (use `System.Linq.Async` or manual async iteration) to stream only high-value transactions above a threshold."
    ],
    "concepts": [
      "generic classes with delegate type parameters",
      "Func<TIn, TOut> as a mapper",
      "LINQ GroupBy",
      "LINQ Join",
      "LINQ aggregation (Sum, Average, Count)",
      "LINQ OrderByDescending",
      "LINQ Take",
      "LINQ SelectMany",
      "anonymous types as group keys",
      "deferred execution",
      "multiple enumeration pitfall",
      "ToList materialization boundary",
      "FirstOrDefault null guard",
      "SingleOrDefault vs FirstOrDefault",
      "IQueryable vs IEnumerable awareness",
      "CSV parsing with generics",
      "reporting pipelines"
    ]
  }
],
};
