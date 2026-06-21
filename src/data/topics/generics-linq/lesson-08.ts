import type { Lesson } from '@/data/types';

export const lesson08: Lesson = {
  "slug": "mini-project-linq",
  "number": 8,
  "title": "Mini-Project — Sales Data Analyzer",
  "objective": "Load a CSV, query it with LINQ, output a report.",
  "blocks": [
    {
      "kind": "lead",
      "text": "You have learned the vocabulary — generics, constraints, `Where`, `Select`, `GroupBy`, deferred execution. Now you are going to **build something real**: a command-line Sales Data Analyzer that reads a CSV file, uses LINQ to answer six business questions, and prints a formatted report. By the end of this project, the gap between \"I understand LINQ\" and \"I can ship LINQ\" will be closed."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "This mini-project is intentionally structured as a realistic junior-developer task — reading files, parsing, querying, formatting output — so students feel the payoff of everything taught in lessons 4–7.",
        "Walk through the domain model first so the data relationships are clear before any LINQ appears.",
        "Emphasize the parse-once, query-many pattern: load all records into a List<SaleRecord> up front, then every LINQ query runs against that in-memory list — no file re-reads.",
        "Each of the six business questions maps directly to a LINQ concept taught earlier. Point out the mapping explicitly as you go.",
        "The IEnumerable<T> vs IQueryable<T> distinction doesn't apply here (no EF Core), but note that the same LINQ methods students write today transfer directly to EF Core queries.",
        "If students finish early, the extension challenges at the end make excellent self-study or pair-programming exercises.",
        "Target runtime: .NET 10 console app, top-level statements, no external NuGet packages needed."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Project Overview",
      "id": "project-overview"
    },
    {
      "kind": "paragraph",
      "text": "Imagine you are a junior developer at a retail company. The sales team exports a CSV every month. Your job is to write a tool that ingests the file and produces a summary report answering six questions that management cares about. There is no database, no web API — just a file, your C# code, and LINQ. This is one of the most common real-world C# tasks you will encounter in your first year on the job."
    },
    {
      "kind": "paragraph",
      "text": "The finished program will accept a CSV path as a command-line argument, parse each row into a strongly-typed `SaleRecord` object, and then answer the following questions using LINQ chains:"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "What is the **total revenue** across all sales?",
        "Which **product** generated the most revenue?",
        "What are the **top 3 sales reps** by total revenue?",
        "What is the **monthly revenue breakdown** (month → total)?",
        "Which **region** has the highest **average order value**?",
        "How many sales were **above $500** (\"high-value\" threshold)?"
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Step 1 — Create the Project and Sample Data",
      "id": "step-1-setup"
    },
    {
      "kind": "code",
      "language": "bash",
      "code": "dotnet new console -n SalesAnalyzer\ncd SalesAnalyzer"
    },
    {
      "kind": "paragraph",
      "text": "Create a file called `sales.csv` in the project folder with the following content. You can paste this directly — it contains 20 rows that cover multiple products, reps, regions, and months, giving every LINQ query something interesting to work with."
    },
    {
      "kind": "code",
      "language": "text",
      "filename": "sales.csv",
      "code": "Date,Product,Region,SalesRep,Amount\n2025-01-05,Widget A,North,Alice,320.00\n2025-01-12,Widget B,South,Bob,850.00\n2025-01-18,Gadget X,East,Carol,1200.00\n2025-02-03,Widget A,West,Dave,490.00\n2025-02-14,Gadget X,North,Alice,975.00\n2025-02-22,Widget B,South,Bob,340.00\n2025-03-01,Gadget Y,East,Carol,620.00\n2025-03-09,Widget A,West,Dave,150.00\n2025-03-15,Gadget X,North,Alice,1540.00\n2025-03-28,Widget B,South,Eve,290.00\n2025-04-04,Gadget Y,East,Carol,780.00\n2025-04-11,Widget A,North,Alice,510.00\n2025-04-19,Gadget X,West,Dave,930.00\n2025-04-25,Widget B,South,Bob,660.00\n2025-05-06,Gadget Y,East,Carol,420.00\n2025-05-13,Widget A,North,Eve,875.00\n2025-05-20,Gadget X,South,Bob,1100.00\n2025-05-27,Widget B,West,Dave,540.00\n2025-06-03,Gadget Y,North,Alice,390.00\n2025-06-10,Widget A,East,Carol,720.00"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Step 2 — Model the Data with a Record",
      "id": "step-2-model"
    },
    {
      "kind": "paragraph",
      "text": "Before writing any LINQ, define **what a sale is**. In C# you model data shapes with classes or records. A `record` is perfect here — it is immutable (sales records from a file should not change in memory), concise, and gives you structural equality for free. Think of it as a Python `dataclass` with `frozen=True`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "SaleRecord.cs",
      "code": "namespace SalesAnalyzer;\n\n/// <summary>One row from the CSV, parsed into strong types.</summary>\npublic record SaleRecord(\n    DateOnly Date,\n    string Product,\n    string Region,\n    string SalesRep,\n    decimal Amount\n);"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Why decimal, not double, for money?",
      "text": "Always use `decimal` for currency values in .NET. `double` is a binary floating-point type — it cannot represent 0.1 exactly and will silently accumulate rounding errors in financial calculations. `decimal` is a base-10 type designed for money. This is one of those rules that every senior .NET developer will enforce in code review without exception."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Step 3 — Parse the CSV",
      "id": "step-3-parse"
    },
    {
      "kind": "paragraph",
      "text": "Real projects use a library like **CsvHelper** for production CSV parsing (it handles quoting, escaping, and encoding edge cases). For this project, we will write a simple manual parser so you can see exactly what is happening — and so you do not need a NuGet package. The parsing logic lives in a static helper class to keep `Program.cs` clean."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CsvParser.cs",
      "code": "namespace SalesAnalyzer;\n\npublic static class CsvParser\n{\n    /// <summary>\n    /// Reads every non-header row from a CSV file and returns a list of\n    /// strongly-typed <see cref=\"SaleRecord\"/> objects.\n    /// Skips blank lines and rows that cannot be parsed.\n    /// </summary>\n    public static List<SaleRecord> Load(string filePath)\n    {\n        if (!File.Exists(filePath))\n            throw new FileNotFoundException($\"CSV file not found: {filePath}\");\n\n        var records = new List<SaleRecord>();\n\n        // File.ReadLines is lazy — it doesn't load the whole file into memory at once.\n        // Skip(1) skips the header row.\n        foreach (var line in File.ReadLines(filePath).Skip(1))\n        {\n            if (string.IsNullOrWhiteSpace(line)) continue;\n\n            var parts = line.Split(',');\n            if (parts.Length != 5) continue;  // malformed row — skip gracefully\n\n            if (!DateOnly.TryParse(parts[0].Trim(), out var date))    continue;\n            if (!decimal.TryParse(parts[4].Trim(), out var amount))   continue;\n\n            records.Add(new SaleRecord(\n                Date:     date,\n                Product:  parts[1].Trim(),\n                Region:   parts[2].Trim(),\n                SalesRep: parts[3].Trim(),\n                Amount:   amount\n            ));\n        }\n\n        return records;\n    }\n}"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Parse once, query many",
      "text": "Notice that `Load()` returns a `List<SaleRecord>` — a fully materialized, in-memory collection. Every LINQ query in the next step runs against this list. We parse the file **once** and never touch it again. This is the correct pattern for file-based data: load, validate, materialize, query."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Step 4 — Answer the Six Business Questions with LINQ",
      "id": "step-4-linq"
    },
    {
      "kind": "paragraph",
      "text": "Now comes the heart of the project. Open `Program.cs` and replace its contents with the code below. Read every LINQ chain carefully — each one is annotated so you can see which lesson concept it uses."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using SalesAnalyzer;\n\n// ── Entry point ──────────────────────────────────────────────────────────────\nif (args.Length == 0)\n{\n    Console.WriteLine(\"Usage: dotnet run -- <path-to-sales.csv>\");\n    return;\n}\n\nvar filePath = args[0];\nList<SaleRecord> sales = CsvParser.Load(filePath);\n\nif (sales.Count == 0)\n{\n    Console.WriteLine(\"No records found in the file.\");\n    return;\n}\n\nConsole.WriteLine($\"\\n=== Sales Data Analyzer — {sales.Count} records loaded ===\");\nConsole.WriteLine(new string('─', 52));\n\n// ── Q1: Total revenue ────────────────────────────────────────────────────────\n// Lesson concept: Sum() — aggregate over a projected numeric property\ndecimal totalRevenue = sales.Sum(s => s.Amount);\nConsole.WriteLine($\"\\n[1] Total Revenue:  {totalRevenue:C}\");\n\n// ── Q2: Top product by revenue ───────────────────────────────────────────────\n// Lesson concept: GroupBy → project to anonymous type → OrderByDescending → First()\nvar topProduct = sales\n    .GroupBy(s => s.Product)\n    .Select(g => new { Product = g.Key, Revenue = g.Sum(s => s.Amount) })\n    .OrderByDescending(x => x.Revenue)\n    .First();  // safe — we know sales is non-empty\n\nConsole.WriteLine($\"\\n[2] Top Product:    {topProduct.Product} ({topProduct.Revenue:C})\");\n\n// ── Q3: Top 3 sales reps by revenue ──────────────────────────────────────────\n// Lesson concept: GroupBy → Select → OrderByDescending → Take(n)\nvar topReps = sales\n    .GroupBy(s => s.SalesRep)\n    .Select(g => new { Rep = g.Key, Revenue = g.Sum(s => s.Amount) })\n    .OrderByDescending(x => x.Revenue)\n    .Take(3)\n    .ToList();\n\nConsole.WriteLine(\"\\n[3] Top 3 Sales Reps:\");\nfor (int i = 0; i < topReps.Count; i++)\n    Console.WriteLine($\"    {i + 1}. {topReps[i].Rep,-10}  {topReps[i].Revenue:C}\");\n\n// ── Q4: Monthly revenue breakdown ────────────────────────────────────────────\n// Lesson concept: GroupBy on a computed key → OrderBy → ThenBy → Select for display\nvar monthly = sales\n    .GroupBy(s => new { s.Date.Year, s.Date.Month })\n    .OrderBy(g => g.Key.Year)\n    .ThenBy(g => g.Key.Month)\n    .Select(g => new\n    {\n        Label   = new DateOnly(g.Key.Year, g.Key.Month, 1).ToString(\"MMM yyyy\"),\n        Revenue = g.Sum(s => s.Amount)\n    })\n    .ToList();\n\nConsole.WriteLine(\"\\n[4] Monthly Revenue:\");\nforeach (var m in monthly)\n    Console.WriteLine($\"    {m.Label,-10}  {m.Revenue:C}\");\n\n// ── Q5: Region with highest average order value ───────────────────────────────\n// Lesson concept: GroupBy → Average() → OrderByDescending → First()\nvar topRegion = sales\n    .GroupBy(s => s.Region)\n    .Select(g => new { Region = g.Key, AvgOrder = g.Average(s => s.Amount) })\n    .OrderByDescending(x => x.AvgOrder)\n    .First();\n\nConsole.WriteLine($\"\\n[5] Best Region (Avg Order): {topRegion.Region} ({topRegion.AvgOrder:C} avg)\");\n\n// ── Q6: Count of high-value sales (> $500) ───────────────────────────────────\n// Lesson concept: Count(predicate) — pass the predicate directly, no Where() needed\nint highValueCount = sales.Count(s => s.Amount > 500m);\ndouble highValuePct = (double)highValueCount / sales.Count * 100;\n\nConsole.WriteLine($\"\\n[6] High-Value Sales (>$500): {highValueCount} of {sales.Count} ({highValuePct:F1}%)\");\n\nConsole.WriteLine($\"\\n{new string('─', 52)}\");\nConsole.WriteLine(\"Report complete.\");"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Step 5 — Run It",
      "id": "step-5-run"
    },
    {
      "kind": "code",
      "language": "bash",
      "code": "dotnet run -- sales.csv"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "\n=== Sales Data Analyzer — 20 records loaded ===\n────────────────────────────────────────────────────\n\n[1] Total Revenue:  $13,700.00\n\n[2] Top Product:    Gadget X ($5,745.00)\n\n[3] Top 3 Sales Reps:\n    1. Carol       $3,740.00\n    2. Alice       $3,735.00\n    3. Bob         $2,950.00\n\n[4] Monthly Revenue:\n    Jan 2025    $2,370.00\n    Feb 2025    $1,805.00\n    Mar 2025    $2,600.00\n    Apr 2025    $2,880.00\n    May 2025    $2,935.00\n    Jun 2025    $1,110.00\n\n[5] Best Region (Avg Order): North ($768.33 avg)\n\n[6] High-Value Sales (>$500): 13 of 20 (65.0%)\n\n────────────────────────────────────────────────────\nReport complete."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Pitfall: Multiple enumeration of IEnumerable",
      "text": "Notice that `CsvParser.Load()` returns `List<SaleRecord>`, **not** `IEnumerable<SaleRecord>`. This is intentional. If `sales` were an `IEnumerable<T>` backed by `File.ReadLines(...)`, **every LINQ query would re-open and re-read the file** — six file reads instead of one, all silently. Always call `.ToList()` or `.ToArray()` to materialize a file-backed or database-backed sequence before running multiple queries against it."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Walk-Through: What Each Query Does",
      "id": "walk-through"
    },
    {
      "kind": "paragraph",
      "text": "Let's slow down and trace through **Question 3** (top 3 reps) step by step, because it combines four LINQ operators in one pipeline. Understanding one pipeline deeply transfers to all the others."
    },
    {
      "kind": "examples",
      "intro": "Tracing Q3 through each stage of the pipeline:",
      "examples": [
        {
          "label": "Stage 1 — GroupBy",
          "code": "// Groups all 20 SaleRecords by SalesRep name.\n// Result: 5 groups — Alice (5 rows), Bob (4), Carol (5), Dave (4), Eve (2)\nvar grouped = sales.GroupBy(s => s.SalesRep);"
        },
        {
          "label": "Stage 2 — Select (project each group to an anonymous type)",
          "code": "// For each group, compute the rep name and their total revenue.\n// Example anonymous type for Alice: { Rep = \"Alice\", Revenue = 3735.00m }\nvar projected = grouped.Select(g => new\n{\n    Rep     = g.Key,\n    Revenue = g.Sum(s => s.Amount)\n});"
        },
        {
          "label": "Stage 3 — OrderByDescending",
          "code": "// Sort by Revenue largest-first.\n// Result order: Carol 3740, Alice 3735, Bob 2950, Dave 2110, Eve 1165\nvar sorted = projected.OrderByDescending(x => x.Revenue);"
        },
        {
          "label": "Stage 4 — Take(3) and ToList()",
          "code": "// Keep only the first 3 items — the top earners.\n// ToList() materializes and executes the entire pipeline here.\nvar topReps = sorted.Take(3).ToList();\n// topReps: [ {Carol, 3740}, {Alice, 3735}, {Bob, 2950} ]"
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "The key insight is that **nothing executes** until `ToList()` is called on the last line. The preceding three lines build up a description of work. When `ToList()` runs, C# walks through all 20 records, buckets them by rep, sums each bucket, sorts the result, slices the top 3, and copies them into a `List`. One pass, one result. This lazy-then-materialize pattern is how every LINQ pipeline works."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Prefer Count(predicate) over .Where(...).Count()",
      "text": "Question 6 uses `sales.Count(s => s.Amount > 500m)` — passing the predicate **directly** to `Count()`. An equivalent but slightly wasteful alternative would be `sales.Where(s => s.Amount > 500m).Count()`. The `Where()` version creates an intermediate iterator object before counting. When a LINQ operator accepts a predicate directly (`Any(pred)`, `Count(pred)`, `First(pred)`), always prefer that form — it is more readable and avoids the allocation."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Extension Challenges",
      "id": "extension-challenges"
    },
    {
      "kind": "paragraph",
      "text": "If you want to deepen your fluency, extend the analyzer with one or more of these challenges. Each one targets a specific LINQ skill."
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Challenge A (SelectMany):** Add a field `Tags` to the CSV (comma-separated within a quoted field, e.g. `\"new,promo\"`). Use `SelectMany` to flatten all tags across all records and find the most-used tag.",
        "**Challenge B (Join):** Create a second CSV `targets.csv` with columns `SalesRep,Target` (a monthly revenue target per rep). `Join` the two collections and report each rep's performance vs. their target.",
        "**Challenge C (Generic helper):** Extract a reusable generic method `TopN<T>(IEnumerable<T> source, Func<T,decimal> selector, int n)` that encapsulates the GroupBy→Sum→OrderByDescending→Take pattern. Apply it to all three grouping questions.",
        "**Challenge D (ILookup):** Replace the monthly breakdown with a `ToLookup(s => s.Date.Month)` and demonstrate how an `ILookup` lets you retrieve a specific month's records in O(1) without re-querying.",
        "**Challenge E (file output):** Instead of printing to the console, write a second output path argument and serialize the report to a JSON file using `System.Text.Json`."
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**Parse once, query many:** load your data into a `List<T>` before running any LINQ. Multiple queries against a materialized list are fast and safe; multiple queries against a lazy file-backed `IEnumerable<T>` re-execute the source each time.",
        "**LINQ chains read like English requirements:** `GroupBy → Select → OrderByDescending → Take(3)` maps directly to \"group sales by rep, sum each group, sort biggest first, keep top 3\" — this is not an accident. Design your queries to match the business sentence.",
        "**Defer materialization to the last moment:** build your pipeline lazily, then call `.ToList()` (or `.ToArray()`) exactly once at the point where you need the results. In EF Core this is especially critical — the SQL doesn't run until that moment.",
        "**Use `decimal` for all monetary values** — never `double`. Floating-point rounding errors in financial code are a category of production bug with real financial consequences.",
        "**Pass predicates directly** to `Count()`, `Any()`, `First()`, and `Last()` instead of chaining `.Where()` first — it is more concise and avoids an intermediate allocation.",
        "**Anonymous types and record types** are your best friends for LINQ projections. Use anonymous types (`new { Key = ..., Value = ... }`) for intermediate pipeline stages, and named records or DTOs for results you need to pass to other methods.",
        "The LINQ skills you practiced here transfer **directly** to EF Core: `DbSet<T>` implements `IQueryable<T>`, and the same `Where`, `Select`, `GroupBy`, `OrderBy` operators translate into optimized SQL automatically."
      ]
    }
  ]
};
