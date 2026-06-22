import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  "slug": "properties",
  "number": 3,
  "title": "Properties — Get, Set, Init",
  "objective": "Expose and protect state with properties: auto-properties, computed/expression-bodied properties, init-only setters, and the field keyword (C# 14).",
  "blocks": [
    {
      "kind": "lead",
      "text": "In Python you just slap a value on `self.email` and move on — and three months later something writes `\"nope\"` into it and nobody notices until a customer complains. C# gives you a better deal: a **property** looks like a plain field from the outside, but it's secretly a tiny method that can validate, compute, log, or lock down every read and write. This lesson is about using that gate well."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor the whole lesson on one idea: **a property is a method wearing a field's clothes**. Everything else (auto-properties, `init`, `field`) is a convenience layered on that.",
        "Python students have never had `init` or `required`, and they think `private` is just a `_` naming hint. Lean into the fact that C# *enforces* these at compile time — show a non-compiling snippet so it lands.",
        "The `field` keyword (C# 14) is genuinely new in 2026; many students will have seen older tutorials that declare a manual `_backing` field. Show the before/after so they recognize both. Mention that `field` also works inside an `init` accessor, not just `set`.",
        "Don't drown them in all seven access modifiers here — that's the encapsulation/access-modifiers lesson. Stay focused on get/set/init/private-set/field/required.",
        "Tie each feature to a real scenario (DTO, entity, API request model). The 'why' is more durable than the syntax.",
        "All code and outputs in this lesson were compiled and run on .NET 10 / C# 14 (SDK 10.0.102). The `Quantity = -1` rejection, the `field` email validation, and the `CS8852` / `CS9035` compile errors are all real, verified outputs."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Why not just use a public field?",
      "id": "why-properties"
    },
    {
      "kind": "paragraph",
      "text": "Coming from Python, your instinct is to expose data directly: `self.quantity = 3`. C# lets you do the same with a **public field** — `public int Quantity;` — and for about five minutes it feels identical. The problem is that a field is a dumb storage slot. It can't validate, it can't compute, it can't be made read-only-after-construction, and it can't be swapped for smarter logic later without recompiling everything that touches it. A **property** is the idiomatic alternative: it presents the *same `obj.Quantity` syntax* to callers, but behind that syntax sits code you control."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Public field (avoid)",
          "items": [
            "`public int Quantity;`",
            "Just a storage slot — no validation possible",
            "Can't be made read-only after construction",
            "Can't compute a value or notify on change",
            "Turning it into a property later is a **binary-breaking** change for libraries",
            "Bypasses every invariant your type tries to hold"
          ]
        },
        {
          "title": "Property (idiomatic)",
          "items": [
            "`public int Quantity { get; set; }`",
            "Same `obj.Quantity` syntax for callers",
            "Can validate, compute, log, or guard on read/write",
            "Supports `init` (set once) and `private set`",
            "You can add logic later **without** changing the public surface",
            "The C# convention — analyzers flag public fields"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "The rule of thumb",
      "text": "Default to **properties for anything public**, fields only for private internal state. The cost of a property over a field is effectively zero (the JIT inlines trivial accessors), and you keep the freedom to add behavior later without breaking callers. This is settled convention in every professional C# codebase — Roslyn analyzers even ship a rule ([CA1051](https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1051)) that flags visible fields."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Auto-properties: the everyday workhorse",
      "id": "auto-properties"
    },
    {
      "kind": "paragraph",
      "text": "Most properties don't need custom logic — they just store and return a value. For those, C# gives you the **auto-property**: write `{ get; set; }` and the compiler synthesizes a hidden backing field plus the trivial accessors for you. This is the single most common member you'll write in C#."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Customer.cs",
      "code": "public class Customer\n{\n    // Auto-property: compiler generates the backing field + get/set.\n    public string Name { get; set; } = \"\";\n\n    // Auto-property with a default value.\n    public bool IsActive { get; set; } = true;\n\n    // Read-write number, defaults to 0.\n    public int LoyaltyPoints { get; set; }\n}\n\n// Object-initializer syntax sets properties right after construction:\nvar c = new Customer { Name = \"Grace\", LoyaltyPoints = 120 };\nConsole.WriteLine($\"{c.Name}: {c.LoyaltyPoints} pts, active={c.IsActive}\");"
    },
    {
      "kind": "output",
      "output": "Grace: 120 pts, active=True",
      "label": "Console output"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Python comparison",
      "text": "An auto-property is roughly Python's bare `self.name = name` attribute — direct storage, no logic. The difference is that in C# you can later upgrade *just that property* to a full get/set body with validation, and **no calling code changes**. In Python you'd reach for `@property`; in C# the property is the default, and the plain attribute is the thing you have to opt into (a field). Note that C# prints booleans as `True`/`False` (capitalized), unlike Python's — which look identical here but come from `bool.ToString()`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Get/set bodies: validation at the gate",
      "id": "validation"
    },
    {
      "kind": "paragraph",
      "text": "The moment a value has rules — a quantity can't be negative, a discount can't exceed 100% — you graduate from an auto-property to a **full property with a body**. You declare a private backing field and write the accessor logic yourself. The classic shape: `get` returns the field, `set` validates `value` (the implicit parameter holding the incoming assignment) before storing it."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Product.cs",
      "code": "public class Product\n{\n    private int _quantity;          // backing field you declare\n\n    public int Quantity\n    {\n        get => _quantity;\n        set\n        {\n            if (value < 0)\n                throw new ArgumentOutOfRangeException(\n                    nameof(value), \"Quantity cannot be negative.\");\n            _quantity = value;\n        }\n    }\n}\n\nvar p = new Product { Quantity = 3 };\nConsole.WriteLine($\"OK: {p.Quantity}\");\n\ntry { p.Quantity = -1; }\ncatch (ArgumentOutOfRangeException ex)\n{\n    Console.WriteLine($\"Rejected param: {ex.ParamName}\");\n}"
    },
    {
      "kind": "output",
      "output": "OK: 3\nRejected param: value",
      "label": "Console output"
    },
    {
      "kind": "paragraph",
      "text": "`value` is a contextual keyword that only exists inside a `set` (or `init`) accessor — it's the right-hand side of the assignment. That's why throwing `nameof(value)` reports `\"value\"` as the offending parameter. In a real ASP.NET Core domain model, this is exactly how you keep an **entity** valid: the invariant lives *inside the type*, so no caller — controller, service, or test — can ever sneak a bad value past it."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Computed and expression-bodied properties",
      "id": "computed"
    },
    {
      "kind": "paragraph",
      "text": "Not every property stores anything. A **computed property** has only a `get` that derives its value from other state each time it's read. Use the expression-bodied form (`=>`) for these — it's the C# equivalent of a Python `@property` with no setter."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Order.cs",
      "code": "public class OrderLine\n{\n    public required string Sku { get; init; }\n    public int UnitPriceCents { get; init; }\n    public int Quantity { get; init; }\n\n    // Computed: no backing field, recalculated on every read.\n    public int LineTotalCents => UnitPriceCents * Quantity;\n\n    // Computed + formatted for display.\n    public string Display => $\"{Sku}: {Quantity} x ${UnitPriceCents / 100.0:F2}\";\n}\n\nvar line = new OrderLine { Sku = \"KB-01\", UnitPriceCents = 4999, Quantity = 3 };\nConsole.WriteLine(line.Display);\nConsole.WriteLine($\"Total: ${line.LineTotalCents / 100.0:F2}\");"
    },
    {
      "kind": "output",
      "output": "KB-01: 3 x $49.99\nTotal: $149.97",
      "label": "Console output"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Expression-bodied is just shorthand",
      "text": "`public int LineTotalCents => UnitPriceCents * Quantity;` is identical to `public int LineTotalCents { get { return UnitPriceCents * Quantity; } }`. The `=>` form works for any single-expression member — a property `get`, an individual accessor, a method, or even a constructor. Because a computed property recomputes on every read, store money as integer cents (as above) rather than floating-point dollars to avoid rounding drift — a real-world habit, not just a style choice."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "init-only setters: write once, then frozen",
      "id": "init-only"
    },
    {
      "kind": "paragraph",
      "text": "Often you want a value to be set *during construction* and then never change — an order ID, a customer name on a request DTO, a configuration value. Use `init` instead of `set`. An `init` accessor can be assigned in a constructor or an object initializer, but any attempt to assign it afterward is a **compile error**, not a runtime surprise. This is C#'s clean path to immutability without writing a constructor by hand."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "ShippingAddress.cs",
      "code": "public class ShippingAddress\n{\n    public string Street { get; init; } = \"\";\n    public string City   { get; init; } = \"\";\n    public string Zip    { get; init; } = \"\";\n}\n\nvar addr = new ShippingAddress { Street = \"1 Main St\", City = \"Austin\", Zip = \"78701\" };\nConsole.WriteLine($\"{addr.Street}, {addr.City} {addr.Zip}\");\n\n// addr.City = \"Dallas\";\n// ^ COMPILE ERROR CS8852: Init-only property or indexer 'ShippingAddress.City'\n//   can only be assigned in an object initializer, or on 'this'/'base' in a\n//   constructor or an 'init' accessor."
    },
    {
      "kind": "output",
      "output": "1 Main St, Austin 78701",
      "label": "Console output"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "set",
          "items": [
            "Assignable **any time** after construction",
            "`obj.City = \"Dallas\"` works forever",
            "Use for mutable state that genuinely changes",
            "Example: `LoyaltyPoints`, `Status`"
          ]
        },
        {
          "title": "init",
          "items": [
            "Assignable **only** in initializer/constructor",
            "`obj.City = \"Dallas\"` later is a compile error (CS8852)",
            "Use for create-once values (immutability)",
            "Example: `Id`, `CustomerName`, config DTOs"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "private set: mutable inside, read-only outside",
      "id": "private-set"
    },
    {
      "kind": "paragraph",
      "text": "`init` freezes a value forever. But sometimes you want a value the *outside world* can only read, while the object itself changes it through controlled methods. That's `private set` (or `protected set`): the getter is public, the setter is private. Callers can read but never assign; the class mutates it internally. This is how you build a **rich domain model** where state only changes through meaningful operations."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Basket.cs",
      "code": "public class Basket\n{\n    // Public to read, but only Basket itself can change them.\n    public int Count { get; private set; }\n    public int TotalCents { get; private set; }\n\n    public void Add(int priceCents)\n    {\n        Count++;\n        TotalCents += priceCents;\n    }\n}\n\nvar basket = new Basket();\nbasket.Add(1000);\nbasket.Add(250);\nConsole.WriteLine($\"Items: {basket.Count}, Total: {basket.TotalCents}\");\n\n// basket.Count = 99;  // COMPILE ERROR: the set accessor is private."
    },
    {
      "kind": "output",
      "output": "Items: 2, Total: 1250",
      "label": "Console output"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Design intent through accessors",
      "text": "The accessor you choose *documents intent*. `{ get; }` computed = derived. `{ get; init; }` = set once at birth. `{ get; private set; }` = the object owns its changes. `{ get; set; }` = a plain mutable bag. Reach for the most restrictive option that still works — you can always loosen it later, but tightening a public `set` after callers depend on it is painful."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The field keyword (C# 14): validation without the boilerplate",
      "id": "field-keyword"
    },
    {
      "kind": "paragraph",
      "text": "Notice the annoyance in the validation example earlier: to add one `if` check, you had to declare a separate `_quantity` backing field by hand, breaking the clean auto-property look. C# 14 fixes this with the **`field` keyword**. Inside an accessor body, `field` refers to the compiler-synthesized backing field directly — so you can add logic to *one* accessor without declaring or naming a backing field yourself. It works in `get`, `set`, and `init` accessors alike."
    },
    {
      "kind": "examples",
      "intro": "The same email-validating property, before and after C# 14:",
      "examples": [
        {
          "label": "Before C# 14 — manual backing field",
          "code": "public class Account\n{\n    private string _email = \"\";\n    public string Email\n    {\n        get => _email;\n        set => _email = value.Contains('@')\n            ? value\n            : throw new ArgumentException(\"Email must contain '@'.\");\n    }\n}"
        },
        {
          "label": "C# 14 — the field keyword, no _email needed",
          "code": "public class Account\n{\n    public string Email\n    {\n        get;  // trivial getter — compiler keeps the backing field\n        set => field = value.Contains('@')\n            ? value\n            : throw new ArgumentException(\"Email must contain '@'.\");\n    } = \"\";\n}"
        }
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "var acct = new Account { Owner = \"Ada\" };\nacct.Email = \"ada@example.com\";\nConsole.WriteLine($\"{acct.Owner} <{acct.Email}>\");\n\ntry { acct.Email = \"nope\"; }\ncatch (ArgumentException ex) { Console.WriteLine($\"Bad email: {ex.Message}\"); }\n\npublic class Account\n{\n    public required string Owner { get; init; }\n\n    public string Email\n    {\n        get;\n        set => field = value.Contains('@')\n            ? value\n            : throw new ArgumentException(\"Email must contain '@'.\");\n    } = \"\";\n}"
    },
    {
      "kind": "output",
      "output": "Ada <ada@example.com>\nBad email: Email must contain '@'.",
      "label": "Console output (verified on .NET 10 / C# 14)"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: the field name collision",
      "text": "`field` is a *contextual* keyword. If your accessor already references a local, parameter, or member literally named `field`, the keyword wins and shadows your symbol — disambiguate by writing `@field` for *your* identifier versus the bare `field` backing field. In brand-new code this never bites; just don't name things `field`. Also: don't sprinkle `field` everywhere to bolt logic onto every property — once a property has a body it's no longer a trivial auto-property, and reviewers should be able to tell at a glance which properties carry rules."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "required members: the compiler enforces it's set",
      "id": "required"
    },
    {
      "kind": "paragraph",
      "text": "`init` makes a property write-once — but nothing forces the caller to write it at all, so you can still end up with a half-built object. The **`required`** modifier closes that gap: if a property is `required`, the object initializer *must* set it, or the code won't compile. This gives you the safety of a mandatory constructor parameter while keeping the readable object-initializer syntax — perfect for DTOs and API request models where certain fields are non-negotiable."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CreateOrderRequest.cs",
      "code": "public class CreateOrderRequest\n{\n    public required int CustomerId { get; init; }\n    public required string Sku { get; init; }\n    public int Quantity { get; init; } = 1;   // optional, sensible default\n}\n\n// Valid — both required members set:\nvar req = new CreateOrderRequest { CustomerId = 42, Sku = \"KB-01\" };\nConsole.WriteLine($\"Customer {req.CustomerId} wants {req.Quantity}x {req.Sku}\");\n\n// var bad = new CreateOrderRequest { CustomerId = 42 };\n// ^ COMPILE ERROR CS9035: Required member 'CreateOrderRequest.Sku'\n//   must be set in the object initializer or attribute constructor."
    },
    {
      "kind": "output",
      "output": "Customer 42 wants 1x KB-01",
      "label": "Console output"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "required + init = the modern DTO",
      "text": "The combination `public required T X { get; init; }` is the dominant pattern for request/response models and configuration objects in .NET today: **must be supplied** (`required`), **can't be mutated afterward** (`init`), and **readable to construct** (object initializer). Records, which you'll meet soon, build directly on this — a positional record's parameters become exactly these init-only properties for free (and `required` makes them mandatory at every call site)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Putting it together",
      "id": "together"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Just stores a value?** Auto-property: `public string Name { get; set; }`.",
        "**Set once, then frozen?** `init`: `public int Id { get; init; }`.",
        "**Must be supplied by the caller?** Add `required`: `public required string Sku { get; init; }`.",
        "**Read-only outside, the object mutates it?** `private set`: `public int Count { get; private set; }`.",
        "**Derived from other state?** Computed expression-bodied: `public int Total => Price * Qty;`.",
        "**Needs validation on write?** Full `set` body, and reach for the C# 14 `field` keyword instead of a hand-written backing field."
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: properties vs fields vs Python attributes",
      "text": "Three traps for Python folks. (1) A property is **not** a field — `{ get; set; }` compiles to methods, so you can't take a `ref`/`out` to it the way you can a field. (2) `init` and `required` are *compile-time* guarantees, unlike Python where 'read-only' is honor-system. (3) Don't expose a public mutable field 'just to get started' — converting it to a property later silently breaks binary compatibility for any library consumer. Start with a property; it costs nothing."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A **property** looks like a field to callers but is really a pair of accessor methods — use properties for all public state, fields only for private internals.",
        "**Auto-properties** (`{ get; set; }`) generate the backing field for you; add an `= value` to set a default.",
        "Add a **full `set` body** when a value has rules; `value` is the incoming assignment, and throwing inside `set` enforces invariants no caller can bypass.",
        "**Expression-bodied computed properties** (`=>`) derive a value on each read with no backing field — C#'s equivalent of a read-only Python `@property`.",
        "**`init`** makes a property write-once (immutability, enforced as compile error CS8852); **`private set`** keeps it read-only outside while the object mutates it internally.",
        "The **C# 14 `field` keyword** lets you add validation to an accessor without declaring a manual backing field — cleaner encapsulation; works in `get`, `set`, and `init`.",
        "**`required`** forces the caller to set a member in the object initializer at compile time (CS9035 otherwise); `required` + `init` is the modern DTO pattern."
      ]
    }
  ]
};
