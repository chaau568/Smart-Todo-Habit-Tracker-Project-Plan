from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from tasks.models import Task
from tasks.serializers.task_serializers import (
    TaskCreateSerializer,
    TaskReadSerializer,
    TaskUpdateSerializer,
)
from tasks.services import TaskService


class TaskViewSet(ModelViewSet):
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return TaskCreateSerializer
        if self.action in ('update', 'partial_update'):
            return TaskUpdateSerializer
        return TaskReadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = TaskService.create_task(request.user, serializer.validated_data)
        return Response(
            {
                'success': True,
                'data': TaskReadSerializer(task, context={'request': request}).data,
                'message': 'Task created.',
            },
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        serializer = TaskReadSerializer(self.get_queryset(), many=True, context={'request': request})
        return Response({'success': True, 'data': serializer.data})

    def retrieve(self, request, *args, **kwargs):
        serializer = TaskReadSerializer(self.get_object(), context={'request': request})
        return Response({'success': True, 'data': serializer.data})

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        task = self.get_object()
        serializer = self.get_serializer(task, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True, 'data': TaskReadSerializer(task, context={'request': request}).data})

    def destroy(self, request, *args, **kwargs):
        TaskService.soft_delete_task(self.get_object())
        return Response({'success': True, 'message': 'Task deleted.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        if task.status == Task.Status.COMPLETED:
            return Response(
                {'success': False, 'error': {'code': 'ALREADY_COMPLETED', 'message': 'Task is already completed.'}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        task = TaskService.complete_task(task)
        return Response({'success': True, 'data': TaskReadSerializer(task, context={'request': request}).data})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        task = self.get_object()
        if task.status in (Task.Status.COMPLETED, Task.Status.CANCELLED):
            return Response(
                {'success': False, 'error': {'code': 'INVALID_STATUS', 'message': f'Cannot cancel a {task.status} task.'}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        task = TaskService.cancel_task(task)
        return Response({'success': True, 'data': TaskReadSerializer(task, context={'request': request}).data})
