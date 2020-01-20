#!/bin/bash -e

git clone --single-branch --branch dynamo-switch https://github.com/Opetushallitus/ci-tools.git
source ci-tools/common/setup-tools.sh
export ARTIFACT_NAME="kouta-ui"
export BASE_IMAGE="baseimage-fatjar:master"

./ci-tools/build/upload-image.sh $ARTIFACT_NAME --dynamo-write
