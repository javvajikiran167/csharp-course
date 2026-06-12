import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  slug: 'why-conventions',
  number: 1,
  title: 'Why C# Has Conventions',
  objective:
    'Understand why every professional C# codebase follows the same naming and layout rules — and where those rules come from.',
  blocks: [
    {
      kind: 'lead',
      text:
        'C# is **case-sensitive but not opinionated about case** — the compiler accepts `MyClass`, `myClass`, and `MY_CLASS` equally. So how does every C# codebase end up looking the same? The answer is **Microsoft\'s official conventions**, followed by virtually every team that ships C# code.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Convention vs requirement** — the compiler will accept any name; conventions are about team readability',
        'Show that **Microsoft, .NET runtime team, and every major library follow the same rules** — that\'s why they feel universal',
        'Drop the link to the official docs: learn.microsoft.com/dotnet/csharp/fundamentals/coding-style/coding-conventions',
        'Frame this as **the rules you must know to pass any C# code review**',
        "Each later lesson focuses on **one category** — don't try to cover everything at once",
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Where the rules come from',
    },
    {
      kind: 'paragraph',
      text:
        'Microsoft maintains a public document called **[Framework Design Guidelines](https://learn.microsoft.com/dotnet/standard/design-guidelines/)** plus a shorter **[C# Coding Conventions](https://learn.microsoft.com/dotnet/csharp/fundamentals/coding-style/coding-conventions)** page. The .NET runtime, ASP.NET Core, EF Core, every NuGet package on the official feed — they all follow these. If you join any C# team in the industry, the first PR feedback you get will reference these rules.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The conventions you must know',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Naming',
          items: [
            '**PascalCase** for classes, methods, properties, constants, public fields, enums, namespaces',
            '**No ALL_CAPS constants** — Python\'s `TAX_RATE` is C#\'s `TaxRate`; constants are PascalCase too',
            '**camelCase** for local variables and parameters',
            '**`_camelCase`** for private instance fields (with underscore prefix)',
            '**`I` prefix** for interfaces: `IDisposable`, `IComparable`',
            '**`T` prefix** for generic type parameters: `TKey`, `TValue`',
          ],
        },
        {
          title: 'Layout & file rules',
          items: [
            '**One public type per file**, file name matches the type',
            '**Braces on their own line** (Allman style)',
            '**4-space indentation**',
            '**`using` directives at the top**, sorted',
            '**Namespaces** match the folder structure',
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Coming from Python? Retrain two reflexes',
      text:
        "Python's `calculate_total` becomes `CalculateTotal` in C# — methods (and types) are **PascalCase**, never snake_case. And `order_id` becomes `orderId` — locals and parameters are **camelCase**. The compiler accepts snake_case, but it instantly marks code as written by someone new to C#, and it's the first thing a reviewer will flag.",
    },

    {
      kind: 'heading',
      level: 2,
      text: 'A small example — naming in action',
    },
    {
      kind: 'paragraph',
      text:
        'This snippet uses **every** naming convention. By the end of this topic you will be able to identify and explain each one:',
    },
    {
      kind: 'code',
      filename: 'OrderService.cs',
      code: `using System;
using System.Collections.Generic;

namespace ShopApp.Services;        // PascalCase namespace

public interface IOrderService     // I prefix for interfaces
{
    decimal CalculateTotal(int orderId);    // PascalCase method
}

public class OrderService : IOrderService  // PascalCase class
{
    private readonly List<Order> _orders;  // _camelCase private field
    public const decimal TaxRate = 0.08m;  // PascalCase constant

    public OrderService(List<Order> orders)  // camelCase parameter
    {
        _orders = orders;
    }

    public decimal CalculateTotal(int orderId)
    {
        var order = FindOrder(orderId);    // camelCase local
        decimal subtotal = order.Subtotal; // camelCase local
        return subtotal * (1 + TaxRate);
    }

    private Order FindOrder(int id) =>     // PascalCase private method
        _orders.Find(o => o.Id == id);
}

public record Order(int Id, decimal Subtotal);  // PascalCase record`,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Look closely at one line',
      text:
        "`decimal subtotal = order.Subtotal;` — that's **two different names**. C# is case-sensitive, so `Subtotal` (the property) and `subtotal` (the local) coexist happily. This is idiomatic C#, not a mistake: same word, different casing, different role. The constructor's `_orders = orders;` is the same trick with the underscore.",
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Try it yourself',
      text:
        "Open one of your earlier exercises. Identify three places where the naming follows the conventions you just saw. If you spot any names that don't fit, rename them — your code will instantly look more professional.",
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Recognize these — but never write them',
    },
    {
      kind: 'paragraph',
      text:
        "You will meet these styles in old codebases, decade-old Stack Overflow answers, and tutorials ported from C++ or Java. They are not C# style. Learn to read them, then leave them behind.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Legacy naming you may see',
          items: [
            '**Hungarian notation** — `strName`, `iCount`, `bIsActive`, `btnSave`. The type is baked into the name. The Framework Design Guidelines explicitly forbid it',
            '**`m_` member prefixes** — `m_count`, `m_orders`. A C++ habit; C# uses a plain `_count` for private fields',
            '**SCREAMING_SNAKE_CASE constants** — `TAX_RATE`, `MAX_SIZE`. A C / Java / Python habit; C# constants are `PascalCase` (`TaxRate`, `MaxSize`)',
          ],
        },
        {
          title: 'Why C# dropped them',
          items: [
            'Modern IDEs show a value\'s type on hover, so encoding it in the name (`strName`) is just noise that lies when the type changes',
            'One consistent casing system (`PascalCase` / `camelCase` / `_camelCase`) is easier to read than several competing prefix schemes',
            'Consistency *is* the point — code that follows the Guidelines reads the same across every team and library you will ever touch',
          ],
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Why this topic comes after Methods',
    },
    {
      kind: 'paragraph',
      text:
        "Naming rules for **classes**, **methods**, **interfaces**, and **generics** only make sense once you've used them. You\'ve now finished Foundations, Control Flow, Loops, Collections, and Methods — so every term in the conventions has meaning. The remaining lessons in this topic walk through one category at a time, with Microsoft examples for each.",
    },

    {
      kind: 'heading',
      level: 2,
      text: "What's in this topic",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Why C# Has Conventions** (you are here)',
        '**Variables, Parameters, and Local Style** — `camelCase`, when to use `var`, boolean naming',
        '**Methods and Properties** — `PascalCase`, verb-first method names, property idioms',
        '**Classes, Records, Interfaces, and Enums** — `PascalCase`, `I` prefix, `T` for generics',
        '**Constants, Static Fields, and Readonly** — `PascalCase`, `_camelCase`, when each fits',
        '**Files, Namespaces, and Project Layout** — one type per file, namespaces match folders',
        '**Code Layout & EditorConfig** — braces, spacing, automating the rules',
      ],
    },

    {
      kind: 'keyTakeaways',
      items: [
        'C# is case-sensitive but **conventions are about teamwork, not the compiler**',
        '**Microsoft publishes official conventions** — every professional C# codebase follows them',
        '**PascalCase** for big things (classes, methods, properties); **camelCase** for locals and parameters; **`_camelCase`** for private fields',
        'Interfaces start with **`I`**; generic type parameters start with **`T`**',
        'The remaining lessons cover one category each — variables, methods, classes, files, layout',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'Why do we follow naming conventions in C#?',
      options: [
        { label: 'The compiler enforces them.' },
        {
          label: 'So every developer reading the code recognizes the role of each name instantly.',
          correct: true,
        },
        { label: 'Microsoft will not let you run code that breaks them.' },
        { label: 'They make programs run faster.' },
      ],
      explanation:
        'C# does not enforce conventions at the language level — `myclass` and `MyClass` both compile. Conventions exist purely for **human readers**. When everyone follows the same rules, you can read unfamiliar code and know immediately whether a name is a class, a property, or a local variable.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt: 'In `public interface IOrderService`, what does the `I` prefix signal?',
      options: [
        { label: 'It is private.' },
        { label: 'It is an interface, by convention.', correct: true },
        { label: 'It is immutable.' },
        { label: 'Nothing — it is decorative.' },
      ],
      explanation:
        'C# does not require the `I` prefix — but the entire .NET ecosystem uses it, so when you see `IDisposable`, `IEnumerable`, or `IOrderService`, you know instantly that it is an interface without checking the file. You should follow the same convention in your own code.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt: "Which document is the source of truth for official C# conventions?",
      options: [
        { label: 'Stack Overflow voting' },
        {
          label: "Microsoft's Framework Design Guidelines and C# Coding Conventions docs",
          correct: true,
        },
        { label: 'The Linux kernel style guide' },
        { label: 'Whatever your IDE auto-formats to' },
      ],
      explanation:
        "Microsoft maintains the official guidelines, and they're freely available on Microsoft Learn. The .NET runtime team, all major .NET libraries, and most enterprise teams follow them. Your IDE (VS Code, Visual Studio, Rider) ships with defaults that match these guidelines.",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Spot the convention',
      prompt:
        'Open the example `OrderService.cs` in this lesson. Identify and list (in a comment): one PascalCase name, one camelCase name, one `_camelCase` name, one `I`-prefixed name, and the namespace.',
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Bookmark the source',
      prompt:
        'Visit Microsoft\'s [C# Coding Conventions](https://learn.microsoft.com/dotnet/csharp/fundamentals/coding-style/coding-conventions) page. Save the link. Read the section called *"Naming conventions"* end-to-end. List in a comment three rules you didn\'t already know.',
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Take an inventory',
      prompt:
        'Pick any open-source C# project on GitHub (suggestions: dotnet/runtime, dotnet/aspnetcore, JamesNK/Newtonsoft.Json). Open three random `.cs` files. List: every interface name, every class name, every public method name. Confirm each one matches the conventions you saw in this lesson.',
    },
  ],
};
