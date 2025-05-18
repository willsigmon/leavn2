import { Router } from 'express';
import { isAuthenticated } from '../replitAuth';

export const explorerRouter = Router();

// Define node and link interfaces
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
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

// Generate graph data for the explorer
explorerRouter.get('/graph', async (req, res) => {
  try {
    const graphData = generateTheologicalConceptGraph();
    res.json(graphData);
  } catch (error) {
    console.error('Error generating graph data:', error);
    res.status(500).json({ message: 'Failed to generate graph data' });
  }
});

// Sample themes, people, places, and concepts from Genesis
const themes = [
  { id: 'creation', name: 'Creation', description: 'The divine act of bringing all things into existence.' },
  { id: 'covenant', name: 'Covenant', description: 'Sacred agreements between God and humanity.' },
  { id: 'redemption', name: 'Redemption', description: 'The act of being saved from sin, error, or evil.' },
  { id: 'fall', name: 'The Fall', description: 'The event where sin entered the world through human disobedience.' },
  { id: 'promise', name: 'Promise', description: 'Divine assurances given by God throughout scripture.' },
  { id: 'blessing', name: 'Blessing', description: 'Divine favor bestowed upon individuals or groups.' },
];

const people = [
  { id: 'adam', name: 'Adam', description: 'The first man created by God, husband of Eve.' },
  { id: 'eve', name: 'Eve', description: 'The first woman, created from Adam\'s rib.' },
  { id: 'noah', name: 'Noah', description: 'Built an ark to save his family and animals from the flood.' },
  { id: 'abraham', name: 'Abraham', description: 'Patriarch and father of nations, known for his faith.' },
  { id: 'sarah', name: 'Sarah', description: 'Wife of Abraham and mother of Isaac.' },
  { id: 'isaac', name: 'Isaac', description: 'Son of Abraham and Sarah, father of Jacob and Esau.' },
  { id: 'jacob', name: 'Jacob', description: 'Son of Isaac, later renamed Israel, father of the twelve tribes.' },
  { id: 'joseph', name: 'Joseph', description: 'Son of Jacob who became a ruler in Egypt.' },
];

const places = [
  { id: 'eden', name: 'Garden of Eden', description: 'Paradise created by God where Adam and Eve first lived.' },
  { id: 'ararat', name: 'Mount Ararat', description: 'Mountain where Noah\'s ark came to rest after the flood.' },
  { id: 'babel', name: 'Tower of Babel', description: 'Structure built in an attempt to reach heaven.' },
  { id: 'ur', name: 'Ur of the Chaldeans', description: 'Abraham\'s birthplace in Mesopotamia.' },
  { id: 'canaan', name: 'Canaan', description: 'The Promised Land given to Abraham and his descendants.' },
  { id: 'egypt', name: 'Egypt', description: 'Ancient civilization where the Israelites were enslaved.' },
];

const concepts = [
  { id: 'sin', name: 'Sin', description: 'Transgression against divine law and separation from God.' },
  { id: 'faith', name: 'Faith', description: 'Trust and belief in God without immediate proof.' },
  { id: 'obedience', name: 'Obedience', description: 'Submission to divine commands and will.' },
  { id: 'sacrifice', name: 'Sacrifice', description: 'Offering made to God as an act of worship.' },
  { id: 'providence', name: 'Providence', description: 'God\'s guidance and care for creation.' },
  { id: 'judgment', name: 'Judgment', description: 'Divine evaluation and consequences for human actions.' },
];

const verses = [
  { id: 'gen1-1', name: 'Genesis 1:1', description: 'In the beginning God created the heavens and the earth.' },
  { id: 'gen1-27', name: 'Genesis 1:27', description: 'So God created mankind in his own image, in the image of God he created them; male and female he created them.' },
  { id: 'gen3-15', name: 'Genesis 3:15', description: 'The first messianic prophecy, promising victory over the serpent.' },
  { id: 'gen6-5', name: 'Genesis 6:5', description: 'The depravity of humanity that led to the flood.' },
  { id: 'gen12-3', name: 'Genesis 12:3', description: 'God\'s promise to bless all nations through Abraham.' },
  { id: 'gen50-20', name: 'Genesis 50:20', description: 'Joseph\'s recognition of God\'s sovereignty in his life: "You intended to harm me, but God intended it for good."' },
];

// Generate relationships between entities
function generateTheologicalConceptGraph(): GraphData {
  // Create nodes
  const nodes: Node[] = [];
  
  // Add themes
  themes.forEach(theme => {
    nodes.push({
      id: theme.id,
      name: theme.name,
      val: 10, // Larger size for themes
      color: '#2c4c3b', // Army/Evergreen tone
      group: 'theme',
      description: theme.description,
      references: []
    });
  });
  
  // Add people
  people.forEach(person => {
    nodes.push({
      id: person.id,
      name: person.name,
      val: 8,
      color: '#3a6351',
      group: 'person',
      description: person.description,
      references: []
    });
  });
  
  // Add places
  places.forEach(place => {
    nodes.push({
      id: place.id,
      name: place.name,
      val: 7,
      color: '#55868c',
      group: 'place',
      description: place.description,
      references: []
    });
  });
  
  // Add concepts
  concepts.forEach(concept => {
    nodes.push({
      id: concept.id,
      name: concept.name,
      val: 9,
      color: '#6a8e7f',
      group: 'concept',
      description: concept.description,
      references: []
    });
  });
  
  // Add verses
  verses.forEach(verse => {
    nodes.push({
      id: verse.id,
      name: verse.name,
      val: 6,
      color: '#8cb369',
      group: 'verse',
      description: verse.description,
      references: []
    });
  });
  
  // Create links
  const links: Link[] = [];
  
  // Theme to theme connections
  links.push({ source: 'creation', target: 'fall', value: 3 });
  links.push({ source: 'fall', target: 'redemption', value: 3 });
  links.push({ source: 'covenant', target: 'promise', value: 4 });
  links.push({ source: 'promise', target: 'blessing', value: 2 });
  links.push({ source: 'redemption', target: 'covenant', value: 3 });
  
  // Theme to people connections
  links.push({ source: 'creation', target: 'adam', value: 4 });
  links.push({ source: 'creation', target: 'eve', value: 4 });
  links.push({ source: 'fall', target: 'adam', value: 3 });
  links.push({ source: 'fall', target: 'eve', value: 3 });
  links.push({ source: 'covenant', target: 'noah', value: 3 });
  links.push({ source: 'covenant', target: 'abraham', value: 5 });
  links.push({ source: 'blessing', target: 'abraham', value: 4 });
  links.push({ source: 'blessing', target: 'isaac', value: 2 });
  links.push({ source: 'blessing', target: 'jacob', value: 3 });
  links.push({ source: 'promise', target: 'abraham', value: 4 });
  links.push({ source: 'redemption', target: 'joseph', value: 3 });
  
  // People to people connections
  links.push({ source: 'adam', target: 'eve', value: 5 });
  links.push({ source: 'abraham', target: 'sarah', value: 4 });
  links.push({ source: 'abraham', target: 'isaac', value: 4 });
  links.push({ source: 'sarah', target: 'isaac', value: 4 });
  links.push({ source: 'isaac', target: 'jacob', value: 3 });
  links.push({ source: 'jacob', target: 'joseph', value: 4 });
  
  // People to places
  links.push({ source: 'adam', target: 'eden', value: 5 });
  links.push({ source: 'eve', target: 'eden', value: 5 });
  links.push({ source: 'noah', target: 'ararat', value: 4 });
  links.push({ source: 'abraham', target: 'ur', value: 2 });
  links.push({ source: 'abraham', target: 'canaan', value: 4 });
  links.push({ source: 'joseph', target: 'egypt', value: 5 });
  links.push({ source: 'jacob', target: 'canaan', value: 3 });
  links.push({ source: 'jacob', target: 'egypt', value: 2 });
  
  // Concepts to people
  links.push({ source: 'sin', target: 'adam', value: 3 });
  links.push({ source: 'sin', target: 'eve', value: 3 });
  links.push({ source: 'faith', target: 'abraham', value: 5 });
  links.push({ source: 'faith', target: 'noah', value: 4 });
  links.push({ source: 'obedience', target: 'abraham', value: 4 });
  links.push({ source: 'obedience', target: 'noah', value: 4 });
  links.push({ source: 'sacrifice', target: 'abraham', value: 4 });
  links.push({ source: 'providence', target: 'joseph', value: 5 });
  links.push({ source: 'judgment', target: 'noah', value: 4 });
  
  // Concepts to themes
  links.push({ source: 'sin', target: 'fall', value: 5 });
  links.push({ source: 'faith', target: 'covenant', value: 4 });
  links.push({ source: 'obedience', target: 'covenant', value: 3 });
  links.push({ source: 'sacrifice', target: 'covenant', value: 3 });
  links.push({ source: 'providence', target: 'redemption', value: 4 });
  links.push({ source: 'judgment', target: 'fall', value: 3 });
  
  // Verses to themes
  links.push({ source: 'gen1-1', target: 'creation', value: 5 });
  links.push({ source: 'gen1-27', target: 'creation', value: 4 });
  links.push({ source: 'gen3-15', target: 'fall', value: 4 });
  links.push({ source: 'gen3-15', target: 'redemption', value: 4 });
  links.push({ source: 'gen6-5', target: 'fall', value: 3 });
  links.push({ source: 'gen12-3', target: 'covenant', value: 5 });
  links.push({ source: 'gen12-3', target: 'promise', value: 5 });
  links.push({ source: 'gen12-3', target: 'blessing', value: 4 });
  links.push({ source: 'gen50-20', target: 'providence', value: 5 });
  links.push({ source: 'gen50-20', target: 'redemption', value: 3 });
  
  // Verses to people
  links.push({ source: 'gen1-27', target: 'adam', value: 3 });
  links.push({ source: 'gen1-27', target: 'eve', value: 3 });
  links.push({ source: 'gen3-15', target: 'eve', value: 3 });
  links.push({ source: 'gen6-5', target: 'noah', value: 4 });
  links.push({ source: 'gen12-3', target: 'abraham', value: 5 });
  links.push({ source: 'gen50-20', target: 'joseph', value: 5 });
  
  return { nodes, links };
}