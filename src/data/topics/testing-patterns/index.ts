import type { Topic } from '@/data/types';

export const testingPatterns: Topic = {
  slug: 'testing-patterns',
  title: 'Testing & Design Patterns',
  subtitle: 'Write unit tests with xUnit, mock dependencies, and learn patterns interviewers ask about.',
  status: 'unlocked',
  lessons: [
    {
      slug: 'xunit',
      number: 1,
      title: 'xUnit Basics',
      objective: 'Fact, Theory, InlineData — the test framework most teams use.',
      blocks: [
        {
          kind: 'lead',
          text: "xUnit is the modern testing framework for .NET. It's simpler than NUnit and more capable than MSTest, and it's what most new C# projects pick. If you've used **pytest** in Python, you'll feel at home: tests are just methods, and you assert on results.",
        },
        {
          kind: 'paragraph',
          text: 'You create a test project with `dotnet new xunit -n MyApp.Tests`, reference the project under test, and run everything with `dotnet test`. There is no separate runner to install — the SDK has it built in.',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Your first test: [Fact]',
          id: 'first-test',
        },
        {
          kind: 'paragraph',
          text: 'A `[Fact]` is a test that takes no parameters and runs exactly once. The Python equivalent is a plain `def test_add():` function in pytest.',
        },
        {
          kind: 'code',
          filename: 'CalculatorTests.cs',
          language: 'csharp',
          code: 'using Xunit;\n\npublic class CalculatorTests\n{\n    [Fact]\n    public void Add_TwoNumbers_ReturnsSum()\n    {\n        var calc = new Calculator();\n\n        var result = calc.Add(2, 3);\n\n        Assert.Equal(5, result);\n    }\n}',
        },
        {
          kind: 'paragraph',
          text: 'Note the argument order: `Assert.Equal(expected, actual)` — expected comes **first**. This is the opposite of nothing in particular, but mixing it up produces confusing failure messages, so build the habit early.',
        },
        {
          kind: 'heading',
          level: 2,
          text: '[Theory] with [InlineData]',
          id: 'theory',
        },
        {
          kind: 'paragraph',
          text: "A `[Theory]` runs the same test body once per data set. It's xUnit's version of pytest's `@pytest.mark.parametrize` — one test, many inputs.",
        },
        {
          kind: 'code',
          language: 'csharp',
          code: '[Theory]\n[InlineData(2, 3, 5)]\n[InlineData(0, 0, 0)]\n[InlineData(-1, 1, 0)]\npublic void Add_WithManyInputs(int a, int b, int expected)\n{\n    var calc = new Calculator();\n    Assert.Equal(expected, calc.Add(a, b));\n}',
        },
        {
          kind: 'examples',
          intro: 'Python vs C# for the same parameterized idea:',
          examples: [
            {
              label: 'pytest (Python)',
              code: '@pytest.mark.parametrize("a,b,expected", [\n    (2, 3, 5),\n    (0, 0, 0),\n    (-1, 1, 0),\n])\ndef test_add(a, b, expected):\n    assert Calculator().add(a, b) == expected',
            },
            {
              label: 'xUnit (C#)',
              code: '[Theory]\n[InlineData(2, 3, 5)]\n[InlineData(0, 0, 0)]\n[InlineData(-1, 1, 0)]\npublic void Add(int a, int b, int expected)\n    => Assert.Equal(expected, new Calculator().Add(a, b));',
            },
          ],
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Common assertions',
          id: 'asserts',
        },
        {
          kind: 'list',
          items: [
            '`Assert.Equal(expected, actual)` — value equality',
            '`Assert.True(condition)` / `Assert.False(condition)`',
            '`Assert.Null(obj)` / `Assert.NotNull(obj)`',
            '`Assert.Throws<ArgumentException>(() => svc.Do())` — asserts an exception is thrown',
            '`Assert.Contains(item, collection)` / `Assert.Empty(collection)`',
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Name tests for the behavior, not the method',
          text: 'A good convention is `MethodUnderTest_Scenario_ExpectedResult`, e.g. `Withdraw_AmountExceedsBalance_Throws`. When it fails, the name alone tells you what broke.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'A test class is created fresh per test',
          text: 'xUnit constructs a new instance of the test class for **every** `[Fact]`/`[Theory]` case, so state never leaks between tests. Put shared setup in the constructor (the pytest-fixture equivalent), not in static fields.',
        },
        {
          kind: 'keyTakeaways',
          items: [
            '`[Fact]` = one test that runs once; `[Theory]` + `[InlineData]` = parameterized test.',
            '`Assert.Equal(expected, actual)` — expected is the first argument.',
            'Use `Assert.Throws<T>` to assert on exceptions, like `pytest.raises`.',
            'Run everything with `dotnet test`; each test gets a fresh class instance.',
          ],
        },
      ],
      questions: [
        {
          id: 'testing-patterns-xunit-q1',
          kind: 'mcq',
          prompt: 'You want to run the same test logic against five different input/output pairs. Which attribute do you use?',
          options: [
            { label: '`[Fact]` with five separate methods' },
            { label: '`[Theory]` with five `[InlineData]` attributes', correct: true },
            { label: '`[Repeat(5)]`' },
            { label: '`[TestCase]` from NUnit' },
          ],
          explanation: '`[Theory]` runs the method body once per data set, and each `[InlineData]` supplies one set of arguments. This is the direct analog of pytest’s `parametrize`. `[TestCase]` is NUnit, not xUnit.',
        },
        {
          id: 'testing-patterns-xunit-q2',
          kind: 'predict',
          prompt: 'How many times does the test runner execute the method body, and how many results show up?',
          code: '[Theory]\n[InlineData(1)]\n[InlineData(2)]\n[InlineData(3)]\npublic void IsPositive(int n) => Assert.True(n > 0);',
          options: [
            { label: 'Runs 3 times, reported as 3 separate test results', correct: true },
            { label: 'Runs 1 time, reported as 1 result' },
            { label: 'Runs 3 times, reported as 1 result' },
            { label: 'Compile error — a [Theory] needs a return value' },
          ],
          explanation: 'Each `[InlineData]` produces an independent test case, so the body runs three times and the runner reports three pass/fail results. Expression-bodied test methods (`=> ...`) are perfectly valid.',
        },
        {
          id: 'testing-patterns-xunit-q3',
          kind: 'fill',
          prompt: 'Complete the assertion that checks a method throws when given a bad argument.',
          template: 'Assert.___<ArgumentException>(() => account.Withdraw(-5));',
          accept: ['Throws'],
          explanation: '`Assert.Throws<T>(() => ...)` runs the lambda and passes only if an exception of type `T` (or a subtype, depending on the overload) is thrown. It is the xUnit counterpart of Python’s `with pytest.raises(...)`.',
        },
        {
          id: 'testing-patterns-xunit-q4',
          kind: 'mcq',
          prompt: 'In `Assert.Equal(5, result)`, what does the `5` represent?',
          options: [
            { label: 'The actual value produced by the code' },
            { label: 'The expected value', correct: true },
            { label: 'A tolerance for floating-point comparison' },
            { label: 'The number of times to run the assertion' },
          ],
          explanation: 'xUnit puts the expected value first: `Assert.Equal(expected, actual)`. Swapping them does not break the test, but it inverts the failure message (“Expected X, Actual Y”), which is misleading during debugging.',
        },
      ],
      challenges: [
        {
          id: 'testing-patterns-xunit-c1',
          difficulty: 'easy',
          title: 'Test a Calculator',
          prompt: 'Write a `Calculator` class with `Add` and `Subtract`, then add a test project with one `[Fact]` per method asserting a known result with `Assert.Equal`.',
          hints: ['Create the test project with `dotnet new xunit`.', 'Reference the main project with `dotnet add reference`.', 'Run `dotnet test` and confirm both tests pass.'],
        },
        {
          id: 'testing-patterns-xunit-c2',
          difficulty: 'medium',
          title: 'Parameterize with [Theory]',
          prompt: 'Replace your repetitive multiply tests with a single `[Theory]` driven by at least four `[InlineData]` rows, including a zero and a negative case.',
          hints: ['Method signature: `public void Multiply(int a, int b, int expected)`.', 'Each `[InlineData]` matches the parameter order.'],
        },
        {
          id: 'testing-patterns-xunit-c3',
          difficulty: 'hard',
          title: 'Assert on exceptions',
          prompt: 'Add a `Divide` method that throws `DivideByZeroException` when the divisor is 0. Write one test that asserts the correct result for valid input and another using `Assert.Throws<DivideByZeroException>` for the zero case.',
          hints: ['`Assert.Throws<T>` returns the caught exception so you can inspect its `Message`.', 'The divide-by-zero throw may happen automatically for integer division — verify which exception type fires.'],
        },
      ],
    },
    {
      slug: 'arrange-act-assert',
      number: 2,
      title: 'Arrange-Act-Assert',
      objective: 'The structure every good test follows.',
      blocks: [
        {
          kind: 'lead',
          text: 'Arrange-Act-Assert (AAA) is the three-part skeleton of almost every unit test. **Arrange** the inputs, **Act** by calling the thing under test, then **Assert** on the outcome. Once you see it, you can read any test in seconds.',
        },
        {
          kind: 'paragraph',
          text: "This isn't a C# rule or an xUnit feature — it's a discipline that works in pytest, JUnit, and everywhere else. The point is to keep each test telling one clear story.",
        },
        {
          kind: 'heading',
          level: 2,
          text: 'The three phases',
          id: 'phases',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '**Arrange** — build the object under test and any inputs/dependencies it needs.',
            '**Act** — perform the single action you are testing (usually one method call).',
            '**Assert** — verify the result, returned value, or thrown exception.',
          ],
        },
        {
          kind: 'code',
          filename: 'BankAccountTests.cs',
          language: 'csharp',
          code: '[Fact]\npublic void Withdraw_SufficientFunds_ReducesBalance()\n{\n    // Arrange\n    var account = new BankAccount(initialBalance: 100m);\n\n    // Act\n    account.Withdraw(30m);\n\n    // Assert\n    Assert.Equal(70m, account.Balance);\n}',
        },
        {
          kind: 'paragraph',
          text: 'The blank lines and comments are not decoration — they signal where each phase starts. Many teams even require those three comments so every test reads the same way.',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Keep Act to a single action',
          id: 'single-act',
        },
        {
          kind: 'paragraph',
          text: 'If your Act block has several calls, you are probably testing more than one behavior. Split it. A focused test fails for exactly one reason, so the failure message points straight at the bug.',
        },
        {
          kind: 'examples',
          intro: 'The same structure in both languages:',
          examples: [
            {
              label: 'pytest (Python)',
              code: 'def test_withdraw_reduces_balance():\n    # Arrange\n    account = BankAccount(100)\n    # Act\n    account.withdraw(30)\n    # Assert\n    assert account.balance == 70',
            },
            {
              label: 'xUnit (C#)',
              code: '[Fact]\npublic void Withdraw_ReducesBalance()\n{\n    // Arrange\n    var account = new BankAccount(100m);\n    // Act\n    account.Withdraw(30m);\n    // Assert\n    Assert.Equal(70m, account.Balance);\n}',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'AAA also names your test',
          text: 'The Arrange/Act/Assert you write maps cleanly onto the `Method_Scenario_Result` name. “Arrange a full account, Act by withdrawing too much, Assert it throws” becomes `Withdraw_AmountExceedsBalance_Throws`.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'Avoid logic in the Assert phase',
          text: 'If you find yourself writing `if` statements or loops to decide what to assert, the test has too much going on. Compute expected values in Arrange and assert plainly.',
        },
        {
          kind: 'keyTakeaways',
          items: [
            'Every test has three phases: Arrange (set up), Act (one call), Assert (verify).',
            'Use blank lines or `// Arrange` / `// Act` / `// Assert` comments to make phases obvious.',
            'Keep Act to a single action so a failure has exactly one cause.',
            'No branching logic in Assert — assert concrete, precomputed values.',
          ],
        },
      ],
      questions: [
        {
          id: 'testing-patterns-arrange-act-assert-q1',
          kind: 'mcq',
          prompt: 'In Arrange-Act-Assert, what belongs in the Act phase?',
          options: [
            { label: 'Constructing the object and its dependencies' },
            { label: 'The single action under test — usually one method call', correct: true },
            { label: 'Checking the returned value with Assert.Equal' },
            { label: 'Cleaning up files and database rows' },
          ],
          explanation: 'Act is the one operation whose behavior the test exists to verify. Setup goes in Arrange and verification goes in Assert; keeping Act to a single call ensures any failure points to one behavior.',
        },
        {
          id: 'testing-patterns-arrange-act-assert-q2',
          kind: 'mcq',
          prompt: 'Why is having branching logic (if/loops) inside the Assert phase a smell?',
          options: [
            { label: 'It makes tests run slower' },
            { label: 'xUnit forbids it at compile time' },
            { label: 'It hides what is actually being verified and means the test does too much', correct: true },
            { label: 'It prevents the test from being a [Theory]' },
          ],
          explanation: 'A clean test asserts a concrete, known value. Logic in the Assert phase means the expected result is computed at runtime, making the test hard to read and often masking which case actually failed.',
        },
        {
          id: 'testing-patterns-arrange-act-assert-q3',
          kind: 'predict',
          prompt: 'Which phase is missing or misplaced in this test?',
          code: '[Fact]\npublic void Add_Works()\n{\n    var calc = new Calculator();\n    Assert.Equal(5, calc.Add(2, 3));\n}',
          options: [
            { label: 'Act and Assert are collapsed into one line; the Act is the Add(2, 3) call inside the assertion', correct: true },
            { label: 'Arrange is missing entirely' },
            { label: 'Assert is missing' },
            { label: 'Nothing — it has all three clearly separated phases' },
          ],
          explanation: 'The test still works, but the Act (`calc.Add(2, 3)`) is buried inside the Assert. For trivial tests this is fine; for anything with meaningful setup, pulling the Act onto its own line makes the structure readable.',
        },
        {
          id: 'testing-patterns-arrange-act-assert-q4',
          kind: 'fill',
          prompt: 'Name the three phases of a well-structured unit test, in order: Arrange, ___, Assert.',
          template: 'Arrange, ___, Assert',
          accept: ['Act'],
          explanation: 'The pattern is Arrange (set up state), Act (invoke the behavior), Assert (verify the outcome). Memorizing the order keeps every test you write consistent and skimmable.',
        },
      ],
      challenges: [
        {
          id: 'testing-patterns-arrange-act-assert-c1',
          difficulty: 'easy',
          title: 'Label the phases',
          prompt: 'Take any existing test you have written and add explicit `// Arrange`, `// Act`, `// Assert` comments with blank lines between sections. Make sure exactly one method call sits under Act.',
          hints: ['If two calls live under Act, ask whether you are testing two behaviors.'],
        },
        {
          id: 'testing-patterns-arrange-act-assert-c2',
          difficulty: 'medium',
          title: 'A shopping cart in AAA',
          prompt: 'Write a `ShoppingCart` with `AddItem(name, price)` and a `Total` property. Add two tests — one for adding a single item, one for adding several — each cleanly split into Arrange/Act/Assert.',
          hints: ['Arrange: create the cart. Act: add the item(s). Assert: check Total.', 'Keep each test focused on one scenario.'],
        },
        {
          id: 'testing-patterns-arrange-act-assert-c3',
          difficulty: 'hard',
          title: 'Refactor a tangled test',
          prompt: 'Find or write a test that interleaves setup, action, and assertions throughout. Refactor it into clean AAA, splitting it into multiple tests if it verifies more than one behavior.',
          hints: ['Count the distinct behaviors being checked — that is roughly how many tests you should end up with.', 'Move any computed expected values into the Arrange section.'],
        },
      ],
    },
    {
      slug: 'mocks',
      number: 3,
      title: 'Mocking with Moq',
      objective: 'Test in isolation by faking dependencies.',
      blocks: [
        {
          kind: 'lead',
          text: "A unit test should test **one** unit. But real classes depend on databases, HTTP APIs, and clocks. Mocking lets you swap those dependencies for fakes you control — just like Python's `unittest.mock`. In C#, the most popular library is **Moq**.",
        },
        {
          kind: 'paragraph',
          text: 'Mocking only works against **interfaces** (or virtual members). This is why dependency injection matters: if your class takes an `IEmailSender` rather than `new SmtpEmailSender()`, you can hand it a fake in tests.',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Setup: stubbing a return value',
          id: 'setup',
        },
        {
          kind: 'code',
          filename: 'OrderServiceTests.cs',
          language: 'csharp',
          code: 'using Moq;\nusing Xunit;\n\n[Fact]\npublic void PlaceOrder_InStock_Succeeds()\n{\n    // Arrange\n    var repo = new Mock<IInventory>();\n    repo.Setup(r => r.IsInStock("widget")).Returns(true);\n\n    var service = new OrderService(repo.Object);\n\n    // Act\n    var result = service.PlaceOrder("widget");\n\n    // Assert\n    Assert.True(result.Success);\n}',
        },
        {
          kind: 'list',
          items: [
            '`new Mock<IInventory>()` creates the fake.',
            '`.Setup(r => r.IsInStock("widget")).Returns(true)` tells it how to respond.',
            '`repo.Object` is the actual `IInventory` you inject into the class under test.',
          ],
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Verify: did the interaction happen?',
          id: 'verify',
        },
        {
          kind: 'paragraph',
          text: 'Sometimes the behavior you care about is a side effect — “did we send the confirmation email?” `Verify` asserts that a method was called (and how many times).',
        },
        {
          kind: 'code',
          language: 'csharp',
          code: '[Fact]\npublic void PlaceOrder_Success_SendsConfirmation()\n{\n    var inventory = new Mock<IInventory>();\n    inventory.Setup(i => i.IsInStock(It.IsAny<string>())).Returns(true);\n    var email = new Mock<IEmailSender>();\n\n    var service = new OrderService(inventory.Object, email.Object);\n    service.PlaceOrder("widget");\n\n    email.Verify(e => e.Send("Order confirmed"), Times.Once);\n}',
        },
        {
          kind: 'paragraph',
          text: '`It.IsAny<string>()` is a matcher meaning “any string argument.” `Times.Once` asserts the call happened exactly one time — there are also `Times.Never`, `Times.Exactly(n)`, and more.',
        },
        {
          kind: 'examples',
          intro: 'Moq vs Python unittest.mock for the same idea:',
          examples: [
            {
              label: 'unittest.mock (Python)',
              code: 'repo = Mock()\nrepo.is_in_stock.return_value = True\nservice = OrderService(repo)\nservice.place_order("widget")\nrepo.is_in_stock.assert_called_once_with("widget")',
            },
            {
              label: 'Moq (C#)',
              code: 'var repo = new Mock<IInventory>();\nrepo.Setup(r => r.IsInStock("widget")).Returns(true);\nvar service = new OrderService(repo.Object);\nservice.PlaceOrder("widget");\nrepo.Verify(r => r.IsInStock("widget"), Times.Once);',
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'note',
          title: 'Stub vs mock',
          text: 'A **stub** just feeds data in (`Setup(...).Returns(...)`). A **mock** is checked afterward to confirm an interaction (`Verify(...)`). Moq does both; the difference is whether you assert on the call.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: "Don't over-verify",
          text: 'Verifying every internal call welds your test to the implementation, so harmless refactors break it. Prefer asserting on observable results; reach for `Verify` only when the side effect itself is the behavior.',
        },
        {
          kind: 'keyTakeaways',
          items: [
            'Moq fakes dependencies so you can test one class in isolation — the unittest.mock of C#.',
            'Mock interfaces (or virtual members); design with DI so this is possible.',
            '`Setup(...).Returns(...)` stubs return values; `.Object` is what you inject.',
            '`Verify(..., Times.Once)` asserts an interaction happened — use it sparingly.',
          ],
        },
      ],
      questions: [
        {
          id: 'testing-patterns-mocks-q1',
          kind: 'mcq',
          prompt: 'Which line gives you the fake object to inject into the class under test?',
          options: [
            { label: '`new Mock<IInventory>()`' },
            { label: '`mock.Setup(...)`' },
            { label: '`mock.Object`', correct: true },
            { label: '`mock.Verify(...)`' },
          ],
          explanation: '`new Mock<IInventory>()` creates the Moq wrapper, but the actual `IInventory` instance lives at `mock.Object`. That is what you pass into the constructor of the class you are testing.',
        },
        {
          id: 'testing-patterns-mocks-q2',
          kind: 'mcq',
          prompt: 'What can Moq directly create a mock of?',
          options: [
            { label: 'Any class, including sealed ones with no virtual members' },
            { label: 'Interfaces and classes with virtual/abstract members', correct: true },
            { label: 'Only static classes' },
            { label: 'Only structs' },
          ],
          explanation: 'Moq generates a subclass at runtime, so it can only override interface members or `virtual`/`abstract` methods. Sealed classes and non-virtual concrete methods cannot be mocked — which is why depending on interfaces is the standard practice.',
        },
        {
          id: 'testing-patterns-mocks-q3',
          kind: 'predict',
          prompt: 'The mock has no Setup for IsInStock. What does service.PlaceOrder receive when it calls inventory.IsInStock("x")?',
          code: 'var inventory = new Mock<IInventory>();\n// no Setup configured\nvar service = new OrderService(inventory.Object);\nvar result = service.PlaceOrder("x"); // calls IsInStock("x")',
          options: [
            { label: 'It throws a NotSetupException' },
            { label: 'It returns the default for the type — false for bool', correct: true },
            { label: 'It returns true by default' },
            { label: 'It calls the real implementation' },
          ],
          explanation: 'By default (loose mocks, the Moq default) unconfigured methods return the type’s default value — `false` for `bool`, `0` for `int`, `null` for reference types. There is no real implementation behind a mock to call.',
        },
        {
          id: 'testing-patterns-mocks-q4',
          kind: 'fill',
          prompt: 'Complete the verification that the email was sent exactly once.',
          template: 'email.Verify(e => e.Send("ok"), Times.___);',
          accept: ['Once', 'Once()'],
          explanation: '`Times.Once` asserts the method was invoked exactly one time. Moq also offers `Times.Never`, `Times.AtLeastOnce`, and `Times.Exactly(n)` for other counts.',
        },
      ],
      challenges: [
        {
          id: 'testing-patterns-mocks-c1',
          difficulty: 'easy',
          title: 'Stub a repository',
          prompt: 'Given an `IUserRepository` with `User? FindById(int id)`, write a test that mocks it to return a known user, injects it into a `UserService`, and asserts the service returns that user’s name.',
          hints: ['`repo.Setup(r => r.FindById(1)).Returns(new User { Name = "Ada" });`', 'Inject `repo.Object` into the service constructor.'],
        },
        {
          id: 'testing-patterns-mocks-c2',
          difficulty: 'medium',
          title: 'Verify a side effect',
          prompt: 'Add an `IEmailSender` dependency to a `RegistrationService`. Write a test proving that registering a new user calls `Send` exactly once, using `Verify(..., Times.Once)`.',
          hints: ['You may need `It.IsAny<string>()` to match the email argument.', 'Stub anything the happy path needs so the code reaches the Send call.'],
        },
        {
          id: 'testing-patterns-mocks-c3',
          difficulty: 'hard',
          title: 'Test the failure path',
          prompt: 'Make the repository mock throw or return null, and assert your service handles it gracefully (returns a failure result rather than crashing). Then verify the email sender was *never* called with `Times.Never`.',
          hints: ['`Setup(...).Throws(new TimeoutException())` simulates an outage.', '`Times.Never` proves no confirmation was sent on the failure path.'],
        },
      ],
    },
    {
      slug: 'tdd',
      number: 4,
      title: 'Test-Driven Development',
      objective: 'Red, green, refactor — the discipline.',
      blocks: [
        {
          kind: 'lead',
          text: "Test-Driven Development (TDD) flips the usual order: you write the **test first**, watch it fail, then write just enough code to pass. The rhythm is **Red → Green → Refactor**, and it works identically in Python or C#.",
        },
        {
          kind: 'paragraph',
          text: "TDD isn't about testing — it's a design technique. Writing the test first forces you to decide what the code should do and how it will be called before you implement it.",
        },
        {
          kind: 'heading',
          level: 2,
          text: 'The three steps',
          id: 'cycle',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '**Red** — write a small failing test for behavior that does not exist yet. It must fail (often it will not even compile).',
            '**Green** — write the simplest code that makes the test pass. Ugly is fine here.',
            '**Refactor** — clean up the code (and tests) now that you have a safety net, keeping everything green.',
          ],
        },
        {
          kind: 'heading',
          level: 2,
          text: 'A FizzBuzz cycle',
          id: 'example',
        },
        {
          kind: 'code',
          filename: 'Step 1 — Red',
          language: 'csharp',
          code: '[Fact]\npublic void Convert_3_ReturnsFizz()\n{\n    Assert.Equal("Fizz", FizzBuzz.Convert(3));\n}\n// Fails: FizzBuzz.Convert does not exist yet.',
        },
        {
          kind: 'code',
          filename: 'Step 2 — Green',
          language: 'csharp',
          code: 'public static class FizzBuzz\n{\n    public static string Convert(int n)\n    {\n        if (n % 3 == 0) return "Fizz";\n        return n.ToString();\n    }\n}\n// Test passes. Simplest thing that works.',
        },
        {
          kind: 'code',
          filename: 'Step 3 — add the next Red, then Green',
          language: 'csharp',
          code: '[Theory]\n[InlineData(5, "Buzz")]\n[InlineData(15, "FizzBuzz")]\npublic void Convert_Multiples(int n, string expected)\n    => Assert.Equal(expected, FizzBuzz.Convert(n));\n\n// Now extend Convert to satisfy the new cases (Buzz, FizzBuzz),\n// then refactor the if-chain once everything is green.',
        },
        {
          kind: 'paragraph',
          text: 'Notice the loop: each new requirement starts with a failing test. You never write production code without a red test demanding it.',
        },
        {
          kind: 'twoColumn',
          cards: [
            {
              title: 'TDD gives you',
              items: ['A test suite for free', 'Code shaped by how it is used', 'Confidence to refactor', 'Small, focused commits'],
            },
            {
              title: 'TDD does not mean',
              items: ['100% coverage as a goal', 'Writing all tests up front', 'Never touching code without a ticket', 'Skipping design thinking'],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Watch the test fail first',
          text: 'A test that passes before you write any code is a broken test — it is asserting the wrong thing or not running. Seeing Red first proves the test actually exercises the new behavior.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: "Don't skip Refactor",
          text: 'The Green step intentionally produces quick, messy code. If you stop at Green and move on, the mess compounds. Refactor while the tests are green and the change is safe.',
        },
        {
          kind: 'keyTakeaways',
          items: [
            'TDD cycle: Red (failing test) → Green (simplest pass) → Refactor (clean up).',
            'Always watch the test fail first — a never-red test proves nothing.',
            'Write the minimum code to pass; resist building ahead of a failing test.',
            'TDD is a design tool, not just a testing one — it shapes your API.',
          ],
        },
      ],
      questions: [
        {
          id: 'testing-patterns-tdd-q1',
          kind: 'mcq',
          prompt: 'What is the correct order of the TDD cycle?',
          options: [
            { label: 'Green → Red → Refactor' },
            { label: 'Red → Green → Refactor', correct: true },
            { label: 'Refactor → Red → Green' },
            { label: 'Red → Refactor → Green' },
          ],
          explanation: 'You start with a failing test (Red), write the simplest code to pass it (Green), then improve the design while keeping tests passing (Refactor). The cycle repeats for each new behavior.',
        },
        {
          id: 'testing-patterns-tdd-q2',
          kind: 'mcq',
          prompt: 'Why is it important to see the test fail before writing implementation code?',
          options: [
            { label: 'xUnit requires at least one failing test per run' },
            { label: 'It proves the test actually exercises the new behavior and is not a false positive', correct: true },
            { label: 'It improves test performance' },
            { label: 'It is required to get code coverage metrics' },
          ],
          explanation: 'A test that passes before the feature exists is asserting nothing useful — maybe it never runs or checks the wrong thing. Watching Red first confirms the test genuinely demands the behavior you are about to write.',
        },
        {
          id: 'testing-patterns-tdd-q3',
          kind: 'mcq',
          prompt: 'In the Green step, what kind of code should you write?',
          options: [
            { label: 'The most general, future-proof solution possible' },
            { label: 'The simplest code that makes the failing test pass', correct: true },
            { label: 'No code — Green means deleting the test' },
            { label: 'Only comments describing the algorithm' },
          ],
          explanation: 'Green favors the simplest thing that passes, even if it is naive. You clean it up in Refactor. Trying to generalize during Green leads to speculative, untested complexity.',
        },
        {
          id: 'testing-patterns-tdd-q4',
          kind: 'fill',
          prompt: 'Fill in the missing step of the cycle: Red, ___, Refactor.',
          template: 'Red, ___, Refactor',
          accept: ['Green'],
          explanation: 'The middle step is Green: write just enough code to turn the failing test passing. The three-word mantra “Red, Green, Refactor” captures the whole loop.',
        },
      ],
      challenges: [
        {
          id: 'testing-patterns-tdd-c1',
          difficulty: 'easy',
          title: 'TDD a string reverser',
          prompt: 'Using strict TDD, build a `Reverse(string)` method. Write a failing test for `"abc" -> "cba"` first, see it fail, then implement. Add a test for the empty string next.',
          hints: ['Do not write Reverse until you have a red test calling it.', 'Run `dotnet test` between each step to confirm Red, then Green.'],
        },
        {
          id: 'testing-patterns-tdd-c2',
          difficulty: 'medium',
          title: 'Full FizzBuzz by TDD',
          prompt: 'Drive a complete FizzBuzz implementation one test at a time: plain numbers, then Fizz (3s), then Buzz (5s), then FizzBuzz (15s). Refactor the if-chain only once all tests are green.',
          hints: ['Each rule = one new failing test before any new code.', 'A `[Theory]` keeps the growing cases tidy.'],
        },
        {
          id: 'testing-patterns-tdd-c3',
          difficulty: 'hard',
          title: 'TDD a Roman numeral converter',
          prompt: 'Build an `int -> Roman` converter using TDD. Start with 1 (“I”), add tests incrementally (4 → “IV”, 9 → “IX”, 2024 → “MMXXIV”), letting the tests push you toward a clean value-mapping table.',
          hints: ['Begin with the smallest cases; the subtractive forms (IV, IX) will force a redesign — that is the point.', 'A descending list of (value, symbol) pairs is a common clean shape, but let the tests lead you there.'],
        },
      ],
    },
    {
      slug: 'solid',
      number: 5,
      title: 'SOLID Principles',
      objective: 'The five letters that come up in every senior interview.',
      blocks: [
        {
          kind: 'lead',
          text: 'SOLID is five object-oriented design principles that keep code flexible and testable. You will be asked to name and explain them in almost every senior interview, so learn the letters — and one concrete example each.',
        },
        {
          kind: 'list',
          items: [
            '**S** — Single Responsibility Principle',
            '**O** — Open/Closed Principle',
            '**L** — Liskov Substitution Principle',
            '**I** — Interface Segregation Principle',
            '**D** — Dependency Inversion Principle',
          ],
        },
        {
          kind: 'heading',
          level: 2,
          text: 'S — Single Responsibility',
          id: 'srp',
        },
        {
          kind: 'paragraph',
          text: 'A class should have one reason to change. Mixing concerns — e.g. a class that both builds a report and emails it — means a change to email logic risks breaking report logic.',
        },
        {
          kind: 'code',
          language: 'csharp',
          code: '// Bad: two responsibilities.\nclass Report { public string Build() { /*...*/ } public void Email() { /*...*/ } }\n\n// Better: split them.\nclass ReportBuilder { public string Build() { /*...*/ } }\nclass ReportMailer { public void Send(string report) { /*...*/ } }',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'O — Open/Closed, and D — Dependency Inversion',
          id: 'ocp-dip',
        },
        {
          kind: 'paragraph',
          text: '**Open/Closed**: open for extension, closed for modification — add behavior by adding new types, not by editing a giant `switch`. **Dependency Inversion**: depend on abstractions (interfaces), not concrete classes. These two pair naturally and are exactly what makes Moq mocking possible.',
        },
        {
          kind: 'code',
          language: 'csharp',
          code: 'interface IDiscount { decimal Apply(decimal total); }\n\nclass NoDiscount : IDiscount { public decimal Apply(decimal t) => t; }\nclass TenPercent : IDiscount { public decimal Apply(decimal t) => t * 0.9m; }\n\n// Checkout depends on the abstraction (DIP) and never changes\n// when a new discount is added (OCP).\nclass Checkout(IDiscount discount)\n{\n    public decimal Total(decimal subtotal) => discount.Apply(subtotal);\n}',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'L — Liskov, and I — Interface Segregation',
          id: 'lsp-isp',
        },
        {
          kind: 'list',
          items: [
            '**Liskov Substitution**: a subtype must be usable anywhere its base type is, without surprises. The classic violation: a `Square` that breaks code expecting an independent `Width` and `Height` on `Rectangle`.',
            '**Interface Segregation**: prefer several small interfaces over one fat one. Do not force an implementer to stub out methods it does not need — split `IMachine` into `IPrinter`, `IScanner`, `IFax`.',
          ],
        },
        {
          kind: 'twoColumn',
          cards: [
            {
              title: 'SOLID well applied',
              items: ['Small, single-purpose classes', 'New features via new types', 'Subtypes honor their base contract', 'Focused interfaces', 'Depend on interfaces, mock easily'],
            },
            {
              title: 'Smells it fixes',
              items: ['God classes that do everything', 'Editing the same switch repeatedly', 'Subclass throwing NotSupported', 'Implementers leaving methods empty', 'new ConcreteThing() scattered everywhere'],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'SOLID is why your code is testable',
          text: 'DIP (depend on interfaces) and ISP (small interfaces) are exactly what let you inject Moq fakes. If a class is hard to unit test, it is usually violating one of these.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: "Don't over-engineer",
          text: 'SOLID is a guide, not a quota. Splitting a 10-line class into five interfaces to “be SOLID” adds complexity without value. Apply the principles where change and testing pressure actually exist.',
        },
        {
          kind: 'keyTakeaways',
          items: [
            'SRP: one reason to change per class.',
            'OCP: extend with new types, do not modify existing ones.',
            'LSP: subtypes must be safely substitutable for their base.',
            'ISP: many small interfaces beat one fat interface; DIP: depend on abstractions — the key to testability.',
          ],
        },
      ],
      questions: [
        {
          id: 'testing-patterns-solid-q1',
          kind: 'mcq',
          prompt: 'A class both calculates payroll and writes the result to a CSV file. Which SOLID principle does this most clearly violate?',
          options: [
            { label: 'Single Responsibility Principle', correct: true },
            { label: 'Liskov Substitution Principle' },
            { label: 'Interface Segregation Principle' },
            { label: 'Open/Closed Principle' },
          ],
          explanation: 'Two unrelated responsibilities (calculation and file I/O) mean two reasons to change, violating SRP. A change to the CSV format should not risk breaking payroll math — split them into separate classes.',
        },
        {
          id: 'testing-patterns-solid-q2',
          kind: 'mcq',
          prompt: 'Which principle most directly enables you to inject a Moq mock instead of a real database?',
          options: [
            { label: 'Single Responsibility Principle' },
            { label: 'Dependency Inversion Principle', correct: true },
            { label: 'Liskov Substitution Principle' },
            { label: 'Open/Closed Principle' },
          ],
          explanation: 'DIP says high-level code should depend on abstractions (an `IRepository`), not concrete classes. Because the class accepts an interface, you can substitute a mock in tests — which is exactly how Moq works.',
        },
        {
          id: 'testing-patterns-solid-q3',
          kind: 'mcq',
          prompt: 'You add a new payment method by editing a growing `switch (type)` statement in one PaymentProcessor class each time. Which principle is being violated?',
          options: [
            { label: 'Interface Segregation Principle' },
            { label: 'Open/Closed Principle', correct: true },
            { label: 'Single Responsibility Principle' },
            { label: 'Liskov Substitution Principle' },
          ],
          explanation: 'OCP wants types open for extension but closed for modification. Editing the same switch for every new payment method means you keep modifying tested code; instead, add a new class implementing a shared `IPaymentMethod` interface.',
        },
        {
          id: 'testing-patterns-solid-q4',
          kind: 'fill',
          prompt: 'The L in SOLID stands for the ___ Substitution Principle.',
          template: 'The L in SOLID stands for the ___ Substitution Principle.',
          accept: ['Liskov'],
          explanation: 'Liskov Substitution Principle states that objects of a subclass must be usable wherever the base class is expected, without altering correctness. The Square/Rectangle case is the textbook violation.',
        },
      ],
      challenges: [
        {
          id: 'testing-patterns-solid-c1',
          difficulty: 'easy',
          title: 'Split a god class',
          prompt: 'Take a class that validates input, saves to a database, and sends an email. Refactor it into three single-responsibility classes. Note one reason each class might change.',
          hints: ['Each distinct “reason to change” suggests a separate class.', 'The orchestrating class can coordinate the three via their interfaces.'],
        },
        {
          id: 'testing-patterns-solid-c2',
          difficulty: 'medium',
          title: 'Open/Closed shipping costs',
          prompt: 'Replace a `switch (carrier)` shipping-cost calculator with an `IShippingRate` interface and one class per carrier. Show that adding a new carrier requires zero edits to existing code.',
          hints: ['The calculator should take an `IShippingRate` (or a collection of them).', 'Adding `FedExRate` means a new file, not an edited switch.'],
        },
        {
          id: 'testing-patterns-solid-c3',
          difficulty: 'hard',
          title: 'Make a tangled service testable',
          prompt: 'Find a class that does `new SqlConnection(...)` and `new SmtpClient(...)` inside its methods. Apply DIP and ISP: introduce focused interfaces, inject them via the constructor, then write a unit test using Moq that needs no real DB or SMTP server.',
          hints: ['Hidden `new` calls are the symptom — lift them into injected interfaces.', 'Keep the interfaces small (ISP) so the test only stubs what it uses.'],
        },
      ],
    },
    {
      slug: 'patterns',
      number: 6,
      title: 'Singleton, Factory, Strategy, Observer',
      objective: 'The four classic patterns you must know by name.',
      blocks: [
        {
          kind: 'lead',
          text: 'Design patterns are named, reusable solutions to recurring problems. You do not need all 23 from the “Gang of Four” book, but four come up constantly in interviews: **Singleton, Factory, Strategy, Observer**. Learn each by its intent and a small C# example.',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Singleton — exactly one instance',
          id: 'singleton',
        },
        {
          kind: 'paragraph',
          text: 'Ensures a class has a single shared instance with a global access point. Useful for things like a config registry. In modern C# you usually get this for free by registering a service as a singleton in the DI container instead of hand-rolling it.',
        },
        {
          kind: 'code',
          language: 'csharp',
          code: 'public sealed class Config\n{\n    private static readonly Lazy<Config> _instance = new(() => new Config());\n    public static Config Instance => _instance.Value;\n    private Config() { }\n\n    public string Environment { get; } = "Production";\n}\n// Usage: Config.Instance.Environment',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Factory — create without naming the concrete type',
          id: 'factory',
        },
        {
          kind: 'paragraph',
          text: 'A factory centralizes object creation so callers ask for *what* they want, not *how* it is built. It pairs with OCP: add a new product type without changing the calling code.',
        },
        {
          kind: 'code',
          language: 'csharp',
          code: 'interface INotifier { void Send(string msg); }\nclass EmailNotifier : INotifier { public void Send(string m) { /*...*/ } }\nclass SmsNotifier   : INotifier { public void Send(string m) { /*...*/ } }\n\nstatic class NotifierFactory\n{\n    public static INotifier Create(string channel) => channel switch\n    {\n        "email" => new EmailNotifier(),\n        "sms"   => new SmsNotifier(),\n        _ => throw new ArgumentException($"Unknown channel: {channel}")\n    };\n}',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Strategy — swap an algorithm at runtime',
          id: 'strategy',
        },
        {
          kind: 'paragraph',
          text: 'Strategy lets you pick one of several interchangeable algorithms behind a common interface. This is the OCP discount example from the SOLID lesson — that *was* the Strategy pattern.',
        },
        {
          kind: 'code',
          language: 'csharp',
          code: 'interface ISortStrategy { int[] Sort(int[] data); }\nclass QuickSort : ISortStrategy { public int[] Sort(int[] d) { /*...*/ return d; } }\nclass BubbleSort : ISortStrategy { public int[] Sort(int[] d) { /*...*/ return d; } }\n\nclass Sorter(ISortStrategy strategy)\n{\n    public int[] Run(int[] data) => strategy.Sort(data);\n}\n// new Sorter(new QuickSort()).Run(numbers);',
        },
        {
          kind: 'heading',
          level: 2,
          text: 'Observer — notify many on a change',
          id: 'observer',
        },
        {
          kind: 'paragraph',
          text: 'Observer lets one subject notify many subscribers when something happens, without knowing who they are. C# bakes this in with **events** — you rarely implement it by hand.',
        },
        {
          kind: 'code',
          language: 'csharp',
          code: 'class Stock\n{\n    public event Action<decimal>? PriceChanged;\n    private decimal _price;\n    public decimal Price\n    {\n        get => _price;\n        set { _price = value; PriceChanged?.Invoke(value); }\n    }\n}\n// stock.PriceChanged += p => Console.WriteLine($"New price: {p}");',
        },
        {
          kind: 'twoColumn',
          cards: [
            {
              title: 'Pattern → one-line intent',
              items: ['Singleton: one shared instance', 'Factory: create without new-ing concrete types', 'Strategy: swappable algorithm', 'Observer: subject notifies subscribers'],
            },
            {
              title: 'C# often gives it to you',
              items: ['Singleton → DI singleton lifetime', 'Factory → DI / typed factories', 'Strategy → inject an interface', 'Observer → events / IObservable'],
            },
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Strategy vs Factory',
          text: 'A Factory decides *which object to create*; Strategy decides *which behavior to run* on an object you already hold. They are often used together: a factory builds the strategy you then execute.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'Singletons can hide global state',
          text: 'A hand-rolled singleton is essentially a global variable and makes testing harder (shared mutable state across tests). Prefer DI with a singleton lifetime so you can still substitute it in tests.',
        },
        {
          kind: 'keyTakeaways',
          items: [
            'Singleton: one shared instance — prefer a DI singleton over hand-rolling.',
            'Factory: centralize creation; callers do not name concrete types.',
            'Strategy: interchangeable algorithms behind one interface (the SOLID discount example).',
            'Observer: a subject notifies many subscribers — C# `event` is built-in support.',
          ],
        },
      ],
      questions: [
        {
          id: 'testing-patterns-patterns-q1',
          kind: 'mcq',
          prompt: 'Which pattern ensures a class has exactly one instance with a global access point?',
          options: [
            { label: 'Factory' },
            { label: 'Singleton', correct: true },
            { label: 'Strategy' },
            { label: 'Observer' },
          ],
          explanation: 'Singleton restricts a class to a single instance and exposes it globally (e.g. `Config.Instance`). In modern C# you usually achieve the same effect with a DI singleton lifetime, which keeps it testable.',
        },
        {
          id: 'testing-patterns-patterns-q2',
          kind: 'mcq',
          prompt: 'You inject an ISortStrategy into a class so the sorting algorithm can be chosen at runtime. Which pattern is this?',
          options: [
            { label: 'Observer' },
            { label: 'Singleton' },
            { label: 'Strategy', correct: true },
            { label: 'Factory' },
          ],
          explanation: 'Selecting one of several interchangeable algorithms behind a common interface is the Strategy pattern. In C# it is simply “inject an interface,” which is why it overlaps so neatly with Dependency Inversion.',
        },
        {
          id: 'testing-patterns-patterns-q3',
          kind: 'predict',
          prompt: 'What does this print when the price is set?',
          code: 'class Stock {\n    public event Action<decimal>? PriceChanged;\n    private decimal _p;\n    public decimal Price { get => _p; set { _p = value; PriceChanged?.Invoke(value); } }\n}\n\nvar s = new Stock();\ns.PriceChanged += p => Console.WriteLine($"Now {p}");\ns.Price = 42m;',
          options: [
            { label: 'Now 42', correct: true },
            { label: 'Nothing — events do not fire on property setters' },
            { label: 'A NullReferenceException' },
            { label: 'Now 0' },
          ],
          explanation: 'Setting `Price` runs the setter, which invokes `PriceChanged` with the new value. Because a subscriber is attached, `PriceChanged?.Invoke(42m)` runs the lambda and prints “Now 42”. This is the Observer pattern via C# events.',
        },
        {
          id: 'testing-patterns-patterns-q4',
          kind: 'fill',
          prompt: 'A method that returns an INotifier based on a "channel" string, hiding which concrete class is created, is an example of the ___ pattern.',
          template: '... is an example of the ___ pattern.',
          accept: ['Factory'],
          explanation: 'A Factory centralizes and hides object construction, so callers request an abstraction (`INotifier`) without naming the concrete type. This keeps calling code closed for modification when new notifier types are added.',
        },
      ],
      challenges: [
        {
          id: 'testing-patterns-patterns-c1',
          difficulty: 'easy',
          title: 'Build a thread-safe Singleton',
          prompt: 'Implement a `Logger` singleton using `Lazy<T>` with a private constructor. Write a quick test (or two `Instance` reads) confirming both references point to the same object.',
          hints: ['`ReferenceEquals(Logger.Instance, Logger.Instance)` should be true.', '`Lazy<T>` is thread-safe by default.'],
        },
        {
          id: 'testing-patterns-patterns-c2',
          difficulty: 'medium',
          title: 'Factory + Strategy together',
          prompt: 'Define an `IShippingCost` strategy with two implementations, and a `ShippingFactory.Create(carrier)` that returns the right one. A `Checkout` class should take the strategy and compute a total. Show adding a third carrier touches no existing class.',
          hints: ['The factory decides which strategy to build; Checkout just runs it.', 'New carrier = new strategy class + one factory case.'],
        },
        {
          id: 'testing-patterns-patterns-c3',
          difficulty: 'hard',
          title: 'Observer with events',
          prompt: 'Model a `Thermostat` that raises a `TemperatureChanged` event. Attach two subscribers (a logger and an alarm that fires above 30°). Then write a unit test that subscribes a handler and asserts it was invoked with the right value when the temperature is set.',
          hints: ['Use `event Action<double>` or a custom EventArgs type.', 'In the test, capture the event payload in a local variable inside the handler, then Assert on it.'],
        },
      ],
    },
  ],
  projects: [
    {
      id: 'testing-patterns-project-1',
      difficulty: 'intermediate',
      title: 'Test-drive a Bank Account library',
      brief: 'Build a small, fully tested BankAccount library from scratch using TDD, AAA structure, and clean design — no UI, just well-tested logic.',
      requirements: [
        'Use strict TDD: every behavior starts as a failing xUnit test.',
        'Support Deposit, Withdraw, and Balance with sensible rules (no negative deposits, no overdraft).',
        'Throw a clear exception on invalid operations and cover it with Assert.Throws.',
        'Structure every test as Arrange-Act-Assert with one action per test.',
        'Use a [Theory] with [InlineData] for at least one set of boundary cases.',
      ],
      stretch: [
        'Add an ITransactionLog interface and verify, with Moq, that each transaction is logged.',
        'Apply SRP by separating balance rules from logging concerns.',
      ],
      concepts: ['xUnit', 'TDD', 'Arrange-Act-Assert', 'Assert.Throws', 'Moq'],
    },
    {
      id: 'testing-patterns-project-2',
      difficulty: 'advanced',
      title: 'Notification system with patterns + tests',
      brief: 'Design a notification dispatcher that applies Factory, Strategy, and Observer, then prove the design with Moq-based unit tests — a realistic SOLID showcase.',
      requirements: [
        'Define an INotifier interface with at least Email and SMS strategies (Strategy).',
        'Use a NotifierFactory to create the right notifier from a channel name (Factory).',
        'Raise an event when a notification is dispatched so subscribers can react (Observer).',
        'Inject all dependencies via constructors so the dispatcher follows DIP.',
        'Write xUnit tests using Moq that verify the correct notifier is invoked, with Times.Once.',
      ],
      stretch: [
        'Add a third channel without modifying existing classes (demonstrate OCP).',
        'Add a retry strategy and test the failure path with a mock that throws.',
      ],
      concepts: ['Strategy', 'Factory', 'Observer', 'SOLID', 'Moq', 'xUnit'],
    },
  ],
  outline: [],
};
