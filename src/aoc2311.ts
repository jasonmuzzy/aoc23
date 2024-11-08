import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;
    const times = (part === 1 ? 2 : test ? parseInt(additionalInfo?.times ?? '0') : 1000000) - 1;
    const galaxies = inputs.reduce((pv, cv, y) => {
        cv.split('').forEach((v, x) => {
            if (v === '#') pv.push({ x, y });
        });
        return pv;
    }, [] as { x: number, y: number }[]);
    const emptyRows = inputs.reduce((pv, cv, y) => cv.indexOf('#') === -1 ? pv.concat([y]) : pv, [] as number[]);
    const emptyCols = [...Array(inputs[0].length).keys()].reduce((pv, cv, x) => inputs.every(row => row.substring(x, x + 1) === '.') ? pv.concat([x]) : pv, [] as number[]);
    for (let [i, galaxy1] of galaxies.entries()) {
        for (let [j, galaxy2] of galaxies.slice(i + 1).entries()) {
            const emptyRowsBetween = emptyRows.filter(y => y > Math.min(galaxy1.y, galaxy2.y) && y < Math.max(galaxy1.y, galaxy2.y)).length;
            const emptyColsBetween = emptyCols.filter(x => x > Math.min(galaxy1.x, galaxy2.x) && x < Math.max(galaxy1.x, galaxy2.x)).length;
            answer += Math.max(galaxy1.y, galaxy2.y) - Math.min(galaxy1.y, galaxy2.y) + emptyRowsBetween * times;
            answer += Math.max(galaxy1.x, galaxy2.x) - Math.min(galaxy1.x, galaxy2.x) + emptyColsBetween * times;
        }
    }
    return answer;
}

run(__filename, solve);