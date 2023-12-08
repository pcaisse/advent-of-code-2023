import fs from "fs";
import "core-js/full";

function buildMap(src: number, dest: number, length: number) {
  return Object.fromEntries(
    [...new Array(length)].map((_x, i) => [i + src, i + dest])
  );
}

type Mapping = [number, number, number];

function buildAllMaps(mapping: Mapping[][]) {
  return mapping.map((m: Mapping[]) =>
    m
      .map(([dest, src, len]) => buildMap(src, dest, len))
      .reduce((acc, obj) => ({ ...acc, ...obj }), {})
  );
}

function findLocation(seed: number, maps: { [key: number]: number }[]) {
  return maps.reduce((location, map) => {
    const nextLocation = map[location];
    if (nextLocation === undefined) {
      return location;
    }
    return nextLocation;
  }, seed);
}

const input = fs.readFileSync(process.stdin.fd, "utf-8");
const [seedsWrapped, ...mappings] = input
  .split("\n")
  .filter((line) => line)
  .map((line) => line.replace(/^[^:]+: */g, "|").trim())
  .join(",")
  .split("|")
  .filter((line) => line)
  .map((line) =>
    line
      .split(",")
      .filter((l) => l)
      .map((l) => l.split(" ").map((x) => parseInt(x, 10)))
  );

const seeds = seedsWrapped[0];

// @ts-ignore
const allMaps = buildAllMaps(mappings);

console.log(
  "lowest location",
  Math.min(...seeds.map((seed) => findLocation(seed, allMaps)))
);
