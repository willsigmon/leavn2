import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { isAuthenticated } from '../replitAuth';

const router = Router();

interface Node {
  id: string;
  name: string;
  val: number;
  color: string;
  group: 'theme' | 'person' | 'place' | 'concept' | 'verse';
  references?: string[];
  description?: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
  label?: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

// Endpoint to get the theological concept graph data
router.get('/graph', async (req: Request, res: Response) => {
  try {
    // Generate or load graph data
    const graphData = await getTheologicalGraph();
    res.json(graphData);
  } catch (error) {
    console.error('Error fetching theological concept graph:', error);
    res.status(500).json({ error: 'Failed to load theological concept graph data' });
  }
});

/**
 * Generate the theological concept graph data
 * In a production environment, this would be generated from your database
 * or a pre-computed file. For now, we're generating sample data.
 */
async function getTheologicalGraph(): Promise<GraphData> {
  // Read from the genesis metadata file to create authentic data
  try {
    const genesisMetadataPath = path.join(process.cwd(), 'data', 'genesis', 'genesis_metadata.json');
    const genesisRAGIndexPath = path.join(process.cwd(), 'data', 'genesis', 'genesis_rag_index.json');
    
    if (fs.existsSync(genesisMetadataPath) && fs.existsSync(genesisRAGIndexPath)) {
      const metadataContent = fs.readFileSync(genesisMetadataPath, 'utf8');
      const ragIndexContent = fs.readFileSync(genesisRAGIndexPath, 'utf8');
      
      const metadata = JSON.parse(metadataContent);
      const ragIndex = JSON.parse(ragIndexContent);
      
      return generateGraphFromMetadata(metadata, ragIndex);
    }
  } catch (error) {
    console.error('Error reading Genesis metadata for graph:', error);
  }
  
  // Fallback to sample data if we can't read the actual metadata
  return generateSampleGraphData();
}

/**
 * Generate graph data from Genesis metadata
 */
function generateGraphFromMetadata(metadata: any, ragIndex: any): GraphData {
  const nodes: Node[] = [];
  const links: Link[] = [];
  const nodeMap = new Map<string, number>(); // Map to track node indices
  
  // Process themes
  if (ragIndex.themes) {
    Object.keys(ragIndex.themes).forEach((theme, index) => {
      const nodeId = `theme-${theme.replace(/\s+/g, '-').toLowerCase()}`;
      nodes.push({
        id: nodeId,
        name: theme,
        val: 10,
        color: '#2c4c3b',
        group: 'theme',
        description: `A key theological theme found throughout Genesis.`,
        references: ragIndex.themes[theme].map((ref: string) => `Genesis ${ref}`)
      });
      nodeMap.set(nodeId, nodes.length - 1);
    });
  }
  
  // Process people
  if (ragIndex.people) {
    Object.keys(ragIndex.people).forEach((person, index) => {
      const nodeId = `person-${person.replace(/\s+/g, '-').toLowerCase()}`;
      nodes.push({
        id: nodeId,
        name: person,
        val: 8,
        color: '#8b4513',
        group: 'person',
        description: `Biblical figure mentioned in Genesis.`,
        references: ragIndex.people[person].map((ref: string) => `Genesis ${ref}`)
      });
      nodeMap.set(nodeId, nodes.length - 1);
    });
  }
  
  // Process places
  if (ragIndex.places) {
    Object.keys(ragIndex.places).forEach((place, index) => {
      const nodeId = `place-${place.replace(/\s+/g, '-').toLowerCase()}`;
      nodes.push({
        id: nodeId,
        name: place,
        val: 6,
        color: '#1e3a8a',
        group: 'place',
        description: `Location mentioned in Genesis.`,
        references: ragIndex.places[place].map((ref: string) => `Genesis ${ref}`)
      });
      nodeMap.set(nodeId, nodes.length - 1);
    });
  }
  
  // Add theological concepts (combining relevant themes)
  const theologicalConcepts = [
    { name: 'Creation', relatedThemes: ['Creation', 'Divine order'], description: 'God\'s act of bringing the universe into existence' },
    { name: 'Covenant', relatedThemes: ['Promise', 'Covenant', 'Faithfulness'], description: 'Sacred agreement between God and humanity' },
    { name: 'Fall of Humanity', relatedThemes: ['Sin', 'Consequence', 'Temptation'], description: 'Humanity\'s first disobedience against God' },
    { name: 'Redemption', relatedThemes: ['Forgiveness', 'Mercy', 'Grace'], description: 'God\'s plan to save humanity from sin' },
    { name: 'Divine Calling', relatedThemes: ['Calling', 'Purpose', 'Obedience'], description: 'God\'s specific assignments to individuals' }
  ];
  
  theologicalConcepts.forEach((concept, index) => {
    const nodeId = `concept-${concept.name.replace(/\s+/g, '-').toLowerCase()}`;
    nodes.push({
      id: nodeId,
      name: concept.name,
      val: 12,
      color: '#9333ea',
      group: 'concept',
      description: concept.description
    });
    nodeMap.set(nodeId, nodes.length - 1);
    
    // Connect concepts to related themes
    concept.relatedThemes.forEach(theme => {
      const themeNodeId = `theme-${theme.replace(/\s+/g, '-').toLowerCase()}`;
      if (nodeMap.has(themeNodeId)) {
        links.push({
          source: nodeId,
          target: themeNodeId,
          value: 3,
          label: 'relates to'
        });
      }
    });
  });
  
  // Add connections between themes and people/places
  Object.keys(ragIndex.themes || {}).forEach(theme => {
    const themeId = `theme-${theme.replace(/\s+/g, '-').toLowerCase()}`;
    const themeRefs = new Set(ragIndex.themes[theme]);
    
    // Connect to people mentioned in the same verses
    Object.keys(ragIndex.people || {}).forEach(person => {
      const personId = `person-${person.replace(/\s+/g, '-').toLowerCase()}`;
      const personRefs = new Set(ragIndex.people[person]);
      
      // Check for intersection between theme refs and person refs
      const intersection = [...themeRefs].filter(ref => personRefs.has(ref));
      if (intersection.length > 0) {
        links.push({
          source: themeId,
          target: personId,
          value: Math.min(intersection.length, 5), // Normalize value
          label: 'associated with'
        });
      }
    });
    
    // Connect to places mentioned in the same verses
    Object.keys(ragIndex.places || {}).forEach(place => {
      const placeId = `place-${place.replace(/\s+/g, '-').toLowerCase()}`;
      const placeRefs = new Set(ragIndex.places[place]);
      
      // Check for intersection between theme refs and place refs
      const intersection = [...themeRefs].filter(ref => placeRefs.has(ref));
      if (intersection.length > 0) {
        links.push({
          source: themeId,
          target: placeId,
          value: Math.min(intersection.length, 5), // Normalize value
          label: 'occurred at'
        });
      }
    });
  });
  
  // Connect people to places
  Object.keys(ragIndex.people || {}).forEach(person => {
    const personId = `person-${person.replace(/\s+/g, '-').toLowerCase()}`;
    const personRefs = new Set(ragIndex.people[person]);
    
    Object.keys(ragIndex.places || {}).forEach(place => {
      const placeId = `place-${place.replace(/\s+/g, '-').toLowerCase()}`;
      const placeRefs = new Set(ragIndex.places[place]);
      
      // Check for intersection between person refs and place refs
      const intersection = [...personRefs].filter(ref => placeRefs.has(ref));
      if (intersection.length > 0) {
        links.push({
          source: personId,
          target: placeId,
          value: Math.min(intersection.length, 4), // Normalize value
          label: 'present at'
        });
      }
    });
  });
  
  return { nodes, links };
}

/**
 * Generate sample theological concept graph data
 * This is a fallback if we can't read from real data
 */
function generateSampleGraphData(): GraphData {
  const nodes: Node[] = [
    // Core theological concepts
    { 
      id: 'concept-creation', 
      name: 'Creation', 
      val: 15, 
      color: '#9333ea', 
      group: 'concept',
      description: 'God\'s act of bringing the universe into existence'
    },
    { 
      id: 'concept-covenant', 
      name: 'Covenant', 
      val: 15, 
      color: '#9333ea', 
      group: 'concept',
      description: 'Sacred agreement between God and humanity'
    },
    { 
      id: 'concept-redemption', 
      name: 'Redemption', 
      val: 15, 
      color: '#9333ea', 
      group: 'concept',
      description: 'God\'s plan to save humanity from sin'
    },
    
    // Themes
    { 
      id: 'theme-divine-order', 
      name: 'Divine Order', 
      val: 10, 
      color: '#2c4c3b', 
      group: 'theme',
      description: 'God\'s intentional arrangement of creation',
      references: ['Genesis 1:1-3', 'Genesis 2:1-3']
    },
    { 
      id: 'theme-stewardship', 
      name: 'Stewardship', 
      val: 10, 
      color: '#2c4c3b', 
      group: 'theme',
      description: 'Humanity\'s responsibility to care for creation',
      references: ['Genesis 1:28-30', 'Genesis 2:15']
    },
    { 
      id: 'theme-disobedience', 
      name: 'Disobedience', 
      val: 10, 
      color: '#2c4c3b', 
      group: 'theme',
      description: 'Humanity\'s rebellion against God\'s commands',
      references: ['Genesis 3:6-7', 'Genesis 3:11']
    },
    { 
      id: 'theme-promise', 
      name: 'Promise', 
      val: 10, 
      color: '#2c4c3b', 
      group: 'theme',
      description: 'God\'s commitments to His people',
      references: ['Genesis 9:11', 'Genesis 12:2-3', 'Genesis 15:5']
    },
    
    // People
    { 
      id: 'person-adam', 
      name: 'Adam', 
      val: 8, 
      color: '#8b4513', 
      group: 'person',
      description: 'The first man created by God',
      references: ['Genesis 1:27', 'Genesis 2:7', 'Genesis 3:17-19']
    },
    { 
      id: 'person-eve', 
      name: 'Eve', 
      val: 8, 
      color: '#8b4513', 
      group: 'person',
      description: 'The first woman, created from Adam\'s rib',
      references: ['Genesis 2:22', 'Genesis 3:16', 'Genesis 3:20']
    },
    { 
      id: 'person-noah', 
      name: 'Noah', 
      val: 8, 
      color: '#8b4513', 
      group: 'person',
      description: 'Built the ark to preserve life during the flood',
      references: ['Genesis 6:9', 'Genesis 7:1', 'Genesis 9:1']
    },
    { 
      id: 'person-abraham', 
      name: 'Abraham', 
      val: 8, 
      color: '#8b4513', 
      group: 'person',
      description: 'Patriarch who received God\'s covenant promise',
      references: ['Genesis 12:1-3', 'Genesis 15:6', 'Genesis 22:1-18']
    },
    
    // Places
    { 
      id: 'place-eden', 
      name: 'Garden of Eden', 
      val: 7, 
      color: '#1e3a8a', 
      group: 'place',
      description: 'Paradise where Adam and Eve first lived',
      references: ['Genesis 2:8-15', 'Genesis 3:23-24']
    },
    { 
      id: 'place-ararat', 
      name: 'Mount Ararat', 
      val: 7, 
      color: '#1e3a8a', 
      group: 'place',
      description: 'Where Noah\'s ark came to rest after the flood',
      references: ['Genesis 8:4']
    },
    { 
      id: 'place-canaan', 
      name: 'Canaan', 
      val: 7, 
      color: '#1e3a8a', 
      group: 'place',
      description: 'The promised land given to Abraham',
      references: ['Genesis 12:5-7', 'Genesis 17:8']
    }
  ];
  
  const links: Link[] = [
    // Connect concepts with themes
    { source: 'concept-creation', target: 'theme-divine-order', value: 5, label: 'includes' },
    { source: 'concept-creation', target: 'theme-stewardship', value: 4, label: 'establishes' },
    { source: 'concept-covenant', target: 'theme-promise', value: 5, label: 'expressed through' },
    { source: 'concept-redemption', target: 'theme-disobedience', value: 3, label: 'responds to' },
    
    // Connect themes with people
    { source: 'theme-divine-order', target: 'person-adam', value: 3, label: 'involves' },
    { source: 'theme-divine-order', target: 'person-eve', value: 3, label: 'involves' },
    { source: 'theme-stewardship', target: 'person-adam', value: 4, label: 'given to' },
    { source: 'theme-stewardship', target: 'person-noah', value: 3, label: 'exemplified by' },
    { source: 'theme-disobedience', target: 'person-adam', value: 4, label: 'committed by' },
    { source: 'theme-disobedience', target: 'person-eve', value: 4, label: 'initiated by' },
    { source: 'theme-promise', target: 'person-noah', value: 3, label: 'received by' },
    { source: 'theme-promise', target: 'person-abraham', value: 5, label: 'made to' },
    
    // Connect people with places
    { source: 'person-adam', target: 'place-eden', value: 5, label: 'lived in' },
    { source: 'person-eve', target: 'place-eden', value: 5, label: 'lived in' },
    { source: 'person-noah', target: 'place-ararat', value: 4, label: 'landed at' },
    { source: 'person-abraham', target: 'place-canaan', value: 4, label: 'journeyed to' },
    
    // Connect people with people
    { source: 'person-adam', target: 'person-eve', value: 5, label: 'husband of' },
    
    // Connect concepts with places
    { source: 'concept-creation', target: 'place-eden', value: 3, label: 'includes' },
    { source: 'concept-covenant', target: 'place-canaan', value: 4, label: 'promises' }
  ];
  
  return { nodes, links };
}

export default router;