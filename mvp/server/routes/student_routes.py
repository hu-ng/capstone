from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

from mvp.server.actions.student_actions import (
    add_student,
    delete_student,
    retrieve_student,
    retrieve_students,
    update_student,
)
from mvp.server.models.student_models import (
    ErrorResponseModel,
    ResponseModel,
    Student,
    StudentUpdate,
)

router = APIRouter()


@router.post("/", response_description="Student data added into the database")
async def add_student_data(student: Student = Body(...)):
    student = jsonable_encoder(student)
    new_student = await add_student(student)
    return ResponseModel(new_student, "Student added successfully.")


@router.get("/", response_description="Students retrieved")
async def get_students():
    students = await retrieve_students()
    if students:
        return ResponseModel(students, "Students data retrieved successfully")
    return ResponseModel(students, "Empty list returned")


@router.get("/{id}", response_description="Student data retrieved")
async def get_student_data(id):
    student = await retrieve_student(id)
    if student:
        return ResponseModel(student, "Student data retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "Student doesn't exist.")

    
@router.delete("/{id}", response_description="Student data deleted from the database")
async def delete_student_data(id: str):
    deleted_student = await delete_student(id)
    if deleted_student:
        return ResponseModel(
            "Student with ID: {} removed".format(id), "Student deleted successfully"
        )
    return ErrorResponseModel(
        "An error occurred", 404, "Student with id {0} doesn't exist".format(id)
    )