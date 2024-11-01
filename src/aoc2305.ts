import { run } from 'aoc-copilot';

interface Range {
    group: number,
    dest: string,
    src: string,
    destFrom: number,
    destTo: number,
    srcFrom: number,
    srcTo: number,
    offset: number
}

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = Infinity;
    const stacks: Range[] = [];
    const maps: Range[] = [];
    let src = '', dest = '', group = 0;
    const groups: Map<string, string> = new Map();
    inputs.forEach(input => {
        if (input.startsWith('seeds:')) {
            const seeds = input.match(/\d+/g) ?? [];
            for (let i = 0; i < seeds.length; i++) {
                stacks.push({
                    group,
                    dest: 'seed',
                    src: '',
                    destFrom: parseInt(seeds[i]),
                    destTo: parseInt(seeds[i]) + (part === 1 ? 0 : parseInt(seeds[i + 1]) - 1),
                    srcFrom: parseInt(seeds[i]),
                    srcTo: parseInt(seeds[i]) + (part === 1 ? 0 : parseInt(seeds[++i]) - 1),
                    offset: 0
                });
            }
        } else if (/.+-to-.+ map:/.test(input)) {
            ([[input, src, dest]] = [...input.matchAll(/(?<src>.+)-to-(?<dest>.+) map:/g)]);
            ++group;
            groups.set(src, dest);
        } else if (input === '') {
        } else {
            const [destFrom, srcFrom, len] = input.split(' ').map(Number);
            maps.push({ group, dest, src, destFrom, destTo: destFrom + len - 1, srcFrom, srcTo: srcFrom + len - 1, offset: destFrom - srcFrom });
        }
    });
    maps.sort((a, b) => a.group !== b.group ? a.group - b.group : a.srcFrom - b.srcFrom);
    while (stacks.length > 0) {
        const { group, dest, destFrom, destTo } = stacks.pop()!;
        if (dest === 'location') {
            if (destFrom < answer) answer = destFrom;
            continue;
        }
        let coveredTo = destFrom - 1;
        for (let map of maps.filter(map => map.src === dest && map.srcFrom <= destTo && map.srcTo >= destFrom)) {
            if (map.srcFrom - coveredTo > 1) { // Gap before or between
                stacks.push({ group: map.group, src: map.src, dest: map.dest, destFrom: coveredTo + 1, destTo: map.srcFrom - 1, srcFrom: coveredTo + 1, srcTo: map.srcFrom - 1, offset: 0 });
                coveredTo = map.srcFrom - 1;
            }
            stacks.push({ group: map.group, src: map.src, dest: map.dest, destFrom: coveredTo + 1 + map.offset, destTo: Math.min(destTo, map.srcTo) + map.offset, srcFrom: coveredTo + 1, srcTo: Math.min(destTo, map.srcTo), offset: map.offset });
            coveredTo = Math.min(destTo, map.srcTo);
        }
        if (coveredTo < destTo) { // Gap after or no mapping found
            stacks.push({ group: group + 1, src: dest, dest: groups.get(dest)!, destFrom: coveredTo + 1, destTo, srcFrom: coveredTo + 1, srcTo: destTo, offset: 0 });
        }
    }
    return answer;
}

run(__filename, solve);