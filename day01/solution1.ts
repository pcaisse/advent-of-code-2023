import fs from "fs";
const input = fs.readFileSync(process.stdin.fd, "utf-8");

const digitMap = {
  one: 1,
  "1": 1,
  two: 2,
  "2": 2,
  three: 3,
  "3": 3,
  four: 4,
  "4": 4,
  five: 5,
  "5": 5,
  six: 6,
  "6": 6,
  seven: 7,
  "7": 7,
  eight: 8,
  "8": 8,
  nine: 9,
  "9": 9,
};

function findFirstAndLastDigits(line: string): [number, number] {
  let first: number | undefined;
  let last: number | undefined;
  for (let i = 0; i < line.length; i++) {
    for (const digitStr in digitMap) {
      const firstString = line.substring(i);
      if (first === undefined && firstString.startsWith(digitStr)) {
        first = digitMap[digitStr as keyof typeof digitMap];
      }
      const lastString = line.substring(line.length - 1 - i);
      if (last === undefined && lastString.startsWith(digitStr)) {
        last = digitMap[digitStr as keyof typeof digitMap];
      }
    }
    if (typeof first === "number" && typeof last === "number") {
      return [first, last];
    }
  }
  throw new Error("first and last not found!");
}

const sum = input
  .split("\n")
  .filter((line) => line)
  .map((line) => parseInt(findFirstAndLastDigits(line).join(""), 10))
  .reduce((a, b) => a + b);

console.log("sum", sum);
