import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;

    inputs.forEach(input => {
        let [springs, str] = input.split(' ');
        if (part == 2) {
            springs = springs + "?" + springs + "?" + springs + "?" + springs + "?" + springs;
            str = str + "," + str + "," + str + "," + str + "," + str;
        }
        const groups = str.split(',').map(n => ({ size: parseInt(n), placements: [] as { offset: number, count: number }[] }));
        springs = "." + springs + "."; // Add operational springs before and after to make matching easier
        let unplacedCount = groups.reduce((pv, cv) => pv + cv.size, 0);
        let prevGroup = { size: -1, placements: [{ offset: 0, count: 1 }] };
        for (let group of groups) { // All matching is much faster not using RegEx
            for (let { offset, count } of prevGroup.placements) {
                offset += prevGroup.size + 1;
                while (offset < (springs.length - group.size - 1) && springs[offset] !== '#') {
                    const known = springs.substring(offset + group.size + 2).split('').filter(c => c === '#').length;
                    const unknown = springs.substring(offset + group.size + 2).split('').filter(c => c === '?').length;
                    if (known + unknown < unplacedCount - group.size) break; // Placing group here or after wouldn't leave enough spots for the remaining groups
                    if (known <= unplacedCount - group.size) { // Only if it wouldn't leave extra known damaged springs at the end
                        if ('.?'.includes(springs[offset]) && springs.substring(offset + 1, offset + group.size + 1).split('').every(c => c !== '.') && '.?'.includes(springs[offset + group.size + 1])) {
                            const placement = group.placements.find(p => p.offset === offset);
                            if (placement === undefined) group.placements.push({ offset, count });
                            else placement.count += count;
                        }
                    }
                    ++offset;
                }
            }
            if (group.placements.length > 0) unplacedCount -= group.size;
            prevGroup = group;
        }
        for (let placement of groups.at(-1)!.placements) answer += placement.count;
    });
    return answer;
}

run(__filename, solve);