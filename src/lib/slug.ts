// Stable id from heading text, shared by the heading renderer (which sets the
// id) and the "On this page" nav (which links to it) so they always agree.
// Strips inline markup markers (**bold**, *italic*, `code`) first.
export function slugify(text: string): string {
  return text
    .replace(/[*`]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
