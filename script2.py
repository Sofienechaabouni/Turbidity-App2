import serial
import time
import requests

ser = serial.Serial('COM4', 9600)
arr=[]
while True:
    data = ser.readline().decode('ascii').strip()
    print('Data received:', data)
    arr.append(data)
    if len(arr)>100:
        requests.post('http://localhost:5000/data', json={'data': arr})
        break
    time.sleep(0.1)
