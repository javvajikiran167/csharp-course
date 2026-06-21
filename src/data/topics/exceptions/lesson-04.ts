import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  "slug": "custom",
  "number": 4,
  "title": "Custom Exception Types",
  "objective": "Define your own exception classes for domain-specific failures, and know when a custom exception is justified versus reusing a built-in one.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Sooner or later your code hits a failure that no built-in exception describes well: an order can't be fulfilled, a payment is declined, a booking collides with another. This lesson is about giving those domain failures a **name and a shape** — a custom exception type that carries the data your handlers actually need."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Lead with motivation, not mechanics: students need to feel *why* `InsufficientFundsException` beats a raw `Exception(\"not enough money\")` before they care about constructors.",
        "The single biggest takeaway is the **justification test**: most of the time you should reuse a built-in. Hammer this so they don't graduate into people who invent an exception per method.",
        "Tie the 'three standard constructors' to muscle memory — it's a near-universal expectation in C# codebases and a common code-review nitpick. Show that the IDE/`Exception` snippet generates them.",
        "Explicitly warn against the obsolete `(SerializationInfo, StreamingContext)` constructor. Students copying old Stack Overflow answers will add it and get the **SYSLIB0051** warning on .NET 10 — I verified the exact diagnostic ID against the SDK.",
        "The 'add domain data as properties' point is what separates a real custom exception from a renamed `Exception`. The model is `FileNotFoundException.FileName`. Make them ask: 'what would a catch block want to inspect?'",
        "Watch the nullable-reference gotcha: with `<Nullable>enable</Nullable>` (the .NET 10 default), a get-only `string` domain property triggers **CS8618** on the parameterless and `(message)` constructors, because those paths leave it null. Declaring it `string?` is the honest fix — an exception built without an account id genuinely has none. This is a great teachable moment about NRT flow analysis.",
        "Currency formatting (`:C`) is culture-dependent. The runnable demo pins `CultureInfo.CurrentCulture` to `en-US` so the `$`/`.00` output is deterministic; without that, the printed symbol depends on the machine's locale. Call this out — students who skip it will see different output and think they broke something.",
        "Good place for a quick live demo: throw the custom type, catch it specifically, read its property, and let a different exception fall through uncaught to show the type-based dispatch."
      ]
    },
    {
      "kind": "paragraph",
      "text": "In Python you'd subclass `Exception` for a domain error — `class InsufficientFundsError(Exception): ...` — and you do it fairly casually. C# works the same way mechanically: you derive a class from `System.Exception`. But the *culture* is different. Idiomatic C# leans hard on the rich set of built-in exception types first, and reaches for a custom type only when a built-in genuinely can't express the failure or when callers need to **catch this specific situation** and react to it. So before we write a single custom class, let's nail down when you should."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When a custom exception is actually justified",
      "id": "when-justified"
    },
    {
      "kind": "paragraph",
      "text": "The deciding question is almost never \"is this a special kind of error?\" — it's \"**will a caller want to catch *this* and nothing else?**\". Exceptions exist to be caught by type. If no realistic handler would ever write `catch (MyException)` to do something different from how it treats other failures, a custom type earns its keep only as documentation, and a built-in with a good message is usually better. Use this checklist."
    },
    {
      "kind": "list",
      "items": [
        "**Reuse a built-in when the failure is a generic programming or state error.** A null argument is `ArgumentNullException`. An out-of-range value is `ArgumentOutOfRangeException`. A bad argument value is `ArgumentException`. Calling a method when the object is in the wrong state (an empty stack, a closed connection) is `InvalidOperationException`. An unsupported operation is `NotSupportedException`. These cover a huge fraction of real validation.",
        "**Create a custom exception when the failure is a meaningful *domain* concept** that callers should be able to handle distinctly — `InsufficientFundsException`, `OrderAlreadyShippedException`, `SeatUnavailableException`. The catch block does something specific: show a tailored message, retry differently, refund, escalate.",
        "**Create one when you need to attach structured data** the handler will read programmatically — the account id and the shortfall amount, the conflicting booking, the HTTP status from an upstream service. A string message alone can't carry that.",
        "**Create one to wrap lower-level exceptions** at a boundary so callers depend on *your* domain type, not the persistence/HTTP details underneath — `throw new OrderProcessingException(\"Failed to charge card\", innerException: ex)`."
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Don't reach for custom too early (the Python-habit trap)",
      "text": "A common beginner reflex — sharpened by Python's casual subclassing — is to invent a new exception type for every method or every error message. Most failures are already perfectly described by `ArgumentException`, `ArgumentNullException`, `ArgumentOutOfRangeException`, or `InvalidOperationException`. **Never throw the reserved runtime types yourself** — `NullReferenceException`, `IndexOutOfRangeException`, `StackOverflowException`, `AccessViolationException` — the runtime owns those (analyzer **CA2201** flags it). And never derive from the historical dead-end `ApplicationException`; derive from `Exception`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Defining a custom exception correctly",
      "id": "defining"
    },
    {
      "kind": "paragraph",
      "text": "There's a well-established shape every C# reviewer expects, and getting it right is mostly about muscle memory. Derive from `Exception` directly. Name the class with an `Exception` suffix (`PaymentDeclinedException`, never `PaymentDeclinedError` or `BadPayment`). Provide the **three standard constructors** so your type behaves like every other exception in the framework — a parameterless one, one taking a `message`, and one taking a `message` plus an `innerException`. Each just forwards to the matching `base(...)` constructor."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "PaymentDeclinedException.cs",
      "code": "namespace Billing;\n\n// Name ends in \"Exception\". Derives from Exception (not ApplicationException).\npublic class PaymentDeclinedException : Exception\n{\n    // 1. Parameterless\n    public PaymentDeclinedException()\n    {\n    }\n\n    // 2. With a human-readable message\n    public PaymentDeclinedException(string message)\n        : base(message)\n    {\n    }\n\n    // 3. With a message AND the underlying cause (preserves InnerException)\n    public PaymentDeclinedException(string message, Exception innerException)\n        : base(message, innerException)\n    {\n    }\n}"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Skip the old serialization constructor",
      "text": "If you copy an older Stack Overflow answer you'll see a fourth constructor: `protected PaymentDeclinedException(SerializationInfo info, StreamingContext context)`. That existed for `BinaryFormatter` exception serialization, which is **obsolete in modern .NET** — adding it raises warning **`SYSLIB0051`** on .NET 10. Do not add it. The three constructors above are the complete, current pattern. Tip: in Visual Studio / Rider, typing the class declaration and using the **`Exception` snippet** scaffolds these for you."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Carrying domain data as properties",
      "id": "domain-data"
    },
    {
      "kind": "paragraph",
      "text": "This is what makes a custom exception *worth* defining instead of just throwing `new InvalidOperationException(\"insufficient funds\")`. The framework itself models this: `FileNotFoundException` exposes a `FileName` property, `ArgumentException` exposes `ParamName`. Follow the same idea — add read-only properties for exactly the data a handler would want to inspect, and add a constructor that captures them. Keep the base `message` informative too, because logs and users see `Message`, not your property names."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "InsufficientFundsException.cs",
      "code": "namespace Banking;\n\npublic class InsufficientFundsException : Exception\n{\n    // Domain data a catch block can read programmatically.\n    // AccountId is string? because the standard constructors below\n    // create an instance that has no account id (and with NRT enabled,\n    // a non-nullable string here would trip warning CS8618).\n    public string? AccountId { get; }\n    public decimal Requested { get; }\n    public decimal Available { get; }\n    public decimal Shortfall => Requested - Available;\n\n    // Domain-specific constructor that captures the data\n    // and builds a clear base Message.\n    public InsufficientFundsException(string accountId, decimal requested, decimal available)\n        : base($\"Account {accountId} needs {requested:C} but only has {available:C} available.\")\n    {\n        AccountId = accountId;\n        Requested = requested;\n        Available = available;\n    }\n\n    // Keep the standard constructors too, so the type stays well-behaved.\n    public InsufficientFundsException() { }\n    public InsufficientFundsException(string message) : base(message) { }\n    public InsufficientFundsException(string message, Exception innerException)\n        : base(message, innerException) { }\n}"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Read-only, and watch nullability",
      "text": "The properties are get-only and set once in the constructor. An exception is a snapshot of a failure that already happened — nobody should mutate `Shortfall` after the fact, and this keeps the type safe to pass across threads and through logging pipelines. One subtlety with nullable reference types (on by default in .NET 10): because the parameterless and `(message)` constructors don't set `AccountId`, it must be declared `string?` — otherwise the compiler raises **CS8618**. That's not a hack; it's the truth that an exception built via those constructors carries no account id."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Throwing and catching your type",
      "id": "throw-catch"
    },
    {
      "kind": "paragraph",
      "text": "Now the payoff. Because catch blocks dispatch by type, a caller can handle *exactly* the insufficient-funds case — reading the structured data to react intelligently — while letting every other failure propagate. Here's an end-to-end example you can run. (We pin the culture to `en-US` at the top so the `:C` currency formatting prints `$` deterministically; the `:C` specifier follows the machine's current culture, so without that line your output's currency symbol would match *your* locale, not necessarily the dollars shown below.)"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System.Globalization;\nusing Banking;\n\n// Pin culture so :C prints US dollars regardless of the host machine.\nCultureInfo.CurrentCulture = new CultureInfo(\"en-US\");\n\nvar account = new Account(\"ACC-1001\", balance: 50m);\n\ntry\n{\n    account.Withdraw(120m);\n}\ncatch (InsufficientFundsException ex)\n{\n    // We can read the domain data, not just a string.\n    Console.WriteLine($\"Declined: {ex.Message}\");\n    Console.WriteLine($\"You are short by {ex.Shortfall:C} on {ex.AccountId}.\");\n}\n\nConsole.WriteLine($\"Balance is still {account.Balance:C}.\");\n\nsealed class Account(string id, decimal balance)\n{\n    public string Id { get; } = id;\n    public decimal Balance { get; private set; } = balance;\n\n    public void Withdraw(decimal amount)\n    {\n        // Built-in for the generic argument error...\n        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount);\n\n        // ...custom for the genuine domain failure.\n        if (amount > Balance)\n            throw new InsufficientFundsException(Id, amount, Balance);\n\n        Balance -= amount; // only reached on success — no partial state\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Declined: Account ACC-1001 needs $120.00 but only has $50.00 available.\nYou are short by $70.00 on ACC-1001.\nBalance is still $50.00."
    },
    {
      "kind": "paragraph",
      "text": "Two details worth calling out. First, the method validates the *generic* argument problem (a non-positive amount) with the built-in throw-helper `ArgumentOutOfRangeException.ThrowIfNegativeOrZero`, and reserves the custom type for the *domain* problem — that's the reuse-vs-custom rule in action within a single method. Second, the throw happens **before** `Balance` is mutated, so when the exception propagates the account is untouched. Callers assume an exception means no side effects; honor that."
    },
    {
      "kind": "examples",
      "intro": "A few more patterns you'll meet in production code.",
      "examples": [
        {
          "label": "Wrapping a lower-level exception at a boundary (preserve the cause)",
          "code": "public async Task ChargeAsync(Order order)\n{\n    try\n    {\n        await _gateway.ChargeAsync(order.CardToken, order.Total);\n    }\n    catch (HttpRequestException ex)\n    {\n        // Callers depend on OUR domain type, not HTTP details.\n        // The original error is preserved as InnerException.\n        // Note: the named argument matches the parameter name,\n        // which is `innerException` (not `inner`).\n        throw new OrderProcessingException(\n            $\"Failed to charge order {order.Id}.\", innerException: ex);\n    }\n}"
        },
        {
          "label": "Catching your type with an exception filter to react to its data",
          "code": "try\n{\n    account.Withdraw(amount);\n}\ncatch (InsufficientFundsException ex) when (ex.Shortfall <= overdraftLimit)\n{\n    // Only handle small shortfalls here; larger ones propagate.\n    ApplyOverdraft(ex.AccountId, ex.Shortfall);\n}"
        },
        {
          "label": "Reuse a built-in when no custom type is justified",
          "code": "public void Ship()\n{\n    if (_status == OrderStatus.Shipped)\n        // No caller needs to catch THIS distinctly -> built-in is fine.\n        throw new InvalidOperationException(\"Order has already shipped.\");\n\n    _status = OrderStatus.Shipped;\n}"
        }
      ]
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Reuse a built-in exception",
          "items": [
            "Argument is null -> `ArgumentNullException`",
            "Argument out of range -> `ArgumentOutOfRangeException`",
            "Otherwise-invalid argument -> `ArgumentException`",
            "Object in wrong state -> `InvalidOperationException`",
            "Operation not supported -> `NotSupportedException`",
            "No caller would catch this case *specifically*"
          ]
        },
        {
          "title": "Define a custom exception",
          "items": [
            "A real **domain** failure (insufficient funds, seat taken)",
            "Callers will `catch` *this type* and react differently",
            "You must attach **structured data** for handlers to read",
            "You're wrapping low-level errors behind a domain boundary",
            "The failure deserves its own name in your ubiquitous language",
            "Then: derive from `Exception`, `...Exception` suffix, 3 ctors"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: write the Message for humans",
      "text": "The end user and the on-call engineer see `Exception.Message`, not your class name. Make it a complete, punctuated sentence with the relevant values baked in — like `Account ACC-1001 needs $120.00 but only has $50.00 available.` Keep the *programmatic* details (ids, amounts) in typed properties, and the *human* summary in the message. You'll thank yourself at 2 a.m. reading logs."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "Derive custom exceptions from **`Exception`** (never `ApplicationException`), name them with an **`Exception` suffix**, and provide the **three standard constructors**: parameterless, `(message)`, and `(message, innerException)`.",
        "Do **not** add the obsolete `(SerializationInfo, StreamingContext)` constructor — it raises **`SYSLIB0051`** on .NET 10.",
        "The justification test: create a custom type only when a caller would **catch it specifically**, when you need to attach **structured domain data**, or when **wrapping** lower-level errors at a boundary. Otherwise reuse a built-in.",
        "Reuse `ArgumentException` / `ArgumentNullException` / `ArgumentOutOfRangeException` for argument problems and `InvalidOperationException` for wrong-state problems; never throw reserved runtime types (`NullReferenceException`, `IndexOutOfRangeException`, etc.).",
        "Add **read-only properties** for the data handlers will inspect (model `FileNotFoundException.FileName`), declare them `string?` if the standard constructors leave them unset (CS8618 under NRT), and still put a clear human-readable summary in the base `Message`.",
        "When wrapping, pass the original as the **`innerException`** argument (that's the parameter name — `inner:` won't compile) to preserve the cause, and throw before mutating state so a propagating exception leaves no partial side effects."
      ]
    }
  ]
};
