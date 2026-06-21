import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  "slug": "paths",
  "number": 3,
  "title": "Paths — Path.Combine & the File System",
  "objective": "Build and inspect file paths correctly across Windows/macOS/Linux with the Path class, and use Directory/File existence checks.",
  "blocks": [
    {
      "kind": "lead",
      "text": "A file path is just a string — which is exactly why it is so easy to get wrong. The day your code runs on a teammate's Windows laptop, or in a Linux container in production, a single hand-typed `\"/\"` or `\"\\\\\"` becomes a bug. This lesson is about treating paths as **structured data** instead of glued-together strings, using the `Path` class that ships in the box."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor everything in one demo: a small report-exporter that writes `exports/2026/summary.csv`. Reuse that scenario across `Path.Combine`, the inspector methods, and the existence checks so students see one coherent story, not ten disconnected snippets.",
        "The single biggest 'aha' is that `Path.Combine` is NOT string concatenation — show the absolute-segment reset (`Path.Combine(\"logs\", \"/absolute\", \"x\")` returns `/absolute/x`). It surprises everyone and prevents a class of security bugs.",
        "Python students reach for `os.path.join` / `pathlib` instinctively; lean on that — `Path.Combine` is `os.path.join`, the `Path.GetXxx` family is `os.path.basename/dirname/splitext`, and `Path.Exists` is `os.path.exists`. The thing they DON'T have a Python reflex for is the working-directory-vs-binary-directory trap.",
        "Drive home that these are pure string operations: `Path.GetExtension` does not open the file, and `Path.Combine` does not create anything on disk. Only the `Directory`/`File` calls touch the disk. Keeping that line clear avoids a lot of confusion.",
        "Mention the two edge cases of `Path.GetDirectoryName` so they aren't surprised later: a bare name like `\"report.csv\"` returns an empty string, but a root like `\"/\"` returns **`null`** (the root has no parent). That's why you'll sometimes see a `!` null-forgiving operator after `GetDirectoryName` — and why robust code handles the null.",
        "`Path.Exists` is newer than the `File.Exists`/`Directory.Exists` pair — it arrived in .NET 7. If a student is stuck on an older runtime they won't have it; on .NET 10 it's always there. Worth a one-line aside.",
        "If you have time, live-edit the demo on macOS and point out the `/` separators in the output, then explain it would print `\\` on Windows — same code, correct on both. That is the whole point in one move."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Why not just glue strings together?",
      "id": "why-not-strings"
    },
    {
      "kind": "paragraph",
      "text": "In Python you learned early not to write `dir + \"/\" + name` and to use `os.path.join` (or `pathlib.Path`) instead. C# has the exact same rule, and the exact same reason: **path separators differ by operating system**. Windows uses backslash `\\`, while macOS and Linux use forward slash `/`. If you hard-code either one, your code is quietly wrong on the other platform — and modern .NET apps routinely build on a Mac, run in CI on Linux, and get debugged on Windows."
    },
    {
      "kind": "paragraph",
      "text": "The fix is `System.IO.Path`, a static helper class. Think of it as the typed, cross-platform cousin of Python's `os.path` and `pathlib`. Its job is to build, split, and inspect path strings *correctly for whatever OS you happen to be running on*. The headline method is `Path.Combine`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// Path.Combine joins segments with the RIGHT separator for this OS.\nstring reportPath = Path.Combine(\"reports\", \"2026\", \"summary.txt\");\nConsole.WriteLine(reportPath);\n\n// It is smart about separators already present in a segment:\nConsole.WriteLine(Path.Combine(\"/var/data\", \"cache\"));\n\n// And — this one surprises everyone — an absolute segment RESETS the path:\nConsole.WriteLine(Path.Combine(\"logs\", \"/absolute\", \"x.txt\"));"
    },
    {
      "kind": "output",
      "label": "On macOS / Linux (Windows would print \\ instead of /)",
      "output": "reports/2026/summary.txt\n/var/data/cache\n/absolute/x.txt"
    },
    {
      "kind": "paragraph",
      "text": "Notice two things. First, you never typed a separator yourself — `Path.Combine` inserted `/` (or `\\` on Windows) for you. Second, that last line: because `\"/absolute\"` *starts* with a rooted separator, `Path.Combine` throws away everything before it and starts over. That behaviour matches Python's `os.path.join` and exists on purpose, but it is also a classic security trap, which we'll flag below."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "The absolute-segment reset is a real security bug source",
      "text": "`Path.Combine(baseDir, userInput)` looks safe, but if `userInput` is an absolute path like `\"/etc/passwd\"` (or `\"C:\\\\secrets\"`), the result **ignores `baseDir` entirely**. Combined with `\"..\\\\..\\\\\"` segments, this is how *path-traversal* attacks escape an upload folder. Never feed raw user input straight into `Path.Combine` for a destination you intend to confine — validate it, strip rooting, then call `Path.GetFullPath(...)` and verify the result still starts with your intended base directory before you write."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Taking a path apart: the inspector methods",
      "id": "inspecting-paths"
    },
    {
      "kind": "paragraph",
      "text": "Just as often as you build a path, you need to pull pieces *out* of one: the file name to show a user, the extension to decide how to parse a file, the directory to create it. The `Path` class has a small, memorable family for this. These are pure string operations — they don't touch the disk and don't care whether the file actually exists."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "string p = \"/var/data/reports/q1.csv\";\n\nConsole.WriteLine(Path.GetFileName(p));               // file + extension\nConsole.WriteLine(Path.GetFileNameWithoutExtension(p));// just the stem\nConsole.WriteLine(Path.GetExtension(p));              // includes the dot\nConsole.WriteLine(Path.GetDirectoryName(p));          // the containing folder\n\n// GetExtension returns only the LAST extension:\nConsole.WriteLine(Path.GetExtension(\"archive.tar.gz\"));"
    },
    {
      "kind": "output",
      "output": "q1.csv\nq1\n.csv\n/var/data/reports\n.gz"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python (os.path / pathlib)",
          "items": [
            "`os.path.join(a, b)`",
            "`os.path.basename(p)`",
            "`os.path.splitext(p)[0]` → stem",
            "`os.path.splitext(p)[1]` → ext",
            "`os.path.dirname(p)`",
            "`os.path.exists(p)`"
          ]
        },
        {
          "title": "C# (System.IO.Path)",
          "items": [
            "`Path.Combine(a, b)`",
            "`Path.GetFileName(p)`",
            "`Path.GetFileNameWithoutExtension(p)`",
            "`Path.GetExtension(p)` (keeps the dot)",
            "`Path.GetDirectoryName(p)`",
            "`Path.Exists(p)`"
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "These methods are forgiving — but mind the two edge cases",
      "text": "A bare file name like `\"report.csv\"` has no directory, so `Path.GetDirectoryName(\"report.csv\")` returns an **empty string** (not an error). `Path.GetExtension(\"Makefile\")` returns `\"\"` because there's no dot. There's one trap, though: for a root such as `\"/\"` (or `\"C:\\\\\"`), `Path.GetDirectoryName` returns **`null`**, because a root has no parent. That's why `GetDirectoryName` is declared as returning `string?` and why you'll occasionally need to null-check it (or use `!` when you *know* the path has a folder, as in the sibling-file example later)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Relative vs absolute, and the trap that bites everyone",
      "id": "relative-vs-absolute"
    },
    {
      "kind": "paragraph",
      "text": "A path is **absolute** if it fully specifies a location from a root: `/var/data/q1.csv` on Linux/macOS, or `C:\\data\\q1.csv` on Windows. A path is **relative** (`reports/q1.csv`) if it must be resolved *against some starting directory*. The all-important question is: which starting directory? In C#, a relative path resolves against `Environment.CurrentDirectory` — the **current working directory**, i.e. wherever the process was launched from. Use `Path.GetFullPath` to see exactly what a relative path expands to, and `Path.IsPathRooted` to test whether a path is absolute."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "Console.WriteLine(Path.IsPathRooted(\"reports/x.txt\"));  // relative\nConsole.WriteLine(Path.IsPathRooted(\"/var/x.txt\"));      // absolute\n\nConsole.WriteLine($\"CurrentDirectory : {Environment.CurrentDirectory}\");\nConsole.WriteLine($\"BaseDirectory    : {AppContext.BaseDirectory}\");\n\n// A relative path resolves against CurrentDirectory, NOT the .exe folder:\nConsole.WriteLine($\"Full of relative : {Path.GetFullPath(\"config.json\")}\");"
    },
    {
      "kind": "output",
      "label": "Run with `dotnet run` from a project at /private/tmp/pt1",
      "output": "False\nTrue\nCurrentDirectory : /private/tmp/pt1\nBaseDirectory    : /private/tmp/pt1/bin/Debug/net10.0/\nFull of relative : /private/tmp/pt1/config.json"
    },
    {
      "kind": "paragraph",
      "text": "Look closely at those last three lines — they expose the single most common file-path bug in real .NET apps. The **current directory** (`/private/tmp/pt1`) is *not* the folder your compiled program actually lives in (`/private/tmp/pt1/bin/Debug/net10.0/`). During `dotnet run` from the project root they look unrelated; in production, a service started by systemd or IIS might have a current directory of `/` or `C:\\Windows\\System32`. So `File.ReadAllText(\"config.json\")` that 'works on my machine' throws `FileNotFoundException` on the server — because it's now looking in the wrong place entirely."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: anchor bundled files to AppContext.BaseDirectory",
      "text": "When you ship a file *alongside your app* (a template, a seed JSON, a bundled data file), don't rely on the current directory. Build an absolute path from `AppContext.BaseDirectory`, which is the folder your assembly was loaded from: `var cfg = Path.Combine(AppContext.BaseDirectory, \"config.json\");`. It's stable no matter where or how the process was launched. (For user-chosen files — an upload, a path from a config setting — take an absolute path from the user instead.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Checking what's actually on disk: File, Directory, and Path.Exists",
      "id": "existence-checks"
    },
    {
      "kind": "paragraph",
      "text": "Everything so far was pure string manipulation. To ask 'does this *really* exist?' you finally touch the file system. There are three checks, and the difference between them matters: `File.Exists` is true only for a **file**, `Directory.Exists` is true only for a **directory**, and `Path.Exists` (added in .NET 7) is true for **either**. `Directory.CreateDirectory` makes a folder — and is happily idempotent: it creates every missing parent and does nothing if the folder is already there, so you never need to guard it with an `if`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "string dir  = Path.Combine(Path.GetTempPath(), \"demo_exports\");\nstring file = Path.Combine(dir, \"report.csv\");\n\nConsole.WriteLine(Directory.Exists(dir));   // not created yet\nConsole.WriteLine(File.Exists(file));       // not created yet\n\nDirectory.CreateDirectory(dir);             // makes it (and any parents); safe to repeat\nConsole.WriteLine(Directory.Exists(dir));   // now true\n\nFile.WriteAllText(file, \"id,name\\n1,Ada\\n\");\nConsole.WriteLine(File.Exists(file));       // true\n\n// The crucial distinction — wrong-kind checks return false:\nConsole.WriteLine(Directory.Exists(file));  // false: it's a file, not a dir\nConsole.WriteLine(File.Exists(dir));        // false: it's a dir, not a file\n\n// Path.Exists doesn't care which kind it is:\nConsole.WriteLine(Path.Exists(file));       // true\nConsole.WriteLine(Path.Exists(dir));        // true"
    },
    {
      "kind": "output",
      "output": "False\nFalse\nTrue\nTrue\nFalse\nFalse\nTrue\nTrue"
    },
    {
      "kind": "paragraph",
      "text": "Here's the whole pattern in one professional-grade move — the kind of thing you'd write in a report exporter or a file-cache: build the path with `Path.Combine`, guarantee the directory with `CreateDirectory`, then write. No hand-typed separators, no `if (!Exists) Create` dance, and it runs identically on Windows, macOS, and Linux."
    },
    {
      "kind": "examples",
      "intro": "A few more real-world one-liners you'll reach for constantly:",
      "examples": [
        {
          "label": "Build an output path under a per-year folder and ensure it exists",
          "code": "string outDir = Path.Combine(AppContext.BaseDirectory, \"exports\", DateTime.Now.Year.ToString());\nDirectory.CreateDirectory(outDir);\nstring outFile = Path.Combine(outDir, \"summary.csv\");\nConsole.WriteLine(outFile);",
          "output": "/app/bin/Debug/net10.0/exports/2026/summary.csv"
        },
        {
          "label": "Route a file by its extension (e.g. an upload handler)",
          "code": "string upload = \"invoice-2026.PDF\";\nstring kind = Path.GetExtension(upload).ToLowerInvariant() switch\n{\n    \".pdf\"          => \"document\",\n    \".png\" or \".jpg\" => \"image\",\n    _               => \"unknown\"\n};\nConsole.WriteLine(kind);",
          "output": "document"
        },
        {
          "label": "Derive a sibling file name (swap .csv for .json) without string surgery",
          "code": "string csv  = Path.Combine(\"data\", \"q1.csv\");\nstring json = Path.Combine(\n    Path.GetDirectoryName(csv)!,   // ! : we know this path has a folder\n    Path.GetFileNameWithoutExtension(csv) + \".json\");\nConsole.WriteLine(json);",
          "output": "data/q1.json"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Don't use Exists for 'check then act' on critical paths",
      "text": "`if (File.Exists(p)) File.Delete(p);` has a race condition — another process can delete or create the file in the gap between the check and the action (a TOCTOU bug). `Exists` is great for friendly UX (\"that folder is empty\") and for the idempotent setup shown above, but for the real operation, just attempt it and catch the specific exception — `FileNotFoundException`, `DirectoryNotFoundException`, `IOException`, or `UnauthorizedAccessException`. The disk is the source of truth, not a stale boolean."
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Interview-ready summary",
      "text": "When asked 'why `Path.Combine` over string concatenation?', say: it inserts the correct OS separator, normalizes duplicate separators, and handles rooted segments — making the same code correct on Windows, macOS, and Linux. Bonus points for mentioning that relative paths resolve against `Environment.CurrentDirectory`, which is why bundled files should be anchored to `AppContext.BaseDirectory`."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**Never hand-concatenate paths.** Use `Path.Combine(...)` — it inserts the right separator for the OS, so one code path works on Windows, macOS, and Linux. It's C#'s `os.path.join`.",
        "Take paths apart with `Path.GetFileName`, `GetFileNameWithoutExtension`, `GetExtension` (keeps the dot, last extension only), and `GetDirectoryName`. These are pure string ops — they never touch the disk. Note `GetDirectoryName` returns `\"\"` for a bare name and `null` for a root.",
        "**Relative paths resolve against `Environment.CurrentDirectory`** (where the process launched), *not* the binary's folder. For files you ship with your app, build an absolute path from `AppContext.BaseDirectory`.",
        "`File.Exists` ⇒ file only; `Directory.Exists` ⇒ directory only; `Path.Exists` (since .NET 7) ⇒ either. A wrong-kind check returns `false`, not an error.",
        "`Directory.CreateDirectory` is idempotent and creates missing parents — no `if (!Exists)` guard needed. The 'combine path → create dir → write' trio is your everyday file-output pattern.",
        "Use `Exists` for friendly UX and idempotent setup, but for the real read/write/delete just attempt it and catch the specific I/O exception — checking first invites a race condition."
      ]
    }
  ]
};
