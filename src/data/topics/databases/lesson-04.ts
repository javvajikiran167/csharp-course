import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  slug: 'querying',
  number: 4,
  title: 'Querying with LINQ to EF',
  objective: 'Where, Include, OrderBy — how queries translate to SQL.',
  blocks: [
    {
      kind: 'lead',
      text:
        'LINQ looks like C# but runs as SQL on the server. Understand the difference between IQueryable (translated to SQL) and IEnumerable (in-memory), and you\'ll write fast, database-efficient queries.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**IQueryable<T> = lazy, executed on the database**; **IEnumerable = in-memory**',
        'LINQ to EF translates Where, Select, OrderBy, Take, Include into SQL automatically',
        '`ToList()` forces execution — do it as late as possible',
        '`Include()` is how you eager-load related data (prevents N+1 queries)',
        'Show side-by-side: the LINQ query and the SQL it generates (use .ToQueryString() or profiler)',
        'Common mistake: calling .ToList() too early, then filtering in memory with .Where() after',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'IQueryable vs IEnumerable',
    },
    {
      kind: 'paragraph',
      text:
        'DbSet<T> is an `IQueryable<T>`. When you chain LINQ methods on it, you\'re building a SQL query that hasn\'t run yet. Only when you call `.ToList()`, `.FirstOrDefault()`, or `.Any()` does EF translate it to SQL and execute it on the server.',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `var context = new BlogContext();

// This does NOT hit the database yet — it\'s just building the query
IQueryable<Post> query = context.Posts
    .Where(p => p.Status == "Published")
    .OrderBy(p => p.CreatedAt);

// NOW it hits the database and returns a List<Post>
List<Post> results = query.ToList();`,
    },
    {
      kind: 'paragraph',
      text:
        'Compare to LINQ to Objects (in-memory):',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// posts is already a List<Post> — in memory
List<Post> posts = new List<Post> { ... };

// Where returns IEnumerable<Post>, still in-memory
// Filtering happens on the client
IEnumerable<Post> filtered = posts
    .Where(p => p.Status == "Published")
    .OrderBy(p => p.CreatedAt);`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'The anti-pattern: ToList() too early',
      text:
        'Do NOT do this: `context.Posts.ToList().Where(p => p.Status == "Published")`. This loads the entire Posts table into memory, then filters in C#. Instead: `context.Posts.Where(p => p.Status == "Published").ToList()` — the filter runs on the database.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Common LINQ-to-EF queries',
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Where — filter rows',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Find all published posts
var published = context.Posts
    .Where(p => p.Status == "Published")
    .ToList();

// Multiple conditions
var recent = context.Posts
    .Where(p => p.CreatedAt > DateTime.Now.AddMonths(-1) && p.Status == "Published")
    .ToList();`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Select — pick columns',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Get only titles and ids (not full objects)
var titles = context.Posts
    .Select(p => new { p.Id, p.Title })
    .ToList();

// Project into a DTO
var dtos = context.Posts
    .Select(p => new PostDto
    {
        Id = p.Id,
        Title = p.Title,
        Summary = p.Content.Substring(0, 50)
    })
    .ToList();`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'OrderBy / ThenBy — sort results',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Sort ascending by created date
var sorted = context.Posts
    .OrderBy(p => p.CreatedAt)
    .ToList();

// Sort descending
var newest = context.Posts
    .OrderByDescending(p => p.CreatedAt)
    .ToList();

// Multi-level sort: first by status, then by date
var complex = context.Posts
    .OrderBy(p => p.Status)
    .ThenByDescending(p => p.CreatedAt)
    .ToList();`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Take & Skip — pagination',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Get the first 10 posts
var first10 = context.Posts
    .OrderByDescending(p => p.CreatedAt)
    .Take(10)
    .ToList();

// Pagination: page 2 (10 per page)
int pageSize = 10;
int pageNumber = 2;
var page2 = context.Posts
    .OrderByDescending(p => p.CreatedAt)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToList();`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'FirstOrDefault / SingleOrDefault — get one row',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Get the first published post (ordered by date)
var first = context.Posts
    .Where(p => p.Status == "Published")
    .OrderByDescending(p => p.CreatedAt)
    .FirstOrDefault();  // Returns null if no match

// Get exactly one post by ID (throws if multiple or none)
var post = context.Posts.SingleOrDefault(p => p.Id == 5);
if (post == null)
{
    Console.WriteLine("Post not found");
}`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Include — load related data (eager loading)',
    },
    {
      kind: 'paragraph',
      text:
        'When a Post has a foreign key to Author, querying posts without loading authors causes the "N+1 query problem": one query to load posts, then N more queries to load each author. Use `Include()` to load related data in a single query.',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// BAD: N+1 queries
// First query: SELECT * FROM Posts
var posts = context.Posts.ToList();
// Then in a loop: SELECT * FROM Authors WHERE Id = ...
foreach (var post in posts)
{
    var author = post.Author.Name;  // Triggers a query for each post!
}

// GOOD: Single query with JOIN
var posts = context.Posts
    .Include(p => p.Author)  // Load the related Author
    .ToList();
// Now post.Author is populated without extra queries
foreach (var post in posts)
{
    var author = post.Author.Name;  // Already loaded
}`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Deep includes — nested relationships',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// If Author has a related Publisher, load multiple levels
var posts = context.Posts
    .Include(p => p.Author)
        .ThenInclude(a => a.Publisher)
    .ToList();

// Or include multiple collections
var posts = context.Posts
    .Include(p => p.Author)
    .Include(p => p.Comments)  // Load all comments on each post
    .ToList();`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Use Include judiciously',
      text:
        'Including too many relationships creates large joins. Sometimes it\'s better to do two queries: one for posts, one for comments separately. Profile with a database tool to find the sweet spot.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Seeing the generated SQL',
    },
    {
      kind: 'paragraph',
      text:
        'To debug your queries, use `ToQueryString()` to see the SQL EF generates:',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `var query = context.Posts
    .Where(p => p.Status == "Published")
    .OrderByDescending(p => p.CreatedAt);

// Print the SQL
string sql = query.ToQueryString();
Console.WriteLine(sql);
// Output:
// SELECT "p"."Id", "p"."Title", "p"."Content", "p"."Status", "p"."CreatedAt"
// FROM "Posts" AS "p"
// WHERE "p"."Status" = @p0
// ORDER BY "p"."CreatedAt" DESC`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'A complete example',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'QueryExample.cs',
      code: `public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; }

    public int AuthorId { get; set; }
    public Author Author { get; set; }
}

public class BlogContext : DbContext
{
    public DbSet<Author> Authors { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=blog.db");
    }
}

// Usage
var context = new BlogContext();

// Get the 5 most recent published posts with their authors
var recentPosts = context.Posts
    .Where(p => p.Status == "Published")
    .OrderByDescending(p => p.CreatedAt)
    .Take(5)
    .Include(p => p.Author)
    .ToList();

foreach (var post in recentPosts)
{
    Console.WriteLine($"{post.Title} by {post.Author.Name}");
}`,
    },
    {
      kind: 'keyTakeaways',
      items: [
        '**IQueryable** is lazy and translated to SQL; **IEnumerable** runs in memory',
        'LINQ methods on DbSet (Where, Select, OrderBy) build a SQL query',
        'Call `.ToList()`, `.FirstOrDefault()`, or `.Any()` to execute the query on the server',
        'Never call `.ToList()` before `.Where()` — filter on the database first',
        '**Include()** loads related data in one query; omitting it causes N+1 queries',
        'Use `.ToQueryString()` to inspect the generated SQL and debug query performance',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'When does this query execute on the database?',
      options: [
        { label: 'When you build the query with Where()' },
        { label: 'When you call .ToList()', correct: true },
        { label: 'When you call Count()' },
        { label: 'Both ToList() and FirstOrDefault()' },
      ],
      explanation:
        'LINQ to EF is lazy. The query doesn\'t run until you call a terminal operator like ToList(), FirstOrDefault(), Count(), or Any().',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'Which query is efficient?',
      code: `// Option A
var posts = context.Posts.ToList()
    .Where(p => p.AuthorId == 3)
    .ToList();

// Option B
var posts = context.Posts
    .Where(p => p.AuthorId == 3)
    .ToList();`,
      options: [
        { label: 'Option A' },
        { label: 'Option B', correct: true },
        { label: 'Both are equally efficient' },
        { label: 'Neither — filtering is not supported' },
      ],
      explanation:
        'Option A loads ALL posts into memory, then filters in C#. Option B filters in SQL before loading. Always filter on the database first.',
    },
    {
      id: 'q3',
      kind: 'fill',
      prompt:
        'What LINQ method loads related data and prevents N+1 queries?',
      template: `context.Posts.___(p => p.Author).ToList()`,
      accept: ['Include'],
      explanation:
        '`Include()` eager-loads the related Author with each Post in a single query, avoiding N+1.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Write a filtered query',
      prompt:
        'Query all Posts where Status is "Published" and CreatedAt is in the last 30 days. Order by CreatedAt descending. Print the count and first 3 titles.',
      hints: [
        'Use .Where() with && for multiple conditions.',
        'Use DateTime.Now.AddDays(-30) to get the cutoff date.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Pagination and Include',
      prompt:
        'Implement pagination: fetch page 2 (10 posts per page), sorted by date descending, with Author included. Calculate the total page count.',
      hints: [
        'Use Skip() and Take().',
        'Use Include() to load authors.',
        'Count total posts with .Count() to calculate page count.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Query performance analysis',
      prompt:
        'Write two versions of the same query: one with Include() and one without. Measure how many database queries are sent for each (enable logging or use .ToQueryString()). Explain the difference and why one is faster.',
      hints: [
        'Use optionsBuilder.LogTo(Console.WriteLine) to see queries.',
        'Or use .ToQueryString() on IQueryable.',
      ],
    },
  ],
};
