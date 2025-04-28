import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def post(s):
    url = os.getenv("API_BASE_URL")

    try : 
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
