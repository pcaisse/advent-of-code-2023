import fs from "fs";
import "core-js/full";

const input = fs.readFileSync(process.stdin.fd, "utf-8");
const scores = input
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
    return yourWinningNums.size === 0
      ? 0
      : yourWinningNums.size === 1
      ? 1
      : 2 ** (yourWinningNums.size - 1);
  });

const sum = scores.reduce((a, b) => a + b);

console.log("sum", sum);
