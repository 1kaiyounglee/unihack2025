import cv2
import numpy as np
import os


def process_image(image_dir):
# Path to YOLO files
    yolo_path = "C:/Users/kyanj/Documents/UNIHACK2025/unihack2025/backend/image_cap"
    cfg_path = os.path.join(yolo_path, "yolov4.cfg")
    weights_path = os.path.join(yolo_path, "yolov4.weights")
    names_path = os.path.join(yolo_path, "coco.names")

    # Load YOLO model
    net = cv2.dnn.readNet(weights_path, cfg_path)

    # Load class names
    with open(names_path, "r") as f:
        classes = [line.strip() for line in f.readlines()]

    # Get output layers
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

    # Get the latest image file
    image_files = sorted(
        [f for f in os.listdir(image_dir) if f.endswith(".jpg")],
        key=lambda x: os.path.getctime(os.path.join(image_dir, x)),
        reverse=True
    )

    if not image_files:
        print("No images found!")
        exit()

    latest_image_path = os.path.join(image_dir, image_files[0])
    print(f"Processing image: {latest_image_path}")

    # Read image
    image = cv2.imread(latest_image_path)
    height, width, _ = image.shape

    # Preprocess image for YOLO
    blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    outputs = net.forward(output_layers)

    # Lists to store detection data
    boxes = []
    confidences = []
    class_ids = []

    # Process detections
    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            # Detect only 'person' class (ID 0 in COCO dataset)
            if class_id == 0 and confidence > 0.5:
                center_x, center_y, w, h = map(int, detection[:4] * [width, height, width, height])
                x, y = center_x - w // 2, center_y - h // 2
                
                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    # Apply Non-Maximum Suppression (NMS) to remove duplicate detections
    indices = cv2.dnn.NMSBoxes(boxes, confidences, score_threshold=0.5, nms_threshold=0.4)

    # Count people correctly
    people_count = 0

    if len(indices) > 0:
        for i in indices.flatten():
            x, y, w, h = boxes[i]
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(image, f"Person {people_count+1}", (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            people_count += 1

    # Display number of people detected
    print(f"Number of people detected: {people_count}")

    try:
        os.remove(latest_image_path)
        print(f"Deleted image: {latest_image_path}")
    except Exception as e:
        print(f"Error deleting image: {e}")

    #uncomment to see AI detection image
    # cv2.imshow("YOLOv4 Person Detection", image)
    # cv2.imwrite(os.path.join(image_dir, "detected_" + image_files[0]), image)  # Save the detected image
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    return people_count