#! /bin/bash
JSFILE=$1

if [ -z "$JSFILE" ]; then
  echo "❌ Usage: $0 <JavaScript File>"
  exit 1
fi

if [ ! -f "$JSFILE" ]; then
  echo "❌ Error: File '$JSFILE' does not exist."
  exit 1
fi

node babel.js ${JSFILE}