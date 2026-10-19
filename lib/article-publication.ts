/** Editorial readiness only; never changes stored content or author/date facts. */
export function hasEnglishArticle(article: unknown): boolean {
  if (!article || typeof article !== "object") return false;
  const en = (article as { translations?: { en?: { title?: unknown; excerpt?: unknown; content?: unknown } } }).translations?.en;
  if (![en?.title, en?.excerpt, en?.content].every(value => typeof value === "string" && value.trim())) return false;
  const body = (en!.content as string).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return !!body && !/^(?:content about\b.*\.{3}|coming soon\.?|todo\b.*|lorem ipsum\b.*)$/i.test(body);
}
