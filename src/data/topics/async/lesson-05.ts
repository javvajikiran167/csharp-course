import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  "slug": "cancellation",
  "number": 5,
  "title": "CancellationToken",
  "objective": "Stop async work cleanly when the user navigates away, a request times out, or a background task is shut down — using CancellationToken throughout the call chain.",
  "blocks": [
    {
      "kind": "lead",
      "text": "Imagine a user clicks \"Search\" on your website, waits two seconds, then navigates away. Without cancellation, your server keeps running the database query, fetching external APIs, and allocating memory — all for a client that is already gone. **CancellationToken** is the .NET mechanism that fixes this. It is how every layer of your async stack — controllers, services, repositories, HTTP clients — cooperates to stop work the moment it is no longer needed."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open with the abandoned-search analogy before showing any code — students need to feel the problem before they see the solution.",
        "Python comparison: Python asyncio raises CancelledError into a coroutine from the outside (task.cancel()). C# is more explicit: the caller creates a CancellationTokenSource, passes its .Token down the chain, and each layer checks it. Neither approach is automatically cooperative — both require the code to actually look for the signal.",
        "Stress 'producer vs consumer' roles: CancellationTokenSource is the producer (it creates and fires the signal), CancellationToken is the consumer handle (read-only, safe to pass everywhere).",
        "The CancelAfter + linked-token patterns are where students often get confused — spend extra time on the diagram.",
        "ASP.NET Core auto-binding is a 'wow' moment: show that you literally just add CancellationToken to the method signature and the framework wires it up.",
        "The warn callout about Task.Delay without a token is a real production gotcha — enforce it hard.",
        "The ASP.NET Core and BackgroundService code blocks include minimal stub types (DatabaseContext, Product, etc.) so they compile as shown. In a real project these come from your EF Core model and domain layer.",
        "End with the 'pass it everywhere' rule: if you accept a token, forward it to every awaitable call inside that method, no exceptions."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The Two Roles: Producer and Consumer",
      "id": "producer-consumer"
    },
    {
      "kind": "paragraph",
      "text": "C# splits cancellation into two separate objects on purpose. **`CancellationTokenSource`** is the *producer* — it holds the power to trigger cancellation. **`CancellationToken`** is the *consumer handle* — a read-only struct you pass down into async methods. This separation means your library code can accept a token and act on it, without ever being able to cancel other callers' work by accident."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "CancellationTokenSource (Producer)",
          "items": [
            "You create it: `new CancellationTokenSource()`",
            "Call `.Cancel()` to fire immediately",
            "Call `.CancelAfter(TimeSpan)` to schedule a timeout",
            "Expose `.Token` to hand to consumers",
            "**Dispose it** when done — it holds OS handles"
          ]
        },
        {
          "title": "CancellationToken (Consumer)",
          "items": [
            "Received as a parameter — never created directly",
            "`.IsCancellationRequested` — check without throwing",
            "`.ThrowIfCancellationRequested()` — check and throw `OperationCanceledException`",
            "`CancellationToken.None` — \"I don't support cancellation\"",
            "Pass it to every awaitable API you call inside your method"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Your First Cancellable Method",
      "id": "first-cancellable"
    },
    {
      "kind": "paragraph",
      "text": "Here is the pattern you will write dozens of times in a real codebase. The caller creates a `CancellationTokenSource`, sets a timeout, and passes the token down. The async method accepts the token, checks it at the top of any loop, and forwards it to every inner awaitable call."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using System;\nusing System.Threading;\nusing System.Threading.Tasks;\n\n// ── PRODUCER: the caller owns the CancellationTokenSource ──\nusing var cts = new CancellationTokenSource();\ncts.CancelAfter(TimeSpan.FromSeconds(3)); // auto-cancel after 3 seconds\n\ntry\n{\n    await ProcessOrdersAsync(cts.Token);\n    Console.WriteLine(\"All orders processed.\");\n}\ncatch (OperationCanceledException)\n{\n    Console.WriteLine(\"Cancelled — processing stopped early.\");\n}\n\n// ── CONSUMER: the method accepts and checks the token ──\nstatic async Task ProcessOrdersAsync(CancellationToken cancellationToken = default)\n{\n    for (int i = 1; i <= 10; i++)\n    {\n        // Check at the top of each loop iteration BEFORE doing work\n        cancellationToken.ThrowIfCancellationRequested();\n\n        Console.WriteLine($\"Processing order {i}...\");\n\n        // Pass the token to every awaitable call inside this method\n        await Task.Delay(TimeSpan.FromMilliseconds(500), cancellationToken);\n    }\n}"
    },
    {
      "kind": "output",
      "label": "Output (cancelled after ~3 s, around order 6)",
      "output": "Processing order 1...\nProcessing order 2...\nProcessing order 3...\nProcessing order 4...\nProcessing order 5...\nProcessing order 6...\nCancelled — processing stopped early."
    },
    {
      "kind": "paragraph",
      "text": "Notice three things. First, `ThrowIfCancellationRequested()` sits at the **top** of the loop, before the work — this ensures we bail out at the earliest safe checkpoint. Second, the token is forwarded into `Task.Delay` — if cancellation fires while we are waiting, the delay itself throws, and we do not wait out the remaining milliseconds. Third, `OperationCanceledException` propagates up normally; the caller catches it and handles the outcome gracefully."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Never call Task.Delay without the token",
      "text": "Writing `await Task.Delay(500)` without the `CancellationToken` means the delay **ignores cancellation**. Even after the token is cancelled, your method sits there sleeping for the full 500 ms — or longer. In a shutdown scenario with thousands of concurrent requests, this adds up fast. Always write `Task.Delay(duration, cancellationToken)`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "ASP.NET Core: Framework Auto-Binding",
      "id": "aspnet-core-binding"
    },
    {
      "kind": "paragraph",
      "text": "Here is the feature that feels almost magical. In ASP.NET Core, if you add `CancellationToken` as a parameter to a minimal API handler or a controller action, the framework **automatically** binds `HttpContext.RequestAborted` to it. That token is cancelled the moment the HTTP client disconnects. You get request-scoped cancellation for free — just pass it through."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using Microsoft.AspNetCore.Builder;\nusing Microsoft.AspNetCore.Http;\nusing Microsoft.EntityFrameworkCore;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading;\nusing System.Threading.Tasks;\n\n// ── Stub types — in a real app these come from your EF Core model ──\npublic class Product { public int Id { get; set; } public string Name { get; set; } = \"\"; public bool IsActive { get; set; } }\npublic class DatabaseContext : DbContext { public DbSet<Product> Products => Set<Product>(); }\n\nvar builder = WebApplication.CreateBuilder(args);\nbuilder.Services.AddDbContext<DatabaseContext>();   // register EF Core context\nbuilder.Services.AddScoped<ProductService>();       // register the service\nvar app = builder.Build();\n\n// CancellationToken is automatically bound to HttpContext.RequestAborted\napp.MapGet(\"/products\", async (ProductService svc, CancellationToken ct) =>\n{\n    // If the user navigates away, ct is cancelled and this throws,\n    // which ASP.NET Core maps to a 499 Client Closed Request.\n    var products = await svc.GetProductsAsync(ct);\n    return Results.Ok(products);\n});\n\napp.Run();\n\npublic class ProductService(DatabaseContext db)\n{\n    // Accept the token and pass it to EF Core\n    public async Task<List<Product>> GetProductsAsync(CancellationToken cancellationToken = default)\n    {\n        return await db.Products\n            .Where(p => p.IsActive)\n            .ToListAsync(cancellationToken); // EF Core cancels the SQL query\n    }\n}"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Pass the token to every EF Core and HttpClient call",
      "text": "EF Core's async methods (`ToListAsync`, `FirstOrDefaultAsync`, `SaveChangesAsync`) and `HttpClient`'s methods (`GetAsync`, `PostAsync`, `SendAsync`) all accept `CancellationToken`. Always pass it. EF Core will cancel the in-flight SQL query at the database driver level; HttpClient will abort the TCP connection. This is real, immediate resource cleanup — not just a flag check."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Combining Signals: Linked Token Sources",
      "id": "linked-tokens"
    },
    {
      "kind": "paragraph",
      "text": "Real applications often need to cancel work for **multiple independent reasons** — the user disconnected *or* a 10-second timeout fired *or* the application is shutting down. `CancellationTokenSource.CreateLinkedTokenSource` merges any number of tokens into one. The linked token fires as soon as **any** of its sources fire."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "using Microsoft.AspNetCore.Builder;\nusing Microsoft.AspNetCore.Http;\nusing System;\nusing System.Threading;\nusing System.Threading.Tasks;\n\n// ── Stub type — in a real app this comes from your domain/service layer ──\npublic class ReportService\n{\n    public async Task<string> BuildReportAsync(CancellationToken cancellationToken = default)\n    {\n        // Simulate a slow report — 15 seconds in the real world\n        await Task.Delay(TimeSpan.FromSeconds(15), cancellationToken);\n        return \"{ \\\"rows\\\": 42 }\";\n    }\n}\n\nvar builder = WebApplication.CreateBuilder(args);\nbuilder.Services.AddScoped<ReportService>();\nvar app = builder.Build();\n\napp.MapGet(\"/report\", async (ReportService svc, CancellationToken requestToken) =>\n{\n    // Enforce a hard 10-second timeout for this endpoint, regardless of\n    // how long the client is willing to wait.\n    using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(10));\n\n    // Combined token fires if EITHER the client disconnects OR the timeout fires.\n    using var linkedCts = CancellationTokenSource\n        .CreateLinkedTokenSource(requestToken, timeoutCts.Token);\n\n    try\n    {\n        var report = await svc.BuildReportAsync(linkedCts.Token);\n        return Results.Ok(report);\n    }\n    catch (OperationCanceledException) when (timeoutCts.IsCancellationRequested)\n    {\n        return Results.Problem(\"Report generation timed out.\", statusCode: 504);\n    }\n    // OperationCanceledException from requestToken propagates normally (client disconnected)\n});\n\napp.Run();"
    },
    {
      "kind": "paragraph",
      "text": "The `when` clause on the catch block lets us distinguish *why* cancellation occurred: if `timeoutCts.IsCancellationRequested` is true, we timed out and can return a meaningful 504. If the request token fired instead (client disconnected), the exception propagates and ASP.NET Core handles it. This is the kind of precise error handling that makes production services debuggable."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Background Services and Graceful Shutdown",
      "id": "background-services"
    },
    {
      "kind": "paragraph",
      "text": "When you write a `BackgroundService` in ASP.NET Core — a hosted worker that runs a loop indefinitely — the framework hands you a `stoppingToken` parameter in `ExecuteAsync`. This token is cancelled when the host receives a shutdown signal (Ctrl+C, SIGTERM, deployment restart). Your job is to pass it everywhere so the service drains gracefully instead of being killed mid-operation."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "OrderWorker.cs",
      "code": "using Microsoft.Extensions.Hosting;\nusing Microsoft.Extensions.Logging;\nusing System;\nusing System.Collections.Generic;\nusing System.Threading;\nusing System.Threading.Tasks;\n\n// ── Stub types — in a real app these come from your domain layer ──\npublic record Order(int Id);\n\npublic class OrderQueue\n{\n    private readonly Queue<Order> _queue = new(Enumerable.Range(1, 100).Select(i => new Order(i)));\n\n    public async Task<Order> DequeueAsync(CancellationToken cancellationToken)\n    {\n        await Task.Delay(10, cancellationToken); // simulate wait for next message\n        return _queue.TryDequeue(out var order) ? order : new Order(0);\n    }\n}\n\npublic sealed class OrderWorker(ILogger<OrderWorker> logger, OrderQueue queue) : BackgroundService\n{\n    protected override async Task ExecuteAsync(CancellationToken stoppingToken)\n    {\n        logger.LogInformation(\"Order worker started.\");\n\n        // stoppingToken is cancelled when the host begins shutting down.\n        // Pass it to every awaitable call so the loop exits cleanly.\n        while (!stoppingToken.IsCancellationRequested)\n        {\n            try\n            {\n                var order = await queue.DequeueAsync(stoppingToken);\n                await ProcessAsync(order, stoppingToken);\n            }\n            catch (OperationCanceledException)\n            {\n                // Expected during shutdown — exit the loop\n                break;\n            }\n            catch (Exception ex)\n            {\n                // Log real errors, but keep the loop running\n                logger.LogError(ex, \"Failed to process order. Retrying.\");\n                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);\n            }\n        }\n\n        logger.LogInformation(\"Order worker stopped gracefully.\");\n    }\n\n    private static async Task ProcessAsync(Order order, CancellationToken cancellationToken)\n    {\n        // In a real service: call payment APIs, update the database, etc.\n        await Task.Delay(TimeSpan.FromMilliseconds(200), cancellationToken);\n    }\n}"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "IsCancellationRequested vs ThrowIfCancellationRequested",
      "text": "Use `IsCancellationRequested` (no throw) in `while` loop conditions or cleanup code that **must finish** before exiting. Use `ThrowIfCancellationRequested()` (throws) inside loop bodies where you want to abort immediately at the next safe checkpoint. The background service example above uses both: the `while` condition uses the property (loop exits cleanly), and `Task.Delay` uses the token (throws if cancelled mid-sleep)."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "Quick Reference: Key APIs",
      "id": "api-reference"
    },
    {
      "kind": "examples",
      "intro": "The most common CancellationToken patterns you will reach for every week:",
      "examples": [
        {
          "label": "Fire after a fixed timeout",
          "code": "using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));\nawait DoWorkAsync(cts.Token);"
        },
        {
          "label": "Cancel manually (e.g., user clicks Cancel button)",
          "code": "using var cts = new CancellationTokenSource();\n\n// Wire cancellation to a UI event or another thread\n// e.g.: cancelButton.Click += (_, _) => cts.Cancel();\n\nawait DoWorkAsync(cts.Token);"
        },
        {
          "label": "Combine request + timeout tokens",
          "code": "using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(10));\nusing var linked = CancellationTokenSource\n    .CreateLinkedTokenSource(requestToken, timeout.Token);\nawait DoWorkAsync(linked.Token);"
        },
        {
          "label": "Signal that work is not cancellable (tests, final cleanup)",
          "code": "// CancellationToken.None never fires — safe for must-complete operations\nawait FinalizeAuditLogAsync(CancellationToken.None);"
        },
        {
          "label": "Check without throwing (cleanup path)",
          "code": "if (!cancellationToken.IsCancellationRequested)\n{\n    await SendNotificationAsync(cancellationToken);\n}"
        }
      ]
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "**`CancellationTokenSource` is the producer** — create it, set timeouts, call `.Cancel()`. **`CancellationToken` is the consumer** — accept it as a parameter, check it, forward it.",
        "Add `CancellationToken cancellationToken = default` to every public async method. The `= default` makes cancellation opt-in without breaking callers that pass nothing.",
        "**Pass the token everywhere** — to every `ToListAsync`, `GetAsync`, `Task.Delay`, and inner async method. A token you do not forward is a token that does not work.",
        "In ASP.NET Core, add `CancellationToken ct` to any endpoint handler and the framework binds `HttpContext.RequestAborted` automatically — free client-disconnect detection.",
        "Use `CancellationTokenSource.CreateLinkedTokenSource(token1, token2)` when you need to cancel on *either* a timeout *or* a request disconnect *or* application shutdown.",
        "In `BackgroundService.ExecuteAsync`, always forward `stoppingToken` to let the host shut your worker down cleanly — catch `OperationCanceledException` to exit the loop, not to suppress it.",
        "Distinguish *why* cancellation happened using `when (myTimeoutCts.IsCancellationRequested)` in a catch filter — this lets you return accurate error responses (504 Timeout vs 499 Client Closed).",
        "**`OperationCanceledException` is not an error** — it is the normal outcome of cancelled work. Let it propagate up rather than swallowing it with an empty catch block."
      ]
    }
  ]
};
