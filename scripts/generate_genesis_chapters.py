#!/usr/bin/env python3

"""
Script to generate structured Genesis chapter files with full text and metadata
This will create individual files for each chapter with all verses and rich metadata
"""

import json
import os
from pathlib import Path

# Genesis metadata with rich details for each chapter
GENESIS_METADATA = {
    1: {
        "title": "Creation",
        "summary": "God creates the heavens, earth, plants, animals, and humans.",
        "timeframe": "Beginning of time",
        "themes": ["Creation", "Order from chaos", "Divine power", "Good vs. void"],
        "people": ["God"],
        "places": ["Heaven", "Earth", "Waters", "Firmament"],
        "symbols": ["Light", "Darkness", "Day", "Night", "Waters", "Land"],
        "narrative_type": "Divine action",
    },
    2: {
        "title": "Garden of Eden",
        "summary": "God creates Adam, places him in Eden, creates Eve as his companion.",
        "timeframe": "Sixth day of creation",
        "themes": ["Creation of humanity", "Paradise", "Companionship", "Marriage"],
        "people": ["God", "Adam", "Eve"],
        "places": ["Garden of Eden", "Rivers of Eden", "Tree of Life", "Tree of Knowledge"],
        "symbols": ["Dust", "Breath", "Rib", "Trees", "Rivers"],
        "narrative_type": "Divine action, human experience",
    },
    3: {
        "title": "The Fall",
        "summary": "The serpent tempts Eve, Adam and Eve eat from the forbidden tree and are expelled from Eden.",
        "timeframe": "After creation",
        "themes": ["Sin", "Temptation", "Disobedience", "Judgment", "Consequences", "Promise"],
        "people": ["God", "Adam", "Eve", "Serpent"],
        "places": ["Garden of Eden", "East of Eden"],
        "symbols": ["Fruit", "Serpent", "Nakedness", "Fig leaves", "Flaming sword"],
        "narrative_type": "Temptation, fall, judgment",
    }
}

def load_genesis_metadata():
    """Load metadata for Genesis chapters"""
    return GENESIS_METADATA

def load_bible_data():
    """Load full Bible data or create minimal structure if not exists"""
    data_dir = Path('./data')
    data_dir.mkdir(exist_ok=True)
    
    bible_path = data_dir / 'bible_full.json'
    if bible_path.exists():
        with open(bible_path, 'r') as f:
            return json.load(f)
    
    # Create minimal Bible data structure if not exists
    return {
        "genesis": {
            "name": "Genesis",
            "chapters": []
        }
    }

def organize_genesis_by_chapter(bible_data):
    """Organize Genesis data by chapter"""
    genesis_by_chapter = {}
    
    if 'genesis' not in bible_data:
        return genesis_by_chapter
    
    for idx, chapter in enumerate(bible_data['genesis']['chapters']):
        chapter_num = idx + 1
        if 'verses' in chapter:
            genesis_by_chapter[chapter_num] = chapter['verses']
    
    return genesis_by_chapter

def create_enriched_chapters(genesis_by_chapter, genesis_metadata):
    """Create enriched chapter data with full metadata"""
    enriched_chapters = {}
    
    for chapter_num, metadata in genesis_metadata.items():
        # Skip if we don't have verse data for this chapter
        if chapter_num not in genesis_by_chapter:
            print(f"⚠️ No verse data for Genesis chapter {chapter_num}, skipping")
            continue
        
        verses = genesis_by_chapter[chapter_num]
        
        # Create enriched chapter with metadata
        enriched_chapter = {
            "book": "genesis",
            "bookName": "Genesis",
            "chapter": chapter_num,
            "title": metadata["title"],
            "summary": metadata["summary"],
            "timeframe": metadata["timeframe"],
            "themes": metadata["themes"],
            "people": metadata["people"],
            "places": metadata["places"],
            "symbols": metadata["symbols"],
            "narrative_type": metadata["narrative_type"],
            "verses": []
        }
        
        # Enrich each verse with metadata and reference info
        for verse_idx, verse_data in enumerate(verses):
            if verse_data is None:
                continue
                
            verse_num = verse_idx + 1
            
            # Create reference ID
            ref_id = f"Genesis {chapter_num}:{verse_num}"
            
            enriched_verse = {
                "verseNumber": verse_num,
                "reference": ref_id,
                "text": verse_data,  # Contains KJV and WEB translations
                "tags": {
                    "themes": metadata["themes"],
                    "people": metadata["people"],
                    "places": metadata["places"],
                    "symbols": metadata["symbols"],
                },
                "cross_references": [],  # Would be populated with relevant cross-references
                "importance": "high" if verse_num == 1 else "medium"  # First verse usually more significant
            }
            
            enriched_chapter["verses"].append(enriched_verse)
        
        enriched_chapters[chapter_num] = enriched_chapter
    
    return enriched_chapters

def write_chapter_files(enriched_chapters):
    """Write each chapter to its own file"""
    output_dir = Path('./data/genesis')
    output_dir.mkdir(exist_ok=True, parents=True)
    
    for chapter_num, chapter_data in enriched_chapters.items():
        output_path = output_dir / f"chapter_{chapter_num}.json"
        
        with open(output_path, 'w') as f:
            json.dump(chapter_data, f, indent=2)
        
        print(f"✅ Created Genesis chapter {chapter_num} file: {output_path}")

def generate_rag_index(enriched_chapters, genesis_metadata):
    """Generate a RAG index for Genesis themes and concepts"""
    rag_data = {
        "themes": {},
        "people": {},
        "places": {},
        "symbols": {},
        "connections": []
    }
    
    # Collect all unique elements
    all_themes = set()
    all_people = set()
    all_places = set()
    all_symbols = set()
    
    for chapter_num, metadata in genesis_metadata.items():
        if chapter_num in enriched_chapters:
            all_themes.update(metadata["themes"])
            all_people.update(metadata["people"])
            all_places.update(metadata["places"])
            all_symbols.update(metadata["symbols"])
    
    # Create node data for each theme
    for theme in all_themes:
        chapters_with_theme = [ch for ch, data in genesis_metadata.items() 
                            if theme in data["themes"] and ch in enriched_chapters]
        
        rag_data["themes"][theme] = {
            "name": theme,
            "description": f"A key theme in Genesis chapters {', '.join(map(str, chapters_with_theme))}",
            "chapters": chapters_with_theme,
            "connected_people": [],
            "connected_places": [],
            "connected_symbols": []
        }
    
    # Create node data for each person
    for person in all_people:
        chapters_with_person = [ch for ch, data in genesis_metadata.items() 
                              if person in data["people"] and ch in enriched_chapters]
        
        rag_data["people"][person] = {
            "name": person,
            "description": f"Appears in Genesis chapters {', '.join(map(str, chapters_with_person))}",
            "chapters": chapters_with_person,
            "connected_themes": [],
            "connected_places": [],
            "connected_symbols": []
        }
    
    # Create node data for each place
    for place in all_places:
        chapters_with_place = [ch for ch, data in genesis_metadata.items() 
                             if place in data["places"] and ch in enriched_chapters]
        
        rag_data["places"][place] = {
            "name": place,
            "description": f"Location in Genesis chapters {', '.join(map(str, chapters_with_place))}",
            "chapters": chapters_with_place,
            "connected_themes": [],
            "connected_people": [],
            "connected_symbols": []
        }
    
    # Create node data for each symbol
    for symbol in all_symbols:
        chapters_with_symbol = [ch for ch, data in genesis_metadata.items() 
                               if symbol in data["symbols"] and ch in enriched_chapters]
        
        rag_data["symbols"][symbol] = {
            "name": symbol,
            "description": f"Symbol in Genesis chapters {', '.join(map(str, chapters_with_symbol))}",
            "chapters": chapters_with_symbol,
            "connected_themes": [],
            "connected_people": [],
            "connected_places": []
        }
    
    # Create connections between entities
    for chapter_num, metadata in genesis_metadata.items():
        if chapter_num not in enriched_chapters:
            continue
            
        # Connect themes to people, places, symbols that appear in the same chapter
        for theme in metadata["themes"]:
            for person in metadata["people"]:
                rag_data["themes"][theme]["connected_people"].append(person)
                rag_data["people"][person]["connected_themes"].append(theme)
                rag_data["connections"].append({
                    "source": theme, 
                    "target": person, 
                    "type": "theme_person", 
                    "chapter": chapter_num
                })
            
            for place in metadata["places"]:
                rag_data["themes"][theme]["connected_places"].append(place)
                rag_data["places"][place]["connected_themes"].append(theme)
                rag_data["connections"].append({
                    "source": theme, 
                    "target": place, 
                    "type": "theme_place", 
                    "chapter": chapter_num
                })
                
            for symbol in metadata["symbols"]:
                rag_data["themes"][theme]["connected_symbols"].append(symbol)
                rag_data["symbols"][symbol]["connected_themes"].append(theme)
                rag_data["connections"].append({
                    "source": theme, 
                    "target": symbol, 
                    "type": "theme_symbol", 
                    "chapter": chapter_num
                })
        
        # Connect people to places, symbols
        for person in metadata["people"]:
            for place in metadata["places"]:
                rag_data["people"][person]["connected_places"].append(place)
                rag_data["places"][place]["connected_people"].append(person)
                rag_data["connections"].append({
                    "source": person, 
                    "target": place, 
                    "type": "person_place", 
                    "chapter": chapter_num
                })
                
            for symbol in metadata["symbols"]:
                rag_data["people"][person]["connected_symbols"].append(symbol)
                rag_data["symbols"][symbol]["connected_people"].append(person)
                rag_data["connections"].append({
                    "source": person, 
                    "target": symbol, 
                    "type": "person_symbol", 
                    "chapter": chapter_num
                })
        
        # Connect places to symbols
        for place in metadata["places"]:
            for symbol in metadata["symbols"]:
                rag_data["places"][place]["connected_symbols"].append(symbol)
                rag_data["symbols"][symbol]["connected_places"].append(place)
                rag_data["connections"].append({
                    "source": place, 
                    "target": symbol, 
                    "type": "place_symbol", 
                    "chapter": chapter_num
                })
    
    # Remove duplicates in connected lists
    for theme_data in rag_data["themes"].values():
        theme_data["connected_people"] = list(set(theme_data["connected_people"]))
        theme_data["connected_places"] = list(set(theme_data["connected_places"]))
        theme_data["connected_symbols"] = list(set(theme_data["connected_symbols"]))
    
    for person_data in rag_data["people"].values():
        person_data["connected_themes"] = list(set(person_data["connected_themes"]))
        person_data["connected_places"] = list(set(person_data["connected_places"]))
        person_data["connected_symbols"] = list(set(person_data["connected_symbols"]))
    
    for place_data in rag_data["places"].values():
        place_data["connected_themes"] = list(set(place_data["connected_themes"]))
        place_data["connected_people"] = list(set(place_data["connected_people"]))
        place_data["connected_symbols"] = list(set(place_data["connected_symbols"]))
    
    for symbol_data in rag_data["symbols"].values():
        symbol_data["connected_themes"] = list(set(symbol_data["connected_themes"]))
        symbol_data["connected_people"] = list(set(symbol_data["connected_people"]))
        symbol_data["connected_places"] = list(set(symbol_data["connected_places"]))
    
    # Write the RAG index to a file
    output_dir = Path('./data')
    output_path = output_dir / 'genesis_rag_index.json'
    
    with open(output_path, 'w') as f:
        json.dump(rag_data, f, indent=2)
    
    print(f"✅ Created Genesis RAG index: {output_path}")
    print(f"   Included: {len(rag_data['themes'])} themes, {len(rag_data['people'])} people, " +
          f"{len(rag_data['places'])} places, {len(rag_data['symbols'])} symbols, {len(rag_data['connections'])} connections")
    
    return rag_data

def main():
    """Main function to generate Genesis chapter files"""
    print("🔍 Loading Bible data and metadata...")
    
    # Load data
    genesis_metadata = load_genesis_metadata()
    bible_data = load_bible_data()
    
    # Organize Genesis data by chapter
    genesis_by_chapter = organize_genesis_by_chapter(bible_data)
    
    if not genesis_by_chapter:
        print("⚠️ No Genesis verse data found in Bible data")
        return
    
    # Create enriched chapters with metadata
    print("📝 Creating enriched chapter data...")
    enriched_chapters = create_enriched_chapters(genesis_by_chapter, genesis_metadata)
    
    # Write each chapter to its own file
    print("💾 Writing chapter files...")
    write_chapter_files(enriched_chapters)
    
    # Generate a RAG index for Genesis
    print("🔍 Generating RAG index...")
    generate_rag_index(enriched_chapters, genesis_metadata)
    
    print("✅ Genesis chapter generation complete")

if __name__ == "__main__":
    main()