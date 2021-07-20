#!/bin/bash
TAG="${1:-latest}"
# Read the remaining arguments from a string (separated by , or space) to an array  
IFS=', ' read -r -a IMAGES <<< "${@:2}"

echo "Exporting tag=${TAG} for images ${IMAGES}"
echo "Override with $0 <tag> <images.....>"

for IMAGE in "${IMAGES[@]}" 
do
    docker save $IMAGE:$TAG | gzip > ${IMAGE}_${TAG}.tar.gz
done