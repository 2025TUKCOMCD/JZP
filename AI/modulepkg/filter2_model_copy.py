#
#   2nd filter (age classification) Transfer-Learning based
#   2025-01-14, chlgideh
#
#   source : 11-1.py
#   Revised by chlgideh
#

import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
# from tensorflow.keras.mixed_precision import experimental as mixed_precision
from tensorflow.python.keras.mixed_precision import policy as pc
import tensorflow.python.keras.callbacks as cb

# policy = pc.Policy('float32') # when uses CPU
policy = pc.Policy('mixed_float16')
pc.set_global_policy(policy)

import numpy as np
import tensorflow

from keras.api.preprocessing.image import img_to_array, load_img

import tensorflow as tf
# from keras.api.preprocessing.image import Image
# from tensorflow import ImageDataGenerator
import keras
from sklearn.model_selection import train_test_split

image_directory = 'AI/training/All-Age-Faces_Dataset/aglined_faces'
img_siz=(32,32,3)               # 영상의 크기
# img_siz = (224, 224, 3)   #value error (need to much memory)

def parse_image(filename, img_size):
    image = tf.io.read_file(filename)
    image = tf.image.decode_jpeg(image, channels=3)
    image = tf.image.resize(image, img_size[:2])
    image /= 255.0  # 정규화
    return image

def extract_age_from_filename(filename):
    age = int(filename[-6:-4])
    if 2 <= age <= 19:
        return 0
    elif 20 <= age <= 60:
        return 1
    else:
        return 2

def load_data(image_directory, img_size):
    filenames = []
    labels = []

    for filename in os.listdir(image_directory):
        if filename.endswith('.jpg'):
            full_path = os.path.join(image_directory, filename)
            filenames.append(full_path)
            label = extract_age_from_filename(filename)
            labels.append(label)

    filenames = tf.constant(filenames)
    labels = tf.constant(labels)

    dataset = tf.data.Dataset.from_tensor_slices((filenames, labels))
    dataset = dataset.map(lambda x, y: (parse_image(x, img_size), y), num_parallel_calls=tf.data.experimental.AUTOTUNE)
    return dataset

dataset = load_data(image_directory, img_siz)

def prepare_for_training(ds, batch_size, shuffle_buffer_size=1000):
    ds = ds.shuffle(buffer_size=shuffle_buffer_size)
    ds = ds.cache()  # 데이터 캐싱
    ds = ds.batch(batch_size)
    ds = ds.prefetch(buffer_size=tf.data.experimental.AUTOTUNE)
    return ds

# 데이터셋을 훈련 및 검증 세트로 분할
dataset_size = sum(1 for _ in dataset)
train_size = int(0.8 * dataset_size)
train_dataset = dataset.take(train_size)
validation_dataset = dataset.skip(train_size)

batch_size = 32  # 배치 크기 조정
train_dataset = prepare_for_training(train_dataset, batch_size)
validation_dataset = prepare_for_training(validation_dataset, batch_size)

###################33



# from tensorflow import keras
# sys.path.append('C:\\Users\\82106\\Anaconda3\\Lib\\site-packages')
# from tensorflow.python.keras import layers
# from tensorflow.python.keras.losses import SparseCategoricalCrossentropy
# from tensorflow.python.keras.optimizers import adam_v2 as Adam

from keras import *
# import keras.src.optimizers.adam

# (x_train,y_train),(x_test,y_test)=keras.datasets.cifar10.load_data()



n_class=3                      # 부류 수
patch_siz=4                     # 패치 크기
p2=(img_siz[0]//patch_siz)**2   # 패치 개수
d_model=64                      # 임베딩 벡터 차원
h=8                             # 헤드 개수
N=6                             # 인코더 블록의 개수

# train_generator, validation_generator = load_data(image_directory, img_siz)
# x_train, x_test, y_train, y_test = train_test_split(x_data, y_data, test_size=0.2, random_state=42)

class Patches(layers.Layer):
    def __init__(self, patch_size):
        super(Patches, self).__init__()
        self.p_siz=patch_size

    def call(self, img):
        batch_size=tf.shape(img)[0]
        patches=tf.image.extract_patches(images=img,sizes=[1,self.p_siz,self.p_siz,1],strides=[1,self.p_siz,self.p_siz,1],rates=[1,1,1,1],padding="VALID")
        patch_dims=patches.shape[-1]
        patches=tf.reshape(patches,[batch_size,-1,patch_dims])
        return patches

class PatchEncoder(layers.Layer):
    def __init__(self,p2,d_model): # p2: 패치 개수
        super(PatchEncoder,self).__init__()
        self.p2=p2
        self.projection=layers.Dense(units=d_model)
        self.position_embedding=layers.Embedding(input_dim=p2,output_dim=d_model)

    def call(self,patch):
        positions=tf.range(start=0,limit=self.p2,delta=1)
        encoded=self.projection(patch)+self.position_embedding(positions)
        return encoded

def create_vit_classifier():
    input=layers.Input(shape=(img_siz))
    nor=layers.Normalization()(input)
    
    patches=Patches(patch_siz)(nor)	# 패치 생성
    x=PatchEncoder(p2,d_model)(patches)	# 패치 인코딩

    for _ in range(N):			# 다중 인코더 블록
        x1=layers.LayerNormalization(epsilon=1e-6)(x)		# 층 정규화
        x2=layers.MultiHeadAttention(num_heads=h,key_dim=d_model//h,dropout=0.1)(x1,x1)			# MHA
        x3=layers.Add()([x2,x])		# 지름길 연결
        x4=layers.LayerNormalization(epsilon=1e-6)(x3)	# 층 정규화
        x5=layers.Dense(d_model*2,activation=tf.nn.gelu)(x4)
        x6=layers.Dropout(0.1)(x5)
        x7=layers.Dense(d_model,activation=tf.nn.gelu)(x6)   
        x8=layers.Dropout(0.1)(x7)        
        x=layers.Add()([x8,x3])		# 지름길 연결
    
        x=layers.LayerNormalization(epsilon=1e-6)(x)
        x=layers.Flatten()(x)
        x=layers.Dropout(0.5)(x)   
        x=layers.Dense(2048,activation=tf.nn.gelu)(x)    
        x=layers.Dropout(0.5)(x)
        x=layers.Dense(1024,activation=tf.nn.gelu)(x)    
        x=layers.Dropout(0.5)(x)    
        output=layers.Dense(n_class,activation='softmax')(x)
        
        model=keras.Model(inputs=input,outputs=output)
        return model


model=create_vit_classifier()

checkpoint = cb.ModelCheckpoint(
    filepath='tf_AAFD.keras', # 모델을 저장할 파일명
    monitor='val_accuracy', # 검증 정확도를 모니터링
    save_best_only=True, # 가장 높은 정확도를 가진 모델만 저장
    mode='max', # 높은 정확도가 더 좋은 것이므로 'max'
    verbose=1 # 진행 상황을 출력
)

#Adam, SparseCategoricalCrossentropy 수정
model.compile(optimizer=optimizers.Adam(),
              loss=losses.SparseCategoricalCrossentropy(from_logits=False),
              metrics=['accuracy']
)

# batch size revising
'''
hist=model.fit(train_dataset,
               batch_size=32,
               epochs=40,
               validation_data=validation_dataset,
               verbose=1,
               callbacks=[checkpoint]
)
'''

hist=model.fit(train_dataset,
               batch_size=32,
               epochs=40,
               validation_data=validation_dataset,
               verbose=1
)

res=model.evaluate(validation_dataset,verbose=0)
print('정확률=',res[1]*100)
model.save("tf_AAFD")

import matplotlib.pyplot as plt

plt.plot(hist.history['accuracy'])
plt.plot(hist.history['val_accuracy'])
plt.title('Accuracy graph')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend(['Train','Validation'])
plt.grid()
plt.show()

plt.plot(hist.history['loss'])
plt.plot(hist.history['val_loss'])
plt.title('Loss graph')
plt.ylabel('Loss')
plt.xlabel('Epoch')
plt.legend(['Train','Validation'])
plt.grid()
plt.show()