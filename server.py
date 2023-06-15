from flask import Flask, jsonify,request
import serial
import time
import requests
from flask_cors import CORS
import numpy as np
ser = serial.Serial('COM4', 9600)
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

if __name__ == '__main__':
    app.run(host='0.0.0.0')# while True:
#     data = ser.readline().decode('ascii').strip()
#     print('Data received:', data)
#     requests.post('http://localhost:5000/send_data', json={'data': data})
#     time.sleep(0.1)