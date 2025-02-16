from django.core.management.base import BaseCommand
from news.news_parser import fetch_external_news 
from news.models import News

class Command(BaseCommand):
    help = "Fetches news from external sources and saves them to the database."

    def handle(self, *args, **options):
        news_list = fetch_external_news()  
        for item in news_list:
            News.objects.update_or_create(
                title=item["title"],
                defaults={
                    "url": item["url"],
                    "img_url": item["img_url"],
                    "published_date": item["published_date"],
                },
            )
        self.stdout.write(self.style.SUCCESS("News updated successfully."))
