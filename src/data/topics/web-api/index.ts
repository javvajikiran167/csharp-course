import type { Topic } from '@/data/types';

export const webApi: Topic = {
  slug: 'web-api',
  title: 'Building a Web API',
  subtitle: 'Build production-grade REST APIs with ASP.NET Core',
  status: 'unlocked',
  lessons: [
  {
    "slug": "minimal-api",
    "number": 1,
    "title": "Minimal API — Hello World",
    "objective": "Spin up a web server in 5 lines of code.",
    "blocks": [
      {
        "kind": "lead",
        "text": "ASP.NET Core minimal APIs let you build production REST APIs in five lines. No controllers, no ceremony—just routes, handlers, and C#. Perfect for microservices, single-endpoint functions, or learning REST basics."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Your First API",
        "id": "first-api"
      },
      {
        "kind": "code",
        "code": "var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\napp.MapGet(\"/\", () => \"Hello, World!\");\n\napp.Run();",
        "language": "csharp"
      },
      {
        "kind": "paragraph",
        "text": "That's it. Run `dotnet run` and visit http://localhost:5000. MapGet maps HTTP GET requests to your handler."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Routes and Responses",
        "id": "routes"
      },
      {
        "kind": "code",
        "code": "app.MapGet(\"/users\", () => new[] { \"Alice\", \"Bob\" });\napp.MapGet(\"/users/{id}\", (int id) => $\"User {id}\");",
        "language": "csharp"
      },
      {
        "kind": "paragraph",
        "text": "Route parameters are bound automatically from the URL. ASP.NET Core serializes responses to JSON."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "HTTP Verbs",
        "id": "http-verbs"
      },
      {
        "kind": "code",
        "code": "app.MapPost(\"/users\", (User user) => user);\napp.MapPut(\"/users/{id}\", (int id, User user) => user);\napp.MapDelete(\"/users/{id}\", (int id) => Results.NoContent());",
        "language": "csharp"
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Minimal APIs are perfect for microservices",
        "text": "Use MapGet, MapPost, MapPut, MapDelete for REST. MapPost binds JSON request bodies automatically."
      },
      {
        "kind": "warn",
        "tone": "warn",
        "title": "Not a replacement for controllers",
        "text": "For large apps with shared logic and many endpoints, use controller-based APIs. Minimal APIs shine for simple services."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "Minimal APIs: MapGet, MapPost, MapPut, MapDelete for REST",
          "Route parameters bind from URL; request bodies from JSON",
          "ASP.NET Core serializes responses to JSON automatically",
          "Ideal for microservices and learning REST basics"
        ]
      }
    ]
  },
  {
    "slug": "routing",
    "number": 2,
    "title": "Routing & HTTP Verbs",
    "objective": "GET, POST, PUT, DELETE — and route patterns.",
    "blocks": []
  },
  {
    "slug": "controllers",
    "number": 3,
    "title": "Controllers vs Minimal API",
    "objective": "When to use which.",
    "blocks": []
  },
  {
    "slug": "model-binding",
    "number": 4,
    "title": "Model Binding & Validation",
    "objective": "How JSON becomes C# objects, and how to reject bad input.",
    "blocks": []
  },
  {
    "slug": "di",
    "number": 5,
    "title": "Dependency Injection",
    "objective": "The built-in DI container — register, inject, scope.",
    "blocks": []
  },
  {
    "slug": "middleware",
    "number": 6,
    "title": "Middleware Pipeline",
    "objective": "Authentication, CORS, logging — the pipeline behind every request.",
    "blocks": []
  },
  {
    "slug": "auth",
    "number": 7,
    "title": "Authentication & Authorization",
    "objective": "JWT tokens, [Authorize], policy-based authz.",
    "blocks": []
  },
  {
    "slug": "mini-project-api",
    "number": 8,
    "title": "Mini-Project — Tasks REST API",
    "objective": "CRUD a tasks list with EF Core + JWT auth.",
    "blocks": []
  }
],
  outline: []
};
