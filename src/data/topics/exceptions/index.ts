import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';

export const exceptions: Topic = {
  slug: "exceptions",
  title: "Exception Handling",
  subtitle: "try, catch, finally, throw, using — detect, handle, and recover from failures the way production .NET code does, without swallowing bugs.",
  status: 'unlocked',
  lessons: [
    {
      ...lesson01,
      questions: [
        {
          "id": "exceptions-q1",
          "kind": "mcq",
          "prompt": "In C#, which keyword block actually **handles** an exception, and how do you tell it *which* exceptions it deals with?",
          "options": [
            {
              "label": "`except`, matching by the exception's string message",
              "correct": false
            },
            {
              "label": "`catch`, matching by the exception's **type**",
              "correct": true
            },
            {
              "label": "`rescue`, matching by error code",
              "correct": false
            },
            {
              "label": "`handle`, matching any exception unconditionally",
              "correct": false
            }
          ],
          "explanation": "C# uses `catch`, not Python's `except`. The crucial idea is that you catch **by type**: `catch (FormatException ex)` only runs for a `FormatException` (or a subclass). Every C# exception derives from `System.Exception`, so `catch (Exception)` catches everything. There is no `rescue`/`handle` keyword, and you should never match on `ex.Message` text — that's brittle and breaks under localization. Coming from Python, the mental swap is just `except` → `catch`; the type-based dispatch works the same way."
        },
        {
          "id": "exceptions-q2",
          "kind": "predict",
          "prompt": "An unhandled exception propagates up the call stack until a matching `catch` is found. Predict the output:",
          "code": "void Level3() => throw new InvalidOperationException(\"deep failure\");\nvoid Level2() => Level3();\nvoid Level1()\n{\n    try\n    {\n        Level2();\n    }\n    catch (InvalidOperationException ex)\n    {\n        Console.WriteLine($\"Caught in Level1: {ex.Message}\");\n    }\n}\n\nConsole.WriteLine(\"start\");\nLevel1();\nConsole.WriteLine(\"end\");",
          "options": [
            {
              "label": "start\\nCaught in Level1: deep failure\\nend",
              "correct": true
            },
            {
              "label": "start\\nend",
              "correct": false
            },
            {
              "label": "start\\nCaught in Level1: deep failure",
              "correct": false
            },
            {
              "label": "The program crashes with an unhandled InvalidOperationException",
              "correct": false
            }
          ],
          "explanation": "`Level3` throws, but neither `Level3` nor `Level2` has a `try/catch`, so the exception **propagates up the stack** — unwinding through `Level2` and into `Level1`, where the `try` surrounds the call. The `catch (InvalidOperationException)` matches, so `\"Caught in Level1: deep failure\"` prints. Because the exception was handled, execution continues normally and `\"end\"` prints. This is exactly like Python: the exception travels up frames until something catches it. The stack trace would still record that the throw originated in `Level3`."
        },
        {
          "id": "exceptions-q3",
          "kind": "predict",
          "prompt": "Catch blocks are tested **top to bottom**, and a base type placed before a type that derives from it makes the later clause unreachable. Predict the result:",
          "code": "try\n{\n    int n = int.Parse(\"not-a-number\");\n}\ncatch (SystemException)\n{\n    Console.WriteLine(\"system\");\n}\ncatch (FormatException)\n{\n    Console.WriteLine(\"format\");\n}",
          "options": [
            {
              "label": "system",
              "correct": false
            },
            {
              "label": "format",
              "correct": false
            },
            {
              "label": "system\\nformat",
              "correct": false
            },
            {
              "label": "This does not compile",
              "correct": true
            }
          ],
          "explanation": "`FormatException` derives from `SystemException` (the chain is `FormatException : SystemException : Exception`). Because the broader `catch (SystemException)` comes **first**, it would catch every `FormatException` too, making the later `catch (FormatException)` block **unreachable** — so the compiler rejects the program with **CS0160: *A previous catch clause already catches all exceptions of this or of a super type*.** Critically, CS0160 fires for **any** base type that appears before a derived one, not only `Exception` — `SystemException` before `FormatException` triggers it just the same. The fix is the usual rule: order catches **most-derived first** so the specific handler isn't shadowed by a broader one."
        }
      ],
      challenges: [
        {
          "id": "exceptions-p1",
          "difficulty": "easy",
          "title": "Parse User Input Without Crashing",
          "prompt": "You're prototyping a tiny console tool that asks the user for their age and prints how many years until they turn 100.\n\nWrite a program that:\n- Hardcodes a string variable `input` (start with `\"42\"`, then change it to `\"forty-two\"` to test).\n- Uses `int.Parse(input)` inside a `try` block to convert it to an `int`.\n- Catches a `FormatException` and prints `\"That wasn't a valid whole number.\"` instead of letting the program crash.\n- If parsing succeeds, prints `$\"You have {100 - age} years until you turn 100.\"`.\n\nRun it once with each input value and confirm both paths behave.\n\nThen answer in a comment at the bottom of your file: which `System.Exception`-derived type does `int.Parse` throw when given `\"forty-two\"`, and what would you see printed if you removed the try/catch entirely?",
          "hints": [
            "A `try` block holds the code that might fail; the `catch` block runs only if a matching exception is thrown.",
            "In Python you'd write `except ValueError`. In C# the keyword is `catch` and you catch by TYPE: `catch (FormatException ex)`.",
            "Without the try/catch, an unhandled exception prints the exception type, the message, and a stack trace, then terminates the program with a non-zero exit code."
          ]
        },
        {
          "id": "exceptions-p2",
          "difficulty": "easy",
          "title": "Which Catch Block Wins?",
          "prompt": "Exceptions propagate UP the call stack until something catches them, and the FIRST matching catch block wins.\n\nWrite a method `int Divide(int a, int b)` that simply returns `a / b`. In `Main`, call it inside a try block with TWO catch blocks in this order:\n- `catch (DivideByZeroException ex)` -> print `\"Cannot divide by zero.\"`\n- `catch (Exception ex)` -> print `$\"Something else went wrong: {ex.Message}\"`\n\nCall `Divide(10, 0)` and observe which block runs.\n\nNow part two: SWAP the two catch blocks so `catch (Exception ex)` comes FIRST. Try to compile. Record (in a comment) the exact compiler error you get and explain in one sentence WHY the order matters.\n\nFinally, restore the correct order and add a `Console.WriteLine` BEFORE the call and one AFTER the try/catch. Confirm the line after the call (but still inside try) does NOT print, while the line after the whole try/catch DOES.",
          "hints": [
            "`DivideByZeroException` derives from `ArithmeticException` which derives from `Exception`. Catch blocks must go most-derived to least-derived.",
            "Putting `catch (Exception)` first makes the specific catch unreachable — the C# compiler treats this as an error, not a silent bug like Python's except ordering.",
            "When an exception is thrown, the rest of the try block is abandoned — control jumps straight to the matching catch."
          ]
        },
        {
          "id": "exceptions-p3",
          "difficulty": "easy",
          "title": "Reading a Stack Trace",
          "prompt": "A stack trace is a map of how execution reached the failure. Learn to read one.\n\nBuild a 3-level call chain with top-level statements or methods:\n- `Main` calls `ProcessOrder()`\n- `ProcessOrder()` calls `ChargeCard()`\n- `ChargeCard()` calls `int.Parse(\"abc\")` (which throws)\n\nDo NOT catch anything yet — run it and let it crash. Copy the printed stack trace into a comment in your file.\n\nThen wrap the `Main`-level call in a try/catch for `Exception ex`, and print these three things on separate lines:\n- `ex.GetType().Name`\n- `ex.Message`\n- `ex.StackTrace`\n\nIn a closing comment, answer: reading top-to-bottom, which method is CLOSEST to where the exception was actually thrown, and which is furthest? How does the stack trace help you find the bug faster than just the message?",
          "hints": [
            "The topmost frame in a stack trace is where the exception originated; frames below show who called whom on the way down.",
            "`ex.GetType().Name` gives you the short type name like `FormatException`.",
            "The `at ... in File.cs:line N` lines tell you the exact file and line — start debugging at the top frame."
          ]
        }
      ]
    },
    {
      ...lesson02,
      questions: [
        {
          "id": "exceptions-q4",
          "kind": "predict",
          "prompt": "A `finally` block runs even when the `try` block returns. Predict the output:",
          "code": "int Compute()\n{\n    try\n    {\n        Console.WriteLine(\"in try\");\n        return 42;\n    }\n    finally\n    {\n        Console.WriteLine(\"in finally\");\n    }\n}\n\nConsole.WriteLine($\"result = {Compute()}\");",
          "options": [
            {
              "label": "in try\\nin finally\\nresult = 42",
              "correct": true
            },
            {
              "label": "in try\\nresult = 42\\nin finally",
              "correct": false
            },
            {
              "label": "in try\\nresult = 42",
              "correct": false
            },
            {
              "label": "in try\\nin finally\\nresult = 0",
              "correct": false
            }
          ],
          "explanation": "The `return 42` evaluates its value, but before control actually leaves the method the `finally` block runs — so the order is `\"in try\"`, then `\"in finally\"`, then the caller prints `result = 42`. `finally` runs in virtually all paths: normal completion, `return`, or an exception. (The rare exceptions are a hard process kill, `StackOverflowException`, or `Environment.FailFast`.) The return *value* (42) is already captured, so the `finally` doesn't change it — though you should never `return` from `finally` itself (analyzer CA2219), as that can swallow an in-flight exception. This mirrors Python's `try/finally`."
        },
        {
          "id": "exceptions-q5",
          "kind": "predict",
          "prompt": "`using` declarations dispose `IDisposable` resources deterministically, in **reverse** order of acquisition. Predict the output:",
          "code": "using System;\n\nProcess();\n\nstatic void Process()\n{\n    using var first = new Resource(\"DB connection\");\n    using var second = new Resource(\"File handle\");\n    Console.WriteLine(\"doing work\");\n}\n\nsealed class Resource(string name) : IDisposable\n{\n    public void Dispose() => Console.WriteLine($\"Disposing {name}\");\n}",
          "options": [
            {
              "label": "doing work\\nDisposing File handle\\nDisposing DB connection",
              "correct": true
            },
            {
              "label": "doing work\\nDisposing DB connection\\nDisposing File handle",
              "correct": false
            },
            {
              "label": "Disposing DB connection\\nDisposing File handle\\ndoing work",
              "correct": false
            },
            {
              "label": "doing work",
              "correct": false
            }
          ],
          "explanation": "A `using` **declaration** (`using var x = ...;`) disposes the resource when it goes out of scope — here, at the end of `Process()`. Multiple resources are disposed in **reverse (LIFO) order**: `second` (File handle) is disposed before `first` (DB connection), just like nested `using` blocks or a stack unwinding. So `\"doing work\"` prints first, then `Disposing File handle`, then `Disposing DB connection`. This disposal is guaranteed **even if an exception is thrown** in the body, which is why `using` is preferred over a hand-written `finally` for resources like `DbConnection`, `FileStream`, or HTTP response streams."
        }
      ],
      challenges: [
        {
          "id": "exceptions-p4",
          "difficulty": "medium",
          "title": "Guaranteed Cleanup with finally",
          "prompt": "You're writing a routine that acquires a scarce resource (imagine a lock or a network handle) and must ALWAYS release it, even if the work blows up.\n\nSimulate it without real I/O:\n- Write a method `void DoWork(bool shouldFail)`.\n- Print `\"Acquiring resource...\"` at the start.\n- In a `try` block, print `\"Doing work...\"`, then if `shouldFail` is true, `throw new InvalidOperationException(\"Work failed!\")`.\n- In a `finally` block, print `\"Releasing resource.\"`.\n\nIn `Main`, call `DoWork(false)` and `DoWork(true)` — wrap the failing call in a try/catch so the program doesn't crash. Confirm that `\"Releasing resource.\"` prints in BOTH cases.\n\nPart two: add a `return;` statement inside the `try` block (after the work, before any throw) for the success path. Does `finally` still run before the method returns? Verify it does, and note the result in a comment.\n\nPart three (thinking): name one rare situation where a `finally` block would NOT run, and write it as a comment.",
          "hints": [
            "`finally` runs whether the try block completes normally, returns early, or throws — it's the C# equivalent of Python's `finally`.",
            "The classic exceptions to 'finally always runs': a process-killing event like `Environment.FailFast`, a `StackOverflowException`, or the process being terminated by the OS.",
            "Order of output for the failing call: Acquiring -> Doing work -> Releasing -> (then the catch in Main runs)."
          ]
        },
        {
          "id": "exceptions-p5",
          "difficulty": "medium",
          "title": "From finally to using",
          "prompt": "Most real cleanup in .NET is for `IDisposable` resources, and the idiomatic tool is `using`, not a hand-written finally.\n\nStep 1 — build a disposable. Write a small class `FileLogger : IDisposable` that:\n- In its constructor takes a `string name`, stores it, and prints `$\"Opened {name}\"`.\n- Has a method `Write(string msg)` that prints `$\"[{name}] {msg}\"`.\n- Implements `Dispose()` to print `$\"Closed {name}\"`.\n\nStep 2 — consume it THREE ways and confirm all three print `Closed` deterministically:\n(a) A `try/finally` where you `new` the logger before the try and call `logger.Dispose()` in `finally`.\n(b) A classic `using (var logger = new FileLogger(\"b\")) { ... }` block.\n(c) A `using` DECLARATION: `using var logger = new FileLogger(\"c\");` at the top of a method, with no braces — and explain in a comment WHEN it gets disposed.\n\nStep 3 — inside one of the `using` blocks, `throw new Exception(\"boom\")` (catch it in Main). Confirm `Dispose()` STILL runs even though you threw.\n\nWrite a one-line comment: which of the three forms would you reach for in production code, and why?",
          "hints": [
            "A `using` statement is essentially a try/finally that calls `Dispose()` for you — less code, impossible to forget.",
            "A `using` declaration (no braces) disposes the resource at the end of the ENCLOSING scope (usually the method), in reverse order of declaration.",
            "Coming from Python, `using` is the direct analog of the `with` statement and context managers."
          ]
        }
      ]
    },
    {
      ...lesson03,
      questions: [
        {
          "id": "exceptions-q6",
          "kind": "mcq",
          "prompt": "Inside a `catch` block you've logged the error and want to **re-throw** it so a higher layer can handle it — without destroying the diagnostic trail to where it really came from. Which statement is correct?",
          "options": [
            {
              "label": "`throw ex;` — re-throws the caught exception",
              "correct": false
            },
            {
              "label": "`throw;` — re-throws and **preserves** the original stack trace",
              "correct": true
            },
            {
              "label": "`throw new Exception(ex.Message);` — the clean way to re-throw",
              "correct": false
            },
            {
              "label": "`return ex;` — passes the exception back to the caller",
              "correct": false
            }
          ],
          "explanation": "Bare `throw;` re-throws the **current** exception while **preserving the original stack trace**, so the trail still points to the real origin. `throw ex;` is the classic trap: it **resets** the stack trace to the current line, erasing where the problem actually started (analyzer CA2200 flags this — it's the single most damaging beginner mistake). `throw new Exception(ex.Message)` loses both the type *and* the original cause; if you genuinely want to add context, wrap it: `throw new OrderException(\"...\", inner: ex)`, which keeps the original as `InnerException`. And `return ex;` doesn't throw at all."
        },
        {
          "id": "exceptions-q7",
          "kind": "predict",
          "prompt": "Wrapping a low-level exception in a domain-specific one preserves the cause via `InnerException`. Predict the output:",
          "code": "try\n{\n    try\n    {\n        int x = int.Parse(\"oops\");\n    }\n    catch (FormatException ex)\n    {\n        throw new InvalidOperationException(\"Could not load config\", ex);\n    }\n}\ncatch (Exception ex)\n{\n    Console.WriteLine(ex.Message);\n    Console.WriteLine(ex.InnerException?.GetType().Name);\n}",
          "options": [
            {
              "label": "Could not load config\\nFormatException",
              "correct": true
            },
            {
              "label": "Could not load config\\nInvalidOperationException",
              "correct": false
            },
            {
              "label": "Could not load config\\n(prints nothing on the second line)",
              "correct": false
            },
            {
              "label": "FormatException\\nCould not load config",
              "correct": false
            }
          ],
          "explanation": "The inner `catch` wraps the `FormatException` in a new `InvalidOperationException`, passing the original as the second constructor argument — which becomes `InnerException`. The outer handler prints the *outer* message `\"Could not load config\"`, then `ex.InnerException?.GetType().Name`, which is the **original** `FormatException`. This wrap-with-context pattern (`throw new DomainException(msg, inner: ex)`) is everywhere in production: the caller gets a meaningful domain type *and* the root cause is preserved for diagnostics. This is C#'s equivalent of Python's `raise ... from err`."
        },
        {
          "id": "exceptions-q8",
          "kind": "fill",
          "prompt": "Fill in the modern .NET throw-helper that validates a reference argument is not null at the top of a method. It auto-captures the parameter name via `[CallerArgumentExpression]`, so you never hardcode (and mis-type) the name as a string.",
          "template": "public void Process(Order order)\n{\n    ArgumentNullException.___(order);\n    // ... rest of method\n}",
          "accept": [
            "ThrowIfNull",
            "ThrowIfNull(order)"
          ],
          "explanation": "`ArgumentNullException.ThrowIfNull(order)` (introduced in .NET 6) is the idiomatic guard clause: it throws an `ArgumentNullException` with `ParamName = \"order\"` if the argument is null. Because of `[CallerArgumentExpression(\"argument\")]`, the helper captures the literal expression `order` automatically — no `nameof()`, no hand-written `if (order is null) throw new ArgumentNullException(\"order\")` where the string can silently drift from the real parameter name. Its siblings include `ArgumentException.ThrowIfNullOrWhiteSpace`, and `ArgumentOutOfRangeException.ThrowIfNegativeOrZero`. Analyzers CA1510–CA1513 actively nudge you toward these."
        }
      ],
      challenges: [
        {
          "id": "exceptions-p6",
          "difficulty": "medium",
          "title": "throw; vs throw ex; — Don't Destroy the Evidence",
          "prompt": "This is the single most damaging beginner mistake in C# exception handling. You'll prove the difference to yourself.\n\nSet up a 2-level call chain:\n- `Main` calls `Level1()`\n- `Level1()` calls `Level2()`\n- `Level2()` does `throw new InvalidOperationException(\"deep failure\")`\n\nIn `Level1()`, wrap the call to `Level2()` in a try/catch. You'll run the program THREE times, each time using a different rethrow strategy in that catch, and each time printing `ex.StackTrace` from a catch in `Main`:\n1. `throw;`\n2. `throw ex;`\n3. `throw new ApplicationException(\"wrapped\", ex);` — and in Main, ALSO print `ex.InnerException?.Message`.\n\nCompare the three stack traces you captured (paste them into comments). Answer in comments:\n- Which option preserves the ORIGINAL line in `Level2` where the exception started?\n- What does `throw ex;` do to the stack trace, and why is that bad in production?\n- When wrapping (option 3), how do you still recover the root cause?\n\nNote: most analyzers flag `throw ex;` as warning CA2200 — mention that in your comment.",
          "hints": [
            "`throw;` rethrows the SAME exception object and preserves the full original stack trace.",
            "`throw ex;` resets the stack trace to the line of the throw, erasing where the problem actually started — a debugging nightmare.",
            "Wrapping with `new XException(msg, inner: ex)` adds context while keeping the original accessible via `InnerException`."
          ]
        },
        {
          "id": "exceptions-p8",
          "difficulty": "hard",
          "title": "Guard Clauses the .NET 10 Way",
          "prompt": "Production methods validate their arguments on the FIRST lines using throw-helpers, not hand-written if/throw. Modernize a method that does it the old way.\n\nHere is the legacy method to fix:\n\n```\nvoid RegisterUser(string username, string email, int age, List<string> roles)\n{\n    if (username == null) throw new ArgumentNullException(\"usernme\"); // note the typo!\n    if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException(\"email is required\");\n    if (age < 0) throw new ArgumentException(\"age cannot be negative\");\n    if (roles == null) throw new ArgumentNullException(\"roles\");\n    Console.WriteLine($\"Registered {username} ({email}), age {age}, {roles.Count} roles\");\n}\n```\n\nRewrite it using the .NET throw-helpers:\n- `ArgumentNullException.ThrowIfNull(...)` for `username` and `roles`.\n- `ArgumentException.ThrowIfNullOrWhiteSpace(...)` for `email`.\n- `ArgumentOutOfRangeException.ThrowIfNegative(...)` for `age`.\n\nThen call `RegisterUser` four times, each time tripping exactly one guard, and catch each exception in `Main` to print `$\"{ex.GetType().Name}: {ex.Message}\"`.\n\nIn comments, answer:\n- The legacy code passed the parameter name as a string and MISSPELLED it (`\"usernme\"`). How do the throw-helpers make that class of bug impossible? Name the attribute/mechanism involved.\n- Why are these throw-helpers preferred over the hand-written checks beyond just being shorter?",
          "hints": [
            "The throw-helpers use `[CallerArgumentExpression(\"argument\")]` to auto-capture the exact text of the argument you passed, so the parameter name in the message is always correct.",
            "`ArgumentException.ThrowIfNullOrWhiteSpace` is .NET 7+, the `ArgumentOutOfRangeException.ThrowIf*` family is .NET 8+ — all current in .NET 10.",
            "Beyond brevity: they centralize the message text, are well-optimized, and Roslyn analyzers CA1510-CA1513 actively nudge you toward them."
          ]
        }
      ]
    },
    {
      ...lesson04,
      questions: [
        {
          "id": "exceptions-q9",
          "kind": "mcq",
          "prompt": "You're defining a custom exception for a domain failure in an order-processing system. Which definition follows current (.NET 10) best practice?",
          "options": [
            {
              "label": "Derive from `ApplicationException`, and implement the `(SerializationInfo, StreamingContext)` constructor.",
              "correct": false
            },
            {
              "label": "Derive from `Exception`, name it `OrderProcessingException`, and provide the three standard constructors (parameterless, `(string)`, `(string, Exception)`).",
              "correct": true
            },
            {
              "label": "Derive from `SystemException`, since these are framework-level errors.",
              "correct": false
            },
            {
              "label": "Derive from `Exception` but only provide a parameterless constructor to keep it simple.",
              "correct": false
            }
          ],
          "explanation": "Modern guidance: derive directly from `Exception` (not `ApplicationException`, a historical dead-end, and not `SystemException`, which is reserved for runtime/BCL exceptions), end the name in `Exception`, and provide the **three standard constructors** — parameterless, `(string message)`, and `(string message, Exception innerException)` — so callers can wrap and chain. Add extra properties only when they're *programmatically useful* (model `FileNotFoundException.FileName`). Crucially, do **not** implement the old `(SerializationInfo, StreamingContext)` serialization constructor — `BinaryFormatter`-based exception serialization is obsolete in modern .NET. And before inventing a type at all, check whether a built-in like `InvalidOperationException` already fits."
        },
        {
          "id": "exceptions-q13",
          "kind": "predict",
          "prompt": "A custom exception carries domain data as a typed property, set through a dedicated constructor. Predict the output:",
          "code": "sealed class InsufficientFundsException(decimal requested, decimal available)\n    : Exception($\"Needed {requested}, only {available} available\")\n{\n    public decimal Requested { get; } = requested;\n    public decimal Available { get; } = available;\n}\n\ntry\n{\n    throw new InsufficientFundsException(150m, 40m);\n}\ncatch (InsufficientFundsException ex)\n{\n    Console.WriteLine($\"short by {ex.Requested - ex.Available}\");\n}",
          "options": [
            {
              "label": "short by 110",
              "correct": true
            },
            {
              "label": "short by 150",
              "correct": false
            },
            {
              "label": "Needed 150, only 40 available",
              "correct": false
            },
            {
              "label": "This does not compile because Exception has no such constructor",
              "correct": false
            }
          ],
          "explanation": "This is the whole point of a custom exception over a raw `Exception(\"not enough money\")`: the handler can inspect **typed, programmatically-useful data** rather than parse a string. The primary constructor passes a formatted message up to the base `Exception` and stores `Requested` (150) and `Available` (40) as read-only properties. The `catch` block reads them and prints `ex.Requested - ex.Available` = `150 - 40` = `110`, so `\"short by 110\"`. Model this on `FileNotFoundException.FileName`: only add a property when a `catch` block would genuinely want to inspect it — otherwise you've just renamed `Exception`."
        }
      ],
      challenges: [
        {
          "id": "exceptions-p7",
          "difficulty": "medium",
          "title": "A Domain-Specific Custom Exception",
          "prompt": "Built-in exceptions can't always express your business rules. You'll build a correct, idiomatic custom exception — and learn when NOT to.\n\nScenario: a bank account. Withdrawing more than the balance is a domain failure worth its own type.\n\nStep 1 — define `InsufficientFundsException`:\n- Derive from `Exception` (NOT `ApplicationException`).\n- Name ends in `Exception`.\n- Provide the THREE standard constructors: parameterless, `(string message)`, and `(string message, Exception inner)`.\n- Add TWO useful, programmatically-readable properties: `decimal Requested` and `decimal Available`, set via an extra constructor.\n\nStep 2 — write a class `Account` with a `decimal Balance` and a method `Withdraw(decimal amount)` that throws your custom exception when `amount > Balance`, populating `Requested` and `Available`.\n\nStep 3 — in `Main`, catch `InsufficientFundsException` specifically and print a friendly message using its typed properties, e.g. `$\"Declined: asked for {ex.Requested:C} but only {ex.Available:C} available.\"`.\n\nStep 4 (judgment) — in a comment, give one example where you should NOT create a custom exception and should reuse a built-in one instead (e.g., a null argument). Name the built-in type you'd use there.",
          "hints": [
            "Provide all three standard constructors so your exception behaves like a first-class BCL exception; the inner-exception ctor lets callers wrap lower-level causes.",
            "Do NOT derive from `ApplicationException` (a historical dead-end) and do NOT implement the obsolete `(SerializationInfo, StreamingContext)` serialization constructor — it no longer works in modern .NET.",
            "For a null argument you'd reuse `ArgumentNullException`; for an out-of-range value, `ArgumentOutOfRangeException`. Invent a custom type only when callers gain something from the new type or its extra properties."
          ]
        }
      ]
    },
    {
      ...lesson05,
      questions: [
        {
          "id": "exceptions-q10",
          "kind": "predict",
          "prompt": "An exception filter (`when` clause) decides **whether** to enter a catch block — without unwinding into it if the condition is false. Predict the output:",
          "code": "void Handle(int code)\n{\n    try\n    {\n        throw new HttpRequestException($\"status {code}\");\n    }\n    catch (HttpRequestException ex) when (code >= 500)\n    {\n        Console.WriteLine($\"retry: {ex.Message}\");\n    }\n    catch (HttpRequestException ex)\n    {\n        Console.WriteLine($\"give up: {ex.Message}\");\n    }\n}\n\nHandle(503);\nHandle(404);",
          "options": [
            {
              "label": "retry: status 503\\ngive up: status 404",
              "correct": true
            },
            {
              "label": "give up: status 503\\ngive up: status 404",
              "correct": false
            },
            {
              "label": "retry: status 503\\nretry: status 404",
              "correct": false
            },
            {
              "label": "This does not compile because two catches share the same type",
              "correct": false
            }
          ],
          "explanation": "Exception **filters** (`catch ... when (condition)`) let you have multiple catches of the *same type* distinguished by a runtime condition — this compiles fine. For `Handle(503)`, the first filter `when (code >= 500)` is true, so it prints `\"retry: status 503\"`. For `Handle(404)`, the first filter is false (the catch is **not** entered, so no stack unwinding happens there), and the second, unfiltered `catch` runs: `\"give up: status 404\"`. Real uses: retry only on transient 5xx, or `when (ex.StatusCode == HttpStatusCode.TooManyRequests)`. A filter decides *whether* to handle; it shouldn't decide *how*. It also preserves the stack better than re-throwing from inside an `if`."
        },
        {
          "id": "exceptions-q11",
          "kind": "mcq",
          "prompt": "A user can type anything into a quantity field, so invalid input is **expected**, not exceptional. Coming from Python's EAFP habit, what's the idiomatic C# approach for this hot/parsing path?",
          "options": [
            {
              "label": "Wrap `int.Parse(input)` in a try/catch and handle the `FormatException` — exceptions are cheap, like in Python.",
              "correct": false
            },
            {
              "label": "Use the Try-pattern: `if (int.TryParse(input, out int qty)) { ... }` — no exception is thrown for invalid input.",
              "correct": true
            },
            {
              "label": "Use `int.Parse` inside a `catch { }` that swallows everything so the app never crashes.",
              "correct": false
            },
            {
              "label": "Catch the base `Exception` type so you cover every possible parse error.",
              "correct": false
            }
          ],
          "explanation": "In .NET, exceptions are comparatively **expensive** and reserved for *genuinely exceptional* conditions — so for *expected* failures like bad user input, you use the **Try-pattern**: `int.TryParse` returns a `bool` and sets an `out` value, throwing nothing on failure. This is the key habit shift from Python's EAFP: don't reach for try/catch as your first tool. The same pattern appears as `decimal.TryParse`, `DateTime.TryParse`, and `Dictionary.TryGetValue`. An empty `catch { }` (swallowing) hides bugs, and catching base `Exception` here is both wasteful and too broad — catch the *narrowest* type you can actually handle, only when you truly can't avoid an exception."
        },
        {
          "id": "exceptions-q12",
          "kind": "fill",
          "prompt": "In an async method, you must validate arguments and throw **synchronously** — before the first `await` — otherwise the `ArgumentException` is buried in the returned `Task` and only surfaces far away when it's awaited. Also, for cancellation, fill in the **base** exception type you should catch (rather than the more specific `TaskCanceledException`).",
          "template": "try\n{\n    await DownloadAsync(url, token);\n}\ncatch (___ ex)\n{\n    Console.WriteLine(\"Operation was cancelled\");\n}",
          "accept": [
            "OperationCanceledException"
          ],
          "explanation": "Catch `OperationCanceledException`, the **base** type, not `TaskCanceledException`. `TaskCanceledException` *derives from* `OperationCanceledException`, so catching the base covers cancellation raised by `token.ThrowIfCancellationRequested()`, `Task.Delay(..., token)`, HTTP clients, and more — catching only the derived type silently misses many real cancellations. The prompt also flags a classic async pitfall: argument validation (e.g. `ArgumentNullException.ThrowIfNull`) must run **before the first `await`**, so an invalid-argument bug throws at the call site instead of being stored in the `Task` and only re-surfacing when the caller awaits it, far from where the mistake was made."
        }
      ],
      challenges: [
        {
          "id": "exceptions-p9",
          "difficulty": "hard",
          "title": "Exception Filters & the Try-Pattern: Catch Only What You Can Handle",
          "prompt": "Two production habits at once: (1) use exception FILTERS to handle only the cases you can actually deal with, and (2) prefer the Try-pattern over exceptions for EXPECTED failures.\n\nPart A — Exception filters with `when`:\nWrite a method `decimal FetchExchangeRate(int httpStatus)` that simulates an HTTP call by throwing `new HttpRequestException($\"HTTP {httpStatus}\", inner: null, statusCode: (HttpStatusCode)httpStatus)`. (You'll need `using System.Net;` and `using System.Net.Http;`.)\nIn `Main`, call it and use exception filters:\n- `catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.TooManyRequests)` -> print `\"Rate limited - will retry later.\"`\n- `catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)` -> print `\"No rate for that currency.\"`\n- Let any OTHER status (e.g. 500) PROPAGATE uncaught (don't add a broad catch).\nTest with 429, 404, and 500 and observe that 500 is intentionally NOT swallowed.\nIn a comment, explain how a `when` filter differs from putting an `if` INSIDE the catch body (hint: stack unwinding / whether the handler is entered).\n\nPart B — Try-pattern over exceptions:\nYou're given a list of user-supplied strings: `[\"10\", \"20\", \"oops\", \"40\"]`. Sum only the valid integers. Do it WITHOUT any try/catch, using `int.TryParse(s, out int n)`. Print the running result and skip invalid entries.\nIn a comment, explain why the Try-pattern is the idiomatic choice here, and contrast it with the Python EAFP instinct to wrap the parse in try/except.",
          "hints": [
            "An exception filter (`when (...)`) decides WHETHER to enter the catch before the stack unwinds; if it returns false, the exception keeps propagating with its stack intact — unlike an `if` inside the body, which has already entered (and must rethrow to continue).",
            "Invalid user input is EXPECTED, not exceptional — `int.TryParse` returns a bool and avoids the cost of throwing/catching on every bad row.",
            "Coming from Python you may reach for try/except by reflex (EAFP); idiomatic C# uses the Try-pattern (LBYL-ish) for predictable failures and reserves exceptions for the genuinely unexpected."
          ]
        },
        {
          "id": "exceptions-p10",
          "difficulty": "hard",
          "title": "Production Order Pipeline: Put It All Together",
          "prompt": "Interview-grade capstone. Build a small, realistic order-processing pipeline that exercises every habit from this topic. No web framework required — model it with classes and a console runner.\n\nRequirements:\n1. Custom exception: define `OrderProcessingException : Exception` with the three standard constructors plus a `string OrderId` property and a constructor that sets it. It will WRAP lower-level failures via InnerException.\n\n2. A `PaymentGateway` class with `void Charge(string orderId, decimal amount)` that:\n   - Validates arguments with throw-helpers: `ArgumentException.ThrowIfNullOrWhiteSpace(orderId)` and `ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount)`.\n   - Throws `new TimeoutException(\"Gateway timed out\")` when `amount > 1000` (simulating a flaky gateway).\n\n3. An `IDisposable` `AuditLog` (constructor prints `\"Audit opened\"`, `Dispose()` prints `\"Audit closed\"`, method `Record(string msg)` prints `$\"AUDIT: {msg}\"`).\n\n4. A method `void ProcessOrder(string orderId, decimal amount)` that:\n   - Opens the `AuditLog` with a `using` declaration so it's always closed.\n   - Records `\"start {orderId}\"`.\n   - Calls `gateway.Charge(...)` inside a try/catch. On `TimeoutException`, it must RE-THROW as `new OrderProcessingException($\"Failed to process order {orderId}\", inner: ex) { ... }` carrying the `OrderId` — preserving the original via InnerException (do NOT use `throw ex;`).\n   - Records `\"charged {orderId}\"` only on success.\n\n5. In `Main`, process THREE orders: a valid one (amount 50), one that times out (amount 5000), and one with a bad argument (amount 0 or whitespace orderId). For each, catch at the top level and print:\n   - `$\"{ex.GetType().Name} for order {orderId}: {ex.Message}\"`\n   - if `ex.InnerException` is not null, also print `$\"  caused by: {ex.InnerException.GetType().Name}: {ex.InnerException.Message}\"`.\n\nVerify in your output that: the `AuditLog` is closed for every order (success AND failure), the timeout surfaces as an `OrderProcessingException` whose InnerException is the original `TimeoutException`, and the bad-argument order fails fast at the guard clause before any charge.\n\nIn closing comments, answer two interview questions:\n- Why wrap the `TimeoutException` in a domain `OrderProcessingException` instead of letting it bubble raw, or instead of using `throw ex;`?\n- In a real ASP.NET Core .NET 10 API, where would this top-level catch logic actually live so you DON'T repeat try/catch in every endpoint? Name the interface and the middleware involved.",
          "hints": [
            "Use a `using` declaration for the `AuditLog` so disposal is guaranteed on every path, including the re-throw — confirm 'Audit closed' prints even when an exception propagates.",
            "Re-throw with `throw new OrderProcessingException(..., inner: ex)`; never `throw ex;` — you want the original `TimeoutException` preserved as `InnerException` with its stack trace intact.",
            "The ASP.NET Core answer: implement `IExceptionHandler` (introduced in .NET 8, preferred in .NET 10) registered via `AddExceptionHandler<T>()` + `app.UseExceptionHandler()`, typically paired with `AddProblemDetails()` to emit RFC 9457 ProblemDetails JSON — centralizing what you wrote in Main."
          ]
        }
      ]
    }
  ],
  projects: [
  {
    "id": "exceptions-proj-1",
    "difficulty": "starter",
    "title": "CSV Import Validator: From Crashing Parser to Resilient Loader",
    "brief": "Build a command-line tool that reads a messy CSV of product records (price, quantity, SKU) and loads them into memory, turning malformed rows into clear, actionable reports instead of crashes. This mirrors the real first task on any data-ingestion or import feature, where external input is never clean.",
    "requirements": [
      "Read a CSV file path from a command-line argument; if the file is missing, report it cleanly (do not let the raw exception bubble to the user) and exit with a non-zero code.",
      "Parse each row into a `Product` record with fields like `Sku` (string), `Price` (decimal), and `Quantity` (int).",
      "Use the **Try-pattern** (`decimal.TryParse`, `int.TryParse`) rather than try/catch for expected bad-data cases like a price of `\"N/A\"` or a quantity of `\"\"` — this is the core lesson: do not use exceptions for control flow on expected failures.",
      "Wrap genuinely unexpected I/O work (opening/reading the file) in a `try`/`catch` that catches the **narrowest meaningful type** (`FileNotFoundException`, `IOException`), never a bare `catch`.",
      "For each row, accumulate a list of validation problems (line number + reason) and print a summary at the end: how many rows imported successfully and a numbered list of the rows that were skipped and why.",
      "Demonstrate that you understand catch ordering by including at least one `try`/`catch` with multiple catch blocks ordered most-derived to least-derived, with a code comment explaining why the order is required.",
      "Use `ArgumentException.ThrowIfNullOrWhiteSpace` (or `ArgumentNullException.ThrowIfNull`) to guard the public method that takes the file path, demonstrating modern throw-helper guard clauses."
    ],
    "stretch": [
      "Add a `--strict` flag that makes the importer throw on the first bad row instead of accumulating problems, so you can compare the two error-handling strategies side by side.",
      "Print a faithful stack trace for one deliberately-triggered unexpected error and annotate (in comments or output) how to read it top-to-bottom to find the origin.",
      "Support multiple input files and aggregate the per-file import statistics into one final report.",
      "Emit the skipped-row report as a second CSV (an error file) so a non-technical user could fix and re-import."
    ],
    "concepts": [
      "try/catch",
      "catch ordering (most-derived to least-derived)",
      "Try-pattern (TryParse) vs exceptions",
      "narrow catch types",
      "FileNotFoundException / IOException",
      "guard clauses (ThrowIfNull / ThrowIfNullOrWhiteSpace)",
      "reading a stack trace",
      "exceptions vs expected control flow"
    ]
  },
  {
    "id": "exceptions-proj-2",
    "difficulty": "intermediate",
    "title": "Bank Transfer Service with a Global API Error Handler",
    "brief": "Build a small `MoneyTransferService` plus a minimal ASP.NET Core (.NET 10) Web API endpoint that moves funds between accounts, and wire up centralized error handling that turns domain failures into clean RFC 9457 ProblemDetails responses. This is exactly how production .NET services validate input, signal domain errors, and avoid try/catch sprawl across every endpoint.",
    "brief_note": "realistic backend slice",
    "requirements": [
      "Define at least one **custom exception** (e.g. `InsufficientFundsException`) that derives from `Exception` (NOT `ApplicationException`), ends in `Exception`, provides the three standard constructors, and carries a programmatically-useful property (e.g. `RequestedAmount` and `AvailableBalance`). Do NOT implement the obsolete `(SerializationInfo, StreamingContext)` constructor.",
      "Reuse built-in exception types where they fit: throw `ArgumentOutOfRangeException` (via `ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount)`) for an invalid transfer amount and `ArgumentNullException.ThrowIfNull` for null arguments — and write a short note in comments justifying when a custom exception is warranted versus reusing a built-in one.",
      "Make the transfer operation **state-safe under failure**: if the deposit step cannot complete, the prior withdrawal must not leave the system in an inconsistent state (order the operations so a thrown exception leaves balances unchanged, or roll back). Callers must be able to assume no partial side effects.",
      "Implement an `IExceptionHandler` (introduced in .NET 8, preferred in .NET 10) registered with `AddExceptionHandler<T>()` + `app.UseExceptionHandler()` + `AddProblemDetails()`, mapping each exception type to the correct HTTP status (e.g. `InsufficientFundsException` to 409 Conflict, `ArgumentException` family to 400) and emitting RFC 9457 ProblemDetails JSON. Endpoints themselves must contain NO try/catch.",
      "When wrapping a lower-level failure (e.g. a simulated data-access error), re-throw correctly: use a domain wrapper `throw new TransferFailedException(\"...\", inner: ex)` that preserves the original via `InnerException` — and include a comment contrasting `throw;` vs `throw ex;` and why `throw ex;` is wrong.",
      "Use structured logging in the exception handler, passing the exception object itself (`logger.LogError(ex, \"Transfer {TransferId} failed\", id)`) so the full stack trace is captured.",
      "Provide a few endpoint calls (or an HTTP file / integration test) demonstrating: a successful transfer, an insufficient-funds 409, and an invalid-amount 400, showing the ProblemDetails body each returns."
    ],
    "stretch": [
      "Add an **exception filter** (`catch ... when (...)`) somewhere in a transient-failure path so that only retryable errors (e.g. a simulated transient `TransferFailedException`) are retried, while non-transient ones propagate untouched.",
      "Add cancellation: thread a `CancellationToken` through an async transfer, call `token.ThrowIfCancellationRequested()` in a loop, and map `OperationCanceledException` (not `TaskCanceledException`) to HTTP 499/400 in the handler.",
      "Validate arguments synchronously before the first `await` in the async transfer method, and write a test proving the `ArgumentException` surfaces immediately rather than being buried in the returned Task.",
      "Chain a second `IExceptionHandler` and show that the first handler returning `true` short-circuits the chain.",
      "Use `ExceptionDispatchInfo.Capture/Throw` to stash and rethrow an exception across an async boundary without losing the original stack trace."
    ],
    "concepts": [
      "custom exceptions (derive from Exception, 3 constructors, useful properties)",
      "built-in vs custom exception choice",
      "throw-helpers (ThrowIfNull / ThrowIfNegativeOrZero)",
      "throw; vs throw ex; (stack-trace preservation)",
      "exception wrapping & InnerException",
      "IExceptionHandler + ProblemDetails (RFC 9457, .NET 10)",
      "mapping exceptions to HTTP status codes",
      "state-safety / no partial side effects on failure",
      "structured logging of exceptions",
      "exception filters (when)",
      "async exception semantics & OperationCanceledException",
      "ExceptionDispatchInfo"
    ]
  }
],
};
