#
#   Haar Cascade test, camera
#   2025-01-07, chlgideh
#
#

import cv2
from datetime import datetime
def Haar_cam():
    HaarClassifier = cv2.CascadeClassifier("opencv-4.x/data/haarcascades/haarcascade_frontalface_default.xml")

    capture = cv2.VideoCapture(0)
    capture.set(cv2.CAP_PROP_FRAME_WIDTH,1280)
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT,720)

    count = 0 # # of caputre face images
    detection = 1
    frame_counter=0
    #영상 처리 및 출력
    while True: 
        ret, frame = capture.read() #카메라 상태 및 프레임
        # cf. frame = cv2.flip(frame, -1) 상하반전
        frame_origin = frame
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) #흑백으로
        faces = HaarClassifier.detectMultiScale(
            gray,#검출하고자 하는 원본이미지
            scaleFactor = 1.3, #검색 윈도우 확대 비율, 1보다 커야 한다
            minNeighbors = 6, #얼굴 사이 최소 간격(픽셀)
            #minSize=(20,20) #얼굴 최소 크기. 이것보다 작으면 무시
            minSize=(320,180)
        )
        frame_counter+=1
        if len(faces)>0:
            detection +=1
        #얼굴에 대해 rectangle 출력
        if frame_counter/detection == frame_counter/2:
            for (x,y,w,h) in faces:
                cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                #inputOutputArray, point1 , 2, colorBGR, thickness)
                count += 1
                now = datetime.now()
                current_time_str=now.strftime("%Y-%m-%d_(%H-%M-%S)")
                cv2.imwrite("capture_data/"+current_time_str+'_'+str(count/60+1)+".jpg",frame_origin[y-50:y+h+50, x-25:x+w+25])
                detection=1
        for (x,y,w,h) in faces:
            cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
            #inputOutputArray, point1 , 2, colorBGR, thickness)
            count += 1
            if count%15==0:
                now = datetime.now()
                current_time_str=now.strftime("%Y-%m-%d_(%H-%M-%S)")
                cv2.imwrite("capture_data/"+current_time_str+'_'+str(count/60+1)+".jpg",frame_origin[y-50:y+h+50, x-25:x+w+25])
        cv2.imshow('image',frame)

        #종료 조건
        if cv2.waitKey(1) > 0 : break #키 입력이 있을 때 반복문 종료
        # elif count >= 100 : break #100 face sample

    print("\n [INFO] Exiting Program and cleanup stuff\n")

    capture.release() #메모리 해제
    cv2.destroyAllWindows()#모든 윈도우 창 닫기