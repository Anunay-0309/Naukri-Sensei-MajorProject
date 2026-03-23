import re

SECTION_HEADERS = [
    "skills", "technical skills", "technologies",
    "tools", "projects", "academic projects", "personal projects"
]


def extract_section(text, section_keywords):
    pattern = rf"({'|'.join(section_keywords)}).*?\n(.*?)(\n[A-Z][A-Za-z ]+\n|\Z)"
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    return match.group(2) if match else ""


# ---------- SKILL CLEANER ----------

def clean_skill(skill):
    skill = skill.strip()

    skill = re.sub(r'[^a-zA-Z0-9+#. ]', '', skill)

    if len(skill) > 25:
        return None

    if skill.islower() and len(skill) > 12:
        return None

    if any(char.isdigit() for char in skill) and len(skill) < 3:
        return None

    return skill


def extract_skills(text):
    skill_section = extract_section(
        text,
        ["skills", "technical skills", "technologies", "tools"]
    )

    if not skill_section:
        return []

    raw_tokens = re.split(r"[,\n•\-]", skill_section)

    skills = set()

    for token in raw_tokens:
        token = token.strip()
        if len(token) < 2:
            continue

        cleaned = clean_skill(token)
        if cleaned:
            skills.add(cleaned)

    return list(skills)


# ---------- PROJECT EXTRACTION ----------

def extract_projects(text):
    project_section = extract_section(
        text,
        ["projects", "academic projects", "personal projects"]
    )

    if not project_section:
        return []

    blocks = re.split(r"\n(?=[A-Z])", project_section)

    projects = []

    for b in blocks:
        b = b.strip()

        if len(b) < 30:
            continue

        title = b.split("\n")[0][:120]
        desc = b[:400]

        projects.append({
            "title": title,
            "description": desc
        })

    return projects


def detect_experience(text):
    if re.search(r"intern", text, re.IGNORECASE):
        return "fresher"
    return "student"


def extract_claims(text):
    skills = extract_skills(text)
    projects = extract_projects(text)
    exp = detect_experience(text)

    return {
        "skills": skills,
        "projects": projects,
        "experience_level": exp
    }