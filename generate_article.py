name: Generate Article and Commit

on:
  schedule:
    - cron: '0 8 * * *'  # Runs daily at 8:00 AM UTC
  workflow_dispatch:  # Allows manual triggering

jobs:
  generate_article:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'  # GitHub Actions has pre-installed versions

      - name: Install dependencies
        run: pip install openai

      - name: Run the script
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: python generate_article.py

      - name: Commit and Push Article
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add article.md
          git commit -m "Generated article"
          git push
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
