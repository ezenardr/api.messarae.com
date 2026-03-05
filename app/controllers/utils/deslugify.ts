export default function deslugify(slug: string): string {
  return decodeURIComponent(slug.replaceAll(/-/g, ' ').replaceAll(/\s+/g, ' ').trim())
}
