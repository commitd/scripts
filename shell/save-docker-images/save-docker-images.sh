#!/bin/bash
IMAGES=( "mc-web" "mc-api" )

TAG="${1:-latest}"

echo "Exporting tag=${TAG}"
echo "Override with $0 <tag>"

for IMAGE in "${IMAGES[@]}" 
do 
    docker save $IMAGE:$TAG | gzip > ${IMAGE}_${TAG}.tar.gz
done