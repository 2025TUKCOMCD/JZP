#
# 카메라 프레임 테스트용 소스
#

import cv2
capture = cv2.VideoCapture(0)
fps = capture.get(cv2.CAP_PROP_FPS)
print(f"Frames per second: {fps}")
capture.release()
