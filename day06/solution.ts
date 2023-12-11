import fs from "fs";

const input = fs.readFileSync(process.stdin.fd, "utf-8");
const [times, distances] = input
  .split("\n")
  .filter((line) => line)
  .map((line) => line.match(/\d+/g)?.map((x) => parseInt(x, 10)));

interface Entry {
  time: number;
  distance: number;
}

const entries: Entry[] = (times as number[]).map((time, index) => ({
  time,
  distance: (distances as number[])[index],
}));

console.log("timeDistances", entries);

function waysToWin(entry: Entry): number {
  let total = 0;
  for (let holdTime = 0; holdTime <= entry.time; holdTime++) {
    const goTime = entry.time - holdTime;
    const result = goTime * holdTime;
    if (result > entry.distance) {
      total++;
    }
  }
  return total;
}

console.log(
  "waysToWin",
  entries
    .map((entry) => waysToWin(entry))
    .reduce((x: number, y: number) => x * y, 1)
);
