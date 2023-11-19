#!/bin/bash

url="$1"

# Use wget to retrieve data and capture the output
data=$(wget -q -O $url)

# Display the retrieved data
echo "$data"
