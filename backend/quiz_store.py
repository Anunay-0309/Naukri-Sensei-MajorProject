QUIZ_ANSWER_KEY = {}

def store_answers(quiz, question_bank):

    global QUIZ_ANSWER_KEY
    QUIZ_ANSWER_KEY = {}

    for q in quiz:
        skill = q["skill"]
        question_text = q["question"]

        for qb in question_bank[skill]:
            if qb[0] == question_text:
                QUIZ_ANSWER_KEY[q["id"]] = {
                    "skill": skill,
                    "correct": qb[2]
                }

    print("ANSWER KEY:", QUIZ_ANSWER_KEY)

def get_answer_key():
    return QUIZ_ANSWER_KEY