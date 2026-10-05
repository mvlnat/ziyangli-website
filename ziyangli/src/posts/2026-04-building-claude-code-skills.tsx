import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * Building Skills for Claude Code
 */
const BuildingClaudeCodeSkills: React.FC = () => {
  return (
    <>
      <p>
        Claude Code supports custom skills—reusable workflows that execute when you invoke them
        with a slash command. A skill is a markdown file that instructs Claude how to perform a
        specific task. When you run <code>/commit</code> or <code>/review-pr</code>, you're
        using skills.
      </p>

      <h2>What is a Skill?</h2>

      <p>
        A personal skill lives in <code>~/.claude/skills/&lt;skill-name&gt;/SKILL.md</code>.
        A project skill uses <code>.claude/skills/&lt;skill-name&gt;/SKILL.md</code>.
        The directory name, or the frontmatter name when provided, becomes the command name.
        For example, <code>commit/SKILL.md</code> creates <code>/commit</code>.
      </p>

      <CodeBlock language="plaintext">
{`~/.claude/skills/
├── commit/
│   └── SKILL.md
├── review-pr/
│   └── SKILL.md
└── refactor/
    └── SKILL.md`}
      </CodeBlock>

      <p>
        Skills run with conversation context and tools allowed by the session's permissions. They can
        read files, run commands, search code, and make decisions based on what they find.
      </p>

      <h2>Basic Skill Structure</h2>

      <p>
        A skill file starts with metadata in YAML frontmatter, followed by markdown instructions.
        The metadata defines the skill's name, description, and invocation options. The instructions tell
        Claude what to do.
      </p>

      <CodeBlock language="markdown">
{`---
name: commit
description: Create a git commit with a well-formatted message
argument-hint: "[message]"
disable-model-invocation: true
---

# Commit Skill

You are helping the user create a git commit.

## Steps

1. Run \`git status\` to see what files have changed
2. Run \`git diff\` to see the actual changes
3. Analyze the changes and create a descriptive commit message
4. If $ARGUMENTS contains a commit message, use that instead
5. Stage only the files intended for this commit; leave unrelated changes alone
6. Commit with the message
7. Show the user what was committed`}
      </CodeBlock>

      <p>
        The frontmatter defines the skill's interface. The markdown body contains instructions
        written in natural language. Claude reads these instructions when the skill is invoked.
      </p>

      <h2>Parameters</h2>

      <p>
        Skills can accept parameters. When you run <code>/review-pr 123</code>, the number 123
        is available through <code>$ARGUMENTS</code>. An <code>argument-hint</code> documents
        the expected input; the skill instructions must validate it.
      </p>

      <CodeBlock language="markdown">
{`---
name: review-pr
description: Review a GitHub pull request
argument-hint: "[pr-number]"
---

# PR Review Skill

Review pull request $ARGUMENTS.
If the argument is missing or is not a pull request number, ask for a valid number before running commands.

1. Use \`gh pr view $ARGUMENTS\` to get PR details
2. Use \`gh pr diff $ARGUMENTS\` to see changes
3. Analyze the code for:
   - Correctness
   - Edge cases
   - Performance issues
   - Security vulnerabilities
4. Write a review with specific line references`}
      </CodeBlock>

      <p>
        Use <code>$ARGUMENTS</code> for the full input, or <code>$0</code> and
        <code>$1</code> for positional arguments. These substitutions insert text into the
        instructions. Validate inputs before using them in shell commands; argument hints
        do not enforce required parameters.
      </p>

      <h2>Example: Test Runner</h2>

      <p>
        A test runner skill that finds and runs tests related to changed files.
      </p>

      <CodeBlock language="markdown">
{`---
name: test
description: Run tests for changed files
argument-hint: "[pattern]"
---

# Test Runner

Run relevant tests for the current changes.

## Steps

1. Check \`git status\` to find modified files
2. For each modified file:
   - If it's a test file, note it
   - If it's a source file, find corresponding test files
3. If $ARGUMENTS contains a pattern, use it to filter tests
4. Run the tests using the project's test command
   - For Python: \`pytest <files>\`
   - For JavaScript: \`npm test -- <pattern>\`
   - For Go: \`go test <packages>\`
5. If tests fail:
   - Show the failures
   - Offer to help fix them
6. If tests pass:
   - Confirm success
   - Show test coverage if available

## Notes

- Check package.json, setup.py, or go.mod to determine project type
- Don't run the entire test suite unless specifically asked
- Focus on tests related to changed code`}
      </CodeBlock>

      <h2>Example: Code Refactor</h2>

      <p>
        A refactoring skill that improves code based on common patterns.
      </p>

      <CodeBlock language="markdown">
{`---
name: refactor
description: Refactor code following best practices
argument-hint: "[file] [focus]"
---

# Refactor Skill

Refactor code to improve quality. The target file is $0 and the focus is $1.
If a placeholder is unchanged because its argument was omitted, use the conversation context.

## Process

1. If file specified, read it. Otherwise, use current conversation context
2. Analyze the code for:
   - Duplicate logic that could be extracted
   - Complex conditionals that could be simplified
   - Long functions that could be split
   - Missing error handling
   - Type safety issues (if TypeScript/typed language)
   - Performance bottlenecks (if focus=performance)

3. Based on focus argument:
   - performance: Optimize algorithms, reduce allocations, cache results
   - readability: Extract functions, rename variables, add comments
   - type-safety: Add type annotations, use stricter types
   - Default: Balance all three

4. Make refactoring changes incrementally:
   - One logical change at a time
   - Explain each change
   - Ensure tests still pass after each change

5. After refactoring:
   - Run tests to verify behavior unchanged
   - Show summary of improvements made

## Guidelines

- Don't change behavior, only structure
- Keep diffs small and reviewable
- Preserve existing comments and documentation
- Ask before making major architectural changes`}
      </CodeBlock>

      <h2>Example: Documentation Generator</h2>

      <p>
        A skill that generates or updates documentation from code.
      </p>

      <CodeBlock language="markdown">
{`---
name: doc
description: Generate or update documentation
argument-hint: "[target]"
---

# Documentation Skill

Generate documentation from code. The optional target is $ARGUMENTS.

## Steps

1. Determine what needs documentation:
   - If target specified, focus on that
   - If in a file, document that file
   - If no context, ask user what to document

2. Read the relevant code

3. Generate documentation based on target:
   - function: JSDoc/docstring with params, returns, examples
   - file: Header comment explaining purpose, exports
   - api: API reference with endpoints, params, responses
   - readme: Project README with setup, usage, examples

4. For code documentation:
   - Describe what the code does, not how
   - Include parameter types and descriptions
   - Add usage examples
   - Note any side effects or exceptions

5. For README:
   - Installation instructions
   - Quick start example
   - API overview
   - Common use cases
   - Link to detailed docs

6. Write the documentation
7. Ask user to review before committing`}
      </CodeBlock>

      <h2>Best Practices</h2>

      <p>
        Keep skills focused. A skill that does one thing well is better than one that does many
        things poorly. The test runner runs tests. The commit skill makes commits. Don't combine
        them into a single "git-workflow" skill.
      </p>

      <p>
        Use clear step-by-step instructions. Claude follows the instructions sequentially. Number
        the steps. Use conditional logic where needed: "If tests fail, show the failures. If they
        pass, show coverage."
      </p>

      <p>
        Make skills discoverable. Write good descriptions in the frontmatter. Users see these
        in the slash-command menu. A description like "Create git commit" is better than
        "Commit helper."
      </p>

      <p>
        Handle errors gracefully. Tell Claude what to do when things go wrong. "If the file
        doesn't exist, ask the user for a valid path" is better than assuming the file exists.
      </p>

      <p>
        Don't hardcode project-specific details. Use git commands to find information. Use
        package.json or pyproject.toml to determine how to run tests. Let the skill adapt to
        different projects.
      </p>

      <h2>Advanced: Context Awareness</h2>

      <p>
        Skills have access to conversation context. Claude remembers what files were recently
        discussed, what errors occurred, what the user is working on. Use this.
      </p>

      <CodeBlock language="markdown">
{`---
name: fix
description: Fix the most recent error or issue
---

# Fix Skill

Fix the most recent error or issue discussed in this conversation.

1. Look at recent conversation for:
   - Error messages
   - Test failures
   - Compilation errors
   - Runtime exceptions

2. Identify the root cause

3. Determine the fix:
   - Read the relevant files
   - Understand the intended behavior
   - Find the minimal change needed

4. Apply the fix

5. Verify it works:
   - Run the code/tests that previously failed
   - Check that the error is resolved

6. Explain what was wrong and how you fixed it`}
      </CodeBlock>

      <p>
        This skill doesn't need parameters. It uses conversation context to figure out what to
        fix. If the user just saw a test failure and runs <code>/fix</code>, Claude knows what
        to fix.
      </p>

      <h2>Debugging Skills</h2>

      <p>
        Add debug output to skills during development. Include instructions like "Show the user
        what you found" or "Explain your reasoning." Once the skill works, remove verbose output.
      </p>

      <p>
        Test skills in different scenarios. Try them on different projects, with different
        parameters, when files don't exist, when commands fail. Make the skill robust.
      </p>

      <h2>Sharing Skills</h2>

      <p>
        Skills are just markdown files. Share them by copying files or creating a git repository.
        Some users maintain collections of skills for specific domains: web development, data
        science, DevOps.
      </p>

      <p>
        Document your skills. Add a comment at the top explaining what the skill does, when to
        use it, and any prerequisites. Future you will appreciate this.
      </p>

      <h2>Limits</h2>

      <p>
        Skill instructions describe work for Claude to perform with permitted tools. By default
        they run in the current conversation; skills can also be configured to run in a
        separate subagent context. A skill does not grant extra tool permissions.
      </p>

      <p>
        Skills work best for workflows that follow a pattern. If every invocation needs different
        logic, the skill becomes too complex. Sometimes a simple conversation with Claude is
        better than a rigid skill.
      </p>

      <p>
        The skill file is the interface. Clear instructions produce consistent results. Vague
        instructions produce unpredictable behavior. Write instructions you would want to follow
        yourself.
      </p>
      <p>
        Refer to the <a href="https://code.claude.com/docs/en/skills">Claude Code skills documentation</a>
        {' '}for supported locations, frontmatter fields, and argument substitutions.
      </p>
    </>
  );
};

export default BuildingClaudeCodeSkills;
