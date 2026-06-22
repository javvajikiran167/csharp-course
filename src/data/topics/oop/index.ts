import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';
import { lesson08 } from './lesson-08';
import { lesson09 } from './lesson-09';
import { lesson10 } from './lesson-10';
import { lesson11 } from './lesson-11';

export const oop: Topic = {
  slug: "oop",
  title: "Object-Oriented Programming",
  subtitle: "Classes, objects, inheritance, interfaces, polymorphism, encapsulation, records, and value types — the heart of every C# codebase and the most-tested area in interviews.",
  status: 'unlocked',
  lessons: [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06, lesson07, lesson08, lesson09, lesson10, lesson11],
  quiz: [
  {
    "id": "oop-q1",
    "kind": "mcq",
    "prompt": "You write `var account = new BankAccount();`. In C#, what does the `new` keyword do here?",
    "options": [
      {
        "label": "Allocates a new `BankAccount` object on the heap, runs its constructor, and returns a reference to it",
        "correct": true
      },
      {
        "label": "Creates a copy of an existing `BankAccount` value on the stack",
        "correct": false
      },
      {
        "label": "Declares the `BankAccount` class so it can be used later",
        "correct": false
      },
      {
        "label": "Imports the `BankAccount` type from another namespace",
        "correct": false
      }
    ],
    "explanation": "A class is a reference type, so `new` allocates an instance on the heap, invokes the constructor, and hands back a reference. Unlike Python (where you just call `BankAccount()`), C# uses the explicit `new` keyword. The class is the blueprint; each `new` produces a distinct object with its own field values."
  },
  {
    "id": "oop-q2",
    "kind": "predict",
    "prompt": "What does this program print?",
    "code": "var a = new Counter();\nvar b = a;            // copy the reference\nb.Value = 10;\nConsole.WriteLine(a.Value);\n\nclass Counter\n{\n    public int Value;\n}",
    "options": [
      {
        "label": "10",
        "correct": true
      },
      {
        "label": "0",
        "correct": false
      },
      {
        "label": "Compile error — `Value` has no initializer",
        "correct": false
      },
      {
        "label": "null",
        "correct": false
      }
    ],
    "explanation": "`Counter` is a class (reference type), so `b = a` copies the reference, not the object. `a` and `b` point to the same instance, so mutating through `b` is visible through `a` — it prints `10`. This is the same aliasing Python objects have. A `struct` would copy by value and print `0`. (Note: an `int` field defaults to `0`, so no initializer is needed.)"
  },
  {
    "id": "oop-q3",
    "kind": "predict",
    "prompt": "Constructor chaining and primary constructors (C# 12). What does this print?",
    "code": "var b = new Box();\nConsole.WriteLine($\"{b.W} x {b.H}\");\n\nclass Box\n{\n    public int W { get; }\n    public int H { get; }\n    public Box(int w, int h) { W = w; H = h; }\n    public Box() : this(3, 4) { }   // chain to the two-arg ctor\n}",
    "options": [
      {
        "label": "3 x 4",
        "correct": true
      },
      {
        "label": "0 x 0",
        "correct": false
      },
      {
        "label": "3 x 3",
        "correct": false
      },
      {
        "label": "Compile error — cannot call `this(...)`",
        "correct": false
      }
    ],
    "explanation": "`: this(3, 4)` chains to another constructor of the **same** class, which runs first and sets `W=3, H=4` before the empty body executes — the idiomatic way to avoid duplicated initialization. (`: base(...)` would instead call a base class constructor.) So it prints `3 x 4`."
  },
  {
    "id": "oop-q4",
    "kind": "predict",
    "prompt": "This class uses a C# 12 primary constructor. What does it print?",
    "code": "var svc = new Greeter(\"Ada\");\nConsole.WriteLine(svc.Welcome());\n\nclass Greeter(string name)\n{\n    public string Welcome() => $\"Hello, {name}!\";\n}",
    "options": [
      {
        "label": "Hello, Ada!",
        "correct": true
      },
      {
        "label": "Hello, !",
        "correct": false
      },
      {
        "label": "Compile error — `name` is not a property",
        "correct": false
      },
      {
        "label": "Hello, name!",
        "correct": false
      }
    ],
    "explanation": "In a **class**, primary-constructor parameters become private captured variables usable throughout the class body — here `name` is captured and interpolated, printing `Hello, Ada!`. Gotcha: in a class these params are *not* public properties (unlike in a `record`), so `svc.name` would not compile. They're also mutable captured variables, which can surprise you."
  },
  {
    "id": "oop-q5",
    "kind": "mcq",
    "prompt": "Which declaration creates an auto-property that can be set during object initialization but is read-only afterward?",
    "options": [
      {
        "label": "`public string Name { get; init; }`",
        "correct": true
      },
      {
        "label": "`public string Name { get; set; }`",
        "correct": false
      },
      {
        "label": "`public readonly string Name { get; }`",
        "correct": false
      },
      {
        "label": "`public string Name { get; private get; }`",
        "correct": false
      }
    ],
    "explanation": "`init` allows assignment only in a constructor or object initializer (`new Person { Name = \"...\" }`), then locks the property. `set` permits writes anytime; a get-only auto-property (`{ get; }`) can't be set in an object initializer. `readonly` is not a valid property accessor modifier, and `private get` is not valid syntax."
  },
  {
    "id": "oop-q6",
    "kind": "predict",
    "prompt": "This property uses the C# 14 `field` keyword to validate on set. What does the program print?",
    "code": "var p = new Product();\np.Name = \"Widget\";\ntry { p.Name = \"\"; }\ncatch (ArgumentException) { Console.WriteLine(\"rejected\"); }\nConsole.WriteLine(p.Name);\n\nclass Product\n{\n    public string Name\n    {\n        get => field;\n        set => field = string.IsNullOrWhiteSpace(value)\n            ? throw new ArgumentException(\"required\")\n            : value;\n    }\n}",
    "options": [
      {
        "label": "rejected then Widget",
        "correct": true
      },
      {
        "label": "rejected then an empty line",
        "correct": false
      },
      {
        "label": "Widget",
        "correct": false
      },
      {
        "label": "Compile error — `field` is undefined",
        "correct": false
      }
    ],
    "explanation": "C# 14's `field` keyword gives direct access to the compiler-synthesized backing field, so you add validation without declaring one manually. The first assignment stores `\"Widget\"`; the empty assignment throws and is caught (printing `rejected`), leaving the backing field unchanged. So the final value is still `Widget`. This is the modern, concise way to protect invariants in a setter."
  },
  {
    "id": "oop-q7",
    "kind": "mcq",
    "prompt": "What does the `internal` access modifier mean in C#?",
    "options": [
      {
        "label": "The member is accessible anywhere within the same assembly, but not from other assemblies",
        "correct": true
      },
      {
        "label": "The member is accessible only within the same class",
        "correct": false
      },
      {
        "label": "The member is accessible only within the same class and its derived classes",
        "correct": false
      },
      {
        "label": "The member is accessible from anywhere, including other assemblies",
        "correct": false
      }
    ],
    "explanation": "`internal` scopes visibility to the current **assembly** (your compiled .dll/.exe) — ideal for code that's shared inside your project but should not leak to library consumers. `private` is class-only, `protected` is class-plus-derived, and `public` is unrestricted. Python has no real enforcement here (just `_name` conventions); C# enforces these at compile time."
  },
  {
    "id": "oop-q8",
    "kind": "fill",
    "prompt": "Encapsulation: complete the modifier so this field is visible only inside the class itself (the C# convention instead of exposing a public field).",
    "template": "___ decimal _balance;",
    "accept": [
      "private"
    ],
    "explanation": "`private` hides the field so callers must go through a public property or method, letting you enforce invariants (e.g., 'balance can't go negative'). This is real encapsulation — unlike Python's `_balance`/`__balance` naming conventions, `private` is enforced by the compiler. Fields are conventionally private; expose state through properties."
  },
  {
    "id": "oop-q9",
    "kind": "predict",
    "prompt": "Static members belong to the type, not an instance. What does this print?",
    "code": "Console.WriteLine(Circle.Create().Area());\nConsole.WriteLine(Circle.Count);\n\nclass Circle\n{\n    public static int Count { get; private set; }\n    public double Radius { get; init; }\n    private Circle() => Count++;\n    public static Circle Create() => new Circle { Radius = 2 };\n    public double Area() => 3.14 * Radius * Radius;\n}",
    "options": [
      {
        "label": "12.56 then 1",
        "correct": true
      },
      {
        "label": "12.56 then 0",
        "correct": false
      },
      {
        "label": "12.56 then 2",
        "correct": false
      },
      {
        "label": "Compile error — cannot call private constructor",
        "correct": false
      }
    ],
    "explanation": "`Count` is a static property — shared by the type, not per-instance. `Create()` is a static factory that calls the private constructor once, incrementing `Count` to `1`, and sets `Radius = 2`, giving `Area = 3.14 * 4 = 12.56`. The factory can call the private constructor because it's a member of the same class. Static members are accessed as `Circle.Count`, not via an instance."
  },
  {
    "id": "oop-q10",
    "kind": "mcq",
    "prompt": "Which statement about `static` classes is correct?",
    "options": [
      {
        "label": "A static class cannot be instantiated and can only contain static members",
        "correct": true
      },
      {
        "label": "A static class can be instantiated but shares one instance across the app",
        "correct": false
      },
      {
        "label": "A static class can hold instance fields as long as the methods are static",
        "correct": false
      },
      {
        "label": "A static class can be used as a base class for inheritance",
        "correct": false
      }
    ],
    "explanation": "A `static` class (like `Math` or `Console`) cannot be `new`-ed, cannot be inherited, and may only contain static members — it's a container for stateless utility behavior. The 'one shared instance' idea is the Singleton (a normal class), not a static class. Overusing static state hurts testability and thread-safety, so prefer instances + dependency injection for anything stateful."
  },
  {
    "id": "oop-q11",
    "kind": "predict",
    "prompt": "Inheritance with a base constructor call and `protected`. What does this print?",
    "code": "var dog = new Dog(\"Rex\");\nConsole.WriteLine(dog.Describe());\n\nclass Animal(string name)\n{\n    protected string Name => name;\n    public string Describe() => $\"{Name} is an animal\";\n}\n\nclass Dog(string name) : Animal(name)\n{\n}",
    "options": [
      {
        "label": "Rex is an animal",
        "correct": true
      },
      {
        "label": " is an animal",
        "correct": false
      },
      {
        "label": "Rex is a dog",
        "correct": false
      },
      {
        "label": "Compile error — `Name` is protected",
        "correct": false
      }
    ],
    "explanation": "`Dog : Animal(name)` passes its constructor argument up to the base via the primary-constructor base call `Animal(name)` — the equivalent of `: base(name)`. `Name` is `protected`, so it's reachable inside `Animal` and its derived types (used here in `Animal.Describe()`) but not from outside callers. Output: `Rex is an animal`."
  },
  {
    "id": "oop-q12",
    "kind": "predict",
    "prompt": "Runtime polymorphism. What does this print?",
    "code": "Shape s = new Square();\nConsole.WriteLine(s.Name());\n\nclass Shape\n{\n    public virtual string Name() => \"shape\";\n}\n\nclass Square : Shape\n{\n    public override string Name() => \"square\";\n}",
    "options": [
      {
        "label": "square",
        "correct": true
      },
      {
        "label": "shape",
        "correct": false
      },
      {
        "label": "Compile error — `s` is typed as `Shape`",
        "correct": false
      },
      {
        "label": "shapesquare",
        "correct": false
      }
    ],
    "explanation": "Because `Name()` is `virtual` in the base and `override` in `Square`, the runtime dispatches to the **actual object's** type — even though the variable is declared as `Shape`. So it prints `square`. This is runtime polymorphism. In C#, methods are *not* virtual by default (unlike Python). Had `Square` used `new` instead of `override`, a base reference would print `shape`."
  },
  {
    "id": "oop-q13",
    "kind": "mcq",
    "prompt": "What is the effect of marking a method `sealed override` in a derived class?",
    "options": [
      {
        "label": "It overrides the base method but prevents any further class from overriding it again",
        "correct": true
      },
      {
        "label": "It hides the base method without participating in polymorphism",
        "correct": false
      },
      {
        "label": "It makes the method abstract so deeper subclasses must implement it",
        "correct": false
      },
      {
        "label": "It prevents the method from being called outside the class",
        "correct": false
      }
    ],
    "explanation": "`sealed override` provides an override AND locks the chain — classes deriving below this one can no longer override the method. It's used to stop a virtual member from being further customized (a Liskov-safety or performance decision). Hiding (non-polymorphic) is done with `new`; restricting call visibility is done with access modifiers like `private`."
  },
  {
    "id": "oop-q14",
    "kind": "fill",
    "prompt": "Declare a method that has no body and MUST be implemented by every non-abstract derived class. Fill in the keyword.",
    "template": "public ___ decimal CalculatePay();",
    "accept": [
      "abstract"
    ],
    "explanation": "An `abstract` method has no body and forces every concrete derived class to provide an `override`. It can only live inside an `abstract class`. Compare with a `virtual` method, which supplies a default body that derived classes *may* override. Abstract members are how an abstract base says 'I define the contract; you fill in the behavior.'"
  },
  {
    "id": "oop-q15",
    "kind": "mcq",
    "prompt": "When should you prefer an abstract class over an interface?",
    "options": [
      {
        "label": "When you need to share common state (fields) and implemented behavior across a family of related types",
        "correct": true
      },
      {
        "label": "When a type needs to satisfy several unrelated contracts at once",
        "correct": false
      },
      {
        "label": "When you want value-based equality for free",
        "correct": false
      },
      {
        "label": "When you want members accessible only across the same assembly",
        "correct": false
      }
    ],
    "explanation": "An abstract class can carry fields, constructors, and concrete shared implementation — ideal for a true type family (e.g., `BackgroundService`, `ControllerBase`). But a class can inherit only one base. An interface is a pure contract supporting *multiple* implementation per type and is the right tool when types are unrelated or you need DI seams. Value equality comes from records, not from the abstraction choice."
  },
  {
    "id": "oop-q16",
    "kind": "predict",
    "prompt": "Records give value equality and `with`-expressions for free. What does this print?",
    "code": "var p1 = new Point(1, 2);\nvar p2 = new Point(1, 2);\nvar p3 = p1 with { Y = 9 };\nConsole.WriteLine(p1 == p2);\nConsole.WriteLine(p1 == p3);\nConsole.WriteLine(p3);\n\nrecord Point(int X, int Y);",
    "options": [
      {
        "label": "True, False, Point { X = 1, Y = 9 }",
        "correct": true
      },
      {
        "label": "False, False, Point { X = 1, Y = 9 }",
        "correct": false
      },
      {
        "label": "True, True, Point",
        "correct": false
      },
      {
        "label": "True, False, Point(1, 9)",
        "correct": false
      }
    ],
    "explanation": "Records provide value-based equality automatically: `p1 == p2` is `True` because their X/Y values match (a class would compare references and print `False`). The `with` expression makes a copy changing only `Y`, so `p3` is `Point(1, 9)` and `p1 == p3` is `False`. Records also auto-generate a readable `ToString`: `Point { X = 1, Y = 9 }`. Note records are reference types unless declared `record struct`."
  }
],
  practice: [
  {
    "id": "oop-p1",
    "difficulty": "easy",
    "title": "Your First Class: A BankAccount Blueprint",
    "prompt": "Define a class `BankAccount` and create objects from it with `new`.\n\nThe class must have:\n- A field `Owner` (string) and a field `Balance` (decimal).\n- A method `Deposit(decimal amount)` that adds to the balance.\n- A method `Describe()` that prints `\"<Owner> has <Balance:C>\"` (use the `:C` currency format).\n\nIn top-level statements, create TWO separate `BankAccount` objects, set their owners and starting balances, deposit different amounts into each, then call `Describe()` on both.\n\nGoal: prove you understand that a class is a blueprint and each `new` produces an independent instance with its own state.",
    "hints": [
      "A class is like a Python class, but you declare field types explicitly: `public string Owner;`",
      "Create an instance with `var acc = new BankAccount();` then set `acc.Owner = \"Maya\";`",
      "`Console.WriteLine($\"{Owner} has {Balance:C}\")` — the `:C` gives you e.g. $1,200.00",
      "Change one object's balance and confirm the other is unaffected — they are separate instances."
    ]
  },
  {
    "id": "oop-p2",
    "difficulty": "easy",
    "title": "Constructors, Chaining, and Validation",
    "prompt": "Rewrite `BankAccount` so it can only ever be created in a valid state.\n\nRequirements:\n- A constructor `BankAccount(string owner, decimal startingBalance)` that throws `ArgumentException` if `owner` is null/whitespace, and `ArgumentOutOfRangeException` if `startingBalance` is negative.\n- A SECOND constructor `BankAccount(string owner)` that chains to the first using `: this(owner, 0m)` (constructor chaining).\n- Keep the `Deposit` method, and have it throw `ArgumentOutOfRangeException` for non-positive amounts.\n\nIn top-level statements: create one account with both constructors, deposit successfully once, then wrap a bad deposit (e.g. `-50`) in a try/catch and print the caught exception's message.\n\nBonus: add a third version of the class using a PRIMARY CONSTRUCTOR (`class BankAccount(string owner, decimal startingBalance)`) and note in a comment how it differs.",
    "hints": [
      "Constructor chaining: `public BankAccount(string owner) : this(owner, 0m) { }`",
      "`if (string.IsNullOrWhiteSpace(owner)) throw new ArgumentException(\"Owner required\", nameof(owner));`",
      "Validation in ONE place (the main ctor) means the chaining ctor inherits it for free.",
      "Primary-ctor params on a CLASS are captured variables, not properties — you still need to expose state yourself."
    ]
  },
  {
    "id": "oop-p3",
    "difficulty": "easy",
    "title": "Properties: Auto, Computed, Init, and the field Keyword",
    "prompt": "Model a `Temperature` type that protects its own invariants using properties (never public fields).\n\nRequirements:\n- An auto-property `Label` with `get` and `init` (init-only — settable only during object initialization).\n- A property `Celsius` (double) that uses the C# 14 `field` keyword to validate on set: reject anything below absolute zero (-273.15) by throwing `ArgumentOutOfRangeException`; otherwise store `value` in `field`.\n- A COMPUTED, expression-bodied read-only property `Fahrenheit` that returns `Celsius * 9 / 5 + 32`.\n\nIn top-level statements: create a `Temperature` with an object initializer `{ Label = \"Room\", Celsius = 21 }`, print its Fahrenheit, then try setting `Celsius = -300` inside a try/catch and print the message. Confirm that `Label` cannot be reassigned after construction (leave that as a comment explaining why it won't compile).",
    "hints": [
      "Init-only: `public string Label { get; init; }` — assignable in an initializer, read-only after.",
      "`field` keyword: `public double Celsius { get; set { if (value < -273.15) throw ...; field = value; } }`",
      "Expression-bodied computed property: `public double Fahrenheit => Celsius * 9 / 5 + 32;`",
      "`field` lets you add validation WITHOUT declaring a private backing field by hand."
    ]
  },
  {
    "id": "oop-p4",
    "difficulty": "medium",
    "title": "Encapsulation with Access Modifiers",
    "prompt": "Design a `PasswordVault` that demonstrates real encapsulation — not Python's name-mangling convention, but compiler-enforced access control.\n\nRequirements:\n- A `private` field or backing store that holds the actual secret (never exposed directly).\n- A `public` method `Unlock(string attempt)` returning `bool`.\n- A `private` helper method `Hash(string input)` (a trivial transformation is fine — e.g. reverse the string) used internally only.\n- A `protected` method `OnUnlockFailed()` that a future subclass could override-hook into (just print a message for now).\n- An `internal` property `AttemptCount` (visible within the assembly, e.g. for diagnostics/tests).\n\nIn top-level statements: construct the vault with a secret, call `Unlock` with a wrong then a right guess, and print results plus `AttemptCount`. In comments, explain what would happen if external code tried to call `Hash` directly, and what `internal` means at the assembly boundary.",
    "hints": [
      "`private` members are invisible OUTSIDE the class — the compiler enforces it, unlike Python's `_name`.",
      "`internal` = visible anywhere in the SAME assembly (project), invisible to other assemblies.",
      "`protected` = visible to this class and its subclasses only.",
      "Encapsulation is a design principle: expose the smallest surface; hide the how, show the what."
    ]
  },
  {
    "id": "oop-p5",
    "difficulty": "medium",
    "title": "Static Members: A Type-Wide Counter and a Utility Class",
    "prompt": "Show the difference between state that belongs to the TYPE and state that belongs to an INSTANCE.\n\nPart A — instance vs static state:\n- Create a class `Order` with a static field/property `TotalCreated` and an instance property `Id`.\n- In the constructor, increment `TotalCreated` and assign `Id = TotalCreated`.\n- Create four `Order` objects and print each `Id` and the final `Order.TotalCreated`.\n\nPart B — a static class:\n- Create a `static class MoneyMath` with a static method `Percent(decimal amount, decimal percent)` returning `amount * percent / 100m`.\n- A static class cannot be instantiated and has only static members — call `MoneyMath.Percent(200m, 8.5m)` and print it.\n\nIn comments, list one good use and one tradeoff/risk of static state (e.g. shared mutable state, harder to unit-test).",
    "hints": [
      "Static members are accessed on the TYPE, not an instance: `Order.TotalCreated`, not `someOrder.TotalCreated`.",
      "`static class MoneyMath` — the compiler forbids `new MoneyMath()`.",
      "Static state is shared across the whole app/assembly — great for constants, risky for mutable state.",
      "Think `Math.PI` / `Math.Max` — that's exactly the static-class utility pattern."
    ]
  },
  {
    "id": "oop-p6",
    "difficulty": "medium",
    "title": "Inheritance: Modeling an Employee Hierarchy",
    "prompt": "Model a genuine is-a relationship with base and derived classes.\n\nRequirements:\n- A base class `Employee` with a `protected` field/property `BaseSalary`, a public auto-property `Name`, a constructor `Employee(string name, decimal baseSalary)`, and a method `Pay()` returning `BaseSalary`.\n- A derived class `Manager : Employee` that adds a `Bonus` (decimal). Its constructor must call the base constructor with `base(name, baseSalary)` and a NEW method `TotalPay()` returning `BaseSalary + Bonus` (uses the protected member).\n- A derived class `Contractor : Employee` with an hourly model (constructor takes `name`, `hourlyRate`, `hours`; pass `hourlyRate * hours` as the base salary).\n\nIn top-level statements: create one of each, print each `Name` and pay. In comments, explain (a) why `Contractor` arguably should NOT inherit from `Employee` if contractors aren't employees, and (b) when composition would be a better choice than inheritance here.",
    "hints": [
      "`class Manager : Employee` — the `:` is C#'s inheritance syntax (Python uses parentheses).",
      "`public Manager(string name, decimal salary, decimal bonus) : base(name, salary) { Bonus = bonus; }`",
      "`protected` members are reachable from derived classes but not from outside.",
      "Inheritance should mean a real 'is-a' — if it's really 'has-a' or 'uses-a', prefer composition."
    ]
  },
  {
    "id": "oop-p7",
    "difficulty": "medium",
    "title": "Polymorphism: virtual, override, sealed",
    "prompt": "Demonstrate runtime polymorphism and why C# methods are NOT virtual by default.\n\nRequirements:\n- A base class `Notification` with a `virtual` method `string Render()` returning a generic default like `\"[Notification]\"`.\n- Derived classes `EmailNotification` and `SmsNotification` that each `override Render()` to return a distinct string.\n- A FURTHER derived class `UrgentSms : SmsNotification` that `sealed override`s `Render()` so no further class can override it.\n- A non-virtual base method `Timestamp()` — then in a derived class, add a method `Timestamp()` using `new` to HIDE it, and observe the difference.\n\nIn top-level statements: put several notifications into a `List<Notification>`, loop and call `Render()` on each (base reference, derived behavior runs). Then show the `new`-hiding pitfall: call `Timestamp()` through a base-typed reference vs the derived-typed reference and print both results. In comments, explain why the outputs differ.",
    "hints": [
      "Without `virtual` on the base method, `override` won't compile — the base must opt in.",
      "A `List<Notification>` holding derived objects + a loop calling `Render()` is textbook polymorphism.",
      "`new` HIDES rather than overrides: which method runs depends on the COMPILE-TIME type of the reference.",
      "`sealed override` stops the override chain — `UrgentSms.Render` can't be overridden further."
    ]
  },
  {
    "id": "oop-p8",
    "difficulty": "medium",
    "title": "Abstract Classes: A Shape Family with Shared State",
    "prompt": "Use an abstract class to define a partial blueprint that derived types must complete.\n\nRequirements:\n- An `abstract class Shape` with: a public auto-property `Name` set via a constructor (shared state), an ABSTRACT method `double Area()` (no body), and a CONCRETE virtual method `Describe()` that returns `\"<Name>: area = <Area():F2>\"` (it calls the abstract method).\n- Concrete classes `Circle(double radius)` and `Rectangle(double width, double height)` that pass a name to `base(...)` and implement `Area()`.\n- Attempt (in a comment) to show that `new Shape(...)` does NOT compile — abstract classes can't be instantiated.\n\nIn top-level statements: put a `Circle` and a `Rectangle` in a `List<Shape>`, loop and print `Describe()` for each. In comments, state ONE situation where an abstract class beats an interface (hint: shared state + shared implementation across the family).",
    "hints": [
      "`abstract` on the class allows abstract members; `abstract double Area();` has no body.",
      "`Describe()` is concrete and can call the abstract `Area()` — subclasses fill in the gap.",
      "Abstract class = 'is-a' + shared fields/logic; interface = pure contract (until default methods).",
      "Circle area = `Math.PI * radius * radius`; use `:F2` to format to two decimals."
    ]
  },
  {
    "id": "oop-p9",
    "difficulty": "hard",
    "title": "Interfaces: Contracts, Multiple Implementation, Default Methods",
    "prompt": "Build a small plugin/strategy system driven by interfaces — the dominant OOP pattern in real C# apps.\n\nRequirements:\n- An interface `IPaymentHandler` with a method `bool Pay(decimal amount)` and a DEFAULT interface method `string Receipt(decimal amount)` (C# 8+) returning a sensible default string (implementers may override it or not).\n- An interface `ILoggable` with `void Log(string message)`.\n- A class `CreditCardHandler` that implements BOTH `IPaymentHandler` and `ILoggable`.\n- A class `CryptoHandler` that implements `IPaymentHandler` only and OVERRIDES the default `Receipt`.\n\nIn top-level statements: build a `List<IPaymentHandler>`, iterate, call `Pay` then `Receipt` on each (program to the interface, not the concrete type). Then demonstrate that the DEFAULT `Receipt` is callable only through the INTERFACE-typed reference for a class that didn't re-declare it — explain this gotcha in a comment.\n\nIn comments: explain when you'd add an interface (a 'seam' for DI/testing/multiple implementations) vs when an interface is over-engineering.",
    "hints": [
      "A class can implement many interfaces: `class CreditCardHandler : IPaymentHandler, ILoggable`.",
      "Default interface method: give the method a body INSIDE the interface.",
      "A default method NOT re-implemented by the class is only reachable via the interface-typed reference.",
      "Interfaces exist mostly to create seams for dependency injection and mocking — not deep inheritance."
    ]
  },
  {
    "id": "oop-p10",
    "difficulty": "hard",
    "title": "Records & Value Equality",
    "prompt": "Model immutable domain data with records and exploit what you get for free.\n\nRequirements:\n- A positional `record Money(decimal Amount, string Currency)` (positional params become init-only properties).\n- A positional `record class Customer(string Name, Money Balance)`.\n- Demonstrate VALUE EQUALITY: create two separate `Money` objects with identical values and show `==` and `.Equals` return `true` (unlike a class, which compares by reference).\n- Demonstrate the `with` expression: produce a NEW `Customer` whose `Balance` is updated, leaving the original unchanged (immutability + non-destructive mutation).\n- Print a record directly to show the auto-generated `ToString()`.\n- Deconstruct a `Money` into `(var amount, var currency)`.\n\nFinally, add a COUNTER-EXAMPLE: a `record class Mutable { public int X { get; set; } }` and explain in a comment why being a record does NOT make it immutable.",
    "hints": [
      "Positional record: `record Money(decimal Amount, string Currency);` — params become init-only props.",
      "`with`: `var richer = customer with { Balance = new Money(500m, \"USD\") };`",
      "Records auto-generate value-based `Equals`, `GetHashCode`, `ToString`, and a `Deconstruct`.",
      "Immutability comes from `init`/positional params, NOT from the word `record`."
    ]
  },
  {
    "id": "oop-p11",
    "difficulty": "hard",
    "title": "Structs & Enums: Value-Type Semantics and the Copy Trap",
    "prompt": "Show the difference between value types (struct) and reference types (class), and use an enum for a named constant set.\n\nRequirements:\n- A `readonly struct Point(int X, int Y)` (small, immutable value type) with an expression-bodied method `DistanceFromOrigin()` returning `Math.Sqrt(X*X + Y*Y)`.\n- An `enum Direction { North, East, South, West }`.\n- A method or block that, given a `Direction`, returns the unit `Point` you'd move in (use a `switch` expression).\n- THE COPY TRAP: create a mutable `class Box { public int Value; }` and a mutable `struct Tally { public int Value; }`. Assign each to a second variable, mutate the COPY, and print both originals. Show that mutating the struct copy leaves the original untouched, while mutating the class 'copy' changes the original (shared reference).\n- BOXING: assign a `Tally` to an `object` variable and explain in a comment that this silently allocates on the heap (boxing).\n\nIn comments: state the rule of thumb for when a struct is appropriate (small, immutable, value-semantic — typically <= 16 bytes).",
    "hints": [
      "`readonly struct Point(int X, int Y)` — a value type; copied by value on assignment/passing.",
      "A class variable holds a REFERENCE; copying it copies the reference, so both point to one object.",
      "`switch` expression: `Direction.North => new Point(0, 1), ...`",
      "Boxing: `object o = myStruct;` heap-allocates a copy — a hidden cost beginners miss."
    ]
  },
  {
    "id": "oop-p12",
    "difficulty": "hard",
    "title": "Capstone: A Mini Domain Model Tying It All Together",
    "prompt": "Design a small but realistic e-commerce domain that uses EVERY pillar from this topic. Aim for code an interviewer would nod at.\n\nRequirements:\n- `enum OrderStatus { Pending, Paid, Shipped, Cancelled }`.\n- `record Money(decimal Amount, string Currency)` with a method or operator-style helper `Money Add(Money other)` that throws if currencies differ (value object, value equality).\n- `interface IPricingRule { Money Apply(Money subtotal); }` — a strategy contract. Provide TWO implementations: `PercentDiscount(decimal percent)` and `FlatDiscount(Money amount)`.\n- `abstract class LineItemBase` with abstract `Money LineTotal()` and a shared `Quantity` property; concrete `ProductLine` (unit price * quantity) and `ShippingLine` (flat fee) derive from it.\n- `class Order` (an entity with identity): a private `List<LineItemBase>` (encapsulation), a static `NextId` counter assigning a unique `Id` per order, a method `AddItem(LineItemBase item)`, a method `Subtotal()` summing line totals, a method `Total(IEnumerable<IPricingRule> rules)` applying rules in sequence (polymorphism via the interface), and a `virtual` method `Confirm()` that moves `Status` from `Pending` to `Paid` (guard against illegal transitions).\n\nIn top-level statements: build an order with a couple of product lines and a shipping line, apply a percent + a flat discount rule, print the subtotal and final total, confirm the order, and print its status and Id. Use a `List<IPricingRule>` to drive the discounts.\n\nIn comments, briefly label where each pillar appears: encapsulation, inheritance, polymorphism, abstraction — plus where you chose record vs class vs struct vs enum and WHY.",
    "hints": [
      "Mix the tools deliberately: record = Money (value), class = Order (identity + behavior), enum = status, interface = pricing strategy, abstract class = line-item family.",
      "`Total` should fold the rules: start from `Subtotal()`, then apply each `IPricingRule` in turn.",
      "Keep the `List<LineItemBase>` private and expose behavior (`AddItem`, `Subtotal`) — a rich domain model, not a bag of public setters.",
      "Guard `Confirm()`: throw `InvalidOperationException` if the status isn't `Pending`, so you can't pay a cancelled order.",
      "Static `NextId` gives each `Order` a unique identity — that's why `Order` is a class, not a record."
    ]
  }
],
  projects: [
  {
    "id": "oop-proj-1",
    "difficulty": "starter",
    "title": "Library Catalog: Model a Book and Build a Mini Inventory",
    "brief": "Build a small console catalog for a community library where you define a `Book` class as a blueprint and create many book objects from it. It is the classic first real OOP build: turn loose data into a reusable type with state and behavior.",
    "requirements": [
      "Define a `Book` class (a reference type) with state for `Title`, `Author`, `Isbn`, a numeric `TotalCopies`, and a `CopiesAvailable` count. For this starter project you may begin with public fields, then convert at least two of them to **properties** with `{ get; set; }` once they work.",
      "Add at least three **methods** that operate on a single book: `Checkout()` (decrease available copies, but never below zero), `Return()` (increase available copies, but never above `TotalCopies`), and `Describe()` that returns a formatted one-line summary like `\"Clean Code by Robert C. Martin — 2/5 available\"`.",
      "In `Program.cs` (top-level statements), create several `Book` objects with the `new` keyword, store them in a `List<Book>`, and loop over the list printing each book's `Describe()`.",
      "Demonstrate that a class is a **reference type**: assign one book to a second variable, mutate it through the second variable, and print the first to show both names point to the **same object** on the heap. Add a short comment explaining why (contrast with how a Python list aliasing behaves the same way).",
      "Include a `Checkout()`/`Return()` demo run that prints availability before and after, proving the methods guard their bounds (no negative copies, no over-returning).",
      "Use correct C# naming: PascalCase for the class, properties, and methods; camelCase for local variables; and keep the `Book` type in its own file (`Book.cs`)."
    ],
    "stretch": [
      "Add a `Genre` enum (`Fiction`, `NonFiction`, `Reference`, `Childrens`) as a field on `Book`, then print a count of available copies grouped by genre.",
      "Add a `static int TotalBooksCreated` counter that increments each time a book is constructed, and print it at the end to show the difference between instance state and a value that belongs to the type.",
      "Write a tiny `Library` class that *composes* a `List<Book>` and exposes `Add(Book)`, `FindByTitle(string)`, and `CheckoutByTitle(string)` — your first taste of composition over a bag of loose variables.",
      "Replace the `Describe()` string concatenation with an interpolated, `with`-style formatted string and add a `[Fact]` xUnit test asserting that checking out the last copy leaves zero available and a second checkout is refused."
    ],
    "concepts": [
      "class",
      "object instantiation",
      "new keyword",
      "fields",
      "methods",
      "reference type semantics",
      "List<T>",
      "encapsulation (intro)",
      "naming conventions"
    ]
  },
  {
    "id": "oop-proj-2",
    "difficulty": "intermediate",
    "title": "Order Domain: A Well-Encapsulated Order with Constructors, Properties, and Records",
    "brief": "Build the order-handling core of a small e-commerce backend: a rich `Order` entity that protects its own invariants, plus immutable `Money` and `OrderLine` value types. This is the exact shape of code teams write every day, and it exercises the encapsulation toolkit interviewers probe.",
    "requirements": [
      "Model **`Money` as a `readonly record struct`** with `decimal Amount` and `string Currency`. Give it value equality (free from records), a `+` that throws if currencies differ, and a `ToString()` like `\"$19.99 USD\"`. Explain in a comment why a small immutable value type is the right tool here rather than a class.",
      "Model **`OrderLine` as a `record`** using positional/primary-constructor syntax (`record OrderLine(string Sku, int Quantity, Money UnitPrice)`) so you get value equality and a `with`-expression for free. Add a computed, expression-bodied property `Money LineTotal => ...` (do not store it).",
      "Build **`Order` as a `class`** (an entity with identity and behavior), not a record. Give it a private constructor or guarded constructors plus a **second constructor** that chains with `: this(...)`, and validate inputs (reject an empty customer id, reject a non-positive line quantity) by throwing `ArgumentException`/`ArgumentOutOfRangeException`.",
      "Encapsulate the order's lines: expose `IReadOnlyList<OrderLine> Lines` backed by a **private** `List<OrderLine>`, so callers cannot mutate the collection directly — they must go through an `AddLine(...)` method that enforces the rules. Expose a computed `Money Total` property.",
      "Use **properties correctly**: at least one `{ get; init; }` (e.g. `OrderId`, `CustomerId` set once at construction and never again), at least one property using the **C# 14 `field` keyword** to validate on assignment (e.g. a `Notes` setter that rejects `null` or trims whitespace), and a `private set` on a status property mutated only by methods like `MarkPaid()`.",
      "Apply correct **access modifiers** and design intent: keep helper logic `private`, mark anything assembly-internal `internal`, and write a one-paragraph comment justifying why `Order` is a class with private setters while `Money`/`OrderLine` are immutable value types (the record-vs-class decision).",
      "Provide a top-level `Program.cs` that constructs an order, adds lines, prints the formatted total, demonstrates a `with`-expression producing a *new* `OrderLine`, and shows two equal `Money`/`OrderLine` values comparing `true` while two distinct `Order` objects compare `false` (value vs reference equality)."
    ],
    "stretch": [
      "Add a `DateRange` `readonly record struct` for a promotional window and a `Discount` abstract base or interface (`IDiscountRule`) with two implementations (percentage, fixed-amount) selected at runtime — a strategy-pattern taste of polymorphism.",
      "Enforce invariants harder: make `Order` reject adding a line whose currency differs from the order's currency, and add xUnit tests covering each guard clause (empty customer, bad quantity, mismatched currency, double `MarkPaid`).",
      "Introduce an `IOrderRepository` interface with an in-memory implementation and inject it into a small `OrderService` via its constructor (or a **primary constructor**) — the canonical ASP.NET Core DI pattern — and note in a comment the class-vs-record primary-constructor mutability gotcha.",
      "Deconstruct an `OrderLine` into its parts (`var (sku, qty, price) = line;`), and add an extension *property* (C# 14 extension member) such as `IsBulk => Quantity >= 100` on `OrderLine` to practice modern extension syntax."
    ],
    "concepts": [
      "constructors",
      "constructor chaining (this)",
      "parameter validation / guard clauses",
      "auto-properties",
      "init-only setters",
      "computed / expression-bodied properties",
      "field keyword (C# 14)",
      "private set",
      "encapsulation",
      "access modifiers",
      "record",
      "readonly record struct",
      "with-expression",
      "value vs reference equality",
      "primary constructors",
      "composition"
    ]
  }
],
};
