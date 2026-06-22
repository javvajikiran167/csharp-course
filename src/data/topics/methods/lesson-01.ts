import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  "slug": "defining",
  "number": 1,
  "title": "Defining & Calling Methods",
  "objective": "Understand method signatures, parameters, return types vs void, arguments, and why we extract methods (DRY).",
  "blocks": [
    {
      "kind": "lead",
      "text": "A **method** is a named, reusable block of behavior — you teach the program *how* to do something once, give it a name, and then call that name whenever you need it. If you know Python `def`, you already know the *spirit* of methods; this lesson is about the C# specifics that make them safer, more explicit, and the backbone of every real codebase you will ever touch."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "**Anchor everything in the refactor.** Start by writing duplicated cart-total code live, let the pain register, then extract a method. The 'aha' is emotional, not just technical — students should *feel* the duplication before they see the fix.",
        "**Vocabulary discipline:** *parameter* = the placeholder in the declaration; *argument* = the actual value you pass at the call site. Say both words correctly every time and students will too.",
        "**The single biggest contrast with Python:** every parameter and the return value has a declared **type**, and `void` is a real keyword meaning 'returns nothing' (Python silently returns `None`).",
        "Mention but do not over-drill: there are **no module-level functions** in C#. A method always lives inside a type. With top-level statements the compiler hides that, which is why local functions appear to float in `Program.cs`.",
        "Defer `static` vs instance, `ref`/`out`, overloading, optional/named args, tuples, and extension methods to later lessons — this lesson is anatomy + calling + return-vs-void + DRY. Resist scope creep.",
        "Good check-for-understanding: ask 'what is the *signature* of `int Add(int a, int b)`?' Answer: the name plus parameter types/order — NOT the return type, NOT the parameter names.",
        "**Watch the copy-paste trap in the expression-body example.** The 'block body → expression body' pair shows the *same* method written two ways; a student who pastes both lines hits `CS0128` (duplicate declaration). Say out loud: 'pick one form, not both.'"
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Why methods exist"
    },
    {
      "kind": "paragraph",
      "text": "Before the *how*, the *why*. Methods are not bureaucracy — they pay for themselves three ways. **(1) Reuse / DRY** (*Don't Repeat Yourself*): write a calculation once, call it from ten places; fix a bug in one spot instead of ten. **(2) Naming:** a well-named method like `CalculateTax` turns a wall of arithmetic into a sentence you can read. **(3) Testing & reasoning:** a small method with clear inputs and one output is something you can unit-test in isolation and hold entirely in your head. In professional work — an ASP.NET Core API, a business reporting tool, a game's physics loop — these three forces are *why* codebases are mostly small methods rather than one giant `Main`."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Same idea as Python, stricter contract",
      "text": "Python's `def add(a, b): return a + b` and C#'s `int Add(int a, int b) => a + b` express the same intent. The difference is that C# nails down the **types** at compile time, so a whole class of mistakes — passing a string where a number belongs — is caught *before* the program ever runs."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Feel the pain: repeated code"
    },
    {
      "kind": "paragraph",
      "text": "Here is the calculation for an online store's order total — subtotal plus 8% tax — written out for two orders. It works. It is also a trap."
    },
    {
      "kind": "code",
      "filename": "before.cs",
      "language": "csharp",
      "code": "decimal price1 = 1200m, qty1 = 1;\ndecimal subtotal1 = price1 * qty1;\ndecimal tax1 = subtotal1 * 0.08m;\nConsole.WriteLine($\"Order 1 total: ${subtotal1 + tax1}\");\n\ndecimal price2 = 49.50m, qty2 = 3;\ndecimal subtotal2 = price2 * qty2;\ndecimal tax2 = subtotal2 * 0.08m;\nConsole.WriteLine($\"Order 2 total: ${subtotal2 + tax2}\");"
    },
    {
      "kind": "output",
      "output": "Order 1 total: $1296.00\nOrder 2 total: $160.3800"
    },
    {
      "kind": "paragraph",
      "text": "The logic is copy-pasted. Now imagine the tax rate changes to 9%, or finance wants the total *rounded* to the nearest cent — you must hunt down every copy and edit them identically. Miss one, and you have a bug that ships. (Notice, too, how raw `decimal` printing leaks `160.3800` — four decimal places — because the arithmetic preserved that scale; we will fix the *presentation* later with a format string. First, fix the *duplication*.) This is exactly the moment to **extract a method**."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The refactor: one method, called twice"
    },
    {
      "kind": "code",
      "filename": "after.cs",
      "language": "csharp",
      "code": "Console.WriteLine($\"Order 1 total: ${TotalWithTax(1200m, 1)}\");\nConsole.WriteLine($\"Order 2 total: ${TotalWithTax(49.50m, 3)}\");\n\n// One place that knows how to total an order.\ndecimal TotalWithTax(decimal price, int quantity)\n{\n    decimal subtotal = price * quantity;\n    decimal tax = subtotal * 0.08m;\n    return subtotal + tax;\n}"
    },
    {
      "kind": "output",
      "output": "Order 1 total: $1296.00\nOrder 2 total: $160.3800"
    },
    {
      "kind": "paragraph",
      "text": "Same output, dramatically better code. The calculation lives in **exactly one place**. Change the tax rate? One edit, every caller benefits. The call sites now *read like English*: \"order 1 total is `TotalWithTax(1200m, 1)`.\" That is naming and reuse working together. (Don't worry that the method appears to float at the bottom of the file — with C#'s top-level statements the compiler tucks it into a hidden class for you; here it is a **local function**, which is perfectly fine. Local functions must be declared *after* the top-level statements that call them, which is why it sits at the end.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Anatomy of a method"
    },
    {
      "kind": "paragraph",
      "text": "Every method you ever write or read is built from the same four parts. Learn to point at each one and the whole language opens up:"
    },
    {
      "kind": "list",
      "items": [
        "**Return type** — what the method hands back (`decimal`, `int`, `string`, `bool`…), or `void` for nothing. This is the *output contract*.",
        "**Name** — a PascalCase verb phrase describing what it does: `CalculateTotal`, `GetUserById`, `IsValid`.",
        "**Parameter list** — the typed inputs in parentheses: `(decimal price, int quantity)`. Each parameter is a typed placeholder, separated by commas, and an empty `()` means the method takes no inputs.",
        "**Body** — the code that runs, in `{ }`. If it returns a value, every path through the body must `return` one of the right type."
      ]
    },
    {
      "kind": "code",
      "filename": "anatomy.cs",
      "language": "csharp",
      "code": "//  ┌─ return type      ┌─ parameter list (typed placeholders)\n//  │      ┌─ name       │\nint Add(int a, int b)\n{\n    return a + b;        // body: must return an int on every path\n}\n\nint sum = Add(2, 3);     // \"call\" the method; 2 and 3 are ARGUMENTS\nConsole.WriteLine(sum);"
    },
    {
      "kind": "output",
      "output": "5"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Parameter vs argument — say it right",
      "text": "A **parameter** is the placeholder in the *declaration* (`int a`, `int b`). An **argument** is the actual value at the *call site* (`2`, `3`). They are two sides of the same handshake. Mixing the words up is harmless in casual talk, but using them precisely is a small tell that your fundamentals are solid — and interviewers do listen for it."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The signature is NOT the whole declaration",
      "text": "A method's **signature** is its **name plus the parameter types and order** — for `int Add(int a, int b)` the signature is `Add(int, int)`. The **return type is not part of the signature**, and neither are the **parameter names**. This seems pedantic now, but it is exactly what determines whether two methods can share a name (overloading, a later lesson): you cannot define both `int Add(int, int)` and `string Add(int, int)`, because changing only the return type leaves the signature identical. It is also one of the most common C# interview questions."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Expression-bodied methods: the one-liner shortcut"
    },
    {
      "kind": "paragraph",
      "text": "When a method is a single expression, the `{ return ...; }` ceremony is noise. C# lets you replace it with `=>` (read it as \"is\"). This is *everywhere* in modern codebases and is the idiomatic way to write tiny methods. The two snippets in the first example below are **two ways to write the same method** — choose one; you cannot keep both in the same scope (the compiler would reject a duplicate)."
    },
    {
      "kind": "examples",
      "intro": "Each example shows a single method. In the first, the two lines are alternatives — pick the expression body for genuine one-liners:",
      "examples": [
        {
          "label": "Block body OR expression body (pick one — not both)",
          "code": "// Option A — block body:\nint Square(int n) { return n * n; }\n\n// Option B — expression body, identical meaning:\n// int Square(int n) => n * n;"
        },
        {
          "label": "A computed value",
          "code": "double RectangleArea(double width, double height) => width * height;\n\nConsole.WriteLine(RectangleArea(4.0, 2.5));",
          "output": "10"
        },
        {
          "label": "A yes/no question",
          "code": "bool IsAdult(int age) => age >= 18;\n\nConsole.WriteLine(IsAdult(20));\nConsole.WriteLine(IsAdult(15));",
          "output": "True\nFalse"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "It looks like a Python lambda, but it is a real named method",
      "text": "The `=>` here is **not** an anonymous function. `int Square(int n) => n * n;` is a fully named, callable method — `=>` is just shorthand for a body that is one expression. Reach for it on true one-liners; keep `{ }` when there is branching or multiple statements, so the logic stays readable."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Return a value vs `void`"
    },
    {
      "kind": "paragraph",
      "text": "Methods split into two families. Some **compute and hand back a value** you can capture, combine, and pass on. Others **just do something** — print, save, send an email — and hand nothing back; their return type is `void`. Choosing correctly is a design decision you will make constantly, and getting it right keeps calculations (easy to test) cleanly separated from side effects (harder to test)."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Returns a value",
          "items": [
            "Declared with a real type: `decimal`, `int`, `bool`, `string`…",
            "**Must `return`** a value of that type on every path, or it won't compile",
            "The result can be **captured**: `var x = TotalWithTax(...)`, or used inline",
            "Best for **pure calculations** — input in, answer out, no side effects",
            "Easiest to unit-test: assert the output equals what you expect"
          ]
        },
        {
          "title": "Returns `void`",
          "items": [
            "Declared `void` — the C# word for \"nothing comes back\"",
            "`return;` (with no value) is optional, used only to **exit early**",
            "You **cannot** capture a result: `var x = Greet(\"Ada\")` is a compile error",
            "Best for **actions / side effects** — printing, logging, saving",
            "Python has no `void`; a Python function with no `return` silently yields `None`"
          ]
        }
      ]
    },
    {
      "kind": "code",
      "filename": "value-vs-void.cs",
      "language": "csharp",
      "code": "// Returns a value — you capture and use it.\ndecimal TotalWithTax(decimal price, int qty) => price * qty * 1.08m;\n\n// Returns void — it acts, then hands nothing back.\nvoid Greet(string name)\n{\n    Console.WriteLine($\"Hello, {name}!\");\n    // no 'return value' — 'return;' alone would just exit early\n}\n\ndecimal owed = TotalWithTax(49.50m, 3);   // capture the result\nConsole.WriteLine($\"Owed: {owed}\");\n\nGreet(\"Ada\");                              // call it for its effect\n// var x = Greet(\"Ada\");                   // compile error: Greet returns void"
    },
    {
      "kind": "output",
      "output": "Owed: 160.3800\nHello, Ada!"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Coming from Python: there is no implicit `None`",
      "text": "In Python a function that falls off the end just returns `None`, and you can write `x = print('hi')` (you get `None`). In C#, if a method is declared `void` you genuinely cannot use it as a value, and a value-returning method that *forgets* to `return` on some path **won't compile** (`error CS0161`). The compiler forces you to be honest about what comes back — a feature, not a nuisance."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Calling methods: arguments flow into parameters"
    },
    {
      "kind": "paragraph",
      "text": "**Calling** (or *invoking*) a method means writing its name followed by parentheses containing the arguments. The arguments are matched to parameters **by position, left to right**, and each argument must be **compatible with the declared type** of its parameter (an `int` argument is fine where a `double` parameter is expected, because `int` widens to `double` automatically; the reverse is not). You can use a call result anywhere a value of that type is allowed — assign it, print it, or feed it straight into another call (this nesting is *composition*)."
    },
    {
      "kind": "code",
      "filename": "calling.cs",
      "language": "csharp",
      "code": "int Add(int a, int b) => a + b;\nint Square(int n) => n * n;\n\nint x = Add(2, 3);            // capture in a variable\nConsole.WriteLine(x);         // pass a result as an argument\nConsole.WriteLine(Add(10, Square(4)));   // compose: Square(4)=16, Add(10,16)=26\n\n// Add(2, \"three\");           // won't compile: \"three\" is not an int"
    },
    {
      "kind": "output",
      "output": "5\n26"
    },
    {
      "kind": "paragraph",
      "text": "You have already been calling methods since lesson one — `Console.WriteLine(...)` is a method call, and `\"hi\".ToUpper()` calls a method *on* a value. The skill you are building now is writing your **own** methods so your code reads at the level of *intent* (`TotalWithTax(price, qty)`) rather than mechanics (a pile of arithmetic)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Putting it together: a readable receipt printer"
    },
    {
      "kind": "paragraph",
      "text": "Here the two families cooperate: a **value-returning** method does the math, and a **void** method handles the printing — including the format string `{total:0.00}` that finally tames the decimal display to two places. Each method does one job, has a clear name, and could be tested or reused independently — the everyday shape of professional C#."
    },
    {
      "kind": "code",
      "filename": "receipt.cs",
      "language": "csharp",
      "code": "void PrintReceipt(string item, decimal price, int qty)\n{\n    decimal total = LineTotal(price, qty);\n    Console.WriteLine($\"{item,-12} x{qty}  ->  {total:0.00}\");\n}\n\ndecimal LineTotal(decimal price, int qty) => price * qty * 1.08m;\n\nPrintReceipt(\"Keyboard\", 49.50m, 3);\nPrintReceipt(\"Monitor\", 1200m, 1);\nPrintReceipt(\"Cable\", 7.25m, 4);"
    },
    {
      "kind": "output",
      "output": "Keyboard     x3  ->  160.38\nMonitor      x1  ->  1296.00\nCable        x4  ->  31.32"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: one method, one job, one good name",
      "text": "Aim for small methods that do **one thing** and read as a **verb phrase** — `CalculateTotal`, `SendInvoice`, `IsOverdue`. Boolean methods read as questions (`Is…`, `Has…`, `Can…`). A reliable rule of thumb is the **rule of three**: the first time you write a piece of logic, leave it; the second time, note the duplication; the **third** time, extract a method. Don't abstract speculatively — extract when there is real, repeated need or a concept worth naming."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A **method** packages named, reusable behavior; in C# it always lives inside a type, and every input and output is **typed**.",
        "Methods exist for three reasons: **reuse (DRY)**, **naming** (code reads as intent), and **testability**.",
        "Anatomy = **return type · name · parameter list · body**. Use `=>` (expression body) for genuine one-liners — but it is the *same* method, so never declare both forms in one scope.",
        "A method either **returns a value** (with a real type, capturable) or returns **`void`** (an action; nothing comes back — C# has no implicit `None`).",
        "**Parameter** = placeholder in the declaration; **argument** = the actual value you pass. Arguments match parameters **by position and type**.",
        "A method's **signature** is its **name + parameter types/order** — *not* the return type or parameter names.",
        "When you see logic copied a third time, **extract a method**: fix bugs in one place and let every caller benefit."
      ]
    }
  ]
};
