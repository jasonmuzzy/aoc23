import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;
    inputs.forEach(input => {
        if (part === 2) {
            ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
                .map((n, i) => [n, n.slice(0, 1) + i + n.slice(2)])
                .forEach(([a, b]) => input = input.replaceAll(a, b));
        }
        const digits = input.match(/\d+/g)?.join('') ?? '';
        answer += parseInt(digits?.substring(0, 1) + digits?.substring(digits.length - 1, digits.length));
    });
    return answer;
}

run(__filename, solve);