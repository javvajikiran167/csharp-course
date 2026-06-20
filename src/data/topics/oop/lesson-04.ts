import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  "slug": "encapsulation",
  "number": 4,
  "title": "Access Modifiers & Encapsulation",
  "objective": "Control visibility with public, private, protected, internal, and file, and understand encapsulation as a design principle.",
  "blocks": [
    {
      "kind": "lead",
      "text": "In Python, when you prefix a name with an underscore you are leaving a polite note that says *please don't touch this* — but nothing stops a caller who ignores it. In C#, the compiler enforces the note. Today we learn how to draw a hard line between the parts of a type the world is allowed to use and the parts you keep private, and why that line is one of the most important design decisions you make."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by reframing 'access modifiers' as 'designing a public surface', not 'memorizing keywords'. The list of modifiers is trivia; the *why* is the lesson.",
        "The single biggest mindset shift for Python folks: `private` is real here. Underscore in Python is a convention; `private` in C# is compiler-enforced. Show the `CS0122` error live if you can — it lands harder than a slide.",
        "Spend most of the time on public/private/protected/internal. Mention `protected internal`, `private protected`, and `file` once, accurately, then move on — students will rarely write them but interviewers love asking.",
        "Hammer 'fields private, properties public'. Tie it to the next lesson on properties so it doesn't feel arbitrary.",
        "Good analogy to keep returning to: a car. You use the steering wheel and pedals (public surface); you never reach into the engine while driving (private internals). The manufacturer can swap the engine without changing how you drive.",
        "Watch the money formatting: a `decimal` of `150m` prints as `150`, NOT `150.00` — `decimal` only keeps trailing zeros that are actually in the value. That is exactly why the demo formats with `N2` and `InvariantCulture`; it doubles as a real lesson about deterministic money output (plain `:C` would print your machine's currency symbol)."
      ]
    },
    {
      "kind": "paragraph",
      "text": "Every member you write in C# — every field, property, method, and the type itself — has a **visibility**: a rule about *who is allowed to see and use it*. C# checks these rules at compile time. If code tries to reach something it isn't allowed to touch, the program simply doesn't build. This is a deliberate, enforced contract, and it is the mechanism behind **encapsulation** — the first of the four pillars of object-oriented design."
    },
    {
      "kind": "paragraph",
      "text": "Encapsulation is the practice of **hiding implementation details behind a small, stable surface**. The outside world interacts with what you choose to expose; everything else is yours to change freely. Done well, it means you can rewrite the guts of a class — swap a `List` for a database call, add caching, fix a bug — without breaking a single line of code that uses it. That freedom is the whole point, and access modifiers are the tool that makes it possible."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The five access modifiers (and two combinations)",
      "id": "the-modifiers"
    },
    {
      "kind": "paragraph",
      "text": "C# has a small, fixed vocabulary for visibility. Three of them you will use constantly; the rest are specialists you should recognize but reach for rarely. Here is the complete set, from most open to most closed:"
    },
    {
      "kind": "list",
      "items": [
        "**`public`** — visible to everyone, including code in other projects (assemblies). This is your deliberate, public API surface. Treat every `public` member as a promise you have to keep.",
        "**`private`** — visible only inside the *same type*. This is the default for class members and where the real state of your object lives. Nobody outside can see it, so you are free to change it.",
        "**`protected`** — visible inside the type and to any type that **inherits** from it. Use it for building blocks meant for subclasses but not for general callers.",
        "**`internal`** — visible to all code in the *same assembly* (the same compiled `.dll`/`.exe` project), but invisible to other projects that reference yours. This is the default for top-level types. It is how a library keeps helper classes usable internally while hiding them from consumers.",
        "**`protected internal`** — the **union** of `protected` and `internal`: accessible anywhere in the same assembly **or** from any derived type, even in another assembly. (Think 'protected OR internal'.)",
        "**`private protected`** — the **intersection**: accessible only from derived types that are **also** in the same assembly. (Think 'protected AND internal'.) Rare, but precise.",
        "**`file`** (C# 11+) — visible only within the *single source file* it is declared in. Designed for source generators that need helper types guaranteed not to collide with anything else; you will almost never type it by hand."
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "The two combinations read backwards from English",
      "text": "`protected internal` sounds restrictive but is the *more* permissive one — it means accessible to subclasses **OR** the assembly. `private protected` is the *stricter* one — subclasses **AND** in this assembly. If you ever blank on which is which, remember: `private protected` has `private` in the name, so it's the more private of the two."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What you get when you say nothing: default accessibility",
      "id": "defaults"
    },
    {
      "kind": "paragraph",
      "text": "C# never leaves visibility undefined — if you omit a modifier, the language picks one for you, and the rule depends on *where* you are. This trips up beginners constantly, so it is worth memorizing the two cases you meet daily:"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Members inside a type → private",
          "items": [
            "A field, property, or method with no modifier is **`private`**.",
            "`class Widget { int _secret = 42; }` — `_secret` is private.",
            "So an unmarked member is locked down by default — the safe choice.",
            "You must *opt in* to exposing anything by writing `public`."
          ]
        },
        {
          "title": "Top-level types → internal",
          "items": [
            "A `class`, `struct`, `record`, `interface`, or `enum` with no modifier is **`internal`**.",
            "`class Widget { }` is visible only inside its own project.",
            "Forget `public` on a type in a library and consumers literally cannot see it.",
            "Nested types default to `private` instead, following the member rule."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: forgetting `public` on a library type",
      "text": "Because top-level types default to **`internal`**, a class you build in a class library is invisible to any project that references it unless you mark it `public`. Beginners write `class OrderService { ... }`, reference the library from their web app, and get a baffling 'type or namespace could not be found' error. The fix is almost always a missing `public`. In an app's own startup project it rarely matters, but the moment you build a reusable library, default `internal` becomes very real."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Encapsulation in practice: a bank account",
      "id": "bank-account"
    },
    {
      "kind": "paragraph",
      "text": "Let's make this concrete with a `BankAccount` — the canonical example, because a balance is exactly the kind of state you must never let callers corrupt. The **field** holding the money is `private`. The outside world sees a read-only `Balance` and a `Deposit` method that *validates* before changing anything. The invariant 'you can never deposit a negative amount' is enforced in one place and cannot be bypassed."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "BankAccount.cs",
      "code": "public class BankAccount\n{\n    // private field: the REAL state, hidden from the outside world\n    private decimal _balance;\n\n    public BankAccount(string id, decimal openingBalance)\n    {\n        Id = id;\n        _balance = openingBalance;\n    }\n\n    // public to read, but only THIS class can set it (protects the invariant)\n    public string Id { get; private set; }\n\n    // a read-only window onto the private field\n    public decimal Balance => _balance;\n\n    public void Deposit(decimal amount)\n    {\n        if (amount <= 0)\n            throw new ArgumentException(\"Deposit must be positive.\", nameof(amount));\n        _balance += amount;\n    }\n\n    // protected: derived accounts can use it, outside callers cannot\n    protected void Credit(decimal amount) => _balance += amount;\n}\n\npublic class SavingsAccount : BankAccount\n{\n    private readonly decimal _rate;\n\n    public SavingsAccount(string id, decimal opening, decimal rate)\n        : base(id, opening) => _rate = rate;\n\n    public void ApplyMonthlyInterest()\n    {\n        // allowed: Credit is protected, so a subclass can call it.\n        // NOT allowed: touching base._balance directly — it is private to BankAccount.\n        Credit(Balance * _rate / 12m);\n    }\n}"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Globalization;\n\nvar account = new BankAccount(\"ACC-001\", 100m);\naccount.Deposit(50m);\n// N2 + InvariantCulture = deterministic money output, no machine-specific currency symbol\nConsole.WriteLine($\"Balance: ${account.Balance.ToString(\"N2\", CultureInfo.InvariantCulture)}\");\n\ntry\n{\n    account.Deposit(-10m); // blocked by validation\n}\ncatch (ArgumentException ex)\n{\n    Console.WriteLine($\"Rejected: {ex.Message}\");\n}\n\nvar savings = new SavingsAccount(\"SAV-9\", 1000m, 0.05m);\nsavings.ApplyMonthlyInterest();\nConsole.WriteLine($\"Savings balance: ${savings.Balance.ToString(\"N2\", CultureInfo.InvariantCulture)}\");"
    },
    {
      "kind": "output",
      "output": "Balance: $150.00\nRejected: Deposit must be positive. (Parameter 'amount')\nSavings balance: $1,004.17",
      "label": "Console output"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why format the money instead of printing the raw decimal?",
      "text": "A `decimal` keeps only the trailing zeros that are genuinely part of the value, so `150m` prints as `150` (not `150.00`), and the raw interest result is the unfriendly `1004.1666666666666666666666667`. That is correct math but terrible UI. Formatting with `\"N2\"` rounds to two decimal places for display, and `CultureInfo.InvariantCulture` guarantees the same output on every machine — important, because the culture-aware `:C` format would print *your* operating system's currency symbol (so the very same code might show `$`, `£`, or `₹`)."
    },
    {
      "kind": "paragraph",
      "text": "Look at what the modifiers bought us. The `_balance` field is `private`, so no caller can write `account._balance = 1_000_000;` — that line won't even compile (`error CS0122: 'BankAccount._balance' is inaccessible due to its protection level`). Every change to the balance flows through `Deposit`, which means validation can never be skipped. The `Credit` helper is `protected`, so `SavingsAccount` can post interest, but ordinary code cannot. And `Id` has a `private set`, so it's read-only to the world but settable inside the class. That whole arrangement — a private core, a curated public surface, a protected seam for subclasses — *is* encapsulation."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Why fields are private (and properties are public)",
      "id": "why-fields-private"
    },
    {
      "kind": "paragraph",
      "text": "The single most repeated rule of idiomatic C# is: **fields are private; the public surface is made of properties and methods.** In Python you happily write `self.balance = 100` and expose it directly because a property and an attribute look identical to callers — you can always swap in a `@property` later without breaking anyone. C# does not give you that escape hatch for free: a public field and a public property are *different things* at the binary level, so promoting a field to a property later is a breaking change for already-compiled code that depends on your library."
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**Validation.** A property setter (or a method) can reject bad values; a public field accepts anything, including states that should be impossible.",
        "**Invariants.** Keeping state private means you can guarantee rules across multiple fields — 'start date is never after end date' — that a caller poking individual public fields could violate.",
        "**Freedom to change.** A property can become computed, cached, lazily loaded, or backed by a database call later, with zero impact on callers. A public field can't evolve without breaking the binary contract.",
        "**Encapsulation as a stable surface.** Properties let you expose *what* a value is while hiding *how* it's stored — the essence of hiding implementation behind a stable API."
      ]
    },
    {
      "kind": "paragraph",
      "text": "C# 14 makes the private-field-behind-a-property pattern almost effortless with the new **`field` keyword**. Inside a property accessor, `field` refers to the compiler-generated backing field, so you can add validation without ever declaring the field yourself — the encapsulation is there, but the boilerplate is gone:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "UserProfile.cs",
      "code": "public class UserProfile\n{\n    // No manually declared backing field. 'field' is the compiler-synthesized one.\n    public string DisplayName\n    {\n        get => field;\n        set => field = (value ?? throw new ArgumentNullException(nameof(value))).Trim();\n    } = \"anonymous\"; // property initializer seeds the backing field\n}\n\n// Usage:\nvar u = new UserProfile();\nu.DisplayName = \"  Ada  \";\nConsole.WriteLine($\"[{u.DisplayName}]\"); // trimmed by the setter"
    },
    {
      "kind": "output",
      "output": "[Ada]",
      "label": "Console output"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: design the public surface first, default everything else to private",
      "text": "When you write a class, ask 'what is the smallest set of members a caller actually needs?' Make *those* `public`. Make everything else `private` and only widen to `protected` or `internal` when a concrete need appears — a subclass that genuinely needs a hook, or a helper another class in your assembly must share. A small public surface is a small promise to keep: less to document, less to test, and far more freedom to refactor the internals later. Senior engineers add visibility reluctantly, not generously."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The real-world angle: internal and API design",
      "id": "api-design"
    },
    {
      "kind": "paragraph",
      "text": "On a real team, `internal` is the unsung hero. A NuGet package or a shared company library is a single assembly with a deliberately small `public` API — the handful of types consumers are meant to call. Everything else — parsers, validators, caches, mappers — is marked `internal`. It is fully usable *inside* the library, where it's tested and composed, but it is invisible to the apps that reference the package. That boundary means the library authors can refactor or delete those helper types in any release without it being a breaking change, because no external code was ever allowed to depend on them."
    },
    {
      "kind": "examples",
      "intro": "A few quick scenarios showing how each modifier earns its place in production code:",
      "examples": [
        {
          "label": "internal: a library helper hidden from consumers",
          "code": "// In MyCompany.Payments.dll\npublic class PaymentGateway          // consumers call this\n{\n    private readonly CardProcessor _processor = new();\n    public Receipt Charge(Money amount) => _processor.Run(amount);\n}\n\ninternal class CardProcessor          // invisible outside this .dll\n{\n    public Receipt Run(Money amount) => new Receipt();\n}"
        },
        {
          "label": "protected: an extension point for subclasses",
          "code": "public abstract class BackgroundJob\n{\n    public void Run() => Execute();   // public entry point\n    protected abstract void Execute(); // subclasses fill this in\n    protected void Log(string msg) =>  // shared helper for subclasses\n        Console.WriteLine($\"[job] {msg}\");\n}"
        },
        {
          "label": "private set: read-only to the world, writable inside",
          "code": "public class Order\n{\n    public Guid Id { get; private set; } = Guid.NewGuid();\n    public OrderStatus Status { get; private set; } = OrderStatus.Pending;\n\n    public void MarkPaid() => Status = OrderStatus.Paid; // the ONLY way to change it\n}"
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "Notice the `Order` example: callers can *read* `Status` but can only *change* it by calling `MarkPaid()`. There is no way to set an order to an arbitrary status from outside. That is encapsulation protecting a business rule — exactly the kind of guarantee that prevents a whole category of bugs in a real order-management system, and exactly the kind of design reviewers look for."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: \"protected\" does not mean \"hidden from the world but shown to instances\"",
      "text": "A frequent beginner misreading is that `protected` lets *other instances of unrelated classes* see a member. It does not. `protected` means 'this type plus types that inherit from it'. A sibling class with no inheritance relationship gets exactly the same access as a total stranger: none. Likewise, `private` in C# is per-*type*, not per-*instance* — two `BankAccount` objects can see each other's private fields, which surprises people coming from languages where private is per-object."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "C# enforces visibility at **compile time** — `private` is a real wall, not a Python-style underscore convention. Inaccessible access fails to build (`CS0122`).",
        "The everyday three: **`public`** (everyone), **`private`** (this type only — the default for members), **`protected`** (this type and its subclasses).",
        "**`internal`** = same assembly only; it is the **default for top-level types**, so forget `public` on a library type and consumers can't see it.",
        "The combinations: **`protected internal`** = subclass **OR** assembly (broader); **`private protected`** = subclass **AND** assembly (narrower). **`file`** scopes a type to one source file, mainly for generators.",
        "**Encapsulation = hide implementation behind a small, stable surface.** Keep fields **private**, expose **properties and methods**, and validate on the way in — C# 14's `field` keyword makes that nearly free.",
        "Design the public surface first; default everything else to private and widen reluctantly. A small public API is a small promise and a lot of refactoring freedom.",
        "Money detail worth remembering: a `decimal` prints only the trailing zeros it actually holds (`150m` → `150`), so format for display with `\"N2\"` and `InvariantCulture` for deterministic, locale-independent output."
      ]
    }
  ]
};
