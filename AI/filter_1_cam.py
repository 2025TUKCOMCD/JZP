#
#   Haar Cascade test, camera
#   2025-01-07, chlgideh
#
#

import cv2
from datetime import datetime

def Haar_cam():
    # Haar Classifier 설정, 경로 주의
    HaarClassifier = cv2.CascadeClassifier("opencv-4.x/data/haarcascades/haarcascade_frontalface_default.xml")

    capture = cv2.VideoCapture(0)
    capture.set(cv2.CAP_PROP_FRAME_WIDTH,1280)
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT,720)

    count = 0 # detection frame counter
    detection = 1 # flag for consecutive detection frame
    frame_counter = 0 # counter for camera (30 frame per 1 sec)
    #영상 처리 및 출력
    while True: 
        ret, frame = capture.read() #카메라 상태 및 프레임
        # cf. frame = cv2.flip(frame, -1) 상하반전
        frame_origin = frame
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # Haar 알고리즘은 음영을 추적하기 때문에 grayscale로 변환하여 연산하는 것이 편리
        faces = HaarClassifier.detectMultiScale(
            gray, #image for detection
            scaleFactor = 1.3, #검색 윈도우 확대 비율, 1보다 커야 한다 image resize를 하면 없어도 무방.
            minNeighbors = 6, #얼굴 사이 최소 간격(픽셀)
            #minSize=(20,20) #얼굴 최소 크기. 이것보다 작으면 무시
            minSize=(320,180)
        )
        frame_counter+=1
        if len(faces)>0:
            detection +=1
        # 기존 프레임에 탐지된 retangle 표시시
        if frame_counter/detection == frame_counter/2:  # division by zero error 회피. 이전 프레임과의 카운터를 비교하여 불연속적(최초) 캡쳐 성공에 대한 무조건적인 캡쳐 분기
            for (x,y,w,h) in faces:
                cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
                # rectangle(image, start_point, end_point, color, thickness)
                count += 1
                now = datetime.now()
                current_time_str=now.strftime("%Y-%m-%d_(%H-%M-%S)")
                cv2.imwrite("capture_data/"+current_time_str+'_'+str(count/60+1)+".jpg",frame_origin[y-50:y+h+50, x-25:x+w+25])
                detection=1
        for (x,y,w,h) in faces: # 연속적인 detection일 경우, 15 프레임(탐지 성공) 에 대해서만 캡쳐하여 자원 소모 최소화화
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

    print("\n [INFO] Exiting Program and cleanup stuff\n")

    capture.release() #메모리 해제
    cv2.destroyAllWindows()#모든 윈도우 창 닫기