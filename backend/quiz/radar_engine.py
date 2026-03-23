import numpy as np

def compute_radar(quiz, submission, subjective_scores):

    conceptual = []
    applied = []
    tools = []
    problem = []
    system = []

    for i, q in enumerate(quiz["mcq"]):

        correct = submission["mcq_answers"][i] == q["correct"]

        score = 1 if correct else 0

        if q["difficulty"] == "easy":
            conceptual.append(score)

        elif q["difficulty"] == "medium":
            applied.append(score)
            tools.append(score)

        elif q["difficulty"] == "hard":
            problem.append(score)

    if subjective_scores:

        conceptual.append(subjective_scores[0])
        applied.append(subjective_scores[0])

        if len(subjective_scores) > 1:
            system.append(subjective_scores[1])

    def normalize(x):
        return float(np.mean(x) * 10) if x else 0.0

    return {
        "conceptual": normalize(conceptual),
        "applied_engineering": normalize(applied),
        "tools_framework": normalize(tools),
        "problem_solving": normalize(problem),
        "system_design": normalize(system)
    }