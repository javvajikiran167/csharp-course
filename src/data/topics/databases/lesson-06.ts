import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  slug: 'relationships',
  number: 6,
  title: 'One-to-Many & Many-to-Many',
  objective: 'Model real-world relationships in code.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Most databases aren\'t flat tables — they\'re webs of relationships. An Author has many Posts. A Post has many Tags. Learn to model these in C# with navigation properties, foreign keys, and fluent configuration, and your database design will be intuitive and maintainable.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**One-to-Many**: Author → Posts (one author, many posts)',
        '**Many-to-Many**: Posts ↔ Tags (one post, many tags; one tag, many posts; needs a join table)',
        'Foreign key = the scalar property (AuthorId). Navigation property = the reference or collection (Author, Posts).',
        'C# convention: plural collection names (Posts, Tags), singular references (Author, Tag)',
        'Fluent API: `.HasMany().WithOne()`, `.HasMany().WithMany()`, `.OnDelete()` cascading',
        'Cascade delete can be dangerous — understand the implications',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'One-to-Many relationships',
    },
    {
      kind: 'paragraph',
      text:
        'An Author has many Posts. In the database, the Posts table has an AuthorId foreign key. In C#, the Author class has a `List<Post> Posts` navigation property, and each Post has an `int AuthorId` and `Author Author` navigation property.',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'OneToMany.cs',
      code: `public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }

    // Navigation property: one author, many posts
    public List<Post> Posts { get; set; } = new();
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }

    // Foreign key
    public int AuthorId { get; set; }
    // Navigation property: each post links to one author
    public Author Author { get; set; }
}

public class BlogContext : DbContext
{
    public DbSet<Author> Authors { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure the relationship
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Author)
            .WithMany(a => a.Posts)
            .HasForeignKey(p => p.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);  // When author deleted, delete posts too
    }
}`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Using one-to-many relationships',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `var context = new BlogContext();

// Create author and posts
var author = new Author { Name = "Alice" };
var post1 = new Post { Title = "First Post", Author = author };
var post2 = new Post { Title = "Second Post", Author = author };

// Add the author (posts are added via the navigation property)
context.Authors.Add(author);
context.SaveChanges();

// Query an author with all their posts
var authorWithPosts = context.Authors
    .Include(a => a.Posts)  // Load the Posts collection
    .FirstOrDefault(a => a.Id == author.Id);

if (authorWithPosts != null)
{
    Console.WriteLine($"{authorWithPosts.Name} has {authorWithPosts.Posts.Count} posts");
    foreach (var post in authorWithPosts.Posts)
    {
        Console.WriteLine($"  - {post.Title}");
    }
}`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Many-to-Many relationships',
    },
    {
      kind: 'paragraph',
      text:
        'A Post can have multiple Tags, and each Tag can appear on multiple Posts. This requires a join table (the database creates one automatically in EF Core).',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'ManyToMany.cs',
      code: `public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }

    // Navigation property: many tags
    public List<Tag> Tags { get; set; } = new();
}

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; }

    // Navigation property: many posts with this tag
    public List<Post> Posts { get; set; } = new();
}

public class BlogContext : DbContext
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<Tag> Tags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // EF automatically creates a PostTag join table
        modelBuilder.Entity<Post>()
            .HasMany(p => p.Tags)
            .WithMany(t => t.Posts)
            .UsingEntity(j => j.ToTable("PostTags"));  // Optional: name the join table
    }
}`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Using many-to-many relationships',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `var context = new BlogContext();

// Create posts and tags
var post = new Post { Title = "Learning EF Core" };
var tag1 = new Tag { Name = "Database" };
var tag2 = new Tag { Name = "CSharp" };

// Associate tags with the post
post.Tags.Add(tag1);
post.Tags.Add(tag2);

context.Posts.Add(post);
context.SaveChanges();

// Query a post with all its tags
var postWithTags = context.Posts
    .Include(p => p.Tags)
    .FirstOrDefault(p => p.Id == post.Id);

Console.WriteLine($"{postWithTags.Title} has tags: {string.Join(", ", postWithTags.Tags.Select(t => t.Name))}");

// Query all posts with a specific tag
var tag = context.Tags.FirstOrDefault(t => t.Name == "Database");
var posts = context.Posts
    .Where(p => p.Tags.Any(t => t.Id == tag.Id))
    .Include(p => p.Tags)
    .ToList();`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Delete behaviors',
    },
    {
      kind: 'paragraph',
      text:
        'When you delete a row that\'s referenced by another table, what happens? EF gives you options via `.OnDelete()`:',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Cascade',
          items: [
            'If you delete the Author, all Posts are deleted too',
            'Use when: deleting a parent makes children meaningless',
            'Example: Author → Posts',
          ],
        },
        {
          title: 'Restrict',
          items: [
            'Prevents deletion if children exist',
            'Throws an error if you try to delete an Author with Posts',
            'Use when: you want to force explicit cleanup first',
          ],
        },
        {
          title: 'SetNull',
          items: [
            'Deletes the parent, sets the foreign key to NULL',
            'Requires the FK column to be nullable: `int? AuthorId`',
            'Use when: children can exist without a parent',
          ],
        },
        {
          title: 'NoAction',
          items: [
            'The database enforces the constraint; EF does nothing',
            'Rarely used; similar to Restrict',
            'Depends on database behavior',
          ],
        },
      ],
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `// Example: Cascade delete
modelBuilder.Entity<Post>()
    .HasOne(p => p.Author)
    .WithMany(a => a.Posts)
    .HasForeignKey(p => p.AuthorId)
    .OnDelete(DeleteBehavior.Cascade);

// If you delete an Author:
var author = context.Authors.Find(1);
context.Authors.Remove(author);
context.SaveChanges();
// All Posts with AuthorId = 1 are deleted too

// Example: Restrict delete
modelBuilder.Entity<Post>()
    .HasOne(p => p.Author)
    .WithMany(a => a.Posts)
    .OnDelete(DeleteBehavior.Restrict);

// Trying to delete an Author with Posts throws an error`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Cascade delete is dangerous',
      text:
        'Cascade can accidentally wipe large amounts of data. Be explicit about when you want it. In many applications, `Restrict` is safer — it forces you to think about cleanup.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'A real-world example: Blog Schema',
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'BlogSchema.cs',
      code: `public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Post> Posts { get; set; } = new();
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }

    // One-to-Many: Post → Author
    public int AuthorId { get; set; }
    public Author Author { get; set; }

    // Many-to-Many: Post ↔ Tags
    public List<Tag> Tags { get; set; } = new();

    // One-to-Many: Post → Comments
    public List<Comment> Comments { get; set; } = new();
}

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Post> Posts { get; set; } = new();
}

public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; }

    public int PostId { get; set; }
    public Post Post { get; set; }
}

public class BlogContext : DbContext
{
    public DbSet<Author> Authors { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Comment> Comments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=blog.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Post → Author (one-to-many)
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Author)
            .WithMany(a => a.Posts)
            .OnDelete(DeleteBehavior.Cascade);

        // Post ↔ Tags (many-to-many)
        modelBuilder.Entity<Post>()
            .HasMany(p => p.Tags)
            .WithMany(t => t.Posts);

        // Post → Comments (one-to-many)
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .OnDelete(DeleteBehavior.Cascade);
    }
}`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Querying with includes (deep)',
    },
    {
      kind: 'code',
      language: 'csharp',
      code: `var context = new BlogContext();

// Get a post with its author and all its tags
var post = context.Posts
    .Include(p => p.Author)
    .Include(p => p.Tags)
    .FirstOrDefault(p => p.Id == 1);

// Get an author with all posts, and for each post, its tags
var author = context.Authors
    .Include(a => a.Posts)
        .ThenInclude(p => p.Tags)
    .FirstOrDefault(a => a.Id == 1);`,
    },
    {
      kind: 'keyTakeaways',
      items: [
        '**One-to-Many**: Author → Posts. Foreign key in Post (AuthorId), navigation collections on both sides.',
        '**Many-to-Many**: Post ↔ Tags. EF creates a join table automatically. Navigation collections on both sides.',
        '**Foreign key** = scalar property (int AuthorId). **Navigation** = reference or collection.',
        'Use `.Include()` to load related data; use `.ThenInclude()` for nested relationships.',
        '**OnDelete()** determines what happens when a parent is deleted: Cascade, Restrict, SetNull, NoAction.',
        'Cascade delete is powerful but dangerous — understand the implications before using it.',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'In a one-to-many relationship (Author → Posts), where does the foreign key live?',
      options: [
        { label: 'In the Authors table' },
        { label: 'In the Posts table', correct: true },
        { label: 'In a separate join table' },
        { label: 'In both tables' },
      ],
      explanation:
        'The many side (Posts) holds the foreign key (AuthorId) that points to the one side (Authors).',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'What does EF Core automatically create for a many-to-many relationship?',
      code: `public class Post
{
    public List<Tag> Tags { get; set; } = new();
}

public class Tag
{
    public List<Post> Posts { get; set; } = new();
}`,
      options: [
        { label: 'A foreign key in the Post table' },
        { label: 'A foreign key in the Tag table' },
        { label: 'A join table (PostTag) with foreign keys to both', correct: true },
        { label: 'Nothing — the relationship is virtual' },
      ],
      explanation:
        'EF automatically creates a join table (usually named PostTag or PostTags) that contains foreign keys to both Posts and Tags.',
    },
    {
      id: 'q3',
      kind: 'fill',
      prompt:
        'What LINQ method loads related collections, and what method loads nested related data?',
      template: `context.Authors.___(...).___(...).ToList()`,
      accept: ['Include', 'ThenInclude'],
      explanation:
        '`Include()` loads a collection. `ThenInclude()` loads data related to the included collection.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Model a one-to-many relationship',
      prompt:
        'Define Student and Course classes where one Course has many Students. Add the appropriate foreign key, navigation properties, and DbContext configuration.',
      hints: [
        'Course has List<Student> Students. Student has int CourseId and Course Course.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Insert and query one-to-many',
      prompt:
        'Create a Course, add 3 Students to it, save, then query the course with all its students. Print the course name and each student name.',
      hints: [
        'Add students to the collection, not individually.',
        'Use Include() when querying.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Implement many-to-many',
      prompt:
        'Define Book and Author classes in a many-to-many relationship (one book, many authors; one author, many books). Create a Book with 2 Authors, save, then query all books by a specific author.',
      hints: [
        'Both classes have List<> navigation properties.',
        'The join table is auto-created.',
      ],
    },
  ],
};
