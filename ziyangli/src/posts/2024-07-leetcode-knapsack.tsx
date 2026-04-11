import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * Knapsack Problems
 */
const LeetcodeKnapsack: React.FC = () => {
  return (
    <>
      <p>
        The knapsack problem rarely appears with that name on LeetCode, but the pattern shows
        up constantly. Given items with weights and values and a capacity limit, which items
        should we take to maximize value? The variations depend on how many times we can use
        each item.
      </p>

      <h2>0/1 Knapsack</h2>

      <p>
        In the 0/1 variant, we can use each item at most once. For each item, we either take
        it or leave it—hence "0/1."
      </p>

      <CodeBlock language="python">
{`def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't take item i-1
            dp[i][w] = dp[i-1][w]

            # Take item i-1 if it fits
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])

    return dp[n][capacity]`}
      </CodeBlock>

      <p>
        We can optimize space by using a 1D array, but we must traverse backwards to avoid
        using the same item twice.
      </p>

      <CodeBlock language="python">
{`def knapsack_01_optimized(weights, values, capacity):
    dp = [0] * (capacity + 1)

    for i in range(len(weights)):
        # Traverse backwards
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]`}
      </CodeBlock>

      <p>
        The backwards traversal is critical. If we went forwards, we might use <code>dp[w - weight]</code>
        which we just updated in the same iteration, effectively using the item multiple times.
      </p>

      <h2>Partition Equal Subset Sum</h2>

      <p>
        Can we partition an array into two subsets with equal sum? For [1,5,11,5], we can make
        [1,5,5] and [11], both summing to 11.
      </p>

      <p>
        This is 0/1 knapsack disguised. The target is half the total sum. Can we select numbers
        (using each at most once) that sum to target?
      </p>

      <CodeBlock language="python">
{`def canPartition(nums):
    total = sum(nums)

    if total % 2 != 0:
        return False

    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True

    for num in nums:
        for i in range(target, num - 1, -1):
            dp[i] = dp[i] or dp[i - num]

    return dp[target]`}
      </CodeBlock>

      <p>
        Instead of maximizing value, we're checking if a sum is achievable. The backwards
        traversal prevents using the same number twice.
      </p>

      <h2>Target Sum</h2>

      <p>
        Assign + or - to each number to reach a target sum. For [1,1,1,1,1] and target 3,
        there are 5 ways: -1+1+1+1+1, +1-1+1+1+1, and so on.
      </p>

      <p>
        The math works out: if we have a set of positive numbers summing to P and a set of
        negative numbers summing to N, then P - N = target and P + N = sum(nums). Solving
        these gives P = (target + sum) / 2.
      </p>

      <CodeBlock language="python">
{`def findTargetSumWays(nums, target):
    total = sum(nums)

    if abs(target) > total or (target + total) % 2 != 0:
        return 0

    subset_sum = (target + total) // 2
    dp = [0] * (subset_sum + 1)
    dp[0] = 1

    for num in nums:
        for i in range(subset_sum, num - 1, -1):
            dp[i] += dp[i - num]

    return dp[subset_sum]`}
      </CodeBlock>

      <p>
        We're counting the number of ways to make a subset sum, not just checking if it's possible.
      </p>

      <h2>Unbounded Knapsack</h2>

      <p>
        With unbounded knapsack, we can use each item unlimited times. The only difference in
        code is the traversal direction.
      </p>

      <CodeBlock language="python">
{`def knapsack_unbounded(weights, values, capacity):
    dp = [0] * (capacity + 1)

    for i in range(len(weights)):
        # Traverse forwards
        for w in range(weights[i], capacity + 1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])

    return dp[capacity]`}
      </CodeBlock>

      <p>
        Forward traversal means when we compute <code>dp[w]</code>, we use the updated
        <code>dp[w - weight]</code> from the current iteration. This allows reusing the same item.
      </p>

      <h2>Coin Change</h2>

      <p>
        Given coin denominations, find the minimum number of coins to make an amount. For
        coins [1,2,5] and amount 11, the answer is 3 (5+5+1).
      </p>

      <CodeBlock language="python">
{`def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1`}
      </CodeBlock>

      <p>
        This is unbounded knapsack where we minimize the count instead of maximizing value.
        We can use each coin unlimited times.
      </p>

      <h2>Coin Change II</h2>

      <p>
        Count the number of combinations that make up an amount. For coins [1,2,5] and amount 5,
        there are 4 ways: 5, 2+2+1, 2+1+1+1, 1+1+1+1+1.
      </p>

      <CodeBlock language="python">
{`def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1

    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]

    return dp[amount]`}
      </CodeBlock>

      <p>
        The coin loop must be on the outside to count combinations, not permutations. With
        coins on the outside, [1,2] and [2,1] count as the same combination. If we put the
        amount loop outside, they'd count as different permutations.
      </p>

      <h2>The Key Difference</h2>

      <p>
        The entire difference between 0/1 and unbounded knapsack comes down to loop direction.
        Backwards prevents reusing items. Forwards allows it.
      </p>

      <CodeBlock language="python">
{`# 0/1 Knapsack - backwards
for item in items:
    for w in range(capacity, weight - 1, -1):
        dp[w] = max(dp[w], dp[w - weight] + value)

# Unbounded Knapsack - forwards
for item in items:
    for w in range(weight, capacity + 1):
        dp[w] = max(dp[w], dp[w - weight] + value)`}
      </CodeBlock>

      <p>
        When we go backwards, <code>dp[w - weight]</code> hasn't been updated in this iteration
        yet, so it reflects the state from the previous item. When we go forwards,
        <code>dp[w - weight]</code> might have been updated in this iteration, meaning we can
        use the same item multiple times.
      </p>

      <h2>Ones and Zeroes</h2>

      <p>
        Given strings of 0s and 1s and limits m and n, find the size of the largest subset
        where total 0s ≤ m and total 1s ≤ n. For ["10","0001","111001","1","0"] with m=5 and n=3,
        the answer is 4 (we can take "10","0001","1","0").
      </p>

      <p>
        This is 0/1 knapsack with two constraints instead of one.
      </p>

      <CodeBlock language="python">
{`def findMaxForm(strs, m, n):
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for s in strs:
        zeros = s.count('0')
        ones = s.count('1')

        for i in range(m, zeros - 1, -1):
            for j in range(n, ones - 1, -1):
                dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] + 1)

    return dp[m][n]`}
      </CodeBlock>

      <p>
        The backwards traversal on both dimensions ensures we don't use the same string twice.
      </p>

      <h2>Recognizing Knapsack Problems</h2>

      <p>
        Knapsack problems involve selecting items subject to a constraint (capacity, target sum)
        to optimize something (maximize value, minimize count, count ways). The constraint creates
        a finite search space that dynamic programming can handle.
      </p>

      <p>
        Use 0/1 when each item can be used at most once. Use unbounded when items can be reused.
        The difference shows up in whether you can sort the input or need indices (0/1 can't sort
        if you need indices), and in the loop direction in the DP solution.
      </p>

      <p>
        Problems asking for "subset sum," "partition," or "target with +/-" are usually 0/1.
        Problems about coins, change-making, or unlimited resources are usually unbounded.
      </p>
    </>
  );
};

export default LeetcodeKnapsack;
