import fs from "fs";

type MapFunc = (x: number) => number | undefined;

function buildMap(src: number, dest: number, length: number): MapFunc {
  return (x: number) => {
    if (x >= src && x < src + length) {
      const offset = x - src;
      const result = dest + offset;
      return result;
    }
    return undefined;
  };
}

type Mapping = [number, number, number];

function buildAllMaps(mapping: Mapping[][]): MapFunc[][] {
  return mapping.map((m: Mapping[]) => {
    return m.map(([dest, src, len]) => buildMap(src, dest, len));
  });
}

function findLocation(seed: number, maps: MapFunc[][]) {
  return maps.reduce((l, ms) => {
    for (let i = 0; i < ms.length; i++) {
      const nextLocation = ms[i](l);
      if (nextLocation !== undefined) {
        return nextLocation;
      }
    }
    return l;
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
const seedRanges: [number, number][] = seeds
  .map((value, index, array) => [value, array[index + 1] + value])
  .filter((_value, index) => index % 2 === 0);

console.log("seedRanges", seedRanges);

// @ts-ignore
const allMaps = buildAllMaps(mappings);

function lowestLocation(seedRanges: [number, number][], allMaps: MapFunc[][]) {
  let currentMin: number | undefined;
  seedRanges.map(([start, end]) => {
    for (let seed = start; seed < end; seed++) {
      const location = findLocation(seed, allMaps);
      if (currentMin === undefined || location < currentMin) {
        currentMin = location;
      }
    }
  });
  return currentMin;
}

console.log("lowest location", lowestLocation(seedRanges, allMaps));
