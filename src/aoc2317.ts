import { run } from 'aoc-copilot';
import { dijkstra } from 'aoc-copilot/dist/distance';
import { product, xyArray } from 'aoc-copilot/dist/utils';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    const grid = inputs.map(row => row.split('').map(Number));
    const graph: Map<string, Map<string, number>> = new Map();
    for (let [x, y] of xyArray(grid)) {
        const hneighbors: Map<string, number> = new Map();
        const vneighbors: Map<string, number> = new Map();
        let l = 0, r = 0, u = 0, d = 0;
        for (let z = 1; z <= (part === 1 ? 3 : 10); z++) {
            if (x - z >= 0) {
                l += grid[y][x - z];
                if (part === 1 || z > 3) hneighbors.set(`h${x - z},${y}`, l);
            }
            if (x + z < grid[y].length) {
                r += grid[y][x + z];
                if (part === 1 || z > 3) hneighbors.set(`h${x + z},${y}`, r);
            }
            if (y - z >= 0) {
                u += grid[y - z][x];
                if (part === 1 || z > 3) vneighbors.set(`v${x},${y - z}`, u);
            }
            if (y + z < grid.length) {
                d += grid[y + z][x];
                if (part === 1 || z > 3) vneighbors.set(`v${x},${y + z}`, d);
            }
        }
        graph.set(`v${x},${y}`, hneighbors);
        graph.set(`h${x},${y}`, vneighbors);
    }
    return product(['h0,0', 'v0,0'], [`h${grid[0].length - 1},${grid.length - 1}`, `v${grid[0].length - 1},${grid.length - 1}`]).reduce((answer, [start, end]) => {
        return Math.min(answer, dijkstra(graph, start, end)?.distance ?? Infinity);
    }, Infinity);
}

run(__filename, solve);