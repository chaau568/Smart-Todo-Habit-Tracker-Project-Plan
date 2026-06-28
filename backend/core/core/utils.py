import math

VALID_PAGE_SIZES = (10, 25, 50)


def paginate(queryset, request, default_size=10):
    try:
        page = max(1, int(request.GET.get("page", 1)))
        page_size = int(request.GET.get("page_size", default_size))
    except (ValueError, TypeError):
        page, page_size = 1, default_size

    if page_size not in VALID_PAGE_SIZES:
        page_size = default_size

    total = queryset.count()
    total_pages = max(1, math.ceil(total / page_size))
    page = min(page, total_pages)
    offset = (page - 1) * page_size

    return queryset[offset : offset + page_size], {
        "count": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }
