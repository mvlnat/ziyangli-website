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
        A skill is a markdown file in your <code>~/.config/claude/skills/</code> directory. The
        filename becomes the command name. A file called <code>commit.md</code> creates the
        <code>/commit</code> command. The file contains instructions that Claude follows when
        you invoke the skill.
      </p>

      <CodeBlock language="plaintext">
{`~/.config/claude/skills/
├── commit.md
├── review-pr.md
└── refactor.md`}
      </CodeBlock>

      <p>
        Skills have access to the full conversation context and all of Claude's tools. They can
        read files, run commands, search code, and make decisions based on what they find.
      </p>

      <h2>Basic Skill Structure</h2>

      <p>
        A skill file starts with metadata in YAML frontmatter, followed by markdown instructions.
        The metadata defines the skill's name, description, and parameters. The instructions tell
        Claude what to do.
      </p>

      <CodeBlock language="markdown">
{`---
name: commit
description: Create a git commit with a well-formatted message
args:
  - name: message
    description: Optional commit message
    required: false
---

# Commit Skill

You are helping the user create a git commit.

## Steps

1. Run \`git status\` to see what files have changed
2. Run \`git diff\` to see the actual changes
3. Analyze the changes and create a descriptive commit message
4. If the user provided a message in args, use that instead
5. Stage all changes with \`git add .\`
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
        is passed as an argument. The skill defines what parameters it accepts in the frontmatter.
      </p>

      <CodeBlock language="markdown">
{`---
name: review-pr
description: Review a GitHub pull request
args:
  - name: pr_number
    description: Pull request number to review
    required: true
---

# PR Review Skill

Review pull request #{args.pr_number}.

1. Use \`gh pr view {args.pr_number}\` to get PR details
2. Use \`gh pr diff {args.pr_number}\` to see changes
3. Analyze the code for:
   - Correctness
   - Edge cases
   - Performance issues
   - Security vulnerabilities
4. Write a review with specific line references`}
      </CodeBlock>

      <p>
        Parameters are accessed with <code>{`{args.parameter_name}`}</code> in the instructions.
        Required parameters prevent the skill from running if they're missing.
      </p>

      <h2>Example: Test Runner</h2>

      <p>
        A test runner skill that finds and runs tests related to changed files.
      </p>

      <CodeBlock language="markdown">
{`---
name: test
description: Run tests for changed files
args:
  - name: pattern
    description: Optional test pattern to match
    required: false
---

# Test Runner

Run relevant tests for the current changes.

## Steps

1. Check \`git status\` to find modified files
2. For each modified file:
   - If it's a test file, note it
   - If it's a source file, find corresponding test files
3. If user provided a pattern, use it to filter tests
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
args:
  - name: file
    description: File to refactor (optional, defaults to current context)
    required: false
  - name: focus
    description: What to focus on (performance, readability, type-safety)
    required: false
---

# Refactor Skill

Refactor code to improve quality.

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
args:
  - name: target
    description: What to document (function, file, api, readme)
    required: false
---

# Documentation Skill

Generate documentation from code.

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
        when they run <code>/help</code>. A description like "Create git commit" is better than
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
        Skills can't modify the filesystem directly—they instruct Claude to use tools. They
        can't run in the background. They execute in the current conversation context and finish
        when done.
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
    </>
  );
};

export default BuildingClaudeCodeSkills;
