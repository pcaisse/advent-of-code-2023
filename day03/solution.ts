import fs from "fs";
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

const specialCharIndexes = new Set(
  [...rowsFlat.matchAll(/[^\d\.]/g)].map((m) => m.index)
);
const numberData = [...rowsFlat.matchAll(/\d+/g)].map((m) => ({
  index: m.index || 0,
  width: m[0].length,
  value: parseInt(m[0], 10),
}));

function isAdjacentToSymbol(numIndex: number, numWidth: number) {
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
  return [...indexes].some((i) => specialCharIndexes.has(i));
}

const symbolAdjacentNumbers = numberData
  .filter(({ index, width }) => isAdjacentToSymbol(index, width))
  .map(({ value }) => value);

const sum = symbolAdjacentNumbers.reduce((a, b) => a + b, 0);

console.log("sum", sum);
