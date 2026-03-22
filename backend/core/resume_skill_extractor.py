import pickle
import numpy as np
import os
import spacy
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("Loading skill embeddings...")
with open(os.path.join(BASE_DIR, "skill_embeddings.pkl"), "rb") as f:
    data = pickle.load(f)

canonical_skills = data["skills"]
skill_embeddings = np.array(data["embeddings"])

print("Loading embedding model (CPU)...")
embed_model = SentenceTransformer(MODEL_NAME)

print("Loading spaCy...")
nlp = spacy.load("en_core_web_sm")


def extract_candidate_phrases(text, max_phrase_len=4):
    doc = nlp(text)
    cand = set()

    for chunk in doc.noun_chunks:
        s = chunk.text.strip()
        if 1 <= len(s.split()) <= max_phrase_len:
            cand.add(s)

    for ent in doc.ents:
        s = ent.text.strip()
        if 1 <= len(s.split()) <= max_phrase_len:
            cand.add(s)

    for token in doc:
        t = token.text.strip()
        if len(t) > 0 and (
            (t.isupper() and len(t) <= 6) or
            (t[0].isupper() and len(t) <= 12)
        ):
            if len(t.split()) == 1:
                cand.add(t)

    return list(cand)


def extract_skills_from_resume_text(text, candidate_top_k=200, match_threshold=0.45):

    candidates = extract_candidate_phrases(text)

    if not candidates:
        return []

    candidates = candidates[:candidate_top_k]

    # Embed candidate phrases
    cand_emb = embed_model.encode(candidates)

    # Normalize embeddings
    cand_norm = cand_emb / np.linalg.norm(cand_emb, axis=1, keepdims=True)
    skill_norm = skill_embeddings / np.linalg.norm(skill_embeddings, axis=1, keepdims=True)

    # Cosine similarity
    cos_scores = np.dot(cand_norm, skill_norm.T)

    detected = set()

    for i, cand in enumerate(candidates):
        best_idx = int(np.argmax(cos_scores[i]))
        best_score = float(cos_scores[i][best_idx])

        if best_score >= match_threshold:
            detected.add(canonical_skills[best_idx])

    return sorted(list(detected))