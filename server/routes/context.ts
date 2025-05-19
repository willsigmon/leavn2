import express from 'express';
import { isAuthenticated } from '../replitAuth';

const router = express.Router();

// Bible study context database (placeholder for demonstration)
const contextDatabase = {
  genesis: {
    1: {
      historical: {
        title: "Historical Context",
        content: "Genesis chapters 1-11 are traditionally considered \"primeval history,\" covering creation to the Tower of Babel. These foundational narratives established Hebrew understanding of humanity's origins and relationship with God. Most scholars date the written composition of Genesis to the post-Exilic period (after 539 BCE), though the oral traditions and sources it draws from are much older."
      },
      cultural: {
        title: "Cultural Insights",
        content: "Creation narratives were common throughout ancient Near Eastern cultures. The Genesis account shares similarities with other Mesopotamian texts like the Enuma Elish and Atrahasis Epic, but differs significantly in its monotheistic perspective and portrayal of an orderly, purposeful creation by a single deity rather than emerging from conflicts between gods."
      },
      theological: {
        title: "Theological Significance",
        content: "Genesis 1 presents creation as an orderly process initiated by God's spoken word (\"Let there be...\"). This portrays God as sovereign, creative, and distinct from creation itself. The repeated phrase \"and it was good\" emphasizes the inherent value of the material world. The creation of humans \"in God's image\" establishes human dignity and purpose as God's representatives on earth."
      },
      references: [
        "Enuma Elish (Babylonian creation epic)",
        "Egyptian creation accounts (Heliopolis, Memphis)",
        "Eridu Genesis (Sumerian flood narrative)"
      ],
      timeframe: "Before recorded history - Creation narrative"
    },
    2: {
      historical: {
        title: "Historical Context",
        content: "Genesis 2 provides a complementary creation account focusing specifically on humanity's creation and placement in the Garden of Eden. This narrative emphasizes humanity's relationship with God, the environment, and the creation of human community. Its focus shifts from cosmic origins to human beginnings."
      },
      cultural: {
        title: "Cultural Insights",
        content: "The Garden of Eden narrative incorporates agricultural symbolism that would have resonated with ancient Israelite farmers. The four rivers mentioned (Pishon, Gihon, Tigris, Euphrates) connect the narrative to real geography in Mesopotamia, placing Eden somewhere in the fertile region between major rivers, often called the Fertile Crescent."
      },
      theological: {
        title: "Theological Significance",
        content: "Genesis 2 emphasizes the intimate relationship between God and humanity. God forms the human from the earth ('adam from adamah') and breathes life directly into him, indicating a special relationship. The command regarding the tree establishes moral choice and human responsibility. The creation of woman as a companion emphasizes human community and partnership as essential to God's design."
      },
      references: [
        "Gilgamesh Epic (regarding the garden of the gods)",
        "Mesopotamian garden imagery"
      ],
      timeframe: "Before recorded history - Creation narrative"
    },
    3: {
      historical: {
        title: "Historical Context",
        content: "Genesis 3 introduces the concept of sin and its consequences into the biblical narrative. This pivotal chapter explains the origin of struggle, pain, and separation from God experienced by humanity. It addresses fundamental questions about human suffering and mortality that all ancient cultures sought to explain."
      },
      cultural: {
        title: "Cultural Insights",
        content: "Serpents held symbolic significance in ancient Near Eastern cultures - often representing chaos, wisdom, immortality or renewal (through shedding skin). The punishments described (agricultural toil, painful childbirth) reflected the harsh realities of ancient life. The making of garments marks a transition from innocence to civilization."
      },
      theological: {
        title: "Theological Significance",
        content: "Genesis 3 portrays sin as rooted in distrust of God and a desire for autonomy apart from divine guidance. The consequences include broken relationships (with God, each other, and nature) but also contain elements of grace (clothing provided, life sustained). The 'protoevangelium' in verse 15 is traditionally interpreted as the first messianic prophecy, pointing toward eventual redemption."
      },
      references: [
        "Adapa myth (Mesopotamian story of lost immortality)",
        "Gilgamesh Epic (search for immortality)",
      ],
      timeframe: "Before recorded history - Fall narrative"
    }
  },
  exodus: {
    1: {
      historical: {
        title: "Historical Context",
        content: "Exodus 1 is set during Israel's sojourn in Egypt, likely during the mid-second millennium BCE. While Egyptian records do not directly mention Hebrew slaves, archaeological evidence confirms the presence of Semitic peoples in Egypt during this period. The chapter describes conditions under a new Pharaoh 'who did not know Joseph,' possibly Ramesses II (1279-1213 BCE)."
      },
      cultural: {
        title: "Cultural Insights",
        content: "Ancient Egypt was known for its massive building projects using conscripted labor. The fertility of the Hebrews described in this chapter reflects the covenant promises to Abraham and would have been seen as a divine blessing. The midwives' deception illustrates the ancient Near Eastern literary device of the clever underdog outwitting the powerful."
      },
      theological: {
        title: "Theological Significance",
        content: "Exodus 1 demonstrates God's faithfulness to His covenant promises despite oppression. The Israelites' population growth fulfills God's promise to Abraham of numerous descendants. The Pharaoh's efforts to destroy Israel foreshadow similar attempts throughout biblical history, establishing a pattern of divine preservation of His people despite powerful opposition."
      },
      references: [
        "Ancient Egyptian records of building projects",
        "Papyrus Leiden 348 (Egyptian document mentioning labor quotas)"
      ],
      timeframe: "Around 1400-1200 BCE"
    }
  }
};

// Get contextual information for a book, chapter, and optional verse
router.get('/:book/:chapter/:verse?', isAuthenticated, (req, res) => {
  const { book, chapter, verse } = req.params;
  const bookLower = book.toLowerCase();
  const chapterNum = parseInt(chapter);
  
  // If we have specific verse context, return that
  if (verse && contextDatabase[bookLower]?.[chapterNum]) {
    const verseNum = parseInt(verse);
    // Here we would ideally find verse-specific context
    // For now we'll return chapter context
    return res.json({
      context: contextDatabase[bookLower][chapterNum],
      reference: {
        book: bookLower,
        chapter: chapterNum,
        verse: verseNum
      }
    });
  }
  
  // Return chapter context
  if (contextDatabase[bookLower]?.[chapterNum]) {
    return res.json({
      context: contextDatabase[bookLower][chapterNum],
      reference: {
        book: bookLower,
        chapter: chapterNum
      }
    });
  }
  
  // If no context available, return empty
  res.json({
    context: {
      historical: {
        title: "Historical Context",
        content: `Historical context for ${book} ${chapter} is not available yet.`
      },
      cultural: {
        title: "Cultural Insights",
        content: `Cultural insights for ${book} ${chapter} are not available yet.`
      },
      theological: {
        title: "Theological Significance",
        content: `Theological significance for ${book} ${chapter} is not available yet.`
      }
    },
    reference: {
      book: bookLower,
      chapter: chapterNum,
      verse: verse ? parseInt(verse) : undefined
    }
  });
});

export default router;