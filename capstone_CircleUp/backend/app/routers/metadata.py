"""
Metadata Router FastAPI Module.
Handles static reference/lookup data used to populate frontend dropdowns (e.g. cities).
ROUTE: /metadata/
"""

from fastapi import APIRouter

router = APIRouter(prefix="/metadata", tags=["metadata"])

CITIES = [
    "Bilaspur",
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune"
]

@router.get("/cities")
def get_cities():
    """
    GET: /metadata/cities
    Get the list of supported cities for the location/city dropdown.
    """
    return {"cities": CITIES}
