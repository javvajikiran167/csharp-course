import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';

// Assessment is per-lesson (the lesson carries its own inline quiz + practice).
// The topic keeps a hands-on project, shown on the topic overview page.
export const conventions: Topic = {
  slug: 'conventions',
  title: 'C# Conventions & Style',
  subtitle:
    "Microsoft's official C# style and naming conventions — the rules every professional codebase follows. Positioned after Methods so every term in the conventions has meaning.",
  status: 'unlocked',
  lessons: [lesson01],
  outline: [
    {
      number: 2,
      slug: 'variables-locals',
      title: 'Variables, Parameters, and Local Style',
      objective:
        '`camelCase` for locals and parameters, when to use `var`, naming booleans (`isX`, `hasX`, `canX`).',
    },
    {
      number: 3,
      slug: 'methods-properties',
      title: 'Methods and Properties',
      objective:
        '`PascalCase`, verb-first method names, expression-bodied properties, `Async` suffix for async methods.',
    },
    {
      number: 4,
      slug: 'types',
      title: 'Classes, Records, Interfaces, and Enums',
      objective:
        '`PascalCase` for type names, `I` prefix for interfaces, `T` prefix for generics, plural enum names with [Flags].',
    },
    {
      number: 5,
      slug: 'constants-fields',
      title: 'Constants, Static Fields, and Readonly',
      objective:
        '`PascalCase` for `const` and `static`, `_camelCase` for private instance fields, when to use `readonly` vs `const`.',
    },
    {
      number: 6,
      slug: 'files-namespaces',
      title: 'Files, Namespaces, and Project Layout',
      objective:
        'One public type per file, file name matches the type, namespace matches the folder structure.',
    },
    {
      number: 7,
      slug: 'code-layout',
      title: 'Code Layout & EditorConfig',
      objective:
        'Brace style, 4-space indent, blank lines, `using` ordering — and how `.editorconfig` automates the rules across your team.',
    },
  ],
  projects: [
    {
      id: 'conventions-proj-1',
      difficulty: 'starter',
      title: 'Refactor a Messy File to C# Conventions',
      brief:
        'Take a deliberately badly-styled C# file and bring it fully in line with Microsoft conventions — names, layout, and structure — then lock the rules in with an `.editorconfig`. Reading and cleaning code to a standard is a daily professional skill, and doing it by hand once is how the conventions actually stick.',
      requirements: [
        'Start from a small program (~40-60 lines) with wrong-cased names: `snake_case` locals, lowercase method names, an interface without `I`, a private field without `_`, a `const` in lower case, and inconsistent braces/indentation. (Write this messy version yourself first, or use one provided.)',
        'Rename everything to convention: `PascalCase` for types/methods/properties/consts, `camelCase` for locals and parameters, `_camelCase` for private fields, `I`-prefixed interfaces, boolean names like `isValid`/`hasItems`.',
        'Fix layout: Allman braces, 4-space indentation, one statement per line, a blank line between members, and `using` directives sorted with `System` first.',
        'Split the file so there is one public type per file, with each file name matching its type and the namespace matching the folder.',
        'Add an `.editorconfig` that encodes these rules (naming styles, indent_size = 4, `dotnet_sort_system_directives_first = true`) and run `dotnet format` to prove the file is now clean.',
      ],
      stretch: [
        'Turn on `<TreatWarningsAsErrors>` and resolve any analyzer/style warnings the build surfaces.',
        'Add a few `// before / after` notes explaining why each rename improves readability.',
        'Configure a couple of naming rules in `.editorconfig` as warnings and watch the IDE flag a deliberate violation.',
      ],
      concepts: [
        'PascalCase vs camelCase vs _camelCase by member kind',
        'interface (I) and boolean (is/has/can) naming',
        'code layout: braces, indentation, using ordering',
        'one-public-type-per-file & namespace/folder matching',
        '.editorconfig and dotnet format to automate the rules',
      ],
    },
  ],
};
