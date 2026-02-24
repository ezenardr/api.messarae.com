export function Slugify(text: string): string {
  return text
    .trim()
    .replaceAll(/[^A-Za-z0-9\s-]/g, '') // remove special characters but keep capitals
    .replaceAll(/\s+/g, '-') // replaceAll spaces with dashes
    .replaceAll(/-+/g, '-')
}
