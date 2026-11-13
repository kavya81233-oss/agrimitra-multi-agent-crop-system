from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from database import get_db
from models.models import FarmAction, Farmer
from models.schemas import FarmActionCreate, FarmActionUpdate, FarmActionResponse

router = APIRouter(prefix="/api/actions", tags=["Farm Action Planner"])

@router.get("", response_model=List[FarmActionResponse])
def get_actions(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(FarmAction)
    if status:
        query = query.filter(FarmAction.status == status)
    if category:
        query = query.filter(FarmAction.category == category)
    if priority:
        query = query.filter(FarmAction.priority == priority)

    return query.order_by(FarmAction.created_at.desc()).all()

@router.post("", response_model=FarmActionResponse)
def create_action(action_in: FarmActionCreate, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).first()
    farmer_id = farmer.id if farmer else None

    action = FarmAction(
        analysis_id=action_in.analysis_id,
        farmer_id=action_in.farmer_id or farmer_id,
        title=action_in.title,
        description=action_in.description,
        reason=action_in.reason,
        priority=action_in.priority,
        category=action_in.category,
        suggested_date=action_in.suggested_date,
        status=action_in.status or "pending"
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return action

@router.put("/{id}", response_model=FarmActionResponse)
def update_action(id: int, action_in: FarmActionUpdate, db: Session = Depends(get_db)):
    action = db.query(FarmAction).filter(FarmAction.id == id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Farm action task not found")

    if action_in.title is not None:
        action.title = action_in.title
    if action_in.description is not None:
        action.description = action_in.description
    if action_in.reason is not None:
        action.reason = action_in.reason
    if action_in.priority is not None:
        action.priority = action_in.priority
    if action_in.category is not None:
        action.category = action_in.category
    if action_in.suggested_date is not None:
        action.suggested_date = action_in.suggested_date
    if action_in.status is not None:
        action.status = action_in.status

    db.commit()
    db.refresh(action)
    return action

@router.delete("/{id}")
def delete_action(id: int, db: Session = Depends(get_db)):
    action = db.query(FarmAction).filter(FarmAction.id == id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Farm action task not found")

    db.delete(action)
    db.commit()
    return {"success": True, "message": f"Action task #{id} deleted successfully."}
