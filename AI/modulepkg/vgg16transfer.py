#
#   VGG16 based Transfer Learning Age Classification Model
#   Source : https://github.com/ThisaraWeerakoon/Medium-Blog-Post-Source-Codes.git
#   Revised by chlgideh
#   2024-01-16
#

import os
import random
import numpy as np
import matplotlib.pyplot as plt
# %matplotlib inline    # for Jupyter
import cv2
from sklearn.model_selection import train_test_split
from tensorflow.python.keras.utils import np_utils
from keras.api.models import Model,Sequential
from keras.api.layers import Dense,Flatten,Dropout
from keras.api.applications.vgg16 import preprocess_input,VGG16
from keras.api.regularizers import l2
from keras.api.callbacks import ModelCheckpoint,EarlyStopping
# import visualkeras # Model Visualization Package
from PIL import ImageFont

seed_constant = 27
random.seed(seed_constant)

# Replace "<your_path_here>" with the actual path to your dataset
img_dir = "AI/training/All-Age-Faces_Dataset/aglined_faces"

#all image names
all_img_names=os.listdir(img_dir)
# all_img_names # for show list of imgs
# len(all_img_names)


'''
random_range = random.sample(range(len(all_img_names)), 5)
print(random_range)

# Create a Matplotlib figure.
plt.figure(figsize=(25,25))

# Generate a list of 5 random values. The values should be less than number of images in dataset. 
random_range = random.sample(range(len(all_img_names)), 5)

#Iterate through random values
for counter, random_index in enumerate(random_range, 1):
    
    #Name of the selected image
    img_name=all_img_names[random_index]
    
    #Path of the selected image
    img_path=os.path.join(img_dir,img_name)
    
    #Read the selected image in BGR format
    bgr_img=cv2.imread(img_path)
    
    #Convert it into RGB format
    rgb_img=cv2.cvtColor(bgr_img,cv2.COLOR_BGR2RGB)
    
    
    #Display the selected image
    plt.subplot(5, 1, counter)
    plt.imshow(rgb_img)
    plt.title(img_name)
    plt.axis('off')
'''


'''
    Data Preprocessing
'''

img_height=64
img_width=64

def image_preprocessing(img_path):
    #Read the image
    img=cv2.imread(img_path)
    #Resize the image 
    resized_img=cv2.resize(img,(img_height,img_width))
    #Normalize the image
    normalized_img=resized_img/255
    return normalized_img

'''
    Label Extraction
'''

def label_extraction(img_name):
    '''
    This function will extract age from image name and return the class index by performing integer division (by 25).
    Args:
        img_name: The name of the image.
    Returns:
        class_index: An integer representing the age class.
    '''
    #Extract age 
    #age=int(img_name.split("_")[0])
    age=int(img_name[-6:-4])
    #Class index dividing by 25
    class_index=age//25
    return class_index

def create_dataset():
    '''
    This function will create the dataset.
    Returns:
        features:  A list containing the preprocessed images.
        labels:    A list containing the class indexes.
    '''
    #Declare empty lists to store features and labels.
    
    features=[]
    labels=[]
    
    for img_name in all_img_names:
        
        #Path of the image
        img_path=os.path.join(img_dir,img_name)
            
        #Get the preprocessed image
        preprocessed_img=image_preprocessing(img_path)
            
        #Get the class index
        class_index=label_extraction(img_name)
            
        #Append data into appropriate lists
        features.append(preprocessed_img)
        labels.append(class_index)
         
    #Convert lists to numpy arrays
    features=np.asarray(features)
    labels=np.asarray(labels)
    
    return features,labels

features,labels=create_dataset()
encoded_labels=np_utils.to_categorical(labels)

'''
    Split
'''
# Split the Data into Train ( 90% ) and Test Set ( 10% ).
features_train, features_test, labels_train, labels_test = train_test_split(features, encoded_labels,
                                                                            test_size = 0.1, shuffle = True,
                                                                            random_state = seed_constant)
#add preprocessing layer at the front of VGG16
vgg = VGG16(input_shape=features_train.shape[1:], weights='imagenet', include_top=False)

#Prevent training already trained layers 
for layer in vgg.layers:
  layer.trainable = False

#Add flatten layer
x = Flatten()(vgg.output)

#More Dense layers

#Use weight regularization(L2 vector norm) and dropout layers to reduce overfitting
x=Dense(1000,activation="relu",kernel_regularizer=l2(0.001))(x)
x=Dropout(0.5)(x)

x=Dense(256,activation="relu",kernel_regularizer=l2(0.001))(x)
x=Dropout(0.5)(x)

#Dense layer with number of nuerons equals to number of classes.
prediction = Dense(labels_train.shape[1], activation='softmax')(x)

#Create the model object
model = Model(inputs=vgg.input, outputs=prediction)

# model.summary()

'''
    just show Model Structure (visualization part)
'''
#selected font
# font = ImageFont.truetype('/Library/Fonts/Arial.ttf', 32)
# visualkeras.layered_view(model, legend=True, font=font) 

'''
    Compile & Train
'''
# Create an Instance of Early Stopping Callback
early_stopping_callback = EarlyStopping(monitor = 'val_loss', patience = 5, mode = 'min', restore_best_weights = True)

# checkpoint
filepath="weights_best.keras"
checkpoint = ModelCheckpoint(filepath, monitor='val_accuracy', verbose=1, save_best_only=True, mode='max')

#Callbacks
callbacks_list=[early_stopping_callback,checkpoint]

# Compile the model and specify loss function, optimizer and metrics values to the model
model.compile(loss = 'categorical_crossentropy', optimizer = "adam", metrics = ["accuracy"])

# Start training the model.
history = model.fit(x = features_train, y = labels_train, epochs = 50, batch_size=32,
                    shuffle = True, validation_split = 0.1, 
                    callbacks = callbacks_list )

# load weights of model with best validation accuracy
model.load_weights("weights_best.keras")
model_evaluation_history_base = model.evaluate(features_test, labels_test)
model_evaluation_history = model.evaluate(features_test, labels_test)
model.save("best_val_acc_model")

'''
    Visualization
'''
# Construct a range object 
epochs = range(len(history.history["loss"]))
# Plot the Graph.
plt.plot(epochs, history.history["loss"], 'blue', label = "loss")
plt.plot(epochs, history.history["val_loss"], 'red', label ="val_loss")
# Add title 
plt.title("Total Loss and Total Validation Loss")
# Add legend 
plt.legend()

# Construct a range object 
epochs = range(len(history.history["accuracy"]))
# Plot the Graph.
plt.plot(epochs, history.history["accuracy"], 'blue', label = "accuracy")
plt.plot(epochs, history.history["val_accuracy"], 'red', label ="val_accuracy")
# Add title 
plt.title("Total Accuracy and Total Validation Accuracy")
# Add legend 
plt.legend()

'''
    Testing
'''

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

'''