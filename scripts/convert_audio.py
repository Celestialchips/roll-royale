import os
from pydub import AudioSegment

input_dir = "./sounds"
output_dir = "../public/audio/"

# Process all M4A files in the directory
for file in os.listdir(input_dir):
    if file.endswith(".m4a"):
        filename = os.path.splitext(file)[0]
        input_path = os.path.join(input_dir, file)
        output_path = os.path.join(output_dir, f"{filename}.wav")
        
        audio = AudioSegment.from_file(input_path, format="m4a")
        audio.export(output_path, format="wav")
        print(f"Converted: {file} → {filename}.wav")