import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * Backtracking Problems
 */
const LeetcodeBacktracking: React.FC = () => {
  return (
    <>
      <p>
        Backtracking builds candidate solutions incrementally and abandons them when they
        can't lead to a valid solution. It's a refined form of brute force—instead of
        generating all possibilities blindly, we prune branches early.
      </p>

      <p>
        The pattern follows three steps: make a choice, explore the consequences, then undo
        the choice to try alternatives. This undo step is the "backtrack."
      </p>

      <CodeBlock language="python">
{`def backtrack(path, choices):
    if is_valid_solution(path):
        result.append(path.copy())
        return

    for choice in choices:
        path.append(choice)              # Make choice
        backtrack(path, next_choices)    # Explore
        path.pop()                        # Undo choice`}
      </CodeBlock>

      <h2>Letter Combinations of a Phone Number</h2>

      <p>
        Given digits from 2-9, return all possible letter combinations. For example, "23"
        maps to ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
      </p>

      <CodeBlock language="plaintext">
{`Digit mapping:
2 -> "abc"
3 -> "def"
4 -> "ghi"
5 -> "jkl"
6 -> "mno"
7 -> "pqrs"
8 -> "tuv"
9 -> "wxyz"`}
      </CodeBlock>

      <CodeBlock language="python">
{`def letterCombinations(digits):
    if not digits:
        return []

    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }

    result = []

    def backtrack(index, path):
        if index == len(digits):
            result.append(''.join(path))
            return

        letters = phone[digits[index]]
        for letter in letters:
            path.append(letter)
            backtrack(index + 1, path)
            path.pop()

    backtrack(0, [])
    return result`}
      </CodeBlock>

      <p>
        For each digit, we try every possible letter it maps to. The recursion depth equals
        the number of digits, and at each level we branch based on how many letters the digit
        represents. For "23", we build 9 combinations (3 letters × 3 letters).
      </p>

      <h2>Generate Parentheses</h2>

      <p>
        Given n pairs of parentheses, generate all combinations of well-formed parentheses.
        For n=3, the result is ["((()))", "(()())", "(())()", "()(())", "()()()"].
      </p>

      <CodeBlock language="python">
{`def generateParenthesis(n):
    result = []

    def backtrack(path, open_count, close_count):
        if len(path) == 2 * n:
            result.append(''.join(path))
            return

        if open_count < n:
            path.append('(')
            backtrack(path, open_count + 1, close_count)
            path.pop()

        if close_count < open_count:
            path.append(')')
            backtrack(path, open_count, close_count + 1)
            path.pop()

    backtrack([], 0, 0)
    return result`}
      </CodeBlock>

      <p>
        We can add an opening parenthesis as long as we haven't used all n pairs. We can add
        a closing parenthesis only if it won't exceed the number of opening parentheses. This
        constraint ensures all generated combinations are valid.
      </p>

      <h2>Combination Sum</h2>

      <p>
        Given an array of distinct integers and a target, find all combinations where the
        numbers sum to target. Each number can be used unlimited times.
      </p>

      <CodeBlock language="plaintext">
{`Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]`}
      </CodeBlock>

      <CodeBlock language="python">
{`def combinationSum(candidates, target):
    result = []

    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path.copy())
            return

        if remaining < 0:
            return

        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, path, remaining - candidates[i])
            path.pop()

    backtrack(0, [], target)
    return result`}
      </CodeBlock>

      <p>
        We can reuse the same element, so when we recurse, we pass the same index i rather
        than i+1. The start parameter prevents generating duplicate combinations in different
        orders—[2,3,2] and [3,2,2] would be the same combination.
      </p>

      <h2>Combination Sum II</h2>

      <p>
        Similar to the previous problem, but each number can only be used once, and the input
        may contain duplicates.
      </p>

      <CodeBlock language="plaintext">
{`Input: candidates = [10,1,2,7,6,1,5], target = 8
Output: [[1,1,6],[1,2,5],[1,7],[2,6]]`}
      </CodeBlock>

      <CodeBlock language="python">
{`def combinationSum2(candidates, target):
    result = []
    candidates.sort()

    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path.copy())
            return

        if remaining < 0:
            return

        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i - 1]:
                continue

            path.append(candidates[i])
            backtrack(i + 1, path, remaining - candidates[i])
            path.pop()

    backtrack(0, [], target)
    return result`}
      </CodeBlock>

      <p>
        Sorting allows us to skip duplicate values. If the current number equals the previous
        one and we didn't use the previous one (i &gt; start means we're not at the first iteration
        of this recursive call), we skip it. We pass i+1 to the recursion because each number
        can only be used once.
      </p>

      <h2>Permutations</h2>

      <p>
        Given an array of distinct integers, return all possible permutations. For [1,2,3],
        there are 6 permutations.
      </p>

      <CodeBlock language="python">
{`def permute(nums):
    result = []

    def backtrack(path, remaining):
        if not remaining:
            result.append(path.copy())
            return

        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()

    backtrack([], nums)
    return result`}
      </CodeBlock>

      <p>
        Unlike combinations, order matters in permutations. We build the remaining array by
        excluding the element we just added. An alternative approach uses a boolean array to
        track which elements have been used.
      </p>

      <CodeBlock language="python">
{`def permute(nums):
    result = []
    used = [False] * len(nums)

    def backtrack(path):
        if len(path) == len(nums):
            result.append(path.copy())
            return

        for i in range(len(nums)):
            if used[i]:
                continue

            path.append(nums[i])
            used[i] = True
            backtrack(path)
            used[i] = False
            path.pop()

    backtrack([])
    return result`}
      </CodeBlock>

      <h2>Subsets</h2>

      <p>
        Given an array of unique integers, return all possible subsets. For [1,2,3], there
        are 8 subsets including the empty set.
      </p>

      <CodeBlock language="python">
{`def subsets(nums):
    result = []

    def backtrack(start, path):
        result.append(path.copy())

        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result`}
      </CodeBlock>

      <p>
        Every path we build is a valid subset, so we add it immediately. We continue building
        longer subsets by adding more elements. The start parameter ensures we only add elements
        that come after the last element we added, preventing duplicates like [1,2] and [2,1].
      </p>

      <h2>N-Queens</h2>

      <p>
        Place n queens on an n×n chessboard so no two queens attack each other. Queens attack
        any square in the same row, column, or diagonal.
      </p>

      <CodeBlock language="python">
{`def solveNQueens(n):
    result = []
    board = [['.'] * n for _ in range(n)]

    def is_safe(row, col):
        for i in range(row):
            if board[i][col] == 'Q':
                return False

        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j -= 1

        i, j = row - 1, col + 1
        while i >= 0 and j < n:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j += 1

        return True

    def backtrack(row):
        if row == n:
            result.append([''.join(row) for row in board])
            return

        for col in range(n):
            if is_safe(row, col):
                board[row][col] = 'Q'
                backtrack(row + 1)
                board[row][col] = '.'

    backtrack(0)
    return result`}
      </CodeBlock>

      <p>
        We place queens row by row. For each row, we try each column and check if it's safe.
        A position is safe if no queen exists in the same column or either diagonal above it.
        We don't need to check the row because we only place one queen per row.
      </p>

      <h2>When to Use Backtracking</h2>

      <p>
        Backtracking applies when you need to find all solutions that satisfy certain constraints.
        Problems asking for "all combinations," "all permutations," or "all valid configurations"
        often use this approach.
      </p>

      <p>
        The main optimization is pruning—checking constraints before recursing rather than
        after building the full solution. In Generate Parentheses, we don't recurse if adding
        a parenthesis would violate the well-formed constraint. In N-Queens, we don't recurse
        if placing a queen would put it under attack.
      </p>

      <p>
        Combinations use a start index to avoid duplicates in different orders. Permutations
        use all elements but track which have been used. Subsets are like combinations but
        every partial path is a valid solution.
      </p>
    </>
  );
};

export default LeetcodeBacktracking;
