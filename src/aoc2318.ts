import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer: number | string = 0;
    const plans = inputs.map(row => row.match(/(.) (\d+) \(#(.+)\)/)?.slice(1, 4) as string[]);
    const vertices: [number, number][] = [[0, 0]];
    let x = 0, y = 0;
    for (let [a, b, c] of plans) {
        const dir = part === 1 ? a : 'RDLU'[parseInt(c.substring(5, 6))];
        const dist = part === 1 ? parseInt(b) : Number('0x' + c.substring(0, 5));
        answer += dist;
        x += dir === 'R' ? dist : dir === 'L' ? -dist : 0;
        y += dir === 'D' ? dist : dir === 'U' ? -dist : 0;
        vertices.push([x, y]);
    }
    // Shoelace formula
    for (let [i, [x, y]] of vertices.entries()) {
        const [nextx, nexty] = vertices[i === vertices.length - 1 ? 0 : i + 1];
        answer += x * nexty - y * nextx;
    }
    return answer / 2 + 1;
}

run(__filename, solve);