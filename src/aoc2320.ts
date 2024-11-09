import { run } from 'aoc-copilot';
import { lcm } from 'aoc-copilot/dist/utils';

const LOW = false, HIGH = true;

interface Module {
    id: string,
    type: string,
    targets: string[]
}

interface FlipFlop extends Module {
    state: boolean
}

interface Conjunction extends Module {
    states: Map<string, boolean>
}

function isFlipFlop(module: Module | undefined): module is FlipFlop {
    return module !== undefined && module.type === '%';
}

function isConjunction(module: Module | undefined): module is Conjunction {
    return module !== undefined && module.type === '&';
}

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = 0;
    const modules = new Map(inputs.map(input => {
        const [type, id, targets] = [...input.match(/([%&]?)([a-z]+) -> (.*)/) ?? []].slice(1, 5).map((v, i) => i === 2 ? v.split(', ') : v) as [string, string, string[]];
        return [id, type === '%' ? { id, type, targets, state: LOW } : type === '&' ? { id, type, targets, states: new Map() } : { id, type, targets }] as [string, Module];
    }));
    for (let [from, module] of [...modules.entries()]) { // Conjunction senders
        for (let to of module.targets) {
            const target = modules.get(to);
            if (isConjunction(target)) target.states.set(from, LOW);
        }
    }
    function send(pulse: boolean, from: string, to: string, stack: [boolean, string, string][], penultimates?: Map<string, number>, presses = 0) {
        const receiver = modules.get(to);
        let newPulse = pulse;
        if (pulse === LOW && isFlipFlop(receiver)) {
            newPulse = receiver.state = !receiver.state;
        } else if (isConjunction(receiver)) {
            receiver.states.set(from, pulse);
            if (pulse === HIGH && [...receiver.states.values()].every(state => state === HIGH)) {
                newPulse = LOW;
            } else {
                if (penultimates !== undefined && penultimates.has(to)) {
                    penultimates.set(to, presses);
                }
                newPulse = HIGH;
            }
        }
        if (receiver !== undefined && (pulse === LOW || !isFlipFlop(receiver))) {
            for (let target of receiver.targets) stack.push([newPulse, to, target]);
        }
    }
    if (part === 1) {
        let lows = 0, highs = 0;
        for (let presses = 1; presses <= 1000; presses++) {
            const stack = [[LOW, 'button', 'broadcaster'] as [boolean, string, string]];
            while (stack.length > 0) {
                const [pulse, from, to] = stack.splice(0, 1)[0]!;
                if (pulse === LOW) lows++; else highs++;
                send(pulse, from, to, stack);
            }
        }
        answer = lows * highs;
    } else {
		// Observation: the module configuration is as follows:
		// 1) The broadcaster has 4 different target flip-flop modules
		// 2) There are between 1 and 12 flip-flop modules between the broadcaster and 4 subsequent conjunction modules, depending on the path taken
		// 3) Those 4 conjunction modules are followed by exactly 2 conjunction modules:
		//    - Itself (each one loops back on itself after traversing 1 to 12 flip-flop modules)
		//    - 1 additional conjunction module each, for a total of 4 additional conjunction modules
		// 5) Those 4 additional conjunction modules all connect to 1 final, common conjunction module
		// 6) That 1 final conjunction module is the only input to final machine rx
		// 
		// So, all we have to do is observe how many button presses it takes for each of the 4 additional
		// conjunction modules to send a low signal, then calculate the LCM for those 4 values.
        const ultimate = ([...modules.entries()].find(([id, m]) => m.targets.indexOf('rx') > -1) ?? [''])[0];
        const penultimates = new Map([...modules.values()].filter(m => m.targets.some(t => t === ultimate)).map(m => [m.id, 0]));
        for (let presses = 1; answer === 0; presses++) {
            const stack = [[LOW, 'button', 'broadcaster'] as [boolean, string, string]];
            while (stack.length > 0) {
                const [pulse, from, to] = stack.splice(0, 1)[0]!;
                send(pulse, from, to, stack, penultimates, presses);
                if ([...penultimates.values()].every(v => v > 0)) {
                    answer = lcm([...penultimates.values()]);
                    break;
                }
            }
        }
    }
    return answer;
}

run(__filename, solve);