import { run } from 'aoc-copilot';

function tilt(grid: string[][], direction: 'n' | 'w' | 's' | 'e') {
    for (let x = 0, y = 0; 'ns'.includes(direction) ? x < grid[0].length : y < grid.length; 'ns'.includes(direction) && ++x || ++y) {
        const yincrement = direction === 'n' ? 1 : direction === 's' ? -1 : 0;
        const xincrement = direction === 'w' ? 1 : direction === 'e' ? -1 : 0;
        for (y = direction === 'n' ? 0 : direction === 's' ? grid.length - 1 : y, x = direction === 'w' ? 0 : direction === 'e' ? grid[y].length - 1 : x;
            direction === 'n' ? y < grid.length - 1 : direction === 's' ? y > 0 : direction === 'w' ? x < grid[y].length - 1 : x > 0; x += xincrement, y += yincrement) {
            if (grid[y][x] === '.') {
                for (let x2 = x + ('ew'.includes(direction) ? xincrement : 0), y2 = y + ('ns'.includes(direction) ? yincrement : 0);
                    direction === 'n' ? y2 < grid.length : direction === 's' ? y2 >= 0 : direction === 'w' ? x2 < grid[y].length : x2 >= 0; x2 += xincrement, y2 += yincrement) {
                    if (grid[y2][x2] === 'O') {
                        grid[y][x] = 'O';
                        grid[y2][x2] = '.';
                        break;
                    } else if (grid[y2][x2] === '#') break;
                }
            }
        }
    }
}

function rotate(grid: string[][]) {
    tilt(grid, 'n');
    tilt(grid, 'w');
    tilt(grid, 's');
    tilt(grid, 'e');
}

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;
    const grid = inputs.map(row => row.split(''));
    if (part === 1) tilt(grid, 'n');
    else {
        const cache: Map<string, number> = new Map();
        let signature = grid.flat().join(''), rotations = 0;
        while (!cache.has(signature)) {
            cache.set(signature, rotations++);
            rotate(grid);
            signature = grid.flat().join('');
        }
        const prev = cache.get(signature) ?? 0;
        const remaining = (1000000000 - prev) % (rotations - prev);
        for (let i = 0; i < remaining; i++) {
            rotate(grid);
        }
    }
    answer = grid.reduce((pv, cv, y) => pv + cv.filter(c => c === 'O').length * (grid.length - y), 0);
    return answer;
}

run(__filename, solve);