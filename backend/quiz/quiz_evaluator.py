from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def evaluate_quiz(quiz, submission):

    mcq_score = 0
    for i, q in enumerate(quiz["mcq"]):
        if submission["mcq_answers"][i] == q["correct"]:
            mcq_score += 1

    subjective_scores = []

    for i, q in enumerate(quiz["subjective"]):
        ideal = model.encode(q["ideal_answer"])
        user = model.encode(submission["subjective_answers"][i])

        sim = cosine(ideal, user)
        subjective_scores.append(sim)

    return mcq_score, subjective_scores