import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  "slug": "hashset",
  "number": 5,
  "title": "HashSet&lt;T&gt; — Unique Items, Fast Lookup",
  "objective": "Use HashSet for uniqueness, fast membership tests, and set operations — a secret weapon in interview solutions.",
  "blocks": [
    {
      "kind": "lead",
      "text": "When you only care about **which items you've already seen** — not how many, not in what order — `HashSet<T>` turns an O(n) scan into an O(1) flick of the wrist. It's the closest thing C# has to Python's `set`, and it quietly wins a surprising number of interview problems."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor this lesson against the previous `List<T>` lesson: the hook is 'List answers *what's at index 3?*; HashSet answers *is X in here?* — and the second question is the one you ask constantly.'",
        "The single most important mental click is that `Add` returns a `bool`. Demo it live and pause: that one return value collapses 'check then add' into one call, and it's the engine behind first-duplicate detection. Mention that `Remove` returns a `bool` too, for the same reason.",
        "Students from Python already know `set()` and `in`. Lean on that: `x in my_set` is `mySet.Contains(x)`, and `set(my_list)` is `new HashSet<T>(myList)`. Then pivot to what's different — static typing and no literal `{ }` set syntax.",
        "Hammer the equality contract briefly here but defer the deep dive: HashSet uses `GetHashCode`/`Equals`, so records and primitives 'just work' but mutable custom classes silently break. Use a record in the custom-type example so it works, and warn about the trap.",
        "The set-operation methods MUTATE in place (UnionWith etc.). This trips people up — they expect a returned new set like Python's `|`. Make them copy-then-mutate in the demo so the pattern is muscle memory.",
        "If time is short, the must-keep beats are: Add-returns-bool, Contains is O(1), dedup via constructor, and the three Set ops. Subset/Overlaps and the capacity constructor are nice-to-have.",
        "Interview framing that lands well: most 'find/detect/dedup/visited' problems are secretly the same problem — 'remember what I've seen.' Once they see HashSet as *memory of the past*, the pattern transfers everywhere."
      ]
    },
    {
      "kind": "paragraph",
      "text": "In the last lesson `List<T>` was the everyday workhorse — ordered, indexed, duplicates allowed. `HashSet<T>` makes the opposite set of promises: **no duplicates**, **no index**, **no guaranteed order**, but **blazing-fast membership tests**. If you've ever written `if x not in already_processed:` in Python, you've already used this idea. In C# it lives in `System.Collections.Generic`, and like every collection there it's generic: a `HashSet<string>` holds only strings, checked at compile time."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "List<T> — ordered & indexed",
          "items": [
            "Keeps insertion order; `list[0]` works",
            "Duplicates allowed",
            "`Contains(x)` scans item by item → **O(n)**",
            "Reach for it when order or position matters"
          ]
        },
        {
          "title": "HashSet<T> — unique & fast",
          "items": [
            "**No** index, **no** reliable order",
            "Duplicates silently ignored",
            "`Contains(x)` hashes straight to the answer → **O(1)** average",
            "Reach for it for membership, dedup, and set math"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Creating a set, and the magic of Add",
      "id": "creating-and-add"
    },
    {
      "kind": "paragraph",
      "text": "You create a `HashSet<T>` like any collection — with a constructor, an initializer, or by feeding it an existing sequence. The detail that makes it special is the return type of `Add`: it gives back a `bool`. **`true`** means \"this is new, I added it\"; **`false`** means \"already present, nothing changed.\" That one boolean lets you ask \"have I seen this before?\" and record the answer in a single operation. Its mirror image, `Remove`, also returns a `bool` — `true` if the item was there to remove, `false` if it wasn't."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// A set tracking which user ids we've already processed.\nvar seen = new HashSet<string>();\n\nConsole.WriteLine(seen.Add(\"user-42\"));   // True  — brand new\nConsole.WriteLine(seen.Add(\"user-42\"));   // False — duplicate, ignored\nConsole.WriteLine(seen.Add(\"user-99\"));   // True\nConsole.WriteLine(seen.Count);            // 2     — no duplicate stored\n\n// Build a set directly from a sequence to strip duplicates in one shot.\nint[] raw = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];\nvar unique = new HashSet<int>(raw);\nConsole.WriteLine(unique.Count);          // 7\n\nConsole.WriteLine(unique.Contains(4));    // True  — O(1) average\nConsole.WriteLine(unique.Contains(7));    // False"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "True\nFalse\nTrue\n2\n7\nTrue\nFalse"
    },
    {
      "kind": "paragraph",
      "text": "Notice `new HashSet<int>(raw)` — passing a collection into the constructor is **the** idiomatic way to deduplicate. It's the direct analogue of Python's `set(my_list)`, and it's the eager, explicit cousin of LINQ's `raw.Distinct()` (which produces a lazy sequence rather than a reusable set). One thing C# does *not* have is Python's literal `{1, 2, 3}` set syntax: collection-initializer braces like `new HashSet<int> { 1, 2, 3 }` look similar but you always name the type — in C#, bare `{ }` braces are a `Dictionary` or an object initializer, never a set."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Order is not your friend here",
      "text": "Never rely on the iteration order of a `HashSet<T>` — it reflects internal hash buckets, not insertion order, and it can change between runs, machines, or .NET versions. Coming from Python this bites people who remember small-int sets *seeming* ordered. If you need insertion order keep a parallel `List<T>` (or use a `Dictionary`, which *does* preserve insertion order); if you need sorted order use a `SortedSet<T>` (O(log n) instead of O(1))."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Why O(1) matters: HashSet vs List for membership",
      "id": "hashset-vs-list"
    },
    {
      "kind": "paragraph",
      "text": "Both `List<T>` and `HashSet<T>` have a `Contains` method, so beginners often shrug and keep using a list. The difference only shows up at scale, but it's enormous. A `List<T>.Contains` walks the items one at a time — **O(n)**. A `HashSet<T>.Contains` hashes the value and jumps straight to the right bucket — **O(1)** on average. Inside a loop that's the difference between O(n²) and O(n): deduping 10,000 items by repeatedly calling `list.Contains` is roughly 50 million comparisons; the same job with a HashSet is about 10,000."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Classic interview question: find the first value that repeats.\n// The HashSet makes it a single clean O(n) pass.\nstatic int? FirstDuplicate(IEnumerable<int> nums)\n{\n    var seen = new HashSet<int>();\n    foreach (var n in nums)\n        if (!seen.Add(n))     // Add is false the instant we re-see a value\n            return n;\n    return null;              // no duplicates\n}\n\nConsole.WriteLine(FirstDuplicate([5, 3, 8, 3, 9, 5]));                       // 3\nConsole.WriteLine(FirstDuplicate([1, 2, 3, 4]) is null ? \"none\" : \"dup\");    // none"
    },
    {
      "kind": "output",
      "output": "3\nnone"
    },
    {
      "kind": "paragraph",
      "text": "This `!seen.Add(n)` idiom is the **secret weapon** the lesson objective promises. \"Find the first duplicate,\" \"detect a cycle by remembering visited nodes,\" \"have we already produced this anagram?\", \"is there a nearby duplicate?\" — a huge family of interview problems reduces to the same move: *remember what you've seen in a HashSet and test membership in O(1).* The same shape powers real systems: a graph traversal's `visited` set, an idempotency guard that drops already-processed message ids, or a crawler that skips URLs it has already fetched."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Accept the weak interface, choose the strong implementation",
      "text": "Notice `FirstDuplicate` takes `IEnumerable<int>`, so a caller can pass an array, a `List<int>`, or a LINQ query — but *inside* the method we deliberately pick `HashSet<int>` for its O(1) `Add`. That's the professional pattern: program to the weakest interface you can in your parameters (maximum reuse for callers), but reach for the precise data structure your algorithm actually needs internally."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Know the size up front? Pre-size the set",
      "text": "If you already know roughly how many items you'll add — say you're deduping a 50,000-row import — pass a capacity: `new HashSet<int>(capacity: 50_000)`. That pre-allocates the internal buckets so the set doesn't have to repeatedly resize and rehash as it grows. It's a small, free win that interviewers and code reviewers notice, and it matters in hot paths."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Set operations: union, intersection, difference",
      "id": "set-operations"
    },
    {
      "kind": "paragraph",
      "text": "Because a `HashSet<T>` *is* a mathematical set, it ships with the set algebra you learned in school: union, intersection, and difference. The C# names are `UnionWith`, `IntersectWith`, and `ExceptWith`. There's one gotcha that surprises Python developers: these methods **mutate the set they're called on** — they don't return a fresh set the way Python's `a | b` does. So the safe pattern is to copy first, then apply the operation to the copy."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var premium = new HashSet<string> { \"ana\", \"ben\", \"cara\", \"dan\" };\nvar active  = new HashSet<string> { \"ben\", \"dan\", \"eve\" };\n\n// INTERSECTION — premium users who are also currently active.\nvar both = new HashSet<string>(premium);   // copy first!\nboth.IntersectWith(active);\nConsole.WriteLine(string.Join(\", \", both.Order()));        // ben, dan\n\n// UNION — everyone in either group.\nvar either = new HashSet<string>(premium);\neither.UnionWith(active);\nConsole.WriteLine(string.Join(\", \", either.Order()));      // ana, ben, cara, dan, eve\n\n// DIFFERENCE — premium users who are NOT active (a churn-risk list).\nvar premiumOnly = new HashSet<string>(premium);\npremiumOnly.ExceptWith(active);\nConsole.WriteLine(string.Join(\", \", premiumOnly.Order())); // ana, cara\n\n// Relationship checks return a bool without mutating anything.\nConsole.WriteLine(both.IsSubsetOf(premium));   // True\nConsole.WriteLine(premium.Overlaps(active));   // True"
    },
    {
      "kind": "output",
      "output": "ben, dan\nana, ben, cara, dan, eve\nana, cara\nTrue\nTrue"
    },
    {
      "kind": "paragraph",
      "text": "I added `.Order()` only so the printed output is deterministic for this lesson — remember, the set itself has no inherent order. These operations read like the business question they answer: *premium ∩ active* is \"paying customers actually using the product,\" *premium − active* is \"paying but gone quiet — email them,\" and `Overlaps` answers \"do these two groups share anyone?\" without building a whole new collection. In real code I reach for these constantly: computing which feature flags a user gained between two config versions, diffing a desired-permissions set against current permissions, or finding tags two documents have in common."
    },
    {
      "kind": "examples",
      "intro": "A few more patterns you'll use on the job:",
      "examples": [
        {
          "label": "Allowed-roles membership check",
          "code": "var adminRoles = new HashSet<string> { \"Owner\", \"Admin\", \"Billing\" };\n\nstring role = \"Admin\";                       // e.g. currentUser.Role\nbool canManage = adminRoles.Contains(role);  // O(1), reads like English\nConsole.WriteLine(canManage);                // True",
          "output": "True"
        },
        {
          "label": "Remove tells you whether it was there",
          "code": "var online = new HashSet<int> { 7, 12, 30 };\nConsole.WriteLine(online.Remove(7));   // True  — was online, now logged off\nConsole.WriteLine(online.Remove(7));   // False — already gone, no-op",
          "output": "True\nFalse"
        },
        {
          "label": "Deduplicate while preserving the count",
          "code": "string[] tags = [\"c#\", \"dotnet\", \"c#\", \"api\", \"dotnet\"];\nint distinct = new HashSet<string>(tags).Count;\nConsole.WriteLine(distinct);   // 3",
          "output": "3"
        },
        {
          "label": "Custom keys work cleanly with records",
          "code": "// A record auto-implements Equals + GetHashCode, so value-equal\n// items are treated as duplicates — exactly what a set needs.\nrecord Point(int X, int Y);\n\nvar visited = new HashSet<Point>();\nvisited.Add(new Point(1, 2));\nConsole.WriteLine(visited.Contains(new Point(1, 2)));  // True",
          "output": "True"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Custom classes need Equals AND GetHashCode",
      "text": "A `HashSet<T>` decides 'same item?' using `GetHashCode` and `Equals`. **Records** (and primitives, strings) implement value equality for free — that's why the `Point` example works. But a plain mutable `class` falls back to *reference* identity: two objects with identical fields look different, so `Contains` silently misses and dedup quietly fails. If you must use a class as a set element, override both methods (and keep the object immutable so its hash never changes while it's in the set — a mutated key becomes unfindable), or just make it a `record`."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "When NOT to use a HashSet",
      "id": "when-not-to-use"
    },
    {
      "kind": "list",
      "items": [
        "**You need order or an index** — use `List<T>` (insertion order) or `SortedSet<T>` (sorted).",
        "**You need to count occurrences**, not just presence — use a `Dictionary<T,int>` (next lesson's territory).",
        "**You're storing key→value pairs** — that's a `Dictionary<TKey,TValue>`, not a set.",
        "**You only have a handful of items and check membership once** — a `List<T>` is fine; the O(1) win only pays off at scale or inside loops.",
        "**You need thread-safe writes from multiple threads** — a plain `HashSet<T>` is not safe for concurrent writes; guard it with a lock or use a `ConcurrentDictionary<T, byte>` as a concurrent set."
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`HashSet<T>` stores **unique** items with **O(1)** average `Add`, `Contains`, and `Remove` — but no index and no reliable order.",
        "`Add` returns a **`bool`**: `true` if newly added, `false` if already present. `!set.Add(x)` is the one-line 'have I seen this?' idiom that cracks many interview problems. (`Remove` returns a `bool` the same way.)",
        "Deduplicate any sequence with `new HashSet<T>(sequence)` — the C# equivalent of Python's `set(list)`. Pre-size it with a capacity when you know the rough count.",
        "Set algebra lives in `UnionWith`, `IntersectWith`, and `ExceptWith` — but they **mutate in place**, so copy the set first if you need the original. Relationship tests like `IsSubsetOf` and `Overlaps` return a `bool` without mutating.",
        "Prefer `HashSet<T>` over `List<T>` whenever the question is 'is X in here?', especially inside a loop, to avoid O(n²) blowups.",
        "Set elements need correct value equality: **records and primitives work automatically**; mutable custom classes need `Equals` + `GetHashCode` overridden (and should stay immutable) or membership silently breaks."
      ]
    }
  ]
};
