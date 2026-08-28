#!/bin/bash
# compose.sh <out.dc.html> <width> <previewHeight> <body-fragment> [--no-header] [--no-footer]
out=$1; w=$2; h=$3; body=$4; shift 4
inc_header=1; inc_footer=1
for a in "$@"; do [ "$a" = "--no-header" ] && inc_header=0; [ "$a" = "--no-footer" ] && inc_footer=0; done
{
  printf '<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n'
  cat _helmet.html
  printf '\n<div style="width: %spx; background: #F7F4ED;">\n' "$w"
  [ $inc_header = 1 ] && cat _header.html
  cat "$body"
  [ $inc_footer = 1 ] && cat _footer.html
  printf '\n</div>\n</x-dc>\n<script data-dc-script data-props='"'"'{"$preview":{"width":%s,"height":%s}}'"'"'>\nclass Component extends DCLogic {}\n</script>\n</body>\n</html>\n' "$w" "$h"
} > "$out"
o=$(grep -o '<div' "$out" | wc -l); c=$(grep -o '</div>' "$out" | wc -l)
echo "$out  ${w}x${h}  divs open=$o close=$c  bytes=$(wc -c < "$out")"
