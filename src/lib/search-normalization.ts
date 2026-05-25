export type SearchOption<T extends string = string> = {
  label: string;
  value: T;
  keywords?: string[];
};

export function normalizeSearchTerm(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, "");
}

function optionTexts(option: SearchOption<string>) {
  return [option.label, option.value, ...(option.keywords ?? [])];
}

function levenshteinDistance(left: string, right: string) {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = 0; row < rows; row += 1) matrix[row][0] = row;
  for (let col = 0; col < cols; col += 1) matrix[0][col] = col;

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[left.length][right.length];
}

export function findCaseInsensitiveMatch<T extends string>(
  options: SearchOption<T>[],
  input: string,
) {
  const normalizedInput = normalizeSearchTerm(input);
  if (!normalizedInput) return null;

  return (
    options.find((option) =>
      optionTexts(option).some((text) => normalizeSearchTerm(text) === normalizedInput),
    ) ?? null
  );
}

export function getClosestMatches<T extends string>(
  options: SearchOption<T>[],
  input: string,
) {
  const normalizedInput = normalizeSearchTerm(input);
  if (!normalizedInput) return [];

  return options
    .map((option) => {
      const normalizedTexts = optionTexts(option).map((text) => normalizeSearchTerm(text));
      const bestDistance = Math.min(...normalizedTexts.map((text) => levenshteinDistance(text, normalizedInput)));
      const includesScore = normalizedTexts.some(
        (text) => text.includes(normalizedInput) || normalizedInput.includes(text),
      )
        ? 4
        : 0;
      const prefixScore = normalizedTexts.some((text) => text.startsWith(normalizedInput)) ? 5 : 0;
      const distanceScore = Math.max(0, 5 - bestDistance);
      const score = includesScore + prefixScore + distanceScore;

      return { option, score, bestDistance };
    })
    .filter((entry) => entry.score > 0 || entry.bestDistance <= 3)
    .sort((left, right) => right.score - left.score || left.bestDistance - right.bestDistance)
    .slice(0, 3)
    .map((entry) => entry.option);
}
