import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  "slug": "events",
  "number": 4,
  "title": "Events & the event Keyword",
  "objective": "Implement the publish/subscribe pattern with events and the event keyword, using EventHandler and EventHandler<T>.",
  "blocks": [
    {
      "kind": "lead",
      "text": "A delegate lets one piece of code call another. An **event** turns that into a broadcast: a publisher announces *\"this just happened\"* and any number of subscribers react — without the publisher knowing or caring who is listening. This is the **publish/subscribe** (observer) pattern, and the `event` keyword is C#'s built-in, encapsulation-safe way to do it."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor everything in the previous lesson: an event is *just a delegate field with a bouncer in front of it*. If students understood `Action`/`EventHandler` as 'a variable that holds methods', events are a 10-minute extension, not a new universe. Say that out loud to lower the anxiety.",
        "The single most important sentence: **only the declaring class can raise an event; outsiders can only `+=` and `-=`.** Everything else (the pattern, the `?.Invoke`, the EventArgs) is mechanics around that one rule. Drill the *why*, not just the syntax.",
        "Python students have no `event` keyword. Their closest mental model is a list of callbacks they append to and loop over by hand (`self._listeners.append(fn)`). The twoColumn block makes that bridge — lean on it.",
        "Do the memory-leak section slowly and with feeling. It is the #1 real bug they will hit in WPF/Blazor/WinForms/Unity, and it is the most common senior-interview follow-up. The trap is invisible: the code *works*, it just never frees memory.",
        "Live-demo the NullReferenceException from raising an event with zero subscribers, then fix it with `?.Invoke`. Seeing the crash makes the null-conditional idiom stick far better than asserting it.",
        "The `for` vs `foreach` capture difference is a favorite interview question and genuinely surprising. If short on time, you can cut the C# 14 lambda-modifier callout before you cut the closure section.",
        "Keep the standard event pattern (sender + EventArgs + protected virtual OnXxx) as the 'how professionals write it' payoff at the end. Don't open with the ceremony or you'll bury the simple idea.",
        "On the C# 14 callout: be explicit that `TryParse<T>` in the snippet is a *custom* delegate the author declared, not a BCL type. The takeaway is the language feature (modifiers no longer force explicit parameter types), not the specific delegate name."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "From callback to broadcast",
      "id": "callback-to-broadcast"
    },
    {
      "kind": "paragraph",
      "text": "In the last lesson you saw delegates — type-safe references to methods — and the built-in `Action`, `Func<>`, and `EventHandler` families. A single delegate is a **callback**: *\"here's a method, please call it.\"* But a delegate can hold **more than one** method at once (a **multicast** delegate). Add methods with `+=`, remove them with `-=`, and invoking the delegate calls every one of them, in subscription order."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "Action multi = () => Console.Write(\"A \");\nmulti += () => Console.Write(\"B \");\nmulti += () => Console.Write(\"C \");\nmulti();          // invokes all three, in subscription order",
      "filename": "Multicast.cs"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "A B C "
    },
    {
      "kind": "paragraph",
      "text": "That \"one notification, many listeners\" shape is exactly the **publish/subscribe** pattern. So why not just expose a public `Action` field and let callers `+=` to it? Because a public field gives away **too much** control. Anyone could overwrite the whole list with `=` (wiping out other subscribers), set it to `null`, or — worst of all — **raise** it themselves, firing a fake notification as if they were the publisher. The `event` keyword exists to slam that door shut."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The event keyword: a delegate field with a bouncer",
      "id": "the-event-keyword"
    },
    {
      "kind": "paragraph",
      "text": "Declaring a field as an `event` keeps the delegate underneath but restricts what **outside** code can do with it. From outside the declaring class, the **only** legal operations are `+=` (subscribe) and `-=` (unsubscribe). You cannot assign with `=`, you cannot read it, and you cannot invoke it. **Only the class that declares the event can raise it.** That asymmetry — many can listen, only the owner can announce — is the entire reason `event` is a keyword. Here is the smallest meaningful publisher:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CountdownTimer.cs",
      "code": "var timer = new CountdownTimer();\ntimer.Finished += (sender, e) => Console.WriteLine(\"Beep! Countdown finished.\");\ntimer.Run(3);\n\npublic class CountdownTimer\n{\n    // No data to pass -> plain EventHandler; the payload is EventArgs.Empty.\n    public event EventHandler? Finished;\n\n    public void Run(int seconds)\n    {\n        for (int s = seconds; s > 0; s--)\n            Console.WriteLine($\"...{s}\");\n        Finished?.Invoke(this, EventArgs.Empty);   // raise it (only this class can)\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "...3\n...2\n...1\nBeep! Countdown finished."
    },
    {
      "kind": "paragraph",
      "text": "The **publisher** is `CountdownTimer`: it owns the `Finished` event and is the only thing that can raise it (inside `Run`). The **subscriber** is the lambda in top-level code that prints `Beep!`. The timer has no idea what the subscriber does — it just announces \"I finished\" and moves on. Swap the subscriber for code that plays a sound, logs to a file, or sends a push notification, and the timer never changes. That decoupling is the whole point."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Try it: prove the bouncer is real",
      "text": "From the top-level code above, try writing `timer.Finished = null;` or `timer.Finished(timer, EventArgs.Empty);`. Both **fail to compile** — outside the declaring class an event isn't assignable or invokable, only `+=` / `-=` are allowed. Now move the same `Finished(this, EventArgs.Empty)` line *inside* a method of `CountdownTimer` and it compiles. That contrast is the entire `event` keyword in one experiment: the compiler, not a convention, enforces who may raise."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python: a hand-rolled listener list",
          "items": [
            "No language keyword for events. You keep a list yourself: `self._on_finished = []`.",
            "Subscribe by appending: `timer._on_finished.append(callback)` — but that list is usually **public**, so anyone can clear it or fire it.",
            "Raise by looping by hand: `for cb in self._on_finished: cb()`. Forgetting the empty-list check, deduping, and teardown is all on you.",
            "Libraries like `blinker` or Qt signals add structure, but it isn't part of the core language."
          ]
        },
        {
          "title": "C#: the event keyword does it for you",
          "items": [
            "`public event EventHandler? Finished;` declares the whole pub/sub channel in one line.",
            "Outsiders are **restricted by the compiler** to `+=` / `-=`. They cannot overwrite, read, or raise it.",
            "Multicast + null-safety are built in: `Finished?.Invoke(this, e)` calls every subscriber, or does nothing if there are none.",
            "Standardized signature (`object? sender, EventArgs e`) means every event in .NET — UI clicks, file watchers, your own domain events — looks the same."
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Subscribing: methods and lambdas, += and -=",
      "id": "subscribing"
    },
    {
      "kind": "paragraph",
      "text": "A subscriber is any method whose signature matches the event's delegate. You attach it with `+=` and detach it with `-=`. You can subscribe a **named method** (handy because you keep a reference to it, which you'll need to unsubscribe later) or an inline **lambda** (concise, but harder to remove — more on that danger soon). Let's build a thermostat that broadcasts temperature changes to multiple independent subscribers, then watch one leave."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Thermostat.cs",
      "code": "var thermostat = new Thermostat();\n\n// Subscribe with a named method AND a lambda.\nthermostat.TemperatureChanged += OnTempChanged;\nthermostat.TemperatureChanged += (sender, e) =>\n    Console.WriteLine($\"  [lambda] reading is now {e.NewTemperature}C\");\n\nthermostat.SetTemperature(21.5);\nthermostat.SetTemperature(19.0);\n\n// Unsubscribe the named handler; the lambda stays.\nthermostat.TemperatureChanged -= OnTempChanged;\nConsole.WriteLine(\"-- unsubscribed OnTempChanged --\");\nthermostat.SetTemperature(23.0);\n\nvoid OnTempChanged(object? sender, TemperatureChangedEventArgs e)\n    => Console.WriteLine($\"  [method] changed from {e.OldTemperature}C to {e.NewTemperature}C\");"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Thermostat set to 21.5C\n  [method] changed from 20C to 21.5C\n  [lambda] reading is now 21.5C\nThermostat set to 19C\n  [method] changed from 21.5C to 19C\n  [lambda] reading is now 19C\n-- unsubscribed OnTempChanged --\nThermostat set to 23C\n  [lambda] reading is now 23C"
    },
    {
      "kind": "paragraph",
      "text": "Read the last block of output. After `-= OnTempChanged`, the third change fires **only** the lambda — the named method is gone. Each subscriber is independent: removing one never affects the others. Notice too that subscribers run in the order they subscribed (`[method]` before `[lambda]`), and the publisher's own `Console.WriteLine(\"Thermostat set to...\")` happens *before* it raises the event. That ordering — do your work, *then* announce it — is deliberate and important."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why the temperatures print as 20, not 20.0",
      "text": "The output shows `20C`, `21.5C`, `19C` — not `20.0C`. That's just how `double` formats in an interpolated string: `double` has no notion of trailing zeros, so `$\"{20.0}\"` produces `\"20\"` while `$\"{21.5}\"` keeps the `.5`. (Compare `decimal`, used for money later, which *does* preserve scale — `$\"{12.00m}\"` prints `12.00`.) If you ever need a fixed look, format explicitly: `$\"{value:F1}C\"` always yields one decimal place, e.g. `20.0C`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The standard pattern: EventHandler and EventHandler<TEventArgs>",
      "id": "standard-pattern"
    },
    {
      "kind": "paragraph",
      "text": "You may have noticed every handler takes `(object? sender, SomethingEventArgs e)`. That is the **standard .NET event pattern**, and following it is what makes your events feel native to anyone who has touched the framework. The rules: use `EventHandler` when there's no data to send, and `EventHandler<TEventArgs>` when there is; the **sender** is the publisher (`this` when you raise it); the **e** carries the payload as a class deriving from `EventArgs`. And you wrap the raise in a `protected virtual void OnXxx(...)` method so subclasses can extend or intercept it. Here is the thermostat written the professional way:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Thermostat.cs",
      "code": "// 1) Immutable payload deriving from EventArgs.\npublic class TemperatureChangedEventArgs(double oldTemp, double newTemp) : EventArgs\n{\n    public double OldTemperature { get; } = oldTemp;\n    public double NewTemperature { get; } = newTemp;\n}\n\npublic class Thermostat\n{\n    private double _current = 20.0;\n\n    // 2) The event, typed with EventHandler<T>. Nullable: it's null with zero subscribers.\n    public event EventHandler<TemperatureChangedEventArgs>? TemperatureChanged;\n\n    public void SetTemperature(double value)\n    {\n        if (value == _current) return;          // nothing changed -> don't announce\n        var args = new TemperatureChangedEventArgs(_current, value);\n        _current = value;\n        Console.WriteLine($\"Thermostat set to {value}C\");\n        OnTemperatureChanged(args);             // 3) raise via the protected virtual method\n    }\n\n    // 4) Raiser: protected (subclasses may extend), virtual (they may override), safe (?.Invoke).\n    protected virtual void OnTemperatureChanged(TemperatureChangedEventArgs e)\n        => TemperatureChanged?.Invoke(this, e);\n}"
    },
    {
      "kind": "paragraph",
      "text": "Why the ceremony? **Consistency and extensibility.** Because every event in .NET looks like this, a developer who has never seen your `Thermostat` can subscribe to it correctly on the first try. The `sender` lets one handler serve many publishers and still know who fired (`if (sender is Thermostat t) ...`). The immutable `EventArgs` payload means one subscriber can't secretly mutate data that a later subscriber will read. And the `protected virtual OnTemperatureChanged` gives a subclass a single, clean override point — the textbook reason it isn't just inlined into `SetTemperature`."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: raising an event with no subscribers throws",
      "text": "An event with zero subscribers is **`null`**, not an empty list. So calling it directly — `TemperatureChanged(this, e);` — throws a `NullReferenceException` the moment nobody is listening. This bites beginners hard because their first test usually *has* a subscriber, so it works… until production code raises the event before anyone subscribes. The fix is the **null-conditional invoke**: `TemperatureChanged?.Invoke(this, e);`. The `?.` skips the call entirely when the delegate is null, and — bonus — it evaluates the delegate exactly once into a temporary before invoking, which is the thread-safe way to raise (a subscriber unsubscribing on another thread can't turn it null mid-call). **Always raise with `?.Invoke`.**"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Delegates vs events: when to use which",
      "id": "delegates-vs-events"
    },
    {
      "kind": "paragraph",
      "text": "Both are built on delegates, so when do you reach for a raw delegate (or `Func<>`/`Action<>`) versus an `event`? Microsoft's heuristic is clean: use a **delegate (callback)** when your code *must* call the supplied method to do its job, or needs a **return value** — a sort comparer, a LINQ `Where` predicate, a retry policy. Use an **event** when the work completes **whether or not anyone is listening**, and you don't care about a return value — progress reports, state changes, notifications. A `List<T>.Sort(comparison)` *needs* its comparer; a thermostat changes temperature *regardless* of who's subscribed. That's the tell."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Reach for a delegate / Func / Action",
          "items": [
            "Your method **must** call it to function (a `Sort` comparer, a LINQ predicate, a key selector).",
            "You need the **return value** (events are `void`; a `Func<>` isn't).",
            "Exactly **one** callback, supplied at the call site — `list.Find(x => x.IsActive)`.",
            "It's a **strategy** injected into behavior: `RetryPolicy(Func<Task> action)`."
          ]
        },
        {
          "title": "Reach for an event",
          "items": [
            "The work **happens anyway**; subscribers are optional observers (a price changed, a download finished).",
            "**Many** independent listeners may react, added and removed over time.",
            "You want compiler-enforced encapsulation: outsiders can only `+=` / `-=`, never raise.",
            "It models a real-world **notification**: `OrderPlaced`, `Click`, `PropertyChanged`."
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Events in real systems: a domain notification",
      "id": "real-world"
    },
    {
      "kind": "paragraph",
      "text": "The thermostat is a toy; the pattern is not. In a real backend, an `OrderService` raises an `OrderPlaced` event, and completely separate subsystems — email confirmations, inventory reservation, analytics, audit logging — subscribe and react **independently**. The order service has zero knowledge of email or inventory. Add a fraud-check subscriber next quarter and `OrderService` doesn't change a line. This is how domain events keep large systems decoupled, and it scales straight up into tools like MediatR notifications and message-bus handlers."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "OrderService.cs",
      "code": "var orders = new OrderService();\n\nvoid SendEmail(object? sender, OrderPlacedEventArgs e)\n    => Console.WriteLine($\"EMAIL: confirmation for order {e.OrderId} (${e.Total})\");\nvoid UpdateInventory(object? sender, OrderPlacedEventArgs e)\n    => Console.WriteLine($\"INVENTORY: reserve stock for order {e.OrderId}\");\n\norders.OrderPlaced += SendEmail;\norders.OrderPlaced += UpdateInventory;\norders.Place(\"A-100\", 49.99m);\n\norders.OrderPlaced -= UpdateInventory;        // inventory subscriber leaves\norders.Place(\"A-101\", 12.00m);\n\npublic class OrderPlacedEventArgs(string orderId, decimal total) : EventArgs\n{\n    public string OrderId { get; } = orderId;\n    public decimal Total { get; } = total;\n}\n\npublic class OrderService\n{\n    public event EventHandler<OrderPlacedEventArgs>? OrderPlaced;\n\n    public void Place(string orderId, decimal total)\n    {\n        Console.WriteLine($\"Placing order {orderId}...\");\n        // ... persist the order to the database ...\n        OrderPlaced?.Invoke(this, new OrderPlacedEventArgs(orderId, total));\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Placing order A-100...\nEMAIL: confirmation for order A-100 ($49.99)\nINVENTORY: reserve stock for order A-100\nPlacing order A-101...\nEMAIL: confirmation for order A-101 ($12.00)"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "One subscriber can break all the others — events are synchronous",
      "text": "Raising an event runs every subscriber **on the calling thread, one after another**. If `SendEmail` throws, the exception propagates straight back out of `OrderPlaced?.Invoke(...)` and `UpdateInventory` — subscribed *after* it — never runs, even though it had nothing to do with email. The publisher also blocks until the slowest handler returns. In real systems this is why heavy or failure-prone work in a handler is usually offloaded (queue a message, start a background task) rather than done inline, and why robust publishers sometimes wrap the raise so one bad subscriber can't sink the rest. Mention it now; you'll feel the pain later if you don't."
    },
    {
      "kind": "examples",
      "intro": "You'll meet event-driven code constantly — it isn't an academic pattern. A few places it shows up in professional .NET:",
      "examples": [
        {
          "label": "Desktop UI (WPF / WinForms): control events",
          "code": "// button.Click and textBox.TextChanged are EventHandler events.\nsaveButton.Click += (sender, e) => SaveDocument();\nsearchBox.TextChanged += (sender, e) => RefreshResults();"
        },
        {
          "label": "Blazor / web UI: EventCallback",
          "code": "// @onclick=\"Increment\" binds a delegate; child->parent uses EventCallback<T>.\n[Parameter] public EventCallback<int> OnCountChanged { get; set; }\nprivate async Task Increment() => await OnCountChanged.InvokeAsync(++_count);"
        },
        {
          "label": "Unity / game dev: decoupled gameplay messaging",
          "code": "// A static event any system can listen to (watch the lifetime — see leaks below).\npublic static event Action<int>? ScoreChanged;\nvoid AddPoints(int n) { _score += n; ScoreChanged?.Invoke(_score); }"
        },
        {
          "label": "Async progress reporting: IProgress<T> is event-style",
          "code": "// Progress<T> raises a callback on the captured context as work proceeds.\nIProgress<int> progress = new Progress<int>(pct => Console.WriteLine($\"{pct}%\"));\nawait DownloadAsync(progress);"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The #1 real bug: forgetting to unsubscribe",
      "id": "memory-leaks"
    },
    {
      "kind": "paragraph",
      "text": "Here is the most important practical lesson in this whole topic, and the one that separates juniors from seniors. **When you `+=` a handler, the publisher stores a reference to your subscriber.** If the publisher lives a long time (a singleton service, a static event, a long-lived view-model) and the subscriber was supposed to be short-lived (a UI page, a request-scoped object), that stored reference keeps the subscriber — *and everything it references* — alive forever. The garbage collector can't reclaim it. The code still works perfectly; it just leaks memory, slowly, until something falls over."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: -= only removes an EQUAL delegate",
      "text": "`publisher.Event -= handler` removes a subscriber **only if it compares equal** to one already subscribed. With a **named method**, that's easy — you have the same method reference. With a **lambda**, it's a trap: `Event += (s, e) => ...; Event -= (s, e) => ...;` does **nothing**, because those are two *different* lambda instances that merely look alike. The unsubscribe silently fails and the leak persists. **If you'll ever need to unsubscribe, use a named method (or store the lambda in a field) so you have a stable reference for `-=`.**"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Leak-vs-fix.cs",
      "code": "// LEAK: PriceTicker is a long-lived service; this view subscribes and never leaves.\npublic class PriceView\n{\n    public PriceView(PriceTicker ticker) => ticker.PriceChanged += OnPriceChanged;\n    private void OnPriceChanged(object? s, decimal e) { /* update UI */ }\n    // No way out: the ticker holds this PriceView alive forever.\n}\n\n// FIX: tie the subscription's lifetime to the subscriber's lifetime via IDisposable.\npublic sealed class PriceView2 : IDisposable\n{\n    private readonly PriceTicker _ticker;\n    public PriceView2(PriceTicker ticker)\n    {\n        _ticker = ticker;\n        _ticker.PriceChanged += OnPriceChanged;     // named method -> removable\n    }\n    private void OnPriceChanged(object? s, decimal e) { /* update UI */ }\n    public void Dispose() => _ticker.PriceChanged -= OnPriceChanged;   // always unsubscribe\n}"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: every += deserves a matching -=",
      "text": "Pair every subscription with an unsubscription, and tie its lifetime to the subscriber's lifetime — `-=` in `Dispose()`, in a Blazor component's `Dispose`/teardown, in a WinForms `FormClosed`, or in a Unity `OnDestroy`. Prefer **named methods** for handlers you'll remove (you need a stable reference for `-=` to match). For genuinely long-lived publishers where you can't control subscriber lifetime, reach for the **weak event pattern**. This one discipline prevents the most common managed-memory leak in real .NET apps, and \"why do event subscriptions cause leaks, and how do you prevent them?\" is a perennial interview question — now you can answer it cold."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A closures gotcha that rides along: for vs foreach",
      "id": "closure-capture"
    },
    {
      "kind": "paragraph",
      "text": "Because handlers are so often lambdas, one closure trap is worth knowing — it's a classic interview question and a real bug when wiring up handlers in a loop. A lambda **captures variables by reference**, not by value. A classic `for (int i = 0; ...)` loop has **one** `i` shared across all iterations, so every lambda you create sees its *final* value. A `foreach`, however, captures a **fresh** variable each iteration (this was fixed back in C# 5), so each lambda sees its own value."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "CaptureTrap.cs",
      "code": "var fromFor = new List<Action>();\nfor (int i = 0; i < 3; i++)\n    fromFor.Add(() => Console.Write(i + \" \"));   // all capture the SAME i\nConsole.Write(\"for loop:     \");\nforeach (var a in fromFor) a();\nConsole.WriteLine();\n\nvar fromForeach = new List<Action>();\nforeach (var n in new[] { 0, 1, 2 })\n    fromForeach.Add(() => Console.Write(n + \" \"));   // each captures a FRESH n\nConsole.Write(\"foreach loop: \");\nforeach (var a in fromForeach) a();\nConsole.WriteLine();"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "for loop:     3 3 3 \nforeach loop: 0 1 2 "
    },
    {
      "kind": "paragraph",
      "text": "The `for` loop prints `3 3 3` — every lambda closed over the *same* `i`, which ended at `3`. The `foreach` prints `0 1 2` as you'd expect. If you ever need per-iteration capture inside a `for`, copy to a local first: `int local = i;` and capture `local`. This is the kind of subtle bug that hides happily in event-wiring loops, so it pays to recognize the shape."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "C# 14 ergonomics worth a mention",
      "text": "Events and lambdas are mature features — C# 14 / .NET 10 only adds polish, not new paradigms. Two things you may meet: **(1) lambda parameters that carry a modifier (`ref`, `out`, `in`, `scoped`) no longer need an explicit type** — given your *own* delegate `delegate bool TryParse<T>(string s, out T result);`, you can now write `TryParse<int> p = (s, out r) => int.TryParse(s, out r);` and the compiler infers `r`'s type from the delegate (`TryParse<T>` here is a delegate *you* declared, not a BCL type). The lone exception: a `params` parameter still requires its explicit type. **(2) `partial` events** let a source generator declare an event in one file and implement its `add`/`remove` accessors in another — useful for ORMs and generators like EF, niche for everyday code. Learn the fundamentals first; treat these as nice-to-haves."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "An **event** is a delegate field with a bouncer: outside code can only `+=` (subscribe) and `-=` (unsubscribe); **only the declaring class can raise it**. That encapsulation is the whole reason `event` exists.",
        "Model: a **publisher** raises the event; any number of **subscribers** handle it, independently and in subscription order. Publisher and subscribers stay decoupled — the core of the publish/subscribe (observer) pattern.",
        "Follow the **standard pattern**: `EventHandler` (no data) or `EventHandler<TEventArgs>` (with an immutable `EventArgs`-derived payload), signature `(object? sender, TEventArgs e)`, raised through a `protected virtual void OnXxx(...)` method.",
        "**Always raise with `?.Invoke`** — an event with zero subscribers is `null`, so `Event(this, e)` throws a `NullReferenceException`; `Event?.Invoke(this, e)` null-checks and snapshots the delegate safely.",
        "Raising is **synchronous and single-threaded**: handlers run in order on the calling thread, and a throwing handler stops the ones after it — so keep handlers fast and consider offloading heavy or failure-prone work.",
        "**Delegate vs event:** use a delegate/`Func`/`Action` when your code *must* call the callback or needs a return value (sort comparer, LINQ predicate); use an event when the work happens regardless of listeners and returns nothing (notifications, progress, state changes).",
        "**Unsubscribe what you subscribe.** A long-lived publisher holds a reference to its subscribers, so forgetting `-=` leaks memory — the #1 real-world event bug. Tie subscription lifetime to object lifetime (`Dispose`, teardown) and use **named methods** so `-=` can match.",
        "Lambdas capture by **reference**: a `for` loop shares one variable (all closures see the final value), while `foreach` captures a fresh one per iteration. C# 14 adds minor ergonomics (typeless lambda modifiers, partial events) on top of these unchanged fundamentals."
      ]
    }
  ]
};
