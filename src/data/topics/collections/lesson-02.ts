import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  "slug": "multi-arrays",
  "number": 2,
  "title": "Multidimensional & Jagged Arrays",
  "objective": "Represent grids and tables with rectangular int[,] arrays and jagged int[][] arrays, and know when each fits.",
  "blocks": [
    {
      "kind": "lead",
      "text": "A spreadsheet, a chessboard, a pixel buffer, a distance matrix — the moment your data has **rows and columns**, a flat array stops being enough. C# gives you two very different tools for two-dimensional data, and choosing the right one is the whole game."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Students from Python think of a grid as `[[1,2,3],[4,5,6]]` — a list of lists. That mental model maps almost perfectly onto C#'s **jagged** array (`int[][]`), so start there if a learner is struggling, then introduce the rectangular `int[,]` as the C#-specific thing Python has no direct equivalent for.",
        "The single biggest source of confusion is the comma: `int[,]` (one set of brackets, a comma inside) is ONE rectangular object, while `int[][]` (two sets of brackets) is an array of arrays. Draw both on the board: a solid rectangle of memory vs. a column of pointers each going off to its own row.",
        "Hammer `GetLength(dimension)` early. Beginners reach for `.Length` on a rectangular array and get the TOTAL cell count, then write a buggy loop. `.Length` on `int[,]` = rows × cols.",
        "Live-demo the `foreach`-flattens-a-rectangular-array behavior — it surprises everyone and is a great 'C# is doing something specific here' moment.",
        "Defer NumPy comparisons. If a student mentions NumPy, note that `int[,]` is closer in spirit (one contiguous block) but C# arrays are not vectorized math libraries; that's a later topic.",
        "If someone tries `grid.Sum()` (LINQ) on an `int[,]`, it won't compile — a rectangular array only exposes the non-generic `IEnumerable` (it enumerates boxed cells), so they'd need `grid.Cast<int>().Sum()`. Worth a 30-second aside; it explains the 'less LINQ-friendly' line in the comparison."
      ]
    },
    {
      "kind": "paragraph",
      "text": "In Python you almost never think about this distinction — a grid is just a list of lists, `[[1, 2, 3], [4, 5, 6]]`, and you stop there. C# makes you choose between two genuinely different layouts in memory, and each has real performance and ergonomic consequences. This lesson is about reading both, writing both, and developing the instinct for **which one a given problem wants**."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Rectangular arrays: int[,]",
      "id": "rectangular-arrays"
    },
    {
      "kind": "paragraph",
      "text": "A **rectangular** (or *multidimensional*) array is a single object holding a grid where every row has the **same** number of columns. The type is written with a comma inside one pair of brackets: `int[,]` is a 2-D grid of ints, `int[,,]` is a 3-D box. Under the hood it is **one contiguous block of memory** — all the cells sit next to each other in row-major order — which makes it compact and cache-friendly. You create one by giving it dimensions, then index it with comma-separated coordinates: `grid[row, col]`. Every cell exists the instant you allocate the array, pre-filled with the element type's default (`0` for `int`)."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// A 3-row, 4-column grid. Every cell starts at 0 (int's default).\nint[,] seats = new int[3, 4];\nseats[0, 0] = 1;     // first row, first column\nseats[2, 3] = 99;    // last row, last column\n\n// GetLength(dimension) gives the size of ONE axis.\n// Dimension 0 is rows, dimension 1 is columns.\nConsole.WriteLine($\"Rows: {seats.GetLength(0)}, Cols: {seats.GetLength(1)}, Total: {seats.Length}\");\n\n// You can also initialize with literal rows:\nint[,] grid =\n{\n    { 1, 2, 3 },\n    { 4, 5, 6 },\n};\nfor (int r = 0; r < grid.GetLength(0); r++)\n{\n    for (int c = 0; c < grid.GetLength(1); c++)\n    {\n        Console.Write($\"{grid[r, c]} \");\n    }\n    Console.WriteLine();\n}",
      "filename": "Rectangular.cs"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Rows: 3, Cols: 4, Total: 12\n1 2 3 \n4 5 6 "
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: .Length is the TOTAL, not the row count",
      "text": "On a rectangular array, `.Length` returns the number of cells across **all** dimensions — for `new int[3, 4]` that's `12`, not `3`. To loop correctly you must use `GetLength(0)` for rows and `GetLength(1)` for columns. Writing `for (int r = 0; r < grid.Length; r++)` is a classic bug that walks straight off the end of the grid with an `IndexOutOfRangeException`."
    },
    {
      "kind": "paragraph",
      "text": "There's one more behavior worth seeing now, because it surprises almost everyone: a plain `foreach` over a rectangular array **flattens** it. You don't get rows back — you get every cell in turn, in row-major order (left to right, top to bottom). That's perfect when you want to sum or scan all cells, but it means `foreach` is *not* how you process a grid row by row."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "int[,] grid =\n{\n    { 1, 2, 3 },\n    { 4, 5, 6 },\n};\n\n// foreach yields every CELL, not every row.\nforeach (int n in grid)\n{\n    Console.Write($\"{n} \");\n}\nConsole.WriteLine();",
      "filename": "ForeachFlattens.cs"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "1 2 3 4 5 6 "
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Jagged arrays: int[][]",
      "id": "jagged-arrays"
    },
    {
      "kind": "paragraph",
      "text": "A **jagged** array is an *array of arrays*. The type has two separate bracket pairs — `int[][]` — and that's exactly what it is: an outer array whose elements are themselves `int[]` references, each able to point at a row of a **different length** (or at `null`, or even be shared). This is the structure that maps directly onto Python's list-of-lists. You index it with chained brackets: `rows[r][c]` means \"take row `r`, then element `c` of that row.\" Because each row is its own independent array, you use `.Length` (not `GetLength`) at each level."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Each inner row can be a different length — that's the \"jag\".\nint[][] rows =\n[\n    [1, 2, 3, 4],\n    [10, 20],\n    [7],\n];\n\nConsole.WriteLine($\"Outer length: {rows.Length}\");\nfor (int r = 0; r < rows.Length; r++)\n{\n    // Note: rows[r].Length — each row knows its OWN length.\n    Console.WriteLine($\"Row {r} has {rows[r].Length} items: {string.Join(\",\", rows[r])}\");\n}",
      "filename": "Jagged.cs"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "Outer length: 3\nRow 0 has 4 items: 1,2,3,4\nRow 1 has 2 items: 10,20\nRow 2 has 1 items: 7"
    },
    {
      "kind": "paragraph",
      "text": "The collection-expression syntax `[[1, 2], [3, 4]]` (introduced in C# 12 and fully available on .NET 10) is the modern, terse way to build a jagged array. But you'll also meet the older two-step form, and it's worth understanding because it makes the \"array of arrays\" nature explicit: you first allocate the **outer** array, then fill in each row separately. This is also how you build a *ragged* grid whose row sizes are computed at runtime — something a rectangular array simply cannot do."
    },
    {
      "kind": "code",
      "language": "csharp",
      "code": "// Allocate the outer array of 3 rows; each row is still null for now.\nint[][] triangle = new int[3][];\n\nfor (int r = 0; r < triangle.Length; r++)\n{\n    // Row r gets its own array of length (r + 1) — a growing triangle.\n    triangle[r] = new int[r + 1];\n    for (int c = 0; c < triangle[r].Length; c++)\n    {\n        triangle[r][c] = (r + 1) * 10 + c;\n    }\n}\n\nforeach (int[] row in triangle)   // here foreach DOES give you whole rows\n{\n    Console.WriteLine(string.Join(\" \", row));\n}",
      "filename": "TriangleJagged.cs"
    },
    {
      "kind": "output",
      "label": "Output",
      "output": "10\n20 21\n30 31 32"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why foreach behaves differently here",
      "text": "Over a **jagged** array, `foreach (int[] row in triangle)` yields each *inner array* — so you really do iterate row by row, and you can nest another loop or `string.Join` over each row. Over a **rectangular** array, `foreach` flattens to individual cells. The difference isn't a quirk: it falls right out of what each type *is*. A jagged array's elements are arrays; a rectangular array's elements are the cells themselves."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Rectangular vs. jagged: which one fits?",
      "id": "tradeoffs"
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Rectangular int[,]",
          "items": [
            "**Shape:** a true grid — every row has the same width, guaranteed by the type.",
            "**Memory:** one contiguous block; compact, fewer allocations, cache-friendly.",
            "**Indexing:** `grid[r, c]` with a comma.",
            "**Sizing:** `GetLength(0)`, `GetLength(1)`; `.Length` is total cells.",
            "**Great for:** fixed boards (chess, Sudoku), images/pixel buffers, math matrices, any dense uniform table.",
            "**Limitation:** rows can't vary in length; less LINQ-friendly — it only exposes the non-generic `IEnumerable` (boxed cells), so you'd write `grid.Cast<int>().Sum()`, not `grid.Sum()`."
          ]
        },
        {
          "title": "Jagged int[][]",
          "items": [
            "**Shape:** an array of independent rows — each can be a different length (or null).",
            "**Memory:** outer array of references plus one allocation per row; more objects, less locality.",
            "**Indexing:** `rows[r][c]` with chained brackets.",
            "**Sizing:** `rows.Length` and `rows[r].Length` per row.",
            "**Great for:** ragged data (CSV rows of varying width, adjacency lists, a triangle), rows built/replaced independently.",
            "**Bonus:** the outer array is `IEnumerable<int[]>`, so each row composes cleanly with `foreach` and LINQ."
          ]
        }
      ]
    },
    {
      "kind": "paragraph",
      "text": "The decision rule is short. **If every row is the same width and stays that way, prefer `int[,]`** — it's denser, faster to traverse, and the type itself documents the invariant \"this is a true grid.\" **If rows have different lengths, or you build/swap rows independently, use `int[][]`.** In real .NET code you'll see jagged arrays more often, mostly because they play nicely with LINQ and because most \"table\" data (parsed files, query results) naturally arrives row by row. Rectangular arrays show up where the grid is genuinely fixed and dense: game boards, image processing, and numeric/matrix work."
    },
    {
      "kind": "examples",
      "intro": "The same problem, both ways, plus the canonical fixed-board case. Notice how the rectangular versions guarantee uniform width while the jagged version embraces variable width.",
      "examples": [
        {
          "label": "Tic-tac-toe board (rectangular — fixed 3×3 fits perfectly)",
          "code": "char[,] board =\n{\n    { 'X', 'O', 'X' },\n    { ' ', 'X', 'O' },\n    { 'O', ' ', 'X' },\n};\nfor (int r = 0; r < board.GetLength(0); r++)\n{\n    Console.WriteLine(string.Join(\"|\", board[r, 0], board[r, 1], board[r, 2]));\n}",
          "output": "X|O|X\n |X|O\nO| |X"
        },
        {
          "label": "Sum of a 2×3 matrix (rectangular — dense numeric grid)",
          "code": "int[,] m =\n{\n    { 1, 2, 3 },\n    { 4, 5, 6 },\n};\nint total = 0;\nforeach (int cell in m)   // flatten is exactly what we want here\n{\n    total += cell;\n}\nConsole.WriteLine($\"Sum = {total}\");",
          "output": "Sum = 21"
        },
        {
          "label": "Spreadsheet rows of different widths (jagged — ragged data)",
          "code": "string[][] sheet =\n[\n    [\"Name\", \"Email\", \"Role\"],\n    [\"Ada\", \"ada@x.io\"],            // missing Role\n    [\"Lin\", \"lin@x.io\", \"Admin\"],\n];\nforeach (string[] row in sheet)\n{\n    Console.WriteLine($\"{row.Length} cols: {string.Join(\" | \", row)}\");\n}",
          "output": "3 cols: Name | Email | Role\n2 cols: Ada | ada@x.io\n3 cols: Lin | lin@x.io | Admin"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: let the type encode the invariant",
      "text": "Choose the array type that makes illegal states unrepresentable. A chessboard is **always** 8×8, so `int[,]` (or `Piece[,]`) tells every future reader — and the compiler — that rows can't drift out of alignment. Reaching for `int[][]` there invites a bug where one row quietly ends up the wrong length. Conversely, don't force genuinely ragged data into a rectangle and pad it with sentinel values; that pushes \"is this cell real?\" checks into every consumer. Match the structure to the data's real shape."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: jagged rows can be null",
      "text": "With `int[][] rows = new int[3][];` the outer array exists but **every row is `null`** until you assign one. Touching `rows[0][0]` before doing `rows[0] = new int[...]` throws a `NullReferenceException`, not an index error. A rectangular `new int[3, 4]` has no such gap — all 12 cells exist immediately, initialized to `0`. This null-row trap is the price jagged arrays pay for their flexibility."
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**Reach for `int[,]`** when the grid is uniform and fixed: boards, images, matrices, dense tables.",
        "**Reach for `int[][]`** when rows vary in length or are created/replaced independently, and when you want LINQ/`foreach`-per-row ergonomics.",
        "**Index correctly:** `grid[r, c]` for rectangular, `rows[r][c]` for jagged.",
        "**Size correctly:** `GetLength(0)`/`GetLength(1)` for rectangular; `.Length` per level for jagged.",
        "**Remember the foreach split:** rectangular flattens to cells; jagged yields whole rows."
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Interview-ready summary",
      "text": "If asked \"`int[,]` vs `int[][]`?\" — say: a rectangular array is **one object, one contiguous memory block, uniform rows**, indexed `[r, c]`, sized with `GetLength`. A jagged array is an **array of independent arrays**, possibly ragged or null per row, indexed `[r][c]`, sized with `.Length` at each level. Rectangular wins on memory density and cache locality for fixed grids; jagged wins on flexibility and LINQ-friendliness. That contrast — *contiguous-and-uniform* vs *references-and-ragged* — is the whole answer."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`int[,]` is a **rectangular** grid: one contiguous object, every row the same width, indexed with a comma `grid[r, c]`.",
        "On a rectangular array, `GetLength(0)` is the row count and `GetLength(1)` the column count; `.Length` is the **total** number of cells (rows × columns).",
        "`int[][]` is a **jagged** array — an array of arrays. Rows can have different lengths (or be `null`), indexed with chained brackets `rows[r][c]`, and sized with `.Length` at each level.",
        "`foreach` over a rectangular array **flattens** it into individual cells; over a jagged array it yields each **row** (an `int[]`).",
        "Use rectangular for fixed, dense, uniform grids (boards, images, matrices); use jagged for ragged data (varying-width rows, adjacency lists) and when you want LINQ-friendly per-row iteration. Let the chosen type document the data's real shape."
      ]
    }
  ]
};
