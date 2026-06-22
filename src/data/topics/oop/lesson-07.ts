import type { Lesson } from '@/data/types';

export const lesson07: Lesson = {
  "slug": "polymorphism",
  "number": 7,
  "title": "virtual, override &amp; sealed — Polymorphism",
  "objective": "Achieve runtime polymorphism with virtual/override, prevent further overriding with sealed, and understand why a base reference can run derived behavior.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Polymorphism is the moment object-oriented code stops being a fancy way to organize functions and starts feeling like magic: you hold a variable typed as `Shape`, call `.Area()`, and the **right** code runs — circle math for a circle, rectangle math for a rectangle — even though the line you wrote never mentioned either."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor everything in one running mental image: a `List<Shape>` you loop over once and each element behaves correctly. That single loop is the payoff; sell it early and keep coming back to it.",
        "The Python crowd gets polymorphism for free (every method is virtual) and will be genuinely surprised that C# methods are NOT overridable by default. Lead with that contrast — it explains why `virtual` and `override` even exist as keywords.",
        "Demo the `new`-vs-`override` trap live if you can. Show the same `List<Animal>` printing different results just by swapping `override` to `new`. Beginners rarely believe it until they see the base reference call the base method.",
        "Watch the warning code carefully when you teach the `new` trap: hiding a **virtual** member without `new` raises **CS0114**, while hiding a **non-virtual** member raises **CS0108**. Don't let students memorize one number — the lesson covers a virtual base, so the live warning will say CS0114. The takeaway is 'the compiler is begging you to pick override or new,' not the digit.",
        "`ToString()` is the highest-leverage example because they've already seen it — every `Console.WriteLine(obj)` calls it. Connecting 'override ToString' to debugging payoff makes the whole concept concrete.",
        "Don't conflate overloading (compile-time, same class, different signatures) with overriding (runtime, base/derived, same signature). If a student raises overloading, name the difference explicitly and move on — it's a classic interview confusion.",
        "The constructor-virtual pitfall is subtle: field **initializers** run before the base constructor, so they're safe, but anything assigned in the derived constructor **body** is still at its default when a base-constructor-called virtual fires. If you demo it, assign the field in the body to make the bug visible."
      ]
    },
    {
      "kind": "paragraph",
      "text": "In the last lesson you built inheritance hierarchies — a `Dog` **is-a** `Animal`. That gave you code reuse. Polymorphism is the *other half* of the deal: the ability to treat many different derived types **uniformly** through a common base type, while each one still behaves according to its real type at runtime. The word literally means \"many shapes,\" and the canonical example really is shapes."
    },
    {
      "kind": "paragraph",
      "text": "Here is the difference that trips up every Python programmer. In Python, **all** methods are virtual — if a subclass defines a method with the same name, calling it always runs the subclass version, no keywords required. C# is the opposite: a method is **not** overridable unless you explicitly opt in with `virtual` in the base class and `override` in the derived class. C# trades Python's effortless flexibility for compile-time safety and a small performance win — non-virtual calls can be dispatched directly instead of through a runtime method-table lookup."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "virtual and override: opting into polymorphism",
      "id": "virtual-override"
    },
    {
      "kind": "paragraph",
      "text": "Two keywords do the work. You mark a base method `virtual` to say \"derived types are allowed to replace my behavior.\" You mark the replacement `override` to say \"I am intentionally replacing the inherited virtual method.\" Both are required — `virtual` alone gives you nothing if no one overrides it, and `override` won't compile unless the base member is `virtual` (or `abstract`, which is just \"virtual with no default body and an obligation to override\"). Here is the textbook `Shape.Area()` example, and notice the single loop at the bottom doing all the polymorphic work."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Shapes.cs",
      "code": "public class Shape\n{\n    public string Name { get; }\n    public Shape(string name) => Name = name;\n\n    // 'virtual' = subclasses MAY replace this. The default returns 0.\n    public virtual double Area() => 0;\n}\n\npublic class Circle(double radius) : Shape(\"Circle\")\n{\n    private double Radius { get; } = radius;\n\n    // 'override' = this replaces Shape.Area for Circle instances.\n    public override double Area() => Math.PI * Radius * Radius;\n}\n\npublic class Rectangle(double width, double height) : Shape(\"Rectangle\")\n{\n    public override double Area() => width * height;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // The list is typed as the BASE type, Shape.\n        List<Shape> shapes = [new Circle(2), new Rectangle(3, 4)];\n\n        foreach (Shape s in shapes)\n            // s is a Shape reference, yet the DERIVED Area() runs.\n            Console.WriteLine($\"{s.Name} area = {s.Area():F2}\");\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Circle area = 12.57\nRectangle area = 12.00"
    },
    {
      "kind": "paragraph",
      "text": "Read the loop carefully, because this is the whole lesson in three lines. The variable `s` is declared as `Shape`. The compiler only knows it's *some* shape. Yet `s.Area()` runs `Circle.Area()` for the circle and `Rectangle.Area()` for the rectangle. That is **runtime polymorphism**, also called **dynamic dispatch**: the method that actually executes is decided at run time based on the object's real type, not the compile-time type of the variable holding it."
    },
    {
      "kind": "paragraph",
      "text": "One detail worth naming for the Python crowd: the primary-constructor parameters here (`radius`, `width`, `height`) are captured straight into the method bodies — `Rectangle` never declares backing properties for `width` and `height`, it just uses them. That's a C# 12+ convenience and is unrelated to polymorphism, but it keeps these examples short. The polymorphism is entirely in `virtual` plus `override`."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Why a base reference runs derived behavior",
      "id": "dynamic-dispatch"
    },
    {
      "kind": "paragraph",
      "text": "Under the hood, every type with virtual methods carries a hidden **method table** (often called a vtable) — a list of pointers to the actual code for each virtual method. When you write `s.Area()`, the compiler doesn't hard-code a jump to `Shape.Area`. Instead it emits a `callvirt` instruction: \"look up `Area` in *this object's* method table and call whatever you find.\" A `Circle` object's table points `Area` at the circle implementation, a `Rectangle`'s points at the rectangle one. The variable's declared type (`Shape`) decides what you're *allowed* to call; the object's real type decides *which version* runs. This is precisely why you can write one loop today and add a `Triangle` class next month without touching that loop at all — the new type just brings its own table entry."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "This is the Open/Closed Principle in action",
      "text": "That \"add a `Triangle` without editing the loop\" property is the **O** in **SOLID** — open for extension, closed for modification. In real backends this is everywhere: a `List<IPaymentHandler>` where each handler overrides `Process`, or a renderer that loops over `List<Shape>`. New behavior arrives as a new subclass, never as another `if/else` branch bolted onto existing code. Reviewers love this; a long `switch` statement on a type tag is usually a sign polymorphism was missed."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Calling base.Method(): extend, don't replace",
      "id": "base-call"
    },
    {
      "kind": "paragraph",
      "text": "Sometimes you don't want to throw away the base behavior — you want to *add* to it. Inside an `override`, the keyword `base` gives you a reference to the base-class implementation, so `base.Method()` runs the original version. This is the C# analog of Python's `super().method()`. A common real-world shape: an `Employee` base computes pay, and a `Manager` adds a bonus on top of whatever the base already calculated."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Payroll.cs",
      "code": "using System.Globalization;\n\npublic class Employee(string name, decimal baseSalary)\n{\n    public string Name { get; } = name;\n    protected decimal BaseSalary { get; } = baseSalary;\n\n    public virtual decimal MonthlyPay() => BaseSalary / 12m;\n}\n\npublic class Manager(string name, decimal baseSalary, decimal bonus)\n    : Employee(name, baseSalary)\n{\n    private decimal Bonus { get; } = bonus;\n\n    // Reuse the base calculation, then add the manager bonus.\n    public override decimal MonthlyPay() => base.MonthlyPay() + Bonus / 12m;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // Pin the culture so currency formatting is deterministic.\n        CultureInfo.CurrentCulture = new CultureInfo(\"en-US\");\n\n        Employee e = new Manager(\"Priya\", 120_000m, 24_000m);\n        Console.WriteLine($\"{e.Name}: {e.MonthlyPay():C}\");\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Priya: $12,000.00"
    },
    {
      "kind": "paragraph",
      "text": "Without `base.MonthlyPay()` you'd have to duplicate the `BaseSalary / 12m` formula inside `Manager`, and the day someone changes how base pay is computed, the manager calculation would silently drift out of sync. `base` keeps a single source of truth. (`120000/12 = 10000`, plus `24000/12 = 2000`, gives `12000` — and `:C` formats it as currency.) Note that we pin `CultureInfo.CurrentCulture` to `en-US` so the `$` symbol and comma grouping are guaranteed; on a machine set to, say, German culture the same code would print `12.000,00 €`. Currency formatting is **culture-dependent**, which is a real gotcha when your dev box and your production server disagree."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The new-vs-override trap: hiding is not overriding",
      "id": "new-vs-override"
    },
    {
      "kind": "paragraph",
      "text": "This is the single most important pitfall in the lesson, and it's an interview favorite. If you define a method in a derived class that has the same signature as a base method but you **don't** use `override`, the compiler warns you and assumes you meant to **hide** the base method. You can make that intent explicit with the `new` keyword. Hiding looks almost identical to overriding — until you call through a base-type reference, where the two behave completely differently."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "AnimalSpeak.cs",
      "code": "public class Animal\n{\n    public virtual string Speak() => \"...\";   // virtual: overridable\n}\n\npublic class Dog : Animal\n{\n    public override string Speak() => \"Woof\";  // OVERRIDE: replaces in the vtable\n}\n\npublic class Cat : Animal\n{\n    public new string Speak() => \"Meow\";       // NEW: merely hides, no vtable entry\n}\n\nclass Program\n{\n    static void Main()\n    {\n        Animal dog = new Dog();\n        Animal cat = new Cat();\n\n        Console.WriteLine(dog.Speak());        // dispatches to Dog.Speak\n        Console.WriteLine(cat.Speak());        // base reference -> Animal.Speak!\n        Console.WriteLine(((Cat)cat).Speak()); // cast to Cat -> Cat.Speak\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Woof\n...\nMeow"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: why does the cat say \"...\"?",
      "text": "Because `Cat.Speak` uses `new`, it never replaced the entry in the method table — it only **shadows** `Animal.Speak` when the variable is typed as `Cat`. Through an `Animal` reference, C# picks the method based on the **declared type**, so you get `Animal.Speak` → `\"...\"`. The `Dog` used `override`, so it works correctly through *any* reference. Rule of thumb: you almost always want `override`. If you find yourself typing `new` to silence a compiler warning, stop — that warning is telling you the base method should probably be `virtual` and you should be overriding it. (Concretely: if you delete the `new` keyword from `Cat` here, the compiler raises **CS0114**, because you're hiding a *virtual* member; hiding a *non-virtual* member raises **CS0108** instead. Either way the compiler is asking you to choose `override` or `new` on purpose.) Accidental hiding produces bugs where \"the wrong method runs\" in exactly the polymorphic loops where it matters most."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "override (dynamic dispatch)",
          "items": [
            "Requires the base member to be `virtual` or `abstract`.",
            "Replaces the entry in the method table.",
            "The derived version runs through **any** reference type — base or derived.",
            "This is the real polymorphism you almost always want.",
            "Enables the \"one loop, many behaviors\" pattern."
          ]
        },
        {
          "title": "new (method hiding)",
          "items": [
            "Works even when the base member is not `virtual`.",
            "Creates a separate method; the base entry is untouched.",
            "Which version runs depends on the **declared type** of the variable, not the object.",
            "Almost always a mistake unless you're deliberately versioning a library API.",
            "Omitting `new` still hides, but adds a compiler warning: **CS0114** when the base member is virtual, **CS0108** when it isn't."
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Overriding ToString() for readable output",
      "id": "tostring"
    },
    {
      "kind": "paragraph",
      "text": "You've been using a virtual method this whole course without realizing it. Every object inherits `ToString()` from `object`, and it's `virtual`. By default it returns the fully-qualified type name — useless for debugging. Override it and suddenly `Console.WriteLine(obj)`, string interpolation, and your debugger watch window all show something meaningful, because all of them call `ToString()` polymorphically."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Money.cs",
      "code": "public class Money(decimal amount, string currency)\n{\n    public decimal Amount { get; } = amount;\n    public string Currency { get; } = currency;\n\n    // 'object.ToString()' is virtual, so we override it.\n    public override string ToString() => $\"{Amount:0.00} {Currency}\";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var price = new Money(19.5m, \"USD\");\n        Console.WriteLine(price);             // WriteLine calls ToString()\n        Console.WriteLine($\"Total: {price}\"); // interpolation calls it too\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "19.50 USD\nTotal: 19.50 USD"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Records hand you ToString() for free",
      "text": "If you'd written `public record Money(decimal Amount, string Currency);`, the compiler would generate a `ToString()` override automatically, printing `Money { Amount = 19.50, Currency = USD }`. That's one of the perks of records covered earlier. Reach for a manual `ToString()` override when you want a *custom* format (like `19.50 USD`) or when you're working with a regular class. Both routes rely on the exact same virtual dispatch mechanism."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "sealed: stopping the chain",
      "id": "sealed"
    },
    {
      "kind": "paragraph",
      "text": "Polymorphism is powerful, but sometimes you want to *stop* it. The `sealed` keyword draws a line: \"no further overriding past this point.\" It comes in two flavors. A **sealed override** locks down one method so that subclasses further down the chain can't override it again — they can still inherit it, just not change it. A **sealed class** can't be inherited from at all."
    },
    {
      "kind": "examples",
      "intro": "Two scopes of sealing, plus the payoff:",
      "examples": [
        {
          "label": "sealed override — lock one method mid-hierarchy",
          "code": "public class Document\n{\n    public virtual string Render() => \"generic\";\n}\n\npublic class PdfDocument : Document\n{\n    // Override AND seal: subclasses of PdfDocument may not re-override Render.\n    public sealed override string Render() => \"PDF bytes\";\n}\n\npublic class InvoicePdf : PdfDocument\n{\n    // public override string Render() => ...; // COMPILE ERROR CS0239: sealed\n    public string Summary() => \"line items\";   // adding new members is fine\n}"
        },
        {
          "label": "sealed class — no inheritance at all",
          "code": "public sealed class TaxRate(decimal percent)\n{\n    public decimal Percent { get; } = percent;\n}\n\n// public class StateTaxRate : TaxRate { } // COMPILE ERROR CS0509: cannot derive from sealed type"
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "Why bother? Three reasons from real codebases. **Safety**: sealing protects an invariant a subclass might accidentally break — once `PdfDocument.Render` is correct and security-sensitive, you don't want a careless subclass overriding it. **Intent**: a sealed class is documentation that says \"this type is complete, compose with it, don't extend it\" — that's why `string` and many BCL types are sealed. **Performance**: when the JIT knows a method or type can't be overridden further, it can *devirtualize* the call — skip the method-table lookup and even inline the code. It's a micro-optimization, but it's free, which is why a common piece of advice is to seal concrete classes by default unless you have a reason to allow inheritance."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: design for inheritance, or forbid it",
      "text": "Treat `virtual` and inheritance as a deliberate, documented part of your API surface, not an accident. If you don't intend a class to be a base class, mark it `sealed`. If you do, mark exactly the members you want overridable as `virtual` and document the contract (what an override must and must not do). Leaving everything open \"just in case\" creates the fragile base class problem — every change risks breaking unknown subclasses. In modern .NET, sealing is the safe default for concrete classes; open them up on purpose."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Don't call virtual methods from a constructor",
      "text": "If a base constructor calls a `virtual` method, the **derived** override runs *before* the derived constructor's body has run. Anything the derived constructor assigns **in its body** is still at its `null`/`0` default when the override fires, so the override sees half-built state. (Field *initializers* — like `private string _label = \"ready\";` — are safe, because they run before the base constructor; it's body assignments that bite you.) This is sharper in C# than in Python because of strict, ordered field initialization. Keep constructors doing plain initialization; if you need post-construction polymorphic setup, call a virtual `Initialize()` method *after* the object is fully built."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "C# methods are **not** virtual by default (unlike Python). Mark the base method `virtual` (or `abstract`) and the replacement `override` to enable polymorphism.",
        "**Runtime polymorphism / dynamic dispatch**: a base-type reference runs the *derived* method because the call is resolved from the object's real type via its method table — letting one loop drive many behaviors.",
        "Use `base.Method()` inside an override to extend (not replace) the base behavior and keep a single source of truth.",
        "`new` **hides** a method instead of overriding it — through a base reference it runs the *base* version. This is almost always a bug; prefer `override` and heed the hiding warning (**CS0114** for a virtual base, **CS0108** for a non-virtual one).",
        "Override `ToString()` (it's a virtual on `object`) for readable logs and debugging; records generate one for you automatically.",
        "`sealed` stops overriding: a **sealed override** locks one method against further overriding; a **sealed class** can't be inherited at all. Seal concrete classes by default for safety, clear intent, and a free JIT optimization.",
        "Never call a `virtual` method from a constructor — the override can run against not-yet-initialized derived state (field initializers are safe; constructor-body assignments are not)."
      ]
    }
  ]
};
