from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import date
import firebase_admin
from firebase_admin import credentials, firestore, storage
import os

# --- Firebase Init ---
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred, {
    "storageBucket": "<your-firebase-storage-bucket>.appspot.com"
})
db = firestore.client()
bucket = storage.bucket()

app = FastAPI()

# --- Models ---
class Pet(BaseModel):
    id: str
    name: str
    species: str
    breed: str
    age: str
    avatar: Optional[str] = None
    notes: Optional[str] = None

# --- Pets Endpoints ---

@app.post("/pets", response_model=Pet)
async def add_pet(
    name: str = Form(...),
    species: str = Form(...),
    breed: str = Form(...),
    age: str = Form(...),
    notes: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    pet_id = str(uuid4())
    avatar_url = None

    # Upload image to Firebase Storage if provided
    if image:
        blob = bucket.blob(f"pets/{pet_id}/{image.filename}")
        blob.upload_from_file(image.file, content_type=image.content_type)
        blob.make_public()
        avatar_url = blob.public_url

    pet_data = {
        "id": pet_id,
        "name": name,
        "species": species,
        "breed": breed,
        "age": age,
        "avatar": avatar_url,
        "notes": notes
    }
    db.collection("pets").document(pet_id).set(pet_data)
    return pet_data

@app.get("/pets", response_model=List[Pet])
def get_pets():
    pets_ref = db.collection("pets").stream()
    pets = [doc.to_dict() for doc in pets_ref]
    return pets

@app.get("/pets/{pet_id}", response_model=Pet)
def get_pet(pet_id: str):
    doc = db.collection("pets").document(pet_id).get()
    if doc.exists:
        return doc.to_dict()
    raise HTTPException(status_code=404, detail="Pet not found")

@app.delete("/pets/{pet_id}")
def delete_pet(pet_id: str):
    db.collection("pets").document(pet_id).delete()
    # Optionally, delete images from storage as well
    return {"ok": True}

# --- Tasks Model ---
class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    time: str
    type: str
    petName: str
    completed: bool = False
    priority: str
    date: str

# --- Tasks Endpoints ---

@app.post("/tasks", response_model=Task)
async def add_task(task: Task):
    db.collection("tasks").document(task.id).set(task.dict())
    return task

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    tasks_ref = db.collection("tasks").stream()
    return [doc.to_dict() for doc in tasks_ref]

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    doc = db.collection("tasks").document(task_id).get()
    if doc.exists:
        return doc.to_dict()
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    db.collection("tasks").document(task_id).delete()
    return {"ok": True}

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task: Task):
    db.collection("tasks").document(task_id).set(task.dict())
    return task

# --- Health Metric Model ---
class HealthMetric(BaseModel):
    id: str
    pet_id: str
    metric: str
    value: float
    date: str

# --- Health Endpoints ---

@app.post("/health", response_model=HealthMetric)
async def add_health_metric(metric: HealthMetric):
    db.collection("health").document(metric.id).set(metric.dict())
    return metric

@app.get("/health", response_model=List[HealthMetric])
def get_health_metrics():
    metrics_ref = db.collection("health").stream()
    return [doc.to_dict() for doc in metrics_ref]

@app.get("/health/{metric_id}", response_model=HealthMetric)
def get_health_metric(metric_id: str):
    doc = db.collection("health").document(metric_id).get()
    if doc.exists:
        return doc.to_dict()
    raise HTTPException(status_code=404, detail="Health metric not found")

@app.delete("/health/{metric_id}")
def delete_health_metric(metric_id: str):
    db.collection("health").document(metric_id).delete()
    return {"ok": True}

# --- User Model ---
class User(BaseModel):
    id: str
    username: str
    email: str
    plan: Optional[str] = None

# --- Users Endpoints ---

@app.post("/users", response_model=User)
async def add_user(user: User):
    db.collection("users").document(user.id).set(user.dict())
    return user

@app.get("/users", response_model=List[User])
def get_users():
    users_ref = db.collection("users").stream()
    return [doc.to_dict() for doc in users_ref]

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: str):
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        return doc.to_dict()
    raise HTTPException(status_code=404, detail="User not found")

@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    db.collection("users").document(user_id).delete()
    return {"ok": True}
