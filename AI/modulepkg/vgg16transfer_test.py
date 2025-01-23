#
#   VGG16 based Transfer Learning Age Classification Model
#   Source : https://github.com/ThisaraWeerakoon/Medium-Blog-Post-Source-Codes.git
#   Revised by chlgideh
#   2024-01-16
#

# WARNING : not complete code

import os
import random
import numpy as np
import matplotlib.pyplot as plt
# %matplotlib inline    # for Jupyter
import cv2
from sklearn.model_selection import train_test_split
from keras.utils import np_utils
from keras.models import Model,Sequential
from keras.layers import Dense,Flatten,Dropout
from keras.applications.vgg16 import preprocess_input,VGG16
from keras.regularizers import l2
from keras.callbacks import ModelCheckpoint,EarlyStopping
import visualkeras
from PIL import ImageFont

'''
    Data Preprocessing
'''
img_height=224
img_width=224
def image_preprocessing(img_path):
    #Read the image
    img=cv2.imread(img_path)

    #Resize the image 
    resized_img=cv2.resize(img,(img_height,img_width))
    
    #Normalize the image
    normalized_img=resized_img/255
    
    return normalized_img


'''
    Testing
'''
def predict_on_image(img_path):
    
    #Preprocess image 
    preprocessed_img=image_preprocessing(img_path)

    #Reshape
    reshaped_img=np.reshape(preprocessed_img,(1,img_height,img_width,3))
    
    # Passing the img to the model and get the predicted probabilities
    predicted_labels_probabilities=model.predict(reshaped_img)
    # Get the class index with highest probability.
    class_index=np.argmax(predicted_labels_probabilities)
    #Get age class 
    age_class=str(class_index*25)+"-"+str((class_index+1)*25-1)
    
    return age_class

# New path of the sample image dataset
new_sample_dir = "/path/to/your/new/dataset"

# All sample image names in the new directory
new_sample_img_names = os.listdir(new_sample_dir)

for counter, new_sample_img_name in enumerate(new_sample_img_names):
    # Path of the selected image
    new_sample_path = os.path.join(new_sample_dir, new_sample_img_name)

    # Get the prediction
    predicted_age_class = predict_on_image(new_sample_path)

    # Read sample image in BGR format
    new_sample_img_bgr = cv2.imread(new_sample_path)

    # Convert it into RGB format
    new_sample_img_rgb = cv2.cvtColor(new_sample_img_bgr, cv2.COLOR_BGR2RGB)

    # Write predicted age class on top of the image
    cv2.putText(new_sample_img_rgb, predicted_age_class, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

    # Display the selected image
    plt.imshow(new_sample_img_rgb)
    plt.axis('off')
    plt.show()