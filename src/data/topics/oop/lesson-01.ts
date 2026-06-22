import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  "slug": "classes",
  "number": 1,
  "title": "Classes & Objects",
  "objective": "Define a class as a blueprint and create objects (instances) from it with fields, methods, and the new keyword.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Every real C# program you will ever ship — a banking API, a game, an order system — is built out of **classes** and the **objects** you stamp out from them. Master this one idea and the rest of object-oriented C# is just detail."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor on ONE running model the whole lesson (BankAccount) and bring in Player only to show the pattern repeats. Do not introduce both deeply.",
        "Python students already 'know' classes — the hard reset here is **reference semantics** and the fact that `=` between objects copies a *label*, not the data. Spend the most time on the reference-equality demo; it is the single biggest source of bugs they'll hit.",
        "Defer encapsulation/properties/access modifiers — this lesson uses `public` fields ON PURPOSE so the mechanics stay visible. Flag explicitly that production code uses properties (next lessons), so a sharp student doesn't think public fields are the norm.",
        "Live-code the reference demo: change `copy`, then print `original` and watch the room. Let them predict the output before you run it.",
        "Avoid `:C` currency formatting in any demo you run live — its output depends on the machine's culture (you may see ₹, €, or $). Plain `$` in the string is locale-proof, which is why every output here is deterministic regardless of machine.",
        "Nullable reference types are ON by default in the .NET 10 console template (`<Nullable>enable</Nullable>`). The constructor demos assign every field, so they compile warning-free; if a student leaves a non-nullable field unassigned they'll see CS8618. Mention it only if it comes up — full NRT treatment is a later lesson.",
        "If asked: yes, methods aren't virtual by default and there's a separate equality story for records/structs — say 'later lessons' and move on. Keep scope tight."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Blueprint vs. instance",
      "id": "blueprint-vs-instance"
    },
    {
      "kind": "paragraph",
      "text": "A **class** is a blueprint: it describes what something *is* and what it can *do*, but it isn't a thing you can use yet. An **object** (also called an **instance**) is a concrete thing built from that blueprint. The blueprint for a house isn't a house you can live in; build from it and you get an actual house — and you can build many houses from one blueprint, each with its own address and paint colour. In code, `BankAccount` is the blueprint; Ada's account and Grace's account are two separate objects created from it, each with its own balance."
    },
    {
      "kind": "paragraph",
      "text": "Coming from Python this will feel familiar — Python has `class` and instances too. The difference is that C# is **statically typed**: the class name `BankAccount` is also a *type*, the compiler knows it at compile time, and it will refuse to build your program if you call a method that doesn't exist or assign the wrong kind of value. In Python you'd only discover that at runtime, often in production."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "BankAccount.cs",
      "code": "// The class: a blueprint for a bank account.\nclass BankAccount\n{\n    public string Owner = \"\";   // a field: data each account carries\n    public decimal Balance;     // a field: starts at 0 by default\n\n    // A method: behavior every account can perform.\n    public void Deposit(decimal amount)\n    {\n        Balance = Balance + amount;\n        Console.WriteLine($\"{Owner} deposited ${amount}. New balance: ${Balance}\");\n    }\n}"
    },
    {
      "kind": "paragraph",
      "text": "Two kinds of members live inside that class. **Fields** are the data an object holds — here `Owner` and `Balance`. **Methods** are the things an object can do — here `Deposit`. (In Python you'd write the data as `self.owner = ...` inside `__init__` and methods as functions taking `self`; in C# fields are declared directly in the class body and methods are declared right alongside them.) Notice `decimal` rather than `double` — `decimal` is the type the BCL gives you for money because it doesn't suffer binary rounding error; using `double` for currency is a classic bug in real financial code."
    },
    {
      "kind": "list",
      "items": [
        "**Field** — a named slot of data each object carries (`public decimal Balance;`). Every object gets its own copy.",
        "**Method** — a named behavior every object of the class can perform (`public void Deposit(...)`).",
        "**Constructor** — a special method that runs when you build an object with `new` and sets up its starting state (coming up shortly).",
        "**Member** — the umbrella word for any of the above: fields, methods, and constructors are all *members* of the class."
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "A class alone does nothing",
      "text": "Defining `class BankAccount { ... }` does not create an account, exactly like defining a function doesn't call it. Nothing has a balance yet. You have only described what an account *would* look like. To get a usable account you must **instantiate** it — that's the `new` keyword, next."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Creating objects with new",
      "id": "creating-objects-with-new"
    },
    {
      "kind": "paragraph",
      "text": "The `new` keyword builds an object from a class and hands you back a reference to it. Think of `new BankAccount()` as 'run the blueprint and give me a freshly built account.' You store that reference in a variable so you can talk to the object afterwards. Because each `new` builds a *separate* object, two accounts have two independent balances — change one and the other is untouched."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "BankAccount account = new BankAccount();  // build one object\naccount.Owner = \"Ada\";                    // set its fields with the dot operator\naccount.Balance = 100m;\n\naccount.Deposit(50m);                     // call a method on that object"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Ada deposited $50. New balance: $150"
    },
    {
      "kind": "paragraph",
      "text": "The dot (`.`) is how you reach into an object: `account.Balance` reads a field, `account.Deposit(50m)` calls a method. This is the same `.` you already use in Python (`account.balance`). One quirk worth knowing: C# lets you drop the repeated type name with `var account = new BankAccount();` (the compiler infers the type) or even shorten the right side to `BankAccount account = new();` — both build the exact same object. We'll use `var` freely from here on."
    },
    {
      "kind": "paragraph",
      "text": "To *see* that each `new` makes its own object, build two and touch only one. Deposit into Ada's account and Grace's balance never budges — independent objects, independent data. This is exactly the property you'll soon need to think hard about: it holds for *separate* objects, but breaks the moment two variables point at the *same* one."
    },
    {
      "kind": "examples",
      "intro": "Two objects from one class — each carries its own state:",
      "examples": [
        {
          "label": "Independent objects, independent balances",
          "code": "var ada = new BankAccount(\"Ada\", 100m);\nvar grace = new BankAccount(\"Grace\", 100m);\n\nada.Deposit(50m);   // only Ada's account changes\n\nConsole.WriteLine($\"Ada:   ${ada.Balance}\");\nConsole.WriteLine($\"Grace: ${grace.Balance}\");\n\nclass BankAccount\n{\n    public string Owner;\n    public decimal Balance;\n    public BankAccount(string owner, decimal balance) { Owner = owner; Balance = balance; }\n    public void Deposit(decimal amount) => Balance += amount;\n}",
          "output": "Ada:   $150\nGrace: $100"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: initialize through a constructor",
      "text": "Setting `Owner` and `Balance` on separate lines after `new` leaves a window where the object exists but is half-built (an account with no owner). Real code passes the starting values into `new` itself using a **constructor**, so an object is valid the instant it's born. That's the next section."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Constructors and the this keyword",
      "id": "constructors-and-this"
    },
    {
      "kind": "paragraph",
      "text": "A **constructor** is a special method that runs automatically when you write `new`. Its job is to set up the object's initial state. It has the same name as the class and no return type. Inside it, the keyword `this` refers to *the object currently being built* — it's C#'s equivalent of Python's `self`, except that in C# `this` is implicit (you usually omit it) rather than an explicit first parameter on every method."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var hero = new Player(\"Aria\", 100);   // constructor runs with these arguments\nvar goblin = new Player(\"Goblin\", 30);\n\nhero.TakeDamage(25);\ngoblin.TakeDamage(40);\n\nhero.Describe();\ngoblin.Describe();\n\nclass Player\n{\n    public string Name;\n    public int Health;\n\n    // Constructor: same name as the class, no return type.\n    public Player(string name, int health)\n    {\n        this.Name = name;     // 'this.Name' = the field; 'name' = the parameter\n        this.Health = health;\n    }\n\n    public void TakeDamage(int amount)\n    {\n        Health = Health - amount;\n        if (Health < 0) Health = 0;\n    }\n\n    public void Describe() => Console.WriteLine($\"{Name} has {Health} HP.\");\n}"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Aria has 75 HP.\nGoblin has 0 HP."
    },
    {
      "kind": "paragraph",
      "text": "Here `this` earns its keep: the parameter is called `name` and the field is called `Name`, and `this.Name = name` says 'store the incoming argument into this object's field.' When there's no naming clash you can drop `this` entirely (as `TakeDamage` does with plain `Health`), and most C# code does. Notice the C# naming convention while you're here: types, methods, and fields/properties are **PascalCase** (`Player`, `TakeDamage`, `Health`); local variables and parameters are **camelCase** (`hero`, `name`). Python's `snake_case` is not used for these in C#."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Where did the default constructor go?",
      "text": "Earlier, `new BankAccount()` with empty parentheses worked even though we never wrote a constructor — C# supplies a free **parameterless** one when you don't write any. But the moment you declare your own constructor (like `Player(string, int)`), that free one disappears. After adding the `Player` constructor, `new Player()` no longer compiles (`error CS7036: no argument given for required parameter 'name'`) — which is exactly what you want, since a player with no name or health is meaningless."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Objects are references — the big shift from values",
      "id": "objects-are-references"
    },
    {
      "kind": "paragraph",
      "text": "This is the idea that trips up almost everyone, and it's worth slowing down for. A class is a **reference type**. A variable of a class type does not *hold the object* — it holds a **reference** (think: a label, or an arrow) pointing to an object that lives elsewhere in memory. So when you assign one object variable to another with `=`, you copy the *arrow*, not the object. Both variables now point at the **same single object**."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "Player original = new Player(\"Aria\", 100);\nPlayer copy = original;     // copies the REFERENCE, not the object\n\ncopy.Health = 10;           // change through 'copy'...\n\noriginal.Describe();        // ...and 'original' sees it too — same object!\ncopy.Describe();\n\nConsole.WriteLine(ReferenceEquals(original, copy));  // are they the same object?"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Aria has 10 HP.\nAria has 10 HP.\nTrue"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: \"copy\" is not a copy",
      "text": "The variable is named `copy`, but there is still only **one** `Player` object in memory — `copy` and `original` are two labels on the same box. `ReferenceEquals` returns `True` to prove it. If you genuinely want a second, independent player, you must `new` a second one. This is identical to Python, where `b = a` for a list makes `b` and `a` the same list — C# just makes you meet the rule head-on because there are also *value* types (numbers, `bool`, `struct`s) that really do copy their contents."
    },
    {
      "kind": "paragraph",
      "text": "The same reference behavior shows up the instant you pass an object into a method. The method receives a copy of the *reference*, which still points at your original object — so mutating it inside the method changes your object for real. This is why a method like `ApplyMonthlyFee` can quietly alter the account you handed it; in a large business app that's a feature (the object is the single source of truth) and occasionally a footgun (you didn't expect the callee to mutate your data)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var account = new BankAccount(\"Ada\", 100m);\n\nApplyMonthlyFee(account);     // hand the object to a method\nConsole.WriteLine($\"Balance is now ${account.Balance}\");\n\nstatic void ApplyMonthlyFee(BankAccount acc)\n{\n    acc.Balance -= 5m;        // 'acc' points at the SAME object as 'account'\n}\n\nclass BankAccount\n{\n    public string Owner;\n    public decimal Balance;\n    public BankAccount(string owner, decimal balance)\n    {\n        Owner = owner;\n        Balance = balance;\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Balance is now $95"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "A reference can point at nothing: null",
      "text": "Because a class variable is a reference, it can point at *no object* — that's `null`. Writing `BankAccount acc = null;` and then calling `acc.Deposit(10m)` throws a `NullReferenceException`, the most common runtime error in .NET — much like Python's `AttributeError: 'NoneType' object has no attribute ...`. Modern C# helps you catch these at compile time with **nullable reference types** (on by default in the .NET 10 template), a topic we'll tackle head-on in a later lesson."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Putting it together: a working model",
      "id": "a-working-model"
    },
    {
      "kind": "paragraph",
      "text": "Here's the shape of a real domain class: it bundles data (`Owner`, `Balance`) with the behavior that protects it (`Deposit`, `Withdraw`). Even with public fields, notice how `Withdraw` enforces a rule — you can't overdraw. That instinct to put rules *inside* the object, next to the data they guard, is the heart of object-oriented design, and the next lessons sharpen it with properties and access modifiers."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "var account = new BankAccount(\"Ada\", 100m);\n\naccount.Deposit(250m);\naccount.Withdraw(75m);\naccount.Withdraw(1000m);   // too much — rejected\naccount.PrintStatement();\n\nclass BankAccount\n{\n    public string Owner;\n    public decimal Balance;\n\n    public BankAccount(string owner, decimal openingBalance)\n    {\n        Owner = owner;\n        Balance = openingBalance;\n    }\n\n    public void Deposit(decimal amount) => Balance += amount;\n\n    public void Withdraw(decimal amount)\n    {\n        if (amount > Balance)\n        {\n            Console.WriteLine($\"Declined: ${amount} exceeds balance of ${Balance}.\");\n            return;\n        }\n        Balance -= amount;\n    }\n\n    public void PrintStatement() => Console.WriteLine($\"{Owner}'s balance: ${Balance}\");\n}"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Declined: $1000 exceeds balance of $275.\nAda's balance: $275"
    },
    {
      "kind": "paragraph",
      "text": "Trace the numbers: open at 100, deposit 250 → 350, withdraw 75 → 275, then the 1000 withdrawal is declined (it exceeds 275, so the method prints and `return`s early without touching `Balance`), leaving the final balance at 275. The early `return` is a common real-world guard-clause pattern: validate, bail out fast on bad input, and only fall through to the real work when the request is legal."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "C# classes vs. Python classes at a glance",
      "id": "csharp-vs-python"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python class",
          "items": [
            "Data set up inside `__init__` via `self.x = ...`",
            "Every method takes `self` as an explicit first parameter",
            "Instantiate with `Account(\"Ada\", 100)` — no `new` keyword",
            "Dynamically typed: wrong attribute fails at runtime",
            "`snake_case` for methods and attributes",
            "Objects are references; `b = a` aliases the same object"
          ]
        },
        {
          "title": "C# class",
          "items": [
            "Fields declared directly in the class body; set in a constructor",
            "`this` is implicit; you rarely write it",
            "Instantiate with `new Account(\"Ada\", 100m)` — `new` required",
            "Statically typed: the compiler rejects bad calls before it runs",
            "`PascalCase` types/methods/fields, `camelCase` locals/params",
            "Classes are references too — but C# also has value types (struct) that copy by value"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: one shape now, refinements coming",
      "text": "We used `public` fields to keep the mechanics visible, but idiomatic C# almost never exposes public mutable fields — it uses **properties** (`public decimal Balance { get; private set; }`) so the object can validate changes and protect its invariants. Treat today's `public` fields as training wheels; properties and access modifiers are the very next steps."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A **class** is a blueprint (and a type); an **object** / **instance** is a concrete thing built from it with `new`. Many objects can come from one class, each with its own data.",
        "**Fields** hold an object's data; **methods** define its behavior. Reach them with the dot operator: `account.Balance`, `account.Deposit(50m)`.",
        "A **constructor** (same name as the class, no return type) runs on `new` and sets up valid initial state. Declaring one removes the free parameterless constructor.",
        "**`this`** refers to the current object — C#'s implicit `self`. You mostly omit it, using it to disambiguate a field from a same-named parameter.",
        "Classes are **reference types**: a variable holds an arrow to the object, not the object. `=` copies the arrow, and passing an object to a method lets that method mutate your original. Use `new` again for a truly separate object.",
        "Conventions: **PascalCase** for types/methods/fields, **camelCase** for locals/params, and use `decimal` (not `double`) for money."
      ]
    }
  ]
};
