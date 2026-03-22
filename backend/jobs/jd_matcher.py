import numpy as np
import pickle
import os
from numpy.linalg import norm
from backend.core.resume_skill_extractor import extract_skills_from_resume_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CORE_DIR = os.path.join(BASE_DIR, "..", "core")

with open(os.path.join(CORE_DIR, "skill_embeddings.pkl"), "rb") as f:
    data = pickle.load(f)

canonical_skills = data["skills"]
skill_embeddings = np.array(data["embeddings"])

skill_to_idx = {s:i for i,s in enumerate(canonical_skills)}

def build_skill_vector(skills):
    idxs = [skill_to_idx[s] for s in skills if s in skill_to_idx]
    if not idxs:
        return None
    return skill_embeddings[idxs].mean(axis=0)

def compute_match_score(resume_skills, jd_text):

    jd_skills = extract_skills_from_resume_text(jd_text)

    resume_vec = build_skill_vector(resume_skills)
    jd_vec = build_skill_vector(jd_skills)

    if resume_vec is None or jd_vec is None:
        return 0

    score = np.dot(resume_vec, jd_vec) / (norm(resume_vec) * norm(jd_vec))
    return round(max(0, score) * 100, 2)