import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  "slug": "json",
  "number": 4,
  "title": "JSON with System.Text.Json",
  "objective": "Serialize C# objects to JSON and deserialize back with System.Text.Json — the modern built-in alternative to Newtonsoft.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Almost every real application you ship breathes JSON: a web API hands it back to a React frontend, a config file feeds it to your service at startup, a cache stores it in Redis, and another microservice posts it to you over HTTP. In C#, the built-in tool for turning objects into JSON and back is **System.Text.Json** — and learning it well is one of the highest-leverage skills in the whole language."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "This lesson assumes students already know classes, records, and `List<T>` from earlier lessons. If records are shaky, do a 60-second recap before the first code block — most examples use records.",
        "The single biggest 'aha' for Python folks: `JsonSerializer.Deserialize<T>(json)` gives a **typed object**, not a dict. Contrast with `json.loads` returning a dict. Hammer this — it's the whole reason JSON in a static language feels different.",
        "Watch the **file layout** in every demo: with top-level statements, your executable code comes FIRST and the `record`/`class` declarations go at the BOTTOM. Putting the type above the statements is a real compile error (CS8803, 'top-level statements must precede type declarations') — a mistake beginners hit constantly. Show it failing once if you have time.",
        "Live-demo the case-sensitivity bug (all-null properties) — it lands far harder when they watch it fail than when they read the warning. Then fix it with `PropertyNameCaseInsensitive`.",
        "The deserialize demo sets `CultureInfo.CurrentCulture` to en-US on purpose, because `:C` (currency) formatting follows the machine's culture. Mention this — otherwise a student in India or Germany sees a different currency symbol and thinks they broke something. It's a great teachable moment about culture-sensitive formatting.",
        "Don't try to teach source generation deeply here; it gets a dedicated treatment later. The goal is only that students recognize the name and know WHEN it matters (AOT, startup perf).",
        "If you're short on time, the must-keep beats are: Serialize, Deserialize<T>, options reuse, camelCase, case-insensitive, and round-tripping. Source gen and the Strict preset are bonus."
      ]
    },
    {
      "kind": "paragraph",
      "text": "If you're coming from Python, you already know the rhythm. `json.dumps(obj)` turns a Python object into a string; `json.loads(text)` turns a string back into a `dict`. C# has the exact same two moves, but with one defining twist: because C# is **statically typed**, you don't usually deserialize into a loose dictionary — you deserialize straight into a class or record you defined. The compiler then knows every property's name and type, so `user.Email` is checked at compile time instead of being a `KeyError` waiting to happen at runtime."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python (json module)",
          "items": [
            "`import json` — built into the standard library",
            "`json.dumps(obj)` → a JSON string",
            "`json.loads(text)` → a **dict** (`data[\"email\"]`)",
            "Untyped: typos like `data[\"emial\"]` blow up at runtime",
            "Naming/casing is whatever you put in the dict"
          ]
        },
        {
          "title": "C# (System.Text.Json)",
          "items": [
            "`using System.Text.Json;` — built into .NET, no NuGet package",
            "`JsonSerializer.Serialize(obj)` → a JSON string",
            "`JsonSerializer.Deserialize<User>(text)` → a **typed `User`** (`user.Email`)",
            "Typed: `user.Emial` won't even compile",
            "Naming/casing controlled by `JsonSerializerOptions`"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Serialize: object to JSON string",
      "id": "serialize"
    },
    {
      "kind": "paragraph",
      "text": "The two methods you'll reach for constantly are `JsonSerializer.Serialize` and `JsonSerializer.Deserialize<T>`. Let's start with serialize. We'll model a `Product` as a `record` (records are perfect for data-carrying types like this), create one, and turn it into JSON. One layout rule to internalize right now: in a file with **top-level statements**, your runnable code goes first and your type declarations (the `record`) go at the **bottom** — flip that order and you get a compile error."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Text.Json;\n\nvar laptop = new Product(101, \"ThinkPad X1\", 1899.99m, true);\n\nstring json = JsonSerializer.Serialize(laptop);\nConsole.WriteLine(json);\n\nrecord Product(int Id, string Name, decimal Price, bool InStock);"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "{\"Id\":101,\"Name\":\"ThinkPad X1\",\"Price\":1899.99,\"InStock\":true}"
    },
    {
      "kind": "paragraph",
      "text": "Notice three things. The output is **minified** (no whitespace) by default — great for sending over the wire, awkward for human eyes. The property names are **PascalCase** (`Id`, `Name`), matching your C# code exactly. And only **public properties** were written. That last point is a common surprise, so it deserves its own warning."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Only public properties serialize — fields and private members are skipped",
      "text": "By default System.Text.Json serializes **public properties with a getter** and nothing else. A public *field*, a private property, or a computed value with no getter will silently vanish from the output. Python developers expecting `dataclass`-style 'serialize everything' get partial JSON and no error. If a value isn't showing up, the first thing to check is: *is it a public property?* (You can opt fields in with `IncludeFields = true` on the options, but the idiomatic fix is to use properties.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Deserialize: JSON string to typed object",
      "id": "deserialize"
    },
    {
      "kind": "paragraph",
      "text": "Going the other way, you tell `Deserialize<T>` which type you want and hand it the JSON. This is the line you'll write when reading an API response, a config file, or a row out of a cache. The `<T>` is what makes C# different from Python's `json.loads`: you get a real `Product` back, with IntelliSense and compile-time checking, not a dictionary whose keys you have to memorize."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Globalization;\nusing System.Text.Json;\n\n// `:C` formats currency using the current culture; pin it so the demo is deterministic.\nCultureInfo.CurrentCulture = new CultureInfo(\"en-US\");\n\nstring incoming = \"\"\"\n{\"Id\":101,\"Name\":\"ThinkPad X1\",\"Price\":1899.99,\"InStock\":true}\n\"\"\";\n\nProduct? product = JsonSerializer.Deserialize<Product>(incoming);\n\nConsole.WriteLine($\"{product!.Name} costs {product.Price:C}\");\nConsole.WriteLine($\"In stock: {product.InStock}\");\n\nrecord Product(int Id, string Name, decimal Price, bool InStock);"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "ThinkPad X1 costs $1,899.99\nIn stock: True"
    },
    {
      "kind": "paragraph",
      "text": "Three small but important details. `Deserialize<T>` returns a **nullable** `Product?` — if the input JSON is literally `null`, you get back `null`, which is why the compiler nudges you with the `!` (null-forgiving) operator or a null check. The raw string literal `\"\"\"...\"\"\"` (triple-quoted, a C# feature) lets us paste JSON without escaping every double quote — far nicer than `\\\"` everywhere. And `{product.Price:C}` formats the decimal as currency using the **current culture**, which is why we pinned the culture to en-US: on a machine set to India you'd otherwise see `₹`, and on one set to Germany `€` — the *number* is the same, only the display differs."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The #1 gotcha: all your properties come back null (or default)",
      "text": "By default System.Text.Json matches property names **case-sensitively**. If the JSON uses `\"name\"` (lowercase) but your record property is `Name`, it simply won't bind — you'll get a `Product` with `Name = null` and no exception. Since most JSON in the wild (and all of ASP.NET Core's output) is **camelCase**, this bites almost everyone once. The fix is a `JsonSerializerOptions` with either `PropertyNameCaseInsensitive = true` or the camelCase naming policy — which we'll set up next."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "JsonSerializerOptions: control the output",
      "id": "options"
    },
    {
      "kind": "paragraph",
      "text": "`JsonSerializerOptions` is the dial-board for serialization. The four settings you'll use most: `WriteIndented` (pretty-print for logs and files), `PropertyNamingPolicy = JsonNamingPolicy.CamelCase` (emit `camelCase` to match JavaScript and JSON convention), `PropertyNameCaseInsensitive = true` (read `Name`/`name`/`NAME` all the same), and `DefaultIgnoreCondition = WhenWritingNull` (drop null properties from the output). Here's the same product, serialized with real-world options. Note the extra `using System.Text.Json.Serialization;` — that's where `JsonIgnoreCondition` lives."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Text.Json;\nusing System.Text.Json.Serialization;\n\nvar options = new JsonSerializerOptions\n{\n    WriteIndented = true,\n    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,\n    PropertyNameCaseInsensitive = true,\n    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull\n};\n\nvar laptop = new Product(101, \"ThinkPad X1\", 1899.99m, true);\nstring json = JsonSerializer.Serialize(laptop, options);\nConsole.WriteLine(json);\n\nrecord Product(int Id, string Name, decimal Price, bool InStock);"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "{\n  \"id\": 101,\n  \"name\": \"ThinkPad X1\",\n  \"price\": 1899.99,\n  \"inStock\": true\n}"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Build your options once and reuse them",
      "text": "A `JsonSerializerOptions` instance is **expensive to construct** — internally it builds and caches type metadata the first time it's used. Creating a `new JsonSerializerOptions { ... }` on every call quietly tanks your throughput. Build one `static readonly` instance and pass it everywhere. It becomes effectively immutable after first use and is thread-safe, so this is completely safe: `private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };`"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Collections: serializing a List<T>",
      "id": "collections"
    },
    {
      "kind": "paragraph",
      "text": "Real payloads are rarely a single object — they're lists. An API returns an array of products; a report exports thousands of rows. The good news: there's nothing new to learn. Hand `Serialize` a `List<T>` and you get a JSON array; hand `Deserialize<List<T>>` an array and you get your list back, fully typed."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Text.Json;\n\nvar opts = new JsonSerializerOptions { WriteIndented = true };\n\nvar catalog = new List<Product>\n{\n    new(101, \"ThinkPad X1\", 1899.99m, true),\n    new(102, \"USB-C Hub\", 49.95m, false)\n};\n\nstring json = JsonSerializer.Serialize(catalog, opts);\nConsole.WriteLine(json);\n\n// Round-trip the array straight back into a typed list\nList<Product>? back = JsonSerializer.Deserialize<List<Product>>(json);\nConsole.WriteLine($\"Loaded {back!.Count} products; first is {back[0].Name}\");\n\nrecord Product(int Id, string Name, decimal Price, bool InStock);"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "[\n  {\n    \"Id\": 101,\n    \"Name\": \"ThinkPad X1\",\n    \"Price\": 1899.99,\n    \"InStock\": true\n  },\n  {\n    \"Id\": 102,\n    \"Name\": \"USB-C Hub\",\n    \"Price\": 49.95,\n    \"InStock\": false\n  }\n]\nLoaded 2 products; first is ThinkPad X1"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Round-tripping and null handling",
      "id": "round-trip"
    },
    {
      "kind": "paragraph",
      "text": "**Round-tripping** means serialize then deserialize (or the reverse) and get back something equivalent to what you started with. It's the property you implicitly rely on every time you save state to disk and load it later, or send an object to another service that reconstructs it. With matching types and consistent options, System.Text.Json round-trips cleanly. The thing to watch is **nulls and missing values** — what happens when the JSON doesn't have a property your type expects? Each snippet below assumes `using System.Text.Json;` at the top and the shown `record` declared at the bottom of the file."
    },
    {
      "kind": "examples",
      "intro": "How missing JSON properties map onto C# types — the rules that bite beginners:",
      "examples": [
        {
          "label": "Missing property on a reference type → null",
          "code": "string json = \"\"\"{\"Name\":\"Ada\"}\"\"\";\nUser u = JsonSerializer.Deserialize<User>(json)!;\nConsole.WriteLine($\"{u.Name} / {u.Nickname ?? \"(none)\"}\");\n\nrecord User(string Name, string? Nickname);",
          "output": "Ada / (none)"
        },
        {
          "label": "Missing property on a value type → default (0, not null)",
          "code": "string json = \"\"\"{\"Id\":7}\"\"\";\nOrder o = JsonSerializer.Deserialize<Order>(json)!;\nConsole.WriteLine($\"Order {o.Id}, qty {o.Quantity}\");\n\nrecord Order(int Id, int Quantity);",
          "output": "Order 7, qty 0"
        },
        {
          "label": "Skip nulls on the way out with WhenWritingNull",
          "code": "// also: using System.Text.Json.Serialization;\nvar opts = new JsonSerializerOptions\n{\n    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull\n};\nUser u = new(\"Ada\", null);\nConsole.WriteLine(JsonSerializer.Serialize(u, opts));\n\nrecord User(string Name, string? Nickname);",
          "output": "{\"Name\":\"Ada\"}"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "A missing number becomes 0, not null — and that can be silently wrong",
      "text": "Because `int`, `bool`, and other value types can't be null, a missing JSON property leaves them at their **default** (`0`, `false`) rather than signaling 'absent'. An order with no `quantity` in the JSON deserializes to `Quantity = 0`, which may quietly pass validation. If 'absent' must be distinguishable from 'zero', model the property as nullable (`int?`) so a missing value becomes `null`, or mark it `required` so deserialization throws when it's absent. In .NET 10 the `JsonSerializerOptions.Strict` preset goes further — it treats all constructor parameters as required and honors nullable annotations, so missing data throws a `JsonException` instead of silently defaulting."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Where you'll actually use this: config and API payloads",
      "id": "real-world"
    },
    {
      "kind": "paragraph",
      "text": "Two scenarios cover the vast majority of professional JSON work. **First, reading config at startup** — pulling an `appsettings.json`-style file into a strongly-typed record so the rest of your app works with `config.MaxRetries` instead of stringly-typed lookups. **Second, calling another API** — `HttpClient` has helpers that serialize and deserialize for you. Note that ASP.NET Core and these helpers default to **camelCase and case-insensitive matching** (the built-in `JsonSerializerDefaults.Web` settings), which is exactly why the casing options from earlier matter so much in practice."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Text.Json;\n\nvar opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };\n\n// In a real app: await File.ReadAllTextAsync(\"appsettings.json\")\nstring configText = \"\"\"\n{ \"serviceName\": \"billing-api\", \"maxRetries\": 3, \"enableCache\": true }\n\"\"\";\n\nAppConfig config = JsonSerializer.Deserialize<AppConfig>(configText, opts)!;\nConsole.WriteLine($\"{config.ServiceName} retries {config.MaxRetries}x\");\n\nrecord AppConfig(string ServiceName, int MaxRetries, bool EnableCache);"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "billing-api retries 3x"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CallApi.cs",
      "code": "using System.Net.Http.Json; // GetFromJsonAsync / PostAsJsonAsync live here\n\nusing var http = new HttpClient { BaseAddress = new Uri(\"https://api.example.com\") };\n\n// GET + deserialize in one call (camelCase + case-insensitive by default)\nProduct? p = await http.GetFromJsonAsync<Product>(\"/products/101\");\nConsole.WriteLine(p?.Name);\n\n// Serialize + POST in one call\nvar newProduct = new Product(0, \"Wireless Mouse\", 29.99m, true);\nHttpResponseMessage resp = await http.PostAsJsonAsync(\"/products\", newProduct);\nConsole.WriteLine((int)resp.StatusCode);\n\nrecord Product(int Id, string Name, decimal Price, bool InStock);"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Use the async APIs end-to-end on a server",
      "text": "In a web app, prefer `SerializeAsync` / `DeserializeAsync` over a `Stream`, plus the `HttpClient` `...JsonAsync` helpers, and always `await` them. Blocking on synchronous I/O or calling `.Result` / `.Wait()` ties up thread-pool threads and can deadlock under load — a classic cause of an API that 'works on my machine' but falls over in production. For huge JSON arrays, `JsonSerializer.DeserializeAsyncEnumerable<T>(stream)` streams elements one at a time so you never load the whole payload into memory."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A note on source generation (performance & AOT)",
      "id": "source-gen"
    },
    {
      "kind": "paragraph",
      "text": "Everything so far uses **reflection** under the hood: at runtime, System.Text.Json inspects your types to figure out how to read and write them. That's flexible but costs startup time and allocations, and — critically — it **breaks under Native AOT and trimming**, where reflection metadata may not survive. The fix is **source generation**: you declare a `partial` context class, annotate it with the types you serialize, and the compiler generates the serialization code ahead of time. You don't need to master this now; just recognize the pattern and know it's the professional default for AOT apps, minimal APIs, and hot paths."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Text.Json;\nusing System.Text.Json.Serialization;\n\nDemo.Run();\n\nclass Demo\n{\n    public static void Run()\n    {\n        var laptop = new Product(101, \"ThinkPad X1\", 1899.99m, true);\n\n        // Pass the generated type info instead of relying on reflection\n        string json = JsonSerializer.Serialize(laptop, AppJsonContext.Default.Product);\n        Product? back = JsonSerializer.Deserialize(json, AppJsonContext.Default.Product);\n\n        Console.WriteLine(back!.Name);\n    }\n}\n\nrecord Product(int Id, string Name, decimal Price, bool InStock);\n\n// Declare which types to generate fast serialization code for\n[JsonSerializable(typeof(Product))]\n[JsonSerializable(typeof(List<Product>))]\npartial class AppJsonContext : JsonSerializerContext { }"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "ThinkPad X1"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What about Newtonsoft.Json?",
      "id": "newtonsoft"
    },
    {
      "kind": "paragraph",
      "text": "You'll meet **Newtonsoft.Json** (a.k.a. Json.NET) constantly in existing codebases — for years it was *the* JSON library in .NET. System.Text.Json is the **built-in default for new work**: faster, lower-allocation, and AOT-friendly. Newtonsoft is more lenient and historically richer in some areas (certain polymorphism scenarios, very flexible parsing). For new code, reach for System.Text.Json; just don't be surprised to see `using Newtonsoft.Json;` in older projects, and know the two are different libraries with different option names (for example, Newtonsoft's `[JsonProperty]` vs System.Text.Json's `[JsonPropertyName]`)."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Two quick traps worth knowing now",
      "text": "**Enums serialize as numbers by default** — a `Status.Active` property becomes `\"status\": 1`, not `\"Active\"`. Add a `JsonStringEnumConverter` to the options (or annotate the enum with `[JsonConverter(typeof(JsonStringEnumConverter))]`) to get readable string names. And **never use `BinaryFormatter`** for serialization: it throws `PlatformNotSupportedException` in .NET 9/10 and is a well-known remote-code-execution vulnerability. For JSON use System.Text.Json; for compact binary use MessagePack or protobuf-net; for legacy XML/SOAP interop, `XmlSerializer` and `DataContractSerializer` are still available."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`JsonSerializer.Serialize(obj)` turns an object into a JSON string; `JsonSerializer.Deserialize<T>(json)` turns JSON into a **typed** `T` — the static-typing upgrade over Python's `json.loads` returning a dict.",
        "In a top-level-statements file, runnable code comes **first** and `record`/`class` declarations go at the **bottom** — reversing them is a compile error (CS8803).",
        "A `List<T>` serializes to a JSON array and deserializes right back with `Deserialize<List<T>>` — no extra work.",
        "Control output with `JsonSerializerOptions`: `WriteIndented` (pretty-print), `PropertyNamingPolicy = CamelCase` (match JS/JSON), `PropertyNameCaseInsensitive = true` (read any casing), `DefaultIgnoreCondition = WhenWritingNull`.",
        "Build your `JsonSerializerOptions` once as `static readonly` and reuse it — constructing one per call is a real performance hit.",
        "Only **public properties** serialize; case mismatches silently produce null/default properties — the classic 'everything is null after deserialize' bug. CamelCase output is the ASP.NET Core default, so plan for it.",
        "A missing JSON value becomes `null` for reference/nullable types but the **default** (`0`, `false`) for value types; use `int?` or `required` (or the .NET 10 `Strict` preset) when 'absent' must differ from 'zero'.",
        "On servers, use the async APIs and `HttpClient`'s `GetFromJsonAsync`/`PostAsJsonAsync`; for huge data, stream with `DeserializeAsyncEnumerable`.",
        "For Native AOT, minimal APIs, and hot paths, prefer **source generation** (`JsonSerializerContext` + `[JsonSerializable]`). Recognize Newtonsoft.Json in legacy code, but choose System.Text.Json for new work — and never touch `BinaryFormatter`."
      ]
    }
  ]
};
