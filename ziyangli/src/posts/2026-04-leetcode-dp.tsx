import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * Dynamic Programming Patterns
 */
const LeetcodeDP: React.FC = () => {
  return (
    <>
      <p>
        Dynamic programming solves problems by breaking them into overlapping subproblems. We
        compute each subproblem once and store the result. The difference between recursion with
        memoization and tabulation is mostly about direction—top-down versus bottom-up.
      </p>

      <h2>Recursive vs Tabulation</h2>

      <p>
        The recursive approach (top-down with memoization) starts from the problem we want to
        solve and recursively breaks it down. We cache results to avoid recomputation. Tabulation
        (bottom-up) starts from the base cases and builds up to the answer.
      </p>

      <CodeBlock language="python">
{`# Fibonacci - Recursive with Memoization (Top-Down)
def fib_memo(n, memo=None):
    if memo is None:
        memo = {}

    if n in memo:
        return memo[n]

    if n <= 1:
        return n

    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# Fibonacci - Tabulation (Bottom-Up)
def fib_tab(n):
    if n <= 1:
        return n

    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp[n]`}
      </CodeBlock>

      <p>
        Both approaches have the same time complexity once memoized. Tabulation often uses less
        stack space because it avoids deep recursion. Memoization only computes the subproblems
        you actually need, which can be faster if you don't need all of them.
      </p>

      <h2>1D DP: House Robber</h2>

      <p>
        You're a robber planning to rob houses along a street. Each house has some money, but
        you can't rob two adjacent houses because it triggers an alarm. What's the maximum you
        can rob?
      </p>

      <CodeBlock language="plaintext">
{`Input: nums = [2,7,9,3,1]
Output: 12
Explanation: Rob house 0 (2) + house 2 (9) + house 4 (1) = 12`}
      </CodeBlock>

      <p>
        At each house, you choose to rob it or skip it. If you rob it, you can't rob the
        previous house. If you skip it, your max is whatever you had at the previous house.
      </p>

      <CodeBlock language="python">
{`# Recursive with Memoization
def rob_memo(nums):
    memo = {}

    def dp(i):
        if i < 0:
            return 0
        if i in memo:
            return memo[i]

        # Rob current house + max from i-2, or skip and take max from i-1
        memo[i] = max(nums[i] + dp(i - 2), dp(i - 1))
        return memo[i]

    return dp(len(nums) - 1)`}
      </CodeBlock>

      <CodeBlock language="python">
{`# Tabulation
def rob_tab(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]

    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])

    for i in range(2, len(nums)):
        dp[i] = max(nums[i] + dp[i - 2], dp[i - 1])

    return dp[-1]`}
      </CodeBlock>

      <p>
        The state is one-dimensional because it only depends on the index. We can optimize space
        to O(1) by keeping just the last two values instead of the entire array.
      </p>

      <CodeBlock language="python">
{`def rob_optimized(nums):
    if not nums:
        return 0

    prev2 = 0  # dp[i-2]
    prev1 = 0  # dp[i-1]

    for num in nums:
        current = max(num + prev2, prev1)
        prev2 = prev1
        prev1 = current

    return prev1`}
      </CodeBlock>

      <h2>2D DP: Word Break</h2>

      <p>
        Given a string and a dictionary of words, determine if the string can be segmented into
        a space-separated sequence of dictionary words.
      </p>

      <CodeBlock language="plaintext">
{`Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: "leetcode" can be segmented as "leet code"`}
      </CodeBlock>

      <p>
        This looks like it could be 1D, and it can be. But the natural recursive formulation
        considers two dimensions: the starting position and the word we're trying to match.
        The 1D version emerges when we realize we just need to track whether each position is
        reachable.
      </p>

      <CodeBlock language="python">
{`# Recursive with Memoization
def wordBreak_memo(s, wordDict):
    word_set = set(wordDict)
    memo = {}

    def dp(i):
        # Can we break s[i:] into words from wordDict?
        if i == len(s):
            return True
        if i in memo:
            return memo[i]

        for j in range(i + 1, len(s) + 1):
            if s[i:j] in word_set and dp(j):
                memo[i] = True
                return True

        memo[i] = False
        return False

    return dp(0)`}
      </CodeBlock>

      <CodeBlock language="python">
{`# Tabulation (1D)
def wordBreak_tab(s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True  # Empty string is breakable

    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break

    return dp[len(s)]`}
      </CodeBlock>

      <p>
        The tabulation version is 1D. We build up from the start of the string. For each position
        i, we check if there's an earlier position j where s[j:i] is a valid word and position j
        was reachable.
      </p>

      <h2>3D DP: Knight Probability in Chessboard</h2>

      <p>
        A knight is placed on a chessboard and makes exactly k moves. Each move is chosen
        uniformly at random from the valid moves. What's the probability the knight stays on
        the board after k moves?
      </p>

      <CodeBlock language="plaintext">
{`Input: n = 3, k = 2, row = 0, column = 0
Output: 0.0625
Explanation: There are 8 possible move sequences, only 2 keep the knight on board`}
      </CodeBlock>

      <p>
        The state has three dimensions: row, column, and moves remaining. At each position with
        k moves left, the probability is the average of the probabilities from all positions the
        knight could move to.
      </p>

      <CodeBlock language="python">
{`# Recursive with Memoization
def knightProbability_memo(n, k, row, column):
    moves = [
        (2, 1), (2, -1), (-2, 1), (-2, -1),
        (1, 2), (1, -2), (-1, 2), (-1, -2)
    ]
    memo = {}

    def dp(r, c, k_remaining):
        if r < 0 or r >= n or c < 0 or c >= n:
            return 0
        if k_remaining == 0:
            return 1
        if (r, c, k_remaining) in memo:
            return memo[(r, c, k_remaining)]

        probability = 0
        for dr, dc in moves:
            probability += dp(r + dr, c + dc, k_remaining - 1) / 8

        memo[(r, c, k_remaining)] = probability
        return probability

    return dp(row, column, k)`}
      </CodeBlock>

      <CodeBlock language="python">
{`# Tabulation
def knightProbability_tab(n, k, row, column):
    moves = [
        (2, 1), (2, -1), (-2, 1), (-2, -1),
        (1, 2), (1, -2), (-1, 2), (-1, -2)
    ]

    # dp[move][r][c] = probability of being at (r,c) after 'move' moves
    dp = [[[0] * n for _ in range(n)] for _ in range(k + 1)]
    dp[0][row][column] = 1

    for move in range(k):
        for r in range(n):
            for c in range(n):
                if dp[move][r][c] > 0:
                    for dr, dc in moves:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < n and 0 <= nc < n:
                            dp[move + 1][nr][nc] += dp[move][r][c] / 8

    total = 0
    for r in range(n):
        for c in range(n):
            total += dp[k][r][c]

    return total`}
      </CodeBlock>

      <p>
        The tabulation version builds forward. We start with probability 1 at the starting
        position with 0 moves made. For each subsequent move, we distribute the probability
        from each cell to all cells reachable by a knight move.
      </p>

      <p>
        We can optimize space by keeping only two 2D arrays: the current move and the next move.
        We don't need all k layers.
      </p>

      <CodeBlock language="python">
{`def knightProbability_optimized(n, k, row, column):
    moves = [
        (2, 1), (2, -1), (-2, 1), (-2, -1),
        (1, 2), (1, -2), (-1, 2), (-1, -2)
    ]

    dp = [[0] * n for _ in range(n)]
    dp[row][column] = 1

    for _ in range(k):
        next_dp = [[0] * n for _ in range(n)]
        for r in range(n):
            for c in range(n):
                if dp[r][c] > 0:
                    for dr, dc in moves:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < n and 0 <= nc < n:
                            next_dp[nr][nc] += dp[r][c] / 8
        dp = next_dp

    return sum(sum(row) for row in dp)`}
      </CodeBlock>

      <h2>What Does dp[i] Mean?</h2>

      <p>
        The meaning of dp[i] changes depending on the problem. Understanding what question dp[i]
        answers is more important than memorizing solutions.
      </p>

      <p>
        In House Robber, dp[i] means "maximum money if we consider houses 0 through i." We're
        looking at everything up to and including position i. The recurrence is dp[i] = max(nums[i] + dp[i-2], dp[i-1])
        because we either rob house i (and add to our best from i-2) or skip it (and keep our best from i-1).
      </p>

      <p>
        In Word Break with memoization, dp[i] means "can we break the substring starting at i?"
        We're looking forward from position i to the end. The direction flipped—dp[i] doesn't
        include position i in the answer, it asks about everything after i.
      </p>

      <p>
        In Coin Change, dp[i] means "minimum number of coins to make amount i." Here dp[i]
        isn't about position in an array, it's about achieving a target value. We build up:
        dp[i] = min(dp[i], dp[i - coin] + 1) for each coin.
      </p>

      <p>
        In Coin Change II counting combinations, dp[i] means "number of ways to make amount i."
        Same state variable, different question. Instead of minimizing, we're counting.
      </p>

      <CodeBlock language="python">
{`# dp[i] = maximum value considering items 0..i
# (House Robber pattern)
dp[i] = max(nums[i] + dp[i-2], dp[i-1])

# dp[i] = can we achieve goal starting from position i?
# (Word Break pattern - recursive)
dp[i] = any(s[i:j] in words and dp[j] for j in range(i+1, n+1))

# dp[i] = minimum cost to reach value i
# (Coin Change pattern)
dp[i] = min(dp[i], dp[i - coin] + 1)

# dp[i] = number of ways to reach value i
# (Counting pattern)
dp[i] = sum(dp[i - coin] for coin in coins)

# dp[i] = is value i achievable?
# (Boolean pattern)
dp[i] = any(dp[i - num] for num in nums)`}
      </CodeBlock>

      <p>
        The pattern is: decide what question dp[i] answers, then write the recurrence to answer
        that question based on smaller subproblems. The state variable i might represent a
        position, a remaining value, a target sum, or something else entirely. What matters is
        being clear about what the state represents.
      </p>

      <h2>Choosing Between Approaches</h2>

      <p>
        Use recursion with memoization when the problem naturally expresses itself recursively
        or when you don't need to compute all subproblems. The knight probability problem is
        easier to think about recursively: "What's the probability from this position with k
        moves left?" versus "How does probability flow forward through the board?"
      </p>

      <p>
        Use tabulation when the dependency order is clear and you need most or all subproblems.
        House Robber is naturally iterative: you go through houses one by one, building up the
        answer. Word Break works well both ways, but tabulation avoids recursion depth issues
        on long strings.
      </p>

      <p>
        The dimension of the DP is determined by how many variables define a unique subproblem.
        House Robber needs one (which house). Word Break needs one (which position in the
        string). Knight Probability needs three (row, column, moves remaining).
      </p>

      <p>
        When optimizing space, look at what each state depends on. House Robber only needs the
        previous two states, so we can discard older ones. Knight Probability only needs the
        previous move's probabilities to compute the next move, so we can discard older moves.
      </p>
    </>
  );
};

export default LeetcodeDP;
