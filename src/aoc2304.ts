import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;
    const cards: number[] = Array(inputs.length).fill(1);
    for (let [i, input] of inputs.entries()) {
        const [left] = input.match(/(?<=: ).*(?= \|)/g) ?? [''];
        const [right] = input.match(/(?<=\| ).*/g) ?? [''];
        const winners = left.match(/\d+/g);
        const mine = right.match(/\d+/g);
        const matches = Math.max(0, winners!.reduce((pv, winner) => pv + (mine?.includes(winner) ? 1 : 0), 0));
        if (part === 1) {
            answer += (matches === 0 ? 0 : 2 ** (matches - 1));
        } else {
            for (let j = i + 1; j < i + matches + 1; j++) cards[j] += cards[i];
            answer += cards[i];
        }
    };
    return answer;
}

run(__filename, solve);