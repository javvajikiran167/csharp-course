import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  "slug": "dictionary",
  "number": 4,
  "title": "`Dictionary<TKey,TValue>` — Key/Value Lookups",
  "objective": "Use Dictionary for O(1) lookups by key — the backbone of caches, indexes, counting, and grouping.",
  "blocks": [
    {
      "kind": "lead",
      "text": "When you stop scanning a list to **find** something and start asking a structure to **hand it to you instantly**, you've reached for a dictionary — and `Dictionary<TKey,TValue>` is the single most useful container in professional C# after `List<T>`."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "This is the Python `dict` lesson. Lean on that bridge constantly — most students already think in dicts, so frame this as 'same idea, now statically typed and with a few sharp edges Python hides'.",
        "The #1 thing they must leave with is muscle memory for `TryGetValue` over the indexer. Demo the `KeyNotFoundException` live; the crash is the lesson.",
        "Drive home O(1)-by-key vs O(n)-scan-a-list. That single Big-O contrast is the whole reason the type exists and it's the most-asked interview angle.",
        "Counting (`GetValueOrDefault(key) + 1`) and grouping (dictionary-of-lists) are the two patterns they'll reuse in real jobs every week. Make them type both by hand.",
        "Keep the hashing/equality section brief but plant the seed: custom key types need value equality (use a record). It prevents a class of silent bugs later. If you have a spare minute, live-demo a plain `class` key missing its own entry — it lands hard.",
        "Iteration order: say plainly it's unspecified. The demo happens to print insertion order — call that out as luck, not a guarantee, so nobody builds logic on it."
      ]
    },
    {
      "kind": "paragraph",
      "text": "A `List<T>` is brilliant when you care about **order** and **position**. But the moment your question becomes \"given this **id** / **name** / **key**, what's the matching value?\", a list forces you to walk every element until you find a match — `O(n)` work that gets slower as data grows. A **dictionary** stores items as **key → value** pairs and uses **hashing** to jump straight to the right slot, giving average **O(1)** lookup, insert, and remove regardless of size. If you've used Python's `dict`, you already have the mental model: `Dictionary<TKey,TValue>` is the same concept, but both the key type and the value type are fixed at compile time."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python dict",
          "items": [
            "`d = {\"widget\": 12}` — one type, holds anything",
            "`d[\"widget\"]` raises `KeyError` if missing",
            "`d.get(\"x\")` returns `None` on a miss",
            "`d.get(\"x\", 0)` returns a fallback",
            "`\"widget\" in d` for membership",
            "Insertion-ordered since Python 3.7"
          ]
        },
        {
          "title": "C# Dictionary<TKey,TValue>",
          "items": [
            "`var d = new Dictionary<string,int>();` — key & value types fixed",
            "`d[\"widget\"]` throws `KeyNotFoundException` if missing",
            "`d.TryGetValue(\"x\", out var v)` — the safe miss",
            "`d.GetValueOrDefault(\"x\", 0)` returns a fallback",
            "`d.ContainsKey(\"widget\")` for membership",
            "**Order is unspecified** — never rely on it"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Creating, adding, and reading",
      "id": "creating-and-reading"
    },
    {
      "kind": "paragraph",
      "text": "You declare a dictionary with two type arguments — the **key** type and the **value** type. There are three common ways to put data in: a **collection initializer** with `[key] = value` entries, the `Add` method, and the **indexer** `dict[key] = value`. The difference between `Add` and the indexer matters: `Add` **throws** if the key already exists (it's an assertion that the key is new), while the indexer happily **inserts or overwrites**. Reading back is where beginners get burned, so look closely at how this example reads."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Inventory.cs",
      "code": "// Key type = string (product name), Value type = int (stock count).\nvar inventory = new Dictionary<string, int>\n{\n    [\"widget\"] = 12,\n    [\"gadget\"] = 4,\n};\n\ninventory.Add(\"sprocket\", 7);   // Add: assumes the key is new (throws if not)\ninventory[\"widget\"] = 15;       // indexer: overwrites the existing value\ninventory[\"gizmo\"] = 1;         // indexer: inserts a brand-new key\n\nConsole.WriteLine(inventory[\"widget\"]);   // read by key -> 15\nConsole.WriteLine(inventory.Count);       // how many pairs -> 4\n\n// The SAFE read: TryGetValue tells you hit-or-miss and hands back the value.\nif (inventory.TryGetValue(\"gadget\", out int qty))\n    Console.WriteLine($\"gadget stock: {qty}\");\n\n// On a miss, TryGetValue returns false and sets the out param to default(int) = 0.\nif (!inventory.TryGetValue(\"doohickey\", out int missing))\n    Console.WriteLine($\"doohickey missing, default = {missing}\");\n\nConsole.WriteLine(inventory.ContainsKey(\"sprocket\"));          // True\nConsole.WriteLine(inventory.GetValueOrDefault(\"doohickey\", -1)); // fallback -> -1"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "15\n4\ngadget stock: 4\ndoohickey missing, default = 0\nTrue\n-1"
    },
    {
      "kind": "paragraph",
      "text": "That `out int qty` is C#'s **out parameter** doing double duty: `TryGetValue` returns a `bool` saying **did we find it?**, and simultaneously writes the found value into the variable you declared inline. It's the idiomatic safe lookup because it touches the hash table **once** — compare that to the clumsy `if (dict.ContainsKey(k)) { var v = dict[k]; }`, which hashes the key **twice** (once to check, once to fetch). One lookup, no exception, no double work."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The KeyNotFound trap (Python's KeyError, but louder)",
      "text": "The indexer `dict[key]` **throws `KeyNotFoundException`** when the key is absent — it does **not** return `null` or a default. Python developers reach for the indexer expecting `dict.get()` semantics and get a runtime crash in production. Rule of thumb: use the **indexer to write**, but `TryGetValue` or `GetValueOrDefault` to **read** anything you're not 100% certain exists."
    },
    {
      "kind": "examples",
      "intro": "Four ways to handle \"the key might not be there\" — pick by intent:",
      "examples": [
        {
          "label": "Crashes on a miss (only when absence is a real bug)",
          "code": "decimal price = prices[\"tea\"]; // throws KeyNotFoundException if absent"
        },
        {
          "label": "Safe read with the found value (the everyday default)",
          "code": "if (prices.TryGetValue(\"tea\", out var price))\n    Use(price);\nelse\n    HandleMissing();"
        },
        {
          "label": "Read with a fallback, no branching",
          "code": "decimal price = prices.GetValueOrDefault(\"tea\", 0m); // 0m if missing"
        },
        {
          "label": "Add only if absent, no exception",
          "code": "bool added = prices.TryAdd(\"tea\", 2.50m); // false (and unchanged) if it already exists"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Iterating: KeyValuePair and deconstruction",
      "id": "iterating"
    },
    {
      "kind": "paragraph",
      "text": "When you `foreach` over a dictionary, each element is a `KeyValuePair<TKey,TValue>` — a little struct with `.Key` and `.Value` properties. In modern C# you almost always **deconstruct** it into a tuple-style `(key, value)` instead, which reads far cleaner. You can also iterate just `dict.Keys` or just `dict.Values` when you only need one side. Remember: the order you get back is **not guaranteed** — the example below happens to print in insertion order, but that's an implementation detail you must never depend on."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Counting.cs",
      "code": "string[] orders =\n[\n    \"espresso\", \"latte\", \"espresso\", \"tea\",\n    \"latte\", \"espresso\", \"mocha\", \"tea\", \"latte\"\n];\n\n// THE COUNTING PATTERN: tally occurrences of each key.\nvar counts = new Dictionary<string, int>();\nforeach (string drink in orders)\n    counts[drink] = counts.GetValueOrDefault(drink) + 1;\n//  ^ on first sight of a drink, GetValueOrDefault returns 0, so we store 1.\n\n// Iterate the classic way: each item is a KeyValuePair.\nforeach (var pair in counts)\n    Console.WriteLine($\"{pair.Key}: {pair.Value}\");\n\nConsole.WriteLine(\"---\");\n\n// Iterate the modern way: deconstruct straight into (key, value).\nforeach (var (drink, count) in counts)\n    Console.WriteLine($\"{drink} ordered {count}x\");"
    },
    {
      "kind": "output",
      "label": "Console output (order shown is incidental, not guaranteed)",
      "output": "espresso: 3\nlatte: 3\ntea: 2\nmocha: 1\n---\nespresso ordered 3x\nlatte ordered 3x\ntea ordered 2x\nmocha ordered 1x"
    },
    {
      "kind": "paragraph",
      "text": "That `counts[drink] = counts.GetValueOrDefault(drink) + 1` line is one of the most reused idioms in business code — word frequencies, sales-per-region totals, error-code tallies, votes per option. It's the C# equivalent of Python's `collections.Counter` written by hand, and it's worth committing to memory."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The grouping pattern: a dictionary of lists",
      "id": "grouping"
    },
    {
      "kind": "paragraph",
      "text": "Counting collapses each key to a single number. **Grouping** keeps every item, bucketed by key — the value type becomes a `List<T>`. You'll write this whenever you need \"all the X for each Y\": employees per department, line-items per order, log entries per user. The shape is `Dictionary<string, List<string>>`, and `TryGetValue` lets you create the bucket lazily on first encounter. Note the empty collection expression `[]` creating a fresh `List<string>`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Grouping.cs",
      "code": "var employees = new (string Name, string Dept)[]\n{\n    (\"Ana\", \"Engineering\"),\n    (\"Bibek\", \"Sales\"),\n    (\"Chen\", \"Engineering\"),\n    (\"Diego\", \"Sales\"),\n    (\"Esi\", \"Engineering\"),\n};\n\nvar byDept = new Dictionary<string, List<string>>();\nforeach (var (name, dept) in employees)\n{\n    if (!byDept.TryGetValue(dept, out var members))\n    {\n        members = [];            // new empty List<string> for a new department\n        byDept[dept] = members;  // register the bucket\n    }\n    members.Add(name);           // we hold the list ref, so just append\n}\n\nforeach (var (dept, names) in byDept)\n    Console.WriteLine($\"{dept}: {string.Join(\", \", names)}\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Engineering: Ana, Chen, Esi\nSales: Bibek, Diego"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "In real code, let LINQ do the grouping",
      "text": "The hand-rolled loop above is the **mechanics** every developer should understand — but in production you'd usually write `employees.GroupBy(e => e.Dept).ToDictionary(g => g.Key, g => g.Select(e => e.Name).ToList())`. We hand-build it here so you see exactly what `GroupBy` is doing under the hood; once it clicks, prefer the LINQ one-liner for readability. (We cover LINQ in its own lesson.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When a dictionary beats a list",
      "id": "dictionary-vs-list"
    },
    {
      "kind": "paragraph",
      "text": "The decision is almost always about **how you'll look things up**. If you access items by **position** or care about **order**, use a `List<T>`. If you access them by a **key** — an id, a name, a code — reach for a dictionary. The Big-O gap is the whole story: finding an item in a list by some property is `list.First(x => x.Id == id)`, an `O(n)` scan; the same lookup in a dictionary keyed by id is `dict[id]`, `O(1)` on average. With 10 items nobody notices. With 100,000 items inside a request handler, the list version is a performance incident and the dictionary version is instant."
    },
    {
      "kind": "list",
      "items": [
        "**Reach for `Dictionary`** when you repeatedly fetch by a unique key: `userId → User`, `sku → Product`, `configKey → value`.",
        "**Reach for `Dictionary`** to build a **cache** or **index** — look up a precomputed answer instead of recomputing or re-querying a database.",
        "**Reach for `Dictionary`** for **counting** and **grouping** aggregations over a stream of data.",
        "**Stick with `List<T>`** when order matters, when you need duplicates, or when you'll iterate everything anyway and never look up by key.",
        "**Need uniqueness but no value?** That's a `HashSet<T>` (next concept) — a dictionary with keys only."
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "IndexThenLookup.cs",
      "code": "// Real pattern: build an index ONCE, then do many fast lookups.\nList<Product> products = LoadProductsFromDatabase();\n\n// O(n) one-time cost to index by SKU...\nDictionary<string, Product> bySku = products.ToDictionary(p => p.Sku);\n\n// ...then every subsequent lookup is O(1):\nif (bySku.TryGetValue(\"SKU-100\", out var product))\n    Console.WriteLine(product.Price);\n\nrecord Product(string Sku, decimal Price);"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Thread-safety footnote",
      "text": "A plain `Dictionary<TKey,TValue>` is **not** safe for concurrent writes. In a web server or background service where multiple threads mutate the same map — a shared in-memory cache, for instance — use `ConcurrentDictionary<TKey,TValue>` and its atomic `GetOrAdd` / `AddOrUpdate` methods instead of locking by hand."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "How keys actually work: hashing and equality",
      "id": "hashing-and-equality"
    },
    {
      "kind": "paragraph",
      "text": "A dictionary achieves `O(1)` by calling `GetHashCode()` on your key to pick a storage bucket, then using `Equals()` to confirm the exact match within that bucket. For built-in keys — `string`, `int`, `Guid`, enums — this just works. But if you use a **custom type** as a key, the dictionary needs **value equality**: two keys with the same contents must produce the same hash code and compare equal. A plain `class` defaults to **reference** equality, so a freshly-constructed key with identical fields won't match — your lookups silently fail. The fix is almost free: make the key a **`record`**, which auto-generates correct value-based `Equals` and `GetHashCode` for you."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CustomKey.cs",
      "code": "// A record key gives correct value equality automatically.\nvar cache = new Dictionary<ProductKey, decimal>();\ncache[new ProductKey(\"SKU-100\", \"EU\")] = 9.99m;\n\n// A DIFFERENT object with the SAME field values still finds the entry,\n// because records compare by value, not by reference identity.\nbool found = cache.TryGetValue(new ProductKey(\"SKU-100\", \"EU\"), out var price);\nConsole.WriteLine($\"found={found}, price={price}\");\n\nrecord ProductKey(string Sku, string Region);"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "found=True, price=9.99"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: mutable keys and the missing override",
      "text": "Two related bugs interviewers love. **One:** using a `class` (not a record) as a key without overriding both `Equals` **and** `GetHashCode` — lookups fall back to reference equality and quietly miss. **Two:** mutating a key **after** it's been inserted so its hash code changes — the entry becomes unreachable, stranded in the wrong bucket. Keep dictionary keys **immutable**, and prefer records for any composite key."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`Dictionary<TKey,TValue>` maps keys to values with average **O(1)** lookup, insert, and remove — use it whenever you fetch by a key instead of by position.",
        "**Write** with the indexer (`dict[key] = value`, inserts-or-overwrites) or `Add` (throws if the key exists); **read** with `TryGetValue` or `GetValueOrDefault`.",
        "The indexer **throws `KeyNotFoundException`** on a missing key — unlike Python's `dict.get()`. `TryGetValue` is the safe, single-lookup idiom.",
        "`foreach` yields `KeyValuePair<TKey,TValue>`; deconstruct it as `(key, value)`. **Iteration order is unspecified** — never depend on it.",
        "Memorize two patterns: **counting** (`counts[k] = counts.GetValueOrDefault(k) + 1`) and **grouping** (`Dictionary<TKey, List<T>>`).",
        "A dictionary crushes a list when you look up by key (`O(1)` vs an `O(n)` scan) — build an index once, then look up many times.",
        "Custom key types need **value equality**: use a `record` (or override `Equals` + `GetHashCode`) and keep keys immutable. For concurrent writes, use `ConcurrentDictionary`."
      ]
    }
  ]
};
