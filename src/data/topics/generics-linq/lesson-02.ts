import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  "slug": "generic-classes",
  "number": 2,
  "title": "Generic Classes",
  "objective": "Build reusable generic classes and understand how List<T>, Dictionary<TKey,TValue>, and your own containers work.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Every time you write `List<int>`, `List<string>`, or `Dictionary<string, decimal>`, you are reusing **one** class definition the .NET team wrote exactly once. In this lesson you'll learn to write that kind of class yourself: a class with a *type-shaped hole* in it that callers fill in."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Lesson 1 covered generic *methods* (`T First<T>(...)`). This lesson is about generic *classes* — the container side. Open by reminding them they've already been *consuming* generic classes (`List<T>`) for the whole course; now they'll *build* one.",
        "The single biggest 'aha' for Python folks: in C# the type parameter is real at runtime and the compiler stops type errors before the program runs. Contrast with `list` in Python holding anything. Drive the `Stack<T>` example live and let them feel the red squiggle when they push a `string` onto a `Stack<int>`.",
        "Build `Box<T>` first (trivially simple, one field), then `Stack<T>` (real container with a backing `List<T>`), then `Cache<TKey, TValue>` (two type parameters). That ladder mirrors the must-cover list.",
        "Keep generic interfaces light — one slide. The goal is recognition (`IEnumerable<T>`, `IComparer<T>`), not implementation, which comes later.",
        "Common live-coding mistake to surface on purpose: forgetting that the type parameter must appear after the class name (`class Box<T>`), and trying to use `T` in a `static` member that doesn't see the instance's type. Show the compiler error rather than just describing it.",
        "Beginner gotcha worth demoing: in a file that mixes top-level statements with a class declaration, the loose statements must come FIRST or you get CS8803 ('Top-level statements must precede namespace and type declarations'). That's why the runnable examples here put their demo code inside an explicit `Main` alongside the class — keep that habit when a snippet also declares a type."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The problem: one container, every type",
      "id": "the-problem"
    },
    {
      "kind": "paragraph",
      "text": "In Python, a container is naturally universal. A `list` holds ints, strings, objects, whatever — the language never checks. That flexibility is also the catch: nothing stops `prices.append(\"oops\")` from sneaking a string into a list of numbers, and you only find out when something downstream explodes at runtime."
    },
    {
      "kind": "paragraph",
      "text": "C# is statically typed, so the naive way to get a reusable container is painful. Imagine you need a simple **box** that holds one value. Without generics you'd either write an `IntBox`, a `StringBox`, and an `OrderBox` (copy-paste forever), or you'd make one `ObjectBox` that holds `object` — and then *lose the type* the moment you take the value back out:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "WhyGenerics.cs",
      "code": "// The non-generic 'object' approach — it compiles, but it throws away type safety.\nclass ObjectBox\n{\n    public object Value { get; set; } = default!;\n}\n\nclass Demo\n{\n    static void Main()\n    {\n        var box = new ObjectBox { Value = 42 };\n\n        // The value comes back as 'object', so YOU must cast it yourself...\n        int n = (int)box.Value;          // ok — you happen to be right\n        Console.WriteLine(n);            // 42\n\n        // This line also compiles — then crashes at runtime with InvalidCastException,\n        // because the stored value is really an int, not a string:\n        string s = (string)box.Value;\n        Console.WriteLine(s);\n    }\n}"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The object trap",
      "text": "Storing values as `object` compiles happily and then throws an `InvalidCastException` at runtime when your assumption is wrong — the cast to `string` above blows up the moment it runs. It also **boxes** value types like `int`, wrapping each one in a heap allocation, which costs performance and memory. Generics fix *both* problems: the compiler enforces the type, and `Box<int>` stores a real `int` with no boxing."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Declaring a generic class: Box<T>",
      "id": "box-of-t"
    },
    {
      "kind": "paragraph",
      "text": "A generic class puts a **type parameter** — by convention a single letter `T` — in angle brackets right after the class name. Inside the class, `T` is a stand-in for whatever type the caller supplies. You use it anywhere a normal type would go: field types, property types, method parameters, return types."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Box.cs",
      "code": "class Box<T>\n{\n    // T is used as the field/property type — the \"hole\" callers fill in.\n    public T Value { get; }\n\n    public Box(T value) => Value = value;\n\n    // T appears in a method signature too.\n    public bool Holds(T candidate) => EqualityComparer<T>.Default.Equals(Value, candidate);\n\n    public override string ToString() => $\"Box<{typeof(T).Name}>({Value})\";\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // Instantiate with a concrete type by replacing T.\n        var intBox = new Box<int>(42);\n        var nameBox = new Box<string>(\"Ada\");\n\n        Console.WriteLine(intBox);\n        Console.WriteLine(nameBox);\n        Console.WriteLine(intBox.Holds(42));\n        Console.WriteLine(nameBox.Holds(\"Grace\"));\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Box<Int32>(42)\nBox<String>(Ada)\nTrue\nFalse"
    },
    {
      "kind": "paragraph",
      "text": "Read `Box<int>` as \"box of int.\" The compiler takes the `Box<T>` blueprint, substitutes `int` for every `T`, and produces a type where `Value` is a real `int` and `Holds` accepts only an `int`. Try `intBox.Holds(\"hi\")` and the code won't even compile — that's the static safety Python's `list` can't give you. Notice too that the type parameter is genuinely there at runtime: `typeof(T).Name` printed `Int32`. C# generics are **reified** (the type survives to runtime), unlike Java's erased generics or Python's optional type hints."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A real container: Stack<T>",
      "id": "stack-of-t"
    },
    {
      "kind": "paragraph",
      "text": "`Box<T>` holds one value; a real collection holds many. Let's build a **stack** — a last-in, first-out container — the way the BCL's own collections are built: as a thin, type-safe wrapper around an internal `List<T>`. This is the pattern you'll use for almost every custom container in production: don't reinvent storage, *compose* an existing generic collection and expose a clean API over it."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Stack.cs",
      "code": "class Stack<T>\n{\n    private readonly List<T> _items = new();   // T flows into the backing store\n\n    public int Count => _items.Count;\n    public bool IsEmpty => _items.Count == 0;\n\n    public void Push(T item) => _items.Add(item);\n\n    public T Pop()\n    {\n        if (IsEmpty)\n            throw new InvalidOperationException(\"Stack is empty.\");\n\n        T top = _items[^1];          // ^1 = last element\n        _items.RemoveAt(_items.Count - 1);\n        return top;\n    }\n\n    public T Peek() =>\n        IsEmpty ? throw new InvalidOperationException(\"Stack is empty.\") : _items[^1];\n}\n\nclass Program\n{\n    static void Main()\n    {\n        var history = new Stack<string>();   // an \"undo\" stack of actions\n        history.Push(\"open file\");\n        history.Push(\"type 'hello'\");\n        history.Push(\"bold selection\");\n\n        Console.WriteLine($\"Actions recorded: {history.Count}\");\n        Console.WriteLine($\"Undo: {history.Pop()}\");\n        Console.WriteLine($\"Undo: {history.Pop()}\");\n        Console.WriteLine($\"Next undo would be: {history.Peek()}\");\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Actions recorded: 3\nUndo: bold selection\nUndo: type 'hello'\nNext undo would be: open file"
    },
    {
      "kind": "paragraph",
      "text": "One definition — `Stack<T>` — now serves every element type. `new Stack<string>()` gives you an undo history of editor actions; `new Stack<int>()` could track a calculator's operands; `new Stack<HttpRequestMessage>()` could buffer requests for retry. Each instance is fully type-checked: a `Stack<string>` will never let an `int` in, and `Pop()` hands you back a `string`, no cast required. (The real BCL ships [`System.Collections.Generic.Stack<T>`](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.stack-1) — we rebuilt it to see the mechanics, but in real code you'd use theirs.)"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Compose, don't reinvent",
      "text": "Notice we didn't manage a raw array, track capacity, or resize anything — we let `List<T>` do all of that and exposed only the stack operations we wanted. In professional code, building a custom container almost always means **wrapping** `List<T>`, `Dictionary<TKey,TValue>`, or `HashSet<T>` and adding domain-specific behavior, not writing memory management from scratch."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Two type parameters: Cache<TKey, TValue>",
      "id": "two-type-parameters"
    },
    {
      "kind": "paragraph",
      "text": "A class can declare **more than one** type parameter. When you have multiple, give them meaningful names instead of bare `T`. The standard conventions — straight from the BCL — are `TKey` and `TValue` for key/value pairs, `TResult` for a return type, `TSource` for an input element. The leading `T` marks it as a type parameter; the rest documents its role."
    },
    {
      "kind": "paragraph",
      "text": "Here's a tiny in-memory cache — the kind of thing you'd put in front of an expensive database call or web API. It maps keys of one type to values of another, so it needs two parameters:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Cache.cs",
      "code": "class Cache<TKey, TValue> where TKey : notnull\n{\n    private readonly Dictionary<TKey, TValue> _store = new();\n\n    // Look it up; if it's missing, run the factory, remember the result, return it.\n    public TValue GetOrAdd(TKey key, Func<TKey, TValue> factory)\n    {\n        if (_store.TryGetValue(key, out TValue? existing))\n            return existing;\n\n        TValue created = factory(key);\n        _store[key] = created;\n        return created;\n    }\n\n    public int Count => _store.Count;\n}\n\nclass Program\n{\n    static void Main()\n    {\n        // Key = product id (int), Value = display name (string).\n        var names = new Cache<int, string>();\n\n        string LookUp(int id)\n        {\n            Console.WriteLine($\"  (expensive lookup for {id})\");\n            return $\"Product #{id}\";\n        }\n\n        Console.WriteLine(names.GetOrAdd(7, LookUp));\n        Console.WriteLine(names.GetOrAdd(7, LookUp));   // cached — no lookup\n        Console.WriteLine(names.GetOrAdd(9, LookUp));\n        Console.WriteLine($\"Cached entries: {names.Count}\");\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "  (expensive lookup for 7)\nProduct #7\nProduct #7\n  (expensive lookup for 9)\nProduct #9\nCached entries: 2"
    },
    {
      "kind": "paragraph",
      "text": "The second call for key `7` prints no `(expensive lookup ...)` line — it was served from the dictionary. The `where TKey : notnull` is a **constraint**: it promises the compiler that keys are never null, which is exactly what `Dictionary<TKey,TValue>` itself requires of its keys (you can't look something up by `null`). Constraints are the topic of the next lesson; for now, just notice that a generic class can place requirements on its type parameters."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "You've been using generic classes all along",
      "id": "bcl-collections"
    },
    {
      "kind": "paragraph",
      "text": "Everything you just built mirrors how the **Base Class Library** itself is written. The everyday .NET collections are *all* generic classes — that `<T>` you keep typing is you choosing the element type for one of these reusable blueprints:"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python container",
          "items": [
            "`list` — `[1, 2, 3]`",
            "`dict` — `{\"a\": 1}`",
            "`set` — `{1, 2, 3}`",
            "`collections.deque`",
            "`tuple` — `(1, \"a\")`",
            "Holds anything; types unchecked"
          ]
        },
        {
          "title": "C# generic equivalent",
          "items": [
            "`List<int>` — `[1, 2, 3]`",
            "`Dictionary<string, int>`",
            "`HashSet<int>`",
            "`Queue<T>` / `Stack<T>`",
            "`(int, string)` value tuple",
            "Holds one chosen type; checked at compile time"
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "`List<T>` is literally a class named `List` with a type parameter `T`, sitting in `System.Collections.Generic`. `Dictionary<TKey, TValue>` is a class with two type parameters — the very same shape as our `Cache`. When you write `new List<Order>()`, the compiler stamps out a `List` where every `T` is an `Order`, just like it did for our `Box<int>`. There's no magic: you now understand the machinery behind the most-used types in the entire framework."
    },
    {
      "kind": "examples",
      "intro": "A quick tour of the generic collections you'll reach for daily, each instantiated with concrete types:",
      "examples": [
        {
          "label": "List<T> — an ordered, growable sequence",
          "code": "var temperatures = new List<double> { 21.5, 19.0, 23.2 };\ntemperatures.Add(20.1);\nConsole.WriteLine(temperatures.Count);\nConsole.WriteLine(temperatures[0]);",
          "output": "4\n21.5"
        },
        {
          "label": "Dictionary<TKey, TValue> — fast key lookups",
          "code": "var stock = new Dictionary<string, int>\n{\n    [\"apple\"] = 12,\n    [\"pear\"] = 7\n};\nConsole.WriteLine(stock[\"apple\"]);\nConsole.WriteLine(stock.ContainsKey(\"banana\"));",
          "output": "12\nFalse"
        },
        {
          "label": "HashSet<T> — unique values, fast membership tests",
          "code": "var seen = new HashSet<int> { 1, 2, 2, 3 };\nConsole.WriteLine(seen.Count);\nConsole.WriteLine(seen.Contains(2));",
          "output": "3\nTrue"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Generic interfaces, briefly",
      "id": "generic-interfaces"
    },
    {
      "kind": "paragraph",
      "text": "Interfaces can be generic too, and you've already met the most important one without realizing it: every collection you can `foreach` over implements `IEnumerable<T>`. That single generic interface is the common contract that makes `List<int>`, `Dictionary<TKey,TValue>`, your own `Stack<T>`, and even a database query all loopable and LINQ-able the same way. A few you'll see constantly:"
    },
    {
      "kind": "list",
      "items": [
        "`IEnumerable<T>` — \"a sequence of `T` you can iterate.\" The foundation of `foreach` and all of LINQ.",
        "`IList<T>` / `ICollection<T>` / `IReadOnlyList<T>` — contracts for indexable and read-only collections; great as **method parameter types** so callers can pass any matching collection.",
        "`IDictionary<TKey, TValue>` — the abstraction `Dictionary<TKey,TValue>` implements.",
        "`IComparer<T>` and `IEquatable<T>` — let you define custom ordering and equality for a type `T`."
      ]
    },
    {
      "kind": "paragraph",
      "text": "The practical takeaway for now: **accept the interface, return the concrete type.** Typing a parameter as `IEnumerable<T>` lets a method work with arrays, lists, or any sequence; that flexibility is one of the biggest day-to-day payoffs of generics. We'll implement these interfaces ourselves in a later lesson — here you just need to recognize them in the wild."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "A generic class is not a type until you close it",
      "text": "`Box<T>` by itself is an *open* generic — a template, not a usable type. You can't write `new Box<T>()` in ordinary code or store a `Box<T>` variable without supplying `T`. You instantiate the **closed** form: `new Box<int>()`, `new Stack<string>()`, `new Cache<int, string>()`. Think of `Box<T>` as the cookie cutter and `Box<int>` as the cookie."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A **generic class** declares one or more type parameters after its name — `class Box<T>`, `class Cache<TKey, TValue>` — and uses them as field, property, parameter, and return types inside the class.",
        "Instantiate by supplying concrete types: `new Box<int>(42)`, `new Stack<string>()`. The compiler stamps out a fully type-checked version with no casts and no boxing of value types.",
        "The `object` alternative is the trap generics replace: it compiles, then risks an `InvalidCastException` at runtime and boxes every value type.",
        "Custom containers in real code almost always **wrap** an existing generic collection (`List<T>`, `Dictionary<TKey,TValue>`) rather than managing raw storage.",
        "Use meaningful type-parameter names by convention: bare `T` for one obvious type, `TKey`/`TValue`/`TResult`/`TSource` when the role matters.",
        "The BCL collections — `List<T>`, `Dictionary<TKey,TValue>`, `HashSet<T>`, `Queue<T>`, `Stack<T>` — are themselves generic classes; you've been building closed generic types since day one.",
        "Generic **interfaces** like `IEnumerable<T>` are the shared contracts that make every collection loopable and LINQ-able; prefer them as parameter types for flexibility.",
        "`Box<T>` is an open template; `Box<int>` is the real, usable type. A generic class only becomes a type once every parameter is filled in."
      ]
    }
  ]
};
