import numpy as np
import cv2
from PIL import Image
from tensorflow.keras.models import load_model
import tensorflow as tf

def enhance_image(image):
    """
    이미지 품질 개선을 위한 전처리
    """
    # 대비 향상
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    cl = clahe.apply(l)
    enhanced_lab = cv2.merge((cl,a,b))
    enhanced = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    
    # 노이즈 제거
    denoised = cv2.fastNlMeansDenoisingColored(enhanced)
    
    return denoised

def preprocess_image(image_path, img_height=32, img_width=128):
    """
    개선된 이미지 전처리 함수
    """
    try:
        # BGR 이미지로 로드
        image = cv2.imread(image_path)
        if image is None:
            raise Exception("Image could not be loaded")

        # 이미지 품질 개선
        enhanced = enhance_image(image)
        
        # 그레이스케일 변환
        gray = cv2.cvtColor(enhanced, cv2.COLOR_BGR2GRAY)
        
        # 이진화
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # 크기 조정 (Aspect Ratio 유지)
        target_height = img_height
        aspect_ratio = binary.shape[1] / binary.shape[0]
        target_width = int(target_height * aspect_ratio)
        target_width = min(target_width, img_width)  # 최대 너비 제한
        
        resized = cv2.resize(binary, (target_width, target_height), 
                           interpolation=cv2.INTER_AREA)
        
        # 패딩 추가
        if target_width < img_width:
            pad_width = img_width - target_width
            resized = np.pad(resized, ((0,0), (0,pad_width)), 
                           mode='constant', constant_values=255)
            
        # 정규화
        normalized = resized.astype(np.float32) / 255.0
        
        # 채널 차원 추가
        processed = np.expand_dims(normalized, axis=-1)
        
        # 배치 차원 추가
        processed = np.expand_dims(processed, axis=0)
        
        return processed
        
    except Exception as e:
        print(f"Error during image preprocessing: {e}")
        return None

def decode_prediction(predictions, confidence_threshold=0.5):
    """
    개선된 CTC 디코딩 함수
    """
    try:
        input_length = np.ones(predictions.shape[0]) * predictions.shape[1]
        
        # CTC 디코딩
        decoded, log_probs = tf.keras.backend.ctc_decode(
            predictions, 
            input_length,
            greedy=True
        )
        
        decoded_texts = []
        confidences = []
        
        for seq, prob in zip(decoded[0].numpy(), log_probs.numpy()):
            text = ''
            avg_confidence = 0
            valid_chars = 0
            
            for idx in seq:
                if idx > 0 and idx in index_to_char:
                    text += index_to_char[idx]
                    avg_confidence += predictions[0][valid_chars][idx]
                    valid_chars += 1
            
            if valid_chars > 0:
                avg_confidence /= valid_chars
                if avg_confidence >= confidence_threshold:
                    decoded_texts.append(text)
                    confidences.append(avg_confidence)
                    
        return decoded_texts, confidences
        
    except Exception as e:
        print(f"Error during decoding: {e}")
        return [], []

# 모델 로드
model_path = "/content/model.keras"
prediction_model = load_model(model_path, custom_objects={'CTCLayer': CTCLayer})

# 테스트 실행
test_image_path = "/content/test_image.jpg"
processed_image = preprocess_image(test_image_path)

if processed_image is not None:
    predictions = prediction_model.predict(processed_image)
    decoded_texts, confidences = decode_prediction(predictions)
    
    if decoded_texts:
        for text, conf in zip(decoded_texts, confidences):
            print(f"인식된 텍스트: {text} (신뢰도: {conf:.2f})")
    else:
        print("텍스트를 인식하지 못했습니다.")
else:
    print("이미지 전처리 실패")