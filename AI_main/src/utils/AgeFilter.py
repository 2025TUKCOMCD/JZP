import keras.saving
import cv2
import numpy as np
import queue
import time

def preprocess_frame(frame):
    image_size = (128, 128)
    img = cv2.resize(frame, image_size)
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def AgeAnalyze(frame_data, age_data):
    model_path = "src/model/age_classification_model_40_v4.keras"
    model = keras.saving.load_model(model_path)
    print("Model loaded successfully")

    categories = ['2-19', '20-60', '61+']

    while True:
        print("Analyzing...")
        start = time.time()
        try:
            frame = frame_data.get(timeout=0.5)  # 1/2초 대기
            processed_frame = preprocess_frame(frame)
            predictions = model.predict(processed_frame)
            predicted_class = np.argmax(predictions, axis=1)[0]
            predicted_age_group = categories[predicted_class]

            # print(f"Predicted Age Group: {predicted_age_group}")
            
            age_data.put(predicted_age_group, block = False)
            end = time.time()
            print(f"| ( Analyzing DONE {end-start:.2f}s ) {predicted_age_group}")

        except queue.Full:
            age_data.get()
            age_data.put(predicted_age_group)
            end = time.time()
            print(f"( Analyzing DONE {end-start:.2f}s ) {predicted_age_group}")
            
        except queue.Empty:
            continue  # 비어있으면 다시 대기

        except KeyboardInterrupt:
            print("...exit")

        if frame is None:
            print("None")
            break
            
if __name__ == "__main__":
    AgeAnalyze()
