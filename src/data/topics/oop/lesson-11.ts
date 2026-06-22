import type { Lesson } from '@/data/types';

export const lesson11: Lesson = {
  "slug": "structs-enums",
  "number": 11,
  "title": "Structs & Enums — Value Types",
  "objective": "Use structs for small value types and enums for named constant sets, and understand value vs reference type semantics and when each is appropriate.",
  "blocks": [
    {
      "kind": "lead",
      "text": "So far every type you've built has been a **class** — but C# also gives you two lighter-weight tools that classes can't replace: **structs**, which are copied by value instead of shared by reference, and **enums**, which turn a fixed set of choices into real, named, type-checked constants. Get these two right and a whole category of bugs simply disappears."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor the entire lesson on the value-vs-reference mental model — it's the single most surprising thing for Python folks, where *everything* is a reference and structs don't exist. Run the copy demo live and let the `a.X=1, b.X=99` line land before explaining why.",
        "Resist the urge to make students reach for `struct` everywhere after this lesson. The honest professional default is: classes for almost everything, records for data, structs only when you can justify them. Say this explicitly so they don't over-apply it.",
        "The mutable-struct-in-a-collection gotcha is worth demoing live — it genuinely confuses experienced developers, not just beginners.",
        "For enums, drive home that the underlying value is just an `int` you can cast to and from — that demystifies persistence (storing enums in databases) and the `[Flags]` bitwise trick.",
        "If you're short on time, the two callouts (mutable-struct surprise + 'don't reach for struct first') are the must-keep moments.",
        "Optional aside for the curious: mention that `sizeof` works without `unsafe` only for built-in-sized types like enums and primitives; for arbitrary structs you'd need `Unsafe.SizeOf<T>()` or an unsafe context. Don't dwell on it."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Value types vs reference types",
      "id": "value-vs-reference"
    },
    {
      "kind": "paragraph",
      "text": "Every type in C# is either a **value type** or a **reference type**, and the difference is what happens when you assign one variable to another or pass it to a method. A **reference type** (every `class`, plus `string`, arrays, and most things you've built so far) lives on the heap; the variable holds a *reference* — a pointer — to it. Copy the variable and you copy the pointer: both names point at the **same object**. A **value type** (`int`, `bool`, `double`, every `struct`, every `enum`) holds the data **directly**; copy the variable and you copy the whole value, producing an **independent** second copy."
    },
    {
      "kind": "paragraph",
      "text": "In Python this distinction barely exists at the surface — every variable is a reference to an object, and there's no `struct` to give you copy-by-value semantics. (The closest Python analogy is the difference between rebinding an immutable `int` and mutating a shared `list`, but even there both names are still references.) That's exactly why this trips people up coming from Python: you can *see* the surprise but you've never had the vocabulary for it. Watch what the same-looking code does for a struct versus a class:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "struct PointStruct { public int X; public int Y; }   // value type\nclass  PointClass  { public int X; public int Y; }   // reference type\n\nvar a = new PointStruct { X = 1, Y = 2 };\nvar b = a;        // COPIES the value — b is independent\nb.X = 99;\nConsole.WriteLine($\"struct: a.X={a.X}, b.X={b.X}\");\n\nvar c = new PointClass { X = 1, Y = 2 };\nvar d = c;        // COPIES the reference — c and d share one object\nd.X = 99;\nConsole.WriteLine($\"class:  c.X={c.X}, d.X={d.X}\");"
    },
    {
      "kind": "output",
      "output": "struct: a.X=1, b.X=99\nclass:  c.X=99, d.X=99"
    },
    {
      "kind": "paragraph",
      "text": "Reassigning `b.X` left `a` untouched — they're two separate values. But `c` and `d` are two names for **one** object, so changing it through `d` changes what `c` sees too. The same rule governs method arguments: pass a struct and the method works on a private copy; pass a class and the method can mutate the object the caller still holds. This is the heart of the whole lesson — everything else is a consequence of it."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Value type (struct, enum, int...)",
          "items": [
            "Variable **holds the data directly**",
            "Assignment / argument passing **copies the whole value**",
            "Two copies are fully **independent**",
            "Usually lives on the **stack** (or inline inside its container)",
            "Has a built-in `default` (all fields zeroed) — can't be `null` unless made nullable with `?`",
            "Cannot inherit from another struct or class (can implement interfaces)"
          ]
        },
        {
          "title": "Reference type (class, record, string, array)",
          "items": [
            "Variable **holds a reference** to an object on the heap",
            "Assignment / argument passing **copies the reference**, not the object",
            "Two variables can **share & mutate** one object",
            "Object lives on the **heap**; garbage-collected",
            "Default is `null` (with nullable reference types, the compiler tracks this)",
            "Supports inheritance and polymorphism (`virtual`/`override`)"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Structs: small, immutable value bundles",
      "id": "structs"
    },
    {
      "kind": "paragraph",
      "text": "A `struct` declares your own value type. Use one when you have a **small bundle of data that behaves like a single value** — a 2D point, an RGB color, a money amount, a date range, a latitude/longitude pair. The litmus test is: *would it feel weird for two of these to be \"the same object\" rather than just \"equal\"?* `Money(amount: 10, \"USD\")` is the number ten dollars — there's no identity to share, you just want copies that compare equal. That's a struct. By contrast, a `Customer` or an `Order` has **identity** (two customers named \"Sam\" are different people) and usually behavior and injected dependencies — those stay classes."
    },
    {
      "kind": "paragraph",
      "text": "The strong industry guidance: keep structs **small** (a handful of fields, roughly 16 bytes or less as a rule of thumb) and **immutable**. Large structs are expensive to copy, and *mutable* structs cause subtle bugs because every assignment silently makes a copy. The cleanest way to make a struct immutable is the `readonly struct`, which forces every field and auto-property to be read-only — the compiler enforces it, so you can't accidentally add a mutating method later."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Money.cs",
      "code": "using System.Globalization;\n\n// A readonly struct: a small, immutable value with behavior.\nreadonly struct Money\n{\n    public decimal Amount   { get; }\n    public string  Currency { get; }\n\n    public Money(decimal amount, string currency)\n    {\n        Amount = amount;\n        Currency = currency;\n    }\n\n    // Returns a NEW value instead of mutating — the immutable pattern.\n    public Money Add(decimal extra) => new Money(Amount + extra, Currency);\n\n    public override string ToString() =>\n        $\"{Amount.ToString(\"0.00\", CultureInfo.InvariantCulture)} {Currency}\";\n}\n\nvar price = new Money(19.99m, \"USD\");\nvar withFee = price.Add(5m);\nConsole.WriteLine($\"money: {price}, withFee: {withFee}\");"
    },
    {
      "kind": "output",
      "output": "money: 19.99 USD, withFee: 24.99 USD"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "In real code, reach for a record struct",
      "text": "Writing constructors, `ToString`, and value-equality by hand gets old fast. A **`readonly record struct`** gives you all of it for free — and it's the idiomatic modern choice for small immutable values. `readonly record struct Point(int X, int Y);` is a complete type: positional `init`-only properties, value equality, a readable `ToString`, deconstruction, and `with`-expression copies. Use a hand-written `struct` only when you need precise control over layout or members."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "readonly record struct Point(int X, int Y);\n\nvar p1 = new Point(1, 2);\nvar p2 = p1 with { Y = 9 };          // non-destructive copy\nConsole.WriteLine($\"p1={p1}, p2={p2}, equal={p1 == new Point(1, 2)}\");"
    },
    {
      "kind": "output",
      "output": "p1=Point { X = 1, Y = 2 }, p2=Point { X = 1, Y = 9 }, equal=True"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: a mutable struct copied out of a collection",
      "text": "When you read a struct out of a `List<T>`, array, or property, you get a **copy**. Mutating that copy does nothing to the original — and the compiler won't warn you. This is the #1 reason the pros say *make structs immutable*."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "struct Pt { public int X; public int Y; }\n\nvar points = new List<Pt> { new Pt { X = 1, Y = 1 } };\nvar temp = points[0];   // temp is a COPY of the struct in the list\ntemp.X = 50;            // mutates the copy, not the list element\nConsole.WriteLine($\"list still: {points[0].X}\");"
    },
    {
      "kind": "output",
      "output": "list still: 1"
    },
    {
      "kind": "paragraph",
      "text": "Had `Pt` been a `class`, `temp` and `points[0]` would reference the same object and the change would stick. Had it been a `readonly struct`, the line `temp.X = 50` wouldn't even compile — the immutability would have stopped the bug at the source. (For the rare case where you genuinely *do* want to mutate an array element in place, indexing a real array — `arr[0].X = 50` — works because array indexers return a writable reference; a `List<T>` indexer does not, which is part of why it returns a copy.) One more value-type quirk to keep in mind: every struct has an implicit `default` value with all fields zeroed (`default(Point)` is `(0, 0)`), and you can't fully prevent that zero state from existing. Design your structs so the all-zero value is either valid or obviously \"empty.\""
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Enums: a fixed set of named constants",
      "id": "enums"
    },
    {
      "kind": "paragraph",
      "text": "An `enum` defines a value type whose values are a **closed, named set**. Instead of passing around magic strings (`\"shipped\"`) or magic numbers (`status == 2`) and hoping everyone spells them the same, you declare the legal options once and let the compiler enforce them. If you've reached for Python's `enum.Enum` or a bunch of module-level constants, this is the far stricter, type-checked equivalent — you literally cannot pass `OrderStatus.Shipped` where a `Priority` is expected."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "enum OrderStatus\n{\n    Pending,    // 0\n    Paid,       // 1\n    Shipped,    // 2\n    Delivered,  // 3\n    Cancelled   // 4\n}\n\nOrderStatus status = OrderStatus.Shipped;\nConsole.WriteLine($\"status: {status}, underlying: {(int)status}\");"
    },
    {
      "kind": "output",
      "output": "status: Shipped, underlying: 2"
    },
    {
      "kind": "paragraph",
      "text": "Under the hood every enum member is just an integer. By default they start at `0` and count up, and the backing type is `int` — but both are your choice. You can pin explicit values (essential when the numbers are stored in a database or sent over the wire, so reordering members never silently changes their meaning), and you can pick a smaller underlying type like `byte` to save space in large arrays or network messages."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "enum Priority : byte    // backed by a 1-byte value instead of 4\n{\n    Low    = 1,         // explicit values — safe to store & reorder\n    Medium = 2,\n    High   = 3\n}\n\nConsole.WriteLine($\"size: {sizeof(Priority)} byte(s), High={(byte)Priority.High}\");"
    },
    {
      "kind": "output",
      "output": "size: 1 byte(s), High=3"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why sizeof works here without unsafe",
      "text": "`sizeof` normally needs an `unsafe` context — but the compiler makes an exception for types whose size it knows at compile time, which includes the primitives and any `enum` (its size is just that of its underlying type). So `sizeof(Priority)` is fine in ordinary code. For an arbitrary `struct` you'd reach for `System.Runtime.CompilerServices.Unsafe.SizeOf<T>()` instead."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Parsing, formatting, and validating enums",
      "id": "enum-parsing"
    },
    {
      "kind": "paragraph",
      "text": "Enums round-trip cleanly to and from text, which is exactly what you need when reading a value from JSON, a query string, or a config file. `ToString()` (and string interpolation) gives you the member name; `Enum.Parse<T>` and the safer `Enum.TryParse<T>` go the other way. Reach for `TryParse` on any input you don't control — it returns `false` instead of throwing on garbage. And `Enum.IsDefined` guards against a sneaky trap: because an enum is just an integer underneath, you can cast *any* number to the enum type, even one no member defines."
    },
    {
      "kind": "examples",
      "intro": "A few common enum operations and exactly what they print:",
      "examples": [
        {
          "label": "Parse a known value",
          "code": "OrderStatus parsed = Enum.Parse<OrderStatus>(\"Delivered\");\nConsole.WriteLine($\"{parsed} = {(int)parsed}\");",
          "output": "Delivered = 3"
        },
        {
          "label": "TryParse rejects bad input safely",
          "code": "bool ok = Enum.TryParse<OrderStatus>(\"Frobnicated\", out var bad);\nConsole.WriteLine($\"ok={ok}, value={bad}\");",
          "output": "ok=False, value=Pending"
        },
        {
          "label": "Any int can be cast in — validate it",
          "code": "var weird = (OrderStatus)99;\nConsole.WriteLine($\"{weird}, defined: {Enum.IsDefined(weird)}\");",
          "output": "99, defined: False"
        },
        {
          "label": "List all members",
          "code": "foreach (var name in Enum.GetNames<OrderStatus>())\n    Console.Write(name + \" \");",
          "output": "Pending Paid Shipped Delivered Cancelled "
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Failed TryParse doesn't give you a safe default",
      "text": "When `Enum.TryParse` returns `false`, its `out` value is `default(T)` — which is just `0`. For `OrderStatus` that's `Pending`, a perfectly real status. **Always check the `bool` return** before trusting the parsed value; never assume a failed parse left you with something harmless. (Note too that by default `TryParse` *succeeds* on a numeric string like `\"99\"`, handing back an undefined enum value — pass a final `out` plus `Enum.IsDefined` if you must reject those as well.)"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "[Flags] enums: combining options",
      "id": "flags-enums"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes the choices aren't mutually exclusive — a user can have **Read and Write** permissions at once. Annotate the enum with `[Flags]`, give each member a distinct power of two (`1, 2, 4, 8, …`), and you can combine them with the bitwise OR operator `|`, test them with `HasFlag`, and `ToString()` will even render the combination as a comma-separated list. This is the classic representation for permission sets, feature toggles, and file-access modes."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "[Flags]\nenum Permissions\n{\n    None   = 0,\n    Read   = 1,   // 0b001\n    Write  = 2,   // 0b010\n    Delete = 4    // 0b100\n}\n\nPermissions p = Permissions.Read | Permissions.Write;  // combine\nConsole.WriteLine($\"perms: {p}\");\nConsole.WriteLine($\"has write:  {p.HasFlag(Permissions.Write)}\");\nConsole.WriteLine($\"has delete: {p.HasFlag(Permissions.Delete)}\");\n\nPermissions all = Permissions.Read | Permissions.Write | Permissions.Delete;\nConsole.WriteLine($\"all: {all}, raw: {(int)all}\");"
    },
    {
      "kind": "output",
      "output": "perms: Read, Write\nhas write:  True\nhas delete: False\nall: Read, Write, Delete, raw: 7"
    },
    {
      "kind": "paragraph",
      "text": "Notice `all` has the raw value `7` — that's `1 + 2 + 4`, the bits for Read, Write, and Delete all set. The power-of-two requirement is what makes this work: each member owns one distinct bit, so combinations never collide. Forget it (say, `Delete = 3`) and the bitwise math quietly produces wrong results. Always include a `None = 0` member as the \"no flags\" baseline, and remove a flag with `p &= ~Permissions.Write` (bitwise AND with the complement) rather than subtraction."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "When NOT to reach for a struct",
      "text": "After learning structs it's tempting to use them everywhere for the \"performance.\" Don't. The professional default is still **class** for entities and services, **record** for plain data, and **struct only** for small, immutable, value-semantic data where copying is cheap and identity is meaningless. Assigning a struct to an `object` or a non-generic interface silently **boxes** it (heap allocation + a copy), which erases the benefit. Choose by *semantics* first — \"is this a value or a thing with identity?\" — and let performance be a tiebreaker, measured, not guessed."
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**`record`** → immutable data with value equality (DTOs, domain values).",
        "**`class`** → identity + behavior + injected dependencies (entities, services).",
        "**`struct` / `record struct`** → small, immutable value where copying is cheap (Point, Money, Color).",
        "**`enum`** → a fixed, named set of options.",
        "**`[Flags] enum`** → a combinable set of options."
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**Value types** (`struct`, `enum`, `int`) hold their data directly and are **copied on assignment**; **reference types** (`class`, `record`, `string`, arrays) copy the **reference**, so two variables can share and mutate one object.",
        "Use a `struct` for **small, immutable, value-semantic** data; prefer a **`readonly record struct`** to get immutability, value equality, `ToString`, and `with` for free.",
        "**Mutable structs bite:** a struct read from a `List<T>` or property is a *copy*, so mutating it silently does nothing to the original — make structs immutable to prevent this.",
        "Every struct has a `default` (all fields zeroed) you can't forbid; design so the zero value is valid or clearly empty.",
        "An `enum` is a named set of integer constants — pin **explicit values** when they're persisted, and pick a smaller underlying type like `byte` only when it matters.",
        "Parse with `Enum.TryParse` for untrusted input (check the `bool`!), and remember any int can be cast to an enum — validate with `Enum.IsDefined`.",
        "`[Flags]` + powers of two lets you **combine** options with `|` and test them with `HasFlag`; always include `None = 0`.",
        "Default to **class/record**; use a struct only when the type is genuinely a small value — and beware **boxing** when a struct is stored as `object`."
      ]
    }
  ]
};
