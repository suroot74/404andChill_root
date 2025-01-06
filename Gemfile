# frozen_string_literal: true

source "https://rubygems.org"

# Chirpy Theme
gem "jekyll", "~> 4.3"           # Required Jekyll version for Chirpy
gem "jekyll-theme-chirpy"        # The Chirpy theme gem
gem "webrick", "~> 1.7"          # Needed for local development with Ruby 3.x
gem "html-proofer", "~> 5.0", group: :test  # HTML validation for testing

# Optional plugins for Jekyll
group :jekyll_plugins do
  gem "jekyll-paginate"          # Adds pagination support
  gem "jekyll-sitemap"           # Generates a sitemap for SEO
  gem "jekyll-feed"              # Generates RSS feeds
  gem "jekyll-seo-tag"           # Adds SEO-related meta tags
end

# Platform-specific gems
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# File watching for Windows
gem "wdm", "~> 0.2.0", platforms: [:mingw, :x64_mingw, :mswin]
