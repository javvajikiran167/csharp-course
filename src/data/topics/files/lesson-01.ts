import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  "slug": "file-io",
  "number": 1,
  "title": "Reading & Writing Text Files",
  "objective": "Read and write whole text files with the File helper methods, and know when each fits — plus the async variants used in real apps.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Almost every real program eventually needs to remember something after it shuts down — a config file, an exported report, a log, a saved game. In C# the fastest way to do that is the `File` helper: a handful of static methods that read or write an entire text file in a single line."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by asking the room: \"In Python, how do you read a whole file?\" Most will say `open(path).read()` or `Path(path).read_text()`. Anchor the entire lesson on that: `File.ReadAllText` IS `read_text()`. Everything else is a variation.",
        "Live-code the write-then-read-back loop first. Seeing a file appear on disk and come back makes the abstraction concrete before you discuss overloads.",
        "The single most common beginner bug here is the overwrite-vs-append confusion, immediately followed by the case where they expected append but `WriteAllText` nuked the file. Demo it on purpose by calling `WriteAllText` in a loop and showing only the last record survives.",
        "Defer streaming (StreamReader, ReadLines, async enumerable for huge files) to its own lesson — here just plant the flag: whole-file is fine until it isn't, and give them the rule of thumb.",
        "When you reach async, resist a deep dive into the threading model. The one sentence that lands: a web server has a limited pool of threads; blocking one on disk I/O means one fewer request it can serve. That's enough motivation.",
        "Run the file-not-found demo live — students need to FEEL the unhandled exception crash before they appreciate the try/catch. Then re-run with the catch in place.",
        "Watch out for the minimal-API example: a bare `string` parameter binds from the QUERY STRING, not the body. That's why the saved example takes a JSON record. If a student tries `(string note)` and POSTs a body, the value arrives null/empty — a great teachable surprise."
      ]
    },
    {
      "kind": "paragraph",
      "text": "Coming from Python, you already have the right mental model. `open(...).read()` and `pathlib.Path.read_text()` slurp a whole file into a string; `write_text()` dumps a string back out. C# has the exact same convenience methods, except they live as **static** methods on the `System.IO.File` class. You don't construct a `File` object — you call `File.ReadAllText(path)` directly, the same way you'd call a `staticmethod` on a Python class. With `ImplicitUsings` enabled (the default in modern projects), `System.IO` is already in scope, so you can use `File` and `Path` without any `using` line."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Write it, then read it back",
      "id": "write-then-read"
    },
    {
      "kind": "paragraph",
      "text": "The four workhorse methods are `File.WriteAllText`, `File.ReadAllText`, `File.ReadAllLines`, and `File.AppendAllText`. `WriteAllText` creates the file (or replaces it if it already exists) and writes your whole string. `ReadAllText` gives you the entire contents back as one `string`. `ReadAllLines` does the same but splits on line breaks and hands you a `string[]` — handy when each line is a record. Notice the path: I build it with `Path.Combine` and `Path.GetTempPath()` instead of gluing `\"/tmp/\" + name` together by hand. That one habit makes your code run unchanged on Windows, Linux, and macOS."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// Build the path safely — never hand-concatenate with \"/\" or \"\\\\\".\nstring path = Path.Combine(Path.GetTempPath(), \"notes.txt\");\n\n// Create (or replace) the file with this exact content.\nFile.WriteAllText(path, \"First line.\\nSecond line.\\n\");\n\n// Add more to the END without erasing what's there.\nFile.AppendAllText(path, \"Appended line.\\n\");\n\n// Read the whole thing back as one string.\nstring all = File.ReadAllText(path);\nConsole.WriteLine(\"---whole file---\");\nConsole.Write(all);\n\n// Or read it as an array of lines — one string per line.\nstring[] lines = File.ReadAllLines(path);\nConsole.WriteLine($\"Line count: {lines.Length}\");\nConsole.WriteLine($\"First: {lines[0]}\");\n\n// WriteAllText REPLACES everything — the append is gone now.\nFile.WriteAllText(path, \"Overwritten.\\n\");\nConsole.WriteLine(\"---after overwrite---\");\nConsole.Write(File.ReadAllText(path));"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "---whole file---\nFirst line.\nSecond line.\nAppended line.\nLine count: 3\nFirst: First line.\n---after overwrite---\nOverwritten."
    },
    {
      "kind": "paragraph",
      "text": "Read that output carefully. After the write and the append, the file holds three lines, so `ReadAllLines` reports a length of 3. Then the second `WriteAllText` wipes the file clean and replaces it with a single line — the appended content is gone. That is the crucial distinction: **`WriteAllText` overwrites the entire file every time, while `AppendAllText` only adds to the end.** If the file doesn't exist yet, both create it for you, so you don't need to check first or \"touch\" it the way you sometimes do in a shell. One more detail worth internalizing: these methods write your string **verbatim**. They do not add a trailing newline for you — that's why each string above ends in an explicit `\\n`. If you want every appended record on its own line, include the `\\n` yourself (or use `File.AppendAllLines`, which adds the line break after each entry)."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The #1 beginner trap: WriteAllText destroys what was there",
      "text": "It is named `WriteAllText`, not `AddText`. Every call replaces the **whole** file — there is no Python `open(path, \"a\")` mode hiding inside it. If you loop over records calling `File.WriteAllText` each time, you'll end up with only the **last** one on disk and a very confusing bug report. To accumulate (logs, audit trails, CSV rows), use `File.AppendAllText`. To rewrite from scratch, use `WriteAllText`. Choose deliberately."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "File.WriteAllText(path, text)",
          "items": [
            "**Replaces** the file's entire contents every call",
            "Creates the file if it doesn't exist",
            "Use for: config files, exports, game saves, any \"current snapshot\" of state",
            "Python analog: `Path(path).write_text(text)`"
          ]
        },
        {
          "title": "File.AppendAllText(path, text)",
          "items": [
            "**Adds** to the end, keeping existing content",
            "Creates the file if it doesn't exist",
            "Use for: log files, audit trails, appending CSV rows over time",
            "Python analog: `open(path, \"a\").write(text)`"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Encoding: UTF-8 by default",
      "id": "encoding"
    },
    {
      "kind": "paragraph",
      "text": "When you write text, the bytes that actually land on disk depend on the **encoding**. The `File` text methods use **UTF-8** by default — and specifically UTF-8 *without* a byte-order mark (BOM). This is the modern, cross-platform-friendly choice and matches what Python 3 does, so an accented character like `é` or an emoji round-trips correctly without you thinking about it. You only need to get explicit when an external system demands a particular format — say, a legacy import that expects UTF-16, or a tool that insists on a BOM. In those cases every method takes an optional `Encoding` argument."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Encoding.cs",
      "code": "using System.Text;\n\nstring path = Path.Combine(Path.GetTempPath(), \"export.txt\");\n\n// Default: UTF-8, no BOM — the right choice 95% of the time.\nFile.WriteAllText(path, \"Café — €5\");\n\n// Be explicit only when a contract requires it.\nFile.WriteAllText(path, \"Café — €5\", new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));\nFile.WriteAllText(path, \"Café — €5\", Encoding.Unicode); // UTF-16, e.g. for a legacy consumer"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: build paths with Path, and beware the working directory",
      "text": "Two habits will save you hours. First, always compose paths with `Path.Combine` so separators are correct on every OS. Second, remember that a **relative** path like `\"data.txt\"` resolves against the process's current working directory — `Environment.CurrentDirectory` — **not** the folder your `.exe` lives in. That's why a file \"works in debug but throws `FileNotFoundException` in production.\" For files shipped alongside your app, build an absolute path from `AppContext.BaseDirectory`: `Path.Combine(AppContext.BaseDirectory, \"data.txt\")`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The async variants — why web apps insist on them",
      "id": "async"
    },
    {
      "kind": "paragraph",
      "text": "Every method we've seen has an `...Async` twin: `ReadAllTextAsync`, `WriteAllTextAsync`, `ReadAllLinesAsync`, `AppendAllTextAsync`. They do the same job but return a `Task` you `await`. In a small console tool the synchronous versions are perfectly fine. In a **web server** they are not, and here's the reason in one breath: an ASP.NET Core app serves requests from a limited pool of threads. Disk I/O is slow compared to the CPU, and a synchronous `File.ReadAllText` makes its thread sit and wait, doing nothing, until the disk responds. Block enough threads that way and your server stops accepting new requests even though the CPU is idle — that's called thread-pool starvation. The async versions hand the thread back to serve other requests while the OS does the waiting, so the same hardware serves far more traffic."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "AsyncIO.cs",
      "code": "string path = Path.Combine(Path.GetTempPath(), \"report.txt\");\n\n// Top-level statements allow await directly; the file methods\n// also accept a CancellationToken in real server code.\nawait File.WriteAllTextAsync(path, \"Daily total: 42\\n\");\n\nstring contents = await File.ReadAllTextAsync(path);\nConsole.Write(contents);"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Daily total: 42"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Never block on async in a server",
      "text": "Once a method is async, stay async all the way up: `await` it. Do **not** call `.Result` or `.Wait()` on the returned `Task` to \"make it synchronous\" — in ASP.NET that can deadlock and, at best, reintroduces the exact thread-blocking you were avoiding. The rule of thumb: in a web API or any server, use the `Async` methods end to end; in a quick script or one-off CLI tool, the synchronous ones are simpler and fine."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "When the file doesn't exist: exceptions",
      "id": "exceptions"
    },
    {
      "kind": "paragraph",
      "text": "Reading is where things go wrong, because the file might be missing, locked by another process, or unreadable due to permissions. C# doesn't return a null or an error code — it **throws**. Ask for a file that isn't there and `File.ReadAllText` raises a `FileNotFoundException`. If you don't handle it, the program crashes with a stack trace. This is the same idea as Python's `FileNotFoundError`, and you handle it the same way: wrap the risky call in `try`/`catch` and react to the specific exception type."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "SafeRead.cs",
      "code": "string path = Path.Combine(Path.GetTempPath(), \"missing-xyz-123.txt\");\n\ntry\n{\n    string content = File.ReadAllText(path);\n    Console.WriteLine(content);\n}\ncatch (FileNotFoundException ex)\n{\n    // ex.FileName tells you which path failed.\n    Console.WriteLine($\"Could not find the file: {ex.FileName}\");\n}"
    },
    {
      "kind": "output",
      "label": "Console output (path is machine-specific)",
      "output": "Could not find the file: /var/folders/.../T/missing-xyz-123.txt"
    },
    {
      "kind": "paragraph",
      "text": "Catch the **specific** exceptions you can actually do something about rather than a blanket `catch (Exception)`. The ones worth knowing for file I/O: `FileNotFoundException` (no such file), `DirectoryNotFoundException` (a folder in the path is missing), `UnauthorizedAccessException` (permissions, or you tried to write to a read-only file), and the broad `IOException` (the file is locked by another process, the disk is full, and so on). You can stack multiple `catch` blocks, most-specific first — and because `FileNotFoundException` and the others all derive from `IOException`, putting the `IOException` catch last lets it act as a backstop. A quick alternative for the \"might not exist\" case is to guard with `if (File.Exists(path))` before reading — though be aware that in a multi-process system the file could vanish between the check and the read, so a `try`/`catch` is the more robust pattern."
    },
    {
      "kind": "examples",
      "intro": "A few real shapes you'll write on the job:",
      "examples": [
        {
          "label": "Append a line to a log file",
          "code": "string logPath = Path.Combine(AppContext.BaseDirectory, \"app.log\");\nFile.AppendAllText(logPath, $\"{DateTime.UtcNow:O}  Order placed\\n\");"
        },
        {
          "label": "Read a file as records, one per line",
          "code": "foreach (string email in File.ReadAllLines(\"subscribers.txt\"))\n    Console.WriteLine(email.Trim());"
        },
        {
          "label": "Save user state from a web endpoint (async)",
          "code": "// A plain `string` parameter would bind from the QUERY STRING, not the\n// body — so accept a JSON object bound to a record instead.\napp.MapPost(\"/notes\", async (NoteDto dto, CancellationToken ct) =>\n{\n    string path = Path.Combine(AppContext.BaseDirectory, \"note.txt\");\n    await File.WriteAllTextAsync(path, dto.Text, ct);\n    return Results.Ok();\n});\n\nrecord NoteDto(string Text);"
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Whole-file is fine — until it isn't",
      "id": "when-too-big"
    },
    {
      "kind": "paragraph",
      "text": "`ReadAllText` and `ReadAllLines` load the **entire** file into memory at once. For config files, small data files, and most documents — anything up to a few megabytes — that's exactly what you want: simplest code, one line, done. The trap is scale. Point `ReadAllText` at a multi-gigabyte log or data export and you'll allocate that whole thing in RAM, which can throw `OutOfMemoryException` and will certainly spike your memory usage. The rule of thumb: **if you can comfortably hold the whole file in memory, the `File` helpers are the right tool.** When files get large, or you only need to process them line by line, you switch to streaming APIs — `File.ReadLines` (which reads lazily, like a Python generator), or a `StreamReader` loop. We'll cover those in the streaming lesson; for now, just know the boundary exists and roughly where it is."
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Preview: ReadAllLines vs ReadLines",
      "text": "`File.ReadAllLines` returns a `string[]` with **every** line loaded up front. `File.ReadLines` returns a lazy `IEnumerable<string>` that yields one line at a time as you iterate — the same memory-friendly idea as a generator in Python. For a 50-line config they're interchangeable; for a 5 GB export, `ReadLines` is the one that won't crash."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`File.ReadAllText` / `WriteAllText` are C#'s `read_text()` / `write_text()` — static methods that move a whole file in one line.",
        "**`WriteAllText` replaces the entire file; `AppendAllText` adds to the end.** Both create the file if it's missing, and neither adds a trailing newline for you. Mixing them up is the classic beginner bug.",
        "`ReadAllLines` gives you a `string[]`, one entry per line — convenient when each line is a record.",
        "Text I/O defaults to **UTF-8 (no BOM)**; pass an explicit `Encoding` only when an external contract requires it.",
        "Build paths with `Path.Combine`, and remember relative paths resolve against the working directory — use `AppContext.BaseDirectory` for files shipped with your app.",
        "Use the `...Async` variants (and `await` them all the way up) in web servers to avoid thread-pool starvation; the sync versions are fine for scripts and CLIs.",
        "Reading can throw — handle `FileNotFoundException`, `UnauthorizedAccessException`, and `IOException` specifically (most-specific first) rather than catching everything.",
        "Whole-file helpers load everything into RAM: perfect for small files, dangerous for huge ones. Reach for `ReadLines` or a `StreamReader` when files get large."
      ]
    }
  ]
};
