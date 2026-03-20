import numpy as np

def generate_radar(skill_scores, mcq_total, mcq_correct, subjective_scores):

    # Conceptual Knowledge
    if mcq_total == 0:
        conceptual = 0
    else:
        conceptual = (mcq_correct / mcq_total) * 100

    # Practical Understanding
    if len(subjective_scores) == 0:
        practical = 0
    else:
        practical = (sum(subjective_scores) / len(subjective_scores)) * 100

    # Project Depth
    project_depth = practical * 0.7 + conceptual * 0.3

    # Confidence (based on variance)
    vals = list(skill_scores.values())
    if len(vals) > 1:
        confidence = max(0, 100 - np.std(vals) * 10)
    else:
        confidence = conceptual

    # Resume Authenticity
    authenticity = (conceptual + practical) / 2

    return {
        "conceptual_knowledge": int(conceptual),
        "practical_understanding": int(practical),
        "project_depth": int(project_depth),
        "confidence": int(confidence),
        "resume_authenticity": int(authenticity)
    }