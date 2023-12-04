import fs from "fs";
import "core-js/full";

const input = fs.readFileSync(process.stdin.fd, "utf-8");
const winsPerCard = input
  .split("\n")
  .filter((line) => line)
  .map((line) => {
    const [winningNums, nums] = line
      .split(/[:|]/)
      .slice(1)
      // @ts-expect-error
      .map((i) => new Set(i.match(/\d+/g).map((x) => parseInt(x, 10))));
    // @ts-expect-error
    const yourWinningNums: Set<number> = winningNums.intersection(nums);
    return yourWinningNums.size;
  });

function totalWins(winsPerCard: number[], index: number): number {
  const wins = winsPerCard[index];
  const nextWinningCardIndexes = [...new Array(wins)].map(
    (_x, i) => i + 1 + index
  );
  const nextWinningCardsSum = nextWinningCardIndexes
    .map((i) => totalWins(winsPerCard, i))
    .reduce((a, b) => a + b, 0);
  return 1 + nextWinningCardsSum;
}

const total = [...new Array(winsPerCard.length)]
  .map((_x, i) => totalWins(winsPerCard, i))
  .reduce((a, b) => a + b);

console.log("totalWins", total);
