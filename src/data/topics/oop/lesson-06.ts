import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  "slug": "inheritance",
  "number": 6,
  "title": "Inheritance",
  "objective": "Model is-a relationships with base and derived classes, base() constructor calls, and the protected keyword — and know when NOT to use inheritance.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Sooner or later you notice two classes that are 80% identical — a `Manager` is just an `Employee` with a bonus, an `EmailNotification` is just a `Notification` that also has a subject. Inheritance lets one class **build on** another instead of copy-pasting it. Used well, it removes duplication and models the real world cleanly. Used carelessly, it's the single most regretted decision in object-oriented code. This lesson teaches both halves: how to do it, and when to walk away."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Lead with the duplication pain *before* showing the mechanism — students need to feel the problem inheritance solves, or it reads as ceremony.",
        "Python students have used inheritance (`class Manager(Employee):`) but never met `protected`, `base()`, or the fact that methods are *not* virtual by default. Anchor on those three deltas.",
        "Do NOT teach `virtual`/`override` deeply here — that's the next lesson (Polymorphism). Mention it just enough to make the realistic hierarchy work, and explicitly flag that the deep dive comes next.",
        "The Payments example uses `abstract`/`override` because a realistic payment hierarchy needs them. Reassure self-reading students (and the `note` callout does) that the *mechanism* is the next lesson — here they only need to see how `protected` and `base()` work inside it.",
        "The composition-over-inheritance section is the most important takeaway for their careers. Spend real time on it; the industry has been burned by inheritance-happy codebases for 25 years.",
        "If you run the live demos, point out that `base(...)` runs FIRST (the console proves it) — this surprises people who expect the derived constructor to 'wrap' the base.",
        "Currency/locale formatting is deliberately avoided in outputs so they're reproducible on any machine — a raw `decimal` prints as `5000`, not `$5,000.00`."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The is-a relationship",
      "id": "is-a"
    },
    {
      "kind": "paragraph",
      "text": "Inheritance models one specific relationship: **is-a**. A `Manager` *is an* `Employee`. A `SavingsAccount` *is a* `BankAccount`. When that sentence is genuinely true — not just convenient — inheritance lets the more specific type (the **derived** class) reuse everything the general type (the **base** class) already provides, and then add or specialize on top. If you can't say \"X is a Y\" with a straight face, inheritance is the wrong tool, and we'll see the right one later in this lesson."
    },
    {
      "kind": "paragraph",
      "text": "The syntax is a single colon. In Python you wrote `class Manager(Employee):`; in C# you write `class Manager : Employee`. The colon means \"inherits from\" (and, as you'll see in later lessons, also \"implements this interface\"). A C# class can inherit from **exactly one** base class — there is no multiple inheritance of classes, unlike Python. That constraint is deliberate, and it pushes you toward interfaces and composition when you need to mix in multiple capabilities."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python",
          "items": [
            "`class Manager(Employee):`",
            "Multiple base classes allowed (MRO)",
            "Every method is overridable by default",
            "No real `protected` — `_name` is a convention, `__name` only name-mangles",
            "Constructor: `super().__init__(...)`",
            "Implicitly inherits from `object`"
          ]
        },
        {
          "title": "C#",
          "items": [
            "`class Manager : Employee`",
            "Exactly one base class",
            "Methods are sealed unless marked `virtual` (next lesson)",
            "`protected` is enforced by the compiler",
            "Constructor: `: base(...)`",
            "Implicitly inherits from `object` too — `ToString()`, `Equals()`, `GetHashCode()` come for free"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Base and derived classes",
      "id": "base-and-derived"
    },
    {
      "kind": "paragraph",
      "text": "Here is the canonical business example. An `Employee` has a name and a base salary and can describe its pay. A `Manager` *is an* `Employee` — so it gets the name, the salary, and the `Describe()` method for free — and adds a bonus. Notice how little code `Manager` contains: it inherits everything else."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Payroll.cs",
      "code": "public class Employee\n{\n    public string Name { get; }\n    public decimal BaseSalary { get; }\n\n    public Employee(string name, decimal baseSalary)\n    {\n        Name = name;\n        BaseSalary = baseSalary;\n    }\n\n    public decimal CalculatePay() => BaseSalary;\n\n    public string Describe() => $\"{Name} earns {CalculatePay()} this period.\";\n}\n\n// Manager IS-A Employee. The colon does the inheriting.\npublic class Manager : Employee\n{\n    public decimal Bonus { get; }\n\n    public Manager(string name, decimal baseSalary, decimal bonus)\n        : base(name, baseSalary)   // hand the base its data\n    {\n        Bonus = bonus;\n    }\n}\n\nvar emp = new Employee(\"Ravi\", 5000m);\nvar mgr = new Manager(\"Priya\", 8000m, 2000m);\n\nConsole.WriteLine(emp.Describe());\nConsole.WriteLine(mgr.Describe());            // inherited, no code in Manager\nConsole.WriteLine($\"{mgr.Name}'s bonus is {mgr.Bonus}.\");  // Name inherited, Bonus is new"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Ravi earns 5000 this period.\nPriya earns 8000 this period.\nPriya's bonus is 2000."
    },
    {
      "kind": "paragraph",
      "text": "`Manager` never declares `Name`, `BaseSalary`, `CalculatePay()`, or `Describe()` — yet `mgr.Name` and `mgr.Describe()` both work, because a `Manager` genuinely *is* an `Employee` and carries everything an `Employee` has. That is the whole payoff: write the shared parts once in the base, specialize in the derived class. (Note that `mgr.Describe()` still reports the base salary — making it count the bonus is a job for `virtual`/`override`, which is the very next lesson.)"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "What actually gets inherited",
      "id": "what-is-inherited"
    },
    {
      "kind": "list",
      "items": [
        "**Public and protected members are inherited** — properties, methods, fields, events. The derived class can use them as if it declared them itself.",
        "**Private members are inherited too, but not accessible.** They still exist in every `Manager` object (the base constructor needs them), but the derived class's code cannot see or touch them. This is the wall that `protected` lets you open selectively.",
        "**Constructors are NOT inherited.** Each class declares its own constructors. A derived constructor must arrange for a base constructor to run — that's what `base(...)` does.",
        "**Static members belong to the type that declares them** and are accessed through that type's name; they aren't \"copied\" per derived class.",
        "**`override` and `new` change inherited behavior** rather than adding to it — that's the Polymorphism lesson, next."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Calling base() constructors",
      "id": "base-constructors"
    },
    {
      "kind": "paragraph",
      "text": "An object can't be half-built. Before a `Manager` can exist, the `Employee` part of it must be fully initialized — `Name` and `BaseSalary` set. Since constructors aren't inherited, you forward the base's data with a constructor initializer: `: base(name, baseSalary)`. It's the C# equivalent of Python's `super().__init__(...)`, with one crucial difference in **timing**: the base constructor always runs **first**, completely, before the derived constructor body begins. The console proves it."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Notifications.cs",
      "code": "public class Notification\n{\n    public string Recipient { get; }\n\n    public Notification(string recipient)\n    {\n        Recipient = recipient;\n        Console.WriteLine(\"Notification ctor\");\n    }\n}\n\npublic class EmailNotification : Notification\n{\n    public string Subject { get; }\n\n    public EmailNotification(string recipient, string subject)\n        : base(recipient)              // runs BEFORE this body\n    {\n        Subject = subject;\n        Console.WriteLine(\"EmailNotification ctor\");\n    }\n}\n\nvar email = new EmailNotification(\"ops@acme.com\", \"Deploy done\");\nConsole.WriteLine($\"Email '{email.Subject}' to {email.Recipient}.\");"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Notification ctor\nEmailNotification ctor\nEmail 'Deploy done' to ops@acme.com."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "When can you omit base()?",
      "text": "If the base class has a parameterless constructor (including the default one C# gives a class with no constructors at all), you may drop `: base()` entirely — C# calls it for you automatically. You only *must* write `base(...)` when the base has no parameterless constructor, so you're forced to supply its arguments. Writing it explicitly anyway is often clearer."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The protected keyword",
      "id": "protected"
    },
    {
      "kind": "paragraph",
      "text": "`public` says \"anyone can touch this.\" `private` says \"only this class.\" `protected` is the middle ground built specifically for inheritance: **this class and any class derived from it** can access the member, but outside code cannot. It's how a base class shares internal machinery with its subclasses while still keeping it hidden from the rest of the program. Python has no real equivalent — a leading underscore is just a polite suggestion, whereas C#'s `protected` is enforced by the compiler."
    },
    {
      "kind": "paragraph",
      "text": "The example below uses a couple of features from the next two lessons — `abstract` (a base class you can't instantiate directly) and `override` (a subclass replacing a base method). Don't worry about their mechanics yet; just watch how `DebitCard` and `CreditCard` both reuse the `protected` `Balance` and `TryReserve` helper from their shared base."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Payments.cs",
      "code": "public abstract class PaymentMethod\n{\n    public string Holder { get; }\n\n    // Only PaymentMethod and its subclasses can see Balance...\n    protected decimal Balance { get; set; }\n\n    protected PaymentMethod(string holder, decimal openingBalance)\n    {\n        Holder = holder;\n        Balance = openingBalance;\n    }\n\n    // ...and reuse this shared, protected helper.\n    protected bool TryReserve(decimal amount)\n    {\n        if (amount <= Balance)\n        {\n            Balance -= amount;\n            return true;\n        }\n        return false;\n    }\n\n    public abstract string Charge(decimal amount);   // each subclass must define\n}\n\npublic class DebitCard : PaymentMethod\n{\n    public DebitCard(string holder, decimal openingBalance)\n        : base(holder, openingBalance) { }\n\n    public override string Charge(decimal amount) =>\n        TryReserve(amount)                       // protected helper, reused\n            ? $\"{Holder}: debited {amount}. Remaining: {Balance}.\"\n            : $\"{Holder}: declined. Insufficient funds.\";\n}\n\npublic class CreditCard : PaymentMethod\n{\n    private readonly decimal _creditLimit;\n\n    public CreditCard(string holder, decimal creditLimit)\n        : base(holder, openingBalance: creditLimit)\n    {\n        _creditLimit = creditLimit;\n    }\n\n    public override string Charge(decimal amount)\n    {\n        if (TryReserve(amount))\n        {\n            decimal used = _creditLimit - Balance;\n            return $\"{Holder}: charged {amount}. Credit used: {used} of {_creditLimit}.\";\n        }\n        return $\"{Holder}: declined. Over credit limit.\";\n    }\n}\n\nList<PaymentMethod> methods =\n[\n    new DebitCard(\"Ana\", 100m),\n    new CreditCard(\"Lee\", 500m)\n];\n\nforeach (var m in methods)\n    Console.WriteLine(m.Charge(120m));"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Ana: declined. Insufficient funds.\nLee: charged 120. Credit used: 120 of 500."
    },
    {
      "kind": "paragraph",
      "text": "Both `DebitCard` and `CreditCard` reuse the protected `Balance` and `TryReserve` from their shared base — that's encapsulated logic written once. But outside code, like a billing controller, cannot reach in and set `Balance` directly. Try it and the compiler stops you cold:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var card = new DebitCard(\"Ana\", 100m);\ncard.Balance = 999_999m;   // won't compile"
    },
    {
      "kind": "output",
      "label": "Compiler error",
      "output": "error CS0122: 'PaymentMethod.Balance' is inaccessible due to its protection level"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: protected is a smaller wall, not a smaller door for everyone",
      "text": "`protected` widens access **only to subclasses**, not to \"related\" or same-project code. Beginners often reach for `protected` to share something between two unrelated classes — that's what `internal` (same assembly) is for. Also be careful: every `protected` member is part of your class's contract with everyone who might ever subclass it, so a `protected` field you later want to change can break derived classes you don't even own. Prefer `protected` **methods/properties** over `protected` **fields**, exactly as you prefer properties over public fields."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "is-a vs has-a: when NOT to inherit",
      "id": "is-a-vs-has-a"
    },
    {
      "kind": "paragraph",
      "text": "Here's the mistake that has haunted OOP codebases for decades: reaching for inheritance whenever one class needs something another class has. Inheritance is for **is-a**. If the honest relationship is **has-a** — one thing *contains* or *uses* another — you want **composition**, not inheritance. A `Car` has-a `Engine`; it is not a kind of engine. So `Car` should *hold* an `Engine` field, not inherit from `Engine`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Composition.cs",
      "code": "public class Engine\n{\n    public int HorsePower { get; }\n    public Engine(int horsePower) => HorsePower = horsePower;\n    public string Start() => $\"Engine ({HorsePower} hp) running.\";\n}\n\n// Car HAS-A Engine — it holds one, it does not inherit from it.\npublic class Car\n{\n    private readonly Engine _engine;\n    public string Model { get; }\n\n    public Car(string model, Engine engine)\n    {\n        Model = model;\n        _engine = engine;\n    }\n\n    public string Ignite() => $\"{Model}: {_engine.Start()}\";\n}\n\nvar car = new Car(\"Sedan\", new Engine(180));\nConsole.WriteLine(car.Ignite());"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Sedan: Engine (180 hp) running."
    },
    {
      "kind": "paragraph",
      "text": "Composition is more flexible than inheritance in three ways that matter on real teams. You can **swap** the part at runtime (give the `Car` an `ElectricEngine` instead). You can **combine** many parts (a `Car` has an engine, a transmission, a stereo — you can't inherit from three classes). And you avoid the **fragile base class problem**: when a base class changes, every subclass can break in surprising ways, whereas a composed part only interacts through its public surface. This is why the industry mantra is *favor composition over inheritance* — and why nearly all of ASP.NET Core's design wires objects together with constructor-injected dependencies (composition) rather than deep class hierarchies."
    },
    {
      "kind": "examples",
      "intro": "Run each phrase through the \"is-a / has-a\" test before you type a colon:",
      "examples": [
        {
          "label": "is-a → inherit",
          "code": "// A SavingsAccount IS-A BankAccount.\npublic class SavingsAccount : BankAccount { /* adds interest */ }"
        },
        {
          "label": "has-a → compose",
          "code": "// An Order HAS-A Customer and HAS-A list of LineItems.\npublic class Order\n{\n    public Customer Customer { get; }\n    public List<LineItem> Items { get; } = [];\n}"
        },
        {
          "label": "uses-a → compose (inject)",
          "code": "// An OrderService USES-A repository. Never inherit a dependency.\npublic class OrderService(IOrderRepository repo)\n{\n    public Order? Find(int id) => repo.Get(id);\n}"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: keep hierarchies shallow and honest",
      "text": "Reach for inheritance only for a genuine, stable **is-a** relationship with real shared behavior — and keep the tree shallow (one or two levels). The classic litmus test is the **Liskov Substitution Principle**: anywhere code expects the base type, *any* derived object must work without surprises. If a `Square : Rectangle` would break code that sets width and height independently, the is-a is a lie. When in doubt, compose. You can always extract a base class later if a true family emerges; un-tangling an over-eager hierarchy is far more painful."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Sealing the door",
      "text": "If a class is *not* meant to be a base — most concrete classes aren't — mark it `sealed`: `public sealed class InvoicePdfWriter`. This documents intent, prevents accidental subclassing, and lets the runtime optimize calls. Much of the .NET base class library is `sealed` by design (`string`, for one). Default to `sealed` and open a class for inheritance deliberately, not by accident."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "Inheritance models an **is-a** relationship. Syntax is a single colon: `class Manager : Employee`. A C# class has **exactly one** base class (and implicitly inherits from `object`).",
        "A derived class inherits all **public** and **protected** members; private members exist but aren't accessible; **constructors are not inherited**.",
        "`: base(...)` forwards arguments to a base constructor, which always runs **first**, before the derived constructor body. You can omit it only when a parameterless base constructor exists.",
        "`protected` grants access to the declaring class **and its subclasses** only — the tool for sharing base-class machinery with derived types while hiding it from outside code. Prefer protected methods/properties over protected fields.",
        "Use inheritance only for genuine is-a with shared behavior; for **has-a / uses-a**, prefer **composition** — it's more flexible, swappable, and avoids the fragile base class problem.",
        "Keep hierarchies shallow, honor Liskov substitution, and `sealed` classes you don't intend to be inherited."
      ]
    }
  ]
};
