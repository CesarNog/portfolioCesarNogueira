/**
 * Serializes a JSON-LD object for embedding in a `<script type="application/ld+json">`
 * via `dangerouslySetInnerHTML`. Plain `JSON.stringify` doesn't escape `<`, so a
 * string value containing `</script>` would close the script tag early and let
 * whatever follows it be parsed as HTML/JS: a script-injection sink CodeQL (and
 * any other static analyzer) flags regardless of whether today's inputs are
 * developer-controlled, since the sink itself is what's unsafe, not today's data.
 * Escaping `<` to `<` is the standard mitigation (used internally by
 * Next.js and libraries like `serialize-javascript`) and is a no-op for valid
 * JSON-LD, which doesn't rely on literal `<` characters.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
