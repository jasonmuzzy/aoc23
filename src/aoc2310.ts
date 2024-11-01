import { run } from 'aoc-copilot';
import { dijkstra } from 'aoc-copilot/dist/distance';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0, north = 'J|LS', east = 'L-FS', south = '7|FS', west = '7-JS', start = { x: 0, y: 0 };
    const grid = inputs.map(input => input.split(''));
    const graph: Map<string, Map<string, number>> = new Map();
    for (let [y, row] of grid.entries()) {
        for (let [x, pipe] of row.entries()) {
            if (pipe === 'S') start = { x, y };
            const neighbors: Map<string, number> = new Map();
            if (north.includes(pipe) && y > 0 && south.includes(grid[y - 1][x])) neighbors.set(`(${x},${y - 1})`, 1);
            if (east.includes(pipe) && x < grid[y].length - 1 && west.includes(grid[y][x + 1])) neighbors.set(`(${x + 1},${y})`, 1);
            if (south.includes(pipe) && y < grid.length - 1 && north.includes(grid[y + 1][x])) neighbors.set(`(${x},${y + 1})`, 1);
            if (west.includes(pipe) && x > 0 && east.includes(grid[y][x - 1])) neighbors.set(`(${x - 1},${y})`, 1);
            graph.set(`(${x},${y})`, neighbors);
        }
    };
    const { distances } = dijkstra(graph, `(${start.x},${start.y})`);
    if (part === 1) {
        answer = Math.max(...[...distances.values()].filter(d => d !== Infinity));
    } else {
        const n = start.y > 0 && south.includes(grid[start.y - 1][start.x]);
        const e = start.x < grid[start.y].length - 1 && west.includes(grid[start.y][start.x + 1]);
        const s = start.y < grid.length - 1 && north.includes(grid[start.y + 1][start.x]);
        const w = start.x > 0 && east.includes(grid[start.y][start.x - 1]);
        if (n && s) grid[start.y][start.x] = '|';
        else if (n && e) grid[start.y][start.x] = 'L';
        else if (e && w) grid[start.y][start.x] = '-';
        else if (s && e) grid[start.y][start.x] = 'F';
        else if (s && w) grid[start.y][start.x] = '7';
        else if (n && w) grid[start.y][start.x] = 'J';
        for (let [y, row] of grid.entries()) {
            let counter = 0, prev = '';
            for (let [x, pipe] of row.entries()) {
                if (pipe !== '.' && (distances.get(`(${x},${y})`) ?? Infinity) === Infinity) pipe = grid[y][x] = '.';
                if (counter % 2 === 1 && pipe === '.') answer++;
                else if (pipe === '|' || (pipe === 'J' && prev === 'F') || (pipe === '7' && prev === 'L')) counter++;
                else if ('FL'.includes(pipe)) prev = pipe;
            }
        }
    }
    return answer;
}

run(__filename, solve);