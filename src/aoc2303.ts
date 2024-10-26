import { run } from 'aoc-copilot';
import { product, range } from 'aoc-copilot/dist/utils';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;
    for (let [y, input] of inputs.entries()) {
        if (part === 1) {
            [...input.matchAll(/\d+/g)].forEach(match => {
                if (product(range(match[0].length + 2).map(i => i + match.index - 1), [y - 1, y, y + 1]).some(([x1, y1]) => {
                    const c = x1 >= 0 && x1 < input.length && y1 >= 0 && y1 < inputs.length ? inputs[y1].substring(x1, x1 + 1) : '';
                    return c !== '' && !/[0-9\.]/.test(c);
                })) {
                    answer += parseInt(match[0]);
                }
            });
        } else {
            [...input.matchAll(/\*/g)].forEach(match => {
                const prev = y >= 0 ? inputs[y - 1] : '';
                const next = y < inputs.length ? inputs[y + 1] : '';
                const touching = (line: string) => {
                    const ns: number[] = [];
                    [...line.matchAll(/\d+/g)].forEach(m2 => {
                        const [n] = m2;
                        if (m2.index <= match.index + 1 &&
                            m2.index + n.length - 1 >= match.index - 1
                        ) {
                            ns.push(parseInt(n));
                        }
                    });
                    return ns;
                }
                const allNs = touching(prev).concat(touching(input)).concat(touching(next));
                if (allNs.length === 2) answer += allNs[0] * allNs[1];
            });

        }

    }
    return answer;
}

run(__filename, solve);