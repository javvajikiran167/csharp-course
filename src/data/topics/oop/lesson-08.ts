import type { Lesson } from '@/data/types';

export const lesson08: Lesson = {
  "slug": "abstract",
  "number": 8,
  "title": "Abstract Classes",
  "objective": "Define partial blueprints with abstract classes and abstract members that derived classes must implement — and know when abstract beats an interface.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Some classes exist only to be inherited from. An `abstract class` is a deliberately **unfinished** blueprint: it ships the parts every subclass shares, leaves holes that each subclass *must* fill, and flatly refuses to be created on its own."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by relating to Python's `abc.ABC` / `@abstractmethod`, which most of these students have seen. The big mental shift: in C# this is enforced by the **compiler**, not at runtime when the method is first called. A missing implementation is a build error (`CS0534`), not a `TypeError` you discover in production.",
        "The single most useful framing: 'an abstract class is a normal class that (a) you cannot `new`, and (b) is allowed to declare members with no body that subclasses are forced to implement.' Everything else follows from those two facts.",
        "Save the abstract-vs-interface decision for after they've seen both. By lesson 8 they've already met interfaces (lesson 7), so lean on that. The one-line rule to drill: interface = a contract / capability; abstract class = a partially-built family member with shared state and code.",
        "The template method pattern lands well live: write the concrete `Run()` once, show it calling abstract steps, then implement two subclasses and watch the same orchestration produce different results. That 'aha' is the whole point of abstract classes.",
        "Two compiler errors to show on screen so they recognize them later: `CS0144` (tried to `new` the abstract type) and `CS0534` (subclass forgot an abstract member). Both are in the lesson — actually trigger them live; the speed of the feedback is the lesson.",
        "Heads-up about the `:C` examples: the dollar formatting only appears on machines whose culture is en-US. If a student runs it and sees `€` or `₹`, that's correct behavior, not a bug — it is covered in a tip, but mention it before they panic."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "What problem does an abstract class solve?",
      "id": "the-problem"
    },
    {
      "kind": "paragraph",
      "text": "Imagine a payments system. Card payments, PayPal, and bank transfers all share a flow: validate the amount, log that a charge is starting, actually move the money, then record the result. Only the **move the money** step truly differs. You could copy that surrounding flow into three classes, but then a bug fix to the logging has to be applied three times — and a fourth payment type added next quarter will quietly skip a step someone forgot to copy."
    },
    {
      "kind": "paragraph",
      "text": "An ordinary base class with `virtual` methods gets you part of the way: subclasses *can* override. But \"can\" is not \"must\". Nothing stops a teammate from creating a `PaymentMethod` that never implements the charge step. An **abstract class** closes that gap. It writes the shared flow *once* as real, concrete code, and declares the differing step as an **abstract member** — a method with no body that every subclass is **required** to implement, checked at compile time."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Coming from Python",
      "text": "This is C#'s version of `from abc import ABC, abstractmethod`. A Python `abstractmethod` is enforced when you try to instantiate the subclass *at runtime*; C# enforces it when you **compile**. If a subclass forgets an abstract member, your project simply won't build (`error CS0534`) — you find out in seconds, not from a customer."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Declaring an abstract class",
      "id": "declaring"
    },
    {
      "kind": "paragraph",
      "text": "Mark the class `abstract`. Inside it, mark any member you want subclasses to be forced to implement as `abstract` too — and give it **no body**, just a semicolon (or `{ get; }` with no accessor body for a property). An abstract member is implicitly `virtual`, so subclasses use `override` to supply the implementation. The class can also hold completely ordinary fields, constructors, properties, and fully-written (concrete) methods. That mix is the superpower: shared code *and* mandatory holes in one type."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "PaymentMethod.cs",
      "code": "public abstract class PaymentMethod\n{\n    // Concrete shared state — every payment method has these.\n    public string Currency { get; }\n    protected PaymentMethod(string currency) => Currency = currency;\n\n    // Abstract members: no body. Subclasses MUST implement these.\n    public abstract string Name { get; }\n    public abstract bool Charge(decimal amount);\n\n    // A concrete method that orchestrates the shared flow.\n    // This is the \"template method\" — written once, reused by all.\n    public void Process(decimal amount)\n    {\n        if (amount <= 0)\n            throw new ArgumentOutOfRangeException(nameof(amount), \"Amount must be positive.\");\n\n        Console.WriteLine($\"[{Name}] Charging {amount:C} {Currency}...\");\n        bool ok = Charge(amount);          // <-- calls the subclass's implementation\n        Console.WriteLine(ok ? \"  Succeeded.\" : \"  Declined.\");\n    }\n}"
    },
    {
      "kind": "paragraph",
      "text": "Notice the constructor. Abstract classes **can** have constructors even though you can't instantiate them directly — the constructor runs when a subclass is created, initializing the shared state (here, `Currency`). Marking it `protected` is a nice signal: \"only subclasses call me.\""
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "You cannot instantiate an abstract class",
      "id": "no-new"
    },
    {
      "kind": "paragraph",
      "text": "The class is unfinished, so the compiler refuses to let you create one. This is the rule that catches every beginner once:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var p = new PaymentMethod(\"USD\");\n// error CS0144: Cannot create an instance of the abstract type or interface 'PaymentMethod'"
    },
    {
      "kind": "paragraph",
      "text": "You can still *hold a reference* of the abstract type — that's the whole point of polymorphism. A `PaymentMethod` variable can point at any concrete subclass. You just can't `new` the abstract type itself."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Forcing implementation in subclasses",
      "id": "forcing"
    },
    {
      "kind": "paragraph",
      "text": "Each concrete subclass must `override` every abstract member, or it won't compile. Here are two real implementations. Both inherit `Process` and `Currency` for free; both supply their own `Name` and `Charge`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "public class CardPayment(string currency, string last4) : PaymentMethod(currency)\n{\n    public override string Name => \"Card\";\n\n    public override bool Charge(decimal amount)\n    {\n        Console.WriteLine($\"  Authorizing card ending {last4} via gateway...\");\n        return amount < 5000m;            // pretend the gateway declines large amounts\n    }\n}\n\npublic class PayPalPayment(string currency, string email) : PaymentMethod(currency)\n{\n    public override string Name => \"PayPal\";\n\n    public override bool Charge(decimal amount)\n    {\n        Console.WriteLine($\"  Redirecting {email} to PayPal...\");\n        return true;\n    }\n}\n\n// Polymorphism: a list of the ABSTRACT type holding different concrete subclasses.\nList<PaymentMethod> methods =\n[\n    new CardPayment(\"USD\", \"4242\"),\n    new PayPalPayment(\"USD\", \"buyer@example.com\"),\n];\n\nforeach (PaymentMethod m in methods)\n    m.Process(120m);"
    },
    {
      "kind": "output",
      "label": "Console output (en-US culture)",
      "output": "[Card] Charging $120.00 USD...\n  Authorizing card ending 4242 via gateway...\n  Succeeded.\n[PayPal] Charging $120.00 USD...\n  Redirecting buyer@example.com to PayPal...\n  Succeeded."
    },
    {
      "kind": "paragraph",
      "text": "The constructors use **primary constructor** syntax (C# 12+). `CardPayment(string currency, string last4) : PaymentMethod(currency)` declares parameters and passes `currency` straight up to the base class's constructor. In a *class* (unlike a record), these parameters are captured variables, not auto-properties — `last4` is usable inside the body but isn't a public property, which is exactly what we want here."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: `:C` formats money in the *current culture*",
      "text": "The `{amount:C}` format specifier means \"currency\", and it renders using the thread's **current culture** — `$120.00` in the US, but `120,00 €`, `£120.00`, or `₹120.00` elsewhere. If you run these samples and see a different symbol, your code is correct; your machine's culture just differs. In real services, never let the host's locale decide how money prints. Pass an explicit culture: `amount.ToString(\"C\", new CultureInfo(\"en-US\"))`, or store and format amounts with the currency you actually mean. The outputs in this lesson assume an en-US machine."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Forget an abstract member, and the build fails",
      "id": "forgot"
    },
    {
      "kind": "paragraph",
      "text": "This is the guarantee an abstract class buys you. Declare a subclass that overrides `Name` but forgets `Charge`, and the project will not compile — you cannot even run it, let alone ship it:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "public class GiftCardPayment(string currency) : PaymentMethod(currency)\n{\n    public override string Name => \"Gift Card\";\n    // Oops — forgot to override Charge(decimal).\n}\n// error CS0534: 'GiftCardPayment' does not implement inherited\n//               abstract member 'PaymentMethod.Charge(decimal)'"
    },
    {
      "kind": "paragraph",
      "text": "In Python the equivalent mistake stays silent until something tries to construct a `GiftCardPayment` at runtime. In C# the compiler refuses up front, so a half-finished payment type can never reach a customer."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: abstract is NOT the same as virtual",
      "text": "A **`virtual`** method *has* a body and overriding is **optional** — subclasses may keep the default. An **`abstract`** method has **no** body and overriding is **mandatory** — forget it and the build fails with `CS0534`. Reach for `virtual` when there's a sensible default; reach for `abstract` when there is no meaningful default and every subclass genuinely differs. Also: abstract members can only live inside an abstract class. Put one in a normal class and you'll get `CS0513`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Mixing abstract and concrete members",
      "id": "mixing"
    },
    {
      "kind": "paragraph",
      "text": "This is the line that separates abstract classes from interfaces in spirit. An abstract class is a *partially implemented* type. It can carry state (fields and properties with backing data), constructors, fully-written helper methods, `virtual` methods with overridable defaults, and abstract holes — all in one place. A subclass inherits the finished parts and is forced to complete only the unfinished ones."
    },
    {
      "kind": "examples",
      "intro": "A `Report` base for a business app: shared header/footer logic (concrete), an overridable default (virtual), and one required hole (abstract). (Currency shown assumes en-US — see the `:C` tip above.)",
      "examples": [
        {
          "label": "The abstract base — three kinds of members at once",
          "code": "public abstract class Report\n{\n    public string Title { get; }\n    protected Report(string title) => Title = title;\n\n    // Concrete: same for every report.\n    public string Render()\n        => $\"=== {Title} ===\\n{Body()}\\n{Footer()}\";\n\n    // Virtual: a default subclasses MAY change.\n    protected virtual string Footer() => \"-- end of report --\";\n\n    // Abstract: the hole every report MUST fill.\n    protected abstract string Body();\n}"
        },
        {
          "label": "A subclass that fills only the hole",
          "code": "public class SalesReport(decimal total) : Report(\"Monthly Sales\")\n{\n    protected override string Body() => $\"Total revenue: {total:C}\";\n    // Footer() not overridden — inherits the default.\n}\n\nConsole.WriteLine(new SalesReport(98250m).Render());",
          "output": "=== Monthly Sales ===\nTotal revenue: $98,250.00\n-- end of report --"
        },
        {
          "label": "A subclass that overrides both",
          "code": "public class AuditReport(int events) : Report(\"Security Audit\")\n{\n    protected override string Body() => $\"{events} events reviewed.\";\n    protected override string Footer() => \"-- CONFIDENTIAL --\";\n}\n\nConsole.WriteLine(new AuditReport(17).Render());",
          "output": "=== Security Audit ===\n17 events reviewed.\n-- CONFIDENTIAL --"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: this is the Template Method pattern",
      "text": "`Render()` and `Process()` above are **template methods**: a concrete method that defines the fixed skeleton of an algorithm and delegates the variable steps to abstract (or virtual) members. Write the orchestration once in the base, expose only the steps that vary as abstract holes, and every subclass automatically gets correct, consistent behavior. This is one of the most common and valuable uses of abstract classes in real codebases — and a frequent interview topic."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Abstract class or interface? Choosing well",
      "id": "vs-interface"
    },
    {
      "kind": "paragraph",
      "text": "By now both look similar: each can declare members that implementers must provide. The decisive differences come down to **state**, **inheritance count**, and **intent**. An interface is a pure contract — a capability a type *can* fulfill. An abstract class is a half-built family member that carries shared state and code. A class can implement **many** interfaces but inherit from **only one** (abstract or not) class."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Reach for an abstract class when…",
          "items": [
            "You have **shared state** — fields/properties with real data the base initializes via a constructor.",
            "You have **shared implementation** to write once and reuse (template methods, helpers).",
            "The types form a genuine **\"is-a\" family**: `SalesReport` *is a* `Report`.",
            "You want to control construction with a `protected` constructor.",
            "You need a mix of *required* (abstract) and *default* (virtual/concrete) members in one place."
          ]
        },
        {
          "title": "Reach for an interface when…",
          "items": [
            "You're describing a **capability/contract**, not a family: `IDisposable`, `IComparable<T>`, `IPaymentHandler`.",
            "A type may need **several** of them at once (multiple inheritance of contracts).",
            "Implementers are **unrelated** types that just share an ability.",
            "You want a clean **seam for dependency injection and mocking** in tests.",
            "You don't need stored state (interfaces can't hold instance fields)."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "They're not mutually exclusive — and modern C# blurs the line",
      "text": "Plenty of designs use both: an abstract class implements one or more interfaces and provides shared scaffolding, while subclasses fill in the rest. Note that since C# 8 interfaces can have **default method bodies**, and since C# 11 they support **static abstract members**. The bright line that remains: only an abstract class can hold **instance state** and a **constructor**. If you need stored data and shared initialization, that's still abstract-class territory. The .NET BCL itself leans on abstract bases for framework extension points — `ControllerBase`, `DbContext`, and `BackgroundService` are all abstract classes you inherit and complete."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A note on sealing the lineage",
      "id": "sealed"
    },
    {
      "kind": "paragraph",
      "text": "Abstract classes are about being inherited; the opposite tool is `sealed`, which forbids further inheritance. You'll often mark a *leaf* subclass `sealed` once it's a complete, final implementation — it documents intent and lets the runtime optimize calls. You can also `sealed override` a member to stop the override chain at a particular level while still allowing the class itself to be subclassed."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Gotcha: don't call abstract/virtual members from a constructor",
      "text": "If the base constructor calls an abstract method, the **subclass's** override runs *before* the subclass's constructor body has assigned its fields — so it can observe `null` or default values and behave incorrectly (or throw). (Field *initializers* run before the base constructor, but anything set in the constructor *body* does not.) The same trap exists in Python, but C#'s strict initialization order makes it bite harder. Initialize fully first, then call overridable behavior afterward — e.g. expose a separate `Start()` method the caller invokes once construction is complete."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "An **`abstract class`** is an intentionally unfinished blueprint: you **cannot `new`** it directly (`CS0144`), only its concrete subclasses.",
        "An **`abstract` member** has no body and **must** be `override`-n by every concrete subclass — enforced at **compile time** (`CS0534`), unlike Python's runtime check.",
        "`abstract` = mandatory override, no default; `virtual` = optional override, with a default. Abstract members may only appear inside an abstract class (else `CS0513`).",
        "Abstract classes can **mix** concrete state, constructors, helpers, virtual defaults, and abstract holes — that combination enables the **Template Method** pattern (fixed skeleton in the base, variable steps as abstract members).",
        "Choose an **abstract class** for an \"is-a\" family that shares **state + implementation** (single inheritance); choose an **interface** for a contract/capability that **unrelated** types implement (many at once, no instance state).",
        "Avoid calling abstract/virtual members from a constructor — overrides can run against not-yet-assigned fields. And remember `:C` formats money in the current culture; pass an explicit `CultureInfo` in real code."
      ]
    }
  ]
};
