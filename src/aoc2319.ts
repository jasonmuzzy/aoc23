import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;
    const workflows = new Map(inputs.slice(0, inputs.indexOf('')).map(input => [...(input.match(/(.+){(.+)}/) ?? Array(3).fill(''))].slice(1, 3) as [string, string]));
    if (part === 1) {
        function passes(part: number[], id: string) {
            for (let rule of (workflows.get(id) ?? '').split(',').map(rule => rule.split(':'))) {
                if (rule.length === 1) {
                    if ('AR'.includes(rule[0])) return rule[0] === 'A' ? part.reduce((pv, cv) => pv + cv) : 0;
                    else return (passes(part, rule[0]));
                } else {
                    const [attr, comp, rhs] = [...(rule[0].match(/(.+)([><])(\d+)/) ?? Array(4).fill(''))].slice(1, 4).map((v, i) => i === 2 ? parseInt(v) : v) as [string, string, number];
                    const lhs = part['xmas'.indexOf(attr)];
                    if ((comp === '>' && lhs > rhs) || (comp === '<' && lhs < rhs)) {
                        if ('AR'.includes(rule[1])) return rule[1] === 'A' ? part.reduce((pv, cv) => pv + cv) : 0;
                        return passes(part, rule[1]);
                    }
                }
            }
            return 0;
        }
        answer = inputs.slice(inputs.indexOf('') + 1).map(input => [...input.match(/\d+/g) ?? []].map(Number)).reduce((pv, part) => {
            return pv + passes(part, 'in');
        }, 0);
    } else {
        const ranges: [string, number, number, number, number, number, number, number, number][] = [['in', 1, 4000, 1, 4000, 1, 4000, 1, 4000]];
        while (ranges.length > 0) {
            let [id, xfrom, xto, mfrom, mto, afrom, ato, sfrom, sto] = ranges.splice(0, 1)[0]!;
            if ('AR'.includes (id)) {
                if (id === 'A') answer += (xto - xfrom + 1) * (mto - mfrom + 1) * (ato - afrom + 1) * (sto - sfrom + 1);
                continue;
            }
            for (let rule of (workflows.get(id) ?? '').split(',').map(rule => rule.split(':'))) {
                if (rule.length === 1) {
                    ranges.push([rule[0], xfrom, xto, mfrom, mto, afrom, ato, sfrom, sto]);
                } else {
                    const [attr, comp, rhs] = [...(rule[0].match(/(.+)([><])(\d+)/) ?? Array(4).fill(''))].slice(1, 4).map((v, i) => i === 2 ? parseInt(v) : v) as [string, string, number];
                    if (comp === '<') {
                        if ((attr === 'x' ? xfrom : attr === 'm' ? mfrom : attr === 'a' ? afrom : sfrom) < rhs) {
                            ranges.push([
                                rule[1],
                                xfrom, attr === 'x' ? Math.min(xto, rhs - 1) : xto,
                                mfrom, attr === 'm' ? Math.min(mto, rhs - 1) : mto,
                                afrom, attr === 'a' ? Math.min(ato, rhs - 1) : ato,
                                sfrom, attr === 's' ? Math.min(sto, rhs - 1) : sto
                            ]);
                        }
                        if ((attr === 'x' && xto >= rhs)) xfrom = rhs;
                        else if ((attr === 'm' && mto >= rhs)) mfrom = rhs;
                        else if ((attr === 'a' && ato >= rhs)) afrom = rhs;
                        else if ((attr === 's' && sto >= rhs)) sfrom = rhs;
                        else break;
                    } else if (comp === '>') {
                        if ((attr === 'x' ? xto : attr === 'm' ? mto : attr === 'a' ? ato : sto) > rhs) {
                            ranges.push([
                                rule[1],
                                attr === 'x' ? Math.max(xfrom, rhs + 1) : xfrom, xto,
                                attr === 'm' ? Math.max(mfrom, rhs + 1) : mfrom, mto,
                                attr === 'a' ? Math.max(afrom, rhs + 1) : afrom, ato,
                                attr === 's' ? Math.max(sfrom, rhs + 1) : sfrom, sto
                            ]);
                        }
                        if ((attr === 'x' && xfrom <= rhs)) xto = rhs;
                        else if ((attr === 'm' && mfrom <= rhs)) mto = rhs;
                        else if ((attr === 'a' && afrom <= rhs)) ato = rhs;
                        else if ((attr === 's' && sfrom <= rhs)) sto = rhs;
                        else break;
                    }
                }
            }
        }
    }
    return answer;
}

run(__filename, solve);