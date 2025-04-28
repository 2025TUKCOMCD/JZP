import json
import requests

def post(s):
    url = "" # need url token
    
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
