/**
 * Verse theme categories and color coding system
 * This file defines the theme categories used for color-coding Bible verses
 */
import { VerseThemeCategory } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

// Define the main theme categories with their colors
export const themeCategories: VerseThemeCategory[] = [
  {
    id: uuidv4(),
    name: 'prophecy',
    description: 'Verses containing prophetic revelations or predictions',
    colorHex: '#8a4af3', // Purple
    priority: 10
  },
  {
    id: uuidv4(),
    name: 'covenant',
    description: 'Verses describing God\'s covenants and promises',
    colorHex: '#d97706', // Amber (dark)
    priority: 9
  },
  {
    id: uuidv4(),
    name: 'wisdom',
    description: 'Verses containing wisdom, advice, or proverbs',
    colorHex: '#0ea5e9', // Sky blue
    priority: 8
  },
  {
    id: uuidv4(),
    name: 'salvation',
    description: 'Verses about salvation, redemption, and eternal life',
    colorHex: '#ef4444', // Red
    priority: 7
  },
  {
    id: uuidv4(),
    name: 'commandment',
    description: 'Verses containing God\'s commandments, laws, or instructions',
    colorHex: '#3b82f6', // Blue
    priority: 6
  },
  {
    id: uuidv4(),
    name: 'praise',
    description: 'Verses expressing praise, worship, or gratitude to God',
    colorHex: '#f59e0b', // Amber
    priority: 5
  },
  {
    id: uuidv4(),
    name: 'historical',
    description: 'Verses describing historical events or narratives',
    colorHex: '#64748b', // Slate
    priority: 4
  },
  {
    id: uuidv4(),
    name: 'genealogy',
    description: 'Verses containing genealogical records or family histories',
    colorHex: '#94a3b8', // Slate (lighter)
    priority: 3
  },
  {
    id: uuidv4(),
    name: 'teaching',
    description: 'Verses containing Jesus\'s teachings or parables',
    colorHex: '#14b8a6', // Teal
    priority: 8
  },
  {
    id: uuidv4(),
    name: 'miracle',
    description: 'Verses describing miracles or supernatural events',
    colorHex: '#a855f7', // Purple (lighter)
    priority: 7
  },
  {
    id: uuidv4(),
    name: 'prayer',
    description: 'Verses containing prayers or teachings on prayer',
    colorHex: '#3fa34b', // Green
    priority: 6
  },
  {
    id: uuidv4(),
    name: 'sin',
    description: 'Verses discussing sin, repentance, or consequences of sin',
    colorHex: '#9f1239', // Rose (dark)
    priority: 5
  },
  {
    id: uuidv4(),
    name: 'faith',
    description: 'Verses about faith, trust, or belief',
    colorHex: '#a3e635', // Lime
    priority: 6
  },
  {
    id: uuidv4(),
    name: 'love',
    description: 'Verses about love, compassion, or God\'s love',
    colorHex: '#ec4899', // Pink
    priority: 8
  },
  {
    id: uuidv4(),
    name: 'judgment',
    description: 'Verses about God\'s judgment or divine justice',
    colorHex: '#7c2d12', // Amber (darkest)
    priority: 7
  },
  {
    id: uuidv4(),
    name: 'hope',
    description: 'Verses about hope, encouragement, or future promises',
    colorHex: '#84cc16', // Lime (darker)
    priority: 6
  }
];

// Map of theme names to categories for quick lookup
export const themeMap = themeCategories.reduce((acc, category) => {
  acc[category.name] = category;
  return acc;
}, {} as Record<string, VerseThemeCategory>);

/**
 * Get the theme category for a verse based on its themes
 * Returns the highest priority theme matching the verse
 */
export function getThemeForVerse(verseThemes: string[]): VerseThemeCategory | null {
  if (!verseThemes || verseThemes.length === 0) {
    return null;
  }

  let bestMatch: VerseThemeCategory | null = null;
  
  for (const theme of verseThemes) {
    const matchedCategory = themeMap[theme];
    if (matchedCategory) {
      if (!bestMatch || matchedCategory.priority > bestMatch.priority) {
        bestMatch = matchedCategory;
      }
    }
  }

  return bestMatch;
}

/**
 * Get a CSS class name for a verse based on its theme
 */
export function getVerseColorClass(verseThemes: string[]): string {
  const theme = getThemeForVerse(verseThemes);
  if (!theme) {
    return '';
  }
  
  // Return Tailwind-compatible class for verse theme color
  // The actual colors can be customized in tailwind.config.js
  return `verse-theme-${theme.name}`;
}

/**
 * Get background and border colors for a verse theme
 */
export function getVerseColors(verseThemes: string[]): { background: string; border: string; text: string } | null {
  const theme = getThemeForVerse(verseThemes);
  if (!theme) {
    return null;
  }

  // Create semi-transparent background colors based on the theme color
  const bgColor = `${theme.colorHex}15`; // 15% opacity version of the color
  const borderColor = `${theme.colorHex}30`; // 30% opacity version of the color
  const textColor = theme.colorHex;

  return {
    background: bgColor,
    border: borderColor,
    text: textColor
  };
}

/**
 * Get emoji icon for a verse theme
 */
export function getThemeEmoji(themeName: string): string {
  // Map of theme names to emojis
  const emojiMap: Record<string, string> = {
    prophecy: '🔮',
    covenant: '📜',
    wisdom: '🧠',
    salvation: '✝️',
    commandment: '📋',
    praise: '🙌',
    historical: '📚',
    genealogy: '👪',
    teaching: '👨‍🏫',
    miracle: '✨',
    prayer: '🙏',
    sin: '⚠️',
    faith: '⚓',
    love: '❤️',
    judgment: '⚖️',
    hope: '🌈'
  };

  return emojiMap[themeName] || '📖';
}