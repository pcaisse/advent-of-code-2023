import fs from "fs";
const input = fs.readFileSync(process.stdin.fd, "utf-8");

const colors = ["red", "blue", "green"] as const;
type Color = (typeof colors)[number];
type GameLimit = Record<Color, number>;
type GameSet = Partial<GameLimit>;
type Game = { gameSets: GameSet[]; id: number };

function isGameSetWithinLimits(gameSet: GameSet, limits: GameLimit): boolean {
  return colors.every((color) => {
    const count = gameSet[color];
    return count !== undefined ? count <= limits[color] : true;
  });
}

const games: Game[] = input
  .split("\n")
  .filter((line) => line)
  .map((line) => {
    const id = /Game (\d+)/.exec(line)?.at(1);
    if (typeof id !== "string") {
      throw new Error("id missing");
    }
    const gameSets: GameSet[] = line
      .split(/[:;]/)
      .slice(1)
      .map((s) =>
        Object.fromEntries(
          s.split(",").map((ss) => ss.trim().split(" ").reverse())
        )
      );
    return { gameSets, id: parseInt(id, 10) };
  });

const limits: GameLimit = { red: 12, green: 13, blue: 14 };
const validGames = games.filter(({ gameSets }) =>
  gameSets.every((gameSet) => isGameSetWithinLimits(gameSet, limits))
);
const sumOfIds = validGames.map(({ id }) => id).reduce((a, b) => a + b);

console.log("sumOfIds", sumOfIds);
