import type { Lesson } from '@/data/types';

export const lesson09: Lesson = {
  "slug": "interfaces",
  "number": 9,
  "title": "Interfaces",
  "objective": "Define contracts with interfaces, implement multiple interfaces, and use modern features like default interface methods (C# 8+).",
  "blocks": [
    {
      "kind": "lead",
      "text": "An interface is a **promise without a body**: it says *what* a type can do, and stays completely silent about *how* it does it. Master interfaces and you have unlocked the single most important design tool in professional C# — the seam that makes code testable, swappable, and built to last."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor everything to the payment-handler / notifier examples — they recur through the lesson so students see the same contract from four angles (definition, multiple implementation, polymorphism, DI).",
        "Python students have met `abc.ABC` and `typing.Protocol`. Lean on `Protocol` for the 'contract' mental model, but stress that C# checks the contract at **compile time**, not at call time.",
        "The interface-vs-abstract-class twoColumn is the part most likely to come up in interviews. Slow down there and have them say the rule aloud: 'interface = can-do, abstract class = is-a-kind-of with shared guts.'",
        "Explicit interface implementation always confuses people. Demo it live: show the member 'disappearing' from IntelliSense on the class reference and reappearing on the interface reference.",
        "Default interface methods are powerful but easy to overuse. Frame them as a **versioning** tool for library authors, not as a replacement for base classes. Note that a default method is *not* visible on the concrete type — only through an interface-typed reference — and that this surprises people.",
        "Watch the `decimal` formatting in the invoice demo: `99.50m` prints as `99.50` (decimal preserves its scale), whereas a `double` would print `99.5`. This is a great teachable aside about why money is `decimal`.",
        "End by connecting interfaces to dependency injection — this is the 'why does anyone care' payoff and sets up the DI lesson later in the course."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "An interface is a contract",
      "id": "interface-as-contract"
    },
    {
      "kind": "paragraph",
      "text": "Think of an interface as a **job description**. It lists the responsibilities a type must fulfil — `Charge`, `Refund`, `Send` — without saying a single word about how the work gets done. Any type that signs the contract (implements the interface) is guaranteed by the compiler to provide every listed member. If it misses one, your code does not compile. That compile-time guarantee is the whole point."
    },
    {
      "kind": "paragraph",
      "text": "In Python you might reach for [`typing.Protocol`](https://docs.python.org/3/library/typing.html#typing.Protocol) or an `abc.ABC` to express the same idea. The shapes look similar, but the enforcement is fundamentally different. Python's duck typing checks 'does this object have a `send` method?' at the moment you call it — at runtime. C# checks 'does this type declare that it implements `INotifier`?' when you compile. A missing method in Python is an `AttributeError` your user discovers in production; in C# it is a red squiggle you fix before lunch."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "INotifier.cs",
      "code": "// A contract: every notifier must be able to Send a message.\n// By convention, C# interface names start with a capital I.\npublic interface INotifier\n{\n    void Send(string message);\n}\n\n// EmailNotifier signs the contract by listing INotifier after the colon.\npublic class EmailNotifier : INotifier\n{\n    public void Send(string message) => Console.WriteLine($\"EMAIL: {message}\");\n}\n\npublic class SmsNotifier : INotifier\n{\n    public void Send(string message) => Console.WriteLine($\"SMS: {message}\");\n}"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "What an interface can and cannot hold",
      "text": "An interface declares **members** — methods, properties, indexers, events — but holds **no instance state**: there are no instance fields. Members are implicitly `public` and `abstract`; you do not write those keywords. Notice that `void Send(string message);` ends in a semicolon, not a body: it is a declaration, a thing the implementer must supply. (The one exception, default method bodies, arrives later in this lesson.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Programming to an interface",
      "id": "programming-to-an-interface"
    },
    {
      "kind": "paragraph",
      "text": "Here is where interfaces earn their keep. When a method accepts the **interface type** instead of a concrete class, it accepts *any* type that signs the contract — including types that do not exist yet. This is the principle 'program to an interface, not an implementation,' and it is the backbone of every maintainable .NET codebase you will ever work in."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// OrderService depends on the CONTRACT, never on a concrete notifier.\nINotifier notifier = new EmailNotifier();   // swap to SmsNotifier and nothing else changes\nvar service = new OrderService(notifier);\nservice.PlaceOrder(\"Laptop\");\n\nclass OrderService(INotifier notifier)        // C# 12+ primary constructor\n{\n    public void PlaceOrder(string item)\n    {\n        Console.WriteLine($\"Order placed: {item}\");\n        notifier.Send($\"Your order for {item} is confirmed.\");\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Order placed: Laptop\nEMAIL: Your order for Laptop is confirmed."
    },
    {
      "kind": "paragraph",
      "text": "`OrderService` has no idea whether it is sending email, an SMS, a Slack message, or writing to a test double that records calls in memory. It only knows the contract. Change the one line `new EmailNotifier()` to `new SmsNotifier()` and the service is none the wiser. This loose coupling is exactly what makes the code testable: in a unit test you pass a fake `INotifier` and assert it was called — no real email leaves your machine."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: declare the abstraction, instantiate the concrete",
      "text": "A good rule of thumb: **accept and return the most general type that still does the job, but create the most specific.** Method parameters, return types, and fields should usually be interfaces (`INotifier`, `IEnumerable<T>`, `IList<T>`); the `new` expression is the one place a concrete type belongs. Do not, however, reflexively create an interface for every single class — add one when you genuinely need a seam: a mock for testing, or a second implementation."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Implementing many interfaces at once",
      "id": "implementing-multiple-interfaces"
    },
    {
      "kind": "paragraph",
      "text": "A class can inherit from only **one** base class, but it can implement **as many interfaces as you like**. This is C#'s answer to multiple inheritance: you compose capabilities rather than stacking base classes. List the interfaces comma-separated after the colon. Here a Stripe handler is both chargeable and refundable, while a cash handler is only chargeable — and the type system tracks that distinction precisely."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Payments.cs",
      "code": "public interface IPaymentHandler\n{\n    string Name { get; }                 // interfaces can declare properties too\n    bool Charge(decimal amount);\n}\n\npublic interface IRefundable\n{\n    bool Refund(decimal amount);\n}\n\n// StripeHandler signs BOTH contracts.\npublic class StripeHandler : IPaymentHandler, IRefundable\n{\n    public string Name => \"Stripe\";\n    public bool Charge(decimal amount) => amount > 0;\n    public bool Refund(decimal amount) => true;\n}\n\n// CashHandler can take money but cannot refund it.\npublic class CashHandler : IPaymentHandler\n{\n    public string Name => \"Cash\";\n    public bool Charge(decimal amount) => true;\n}"
    },
    {
      "kind": "paragraph",
      "text": "Because capabilities are separate interfaces, you can ask at runtime whether a particular handler supports a feature. The `is` pattern both tests the type and gives you a ready-to-use variable when it matches — cleaner than Python's `isinstance` followed by a cast:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Checkout.cs",
      "code": "static void Process(IPaymentHandler handler, decimal amount)\n{\n    if (handler.Charge(amount))\n        Console.WriteLine($\"{handler.Name}: charged {amount} OK\");\n\n    // Only Stripe satisfies IRefundable, so only it enters this branch.\n    if (handler is IRefundable refundable)\n        Console.WriteLine($\"  {refundable.Name} also supports refunds.\");\n}\n\nvar handlers = new List<IPaymentHandler> { new StripeHandler(), new CashHandler() };\nforeach (var h in handlers)\n    Process(h, 19.99m);"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Stripe: charged 19.99 OK\n  Stripe also supports refunds.\nCash: charged 19.99 OK"
    },
    {
      "kind": "paragraph",
      "text": "The matched variable `refundable` is typed as `IRefundable`, so inside that branch you can call any refund-related member directly — no extra cast. Here it shares the `Name` property because `StripeHandler` happens to expose both contracts, but in general `refundable` only sees what `IRefundable` declares."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: implementing an interface is not 'inheriting' from it",
      "text": "Beginners say 'StripeHandler inherits from IPaymentHandler.' It does not. A class **inherits** from at most one base class but **implements** any number of interfaces. There is no shared code coming down from the interface (default methods aside) — the class must supply every member itself. Keep the two verbs distinct: you *extend* a base class, you *implement* a contract."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Interface vs abstract class",
      "id": "interface-vs-abstract-class"
    },
    {
      "kind": "paragraph",
      "text": "This is the design decision — and the interview question — that trips people up most. Both let you write code against an abstraction and plug in concrete types later. The difference is about **state and identity**. An abstract class is a partially-built *thing* with shared fields and ready-made helper methods that all its descendants get for free; you can only have one parent, because an object *is one kind of thing*. An interface is a pure *capability* with no state; you can have many, because an object *can do many things*."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Interface — a capability ('can-do')",
          "items": [
            "A type can implement **many** interfaces.",
            "**No instance fields and no instance constructor** — pure contract, no per-object state.",
            "Members are implicitly `public`; you cannot make them `protected`.",
            "Can hold **default method bodies** (C# 8+) and **static abstract** members (C# 11+).",
            "Use for: DI seams, plug-in/strategy contracts, and BCL roles like `IComparable<T>` and `IEnumerable<T>`.",
            "Closest Python kin: `typing.Protocol`."
          ]
        },
        {
          "title": "Abstract class — a base ('is-a-kind-of')",
          "items": [
            "A type can inherit from only **one** base class.",
            "**Can hold fields, constructors, and full implementations** — shared state and behaviour.",
            "Supports the full range of access modifiers (`protected`, `private`, …).",
            "Mixes `abstract` members (must be overridden) with concrete ones (inherited as-is).",
            "Use for: a family of types sharing real implementation — `ControllerBase`, `DbContext`, `BackgroundService`.",
            "Closest Python kin: `abc.ABC` with concrete methods."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "The one-line rule of thumb",
      "text": "Reach for an **interface** when unrelated types need to share a *capability* (anything can be `IComparable<T>`). Reach for an **abstract class** when closely-related types need to share *implementation and state*. When genuinely torn, prefer the interface — it keeps the single inheritance slot free and couples you to nothing. And remember you can do both: an abstract base class can itself implement interfaces."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Explicit interface implementation",
      "id": "explicit-interface-implementation"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes two interfaces declare a member with the same name, or you want a contract method to be reachable *only* through the interface and hidden from the everyday public surface of the class. **Explicit implementation** solves both: you prefix the member with the interface name and drop the access modifier. The member then exists only when the object is viewed through that specific interface type."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Document.cs",
      "code": "interface IPersist { void Save(); }\ninterface IArchive { void Save(); }   // same name, different intent\n\nclass Document : IPersist, IArchive\n{\n    public void Save() => Console.WriteLine(\"Document.Save (public)\");\n    void IPersist.Save() => Console.WriteLine(\"Persisting to database...\");\n    void IArchive.Save() => Console.WriteLine(\"Archiving to cold storage...\");\n}\n\nvar doc = new Document();\ndoc.Save();                 // the ordinary public method\n((IPersist)doc).Save();     // resolve the IPersist.Save explicitly\n((IArchive)doc).Save();     // resolve the IArchive.Save explicitly"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Document.Save (public)\nPersisting to database...\nArchiving to cold storage..."
    },
    {
      "kind": "paragraph",
      "text": "Notice that `IPersist.Save` and `IArchive.Save` are **not** marked `public` and are invisible on the `doc` variable — IntelliSense will not offer them. They surface only after you cast to the matching interface. Real-world use: the BCL's `List<T>` explicitly implements the non-generic `IList.Add(object?)` so that clumsy, weakly-typed version stays out of your way, while the strongly-typed `List<T>.Add(T)` is what you actually see day to day."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Default interface methods (C# 8+)",
      "id": "default-interface-methods"
    },
    {
      "kind": "paragraph",
      "text": "Since C# 8, an interface member can ship with a **default body**. This was added primarily so library authors can add a new method to a published interface *without breaking the thousands of existing types that already implement it* — those types simply inherit the default. Implementers may still override it when they want different behaviour."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Receipts.cs",
      "code": "public interface IPaymentHandler\n{\n    string Name { get; }\n    bool Charge(decimal amount);\n\n    // Default implementation — no implementer is forced to write this.\n    string Receipt(decimal amount) => $\"[{Name}] charged {amount}\";\n}\n\npublic class StripeHandler : IPaymentHandler\n{\n    public string Name => \"Stripe\";\n    public bool Charge(decimal amount) => amount > 0;\n    // Receipt() not written — Stripe gets the default.\n}\n\npublic class CashHandler : IPaymentHandler\n{\n    public string Name => \"Cash\";\n    public bool Charge(decimal amount) => true;\n    // Cash chooses to override the default.\n    public string Receipt(decimal amount) => $\"Cash sale: {amount}\";\n}\n\nConsole.WriteLine(((IPaymentHandler)new StripeHandler()).Receipt(19.99m));\nConsole.WriteLine(((IPaymentHandler)new CashHandler()).Receipt(19.99m));"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "[Stripe] charged 19.99\nCash sale: 19.99"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: a default method is callable only through the interface",
      "text": "Writing `new StripeHandler().Receipt(19.99m)` directly on the **class** reference will not compile — the default `Receipt` lives on `IPaymentHandler`, not on the class, so you must call it through an `IPaymentHandler`-typed reference (hence the cast above). `CashHandler` is different: because it declares its own `public Receipt`, that method *is* visible on the class. The rule: a default body is only inherited onto the interface, never onto the concrete type. This is exactly why default interface methods are a *versioning* tool, not a substitute for a base class — when you want behaviour visible on the concrete type, use an abstract class."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A preview of the BCL's most important interfaces",
      "id": "bcl-interfaces"
    },
    {
      "kind": "paragraph",
      "text": "You do not only *create* interfaces — you *implement* the framework's interfaces to make your types feel native. Two you will meet constantly: `IComparable<T>` lets `Sort()`, `Min`, and `Max` work on your type by defining a single `CompareTo`; `IEnumerable<T>` lets your type be used in `foreach` and across all of LINQ. Implement `IComparable<Invoice>` and the existing, battle-tested `List<T>.Sort()` immediately knows how to order your invoices — you wrote zero sorting code."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Invoice.cs",
      "code": "public class Invoice(string id, decimal amount) : IComparable<Invoice>\n{\n    public string Id { get; } = id;\n    public decimal Amount { get; } = amount;\n\n    // 'Smaller, equal, or larger?' — return < 0, 0, or > 0.\n    public int CompareTo(Invoice? other) => Amount.CompareTo(other?.Amount ?? 0);\n}\n\nvar invoices = new List<Invoice>\n{\n    new(\"INV-003\", 250m),\n    new(\"INV-001\", 99.50m),\n    new(\"INV-002\", 1000m),\n};\ninvoices.Sort();                                  // uses CompareTo — no custom sort code\nforeach (var inv in invoices)\n    Console.WriteLine($\"{inv.Id}: {inv.Amount}\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "INV-001: 99.50\nINV-003: 250\nINV-002: 1000"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why does it print 99.50 and not 99.5?",
      "text": "`decimal` carries its own *scale* (the number of digits after the point), so `99.50m` remembers that trailing zero and prints `99.50`. A `double` would print `99.5`. This precision and predictability is exactly why money is always `decimal` in real systems, never `double` — and it is why `Invoice.Amount` is a `decimal` here."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Coming later",
      "text": "We will give `IEnumerable<T>`, `IComparable<T>`, `IDisposable`, and friends a full lesson of their own — including writing your own iterators with `yield return`. For now, just internalise the pattern: **implement a framework interface and a huge amount of existing framework machinery suddenly works with your type for free.**"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Why this matters: dependency injection",
      "id": "dependency-injection-motivation"
    },
    {
      "kind": "paragraph",
      "text": "Everything in this lesson converges on one professional pattern that dominates real .NET applications: **dependency injection (DI)**. Instead of a class reaching out and constructing its own collaborators, it declares the *contracts* it needs in its constructor, and the framework hands it concrete implementations at runtime. Look again at `OrderService(INotifier notifier)` — it asks for the `INotifier` capability and never names a concrete notifier. In an ASP.NET Core app you register the mapping once at startup:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "var builder = WebApplication.CreateBuilder(args);\n\n// 'When something needs an INotifier, give it an EmailNotifier.'\nbuilder.Services.AddScoped<INotifier, EmailNotifier>();\nbuilder.Services.AddScoped<OrderService>();\n\n// Later, the container constructs OrderService and injects the right INotifier\n// automatically. Switch the whole app to SMS by changing ONE registration line."
    },
    {
      "kind": "list",
      "items": [
        "**Testability** — in a unit test you register a fake `INotifier` that records calls; no real emails, fully isolated tests.",
        "**Swappability** — move from email to SMS, or from a real database repository to an in-memory one, by changing a single registration line — no service code touched.",
        "**The Dependency Inversion Principle (the 'D' in SOLID)** — high-level policy (`OrderService`) and low-level detail (`EmailNotifier`) both depend on the abstraction (`INotifier`), not on each other."
      ]
    },
    {
      "kind": "paragraph",
      "text": "This is the honest answer to 'when would I ever define an interface?' Most interfaces in a working codebase are not deep type hierarchies — they are one-method DI seams that exist so you can test and evolve your system. Once this clicks, you will see interfaces as the joints that let a large application bend without breaking."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "An interface is a **compile-time contract**: it declares members with no bodies (default methods aside) and no instance state. C# enforces the contract when you compile, unlike Python's runtime duck typing.",
        "**Program to an interface, not an implementation**: accept and return abstractions, instantiate concretes. This loose coupling is what makes code testable and swappable.",
        "A class **inherits one** base class but **implements many** interfaces — compose capabilities (`IPaymentHandler` + `IRefundable`) instead of stacking inheritance.",
        "Choose **interface** for shared *capabilities* across unrelated types; choose **abstract class** for shared *state and implementation* across a related family.",
        "**Explicit implementation** (`void IPersist.Save()`) hides a member from the class surface and resolves name clashes; the member is reachable only via the interface type.",
        "**Default interface methods** (C# 8+) let library authors add members without breaking implementers; the default is callable only through the interface reference, never the concrete type.",
        "Implementing BCL interfaces like **`IComparable<T>`** and **`IEnumerable<T>`** makes your types work with `Sort()`, `foreach`, and LINQ for free.",
        "Interfaces are the foundation of **dependency injection** — the dominant pattern in real .NET apps and the practical reason most interfaces exist."
      ]
    }
  ]
};
