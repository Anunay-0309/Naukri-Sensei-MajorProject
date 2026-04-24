import time


def initialize_interview_session(resume_store, interview_data):
    resume_store["interview"] = {
        "questions": interview_data["questions"],
        "backup_questions": interview_data["backup_questions"],
        "current_index": 0,
        "answers": [],
        "skipped_count": 0,
        "start_time": time.time(),
        "completed": False
    }

    return get_current_question(resume_store)


def get_current_question(resume_store):
    interview = resume_store.get("interview", {})

    if interview.get("current_index") >= len(interview.get("questions", [])):
        interview["completed"] = True
        return None

    return interview["questions"][interview["current_index"]]


def submit_answer(resume_store, question_id, answer_text):
    interview = resume_store.get("interview", {})

    current_question = get_current_question(resume_store)

    if not current_question:
        return {
            "error": "Interview already completed"
        }

    # store answer
    interview["answers"].append({
        "question": current_question["question"],
        "type": current_question["type"],
        "ideal_answer": current_question.get("ideal_answer", ""),
        "answer": answer_text
    })

    # move to next
    interview["current_index"] += 1

    next_q = get_current_question(resume_store)

    return {
        "next_question": next_q,
        "interview_complete": next_q is None
    }


def skip_question(resume_store):
    interview = resume_store.get("interview", {})

    if interview["skipped_count"] >= 3:
        return {
            "error": "Skip limit reached"
        }

    if not interview["backup_questions"]:
        return {
            "error": "No backup questions available"
        }

    # replace current question with backup
    backup_q = interview["backup_questions"].pop(0)

    interview["questions"][interview["current_index"]] = backup_q
    interview["skipped_count"] += 1

    return {
        "next_question": backup_q,
        "skipped": True
    }


def is_interview_complete(resume_store):
    interview = resume_store.get("interview", {})
    return interview.get("completed", False)


def get_all_answers(resume_store):
    interview = resume_store.get("interview", {})
    return interview.get("answers", [])


def get_interview_duration(resume_store):
    interview = resume_store.get("interview", {})

    start = interview.get("start_time")
    if not start:
        return 0

    return time.time() - start