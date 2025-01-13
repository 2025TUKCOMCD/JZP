#
#   Haar Cascade 테스트 코드
#   2025-01-07, chlgideh
#
#

import cv2

frame_width=640
frame_height=480

HaarClassifier = cv2.CascadeClassifier("opencv-4.x/data/haarcascades/haarcascade_frontalface_default.xml")
# HaarClassifier = cv2.CascadeClassifier("opencv-4.x/data/haarcascades/haarcascade_frontalface_alt.xml")

# img = cv2.imread("test_image_teen.jpg")
img = cv2.imread("test_image_adult.jpg")
image_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

image_gray = cv2.resize(image_gray,(frame_width,frame_height))
Faces = HaarClassifier.detectMultiScale(image_gray)
# Faces = HaarClassifier.detectMultiScale(image_gray, 1.1, 5)

for (x, y, w, h) in Faces:
    cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
    #
    # cv2.rectangle(image, start_point, end_point, color, thickness)
    #
cv2.imshow("IMG", img)

cv2.waitKey()