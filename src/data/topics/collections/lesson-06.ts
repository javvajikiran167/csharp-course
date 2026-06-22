import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  "slug": "stack-queue",
  "number": 6,
  "title": "Stack&lt;T&gt; &amp; Queue&lt;T&gt;",
  "objective": "Use LIFO stacks and FIFO queues — the structures behind undo, parsing, scheduling, and breadth-first traversal.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Every **Undo** button, every bracket-matching code editor, every job-processing background worker, and every shortest-path search in a maps app is quietly powered by one of two tiny, opinionated collections: a **stack** or a **queue**. They hold the same kind of data a `List<T>` does — the difference is the *order* in which they hand it back."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Anchor the whole lesson on ONE physical metaphor each: stack = pile of plates (take the top), queue = line at a coffee shop (first in line served first). Repeat them; students remember pictures, not method names.",
        "Python devs have no dedicated Stack/Queue class baked into the language — they fake it with `list.append`/`list.pop` or `collections.deque`. Make the point that C# gives you named, intention-revealing types, and that the name IS the documentation.",
        "Spend real time on the Try-pattern (`TryPop`/`TryDequeue`). It's the single most common production bug source here: calling `Pop()` on an empty stack throws. Show both the throwing and non-throwing forms side by side.",
        "The bracket-matcher and BFS examples are the payoff — they make 'why would I ever use this' click. Don't rush them. If short on time, cut the concurrent-collections aside, never the two worked examples.",
        "Interview framing: 'stack vs queue' and 'how would you do BFS' are near-universal junior questions. Flag the Big-O (all O(1) for push/pop/enqueue/dequeue) explicitly, and the 'swap Queue for Stack and BFS becomes DFS' trick — it lands every time."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Two collections, one job: control the order",
      "id": "two-collections"
    },
    {
      "kind": "paragraph",
      "text": "So far you've met `List<T>` (ordered, indexable), `Dictionary<TKey,TValue>` (keyed lookup), and `HashSet<T>` (uniqueness). Those let *you* decide which element to touch next — you pick an index or a key. `Stack<T>` and `Queue<T>` are different: they **take that decision away from you on purpose**. You can only add to one end and remove from one (well-defined) end. That constraint is the feature. When the order in which you process work *is* the logic — most-recent-first for undo, oldest-first for a fair job queue — encoding it in the data structure means you can never get it wrong. Both live in `System.Collections.Generic`, the same namespace as `List<T>`, so no extra `using` is needed beyond the one you already have."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Stack<T> — LIFO (Last In, First Out)",
          "items": [
            "**Picture:** a pile of plates. You add to the top and take from the top.",
            "Add with `Push(item)`, remove with `Pop()`, look without removing via `Peek()`.",
            "The **most recently** added item comes out **first**.",
            "Natural fit for *reversal* and *backtracking*: undo, browser back, call stacks, depth-first search.",
            "Push/Pop/Peek are all **O(1)**."
          ]
        },
        {
          "title": "Queue<T> — FIFO (First In, First Out)",
          "items": [
            "**Picture:** a line at a coffee shop. You join the back and are served from the front.",
            "Add with `Enqueue(item)`, remove with `Dequeue()`, look without removing via `Peek()`.",
            "The **oldest** waiting item comes out **first** — it's *fair*.",
            "Natural fit for *scheduling* and *level-by-level* work: job queues, message processing, breadth-first search.",
            "Enqueue/Dequeue/Peek are all **O(1)**."
          ]
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Coming from Python",
      "text": "In Python you'd reach for `list.append()` / `list.pop()` to fake a stack, or `collections.deque` with `append`/`popleft` for a queue. C# instead gives you two *named* classes from `System.Collections.Generic`. The win isn't performance — it's that `Stack<T>` and `Queue<T>` announce your intent. A reader (or your future self) instantly knows the access pattern, and you literally cannot call `Dequeue` on a stack by accident."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Stack<T>: Push, Pop, Peek",
      "id": "stack-basics"
    },
    {
      "kind": "paragraph",
      "text": "Let's model the **Undo** feature of a text editor. Each edit the user makes gets *pushed* onto a stack of actions. When they hit Ctrl+Z, we *pop* the most recent action and reverse it (and a real editor would push that onto a second *redo* stack — two stacks back to back are exactly how undo/redo is built). Because the last edit made is the first one undone, LIFO is precisely the behaviour we want."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var undo = new Stack<string>();\n\n// User performs three edits, newest pushed last.\nundo.Push(\"Type 'Hello'\");\nundo.Push(\"Bold the word\");\nundo.Push(\"Insert image\");\n\nConsole.WriteLine($\"Actions recorded: {undo.Count}\");\n\n// Peek looks at the top WITHOUT removing it.\nConsole.WriteLine($\"Next undo will reverse: {undo.Peek()}\");\n\n// Pop removes and returns the most recent action.\nstring last = undo.Pop();\nConsole.WriteLine($\"Undoing: {last}\");\nConsole.WriteLine($\"Undoing: {undo.Pop()}\");\n\nConsole.WriteLine($\"Actions left: {undo.Count}\");",
      "filename": "UndoStack.cs"
    },
    {
      "kind": "output",
      "output": "Actions recorded: 3\nNext undo will reverse: Insert image\nUndoing: Insert image\nUndoing: Bold the word\nActions left: 1"
    },
    {
      "kind": "paragraph",
      "text": "Notice the reversal: we pushed `Hello`, `Bold`, `Insert image` in that order, but they come back out newest-first. One subtlety worth internalizing now — **iterating** a stack with `foreach` also walks it top-to-bottom (newest to oldest), *without* removing anything. So `foreach (var a in undo)` would visit `Insert image` before `Type 'Hello'`. That trips people up because it's the opposite of a `List<T>`, which iterates in insertion order."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Queue<T>: Enqueue, Dequeue, Peek",
      "id": "queue-basics"
    },
    {
      "kind": "paragraph",
      "text": "Now flip the order. Imagine a background worker in a web app that emails customers. Requests arrive throughout the day; we want to process them **in the order they came in** — first request served first, no one jumps the line. That's a `Queue<T>`."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "var emailJobs = new Queue<string>();\n\n// Jobs arrive in order; oldest enqueued first.\nemailJobs.Enqueue(\"Welcome email -> ana@shop.com\");\nemailJobs.Enqueue(\"Receipt    -> ben@shop.com\");\nemailJobs.Enqueue(\"Newsletter -> cleo@shop.com\");\n\n// Peek sees the FRONT (oldest) without removing it.\nConsole.WriteLine($\"Up next: {emailJobs.Peek()}\");\n\n// Drain the queue oldest-first.\nwhile (emailJobs.Count > 0)\n{\n    string job = emailJobs.Dequeue();\n    Console.WriteLine($\"Sending: {job}\");\n}\n\nConsole.WriteLine($\"Remaining: {emailJobs.Count}\");",
      "filename": "JobQueue.cs"
    },
    {
      "kind": "output",
      "output": "Up next: Welcome email -> ana@shop.com\nSending: Welcome email -> ana@shop.com\nSending: Receipt    -> ben@shop.com\nSending: Newsletter -> cleo@shop.com\nRemaining: 0"
    },
    {
      "kind": "paragraph",
      "text": "Same three method *shapes* as the stack — an add, a remove-and-return, and a non-removing Peek — but the order flips from newest-first to oldest-first. Unlike the stack, a `Queue<T>`'s `foreach` walks **front-to-back** (oldest to newest), matching the order things will be dequeued. The one consistent rule across both types: `Peek()` shows you the element the next `Pop`/`Dequeue` will return, and never mutates the collection."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: Pop/Dequeue/Peek throw on an empty collection",
      "text": "Calling `Pop()`, `Dequeue()`, or even `Peek()` when the collection is empty throws an `InvalidOperationException` — the message is literally `\"Stack empty.\"` / `\"Queue empty.\"`. It does **not** return `null` or a default. This is the #1 production bug with these types: a worker drains a queue, another check races in, and the next `Dequeue()` blows up. Always guard with `Count > 0`, or — better — use the `Try` methods below."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The safe way: TryPop and TryDequeue",
      "id": "try-methods"
    },
    {
      "kind": "paragraph",
      "text": "Just like `Dictionary` gives you `TryGetValue` instead of a throwing indexer, `Stack<T>` and `Queue<T>` give you `TryPop`/`TryPeek` and `TryDequeue`/`TryPeek`. Each returns a `bool` (`true` if it got something) and hands the value back through an `out` parameter. This is the idiomatic, exception-free way to consume these collections — especially in loops where you don't want to check `Count` separately."
    },
    {
      "kind": "examples",
      "intro": "The same drain loop, written defensively. `TryDequeue` does the emptiness check and the removal in one call, returning `false` (and a defaulted `out` value) the moment the queue runs dry:",
      "examples": [
        {
          "label": "Draining a queue with TryDequeue",
          "code": "var jobs = new Queue<int>([10, 20, 30]);\n\nwhile (jobs.TryDequeue(out int job))\n{\n    Console.WriteLine($\"Processing job {job}\");\n}\n\n// Loop exits cleanly when empty — no exception, no Count check.\nbool got = jobs.TryDequeue(out int none);\nConsole.WriteLine($\"Got another? {got}, value defaulted to {none}\");",
          "output": "Processing job 10\nProcessing job 20\nProcessing job 30\nGot another? False, value defaulted to 0"
        },
        {
          "label": "Peeking safely with TryPeek",
          "code": "var history = new Stack<string>();\n\nif (history.TryPeek(out string? top))\n    Console.WriteLine($\"Top is {top}\");\nelse\n    Console.WriteLine(\"Nothing to undo.\");",
          "output": "Nothing to undo."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: prefer Try* in any code that can run on an empty collection",
      "text": "Use `Pop()`/`Dequeue()` only when you have *just* checked `Count` (or otherwise know the collection is non-empty) on the same thread. In worker loops, message processors, and anything concurrent, reach for `TryDequeue`/`TryPop` — `while (queue.TryDequeue(out var item))` is the canonical drain loop. It reads cleanly and removes a whole class of `InvalidOperationException` bugs. (For genuinely multi-threaded producer/consumer work, graduate to `ConcurrentQueue<T>` / `ConcurrentStack<T>` from `System.Collections.Concurrent`, whose `TryDequeue`/`TryPop` are thread-safe.)"
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A real stack: matching brackets",
      "id": "bracket-matching"
    },
    {
      "kind": "paragraph",
      "text": "Here's the classic that shows *why* a stack is the right tool, not just an available one. Compilers, linters, and JSON parsers all need to check that brackets are balanced — every `(`, `[`, `{` has a matching closer, correctly nested. The insight: when you hit a closing bracket, it must match the **most recently opened** one still waiting. \"Most recent\" + \"first to resolve\" = LIFO = stack. Push every opener; on a closer, pop and check it matches."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "static bool IsBalanced(string code)\n{\n    var pairs = new Dictionary<char, char>\n    {\n        [')'] = '(',\n        [']'] = '[',\n        ['}'] = '{',\n    };\n\n    var open = new Stack<char>();\n\n    foreach (char c in code)\n    {\n        if (c is '(' or '[' or '{')\n        {\n            open.Push(c);\n        }\n        else if (pairs.TryGetValue(c, out char expected))\n        {\n            // A closer with nothing open, or a mismatch, means invalid.\n            if (!open.TryPop(out char actual) || actual != expected)\n                return false;\n        }\n    }\n\n    // Balanced only if nothing is left waiting to be closed.\n    return open.Count == 0;\n}\n\nstring[] samples = [\"(a[b]{c})\", \"([)]\", \"({[\", \"user[0].name\"];\nforeach (string s in samples)\n    Console.WriteLine($\"{s,-14} -> {IsBalanced(s)}\");",
      "filename": "BracketMatcher.cs"
    },
    {
      "kind": "output",
      "output": "(a[b]{c})      -> True\n([)]           -> False\n({[            -> False\nuser[0].name   -> True"
    },
    {
      "kind": "paragraph",
      "text": "Walk through `([)]`: push `(`, push `[`, then hit `)` — we pop `[`, but a `)` expects `(`, mismatch, return `False`. That's the test for *correct nesting*, which a simple counter of opens-vs-closes could never catch. Notice how `TryPop` elegantly handles the \"closer arrives but nothing is open\" case (a stray `)`): `TryPop` returns `false`, and we bail. This exact algorithm runs inside real editors to highlight your unbalanced parens as you type."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A real queue: breadth-first search",
      "id": "bfs"
    },
    {
      "kind": "paragraph",
      "text": "Queues power **breadth-first search (BFS)** — exploring outward level by level. It's how you find the *fewest* steps between two points: shortest social-graph connection (\"degrees of separation\"), nearest reachable node, or the shortest path in a maze or game map. The trick: enqueue a starting node, then repeatedly dequeue one, and enqueue all its not-yet-seen neighbours. Because a queue is FIFO, you fully explore everything 1 step away before anything 2 steps away — so the first time you reach the goal, you've reached it by the shortest route."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Who can a user reach, and in how few hops, in a follower graph?\nvar graph = new Dictionary<string, string[]>\n{\n    [\"Ana\"]  = [\"Ben\", \"Cleo\"],\n    [\"Ben\"]  = [\"Dan\"],\n    [\"Cleo\"] = [\"Dan\", \"Eve\"],\n    [\"Dan\"]  = [\"Eve\"],\n    [\"Eve\"]  = [],\n};\n\nstatic void BreadthFirst(Dictionary<string, string[]> graph, string start)\n{\n    var toVisit = new Queue<(string Person, int Hops)>();\n    var seen = new HashSet<string> { start };\n    toVisit.Enqueue((start, 0));\n\n    while (toVisit.TryDequeue(out var current))\n    {\n        Console.WriteLine($\"{current.Person} is {current.Hops} hop(s) away\");\n\n        foreach (string next in graph[current.Person])\n        {\n            if (seen.Add(next)) // Add returns false if already present.\n                toVisit.Enqueue((next, current.Hops + 1));\n        }\n    }\n}\n\nBreadthFirst(graph, \"Ana\");",
      "filename": "BreadthFirstSearch.cs"
    },
    {
      "kind": "output",
      "output": "Ana is 0 hop(s) away\nBen is 1 hop(s) away\nCleo is 1 hop(s) away\nDan is 2 hop(s) away\nEve is 2 hop(s) away"
    },
    {
      "kind": "paragraph",
      "text": "Three collections working together, each playing to its strength: a `Dictionary` for the graph (O(1) neighbour lookup), a `Queue` to enforce level-by-level order, and a `HashSet` to remember who we've already scheduled so we never visit anyone twice (`seen.Add` returns `false` if the name was already there). Swap the `Queue<T>` for a `Stack<T>` and the *same code* becomes **depth-first search** — it would dive deep down one path before backtracking. That one-type swap flipping the entire search strategy is the clearest demonstration of how much these structures encode."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Choosing: stack or queue?",
      "id": "choosing"
    },
    {
      "kind": "list",
      "items": [
        "**Need the most recent thing first?** Reach for a **stack**. Undo/redo, browser back-button, \"go back to the previous menu,\" expression evaluation, depth-first traversal, and any *backtracking* or *reversal* logic.",
        "**Need the oldest waiting thing first / fairness?** Reach for a **queue**. Job and message processing, print spoolers, request buffering, rate-limited work, simulating real-world lines, and breadth-first / shortest-path search.",
        "**Need random access by index or key, or to search the middle?** Neither — use a `List<T>` (index) or `Dictionary<TKey,TValue>` (key). Stacks and queues deliberately offer no indexer; reaching past the top/front isn't their job.",
        "**Multiple threads producing and consuming?** Use the concurrent variants: `ConcurrentStack<T>` and `ConcurrentQueue<T>`. The plain generic versions are **not** thread-safe for simultaneous writes."
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Where you'll meet these in real .NET",
      "text": "You rarely build these from scratch in app code — the framework hands them to you. ASP.NET Core's request handling, `Channel<T>` and `BackgroundService` work-queues, and message brokers (Azure Service Bus, RabbitMQ) are all FIFO queues at heart. The CLR's own **call stack** — the thing a `StackOverflowException` overflows — is a stack of method frames; an exception's `StackTrace` is literally that stack unwound. Recognizing the pattern is what matters more than hand-rolling it."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**`Stack<T>` is LIFO** — `Push` to add, `Pop` to remove-and-return the newest, `Peek` to look. Think pile of plates; great for undo, backtracking, and depth-first search.",
        "**`Queue<T>` is FIFO** — `Enqueue` to add, `Dequeue` to remove-and-return the oldest, `Peek` to look. Think coffee-shop line; great for job/message processing and breadth-first search.",
        "All four operations (Push/Pop, Enqueue/Dequeue) plus Peek are **O(1)** — these are fast, and the type name documents your intent better than a raw `List<T>`.",
        "`Pop`, `Dequeue`, and `Peek` **throw `InvalidOperationException` on an empty collection** (\"Stack empty.\" / \"Queue empty.\"). Use **`TryPop`/`TryDequeue`/`TryPeek`** (bool + `out`) for safe, exception-free consumption — `while (q.TryDequeue(out var x))` is the canonical drain loop.",
        "**Iteration order differs:** a stack's `foreach` goes newest→oldest; a queue's goes oldest→newest. Neither removes items while iterating.",
        "For multi-threaded producer/consumer work, switch to **`ConcurrentStack<T>` / `ConcurrentQueue<T>`**; the plain generic versions aren't thread-safe for concurrent writes.",
        "Pick by *access pattern*: most-recent-first → stack; oldest-first/fair → queue; by-index or by-key → `List<T>`/`Dictionary<TKey,TValue>` instead."
      ]
    }
  ]
};
