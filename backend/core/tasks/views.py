from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tasks.models import Task
from tasks.serializers import TaskCreateSerializer, TaskReadSerializer, TaskUpdateSerializer
from tasks.services import TaskService


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def task_list(request):
    if request.method == "GET":
        tasks = Task.objects.filter(user=request.user).exclude(status=Task.Status.DELETED).order_by("-created_at")
        serializer = TaskReadSerializer(tasks, many=True)
        return Response({"success": True, "data": {"results": serializer.data, "count": tasks.count()}})

    serializer = TaskCreateSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    task = TaskService.create_task(request.user, serializer.validated_data)
    return Response(
        {"success": True, "data": TaskReadSerializer(task).data, "message": "Task created."},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def task_detail(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)

    if task.status == Task.Status.DELETED:
        return Response(
            {"success": False, "error": {"code": "NOT_FOUND", "message": "Task not found."}},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        return Response({"success": True, "data": TaskReadSerializer(task).data})

    if request.method == "DELETE":
        TaskService.soft_delete_task(task)
        return Response({"success": True, "data": None, "message": "Task deleted."})

    serializer = TaskUpdateSerializer(task, data=request.data, partial=True, context={"request": request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"success": True, "data": TaskReadSerializer(task).data, "message": "Task updated."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def task_complete(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)

    if task.status == Task.Status.SUCCEEDED:
        return Response(
            {"success": False, "error": {"code": "ALREADY_COMPLETED", "message": "Task is already completed."}},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if task.status in (Task.Status.CANCELED, Task.Status.DELETED):
        return Response(
            {"success": False, "error": {"code": "INVALID_STATUS", "message": f"Cannot complete a {task.status} task."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    task = TaskService.complete_task(task)
    return Response({"success": True, "data": TaskReadSerializer(task).data, "message": "Task completed."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def task_cancel(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)

    if task.status in (Task.Status.SUCCEEDED, Task.Status.CANCELED, Task.Status.DELETED):
        return Response(
            {"success": False, "error": {"code": "INVALID_STATUS", "message": f"Cannot cancel a {task.status} task."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    task = TaskService.cancel_task(task)
    return Response({"success": True, "data": TaskReadSerializer(task).data, "message": "Task cancelled."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def task_in_progress(request, task_id):
    task = get_object_or_404(Task, id=task_id, user=request.user)

    if task.status != Task.Status.PENDING:
        return Response(
            {"success": False, "error": {"code": "INVALID_STATUS", "message": "Only PENDING tasks can be moved to IN_PROGRESS."}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    task.mark_in_progress()
    return Response({"success": True, "data": TaskReadSerializer(task).data, "message": "Task is now in progress."})
