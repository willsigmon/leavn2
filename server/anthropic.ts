import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generates narrative versions of Bible chapters using Claude's advanced storytelling capabilities
 * @param book The Bible book (e.g., 'Genesis')
 * @param chapter The chapter number
 * @param styleOption The narrative style to use ('chosen', 'firstperson', 'modern', etc.)
 * @returns A structured narrative object with content and metadata
 */
export async function generateNarrativeWithClaude(
  book: string,
  chapter: string,
  styleOption: string = 'chosen'
): Promise<any> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return getMockNarrative(book, styleOption);
    }

    // Get style-specific instructions
    const styleInstructions = getNarrativeStyleInstructions(styleOption);
    
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 3000,
      system: `You are a biblical storyteller who transforms Bible passages into vivid narrative prose while maintaining theological accuracy. 
      
For the passage ${book} ${chapter}, create an engaging narrative that is faithful to the original text but presents it in a more immersive storytelling format ${styleInstructions.description}.

${styleInstructions.instructions}

Return your response as a JSON object with the following structure:
{
  "title": "A captivating title for this narrative section",
  "content": "The main narrative text...",
  "characters": ["Character1", "Character2"], 
  "notes": "Brief contextual or directorial notes about this passage"
}`,
      messages: [
        {
          role: "user",
          content: `Transform the Bible passage ${book} ${chapter} into an immersive narrative scene using the ${styleInstructions.name} style. Make it deeply engaging while remaining faithful to the biblical account.`
        }
      ],
    });

    try {
      // Try to parse the response as JSON
      const content = response.content[0];
      // Check if we have text content
      const textContent = 'text' in content ? content.text : JSON.stringify(content);
      // Look for JSON within triple backticks if present
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || 
                       textContent.match(/```\n([\s\S]*?)\n```/);
      
      const jsonStr = jsonMatch ? jsonMatch[1] : textContent;
      const narrativeContent = JSON.parse(jsonStr);
      
      // Add the style information
      return {
        ...narrativeContent,
        style: styleOption,
        styleName: styleInstructions.name
      };
    } catch (error) {
      console.error("Error parsing narrative JSON:", error);
      // If parsing fails, return the raw text in our format
      return {
        title: `${book} ${chapter} Narrative`,
        content: response.content[0].text,
        characters: [],
        style: styleOption,
        styleName: styleInstructions.name
      };
    }
  } catch (error) {
    console.error("Error generating narrative with Claude:", error);
    return getMockNarrative(book, styleOption);
  }
}

/**
 * Generates insightful answers to contextual questions about Bible verses
 */
export async function generateContextualAnswerWithClaude(
  verseText: string,
  question: string
): Promise<string> {
  try {
    // Return mock data if missing API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return `This would be an insightful answer about "${verseText}" addressing the question: "${question}"`;
    }
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1000,
      system: `You are a biblical scholar with expertise in history, archaeology, theology, linguistics, and cultural context.
      Your role is to answer questions about Bible verses with deep insight, accuracy, and multiple perspectives.
      
      When answering:
      1. Consider historical context, original language nuances, and cultural background
      2. Present diverse theological perspectives when relevant (Protestant, Catholic, Orthodox, Jewish)
      3. Be balanced and fair to different interpretations
      4. Avoid denominational bias while respecting traditional interpretations
      5. Provide rich, thoughtful analysis that enhances understanding
      
      Important:
      - Use accessible language but don't oversimplify complex concepts
      - Maintain a reverent, scholarly tone appropriate for Bible study
      - Cite relevant cross-references when helpful
      - Focus on informative content that enriches the user's understanding`,
      messages: [
        {
          role: 'user',
          content: `I'm studying this Bible verse: "${verseText}"\n\nMy question is: ${question}\n\nCan you help me understand this better?`,
        },
      ],
    });

    const content = response.content[0];
    return 'text' in content ? content.text : JSON.stringify(content);
  } catch (error) {
    console.error('Error in generateContextualAnswerWithClaude:', error);
    return `This would be an insightful answer about "${verseText}" addressing the question: "${question}"`;
  }
}

/**
 * Generates deep theological insights from multiple perspectives
 */
export async function generateTheologicalCommentaryWithClaude(
  verseText: string,
  lens: string
): Promise<string> {
  try {
    // Return mock data if missing API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return getMockCommentary(lens);
    }
    
    const lensContext = getLensContext(lens);
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1500,
      system: `You are a biblical commentator specializing in ${lensContext.perspective} interpretations.
      Your task is to provide a thoughtful, reverent commentary on Bible verses from this specific perspective.
      
      Your commentary should:
      1. Reflect the distinct theological emphases of the ${lensContext.perspective} tradition
      2. Include relevant insights from key ${lensContext.perspective} thinkers and scholars
      3. Connect the verse to broader themes in Scripture
      4. Maintain appropriate tone and language for ${lensContext.perspective} readers
      5. Offer practical application when appropriate
      
      ${lensContext.instructions}
      
      Important:
      - Stay faithful to the ${lensContext.perspective} interpretive tradition
      - Maintain reverence and respect for Scripture
      - Provide depth while remaining accessible
      - Focus on edification and understanding`,
      messages: [
        {
          role: 'user',
          content: `Please provide a ${lensContext.perspective} commentary on this Bible verse:\n\n"${verseText}"`,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error in generateTheologicalCommentaryWithClaude:', error);
    return getMockCommentary(lens);
  }
}

/**
 * Get the theological lens context for commentaries
 */
function getLensContext(lens: string): { perspective: string; instructions: string } {
  const lensMap: Record<string, { perspective: string; instructions: string }> = {
    'protestant': {
      perspective: 'Protestant',
      instructions: 'Emphasize salvation by faith alone, the authority of Scripture, and the priesthood of all believers. Reference key Protestant thinkers like Luther, Calvin, Wesley, or modern evangelical scholars when appropriate.'
    },
    'catholic': {
      perspective: 'Catholic',
      instructions: 'Incorporate Church tradition, magisterial teaching, and sacramental theology. Reference Church fathers, papal encyclicals, Catholic Catechism, and Catholic theologians when appropriate.'
    },
    'orthodox': {
      perspective: 'Eastern Orthodox',
      instructions: 'Highlight theosis (deification), the mystical tradition, liturgical significance, and the Church Fathers. Use concepts like divine energies, icons, and the nous when relevant.'
    },
    'jewish': {
      perspective: 'Jewish',
      instructions: 'For Hebrew Bible/Tanakh verses only. Focus on rabbinic interpretations, Midrash, Talmudic perspectives, and Jewish practice. Avoid Christological readings entirely.'
    },
    'academic': {
      perspective: 'Academic',
      instructions: 'Provide a scholarly analysis including historical-critical method, literary analysis, archaeological context, and comparative ancient Near Eastern perspectives. Present multiple interpretations objectively.'
    },
    'devotional': {
      perspective: 'Devotional',
      instructions: 'Focus on personal application, spiritual formation, and practical wisdom. Use accessible language and relatable examples while maintaining theological depth.'
    },
    'genz': {
      perspective: 'Contemporary Youth',
      instructions: 'Use language that resonates with Gen Z and younger millennials. Connect Scripture to current cultural issues, digital life, and contemporary challenges while maintaining theological integrity. Use relevant metaphors and examples.'
    },
    'kids': {
      perspective: 'Children',
      instructions: 'Use simple language appropriate for children ages 7-12. Focus on concrete examples, memorable lessons, and clear explanations. Avoid complex theology while maintaining accuracy.'
    }
  };
  
  return lensMap[lens] || lensMap['devotional'];
}

/**
 * Get the instructions for each narrative style
 */
function getNarrativeStyleInstructions(style: string): { name: string; description: string; instructions: string } {
  const styleMap: Record<string, { name: string; description: string; instructions: string }> = {
    'chosen': {
      name: 'The Chosen Style',
      description: 'similar to the TV series "The Chosen"',
      instructions: 'Use the storytelling approach similar to "The Chosen" TV series - faithful to Scripture but with added sensory details, realistic dialogue, and emotional depth. Make the biblical characters feel like real people while maintaining complete theological accuracy.'
    },
    'firstperson': {
      name: 'First Person Perspective',
      description: 'written from a character\'s first-person viewpoint',
      instructions: 'Write from the first-person perspective of a main character in the passage. Show their thoughts, feelings, and direct experiences. For narratives with multiple key figures, choose the most central character or the one with the most to learn/experience.'
    },
    'modern': {
      name: 'Modern Retelling',
      description: 'set in contemporary times while preserving the spiritual message',
      instructions: 'Reimagine the passage in a modern setting with contemporary analogues to biblical situations, while carefully preserving the spiritual truths and theological meaning. Use modern speech patterns and situations that illuminate the original meaning.'
    },
    'cinematic': {
      name: 'Cinematic Screenplay',
      description: 'written in vivid, visual scene descriptions',
      instructions: 'Write in a cinematic style with rich visual descriptions, scene setting, and sensory details. Focus on how this would appear on screen, with special attention to lighting, sound, facial expressions, and environment.'
    },
    'novelization': {
      name: 'Literary Novelization',
      description: 'with rich literary prose and character development',
      instructions: 'Create a literary novelization with richer character development, internal monologues, extended dialogue, and narrative complexity. Use techniques like foreshadowing, symbolism, and thematic depth while remaining faithful to the biblical account.'
    }
  };
  
  return styleMap[style] || styleMap['chosen'];
}

/**
 * Generate mock narrative content for testing
 */
function getMockNarrative(book: string, style: string = 'chosen'): any {
  const styleInfo = getNarrativeStyleInstructions(style);
  
  // Genesis mock narratives for different styles
  if (book.toLowerCase() === 'genesis') {
    // Return structured data for the narrative
    return {
      title: "The Creation of All Things",
      content: `In the vast emptiness before time began, God's Spirit hovered over the formless deep. "Let there be light," He commanded, His voice resonating through the void. Instantly, brilliant light burst forth, pushing back the darkness. God smiled at this beginning, this separation of light and shadow, and called the light "day" and the darkness "night."

On the second day, God's hands stretched out across the expanse, dividing the waters above from the waters below, creating space between them—the sky, a brilliant blue canvas stretching in all directions.

"Let the waters gather together," God declared on the third day. The seas roared and churned, drawing back to reveal dry ground. From this newly formed earth, God brought forth vegetation: tender grass sprouted from the soil, trees stretched their branches toward the heavens, flowers of every color unfurled their petals. Each plant contained seeds within itself, carrying the miracle of ongoing life.

On the fourth day, God adorned the heavens. With careful placement, He set the sun, a blazing orb of gold, to rule the day. The moon, silver and serene, He positioned to govern the night, surrounded by countless stars that sparkled like diamonds against the velvet sky.

The fifth day dawned with God's voice calling to the waters: "Bring forth living creatures." The seas suddenly teemed with life—sleek fish darting through coral, massive creatures breaching the surface, sending spray into the air. Above, birds of every kind soared through the sky, their wings catching the sunlight, their songs filling the air with melody.`,
      characters: ["God", "Adam", "Eve"],
      notes: "This narrative retelling maintains the seven-day creation structure while adding sensory details and dialogue to make the account more immersive.",
      style: style,
      styleName: styleInfo.name
    };
  } else if (book.toLowerCase() === 'exodus') {
    return {
      title: "The Call of Moses",
      content: `The Egyptian sun beat down mercilessly as Moses wiped sweat from his brow, watching his fellow Hebrews struggle under the weight of mud bricks. Eighty years old now, the former prince of Egypt adjusted his shepherd's cloak, feeling out of place in the land he once called home. He had returned reluctantly, the memory of the burning bush still vivid in his mind—the voice of God commissioning him to a task that seemed impossible: "Let My people go."`,
      characters: ["Moses", "Aaron", "Pharaoh", "God"],
      notes: "This narrative focuses on Moses' internal conflict as he returns to Egypt, having lived as both prince and shepherd, now called to be a liberator.",
      style: style,
      styleName: styleInfo.name
    };
  } else {
    // Generic mock narrative for other books
    return {
      title: `${book} Narrative`,
      content: `This would be an immersive narrative retelling of ${book} in the ${styleInfo.name} style.`,
      characters: ["Various Biblical Figures"],
      notes: `A ${styleInfo.name} narrative of this passage would emphasize characters, dialogue, and sensory details while maintaining theological accuracy.`,
      style: style,
      styleName: styleInfo.name
    };
  }
}

/**
 * Generate mock commentary for testing
 */
function getMockCommentary(lens: string): string {
  switch (lens) {
    case 'protestant':
      return `From a Protestant perspective, this verse emphasizes the central doctrine of salvation by grace through faith. The text points us to the sufficiency of Christ's work on the cross, which Martin Luther described as "the great exchange" - our sin for His righteousness.`;
    case 'catholic':
      return `From a Catholic perspective, this verse must be understood within the living Tradition of the Church and the broader context of Scripture. The Catechism of the Catholic Church reminds us that Sacred Scripture and Sacred Tradition together form one sacred deposit of the Word of God.`;
    case 'orthodox':
      return `Through the Eastern Orthodox lens, this verse speaks profoundly to the mystery of theosis - our participation in the divine nature through Christ. As St. Athanasius famously stated, "God became man so that man might become god" - not in essence, but by grace through communion with the Divine Energies.`;
    case 'jewish':
      return `From a Jewish perspective, this passage from Tanakh should be understood within the covenantal relationship between HaShem and the people Israel. The rabbis of the Talmudic period engaged with this text through midrashic interpretation, finding layers of meaning beyond the peshat (simple meaning).`;
    case 'academic':
      return `From a historical-critical perspective, this passage must be examined in its original linguistic, historical, and cultural contexts. The text shows evidence of redaction, with vocabulary characteristic of the post-exilic period, suggesting later editorial shaping of possibly earlier tradition material.`;
    case 'genz':
      return `So this verse is basically saying that God's got your back, no matter what. It's like when your friend sticks with you through all the drama, except God's commitment is on a whole other level. Think about it - in a world full of ghosting and fake relationships, God's like "I'm here for the long haul."`;
    case 'kids':
      return `God loves you very much! This verse is like a special promise that God made. It's like when your mom or dad promises to pick you up after school - you know they'll be there! God always keeps His promises, even when things seem hard or scary.`;
    default:
      return `This passage invites us to reflect on our relationship with God and how it affects our daily lives. As we meditate on these words, we might ask ourselves how this truth could transform our perspective on current challenges we're facing.`;
  }
}