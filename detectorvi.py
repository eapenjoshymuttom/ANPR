from ultralytics import YOLO
import cv2
import cvzone
import math
from sort import *
import easyocr
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import firestore

# Path to your service account JSON file
cred = credentials.Certificate('pass.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://anpr-d05b8-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

reader = easyocr.Reader(['en'], gpu=True)


cap = cv2.VideoCapture("../videos/parking_data4.mov")

model = YOLO("../Yolo-Weights/best_l.pt")

classNames = ["number_plate"]

# Tracking
tracker = Sort(max_age=20, min_hits=3, iou_threshold=0.3)
# x1    y1   x2   y2
limits = [10, 450, 900, 450]

totalCount = []
active_plates = []
ref = db.reference('/')

while True:
    _, img = cap.read()
    results = model(img, stream=True)
    detections = np.empty((0, 5))  # initializes a numpy array with 5 columns and 0 rows
    q = 0
    for r in results:  # for each object in the frame
        boxes = r.boxes
        q = q + 1
        i = 0
        for box in boxes:  # for each instance of the object
            # Bounding Box
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            # cv2.rectangle(img,(x1,y1),(x2,y2),(255,0,255),3)
            # Confidence
            conf = math.ceil((box.conf[0] * 100)) / 100
            # Class Name
            cls = int(box.cls[0])
            currentClass = classNames[cls]

            if currentClass == "number_plate" and conf > 0.3:
                currentArray = np.array([x1, y1, x2, y2, conf])
                detections = np.vstack((detections, currentArray))
                # stacks current array to the detections array
                i = i + 1

        print("no of detections: ", i)
    print("r :", q)
    resultsTracker = tracker.update(detections)

    # cv2.line(img, (limits[0], limits[1]), (limits[2], limits[3]), (0, 0, 255), 5)
    for result in resultsTracker:
        x1, y1, x2, y2, id = result
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

        # Crop the region of interest for EasyOCR
        roi = img[y1:y2, x1:x2]
        cv2.imshow("roi", roi)
        # Get the original image dimensions
        height, width = roi.shape[:2]
        scale_factor = 3
        # Calculate the new dimensions
        new_height = int(height * scale_factor)
        new_width = int(width * scale_factor)
        # Resize the image
        resized_image = cv2.resize(roi, (new_width, new_height))
        cv2.imshow("_", resized_image)
        gray = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)
        cv2.imshow("__", gray)

        plate = reader.readtext(resized_image)
        if plate:
            text = plate[0][1]  # Get the detected text
            # the image, the text to display, text location wrt image, text style, text size,text color,
            # thickness of the text characters
            cv2.putText(img, text, (x1, y1 - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cvzone.putTextRect(img, f' {int(id)}', (max(0, x1), max(35, y1)),
                               scale=1, thickness=1, offset=5)

        w, h = x2 - x1, y2 - y1
        cx, cy = x1 + w // 2, y1 + h // 2
        cv2.circle(img, (cx, cy), 3, (255, 0, 255), cv2.FILLED)

        if limits[0] < cx < limits[2] and limits[1] - 15 < cy < limits[1] + 15:
            if totalCount.count(id) == 0:
                # cv2.line(img, (limits[0], limits[1]), (limits[2], limits[3]), (0, 255, 0), 5)
                totalCount.append(id)
                print("plate", plate[0][1])
                if plate[0][1] in active_plates:
                    # Plate detected again, delete it from Firebase
                    plates_ref = ref.child('active_plates')
                    snapshot = plates_ref.order_by_child('plate_number').equal_to(plate[0][1]).get()
                    for key, val in snapshot.items():
                        plates_ref.child(key).delete()
                    print(f"Plate {plate[0][1]} detected again and deleted from Active plates")

                else:
                    # Plate detected for the first time, add it to Firebase
                    plates_ref = ref.child('active_plates')
                    plates_ref.push().set({
                        'plate_number': plate[0][1],
                        # 'timestamp': firebase_admin.db.ServerValue.TIMESTAMP
                    })
                    print(f"Plate {plate[0][1]} added to active_plates")
                    active_plates.append(plate[0][1])
                    # Plate detected for the first time, add it to Firebase
                    plates_ref = ref.child('detected_plates')
                    plates_ref.push().set({
                        'plate_number': plate[0][1],
                        # 'timestamp': firebase_admin.db.ServerValue.TIMESTAMP
                    })
                    print(f"Plate {plate[0][1]} added to detected_plates")

        cvzone.putTextRect(img, f' Count: {len(totalCount)}', (50, 50))

    cv2.imshow("Image", img)
    cv2.waitKey(1)
    print(totalCount)
