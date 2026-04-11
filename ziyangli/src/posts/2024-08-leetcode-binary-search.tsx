import React from 'react';
import CodeBlock from '../components/blog/CodeBlock';

/**
 * Binary Search Patterns
 */
const LeetcodeBinarySearch: React.FC = () => {
  return (
    <>
      <p>
        Binary search works by repeatedly dividing a search space in half. At each step, we
        examine the middle element and decide which half to continue searching. The algorithm
        runs in O(log n) time because we eliminate half the remaining elements with each comparison.
      </p>

      <p>
        The implementation details matter. When to use <code>while (left &lt;= right)</code>
        versus <code>while (left &lt; right)</code>, and whether to return <code>left</code>,
        <code>right</code>, or <code>mid</code> depends on what we're searching for.
      </p>

      <h2>The Basic Rule</h2>

      <p>
        Use <code>left &lt;= right</code> when you can definitively eliminate the middle element.
        Use <code>left &lt; right</code> when the middle element might be the answer you're looking for.
      </p>

      <CodeBlock language="python">
{`# Can eliminate mid - use <=
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        left = mid + 1    # Eliminate mid and everything left
    else:
        right = mid - 1   # Eliminate mid and everything right

# Might need mid - use <
while left < right:
    mid = (left + right) // 2
    if condition(mid):
        right = mid       # Keep mid in range
    else:
        left = mid + 1    # Eliminate mid`}
      </CodeBlock>

      <h2>Standard Binary Search</h2>

      <p>
        Given a sorted array and a target value, find the index of the target or return -1.
      </p>

      <CodeBlock language="plaintext">
{`Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4`}
      </CodeBlock>

      <CodeBlock language="python">
{`def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`}
      </CodeBlock>

      <p>
        We use <code>left &lt;= right</code> because when we check <code>nums[mid]</code>, we
        know immediately whether to eliminate it. After the loop terminates, if we haven't found
        the target, we return -1.
      </p>

      <h2>Search in Rotated Sorted Array</h2>

      <p>
        A sorted array is rotated at an unknown pivot. For example, [4,5,6,7,0,1,2] is [0,1,2,4,5,6,7]
        rotated 4 times. We need to find a target value in O(log n) time.
      </p>

      <CodeBlock language="plaintext">
{`Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4`}
      </CodeBlock>

      <p>
        Even though the array is rotated, at least one half is always sorted. We can determine
        which half is sorted by comparing the endpoints with the middle.
      </p>

      <CodeBlock language="python">
{`def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # Determine which half is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1`}
      </CodeBlock>

      <p>
        If <code>nums[left] &lt;= nums[mid]</code>, the range [left, mid] must be sorted.
        Otherwise, [mid, right] is sorted. Once we know which half is sorted, we check if
        the target falls within that sorted range. If it does, we search there. If not,
        we search the other half.
      </p>

      <h2>Find Minimum in Rotated Array</h2>

      <p>
        Find the minimum element in a rotated sorted array. For [3,4,5,1,2], the minimum is 1.
      </p>

      <CodeBlock language="python">
{`def findMin(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = (left + right) // 2

        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid

    return nums[left]`}
      </CodeBlock>

      <p>
        We use <code>left &lt; right</code> here because the minimum could be at <code>mid</code>.
        If <code>nums[mid] &gt; nums[right]</code>, the rotation point (and thus the minimum) must
        be to the right of mid. Otherwise, mid itself could be the minimum, so we set
        <code>right = mid</code> to keep it in the search range.
      </p>

      <h2>First Bad Version</h2>

      <p>
        Given n versions [1, 2, ..., n], find the first version that is bad. We have an API
        <code>isBadVersion(version)</code> that returns true if a version is bad.
      </p>

      <CodeBlock language="plaintext">
{`Input: n = 5, bad = 4
Versions: [good, good, good, bad, bad]
Output: 4`}
      </CodeBlock>

      <CodeBlock language="python">
{`def firstBadVersion(n):
    left, right = 1, n

    while left < right:
        mid = (left + right) // 2

        if isBadVersion(mid):
            right = mid
        else:
            left = mid + 1

    return left`}
      </CodeBlock>

      <p>
        When we find a bad version at <code>mid</code>, it could be the first bad version,
        so we keep it in range with <code>right = mid</code>. We use <code>left &lt; right</code>
        because mid might be our answer.
      </p>

      <h2>Bisect Left and Bisect Right</h2>

      <p>
        When inserting into a sorted array with duplicates, the insertion position depends on
        whether we want to insert before or after existing equal elements.
      </p>

      <p>
        For bisect left, we want to insert before any equal elements. For bisect right, we
        want to insert after them. The comparison direction determines which we get.
      </p>

      <CodeBlock language="python">
{`def bisect_left(arr, x):
    """Insert position to the left of equal elements"""
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2

        if arr[mid] < x:
            left = mid + 1
        else:
            right = mid

    return left


def bisect_right(arr, x):
    """Insert position to the right of equal elements"""
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2

        if x < arr[mid]:
            right = mid
        else:
            left = mid + 1

    return left`}
      </CodeBlock>

      <p>
        For bisect_left, we use <code>arr[mid] &lt; x</code>. For bisect_right, we use
        <code>x &lt; arr[mid]</code>. The difference is which side of the comparison x appears on.
      </p>

      <CodeBlock language="plaintext">
{`Array: [1, 2, 2, 2, 3, 5]
        0  1  2  3  4  5

bisect_left(arr, 2)   = 1  (before first 2)
bisect_right(arr, 2)  = 4  (after last 2)
bisect_left(arr, 4)   = 5  (where 4 would go)
bisect_right(arr, 4)  = 5  (same when value doesn't exist)`}
      </CodeBlock>

      <h2>Search Insert Position</h2>

      <p>
        Given a sorted array and target, return the index if found, otherwise return where
        it should be inserted.
      </p>

      <CodeBlock language="python">
{`def searchInsert(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return left`}
      </CodeBlock>

      <p>
        After the loop terminates without finding the target, <code>left</code> points to
        the insertion position. This happens because <code>left</code> ends up one position
        to the right of where <code>right</code> stops.
      </p>

      <h2>Find Peak Element</h2>

      <p>
        Find any peak element in an array where a peak is greater than its neighbors. The
        array may contain multiple peaks.
      </p>

      <CodeBlock language="python">
{`def findPeakElement(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = (left + right) // 2

        if nums[mid] < nums[mid + 1]:
            left = mid + 1
        else:
            right = mid

    return left`}
      </CodeBlock>

      <p>
        If <code>nums[mid] &lt; nums[mid + 1]</code>, we're on an upward slope, so a peak
        must exist to the right. Otherwise, a peak exists to the left or at mid itself.
      </p>

      <h2>Koko Eating Bananas</h2>

      <p>
        Koko has n piles of bananas. Guards return in h hours. Find the minimum eating speed
        k (bananas per hour) such that Koko can finish all piles in h hours.
      </p>

      <CodeBlock language="plaintext">
{`Input: piles = [3,6,7,11], h = 8
Output: 4`}
      </CodeBlock>

      <CodeBlock language="python">
{`def minEatingSpeed(piles, h):
    def canFinish(speed):
        hours = 0
        for pile in piles:
            hours += (pile + speed - 1) // speed
        return hours <= h

    left, right = 1, max(piles)

    while left < right:
        mid = (left + right) // 2

        if canFinish(mid):
            right = mid
        else:
            left = mid + 1

    return left`}
      </CodeBlock>

      <p>
        We're searching for the minimum valid speed, not searching in the input array. This
        is binary search on the answer space. The valid speeds form a contiguous range, and
        we want the leftmost (minimum) one.
      </p>

      <h2>Return Values</h2>

      <p>
        What to return depends on the problem. During the loop, return <code>mid</code> when
        you've found exactly what you're looking for. After the loop, return <code>left</code>
        or <code>right</code> depending on what they represent.
      </p>

      <p>
        After <code>while (left &lt;= right)</code> terminates without finding the target,
        <code>left</code> points to the insertion position (where the target would go).
        <code>right</code> points one position to the left of that.
      </p>

      <p>
        After <code>while (left &lt; right)</code> terminates, <code>left</code> and
        <code>right</code> are equal and point to the boundary you were searching for.
      </p>

      <CodeBlock language="plaintext">
{`Return mid:  Found exact target during loop
Return left: Insertion position, or boundary after left < right
Return right: Same as left after left < right (they're equal)
Return -1:   Target not found`}
      </CodeBlock>

      <h2>Avoiding Infinite Loops</h2>

      <p>
        With <code>while (left &lt; right)</code> and <code>left = mid</code>, use
        <code>mid = (left + right + 1) // 2</code> to round up. This prevents infinite loops
        when the range narrows to two elements.
      </p>

      <p>
        With <code>while (left &lt; right)</code> and <code>right = mid</code>, use
        <code>mid = (left + right) // 2</code> to round down.
      </p>

      <p>
        The rule: if you're setting a boundary to <code>mid</code>, make sure the rounding
        doesn't cause <code>mid</code> to equal that boundary when there are only two elements left.
      </p>
    </>
  );
};

export default LeetcodeBinarySearch;
