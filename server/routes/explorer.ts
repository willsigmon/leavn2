import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

/**
 * Interface for graph node data
 */
interface Node {
  id: string;
  name: string;
  val: number;
  color: string;
  group: 'theme' | 'person' | 'place' | 'concept' | 'verse';
  references?: string[];
  description?: string;
}

/**
 * Interface for graph link/edge data
 */
interface Link {
  source: string;
  target: string;
  value: number;
  label?: string;
}

/**
 * Combined graph data structure
 */
interface GraphData {
  nodes: Node[];
  links: Link[];
}

/**
 * GET /api/explorer/graph
 * Returns the theological concept graph data
 */
router.get('/graph', async (req: Request, res: Response) => {
  try {
    const graphData = await getTheologicalGraph();
    res.json(graphData);
  } catch (error) {
    console.error('Error retrieving theological graph data:', error);
    res.status(500).json({ error: 'Failed to retrieve theological graph data' });
  }
});

/**
 * Generate the theological concept graph data
 * In a production environment, this would be generated from your database
 * or a pre-computed file. For now, we're generating sample data.
 */
async function getTheologicalGraph(): Promise<GraphData> {
  try {
    // Try to load Genesis metadata from file
    const metadataPath = path.join(process.cwd(), 'data', 'genesis', 'genesis_metadata.json');
    const ragIndexPath = path.join(process.cwd(), 'data', 'genesis', 'rag_index.json');
    
    if (fs.existsSync(metadataPath) && fs.existsSync(ragIndexPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const ragIndex = JSON.parse(fs.readFileSync(ragIndexPath, 'utf8'));
      return generateGraphFromMetadata(metadata, ragIndex);
    } else {
      // Fallback to sample data if files don't exist
      return generateSampleGraphData();
    }
  } catch (error) {
    console.error('Error generating theological graph:', error);
    // Fallback to sample data in case of any errors
    return generateSampleGraphData();
  }
}

/**
 * Generate graph data from Genesis metadata
 */
function generateGraphFromMetadata(metadata: any, ragIndex: any): GraphData {
  const nodes: Node[] = [];
  const links: Link[] = [];
  
  // Tracking sets to prevent duplicates
  const themeNodes = new Set();
  const personNodes = new Set();
  const placeNodes = new Set();
  
  // Process each chapter in the metadata
  Object.entries(metadata.chapters).forEach(([chapterNum, chapterData]: [string, any]) => {
    const chapterId = `Genesis ${chapterNum}`;
    
    // Add themes from this chapter
    chapterData.themes.forEach((theme: string) => {
      if (!themeNodes.has(theme)) {
        themeNodes.add(theme);
        nodes.push({
          id: `theme-${theme.toLowerCase().replace(/\s+/g, '-')}`,
          name: theme,
          val: 15, // Size of node
          color: '#5c8d76', // Army green shade
          group: 'theme',
          description: `Theological theme: ${theme}`
        });
      }
      
      // Link this theme to the chapter
      links.push({
        source: `theme-${theme.toLowerCase().replace(/\s+/g, '-')}`,
        target: chapterId,
        value: 2
      });
    });
    
    // Add people from this chapter
    chapterData.people.forEach((person: string) => {
      if (!personNodes.has(person)) {
        personNodes.add(person);
        nodes.push({
          id: `person-${person.toLowerCase().replace(/\s+/g, '-')}`,
          name: person,
          val: 12,
          color: '#8b6f4e', // Brown shade for people
          group: 'person',
          description: `Biblical figure: ${person}`
        });
      }
      
      // Link this person to the chapter
      links.push({
        source: `person-${person.toLowerCase().replace(/\s+/g, '-')}`,
        target: chapterId,
        value: 2
      });
    });
    
    // Add places from this chapter
    chapterData.places.forEach((place: string) => {
      if (!placeNodes.has(place)) {
        placeNodes.add(place);
        nodes.push({
          id: `place-${place.toLowerCase().replace(/\s+/g, '-')}`,
          name: place,
          val: 10,
          color: '#5e7e9b', // Blue-gray shade for places
          group: 'place',
          description: `Biblical location: ${place}`
        });
      }
      
      // Link this place to the chapter
      links.push({
        source: `place-${place.toLowerCase().replace(/\s+/g, '-')}`,
        target: chapterId,
        value: 1
      });
    });
    
    // Add chapter as a node
    nodes.push({
      id: chapterId,
      name: `Genesis ${chapterNum}: ${chapterData.title || 'Untitled'}`,
      val: 18,
      color: '#2c4c3b', // Darker army green
      group: 'verse',
      description: chapterData.summary || 'Genesis chapter'
    });
  });
  
  // Connect related themes based on co-occurrence in chapters
  for (const theme1 of themeNodes) {
    for (const theme2 of themeNodes) {
      if (theme1 !== theme2) {
        // Check if themes co-occur in the same chapters
        const coOccurrenceCount = Object.values(metadata.chapters).filter((chapterData: any) => 
          chapterData.themes.includes(theme1) && chapterData.themes.includes(theme2)
        ).length;
        
        if (coOccurrenceCount > 0) {
          links.push({
            source: `theme-${theme1.toLowerCase().replace(/\s+/g, '-')}`,
            target: `theme-${theme2.toLowerCase().replace(/\s+/g, '-')}`,
            value: coOccurrenceCount * 0.5 // Scale down to not overwhelm the graph
          });
        }
      }
    }
  }
  
  // Connect people to related places
  for (const person of personNodes) {
    for (const place of placeNodes) {
      // Check if person and place co-occur in chapters
      const coOccurrenceCount = Object.values(metadata.chapters).filter((chapterData: any) => 
        chapterData.people.includes(person) && chapterData.places.includes(place)
      ).length;
      
      if (coOccurrenceCount > 0) {
        links.push({
          source: `person-${person.toLowerCase().replace(/\s+/g, '-')}`,
          target: `place-${place.toLowerCase().replace(/\s+/g, '-')}`,
          value: coOccurrenceCount * 0.3
        });
      }
    }
  }
  
  return { nodes, links };
}

/**
 * Generate sample theological concept graph data
 * This is a fallback if we can't read from real data
 */
function generateSampleGraphData(): GraphData {
  const nodes: Node[] = [];
  const links: Link[] = [];
  
  // Core theological themes
  const themes = [
    { id: 'creation', name: 'Creation', description: 'The divine act of bringing the universe into existence' },
    { id: 'fall', name: 'The Fall', description: 'Humanity\'s descent into sin and separation from God' },
    { id: 'covenant', name: 'Covenant', description: 'Sacred agreements between God and humanity' },
    { id: 'redemption', name: 'Redemption', description: 'The process of being saved from sin and its consequences' },
    { id: 'providence', name: 'Providence', description: 'God\'s sovereignty and care over creation' }
  ];
  
  // Key biblical figures
  const people = [
    { id: 'adam', name: 'Adam', description: 'The first human created by God' },
    { id: 'eve', name: 'Eve', description: 'The first woman created by God' },
    { id: 'abraham', name: 'Abraham', description: 'Patriarch and father of faith' },
    { id: 'moses', name: 'Moses', description: 'Prophet who led the Exodus from Egypt' },
    { id: 'david', name: 'David', description: 'King of Israel and ancestor of Jesus' }
  ];
  
  // Important places
  const places = [
    { id: 'eden', name: 'Garden of Eden', description: 'Paradise created by God for humanity' },
    { id: 'babel', name: 'Tower of Babel', description: 'Site of human pride and confusion of languages' },
    { id: 'canaan', name: 'Canaan', description: 'The Promised Land' },
    { id: 'egypt', name: 'Egypt', description: 'Place of bondage and exodus' },
    { id: 'jerusalem', name: 'Jerusalem', description: 'Holy city and spiritual center' }
  ];
  
  // Key verses
  const verses = [
    { id: 'genesis-1-1', name: 'Genesis 1:1', description: 'In the beginning God created the heavens and the earth.' },
    { id: 'genesis-3-15', name: 'Genesis 3:15', description: 'First messianic prophecy' },
    { id: 'genesis-12-3', name: 'Genesis 12:3', description: 'Abrahamic covenant and blessing to all nations' },
    { id: 'exodus-20-2', name: 'Exodus 20:2', description: 'Beginning of the Ten Commandments' },
    { id: 'isaiah-53-5', name: 'Isaiah 53:5', description: 'Prophecy of the suffering servant' }
  ];
  
  // Add all nodes with appropriate styling
  themes.forEach(theme => {
    nodes.push({
      id: `theme-${theme.id}`,
      name: theme.name,
      val: 15,
      color: '#5c8d76', // Army green shade
      group: 'theme',
      description: theme.description
    });
  });
  
  people.forEach(person => {
    nodes.push({
      id: `person-${person.id}`,
      name: person.name,
      val: 12,
      color: '#8b6f4e', // Brown shade for people
      group: 'person',
      description: person.description
    });
  });
  
  places.forEach(place => {
    nodes.push({
      id: `place-${place.id}`,
      name: place.name,
      val: 10,
      color: '#5e7e9b', // Blue-gray shade for places
      group: 'place',
      description: place.description
    });
  });
  
  verses.forEach(verse => {
    nodes.push({
      id: `verse-${verse.id}`,
      name: verse.name,
      val: 8,
      color: '#2c4c3b', // Darker army green
      group: 'verse',
      description: verse.description
    });
  });
  
  // Define relationships between concepts
  
  // Creation theme connections
  links.push(
    { source: 'theme-creation', target: 'verse-genesis-1-1', value: 5 },
    { source: 'theme-creation', target: 'person-adam', value: 4 },
    { source: 'theme-creation', target: 'person-eve', value: 4 },
    { source: 'theme-creation', target: 'place-eden', value: 4 }
  );
  
  // Fall theme connections
  links.push(
    { source: 'theme-fall', target: 'verse-genesis-3-15', value: 5 },
    { source: 'theme-fall', target: 'person-adam', value: 4 },
    { source: 'theme-fall', target: 'person-eve', value: 4 },
    { source: 'theme-fall', target: 'place-eden', value: 3 }
  );
  
  // Covenant theme connections
  links.push(
    { source: 'theme-covenant', target: 'verse-genesis-12-3', value: 5 },
    { source: 'theme-covenant', target: 'person-abraham', value: 5 },
    { source: 'theme-covenant', target: 'person-moses', value: 4 },
    { source: 'theme-covenant', target: 'place-canaan', value: 3 }
  );
  
  // Redemption theme connections
  links.push(
    { source: 'theme-redemption', target: 'verse-isaiah-53-5', value: 5 },
    { source: 'theme-redemption', target: 'verse-genesis-3-15', value: 3 },
    { source: 'theme-redemption', target: 'person-moses', value: 3 },
    { source: 'theme-redemption', target: 'place-egypt', value: 3 }
  );
  
  // Providence theme connections
  links.push(
    { source: 'theme-providence', target: 'person-abraham', value: 4 },
    { source: 'theme-providence', target: 'person-david', value: 4 },
    { source: 'theme-providence', target: 'place-jerusalem', value: 3 }
  );
  
  // Connect people to places
  links.push(
    { source: 'person-adam', target: 'place-eden', value: 5 },
    { source: 'person-eve', target: 'place-eden', value: 5 },
    { source: 'person-abraham', target: 'place-canaan', value: 4 },
    { source: 'person-moses', target: 'place-egypt', value: 4 },
    { source: 'person-david', target: 'place-jerusalem', value: 4 }
  );
  
  // Interconnect themes to show theological relationships
  links.push(
    { source: 'theme-creation', target: 'theme-fall', value: 3 },
    { source: 'theme-fall', target: 'theme-redemption', value: 3 },
    { source: 'theme-covenant', target: 'theme-redemption', value: 3 },
    { source: 'theme-providence', target: 'theme-covenant', value: 2 },
    { source: 'theme-creation', target: 'theme-providence', value: 2 }
  );
  
  return { nodes, links };
}

export default router;