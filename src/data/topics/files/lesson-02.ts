import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  "slug": "streams",
  "number": 2,
  "title": "StreamReader & StreamWriter",
  "objective": "Process large files line-by-line with streams so you never load everything into memory, using `using` for deterministic cleanup.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Someone hands you a 4 GB production log file and asks: *how many requests returned a 500 today?* If your first instinct is `File.ReadAllText`, you just tried to load 4 GB into RAM to count a few lines — and your process fell over. **Streams** are how grown-up programs read files: a little at a time, never the whole thing at once."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor everything to the memory mental model: `ReadAllLines` = pour the whole lake into a bucket; `StreamReader` = sip through a straw. Draw it if teaching live.",
        "Reinforce the `using` thread from the exceptions lesson here — disposal is the same `IDisposable`/`try-finally` idea, now applied to file handles. This is the lesson where it clicks for most students.",
        "Python comparison that lands best: `for line in open(path):` is lazy and uses a `with` block — `StreamReader` + `using` is the direct analog. Lean on it.",
        "If students ask 'why not always stream?': streaming is more code and slightly slower per-byte. For small files `File.ReadAllText` is fine and clearer. Streams earn their keep on large/unknown-size data and incremental writes.",
        "Common stumble: forgetting that `ReadLine()` returns `null` at end of stream, not empty string. Walk through the loop condition slowly.",
        "On buffer size: don't quote a hard number as gospel. The default text buffer is ~1 KB (1024 chars) today, but it's an implementation detail that has changed across runtime versions. Teach the *concept* (bulk I/O behind line-at-a-time calls), not a magic constant.",
        "The outputs in this lesson assume small demo files we create in-code, so they're deterministic and reproducible on any machine. All snippets were compiled and run on .NET 10."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The problem: ReadAllLines loads everything",
      "id": "the-memory-problem"
    },
    {
      "kind": "paragraph",
      "text": "`File.ReadAllText` and `File.ReadAllLines` are wonderfully simple — and in the previous topics we used them happily. But notice what they actually do: they read the **entire file into memory** and hand you back one giant `string` (or a `string[]` with one entry per line). For a 5 KB config file that's perfect. For a multi-gigabyte log file, web export, or data dump, it's a disaster: you allocate gigabytes of RAM, the garbage collector groans, and on a constrained server (a container with a 512 MB limit, say) you get an `OutOfMemoryException` and the request — or the whole process — dies."
    },
    {
      "kind": "paragraph",
      "text": "A **stream** is the alternative. Think of it as a one-way conveyor belt of bytes flowing from the file. You read a chunk, process it, let it go, read the next chunk. At no point do you hold the whole file. `StreamReader` wraps that byte conveyor and gives you a friendly `ReadLine()` on top, so you can walk a 10 GB file one line at a time while using only a few kilobytes of memory. Your memory footprint stays roughly the size of the *longest single line*, not the size of the file."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "File.ReadAllLines (eager)",
          "items": [
            "Reads the **whole file** into a `string[]` up front",
            "Memory use grows with file size — gigabytes for gigabytes",
            "Simple, great for **small** known-size files (config, small CSV)",
            "Like Python's `open(path).readlines()` — everything in a list"
          ]
        },
        {
          "title": "StreamReader.ReadLine (lazy)",
          "items": [
            "Reads **one line at a time**, holding almost nothing",
            "Memory stays roughly **constant** regardless of file size",
            "More code, but the only sane choice for **large/unknown** files",
            "Like Python's `for line in open(path):` — lazy iteration"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "There's a lazy middle ground too",
      "text": "If you like the convenience of the `File` helpers but want laziness, `File.ReadLines(path)` (note: **no** `All`) returns an `IEnumerable<string>` that streams under the hood — it reads each line as you `foreach` over it, so you can even pipe it straight into LINQ. It's the easy 80% answer. We'll still learn `StreamReader` directly because it's what `ReadLines` is built on, and because real jobs eventually need the extra control (encoding, buffering, mixing reads and writes, async)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Reading line-by-line with StreamReader",
      "id": "streamreader-loop"
    },
    {
      "kind": "paragraph",
      "text": "Here's the core pattern you'll use for the rest of your career. `StreamReader.ReadLine()` returns the next line as a `string` (without the trailing newline), or `null` when there are no more lines — that `null` is your signal to stop. We loop until we hit it. Notice the `using` keyword on the declaration; we'll dig into it in a moment, but it's what guarantees the file gets closed."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System;\nusing System.IO;\n\n// Create a small demo file so this example is self-contained.\nstring path = Path.Combine(Path.GetTempPath(), \"server.log\");\nFile.WriteAllText(path,\n    \"\"\"\n    GET /home 200\n    GET /api/orders 500\n    POST /api/login 200\n    GET /api/orders 500\n    GET /favicon.ico 404\n    \"\"\");\n\nint errorCount = 0;\nint lineNumber = 0;\n\n// `using` here = open the reader, and guarantee it's closed when the block ends.\nusing StreamReader reader = new(path);\n\nstring? line;                       // ReadLine returns string? — null means \"end of file\".\nwhile ((line = reader.ReadLine()) is not null)\n{\n    lineNumber++;\n    if (line.EndsWith(\"500\"))\n    {\n        errorCount++;\n        Console.WriteLine($\"Line {lineNumber}: server error -> {line}\");\n    }\n}\n\nConsole.WriteLine($\"Scanned {lineNumber} lines, found {errorCount} server errors.\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Line 2: server error -> GET /api/orders 500\nLine 4: server error -> GET /api/orders 500\nScanned 5 lines, found 2 server errors."
    },
    {
      "kind": "paragraph",
      "text": "The whole file might have been 4 GB — this loop would still only ever hold **one line** at a time. That `while ((line = reader.ReadLine()) is not null)` shape is idiomatic C#: we assign the next line and test it for `null` in the same expression. It reads almost exactly like Python's `for line in open(path):`, with one important difference we must respect — the cleanup."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "ReadLine returns null at the end — not an empty string",
      "text": "A blank line in the file comes back as `\"\"` (empty string). The **end of the file** comes back as `null`. Those are different! If you write `while (reader.ReadLine() != \"\")` you'll stop early on the first blank line and never reach the end. Always test against `null` (or use `is not null`). One more trap: each call to `ReadLine()` *advances* the position — calling it twice reads two different lines, a classic bug when people accidentally call it in both the loop condition **and** the body. Read once per iteration, into a variable."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "using: deterministic cleanup, just like the exceptions topic",
      "id": "using-disposal"
    },
    {
      "kind": "paragraph",
      "text": "Remember from the **exceptions** topic that `using` is really sugar over `try`/`finally`: it guarantees a cleanup step runs no matter how the block exits — normal end, early `return`, or an exception thrown mid-loop. A `StreamReader` holds an operating-system **file handle**, an unmanaged resource the garbage collector can't promptly reclaim. `using` calls `Dispose()` on it at the end of the scope, which closes the handle and flushes any buffers. This is the C# equivalent of Python's `with open(path) as f:` — when the block ends, the file is closed for you."
    },
    {
      "kind": "examples",
      "intro": "Three ways to write the same disposal, from oldest to most modern. The **using declaration** (last one) is what you'll write today.",
      "examples": [
        {
          "label": "Classic using block — explicit scope with braces",
          "code": "using (StreamReader reader = new(path))\n{\n    string? line;\n    while ((line = reader.ReadLine()) is not null)\n        Console.WriteLine(line);\n}   // Dispose() called here, at the closing brace"
        },
        {
          "label": "What it desugars to — the try/finally from the exceptions topic",
          "code": "StreamReader reader = new(path);\ntry\n{\n    string? line;\n    while ((line = reader.ReadLine()) is not null)\n        Console.WriteLine(line);\n}\nfinally\n{\n    reader.Dispose();   // runs even if the loop throws\n}"
        },
        {
          "label": "using declaration (modern, C# 8+) — no extra braces, disposes at end of enclosing scope",
          "code": "using StreamReader reader = new(path);\nstring? line;\nwhile ((line = reader.ReadLine()) is not null)\n    Console.WriteLine(line);\n// reader.Dispose() runs automatically when this method/block ends"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Forget using, and the file stays locked",
      "text": "C# does **not** auto-close a file just because a variable goes out of scope — there's no Python-style reference-counting cleanup you can rely on for *timing*. (The GC's finalizer will eventually close an abandoned handle, but 'eventually' is useless when another line of code needs the file *now*.) If you skip `using`/`Dispose()`, the handle leaks: the file may stay **locked** (other processes get \"file in use\" errors), buffered writes may **never reach disk**, and you slowly run the process out of handles. The fix is always the same: wrap streams, readers, and writers in `using`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Writing line-by-line with StreamWriter",
      "id": "streamwriter"
    },
    {
      "kind": "paragraph",
      "text": "`StreamWriter` is the mirror image. Instead of building a giant string in memory and calling `File.WriteAllText` once, you call `WriteLine` repeatedly and it streams the output to disk through a buffer. This is exactly how you'd write a report, export a large dataset, or append to a log. Here we *read* one file and *write* a filtered copy — both streamed, so this scales to any file size."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System;\nusing System.IO;\n\nstring source = Path.Combine(Path.GetTempPath(), \"server.log\");\nstring report = Path.Combine(Path.GetTempPath(), \"errors-report.txt\");\n\nFile.WriteAllText(source,\n    \"\"\"\n    GET /home 200\n    GET /api/orders 500\n    POST /api/login 200\n    GET /api/orders 500\n    GET /favicon.ico 404\n    \"\"\");\n\n// Both the reader and the writer are disposed at the end of the method.\nusing StreamReader reader = new(source);\nusing StreamWriter writer = new(report);   // overwrites; pass append:true to add instead\n\nwriter.WriteLine(\"=== Server errors (status 500) ===\");\nint count = 0;\n\nstring? line;\nwhile ((line = reader.ReadLine()) is not null)\n{\n    if (line.EndsWith(\"500\"))\n    {\n        writer.WriteLine(line);\n        count++;\n    }\n}\n\nwriter.WriteLine($\"Total: {count} error(s).\");\n// writer.Dispose() (at scope end) flushes the buffer and closes the file.\n\nConsole.WriteLine($\"Wrote report to {Path.GetFileName(report)} ({count} errors).\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Wrote report to errors-report.txt (2 errors)."
    },
    {
      "kind": "output",
      "label": "Contents of errors-report.txt",
      "output": "=== Server errors (status 500) ===\nGET /api/orders 500\nGET /api/orders 500\nTotal: 2 error(s)."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: let using flush for you, and pass append:true for logs",
      "text": "`StreamWriter` buffers writes for speed, so the last lines may sit in memory until the buffer fills. `Dispose()` (triggered by `using`) **flushes** that buffer to disk — which is exactly why forgetting `using` can silently lose your final lines. For append-style logging, use `new StreamWriter(path, append: true)` (or the shorthand `File.AppendText(path)`) so each run adds to the file instead of overwriting it."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Buffering: why streams are fast",
      "id": "buffering"
    },
    {
      "kind": "paragraph",
      "text": "Hitting the disk for every single line would be painfully slow — disk and OS calls are expensive. So `StreamReader` and `StreamWriter` keep an in-memory **buffer**. The reader fills its buffer with one big disk read and then serves your `ReadLine()` calls from memory until it's empty, then refills. The writer collects your `WriteLine()` calls in its buffer and flushes them to disk in big batches. You get the *convenience* of line-at-a-time code with the *performance* of bulk I/O. The default text buffer is modest — about a kilobyte (1024 chars) in the current runtime — but the exact size is an implementation detail you shouldn't hard-code expectations around. You can tune it via a constructor overload, but the defaults are well chosen; only touch them after measuring a real bottleneck. If you ever need a write to land on disk immediately without disposing yet, call `writer.Flush()`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "FileStream: the raw byte conveyor underneath",
      "id": "filestream"
    },
    {
      "kind": "paragraph",
      "text": "`StreamReader`/`StreamWriter` are **text** wrappers — they handle encoding (UTF-8 by default) and give you `ReadLine`/`WriteLine`. Underneath them sits `FileStream`, the raw stream of **bytes** straight from the file. You reach for `FileStream` directly when you're working with binary data (images, compressed archives, custom formats) or when you need fine control — for example, to opt into true OS-level async I/O. You can also hand a `FileStream` to a `StreamReader` when you want both: byte-level options *and* convenient line reading."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System;\nusing System.IO;\nusing System.Threading.Tasks;\n\nstring path = Path.Combine(Path.GetTempPath(), \"huge.log\");\nawait File.WriteAllTextAsync(path, \"alpha\\nbeta\\nERROR boom\\ngamma\\nERROR crash\\n\");\n\n// Open a FileStream with async + read-ahead hints, then wrap it for line reading.\nvar options = new FileStreamOptions\n{\n    Mode = FileMode.Open,\n    Access = FileAccess.Read,\n    Options = FileOptions.Asynchronous | FileOptions.SequentialScan\n};\n\nusing var stream = new FileStream(path, options);\nusing var reader = new StreamReader(stream);\n\nint errors = 0;\nstring? line;\nwhile ((line = await reader.ReadLineAsync()) is not null)   // non-blocking read\n{\n    if (line.Contains(\"ERROR\")) errors++;\n}\n\nConsole.WriteLine($\"Found {errors} ERROR lines without blocking the thread.\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "Found 2 ERROR lines without blocking the thread."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: stream + async in servers",
      "text": "In an ASP.NET Core app or any server, prefer the **async** methods — `ReadLineAsync`, `WriteLineAsync`, `ReadToEndAsync` — and open files with `FileOptions.Asynchronous`. Synchronous `ReadLine()` blocks a thread-pool thread while the disk works; under load that starves your server of threads and tanks throughput. Stream **and** go async, and pass a `CancellationToken` so a slow read can be cancelled. (Never call `.Result` or `.Wait()` to fake-sync an async call — that's a classic way to deadlock.)"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "A real-world shape: tallying a large log",
      "id": "real-world-log"
    },
    {
      "kind": "paragraph",
      "text": "Tying it together — here's the kind of one-off you genuinely write on the job: scan a big log, tally HTTP status codes, and print a summary. It streams, so the log could be 50 MB or 50 GB and memory use barely moves. The `using` keeps the handle tidy even if a malformed line makes us bail early."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System;\nusing System.Collections.Generic;\nusing System.IO;\n\nstring path = Path.Combine(Path.GetTempPath(), \"access.log\");\nFile.WriteAllText(path,\n    \"\"\"\n    GET /home 200\n    GET /api/orders 500\n    POST /api/login 200\n    GET /api/orders 500\n    GET /favicon.ico 404\n    GET /home 200\n    \"\"\");\n\nvar counts = new Dictionary<string, int>();\n\nusing StreamReader reader = new(path);\nstring? line;\nwhile ((line = reader.ReadLine()) is not null)\n{\n    string status = line[^3..];                 // last 3 chars = the status code\n    counts[status] = counts.GetValueOrDefault(status) + 1;\n}\n\nforeach (var (status, n) in counts)\n    Console.WriteLine($\"{status}: {n}\");"
    },
    {
      "kind": "output",
      "label": "Console output",
      "output": "200: 3\n500: 2\n404: 1"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why the counts come out 200, 500, 404",
      "text": "`Dictionary<TKey, TValue>` enumerates roughly in **insertion order** as long as you only add (never remove) — and we first *see* `200`, then `500`, then `404` walking the file top to bottom. Useful for a tidy demo, but treat it as an implementation detail, not a guarantee: if order matters in real code, sort explicitly (e.g. `counts.OrderBy(kv => kv.Key)`) rather than relying on it."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`File.ReadAllText`/`ReadAllLines` load the **whole file** into memory — fine for small files, dangerous (`OutOfMemoryException`) for large ones.",
        "`StreamReader.ReadLine()` reads **one line at a time** with near-constant memory; loop with `while ((line = reader.ReadLine()) is not null)` — `null` (not `\"\"`) means end of file.",
        "`StreamWriter.WriteLine()` streams output to disk through a buffer; pass `append: true` (or use `File.AppendText`) to add to a file instead of overwriting it.",
        "Always wrap readers/writers/streams in **`using`** — it's `try`/`finally` from the exceptions topic, the C# analog of Python's `with`, and it closes the handle and **flushes** buffered data. Forget it and you leak handles and lose unflushed writes.",
        "**Buffering** is why streams stay fast: bulk disk reads/writes serve your line-by-line calls from memory. The exact default size (~1 KB today) is an implementation detail — don't hard-code assumptions about it.",
        "`FileStream` is the raw **byte** stream under the text readers — use it for binary data or to enable true async I/O (`FileOptions.Asynchronous`).",
        "In servers, prefer the **async** methods (`ReadLineAsync`, `WriteLineAsync`) with a `CancellationToken`; never block on `.Result`/`.Wait()`.",
        "If you just want lazy reading with less ceremony, `File.ReadLines(path)` (no `All`) streams under the hood and is the easy default."
      ]
    }
  ]
};
