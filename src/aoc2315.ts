import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer: number | string = 0;
    const hash = (step: string) => { return step.split('').reduce((pv, cv) => (pv + cv.charCodeAt(0)) * 17 % 256, 0); }
    if (part === 1) answer = inputs[0].split(',').reduce((ans, step) => ans + hash(step), 0);
    else {
        const boxes = [...Array(256).keys()].map(() => [] as [string, number][]); // 256 boxes, each with multiple lens slots
        for (let step of inputs[0].split(',')) { // Steps specify a label, an operation, and for operation "=", a focal length
            const { groups: { label = '', operation = '', focalLen = '' } = {} } = step.match(/(?<label>.+)(?<operation>[-=])(?<focalLen>\d+)?/) ?? {};
            const lenses = boxes[hash(label)]; // Labels hash to box ID
            if (operation === '-') { // Remove the lens with the label (if exists)
                for (let i = lenses.length - 1; i >= 0; i--) if (lenses[i][0] === label) lenses.splice(i, 1); // Safe remove from end to avoid replacing lenses array and breaking reference in boxes array
            } else { // Replace or add a new lens
                const i = lenses.findIndex(([l]) => l === label); // If a lens with the same label already exists
                if (i !== -1) lenses[i][1] = parseInt(focalLen); // Replace it with a lens of the new focal length
                else lenses.push([label, parseInt(focalLen)]); // Otherwise add a lens with the focal length
            }
        }
        answer = boxes.reduce((ans, box, boxId) => ans + box.reduce((pv, [_, focusLen], lensSlot) => pv + (boxId + 1) * (lensSlot + 1) * focusLen, 0), 0); // Focusing power
    }
    return answer;
}

run(__filename, solve);