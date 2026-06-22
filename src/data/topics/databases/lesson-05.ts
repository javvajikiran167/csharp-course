import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  slug: 'crud',
  number: 5,
  title: 'Insert, Update, Delete',
  objective: 'The state-tracking model EF uses for changes.',
  blocks: [
    {
      kind: 'lead',
      text:
        'EF tracks the state of every object you load or create — Unchanged, Modified, Added, Deleted. When you call SaveChanges(), it auto-generates the right INSERT, UPDATE, or DELETE query based on state. Learn this, and you\'ll never write raw SQL for CRUD again.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Entity state** = how EF knows whether to INSERT, UPDATE, or DELETE',
        'Loaded from DB = Unchanged. Modify a property = Modified. Call Add() = Added. Call Remove() = Deleted.',
        '`SaveChanges()` inspects the ChangeTracker to decide which SQL to generate',
        'Detached state = the object exists but EF doesn\'t track it (e.g., deserialized from JSON)',
        'Use `context.Entry(obj).State` to inspect or manually set state',
        'Bulk operations: EF generates individual queries by default; show ExecuteUpdate/ExecuteDelete for batch ops',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Entity states: the life cycle',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Unchanged',
          items: [
            'You loaded this entity from the database',
            'No properties have changed',
            'SaveChanges() generates no query for it',
          ],
        },
        {
          title: 'Modified',
          items: [
            'You loaded it, then changed a property',
            'EF detected the change',
            'SaveChanges() generates an UPDATE query',
          ],
        },
        {
          title: 'Added',
          items: [
            'You called Add() on a new object',
            'SaveChanges() generates an INSERT query',
            'After insert, the object\'s ID is set by the database',
          ],
        },
        {
          title: 'Deleted',
          items: [
            'You called Remove() on an object',
            'SaveChanges() generates a DELETE query',
            'After delete, the object is detached',
          ],
        },
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'INSERT — adding new rows',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `var context = new BlogContext();

// Create a new Post (state = Detached, hasn't been Added yet)
var post = new Post
{
    Title = "EF Core Guide",
    Content = "Learn EF...",
    CreatedAt = DateTime.Now
};

// Add it (state = Added)
context.Posts.Add(post);

// SaveChanges() generates:
// INSERT INTO Posts (Title, Content, CreatedAt) VALUES (@p0, @p1, @p2)
context.SaveChanges();

// After SaveChanges(), the database set post.Id
Console.WriteLine($"New post ID: {post.Id}");  // e.g., 42`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Adding multiple entities',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `var posts = new List<Post>
{
    new Post { Title = "Post 1", Content = "..." },
    new Post { Title = "Post 2", Content = "..." },
    new Post { Title = "Post 3", Content = "..." }
};

// Add all at once
context.Posts.AddRange(posts);
context.SaveChanges();`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'UPDATE — modifying rows',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Load a post (state = Unchanged)
var post = context.Posts.FirstOrDefault(p => p.Id == 5);

// Modify a property (state = Modified)
post.Title = "Updated Title";

// SaveChanges() generates:
// UPDATE Posts SET Title = @p0 WHERE Id = @p1
context.SaveChanges();`,
    },
    {
      kind: 'paragraph',
      text:
        'EF only updates the properties you actually changed. If you load a post, change only the title, and save, the UPDATE touches only the Title column.',
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Bulk update with ExecuteUpdate',
    },
    {
      kind: 'paragraph',
      text:
        'For updating many rows at once without loading them, use `ExecuteUpdate()` (EF 7+). It generates a single SQL UPDATE without loading entities:',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Update all old posts to archived status (no loading)
await context.Posts
    .Where(p => p.CreatedAt < DateTime.Now.AddYears(-1))
    .ExecuteUpdateAsync(s => s
        .SetProperty(p => p.Status, "Archived"));

// Generated SQL:
// UPDATE Posts SET Status = 'Archived' WHERE CreatedAt < @p0`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'DELETE — removing rows',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Load a post (state = Unchanged)
var post = context.Posts.FirstOrDefault(p => p.Id == 5);

// Remove it (state = Deleted)
context.Posts.Remove(post);

// SaveChanges() generates:
// DELETE FROM Posts WHERE Id = @p0
context.SaveChanges();`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Bulk delete with ExecuteDelete',
    },
    {
      kind: 'paragraph',
      text:
        'For deleting many rows, use `ExecuteDelete()` to avoid loading:',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Delete all spam posts without loading them
await context.Posts
    .Where(p => p.Status == "Spam")
    .ExecuteDeleteAsync();

// Generated SQL:
// DELETE FROM Posts WHERE Status = 'Spam'`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Inspecting entity state',
    },
    {
      kind: 'paragraph',
      text:
        'Use the `ChangeTracker` to see which entities have changed and what state they\'re in:',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `var post = context.Posts.FirstOrDefault(p => p.Id == 1);
post.Title = "New Title";

// Check the state
var entry = context.Entry(post);
Console.WriteLine($"State: {entry.State}");  // Output: Modified

// See which properties changed
foreach (var prop in entry.Properties)
{
    if (prop.IsModified)
    {
        Console.WriteLine($"{prop.Metadata.Name} changed");
    }
}

// Manually set state (rare)
entry.State = EntityState.Added;`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The detached object problem',
    },
    {
      kind: 'paragraph',
      text:
        'If you deserialize an object from JSON (e.g., from an API request), it\'s Detached — EF doesn\'t know its previous state. When you try to save it, EF doesn\'t know if it\'s new or a modification.',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// POST /api/posts — receives JSON that becomes a Post object
[HttpPost]
public IActionResult CreatePost([FromBody] Post post)
{
    // post is Detached (came from JSON, not loaded from DB)

    if (post.Id == 0)
    {
        // It's new
        context.Posts.Add(post);
    }
    else
    {
        // It's an update — Attach it and mark as Modified
        context.Posts.Attach(post);
        context.Entry(post).State = EntityState.Modified;
    }

    context.SaveChanges();
    return Ok(post);
}`,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Attach vs Update',
      text:
        '`Attach()` marks an entity as Unchanged (trusts the client). `Update()` marks it as Modified (assumes all properties changed). Use `Update()` when the client sends the full object; use `Attach()` then manual state changes for partial updates.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'A complete CRUD example',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'CrudExample.cs',
      code: `public class TodoContext : DbContext
{
    public DbSet<Todo> Todos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=todos.db");
    }
}

public class Todo
{
    public int Id { get; set; }
    public string Title { get; set; }
    public bool Done { get; set; }
}

// CREATE
var context = new TodoContext();
var todo = new Todo { Title = "Learn EF Core", Done = false };
context.Todos.Add(todo);
context.SaveChanges();
Console.WriteLine($"Created: {todo.Id}");

// READ
var retrieved = context.Todos.FirstOrDefault(t => t.Id == todo.Id);
Console.WriteLine($"Retrieved: {retrieved.Title}");

// UPDATE
retrieved.Done = true;
context.SaveChanges();
Console.WriteLine("Updated");

// DELETE
context.Todos.Remove(retrieved);
context.SaveChanges();
Console.WriteLine("Deleted");`,
    },
    {
      kind: 'keyTakeaways',
      items: [
        '**Entity state** (Unchanged, Modified, Added, Deleted) tells EF which SQL to generate',
        'Loading an entity = Unchanged. Modifying it = Modified. SaveChanges() generates UPDATE.',
        'Call `Add()` for new entities. SaveChanges() generates INSERT and sets the ID.',
        'Call `Remove()` to delete. SaveChanges() generates DELETE.',
        'Use `ExecuteUpdate()` and `ExecuteDelete()` for bulk operations without loading.',
        '**Detached** objects (from JSON) need `Attach()` or `Update()` before SaveChanges() knows what to do.',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What state is a Post in after calling context.Posts.Add(post)?',
      code: `var post = new Post { Title = "New" };
context.Posts.Add(post);
// What state is post in now (before SaveChanges)?`,
      options: [
        { label: 'Unchanged' },
        { label: 'Modified' },
        { label: 'Added', correct: true },
        { label: 'Deleted' },
      ],
      explanation:
        'After Add(), the entity state is Added. SaveChanges() will generate an INSERT query.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt: 'What happens if you modify a property but forget to call SaveChanges()?',
      options: [
        { label: 'The change is automatically saved to the database' },
        { label: 'The change is saved when the DbContext is disposed' },
        { label: 'The change is lost when the DbContext is disposed', correct: true },
        { label: 'An error is thrown' },
      ],
      explanation:
        'Changes are tracked in memory only. Without SaveChanges(), they are never sent to the database. When the DbContext is disposed, the changes are lost.',
    },
    {
      id: 'q3',
      kind: 'fill',
      prompt: 'What method generates a single DELETE query for many rows without loading them?',
      template: `await context.Posts.Where(...).___Async()`,
      accept: ['ExecuteDelete'],
      explanation:
        '`ExecuteDeleteAsync()` (EF 7+) generates a DELETE WHERE query without loading entities, making bulk deletes efficient.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'CRUD cycle',
      prompt:
        'Create a Todo model. Write code that creates 3 todos, reads them all, updates the second one\'s Done property to true, deletes the third, and prints the final list.',
      hints: [
        'Use Add(), FirstOrDefault(), SaveChanges(), Remove().',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Bulk update with ExecuteUpdate',
      prompt:
        'Create 5 posts with dates spread across multiple years. Use ExecuteUpdate() to mark all posts older than 1 year as "Archived" without loading them. Verify the change.',
      hints: [
        'Use DateTime.Now.AddYears(-1) to set the cutoff.',
        'Use .SetProperty() inside ExecuteUpdate().',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'API endpoint with detached objects',
      prompt:
        'Create a minimal ASP.NET endpoint POST /api/posts that accepts JSON and either inserts (if ID=0) or updates (if ID>0) a post. Handle the Detached state properly using Attach() or Update(). Test with curl.',
      hints: [
        'Check post.Id to decide between Add() and Update().',
        'Use [HttpPost] and [FromBody].',
      ],
    },
  ],
};
