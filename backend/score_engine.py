def compute_skill_scores(mcq_results, subjective_results):

    scores = {}

    for skill, correct in mcq_results.items():
        scores[skill] = correct * 10   # simple weight

    for skill, score in subjective_results.items():
        scores[skill] = scores.get(skill, 0) + int(score * 50)

    return scores

def detect_weak_areas(scores):

    weak = []

    for skill, val in scores.items():
        if val < 40:
            weak.append(skill)

    return weak