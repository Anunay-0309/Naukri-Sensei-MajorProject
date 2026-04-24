import random

def score_answer(answer):
    words = len(answer.split())

    # Simple heuristic scoring
    fluency = min(10, max(3, words // 5))
    confidence = min(10, max(4, words // 6))
    correctness = min(10, max(5, words // 7))
    depth = min(10, max(4, words // 8))

    return {
        "fluency": fluency,
        "confidence": confidence,
        "correctness": correctness,
        "depth": depth
    }


def evaluate_interview(answers):

    total_scores = {
        "fluency": 0,
        "confidence": 0,
        "correctness": 0,
        "depth": 0
    }

    count = len(answers)

    strengths = []
    weaknesses = []

    for ans in answers:
        text = ans.get("answer", "")

        scores = score_answer(text)

        for k in total_scores:
            total_scores[k] += scores[k]

        # detect strengths / weaknesses
        if scores["confidence"] > 7:
            strengths.append("Confident communication")

        if scores["depth"] < 5:
            weaknesses.append("Lack of depth in answers")

        if len(text.split()) < 8:
            weaknesses.append("Answers were too brief")

    # average scores
    avg_scores = {
        k: round(v / count, 1) if count > 0 else 0
        for k, v in total_scores.items()
    }

    # remove duplicates
    strengths = list(set(strengths))
    weaknesses = list(set(weaknesses))

    # overall feedback tone variation
    feedback_styles = [
        "You showed good potential, but there is room for improvement.",
        "Your performance was decent, with some strong points.",
        "You demonstrated basic understanding, but need refinement.",
        "There were some good moments, but consistency is needed."
    ]

    overall_feedback = random.choice(feedback_styles)

    # tips
    tips = [
        "Structure your answers with a clear beginning, middle, and end.",
        "Try to include examples in your answers.",
        "Speak confidently and avoid hesitation.",
        "Expand slightly more on key concepts.",
        "Practice explaining concepts out loud."
    ]

    return {
        "scores": avg_scores,
        "overall_feedback": overall_feedback,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "tips": random.sample(tips, min(3, len(tips)))
    }