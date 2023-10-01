from flask import Flask, jsonify,request
import serial
import time
import requests
from flask_cors import CORS
import numpy as np
import base64
from PIL import Image
import io
import cv2
import numpy as np
import skimage.feature as ft
import pandas as pd
from image_processing import process_df


ser = serial.Serial('COM3', 9600)
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# Create a variable to store the data
toSend={}

# Route to get the data

@app.route('/data', methods=['GET'])
def get_data():
    arr=[]
    while True:
        ser.reset_input_buffer()
        data = ser.readline().decode('ascii').strip()
        print('Data received:', data)
        arr.append(float(data))
        if len(arr)>7  :
            break
    # toSend={"value":arr}
    # print(np.mean(arr))
    toSend={"value":np.mean(arr)}
    time.sleep(0.1) 
    #data = {"value":ser.readline().decode('ascii').strip()}
    #print('Data received:', data)
    #requests.post('http://localhost:5000/send_data', json={'data': data})
    #time.sleep(0.25)
    ser.flush()
    return jsonify(toSend)

@app.route('/data', methods=['POST'])
def post_data():
    data = request.get_json()['data']
    print('Data received:', data)
    toSend={"value":data}
    return 'OK'

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        # Retrieve the JSON data from the request
        json_data = request.get_json()

        # Get the image data from the 'image' property in the JSON
        base64_image = json_data['image']

        # Decode the base64-encoded image to bytes
        image_bytes = base64.b64decode(base64_image)

        # Use PIL to open the image from binary data
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)
        denoised_image = cv2.bilateralFilter(image_array, 9, 75, 75)
        
        # # Convert the PIL image to a NumPy array
        # image_array = np.array(image)
        # denoised_image = cv2.bilateralFilter(image_array, 9, 75, 75)
        default_name = "test_name"
        # print(type(denoised_image))
        # # Create a DataFrame with the processed image and name
        df = pd.DataFrame({ "image": [denoised_image],"name": default_name})
        processed_df = process_df(df)
        return jsonify({'message': processed_df[0]})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0')# while True:
#     data = ser.readline().decode('ascii').strip()
#     print('Data received:', data)
#     requests.post('http://localhost:5000/send_data', json={'data': data})
#     time.sleep(0.1)