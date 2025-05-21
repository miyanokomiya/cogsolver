const SEED_LENGTH = 16;

export function getSeedInputOrRandom(): string {
  const input = document.getElementById("input-seed")! as HTMLInputElement;
  if (input.value) return input.value.slice(0, SEED_LENGTH);
  return generateString(SEED_LENGTH);
}

export function getRandomSeed(): string {
  const seed = generateString(SEED_LENGTH);
  putSeedText(seed);
  return seed;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length: number) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Phaser.Math.RND.between(0, charactersLength - 1));
  }

  return result;
}

export function putSeedText(text: string) {
  const input = document.getElementById("input-seed")! as HTMLInputElement;
  input.value = text;
}

export function copySeedText(text: string) {
  const input = document.getElementById("input-seed")! as HTMLInputElement;
  input.value = text;
  input.select();
  document.execCommand("copy");
}
