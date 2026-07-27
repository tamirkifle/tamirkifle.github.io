import cv2
import numpy as np
import sys

def process_image(in_path, out_path):
    # Load image
    img = cv2.imread(in_path)
    if img is None:
        print(f"Failed to load {in_path}")
        return

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # The background is a white/grey checkerboard (brightness > 200).
    # The icon is dark. Threshold to get the foreground mask.
    _, thresh = cv2.threshold(gray, 220, 255, cv2.THRESH_BINARY_INV)

    # Clean up the mask using morphological operations
    kernel = np.ones((5,5), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=3)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=3)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Get the largest contour (should be the icon itself)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        # Create a new blank mask
        mask = np.zeros_like(gray)
        cv2.drawContours(mask, [largest_contour], -1, 255, -1)
        
        # Smooth the mask edges slightly
        mask = cv2.GaussianBlur(mask, (3,3), 0)

        # Add alpha channel
        b, g, r = cv2.split(img)
        rgba = [b, g, r, mask]
        dst = cv2.merge(rgba, 4)

        cv2.imwrite(out_path, dst)
        print(f"Saved {out_path}")
    else:
        print("No contours found.")

in_file = "/Users/tamir/.gemini/antigravity-cli/brain/92698534-bac5-43a2-938c-eb30af3095cd/llm_engine_icon_1785179460560.jpg"
out_file = "media/llm_engine_icon.png"
process_image(in_file, out_file)
