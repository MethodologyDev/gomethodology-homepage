# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "main" ]; then
  JEKYLL_ENV=production jekyll build
else
  JEKYLL_ENV=staging jekyll build
fi
