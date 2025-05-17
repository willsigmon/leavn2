import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generates narrative versions of Bible chapters using Claude's advanced storytelling capabilities
 */
export async function generateNarrativeWithClaude(
  verses: string[], 
  chapterInfo: { book: string, chapter: number },
  lens: string = "standard"
): Promise<string> {
  // In development with no API key, return mock data
  if (!process.env.ANTHROPIC_API_KEY) {
    return getMockNarrative(chapterInfo.book);
  }
  
  try {
    const fullText = verses.join(" ");
    const lensContext = getLensContext(lens);
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1500,
      system: `You are a biblical narrative expert who transforms Bible chapters into immersive, novel-style prose while maintaining absolute theological accuracy and respecting the ${lens} perspective.
      
      Guidelines:
      - Rewrite the chapter as flowing literary prose without verse numbers
      - Expand scenes with historically accurate, theologically sound details
      - Add sensory details, settings, character emotions, and cultural context
      - Maintain complete spiritual reverence - no heresy or theological errors
      - Incorporate the following lens perspective: ${lensContext}
      - Keep the narrative style similar to quality historical fiction
      - Do not add theological interpretation beyond what's necessary to bridge contextual gaps
      - Ensure the narrative flows naturally as a cohesive story
      - If the passage is poetic or wisdom literature, adapt your approach accordingly
      - Format the response with HTML paragraph tags (<p>) for proper display
      
      Your goal is to make the scripture come alive while remaining absolutely faithful to the original text's meaning.`,
      messages: [
        {
          role: "user",
          content: `Transform this chapter (${chapterInfo.book} ${chapterInfo.chapter}) into immersive narrative prose:

          ${fullText}`
        }
      ],
    });

    // Check if content exists and extract the text
    if (response.content && response.content.length > 0) {
      // Handle the different content block types
      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        return contentBlock.text;
      }
    }
    
    return "Unable to generate narrative mode at this time.";
  } catch (error) {
    console.error("Error generating narrative with Claude:", error);
    return "Unable to generate narrative mode at this time.";
  }
}

/**
 * Generates insightful answers to contextual questions about Bible verses
 */
export async function generateContextualAnswerWithClaude(
  verseText: string, 
  question: string
): Promise<string> {
  // In development with no API key, return mock data
  if (!process.env.ANTHROPIC_API_KEY) {
    return "In the first-century Jewish context, this verse would have resonated deeply with the Jewish tradition of complete reliance on God's wisdom over human reasoning. The phrase 'lean not on your own understanding' would have been understood as a call to study and apply Torah wisdom rather than secular philosophies.";
  }
  
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 350,
      system: `You are a biblical scholar with expertise in historical-cultural context, ancient languages, and theological traditions. Provide clear, academically sound answers to contextual questions about Bible verses.
      
      Your answers should be:
      - Historically accurate and well-researched
      - Sensitive to the original context and meaning
      - Free from modern anachronisms
      - Balanced in perspective
      - Concise but thorough (3-5 sentences)
      
      Draw upon archaeological findings, primary historical sources, linguistic insights, and scholarly consensus in your response.`,
      messages: [
        {
          role: "user",
          content: `For this verse: "${verseText}"
          
          Answer this contextual question: "${question}"`
        }
      ],
    });

    // Check if content exists and extract the text
    if (response.content && response.content.length > 0) {
      // Handle the different content block types
      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        return contentBlock.text;
      }
    }
    
    return "Unable to generate an answer at this time.";
  } catch (error) {
    console.error("Error generating contextual answer with Claude:", error);
    return "Unable to generate an answer at this time.";
  }
}

/**
 * Generates deep theological insights from multiple perspectives
 */
export async function generateTheologicalCommentaryWithClaude(
  verseText: string, 
  lens: string
): Promise<string> {
  // In development with no API key, return mock data
  if (!process.env.ANTHROPIC_API_KEY) {
    return getMockCommentary(lens);
  }
  
  try {
    const lensContext = getLensContext(lens);
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 350,
      system: `You are a theological expert providing insights on Bible verses from a ${lens} perspective.
      
      ${lensContext}
      
      Your commentary should:
      - Reflect authentic ${lens} theological understanding
      - Be respectful and reverent
      - Include relevant historical context
      - Connect to broader themes in scripture
      - Be concise (100-150 words)
      
      Aim for depth and clarity that would benefit a serious Bible student.`,
      messages: [
        {
          role: "user",
          content: `Provide theological commentary from a ${lens} perspective on this verse:
          
          "${verseText}"`
        }
      ],
    });

    // Check if content exists and extract the text
    if (response.content && response.content.length > 0) {
      // Handle the different content block types
      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        return contentBlock.text;
      }
    }
    
    return "Unable to generate commentary at this time.";
  } catch (error) {
    console.error("Error generating theological commentary with Claude:", error);
    return "Unable to generate commentary at this time.";
  }
}

// Helper functions for context and mock data

function getLensContext(lens: string): string {
  const contexts: Record<string, string> = {
    catholic: "The Catholic perspective draws on Church tradition, the Catechism, patristic writings, and magisterial teaching. Consider the sacramental worldview and the integration of scripture with tradition.",
    
    evangelical: "The Evangelical perspective emphasizes a high view of Scripture, personal faith, salvation through Christ alone, and the importance of a personal relationship with Jesus.",
    
    jewish: "The Jewish perspective draws on rabbinic tradition, Talmudic interpretation, and centuries of Jewish biblical commentary. Consider the historical Jewish context and traditional interpretation.",
    
    atheist: "The secular/historical perspective focuses on historical-critical analysis, archaeological evidence, comparative literature, and cultural anthropology, without assuming supernatural inspiration.",
    
    standard: "This balanced scholarly perspective draws from multiple traditions, focusing on historical context, literary analysis, and original meaning while respecting diverse faith perspectives."
  };
  
  return contexts[lens] || contexts.standard;
}

function getMockNarrative(book: string): string {
  if (book.toLowerCase() === "genesis") {
    return "<p>The earth was formless and empty, darkness stretched across the deep waters. The Spirit of God hovered over the surface, a presence amidst the void. Then came the divine decree that would begin all things: \"Let there be light.\" Immediately, radiance burst forth, separating itself from the darkness. God observed the light's goodness, establishing the first distinction in creation - light from darkness, day from night.</p><p>On the second day, God spoke again, commanding a vault to form and divide the waters. The atmosphere took shape, creating space between the waters below and the moisture above. God named this expanse \"sky,\" crafting the second fundamental boundary in the newborn cosmos.</p>";
  } else if (book.toLowerCase() === "proverbs") {
    return "<p>The evening shadows stretched long across the dusty path as Solomon, now in his later years but still possessing the sharp wisdom that had defined his reign, gathered his advisors. His eyes, having witnessed both the glory and folly of humankind, held a certain gravity as he began to speak.</p><p>\"My children,\" he said, his voice carrying through the chamber with practiced authority, \"what I share with you now is not merely advice, but wisdom purchased through years of communion with God Himself.\" He paused, ensuring every ear was attentive.</p>";
  } else {
    return "<p>The narrative would unfold here, bringing this chapter to life with historical context, sensory details, and flowing prose while maintaining complete theological accuracy.</p>";
  }
}

function getMockCommentary(lens: string): string {
  const commentaries: Record<string, string> = {
    catholic: "Catholic tradition interprets this verse through the lens of divine providence. The Church Fathers saw in these words an invitation to spiritual surrender, recognizing human intellect as subordinate to divine wisdom. This concept is reinforced in the Catechism's teaching on God's guidance of the faithful through both Scripture and Tradition.",
    
    evangelical: "From an Evangelical perspective, this verse speaks directly to the believer's personal relationship with Christ. The imperative to trust emphasizes faith as the foundation of Christian living, while the warning against self-reliance echoes throughout Scripture's call to depend on God's word rather than worldly reasoning.",
    
    jewish: "In Jewish tradition, this verse reflects the covenant relationship between God and Israel. The Hebrew word for 'trust' (batach) implies seeking refuge in God, while 'understanding' (binah) represents discernment derived from Torah study. Ancient rabbis viewed this teaching as central to a life of faith and mitzvot.",
    
    atheist: "From a historical-critical perspective, this proverb reflects ancient Near Eastern wisdom literature common throughout the region. Similar concepts appear in Egyptian wisdom texts, suggesting cultural exchange of philosophical ideas. The text emphasizes communal values over individualistic reasoning in its historical context.",
    
    standard: "This verse presents the fundamental principle that trust in divine wisdom should supersede human reasoning. The parallelism characteristic of Hebrew poetry reinforces this concept through repetition. Within its historical context, this teaching would have guided the Israelite community toward theocentric rather than anthropocentric decision-making."
  };
  
  return commentaries[lens] || commentaries.standard;
}