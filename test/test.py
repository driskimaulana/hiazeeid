import requests

resp = requests.post("https://ml-bibitunggulid-zldx7crkfq-et.a.run.app", files={'file': open('bunga2.jpg', 'rb')})

print(resp.json())