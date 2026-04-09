# Validates: REQ-F-ODDSVC-001
# Validates: REQ-F-ODDSVC-002
from __future__ import annotations

import sys
from pathlib import Path


TESTS_DIR = Path(__file__).resolve().parent
ODD_ROOT = TESTS_DIR.parents[4]
GENESIS_PATH = ODD_ROOT / ".genesis"
ODD_SERVICE_CODE = ODD_ROOT / "build_tenants" / "odd_service" / "python" / "code"
ODD_SDLC_CODE = ODD_ROOT / "build_tenants" / "odd_sdlc" / "python" / "code"

for path in (GENESIS_PATH, ODD_SERVICE_CODE, ODD_SDLC_CODE):
    path_str = str(path)
    if path_str not in sys.path:
        sys.path.insert(0, path_str)
