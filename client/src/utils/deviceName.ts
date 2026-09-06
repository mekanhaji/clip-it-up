/** Upper bound for a device name, enforced on input and on the wire. */
export const DEVICE_NAME_MAX_LENGTH = 24;

/**
 * Well-known anime characters used as friendly default device names.
 * A new device picks one at random; the user can rename it in settings.
 */
export const ANIME_CHARACTER_NAMES = [
  // Naruto
  "Naruto", "Sasuke", "Sakura", "Kakashi", "Itachi", "Hinata", "Shikamaru", "Gaara",
  // One Piece
  "Luffy", "Zoro", "Nami", "Sanji", "Chopper", "Robin", "Ace", "Shanks",
  // Dragon Ball
  "Goku", "Vegeta", "Gohan", "Piccolo", "Trunks", "Bulma",
  // Bleach
  "Ichigo", "Rukia", "Toshiro", "Byakuya",
  // Attack on Titan
  "Eren", "Mikasa", "Armin", "Levi", "Hange", "Erwin",
  // Fullmetal Alchemist
  "Edward", "Alphonse", "Winry", "Mustang", "Riza",
  // Death Note
  "Light", "Ryuk", "Misa",
  // Demon Slayer
  "Tanjiro", "Nezuko", "Zenitsu", "Inosuke", "Giyu", "Shinobu", "Rengoku",
  // Jujutsu Kaisen
  "Gojo", "Yuji", "Megumi", "Nobara", "Nanami",
  // My Hero Academia
  "Deku", "Bakugo", "Todoroki", "Uraraka", "Iida",
  // One Punch Man
  "Saitama", "Genos",
  // Cowboy Bebop
  "Spike", "Faye", "Jet", "Ein",
  // Hunter x Hunter
  "Killua", "Gon", "Kurapika", "Hisoka",
  // Re:Zero
  "Rem", "Emilia", "Subaru",
  // Sword Art Online
  "Asuna", "Kirito", "Sinon",
  // Dr. Stone / Mob Psycho / Noragami
  "Senku", "Mob", "Reigen", "Yato", "Hiyori",
  // Studio Ghibli
  "Totoro", "Chihiro", "Haku", "Kiki", "Ponyo", "Sophie", "Howl", "Calcifer",
  "Nausicaa", "Ashitaka",
  // Evangelion / Code Geass
  "Rei", "Asuka", "Shinji", "Kaworu", "Lelouch", "Suzaku", "Kallen",
  // Berserk / Hellsing / Trigun
  "Guts", "Griffith", "Casca", "Alucard", "Vash",
  // Spy x Family / Chainsaw Man / Frieren / Vinland Saga
  "Anya", "Loid", "Yor", "Bond", "Denji", "Power", "Makima", "Aki",
  "Frieren", "Fern", "Stark", "Himmel", "Thorfinn", "Askeladd",
  // Tokyo Ghoul / Fairy Tail / Inuyasha / Yu Yu Hakusho
  "Kaneki", "Touka", "Natsu", "Lucy", "Erza", "Gray",
  "Inuyasha", "Kagome", "Sesshomaru", "Yusuke", "Kurama", "Hiei",
  // Misc classics
  "Kenshin", "Nobita", "Doraemon", "Conan", "Okabe", "Kurisu", "Holo",
  "Ranma", "Akane", "Haruhi", "Kyon", "Gintoki", "Kagura", "Yugi", "Kaiba",
  "Usagi", "Astro",
] as const;

export const randomAnimeName = (): string => {
  const index = Math.floor(Math.random() * ANIME_CHARACTER_NAMES.length);
  return ANIME_CHARACTER_NAMES[index];
};

/**
 * Normalises a device name for storage and transport: collapses runs of
 * whitespace and caps the length. Trimming is left to the caller so that a
 * user can type a space mid-name without it being eaten.
 */
export const sanitizeDeviceName = (value: string): string =>
  value.replace(/\s+/g, " ").slice(0, DEVICE_NAME_MAX_LENGTH);
