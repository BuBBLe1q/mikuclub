# import shutil
# import os
# from multiprocessing import Process
# from subprocess import Popen
# import time
# import urllib.request, urllib.error, urllib.parse
import shutil

url = "http://127.0.0.1:8000"

# os.system("source ./venv/bin/activate")
# p = Popen(["./active_unix.sh"], shell=True)
# processes = [Process(target=, args=('abc',level+1,id,lock)) for i in range(5)]

# time.sleep(10)


# response = urllib.request.urlopen(url)
# webContent = response.read().decode('UTF-8')

# print(webContent[0:300])
# webpage = requests.get('https://www.thewebsite.com/', cookies={'required_cookie': required_value}).text
# p.terminate()
# print(p.pid)
# os.kill(p.pid, 2)

# from urllib.request import Request
# req = Request(url, headers={'Cookie':'myCookie=lovely'})
#
# print(req.data)

# a_request = urllib.request.Request(url)
# a_request.add_header("Cookie", "cookiename=cookievalue")
# webContent = response.read().decode('UTF-8')
# url = 'http://httpbin.org/cookies'
# cookies = {'cookies_are': 'working'}
# r = requests.get(url, cookies=cookies)`

shutil.copytree("static", "preview/static",dirs_exist_ok=True)

import requests
from requests.structures import CaseInsensitiveDict

req_dic = {
    "index.html": "/",
    "profile.html": "/profile",
    "login.html": "/accounts/login",
    "signup.html": "/accounts/signup"
}
headers = CaseInsensitiveDict()
headers["Cookie"] = "sessionid=0q9prnctfqi7gn9c8u8l8pwr67sa6hma"

for file in req_dic:
    page = url + req_dic[file]
    resp = requests.get(page, headers=headers).content.decode("utf-8")
    resp = resp.replace("accounts/login", "login.html")
    resp = resp.replace("accounts/signup", "signup.html")
    resp = resp.replace("/profile\"", "profile.html\"")
    resp = resp.replace("\"/static", "\"static")
    resp = resp.replace("\"/\"", "\"index.html\"")
    with open("preview/" + file, "w") as f:
        f.write(resp)
    print(file + " dowlanded")

# headers = CaseInsensitiveDict()
# # нужно поставить твой токен
# headers["Cookie"] = "sessionid=0q9prnctfqi7gn9c8u8l8pwr67sa6hma"
#
# resp = requests.get(url, headers=headers).content.decode("utf-8")
#
# print(resp)
