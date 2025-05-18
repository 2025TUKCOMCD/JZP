import json
import requests
import queue
import os
import time

from dotenv import load_dotenv

def Switch_by_character(token):
    """
    This function switch & return by input(token) parameter.
    Post module designed to sending '노인' for default.

    Parameter
    ---------
    token : Character array.

    Returns
    -------
    	    data for sending server.
    	    will be formatting to JSON format.
    """
    if token == "2-19":
        return "아이"
    elif token == "20-60":
        return "성인"
    else:
        return "노인"

def Checksum(last_status, cur_status):
    """
    This function compare with last data, current data.
    When datas same, return False. For reducing post requests.

    Parameter
    ---------
    last_status : Character array.
    		last posting requested data.
    cur_status : Character array.
    		current processed data for post request.

    Returns
    -------
    Bool data. if Parameters same, return False.
    """
    if last_status == cur_status :
        return False
    else :
        return True
    
def post(q):
<<<<<<< ours
    """
    This function is module that send JSON data to the server.
    
    Parameter
    ---------
    q : queue.
    	Defined in Main (age_data).
    	age data contains one of ['2-19','20-60','61+']

    Returns
    -------
    None.
    This function working by thread.
    """
    headers = { "Content-Type":"application/json" }
    response = None # reset response object. without this line, could be occur runtime error.
    load_dotenv() # .env file load. file contains url of server.
=======
    headers = { "Content-Type":"application/json" }
    load_dotenv()
>>>>>>> theirs
    url = os.getenv("API_BASE_URL")
    url_Sendpoint = "/api/movie/agegroup"
    url_Getpoint = "/api/movie/user"
    url = url+url_Sendpoint
    workcounter = 0 # just counter for prompt.
    last_status = "" # reset last_status.
    try :
        while True:
<<<<<<< ours
             start = time.time() # processing time check
             
             try:
                 s = q.get_nowait() # without waiting. if q is empty, except occur
             except queue.Empty:
                 s = "노인" # default setting.

             if Checksum(last_status, Switch_by_character(s)):
                 # check data redundancy
                 if s == "노인":
                     # in this situation, when s is '노인', it means q is empty.
                     print(f"Status {workcounter} : Waiting")
                 else:
                     print(f"Status {workcounter} : Sending Requests {s}")
                     s = Switch_by_character(s)
                     
                 data = { "ageGroup": s }
                 json_data = json.dumps(data)
                 last_status = s
                 try:
                     response = requests.post(url, data=json_data, headers=headers)
                 except Exception as request_e:
                     print(request_e)
             else :
                 # if data is duplicated, just restart loop. nothing do (wait).
                 continue

             end = time.time()
             if response :
                 print(f"| Request ... {workcounter} : ( DONE {end-start:.3f}s ) {response.text}")
             else :
                 print(f"| Request ... {workcounter} : ( Response Error {end-start:.3f}s )")
             workcounter += 1
            
=======
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
>>>>>>> theirs
    except Exception as e:
        print(e)
        pass
    except KeyboardInterrupt :
        print("KEYBOARD INTERRUPT")
    finally :
        print("EXIT Post Module...")
        
if __name__ == "__main__" :
<<<<<<< ours
    # s = "20-60"
    s = queue.Queue(maxsize = 1)
=======
    s = "20-60"
>>>>>>> theirs
    post(s)
