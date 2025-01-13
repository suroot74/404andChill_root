import os
from openai import OpenAI

client = OpenAI(
  api_key=os.getenv('OPENAI_API_KEY')
)

completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system",
            "content": "Tell me something interesting!",
        }
    ]
)

print(completion.model_dump()['choices'][0]['message']['content'])
