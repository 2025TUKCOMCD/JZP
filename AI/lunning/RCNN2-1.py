import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.applications import MobileNetV2
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical

# 데이터 경로 설정
data_dir = "path_to_your_dataset"  # 데이터셋 디렉토리
image_size = (128, 128)           # 모델 입력 이미지 크기
categories = ['2-19', '20-60', '61+']  # 나이대 클래스

# 데이터 및 레이블 리스트 초기화
data = []
labels = []

# OpenCV로 이미지 로드 및 전처리
for category in categories:
    class_index = categories.index(category)
    category_path = os.path.join(data_dir, category)

    for img_name in os.listdir(category_path):
        img_path = os.path.join(category_path, img_name)
        img = cv2.imread(img_path)
        
        if img is not None:
            # 이미지 크기 조정 및 전처리
            img = cv2.resize(img, image_size)
            data.append(img)
            labels.append(class_index)

# NumPy 배열로 변환
data = np.array(data, dtype="float32") / 255.0  # 픽셀 값을 [0, 1] 범위로 정규화
labels = np.array(labels)

# 데이터를 훈련 및 검증 세트로 분할
train_X, val_X, train_y, val_y = train_test_split(data, labels, test_size=0.2, random_state=42)

# 레이블을 원-핫 인코딩
train_y = to_categorical(train_y, num_classes=len(categories))
val_y = to_categorical(val_y, num_classes=len(categories))

# MobileNetV2 백본 모델
base_model = MobileNetV2(input_shape=image_size + (3,), include_top=False, weights="imagenet")
base_model.trainable = False  # 사전 학습된 가중치를 고정

# 모델 구조 추가
x = Flatten()(base_model.output)
x = Dense(128, activation="relu")(x)
x = Dropout(0.5)(x)
output = Dense(len(categories), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output)

# 모델 컴파일
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# 모델 학습
history = model.fit(
    train_X, train_y,
    validation_data=(val_X, val_y),
    epochs=10,
    batch_size=32
)

# 모델 저장
model_save_path = "age_classification_model.h5"
model.save(model_save_path)
print(f"Model saved to {model_save_path}")
