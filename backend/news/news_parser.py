import requests
from bs4 import BeautifulSoup
from datetime import datetime


def fetch_external_news():
    return news_list


def parse_date(date_str):
    return datetime.strptime(date_str, "%d.%m.%Y").strftime("%Y-%m-%d")


url = "https://fbu.ua/topic/3x3"
response = requests.get(url)
html_doc = response.text

soup = BeautifulSoup(html_doc, "html.parser")

news_titles = []
news_links = []
news_dates = []
news_img = []
news_list = []


for div in soup.find_all("div", class_="short_text"):
    title_text = div.get_text(strip=True)
    news_titles.append(title_text)

for link in soup.find_all('a', class_="title"):
    current_link = link.get('href')
    news_links.append(f"https://fbu.ua{current_link}")

for date in soup.find_all('span', class_="date"):
    current_date = date.get_text(strip=True)
    news_dates.append(parse_date(current_date))

for img in soup.find_all('div', class_='img_block'):
    img_tag = img.find("img")
    if img_tag and img_tag.get("src"):
        current_img = img_tag["src"]
        news_img.append(f"https://fbu.ua{current_img}")


for i in range(len(news_titles)):
    news_item = {
        "title": news_titles[i],
        "url": news_links[i],
        "img_url": news_img[i],
        "published_date": news_dates[i],
    }
    news_list.append(news_item)

