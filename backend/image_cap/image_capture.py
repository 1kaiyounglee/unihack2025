import cv2
import os
from datetime import datetime

def capture_image():
    """
    Captures an image from the webcam and saves it in the project folder.
    Returns the path of the captured image.
    """

    # Get the current user's Documents folder (Windows only)
    documents_folder = os.path.join(os.path.expanduser("~"), "Documents")

    # Define the project path dynamically for any user
    project_folder = os.path.join(documents_folder, "UNIHACK2025", "unihack2025", "backend", "image_cap", "images")

    # Create the directory if it doesn't exist
    if not os.path.exists(project_folder):
        os.makedirs(project_folder)

    # Initialize webcam
    cap = cv2.VideoCapture(0)  # 0 selects the first available webcam

    # Check if the webcam is opened
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return None  # Exit the function

    # Get timestamp for filename
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    # Capture image
    ret, frame = cap.read()
    cap.release()  # Ensure the camera is released after capture

    if ret:
        filename = os.path.join(project_folder, f"captured_image_{timestamp}.jpg")
        cv2.imwrite(filename, frame)
        print(f"Image saved as: {filename}")
        return filename  # Return the file path
    else:
        print("Error: Could not capture image.")
        return None  # Return None if image capture fails
