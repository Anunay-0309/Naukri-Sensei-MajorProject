import pickle
import numpy as np
import os
from numpy.linalg import norm

from backend.core.resume_skill_extractor import extract_skills_from_resume_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("Loading skill embeddings...")
with open(os.path.join(BASE_DIR, "skill_embeddings.pkl"), "rb") as f:
    data = pickle.load(f)

canonical_skills = data["skills"]
skill_embeddings = np.array(data["embeddings"])

skill_to_idx = {s:i for i,s in enumerate(canonical_skills)}

print("Loading domain vectors...")
with open(os.path.join(BASE_DIR, "domain_vectors.pkl"), "rb") as f:
    domain_vectors = pickle.load(f)

def compute_domain_confidences(resume_text, match_threshold=0.60):

    resume_skills = extract_skills_from_resume_text(resume_text, match_threshold=match_threshold)

    if not resume_skills:
        return resume_skills, {d: 0.0 for d in domain_vectors}

    idxs = [skill_to_idx[s] for s in resume_skills if s in skill_to_idx]

    if not idxs:
        return resume_skills, {d: 0.0 for d in domain_vectors}

    resume_vec = np.array(skill_embeddings[idxs].mean(axis=0))

    confs = {}

    for d, dv in domain_vectors.items():
        cos = float(np.dot(resume_vec, dv) / (norm(resume_vec) * norm(dv)))
        confs[d] = round(max(0, cos) * 100, 1)

    return resume_skills, confs