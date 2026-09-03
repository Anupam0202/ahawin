#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATTERN='(AIza[0-9A-Za-z_-]{20,}|gh[pousr]_[0-9A-Za-z]{20,}|vercel_[0-9A-Za-z_-]{20,}|-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----)'
if grep -RInE --exclude-dir=.git --exclude-dir=node_modules --exclude='secret-scan.sh' "$PATTERN" "$ROOT"; then
  echo 'SECRET-SCAN-FAIL' >&2
  exit 1
fi
echo 'SECRET-SCAN-PASS'
