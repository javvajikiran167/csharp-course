import type { Topic } from '@/data/types';

export const databases: Topic = {
  slug: 'databases',
  title: 'Databases & EF Core',
  subtitle: 'Talk to a real database with Entity Framework Core — the ORM behind most production .NET apps.',
  status: 'unlocked',
  lessons: [
  {
    "slug": "ef-intro",
    "number": 1,
    "title": "What is an ORM? EF Core Overview",
    "objective": "Why we don't write raw SQL by hand anymore (mostly).",
    "blocks": [
      {
        "kind": "lead",
        "text": "Every production .NET application wrestles with a database. Raw SQL queries are powerful but repetitive: you write SELECT statements, map columns to objects, handle nulls, manage connections. **Entity Framework Core** (EF Core) does this work for you. It's the unit of work that manages your database conversations—connections, transactions, entity tracking—and generates SQL from your C# code. You'll still see raw SQL when it matters, but 99% of the time, you'll use EF Core."
      },
      {
        "kind": "teachingNotes",
        "items": [
          "DbContext is the unit of work—it manages connections, entity tracking (identity map), change detection (snapshot-based), transaction boundaries, and query composition.",
          "DbContext is NOT thread-safe. It's designed to be scoped: create one per HTTP request (web), one per operation (console/service). Dispose promptly.",
          "Entity states (Detached, Added, Unchanged, Modified, Deleted) drive INSERT/UPDATE/DELETE SQL generation.",
          "The identity map ensures one row = one object in memory, preventing stale-data bugs.",
          ".NET 10 improvement: Query materialization is 25–50% faster than prior versions."
        ]
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "The DbContext: Your Database Conversation",
        "id": "dbcontext-intro"
      },
      {
        "kind": "paragraph",
        "text": "A `DbContext` is the entry point to your database. It represents a session—a window of time during which you load data, make changes, and save them back. Every `DbContext` subclass defines your entities (`DbSet<T>` properties) and how they map to database tables."
      },
      {
        "kind": "code",
        "code": "using var context = new SchoolDbContext();\nvar students = context.Students\n    .Where(s => s.Age > 18)\n    .ToList();\n\nstudents[0].Name = \"Alice Updated\";\ncontext.SaveChanges(); // One transaction writes all changes",
        "language": "csharp",
        "filename": "UsingDbContext.cs"
      },
      {
        "kind": "paragraph",
        "text": "That `using` block is critical: it ensures the context is disposed and its database connection returned to the pool. In a web app (ASP.NET Core), the framework handles this for you, injecting a scoped context per request. The important rule: **one context per request, or one context per logical operation**."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Entity States: How EF Core Tracks Changes",
        "id": "entity-states"
      },
      {
        "kind": "twoColumn",
        "cards": [
          {
            "title": "State",
            "items": [
              "**Detached**: Not being tracked",
              "**Added**: New, will INSERT",
              "**Unchanged**: Loaded, unmodified",
              "**Modified**: Loaded, changed",
              "**Deleted**: Marked for deletion"
            ]
          },
          {
            "title": "What SaveChanges() Does",
            "items": [
              "INSERT new rows",
              "UPDATE changed rows",
              "DELETE marked rows",
              "Wrap in one transaction",
              "Throw if conflict/error"
            ]
          }
        ]
      },
      {
        "kind": "paragraph",
        "text": "EF Core tracks changes by comparing the current object to a snapshot taken when it was loaded. If you load a student, change their name, and call `SaveChanges()`, EF Core generates an UPDATE statement for just that student—not a full rewrite of the database. This is the power of the unit of work pattern."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "The Identity Map",
        "id": "identity-map"
      },
      {
        "kind": "paragraph",
        "text": "Suppose you query the Students table twice in one request:"
      },
      {
        "kind": "code",
        "code": "var student1 = context.Students.FirstOrDefault(s => s.Id == 1);\nvar student2 = context.Students.FirstOrDefault(s => s.Id == 1);\n\nConsole.WriteLine(ReferenceEquals(student1, student2)); // true",
        "language": "csharp"
      },
      {
        "kind": "paragraph",
        "text": "`student1` and `student2` are **the same object in memory**. EF Core maintains an **identity map**—a dictionary keyed by primary key—that ensures one row is always one object. This prevents the bug where you update one reference and a different reference sees the old data."
      },
      {
        "kind": "warn",
        "tone": "warn",
        "title": "Singleton DbContext is a Footgun",
        "text": "**Never share a DbContext across requests or threads.** A DbContext is not thread-safe by design. If two requests share one context, their entity changes collide, queries see stale data, and you'll get race conditions. Always scope it to the request (ASP.NET Core does this by default) or create a new context per operation."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Lazy, Eager, and Explicit Loading",
        "id": "loading-strategies"
      },
      {
        "kind": "paragraph",
        "text": "When you query a `Student`, do you automatically get their `School` too? It depends:"
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          "**Eager loading**: Include related data upfront with `.Include()`. One well-shaped query.",
          "**Lazy loading**: Access a navigation property and EF Core fires off a new query automatically. Risk: N+1 problem.",
          "**Explicit loading**: Load related data on demand with `.LoadAsync()`. Controlled but extra round-trips."
        ]
      },
      {
        "kind": "paragraph",
        "text": "Most of the time, **eager loading is your friend**—one well-shaped query beats many small ones. Lazy loading can surprise you with hidden queries."
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Always Use Async/Await",
        "text": "Database queries block your thread. In a web server with many concurrent users, a blocked thread is a wasted resource. Always use async methods: `await context.Students.ToListAsync()` frees the thread while waiting for the database. ASP.NET Core handles DbContext scoping automatically—each request gets its own."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "**DbContext is the unit of work** that manages database connections, entity tracking, change detection, and transactions.",
          "**DbContext must be scoped**: one per HTTP request (web) or per operation. Never share across threads.",
          "**Entity states** (Added, Unchanged, Modified, Deleted) drive INSERT/UPDATE/DELETE SQL. EF Core detects changes via snapshots.",
          "**The identity map** ensures one row = one object, preventing stale-data bugs.",
          "**Use eager loading** with `.Include()` to fetch related data in one query. Avoid lazy loading's hidden N+1 queries.",
          "**Always use async** (`ToListAsync()`, `SaveChangesAsync()`) to free threads and handle high concurrency efficiently."
        ]
      }
    ]
  },
  {
    "slug": "dbcontext",
    "number": 2,
    "title": "DbContext & DbSet",
    "objective": "The two classes you build every EF app around.",
    "blocks": [
      {
        "kind": "lead",
        "text": "DbContext and DbSet are your two primary tools. DbContext is the session (unit of work), and DbSet<T> is your typed collection for querying and modifying entities."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Defining a DbContext",
        "id": "defining-dbcontext"
      },
      {
        "kind": "code",
        "code": "public class SchoolDbContext : DbContext {\n    public DbSet<Student> Students { get; set; }\n    public DbSet<Course> Courses { get; set; }\n}\n",
        "language": "csharp"
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "DbSet Operations",
        "id": "dbset-operations"
      },
      {
        "kind": "code",
        "code": "var students = context.Students.Where(s => s.IsActive).ToList();\ncontext.Students.Add(new Student { Name = \"Bob\" });\ncontext.SaveChanges();",
        "language": "csharp"
      },
      {
        "kind": "warn",
        "tone": "warn",
        "title": "DbSet queries hit the database",
        "text": "Calling ToList() or ToListAsync() executes the query. Use AsNoTracking() for read-only queries."
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Use async methods in production",
        "text": "Always use ToListAsync(), FirstOrDefaultAsync() in web apps."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "DbContext = session; DbSet<T> = table",
          "LINQ queries execute on ToList/ToListAsync",
          "SaveChanges batches all changes into one transaction"
        ]
      }
    ]
  },
  {
    "slug": "migrations",
    "number": 3,
    "title": "Migrations & Schema Evolution",
    "objective": "Add a column without losing data.",
    "blocks": [
      {
        "kind": "lead",
        "text": "Migrations track schema changes over time: add columns, rename tables, add constraints. EF Core generates migration files from your entity model."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Migration Workflow",
        "id": "migration-workflow"
      },
      {
        "kind": "code",
        "code": "# Create migration\ndotnet ef migrations add AddStudentAge\n\n# Apply migrations\ndotnet ef database update\n\n# Generate SQL script\ndotnet ef migrations script",
        "language": "bash"
      },
      {
        "kind": "warn",
        "tone": "warn",
        "title": "Review migrations before production",
        "text": "Auto-generated migrations can be incorrect. Always review before deploying. Use RenameColumn() for safe column renames."
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Test on realistic data",
        "text": "Adding indexes to 50M-row tables can timeout. Test on production-scale data."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "Migrations track schema changes in version control",
          "dotnet ef migrations add/update manage evolution",
          "Always review; auto-generation isn't perfect"
        ]
      }
    ]
  },
  {
    "slug": "querying",
    "number": 4,
    "title": "Querying with LINQ to EF",
    "objective": "Where, Include, OrderBy — how queries translate to SQL.",
    "blocks": [
      {
        "kind": "lead",
        "text": "LINQ is your query language. EF Core translates LINQ expressions into SQL. Understanding this translation is critical for efficient queries."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Basic LINQ Queries",
        "id": "basic-queries"
      },
      {
        "kind": "code",
        "code": "var advanced = context.Students.Where(s => s.GPA > 3.5).ToList();\nvar sorted = context.Students.OrderByDescending(s => s.GPA).ToList();\nvar page2 = context.Students.Skip(10).Take(10).ToList();",
        "language": "csharp"
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Eager Loading",
        "id": "eager-loading"
      },
      {
        "kind": "code",
        "code": "var courses = context.Courses\n    .Include(c => c.Enrollments)\n    .ThenInclude(e => e.Student)\n    .ToList();",
        "language": "csharp"
      },
      {
        "kind": "warn",
        "tone": "warn",
        "title": "Cartesian explosion",
        "text": "Multiple one-to-many includes can duplicate rows. Use AsSplitQuery() or fetch separately."
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Push filtering to the database",
        "text": "Write LINQ before ToList(). Filtering after ToList() happens in memory and is slow."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "LINQ translates to SQL; ToList executes",
          "Include/ThenInclude for eager loading",
          "Filter before materializing"
        ]
      }
    ]
  },
  {
    "slug": "crud",
    "number": 5,
    "title": "Insert, Update, Delete",
    "objective": "The state-tracking model EF uses for changes.",
    "blocks": [
      {
        "kind": "lead",
        "text": "CRUD (Create, Read, Update, Delete) are the foundation of database work. EF Core's state tracking makes these operations explicit and atomic."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "CRUD Operations",
        "id": "crud-ops"
      },
      {
        "kind": "code",
        "code": "// Create\nvar student = new Student { Name = \"Alice\", GPA = 3.7m };\ncontext.Students.Add(student);\nawait context.SaveChangesAsync(); // INSERT\n\n// Read\nvar loaded = await context.Students.FirstOrDefaultAsync(s => s.Id == 1);\n\n// Update\nloaded.Name = \"Updated\";\nawait context.SaveChangesAsync(); // UPDATE\n\n// Delete\ncontext.Students.Remove(loaded);\nawait context.SaveChangesAsync(); // DELETE",
        "language": "csharp"
      },
      {
        "kind": "warn",
        "tone": "warn",
        "title": "SaveChanges is all-or-nothing",
        "text": "If any entity fails, the entire transaction rolls back. This is a feature: atomicity for free."
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Bulk operations for large updates",
        "text": "Use ExecuteUpdateAsync instead of load+loop+SaveChanges for updating thousands of rows."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "Add() → Added → SaveChanges = INSERT",
          "Modify → Modified → SaveChanges = UPDATE",
          "Remove() → Deleted → SaveChanges = DELETE",
          "All changes batch into one transaction"
        ]
      }
    ]
  },
  {
    "slug": "relationships",
    "number": 6,
    "title": "One-to-Many & Many-to-Many",
    "objective": "Model real-world relationships in code.",
    "blocks": [
      {
        "kind": "lead",
        "text": "Real-world data has relationships: a Blog has many Posts, a Student enrolls in many Courses. EF Core models these via navigation properties and foreign keys."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "One-to-Many",
        "id": "one-to-many"
      },
      {
        "kind": "code",
        "code": "public class Blog {\n    public int Id { get; set; }\n    public ICollection<Post> Posts { get; set; }\n}\n\npublic class Post {\n    public int Id { get; set; }\n    public int BlogId { get; set; } // Foreign key\n    public Blog Blog { get; set; }\n}",
        "language": "csharp"
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Many-to-Many",
        "id": "many-to-many"
      },
      {
        "kind": "code",
        "code": "public class Enrollment {\n    public int Id { get; set; }\n    public int StudentId { get; set; }\n    public int CourseId { get; set; }\n    public Student Student { get; set; }\n    public Course Course { get; set; }\n}",
        "language": "csharp"
      },
      {
        "kind": "warn",
        "tone": "warn",
        "title": "Relationships don't cross DbContexts",
        "text": "If you load entities from different contexts, they're disconnected objects."
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Use Include for relationships",
        "text": "Without eager loading, accessing blog.Posts triggers a lazy query. Use .Include(b => b.Posts)."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "One-to-Many: foreign key + ICollection navigation",
          "Many-to-Many: join table",
          "Use Include/ThenInclude for eager loading"
        ]
      }
    ]
  },
  {
    "slug": "mini-project-db",
    "number": 7,
    "title": "Mini-Project — Blog with SQLite",
    "objective": "Build a console blog app backed by a real SQLite database.",
    "blocks": [
      {
        "kind": "lead",
        "text": "Build a complete blog system: define entities, create migrations, and implement CRUD operations. You'll wrap this in a Web API in the next topic."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Requirements",
        "id": "requirements"
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          "Define Blog, Post, Comment entities with relationships",
          "Create BlogContext configured for SQLite",
          "Add and run initial migration",
          "Implement CreatePostAsync, GetAllPostsAsync, UpdatePostAsync, DeletePostAsync",
          "List all posts with comments (eager load with Include)",
          "Use async/await throughout"
        ]
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Stretch Goals",
        "id": "stretch"
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          "Add pagination (skip/take)",
          "Implement search by title",
          "Add timestamps (CreatedAt, UpdatedAt)",
          "Soft delete posts (IsDeleted + query filter)"
        ]
      },
      {
        "kind": "paragraph",
        "text": "This mini-project synthesizes DbContext, migrations, relationships, and state tracking. Next topic: wrap in a REST API."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "Build DbContext from scratch",
          "Create and apply real migrations",
          "Handle one-to-many relationships",
          "Use async/await for database operations"
        ]
      }
    ]
  }
],
  projects: [
    {
      id: 'databases-proj-1',
      difficulty: 'intermediate',
      title: 'Bookshelf — A SQLite-backed Catalog with EF Core',
      brief:
        'Build a console app that manages a personal book catalog stored in a real SQLite database via Entity Framework Core: add books and authors, list and search them, and update or delete records. This is the canonical first EF Core project — it covers a full code-first model, migrations, and CRUD against an actual file on disk.',
      requirements: [
        'Define entities `Author` and `Book` with a one-to-many relationship (an author has many books); use sensible types (`required string`, `int` keys, a `DateOnly Published`).',
        'Create a `DbContext` (`CatalogContext`) with `DbSet<Author>` and `DbSet<Book>`, configured to use SQLite (`UseSqlite("Data Source=catalog.db")`).',
        'Use code-first **migrations** (`dotnet ef migrations add Initial`, `dotnet ef database update`) to create the schema — do not hand-write SQL.',
        'Implement full CRUD: add an author and books, list all books with their author (a navigation property / `Include`), update a book\'s title, and delete one — calling `SaveChanges()` (or `SaveChangesAsync`).',
        'Add a search that uses a LINQ `Where` translated to SQL (e.g. books whose title contains a term), and print how EF turns it into a query (enable logging).',
        'Guard input and handle the not-found case (updating/deleting an id that does not exist) gracefully.',
      ],
      stretch: [
        'Add a many-to-many `Tag`–`Book` relationship and query books by tag.',
        'Switch all data access to async (`ToListAsync`, `FirstOrDefaultAsync`) and `await` it.',
        'Add a second migration that introduces a new column and run it, showing migrations evolve a live database without data loss.',
      ],
      concepts: [
        'EF Core code-first entities & relationships (one-to-many)',
        'DbContext + DbSet configuration (SQLite provider)',
        'migrations (add / update)',
        'CRUD with SaveChanges / async',
        'LINQ queries translated to SQL + Include for navigation',
      ],
    },
    {
      id: 'databases-proj-2',
      difficulty: 'advanced',
      title: 'Expense Tracker API with EF Core + Repository',
      brief:
        'Build a small ASP.NET Core API that records expenses and reports monthly totals, backed by EF Core, with the data access hidden behind a repository so the endpoints stay clean. This mirrors a real production slice: layered architecture, async data access, and aggregate queries pushed down to the database.',
      requirements: [
        'Model `Expense` (amount, category, date, note) and `Category` with a one-to-many relationship; use EF Core with SQLite (or in-memory for tests) and migrations.',
        'Put all data access behind an `IExpenseRepository` (add, list, by-category, monthly-total) so the API/endpoints never touch the `DbContext` directly — register it with DI (`AddScoped`).',
        'Expose endpoints: create an expense, list expenses (optionally filtered by category or month), and a `/reports/monthly` endpoint that returns totals per category for a given month.',
        'Compute the monthly report with a LINQ `GroupBy` + `Sum` that EF Core translates into a single grouped SQL query — not by loading every row and summing in memory.',
        'Make all data access async end-to-end (`async`/`await`, `ToListAsync`).',
        'Seed a few categories on startup and handle validation (negative amount, unknown category) with clear error responses.',
      ],
      stretch: [
        'Add pagination to the list endpoint (`Skip`/`Take`).',
        'Add a unit test that swaps the SQLite provider for the EF Core in-memory provider to test the repository without a real database.',
        'Add an index on `Expense.Date` via the model configuration and observe the effect on the report query.',
      ],
      concepts: [
        'layered data access (repository pattern + DI)',
        'EF Core relationships, migrations, seeding',
        'async data access end-to-end',
        'aggregate queries (GroupBy/Sum) translated to SQL',
        'validation and clean API responses',
      ],
    },
  ],
  outline: []
};
