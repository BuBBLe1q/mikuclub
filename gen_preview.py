import shutil
import requests
from requests.structures import CaseInsensitiveDict

url = "http://127.0.0.1:8000"

shutil.copytree("static", "docs/static",dirs_exist_ok=True)

req_dic = {
    "index.html": "/",
    "profile.html": "/profile",
    "login.html": "/accounts/login",
    "signup.html": "/accounts/signup"
}
headers = CaseInsensitiveDict()
# нужно поставить твой токен
headers["Cookie"] = "sessionid=0euy66p53hpyy8npajc2bb81t92reut6"

for file in req_dic:
    page = url + req_dic[file]
    resp = requests.get(page, headers=headers).content.decode("utf-8")
    resp = resp.replace("accounts/login", "login.html")
    resp = resp.replace("accounts/signup", "signup.html")
    resp = resp.replace("/profile\"", "profile.html\"")
    resp = resp.replace("\"/static", "\"static")
    resp = resp.replace("\"/\"", "\"index.html\"")
    with open("docs/" + file, "w") as f:
        f.write(resp)
    print(file + " dowlanded")
