import useBrokenLinks from '@docusaurus/useBrokenLinks';

/**
 * Declares a section's id to the broken-links checker. The footer and the
 * navbar link to /#funzioni and friends; with onBrokenAnchors: 'throw' the
 * build refuses an anchor nobody declared, and a plain `id` is not declared.
 */
export default function useAnchor(id: string): string {
  useBrokenLinks().collectAnchor(id);
  return id;
}
