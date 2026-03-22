import os
import requests
from dotenv import load_dotenv
from backend.jobs.jd_matcher import compute_match_score

# ---------------- ENV LOADING ----------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "../../"))

env_path = os.path.join(PROJECT_ROOT, ".env")
load_dotenv(env_path)

RAPID_API_KEY = os.getenv("RAPID_API_KEY")
RAPID_API_HOST = "jsearch.p.rapidapi.com"

print("ENV PATH:", env_path)
print("API KEY LOADED:", bool(RAPID_API_KEY))

# ---------------- MAIN FUNCTION ----------------

def fetch_jobs_for_domain(domain, resume_skills):

    if not RAPID_API_KEY:
        print("ERROR: RapidAPI key not loaded")
        return []

    query_map = {
        "Software Developer": "software developer",
        "Data Scientist": "data scientist",
        "Data Analyst": "data analyst",
        "Business Analyst": "business analyst",
        "DevOps / SRE": "devops engineer",
        "QA / Test Engineer": "qa engineer"
    }

    query = query_map.get(domain, domain)

    url = "https://jsearch.p.rapidapi.com/search"

    # IMPORTANT: use query text instead of strict location filter
    querystring = {
        "query": f"{query} jobs in India",
        "page": "1",
        "num_pages": "1"
    }

    headers = {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST
    }

    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=15)

        print("STATUS CODE:", response.status_code)
        print("RAW RESPONSE SAMPLE:", response.text[:500])

        if response.status_code != 200:
            print("ERROR: API request failed")
            return []

        data = response.json()

    except Exception as e:
        print("API EXCEPTION:", str(e))
        return []

    jobs = []

    if "data" not in data:
        print("ERROR: 'data' key not in API response")
        return []

    print("JOBS FOUND:", len(data["data"]))

    for item in data["data"][:15]:

        jd_text = item.get("job_description") or ""

        try:
            match_score = compute_match_score(resume_skills, jd_text)
        except:
            match_score = 0

        location = (
            item.get("job_location") or
            item.get("job_city") or
            item.get("job_state") or
            item.get("job_country") or
            "Unknown"
        )

        jobs.append({
            "title": item.get("job_title"),
            "company": item.get("employer_name"),
            "location": location,
            "match_score": match_score,
            "apply_link": item.get("job_apply_link")
        })

    jobs = sorted(jobs, key=lambda x: x["match_score"], reverse=True)

    return jobs