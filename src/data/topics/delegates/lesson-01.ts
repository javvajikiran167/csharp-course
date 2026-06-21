import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  "slug": "delegates",
  "number": 1,
  "title": "Delegates — Methods as Values",
  "objective": "Understand a delegate as a type-safe reference to a method, declare and invoke one, and combine methods with multicast delegates.",
  "blocks": [
    {
      "kind": "lead",
      "text": "In Python you pass functions around all the time — `sorted(words, key=len)` hands the `len` function to `sorted` as a value. C# can do exactly that, but it adds one thing Python doesn't: the compiler checks, at build time, that the method you're passing has the right shape. The tool that makes that possible is the **delegate**."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by writing `sorted(words, key=len)` on the board and asking: \"what kind of thing is `len` here?\" Get them to say \"a function used as a value.\" That IS a delegate — we're just naming a concept they already use.",
        "The single hardest mental shift: a delegate is a TYPE, not a value. Spend time on `delegate int Transformer(int x);` being a class declaration. Many students think the delegate is `x => x*2`; correct that early.",
        "Resist introducing lambdas before method groups. Assign named methods first so they see a delegate as 'a slot a method drops into.' Lambdas (next lesson) are just a shorter way to fill that slot.",
        "Live-coding gotcha to expect: in a top-level-statements file, a `delegate` (or any type) declaration must come AFTER all the executable statements, or you get CS8803. The custom-delegate snippet here puts the declaration at the bottom for exactly that reason — if a student writes it first, the build breaks. Turn that into a teaching moment about how top-level files are compiled.",
        "Multicast is the surprise: a single variable holding MANY methods. Demo `+=` live and watch all of them fire. Then show the non-void return-value gotcha — it always gets a reaction.",
        "Land the payoff at the end: every LINQ call and every minimal-API endpoint they'll ever write is a delegate. This lesson is the foundation for the next two (lambdas, events)."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A method you can put in a variable",
      "id": "method-in-a-variable"
    },
    {
      "kind": "paragraph",
      "text": "Normally a method is something you *call*: `Math.Abs(-5)`. A **delegate** lets you treat the method itself — not its result — as a value you can store in a variable, pass to another method, and call later. If you've ever written `sorted(items, key=str.lower)` in Python, you've passed a function as a value. C# does the same, with one extra guarantee: a delegate is a **type-safe reference to a method**. \"Type-safe\" means the compiler verifies the method's parameters and return type match before your program ever runs — pass the wrong shape and you get a red squiggle, not a runtime surprise."
    },
    {
      "kind": "paragraph",
      "text": "Here's the smallest possible example. `Func<int, int>` is a built-in delegate type meaning \"a method that takes one `int` and returns an `int`.\" We point a variable of that type at a real method, then invoke it through the variable."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int Square(int n) => n * n;\n\n// 'op' is a variable whose value is the Square method itself.\nFunc<int, int> op = Square;\n\n// Calling through the variable runs whatever method it points to.\nConsole.WriteLine(op(6));   // same as Square(6)\n\nop = Math.Abs;              // re-point it at a different (matching) method\nConsole.WriteLine(op(-6));"
    },
    {
      "kind": "output",
      "output": "36\n6"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Method group conversion",
      "text": "Notice we wrote `Func<int,int> op = Square;` with **no parentheses** after `Square`. Parentheses (`Square(6)`) mean *call it now*; the bare name `Square` is a **method group** — the method as a value. The compiler automatically converts that method group into a delegate of the target type. Writing `op = Square()` instead would try to assign the *return value* (an `int`) and fail to compile. This is the single most common beginner stumble: \"why no parentheses?\""
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Declaring your own delegate type",
      "id": "declaring-a-delegate-type"
    },
    {
      "kind": "paragraph",
      "text": "`Func` and `Action` (more on those shortly) cover almost everything, but it's worth seeing a custom delegate type once, because it reveals what a delegate really *is*. The `delegate` keyword declares a brand-new **type** — think of it as defining the shape of a method signature and giving that shape a name. In the snippet below the declaration sits at the **bottom**, and that placement is deliberate (we'll explain why right after)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int Double(int x) => x * 2;\nint Negate(int x) => -x;\n\nTransformer t = Double;      // a Transformer variable holding the Double method\nConsole.WriteLine(t(10));     // 20\n\nt = Negate;                  // any matching method fits\nConsole.WriteLine(t(10));     // -10\n\n// This line declares a NEW TYPE named Transformer.\n// Any method that takes one int and returns one int 'fits' this type.\ndelegate int Transformer(int x);"
    },
    {
      "kind": "output",
      "output": "20\n-10"
    },
    {
      "kind": "paragraph",
      "text": "`delegate int Transformer(int x);` is a type declaration, sitting at the same level as a `class` or `record`. Behind the scenes the compiler generates a sealed class deriving from `System.MulticastDelegate`. You almost never need to know that — but it explains why a delegate variable can hold method references, compare for equality, and (as we'll see) chain multiple methods together."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Type declarations come AFTER statements in a top-level file",
      "text": "In a file using **top-level statements** (no explicit `Main`), every executable statement must appear *before* any type declaration — including a `delegate`. Put `delegate int Transformer(int x);` at the **top**, above the `Console.WriteLine` calls, and the compiler rejects it with **CS8803: \"Top-level statements must precede namespace and type declarations.\"** That's why the snippet above places the `delegate` line last. (Inside a normal class or namespace this ordering doesn't apply — it's purely a rule of top-level files.)"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Prefer the built-in delegates",
      "text": "In real codebases you'll rarely declare your own delegate types. The BCL ships three families that cover nearly every case: **`Func<…, TResult>`** for a method that returns a value, **`Action<…>`** for one that returns `void`, and **`Predicate<T>`** for a test (it's the same shape as `Func<T, bool>`). Reach for these first — `Func<int,int>` instead of a hand-written `Transformer` — because every C# developer recognises them instantly. Write a custom delegate only when a descriptive name genuinely aids readability, or when you need `ref`/`out` parameters, which `Func`/`Action` can't express."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Func — returns a value",
          "items": [
            "Last type argument is the **return** type",
            "`Func<int,int>` = takes int, returns int",
            "`Func<string,int,bool>` = (string, int) → bool",
            "`Func<DateTime>` = takes nothing, returns DateTime",
            "Use for: transforms, selectors, calculations, factories"
          ]
        },
        {
          "title": "Action — returns void",
          "items": [
            "No return type — it *does* something",
            "`Action` = takes nothing, returns nothing",
            "`Action<string>` = takes a string, returns nothing",
            "`Action<int,int>` = takes two ints, returns nothing",
            "Use for: logging, callbacks, event handlers, side effects"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Passing a method as an argument (the callback)",
      "id": "callbacks"
    },
    {
      "kind": "paragraph",
      "text": "The real power shows up when a method *accepts* a delegate. The caller injects behavior — \"here's a method, you decide when to call it.\" That's a **callback**, and it's the heart of the strategy pattern. Consider a notification service that must work over email, SMS, or a Slack webhook. Instead of baking `if (channel == ...)` branches into the service, we let the caller hand us the \"how to deliver\" method:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// The service depends on a CAPABILITY (deliver one message),\n// not on any concrete email/SMS class.\nvoid NotifyAll(List<string> recipients, Action<string> deliver)\n{\n    foreach (var person in recipients)\n        deliver($\"Hi {person}, your order has shipped.\");\n}\n\nvoid SendEmail(string body) => Console.WriteLine($\"[EMAIL] {body}\");\nvoid SendSms(string body)   => Console.WriteLine($\"[SMS]   {body}\");\n\nvar customers = new List<string> { \"Ada\", \"Linus\" };\n\nNotifyAll(customers, SendEmail);   // inject the email strategy\nNotifyAll(customers, SendSms);     // ...or the SMS strategy"
    },
    {
      "kind": "output",
      "output": "[EMAIL] Hi Ada, your order has shipped.\n[EMAIL] Hi Linus, your order has shipped.\n[SMS]   Hi Ada, your order has shipped.\n[SMS]   Hi Linus, your order has shipped."
    },
    {
      "kind": "paragraph",
      "text": "`NotifyAll` has no idea how delivery happens — it just calls the `deliver` method it was handed. That decoupling is exactly how `List<T>.Sort` accepts a comparison (`Comparison<T>`), how `List<T>.Find` accepts a predicate (`Predicate<T>`), and how you'll pass retry policies or validation rules around in production code. The Python parallel is direct: `def notify_all(recipients, deliver):` then `notify_all(customers, send_email)`. C# adds the static type check — `NotifyAll(customers, Math.Abs)` won't compile, because `Math.Abs` isn't an `Action<string>`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Multicast delegates: one variable, many methods",
      "id": "multicast"
    },
    {
      "kind": "paragraph",
      "text": "Here's something Python has no built-in equivalent for: a single delegate variable can hold **a list of methods**, and invoking it runs them all, in subscription order. You build the chain with `+=` and remove links with `-=`. This is called a **multicast delegate**, and it's the mechanism underneath C#'s entire event system."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "void Audit(string e)     => Console.WriteLine($\"audit: {e}\");\nvoid Metrics(string e)   => Console.WriteLine($\"metric: {e}\");\nvoid Notify(string e)    => Console.WriteLine($\"notify: {e}\");\n\nAction<string> onOrderPlaced = Audit;   // one subscriber\nonOrderPlaced += Metrics;               // now two\nonOrderPlaced += Notify;                // now three\n\nonOrderPlaced(\"order #1001\");           // fires all three, in order\n\nConsole.WriteLine(\"--- after unsubscribing Metrics ---\");\nonOrderPlaced -= Metrics;               // remove one\nonOrderPlaced(\"order #1002\");"
    },
    {
      "kind": "output",
      "output": "audit: order #1001\nmetric: order #1001\nnotify: order #1001\n--- after unsubscribing Metrics ---\naudit: order #1002\nnotify: order #1002"
    },
    {
      "kind": "paragraph",
      "text": "One \"order placed\" signal, three independent reactions, each added and removed without the others knowing. This is the publish/subscribe pattern in miniature, and it's how domain events, UI button clicks, and game messaging (`OnPlayerDied`, `OnScoreChanged`) all work under the hood. In the next lesson we'll wrap this exact mechanism in the `event` keyword to make it safe for public use."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Multicast + a return value = lost results",
      "text": "Multicasting is designed for `Action` (void). If you multicast a **`Func`** that returns a value, only the **last** method's return value survives — every earlier result is silently discarded. With `int AddOne(int x) => x+1;` and `int Times10(int x) => x*10;`, then `Func<int,int> f = AddOne; f += Times10; int r = f(5);` gives you `50` (Times10's result), and the `6` from `AddOne` vanishes. If you genuinely need every result, walk `f.GetInvocationList()` and invoke each method yourself. Rule of thumb: multicast `Action`, never `Func`."
    },
    {
      "kind": "examples",
      "intro": "A few more delegate shapes you'll meet constantly — especially through LINQ, where every one of these is a delegate you're handing to the library:",
      "examples": [
        {
          "label": "A bool-returning Func as a filter (this is exactly what LINQ's Where takes — a Func<T,bool>, not Predicate<T>)",
          "code": "var nums = new[] { 3, 8, 11, 2, 17 };\nFunc<int, bool> isBig = n => n > 10;\nvar big = nums.Where(isBig);\nConsole.WriteLine(string.Join(\", \", big));",
          "output": "11, 17"
        },
        {
          "label": "Func as a selector (this is what LINQ's Select takes)",
          "code": "var words = new[] { \"api\", \"sql\", \"json\" };\nFunc<string, string> upper = w => w.ToUpper();\nConsole.WriteLine(string.Join(\", \", words.Select(upper)));",
          "output": "API, SQL, JSON"
        },
        {
          "label": "Func<T> as a factory / lazy provider (common in DI)",
          "code": "Func<DateTime> clock = () => DateTime.UnixEpoch;\nConsole.WriteLine(clock().ToString(\"yyyy-MM-dd\"));",
          "output": "1970-01-01"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Why this matters: the foundation under everything",
      "id": "why-it-matters"
    },
    {
      "kind": "paragraph",
      "text": "Delegates can feel abstract until you realise you'll use them every single day, usually without naming them. Several pillars of professional C# are built directly on what you just learned:"
    },
    {
      "kind": "list",
      "items": [
        "**LINQ is delegates, top to bottom.** `Where`, `Select`, `OrderBy`, `Any`, `First`, `Sum` — every one accepts a `Func<>` (for example, `Where` takes a `Func<T,bool>`). When you write `orders.Where(o => o.Total > 100)`, you're passing a method-as-value to a method that calls it back per element. That's exactly the callback pattern from `NotifyAll`.",
        "**Events are wrapped multicast delegates.** The `onOrderPlaced += Audit` style you saw is precisely how C# events work; the `event` keyword just adds encapsulation so outside code can subscribe but not raise. The next lesson builds straight on this.",
        "**ASP.NET Core minimal APIs are delegates.** `app.MapGet(\"/users\", () => db.Users.ToList())` registers a delegate the framework invokes on each request. The whole request pipeline is delegate composition.",
        "**Dependency injection and strategies** pass `Func<>`/`Action<>` to configure retry policies, factory functions, and key selectors — a lightweight alternative to one-method interfaces.",
        "**`List<T>` and arrays take delegates too:** `Sort` wants a `Comparison<T>`, while `Find`, `FindAll`, and `RemoveAll` want a `Predicate<T>` — the same idea as LINQ, just predating it."
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "C# 14 footnote",
      "text": "Delegates have worked this way for two decades and the fundamentals are unchanged in C# 14 / .NET 10. The one small refinement worth knowing: lambda parameters carrying `ref`/`out`/`in` (and `ref readonly`/`scoped`) modifiers no longer need an explicit type when it can be inferred from the delegate — e.g. for a delegate `delegate bool TryParse(string s, out int result);` you can now write `TryParse p = (s, out r) => int.TryParse(s, out r);` instead of spelling out `(string s, out int r)`. That's an ergonomic nicety, not a new concept, and we'll meet it properly when we cover lambdas next."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A **delegate** is a type-safe reference to a method — a variable that holds a method you can pass around and call later. (Python's \"functions are first-class,\" but checked by the compiler.)",
        "The `delegate` keyword declares a **type**; in practice prefer the built-ins: **`Func<…,TResult>`** (returns a value), **`Action<…>`** (returns void), **`Predicate<T>`** (a `T → bool` test).",
        "Assign a method to a delegate using its name with **no parentheses** — that's **method group conversion**. Parentheses would call it instead.",
        "In a top-level-statements file, any type declaration (including a `delegate`) must appear **after** all executable statements, or you hit **CS8803**.",
        "A method that *accepts* a delegate gets a **callback**: the caller injects behavior. This is the strategy pattern and how `Sort`, `Find`, and LINQ all work.",
        "**Multicast** delegates chain methods with `+=` / `-=` and invoke them all in order — the basis of events. With a `Func`, only the **last** return value survives.",
        "Delegates are the foundation of **LINQ**, **events**, and **minimal APIs** — learn them once, recognise them everywhere."
      ]
    }
  ]
};
