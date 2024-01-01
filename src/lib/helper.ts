/**
 * Get Minecraft lore without the color and formatting codes
 *
 * @param text - The text with color codes
 * @returns The text without color codes.
 */
export function getRawLore(text: string): string {
	return text.replaceAll(/§[0-9a-fk-or]/g, '');
}
