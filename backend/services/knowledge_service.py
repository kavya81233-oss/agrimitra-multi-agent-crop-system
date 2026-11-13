import json
import os
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models.models import AgriculturalKnowledge

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(BASE_DIR, "knowledge_base", "crops_data.json")

def load_knowledge_data() -> List[Dict[str, Any]]:
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def seed_knowledge_base(db: Session):
    count = db.query(AgriculturalKnowledge).count()
    if count == 0:
        data = load_knowledge_data()
        for item in data:
            ak = AgriculturalKnowledge(
                crop=item.get("crop", "General"),
                disease_or_topic=item.get("disease_or_topic", ""),
                scientific_name=item.get("scientific_name"),
                pathogen_type=item.get("pathogen_type"),
                symptoms=item.get("symptoms", ""),
                causes=item.get("causes", ""),
                organic_remedies=item.get("organic_remedies", ""),
                chemical_guidelines=item.get("chemical_guidelines", ""),
                preventive_measures=item.get("preventive_measures", ""),
                sources=item.get("sources", ""),
                tags=item.get("tags", "")
            )
            db.add(ak)
        db.commit()

def search_knowledge(
    crop: Optional[str] = None,
    query: Optional[str] = None,
    limit: int = 5
) -> List[Dict[str, Any]]:
    data = load_knowledge_data()
    results = []

    crop_clean = crop.lower().strip() if crop else ""
    query_terms = [t.lower().strip() for t in query.split()] if query else []

    for item in data:
        score = 0
        item_crop = item.get("crop", "").lower()
        item_disease = item.get("disease_or_topic", "").lower()
        item_symptoms = item.get("symptoms", "").lower()
        item_tags = item.get("tags", "").lower()

        # Match crop
        if crop_clean and crop_clean in item_crop:
            score += 15
        elif crop_clean and item_crop == "general":
            score += 2

        # Match query keywords
        for term in query_terms:
            if term in item_disease:
                score += 10
            if term in item_symptoms:
                score += 5
            if term in item_tags:
                score += 4

        if score > 0 or (not crop_clean and not query_terms):
            results.append((score, item))

    # Sort descending by score
    results.sort(key=lambda x: x[0], reverse=True)
    return [r[1] for r in results[:limit]] if results else data[:limit]
