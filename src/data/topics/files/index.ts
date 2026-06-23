import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';

export const files: Topic = {
  slug: "files",
  title: "Files & Serialization",
  subtitle: "Read and write files, handle paths cross-platform, and serialize data to JSON and CSV with System.Text.Json — every line-of-business app needs this.",
  status: 'unlocked',
  lessons: [
    {
      ...lesson01,
      questions: [
        {
          "id": "files-q1",
          "kind": "mcq",
          "prompt": "You need to load a small configuration file (a few KB) entirely into a `string` in one call. Which `File` helper is the right fit?",
          "options": [
            {
              "label": "`File.ReadAllText(path)`",
              "correct": true
            },
            {
              "label": "`File.ReadLines(path)` — it returns the whole file as a string",
              "correct": false
            },
            {
              "label": "`File.OpenRead(path)` — it returns the text directly",
              "correct": false
            },
            {
              "label": "`File.GetText(path)`",
              "correct": false
            }
          ],
          "explanation": "`File.ReadAllText(path)` opens the file, reads all of it into a single `string`, and closes the handle for you — perfect for small whole-file reads. It is the C# cousin of Python's `open(path).read()`. `File.ReadLines` returns an `IEnumerable<string>` that streams lazily (like a generator), not a single string. `File.OpenRead` returns a `FileStream` of bytes, not text. There is no `File.GetText`. In real apps you'd often prefer the async variant `File.ReadAllTextAsync(path, cancellationToken)` so you never block a thread while waiting on disk."
        },
        {
          "id": "files-q2",
          "kind": "mcq",
          "prompt": "In an ASP.NET Core request handler you must read a file from disk. Why is `await File.ReadAllTextAsync(path)` preferred over `File.ReadAllText(path)`?",
          "options": [
            {
              "label": "The async version frees the thread to serve other requests while the OS performs the I/O, avoiding thread-pool starvation under load",
              "correct": true
            },
            {
              "label": "The async version reads the file faster because it uses more CPU cores",
              "correct": false
            },
            {
              "label": "The sync version corrupts the file if two requests read it at once",
              "correct": false
            },
            {
              "label": "There is no difference; the compiler rewrites one into the other",
              "correct": false
            }
          ],
          "explanation": "Async I/O is about scalability, not raw speed of a single read. `File.ReadAllText` blocks the current thread-pool thread until the disk finishes; under load that exhausts the thread pool and your server stops accepting requests (thread-pool starvation). `await ...Async` releases the thread back to the pool during the wait, so it can serve other requests. The async path is not faster per-call and adds tiny overhead — its win is throughput. Also avoid `.Result`/`.Wait()` on async calls in ASP.NET: they re-block the thread and can deadlock."
        },
        {
          "id": "files-q3",
          "kind": "predict",
          "prompt": "A temp file is written with two `WriteLine` calls inside a `using` block, then read back. What does this print?",
          "code": "using System.IO;\n\nstring path = Path.Combine(Path.GetTempPath(), \"log.txt\");\n\nusing (var writer = new StreamWriter(path))\n{\n    writer.WriteLine(\"line1\");\n    writer.WriteLine(\"line2\");\n}\n\nstring[] lines = File.ReadAllLines(path);\nConsole.WriteLine(lines.Length);",
          "options": [
            {
              "label": "2",
              "correct": true
            },
            {
              "label": "1",
              "correct": false
            },
            {
              "label": "0 — the data was never flushed",
              "correct": false
            },
            {
              "label": "3",
              "correct": false
            }
          ],
          "explanation": "`WriteLine` writes the text plus a line terminator, so the file contains `line1\\n line2\\n` (two lines). `File.ReadAllLines` splits on line breaks and does not produce a phantom empty entry for the trailing newline, so `lines.Length` is `2`. The key detail: the `using` block disposes the `StreamWriter` at its closing brace, which flushes the buffer and closes the handle. Without `using` (or an explicit `Dispose`/`Flush`), buffered text might not be on disk yet and other processes could hit 'file in use'. C# does not auto-close on scope exit the way you might hope — `using` is what guarantees it, much like Python's `with open(...) as f:`."
        },
        {
          "id": "files-q6",
          "kind": "fill",
          "prompt": "Before reading a file, you want to guard against it not existing. Fill in the `File` method that returns a `bool` indicating whether the file is present.",
          "template": "if (!File.___(path))\n    throw new FileNotFoundException(\"Config missing\", path);",
          "accept": [
            "Exists"
          ],
          "explanation": "`File.Exists(path)` returns `true` if the path refers to an existing file (and `false` if it's missing, or if the path is actually a directory). Its sibling `Directory.Exists(path)` checks for a folder. Note a subtlety for robustness: even after `File.Exists` returns `true`, the file could be deleted a microsecond later by another process, so production code still wraps the actual read in a `try/catch` for `FileNotFoundException`/`IOException` rather than relying on the check alone."
        }
      ],
      challenges: [
        {
          "id": "files-p1",
          "difficulty": "easy",
          "title": "Save and reload a quick note",
          "prompt": "Write a tiny console app that saves a note to disk and reads it back.\n\n- Create a string variable holding a short note (e.g. \"Remember to push the release on Friday.\").\n- Use `File.WriteAllText` to write it to a file named `note.txt`.\n- Then use `File.ReadAllText` to read the file back into a new variable.\n- Print the text you read back to the console, prefixed with `Loaded: `.\n- Run the program twice. Confirm it still works the second time (the file already exists) and explain in a comment why `WriteAllText` doesn't append.\n\nThis is the C# equivalent of Python's `open('note.txt','w').write(...)` then `open('note.txt').read()`.",
          "hints": [
            "`File` lives in `System.IO`, but it's available by default with implicit usings in .NET 10.",
            "`File.WriteAllText` overwrites any existing file every time — it does not append.",
            "Look in your project's output/run directory for `note.txt` if you want to see it on disk."
          ]
        },
        {
          "id": "files-p2",
          "difficulty": "easy",
          "title": "Append-only activity log",
          "prompt": "Build a simple logger that adds a line every time it runs, without erasing previous lines.\n\n- Compose a log line like `2026-06-20 14:03:12  App started` using `DateTime.Now` (use `ToString(\"yyyy-MM-dd HH:mm:ss\")`).\n- Use `File.AppendAllText` to append that line (plus a newline) to `app.log`.\n- Run the program 3 times.\n- Then read the whole file with `File.ReadAllLines`, and print how many lines it now contains and the contents.\n\nContrast this with problem 1: explain in a comment when you'd choose `AppendAllText` vs `WriteAllText`.",
          "hints": [
            "Add `Environment.NewLine` (or `\"\\n\"`) to the end of each log line so entries land on separate lines.",
            "`File.ReadAllLines` returns a `string[]`; use `.Length` for the count.",
            "`File.AppendAllText` creates the file if it doesn't exist yet, then appends thereafter."
          ]
        },
        {
          "id": "files-p3",
          "difficulty": "easy",
          "title": "Async read in a real-world flavor",
          "prompt": "Real apps (web servers, desktop UIs) almost always use the async file APIs so they don't block a thread. Rewrite a small read/write flow using them.\n\n- In an `async` method (top-level statements let you `await` directly), write the text \"config v1\" to `settings.txt` using `File.WriteAllTextAsync`.\n- Read it back with `File.ReadAllTextAsync` and print it.\n- In a comment, explain why a web API endpoint should prefer `ReadAllTextAsync` over `ReadAllText`, and why calling `.Result` on the task instead of `await` is a bad idea.",
          "hints": [
            "Top-level statements allow `await` without writing your own `Main` signature.",
            "The async versions return a `Task`/`Task<string>` you `await`.",
            "Blocking on `.Result`/`.Wait()` can starve the thread pool and even deadlock in some contexts — always `await`."
          ]
        }
      ]
    },
    {
      ...lesson02,
      questions: [
        {
          "id": "files-q4",
          "kind": "mcq",
          "prompt": "You must process a 4 GB log file and count lines matching a pattern, without risking an OutOfMemoryException. Which approach is correct?",
          "options": [
            {
              "label": "Loop over `File.ReadLines(path)` (or a `StreamReader.ReadLine()` loop) so lines stream one at a time",
              "correct": true
            },
            {
              "label": "`File.ReadAllText(path)` then `.Split('\\n')`",
              "correct": false
            },
            {
              "label": "`File.ReadAllLines(path)` then iterate the array",
              "correct": false
            },
            {
              "label": "`File.ReadAllBytes(path)` then decode to a string",
              "correct": false
            },
            {
              "label": "Open the file in Excel and export the count",
              "correct": false
            }
          ],
          "explanation": "`File.ReadLines` returns a lazy `IEnumerable<string>` backed by a `StreamReader`: it reads and yields one line at a time, so memory stays roughly constant no matter how big the file is — the streaming analog of a Python generator. `File.ReadAllText`, `ReadAllLines`, and `ReadAllBytes` all pull the entire file into memory at once, which blows up on multi-gigabyte files. A manual `using var reader = new StreamReader(path); while ((line = reader.ReadLine()) != null) { ... }` loop is equally valid and gives you finer control."
        },
        {
          "id": "files-q13",
          "kind": "predict",
          "prompt": "A `StreamReader` loop reads to end-of-file. What does this print for a file containing exactly two lines (`alpha` and `beta`)?",
          "code": "using System.IO;\n\nusing var reader = new StreamReader(\"two.txt\");\nint count = 0;\nstring? line;\nwhile ((line = reader.ReadLine()) != null)\n{\n    count++;\n}\nConsole.WriteLine(count);",
          "options": [
            {
              "label": "2",
              "correct": true
            },
            {
              "label": "3 — the trailing newline yields one extra empty line",
              "correct": false
            },
            {
              "label": "Infinite loop — `ReadLine` returns an empty string at EOF, not null",
              "correct": false
            },
            {
              "label": "0 — `using var` closes the file before the loop runs",
              "correct": false
            }
          ],
          "explanation": "`StreamReader.ReadLine()` returns each line in turn and then returns `null` — not an empty string — once there is nothing left, which is exactly why `while ((line = reader.ReadLine()) != null)` is the canonical streaming loop. Two lines means two iterations, so `count` is `2`; a trailing newline does not manufacture a phantom third line. `using var` disposes the reader at the END of the enclosing scope, not before the loop, so the handle stays open while you read. This is the direct analog of Python's lazy `for line in open(path):`."
        }
      ],
      challenges: [
        {
          "id": "files-p4",
          "difficulty": "medium",
          "title": "Count error lines in a large log with StreamReader",
          "prompt": "You're handed a multi-gigabyte log file and asked to count how many lines contain the word `ERROR` — without loading the whole file into memory.\n\n- First, generate a test file `big.log`: write ~50 lines, sprinkling the word `ERROR` into some of them (a loop with `File.AppendAllText` or `StreamWriter` is fine for setup).\n- Then open it with a `StreamReader` inside a `using` block (or `using var`).\n- Loop with `ReadLine()` until it returns `null`, counting lines that contain `ERROR` (use `line.Contains(\"ERROR\")`).\n- Print the total error count.\n\nIn a comment, explain why `StreamReader` + `ReadLine` is the right tool here instead of `File.ReadAllLines`, and what the `using` block guarantees.",
          "hints": [
            "`using var reader = new StreamReader(\"big.log\");` disposes the reader (and closes the file handle) at the end of scope.",
            "`reader.ReadLine()` returns `null` at end of file — that's your loop's stop condition.",
            "`File.ReadAllLines` would pull the entire file into a `string[]` in memory; streaming reads one line at a time. `File.ReadLines` is a lazy alternative too."
          ]
        },
        {
          "id": "files-p5",
          "difficulty": "medium",
          "title": "Filter a file into a new file with StreamReader + StreamWriter",
          "prompt": "Write a streaming filter: copy only the lines you care about from one file to another, reading and writing incrementally.\n\n- Given an input file `access.log` (create a sample with ~20 lines, some containing `404`), produce `errors.log` containing only the lines that include `404`.\n- Open the input with a `StreamReader` and the output with a `StreamWriter`, BOTH inside `using` blocks.\n- Loop line-by-line: for each matching line, call `writer.WriteLine(line)`.\n- After the loop, print how many lines were written.\n\nRequirements:\n- Do NOT read the whole input into memory.\n- Make sure the writer is disposed so its buffer is flushed to disk (explain in a comment what happens if you forget).",
          "hints": [
            "You can nest two `using` statements, or stack them: `using var reader = ...; using var writer = ...;`.",
            "`StreamWriter`'s constructor `new StreamWriter(\"errors.log\")` overwrites; pass `append: true` to append instead.",
            "If you never dispose/flush the writer, buffered text may never reach disk — `using` handles that deterministically (like Python's `with`)."
          ]
        }
      ]
    },
    {
      ...lesson03,
      questions: [
        {
          "id": "files-q5",
          "kind": "predict",
          "prompt": "Running on macOS/Linux, what does this print?",
          "code": "using System.IO;\n\nstring path = Path.Combine(\"data\", \"users\", \"ada.json\");\nConsole.WriteLine(path);\nConsole.WriteLine(Path.GetFileName(path));\nConsole.WriteLine(Path.GetExtension(path));",
          "options": [
            {
              "label": "data/users/ada.json\\nada.json\\n.json",
              "correct": true
            },
            {
              "label": "data\\\\users\\\\ada.json\\nada.json\\njson",
              "correct": false
            },
            {
              "label": "data/users/ada.json\\nada\\njson",
              "correct": false
            },
            {
              "label": "datausersada.json\\nada.json\\n.json",
              "correct": false
            }
          ],
          "explanation": "`Path.Combine` joins segments using the platform's directory separator — `/` on macOS/Linux (it would be `\\` on Windows), which is exactly why you use it instead of hand-concatenating strings. `Path.GetFileName` returns the last segment, `ada.json`. `Path.GetExtension` returns the extension **including the leading dot**: `.json`, not `json`. Writing paths with `Path.Combine` keeps your code cross-platform, a must for code that runs on a Mac laptop but deploys to Linux containers."
        },
        {
          "id": "files-q14",
          "kind": "predict",
          "prompt": "`Path.Combine` is NOT string concatenation. What does this print on macOS/Linux?",
          "code": "using System.IO;\n\nstring p = Path.Combine(\"logs\", \"/etc/passwd\", \"x.txt\");\nConsole.WriteLine(p);",
          "options": [
            {
              "label": "/etc/passwd/x.txt",
              "correct": true
            },
            {
              "label": "logs/etc/passwd/x.txt",
              "correct": false
            },
            {
              "label": "logs//etc/passwd/x.txt",
              "correct": false
            },
            {
              "label": "It throws an ArgumentException for the absolute segment",
              "correct": false
            }
          ],
          "explanation": "When any segment passed to `Path.Combine` is an **absolute** path (here `/etc/passwd` starts with the root separator), `Path.Combine` discards everything before it and starts over from that absolute segment. So the leading `logs` is thrown away and the result is `/etc/passwd/x.txt`. This surprises almost everyone — it is not naive concatenation, and it is a genuine security trap: if you blindly `Path.Combine` a user-supplied segment, an attacker can supply an absolute path (or `../` traversal) to escape your intended directory. Validate untrusted path segments before combining."
        }
      ],
      challenges: [
        {
          "id": "files-p6",
          "difficulty": "medium",
          "title": "Cross-platform paths with Path.Combine",
          "prompt": "Stop hand-concatenating paths — build them correctly so your code runs on Windows, macOS, and Linux.\n\nWrite a program that:\n- Builds a path to `data/exports/report.csv` using `Path.Combine` (never `\"data\" + \"/\" + ...`).\n- Ensures the `data/exports` directory exists using `Directory.CreateDirectory` (it's a no-op if it already exists).\n- Writes a one-line CSV header to that file with `File.WriteAllText`.\n- Then, from the full path, prints each of: `Path.GetFileName`, `Path.GetExtension`, `Path.GetDirectoryName`, and `Path.GetFullPath`.\n- Finally, print `Path.DirectorySeparatorChar` and note in a comment how it differs between OSes.\n\nExplain in a comment why relative paths can behave differently in production (current working directory vs `AppContext.BaseDirectory`).",
          "hints": [
            "`Path.Combine(\"data\", \"exports\", \"report.csv\")` inserts the correct separator for the current OS.",
            "`Directory.CreateDirectory` creates all missing intermediate folders at once and is safe to call repeatedly.",
            "Relative paths resolve against `Environment.CurrentDirectory`, not the EXE folder — use `Path.Combine(AppContext.BaseDirectory, ...)` when you need files next to the binary."
          ]
        },
        {
          "id": "files-p11",
          "difficulty": "easy",
          "title": "Inspect and rebuild a path safely",
          "prompt": "Practice treating a path as structured data instead of a glued-together string.\n\n- Start from a full path you build with `Path.Combine(\"reports\", \"2026\", \"q2\", \"summary.csv\")`.\n- Print each of: `Path.GetDirectoryName`, `Path.GetFileName`, `Path.GetFileNameWithoutExtension`, and `Path.GetExtension`.\n- Then build a NEW path for the same file but with a `.json` extension using `Path.ChangeExtension`, and print it.\n- Finally, print `Path.GetFullPath` of the original and explain in a comment what it resolved the relative path against.\n\nDo NOT use any string concatenation or hard-coded `/` or `\\` anywhere.",
          "hints": [
            "`Path.ChangeExtension(path, \".json\")` swaps the extension and keeps the rest of the path intact.",
            "`Path.GetFileNameWithoutExtension` is the cousin of Python's `os.path.splitext(name)[0]`.",
            "`Path.GetFullPath` resolves a relative path against `Environment.CurrentDirectory` — note that this is the working directory, not the binary's folder."
          ]
        }
      ]
    },
    {
      ...lesson04,
      questions: [
        {
          "id": "files-q7",
          "kind": "predict",
          "prompt": "With default `System.Text.Json` options, what JSON does this print?",
          "code": "using System.Text.Json;\n\nrecord Person(string Name, Status Status);\nenum Status { Inactive, Active, Banned }\n\nvar person = new Person(\"Ada\", Status.Active);\nConsole.WriteLine(JsonSerializer.Serialize(person));",
          "options": [
            {
              "label": "{\"Name\":\"Ada\",\"Status\":1}",
              "correct": true
            },
            {
              "label": "{\"Name\":\"Ada\",\"Status\":\"Active\"}",
              "correct": false
            },
            {
              "label": "{\"name\":\"Ada\",\"status\":\"Active\"}",
              "correct": false
            },
            {
              "label": "{\"name\":\"Ada\",\"status\":1}",
              "correct": false
            }
          ],
          "explanation": "Two defaults trip people up here. First, `System.Text.Json` serializes enums as their **numeric** value by default, so `Status.Active` (the second member, index 1) becomes `1`, not `\"Active\"`. To get readable string names, add a converter: `options.Converters.Add(new JsonStringEnumConverter())`. Second, property names are emitted **as-declared** (PascalCase) by default — `Name`, `Status` — so the camelCase options are wrong here. (ASP.NET Core's pipeline overrides this to camelCase, but a bare `JsonSerializer.Serialize` call does not.)"
        },
        {
          "id": "files-q8",
          "kind": "predict",
          "prompt": "The JSON uses lowercase keys but the record uses PascalCase, and options are left at default. What does this print?",
          "code": "using System.Text.Json;\n\nrecord Person(string Name, int Age);\n\nstring json = \"\"\"{\"name\":\"Bob\",\"age\":42}\"\"\";\nvar p = JsonSerializer.Deserialize<Person>(json)!;\nConsole.WriteLine($\"[{p.Name}] [{p.Age}]\");",
          "options": [
            {
              "label": "[] [0]",
              "correct": true
            },
            {
              "label": "[Bob] [42]",
              "correct": false
            },
            {
              "label": "[bob] [42]",
              "correct": false
            },
            {
              "label": "It throws a JsonException because keys don't match",
              "correct": false
            }
          ],
          "explanation": "By default `System.Text.Json` matches property names **case-sensitively**. The JSON keys `name`/`age` do not match the record properties `Name`/`Age`, so nothing binds: `Name` stays `null` (printed as empty between the brackets) and `Age` stays its default `0`. It does **not** throw — unmatched JSON members are simply ignored by default. This is the classic 'all my properties are null after deserialize' bug. Fixes: set `PropertyNameCaseInsensitive = true`, or use `PropertyNamingPolicy = JsonNamingPolicy.CamelCase` so `Name` maps to `name`. (This is a real difference from Python's `json.loads`, which just hands you a dict with whatever keys were present.)"
        },
        {
          "id": "files-q9",
          "kind": "mcq",
          "prompt": "For performance, why should you create one `JsonSerializerOptions` instance (e.g. a `static readonly` field) and reuse it everywhere instead of `new`-ing one per call?",
          "options": [
            {
              "label": "Building options is expensive and the instance caches type metadata internally; recreating it per call discards that cache and tanks performance",
              "correct": true
            },
            {
              "label": "`JsonSerializerOptions` is a singleton and the constructor throws on the second call",
              "correct": false
            },
            {
              "label": "Reusing it makes the output JSON smaller",
              "correct": false
            },
            {
              "label": "A fresh instance is not thread-safe, but a static one disables threading entirely",
              "correct": false
            }
          ],
          "explanation": "The first time you serialize/deserialize a given type with an options instance, `System.Text.Json` builds and caches reflection-based metadata (contracts) on that instance. A fresh `JsonSerializerOptions` per call throws that cache away every time, forcing it to rebuild — a real, measurable performance hit on hot paths. Once an options instance has been used, it becomes effectively read-only and **is** thread-safe, so a `static readonly JsonSerializerOptions` shared across the app is the recommended pattern. (You can't mutate it after first use — that throws — which is fine because it's meant to be configured once.)"
        },
        {
          "id": "files-q10",
          "kind": "mcq",
          "prompt": "You're consuming untrusted external JSON in .NET 10 and want best-practice strictness: reject unknown properties and reject duplicate keys in one switch. What do you use?",
          "options": [
            {
              "label": "The `JsonSerializerOptions.Strict` preset",
              "correct": true
            },
            {
              "label": "`JsonSerializerOptions.Web`, which validates the payload against your schema",
              "correct": false
            },
            {
              "label": "`BinaryFormatter`, which is safer for untrusted input",
              "correct": false
            },
            {
              "label": "Set `WriteIndented = true` so malformed JSON is easier to reject",
              "correct": false
            }
          ],
          "explanation": "New in .NET 10, `JsonSerializerOptions.Strict` is a single opt-in 'best practices' preset that turns on `JsonUnmappedMemberHandling.Disallow` (throw on unknown JSON properties), disallows duplicate properties, and enables `RespectNullableAnnotations` + `RespectRequiredConstructorParameters`. It's read-compatible with `JsonSerializerOptions.Default`. The duplicate-key default historically kept the **last** value silently — a genuine data-integrity and request-smuggling risk — which `Strict` (or `AllowDuplicateProperties = false`) closes. `WriteIndented` only affects formatting; and `BinaryFormatter` was removed in .NET 9/10 precisely because it's a remote-code-execution hazard on untrusted input — never use it."
        }
      ],
      challenges: [
        {
          "id": "files-p7",
          "difficulty": "medium",
          "title": "Round-trip a record to JSON and back",
          "prompt": "Serialize a C# object to JSON, save it, reload it, and prove the round-trip worked — using `System.Text.Json`.\n\n- Define a `record Product(int Id, string Name, decimal Price, bool InStock);`.\n- Create one `Product` instance.\n- Serialize it with `JsonSerializer.Serialize`, using `JsonSerializerOptions` with `WriteIndented = true` and `PropertyNamingPolicy = JsonNamingPolicy.CamelCase` (to match JS/JSON conventions).\n- Write the JSON to `product.json` with `File.WriteAllText`, and print the JSON.\n- Read it back and `Deserialize<Product>` it; print the resulting object's `Name` and `Price`.\n\nGotcha to handle: because you serialized with camelCase, deserialization must use the SAME options instance (or it may bind to nulls). Store the options in ONE `static readonly` field and reuse it for both calls. Explain in a comment why creating a new `JsonSerializerOptions` per call is wasteful.",
          "hints": [
            "`JsonSerializer.Serialize(product, Options)` and `JsonSerializer.Deserialize<Product>(json, Options)` should share the SAME options.",
            "Records work great with STJ; the constructor parameters map to JSON properties.",
            "Building `JsonSerializerOptions` is expensive and it caches metadata internally — make it `static readonly` and reuse it."
          ]
        },
        {
          "id": "files-p8",
          "difficulty": "hard",
          "title": "Robust JSON config loader with enums and error handling",
          "prompt": "Load an application config from JSON the way a real service does: typed, with readable enums, tolerant of casing, and with proper error handling.\n\n- Define `enum LogLevel { Trace, Debug, Info, Warning, Error }` and a record `AppConfig(string ServiceName, LogLevel Level, int MaxConnections, string? Notes)`.\n- Hand-write a JSON file `appsettings.json` where `level` is the STRING \"warning\" (not a number) and the keys are camelCase.\n- Configure `JsonSerializerOptions` so that:\n  - enums deserialize from their string names (`JsonStringEnumConverter`),\n  - property matching is case-insensitive OR uses the CamelCase policy,\n  - `Notes` is omitted from output when null (`DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull`).\n- Read and deserialize the file into `AppConfig`; print all fields.\n- Wrap the file read + deserialize in try/catch handling `FileNotFoundException` and `JsonException` separately, printing a helpful message for each.\n- Finally, re-serialize the loaded config (indented) and print it, confirming `level` comes back out as the string `\"warning\"` and `notes` is absent when null.\n\nIn a comment, explain the default enum behavior (numbers) and the classic \"all my properties are null\" deserialization bug.",
          "hints": [
            "Add the converter with `Options.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));`.",
            "By default STJ serializes enums as their underlying integer; the converter switches to/from string names.",
            "Catch `JsonException` for malformed JSON and `FileNotFoundException` for a missing file — handle them distinctly rather than swallowing a generic `Exception`."
          ]
        }
      ]
    },
    {
      ...lesson05,
      questions: [
        {
          "id": "files-q11",
          "kind": "predict",
          "prompt": "A naive CSV parser splits on commas. The data has a quoted field that itself contains a comma. What does this print?",
          "code": "string line = \"Smith,\\\"Doe, Jane\\\",42\";\nstring[] fields = line.Split(',');\nConsole.WriteLine(fields.Length);",
          "options": [
            {
              "label": "4",
              "correct": true
            },
            {
              "label": "3",
              "correct": false
            },
            {
              "label": "2",
              "correct": false
            },
            {
              "label": "It throws because the quotes are unbalanced",
              "correct": false
            }
          ],
          "explanation": "`string.Split(',')` knows nothing about CSV quoting rules — it blindly cuts at every comma. The intended 3 fields (`Smith`, `Doe, Jane`, `42`) get sliced into **4** pieces: `Smith`, `\"Doe`, ` Jane\"`, `42`. This is the core reason you don't hand-roll CSV beyond trivial cases: real CSV must handle quoted fields containing commas, escaped double-quotes (`\"\"`), and embedded newlines inside quotes. For anything non-trivial, reach for a library like **CsvHelper** rather than `Split`. Hand-written splitting is fine only when you fully control the data and know it has no quotes, commas-in-fields, or newlines."
        },
        {
          "id": "files-q12",
          "kind": "fill",
          "prompt": "Streaming a large CSV line-by-line, you split each row into cells on commas (simple, unquoted data). Fill in the call that splits the `line` string into a `string[]` on each comma.",
          "template": "foreach (var line in File.ReadLines(path))\n{\n    string[] cells = line.___(',');\n    Process(cells);\n}",
          "accept": [
            "Split"
          ],
          "explanation": "`line.Split(',')` returns a `string[]` of the comma-separated cells — the simplest possible CSV cell extraction, fine for clean, unquoted data you control. Pairing it with `File.ReadLines` keeps memory flat because `ReadLines` streams one line at a time instead of loading the whole file. Remember the limits: this naive split breaks the moment a field contains a quoted comma, an escaped quote, or an embedded newline — at which point you switch to a proper CSV library like CsvHelper rather than patching `Split` with ever-more-fragile logic."
        }
      ],
      challenges: [
        {
          "id": "files-p9",
          "difficulty": "hard",
          "title": "Hand-rolled CSV parser that survives quoting",
          "prompt": "Parse a CSV file by hand and discover exactly why CSV is harder than `line.Split(',')` suggests.\n\n- Create `contacts.csv` with a header row `Name,City,Notes` and at least 4 data rows, where:\n  - one `Notes` value contains a comma INSIDE quotes, e.g. `\"Call back, then email\"`,\n  - one value contains a quote escaped as a doubled quote, e.g. `\"She said \"\"hi\"\"\"`,\n  - one row has an empty field.\n- Define `record Contact(string Name, string City, string Notes);`.\n- First, naively `Split(',')` one of the quoted rows and print the broken result to SEE the bug.\n- Then write a proper field parser that walks the line character-by-character, tracking an `inQuotes` flag, treating a doubled `\"\"` inside quotes as a literal quote, and only splitting on commas that are OUTSIDE quotes.\n- Read the file with `File.ReadLines` (skip the header), parse each row into a `Contact`, and print each parsed record so the commas/quotes are clearly intact.\n\nFinish with a comment: list at least three real CSV edge cases your parser does or doesn't handle (embedded newlines inside quotes, BOM, trailing commas, etc.) and when you'd reach for a library like CsvHelper instead.",
          "hints": [
            "Track `bool inQuotes`; toggle it when you hit a `\"` that isn't part of an escaped `\"\"` pair.",
            "Inside quotes, a comma is data, not a delimiter — only split on commas where `inQuotes` is false.",
            "Embedded newlines inside quoted fields break the \"one record per line\" assumption entirely — that's a key reason real projects use a battle-tested CSV library."
          ]
        },
        {
          "id": "files-p10",
          "difficulty": "hard",
          "title": "CSV-to-JSON ETL pipeline, streamed and hardened",
          "prompt": "Build a small ETL (extract-transform-load) tool that ingests a CSV of orders, filters and aggregates them, and writes a JSON report — the kind of task you'd actually ship.\n\nSpec:\n- Input `orders.csv` with header `OrderId,Customer,Product,Quantity,UnitPrice,Status` and ~10 rows. Include at least one row with a quoted field containing a comma, one row with a malformed number, and a mix of `Status` values (`Paid`, `Pending`, `Cancelled`).\n- Define `record Order(int OrderId, string Customer, string Product, int Quantity, decimal UnitPrice, OrderStatus Status)` and `enum OrderStatus { Paid, Pending, Cancelled }`.\n- EXTRACT: stream the file with `File.ReadLines` (do not load it all), reusing your quote-aware CSV field splitter from problem 9. Skip the header.\n- TRANSFORM: parse each row defensively — use `int.TryParse`/`decimal.TryParse`/`Enum.TryParse` and SKIP (with a warning printed to the console) any row that fails, instead of crashing. Compute `LineTotal = Quantity * UnitPrice` and keep only orders whose `Status` is `Paid`.\n- LOAD: build a report record `OrderReport(int PaidOrderCount, decimal GrandTotal, IReadOnlyList<Order> Orders)` and serialize it to `report.json` using `System.Text.Json` with `WriteIndented = true`, CamelCase naming, and a `JsonStringEnumConverter` so `status` shows as a string. Use a single cached `static readonly JsonSerializerOptions`. Use the async API `File.WriteAllTextAsync` (or `JsonSerializer.SerializeAsync` into a `FileStream`).\n- Build all output paths with `Path.Combine` + `AppContext.BaseDirectory`, and `Directory.CreateDirectory` the output folder.\n- Print a final summary: rows read, rows skipped, paid orders kept, grand total.\n\nIn a comment, explain why streaming + `TryParse` + cached options + async write together make this production-grade, and which one piece you'd replace with a library (CSV parsing) in a real codebase.",
          "hints": [
            "Reuse, don't rewrite: your character-by-character CSV splitter from problem 9 is the EXTRACT step's workhorse.",
            "`int.TryParse(field, out var qty)` lets you reject bad rows gracefully instead of throwing `FormatException`.",
            "For the async write you can either build the JSON string and `File.WriteAllTextAsync`, or open a `FileStream` (with `using`/`await using`) and call `JsonSerializer.SerializeAsync` — both avoid blocking.",
            "Keep one `static readonly JsonSerializerOptions` with the CamelCase policy and `JsonStringEnumConverter` added once."
          ]
        }
      ]
    },
  ],
  projects: [
  {
    "id": "files-proj-1",
    "difficulty": "starter",
    "title": "Note-Taking CLI with JSON Persistence",
    "brief": "Build a small command-line note manager that loads notes from a JSON file on startup, lets the user add and list notes, and saves them back to disk — the same load-on-start/save-on-change pattern behind game saves, settings panels, and offline-first apps.",
    "requirements": [
      "Model a note as a `record Note(int Id, string Title, string Body, DateTime CreatedUtc)` and keep the notes in a `List<Note>` in memory.",
      "On startup, read the JSON file with `File.ReadAllText` if it exists (use `File.Exists` first) and deserialize into `List<Note>` with `JsonSerializer.Deserialize<List<Note>>`; start with an empty list if the file is missing.",
      "Build the data file path with `Path.Combine` against `AppContext.BaseDirectory` (NOT the current working directory) so it works the same in debug and production.",
      "Support at least these commands typed at a prompt: `add <title>` (prompt for body), `list` (print all notes), and `exit`.",
      "After every change (add), reserialize the full list and write it back with `File.WriteAllText`, using a single cached `static readonly JsonSerializerOptions` instance with `WriteIndented = true` and `PropertyNamingPolicy = JsonNamingPolicy.CamelCase`.",
      "Handle a missing or corrupt file gracefully: wrap deserialization in a try/catch for `JsonException` and `IOException` and fall back to an empty list with a friendly message instead of crashing."
    ],
    "stretch": [
      "Add a `delete <id>` command and a `search <term>` command that filters notes case-insensitively.",
      "Switch the synchronous file calls to `File.ReadAllTextAsync` / `File.WriteAllTextAsync` with `await` in an async `Main`, and pass a `CancellationToken`.",
      "Add a `JsonStringEnumConverter` and a `NoteCategory` enum so categories serialize as readable strings (`\"Work\"`) instead of numbers.",
      "Adopt the .NET 10 `JsonSerializerOptions.Strict` preset (or `AllowDuplicateProperties = false`) so a tampered/duplicated-key file is rejected rather than silently accepted."
    ],
    "concepts": [
      "File.ReadAllText / WriteAllText",
      "File.Exists",
      "System.Text.Json serialize/deserialize",
      "records as DTOs",
      "JsonSerializerOptions (cached, camelCase, indented)",
      "Path.Combine + AppContext.BaseDirectory",
      "exception handling (JsonException, IOException)"
    ]
  },
  {
    "id": "files-proj-2",
    "difficulty": "intermediate",
    "title": "Streaming Log-to-Report Pipeline",
    "brief": "Build a tool that reads a large server log file line-by-line without loading it into memory, aggregates request stats (counts per status code, slowest endpoints), and writes both a JSON summary and a human-readable text report — the kind of log-analysis utility teams actually run against multi-gigabyte production logs.",
    "requirements": [
      "Read the input log with streaming, NOT `File.ReadAllText`/`ReadAllLines`: use `File.ReadLines` (lazy) or a `StreamReader` loop inside a `using` block so memory stays flat regardless of file size.",
      "Parse each line into a `record LogEntry(DateTime Timestamp, string Method, string Path, int Status, int DurationMs)`; skip and count malformed lines rather than throwing.",
      "Aggregate as you stream: total requests, a `Dictionary<int,int>` of counts per HTTP status code, and the top 5 slowest paths by average `DurationMs` (use LINQ over the accumulated data).",
      "Write a machine-readable `summary.json` using `JsonSerializer.SerializeAsync` to a `FileStream` opened with `await using`, reusing one cached `JsonSerializerOptions` (camelCase, indented).",
      "Also write a `report.txt` using a `StreamWriter` (inside `using`/`await using`) so the writer is flushed and the handle closed deterministically — do not rely on scope exit like Python's `with` does automatically.",
      "Build all paths with `Path.Combine`, create the output directory with `Directory.CreateDirectory`, and make the whole pipeline async end-to-end (`ReadLinesAsync`/`StreamReader.ReadLineAsync`, `await`, honoring a `CancellationToken`) with no `.Result`/`.Wait()` calls."
    ],
    "stretch": [
      "Generate the log file itself by writing test data with `File.AppendAllLinesAsync` / `StreamWriter`, then process it — proving the read and write halves.",
      "Package the JSON + text report into a `.zip` using the new .NET 10 async `ZipFile.CreateFromDirectoryAsync` for a single downloadable bundle.",
      "Accept JSON-Lines input instead of plain text and parse each line with `JsonSerializer.Deserialize<LogEntry>`, or demonstrate `JsonSerializer.DeserializeAsyncEnumerable<LogEntry>` against a giant JSON array so you never hold the whole array in memory.",
      "Add explicit handling for `FileNotFoundException`, `DirectoryNotFoundException`, and `UnauthorizedAccessException` with distinct, actionable error messages."
    ],
    "concepts": [
      "StreamReader / StreamWriter",
      "File.ReadLines (lazy streaming)",
      "using / await using + IDisposable",
      "async file I/O + CancellationToken",
      "FileStream + JsonSerializer.SerializeAsync",
      "DeserializeAsyncEnumerable streaming",
      "LINQ aggregation",
      "Path.Combine + Directory.CreateDirectory",
      "IO exception handling"
    ]
  }
],
};
