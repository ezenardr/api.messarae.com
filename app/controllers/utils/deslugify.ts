export default function deslugify(slug: string): string {
  return slug.replaceAll(/-/g, ' ').replaceAll(/\s+/g, ' ').trim()
}
