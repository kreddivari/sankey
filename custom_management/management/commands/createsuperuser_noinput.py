from django.contrib.auth.models import User

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('username')
        parser.add_argument('password')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        if User.objects.filter(username=username).count():#User already exists - so just set the password and give superuser/staff privileges
            user = User.objects.get(username=username)
            user.set_password(password)
            user.is_staff = user.is_superuser = True
            user.save()
            return "Updated superuser %s" % username
        else:
            User.objects.create_superuser(username=username, email=None, password=password)
            return "Created superuser %s" % username
