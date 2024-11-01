import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer: number | string = 0;
    function next(nums: number[]): number {
        return (nums.at(-1) ?? 0) + (nums.every(n => n === 0) ? 0 : next(nums.slice(1).map((n, i) => n - nums[i])));
    }
    answer = inputs.reduce((pv, cv) => {
        const nums = cv.split(' ').map(Number);
        return pv + next(part === 1 ? nums : nums.toReversed());
    }, 0);
    return answer;
}

run(__filename, solve);