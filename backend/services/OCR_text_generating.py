import base64
import os
import google.generativeai as genai


def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

def ocr_from_frames(frames_folder):
    frames = os.listdir(frames_folder)
    number_files = len(frames)

    genai.configure(api_key='AIzaSyCdBpj7glotU3mCJtFL6uzPwLZH-lC3kso')

    model = genai.GenerativeModel('gemini-1.5-flash')

    all_text = []
    for i in range(number_files):
        image_path = os.path.join(frames_folder, frames[i])
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

#print("\n\n".join(all_text))