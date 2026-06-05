from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import current_user
from app.db.session import get_db
from app.schemas.report import ReportSummaryResponse
from app.services.reporting import build_summary_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary", response_model=ReportSummaryResponse)
def summary(db: Session = Depends(get_db), user=Depends(current_user)):
    return build_summary_report(db)
