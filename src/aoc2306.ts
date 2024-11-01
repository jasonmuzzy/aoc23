import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 1;
    const times = inputs[0].replaceAll(' ', part === 1 ? ' ' : '').match(/\d+/g)?.map(Number) ?? [];
    const distances = inputs[1].replaceAll(' ', part === 1 ? ' ' : '').match(/\d+/g)?.map(Number) ?? [];
    times.forEach((t, i) => {
        const d = distances[i];
        const [low, high] = factor(-1, t, -d); // d = (t - s) * s to quadratic form -s^2 + ts - d = 0
        answer *= Math.ceil(high - 1) - Math.floor(low + 1) + 1;
    });
    return answer;
}

run(__filename, solve);

function factor(a: number, b: number, c: number) {
    const discriminant = b ** 2 - 4 * a * c;
    if (discriminant < 0) return []; // No real factors exist
    const sqrtDiscriminant = Math.sqrt(discriminant);
    return [
        (-b + sqrtDiscriminant) / (2 * a),
        (-b - sqrtDiscriminant) / (2 * a)
    ];
  }