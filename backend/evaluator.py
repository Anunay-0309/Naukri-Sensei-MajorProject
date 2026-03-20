from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

def evaluate_subjective(expected, user):
    emb1 = model.encode(expected, convert_to_tensor=True)
    emb2 = model.encode(user, convert_to_tensor=True)
    score = util.cos_sim(emb1, emb2)
    return float(score)