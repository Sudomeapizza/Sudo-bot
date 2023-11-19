#!/bin/bash

url="https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&rvprop=content&grnlimit=1"

# Use wget to retrieve data and capture the output
data=$(wget -q -O "$url")

# Display the retrieved data
echo "$data"
