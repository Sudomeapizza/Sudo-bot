#!/bin/bash

redirected_url=$(curl -s -I -L https://factorio.com/get-download/stable/headless/linux64 | grep -i "Location: " | sed 's/Location: //I' | tr -d '\r')

# Check if the URL was found
if [ -z "$redirected_url" ]; then
    echo "Failed to get redirected URL at: \"$redirected_url\""
    echo "$(echo;curl -IsSL https://factorio.com/get-download/stable/headless/linux64)"
    exit 1
# else
#     echo "Found \"Stable\" Game file"
fi

# Extract filename from URL if Content-Disposition header is not available
filename=$(basename "$redirected_url" | sed 's/?.*//')

# Extract version details from filename
dl_version=$(echo "$filename" | sed 's/factorio-headless_linux_//' | sed 's/.tar.xz//')



redirected_url2=$(curl -s -I -L https://factorio.com/get-download/experimental/headless/linux64 | grep -i "Location: " | sed 's/Location: //I' | tr -d '\r')

# Check if the URL was found
if [ -z "$redirected_url2" ]; then
    echo "Failed to get redirected URL at: \"$redirected_url2\""
    echo "$(echo;curl -IsSL https://factorio.com/get-download/experimental/headless/linux64)"
    exit 1
# else
#     echo "Found \"Experimental\" Game file"
fi

# Extract filename from URL if Content-Disposition header is not available
filename2=$(basename "$redirected_url2" | sed 's/?.*//')

# Extract version details from filename
dl_version2=$(echo "$filename2" | sed 's/factorio-headless_linux_//' | sed 's/.tar.xz//')


if [ "$dl_version" == "$dl_version2" ]; then
    echo "\"Stable\" is concurrent to \"Experimental\". Current Version is: $dl_version"
else
    echo "Current \"Stable\" Version is: $dl_version"
    echo "Current \"Experimental\" Version is: $dl_version2"
fi
