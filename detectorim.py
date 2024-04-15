from ultralytics import YOLO
import cv2
import math
import numpy as np
import easyocr
import cvzone

# Load image
img = cv2.imread("../Videos/test1.jpg")

# Initialize YOLO model
model = YOLO("../Yolo-Weights/best.pt")

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'], gpu=True)

classNames = ["number_plate"]

# Run YOLO model on the image
results = model(img, stream=True)
# mask = np.zeros(img.shape[:2], dtype=np.uint8)  # Create an empty mask for each frame

for r in results:
    boxes = r.boxes
    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        conf = math.ceil((box.conf[0] * 100)) / 100
        print(conf)

        # Draw rectangles on the image
        cv2.rectangle(img, (x1, y1), (x2, y2), (255, 255, 255), 2)
        cls = int(box.cls[0])

        # Crop the region of interest for EasyOCR
        roi = img[y1:y2, x1:x2]

        # Use EasyOCR to read text in the region of interest
        result = reader.readtext(roi)

        # Display the detected text inside the rectangle
        if result:
            print(result)
            text = result[0][1]  # Get the detected text
            cv2.putText(img, text, (x1, y1 - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            cvzone.putTextRect(img, f'{classNames[cls]} {conf}', (max(0, x1), max(35, y1)), scale=1, thickness=1)

# Display the image with detected text and rectangles
cv2.imshow("Detected Characters", img)
cv2.waitKey(0)
