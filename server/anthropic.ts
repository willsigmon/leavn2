import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generates narrative versions of Bible chapters using Claude's advanced storytelling capabilities
 */
export async function generateNarrativeWithClaude(
  verses: string[],
  chapterInfo: { book: string; chapter: number }
): Promise<string> {
  try {
    // Return mock data if in development or missing API key
    if (process.env.NODE_ENV === 'development' && !process.env.ANTHROPIC_API_KEY) {
      return getMockNarrative(chapterInfo.book);
    }
    
    const combinedText = verses.join('\n\n');
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 3000,
      system: `You are a biblical narrative expert who transforms Scripture into immersive prose similar to the style of "The Chosen" TV series. 
      Your task is to rewrite the Bible verses into a compelling narrative that:
      1. Maintains complete theological accuracy and reverence
      2. Adds realistic dialogue and sensory details where appropriate
      3. Brings characters to life while preserving all spiritual meaning
      4. Uses vivid language that helps readers imagine they are there
      5. Preserves the distinct voice and themes of the book (${chapterInfo.book})
      
      Important:
      - NEVER change the meaning or theological content of the text
      - NEVER add modern slang or inappropriate language
      - NEVER add content that contradicts Scripture
      - Write in a style similar to "The Chosen" - faithful to Scripture but with added narrative elements
      - Return the entire narrative as one cohesive story, divided by appropriate paragraph breaks
      - Focus on making the text immersive, not academic`,
      messages: [
        {
          role: 'user',
          content: `Transform the following Bible verses from ${chapterInfo.book} chapter ${chapterInfo.chapter} into an immersive narrative similar to "The Chosen" TV series:\n\n${combinedText}`,
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error in generateNarrativeWithClaude:', error);
    return getMockNarrative(chapterInfo.book);
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
    // Return mock data if in development or missing API key
    if (process.env.NODE_ENV === 'development' && !process.env.ANTHROPIC_API_KEY) {
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

    return response.content[0].text;
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
    // Return mock data if in development or missing API key
    if (process.env.NODE_ENV === 'development' && !process.env.ANTHROPIC_API_KEY) {
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

function getLensContext(lens: string): { perspective: string; instructions: string } {
  const lensMap = {
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

function getMockNarrative(book: string): string {
  if (book.toLowerCase() === 'genesis') {
    return `In the vast emptiness before time began, God's Spirit hovered over the formless deep. "Let there be light," He commanded, His voice resonating through the void. Instantly, brilliant light burst forth, pushing back the darkness. God smiled at this beginning, this separation of light and shadow, and called the light "day" and the darkness "night."

On the second day, God's hands stretched out across the expanse, dividing the waters above from the waters below, creating space between them—the sky, a brilliant blue canvas stretching in all directions.

"Let the waters gather together," God declared on the third day. The seas roared and churned, drawing back to reveal dry ground. From this newly formed earth, God brought forth vegetation: tender grass sprouted from the soil, trees stretched their branches toward the heavens, flowers of every color unfurled their petals. Each plant contained seeds within itself, carrying the miracle of ongoing life.

On the fourth day, God adorned the heavens. With careful placement, He set the sun, a blazing orb of gold, to rule the day. The moon, silver and serene, He positioned to govern the night, surrounded by countless stars that sparkled like diamonds against the velvet sky.

The fifth day dawned with God's voice calling to the waters: "Bring forth living creatures." The seas suddenly teemed with life—sleek fish darting through coral, massive creatures breaching the surface, sending spray into the air. Above, birds of every kind soared through the sky, their wings catching the sunlight, their songs filling the air with melody.

When the sixth day arrived, God turned His attention to the land. "Let the earth bring forth living creatures." In response, animals appeared across the landscape—powerful lions stretching in the grass, swift deer bounding across plains, tiny insects crawling through rich soil.

Then God paused, a moment of divine reflection before His final creation. With special care, He formed Adam from the dust of the ground, breathing life into his nostrils. Adam's eyes opened, taking in the world around him with wonder as he felt the first beating of his heart.

God led Adam through the garden of Eden, a paradise of perfect beauty. "Name them," God invited as the animals were brought before Adam. With creativity inspired by his Creator, Adam gave each creature its perfect name.

Yet as twilight approached, a certain solemnness settled over Adam as he realized he alone had no companion. God, seeing this loneliness, caused a deep sleep to fall upon him. Taking one of Adam's ribs, God crafted with divine artistry, forming woman.

When Adam awoke, he beheld Eve standing before him, radiant in the garden's dappled light. His face lit with joy as he exclaimed, "At last! Bone of my bone and flesh of my flesh!" Their eyes met in the golden light of Eden, the first human gaze of love in a perfect world.

God blessed them both, saying, "Be fruitful and multiply. Fill the earth and tend to it." As the sun set on the sixth day, Adam and Eve walked hand in hand through their garden home, caretakers of creation, image-bearers of God Himself.

On the seventh day, God rested, beholding all He had made with divine satisfaction. The heavens and earth were complete in all their vast array, a testimony to the Creator's wisdom, power, and love.`;
  } else if (book.toLowerCase() === 'exodus') {
    return `The Egyptian sun beat down mercilessly as Moses wiped sweat from his brow, watching his fellow Hebrews struggle under the weight of mud bricks. Eighty years old now, the former prince of Egypt adjusted his shepherd's cloak, feeling out of place in the land he once called home. He had returned reluctantly, the memory of the burning bush still vivid in his mind—the voice of God commissioning him to a task that seemed impossible: "Let My people go."

Standing beside his brother Aaron outside Pharaoh's magnificent palace, Moses gripped his staff tightly, his weathered hands betraying his nervousness. "Remember," he whispered to Aaron, "speak exactly as we practiced. Pharaoh must understand these are not our words, but God's demands."

The throne room stretched before them, columns rising to dizzying heights, walls adorned with paintings of Egyptian gods. At the far end sat Pharaoh himself, adorned in gold and linen, his face a mask of arrogant indifference.

"The God of Israel says: 'Let My people go that they may hold a feast to Me in the wilderness,'" Aaron announced, his voice stronger than Moses had expected.

Pharaoh's laugh echoed off the stone walls. "Who is this God that I should obey His voice? I do not know your God, and I will not let Israel go." His eyes narrowed as he studied the two brothers. "In fact, you distract my laborers with your talk of freedom. From now on, they shall make the same quota of bricks, but they must gather their own straw!"

Later that day, in the brick-making fields, angry Hebrew foremen confronted Moses. "What have you done?" they demanded. "You've put a sword in Pharaoh's hand to kill us!"

Doubt crushed Moses' spirit as he walked away, his shoulders slumped under the weight of his apparent failure. That night, alone under the stars, he fell to his knees.

"Lord," he prayed, his voice breaking, "why have You brought trouble on this people? Why did You send me? Since I spoke to Pharaoh in Your name, he has done evil to this people, and You have not delivered them at all."

The heavens seemed silent, but within Moses' heart came the reassurance he desperately needed: "Now you will see what I will do to Pharaoh. Because of My mighty hand, he will let them go. Because of My mighty hand, he will drive them out of his land."

Days later, Moses stood at the bank of the Nile with Aaron, as instructed by God. The river flowed red with blood at the touch of Moses' staff—the first of ten devastating plagues that would break Pharaoh's will: blood, frogs, lice, flies, livestock death, boils, hail, locusts, darkness, and finally, the most terrible of all—the death of the firstborn.

As the tenth plague approached, Moses gathered the elders of Israel. "Take a lamb for each household," he instructed, his face solemn in the flickering lamplight. "A perfect lamb, without blemish. Slaughter it at twilight and take its blood. With a bunch of hyssop, paint the blood on the two doorposts and lintel of your homes." His eyes moved from face to face, ensuring they understood the gravity of his words. "The blood will be a sign. When the Lord sees the blood, He will pass over you, and the plague will not destroy you. This night will be remembered for all generations as the Lord's Passover."

That night, while the Hebrews huddled in their homes, eating the Passover meal with bitter herbs and unleavened bread, a cry arose throughout Egypt—a wail of grief as death visited every Egyptian house, from Pharaoh's palace to the poorest servant's dwelling.

Before dawn, Pharaoh's messengers pounded urgently on Moses' door. "Go!" came the royal command. "Take your people, your flocks, your herds—everything—and leave Egypt!"

Under a canopy of stars, six hundred thousand men, plus women and children, began their exodus from slavery. A pillar of cloud led them by day, and a pillar of fire illuminated their path by night. They were finally free, heading toward a promised land they had only heard about in ancient stories passed down through generations.

But freedom would come with trials they could not yet imagine, and the journey would forge a nation from a band of former slaves, guided by the God who had remembered His covenant and heard their cries.`;
  } else {
    return `As the sun cast long shadows across the Judean countryside, the air was thick with anticipation. Word had spread quickly through the villages—the teacher from Nazareth was coming. People from every walk of life gathered along the path, some climbing into sycamore trees for a better view, others pressing forward, desperate to catch a glimpse of the man whose words and deeds had stirred such hope.

Among them stood [characters from the chapter], their faces reflecting a mixture of curiosity, hope, and for some, skepticism. The struggles of daily life under Roman occupation had left many hardened, yet something about this teacher had awakened a long-dormant hope.

[Main events of the chapter narrativized in immersive prose, with added sensory details, realistic dialogue between biblical characters, and emotional responses while maintaining complete theological accuracy]

As Jesus finished speaking, a profound silence fell over the crowd. His words hung in the air, challenging, comforting, transforming. Some listeners wiped tears from their eyes, others exchanged meaningful glances, while a few turned away, unable to accept the implications of what they'd heard.

One woman clutched her child's hand tightly, whispering, "Remember this day. Remember what you have heard." The child nodded solemnly, somehow understanding that these were not merely the words of a man, but something far more significant—words of eternal life.

As the crowd slowly dispersed, the disciples gathered around Jesus, their faces showing they too were processing the weight of his teaching. Their journey was only beginning, and the path ahead would challenge everything they thought they understood about God's kingdom.`;
  }
}

function getMockCommentary(lens: string): string {
  switch (lens) {
    case 'protestant':
      return `From a Protestant perspective, this verse emphasizes the central doctrine of salvation by grace through faith. The text points us to the sufficiency of Christ's work on the cross, which Martin Luther described as "the great exchange" - our sin for His righteousness. 

This passage reminds us of the five Solas of the Reformation: Scripture alone (Sola Scriptura), Faith alone (Sola Fide), Grace alone (Sola Gratia), Christ alone (Solus Christus), and to the Glory of God alone (Soli Deo Gloria).

John Calvin might note here how this text reveals God's sovereignty in salvation, while simultaneously calling us to respond in faith. The great Protestant preacher Charles Spurgeon once said of similar passages that they are "diamonds of promise" that assure believers of God's unfailing commitment to His children.

The principle of the "priesthood of all believers" is also evident here, as we see that all Christians have direct access to God through Christ, without need of human intermediaries. This revolutionized the church during the Reformation and continues to be a cornerstone of Protestant theology today.

In practical application, this verse calls us to rest in Christ's finished work rather than striving to earn God's favor through works or rituals. It invites us to experience the freedom that comes from knowing salvation is God's gift, not our achievement.`;
      
    case 'catholic':
      return `From a Catholic perspective, this verse must be understood within the living Tradition of the Church and the broader context of Scripture. The Catechism of the Catholic Church reminds us that Sacred Scripture and Sacred Tradition together form one sacred deposit of the Word of God (CCC 97).

St. Augustine, whose writings have deeply influenced Catholic theology, commented on this passage by connecting it to the sacramental life of the Church. Through the sacraments, especially the Eucharist, we participate in the divine life mentioned here.

The Second Vatican Council's document Dei Verbum would interpret this text as revealing God's invitation to communion with the Trinity. This communion begins in baptism, is nourished by the Eucharist, and finds its fulfillment in the beatific vision.

Pope Francis, in his encyclical Lumen Fidei, might point to this verse as demonstrating the interplay between faith and works - we are saved by grace through faith, yet this faith necessarily expresses itself in charitable works and participation in the Church's sacramental life.

The Catholic tradition sees in this passage not only individual salvation but also the ecclesial dimension of our relationship with God. We are saved not merely as individuals but as members of the Body of Christ, the Church, which is "the universal sacrament of salvation" (CCC 849).

For Catholic faithful, this verse invites prayerful meditation within the rich context of the Church's liturgical life, where Scripture is proclaimed and made present in sacramental reality.`;
      
    case 'orthodox':
      return `Through the Eastern Orthodox lens, this verse speaks profoundly to the mystery of theosis - our participation in the divine nature through Christ. As St. Athanasius famously stated, "God became man so that man might become god" - not in essence, but by grace through communion with the Divine Energies.

The Church Fathers, particularly St. John Chrysostom, would emphasize how this passage reveals God's philantropia (love of humanity) that makes possible our deification. This is not merely forensic justification but a genuine transformation of our nature through synergy with Divine Grace.

Orthodox theology sees in this text the cosmic dimension of salvation - not merely the forgiveness of sins but the restoration and transformation of all creation. The icons in our churches depict this reality visually, where gold leaf represents the uncreated light of divine glory that permeates all things.

For the Orthodox faithful, this verse would be understood not primarily through intellectual analysis but through liturgical experience and noetic contemplation. When we participate in the Divine Liturgy, we enter the reality described here, tasting of the heavenly kingdom while still in this world.

The Jesus Prayer ("Lord Jesus Christ, Son of God, have mercy on me, a sinner"), practiced with attention in the heart, helps open the nous (spiritual intellect) to receive the truth of this passage beyond mere rational understanding.

This scripture reminds us that salvation is not individualistic but ecclesial - we are saved in community, within the Body of Christ, where the Holy Mysteries (sacraments) make present the reality of what this verse proclaims.`;
      
    case 'jewish':
      return `From a Jewish perspective, this passage from Tanakh should be understood within the covenantal relationship between HaShem and the people Israel. The rabbis of the Talmudic period engaged with this text through midrashic interpretation, finding layers of meaning beyond the peshat (simple meaning).

Rashi might point out linguistic nuances in the Hebrew text that reveal connections to the Torah's broader themes of covenant loyalty and divine chesed (lovingkindness). The medieval commentator Maimonides would likely connect this verse to his understanding of divine providence and human moral responsibility.

The concept of tikkun olam (repairing the world) can be seen in this passage, as it calls the Jewish people to partner with HaShem in bringing creation to its intended fulfillment. This has practical implications for Jewish ethics and social responsibility.

In the Hasidic tradition, the Baal Shem Tov might interpret this verse as revealing the divine sparks present throughout creation, waiting to be elevated through mindful observance of mitzvot (commandments) and kavvanah (intentionality) in prayer.

Within Jewish practice, this text might be studied in chevruta (paired learning), where partners vigorously debate interpretations, or in the context of weekly Torah study. The yearly cycle of Torah readings places this passage within the larger narrative of Israel's relationship with HaShem.

This verse reminds us of our responsibility to live as a "kingdom of priests and a holy nation" (Exodus 19:6), bearing witness to HaShem's covenant faithfulness through observance of Torah and acts of gemilut chasadim (loving-kindness).`;
      
    case 'academic':
      return `From a historical-critical perspective, this passage must be examined in its original linguistic, historical, and cultural contexts. The text shows evidence of redaction, with vocabulary characteristic of the post-exilic period, suggesting later editorial shaping of possibly earlier tradition material.

Analyzing the Hebrew/Greek terms reveals important nuances: [specific term] carries connotations in Ancient Near Eastern literature beyond its common English translation. Comparative studies with contemporaneous texts from Mesopotamia and Ugarit reveal conceptual parallels that illuminate the author's theological framework.

Archaeological findings at sites related to this text provide material culture context that enhances our understanding. Particularly significant are discoveries from the [relevant archaeological period] that correspond with social practices referenced here.

From a form-critical standpoint, this passage fits the genre pattern of [specific form], which typically served [specific function] in ancient Israelite/early Christian communities. Source criticism suggests possible influence from [specific tradition].

Various interpretive traditions have approached this text differently. The Alexandrian school emphasized its allegorical dimensions, while Antiochene interpreters focused on its historical meaning. Modern liberation theologians have highlighted its implications for social justice, while feminist scholars have noted [specific gender-related observations].

Contemporary scholarship remains divided on several aspects of this passage, particularly [specific scholarly debate]. Recent work by [scholar] suggests a reevaluation of traditional interpretations based on new linguistic evidence and socio-historical reconstruction.

This text ultimately reflects the religious perspectives of its ancient authors and their communities, providing valuable insight into their theological worldview and development of religious thought in its historical context.`;
      
    case 'devotional':
      return `This verse speaks directly to our deepest needs and longings. When we feel overwhelmed by life's challenges, these words remind us that God is intimately aware of our struggles and has provided exactly what we need.

Think about a time when you felt completely depleted—perhaps facing a health crisis, relationship breakdown, or financial strain. This passage assures us that God's strength is made perfect in our weakness. When we come to the end of ourselves, we discover the beginning of His sufficiency.

The phrase [key phrase from verse] is particularly meaningful because it connects to the character of God as revealed throughout Scripture. This isn't a conditional promise but an expression of God's very nature. He doesn't help us because we've earned it, but because of who He is—merciful, compassionate, and faithful.

I'm reminded of [personal anecdote or well-known Christian story] that illustrates this truth. Similarly, in your life, God wants to [practical application of the verse's principle].

As you go through your day today, try this simple practice: whenever you feel anxious or inadequate, pause and speak this verse aloud. Let its truth sink from your mind into your heart. Notice how your perspective shifts when you filter your circumstances through the lens of God's promises.

Consider journaling about a specific area where you need to experience this truth. What would it look like to fully trust God in that situation? What step of faith might He be asking you to take?

This verse isn't just ancient wisdom—it's a living word meant to transform your daily experience as you walk with God. His invitation is always to come closer, trust more fully, and experience His power working in and through you.`;
      
    case 'genz':
      return `Okay, so this verse is actually super relevant to what we're all going through right now. It's basically God saying, "I see you" in a world where everyone's trying to be seen on social media but still feeling invisible.

Think about it - how many times have you posted something hoping for validation but still felt empty afterward? This passage is calling out that whole experience and offering something way more authentic.

The original audience was dealing with their own version of chaos - political oppression, economic inequality, identity struggles - sound familiar? They were asking "Does anyone actually care?" just like we do when we're scrolling through perfectly filtered lives while dealing with our own unfiltered reality.

What hits different about this verse is how it speaks to mental health. With anxiety and depression affecting so many of us, these words offer a different perspective than just "good vibes only" toxic positivity. It acknowledges the struggle but doesn't leave us there.

When [specific phrase from verse] hits you, it's like that rare moment when someone really gets you - not just double-tapping your post but actually understanding your story. God's essentially saying, "I'm not just watching your stories, I'm in your story."

This isn't about religious performance or passing some spiritual vibe check. It's about a relationship that meets you exactly where you are - doom-scrolling at 2 AM, questioning everything, or just trying to make it through another day.

Try sitting with this verse next time you're feeling overwhelmed. Maybe screenshot it or put it in your Notes app. Let it be a reminder that you're seen beyond the filters, known beyond your follower count, and valued beyond your achievements.`;
      
    case 'kids':
      return `Have you ever felt scared during a thunderstorm? This Bible verse is like God saying, "Don't worry, I'm right here with you!"

God is like the best superhero ever - He's always watching over you, even when you're sleeping! He never gets tired or takes a day off from caring about you.

Think about your favorite stuffed animal or blanket that makes you feel safe. God's love is like that, but even better because He's strong enough to handle ANY problem, even the really big ones that grown-ups worry about.

The person who wrote this part of the Bible wanted to remind everyone that God is both super powerful AND super kind. That's an amazing combination! It's like having the strongest, nicest friend who always has your back.

Here's something fun to try: Draw a picture of yourself with God watching over you. Maybe draw Him as a big protective shield around you, or like a loving parent holding your hand. This can help you remember that God is always taking care of you.

Next time you feel worried about something - like a big test at school or when someone is being mean - you can whisper this verse to yourself. It's like having a special secret that can help you be brave!

God loves each one of us in a special way - kind of like how your parents know exactly what foods you like and don't like, or which stories you want to hear at bedtime. But God knows even MORE about you, and He never, ever stops loving you!`;
      
    default:
      return `This verse reveals profound spiritual truth that connects to our daily lives. The words speak to both the mind and heart, challenging us to deeper faith and understanding.

On reflection, we can see parallels to other passages in Scripture that reinforce these principles. The consistent message throughout God's Word is one of His faithfulness and our response in faith.

The original context helps illuminate the meaning - the author was addressing a community facing specific challenges, yet the truth conveyed transcends that historical situation to speak to believers in every generation.

This passage invites us to examine our own lives and consider how we might more fully embrace its teaching. What areas of your life might need to be reoriented in light of this truth?

As we meditate on these words, we can find both comfort and challenge - comfort in God's unchanging character and challenge in His call to faithful discipleship.

In practical terms, this verse guides us toward greater spiritual maturity and more authentic relationship with God and others. It reminds us that our faith journey is both deeply personal and inherently communal.

May these words take root in our hearts and bear fruit in our lives as we seek to follow Christ more faithfully each day.`;
  }
}