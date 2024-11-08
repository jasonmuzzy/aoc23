import { run } from 'aoc-copilot';

function energize(grid: string[][], beams: [number, number, string][]) {
    const energized = grid.map(row => row.map(() => 0));
    const visiteds: Set<string> = new Set();
    while (beams.length > 0) {
        const [x, y, d] = beams.pop()!;
        if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length) continue; // Off grid
        if (visiteds.has(`${x},${y},${d}`)) continue; // Beam of same direction was already here
        visiteds.add(`${x},${y},${d}`);
        energized[y][x] = 1;
        const cell = grid[y][x];
        if (('.|'.includes(cell) && d === 'n') || (cell === '/' && d === 'e') || (cell === '\\' && d === 'w') || (cell === '|' && 'ew'.includes(d))) beams.push([x, y - 1, 'n']);
        if (('.|'.includes(cell) && d === 's') || (cell === '/' && d === 'w') || (cell === '\\' && d === 'e') || (cell === '|' && 'ew'.includes(d))) beams.push([x, y + 1, 's']);
        if (('.-'.includes(cell) && d === 'e') || (cell === '/' && d === 'n') || (cell === '\\' && d === 's') || (cell === '-' && 'ns'.includes(d))) beams.push([x + 1, y, 'e']);
        if (('.-'.includes(cell) && d === 'w') || (cell === '/' && d === 's') || (cell === '\\' && d === 'n') || (cell === '-' && 'ns'.includes(d))) beams.push([x - 1, y, 'w']);
    }
    return energized.flat().reduce((pv, cv) => pv + cv, 0);
}

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer: number | string = 0;
    const grid = inputs.map(row => row.split(''));
    answer = (part === 1)
        ? energize(grid, [[0, 0, 'e']])
        : Math.max(
            [...Array(grid[0].length).keys()].reduce((pv, x) => Math.max(pv, energize(grid, [[x, 0, 's']])), 0),
            [...Array(grid[grid.length - 1].length).keys()].reduce((pv, x) => Math.max(pv, energize(grid, [[x, grid.length - 1, 'n']])), 0),
            [...Array(grid.length).keys()].reduce((pv, y) => Math.max(pv, energize(grid, [[0, y, 'e']])), 0),
            [...Array(grid.length).keys()].reduce((pv, y) => Math.max(pv, energize(grid, [[grid[y].length - 1, y, 'w']])), 0)
        );
    return answer;
}

run(__filename, solve);