export const analyzeSentiment = (text) => {
  if (!text) return { score: 0.5, label: 'neutral', confidence: 0 };
  
  const lowerText = text.toLowerCase();
  
  const positiveWords = [
    'delicious', 'amazing', 'fresh', 'tasty', 'flavorful', 'crispy', 'juicy', 'tender', 
    'aromatic', 'fantastic', 'excellent', 'wonderful', 'perfect', 'heavenly', 'superb', 
    'outstanding', 'incredible', 'mouthwatering', 'scrumptious', 'divine', 'yummy', 
    'hot', 'warm', 'authentic', 'generous', 'quick', 'fast', 'prompt', 'polite', 
    'friendly', 'clean', 'neat', 'beautiful', 'comfortable', 'reasonable', 'affordable', 
    'worth', 'value', 'recommend', 'love', 'best', 'great', 'good', 'nice', 'fine', 
    'cool', 'awesome', 'brilliant', 'impressive', 'satisfying', 'filling', 'crunchy', 
    'creamy', 'smooth', 'rich', 'savory', 'sweet', 'spicy', 'well-cooked', 
    'well-seasoned', 'well-presented', 'well-packed', 'on-time', 'punctual', 'courteous', 'hygienic'
  ];
  
  const negativeWords = [
    'terrible', 'awful', 'horrible', 'disgusting', 'stale', 'cold', 'bland', 'tasteless', 
    'raw', 'undercooked', 'overcooked', 'burnt', 'soggy', 'greasy', 'oily', 'salty', 
    'bitter', 'sour', 'rotten', 'expired', 'old', 'slow', 'late', 'delayed', 'rude', 
    'dirty', 'messy', 'unhygienic', 'expensive', 'overpriced', 'ripoff', 'small', 'tiny', 
    'worst', 'bad', 'poor', 'mediocre', 'disappointing', 'pathetic', 'unacceptable', 
    'inedible', 'spoiled', 'contaminated', 'bug', 'insect', 'hair', 'plastic', 'wrong', 
    'missing', 'incomplete', 'broken', 'damaged', 'leaked', 'spilled'
  ];
  
  const intensifiers = ['very', 'extremely', 'incredibly', 'absolutely', 'totally', 'really', 'so', 'quite', 'rather', 'super', 'ultra', 'highly', 'most', 'exceptionally'];
  const negators = ['not', 'never', 'no', 'neither', 'nor', "don't", "doesn't", "didn't", "won't", "wouldn't", "couldn't", "shouldn't", "isn't", "aren't", "wasn't", "weren't", 'hardly', 'barely', 'scarcely'];
  
  const words = lowerText.match(/\b(\w+)\b/g) || [];
  
  let score = 0;
  let wordCount = 0;
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let isNegated = false;
    let isIntensified = false;
    
    if (i > 0 && negators.includes(words[i-1])) isNegated = true;
    if (i > 1 && negators.includes(words[i-2])) isNegated = true;
    
    if (i > 0 && intensifiers.includes(words[i-1])) isIntensified = true;
    
    let multiplier = 1;
    if (isNegated) multiplier = -1;
    else if (isIntensified) multiplier = 1.5;
    
    if (positiveWords.includes(word)) {
      score += 1 * multiplier;
      wordCount++;
    } else if (negativeWords.includes(word)) {
      score -= 1 * multiplier;
      wordCount++;
    }
  }
  
  let finalScore = 0.5; // Neutral baseline
  if (wordCount > 0) {
    const normalizedScore = Math.max(-1, Math.min(1, score / wordCount));
    finalScore = (normalizedScore + 1) / 2; // Map -1..1 to 0..1
  }
  
  let label = 'neutral';
  if (finalScore >= 0.8) label = 'very_positive';
  else if (finalScore >= 0.6) label = 'positive';
  else if (finalScore <= 0.2) label = 'very_negative';
  else if (finalScore <= 0.4) label = 'negative';
  
  const confidence = Math.min(1, wordCount * 0.2); // Simple confidence based on hit count
  
  return { score: finalScore, label, confidence };
};

export const extractAspects = (text) => {
  const lowerText = text?.toLowerCase() || '';
  
  const aspects = {
    food_quality: { keywords: ['food', 'taste', 'flavor', 'dish', 'meal', 'cooked', 'seasoned', 'fresh', 'stale', 'quality', 'ingredient', 'portion', 'recipe'], texts: [] },
    delivery: { keywords: ['delivery', 'deliver', 'delivered', 'time', 'late', 'early', 'fast', 'slow', 'quick', 'prompt', 'delayed', 'wait', 'arrived', 'driver', 'rider'], texts: [] },
    packaging: { keywords: ['package', 'packed', 'packing', 'container', 'box', 'wrap', 'sealed', 'leak', 'spill', 'broken', 'intact', 'clean', 'hygienic'], texts: [] },
    service: { keywords: ['service', 'staff', 'support', 'response', 'customer', 'behavior', 'attitude', 'polite', 'rude', 'helpful', 'courteous'], texts: [] },
    value: { keywords: ['price', 'cost', 'expensive', 'cheap', 'affordable', 'value', 'worth', 'money', 'overpriced', 'reasonable', 'charge'], texts: [] }
  };
  
  const sentences = lowerText.split(/[.!?]+/).filter(Boolean);
  
  sentences.forEach(sentence => {
    Object.keys(aspects).forEach(aspect => {
      if (aspects[aspect].keywords.some(kw => sentence.includes(kw))) {
        aspects[aspect].texts.push(sentence);
      }
    });
  });
  
  const aspectScores = {};
  Object.keys(aspects).forEach(aspect => {
    if (aspects[aspect].texts.length > 0) {
      const combinedText = aspects[aspect].texts.join('. ');
      const sentiment = analyzeSentiment(combinedText);
      aspectScores[aspect] = sentiment.score;
    } else {
      aspectScores[aspect] = null;
    }
  });
  
  return aspectScores;
};

export const generateReviewSummary = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      overallSentiment: 0.5,
      averageRating: 0,
      totalReviews: 0,
      sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
      topPraises: [],
      topComplaints: [],
      aspectScores: { food_quality: null, delivery: null, packaging: null, service: null, value: null }
    };
  }
  
  let totalScore = 0;
  let totalRating = 0;
  const distribution = { positive: 0, neutral: 0, negative: 0 };
  const aspectTotals = { food_quality: 0, delivery: 0, packaging: 0, service: 0, value: 0 };
  const aspectCounts = { food_quality: 0, delivery: 0, packaging: 0, service: 0, value: 0 };
  
  const allPositiveSentences = [];
  const allNegativeSentences = [];
  
  reviews.forEach(review => {
    const text = review.comment || '';
    const sentiment = analyzeSentiment(text);
    
    totalScore += sentiment.score;
    totalRating += review.rating;
    
    if (sentiment.score >= 0.6) distribution.positive++;
    else if (sentiment.score <= 0.4) distribution.negative++;
    else distribution.neutral++;
    
    const aspects = extractAspects(text);
    Object.keys(aspects).forEach(key => {
      if (aspects[key] !== null) {
        aspectTotals[key] += aspects[key];
        aspectCounts[key]++;
      }
    });
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    sentences.forEach(s => {
      const sent = analyzeSentiment(s);
      if (sent.score >= 0.7) allPositiveSentences.push({text: s.trim(), score: sent.score});
      if (sent.score <= 0.3) allNegativeSentences.push({text: s.trim(), score: sent.score});
    });
  });
  
  const aspectScores = {};
  Object.keys(aspectTotals).forEach(key => {
    aspectScores[key] = aspectCounts[key] > 0 ? aspectTotals[key] / aspectCounts[key] : null;
  });
  
  allPositiveSentences.sort((a, b) => b.score - a.score);
  allNegativeSentences.sort((a, b) => a.score - b.score);
  
  // Basic deduplication for praises and complaints
  const getUnique = (arr, limit = 3) => {
      const unique = [];
      const seen = new Set();
      for(let item of arr) {
          const simplified = item.text.toLowerCase().replace(/[^a-z]/g, '');
          if(!seen.has(simplified)) {
              seen.add(simplified);
              unique.push(item.text);
              if(unique.length >= limit) break;
          }
      }
      return unique;
  }
  
  return {
    overallSentiment: totalScore / reviews.length,
    averageRating: totalRating / reviews.length,
    totalReviews: reviews.length,
    sentimentDistribution: distribution,
    topPraises: getUnique(allPositiveSentences),
    topComplaints: getUnique(allNegativeSentences),
    aspectScores
  };
};
