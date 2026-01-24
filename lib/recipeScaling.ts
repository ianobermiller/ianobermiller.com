/**
 * Utility functions for scaling recipe ingredient quantities
 */

// Unicode fraction to ASCII fraction
const UNICODE_FRACTIONS: Record<string, string> = {
  '¼': '1/4',
  '½': '1/2',
  '¾': '3/4',
  '⅐': '1/7',
  '⅑': '1/9',
  '⅒': '1/10',
  '⅓': '1/3',
  '⅔': '2/3',
  '⅕': '1/5',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅙': '1/6',
  '⅚': '5/6',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
};

/**
 * Find GCD using Euclidean algorithm
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Simplify a fraction
 */
function simplifyFraction(numerator: number, denominator: number): {num: number; denom: number} {
  const divisor = gcd(numerator, denominator);
  return {
    num: numerator / divisor,
    denom: denominator / divisor,
  };
}

/**
 * Convert a decimal to a mixed number string (e.g., 1.5 -> "1 1/2")
 */
function decimalToMixedNumber(decimal: number): string {
  if (decimal === 0) return '0';
  
  const whole = Math.floor(decimal);
  const fraction = decimal - whole;
  
  // If no fractional part, return whole number
  if (fraction < 0.01) {
    return whole.toString();
  }
  
  // Find closest common fraction
  const fractionMap: Array<[number, string]> = [
    [0.125, '1/8'],
    [0.25, '1/4'],
    [0.333, '1/3'],
    [0.5, '1/2'],
    [0.667, '2/3'],
    [0.75, '3/4'],
  ];
  
  let closestFraction = '';
  let minDiff = Infinity;
  
  for (const [value, str] of fractionMap) {
    const diff = Math.abs(fraction - value);
    if (diff < minDiff) {
      minDiff = diff;
      closestFraction = str;
    }
  }
  
  // If very close to a common fraction (within 0.02), use it
  if (minDiff < 0.02) {
    if (whole > 0) {
      return `${whole} ${closestFraction}`;
    }
    return closestFraction;
  }
  
  // Otherwise, return as decimal
  return decimal.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Parse a fraction string to decimal (e.g., "3/4" -> 0.75)
 */
function parseFraction(fraction: string): number {
  const parts = fraction.split('/');
  if (parts.length !== 2) return NaN;
  
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);
  
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    return NaN;
  }
  
  return numerator / denominator;
}

/**
 * Parse a mixed number string to decimal (e.g., "1 1/2" -> 1.5)
 */
function parseMixedNumber(str: string): number | null {
  // Match patterns like "1 1/2" or "2 3/4"
  const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const numerator = parseInt(mixedMatch[2]);
    const denominator = parseInt(mixedMatch[3]);
    return whole + numerator / denominator;
  }
  return null;
}

/**
 * Extract and scale all numbers in an ingredient string
 */
export function scaleIngredient(ingredient: string, scale: number): string {
  if (scale === 1) return ingredient;
  
  // First, normalize unicode fractions to ASCII with proper spacing
  let result = ingredient;
  for (const [unicode, ascii] of Object.entries(UNICODE_FRACTIONS)) {
    // Add space before fraction if it's adjacent to a digit (e.g., "1½" -> "1 1/2")
    result = result.replace(new RegExp(`(\\d)${unicode}`, 'g'), `$1 ${ascii}`);
    // Otherwise just replace it
    result = result.replace(new RegExp(unicode, 'g'), ascii);
  }
  
  // Track all replacements to do them in one pass from end to start
  // This prevents issues with overlapping matches
  const replacements: Array<{start: number; end: number; text: string}> = [];
  
  // Pattern to match mixed numbers, fractions, ranges, decimals, and whole numbers
  // Order matters - match more specific patterns first
  
  // 1. Mixed numbers with ranges: "1 1/2-2 3/4"
  const mixedRangeRegex = /\b(\d+)\s+(\d+)\/(\d+)\s*[-–]\s*(\d+)\s+(\d+)\/(\d+)\b/g;
  let match;
  while ((match = mixedRangeRegex.exec(result)) !== null) {
    const start1 = parseInt(match[1]) + parseInt(match[2]) / parseInt(match[3]);
    const start2 = parseInt(match[4]) + parseInt(match[5]) / parseInt(match[6]);
    const scaled1 = start1 * scale;
    const scaled2 = start2 * scale;
    replacements.push({
      start: match.index,
      end: match.index + match[0].length,
      text: `${decimalToMixedNumber(scaled1)}-${decimalToMixedNumber(scaled2)}`,
    });
  }
  
  // 2. Range with one mixed number and one whole: "1-1 1/2" or "1 1/2-2"
  const partialMixedRangeRegex = /\b(\d+)\s*[-–]\s*(\d+)\s+(\d+)\/(\d+)\b|\b(\d+)\s+(\d+)\/(\d+)\s*[-–]\s*(\d+)\b/g;
  while ((match = partialMixedRangeRegex.exec(result)) !== null) {
    if (replacements.some(r => match.index >= r.start && match.index < r.end)) continue;
    
    let num1, num2;
    if (match[1]) {
      // Format: "1-1 1/2"
      num1 = parseInt(match[1]);
      num2 = parseInt(match[2]) + parseInt(match[3]) / parseInt(match[4]);
    } else {
      // Format: "1 1/2-2"
      num1 = parseInt(match[5]) + parseInt(match[6]) / parseInt(match[7]);
      num2 = parseInt(match[8]);
    }
    const scaled1 = num1 * scale;
    const scaled2 = num2 * scale;
    replacements.push({
      start: match.index,
      end: match.index + match[0].length,
      text: `${decimalToMixedNumber(scaled1)}-${decimalToMixedNumber(scaled2)}`,
    });
  }
  
  // 3. Mixed numbers: "1 1/2"
  const mixedRegex = /\b(\d+)\s+(\d+)\/(\d+)\b/g;
  while ((match = mixedRegex.exec(result)) !== null) {
    if (replacements.some(r => match.index >= r.start && match.index < r.end)) continue;
    
    const value = parseInt(match[1]) + parseInt(match[2]) / parseInt(match[3]);
    const scaled = value * scale;
    replacements.push({
      start: match.index,
      end: match.index + match[0].length,
      text: decimalToMixedNumber(scaled),
    });
  }
  
  // 4. Fraction ranges: "1/4-1/2"
  const fractionRangeRegex = /\b(\d+)\/(\d+)\s*[-–]\s*(\d+)\/(\d+)\b/g;
  while ((match = fractionRangeRegex.exec(result)) !== null) {
    if (replacements.some(r => match.index >= r.start && match.index < r.end)) continue;
    
    const val1 = parseInt(match[1]) / parseInt(match[2]);
    const val2 = parseInt(match[3]) / parseInt(match[4]);
    const scaled1 = val1 * scale;
    const scaled2 = val2 * scale;
    replacements.push({
      start: match.index,
      end: match.index + match[0].length,
      text: `${decimalToMixedNumber(scaled1)}-${decimalToMixedNumber(scaled2)}`,
    });
  }
  
  // 5. Standalone fractions: "3/4"
  const fractionRegex = /\b(\d+)\/(\d+)\b/g;
  while ((match = fractionRegex.exec(result)) !== null) {
    if (replacements.some(r => match.index >= r.start && match.index < r.end)) continue;
    
    const value = parseInt(match[1]) / parseInt(match[2]);
    const scaled = value * scale;
    replacements.push({
      start: match.index,
      end: match.index + match[0].length,
      text: decimalToMixedNumber(scaled),
    });
  }
  
  // 6. Decimal or whole number ranges: "1.5-2" or "3-6"
  const numberRangeRegex = /\b(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\b/g;
  while ((match = numberRangeRegex.exec(result)) !== null) {
    if (replacements.some(r => match.index >= r.start && match.index < r.end)) continue;
    
    const startNum = parseFloat(match[1]);
    const endNum = parseFloat(match[2]);
    const scaledStart = startNum * scale;
    const scaledEnd = endNum * scale;
    
    // Keep as integers if both were integers
    if (Number.isInteger(startNum) && Number.isInteger(endNum)) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        text: `${Math.round(scaledStart)}-${Math.round(scaledEnd)}`,
      });
    } else {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        text: `${decimalToMixedNumber(scaledStart)}-${decimalToMixedNumber(scaledEnd)}`,
      });
    }
  }
  
  // 7. Decimals and whole numbers: "2.5" or "12"
  const numberRegex = /\b(\d+(?:\.\d+)?)\b/g;
  while ((match = numberRegex.exec(result)) !== null) {
    if (replacements.some(r => match.index >= r.start && match.index < r.end)) continue;
    
    const value = parseFloat(match[1]);
    const scaled = value * scale;
    
    // If original was an integer, try to keep result as integer
    if (Number.isInteger(value) && Number.isInteger(scaled)) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        text: Math.round(scaled).toString(),
      });
    } else {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        text: decimalToMixedNumber(scaled),
      });
    }
  }
  
  // Apply replacements from end to start to maintain indices
  replacements.sort((a, b) => b.start - a.start);
  for (const {start, end, text} of replacements) {
    result = result.substring(0, start) + text + result.substring(end);
  }
  
  return result;
}
