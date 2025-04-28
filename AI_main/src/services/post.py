import json
import requests
import queue
import os
from dotenv import load_dotenv

def post(q):
    load_dotenv()
    url = os.getenv("API_BASE_URL")
    url_dir = "/api/movie/agegroup"
    url = url+url_dir
    try :
        while:
        if q.get()=="2-19":
            s="아이"
        elif q.get()=="20-60":
            s="성인"
        elif q.get()=="61+":
            s="노인"
            
        data = { "ageGroup": s }
        headers = { "Content-Type":"application/json" }
        json_data = json.dumps(data)
        response = requests.post(url, data=json_data, headers=headers)
    except Exception as e:
        print(e)
        pass
    else :
        print(response.text)
    finally :
        print("done")
        pass    # return to main module

if __name__ == "__main__" :
    s = "아이"
    post(s)
