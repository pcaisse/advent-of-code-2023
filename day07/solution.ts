import fs from "fs";
import "core-js/full";

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

const hands = [
  "five-of-a-kind",
  "four-of-a-kind",
  "full-house",
  "three-of-a-kind",
  "two-pair",
  "one-pair",
  "high-card",
] as const;

type HandType = (typeof hands)[number];

const compareCards = (a: string, b: string): number =>
  // Higher card is first
  cards.indexOf(a) - cards.indexOf(b);

function assertEquals(a: any, b: any) {
  if (a !== b) {
    throw new Error(`Error: ${a} not equal to ${b}`);
  }
}

assertEquals(
  JSON.stringify(["2", "A", "3"].sort(compareCards)),
  JSON.stringify(["A", "3", "2"])
);

const compareHandTypes = (a: HandType, b: HandType): number =>
  hands.indexOf(a) - hands.indexOf(b);

assertEquals(
  JSON.stringify(
    (["two-pair", "high-card", "five-card"] as HandType[]).sort(
      compareHandTypes
    )
  ),
  JSON.stringify(["five-card", "two-pair", "high-card"])
);

const cardGroups = (s: string) =>
  [...s]
    .sort()
    .join("")
    .match(/(.)\1*/g);

function findHandType(hand: string): HandType {
  const cardGroupsSortedByLength = cardGroups(hand)?.sort(
    (a, b) => b.length - a.length
  );
  if (cardGroupsSortedByLength === undefined) {
    throw new Error("error");
  }
  if (cardGroupsSortedByLength[0].length === 5) {
    return "five-of-a-kind";
  }
  if (cardGroupsSortedByLength[0].length === 4) {
    return "four-of-a-kind";
  }
  if (
    cardGroupsSortedByLength[0].length === 3 &&
    cardGroupsSortedByLength[1].length === 2
  ) {
    return "full-house";
  }
  if (
    cardGroupsSortedByLength[0].length === 3 &&
    cardGroupsSortedByLength[1].length === 1
  ) {
    return "three-of-a-kind";
  }
  if (
    cardGroupsSortedByLength[0].length === 2 &&
    cardGroupsSortedByLength[1].length === 2
  ) {
    return "two-pair";
  }
  if (
    cardGroupsSortedByLength[0].length === 2 &&
    cardGroupsSortedByLength[1].length === 1
  ) {
    return "one-pair";
  }
  return "high-card";
}

assertEquals(
  JSON.stringify(findHandType("JQQQA")),
  JSON.stringify("three-of-a-kind")
);

assertEquals(JSON.stringify(findHandType("233TK")), JSON.stringify("one-pair"));
assertEquals(JSON.stringify(findHandType("KTJJT")), JSON.stringify("two-pair"));

const compareHands = (a: HandBid, b: HandBid): number => {
  const handTypeA = findHandType(a.hand);
  const handTypeB = findHandType(b.hand);

  if (handTypeA !== handTypeB) {
    return compareHandTypes(handTypeB, handTypeA);
  }
  for (let i = 0; i < a.hand.length; i++) {
    if (a.hand[i] === b.hand[i]) {
      continue;
    }
    return compareCards(b.hand[i], a.hand[i]);
  }
  return 0;
};

assertEquals(
  JSON.stringify(
    [
      { hand: "KK677", bid: 0 },
      { hand: "KTJJT", bid: 0 },
    ].sort(compareHands)
  ),
  JSON.stringify([
    { hand: "KTJJT", bid: 0 },
    { hand: "KK677", bid: 0 },
  ])
);

assertEquals(
  JSON.stringify(
    [
      { hand: "32T3K", bid: 0 },
      { hand: "T55J5", bid: 0 },
      { hand: "QQQJA", bid: 0 },
      { hand: "KK677", bid: 0 },
      { hand: "KTJJT", bid: 0 },
    ].sort(compareHands)
  ),
  JSON.stringify([
    { hand: "32T3K", bid: 0 },
    { hand: "KTJJT", bid: 0 },
    { hand: "KK677", bid: 0 },
    { hand: "T55J5", bid: 0 },
    { hand: "QQQJA", bid: 0 },
  ])
);

interface HandBid {
  hand: string;
  bid: number;
}

const input = fs.readFileSync(process.stdin.fd, "utf-8");
const ha = input
  .split("\n")
  .filter((line) => line)
  .map((line: string): HandBid => {
    const [hand, bid] = line.split(" ");
    return { hand, bid: parseInt(bid, 10) };
  })
  .sort(compareHands)
  .map(({ bid }: HandBid, index: number) => bid * (index + 1))
  .reduce((a, b) => a + b);

console.log("total", ha);
