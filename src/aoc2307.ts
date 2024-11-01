import { run } from 'aoc-copilot';

enum HandType {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind
}

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer: number | string = 0;
    function getType(hand: string) {
        const cardsMap = new Map(hand.split('').reduce((pv, cv) => {
            pv.set(cv, (pv.get(cv) || 0) + 1);
            return pv;
        }, new Map() as Map<string, number>));
        const jokers = part === 2 ? cardsMap.get('J') || 0 : 0;
        if (part === 2) cardsMap.delete('J');
        const cards = [...cardsMap].sort((a, b) => b[1] - a[1]);
        let type = HandType.HighCard;
        if (cards.length > 0) {
            if (cards[0][1] === 5) type = HandType.FiveOfAKind;
            else if (cards[0][1] === 4) type = HandType.FourOfAKind;
            else if (cards[0][1] === 3 && cards.length > 1 && cards[1][1] === 2) type = HandType.FullHouse;
            else if (cards[0][1] === 3) type = HandType.ThreeOfAKind;
            else if (cards[0][1] === 2 && cards.length > 1 && cards[1][1] === 2) type = HandType.TwoPair;
            else if (cards[0][1] === 2) type = HandType.OnePair;
        }
        for (let j = 0; j < jokers; j++) {
            if (type === HandType.HighCard) type = HandType.OnePair;
            else if (type === HandType.OnePair) type = HandType.ThreeOfAKind
            else if (type === HandType.TwoPair) type = HandType.FullHouse;
            else if (type === HandType.ThreeOfAKind) type = HandType.FourOfAKind;
            else if (type === HandType.FourOfAKind) type = HandType.FiveOfAKind;
        }
        return type;
    }
    const strengths = part === 1 ? 'AKQJT98765432' : 'AKQT98765432J';
    function tieBreaker(a: string, b: string) {
        for (let [i, c] of a.split('').entries()) {
            if (c !== b.substring(i, i + 1)) return strengths.indexOf(b.substring(i, i + 1)) - strengths.indexOf(c);
        }
        return 0;
    }
    const hands = inputs.map(input => {
        const [hand, bid] = input.split(' ').map((v, i) => i === 0 ? v : parseInt(v)) as [string, number];
        return { hand, bid, type: getType(hand) };
    }).sort((a, b) => a.type !== b.type ? a.type - b.type : tieBreaker(a.hand, b.hand));
    answer = hands.reduce((pv, cv, i) => pv + (i + 1) * cv.bid, 0)
    return answer;
}

run(__filename, solve);