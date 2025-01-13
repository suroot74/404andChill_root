import openai
from datetime import datetime

# Set your OpenAI API key
openai.api_key = "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"  # Replace with your actual API key

def generate_article(prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant who writes blog posts for a Jekyll site."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7  # Adjust for creativity
        )
        return response['choices'][0]['message']['content']
    except openai.OpenAIError as e:
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
        title = "benefits-of-automation"  # Replace spaces with hyphens for the file name
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

