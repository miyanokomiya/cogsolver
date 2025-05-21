export function getSeedInputOrRandom(): string {
  const input = document.getElementById("input-seed")! as HTMLInputElement;
  if (input.value) return input.value;
  return generateString(10);
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

export function copyText(text: string) {
  const input = document.getElementById("input-seed")! as HTMLInputElement;
  input.value = text;
  input.select();
  document.execCommand("copy");
  console.log(text);
}
