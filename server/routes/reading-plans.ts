import express, { Request, Response } from 'express';
import { isAuthenticated } from '../simpleAuth';
import { storage } from '../storage';
import { z } from 'zod';

// Sample reading plans data (in a real app, this would come from a database)
const readingPlans = [
  {
    id: "genesis-creation",
    title: "Genesis Creation Account",
    description: "A 7-day study through the creation account in Genesis, exploring God's creative work and purpose for humanity.",
    duration: 7,
    category: "Old Testament",
    tags: ["Genesis", "Creation", "Beginnings", "Old Testament"],
    author: "Leavn Team",
    difficulty: "beginner",
    coverImage: "/images/plans/creation.jpg",
    days: [
      {
        id: "day-1",
        title: "Day 1: Light and Darkness",
        passages: ["Genesis 1:1-5"],
        contextualNotes: "The ancient Hebrew concept of creation ex nihilo (out of nothing) was revolutionary in contrast to other ancient Near Eastern creation myths.",
        reflectionQuestions: [
          "What does it mean that God created through speaking?",
          "How does the separation of light and darkness reflect God's character?",
          "What spiritual parallels can we draw from light and darkness in our own lives?"
        ],
        theologicalConcepts: ["Creation ex nihilo", "God's sovereignty", "Order from chaos"],
        historicalContext: "The Genesis account stands in stark contrast to other ancient Near Eastern creation myths where the world emerged from conflict between gods or from pre-existing material.",
        crossReferences: ["John 1:1-5", "2 Corinthians 4:6", "Colossians 1:15-17"]
      },
      {
        id: "day-2",
        title: "Day 2: The Firmament",
        passages: ["Genesis 1:6-8"],
        contextualNotes: "The 'firmament' or 'expanse' reflects ancient cosmology but conveys the theological truth of God's intentional ordering of creation.",
        reflectionQuestions: [
          "What does the separation of waters tell us about God's design?",
          "How does God bring order to chaos in your life?",
          "What boundaries has God established for our benefit?"
        ],
        theologicalConcepts: ["Divine order", "Creation boundaries", "God's wisdom in design"],
        historicalContext: "Ancient Israelites understood the sky as a solid dome holding back celestial waters. While their cosmology was pre-scientific, the theological truth remains valid.",
        crossReferences: ["Psalm 19:1", "Job 37:18", "Proverbs 8:27-29"]
      },
      {
        id: "day-3",
        title: "Day 3: Land and Vegetation",
        passages: ["Genesis 1:9-13"],
        contextualNotes: "The emergence of fertile land and vegetation establishes the foundations for life and God's provision.",
        reflectionQuestions: [
          "What does the creation of plants 'according to their kinds' reveal about God's design?",
          "How does the principle of seeds producing after their kind apply spiritually?",
          "What does God's provision of vegetation teach us about His character?"
        ],
        theologicalConcepts: ["God's provision", "Fruitfulness", "Natural order"],
        historicalContext: "In the arid Near East, fertile land and vegetation were seen as precious divine gifts, essential for survival.",
        crossReferences: ["Psalm 104:14-16", "Isaiah 55:10-13", "Matthew 6:28-30"]
      },
      {
        id: "day-4",
        title: "Day 4: Sun, Moon, and Stars",
        passages: ["Genesis 1:14-19"],
        contextualNotes: "Unlike neighboring cultures that worshipped celestial bodies, Genesis presents them merely as created objects serving God's purposes.",
        reflectionQuestions: [
          "Why does Genesis avoid naming the sun and moon directly?",
          "How do the 'signs and seasons' established by celestial bodies structure our lives?",
          "What does it mean that God appointed these lights to 'rule' day and night?"
        ],
        theologicalConcepts: ["Divine authority over creation", "Purpose in creation", "Time and seasons"],
        historicalContext: "By referring to the sun and moon as 'greater light' and 'lesser light,' Genesis subtly challenges nearby cultures that worshipped these as deities.",
        crossReferences: ["Psalm 8:3-4", "Psalm 136:7-9", "Jeremiah 31:35-36"]
      },
      {
        id: "day-5",
        title: "Day 5: Sea Creatures and Birds",
        passages: ["Genesis 1:20-23"],
        contextualNotes: "The first divine blessing is pronounced on living creatures, establishing God's desire for life to flourish.",
        reflectionQuestions: [
          "What does God's first blessing in the Bible being 'be fruitful and multiply' teach us?",
          "How does the diversity of sea and air creatures reflect God's creativity?",
          "What does it mean that God saw these creatures as 'good'?"
        ],
        theologicalConcepts: ["Divine blessing", "Value of life", "Abundance"],
        historicalContext: "Many creatures in ancient Near Eastern thought were associated with chaos or evil, but Genesis presents all creatures as good parts of God's ordered creation.",
        crossReferences: ["Psalm 104:24-25", "Job 12:7-10", "Matthew 6:26"]
      },
      {
        id: "day-6",
        title: "Day 6: Land Animals and Humans",
        passages: ["Genesis 1:24-31"],
        contextualNotes: "Humans are uniquely created in God's image and given authority over creation as God's representatives.",
        reflectionQuestions: [
          "What does it mean to be created in God's image?",
          "How should our 'dominion' over creation be exercised?",
          "How does being created male and female reflect God's nature?"
        ],
        theologicalConcepts: ["Imago Dei", "Dominion", "Human dignity", "Gender complementarity"],
        historicalContext: "Unlike other ancient Near Eastern views where only kings were divine images, Genesis democratizes this status to all humans regardless of status.",
        crossReferences: ["Psalm 8", "Colossians 3:9-10", "James 3:9-10"]
      },
      {
        id: "day-7",
        title: "Day 7: Rest",
        passages: ["Genesis 2:1-3"],
        contextualNotes: "God's rest on the seventh day establishes a pattern for human work and rest, later formalized in the Sabbath commandment.",
        reflectionQuestions: [
          "Why did God rest if He doesn't grow weary?",
          "How does the concept of Sabbath rest apply to our lives today?",
          "What does it mean that God blessed and sanctified the seventh day?"
        ],
        theologicalConcepts: ["Sabbath", "Divine completion", "Sacred time"],
        historicalContext: "The concept of a seven-day week with a day of rest was revolutionary in the ancient world and unique to Israelite religion.",
        crossReferences: ["Exodus 20:8-11", "Hebrews 4:1-11", "Mark 2:27-28"]
      }
    ]
  },
  {
    id: "sermon-mount",
    title: "The Sermon on the Mount",
    description: "A 14-day journey through Jesus' most famous teaching, exploring the radical ethics of the Kingdom of God.",
    duration: 14,
    category: "New Testament",
    tags: ["Jesus", "Ethics", "Kingdom", "Beatitudes", "New Testament"],
    author: "Leavn Team",
    difficulty: "intermediate",
    coverImage: "/images/plans/sermon.jpg",
    days: [
      {
        id: "day-1",
        title: "Day 1: The Beatitudes - Part 1",
        passages: ["Matthew 5:1-6"],
        contextualNotes: "Jesus begins his sermon by redefining what it means to be blessed, challenging conventional wisdom about success and happiness.",
        reflectionQuestions: [
          "How do Jesus' beatitudes differ from the world's definition of blessing?",
          "What does it mean to be 'poor in spirit'?",
          "How does hungering and thirsting for righteousness manifest in daily life?"
        ],
        theologicalConcepts: ["Kingdom values", "Spiritual poverty", "Divine comfort", "Righteousness"],
        historicalContext: "Jesus taught on a hillside, taking the posture of a rabbi but with unprecedented authority, shocking his audience with these counterintuitive statements.",
        crossReferences: ["Luke 6:20-26", "Isaiah 61:1-3", "Psalm 37:11"]
      },
      {
        id: "day-2",
        title: "Day 2: The Beatitudes - Part 2",
        passages: ["Matthew 5:7-12"],
        contextualNotes: "Jesus continues his revolutionary blessings, culminating in the promise that persecution for righteousness' sake is actually a blessing.",
        reflectionQuestions: [
          "How can showing mercy to others lead to receiving mercy?",
          "What does it mean to be pure in heart?",
          "How should Christians respond to persecution according to Jesus?"
        ],
        theologicalConcepts: ["Mercy", "Heart purity", "Peacemaking", "Persecution", "Heavenly reward"],
        historicalContext: "For Jesus' Jewish audience, being persecuted for righteousness echoed the suffering of prophets, a theme that would become central to early Christian identity.",
        crossReferences: ["James 2:12-13", "Psalm 24:3-4", "1 Peter 3:14-17"]
      }
    ]
  },
  {
    id: "psalms-comfort",
    title: "Psalms of Comfort",
    description: "A 10-day devotional through selected Psalms that provide comfort, hope and perspective during difficult times.",
    duration: 10,
    category: "Old Testament",
    tags: ["Psalms", "Comfort", "Prayer", "Worship", "Old Testament"],
    author: "Leavn Team",
    difficulty: "beginner",
    coverImage: "/images/plans/psalms.jpg"
  },
  {
    id: "parables-jesus",
    title: "Parables of Jesus",
    description: "A 21-day exploration of Jesus' parables, uncovering the profound truths about God's kingdom hidden in these simple stories.",
    duration: 21,
    category: "New Testament",
    tags: ["Jesus", "Parables", "Kingdom", "Teachings", "New Testament"],
    author: "Leavn Team",
    difficulty: "intermediate",
    coverImage: "/images/plans/parables.jpg"
  },
  {
    id: "paul-romans",
    title: "Paul's Letter to the Romans",
    description: "A comprehensive 30-day journey through Paul's theological masterpiece on salvation, righteousness, and the Christian life.",
    duration: 30,
    category: "New Testament",
    tags: ["Paul", "Romans", "Theology", "Salvation", "New Testament"],
    author: "Leavn Team",
    difficulty: "advanced",
    coverImage: "/images/plans/romans.jpg"
  },
  {
    id: "wisdom-proverbs",
    title: "Wisdom from Proverbs",
    description: "A 15-day exploration of practical wisdom from the book of Proverbs for everyday decision-making and godly living.",
    duration: 15,
    category: "Old Testament",
    tags: ["Wisdom", "Proverbs", "Solomon", "Practical", "Old Testament"],
    author: "Leavn Team",
    difficulty: "beginner",
    coverImage: "/images/plans/proverbs.jpg"
  },
  {
    id: "acts-early-church",
    title: "Acts: Birth of the Church",
    description: "A 28-day journey through the book of Acts, witnessing the Holy Spirit's work in establishing the early church.",
    duration: 28,
    category: "New Testament",
    tags: ["Acts", "Church History", "Holy Spirit", "Apostles", "New Testament"],
    author: "Leavn Team",
    difficulty: "intermediate",
    coverImage: "/images/plans/acts.jpg"
  },
  {
    id: "daily-psalms",
    title: "30 Days of Psalms",
    description: "A month of daily readings through selected Psalms covering the full range of human emotions and spiritual experiences.",
    duration: 30,
    category: "Old Testament",
    tags: ["Psalms", "Devotional", "Worship", "Prayer", "Old Testament"],
    author: "Leavn Team",
    difficulty: "beginner",
    coverImage: "/images/plans/daily-psalms.jpg"
  }
];

// User progress data (would normally be stored in a database)
const userProgress: Record<string, any> = {
  "user1": {
    "genesis-creation": {
      planId: "genesis-creation",
      userId: "user1",
      startDate: "2025-05-10",
      currentDay: 3,
      completedDays: ["day-1", "day-2"],
      lastUpdated: "2025-05-12"
    },
    "sermon-mount": {
      planId: "sermon-mount",
      userId: "user1",
      startDate: "2025-04-25",
      currentDay: 2,
      completedDays: ["day-1"],
      lastUpdated: "2025-04-26"
    }
  }
};

// Schema for plan progress updates
const planProgressSchema = z.object({
  planId: z.string(),
  currentDay: z.number().optional(),
  completedDays: z.array(z.string()).optional(),
  action: z.enum(["start", "complete-day", "update"]).optional()
});

// Register reading plan routes
export function registerReadingPlanRoutes(app: express.Express) {
  // Get all reading plans
  app.get("/api/reading-plans", async (req: Request, res: Response) => {
    try {
      // In a real app, we would fetch from a database 
      // In this prototype, we'll filter them based on user preferences if needed
      const { category, difficulty, search } = req.query;
      
      let filteredPlans = [...readingPlans];
      
      // Filter by category if provided
      if (category && typeof category === 'string') {
        filteredPlans = filteredPlans.filter(plan => 
          plan.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Filter by difficulty if provided
      if (difficulty && typeof difficulty === 'string') {
        filteredPlans = filteredPlans.filter(plan => 
          plan.difficulty === difficulty
        );
      }
      
      // Filter by search term if provided
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        filteredPlans = filteredPlans.filter(plan => 
          plan.title.toLowerCase().includes(searchLower) || 
          plan.description.toLowerCase().includes(searchLower) ||
          plan.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      // Map plans to include user progress for authenticated users
      const userId = req.session && (req.session as any).userId;
      
      if (userId) {
        // Add user progress data to each plan
        filteredPlans = filteredPlans.map(plan => {
          const userPlan = userProgress[userId]?.[plan.id];
          if (userPlan) {
            return {
              ...plan,
              completionTracking: {
                startDate: userPlan.startDate,
                currentDay: userPlan.currentDay,
                completedDays: userPlan.completedDays
              }
            };
          }
          return plan;
        });
      }
      
      // Transform plans to exclude the detailed day content for the listing
      const plansList = filteredPlans.map(({ days, ...plan }) => ({
        ...plan,
        // Only include the days count instead of the full day objects
        dayCount: days?.length || plan.duration
      }));
      
      return res.json(plansList);
    } catch (error) {
      console.error("Error fetching reading plans:", error);
      return res.status(500).json({ message: "Failed to fetch reading plans" });
    }
  });
  
  // Get a specific reading plan by ID
  app.get("/api/reading-plans/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Find the requested plan
      const plan = readingPlans.find(p => p.id === id);
      
      if (!plan) {
        return res.status(404).json({ message: "Reading plan not found" });
      }
      
      // Add user progress if authenticated
      const userId = req.session && (req.session as any).userId;
      let planWithProgress = { ...plan };
      
      if (userId && userProgress[userId]?.[id]) {
        planWithProgress.completionTracking = {
          startDate: userProgress[userId][id].startDate,
          currentDay: userProgress[userId][id].currentDay,
          completedDays: userProgress[userId][id].completedDays
        };
      }
      
      return res.json(planWithProgress);
    } catch (error) {
      console.error("Error fetching reading plan:", error);
      return res.status(500).json({ message: "Failed to fetch reading plan" });
    }
  });
  
  // Update user progress for a reading plan
  app.post("/api/reading-plans/:id/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.session && (req.session as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Find the requested plan
      const plan = readingPlans.find(p => p.id === id);
      
      if (!plan) {
        return res.status(404).json({ message: "Reading plan not found" });
      }
      
      // Validate the request body
      const data = planProgressSchema.parse(req.body);
      
      // Initialize user progress object if needed
      if (!userProgress[userId]) {
        userProgress[userId] = {};
      }
      
      // Handle different actions
      if (data.action === "start") {
        // Start a new plan
        userProgress[userId][id] = {
          planId: id,
          userId,
          startDate: new Date().toISOString().split('T')[0], // Current date YYYY-MM-DD
          currentDay: 1,
          completedDays: [],
          lastUpdated: new Date().toISOString()
        };
      } else if (data.action === "complete-day") {
        // Mark a day as completed
        if (!userProgress[userId][id]) {
          // If user hasn't started the plan yet, start it
          userProgress[userId][id] = {
            planId: id,
            userId,
            startDate: new Date().toISOString().split('T')[0],
            currentDay: 1,
            completedDays: [],
            lastUpdated: new Date().toISOString()
          };
        }
        
        // Get the current day object from the plan
        const currentDayNum = userProgress[userId][id].currentDay;
        const currentDayObj = plan.days?.[currentDayNum - 1];
        
        if (currentDayObj) {
          // Add the day ID to completed days if not already there
          if (!userProgress[userId][id].completedDays.includes(currentDayObj.id)) {
            userProgress[userId][id].completedDays.push(currentDayObj.id);
          }
          
          // Advance to next day if not at the end
          if (currentDayNum < (plan.days?.length || plan.duration)) {
            userProgress[userId][id].currentDay = currentDayNum + 1;
          }
          
          userProgress[userId][id].lastUpdated = new Date().toISOString();
        }
      } else {
        // Direct update with provided values
        if (!userProgress[userId][id]) {
          return res.status(400).json({ message: "Cannot update progress for a plan that hasn't been started" });
        }
        
        if (data.currentDay !== undefined) {
          userProgress[userId][id].currentDay = data.currentDay;
        }
        
        if (data.completedDays !== undefined) {
          userProgress[userId][id].completedDays = data.completedDays;
        }
        
        userProgress[userId][id].lastUpdated = new Date().toISOString();
      }
      
      // Return the updated progress
      return res.json(userProgress[userId][id]);
    } catch (error) {
      console.error("Error updating reading plan progress:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      return res.status(500).json({ message: "Failed to update reading plan progress" });
    }
  });
  
  // Get all reading plan categories
  app.get("/api/reading-plans/categories", async (req: Request, res: Response) => {
    try {
      // Extract unique categories from plans
      const categories = [...new Set(readingPlans.map(plan => plan.category))];
      return res.json(categories);
    } catch (error) {
      console.error("Error fetching reading plan categories:", error);
      return res.status(500).json({ message: "Failed to fetch reading plan categories" });
    }
  });
  
  // Get all user's active reading plans
  app.get("/api/reading-plans/user/active", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session && (req.session as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get user's active plans
      const userPlans = userProgress[userId] || {};
      const activePlanIds = Object.keys(userPlans);
      
      // Get full plan details for each active plan
      const activePlans = readingPlans
        .filter(plan => activePlanIds.includes(plan.id))
        .map(plan => ({
          ...plan,
          completionTracking: {
            startDate: userPlans[plan.id].startDate,
            currentDay: userPlans[plan.id].currentDay,
            completedDays: userPlans[plan.id].completedDays
          }
        }));
      
      return res.json(activePlans);
    } catch (error) {
      console.error("Error fetching active reading plans:", error);
      return res.status(500).json({ message: "Failed to fetch active reading plans" });
    }
  });
}