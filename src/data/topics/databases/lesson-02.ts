import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  slug: 'dbcontext',
  number: 2,
  title: 'DbContext & DbSet',
  objective: 'The two classes you build every EF app around.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Every Entity Framework Core app is built around two classes: `DbContext` and `DbSet<T>`. DbContext is your conversation with the database; DbSet<T> is a table. Master these two and you control data access.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**DbContext** = the session between your app and the database',
        '**DbSet<T>** = a collection representing a table; you query, add, remove through it',
        'Use **DbContext.SaveChanges()** after any write — it batches changes into SQL',
        'Show the constructor: inherit DbContext, override OnConfiguring or use dependency injection',
        'Demo the fluent API for configuration (OnModelCreating) — vs attributes next lesson',
        'Emphasize: DbContext is **not thread-safe**; create one per request in ASP.NET',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'DbContext — your database session',
    },
    {
      kind: 'paragraph',
      text:
        'DbContext is an instance of a class you create by inheriting from `EntityFrameworkCore.DbContext`. It manages the connection to your database, translates your queries into SQL, and tracks changes to objects so it knows what to insert, update, or delete.',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'BlogContext.cs',
      code: `using Microsoft.EntityFrameworkCore;

// Your app defines a DbContext subclass
public class BlogContext : DbContext
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<Author> Authors { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // Tell EF where the database is
        options.UseSqlite("Data Source=blog.db");
    }
}`,
    },
    {
      kind: 'paragraph',
      text:
        'Inside, you declare `public DbSet<T>` properties for each table. These are your query entry points. You also override `OnConfiguring` to tell EF which database to connect to — in this example, SQLite.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'DbSet<T> — querying and mutating a table',
    },
    {
      kind: 'paragraph',
      text:
        'Each DbSet<T> property represents a table. Through it, you can query rows, add new ones, remove them, or update them. The DbSet is where LINQ queries run and where you stage changes.',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'Usage.cs',
      code: `var context = new BlogContext();

// Query: get all posts
var allPosts = context.Posts.ToList();

// Query: find post with ID 5
var post = context.Posts.FirstOrDefault(p => p.Id == 5);

// Add: create a new post
var newPost = new Post { Title = "EF Core 101", AuthorId = 1 };
context.Posts.Add(newPost);

// Delete: remove a post
context.Posts.Remove(post);

// Save all changes to the database
context.SaveChanges();`,
    },
    {
      kind: 'paragraph',
      text:
        'Notice: **Add and Remove don\'t hit the database immediately.** They stage changes in memory. Only `SaveChanges()` commits them to the database. This is called the **Unit of Work** pattern — EF collects all your writes, then sends them in one batch.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The full lifecycle',
    },
    {
      kind: 'paragraph',
      text:
        'When you load an entity from the database (e.g., via `FirstOrDefault`), EF tracks it. If you modify its properties and call `SaveChanges()`, EF detects the change and generates an UPDATE query. Similarly, new objects you `Add()` become INSERT, and objects you `Remove()` become DELETE.',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'Lifecycle.cs',
      code: `var context = new BlogContext();

// 1. Load (state: Unchanged)
var post = context.Posts.FirstOrDefault(p => p.Id == 1);

// 2. Modify (state: Modified) — EF sees the change
post.Title = "Updated Title";

// 3. SaveChanges — generates UPDATE query
context.SaveChanges();
// EF executes: UPDATE Posts SET Title = 'Updated Title' WHERE Id = 1`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'SaveChanges() is not automatic',
      text:
        'If you load data, modify it, and forget to call `SaveChanges()`, your changes are lost when the DbContext is disposed. This is intentional — you control when the database is actually hit.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'DbContext is not thread-safe',
    },
    {
      kind: 'paragraph',
      text:
        'In ASP.NET Core, always create a **new DbContext per request**. The dependency injection container does this for you automatically. Never store a single static DbContext and share it across threads — EF will throw.',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'PerRequest.cs',
      code: `// In ASP.NET Core Startup/Program.cs
services.AddDbContext<BlogContext>(options =>
    options.UseSqlite("Data Source=blog.db"));

// In a controller or service, inject it
public class PostController
{
    private readonly BlogContext _context;

    public PostController(BlogContext context)
    {
        _context = context;  // A new one, just for this request
    }

    public IActionResult GetPosts()
    {
        var posts = _context.Posts.ToList();
        return Ok(posts);
    }
}`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'SaveChanges() vs SaveChangesAsync()',
      text:
        'In async code (ASP.NET controllers, background jobs), use `await context.SaveChangesAsync()` instead of `SaveChanges()`. It frees the thread while the database write happens.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Putting it together: a small example',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'Example.cs',
      code: `public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class BlogContext : DbContext
{
    public DbSet<Author> Authors { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=blog.db");
    }
}

class Program
{
    static void Main()
    {
        using var context = new BlogContext();

        // Create and insert
        var author = new Author { Name = "Alice" };
        context.Authors.Add(author);
        context.SaveChanges();
        Console.WriteLine($"Inserted author with ID {author.Id}");

        // Query
        var all = context.Authors.ToList();
        Console.WriteLine($"Total authors: {all.Count}");
    }
}`,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'using statement',
      text:
        'DbContext implements `IDisposable`, so use `using` or manually call `.Dispose()` when done. This closes the database connection and releases resources.',
    },
    {
      kind: 'keyTakeaways',
      items: [
        '**DbContext** is your gateway to the database — one instance per request/session',
        '**DbSet<T>** represents a table — you query and mutate through it',
        'Add, Remove, and property changes are **staged in memory**; only `SaveChanges()` commits them',
        'EF tracks object state: Unchanged, Modified, Added, Deleted — it auto-generates the right SQL',
        'DbContext is **not thread-safe** — create a new one per HTTP request, never share across threads',
        'Always `using` (dispose) your DbContext to release the database connection',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'What does DbContext represent?',
      options: [
        { label: 'A single row in a table' },
        { label: 'A connection session to the database', correct: true },
        { label: 'A column definition' },
        { label: 'A query cache' },
      ],
      explanation:
        'DbContext is a session between your app and the database. It manages the connection, translates LINQ to SQL, and tracks changes.',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'What happens when you call Add() but not SaveChanges()?',
      code: `var context = new BlogContext();
var post = new Post { Title = "Test" };
context.Posts.Add(post);
// SaveChanges() is NOT called
// ... context is disposed`,
      options: [
        { label: 'The post is inserted immediately' },
        { label: 'The post is staged in memory but never saved to the database', correct: true },
        { label: 'An error is thrown' },
        { label: 'The post is saved to a temporary table' },
      ],
      explanation:
        'Add() stages the change in memory. Without SaveChanges(), no SQL is executed and the change is lost when the DbContext is disposed.',
    },
    {
      id: 'q3',
      kind: 'fill',
      prompt: 'What method commits all staged changes to the database?',
      template: `context.___()?`,
      accept: ['SaveChanges'],
      explanation:
        '`SaveChanges()` executes all pending INSERT, UPDATE, and DELETE queries in a single batch transaction.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Create a DbContext',
      prompt:
        'Define a simple `Student` class with Id, Name, and GPA properties. Then create a `SchoolContext : DbContext` that exposes a `DbSet<Student> Students` property. Configure it to use SQLite at "school.db".',
      hints: [
        'Inherit DbContext and override OnConfiguring.',
        'Use `options.UseSqlite("Data Source=school.db")`.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Insert, query, and update',
      prompt:
        "Using the SchoolContext from c1, write code that: (1) creates a new Student with Name='Bob' and GPA=3.5, (2) adds and saves it, (3) queries all students and prints their names, (4) updates Bob's GPA to 3.8, (5) saves and prints the updated list.",
      hints: [
        'Use Add(), SaveChanges(), and ToList().',
        'Remember to modify the object then SaveChanges() to persist the update.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Dependency injection in ASP.NET',
      prompt:
        'Set up a minimal ASP.NET Core app (dotnet new web) with DbContext dependency injection. Register SchoolContext in Program.cs, then create a simple GET endpoint that returns all students as JSON. Test it with curl or a browser.',
      hints: [
        'Use services.AddDbContext<SchoolContext>(...) in Program.cs.',
        'Inject SchoolContext into a MapGet handler.',
      ],
    },
  ],
};
