const STARTERS = Object.freeze({
  sol: {
    id: "sol",
    name: "Sol, Father of the System",
    description:
      "Sol, Father of the System is the protector of his Solar System. First of his name, eldest of the planets, he boasts incredible attacking capability, but less defense.",
    specialMove: "Solar Flare",
    favoriteElement: "Iron",
    baseStats: { hp: 100, attack: 200, defense: 30, evasion: 25 },
  },
  gaia: {
    id: "gaia",
    name: "Gaia, Life-Giver",
    description:
      "Gaia, Life-Giver is the source of life in her Solar System. She is a well-balanced planet, with the ability to heal herself within her habitable zone.",
    specialMove: "Habitable Zone",
    favoriteElement: "Carbon",
    baseStats: { hp: 100, attack: 50, defense: 50, evasion: 25 },
  },
  luna: {
    id: "luna",
    name: "Luna, Queen of the Tides",
    description:
      "Luna, Queen of the Tides is a small, elusive planet that focuses on patience and cunning over brute strength.",
    specialMove: "Dark Side of the Moon",
    favoriteElement: "Silicon",
    baseStats: { hp: 100, attack: 30, defense: 30, evasion: 50 },
  },
  uranus: {
    id: "uranus",
    name: "Sir Anthony Nuss",
    description:
      "Sir Anthony Nuss is a well-rounded planet with abilities that hinder enemy strength.",
    specialMove: "47 Years of Winter",
    favoriteElement: "Hydrogen",
    baseStats: { hp: 100, attack: 55, defense: 45, evasion: 30 },
  },
  jupiter: {
    id: "jupiter",
    name: "Jupiter, Bulwark of the Weak",
    description:
      "Jupiter is a beacon of raw fortitude with exceptional defensive ability.",
    specialMove: "Gravitational Anomaly",
    favoriteElement: "Helium",
    baseStats: { hp: 100, attack: 40, defense: 70, evasion: 10 },
  },
  pluto: {
    id: "pluto",
    name: "Pluto, The Outcast",
    description:
      "Pluto starts with modest combat capability but can siphon energy for upgrades.",
    specialMove: "Reparations",
    favoriteElement: "Nitrogen",
    baseStats: { hp: 100, attack: 30, defense: 30, evasion: 30 },
  },
});
export function getStarter(starterId) {
  return STARTERS[String(starterId).toLowerCase()] ?? null;
}
