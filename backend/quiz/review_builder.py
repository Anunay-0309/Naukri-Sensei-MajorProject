def build_review(quiz, submission):

    review = []

    for i, q in enumerate(quiz["mcq"]):

        user_ans = submission["mcq_answers"][i]

        review.append({
            "question": q["question"],
            "options": q["options"],
            "correct": q["correct"],
            "user_answer": user_ans,
            "is_correct": user_ans == q["correct"],
            "explanation": q.get("explanation", "")
        })

    return review