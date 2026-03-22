import pickle
import numpy as np
from numpy.linalg import norm
import os
from collections import defaultdict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# load skill embeddings
with open(os.path.join(BASE_DIR, "skill_embeddings.pkl"), "rb") as f:
    data = pickle.load(f)

canonical_skills = data["skills"]
skill_embeddings = np.array(data["embeddings"])

skill_to_idx = {s:i for i,s in enumerate(canonical_skills)}

# Domain keyword mapping (same as notebook)
domain_keywords = {
    "Software Developer": ["software", "developer", "programmer", "application developer", "web developer", "java developer", "full stack", "frontend", "backend", "mobile", "sde"],
    "Data Scientist": ["data scientist", "machine learning", "ml engineer", "ai research", "deep learning", "research scientist"],
    "Data Analyst": ["data analyst", "business intelligence", "analytics", "tableau", "power bi", "reporting"],
    "Business Analyst": ["business analyst", "requirements", "systems analyst", "functional analyst"],
    "DevOps / SRE": ["devops", "site reliability", "sre", "infrastructure"],
    "QA / Test Engineer": ["quality assurance", "tester", "qa"],
    "Product Manager": ["product manager", "product owner"],
    "UX / UI Designer": ["ux designer", "ui designer", "interaction designer"]
}

# load occupation mapping
import pandas as pd

skills_df = pd.read_excel(os.path.join(BASE_DIR, "data/Skills.xlsx"), engine="openpyxl")
occ_df = pd.read_excel(os.path.join(BASE_DIR, "data/Occupation Data.xlsx"), engine="openpyxl")

occ_skills = skills_df.groupby("O*NET-SOC Code")["Element Name"].apply(list).to_dict()

occupation_titles = dict(zip(occ_df["O*NET-SOC Code"], occ_df["Title"]))

domain_skills = defaultdict(set)

for code, title in occupation_titles.items():
    title_l = str(title).lower()
    skills = occ_skills.get(code, [])

    for domain, kws in domain_keywords.items():
        if any(kw in title_l for kw in kws):
            domain_skills[domain].update(skills)

# limit domain skill size (critical)
domain_skills = {
    d: list(s)[:400]
    for d, s in domain_skills.items()
}

# build domain vectors
domain_vectors = {}

for domain, skills in domain_skills.items():
    idxs = [skill_to_idx[s] for s in skills if s in skill_to_idx]
    vec = skill_embeddings[idxs].mean(axis=0)
    domain_vectors[domain] = vec

with open(os.path.join(BASE_DIR, "domain_vectors.pkl"), "wb") as f:
    pickle.dump(domain_vectors, f)

print("Domain vectors built:", len(domain_vectors))