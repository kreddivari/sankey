from django import template

from django.utils.safestring import mark_safe

import bleach

register = template.Library()


def use_bleach(value):
    return mark_safe(bleach.clean(value))


register.filter('use_bleach', use_bleach)
