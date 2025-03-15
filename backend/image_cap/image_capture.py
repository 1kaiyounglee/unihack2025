import cv2
import os
import time
from datetime import datetime

# Get the current user's Documents folder (Windows only)
documents_folder = os.path.join(os.path.expanduser("~"), "Documents")

# Define the project path dynamically for any user
project_folder = os.path.join(documents_folder, "UNIHACK2025", "unihack2025", "backend", "image_cap", "images")

# Create the directory if it doesn't exist
if not os.path.exists(project_folder):
    os.makedirs(project_folder)

# Capture interval in seconds (5 minutes = 300 seconds)
capture_interval = 300

# Initialize webcam
cap = cv2.VideoCapture(0)  # 0 selects the first available webcam

# Check if the webcam is opened
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

while True:
    # Get timestamp for filename
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    # Capture image
    ret, frame = cap.read()
    if ret:
        filename = os.path.join(project_folder, f"captured_image_{timestamp}.jpg")
        cv2.imwrite(filename, frame)
        print(f"Image saved as {filename}")
    else:
        print("Error: Could not capture image.")

    # Wait for the next capture
    time.sleep(capture_interval)
