import json
import requests
import queue
import os
import time

from dotenv import load_dotenv

def post(q):
    headers = { "Content-Type":"application/json" }
    load_dotenv()
    url = os.getenv("API_BASE_URL")
    url_dir = "/api/movie/agegroup"
    url = url+url_dir
    try :
        while True:
             start = time.time()
             print(f"Sending Requests {q.get()}")
             if q.get()=="2-19":
                 s="아이"
             elif q.get()=="20-60":
                 s="성인"
             elif q.get()=="61+":
                 s="노인"
             else :
                 s="노인"
             data = { "ageGroup": s }
             json_data = json.dumps(data)
             try:
                 response = requests.post(url, data=json_data, headers=headers)
             except Exception as request_e:
                 print(request_e)
             end = time.time()
             print(f"| ( DONE {end-start:.3f}s ) {response.text}")
             # print(response.text)
    except Exception as e:
        print(e)
        pass
    except KeyboardInterrupt :
        print("KEYBOARD INTERRUPT")
    finally :
        print("EXIT Post Module...")
        
if __name__ == "__main__" :
    s = "20-60"
    post(s)
