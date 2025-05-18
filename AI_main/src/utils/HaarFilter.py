#
#  Haar Cascade processing (for camera)
#  2025-01-07, chlgideh
#

import cv2
import queue
from datetime import datetime
import time

def HaarFilter(frame_data):
    haar_classifier = cv2.CascadeClassifier("src/model/haarcascade_frontalface_default.xml")

    capture = cv2.VideoCapture(0)
    capture.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    count = 0           # detected frame counter
    frame_counter = 0   # counter for camera (30 frames per second)

    try:
        while True:
            frame_counter += 1

            ret, frame = capture.read()
            if not ret:		# program kill when failed to capture frame
                print("Failed to capture frame.")
                break
            
            frame_origin = frame.copy()  # make copy frame for saving.
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            faces = haar_classifier.detectMultiScale(
                gray,
                scaleFactor=1.3,
                minNeighbors=6,
                minSize=(320, 180)
            )
            
            if len(faces) > 0:
                for (x, y, w, h) in faces:
                    now = datetime.now()
                    current_time_str = now.strftime("%Y-%m-%d_(%H-%M-%S)")
                    save_path = f"src/utils/{current_time_str}_frame_{count + 1}.jpg"
                    # cv2.imwrite(save_path, frame_origin[y-50:y+h+50, x-25:x+w+25])
                    try :
                        # print(frame_origin)
                        frame_data.put(frame_origin, block = False)
                        # print(frame_data.get())
                    except queue.Full:
                        frame_data.get()
                        frame_data.put(frame_origin)
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)  # capture faces
                    count += 1
                    
            # get frames
            cv2.imshow('image', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):  # exit by 'q'
                break

    except KeyboardInterrupt:
        print("\nInterrupted by user. Exiting program safely...")
        
    finally:
        print("\nExiting program and cleanup...")
        capture.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    HaarFilter()
