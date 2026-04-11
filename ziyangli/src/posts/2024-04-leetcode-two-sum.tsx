import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * Example Leetcode problem solution post
 */
const LeetcodeTwoSum: React.FC = () => {
  return (
    <>
      <p>
        Two Sum is a classic problem and often the first one people encounter on LeetCode.
        Let's break down the problem and explore different approaches to solve it.
      </p>

      <h2>Problem Statement</h2>
      <p>
        Given an array of integers <code>nums</code> and an integer <code>target</code>,
        return indices of the two numbers such that they add up to <code>target</code>.
      </p>
      <p>
        You may assume that each input would have exactly one solution, and you may not
        use the same element twice.
      </p>

      <h2>Example</h2>
      <CodeBlock language="plaintext">
{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
      </CodeBlock>

      <h2>Approach 1: Brute Force</h2>
      <p>
        The simplest approach is to check every possible pair of numbers.
      </p>

      <CodeBlock language="typescript">
{`function twoSum(nums: number[], target: number): number[] {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`}
      </CodeBlock>

      <p>
        <strong>Time Complexity:</strong> O(n²) - We check every pair<br />
        <strong>Space Complexity:</strong> O(1) - Only using constant extra space
      </p>

      <h2>Approach 2: Hash Map (Optimal)</h2>
      <p>
        We can optimize this to O(n) time by using a hash map to store numbers we've
        already seen and their indices.
      </p>

      <CodeBlock language="typescript">
{`function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }

        map.set(nums[i], i);
    }

    return [];
}`}
      </CodeBlock>

      <p>
        <strong>Time Complexity:</strong> O(n) - Single pass through the array<br />
        <strong>Space Complexity:</strong> O(n) - Hash map to store elements
      </p>

      <h2>Key Insights</h2>
      <ul>
        <li>Trading space for time is often a worthwhile optimization</li>
        <li>Hash maps are excellent for lookup-based problems</li>
        <li>Think about what information you need to "remember" as you iterate</li>
        <li>The complement pattern (target - current) is common in array problems</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        Two Sum demonstrates a fundamental technique in algorithm optimization: using
        additional data structures to reduce time complexity. This pattern appears in
        many other problems, making it an essential concept to master.
      </p>
    </>
  );
};

export default LeetcodeTwoSum;
