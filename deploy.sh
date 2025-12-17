#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# <USERNAME>為git帳號(若有大寫字母全改為小寫)，<REPO>為儲存庫名稱
# 還不熟悉請使用下方部署至gh-pages

# if you are deploying to https://HughesTT.github.io
# git push -f git@github.com:HughesTT/HughesTT.github.io.git main

# if you are deploying to https://HughesTT.github.io/<REPO>
git push -f git@github.com:HughesTT/ViteProject.git main:gh-pages

cd -
