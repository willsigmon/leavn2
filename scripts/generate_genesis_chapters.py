#!/usr/bin/env python3
"""
Script to generate structured Genesis chapter files with full text and metadata
This will create individual files for each chapter with all verses and rich metadata
"""

import json
import os
from pathlib import Path

# Load the Genesis metadata we created
def load_genesis_metadata():
    try:
        with open('./data/genesis/genesis_metadata.json', 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading Genesis metadata: {e}")
        return None

# Load the Bible data
def load_bible_data():
    try:
        with open('./data/bible_full.json', 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading Bible data: {e}")
        return None

# Filter Genesis verses and organize by chapter
def organize_genesis_by_chapter(bible_data):
    genesis_by_chapter = {}
    
    # Filter Genesis verses
    genesis_verses = [verse for verse in bible_data if verse['book'] == 'Genesis']
    
    # Group by chapter
    for verse in genesis_verses:
        chapter_num = verse['chapter']
        if chapter_num not in genesis_by_chapter:
            genesis_by_chapter[chapter_num] = []
        
        genesis_by_chapter[chapter_num].append(verse)
    
    # Sort verses within each chapter
    for chapter in genesis_by_chapter:
        genesis_by_chapter[chapter].sort(key=lambda v: v['verse'])
    
    return genesis_by_chapter

# Create enriched chapter data with metadata
def create_enriched_chapters(genesis_by_chapter, genesis_metadata):
    enriched_chapters = {}
    
    for chapter_num, verses in genesis_by_chapter.items():
        chapter_str = str(chapter_num)
        
        # Get chapter metadata if available
        chapter_metadata = genesis_metadata['chapters'].get(chapter_str, {})
        
        # Create enriched chapter
        enriched_chapter = {
            'chapter_number': chapter_num,
            'title': chapter_metadata.get('title', f'Genesis Chapter {chapter_num}'),
            'summary': chapter_metadata.get('summary', ''),
            'themes': chapter_metadata.get('themes', []),
            'people': chapter_metadata.get('people', []),
            'places': chapter_metadata.get('places', []),
            'timeframe': chapter_metadata.get('timeframe', ''),
            'symbols': chapter_metadata.get('symbols', []),
            'narrative': chapter_metadata.get('narrative', ''),
            'connections': chapter_metadata.get('connections', []),
            'verses': []
        }
        
        # Process each verse
        for verse in verses:
            # Create tags for the verse based on chapter metadata
            verse_tags = {
                'themes': chapter_metadata.get('themes', []).copy(),
                'people': chapter_metadata.get('people', []).copy(),
                'places': chapter_metadata.get('places', []).copy(),
                'symbols': [],
                'emotions': [],
                'timeframe': [chapter_metadata.get('timeframe', '')] if chapter_metadata.get('timeframe') else [],
                'cross_refs': []
            }
            
            # Add the verse to the enriched chapter
            enriched_verse = {
                'verse_number': verse['verse'],
                'text': {
                    'kjv': verse['text']['kjv'],
                    'web': verse['text']['web']
                },
                'tags': verse_tags,
                'is_key_verse': verse['verse'] in chapter_metadata.get('keyVerses', [])
            }
            
            # Add cross-references for key verses
            if enriched_verse['is_key_verse'] and 'connections' in chapter_metadata:
                enriched_verse['cross_references'] = chapter_metadata['connections']
                # Add cross-ref IDs to tags
                verse_tags['cross_refs'] = [conn['id'] for conn in chapter_metadata['connections']]
            
            # Filter symbols that actually appear in the verse text
            if 'symbols' in chapter_metadata:
                for symbol in chapter_metadata['symbols']:
                    if symbol.lower() in verse['text']['kjv'].lower():
                        verse_tags['symbols'].append(symbol)
            
            # Simple emotion detection (very basic)
            emotion_keywords = {
                'joy': ['joy', 'rejoice', 'glad', 'happy', 'delight', 'pleasure', 'blessed'],
                'sorrow': ['sorrow', 'grief', 'mourn', 'weep', 'sad', 'afflicted', 'distressed'],
                'fear': ['fear', 'afraid', 'terror', 'dread', 'trembled', 'frightened'],
                'anger': ['anger', 'wrath', 'fury', 'indignation', 'rage', 'angry'],
                'shame': ['shame', 'ashamed', 'disgrace', 'humiliated', 'embarrassed'],
                'peace': ['peace', 'calm', 'rest', 'quiet', 'tranquil'],
                'hope': ['hope', 'expect', 'anticipation', 'await', 'look forward'],
                'love': ['love', 'beloved', 'affection', 'cherish', 'compassion'],
                'guilt': ['guilt', 'guilty', 'condemn', 'blame', 'fault', 'sin']
            }
            
            text_lower = verse['text']['kjv'].lower()
            for emotion, keywords in emotion_keywords.items():
                for keyword in keywords:
                    if keyword in text_lower:
                        if emotion not in verse_tags['emotions']:
                            verse_tags['emotions'].append(emotion)
                        break
            
            enriched_chapter['verses'].append(enriched_verse)
        
        enriched_chapters[chapter_num] = enriched_chapter
    
    return enriched_chapters

# Write chapters to individual files
def write_chapter_files(enriched_chapters):
    output_dir = Path('./data/genesis/chapters')
    output_dir.mkdir(exist_ok=True)
    
    for chapter_num, chapter_data in enriched_chapters.items():
        output_file = output_dir / f"genesis_{chapter_num}.json"
        
        with open(output_file, 'w') as f:
            json.dump(chapter_data, f, indent=2)
        
        print(f"Created chapter file: {output_file}")

# Generate RAG index for Genesis
def generate_rag_index(enriched_chapters, genesis_metadata):
    # Create a simplified index for searching and topic exploration
    rag_index = {
        'book_info': genesis_metadata['book'],
        'chapters': {},
        'themes': set(),
        'people': set(),
        'places': set(),
        'symbols': set(),
        'emotions': set(),
        'cross_references': set()
    }
    
    # Collect chapter info and all unique tags
    for chapter_num, chapter_data in enriched_chapters.items():
        # Add chapter summary to index
        rag_index['chapters'][chapter_num] = {
            'title': chapter_data['title'],
            'summary': chapter_data['summary'],
            'key_verses': [v['verse_number'] for v in chapter_data['verses'] if v.get('is_key_verse', False)]
        }
        
        # Collect all themes, people, places, etc.
        rag_index['themes'].update(chapter_data['themes'])
        rag_index['people'].update(chapter_data['people'])
        rag_index['places'].update(chapter_data['places'])
        rag_index['symbols'].update(chapter_data['symbols'])
        
        # Process verse-level tags
        for verse in chapter_data['verses']:
            if 'emotions' in verse['tags']:
                rag_index['emotions'].update(verse['tags']['emotions'])
            
            if 'cross_refs' in verse['tags']:
                rag_index['cross_references'].update(verse['tags']['cross_refs'])
    
    # Convert sets to sorted lists for JSON serialization
    rag_index['themes'] = sorted(list(rag_index['themes']))
    rag_index['people'] = sorted(list(rag_index['people']))
    rag_index['places'] = sorted(list(rag_index['places']))
    rag_index['symbols'] = sorted(list(rag_index['symbols']))
    rag_index['emotions'] = sorted(list(rag_index['emotions']))
    rag_index['cross_references'] = sorted(list(rag_index['cross_references']))
    
    # Write index to file
    output_file = Path('./data/genesis/genesis_rag_index.json')
    with open(output_file, 'w') as f:
        json.dump(rag_index, f, indent=2)
    
    print(f"Created RAG index: {output_file}")

def main():
    print("Loading Genesis metadata...")
    genesis_metadata = load_genesis_metadata()
    if not genesis_metadata:
        return
    
    print("Loading Bible data...")
    bible_data = load_bible_data()
    if not bible_data:
        return
    
    print("Organizing Genesis verses by chapter...")
    genesis_by_chapter = organize_genesis_by_chapter(bible_data)
    
    print("Creating enriched chapter data...")
    enriched_chapters = create_enriched_chapters(genesis_by_chapter, genesis_metadata)
    
    print("Writing individual chapter files...")
    write_chapter_files(enriched_chapters)
    
    print("Generating RAG index...")
    generate_rag_index(enriched_chapters, genesis_metadata)
    
    print("Genesis data generation complete!")

if __name__ == "__main__":
    main()