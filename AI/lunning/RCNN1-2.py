import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

# 사전 학습된 얼굴 검출 모델 로드
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 학습된 나이 분류 모델 로드
age_model = load_model('saved_age_model.h5')
age_classes = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '60+']

# 실시간 비디오 스트림 열기
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        # 얼굴 영역 추출
        face = frame[y:y+h, x:x+w]
        face = cv2.resize(face, (128, 128))  # 모델 입력 크기에 맞게 조정
        face = face.astype('float') / 255.0
        face = img_to_array(face)
        face = np.expand_dims(face, axis=0)

        # 나이대 예측
        preds = age_model.predict(face)
        age_idx = np.argmax(preds[0])
        age_label = age_classes[age_idx]

        # 얼굴 박스 및 나이대 표시
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.putText(frame, age_label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    # 화면에 표시
    cv2.imshow('Age Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
