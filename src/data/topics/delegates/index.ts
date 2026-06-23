import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';

export const delegates: Topic = {
  slug: "delegates",
  title: "Delegates, Events & Lambdas",
  subtitle: "Treat methods as values, write the lambda expressions LINQ is built on, and react to things happening with events — the functional backbone of modern C#.",
  status: 'unlocked',
  lessons: [
    {
      ...lesson01,
      questions: [
        {
          "id": "delegates-q1",
          "kind": "mcq",
          "prompt": "What is the most accurate description of a **delegate** in C#?",
          "options": [
            {
              "label": "A type-safe reference to a method (or methods) with a matching signature — essentially a typed function pointer",
              "correct": true
            },
            {
              "label": "A keyword that makes a method run on a background thread",
              "correct": false
            },
            {
              "label": "An interface that every class must implement to be callable",
              "correct": false
            },
            {
              "label": "A way to declare a variable whose type the compiler cannot check",
              "correct": false
            }
          ],
          "explanation": "A delegate is a **type** whose instances hold references to methods that share a specific signature (parameter types and return type). It's often called a type-safe function pointer: unlike Python, where you can pass any callable to `sort(key=fn)`, the C# compiler verifies at compile time that the method you assign matches the delegate's signature. Under the hood the compiler turns your `delegate` declaration into a sealed class deriving from `System.MulticastDelegate`."
        },
        {
          "id": "delegates-q2",
          "kind": "predict",
          "prompt": "A multicast `Func<int,int>` has two methods chained with `+=`. What does this print?",
          "code": "Func<int,int> a = x => x + 1;\na += x => x * 10;\nConsole.WriteLine(a(5));",
          "options": [
            {
              "label": "50",
              "correct": true
            },
            {
              "label": "6",
              "correct": false
            },
            {
              "label": "60",
              "correct": false
            },
            {
              "label": "56",
              "correct": false
            }
          ],
          "explanation": "This is a classic gotcha. When you invoke a multicast delegate, **all** methods run in subscription order, but for a delegate with a non-void return type, **only the last method's return value survives** — every earlier return value is silently discarded. Here both `x + 1` (→ 6) and `x * 10` (→ 50) execute, but only the last one, `5 * 10 = 50`, is returned. If you actually need every result, walk `a.GetInvocationList()` and invoke each method yourself."
        },
        {
          "id": "delegates-q11",
          "kind": "predict",
          "prompt": "This multicast `Action` runs three subscribers. What is printed (in what order)?",
          "code": "Action log = () => Console.Write(\"A\");\nlog += () => Console.Write(\"B\");\nlog += () => Console.Write(\"C\");\nlog();",
          "options": [
            {
              "label": "ABC",
              "correct": true
            },
            {
              "label": "CBA",
              "correct": false
            },
            {
              "label": "C",
              "correct": false
            },
            {
              "label": "A",
              "correct": false
            }
          ],
          "explanation": "Invoking a multicast delegate runs **every** method in its invocation list, in the **order they were subscribed**. Here `A`, then `B`, then `C` were added with `+=`, so they execute in that order, printing `ABC`. Because `Action` returns void, there's no return-value-discarding gotcha — every subscriber's side effect is observed. (Contrast with a non-void `Func`, where all methods still run but only the last return value is kept.) One caveat: if any subscriber throws, it aborts the rest of the list — wrap each call from `GetInvocationList()` in try/catch if you need isolation."
        }
      ],
      challenges: [
        {
          "id": "delegates-p1",
          "difficulty": "easy",
          "title": "Your First Delegate",
          "prompt": "Declare a custom delegate type named `MathOp` that takes two `int` parameters and returns an `int`.\nThen write two static methods, `Add(int a, int b)` and `Multiply(int a, int b)`, that match that signature.\nIn `Main`, create a `MathOp` variable, point it first at `Add`, invoke it with `7` and `5`, and print the result. Then reassign the same variable to `Multiply`, invoke it again with the same arguments, and print that result too.\nGoal: prove to yourself that a delegate is just a variable that holds a method, and that you can swap which method it points to at runtime.",
          "hints": [
            "Declare the delegate at namespace/class level: `delegate int MathOp(int a, int b);`",
            "Assign a method to a delegate by using its name with NO parentheses: `MathOp op = Add;`",
            "Invoke it like a normal call: `op(7, 5)` (or the explicit `op.Invoke(7, 5)`).",
            "In Python you'd just pass the function object around; here the compiler checks the signature matches the delegate type."
          ]
        },
        {
          "id": "delegates-p2",
          "difficulty": "easy",
          "title": "Multicast Notifications",
          "prompt": "You're building a tiny logging fan-out. Declare an `Action<string>` delegate variable named `log`.\nWrite three static methods that each take a `string message` and return `void`: `LogToConsole` (prints `Console: {message}`), `LogToFile` (prints `File: {message}` — pretend it writes to a file), and `LogToAudit` (prints `Audit: {message}`).\nSubscribe all three to `log` using `+=`, then invoke `log(\"User signed in\")` ONCE and observe that all three run, in subscription order.\nThen unsubscribe `LogToFile` using `-=`, invoke `log(\"User signed out\")`, and confirm only two run.\nGoal: understand multicast delegates — one invocation calls every subscribed method, and `+=`/`-=` add and remove them.",
          "hints": [
            "Start the chain with `log = LogToConsole;` then `log += LogToFile;` — or use `+=` from the start if `log` begins as null.",
            "Subscribers run in the order you added them.",
            "`-=` removes a method by matching the exact method reference."
          ]
        }
      ]
    },
    {
      ...lesson02,
      questions: [
        {
          "id": "delegates-q3",
          "kind": "mcq",
          "prompt": "You need a delegate that takes a `string` and an `int` and returns a `bool`. Which built-in generic delegate type expresses this with the least ceremony?",
          "options": [
            {
              "label": "`Func<string, int, bool>`",
              "correct": true
            },
            {
              "label": "`Action<string, int, bool>`",
              "correct": false
            },
            {
              "label": "`Predicate<string, int>`",
              "correct": false
            },
            {
              "label": "`Func<bool, string, int>`",
              "correct": false
            }
          ],
          "explanation": "`Func<...>` always lists its parameter types first and the **return type last**, so a function `(string, int) -> bool` is `Func<string, int, bool>`. `Action<...>` is only for delegates that return **void**, so it can't carry a `bool` result. `Predicate<T>` takes exactly **one** argument and returns `bool` (it's effectively `Func<T, bool>`), so it can't express two parameters. Prefer these built-ins over hand-rolled `delegate` types unless a named type genuinely improves readability or you need `ref`/`out` parameters, which `Func`/`Action` can't express."
        },
        {
          "id": "delegates-q4",
          "kind": "mcq",
          "prompt": "Which statement about `Func`, `Action`, and `Predicate<T>` is **correct**?",
          "options": [
            {
              "label": "`Action` returns void; `Func` returns a value; `Predicate<T>` is essentially `Func<T, bool>`",
              "correct": true
            },
            {
              "label": "`Action` returns a value; `Func` returns void",
              "correct": false
            },
            {
              "label": "`Predicate<T>` can take any number of arguments and return any type",
              "correct": false
            },
            {
              "label": "`Func` can express `ref` and `out` parameters, but `Action` cannot",
              "correct": false
            }
          ],
          "explanation": "`Action<...>` is for side-effecting callbacks that return **void** (e.g. logging). `Func<...,TResult>` returns a value. `Predicate<T>` is a specialized one-argument delegate returning `bool` — semantically identical to `Func<T, bool>` (LINQ standardized on `Func<T,bool>`, while older APIs like `List<T>.Find` and `List<T>.RemoveAll` use `Predicate<T>`). Note that **none** of these built-ins can express `ref`/`out` parameters — that's one of the few remaining reasons to declare your own `delegate` type."
        },
        {
          "id": "delegates-q13",
          "kind": "fill",
          "prompt": "Fill in the parameter type so this declares a delegate variable that takes two `int`s and returns their sum as an `int`.",
          "template": "___<int, int, int> add = (a, b) => a + b;",
          "accept": [
            "Func"
          ],
          "explanation": "`Func<int, int, int>` represents a method taking two `int` arguments and returning an `int` — remember that for `Func`, the **last** type parameter is always the return type and the rest are parameters. The lambda `(a, b) => a + b` is then assigned as a value of that delegate type. You'd use `Action` only if the method returned void."
        }
      ],
      challenges: [
        {
          "id": "delegates-p3",
          "difficulty": "easy",
          "title": "Func, Action, and Predicate Instead of Custom Types",
          "prompt": "Rewrite the idea of problem 1 WITHOUT declaring any custom delegate type. Use only the built-in generic delegates.\n1. Create a `Func<int, int, int> add = (a, b) => a + b;` and print `add(3, 4)`.\n2. Create an `Action<string> shout = msg => Console.WriteLine(msg.ToUpper());` and call `shout(\"hello\")`.\n3. Create a `Predicate<int> isEven = n => n % 2 == 0;` and print `isEven(10)` and `isEven(7)`.\nThen write one short comment explaining, in your own words, the difference between `Func`, `Action`, and `Predicate`.\nGoal: stop hand-rolling delegate types — reach for the BCL's three workhorses.",
          "hints": [
            "`Func<...,TResult>` returns a value; the LAST type argument is the return type.",
            "`Action<...>` returns void (no return type argument).",
            "`Predicate<T>` is just shorthand for `Func<T, bool>`.",
            "These come from `System`; no extra `using` needed in a top-level program."
          ]
        },
        {
          "id": "delegates-p4",
          "difficulty": "medium",
          "title": "A Tiny LINQ-Style Filter",
          "prompt": "Without using any `System.Linq` methods, write your own generic helper:\n`static List<T> Filter<T>(List<T> source, Predicate<T> keep)` that returns a new list containing only the items for which `keep(item)` is true.\nTest it against `var nums = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };`:\n- Filter to even numbers.\n- Filter to numbers greater than 5.\n- Filter to numbers that are both even AND greater than 5 (in a single predicate).\nPrint each resulting list. Then write a second test with `List<string>` of product names, keeping only names longer than 4 characters.\nGoal: see that `Where`-style filtering is nothing more than a method that accepts a predicate delegate — you just built a mini-LINQ.",
          "hints": [
            "Pass lambdas at the call site: `Filter(nums, n => n % 2 == 0)`.",
            "Combine conditions inside one lambda with `&&`: `n => n % 2 == 0 && n > 5`.",
            "`Console.WriteLine(string.Join(\", \", result))` prints a list cleanly.",
            "This is exactly the shape of the real `Enumerable.Where`, minus laziness."
          ]
        }
      ]
    },
    {
      ...lesson03,
      questions: [
        {
          "id": "delegates-q5",
          "kind": "predict",
          "prompt": "This loop adds three closures, then invokes them. What does it print?",
          "code": "var actions = new List<Func<int>>();\nfor (int i = 0; i < 3; i++)\n    actions.Add(() => i);\nConsole.WriteLine(string.Join(\",\", actions.Select(f => f())));",
          "options": [
            {
              "label": "3,3,3",
              "correct": true
            },
            {
              "label": "0,1,2",
              "correct": false
            },
            {
              "label": "1,2,3",
              "correct": false
            },
            {
              "label": "2,2,2",
              "correct": false
            }
          ],
          "explanation": "The infamous **loop-variable capture** trap. In a classic `for` loop, there is a single variable `i` that lives for the whole loop, and every lambda closes over that **same** variable by reference — not a per-iteration snapshot. By the time the closures run, the loop has finished and `i` holds its final value `3`, so all three print `3`. The fix is to copy into a fresh local inside the loop: `int local = i; actions.Add(() => local);`. Note this is specifically a `for`-loop problem — `foreach` was fixed in C# 5 to capture a fresh variable per iteration."
        },
        {
          "id": "delegates-q6",
          "kind": "predict",
          "prompt": "`foreach` was changed in C# 5. With that fix in place, what does this print?",
          "code": "var fns = new List<Func<int>>();\nforeach (var n in new[] { 10, 20, 30 })\n    fns.Add(() => n);\nConsole.WriteLine(string.Join(\",\", fns.Select(f => f())));",
          "options": [
            {
              "label": "10,20,30",
              "correct": true
            },
            {
              "label": "30,30,30",
              "correct": false
            },
            {
              "label": "0,0,0",
              "correct": false
            },
            {
              "label": "10,10,10",
              "correct": false
            }
          ],
          "explanation": "Since C# 5 (2012), the `foreach` iteration variable is treated as a **fresh variable on each iteration**, so each lambda captures its own distinct `n`. The closures therefore see `10`, `20`, and `30` respectively. This is the key contrast with a classic `for` loop, which still captures one shared variable. Knowing the difference between `for` (shared capture → final value) and `foreach` (per-iteration capture) is a favorite interview question."
        },
        {
          "id": "delegates-q7",
          "kind": "predict",
          "prompt": "This shows that lambdas capture variables by reference, not by value. What does it print?",
          "code": "int counter = 0;\nAction inc = () => counter++;\ninc();\ninc();\ninc();\nConsole.WriteLine(counter);",
          "options": [
            {
              "label": "3",
              "correct": true
            },
            {
              "label": "0",
              "correct": false
            },
            {
              "label": "1",
              "correct": false
            },
            {
              "label": "Compile error: cannot modify a captured variable",
              "correct": false
            }
          ],
          "explanation": "A C# closure captures the **variable itself**, not a value snapshot — the lambda and the surrounding code share the same storage. Each `inc()` call increments the captured `counter`, so after three calls it's `3`. Unlike Python, where a nested function needs `nonlocal` to rebind an outer variable, C# lambdas can freely read and mutate captured locals. The flip side: if you mutate the captured variable elsewhere after creating the lambda, the lambda sees the new value too — exactly the mechanism behind the `for`-loop capture trap."
        }
      ],
      challenges: [
        {
          "id": "delegates-p5",
          "difficulty": "medium",
          "title": "Closures and the Counter Factory",
          "prompt": "Write a static method `Func<int> MakeCounter(int start)` that returns a function. Each time the returned function is called, it should return the next number, starting from `start` and incrementing by 1.\nIn `Main`:\n- Create `var countA = MakeCounter(0);` and `var countB = MakeCounter(100);`.\n- Call `countA()` three times and `countB()` twice, printing each result.\n- Confirm the two counters are INDEPENDENT (A: 0,1,2 and B: 100,101).\nWrite a one-line comment explaining WHY each counter keeps its own state.\nGoal: understand a closure — the returned lambda captures and keeps alive the local variable, and each call to the factory gets its own captured variable.",
          "hints": [
            "Declare a local `int current = start;` inside `MakeCounter`, then return `() => current++;`.",
            "The lambda captures `current` by reference, not by value — it survives after the method returns.",
            "`current++` returns the value BEFORE incrementing; decide if that matches your expected output.",
            "Each call to `MakeCounter` creates a fresh `current`, so the two counters don't share state."
          ]
        },
        {
          "id": "delegates-p6",
          "difficulty": "medium",
          "title": "The Classic Loop-Capture Trap",
          "prompt": "Create `var actions = new List<Action>();`.\nPart A: Use a classic `for (int i = 0; i < 3; i++)` loop to add a lambda `() => Console.Write(i + \" \")` to the list on each iteration. After the loop, invoke every action in the list. Record what prints.\nPart B: Now do the SAME thing but with `foreach (var x in new[] { 0, 1, 2 })`, adding `() => Console.Write(x + \" \")`. Invoke them all and record what prints.\nPart C: Fix Part A so it prints `0 1 2` WITHOUT switching to `foreach`.\nIn comments, explain the difference between the two outputs and why C# 5 changed `foreach` behavior but not `for`.\nGoal: master the most-asked closure interview question — `for` captures one shared variable; `foreach` captures a fresh variable per iteration.",
          "hints": [
            "Part A prints `3 3 3` because every lambda closes over the SAME `i`, which equals 3 after the loop.",
            "Part B prints `0 1 2` because (since C# 5) `foreach` creates a fresh loop variable each iteration.",
            "Fix Part A by copying inside the loop: `int copy = i;` then capture `copy`.",
            "Invoke with `foreach (var a in actions) a();`."
          ]
        }
      ]
    },
    {
      ...lesson04,
      questions: [
        {
          "id": "delegates-q8",
          "kind": "mcq",
          "prompt": "Why does the `event` keyword exist when you could just expose a `public Action OnChanged;` field?",
          "options": [
            {
              "label": "`event` restricts outside code to only `+=` (subscribe) and `-=` (unsubscribe); only the declaring type can raise (invoke) it",
              "correct": true
            },
            {
              "label": "`event` makes the delegate automatically run asynchronously on a thread pool",
              "correct": false
            },
            {
              "label": "`event` lets external code overwrite the subscriber list with `=` for convenience",
              "correct": false
            },
            {
              "label": "`event` is required for any delegate that has more than one subscriber",
              "correct": false
            }
          ],
          "explanation": "An `event` is a restricted wrapper around a delegate field that enforces the publish/subscribe (observer) pattern. With a plain `public Action OnChanged;` field, **any** external code could overwrite it with `=` (wiping out other subscribers), null it, or raise it directly. The `event` keyword exposes only `add`/`remove` (`+=`/`-=`) to the outside world, while invocation stays private to the declaring type. That encapsulation is the entire reason `event` exists — multicast and multiple subscribers work fine with a plain delegate too."
        },
        {
          "id": "delegates-q9",
          "kind": "mcq",
          "prompt": "Which line correctly and **safely** raises a `public event EventHandler<OrderEventArgs>? OrderPlaced;` from inside its declaring class?",
          "options": [
            {
              "label": "`OrderPlaced?.Invoke(this, e);`",
              "correct": true
            },
            {
              "label": "`OrderPlaced(this, e);`",
              "correct": false
            },
            {
              "label": "`OrderPlaced.Invoke(e);`",
              "correct": false
            },
            {
              "label": "`this.OrderPlaced += (this, e);`",
              "correct": false
            }
          ],
          "explanation": "A delegate/event field is **null** when nobody has subscribed, so calling `OrderPlaced(this, e)` directly throws a `NullReferenceException` with zero subscribers. The null-conditional `OrderPlaced?.Invoke(this, e)` skips the call when null **and** takes a thread-safe snapshot of the invocation list. Note the signature: `EventHandler<T>` is `(object? sender, T e)`, so you must pass both `this` and the event-args payload — `Invoke(e)` alone won't compile. The conventional way to package this is a `protected virtual void OnOrderPlaced(OrderEventArgs e) => OrderPlaced?.Invoke(this, e);` raiser method."
        },
        {
          "id": "delegates-q10",
          "kind": "mcq",
          "prompt": "In a Blazor/WPF app a short-lived view subscribes to an event on a long-lived singleton service with `service.DataChanged += OnDataChanged;` but never unsubscribes. What's the real-world consequence?",
          "options": [
            {
              "label": "A managed memory leak: the service's delegate holds a strong reference to the view, keeping it (and its object graph) alive long after it should be collected",
              "correct": true
            },
            {
              "label": "Nothing — the garbage collector detects unused subscriptions and removes them automatically",
              "correct": false
            },
            {
              "label": "A compile error, because every `+=` must be paired with a `-=` in the same method",
              "correct": false
            },
            {
              "label": "The event stops firing for all other subscribers",
              "correct": false
            }
          ],
          "explanation": "This is the **#1 real-world delegate/event bug**. Subscribing creates a delegate that references the subscriber's instance method, so the long-lived publisher now holds a **strong reference** to the short-lived subscriber. The GC can't collect the view (or anything it references) while the service is alive, so memory grows every time a view is created and discarded. The fix is to always pair `+=` with `-=`, tying the unsubscribe to the component's lifetime (`Dispose`, `OnDisposed`, page teardown), or use a weak-event pattern. Prefer a named method over a lambda here, since you need a stable reference for `-=` to match."
        },
        {
          "id": "delegates-q14",
          "kind": "fill",
          "prompt": "Complete the **safe** way to raise an event named `Clicked` (an `EventHandler`) so it does nothing when there are no subscribers.",
          "template": "Clicked___Invoke(this, EventArgs.Empty);",
          "accept": [
            "?."
          ],
          "explanation": "The null-conditional operator `?.` makes this `Clicked?.Invoke(this, EventArgs.Empty)`. An event field is null when no one has subscribed, so a plain `Clicked.Invoke(...)` would throw a `NullReferenceException`. The `?.Invoke` form both null-checks and captures a thread-safe snapshot of the invocation list, which is why it's the idiomatic way to raise any event."
        }
      ],
      challenges: [
        {
          "id": "delegates-p7",
          "difficulty": "medium",
          "title": "Publish/Subscribe with the event Keyword",
          "prompt": "Model a simple thermostat using the standard .NET event pattern.\n- Create a class `TemperatureSensor` with a `public event EventHandler<TemperatureChangedEventArgs>? TemperatureChanged;`.\n- Define `TemperatureChangedEventArgs : EventArgs` carrying a `double Celsius` (make it immutable — set via constructor, get-only property).\n- Add a method `SetTemperature(double celsius)` that stores the value and raises the event SAFELY using `TemperatureChanged?.Invoke(this, new TemperatureChangedEventArgs(celsius))`. Use a `protected virtual void OnTemperatureChanged(...)` raiser method.\n- In `Main`, create a sensor and subscribe TWO handlers: one prints the new temperature, another prints `WARNING: too hot!` when Celsius > 30. Then call `SetTemperature` with 22, 28, and 35 and observe the output.\nGoal: implement publish/subscribe correctly — `EventHandler<T>`, a custom `EventArgs`, the `?.Invoke` null-safe raise, and the `protected virtual On...` raiser.",
          "hints": [
            "`EventHandler<T>` has the signature `(object? sender, T e)` — your handlers must match it.",
            "`?.Invoke` both null-checks (zero subscribers) and takes a thread-safe snapshot.",
            "Subscribe with `sensor.TemperatureChanged += (sender, e) => ...;`.",
            "Why `event` and not a public delegate field? It blocks outside code from raising or overwriting the subscriber list — only the sensor can fire it."
          ]
        },
        {
          "id": "delegates-p8",
          "difficulty": "hard",
          "title": "The Subscription Memory Leak",
          "prompt": "Demonstrate, then fix, the #1 real-world event bug: forgetting to unsubscribe.\n- Build a long-lived `NewsPublisher` with an event `public event Action<string>? StoryPublished;` and a `Publish(string headline)` method that raises it safely.\n- Build a `Subscriber` class that, in its constructor, takes the publisher and subscribes a NAMED handler method `OnStory(string headline)` (which prints `{Name} received: {headline}`). Give it a `Name`.\n- Make `Subscriber` implement `IDisposable`; in `Dispose()`, unsubscribe that same handler with `-=`.\nDriver: create the publisher, create a subscriber, publish a story (it prints). Then create a SECOND subscriber inside a `using` block (or call `Dispose` explicitly), publish again, and show that after disposal that subscriber no longer reacts.\nIn comments, explain why the publisher kept the subscriber alive before, and why you MUST subscribe a named method (not an inline lambda) for `-=` to work.\nGoal: connect events to lifetime management — pair every `+=` with a `-=`, and understand why a stable method reference is required to unsubscribe.",
          "hints": [
            "Store the publisher reference so `Dispose` can call `_publisher.StoryPublished -= OnStory;`.",
            "`-=` only removes a handler that compares EQUAL — an inline lambda creates a fresh, unmatchable instance, so keep a named method or a stored field.",
            "The leak: the publisher's delegate holds a strong reference to the subscriber, so the GC can't collect it until you unsubscribe.",
            "In long-lived apps (services, static events, UI pages) this is how memory quietly grows forever."
          ]
        }
      ]
    },
    {
      ...lesson05,
      questions: [
        {
          "id": "delegates-q12",
          "kind": "mcq",
          "prompt": "By Microsoft's heuristic, when should you choose a **delegate (callback)** parameter over an **event**?",
          "options": [
            {
              "label": "When your code MUST call the supplied method to do its job, or needs its RETURN value (e.g. a sort comparer or LINQ predicate)",
              "correct": true
            },
            {
              "label": "When you want multiple independent listeners to react to a notification that returns void",
              "correct": false
            },
            {
              "label": "When external code should be prevented from invoking the callback directly",
              "correct": false
            },
            {
              "label": "Whenever more than one method needs to be attached",
              "correct": false
            }
          ],
          "explanation": "The official guidance: use a **delegate/callback** when your method *must* invoke the supplied behavior to complete its work, or when you need a **return value** back — like `List<T>.Sort(comparison)`, a LINQ `Where` predicate, or a `Func<>` injected as a strategy. Use an **event** when the work proceeds **whether or not** anyone is listening and returns void — progress reports, `OrderPlaced`, `PropertyChanged`. Events also give you encapsulated invocation and natural multi-subscriber semantics, but a comparer or predicate is a *required input*, not a fire-and-forget notification."
        },
        {
          "id": "delegates-q15",
          "kind": "fill",
          "prompt": "New in C# 14: complete this lambda so it uses the `out` modifier **without** writing the parameter's explicit type (inferred from the delegate `TryParse<int>`).",
          "template": "TryParse<int> p = (s, out r) => int.TryParse(s, ___ r);",
          "accept": [
            "out"
          ],
          "explanation": "You pass the argument with `out r`, giving `int.TryParse(s, out r)`. The teaching point is the **lambda parameter list** `(s, out r)`: before C# 14, any parameter carrying `ref`/`out`/`in`/`scoped` forced you to also write its full type (`(string s, out int r)`). C# 14's *simple lambda parameters with modifiers* lets the type be inferred from the delegate signature while keeping the modifier — so `out r` is enough. (One limitation: `params` still requires the explicit type.)"
        },
        {
          "id": "delegates-q16",
          "kind": "mcq",
          "prompt": "You have a method `static T Retry<T>(Func<T> operation, Func<Exception, bool> shouldRetry)`. What does passing `shouldRetry` as a parameter let the **caller** control?",
          "options": [
            {
              "label": "The retry policy — the caller decides, as data, which exceptions are worth retrying without the helper hard-coding any rules",
              "correct": true
            },
            {
              "label": "Which thread the operation runs on",
              "correct": false
            },
            {
              "label": "Whether the return type `T` is a value type or a reference type",
              "correct": false
            },
            {
              "label": "The number of CPU cores the retry loop is allowed to use",
              "correct": false
            }
          ],
          "explanation": "This is the **strategy pattern expressed as data**. By accepting a `Func<Exception, bool>`, the `Retry` helper stays generic and the *policy* — which failures are transient and worth another attempt — is injected by the caller as a delegate. One caller might retry only `HttpRequestException`; another only `InvalidOperationException`. No interface, no subclass, no `if/else` ladder baked into the helper. This is exactly how resilience libraries and DI-configured policies are shaped in modern .NET: behavior in, behavior out."
        }
      ],
      challenges: [
        {
          "id": "delegates-p9",
          "difficulty": "hard",
          "title": "Strategy Pattern as Data: A Configurable Retry Helper",
          "prompt": "Modern C# often replaces small interfaces with a `Func`/`Action` parameter. Build a reusable retry helper that takes behavior as data.\nWrite: `static T Retry<T>(Func<T> operation, int maxAttempts, Func<Exception, bool> shouldRetry, Action<int, Exception>? onRetry = null)`.\nBehavior:\n- Try to run `operation()` and return its result on success.\n- If it throws, ask `shouldRetry(ex)` whether the exception is retryable. If yes AND attempts remain, call `onRetry(attemptNumber, ex)` (if provided) and try again. If no, OR attempts are exhausted, rethrow.\nTest it with a flaky operation: a local closure that throws an `InvalidOperationException(\"transient\")` on the first two calls and returns `\"OK\"` on the third (use a captured counter variable). Configure `shouldRetry` to retry only `InvalidOperationException`, and pass an `onRetry` lambda that prints `Attempt {n} failed: {message}`.\nThen run it again with a `shouldRetry` that returns false and confirm it rethrows immediately.\nGoal: pass behavior as data — strategy pattern via `Func`/`Action` with no interfaces, exactly how resilience and DI-configured policies are shaped in real .NET code.",
          "hints": [
            "Use the closure trick from problem 5 for the flaky operation: a captured `int calls = 0;` incremented inside the `Func<string>`.",
            "Loop attempts from 1 to `maxAttempts`; on the final attempt or a non-retryable exception, `throw;` (bare rethrow preserves the stack).",
            "`shouldRetry` lets the CALLER decide the policy — that's the strategy injected as data.",
            "The optional `onRetry` callback is a classic observability hook: log/notify between attempts without coupling the helper to a logger."
          ]
        },
        {
          "id": "delegates-p10",
          "difficulty": "hard",
          "title": "Robust Multicast: Return Values, Isolation, and an Inferred-Type Lambda",
          "prompt": "Investigate the sharp edges of multicast delegates and finish with a C# 14 ergonomics touch.\nPart A (return values): Declare `Func<int, int> pipeline`. Subscribe three lambdas: `x => x + 1`, `x => x * 10`, `x => x - 5`. Invoke `pipeline(3)` and print the result. Explain in a comment which subscriber's return value you got and why the others vanished.\nPart B (collecting all results): Using `pipeline.GetInvocationList()`, invoke EACH subscriber individually with input `3`, collect all three return values into a list, and print them.\nPart C (exception isolation): Add a fourth subscriber to a fresh `Action onEvent` chain where the SECOND subscriber throws. First show that a plain `onEvent()` stops the chain (later subscribers don't run). Then re-run by iterating `GetInvocationList()` and wrapping each call in try/catch so every subscriber gets a chance — print which ones ran and which threw.\nPart D (C# 14): Declare `delegate bool TryParse(string s, out int result);` and assign a lambda using the new C# 14 syntax that uses the `out` modifier WITHOUT the explicit type: `(s, out r) => int.TryParse(s, out r)`. Call it on `\"42\"` and `\"nope\"` and print both the bool and the parsed value.\nGoal: tie together the three multicast gotchas (only the last return value survives, one throw aborts the rest, GetInvocationList is the escape hatch) plus C# 14's inferred-type lambda parameter modifiers.",
          "hints": [
            "Part A: for a non-void multicast, only the LAST subscriber's return value is kept; the rest are silently discarded.",
            "`GetInvocationList()` returns `Delegate[]`; cast each element back to `Func<int,int>` (or `Action`) before invoking, e.g. `((Func<int,int>)d)(3)`.",
            "Part C: a thrown exception propagates out of the combined invoke and aborts remaining subscribers — try/catch per element isolates them.",
            "Part D: before C# 14 you had to write `(string s, out int r) => ...`; now the types are inferred from the delegate, but `params` would still require the explicit type."
          ]
        }
      ]
    }
  ],
  projects: [
  {
    "id": "delegates-proj-1",
    "difficulty": "starter",
    "title": "Pluggable Order-Pricing Engine with Func and Action",
    "brief": "Build a small console pricing engine for an e-commerce cart where each discount rule and notification is passed in as a delegate, so business logic is configured as data rather than hard-coded if/else branches. This mirrors how real .NET teams keep pricing rules swappable without recompiling the core engine.",
    "requirements": [
      "Model a `CartItem` record (Name, UnitPrice, Quantity) and a `List<CartItem>` representing a shopping cart.",
      "Declare at least three discount rules as `Func<decimal, decimal>` values (e.g. `subtotal => subtotal * 0.90m` for 10% off, a flat $5-off rule, and a free-shipping-threshold rule). Store them in a `List<Func<decimal, decimal>>`.",
      "Write a `CalculateTotal(IEnumerable<CartItem> cart, IEnumerable<Func<decimal,decimal>> rules)` method that computes the subtotal and then folds every rule over it in order, returning the final price.",
      "Use a `Predicate<CartItem>` (or `Func<CartItem,bool>`) to filter the cart, e.g. only items above a price threshold, and print which items qualified.",
      "Use an `Action<string>` named `log` for all user-facing output so the calling code decides where messages go (console now, file later) — demonstrate swapping it for a no-op `Action<string>` that suppresses output.",
      "Build a multicast `Action<decimal>` named `onCheckout` that subscribes two methods (e.g. `SendReceipt` and `UpdateLoyaltyPoints`); invoke it once and show both run in subscription order.",
      "Print the subtotal, each rule's effect, and the final total; the program must compile and produce deterministic output for a fixed sample cart."
    ],
    "stretch": [
      "Add a `-=` to remove one checkout subscriber before the final invoke and show the difference in output.",
      "Replace the `List<Func<...>>` with a strategy keyed by an `enum` discount tier, selecting the rule at runtime.",
      "Make the discount rules respect a maximum-discount cap so totals never go below a floor price.",
      "Add a `Func<CartItem, decimal>` line-item formatter so the receipt layout is itself injected as a delegate."
    ],
    "concepts": [
      "delegates",
      "Func",
      "Action",
      "Predicate",
      "multicast delegates",
      "method groups",
      "behavior-as-data",
      "strategy pattern"
    ]
  },
  {
    "id": "delegates-proj-2",
    "difficulty": "intermediate",
    "title": "Order Lifecycle Event Bus with the Standard .NET Event Pattern",
    "brief": "Implement a decoupled order-processing service that publishes domain events (OrderPlaced, OrderShipped, OrderCancelled) which independent subscribers — an email notifier, an inventory adjuster, and an audit logger — react to without the service knowing they exist. This is the observer/pub-sub backbone behind real systems like MediatR notifications and message-bus handlers.",
    "requirements": [
      "Define an immutable `OrderEventArgs : EventArgs` record-style payload (OrderId, CustomerEmail, Amount, Timestamp) so no subscriber can mutate state another subscriber will read.",
      "Create an `OrderService` that declares events using the standard pattern: `public event EventHandler<OrderEventArgs>? OrderPlaced;` (and shipped/cancelled), each raised through a `protected virtual void OnOrderPlaced(OrderEventArgs e)` method.",
      "Raise every event using the null-conditional thread-safe idiom `OrderPlaced?.Invoke(this, e);` and demonstrate that raising with zero subscribers does NOT throw.",
      "Implement three subscriber classes (EmailNotifier, InventoryService, AuditLogger) that subscribe with `+=` using named methods (not throwaway lambdas) so they can later unsubscribe.",
      "Make at least one subscriber `IDisposable` and have its `Dispose()` call `-=` to unsubscribe; demonstrate that after disposal it no longer receives events — explicitly framing this as the fix for the classic event memory leak.",
      "Demonstrate the failure-isolation gotcha: have one subscriber throw, show that with a plain raise the remaining subscribers are skipped, then re-raise by iterating `GetInvocationList()` with a try/catch per handler so the others still run.",
      "Use `EventHandler<T>` signatures `(object? sender, OrderEventArgs e)` throughout and print a clear, deterministic transcript of who reacted to each event."
    ],
    "stretch": [
      "Add a `CancelEventArgs`-style boolean on the payload so a subscriber can veto shipping (cooperative cancellation), and honor it in the service.",
      "Compare a delegate-based callback vs an event in code comments, justifying per Microsoft's heuristic (return value/required call -> delegate; fire-and-forget notification -> event).",
      "Introduce an `IProgress<int>` progress report during a simulated batch of orders to contrast event-style callbacks with progress reporting.",
      "Split `OrderService` across two files and declare one event as a C# 14 `partial event`, providing the implementation in the second file to mimic a source-generator scenario."
    ],
    "concepts": [
      "events",
      "event keyword",
      "EventHandler<T>",
      "EventArgs",
      "publish/subscribe",
      "observer pattern",
      "unsubscribe / memory leaks",
      "IDisposable",
      "GetInvocationList",
      "encapsulation"
    ]
  }
],
};
