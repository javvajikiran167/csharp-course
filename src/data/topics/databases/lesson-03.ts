import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  slug: 'migrations',
  number: 3,
  title: 'Migrations & Schema Evolution',
  objective: 'Add a column without losing data.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Your database schema changes as your app evolves. Migrations are version-controlled C# files that describe schema changes step-by-step — so you can go forward, backward, and push changes to production safely.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Migration = a diff of the schema**, not the data',
        'Two approaches: **Code-first** (modify your model, EF generates the migration) and **Database-first** (rare; usually avoided)',
        '`dotnet ef migrations add <Name>` creates a timestamped migration file in Migrations/ folder',
        '`dotnet ef database update` applies pending migrations',
        '`dotnet ef migrations remove` deletes the most recent unapplied migration (dev only)',
        'Show the __EFMigrationsHistory table — EF tracks which migrations have been applied',
        'Pitfall: modifying a migration file after applying it causes desync — regenerate instead',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What is a migration?',
    },
    {
      kind: 'paragraph',
      text:
        'A migration is a pair of C# files (Up and Down methods) that describes a change to your schema. Add a column to your model, run `dotnet ef migrations add AddColumnName`, and EF generates a migration file that knows how to apply and revert that change.',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'Post.cs (your model)',
      code: `public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    // Added: new column
    public DateTime CreatedAt { get; set; }
}`,
    },
    {
      kind: 'paragraph',
      text:
        'After modifying your model, run:',
    },
    {
      kind: 'code',
      language: 'bash',
      code: `dotnet ef migrations add AddPostCreatedAt`,
    },
    {
      kind: 'paragraph',
      text:
        'EF generates a new migration file that contains the Up() and Down() methods:',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: '20260621123456_AddPostCreatedAt.cs',
      code: `public partial class AddPostCreatedAt : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<DateTime>(
            name: "CreatedAt",
            table: "Posts",
            type: "TEXT",
            nullable: false,
            defaultValue: new DateTime(2026, 6, 21, 0, 0, 0, 0, DateTimeKind.Unspecified));
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "CreatedAt",
            table: "Posts");
    }
}`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Applying migrations with dotnet ef database update',
    },
    {
      kind: 'paragraph',
      text:
        'After creating a migration, run `dotnet ef database update` to apply it to your database. EF reads the `__EFMigrationsHistory` table to know which migrations you\'ve already applied, and runs only the new ones.',
    },
    {
      kind: 'code',
      language: 'bash',
      code: `$ dotnet ef database update
Build started...
Build completed.
Applying migration '20260621123456_AddPostCreatedAt'.
Done.`,
    },
    {
      kind: 'paragraph',
      text:
        'Your database now has the `CreatedAt` column on the Posts table. All existing rows get the defaultValue (you specify this in the migration).',
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Typical workflow',
      text:
        '(1) Modify your model class. (2) Run `dotnet ef migrations add YourName`. (3) Review the generated migration (edit if needed). (4) Run `dotnet ef database update`. (5) Test. (6) Commit the migration file to git.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Reverting migrations',
    },
    {
      kind: 'paragraph',
      text:
        'If you haven\'t pushed to production, you can remove the most recent unapplied migration with `dotnet ef migrations remove`. If the migration is already applied, call `dotnet ef database update` with a target migration to roll back.',
    },
    {
      kind: 'code',
      language: 'bash',
      code: `# Remove the most recent unapplied migration (dev only)
dotnet ef migrations remove

# Roll back to a specific migration (runs the Down() method of later migrations)
dotnet ef database update 20260620000000_PreviousMigration`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Never edit applied migrations',
      text:
        'Once a migration is applied (EF has recorded it in __EFMigrationsHistory), do not edit its C# file. If you need to change it, create a new migration that fixes the schema. Editing an applied migration will cause the database to diverge from your C# model.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Common migrations — examples',
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Add a column',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// In your model
public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Email { get; set; }  // NEW
}

// Command
dotnet ef migrations add AddPostEmail

// Generated Up()
migrationBuilder.AddColumn<string>(
    name: "Email",
    table: "Posts",
    type: "TEXT",
    nullable: true);`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Rename a column',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// In your model
public class Post
{
    public int Id { get; set; }
    public string Author { get; set; }  // Changed from "AuthorName"
}

// After running migrations add, you may need to edit the migration:
migrationBuilder.RenameColumn(
    name: "AuthorName",
    table: "Posts",
    newName: "Author");`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Create a new table',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// In your model
public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; }
    public int PostId { get; set; }
}

// Update DbContext
public class BlogContext : DbContext
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }  // NEW
}

// Command
dotnet ef migrations add AddCommentTable

// Generated Up() creates the Comments table`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Hands-on: from model to database',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'FullExample.cs',
      code: `// 1. Define your model
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

// 2. Create a DbContext
public class StoreContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=store.db");
    }
}

// 3. Create initial migration
// $ dotnet ef migrations add InitialCreate

// 4. Apply it
// $ dotnet ef database update

// 5. Now you can use it
using var context = new StoreContext();
var product = new Product { Name = "Laptop", Price = 1299.99m };
context.Products.Add(product);
context.SaveChanges();
Console.WriteLine("Product added!");`,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Nullable reference types',
      text:
        'If you see `#nullable enable`, be aware that string properties without a default value are treated as non-nullable. In migrations, nullable false columns require a default value or existing NULL rows cause an error. Use `[Required]` attribute or `nullable: false` in your model to be explicit.',
    },
    {
      kind: 'keyTakeaways',
      items: [
        '**Migrations** are C# files (Up/Down methods) that describe schema changes version-by-version',
        '**dotnet ef migrations add <Name>** generates a migration from your model changes',
        '**dotnet ef database update** applies pending migrations and creates tables',
        'EF tracks applied migrations in the `__EFMigrationsHistory` table',
        'Never edit an applied migration — create a new one to fix issues',
        'Migration files are committed to git so the team stays in sync with schema changes',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'What command generates a migration from your model changes?',
      options: [
        { label: 'dotnet ef database update' },
        { label: 'dotnet ef migrations add <Name>', correct: true },
        { label: 'dotnet ef migrations apply' },
        { label: 'dotnet build' },
      ],
      explanation:
        '`dotnet ef migrations add` compares your current model to the last migration and generates a new migration file with Up() and Down() methods.',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'What happens if you modify a model but forget to run `dotnet ef migrations add`?',
      code: `public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }  // Added this
}
// But skipped: dotnet ef migrations add`,
      options: [
        { label: 'The Email column is created automatically at runtime' },
        { label: 'Your database schema and C# model are out of sync', correct: true },
        { label: 'An error is thrown when you try to access Users' },
        { label: 'The change is queued for the next build' },
      ],
      explanation:
        'Migrations must be explicitly created and applied. Skipping the migration leaves your C# model ahead of your database schema. When you try to use the property, EF may throw an exception.',
    },
    {
      id: 'q3',
      kind: 'fill',
      prompt:
        'What command applies all pending migrations to your database?',
      template: `dotnet ef database ___`,
      accept: ['update'],
      explanation:
        '`dotnet ef database update` reads __EFMigrationsHistory and runs any unapplied migrations.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Create and apply an initial migration',
      prompt:
        'Define a Book model (Id, Title, Author, ISBN) and a LibraryContext. Create an initial migration called "InitialCreate" and apply it. Verify that book.db exists and contains the Books table.',
      hints: [
        'Run: dotnet ef migrations add InitialCreate && dotnet ef database update',
        'Use SQLite and check the result with your file browser or a SQLite tool.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Add a column and migrate',
      prompt:
        'Starting from your Book model, add a PublishedDate property. Create a new migration "AddPublishedDate" and apply it. Insert a book record and verify the new column exists.',
      hints: [
        'Modify the model, run `dotnet ef migrations add AddPublishedDate`, then `dotnet ef database update`.',
        'Use `DateTime.Parse()` or `new DateTime()` to set a date when inserting.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Rollback and regenerate',
      prompt:
        'Create a migration that adds a "Rating" column. Apply it, then use `dotnet ef database update` to roll back to the previous migration. Verify the Rating column is gone. Then re-apply the migration and confirm it comes back.',
      hints: [
        'To rollback: dotnet ef database update <previous-migration-name>',
        'List all migrations with: dotnet ef migrations list',
      ],
    },
  ],
};
