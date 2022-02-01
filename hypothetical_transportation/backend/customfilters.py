from rest_framework.filters import OrderingFilter
from django.db.models import Max, Count


class StudentCountShortCircuitFilter(OrderingFilter):

    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)
        ordering = ordering if ordering else list()
        if "students" in ordering:
            return queryset.annotate(count=Count('students')).order_by("count")
        elif "-students" in ordering:
            return queryset.annotate(count=Count('students')).order_by("-count")
        return super().filter_queryset(request, queryset, view)
