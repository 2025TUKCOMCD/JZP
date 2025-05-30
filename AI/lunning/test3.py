import os
import json
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Reshape, Dense, Bidirectional, LSTM, Input, Lambda
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.backend import ctc_batch_cost

# 데이터셋 경로
image_dir = "C:\\Users\\rladb\\open_cv\\source_4548_1\\source\\han\\machine\\testimg"
label_dir = "C:\\Users\\rladb\\open_cv\\source_4548_1\\source\\han\\machine\\testjson"

# 문자 집합 정의
char_set = ''.join([chr(i) for i in range(0xAC00, 0xD7A4)])
char_set += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
char_to_index = {char: idx + 1 for idx, char in enumerate(char_set)}  # 문자 -> 인덱스
num_classes = len(char_to_index) + 1  # CTC에서 blank index 고려

# 이미지 전처리 함수
def load_image(image_path, img_height=32, img_width=128):
    try:
        pil_image = Image.open(image_path).convert('L')  # Grayscale로 변환
        image = np.array(pil_image)
    except Exception as e:
        print(f"Error loading image: {e}")
        return None

    image = cv2.resize(image, (img_width, img_height))
    image = image / 255.0
    image = np.expand_dims(image, axis=-1)
    return image

# 데이터 로드 함수
def load_data(image_dir, label_dir):
    images = []
    labels = []

    for json_file in os.listdir(label_dir):
        if not json_file.endswith(".json"):
            continue

        with open(os.path.join(label_dir, json_file), 'r', encoding='utf-8') as f:
            data = json.load(f)

        for annotation in data["annotations"]:
            image_name = next(
                (img["file_name"] for img in data["images"] if img["id"] == annotation["image_id"]), None
            )
            if image_name:
                image_path = os.path.join(image_dir, image_name)
                if not os.path.exists(image_path):
                    print(f"Image not found: {image_path}")
                    continue

                image = load_image(image_path)
                if image is None:
                    continue
                images.append(image)

                text = annotation["text"]
                label = [char_to_index[char] for char in text if char in char_to_index]
                labels.append(label)

    images = np.array(images)
    labels = tf.keras.preprocessing.sequence.pad_sequences(labels, padding="post")
    return images, labels

# 데이터 로드
images, labels = load_data(image_dir, label_dir)

# 입력 및 출력 정의
input_length = np.ones(len(images)) * (images.shape[2] // 4)  # CNN 출력 시간축 길이
label_length = np.array([len(label) for label in labels])

input_length = np.expand_dims(input_length, axis=-1)
label_length = np.expand_dims(label_length, axis=-1)

# CTC 손실 함수
def ctc_lambda_func(args):
    y_pred, labels, input_length, label_length = args
    return ctc_batch_cost(labels, y_pred, input_length, label_length)

# CRNN 모델 정의
def build_crnn(input_shape, num_classes):
    inputs = Input(shape=input_shape, name="input_image")
    x = Conv2D(64, (3, 3), activation='relu', padding='same')(inputs)
    x = MaxPooling2D((2, 2))(x)
    x = Conv2D(128, (3, 3), activation='relu', padding='same')(x)
    x = MaxPooling2D((2, 2))(x)
    x = Conv2D(256, (3, 3), activation='relu', padding='same')(x)
    x = MaxPooling2D((2, 2))(x)
    x = Reshape((-1, 256))(x)
    x = Bidirectional(LSTM(128, return_sequences=True))(x)
    y_pred = Dense(num_classes, activation='softmax', name="output")(x)

    labels = Input(name="labels", shape=[None], dtype="int32")
    input_length = Input(name="input_length", shape=[1], dtype="int32")
    label_length = Input(name="label_length", shape=[1], dtype="int32")
    loss_out = Lambda(ctc_lambda_func, name="ctc_loss")([y_pred, labels, input_length, label_length])

    model = Model(inputs=[inputs, labels, input_length, label_length], outputs=loss_out)
    base_model = Model(inputs, y_pred)
    return model, base_model

# 모델 빌드
input_shape = (32, 128, 1)
model, base_model = build_crnn(input_shape, num_classes)

# 모델 컴파일
model.compile(optimizer=Adam(learning_rate=0.001))

# 모델 학습
model.fit(
    x={
        "input_image": images,
        "labels": labels,
        "input_length": input_length,
        "label_length": label_length,
    },
    y=np.zeros(len(images)),  # CTC는 타겟 값이 필요 없음
    epochs=20,
    batch_size=16
)

# 모델 저장
base_model.save("C:\\Users\\rladb\\open_cv\\source_4548_1\\source\\han\\machine\\testmodel")
print("모델 학습 완료 및 저장됨.")
