import { run } from 'aoc-copilot';
import { lcm } from 'aoc-copilot/dist/utils';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer: number | string = 0;
    const lr = inputs[0];
    const graph = new Map(inputs.slice(2).map(input => {
        const [node, left, right] = input.match(/[0-9A-Z]+/g) ?? ['', '', ''];
        return [node, [left, right]];
    }));
    function getSteps(node: string) {
        let offset = 0, direction = '', steps = 0;
        while (!/..Z/.test(node)) {
            direction = lr.substring(offset, offset + 1);
            offset = (offset + 1) % lr.length;
            node = (graph.get(node) || '')[direction === 'L' ? 0 : 1];
            steps++;
        }
        return steps;
    }
    // For part 2, every ..A node ends at a unique ..Z node, the ..Z node loops back to itself, and the number of steps from ..A to ..Z
    // are the same as from ..Z back to ..Z again, so we can just calculate the LCM of all the steps from ..A nodes to ..Z nodes.
    answer = lcm([...graph.keys()].filter(k => (part === 1 ? /AAA/ : /..A/).test(k)).map(k => getSteps(k)));
    return answer;
}

run(__filename, solve);