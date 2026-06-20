import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  "slug": "local-functions",
  "number": 6,
  "title": "Local Functions & Expression-Bodied Methods",
  "objective": "Use local functions to extract helpers without polluting the class, and expression-bodied syntax for concise methods — plus when to extract a method at all.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Not every helper deserves to be a public method on your class. Sometimes the cleanest place for a little piece of logic is **right where you use it** — and the most readable way to write a one-line method is to make it *look* like one line. This lesson is about those two tools: **local functions** for keeping helpers private and close, and **expression-bodied members** for cutting ceremony."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "This lesson sits right after the big 'methods, parameters, ref/out, overloading' lesson. Students now know how to declare methods on a class — here we zoom into two ergonomic refinements plus the judgment call of *when to extract at all*. Keep it practical, not feature-tour-y.",
        "The Python anchor is strong here: local functions ARE nested `def`s, and expression bodies are NOT lambdas even though `=>` shows up in both. Hammer the 'named method vs anonymous lambda' distinction — it's a common beginner conflation.",
        "Live-demo the `static` local function: write a capturing one, then add `static` and let the compiler error point at the captured variable. The real error is `CS8421: A static local function cannot contain a reference to '...'`. Seeing the red squiggle teaches the rule better than any prose.",
        "Spend real time on the 'when to extract' section. Beginners from Python tend to either never extract (one giant method) or over-extract (a maze of two-line functions). The 'rule of three' and 'name a concept' heuristics are the keepers.",
        "The `:C` currency format specifier is culture-dependent — on a US machine it prints `$`, on an Indian or European machine it prints `₹` or `€`. If you live-demo the Checkout output, your console may NOT show a dollar sign. That's the teachable gotcha in the currency-format callout; pin the culture explicitly (`ToString(\"C\", CultureInfo.GetCultureInfo(\"en-US\"))`) when you need a deterministic result.",
        "If time is short, the cuttable parts are the operator/property expression-body variety in the examples block — but keep the local-function recursion demo and the static-local-function callout."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Local functions: methods inside methods",
      "id": "local-functions"
    },
    {
      "kind": "paragraph",
      "text": "In Python you can define a function inside another function. C# can do the same thing, and it's called a **local function** — a named method that lives entirely inside the body of another method. It's invisible to the rest of the class, invisible to the rest of the world, and it sits right next to the only code that uses it. That proximity is the whole point: a reader doesn't have to scroll up to a class-level helper to understand what's happening."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "OrderProcessor.cs",
      "code": "public decimal CalculateInvoiceTotal(IEnumerable<LineItem> items, decimal taxRate)\n{\n    decimal subtotal = 0;\n    foreach (var item in items)\n        subtotal += LineTotal(item);\n\n    return subtotal + (subtotal * taxRate);\n\n    // Local function: only CalculateInvoiceTotal can see or call this.\n    decimal LineTotal(LineItem item) => item.UnitPrice * item.Quantity;\n}"
    },
    {
      "kind": "paragraph",
      "text": "A few things that surprise newcomers. First, the local function can appear **after** the `return` statement — C# doesn't read top-to-bottom for declarations the way a script does, so you can put the 'main story' of the method first and tuck helpers at the bottom. Second, `LineTotal` does **not** show up in IntelliSense anywhere else; it's not a member of the class, so it can't accidentally be called from another method, picked up by reflection, or appear in your public API. Compare that to extracting a `private` method: that helper is still callable from every other method in the class, which is sometimes more visibility than you want."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Local function",
          "items": [
            "Declared **inside** a method body",
            "Visible **only** within that method",
            "Can **capture** the enclosing locals and parameters",
            "Has a real name -> good stack traces, can recurse",
            "Closest C# analogue to Python's nested `def`"
          ]
        },
        {
          "title": "Private method",
          "items": [
            "Declared at the **class** level",
            "Visible to **every** method in the class",
            "Gets nothing for free — you pass everything as parameters",
            "Use when **multiple** methods need the helper",
            "Becomes part of the type's internal surface"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Captured variables (closures)",
      "id": "captured-variables"
    },
    {
      "kind": "paragraph",
      "text": "Just like a Python nested function, a local function can **capture** variables from the method around it — read them, and even mutate them. You don't pass them as arguments; they're simply in scope. This is genuinely handy for recursion and for helpers that all operate on the same shared state. Here's a recursive directory-walker that captures a running counter and a filter:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "FileScanner.cs",
      "code": "public int CountMatchingFiles(string root, string extension)\n{\n    int found = 0;            // captured by the local function below\n\n    Walk(root);\n    return found;\n\n    void Walk(string dir)\n    {\n        foreach (var file in Directory.GetFiles(dir))\n            if (Path.GetExtension(file) == extension)\n                found++;       // mutating the captured variable\n\n        foreach (var sub in Directory.GetDirectories(dir))\n            Walk(sub);         // local functions can recurse by name\n    }\n}"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "A local function is NOT a lambda",
      "text": "Both use names that *feel* similar, but they're different tools. A **lambda** (`x => x * 2`) is an anonymous, inline expression usually assigned to a delegate or passed to a method like `Where(...)`. A **local function** has a real name, can be **recursive** (a lambda can't call itself without jumping through hoops — there's no name to call), produces **clearer stack traces** when it throws, and — crucially — does **not** allocate a delegate object unless you actually convert it to one. For a named helper that you call directly, reach for a local function; for a one-off callback you hand to LINQ, reach for a lambda."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "static local functions",
      "id": "static-local-functions"
    },
    {
      "kind": "paragraph",
      "text": "Capturing is convenient, but it's also a quiet source of bugs and overhead: when a local function captures variables, the compiler may allocate a hidden object to hold that shared state, and it becomes harder to reason about who is mutating what. If your helper is **pure** — it computes its answer entirely from its arguments — mark it `static`. A `static` local function is **forbidden from capturing** anything from the enclosing method; the compiler rejects any accidental reach into outer locals with `CS8421: A static local function cannot contain a reference to '...'`. That turns a silent assumption into a checked guarantee."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Pricing.cs",
      "code": "public decimal ApplyBulkDiscount(decimal price, int quantity)\n{\n    decimal tier = DiscountFor(quantity);\n    return price * (1 - tier);\n\n    // 'static' => cannot touch 'price' or 'quantity' from outside;\n    // everything it needs comes through its own parameter.\n    static decimal DiscountFor(int qty) => qty switch\n    {\n        >= 100 => 0.20m,\n        >= 50  => 0.10m,\n        >= 10  => 0.05m,\n        _      => 0.00m\n    };\n}"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Make local functions static by default",
      "text": "Start every local function as `static` and only drop the keyword when you genuinely need to capture something. It documents intent ('this is a pure helper'), prevents accidental closures over a variable you didn't mean to touch, and avoids the hidden allocation that capturing can cause. The built-in analyzer rule **IDE0062 ('Make local function static')** will even suggest adding `static` when a local function captures nothing — listen to it."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Expression-bodied members",
      "id": "expression-bodied"
    },
    {
      "kind": "paragraph",
      "text": "When a method or property body is a **single expression**, you can drop the braces, the `return` keyword, and write `=>` instead. This is the **expression-bodied** form, and it's everywhere in modern C#. Don't confuse the `=>` here with a lambda — in this context it just means 'this member's body is this one expression.' The two snippets below compile to exactly the same thing:"
    },
    {
      "kind": "examples",
      "intro": "The same members written in block form and expression-bodied form. (The two `Total()` methods are shown side by side as alternatives — you'd write only one.) Expression bodies shine for getters, computed values, and genuine one-liners.",
      "examples": [
        {
          "label": "Method: block vs expression-bodied",
          "code": "// Block body\npublic decimal Total() { return Subtotal + Tax; }\n\n// Expression-bodied — identical behavior, less ceremony\npublic decimal Total() => Subtotal + Tax;"
        },
        {
          "label": "Computed (read-only) property",
          "code": "public string FullName => $\"{First} {Last}\";\n\n// Recomputed on every read — like a Python @property getter.\n// Maps onto: @property def full_name(self): return f\"{self.first} {self.last}\""
        },
        {
          "label": "Property with both accessors",
          "code": "private string _name = \"\";\npublic string Name\n{\n    get => _name;\n    set => _name = value.Trim();\n}"
        },
        {
          "label": "Constructor, indexer, even an operator",
          "code": "public Money(decimal amount) => Amount = amount;\npublic char this[int i] => Text[i];\npublic static Money operator +(Money a, Money b) => new(a.Amount + b.Amount);"
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "Notice the computed-property pattern (`FullName => ...`): it's the C# equivalent of Python's `@property`. It looks like a field to callers (`user.FullName`, no parentheses) but runs code every time it's read. That's why it reads so naturally and why you'll see it constantly in real domain models — `order.IsOverdue`, `cart.IsEmpty`, `invoice.Total`."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Don't cram logic into an arrow",
      "text": "Expression bodies are for **one expression**, not 'one line at all costs.' If your member has branching, loops, multiple statements, or a multi-line ternary that you have to squint at, use a normal `{ }` block. A `switch` expression or a short conditional is fine; a three-clause nested ternary jammed after `=>` is a readability crime. The goal is *clarity*, and forcing complex logic through an arrow defeats it."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When should you extract a method at all?",
      "id": "when-to-extract"
    },
    {
      "kind": "paragraph",
      "text": "Both tools in this lesson are about *extracting* logic into its own named unit. But extraction isn't automatically good — a method ripped out too eagerly forces the reader to jump around to reassemble the story, and a giant method that does ten things is just as hard to follow. The judgment is the skill. Here are the heuristics working engineers actually use:"
    },
    {
      "kind": "list",
      "items": [
        "**You can give it a clear name.** If a chunk of code has a name that's more meaningful than the code itself — `IsEligibleForRefund`, `NormalizePhoneNumber` — extracting it lets the call site read like prose. If the best name you can think of is `DoStuff2`, the boundary is probably wrong.",
        "**The rule of three.** Duplicate it once, maybe shrug. The **third** time you copy-paste the same logic, extract it. Premature extraction on the first occurrence often abstracts the wrong shape.",
        "**It hides a distracting detail.** Replacing eight lines of fiddly date math with `var due = DueDate(invoice);` lets the main method stay at one altitude — the high-level steps — instead of mixing strategy with minutiae.",
        "**It needs its own test.** If a piece of logic deserves a focused unit test, it deserves to be a named, callable thing. (Note: a *local* function can't be unit-tested directly from the outside — if it needs its own test, that's a signal to promote it to a `private`, `internal`, or public method.)",
        "**Reach for a local function when only ONE method needs the helper;** promote it to a `private` method when a second method needs it too. Don't make something class-visible before anything else actually uses it."
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: keep one method at one level of abstraction",
      "text": "A great method body reads like a short table of contents: each line is roughly the same 'altitude.' If one line is a high-level step (`ChargeCard(order)`) and the next is low-level fiddling (`for (int i = 0; i < digits.Length; i++) ...`), that low-level chunk is begging to become a well-named local function. This single habit does more for readability than any naming convention."
    },
    {
      "kind": "paragraph",
      "text": "Here's the payoff — the same logic before and after thoughtful extraction. The 'after' version uses a local function so the helper stays private to this method and sits right where it's read:"
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Checkout.cs",
      "code": "// BEFORE: one method, three altitudes mixed together\npublic string Checkout(Cart cart)\n{\n    decimal total = 0;\n    foreach (var item in cart.Items)\n    {\n        decimal line = item.Price * item.Qty;\n        if (item.Qty >= 10) line *= 0.95m;   // bulk discount buried inline\n        total += line;\n    }\n    if (total > 100) total -= 10;            // coupon logic buried inline\n    return $\"Charged {total:C}\";\n}\n\n// AFTER: the main story reads top-down; details are named helpers\npublic string Checkout(Cart cart)\n{\n    decimal total = cart.Items.Sum(LineTotal);\n    total = ApplyCoupon(total);\n    return $\"Charged {total:C}\";\n\n    static decimal LineTotal(CartItem item)\n    {\n        decimal line = item.Price * item.Qty;\n        return item.Qty >= 10 ? line * 0.95m : line;\n    }\n\n    static decimal ApplyCoupon(decimal amount) => amount > 100 ? amount - 10 : amount;\n}"
    },
    {
      "kind": "output",
      "label": "Calling Checkout with a $120 cart of 1 item (no bulk discount), on a machine whose culture is en-US",
      "output": "Charged $110.00"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The `:C` in `{total:C}` follows the machine's culture, not the dollar",
      "text": "The `C` format specifier means 'currency,' and it renders using **`CultureInfo.CurrentCulture`** — the culture of the machine running the code. On a US dev box you get `$110.00`; on an Indian one you'd get `₹110.00`, and in Germany `110,00 €`. So the output above is only exact under `en-US`. When you need a deterministic currency string (tests, invoices, anything that must be the same everywhere), pin the culture: `total.ToString(\"C\", CultureInfo.GetCultureInfo(\"en-US\"))`. This bites real teams constantly — code that 'worked on my machine' formats money differently in production."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Interview angle",
      "text": "A common interview question is 'why use a local function instead of a private method, or a lambda?' Strong answer: a local function keeps a single-use helper **scoped to the only method that needs it** (better encapsulation than a private method), it can **recurse** and gives **clean stack traces** and **no delegate allocation** (unlike a lambda), and marking it `static` proves it captures nothing. Knowing *why* each tool exists — not just that it does — is what they're listening for."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "A **local function** is a named method declared inside another method — like Python's nested `def`. It's visible only there, can **capture** enclosing variables, can **recurse**, and gives clean stack traces.",
        "Mark a local function **`static`** when it doesn't need to capture anything: it prevents accidental closures, avoids hidden allocations, and documents that the helper is pure. Make it the default — the compiler enforces it with `CS8421` if you slip.",
        "A local function is **not** a lambda: lambdas are anonymous inline callbacks; local functions are named, directly-called helpers.",
        "**Expression-bodied** members (`=> expr`) drop the braces and `return` for single-expression methods, properties, constructors, indexers, and operators. The `=>` here means 'body is this expression,' not 'lambda.'",
        "Expression-bodied **read-only properties** are C#'s `@property` getter — they look like fields but run code on each read (`user.FullName`, `order.IsOverdue`).",
        "Keep expression bodies to genuinely **one expression**; use a `{ }` block once there's branching or multiple statements.",
        "**Extract when** you can name the concept, on the **third** duplication, to hide a distracting detail, or when the logic deserves its own test — keep each method at **one level of abstraction**. Don't extract speculatively.",
        "The `:C` currency format depends on `CultureInfo.CurrentCulture`; pin an explicit culture when the output must be the same on every machine."
      ]
    }
  ]
};
