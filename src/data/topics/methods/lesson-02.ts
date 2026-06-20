import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  "slug": "value-reference",
  "number": 2,
  "title": "Pass by Value vs Pass by Reference",
  "objective": "Master how arguments are passed — value types vs reference types, and the ref/out/in modifiers — the single most common C# interview question.",
  "blocks": [
    {
      "kind": "lead",
      "text": "You change a number inside a method and the caller never sees it — but you add an item to a `List` inside a method and the caller *does* see it. If that feels inconsistent, this lesson is the one that makes it click forever (and it's the question interviewers reach for first)."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "This is THE topic that separates people who 'know C# syntax' from people who understand the runtime. Budget time for the mental model before any modifier syntax.",
        "Lead with a live demo: mutate an `int` (no effect on caller) then `.Add()` to a `List` (visible to caller). Let the apparent contradiction sit for a beat before resolving it — the 'aha' lands harder.",
        "The killer sentence to repeat 3+ times: 'C# passes everything by value by default. For a reference type, the *value being copied is the reference itself.'",
        "Python students carry the false intuition 'everything is a reference, so rebinding propagates.' Explicitly name and dismantle that. Python actually does the same thing C# does (copies the binding) — they just never had to think about it because there's no `ref`.",
        "Draw boxes-and-arrows on a whiteboard for the List/reassign case. The diagram does more than any paragraph.",
        "Expect the `string` question ('strings are reference types, so why can't I mutate one inside a method?'). The answer is immutability, not passing semantics — there's a callout for this. Don't let it derail the value-vs-reference thread.",
        "Save `ref readonly` and `params Span` for the methods lesson; here keep modifiers to ref/out/in so the value-vs-reference distinction stays the star.",
        "End by drilling the interview answer out loud — students should be able to say the ref-vs-out difference in one clean sentence."
      ]
    },
    {
      "kind": "paragraph",
      "text": "In Python you almost never had to think about how an argument gets handed to a function — you just passed it. C# forces the question into the open, and the answer is the foundation for understanding mutation bugs, the `TryParse` pattern, performance tuning, and roughly a quarter of all junior interview questions. The good news: there is exactly **one** rule, and once you see it the rest is bookkeeping."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The one rule: C# passes by value",
      "id": "the-one-rule"
    },
    {
      "kind": "paragraph",
      "text": "By default, when you call a method, C# **copies** the argument into the parameter. The method works on its own private copy. Watch what that means for a plain `int` — a **value type**, where the value *is* the number:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int score = 50;\n\nvoid GiveBonus(int points)\n{\n    points += 100;\n    Console.WriteLine($\"Inside method: {points}\");\n}\n\nGiveBonus(score);\nConsole.WriteLine($\"Back in caller: {score}\");"
    },
    {
      "kind": "output",
      "output": "Inside method: 150\nBack in caller: 50"
    },
    {
      "kind": "paragraph",
      "text": "`points` got its own copy of the number `50`. Adding `100` changed the copy and left `score` untouched. This is identical to Python: `def give_bonus(points): points += 100` never changes the caller's variable either. With value types — `int`, `double`, `bool`, `char`, `decimal`, `DateTime`, `enum`s, and any `struct` — the **whole value is duplicated**, so a method can never reach back and alter the caller's variable."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Reference types: the copy is the reference, not the object",
      "id": "reference-types"
    },
    {
      "kind": "paragraph",
      "text": "Now the part that confuses everyone. A **reference type** — `class`, `List<T>`, arrays, `string`, most objects you'll build — doesn't store the object in the variable. The variable stores a **reference** (think: an arrow pointing at the object, which lives on the heap). When you pass it, C# still copies *by value* — but the value it copies is **the arrow**, not the object. So both the caller and the method end up holding arrows pointing at the *same* object."
    },
    {
      "kind": "paragraph",
      "text": "That single fact explains the apparent contradiction. If you follow your arrow and **mutate** the object (add to the list, change a field), the caller — looking down their arrow at the same object — sees the change. But if you **reassign** your parameter to point at a brand-new object, you've only bent your own arrow; the caller's arrow still points at the original."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "List<string> cart = [\"Keyboard\"];\n\nvoid AddItem(List<string> items) => items.Add(\"Mouse\");      // mutates the shared object\n\nvoid ReplaceCart(List<string> items) => items = [\"Monitor\"]; // reassigns the LOCAL copy of the arrow\n\nAddItem(cart);\nConsole.WriteLine($\"After AddItem:     {string.Join(\", \", cart)}\");\n\nReplaceCart(cart);\nConsole.WriteLine($\"After ReplaceCart: {string.Join(\", \", cart)}\");"
    },
    {
      "kind": "output",
      "output": "After AddItem:     Keyboard, Mouse\nAfter ReplaceCart: Keyboard, Mouse"
    },
    {
      "kind": "paragraph",
      "text": "`AddItem` reached through the arrow and changed the one shared list — visible everywhere. `ReplaceCart` only repointed its own copy of the arrow at a new list; the caller's `cart` never moved. **This is the answer to 'why can a method mutate a `List` I pass in but not reassign an `int`?'** It's not really about `List` vs `int` — it's about *mutating the pointed-to object* (works for any reference type) versus *changing what a variable points to* (never escapes the method by default). The same holds for your own classes:"
    },
    {
      "kind": "examples",
      "intro": "A custom class behaves exactly like the `List`: mutate the object and the caller sees it; reassign the parameter and they don't.",
      "examples": [
        {
          "label": "Mutating fields is visible; reassigning is not",
          "code": "var account = new Account { Balance = 100 };\n\nvoid Deposit(Account a, decimal amount) => a.Balance += amount;  // mutate object\nvoid Reset(Account a)               => a = new Account { Balance = 0 }; // reassign local arrow\n\nDeposit(account, 50);\nConsole.WriteLine($\"After Deposit: {account.Balance}\");\n\nReset(account);\nConsole.WriteLine($\"After Reset:   {account.Balance}\");\n\nclass Account { public decimal Balance { get; set; } }",
          "output": "After Deposit: 150\nAfter Reset:   150"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "\"But strings are reference types — why can't I mutate one?\"",
      "text": "`string` *is* a reference type, yet a method can never change the caller's string. That's not an exception to the rule — it's **immutability**. There is no method that mutates an existing `string`; every operation (`.ToUpper()`, `+`, `.Replace(...)`) returns a **new** string and leaves the original alone. So even though both sides hold an arrow to the same string object, nothing can change what that object says. Pass a `string` exactly like an `int` in your mental model: the caller's value is effectively safe. The mutate-vs-reassign distinction only bites with **mutable** reference types like `List<T>`, arrays, and your own classes."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The #1 confusion (especially from Python)",
      "text": "\"C# is pass-by-reference for objects\" is the most common thing said in interviews, and it's **wrong**. C# is *always* pass-by-value. Reference *types* are passed by value too — the value that gets copied happens to be a reference. The giveaway test: can a method's `param = somethingNew;` change the caller's variable? With the default, **never** — for `int` or `List` alike. If it could, *that* would be pass-by-reference, which is what the `ref` keyword actually turns on."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "ref: genuine pass-by-reference",
      "id": "ref"
    },
    {
      "kind": "paragraph",
      "text": "When you genuinely want a method to change the **caller's variable itself** — not just the object it points to — you opt in with `ref`. The parameter becomes an alias for the caller's variable: read it, reassign it, and the caller sees everything. Two rules: the caller must **initialize the variable first**, and the keyword `ref` is required at **both** the declaration and the call site (so the change is never a surprise)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "void ApplyRaise(ref decimal salary, decimal percent)\n{\n    salary += salary * percent / 100;   // changes the caller's own variable\n}\n\ndecimal pay = 50_000m;\nApplyRaise(ref pay, 10);                 // 'ref' required here too\nConsole.WriteLine($\"New salary: {pay}\");\n\nvoid Swap(ref int a, ref int b) => (a, b) = (b, a);\n\nint x = 1, y = 2;\nSwap(ref x, ref y);\nConsole.WriteLine($\"x = {x}, y = {y}\");"
    },
    {
      "kind": "output",
      "output": "New salary: 55000\nx = 2, y = 1"
    },
    {
      "kind": "paragraph",
      "text": "`Swap` is the textbook case impossible without `ref` (or tuples). You can also use `ref` on a reference type — `void ReplaceCart(ref List<string> items) => items = [\"Monitor\"];` — and now the reassignment **does** reach the caller, because you passed the variable by reference rather than a copy of its arrow. Python has no equivalent; you'd return the new value and rebind, or wrap it in a list/object."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "out: a second (or third) return value",
      "id": "out"
    },
    {
      "kind": "paragraph",
      "text": "`out` is `ref`'s cousin built for **output**. The caller need **not** initialize the variable, but the method **must** assign it before every `return` (the compiler enforces this on every code path). Its signature use case is the **Try-pattern**: return a `bool` for success and hand the result back through `out`, avoiding exceptions for failures you expect. You'll meet `int.TryParse` and `dictionary.TryGetValue` constantly. Modern C# lets you declare the variable inline with `out` and discard one you don't need with `_`:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "string userInput = \"42\";\n\nif (int.TryParse(userInput, out int quantity))   // declare 'quantity' inline\n    Console.WriteLine($\"Parsed quantity: {quantity}\");\nelse\n    Console.WriteLine(\"Not a number.\");\n\n// Writing your own out-method:\nbool TryDivide(int numerator, int denominator, out int result)\n{\n    if (denominator == 0)\n    {\n        result = 0;          // MUST assign before returning, even on failure\n        return false;\n    }\n    result = numerator / denominator;\n    return true;\n}\n\nif (TryDivide(20, 4, out int answer))\n    Console.WriteLine($\"20 / 4 = {answer}\");\n\nif (!TryDivide(20, 0, out _))    // discard the out value with _\n    Console.WriteLine(\"Cannot divide by zero.\");"
    },
    {
      "kind": "output",
      "output": "Parsed quantity: 42\n20 / 4 = 5\nCannot divide by zero."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "in: read-only pass-by-reference for performance",
      "id": "in"
    },
    {
      "kind": "paragraph",
      "text": "`in` passes by reference but forbids mutation — a **read-only** reference. Why bother? To avoid copying a **large `struct`**. Remember value types are copied whole on every call; a 128-byte matrix or geometry struct copied millions of times in a game loop or numeric routine is real overhead. `in` hands over a reference (cheap) while guaranteeing the method can't change it. It pairs best with a `readonly struct`: when the type is immutable, the compiler passes by reference cleanly with no hidden defensive copies. Don't reach for `in` on small types or reference types — there it just adds noise without saving anything."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "double Trace(in Matrix4x4 m)   // read-only reference: no 128-byte copy, no mutation allowed\n{\n    // m.M00 = 9;   // <- would NOT compile: 'in' parameters are read-only\n    return m.M00;\n}\n\nvar transform = new Matrix4x4(5);\nConsole.WriteLine($\"Trace start: {Trace(in transform)}\");\n\nreadonly struct Matrix4x4\n{\n    public readonly double M00, M01, M02, M03;  // imagine 16 doubles = 128 bytes\n    public Matrix4x4(double m00) => (M00, M01, M02, M03) = (m00, 0, 0, 0);\n}"
    },
    {
      "kind": "output",
      "output": "Trace start: 5"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "ref",
          "items": [
            "Bidirectional: read **and** write the caller's variable.",
            "Caller **must initialize** the variable before the call.",
            "Use when a method legitimately needs to replace the caller's value (e.g. `Swap`).",
            "`ref` keyword required at declaration **and** call site."
          ]
        },
        {
          "title": "out",
          "items": [
            "Output-only: the method **must assign** before returning.",
            "Caller does **not** need to initialize first.",
            "The idiomatic Try-pattern: `int.TryParse(s, out int n)`.",
            "Declare inline (`out int n`) or discard (`out _`)."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "ref and out are NOT interchangeable",
      "text": "A favorite trick question. `ref` demands the variable be **initialized before** the call and is two-way. `out` does **not** require initialization but **forces** the method to assign it on every path before returning. Mixing them up is a compile error, not a runtime surprise — the compiler protects you. Also: two methods can't differ *only* by `ref` vs `out` — that's not a distinct signature and won't compile (you'll get **error CS0663**)."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Prefer return values over out (except the Try-pattern)",
      "text": "`out` and `ref` make methods harder to read and to unit-test because the effects are hidden in parameters. For returning two or three related values, prefer a **value tuple**: `(int min, int max) MinMax(int[] xs) => (xs.Min(), xs.Max());` then `var (lo, hi) = MinMax(data);` — which reads just like Python's 'return a tuple, unpack it.' Reserve `out` for the established Try-pattern, and reach for `ref`/`in` only when you have a concrete reason (mutating the caller's variable, or skipping a large-struct copy)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Where this bites you in real code",
      "id": "real-world"
    },
    {
      "kind": "list",
      "items": [
        "**The mutation bug.** A service method takes a `List<Order>`, calls `.Clear()` or `.RemoveAll(...)` for its own filtering, and silently wipes the caller's list — because both share one object. Defensive fix: copy first (`var local = orders.ToList();`) or accept an `IReadOnlyList<Order>` to signal 'I won't touch this.'",
        "**Parsing user input.** `if (int.TryParse(query[\"page\"], out int page))` in an ASP.NET Core controller is the standard, exception-free way to read query strings, form fields, and config values.",
        "**Dictionary lookups.** `if (cache.TryGetValue(key, out var value))` avoids the double lookup (and the exception) of 'check then index' — the everyday `out` pattern in caching and configuration code.",
        "**Game and numeric loops.** Passing a big `readonly struct` (Vector/Matrix/Bounds) by `in` to physics or rendering helpers avoids copying tens of bytes per call across millions of calls per frame.",
        "**The Python carry-over bug.** Engineers from Python assume reassigning a parameter inside a method updates the caller. It doesn't in either language — but the muscle memory of returning new values masks it in Python, so the C# `ref`/return distinction must be deliberate."
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "How to nail this in an interview",
      "text": "Say it in one breath: \"C# always passes by value. For reference types, the *reference* is copied — so I can mutate the shared object, but reassigning the parameter doesn't affect the caller. `ref` opts into true pass-by-reference (caller initializes, two-way); `out` is for returning extra values (caller needn't initialize, method must assign); `in` is a read-only reference to avoid copying large structs.\" That answer, plus the `List`-mutate-vs-reassign example, covers the question completely."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "C# **always passes by value** by default — the argument is copied into the parameter.",
        "**Value types** (`int`, `struct`, `bool`, `DateTime`...) copy the whole value, so a method can never change the caller's variable.",
        "**Reference types** copy the **reference (the arrow)**, not the object: you can mutate the shared object and the caller sees it, but reassigning the parameter does not escape the method.",
        "That is why a method can `.Add()` to a `List` you pass in yet cannot change an `int` you pass in — mutation vs reassignment, not 'List vs int'.",
        "`string` is a reference type but **immutable**, so it behaves like a value in practice — nothing can change the caller's string.",
        "**`ref`** = true two-way pass-by-reference (caller initializes first; `ref` at both sites). **`out`** = output value (caller needn't initialize; method must assign), the Try-pattern. **`in`** = read-only reference to skip copying large structs.",
        "`ref` and `out` are not interchangeable, and methods can't differ only by `ref`-vs-`out` (error CS0663).",
        "Prefer plain return values or **value tuples**; use `out` for the Try-pattern and `ref`/`in` only with a concrete reason."
      ]
    }
  ]
};
