from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from api.models import Tournament
from django.core.cache import cache

@receiver([post_save, post_delete], sender=Tournament)
def invalid_tournaments_cache(sender, instance, **kwsrgs):
    print("Clearing tournament cache")

    cache.delete_pattern('*tournament_list*')