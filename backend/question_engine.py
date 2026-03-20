import random

SUBJECTIVE_BANK = {
    "python": "Explain a project where you used Python.",
    "java": "Explain how Java OOP concepts are used in real applications.",
    "tensorflow": "Explain a deep learning model you implemented.",
    "pytorch": "Explain how PyTorch differs from TensorFlow."
}

QUESTION_BANK = {
    "python": [
        ("What is a Python list?", 
         ["Mutable collection", "Database", "Compiler", "IDE"], 0),
        ("Which keyword defines a function in Python?",
         ["func", "define", "def", "function"], 2),
        ("Which library is used for data analysis?",
         ["NumPy", "Pandas", "Flask", "Django"], 1),
    ],
    "java": [
        ("Java is which type of language?",
         ["Compiled", "Interpreted", "Both", "None"], 2),
        ("Which keyword is used for inheritance?",
         ["this", "super", "extends", "implements"], 2),
    ],
    "tensorflow": [
        ("TensorFlow is mainly used for?",
         ["Web dev", "Machine learning", "Database", "Networking"], 1),
    ],
    "pytorch": [
        ("PyTorch is popular for?",
         ["Game dev", "ML research", "OS dev", "Networking"], 1),
    ]
}

def generate_quiz(skills):

    quiz = []
    qid = 1

    # MCQ generation
    for skill in skills:
        if skill in QUESTION_BANK:
            for q in QUESTION_BANK[skill]:
                quiz.append({
                    "id": qid,
                    "skill": skill,
                    "question": q[0],
                    "options": q[1]
                })
                qid += 1

    random.shuffle(quiz)

    # SUBJECTIVE generation
    subjective = []
    for skill in skills:
        if skill in SUBJECTIVE_BANK:
            subjective.append({
                "skill": skill,
                "question": SUBJECTIVE_BANK[skill]
            })

    return {
        "mcqs": quiz[:8],
        "subjective": subjective[:2]
    }