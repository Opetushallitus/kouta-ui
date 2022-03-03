#!/bin/bash

set -e pipefail

CURRENT_PATH=$(pwd)

cd src/main/app

echo "Building Storybook"
npm ci --no-audit --prefer-offline
npm run build-storybook

echo "Copying Storybook files to AWS S3 buildnumber (ga-$GITHUB_RUN_NUMBER) directory"
aws s3 sync build/storybook s3://dev-files.ops.opintopolku.fi/storybooks/kouta-ui/builds/ga-$GITHUB_RUN_NUMBER --delete --cache-control max-age=600 --acl public-read
echo "Storybook link (temporary for build): https://dev-files.ops.opintopolku.fi/storybooks/kouta-ui/builds/ci-$GITHUB_RUN_NUMBER/index.html"

echo "Copying Storybook files to AWS S3 branch ($GITHUB_REF_NAME) directory"
aws s3 sync build/storybook s3://dev-files.ops.opintopolku.fi/storybooks/kouta-ui/$GITHUB_REF_NAME --delete --cache-control max-age=600 --acl public-read
echo "Storybook link (pernament for branch): https://dev-files.ops.opintopolku.fi/storybooks/kouta-ui/$GITHUB_REF_NAME/index.html"

cd $CURRENT_PATH
