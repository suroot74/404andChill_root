import openai
import os
from datetime import datetime

# Retrieve the API key from the environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_article(prompt):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # Use the older model
            prompt=prompt,
            max_tokens=500,  # Adjust as needed
            temperature=0.7  # Adjust creativity level
        )
        return response['choices'][0]['text'].strip()
    except Exception as e:
        print(f"OpenAI error: {e}")
        return None

if __name__ == "__main__":
    # Define the article prompt
    prompt = "Write a 500-word blog post about the benefits of automation for small businesses."

    # Generate the article
    article = generate_article(prompt)

    if article:
        # Define the file name and save path
        today = datetime.now().strftime('%Y-%m-%d')
        title = "benefits-of-automation"
        filename = f"_posts/{today}-{title}.md"

        # Write the article to the file with Jekyll front matter
        with open(filename, "w", encoding="utf-8") as file:
            file.write(f"---\n")
            file.write(f"title: \"Benefits of Automation\"\n")
            file.write(f"date: {today}\n")
            file.write(f"categories: business automation\n")
            file.write(f"tags: [automation, small business, technology]\n")
            file.write(f"---\n\n")
            file.write(article)

        print(f"Article saved as {filename}")
    else:
        print("Failed to generate the article.")
