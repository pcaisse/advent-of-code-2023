import fs from "fs";
import "core-js/full";

const input = fs.readFileSync(process.stdin.fd, "utf-8");

const rowWidth = input.indexOf("\n");

const below = rowWidth;
const above = rowWidth * -1;
const right = 1;
const left = -1;
const topLeft = above - 1;
const topRight = above + 1;
const bottomLeft = below - 1;
const bottomRight = below + 1;
const adjacentIndexes = [
  below,
  above,
  right,
  left,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
];

const rowsFlat = input
  .split("\n")
  .filter((line) => line)
  .join("");

const gearIndexes = new Set([...rowsFlat.matchAll(/\*/g)].map((m) => m.index));
const numberData = [...rowsFlat.matchAll(/\d+/g)].map((m) => ({
  index: m.index || 0,
  width: m[0].length,
  value: parseInt(m[0], 10),
}));

function adjacentGearIndex(numIndex: number, numWidth: number) {
  const numberIndexes = [...Array(numWidth).keys()].map(
    (_x, i) => i + numIndex
  );
  const indexes = adjacentIndexes.reduce((acc, transformation) => {
    for (const index of numberIndexes) {
      const adjacentIndex = index + transformation;
      if (adjacentIndex >= 0) {
        acc.add(adjacentIndex);
      }
    }
    return acc;
  }, new Set(numberIndexes));
  for (const index of indexes) {
    if (gearIndexes.has(index)) {
      return index;
    }
  }
  return null;
}

const gearAdjacentNumbers = numberData.map(({ index, width, value }) => ({
  value,
  adjacentGearIndex: adjacentGearIndex(index, width),
}));

// @ts-expect-error
const gearAdjacentGroupedNumbers = Object.groupBy(
  gearAdjacentNumbers,
  // @ts-expect-error
  ({ adjacentGearIndex }) => adjacentGearIndex
);

const sum = Object.values(
  gearAdjacentGroupedNumbers as Record<string, { value: number }[]>
)
  .filter((v) => v.length === 2)
  .flatMap((values) => values.map(({ value }) => value).reduce((a, b) => a * b))
  .reduce((a, b) => a + b);

console.log("sum", sum);
