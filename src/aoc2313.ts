import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;

    function reflectionBefore(rows: string[]) {
        let isReflection = false;
        for (let y = 0; y < rows.length - 1; y++) {
            if (rows[y] === rows[y + 1]) {
                isReflection = true;
                for (let yminus = y - 1, yplus = y + 2; yminus !== -1 && yplus < rows.length; yminus--, yplus++) {
                    if (rows[yminus] !== rows[yplus]) {
                        isReflection = false;
                        break;
                    }
                }
                if (isReflection) return y + 1;
            }
        }
        return -1;
    }

    function exactlyOneDifferenceAt(line1: string, line2: string) {
        let offset = -1;
        for (let i = 0; i < line1.length; ++i) {
            if (line1[i] !== line2[i]) {
                if (offset === -1) offset = i;
                else return -1; // More than 1 difference
            }
        }
        return offset;
    }

    function reflectionBeforePart2(rows: string[]) {
        let part1 = reflectionBefore(rows);
        let isReflection = false;
        let smudgeOffset = -1;
        let smudgeCleaned = false;
        for (let y = 0; y < rows.length - 1; y++) {
            if (y === part1 - 1) continue; // Has to be a different point of reflection than part 1
            smudgeOffset = exactlyOneDifferenceAt(rows[y], rows[y + 1]);
            smudgeCleaned = smudgeOffset === -1 ? false : true;
            if (rows[y] === rows[y + 1] || smudgeCleaned) {
                isReflection = true;
                for (let yminus = y - 1, yplus = y + 2; yminus !== -1 && yplus < rows.length; yminus--, yplus++) {
                    if (rows[yminus] !== rows[yplus]) {
                        if (smudgeCleaned) { // Already cleaned one smudge, can't clean another
                            isReflection = false;
                            break;
                        } else { // Haven't cleaned any smudges yet, maybe we can clean this one
                            smudgeOffset = exactlyOneDifferenceAt(rows[yminus], rows[yplus]);
                            if (smudgeOffset !== -1) smudgeCleaned = true;
                            else {
                                isReflection = false;
                                break;
                            }
                        }
                    }
                }
                if (isReflection) return y + 1;
            }
        }
        return -1;
    }

    function sum(rows: string[], part: number) {
        let row = part === 1 ? reflectionBefore(rows) : reflectionBeforePart2(rows);
        if (row !== -1) return 100 * row; // 100 * number of rows above point of reflection
        else {
            const grid = rows.map(row => row.split(''));
            let cols = grid[0].map((_, x) => grid.reduce((col, row) => col + row[x], ''));
            return part === 1 ? reflectionBefore(cols) : reflectionBeforePart2(cols); // Number of columns left of point of reflection
        }
    }

    let mirrors: string[] = [];
    for (let line of inputs) {
        if (line !== '') mirrors.push(line);
        else {
            answer += sum(mirrors, part);
            mirrors = [];
        }
    }
    answer += sum(mirrors, part);

    return answer;
}

run(__filename, solve);