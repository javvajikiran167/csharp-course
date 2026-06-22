import type { Topic } from '@/data/types';

export const testingPatterns: Topic = {
  slug: 'testing-patterns',
  title: 'Testing & Design Patterns',
  subtitle: 'Write unit tests with xUnit, mock dependencies, and learn patterns interviewers ask about.',
  status: 'unlocked',
  lessons: [
  {
    "slug": "xunit",
    "number": 1,
    "title": "xUnit Basics",
    "objective": "Fact, Theory, InlineData — the test framework most teams use.",
    "blocks": [
      {
        "kind": "lead",
        "text": "xUnit is the modern testing framework for .NET. It's simpler than NUnit, more powerful than MSTest. You write [Fact] and [Theory] tests, and xUnit runs them."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Your First Test",
        "id": "first-test"
      },
      {
        "kind": "code",
        "code": "[Fact]\npublic void Add_TwoNumbers_ReturnsSum() {\n    var calc = new Calculator();\n    var result = calc.Add(2, 3);\n    Assert.Equal(5, result);\n}",
        "language": "csharp"
      },
      {
        "kind": "paragraph",
        "text": "[Fact] is a test that runs once. Assert.Equal checks if the result matches the expected value."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "[Theory] with InlineData",
        "id": "theory"
      },
      {
        "kind": "code",
        "code": "[Theory]\n[InlineData(2, 3, 5)]\n[InlineData(0, 0, 0)]\n[InlineData(-1, 1, 0)]\npublic void Add_WithMultipleInputs(int a, int b, int expected) {\n    var calc = new Calculator();\n    Assert.Equal(expected, calc.Add(a, b));\n}",
        "language": "csharp"
      },
      {
        "kind": "paragraph",
        "text": "[Theory] runs once per [InlineData] set. Great for testing multiple scenarios."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Common Asserts",
        "id": "asserts"
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          "Assert.Equal(expected, actual)",
          "Assert.True(condition), Assert.False(condition)",
          "Assert.Null(obj), Assert.NotNull(obj)",
          "Assert.Throws<Exception>(() => { /* code */ })",
          "Assert.Contains(item, collection)"
        ]
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Use descriptive test names",
        "text": "Test names should describe the behavior: MethodUnderTest_Scenario_ExpectedResult."
      },
      {
        "kind": "warn",
        "tone": "warn",
        "title": "One assertion per test is ideal",
        "text": "Multiple assertions make it hard to diagnose failures. Keep tests focused."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "[Fact] for single tests, [Theory] for parameterized tests",
          "InlineData provides test data",
          "Assert.Equal, Assert.Throws, Assert.Contains for validation",
          "Descriptive test names matter"
        ]
      }
    ]
  },
  {
    "slug": "arrange-act-assert",
    "number": 2,
    "title": "Arrange-Act-Assert",
    "objective": "The structure every good test follows.",
    "blocks": []
  },
  {
    "slug": "mocks",
    "number": 3,
    "title": "Mocking with Moq",
    "objective": "Test in isolation by faking dependencies.",
    "blocks": []
  },
  {
    "slug": "tdd",
    "number": 4,
    "title": "Test-Driven Development",
    "objective": "Red, green, refactor — the discipline.",
    "blocks": []
  },
  {
    "slug": "solid",
    "number": 5,
    "title": "SOLID Principles",
    "objective": "The five letters that come up in every senior interview.",
    "blocks": []
  },
  {
    "slug": "patterns",
    "number": 6,
    "title": "Singleton, Factory, Strategy, Observer",
    "objective": "The four classic patterns you must know by name.",
    "blocks": []
  }
],
  outline: []
};
