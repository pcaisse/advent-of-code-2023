import fs from "fs";

const input = fs.readFileSync(process.stdin.fd, "utf-8");
const [times, distances] = input
  .split("\n")
  .filter((line) => line)
  .map((line) => line.match(/\d+/g)?.join(""));

interface Entry {
  time: number;
  distance: number;
}

const entry = {
  time: parseInt(times as string, 10),
  distance: parseInt(distances as string, 10),
};

console.log("entry", entry);

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

console.log("waysToWin", waysToWin(entry));
