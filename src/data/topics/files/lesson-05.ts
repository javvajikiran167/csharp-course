import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  "slug": "csv",
  "number": 5,
  "title": "Working with CSV",
  "objective": "Read and write CSV data by hand for simple cases, understand the quoting/edge-case pitfalls, and know when to reach for a library.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Every business app eventually meets a spreadsheet. A finance team exports a report, a client emails a `customers.csv`, a nightly job hands you a million rows of orders — and **CSV** is the lingua franca that connects all of it. It looks trivially simple, which is exactly why it bites people. Today you'll learn to read and write CSV correctly by hand, see precisely where the naive approach falls apart, and know the moment to stop hand-rolling and reach for a library."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by asking the room: 'What's hard about a file of comma-separated values?' Most beginners say 'nothing.' Let them feel confident, then break their mental model with the `\"Lovelace, Ada\"` example. The whole lesson lands harder if they first believed CSV was easy.",
        "Python students reach for `csv.reader` / `pandas.read_csv` reflexively. The honest framing: .NET has **no** built-in CSV parser in the BCL (unlike Python's `csv` module). That's deliberately surprising — it motivates both 'parse it yourself' and 'use CsvHelper'.",
        "Run the naive `Split(',')` demo live. Seeing the field count jump from 4 to 5 is the emotional core of the lesson — don't just describe it, show the output.",
        "The culture trap is the one most beginners get backwards, so slow down here. A German machine reads a comma as the decimal point and a dot as the thousands separator. The bug is NOT that `\"1,5\"` becomes fifteen — it correctly becomes 1.5 in German. The real bug is that a file written with invariant dots (`\"1.5\"`) is misread as 15 on a German server because the dot is treated as a grouping separator. I verified this live: `decimal.Parse(\"1.5\", de-DE)` returns 15. Demo it if you can; it's a great 'gotcha'.",
        "Time-box the hand-rolled parser. The state-machine parser is worth understanding once, but emphasize you'd rarely ship it. The real professional lesson is 'know the format, then use CsvHelper.'",
        "The `ToRecords` snippet reuses the `ParseLine` method and the `Employee` record from the two snippets just above it. Make that explicit so nobody copy-pastes it in isolation and wonders why it won't compile.",
        "Tie back to Lesson 4 (JSON) explicitly: CSV is the flat, tabular cousin of JSON. The CSV->JSON conversion at the end shows the two formats are interchangeable views of the same records and reinforces System.Text.Json from last lesson.",
        "If a student asks 'why does CSV even still exist in 2026?' — because non-programmers can open it in Excel and email it. Human-editability is its killer feature; that's why it refuses to die."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What CSV actually is",
      "id": "what-csv-is"
    },
    {
      "kind": "paragraph",
      "text": "CSV stands for **Comma-Separated Values**. At its simplest, it's a plain-text file where each line is a row and commas separate the columns. The first line is usually a **header** naming the columns. That's the whole idea — and if your data never contains a comma, a quote, or a newline, that's genuinely all there is to it. Here's a clean employee export:"
    },
    {
      "kind": "code",
      "language": "text",
      "filename": "employees.csv",
      "code": "Id,Name,Department,Salary\n1,Ada Lovelace,Engineering,120000\n2,Grace Hopper,Engineering,135000"
    },
    {
      "kind": "paragraph",
      "text": "Coming from Python, you'll instinctively reach for the `csv` module or `pandas.read_csv`. Here's the first real surprise: **.NET's base class library has no built-in CSV parser.** There's `System.Text.Json` for JSON (Lesson 4) and `XmlSerializer` for XML, but nothing for CSV. So you have exactly two professional options — write a small parser yourself, or pull in a library like **CsvHelper**. Knowing which to pick, and why, is the real skill here. There's also no single official CSV standard; the closest thing is **RFC 4180**, which most tools follow loosely. 'Loosely' is where the pain lives."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "There is no one true CSV",
      "text": "Real files vary wildly: some use semicolons (`;`) as separators (common in European locales where the comma is the decimal separator), some use tabs (TSV), some quote every field, some quote none. Excel even changes its delimiter based on your regional settings. Never assume — always open a sample of the actual file you've been handed and look."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Writing CSV with string.Join",
      "id": "writing-csv"
    },
    {
      "kind": "paragraph",
      "text": "Writing is the easier direction, so let's start there. The workhorse is [`string.Join`](https://learn.microsoft.com/dotnet/api/system.string.join), which glues a sequence of values together with a separator — the mirror image of Python's `\",\".join(row)`. Build each line, then write the whole thing to disk with `File.WriteAllTextAsync` from the file I/O you saw earlier:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "WriteCsv.cs",
      "code": "using System.Text;\n\nstring[] headers = [\"Id\", \"Name\", \"Department\", \"Salary\"];\nstring[][] rows =\n[\n    [\"1\", \"Ada Lovelace\", \"Engineering\", \"120000\"],\n    [\"2\", \"Grace Hopper\", \"Engineering\", \"135000\"],\n];\n\nvar sb = new StringBuilder();\nsb.AppendLine(string.Join(\",\", headers));\nforeach (var row in rows)\n    sb.AppendLine(string.Join(\",\", row));\n\nawait File.WriteAllTextAsync(\"employees.csv\", sb.ToString());\nConsole.Write(sb.ToString());"
    },
    {
      "kind": "output",
      "label": "Console output (and the file contents)",
      "output": "Id,Name,Department,Salary\n1,Ada Lovelace,Engineering,120000\n2,Grace Hopper,Engineering,135000"
    },
    {
      "kind": "paragraph",
      "text": "We use a [`StringBuilder`](https://learn.microsoft.com/dotnet/api/system.text.stringbuilder) rather than `+=` on a string in a loop. Remember from the strings lesson that C# strings are **immutable**, so concatenating in a loop allocates a brand-new string every iteration — fine for three rows, quietly catastrophic for fifty thousand. `StringBuilder` is the right tool whenever you're assembling text in a loop, and CSV export is the textbook case. One caveat even this clean writer ignores: it never quotes or escapes anything, so the moment a real value contains a comma or a quote it would produce a broken file. We'll see exactly that failure from the reading side next — and fix it properly with a library at the end. So far, so easy. Now let's break it."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Reading CSV: where Split betrays you",
      "id": "reading-and-pitfalls"
    },
    {
      "kind": "paragraph",
      "text": "The naive read mirrors the write: read each line, then `line.Split(',')` to get the fields. For the clean data above, this works perfectly and tempts you into thinking you're done. But real CSV fields can themselves contain commas — a full name like `Lovelace, Ada`, a street address, a product description. The format's answer is to **wrap such a field in double quotes**. And the instant a quoted field appears, `Split(',')` falls apart:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "NaiveSplit.cs",
      "code": "// A row where the Name field legitimately contains a comma\nstring line = \"3,\\\"Lovelace, Ada\\\",Engineering,120000\";\n\nstring[] parts = line.Split(',');\nConsole.WriteLine($\"Field count: {parts.Length}\");\nforeach (var p in parts)\n    Console.WriteLine($\"[{p}]\");"
    },
    {
      "kind": "output",
      "label": "Wrong! We wanted 4 fields, got 5",
      "output": "Field count: 5\n[3]\n[\"Lovelace]\n[ Ada\"]\n[Engineering]\n[120000]"
    },
    {
      "kind": "paragraph",
      "text": "`Split` has no idea those quotes mean 'don't split inside here.' It blindly cuts on every comma, shredding `\"Lovelace, Ada\"` into two broken fields and leaving the literal quote characters stuck to the text. Your `int.Parse` later blows up, or — far worse — the data silently lands in the wrong columns and corrupts a report nobody notices for a week. This is the single most common CSV bug in production, and it's why 'just `Split` on comma' is a code-review red flag."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The three things that break naive CSV parsing",
      "text": "**Commas inside quoted fields** (`\"Lovelace, Ada\"`) — `Split(',')` cuts them apart. **Quotes inside fields**, which CSV escapes by *doubling* them (`\"\"`), so the stored text `\"She said \"\"hi\"\"\"` means the value `She said \"hi\"`. And **newlines inside quoted fields** — a single record can legally span multiple physical lines, so reading the file line-by-line with `File.ReadLines` will split one record into several. If any of these can appear in your data, hand-rolling with `Split` is wrong."
    },
    {
      "kind": "paragraph",
      "text": "That last one is the nastiest because it defeats the obvious fix. Here's a file where one field contains a newline, parsed the naive line-by-line way:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "NewlineTrap.cs",
      "code": "// The Notes field for row 1 contains an embedded newline inside quotes.\n// Two real records: (1, \"line one<newline>line two\") and (2, ok).\nstring fileContent = \"Id,Notes\\n1,\\\"line one\\nline two\\\"\\n2,ok\\n\";\n\nvar rawLines = fileContent.Split('\\n', StringSplitOptions.RemoveEmptyEntries);\nConsole.WriteLine($\"Physical lines (naive): {rawLines.Length}\");\nforeach (var l in rawLines)\n    Console.WriteLine($\"[{l}]\");"
    },
    {
      "kind": "output",
      "label": "1 header + 2 data records, but the file splits into 4 physical lines",
      "output": "Physical lines (naive): 4\n[Id,Notes]\n[1,\"line one]\n[line two\"]\n[2,ok]"
    },
    {
      "kind": "paragraph",
      "text": "The file holds a header plus exactly **two** data records, yet splitting on `\\n` yields **four** lines: record 1 got torn in half because its quoted `Notes` field contained a newline. Any parser that treats 'physical line' as 'logical record' is now permanently confused — every column after the break is shifted. To handle this correctly you can't think line-by-line at all; you have to scan **character by character**, tracking whether you're currently inside a quoted field."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A correct hand-rolled parser",
      "id": "correct-parser"
    },
    {
      "kind": "paragraph",
      "text": "If commas-in-fields are your only worry (no embedded newlines), a single-line state-machine parser handles the comma and escaped-quote cases correctly. The idea: walk the characters, flip an `inQuotes` flag when you hit a quote, only treat a comma as a separator when you're *outside* quotes, and collapse a doubled `\"\"` into a single literal quote. This is worth writing once so the format stops feeling like magic:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ParseLine.cs",
      "code": "using System.Text;\n\nstatic List<string> ParseLine(string line)\n{\n    var fields = new List<string>();\n    var sb = new StringBuilder();\n    bool inQuotes = false;\n\n    for (int i = 0; i < line.Length; i++)\n    {\n        char c = line[i];\n        if (inQuotes)\n        {\n            if (c == '\"')\n            {\n                // A doubled \"\" is an escaped quote; otherwise the quoted section ends\n                if (i + 1 < line.Length && line[i + 1] == '\"') { sb.Append('\"'); i++; }\n                else inQuotes = false;\n            }\n            else sb.Append(c);\n        }\n        else\n        {\n            if (c == ',') { fields.Add(sb.ToString()); sb.Clear(); }\n            else if (c == '\"') inQuotes = true;\n            else sb.Append(c);\n        }\n    }\n    fields.Add(sb.ToString());\n    return fields;\n}\n\nvar parsed = ParseLine(\"3,\\\"Lovelace, Ada\\\",\\\"She said \\\"\\\"hi\\\"\\\"\\\",120000\");\nConsole.WriteLine($\"Field count: {parsed.Count}\");\nforeach (var f in parsed)\n    Console.WriteLine($\"[{f}]\");"
    },
    {
      "kind": "output",
      "label": "Correct: 4 fields, comma preserved, quotes unescaped",
      "output": "Field count: 4\n[3]\n[Lovelace, Ada]\n[She said \"hi\"]\n[120000]"
    },
    {
      "kind": "paragraph",
      "text": "Four fields, the comma preserved inside the name, and the doubled `\"\"hi\"\"` correctly unescaped to `\"hi\"`. Notice what this parser still does **not** handle: an embedded newline, because it only ever sees one line at a time. To support that you'd feed it a character stream from a `StreamReader` instead of pre-split lines, and let it cross line boundaries while `inQuotes` is true. At that point you're writing a real parser — and that's precisely the moment a working engineer stops and installs CsvHelper."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Parsing into records",
      "id": "into-records"
    },
    {
      "kind": "paragraph",
      "text": "Raw `List<string>` fields are no way to work. Just as in the JSON lesson we deserialized into a typed object instead of juggling a dictionary, here we want to turn each row into a strongly-typed [`record`](https://learn.microsoft.com/dotnet/csharp/whats-new/tutorials/records). That gives you compile-time safety, real types (`int`, `decimal`), and `e.Salary` instead of `parts[3]`. The snippet below **reuses the `ParseLine` method and the `Employee` record** from the two snippets above — it's the next step in the same program, not a standalone file. Here we map fields by position and convert with `int.Parse` / `decimal.Parse`:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ToRecords.cs",
      "code": "// Reuses ParseLine(...) from above; Employee is declared at the bottom.\nstring csv = \"\"\"\n    Id,Name,Department,Salary\n    1,Ada Lovelace,Engineering,120000\n    2,\"Hopper, Grace\",Research,135000\n    \"\"\";\n\nvar lines = csv.Split('\\n', StringSplitOptions.RemoveEmptyEntries);\nvar employees = new List<Employee>();\n\nforeach (var line in lines.Skip(1)) // Skip(1) drops the header row\n{\n    var f = ParseLine(line.TrimEnd('\\r')); // TrimEnd handles Windows \\r\\n\n    employees.Add(new Employee(\n        int.Parse(f[0]), f[1], f[2], decimal.Parse(f[3])));\n}\n\nforeach (var e in employees)\n    Console.WriteLine(e);\n\nrecord Employee(int Id, string Name, string Department, decimal Salary);"
    },
    {
      "kind": "output",
      "output": "Employee { Id = 1, Name = Ada Lovelace, Department = Engineering, Salary = 120000 }\nEmployee { Id = 2, Name = Hopper, Grace, Department = Research, Salary = 135000 }"
    },
    {
      "kind": "paragraph",
      "text": "A few production details hide in that small loop. `Skip(1)` drops the header — forget it and your header row becomes a phantom data record (and `int.Parse(\"Id\")` throws a `FormatException`). `TrimEnd('\\r')` matters because Windows ends lines with `\\r\\n` while Linux uses `\\n`; if your file was created on Windows and you split on `\\n`, every field's tail carries a stray carriage return. And `decimal` — not `double` — is the right type for money, because `double` is binary floating-point and silently loses cents. One subtlety worth seeing: the printed record shows `Name = Hopper, Grace` with a literal comma, because the record's default `ToString()` doesn't re-quote anything — proof the comma survived parsing intact and now lives safely inside a single field."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The culture-and-comma trap (most people get this backwards)",
      "text": "`int.Parse` and `decimal.Parse` use the **current thread's culture** by default, and that bites in a way that surprises everyone. On a German machine the comma *is* the decimal point and the dot is the thousands separator. So `decimal.Parse(\"1,5\")` correctly gives **1.5** there — that part is fine. The real bug is the reverse: a file written with invariant dots, like `\"1.5\"` meaning one-and-a-half, is read on that German server as **15**, because the dot is treated as a digit-grouping separator (I verified this: `decimal.Parse(\"1.5\", new CultureInfo(\"de-DE\"))` returns `15`). The fix is the same in every direction — for fixed, machine-readable files, **always** pass `CultureInfo.InvariantCulture` to both parsing and formatting: `decimal.Parse(f[3], CultureInfo.InvariantCulture)`. This is the kind of bug that only shows up after you deploy to a server in another region."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When to hand-roll vs. reach for CsvHelper",
      "id": "library-vs-hand-roll"
    },
    {
      "kind": "paragraph",
      "text": "So when is the hand-rolled approach genuinely fine, and when is it professional malpractice? Here's the honest decision split I use on real projects:"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Hand-roll with Split / a small parser when",
          "items": [
            "The data is **yours** and the format is simple and guaranteed — an internal export you control end to end.",
            "Fields are **never** going to contain commas, quotes, or newlines (e.g., numeric IDs, enum codes, ISO dates).",
            "It's a throwaway script, a one-off migration, or a tiny config file.",
            "You want **zero dependencies** and the file is small enough to keep entirely in memory.",
            "You genuinely understand the edge cases and have decided they don't apply."
          ]
        },
        {
          "title": "Reach for CsvHelper when",
          "items": [
            "The file comes from **outside** — a customer, a bank, Excel, a third-party API. You don't control its quirks.",
            "Fields may contain commas, quotes, or **embedded newlines** — i.e., any real-world free text.",
            "You want automatic mapping straight to records/classes, with type conversion and header binding.",
            "The file is large and you need **streaming** so you don't load gigabytes into memory.",
            "You'd otherwise be reinventing a quoting/escaping parser — that's a solved problem; don't ship a buggy copy."
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "[CsvHelper](https://joshclose.github.io/CsvHelper/) is the de-facto standard CSV library for .NET — install it with `dotnet add package CsvHelper`. It handles every edge case we just fought, streams row-by-row so memory stays flat, maps directly to your records by matching headers to property names, and parses with whatever culture you specify. The same import that took us a careful state machine becomes a few lines:"
    },
    {
      "kind": "examples",
      "intro": "Reading and writing with CsvHelper. `GetRecords<T>` returns a lazy, streaming sequence — perfect for large files — and `WriteRecords` quotes and escapes correctly for free. Note that the `CultureInfo` you pass controls how CsvHelper *parses* numbers; the `:C` currency format below uses your machine's *current* culture, so the symbol you see depends on where it runs.",
      "examples": [
        {
          "label": "Read a CSV file into records (streaming)",
          "code": "using System.Globalization;\nusing CsvHelper;\n\nusing var reader = new StreamReader(\"employees.csv\");\nusing var csv = new CsvReader(reader, CultureInfo.InvariantCulture);\n\n// Lazily yields one Employee per row; matches headers to record properties\nforeach (var emp in csv.GetRecords<Employee>())\n    Console.WriteLine($\"{emp.Name} earns {emp.Salary:C}\");\n\nrecord Employee(int Id, string Name, string Department, decimal Salary);"
        },
        {
          "label": "Write records to a CSV file (correct quoting for free)",
          "code": "using System.Globalization;\nusing CsvHelper;\n\nvar employees = new List<Employee>\n{\n    new(1, \"Ada Lovelace\", \"Engineering\", 120000m),\n    new(2, \"Hopper, Grace\", \"Research\", 135000m), // comma quoted automatically\n};\n\nusing var writer = new StreamWriter(\"out.csv\");\nusing var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);\ncsv.WriteRecords(employees);\n\nrecord Employee(int Id, string Name, string Department, decimal Salary);",
          "output": "Id,Name,Department,Salary\n1,Ada Lovelace,Engineering,120000\n2,\"Hopper, Grace\",Research,135000"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: don't write a CSV parser you intend to ship",
      "text": "Understanding the format by hand once — like we did above — is excellent learning. But for any file that touches a customer, a regulator, or production data, use **CsvHelper** (or your platform's equivalent). A library that thousands of teams have battle-tested against weird real-world files will beat your hand-rolled parser on correctness, and it costs one `dotnet add package`. Save your cleverness for your business logic, not for re-deriving RFC 4180."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "From CSV to JSON",
      "id": "csv-to-json"
    },
    {
      "kind": "paragraph",
      "text": "Here's where this lesson and the last one click together. CSV and JSON are two views of the **same data** — CSV is the flat, tabular, human-and-Excel-friendly view; JSON is the structured, nested, API-friendly view. Converting between them is one of the most common glue tasks in real backend work: a client emails a CSV, and your service needs to push it to a JSON API or store it. Once your CSV rows are typed records, the conversion is exactly the `System.Text.Json` call you already know:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CsvToJson.cs",
      "code": "using System.Text.Json;\n\n// employees is the List<Employee> we parsed from CSV earlier\nvar options = new JsonSerializerOptions\n{\n    WriteIndented = true,\n    PropertyNamingPolicy = JsonNamingPolicy.CamelCase, // matches JS/JSON convention\n};\n\nstring json = JsonSerializer.Serialize(employees, options);\nConsole.WriteLine(json);"
    },
    {
      "kind": "output",
      "output": "[\n  {\n    \"id\": 1,\n    \"name\": \"Ada Lovelace\",\n    \"department\": \"Engineering\",\n    \"salary\": 120000\n  },\n  {\n    \"id\": 2,\n    \"name\": \"Hopper, Grace\",\n    \"department\": \"Research\",\n    \"salary\": 135000\n  }\n]"
    },
    {
      "kind": "paragraph",
      "text": "That's the whole pipeline: **CSV text -> parse into records -> serialize to JSON.** The records are the pivot. This is also why parsing into typed records (rather than leaving everything as `string[]`) pays off — the moment your data is a `List<Employee>`, every other format is one library call away, whether that's JSON for an API, a database insert via Entity Framework, or back out to CSV for a report. Two details worth noticing in the output: the comma inside `\"Hopper, Grace\"` survives the round trip cleanly (the payoff for parsing correctly), and `salary` prints as `120000` with no trailing `.0` — `decimal` serializes without inventing fractional digits it doesn't have."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Interview-ready summary",
      "text": "If asked 'how do you parse CSV in .NET?', the senior answer is: 'For trusted, simple, comma-free internal data, `Split` is fine. But CSV has real edge cases — quoted commas, doubled-quote escaping, and embedded newlines — so for anything external I use **CsvHelper**, which streams and maps to typed records. The BCL has no built-in CSV parser, unlike its JSON support. And I always parse numbers and dates with `CultureInfo.InvariantCulture` so a server in another region can't reinterpret my decimal points.' Mentioning the embedded-newline and culture cases in particular signals you've actually been burned by CSV in production."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "CSV is plain text: rows are lines, commas separate columns, the first line is usually a header. There's no strict standard — RFC 4180 is the loose guideline.",
        ".NET has **no built-in CSV parser** in the BCL (unlike Python's `csv` module or its own JSON support). You either hand-roll or use a library.",
        "Writing is easy: build lines with `string.Join(\",\", fields)` and a `StringBuilder`, then `File.WriteAllTextAsync` — but a naive writer won't quote commas or escape quotes, so it only works for clean data.",
        "Naive reading with `Split(',')` **breaks** on the three classics: commas inside quoted fields, doubled-quote (`\"\"`) escaping, and newlines inside quoted fields (which also defeat line-by-line reading).",
        "A character-by-character state machine tracking an `inQuotes` flag handles commas and escaped quotes on one line; embedded newlines require crossing line boundaries — the point at which you should reach for a library.",
        "Parse rows into typed `record`s for compile-time safety — and watch the traps: skip the header, `TrimEnd('\\r')` for Windows line endings, use `decimal` for money, and parse with `CultureInfo.InvariantCulture` so a foreign locale doesn't misread your numbers.",
        "The culture trap is subtle and usually misremembered: a German machine reads `\"1,5\"` correctly as 1.5, but misreads an invariant `\"1.5\"` as 15 (treating the dot as a thousands separator). Always pin `InvariantCulture` for machine-readable files.",
        "Hand-roll only for simple, trusted, comma-free internal data. For external files, embedded newlines, large files, or anything you don't control, use **CsvHelper**.",
        "Once data is in records, CSV -> JSON (or DB, or back to CSV) is one `JsonSerializer.Serialize` call away — CSV and JSON are two interchangeable views of the same records."
      ]
    }
  ]
};
