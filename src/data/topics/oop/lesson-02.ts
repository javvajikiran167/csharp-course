import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  "slug": "constructors",
  "number": 2,
  "title": "Constructors & Initialization",
  "objective": "Initialize objects safely with constructors, including multiple constructors, constructor chaining, parameter validation, and primary constructors (C# 12).",
  "blocks": [
    {
      "kind": "lead",
      "text": "A constructor is the bouncer at the door of every object: nothing gets created without passing through it, which makes it the single best place to guarantee that an object is **never born in an invalid state**."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor everything to one running example (`BankAccount`) so students see the same type evolve from a naive version into a safe, validated one. Resist introducing five unrelated classes.",
        "The Python bridge that lands hardest: `__init__` is *optional polish* in Python, but in C# the constructor is *the* contract — the type literally will not compile or construct without satisfying it. Say this out loud early.",
        "Spend real time on the `readonly` + constructor combination. Beginners from Python have no mental model for compile-time immutability, and this is where C#'s 'safe by construction' philosophy clicks.",
        "When you reach primary constructors, slow down on the class-vs-record distinction. The mutability gotcha (class params are captured variables, not properties) is a genuine source of production bugs — frame it as an interview favorite.",
        "Run the guard-clause example live and trigger the exception on purpose. Seeing the `ArgumentException` thrown *at construction time* (not later, deep in business logic) is the whole lesson in one moment.",
        "All code here was compiled and run on the .NET 10 SDK; the outputs shown are the literal program output under the en-US culture. If you live-demo with a different culture, the `:C` currency symbol and grouping will differ — call that out so nobody thinks the lesson is wrong."
      ]
    },
    {
      "kind": "paragraph",
      "text": "In Python you write `def __init__(self, ...)` and it is mostly a convenience — you *can* construct a half-built object, monkey-patch attributes on later, and Python shrugs. C# takes the opposite stance: a **constructor** runs automatically when you create an object with `new`, and the language uses it to enforce that every object starts life fully formed and valid. This lesson is about using that enforcement deliberately — multiple constructors, chaining them, validating inputs, the object initializer shortcut, locking fields with `readonly`, and the modern C# 12 **primary constructor** syntax."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Default vs parameterized constructors",
      "id": "default-vs-parameterized"
    },
    {
      "kind": "paragraph",
      "text": "If you write **no** constructor at all, C# silently gives your class a **default (parameterless) constructor** that sets every field to its zero value (`0`, `false`, `null`). The moment you write *any* constructor of your own, that free default disappears — a detail that trips up beginners who suddenly can't write `new BankAccount()` anymore. A **parameterized constructor** takes arguments so the caller *must* supply the data the object needs to be valid."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "BankAccount.cs",
      "code": "public class BankAccount\n{\n    public string Owner { get; set; } = \"\";\n    public decimal Balance { get; set; }\n\n    // Parameterized constructor: the caller MUST provide an owner.\n    public BankAccount(string owner, decimal openingBalance)\n    {\n        Owner = owner;\n        Balance = openingBalance;\n    }\n}\n\nvar account = new BankAccount(\"Ada Lovelace\", 500m);\nConsole.WriteLine($\"{account.Owner} has {account.Balance:C}\");\n\n// var empty = new BankAccount(); // COMPILE ERROR: no parameterless constructor exists anymore."
    },
    {
      "kind": "output",
      "label": "Console (en-US culture)",
      "output": "Ada Lovelace has $500.00"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: the free constructor vanishes",
      "text": "As soon as you declare one parameterized constructor, C# stops generating the implicit parameterless one. If you still want `new BankAccount()` to work — for example because a JSON serializer or EF Core needs to materialize the object — you must add `public BankAccount() { }` back explicitly. In Python this never comes up, because there is no auto-generated `__init__` to lose in the first place."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Constructor overloading: many ways in",
      "id": "overloading"
    },
    {
      "kind": "paragraph",
      "text": "C# lets a class have **multiple constructors** as long as their parameter lists differ in number or types — this is **constructor overloading**. It is the type-safe equivalent of Python's habit of giving `__init__` a pile of optional/default arguments and branching inside. Each overload presents a distinct, self-documenting way to create the object, and the compiler picks the right one at *compile time* based on the arguments you pass."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "BankAccount.cs",
      "code": "public class BankAccount\n{\n    public string Owner { get; set; }\n    public decimal Balance { get; set; }\n\n    // 1) Full control.\n    public BankAccount(string owner, decimal openingBalance)\n    {\n        Owner = owner;\n        Balance = openingBalance;\n    }\n\n    // 2) Convenience: open with a zero balance.\n    public BankAccount(string owner)\n    {\n        Owner = owner;\n        Balance = 0m;\n    }\n}\n\nvar a = new BankAccount(\"Grace Hopper\", 1000m);\nvar b = new BankAccount(\"Linus Torvalds\");\nConsole.WriteLine($\"{a.Owner}: {a.Balance:C}\");\nConsole.WriteLine($\"{b.Owner}: {b.Balance:C}\");"
    },
    {
      "kind": "output",
      "label": "Console (en-US culture)",
      "output": "Grace Hopper: $1,000.00\nLinus Torvalds: $0.00"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Overloads vs optional parameters",
      "text": "C# also supports optional parameters — `public BankAccount(string owner, decimal openingBalance = 0m)` — which often reads better than two near-identical overloads. Reach for overloads when the constructors do *genuinely different work* (e.g. one builds from a database row, another from a DTO); reach for optional parameters when the only difference is a default value."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Constructor chaining with this(...)",
      "id": "constructor-chaining"
    },
    {
      "kind": "paragraph",
      "text": "Notice that the two overloads above duplicate the assignment logic. The fix is **constructor chaining**: one constructor calls another using `: this(...)`, so all real initialization lives in a single place. The chained ('target') constructor runs **first**, then the body of the calling constructor runs. This is the C# answer to a problem Python solves with a single `__init__` plus defaults — here we keep the convenient overloads but funnel them all through one authoritative constructor."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "BankAccount.cs",
      "code": "public class BankAccount\n{\n    public string Owner { get; set; }\n    public decimal Balance { get; set; }\n    public string AccountType { get; set; }\n\n    // The \"master\" constructor — the single source of truth for initialization.\n    public BankAccount(string owner, decimal openingBalance, string accountType)\n    {\n        Owner = owner;\n        Balance = openingBalance;\n        AccountType = accountType;\n        Console.WriteLine($\"Master ctor: opened {accountType} for {owner}\");\n    }\n\n    // Chains to the master ctor, supplying a default account type.\n    public BankAccount(string owner, decimal openingBalance)\n        : this(owner, openingBalance, \"Checking\")\n    {\n        Console.WriteLine(\"Convenience ctor body runs after the master ctor\");\n    }\n\n    // Chains again, supplying a default balance too.\n    public BankAccount(string owner) : this(owner, 0m) { }\n}\n\nvar account = new BankAccount(\"Ada\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Master ctor: opened Checking for Ada\nConvenience ctor body runs after the master ctor"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: funnel through one constructor",
      "text": "Put all validation and assignment in a single 'master' constructor and have every other constructor chain to it with `: this(...)`. You then validate once, in one place, and can never forget to guard a field on some less-used overload. This is the constructor equivalent of the DRY principle, and it scales beautifully as a type grows new ways to be created."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Parameter validation and guard clauses",
      "id": "validation"
    },
    {
      "kind": "paragraph",
      "text": "The whole point of routing construction through one place is so you can **validate** there. A **guard clause** is an early check at the top of the constructor that throws if an argument is invalid, refusing to build a broken object. This is the professional default in real .NET backends: an `Order` with a negative total or a `User` with a null email should be *impossible to construct*, not something you catch three layers deep in business logic. The BCL ships helper guards like `ArgumentException.ThrowIfNullOrWhiteSpace` and `ArgumentOutOfRangeException.ThrowIfNegative` that collapse these checks into one line each."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "BankAccount.cs",
      "code": "public class BankAccount\n{\n    public string Owner { get; }\n    public decimal Balance { get; private set; }\n\n    public BankAccount(string owner, decimal openingBalance)\n    {\n        // Guard clauses: fail fast, with a clear message naming the bad argument.\n        ArgumentException.ThrowIfNullOrWhiteSpace(owner);\n        ArgumentOutOfRangeException.ThrowIfNegative(openingBalance);\n\n        Owner = owner;\n        Balance = openingBalance;\n    }\n}\n\nvar good = new BankAccount(\"Ada\", 100m);\nConsole.WriteLine($\"Created account for {good.Owner}\");\n\nvar bad = new BankAccount(\"   \", -50m); // throws before any field is set"
    },
    {
      "kind": "output",
      "label": "Console + unhandled exception",
      "output": "Created account for Ada\nUnhandled exception. System.ArgumentException: The value cannot be an empty string or composed entirely of whitespace. (Parameter 'owner')"
    },
    {
      "kind": "paragraph",
      "text": "Because the guard for `owner` runs first, that is the exception you see — the negative balance never gets a chance to complain. Notice the helper automatically captured the parameter name `owner` for the message: it uses C#'s `[CallerArgumentExpression]` attribute under the hood, so you never pass the name yourself. The object was never created, so there is no half-initialized `BankAccount` floating around for the rest of the program to trip over later."
    },
    {
      "kind": "examples",
      "intro": "The same validation, written three ways — from most manual to most modern. All three compile and behave identically; the BCL helpers are simply the cleanest in .NET 10.",
      "examples": [
        {
          "label": "Manual throw (works on any .NET version, most explicit)",
          "code": "public BankAccount(string owner, decimal openingBalance)\n{\n    if (string.IsNullOrWhiteSpace(owner))\n        throw new ArgumentException(\"Owner is required.\", nameof(owner));\n    if (openingBalance < 0m)\n        throw new ArgumentOutOfRangeException(nameof(openingBalance),\n            \"Opening balance cannot be negative.\");\n    Owner = owner;\n    Balance = openingBalance;\n}"
        },
        {
          "label": "BCL static guards (.NET 8+, recommended)",
          "code": "public BankAccount(string owner, decimal openingBalance)\n{\n    ArgumentException.ThrowIfNullOrWhiteSpace(owner);\n    ArgumentOutOfRangeException.ThrowIfNegative(openingBalance);\n    Owner = owner;\n    Balance = openingBalance;\n}"
        },
        {
          "label": "Validate inside a property setter with the C# 14 'field' keyword",
          "code": "// 'field' is the compiler-generated backing field, a full C# 14 feature.\npublic string Owner\n{\n    get;\n    set => field = string.IsNullOrWhiteSpace(value)\n        ? throw new ArgumentException(\"Owner is required.\", nameof(value))\n        : value;\n}\n// Assigning Owner = owner; in the constructor now runs this validation automatically."
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Object initializer syntax",
      "id": "object-initializers"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes a type has many optional, independently-set properties and you don't want a constructor with ten parameters. C# offers **object initializer** syntax: call a constructor, then set properties inside `{ }` right at creation. The initializer runs *after* the constructor body, so the constructor still establishes the required core and the initializer fills in the rest. Python has no direct equivalent — the closest is constructing the object and then assigning attributes line by line, but C# folds it into a single expression."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "public class EmailMessage\n{\n    public required string To { get; init; }   // 'required' forces the caller to set it\n    public required string Subject { get; init; }\n    public string Body { get; init; } = \"\";\n    public bool IsHighPriority { get; init; }\n}\n\nvar mail = new EmailMessage\n{\n    To = \"team@contoso.com\",\n    Subject = \"Deploy complete\",\n    Body = \"Release 10.0 is live.\",\n    IsHighPriority = true\n};\n\nConsole.WriteLine($\"To: {mail.To} | {mail.Subject} | Urgent: {mail.IsHighPriority}\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "To: team@contoso.com | Deploy complete | Urgent: True"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "required + init: validation the compiler enforces",
      "text": "Marking a property `required` means the compiler refuses to build the object unless that property is set in the initializer — a constructor-free way to make fields mandatory. Pairing it with `init` means the property can be set during construction/initialization but is read-only afterward. Together they give you the safety of a parameterized constructor with the readability of named assignments. Note that `bool` prints as `True`/`False` (capitalized) — that is `Boolean.ToString()`, not a typo."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "readonly fields set in the constructor",
      "id": "readonly-fields"
    },
    {
      "kind": "paragraph",
      "text": "A `readonly` field can be assigned **only** in its declaration or inside a constructor — never again. This is C#'s compile-time tool for immutability: once the constructor finishes, the value is frozen, and any later assignment is a **compile error**, not a runtime surprise. It is the type-system muscle Python simply does not have (the convention there is a leading underscore and good manners). In real systems we use `readonly` for an entity's identity, injected dependencies, and any value that must not drift after creation."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "BankAccount.cs",
      "code": "public class BankAccount\n{\n    private readonly Guid _id;          // identity: set once, never changes\n    private readonly DateTime _openedUtc;\n    public decimal Balance { get; private set; }\n\n    public BankAccount(decimal openingBalance)\n    {\n        ArgumentOutOfRangeException.ThrowIfNegative(openingBalance);\n        _id = Guid.NewGuid();           // OK: assigning a readonly field in the ctor\n        _openedUtc = DateTime.UtcNow;   // OK\n        Balance = openingBalance;\n    }\n\n    public void ChangeId()\n    {\n        // _id = Guid.NewGuid();        // COMPILE ERROR: readonly field cannot be assigned here\n    }\n\n    public override string ToString() => $\"Account {_id} opened {_openedUtc:u}, balance {Balance:C}\";\n}\n\nvar account = new BankAccount(250m);\nConsole.WriteLine(account.Balance.ToString(\"C\"));"
    },
    {
      "kind": "output",
      "label": "Console (en-US culture)",
      "output": "$250.00"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: readonly is shallow",
      "text": "`readonly` freezes the *field reference*, not the object it points to. A `readonly List<string> _items;` means you can never reassign `_items` to a different list — but you can still call `_items.Add(...)` all day. For deep immutability you need an immutable type (e.g. `ImmutableList<T>`) or a `record`. Beginners often assume `readonly` makes everything reachable through it frozen; it does not."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Primary constructors (C# 12)",
      "id": "primary-constructors"
    },
    {
      "kind": "paragraph",
      "text": "C# 12 introduced **primary constructors**: you declare constructor parameters right after the type name, and they are **in scope throughout the whole class body**. This removes the classic boilerplate of 'parameter, field, assign-in-constructor' that dominated C# for two decades. It shines for dependency injection in ASP.NET Core services, where a class just needs to capture a couple of injected dependencies and use them in its methods."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Before C# 12 (classic constructor)",
          "items": [
            "Declare a private readonly field",
            "Declare a constructor parameter",
            "Assign the parameter to the field",
            "Three lines of ceremony per dependency",
            "`private readonly ILogger _log;` + `public Svc(ILogger log){ _log = log; }`"
          ]
        },
        {
          "title": "C# 12 primary constructor",
          "items": [
            "Parameters sit after the class name",
            "They are visible anywhere in the body",
            "No field declaration, no assignment needed",
            "One line captures the dependency",
            "`public class Svc(ILogger log) { /* use log directly */ }`"
          ]
        }
      ]
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "PaymentService.cs",
      "code": "using Microsoft.Extensions.Logging;\n\n// 'logger' and 'repo' are primary-constructor parameters, usable in any member.\npublic class PaymentService(ILogger<PaymentService> logger, IOrderRepository repo)\n{\n    public void Charge(int orderId, decimal amount)\n    {\n        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount);\n        logger.LogInformation(\"Charging {Amount:C} for order {OrderId}\", amount, orderId);\n        repo.MarkPaid(orderId, amount);\n    }\n}\n\n// A primary constructor can still validate and chain to other constructors:\npublic class Temperature(double celsius)\n{\n    public double Celsius { get; } =\n        celsius >= -273.15\n            ? celsius\n            : throw new ArgumentOutOfRangeException(nameof(celsius), \"Below absolute zero.\");\n\n    public double Fahrenheit => Celsius * 9 / 5 + 32;\n\n    // Overload chains to the primary constructor with : this(...)\n    public Temperature() : this(20.0) { }\n}\n\nvar room = new Temperature();\nConsole.WriteLine($\"{room.Celsius}C = {room.Fahrenheit}F\");"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "20C = 68F"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The class-vs-record gotcha worth an interview point",
      "text": "In a **record**, primary-constructor parameters automatically become public `init` properties (so you write them PascalCase: `record Person(string Name)`). In a **class**, the same parameters are just *captured variables*, NOT properties — they are camelCase by convention, they are mutable, and reassigning one inside the class body compiles with no warning. If you want a public property from a class primary-constructor param, you must declare it: `public string Name { get; } = name;`. Confusing these two behaviors is a top-five primary-constructor bug."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: use primary constructors judiciously",
      "text": "Primary constructors are perfect for records, value-like types, and simple DI-only services where you just capture dependencies. For complex classes with heavy validation, multiple distinct initialization paths, or `readonly` fields you want to be explicit about, a traditional constructor with `readonly` fields is still clearer. Microsoft's own ASP.NET Core team mixes both — pick the one that makes the type easiest to read."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "How initialization actually orders itself",
      "id": "initialization-order"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**Field and property initializers** run first (e.g. `public string Owner { get; set; } = \"\";`), in top-to-bottom order.",
        "If the constructor **chains** with `: this(...)` or `: base(...)`, that target constructor runs next (and *its* own field initializers and base chain run before *its* body).",
        "Finally, the **body** of the constructor you called executes — which is why guard clauses and assignments in the body win out over plain field initializers.",
        "**Pitfall:** never call an overridable (`virtual`) method from a constructor — in a derived type the override runs before the derived constructor finishes, so it can see fields that aren't initialized yet."
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A constructor runs on `new` and is the place to guarantee an object starts **valid**; unlike Python's optional `__init__`, C# enforces it at compile time.",
        "Writing any constructor removes the free parameterless one — add `public Type() { }` back if a serializer or framework still needs it.",
        "Overload constructors for genuinely different creation paths, and use **constructor chaining** (`: this(...)`) so all real initialization and validation lives in one master constructor.",
        "Use **guard clauses** (`ArgumentException.ThrowIfNullOrWhiteSpace`, `ArgumentOutOfRangeException.ThrowIfNegative`) to fail fast and never build a broken object; they auto-capture the argument name via `[CallerArgumentExpression]`.",
        "**Object initializers** plus `required`/`init` give readable, named, compiler-enforced initialization without a giant constructor signature.",
        "`readonly` fields can be set only in the declaration or a constructor, giving compile-time immutability — but remember it's shallow (it freezes the reference, not the pointed-to object).",
        "**Primary constructors** (C# 12) cut boilerplate, especially for DI; just remember that class params are mutable captured variables while record params become public `init` properties."
      ]
    }
  ]
};
