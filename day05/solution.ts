import fs from "fs";

type MapFunc = (x: number) => number | undefined;

function buildSeeds(start: number, length: number, min: number, max: number) {
  // console.log("build seeds with start", start, "and end", start + length);
  // console.log("min is", min, "and max is", max);
  let seeds = [];
  for (let i = Math.max(start, min); i < Math.min(start + length, max); i++) {
    // console.log("i", i);
    // if (i >= min && i <= max) {
    console.log("adding valid seed", i);
    seeds.push(i);
    // }
  }
  return seeds;
  return [...new Array(length)].map((_x, i) => i + start);
}

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

const seedToSoilMappings = mappings[0] as Mapping[];
const seedToSoilSeeds = seedToSoilMappings.map((v) => v[1]);
const seedMin = Math.min(...seedToSoilSeeds);
const seedMax = Math.max(...seedToSoilSeeds);

console.log("seed min", seedMin, "seed max", seedMax);

// @ts-ignore
const seedRanges: [number, number][] = seeds
  .map((value, index, array) => [value, array[index + 1]])
  .filter((_value, index) => index % 2 === 0);
const allSeeds = seedRanges.flatMap(([start, length]) =>
  buildSeeds(start, length, seedMin, seedMax)
);

// console.log("allSeeds", allSeeds);

// @ts-ignore
const allMaps = buildAllMaps(mappings);

console.log(
  "lowest location",
  Math.min(...allSeeds.map((seed) => findLocation(seed, allMaps)))
);
