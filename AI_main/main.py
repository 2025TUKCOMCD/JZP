"""
*   This is MAIN Program Module.
*   
*
*
*
*
*
"""
__author__ = "Hyang-Do Choi"
__copyright__ = "Capstone Project Team [.JZP]. Tech University of Korea, TUK"
__version__ = "Demo 0.1"
__date__ = "2025-04-20"
__credits__ = ["2019152043 Hyang-Do Choi",
               "2022134009 Yoon-Seung Kim",
               "2022156039 Seung-Yeon Jo",
               "2022150020 Min-Jeong Seok"]

from datetime import datetime
import sys
import os
import time
import cv2
import threading
import queue

import src
from src.utils import HaarFilter as cam # usage : cam.HaarFilter()
from src.services import post as sender # usage : sender.post("something")
from tests import showqueue as showq
from src.utils import AgeFilter as Analyzer

def main():
    """
    This function run every Modules by thread. (main)
    """
    frame_data = queue.Queue(maxsize = 1) # Queue. contains camera captured data
    age_data = queue.Queue(maxsize = 1) # Queue. contains age analyzed data. one of ['2-19', '20-60', '61+']

    thread_camera_filter = threading.Thread(target=cam.HaarFilter, args=(frame_data,), daemon = True)
    thread_age_analyzer = threading.Thread(target=Analyzer.AgeAnalyze, args=(frame_data,age_data), daemon=True)
    thread_posting = threading.Thread(target=sender.post, args=(age_data,), daemon = True)

    # test_thread = threading.Thread(target = showq.showq, args=(frame_data,), daemon = True)

    thread_camera_filter.start()
    thread_age_analyzer.start()
    thread_posting.start()
    # test_thread.start()

    try :
        while True:
            time.sleep(0.1)
            # print(frame_data.get())
            # print("queue data ____")
            # print(age_data.get())
    except KeyboardInterrupt:
        print("... Exit main ...")
                
if __name__ == "__main__":
    print("Initiating main ... \n")
    main()
