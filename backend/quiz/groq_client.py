import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def groq_chat(messages, temperature=0.3, max_tokens=4096):

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        top_p=0.9,
        stream=False
    )

    return completion.choices[0].message.content