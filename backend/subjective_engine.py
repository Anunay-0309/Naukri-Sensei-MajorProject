from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def evaluate_subjective(expected_answer, user_answer):
    
    emb1 = model.encode(expected_answer, convert_to_tensor=True)
    emb2 = model.encode(user_answer, convert_to_tensor=True)

    score = util.cos_sim(emb1, emb2)

    return float(score)