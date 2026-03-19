export interface SeoMetrics {
  score: number;
  wordCount: number;
  keywordDensity: number;
  headingCount: number;
  readability: 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

export function calculateSeoMetrics(content: string, keywords: string[]): SeoMetrics {
  const words = content.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  if (wordCount === 0) {
    return {
      score: 0,
      wordCount: 0,
      keywordDensity: 0,
      headingCount: 0,
      readability: 'Poor',
    };
  }

  // Basic keyword density
  let keywordMatches = 0;
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) keywordMatches += matches.length;
  });
  
  const keywordDensity = (keywordMatches / wordCount) * 100;

  // Heading analysis (Markdown style)
  const headingMatches = content.match(/^#+\s/gm);
  const headingCount = headingMatches ? headingMatches.length : 0;

  // Simple scoring logic
  let score = 0;
  
  // Word count score (up to 30)
  score += Math.min(30, (wordCount / 1000) * 30);
  
  // Keyword density score (up to 30)
  // Optimal density is usually 1-3%
  if (keywordDensity >= 0.5 && keywordDensity <= 4) {
    score += 30;
  } else if (keywordDensity > 0) {
    score += 15;
  }
  
  // Heading score (up to 20)
  if (headingCount >= 3) score += 20;
  else score += (headingCount / 3) * 20;

  // Readability score (up to 20)
  // For simplicity, based on average sentence length
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = wordCount / (sentences.length || 1);
  let readability: SeoMetrics['readability'] = 'Poor';
  
  if (avgSentenceLength < 15) {
    readability = 'Excellent';
    score += 20;
  } else if (avgSentenceLength < 25) {
    readability = 'Good';
    score += 15;
  } else if (avgSentenceLength < 35) {
    readability = 'Fair';
    score += 10;
  } else {
    readability = 'Poor';
    score += 5;
  }

  return {
    score: Math.round(score),
    wordCount,
    keywordDensity: parseFloat(keywordDensity.toFixed(2)),
    headingCount,
    readability,
  };
}
