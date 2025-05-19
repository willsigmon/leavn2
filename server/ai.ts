// This file handles AI-related functionality using OpenAI's API
import OpenAI from "openai";

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key-for-development",
});

/**
 * Generate commentary on a Bible verse using the specified lens
 */
export async function generateCommentary(verseText: string, lens: string): Promise<string> {
  // In development mode, return mock commentary
  if (process.env.NODE_ENV !== "production" || !process.env.OPENAI_API_KEY) {
    return getMockCommentary(lens);
  }

  try {
    // Using OpenAI's "gpt-4.1-mini" model; do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // As specified in requirements
      messages: [
        {
          role: "system",
          content: getSystemPromptForLens(lens)
        },
        {
          role: "user",
          content: `Generate a concise, insightful commentary (80-120 words) on this Bible verse from a ${lens} perspective: "${verseText}"`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Unable to generate commentary.";
  } catch (error) {
    console.error("Error generating commentary with OpenAI:", error);
    return "We're experiencing technical difficulties with our commentary generation.";
  }
}

/**
 * Generate translations for a Bible verse in different styles
 */
export async function generateTranslation(verseText: string): Promise<{genz: string, kids: string}> {
  // In development mode, return mock translations
  if (process.env.NODE_ENV !== "production" || !process.env.OPENAI_API_KEY) {
    return {
      genz: "No cap, trust God completely and don't just rely on your own vibes;",
      kids: "Trust God with your whole heart and don't just use your own brain to figure things out;"
    };
  }

  try {
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // As specified in requirements
      messages: [
        {
          role: "system",
          content: `You translate Bible verses into different styles. 
          For Gen-Z style: Use appropriate Gen-Z slang, casual language, and contemporary references while maintaining the core meaning.
          For Kids style: Use simple vocabulary appropriate for children ages 6-10, short sentences, and concrete examples.`
        },
        {
          role: "user",
          content: `Translate this Bible verse into both Gen-Z and Kids styles. Return a JSON object with 'genz' and 'kids' keys: "${verseText}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      genz: result.genz || "Translation unavailable",
      kids: result.kids || "Translation unavailable"
    };
  } catch (error) {
    console.error("Error generating translations with OpenAI:", error);
    return {
      genz: "Translation unavailable",
      kids: "Translation unavailable"
    };
  }
}

/**
 * Generate narrative mode for a chapter
 */
export async function generateNarrativeMode(verses: string[], chapterInfo: { book: string, chapter: number }): Promise<string> {
  // In development mode, return mock narrative
  if (process.env.NODE_ENV !== "production" || !process.env.OPENAI_API_KEY) {
    return "The evening shadows stretched long across the dusty path as Solomon, now in his later years but still possessing the sharp wisdom that had defined his reign, gathered his advisors. His eyes, having witnessed both the glory and folly of humankind, held a certain gravity as he began to speak. \"My children,\" he said, his voice carrying through the chamber with practiced authority, \"what I share with you now is not merely advice, but wisdom purchased through years of communion with God Himself.\" He paused, ensuring every ear was attentive. \"Trust in the LORD with all your heart,\" he continued, his tone softening with reverence at the mention of the divine name. \"Do not rely on your own understanding, for it is limited by mortal perspective.\" Solomon's gaze swept across the faces before him, seeing in some the same prideful resistance he had once harbored in his youth. \"In everything you do, acknowledge Him,\" he urged, remembering how his own paths had gone awry when he failed this very principle. \"Make Him the center of every decision, every ambition, and He will make your paths straight – not always easy, but true and righteous.\"";
  }
  
  try {
    const fullText = verses.join(" ");
    
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // As specified in requirements
      messages: [
        { 
          role: "system", 
          content: `You are a biblical narrative expert who transforms Bible chapters into immersive, novel-style prose while maintaining absolute theological accuracy. 
          
          Guidelines:
          - Rewrite the chapter as flowing literary prose without verse breaks
          - Expand scenes with historically grounded, theologically sound details
          - Add sensory details, settings, character emotions, and cultural context
          - Maintain complete spiritual reverence - no heresy or theological errors
          - Keep the narrative style similar to quality historical fiction (like works by Francine Rivers or Dan Brown's attention to detail)
          - Do not add your own theological interpretation beyond what's necessary to bridge contextual gaps
          - Ensure the narrative flows naturally as a cohesive story
          - If the passage is poetic or wisdom literature, adapt your approach accordingly while maintaining the immersive quality
          
          Your goal is to make the scripture come alive while remaining absolutely faithful to the original text's meaning.`
        },
        { 
          role: "user", 
          content: `Transform this chapter (${chapterInfo.book} ${chapterInfo.chapter}) into immersive narrative prose:

          ${fullText}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Unable to generate narrative mode.";
  } catch (error) {
    console.error("Error generating narrative mode:", error);
    return "Unable to generate narrative mode at this time.";
  }
}

/**
 * Generate "Did You Know" facts about a verse
 */
export async function generateDidYouKnow(verseText: string, book: string, chapter: number, verse: number): Promise<string> {
  // In development mode, return mock facts
  if (process.env.NODE_ENV !== "production" || !process.env.OPENAI_API_KEY) {
    return "The Hebrew word for 'trust' in this verse is 'batach,' which implies resting in safety and security. In ancient Hebrew culture, trust wasn't merely a feeling but a committed action.";
  }
  
  try {
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // As specified in requirements
      messages: [
        { 
          role: "system", 
          content: `You are a biblical scholar with expertise in ancient languages, history, archaeology, and cultural practices of biblical times. Provide fascinating, accurate "Did You Know" trivia about this verse focusing on:
          
          - Original language insights (Hebrew, Greek, Aramaic)
          - Cultural customs of the time
          - Historical context
          - Word origins or etymologies
          - Archaeological findings
          - Ancient Near Eastern connections
          - Interesting numerology or symbolism
          - Historical reception or impact
          
          Keep your response to 2-3 sentences, focusing on the most interesting and academically sound information that would surprise most readers.`
        },
        { 
          role: "user", 
          content: `Provide a "Did You Know" fact for ${book} ${chapter}:${verse}:
          
          "${verseText}"`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Unable to generate a fact.";
  } catch (error) {
    console.error("Error generating Did You Know fact:", error);
    return "Unable to generate a fact at this time.";
  }
}

/**
 * Generate contextual question answers
 */
export async function generateContextualAnswer(verseText: string, question: string): Promise<string> {
  // In development mode, return mock answer
  if (process.env.NODE_ENV !== "production" || !process.env.OPENAI_API_KEY) {
    return "In the first-century Jewish context, this verse would have resonated deeply with the Jewish tradition of complete reliance on God's wisdom over human reasoning. The phrase 'lean not on your own understanding' would have been understood through the lens of Torah study, where divine wisdom was considered vastly superior to human intellect.";
  }
  
  try {
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // As specified in requirements
      messages: [
        { 
          role: "system", 
          content: `You are a biblical scholar with expertise in historical-cultural context, ancient languages, and theological traditions. Provide clear, academically sound answers to contextual questions about Bible verses.
          
          Your answers should be:
          - Historically accurate and well-researched
          - Sensitive to the original context and meaning
          - Free from modern anachronisms
          - Balanced in perspective
          - Concise but thorough (3-4 sentences)
          
          Draw upon archaeological findings, primary historical sources, linguistic insights, and scholarly consensus in your response.`
        },
        { 
          role: "user", 
          content: `For this verse: "${verseText}"
          
          Answer this contextual question: "${question}"`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Unable to generate an answer.";
  } catch (error) {
    console.error("Error generating contextual answer:", error);
    return "Unable to generate an answer at this time.";
  }
}

/**
 * Generate AI artwork for a chapter
 */
export async function generateArtwork(chapterSummary: string): Promise<{ url: string }> {
  // In development mode, return mock artwork URL
  if (process.env.NODE_ENV !== "production" || !process.env.OPENAI_API_KEY) {
    return { url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format" };
  }
  
  try {
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a sacred, serene, minimalist artwork representing this Bible chapter: ${chapterSummary}. 
      
      Style guidelines:
      - Calm, peaceful palette with subtle lighting
      - Simple, clean composition with clear focal point
      - Aesthetic resembling Dwell + Calm + Notion apps - modern, soothing, elegant
      - Avoid depicting God or Jesus directly
      - No text or verse references in the image
      - Subtle bread/leaven metaphors may be incorporated where appropriate
      - Style should feel timeless, sacred yet contemporary
      - Image should work well as a chapter header in a Bible app
      
      The image should convey spiritual depth while remaining visually minimal.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    // Safely handle potential undefined values
    const imageUrl = response.data && 
                    Array.isArray(response.data) && 
                    response.data.length > 0 && 
                    response.data[0].url
                      ? response.data[0].url
                      : "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format";
    
    return { url: imageUrl };
  } catch (error) {
    console.error("Error generating artwork:", error);
    return { url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format" };
  }
}

/**
 * Search for verses using semantic understanding
 */
export async function searchVerses(query: string) {
  // In development mode, return mock search results
  if (process.env.NODE_ENV !== "production" || !process.env.OPENAI_API_KEY) {
    return [
      { id: "v5", reference: "Proverbs 3:5", text: "Trust in the LORD with all your heart and lean not on your own understanding;" },
      { id: "v6", reference: "Proverbs 3:6", text: "in all your ways submit to him, and he will make your paths straight." }
    ];
  }

  try {
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    // Implement actual verse search with embedding and pgvector
    // This would involve generating an embedding for the query and
    // searching the vector database for similar verses
    
    // Mock results for now
    return [
      { id: "v5", reference: "Proverbs 3:5", text: "Trust in the LORD with all your heart and lean not on your own understanding;" },
      { id: "v6", reference: "Proverbs 3:6", text: "in all your ways submit to him, and he will make your paths straight." }
    ];
  } catch (error) {
    console.error("Error searching verses:", error);
    throw new Error("Failed to search verses");
  }
}

// Helper functions for mock data or prompts

function getSystemPromptForLens(lens: string): string {
  const prompts: Record<string, string> = {
    catholic: "You are a Catholic theologian and biblical scholar with expertise in Church tradition, the Catechism, and patristic writings. Provide commentary through a Catholic lens, incorporating Church teaching.",
    
    evangelical: "You are an Evangelical biblical scholar with a high view of Scripture. Provide commentary through an Evangelical Protestant lens, emphasizing personal faith, Biblical authority, and practical application.",
    
    jewish: "You are a Jewish rabbi and Torah scholar with expertise in both ancient and modern Jewish interpretation. Provide commentary through a Jewish lens, drawing on rabbinic teachings and Talmudic insights.",
    
    genz: "You are a youth pastor and theologian who specializes in connecting with Generation Z. Explain biblical passages using contemporary references, relatable examples, and casual language while maintaining theological depth.",
    
    kids: "You are a children's ministry expert who specializes in explaining complex theological concepts to children ages 6-10. Use simple language, concrete examples, and relatable scenarios.",
    
    standard: "You are a scholarly biblical commentator with expertise across multiple traditions. Provide balanced, historically-informed commentary that focuses on the original context and meaning of the text."
  };
  
  return prompts[lens] || prompts.standard;
}

function getMockCommentary(lens: string): string {
  const commentaries: Record<string, string> = {
    catholic: "Catholic tradition sees this verse as emphasizing God's providence and guidance. The Church teaches that submitting to God means following His will as revealed through Scripture, Tradition, and the Magisterium, leading to a righteous path.",
    
    evangelical: "Evangelical interpretation emphasizes personal relationship with Christ and direct guidance through prayer and Bible study. \"Making paths straight\" is seen as God removing obstacles and directing the believer's life decisions.",
    
    jewish: "In Jewish tradition, this verse reflects the deep relationship between faith and action. The Hebrew concept of 'trust' involves not just belief but active commitment to God's commands as laid out in Torah, bringing divine guidance to one's path.",
    
    genz: "Real talk - this verse is all about ditching the mindset that you've got everything figured out. When you trust God 100% instead of your own limited perspective, He'll clear the roadblocks and guide your journey better than any GPS ever could.",
    
    kids: "Think of God like a perfect GPS! When you trust Him completely instead of trying to find your own way, He'll make sure you don't get lost. It's like letting your parent hold your hand in a crowded place instead of running off on your own.",
    
    standard: "This verse emphasizes the internalization of virtues. The metaphor of binding them \"around your neck\" suggests wearing them as ornaments—visible to others—while writing them \"on the tablet of your heart\" speaks to making them part of your inner character."
  };
  
  return commentaries[lens] || "Commentary not available for this perspective.";
}
