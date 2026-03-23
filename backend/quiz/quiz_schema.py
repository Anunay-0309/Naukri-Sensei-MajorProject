from pydantic import BaseModel
from typing import List

class MCQ(BaseModel):
    question: str
    options: List[str]
    correct: str
    difficulty: str
    skill: str

class Subjective(BaseModel):
    question: str
    skill: str
    difficulty: str
    ideal_answer: str

class Quiz(BaseModel):
    mcq: List[MCQ]
    subjective: List[Subjective]

class QuizSubmission(BaseModel):
    mcq_answers: List[str]
    subjective_answers: List[str]