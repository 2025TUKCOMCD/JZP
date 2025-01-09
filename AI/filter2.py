#
# 11-5 reference
# filter 2 testing for age classification
# 
#

from transformers import CLIPProcessor, CLIPModel
from PIL import Image

img=Image.open('capture_data/2025-01-07_(16-54-34)_1.05.jpg')
processor=CLIPProcessor.from_pretrained('openai/clip-vit-base-patch32')
model=CLIPModel.from_pretrained('openai/clip-vit-base-patch32')

captions=['teen','adult','old man','man','woman']
inputs=processor(text=captions,images=img,return_tensors='pt',padding=True)
res=model(**inputs)

import matplotlib.pyplot as plt
plt.imshow(img); plt.xticks([]); plt.yticks([]); plt.show()

logits=res.logits_per_image
probs=logits.softmax(dim=1)
for i in range(len(captions)):
    print(captions[i],': ','{:.2f}'.format(float(probs[0,i]*100.0)))