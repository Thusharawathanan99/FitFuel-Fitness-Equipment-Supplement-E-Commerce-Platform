#!/bin/bash
out=$1; w=$2; h=$3; body=$4
{
  printf '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n'
  cat _helmet.html
  printf '\n<div style="width: %spx; background: #FFFFFF; overflow: hidden;">\n' "$w"
  cat "$body"
  printf '\n</div>\n</x-dc>\n<script data-dc-script data-props='"'"'{"$preview":{"width":%s,"height":%s}}'"'"'>\nclass Component extends DCLogic {}\n</script>\n</body>\n</html>\n' "$w" "$h"
} > "$out"
o=$(grep -o '<div' "$out" | wc -l); c=$(grep -o '</div>' "$out" | wc -l)
echo "$out  ${w}x${h}  divs open=$o close=$c  bytes=$(wc -c < "$out")"
