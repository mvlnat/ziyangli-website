import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * LeetCode Sum Problems
 */
const LeetcodeTwoSum: React.FC = () => {
  return (
    <>
      <p>
        Given an array of numbers and a target value, we want to find two numbers that add
        up to that target. For example, in the array [2, 7, 11, 15] with target 9, we can
        see that 2 + 7 = 9, so we'd return the indices [0, 1].
      </p>

      <CodeBlock language="plaintext">
{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]`}
      </CodeBlock>

      <p>
        The straightforward solution is to check every pair of numbers. For each number at
        index i, we check if there's another number at index j that together sum to the target.
      </p>

      <CodeBlock language="python">
{`def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`}
      </CodeBlock>

      <p>
        This works, but for each of the n numbers in the array, we're checking up to n other
        numbers. That's roughly n² operations total.
      </p>

      <p>
        When we look at a number like 2 and want to find its complement (9 - 2 = 7), we're
        searching through the entire array. We can avoid this repeated searching by keeping
        track of numbers we've already seen. A hash map lets us check if a number exists in
        constant time.
      </p>

      <p>
        As we iterate through the array, we check if the complement exists in our hash map.
        If it does, we've found our answer. If not, we add the current number to the map and
        continue.
      </p>

      <CodeBlock language="python">
{`def twoSum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []`}
      </CodeBlock>

      <p>
        This makes a single pass through the array. We use extra space for the hash map, but
        we avoid the redundant searching.
      </p>

      <h2>Three Sum</h2>

      <p>
        Now consider finding three numbers that sum to a target. Given [-1, 0, 1, 2, -1, -4],
        we want all unique triplets that sum to zero. The result would be [[-1, -1, 2], [-1, 0, 1]].
      </p>

      <CodeBlock language="plaintext">
{`Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]`}
      </CodeBlock>

      <p>
        Notice the problem asks for the actual values, not their indices, and we need to avoid
        duplicate triplets. This changes our approach. If we sort the array first, we can use
        two pointers to find pairs efficiently and skip over duplicates naturally.
      </p>

      <p>
        For each number, we look for two other numbers in the remaining array that sum to the
        negative of our chosen number. With the array sorted, we can use pointers at both ends
        of the remaining section.
      </p>

      <CodeBlock language="python">
{`def threeSum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, len(nums) - 1
        target = -nums[i]

        while left < right:
            current_sum = nums[left] + nums[right]

            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])

                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1

                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1

    return result`}
      </CodeBlock>

      <p>
        The two pointers start at opposite ends of the sorted section. If the sum is too small,
        we move the left pointer right to increase it. If it's too large, we move the right
        pointer left to decrease it. This continues until the pointers meet.
      </p>

      <h2>Four Sum</h2>

      <p>
        For four numbers, we add another loop and apply the same two-pointer technique for the
        innermost pair.
      </p>

      <CodeBlock language="python">
{`def fourSum(nums, target):
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        for j in range(i + 1, n - 2):
            if j > i + 1 and nums[j] == nums[j - 1]:
                continue

            left, right = j + 1, n - 1

            while left < right:
                current_sum = nums[i] + nums[j] + nums[left] + nums[right]

                if current_sum == target:
                    result.append([nums[i], nums[j], nums[left], nums[right]])

                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1

                    left += 1
                    right -= 1
                elif current_sum < target:
                    left += 1
                else:
                    right -= 1

    return result`}
      </CodeBlock>

      <p>
        The pattern is clear: we're reducing K-Sum to (K-1)-Sum repeatedly until we reach Two
        Sum, which we solve with two pointers. We can write this recursively:
      </p>

      <CodeBlock language="python">
{`def kSum(nums, target, k):
    nums.sort()

    def kSumHelper(start, target, k):
        result = []

        if k == 2:
            left, right = start, len(nums) - 1
            while left < right:
                current_sum = nums[left] + nums[right]
                if current_sum == target:
                    result.append([nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
                elif current_sum < target:
                    left += 1
                else:
                    right -= 1
            return result

        for i in range(start, len(nums) - k + 1):
            if i > start and nums[i] == nums[i - 1]:
                continue

            sub_results = kSumHelper(i + 1, target - nums[i], k - 1)
            for sub in sub_results:
                result.append([nums[i]] + sub)

        return result

    return kSumHelper(0, target, k)`}
      </CodeBlock>

      <h2>Comparing the Approaches</h2>

      <p>
        For Two Sum with indices, the hash map is optimal because we need O(1) lookups and
        can't sort (sorting would lose the original positions). For Three Sum and beyond,
        when we need values and want to avoid duplicates, sorting enables the two-pointer
        technique and makes duplicate detection straightforward.
      </p>

      <p>
        The hash map uses O(n) space and gives us O(n) time. Sorting takes O(n log n) time,
        then the two-pointer scan takes O(n), giving us O(n²) total for Three Sum. Each
        additional number adds another loop, so Four Sum is O(n³), and K-Sum is O(n^(k-1)).
      </p>

      <p>
        The core idea in all of these is the complement: for any number or set of numbers,
        we're looking for what's needed to reach the target. Whether we store complements in
        a hash map or search for them with pointers depends on the problem's constraints.
      </p>
    </>
  );
};

export default LeetcodeTwoSum;
