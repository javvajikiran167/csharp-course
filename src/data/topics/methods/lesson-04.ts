import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  "slug": "defaults",
  "number": 4,
  "title": "Default & Named Arguments",
  "objective": "Use optional (default) parameters and named arguments to write clean, readable call sites common in modern .NET APIs.",
  "blocks": [
    {
      "kind": "lead",
      "text": "If you came from Python, you have already lived the dream: `def connect(host, port=5432, ssl=True)` and then `connect(\"db\", ssl=False)`. C# has the very same two superpowers — **default parameter values** and **named arguments** — and modern .NET APIs lean on them constantly. The good news: they look almost identical to Python. The interesting news: the rules underneath are stricter, and one of them hides a genuine versioning bug you should know about before you ship a library."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor everything to Python first. Students already know keyword args and default args; the job here is to map them onto C# syntax and then flag the three differences that bite: (1) defaults must be compile-time constants, (2) optional parameters must be declared after all required ones, (3) defaults are baked into the caller's compiled assembly.",
        "The deepest 'aha' is the versioning trap (defaults compiled into the caller). Spend real time on it — it's a top interview question and the reason public-library design guidance differs from app code.",
        "Lead with readability wins (boolean params at call sites), because that is the everyday payoff students will feel immediately. Save the defaults-vs-overloads tradeoff for after they're comfortable.",
        "If short on time, the must-keep beats are: declaring a default, calling with a named arg to skip an optional, the ordering rule, and the warn callout about compile-time-constant defaults. The overloads comparison is the natural stretch goal.",
        "Have students predict the output of the named-argument reordering example before you reveal it — the `Connect(port: 6543, host: ...)` line surprises people who still think argument position matters once you start naming.",
        "Live-demo the two compiler errors if you can: `error CS1736` for a non-constant default and `error CS1737` for an optional-before-required parameter. Seeing the real red text makes the rules stick far better than describing them."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Default parameter values",
      "id": "default-values"
    },
    {
      "kind": "paragraph",
      "text": "A **default parameter value** (also called an *optional parameter*) lets a caller omit an argument; if they do, the compiler supplies the value you declared. You write it with `= value` after the parameter, exactly like Python's `port=5432`. The payoff is one method that serves the common case with zero ceremony and the rare case with full control — no second overload, no duplicated body."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "void Greet(string name, string greeting = \"Hello\")\n{\n    Console.WriteLine($\"{greeting}, {name}!\");\n}\n\nGreet(\"Ada\");                  // greeting falls back to \"Hello\"\nGreet(\"Ada\", \"Welcome back\");  // greeting supplied explicitly"
    },
    {
      "kind": "output",
      "output": "Hello, Ada!\nWelcome back, Ada!"
    },
    {
      "kind": "paragraph",
      "text": "There is one ordering rule with no exceptions: **optional parameters must be declared after all required parameters**. You cannot put a parameter with a default in the middle and a required one after it — a positional caller would have no way to indicate which slot they meant. So `void Greet(string greeting = \"Hello\", string name)` will not compile (you get `error CS1737: Optional parameters must appear after all required parameters`); flip them so `name` comes first."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Defaults must be compile-time constants",
      "text": "This is the first place Python habits break. In C#, a default value must be known **at compile time** — a literal, a `const`, `null`, `default`, or an `enum` member. You **cannot** write `void Process(List<string> tags = new())` the way Python lets you write `tags=[]`. Try it and you get a hard error, not a warning: `error CS1736: Default parameter value for 'tags' must be a compile-time constant`. Ironically, this restriction also spares you Python's infamous *mutable default argument* bug (where one shared list silently accumulates across calls). The C# fix is the **null-default + null-coalescing** pattern below, which gives every call its own fresh object."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "using System.Collections.Generic;\n\n// Can't default to `new List<string>()` — so default to null, then materialize.\nvoid Process(string job, List<string>? tags = null)\n{\n    tags ??= new List<string>();   // give each call its own fresh list\n    tags.Add(job);\n    Console.WriteLine($\"{job}: {tags.Count} tag(s)\");\n}\n\nProcess(\"import\");\nProcess(\"export\", new List<string> { \"nightly\" });",
      "filename": "Process.cs"
    },
    {
      "kind": "output",
      "output": "import: 1 tag(s)\nexport: 2 tag(s)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Named arguments",
      "id": "named-arguments"
    },
    {
      "kind": "paragraph",
      "text": "A **named argument** specifies which parameter an argument is for by writing `parameterName: value` at the call site — just like Python's `connect(ssl=False)`. Named arguments do two jobs. First, they let you **skip over optional parameters** you don't care about and set only the one you do. Second, and just as important in real codebases, they make call sites **self-documenting**: a bare `true` at a call site tells the reader nothing, but `isAdmin: true` reads like a sentence."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "void CreateUser(\n    string name,\n    bool isAdmin = false,\n    bool sendEmail = true,\n    string role = \"member\")\n{\n    Console.WriteLine($\"name={name}, isAdmin={isAdmin}, sendEmail={sendEmail}, role={role}\");\n}\n\nCreateUser(\"Grace\", isAdmin: true);              // skip sendEmail & role\nCreateUser(\"Linus\", sendEmail: false, role: \"owner\");\nCreateUser(name: \"Edsger\", role: \"guest\");       // skip the two middle optionals",
      "filename": "CreateUser.cs"
    },
    {
      "kind": "output",
      "output": "name=Grace, isAdmin=True, sendEmail=True, role=member\nname=Linus, isAdmin=False, sendEmail=False, role=owner\nname=Edsger, isAdmin=False, sendEmail=True, role=guest"
    },
    {
      "kind": "paragraph",
      "text": "Notice the output prints `True`/`False` with a capital letter. That's not a typo: `Console.WriteLine` and string interpolation call `bool.ToString()`, which in .NET returns `\"True\"` and `\"False\"`. Python prints `True`/`False` too — but the lowercase `true`/`false` you typed in the source are the C# *keywords*, not how the value renders as text."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Name your boolean flags at the call site",
      "text": "The single highest-value habit from this lesson: when a method takes a `bool` (or any literal whose meaning isn't obvious), pass it as a named argument. Compare `repo.Save(order, true)` with `repo.Save(order, validateFirst: true)`. A reviewer reading the diff understands the second instantly and has no chance of silently swapping two adjacent `bool`s in the first — a bug the compiler can't catch because both arguments have the same type. This is why so much of the .NET ecosystem and most team style guides encourage named arguments for non-obvious literals."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Ordering rules: positional first, then named",
      "id": "ordering-rules"
    },
    {
      "kind": "paragraph",
      "text": "Named arguments can appear **in any order** — you can even list them in a different order than the declaration. The one constraint at the call site is the mirror of the declaration rule: any **positional arguments must come first**, before you start naming. So you may lead with positional arguments and then switch to named ones for whatever's left, but you cannot drop back to a bare positional argument after a named one. (Since C# 7.2 you can also interleave: a named argument may sit in its natural position and let later positionals continue, as long as every positional still lands in the right slot.) The simplest mental rule: **positionals first, then go named for whatever's left.**"
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "void Connect(string host, int port = 5432, bool ssl = true)\n{\n    Console.WriteLine($\"{host}:{port} ssl={ssl}\");\n}\n\nConnect(\"db.internal\");                         // all defaults\nConnect(\"db.internal\", ssl: false);            // positional host, skip port, name ssl\nConnect(port: 6543, host: \"replica.internal\"); // fully named, any order",
      "filename": "Connect.cs"
    },
    {
      "kind": "output",
      "output": "db.internal:5432 ssl=True\ndb.internal:5432 ssl=False\nreplica.internal:6543 ssl=True"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Default parameters — best when",
          "items": [
            "You control all the callers (app code, internal services) and recompile them together.",
            "Extra options are genuinely *optional* with one obvious, sensible value.",
            "You want **one** method signature to read and maintain, not five.",
            "The parameter list is short and the defaults rarely change."
          ]
        },
        {
          "title": "Overloads — best when",
          "items": [
            "You're shipping a **public library / NuGet package** others compile against.",
            "Different call shapes need genuinely different bodies or parameter types.",
            "You want to add or change options later without the baked-in-default trap (see the warn below).",
            "Some combinations of arguments are invalid and shouldn't be expressible at all."
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When defaults beat overloads — and the trap that flips it",
      "id": "defaults-vs-overloads"
    },
    {
      "kind": "paragraph",
      "text": "For application code where you recompile everything in one build, default parameters usually win: one signature, less duplication, clearer intent. But there is a famous catch that matters the moment your code becomes a **library other teams reference**: the default value is **copied into the caller's compiled assembly** at compile time, not looked up from your library at runtime."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The baked-in-default versioning trap",
      "text": "Say your library v1 ships `void Log(string msg, LogLevel level = LogLevel.Info)`. An app compiles against it — and the compiler literally bakes `LogLevel.Info` into the app's call site, as if the developer had typed it. In v2 you change the default to `LogLevel.Warning`. The app that calls `Log(\"hi\")` **keeps using `Info`** until it is *recompiled* against v2. Your 'change' silently does nothing for existing binaries. This is the core reason Microsoft's [framework design guidelines](https://learn.microsoft.com/dotnet/standard/design-guidelines/member-overloading) steer public APIs toward **overloads** rather than optional parameters. For internal app code where one build recompiles everything, the trap can't fire — so defaults are perfectly fine and often clearer."
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**App / internal code, one build:** prefer default parameters — recompilation makes the trap a non-issue, and you get one tidy signature.",
        "**Public library / NuGet:** prefer overloads for any option you might change later; the call site binds to a method, not to a frozen literal.",
        "**Don't mix optional parameters with overloads of the same method** in one class — Microsoft explicitly warns it produces surprising, sometimes ambiguous overload resolution.",
        "**Either way, name non-obvious literals** at the call site; readability is independent of which technique you chose."
      ]
    },
    {
      "kind": "examples",
      "intro": "You meet these every day in real .NET. Notice how a named argument turns each call into something you can read aloud — and how an unnamed literal turns it into a riddle:",
      "examples": [
        {
          "label": "ASP.NET Core: an optional comparison mode",
          "code": "// StringComparison is an optional argument here; naming it removes all doubt\n// about whether the match is case-sensitive.\nstring path = \"/API/orders\";\nbool isApi = path.StartsWith(\"/api\", StringComparison.OrdinalIgnoreCase);\nConsole.WriteLine(isApi);   // True",
          "output": "True"
        },
        {
          "label": "Splitting: name the option, don't fake it",
          "code": "string csv = \"a,,b,\";\n\n// Clear: the enum member says exactly what it does.\nvar parts = csv.Split(',', StringSplitOptions.RemoveEmptyEntries);\n\n// Same result, but a mystery to every future reader — never do this:\nvar mystery = csv.Split(',', (StringSplitOptions)1);\n\nConsole.WriteLine(parts.Length);   // 2  -> [\"a\", \"b\"]",
          "output": "2"
        },
        {
          "label": "Your own service method",
          "code": "using System.Threading;\nusing System.Threading.Tasks;\n\nTask<int> ExportAsync(\n    string table,\n    bool includeHeaders = true,\n    char delimiter = ',',\n    CancellationToken ct = default)\n    => Task.FromResult(table.Length);\n\n// Call site reads like a sentence:\nawait ExportAsync(\"invoices\", includeHeaders: false, delimiter: '\\t');"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "`CancellationToken ct = default` is everywhere",
      "text": "You'll constantly see `CancellationToken ct = default` as the last parameter of async methods. `default` for a `CancellationToken` is `CancellationToken.None` — a valid, do-nothing token — so callers who don't have one to pass can simply omit it. It's the idiomatic way to make cancellation opt-in. And note `default` here is itself a compile-time constant, which is exactly why it's a legal default value (`= CancellationToken.None` would not be, since it's a static property read at runtime, not a constant)."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "Default parameters (`x = value`) and named arguments (`name: value`) are C#'s versions of Python's default and keyword arguments — same idea, stricter rules.",
        "Optional parameters must be declared **after** all required ones (`CS1737`); at the call site, positional arguments come first, then you can name the rest in any order.",
        "Default values must be **compile-time constants** (`CS1736`) — no `new List<T>()`. Use the null-default + `??=` pattern to fake a fresh-object default and dodge Python's mutable-default bug for free.",
        "Name non-obvious literals (especially same-typed `bool`s) at the call site: `validateFirst: true` beats a bare `true` for readability and safety.",
        "Prefer **defaults for app code** you recompile together; prefer **overloads for public libraries**, because default values are baked into the caller and won't update until that caller is recompiled.",
        "Don't mix optional parameters and overloads of the same method in one class — it confuses overload resolution."
      ]
    }
  ]
};
