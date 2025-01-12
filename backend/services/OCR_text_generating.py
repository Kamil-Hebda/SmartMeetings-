import base64
import os
import google.generativeai as genai

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

def ocr_from_frames(frames):
  
    genai.configure(api_key=GOOGLE_API_KEY)

    model = genai.GenerativeModel('gemini-1.5-flash')

    all_text = []
    for i, image_path in enumerate(frames):
        base64_image = encode_image(image_path)

        contents = [
            f"Przepisz sam tekst z obrazka, klatka {i + 1}. Po polsku:",
            {
                "mime_type": "image/jpeg",
                "data": base64.b64decode(base64_image)
            }
        ]

        response = model.generate_content(contents)
        all_text.append(f"Klatka {i + 1}:\n{response.text}\n")

    return all_text