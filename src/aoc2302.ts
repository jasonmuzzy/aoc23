import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;
    inputs.forEach(input => {
        if (/Game \d/.test(input)) {
            const game = parseInt(input.match(/(?<=Game )\d+/g)![0]);
            const draws = input.match(/(?<=[:;] ).*?(?=(;|$))/g)?.map(draw => {
                const [r] = draw.match(/\d+(?= red)/g) ?? ['0'];
                const [g] = draw.match(/\d+(?= green)/g) ?? ['0'];
                const [b] = draw.match(/\d+(?= blue)/g) ?? ['0'];
                return { r: parseInt(r), g: parseInt(g), b: parseInt(b) };
            }) ?? [];
            if (part === 1 && draws.every(draw => draw.r <= 12 && draw.g <= 13 && draw.b <= 14)) {
                answer += game;
            } else if (part === 2) {
                answer += draws.reduce((pv, cv) => {
                    return [Math.max(pv[0], cv.r), Math.max(pv[1], cv.g), Math.max(pv[2], cv.b)];
                }, [0, 0, 0]).reduce((pv, cv) => pv * cv);
            }
        }
    });
    return answer;
}

run(__filename, solve);