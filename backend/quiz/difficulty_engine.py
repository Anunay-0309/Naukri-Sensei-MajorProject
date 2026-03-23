def build_difficulty_profile(skills, projects, experience):

    easy = 4
    medium = 4
    hard = 2

    if experience != "student":
        hard = 3
        easy = 3

    return {
        "easy": easy,
        "medium": medium,
        "hard": hard,
        "subjective": 2
    }