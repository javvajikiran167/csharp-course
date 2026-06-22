import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';

export const methods: Topic = {
  slug: "methods",
  title: "Methods & Reusability",
  subtitle: "Define, call, overload, and reason about methods — the unit of reuse in every C# program, from helper functions to the API surface of a whole class.",
  status: 'unlocked',
  lessons: [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06],
  quiz: [
  {
    "id": "methods-q1",
    "kind": "mcq",
    "prompt": "You keep copy-pasting the same three lines that calculate sales tax all over your ASP.NET Core service. You extract them into a method. In C#, what is true about that method's **signature** for the purpose of telling methods apart?",
    "options": [
      {
        "label": "It is the method name plus the **types, order, and modifiers of its parameters** — but **not** the return type or the parameter names.",
        "correct": true
      },
      {
        "label": "It is the method name plus the return type; two methods with different return types are considered different.",
        "correct": false
      },
      {
        "label": "It is the method name plus the parameter **names**, so renaming a parameter creates a new signature.",
        "correct": false
      },
      {
        "label": "It is just the method name; C# does not allow two methods to share a name.",
        "correct": false
      }
    ],
    "explanation": "A method signature is the name + parameter list (types, order, and modifiers like `ref`/`out`). The **return type is NOT part of the signature** — that is why you can't have two methods that differ only by return type, and it's also why overloads must differ in their parameters. Parameter **names** don't matter either; they're just labels for callers (handy for named arguments). Coming from Python, note there are no free-standing functions in C#: every method lives inside a type, and extracting one is the core way you stay DRY (Don't Repeat Yourself)."
  },
  {
    "id": "methods-q2",
    "kind": "mcq",
    "prompt": "A method declared as `void SendEmail(string to)` differs from `string SendEmail(string to)` in one key way. In C#, what does `void` mean, and how does it compare to Python?",
    "options": [
      {
        "label": "`void` means the method **returns no value**; you call it for its side effect. Python has no `void` — a Python function with no `return` silently returns `None`.",
        "correct": true
      },
      {
        "label": "`void` means the method returns `null`, exactly like Python returning `None`.",
        "correct": false
      },
      {
        "label": "`void` means the method can return any type at runtime, since C# is dynamically typed like Python.",
        "correct": false
      },
      {
        "label": "`void` is only allowed on `static` methods; instance methods must return a value.",
        "correct": false
      }
    ],
    "explanation": "`void` is part of the method's contract: it promises to return **nothing**, so you can't write `var x = SendEmail(...);`. This is a real difference from Python, where every function returns something — `None` by default. C# is statically typed, so every parameter and the return value have a declared type checked at compile time. `void` is unrelated to `static`, and it is not the same as returning `null` (only nullable/reference types can be `null`)."
  },
  {
    "id": "methods-q3",
    "kind": "predict",
    "prompt": "C# passes arguments **by value by default**. Predict the output:",
    "code": "void DoubleIt(int n) { n *= 2; }\nvoid DoubleRef(ref int n) { n *= 2; }\n\nint a = 5;\nDoubleIt(a);\nDoubleRef(ref a);\nConsole.WriteLine(a);",
    "options": [
      {
        "label": "10",
        "correct": true
      },
      {
        "label": "20",
        "correct": false
      },
      {
        "label": "5",
        "correct": false
      },
      {
        "label": "40",
        "correct": false
      }
    ],
    "explanation": "`DoubleIt(a)` passes a **copy** of the value, so doubling `n` inside the method leaves `a` untouched (still 5). `DoubleRef(ref a)` passes a reference to the variable itself, so `n *= 2` mutates the caller's `a`, taking 5 → 10. Net result: 10. The `ref` keyword is required at **both** the declaration and the call site, which keeps mutation visible and intentional — a deliberate contrast to Python, where you can't force a rebinding of the caller's variable at all."
  },
  {
    "id": "methods-q4",
    "kind": "predict",
    "prompt": "This trips up Python developers. C# reference types are passed by value too — but the **reference** is what gets copied. Predict the output:",
    "code": "void Mutate(List<int> xs) { xs.Add(99); }\nvoid Reassign(List<int> xs) { xs = new List<int> { -1 }; }\n\nvar data = new List<int> { 1, 2 };\nMutate(data);\nReassign(data);\nConsole.WriteLine(string.Join(\",\", data));",
    "options": [
      {
        "label": "1,2,99",
        "correct": true
      },
      {
        "label": "-1",
        "correct": false
      },
      {
        "label": "1,2",
        "correct": false
      },
      {
        "label": "1,2,99,-1",
        "correct": false
      }
    ],
    "explanation": "`Mutate` uses the copied reference to reach the **same** underlying list and adds 99 — that change is visible to the caller (now `1,2,99`). `Reassign` **rebinds its local copy** of the reference to a brand-new list; the caller's `data` still points at the original, so `-1` is thrown away. Result: `1,2,99`. The rule: you can always **mutate** the object a reference type points to, but you cannot **reassign** the caller's variable without `ref`. This is exactly the distinction Python folks miss, because Python has no `ref`."
  },
  {
    "id": "methods-q5",
    "kind": "mcq",
    "prompt": "You're explaining the difference between `ref` and `out` in a code review. Which statement is correct?",
    "options": [
      {
        "label": "`ref` requires the caller to **initialize** the variable first and allows reading + writing; `out` does **not** require initialization but the method **must assign** it before returning.",
        "correct": true
      },
      {
        "label": "`ref` and `out` are interchangeable; the compiler treats them identically.",
        "correct": false
      },
      {
        "label": "`out` requires the caller to initialize the variable; `ref` does not.",
        "correct": false
      },
      {
        "label": "`ref` is for value types only and `out` is for reference types only.",
        "correct": false
      },
      {
        "label": "Both `ref` and `out` make a **copy** of the argument, so changes are never visible to the caller.",
        "correct": false
      }
    ],
    "explanation": "`ref` = a two-way reference: the variable must already hold a value, and the method can read and overwrite it. `out` = an output reference: the caller can pass an uninitialized variable, but the method is **required** to assign it before it returns (the compiler enforces this). The classic `out` use is the Try-pattern, e.g. `int.TryParse(s, out int n)`. Both are compile-time rules, not runtime surprises. Note also that two methods cannot differ **only** by `ref` vs `out` — that's not a distinct signature."
  },
  {
    "id": "methods-q6",
    "kind": "predict",
    "prompt": "The Try-pattern uses `out` to avoid throwing exceptions for expected failures. Predict the output:",
    "code": "bool ok = int.TryParse(\"4x\", out int parsed);\nConsole.WriteLine($\"{ok} {parsed}\");",
    "options": [
      {
        "label": "False 0",
        "correct": true
      },
      {
        "label": "True 4",
        "correct": false
      },
      {
        "label": "False 4",
        "correct": false
      },
      {
        "label": "True 0",
        "correct": false
      }
    ],
    "explanation": "`\"4x\"` is not a valid integer, so `TryParse` returns `false` and assigns the `out` parameter its **default** value, `0` (it must assign *something* before returning). Output: `False 0`. Note the `False`/`True` capitalization — that's how C# prints a `bool`. The Try-pattern is the idiomatic, allocation-free way to handle parse/lookup that may fail (also seen in `dictionary.TryGetValue`), instead of wrapping a parse in try/catch. The inline `out int parsed` declaration is the modern style."
  },
  {
    "id": "methods-q7",
    "kind": "predict",
    "prompt": "Method **overloading** lets several methods share a name with different parameter lists; the compiler picks one at compile time. Predict the output:",
    "code": "static class Desc\n{\n    public static string Describe(int x) => \"int\";\n    public static string Describe(double x) => \"double\";\n}\n\nConsole.WriteLine($\"{Desc.Describe(5)} {Desc.Describe(5.0)}\");",
    "options": [
      {
        "label": "int double",
        "correct": true
      },
      {
        "label": "double double",
        "correct": false
      },
      {
        "label": "int int",
        "correct": false
      },
      {
        "label": "double int",
        "correct": false
      }
    ],
    "explanation": "Overload resolution picks the **most specific** applicable match. `5` is an `int` literal, so it binds to `Describe(int)` → \"int\". `5.0` is a `double` literal, binding to `Describe(double)` → \"double\". Output: `int double`. Python has no overloading (a later `def` simply replaces the earlier one); in C# the BCL leans on it heavily — `Console.WriteLine` alone has ~19 overloads. Remember: overloads must differ by parameter **types/count/order**, never by return type or parameter name alone."
  },
  {
    "id": "methods-q8",
    "kind": "mcq",
    "prompt": "For a **public library** API, Microsoft guidance often prefers overloads over optional parameters. What is the subtle gotcha with optional-parameter default values that drives this advice?",
    "options": [
      {
        "label": "Default values are **baked into the caller's compiled assembly**, so if the library changes a default, already-compiled callers keep the **old** default until they recompile.",
        "correct": true
      },
      {
        "label": "Optional parameters are slower at runtime because the default is computed on every call.",
        "correct": false
      },
      {
        "label": "Optional parameters can use mutable defaults like `new List<int>()`, causing Python's shared-mutable-default bug.",
        "correct": false
      },
      {
        "label": "Optional parameters cannot be combined with named arguments, limiting readability.",
        "correct": false
      }
    ],
    "explanation": "An optional parameter's default must be a **compile-time constant**, and the compiler **inlines that value at each call site**. So when the library author later changes `level = LogLevel.Info` to `level = LogLevel.Warn`, existing compiled callers silently keep passing `Info` until they're rebuilt — a quiet versioning bug. Overloads avoid this because the value lives in the library. (The mutable-default trap is a Python problem; C# forbids `new List<int>()` as a default, so that one can't happen here.) Optional and named arguments do work together nicely — that part is fine."
  },
  {
    "id": "methods-q9",
    "kind": "predict",
    "prompt": "Optional parameters plus a **named argument** let you skip the middle parameter. Predict the output (`new string(c, n)` makes a string of `n` copies of `c`):",
    "code": "string Box(string text, char border = '*', int pad = 1)\n    => $\"{new string(border, pad)}{text}{new string(border, pad)}\";\n\nConsole.WriteLine(Box(\"hi\", pad: 2));",
    "options": [
      {
        "label": "**hi**",
        "correct": true
      },
      {
        "label": "*hi*",
        "correct": false
      },
      {
        "label": "hi",
        "correct": false
      },
      {
        "label": "****hi****",
        "correct": false
      }
    ],
    "explanation": "`border` is omitted so it keeps its default `'*'`. The named argument `pad: 2` skips right past `border` and sets `pad` to 2, so each side becomes two `*` characters: `**hi**`. Named arguments are the clean way to set a later optional parameter without supplying the ones before it, and they make call sites self-documenting — much like Python keyword arguments."
  },
  {
    "id": "methods-q10",
    "kind": "mcq",
    "prompt": "`Console.WriteLine(\"{0} of {1}\", a, b)` and `string.Format` accept any number of arguments. Which statement about the `params` modifier is correct in C# 14 / .NET 10?",
    "options": [
      {
        "label": "`params` lets callers pass **zero or more** arguments that the method receives as a collection; in C# 13/14 it now supports `ReadOnlySpan<T>`, `IEnumerable<T>`, and more — not just arrays — enabling **zero-allocation** overloads.",
        "correct": true
      },
      {
        "label": "`params` requires the caller to always pass an explicit array; you cannot pass a comma-separated list.",
        "correct": false
      },
      {
        "label": "A method may have several `params` parameters as long as they have different types.",
        "correct": false
      },
      {
        "label": "`params` must be the **first** parameter in the list.",
        "correct": false
      }
    ],
    "explanation": "`params` is C#'s answer to Python's `*args`: callers can pass a comma-separated list *or* an existing collection, and zero arguments is allowed. There can be only **one** `params` parameter and it must be **last**. Historically `params object[]` allocated an array on every call (even for zero args); C# 13/14 added `params ReadOnlySpan<T>` (and other collection types), letting the compiler pick an allocation-free overload — valuable in hot paths like logging and string building."
  },
  {
    "id": "methods-q11",
    "kind": "predict",
    "prompt": "Predict the two values printed. `SumAll` uses `params`:",
    "code": "int SumAll(params int[] nums)\n{\n    int total = 0;\n    foreach (var x in nums) total += x;\n    return total;\n}\n\nConsole.WriteLine($\"{SumAll()} {SumAll(1, 2, 3)}\");",
    "options": [
      {
        "label": "0 6",
        "correct": true
      },
      {
        "label": "0 0",
        "correct": false
      },
      {
        "label": "6 6",
        "correct": false
      },
      {
        "label": "throws an exception on SumAll()",
        "correct": false
      }
    ],
    "explanation": "`SumAll()` with no arguments gives an **empty** collection (not null, so no exception), and the loop adds nothing → 0. `SumAll(1, 2, 3)` sums to 6. Output: `0 6`. This is exactly why methods like `string.Format` and `Console.WriteLine` can be called with any number of trailing values: that's `params` under the hood."
  },
  {
    "id": "methods-q12",
    "kind": "predict",
    "prompt": "A **local function** is a method defined inside another method — ideal for a recursive helper you don't want exposed. Predict the output:",
    "code": "int Fact(int n)\n{\n    return Go(n);\n    static int Go(int k) => k <= 1 ? 1 : k * Go(k - 1);\n}\n\nConsole.WriteLine(Fact(5));",
    "options": [
      {
        "label": "120",
        "correct": true
      },
      {
        "label": "15",
        "correct": false
      },
      {
        "label": "24",
        "correct": false
      },
      {
        "label": "25",
        "correct": false
      }
    ],
    "explanation": "`Go` is a local function that computes 5×4×3×2×1 = **120**. Local functions can be recursive, can be declared **after** the `return` that uses them (they're resolved for the whole enclosing method), and can be marked `static` so they can't accidentally capture enclosing variables — clearer and more efficient. They're C#'s closest analogue to Python's nested `def`, but with the bonus of better stack traces and no delegate allocation (unlike a lambda)."
  },
  {
    "id": "methods-q13",
    "kind": "fill",
    "prompt": "Fill in the arrow syntax for an **expression-bodied method**. Complete this one-line method that returns the larger of two ints (use the built-in helper from the `Math` class):",
    "template": "public int Max(int a, int b) ___ Math.Max(a, b);",
    "accept": [
      "=>"
    ],
    "explanation": "The `=>` token turns a method into an **expression-bodied member**: `public int Max(int a, int b) => Math.Max(a, b);` is shorthand for `{ return Math.Max(a, b); }`. It reads a bit like a Python lambda but names a real method. Use it for genuine one-liners (getters, computed properties, tiny methods); switch back to a `{ }` block when there's branching or multiple statements so the code stays readable."
  },
  {
    "id": "methods-q14",
    "kind": "fill",
    "prompt": "Returning two related values without an `out` parameter: complete the **value tuple** return type so this expression-bodied method can return both the minimum and maximum.",
    "template": "___ MinMax(int[] xs) => (xs.Min(), xs.Max());",
    "accept": [
      "(int min, int max)",
      "(int, int)",
      "(int Min, int Max)",
      "(int min,int max)",
      "(int,int)"
    ]
  }
],
  practice: [
  {
    "id": "methods-p1",
    "difficulty": "easy",
    "title": "Your First Reusable Method",
    "prompt": "A Python developer would write `def area(w, h): return w * h`. Recreate that idea in C# inside a top-level statements `Program.cs`.\n\nWrite a method `RectangleArea` that takes two `int` parameters (width and height) and **returns** their product as an `int`.\nThen call it for three different rectangles and print each result with `Console.WriteLine`.\n\nRequirements:\n- The method must have an explicit return type (not `void`).\n- Call the method at least three times with different arguments to prove it is reusable.\n- Expected sample output for `RectangleArea(3, 4)` is `12`.",
    "hints": [
      "A method that gives a value back declares a return type like `int` and uses the `return` keyword.",
      "In a top-level statements file you can declare methods at the bottom; the compiler wraps everything for you.",
      "Try the one-liner expression-bodied form too: `static int RectangleArea(int w, int h) => w * h;`"
    ]
  },
  {
    "id": "methods-p2",
    "difficulty": "easy",
    "title": "void vs Returning a Value",
    "prompt": "Build two methods that show the difference between a method that **returns** something and one that just **does** something (`void`).\n\n1. `string FormatPrice(decimal amount)` — returns a string like `$19.99` (use `amount.ToString(\"C\")` or string interpolation with `:C`).\n2. `void PrintReceiptLine(string product, decimal amount)` — prints one formatted line and returns nothing.\n\nIn your main code: build a tiny shopping list (3 products + prices), call `PrintReceiptLine` for each, and separately store the result of `FormatPrice` in a variable and print it.\n\nReflect in a comment: why can you write `var s = FormatPrice(...)` but NOT `var s = PrintReceiptLine(...)`?",
    "hints": [
      "A `void` method has no value to assign — using its result in an assignment is a compile error.",
      "`decimal` is the correct money type in C# (never `double` for currency).",
      "`$\"{amount:C}\"` formats using the current culture's currency symbol."
    ]
  },
  {
    "id": "methods-p3",
    "difficulty": "medium",
    "title": "Reference Types, Mutation, and Reassignment",
    "prompt": "This problem nails the #1 C# interview gotcha for Python folks.\n\nWrite three methods that each take a `List<int>` parameter:\n- `void AddItem(List<int> list, int value)` — calls `list.Add(value)`.\n- `void Replace(List<int> list)` — reassigns the parameter: `list = new List<int> { 99 };`.\n- `void ReplaceByRef(ref List<int> list)` — same reassignment but the parameter is `ref`.\n\nIn main: create `var numbers = new List<int> { 1, 2, 3 };` then, printing the list after each call, run `AddItem`, then `Replace`, then `ReplaceByRef`.\n\nIn comments, explain BEFORE running what you predict the list contains after each call, then confirm. Explain WHY `Replace` does not affect the caller but `AddItem` and `ReplaceByRef` do.",
    "hints": [
      "Arguments are passed by value by default — for a reference type, the *reference* is copied.",
      "Mutating the object the reference points to is visible to the caller; reassigning the local copy is not.",
      "`ref` passes the variable itself, so reassignment propagates back. A `ref` argument must be initialized before the call and written as `ReplaceByRef(ref numbers)`."
    ]
  },
  {
    "id": "methods-p4",
    "difficulty": "medium",
    "title": "The Try-Pattern with out",
    "prompt": "Implement the idiomatic C# `out` pattern used everywhere in the BCL (`int.TryParse`, `dictionary.TryGetValue`).\n\nWrite `bool TryDivide(int numerator, int denominator, out int result)` that:\n- Sets `result = 0` and returns `false` when `denominator` is 0.\n- Otherwise sets `result` to the quotient and returns `true`.\n\nThen write a small loop over these pairs: `(10, 2)`, `(7, 0)`, `(20, 5)`. For each, call it using inline `out` declaration (`out int q`) inside an `if`, printing either the quotient or a friendly \"cannot divide by zero\" message.\n\nBonus: also use `int.TryParse` on the strings `\"42\"` and `\"oops\"` and report which parsed.",
    "hints": [
      "An `out` parameter must be assigned on EVERY code path before the method returns.",
      "Modern syntax declares the variable inline: `if (TryDivide(a, b, out int q)) { ... }`.",
      "The `out` variable is in scope after the `if` too, which is handy."
    ]
  },
  {
    "id": "methods-p5",
    "difficulty": "medium",
    "title": "Overloading a Logger",
    "prompt": "Build a tiny `Log` helper that uses **method overloading** — several methods sharing one name but differing by parameter list.\n\nWrite these overloads:\n- `void Log(string message)`\n- `void Log(string message, int code)`\n- `void Log(int code)`\n\nEach prints a distinctly formatted line so you can tell which overload ran (e.g. include the code when present).\n\nIn main, call all three and observe which overload the compiler picks for each call.\n\nThen answer in comments:\n1. Why does adding `void Log(string message, int code)` and trying to also add `void Log(string text, int number)` fail to compile?\n2. Could you distinguish two overloads ONLY by return type (e.g. `int Log(string)` vs `void Log(string)`)? Why or why not?",
    "hints": [
      "A method signature = name + parameter types/count/order/modifiers. Parameter NAMES and the return type are NOT part of it.",
      "The compiler chooses the best matching overload at compile time (overload resolution).",
      "`Console.WriteLine` itself is a famous example with ~19 overloads."
    ]
  },
  {
    "id": "methods-p6",
    "difficulty": "medium",
    "title": "Default & Named Arguments for a Clean API",
    "prompt": "Design a method whose call sites read beautifully, the way modern .NET APIs do.\n\nWrite `string CreateUser(string name, bool isAdmin = false, string role = \"member\", bool sendWelcomeEmail = true)` that returns a one-line summary string of the user it would create.\n\nDemonstrate at the call site:\n- Calling with just the required `name`.\n- Using a **named argument** to set ONLY `isAdmin: true` while skipping `role`.\n- Using named arguments to set `sendWelcomeEmail: false` and `role: \"editor\"` in a different order than declared.\n\nIn comments, explain one real gotcha: optional default values are baked into the CALLER at compile time, so changing a library's default doesn't reach already-compiled callers until they recompile. Note why public library authors often prefer overloads instead.",
    "hints": [
      "Optional parameter defaults must be compile-time constants (so `= new List<int>()` won't compile).",
      "Named arguments let you skip optional parameters and reorder them: `CreateUser(\"Ada\", role: \"editor\", sendWelcomeEmail: false)`.",
      "Required (non-default) parameters must still come before you start relying purely on names for the optionals."
    ]
  },
  {
    "id": "methods-p7",
    "difficulty": "medium",
    "title": "params: Variadic Methods",
    "prompt": "Recreate the mechanism behind `string.Format` and `Console.WriteLine` using `params`.\n\nWrite `int Sum(params int[] numbers)` that returns the total of however many ints are passed.\n\nDemonstrate calling it with:\n- Zero arguments → `Sum()` should return 0.\n- Several individual arguments → `Sum(1, 2, 3, 4)`.\n- An existing array passed directly → `Sum(myArray)`.\n\nThen write a second method `string Join(string separator, params string[] parts)` that joins the parts (you may use `string.Join`). Call it like `Join(\", \", \"a\", \"b\", \"c\")`.\n\nIn comments: note that a `params` parameter must be the LAST parameter, and that pre-C# 13 `params int[]` allocates an array on every call (C# 13/14 can use `params ReadOnlySpan<int>` to avoid that allocation in hot paths).",
    "hints": [
      "`params` lets callers pass loose arguments OR a single array of the right type.",
      "Only one `params` parameter is allowed, and it must come last.",
      "Zero arguments yields an empty array, so guard or just let the loop/`Sum` produce 0."
    ]
  },
  {
    "id": "methods-p8",
    "difficulty": "hard",
    "title": "Local Functions & Expression-Bodied Members",
    "prompt": "Refactor toward clean, well-scoped helpers.\n\nWrite a public method `int FactorialOf(int n)` that:\n- Validates `n` is non-negative; throw `ArgumentOutOfRangeException` if not (use `ArgumentOutOfRangeException.ThrowIfNegative(n)`).\n- Computes the factorial using a **recursive local function** `static int Fact(int x) => ...` defined INSIDE `FactorialOf`.\n\nRules:\n- Mark the local function `static` (it should not capture any enclosing variables) and explain in a comment why that's a good default.\n- Use an **expression-bodied** body for the local function and, where sensible, for the outer method.\n- Also write a separate expression-bodied computed-style method `bool IsEven(int x) => x % 2 == 0;` and use it somewhere.\n\nTest with `FactorialOf(5)` → 120, `FactorialOf(0)` → 1, and show that `FactorialOf(-1)` throws.\n\nIn comments: contrast a local function vs a private class method vs a lambda — when would you reach for each?",
    "hints": [
      "A local function is a named method declared inside another method; it can be recursive and gives clean stack traces.",
      "Marking it `static` forbids capturing outer locals — more efficient and prevents accidental closures.",
      "`static int Fact(int x) => x <= 1 ? 1 : x * Fact(x - 1);` — make sure the base case exists to avoid StackOverflowException."
    ]
  },
  {
    "id": "methods-p9",
    "difficulty": "hard",
    "title": "Multiple Returns, Overload Resolution & ref readonly",
    "prompt": "An integration challenge across several method concepts.\n\nBuild a small stats helper:\n1. `(int min, int max, double average) Analyze(params int[] values)` — returns a value tuple. Throw `ArgumentException` if no values are given. Destructure the result at the call site: `var (lo, hi, avg) = Analyze(...);`.\n2. Add TWO overloads of `Describe`:\n   - `string Describe(int value)`\n   - `string Describe(double value)`\n   Call `Describe(5)` and `Describe(5.0)` and explain in comments which overload each binds to and why (integer literal vs double literal, and how an `int` could implicitly convert to `double` if the int overload didn't exist).\n3. Define a large-ish readonly struct `readonly struct BigPoint { public readonly long X, Y, Z; public BigPoint(long x, long y, long z){X=x;Y=y;Z=z;} }` and a method `long SumCoords(in BigPoint p) => p.X + p.Y + p.Z;`. Explain in a comment why `in` (a readonly reference) is appropriate for passing large structs and what would break if you tried to reassign `p` inside the method.\n\nWire it all together in `Main` with realistic data and print everything.",
    "prompt_note": "",
    "hints": [
      "Value tuples are the idiomatic way to return 2-3 related values instead of multiple `out` params: `(xs.Min(), xs.Max(), xs.Average())`.",
      "Overload resolution prefers the most specific applicable match; `5` is `int`, `5.0` is `double`. An `int` can implicitly widen to `double` only if no better match exists.",
      "`in` passes by readonly reference: no defensive copy of the large struct, and the compiler forbids mutating or reassigning `p`."
    ]
  },
  {
    "id": "methods-p10",
    "difficulty": "hard",
    "title": "Capstone: A Reusable Validation Pipeline",
    "prompt": "Pull every method concept from this topic into one realistic mini-system — the kind of input-validation helper you'd see in an ASP.NET Core service.\n\nBuild a `Validator` design (in top-level `Program.cs`, methods at the bottom) that validates a user-registration form:\n\n1. A guard helper `void Require(bool condition, string message)` that throws `ArgumentException(message)` when `condition` is false — a reusable guard clause used by everything below.\n2. `(bool ok, string? error) ValidateEmail(string email)` — returns a value tuple (NOT an exception) for an *expected* validation failure: ok=false with an error when the email lacks `@`. This contrasts a recoverable result (tuple) vs a programming error (the guard's exception).\n3. An overloaded `bool TryNormalizePhone(string raw, out string normalized)` Try-pattern that strips spaces/dashes and succeeds only if exactly 10 digits remain.\n4. `string BuildSummary(string name, params (string field, string value)[] extras)` using `params` of value tuples to append any number of optional fields, plus a default argument `string locale = \"en-US\"`.\n5. Inside `BuildSummary`, use a `static` **local function** to format one `(field, value)` line, and use **expression-bodied** methods wherever a body is a single expression.\n\nIn `Main`: run a valid registration and an invalid one (bad email + bad phone), printing results. Use **named arguments** somewhere for readability.\n\nIn comments throughout, justify each choice: why tuple here, why `out`/Try there, why a guard exception elsewhere, why `params`, why a local function over a private method.",
    "hints": [
      "Match the failure mode to the tool: exceptions (via the guard) for misuse/programmer error; the Try-pattern or a result tuple for *expected* validation failures.",
      "`params (string field, string value)[]` lets callers pass any number of extra fields: `BuildSummary(\"Ada\", (\"city\", \"London\"), (\"plan\", \"Pro\"))`.",
      "Keep the per-line formatter as a `static` local function so it can't accidentally capture outer state, and use `ArgumentException`/guard clauses at the top of public methods."
    ]
  }
],
  projects: [
  {
    "id": "methods-proj-1",
    "difficulty": "starter",
    "title": "Receipt Calculator: Refactor a Wall of Code into Methods",
    "brief": "You are handed a single 80-line top-level Program.cs that prints a store receipt — tax, discounts, a formatted total — all inline with copy-pasted arithmetic. You refactor it into small, well-named methods so the same logic can be reused for multiple carts, the way a real checkout service is structured. This is the most common first task on any team: take working-but-tangled code and extract methods.",
    "requirements": [
      "Start from a working console app (top-level statements, .NET 10) that computes a receipt for one hard-coded cart inline, then refactor — behavior must stay identical (verify by diffing the printed output before and after).",
      "Extract at least four methods, each doing exactly one thing, with PascalCase verb-phrase names, e.g. `decimal CalculateSubtotal(...)`, `decimal ApplyDiscount(decimal subtotal, decimal rate)`, `decimal CalculateTax(decimal amount, decimal taxRate)`, and `string FormatReceiptLine(string item, decimal price)`.",
      "Each method must have an explicit return type and explicitly typed parameters; demonstrate that you understand a method's **signature** is its name plus parameter types/order (write a one-line comment stating the signature of one method).",
      "Include at least one `void` method (e.g. `void PrintReceipt(...)` that writes to the console) and contrast it in a comment with the value-returning methods — explain what `void` means coming from Python (no `return` value, unlike Python's implicit `None`).",
      "Use at least one expression-bodied method (`=>`) for a genuine one-liner and at least one block-bodied method where there is real logic; justify the choice in a comment.",
      "Call your methods from the top-level code to produce the receipt for at least two different carts, proving the DRY payoff: no arithmetic is duplicated.",
      "Validate inputs with a guard clause in one method using `ArgumentOutOfRangeException.ThrowIfNegative(price)` (or `ArgumentException`) so a negative price fails fast and clearly."
    ],
    "stretch": [
      "Add a `static` helper method `decimal Round2(decimal value) => Math.Round(value, 2, MidpointRounding.ToEven)` and use it consistently so money never shows more than two decimals.",
      "Write a tiny set of assertions in `Main` (e.g. `Debug.Assert(CalculateTax(100m, 0.1m) == 10m)`) to lock in behavior, mimicking unit tests before you have a test project.",
      "Pull the methods into a separate non-static class (e.g. `ReceiptService`) and call them as static members, taking your first step from a script toward a structured, testable service class."
    ],
    "concepts": [
      "method declaration",
      "signature",
      "parameters",
      "return type vs void",
      "expression-bodied members",
      "DRY / extract method",
      "PascalCase naming",
      "guard clauses",
      "static methods"
    ]
  },
  {
    "id": "methods-proj-2",
    "difficulty": "intermediate",
    "title": "Robust Settings Parser: Mastering ref, out, in, and the Try-Pattern",
    "brief": "You build a small configuration-parsing library — the kind every backend has — that reads raw string values (from env vars or a config file) and converts them to typed settings without throwing exceptions for bad input. Along the way you implement your own Try-pattern methods with `out`, an in-place updater with `ref`, and a large-struct reader with `in`, then prove with experiments exactly when a caller's variable does and does not change. This nails the single most-asked C# interview question: pass-by-value vs pass-by-reference.",
    "requirements": [
      "Implement `bool TryParsePort(string? raw, out int port)` that mirrors `int.TryParse`: returns `false` (and sets `port = 0`) on bad input, returns `true` with the parsed value otherwise; call it with inline `out var port` and handle both branches.",
      "Write a demonstration method proving **pass-by-value is the default**: pass an `int` and a `List<string>` by value into a method that both mutates the list's contents (visible to the caller) AND reassigns the parameter to a new list (NOT visible to the caller). Print before/after to show the difference, and explain in comments why this surprises Python developers.",
      "Implement `void NormalizeInPlace(ref string value)` using `ref` that trims and lowercases the caller's variable in place; show that the caller must initialize the variable before the call and that the change is visible afterward.",
      "Implement a method taking a large readonly struct by `in` (e.g. `void LogConfig(in ServerConfig config)` where `ServerConfig` is a `readonly struct` with several fields) to avoid copying; show in a comment that you cannot mutate an `in` parameter (attempting to assign a field is a compile error).",
      "Demonstrate that a method overload set CANNOT differ only by `ref` vs `out` (write the two signatures in a comment and explain the compiler error), but CAN differ between by-value and `out`.",
      "Replace one of your `out`-based methods with a **value-tuple return** version, e.g. `(bool ok, int value) ParsePort(string? raw)`, and write a short comment on when a tuple reads better than `out` (multiple related values) versus when `out`/Try-pattern is idiomatic (a single result plus a success flag).",
      "Use your parser to load at least three settings (port, host, a bool flag) from a small `Dictionary<string,string>` via `TryGetValue`, falling back to defaults on missing/invalid values, so the program never crashes on bad config."
    ],
    "stretch": [
      "Add a generic `bool TryParseEnum<TEnum>(string? raw, out TEnum result) where TEnum : struct, Enum` wrapping `Enum.TryParse`, and parse a `LogLevel` setting with it.",
      "Benchmark or reason about the `in` parameter: make `ServerConfig` deliberately large (e.g. 8+ fields), and write a comment estimating the copy cost avoided versus a by-value pass.",
      "Surface a clear aggregated error: collect all invalid keys during load and return them via an `out List<string> errors` parameter alongside a populated settings object, contrasting that design with throwing exceptions."
    ],
    "concepts": [
      "pass by value vs reference",
      "ref parameters",
      "out parameters",
      "in / readonly reference",
      "Try-pattern",
      "value-tuple returns",
      "overload resolution rules",
      "reference types vs value types",
      "guard against invalid input"
    ]
  }
],
};
