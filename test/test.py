import requests

resp = requests.post("http://127.0.0.1:5000/android", files={'file': open('bunga5.jpg', 'rb')})

print(resp.json())