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
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
