# from flask import Flask
# from flask_socketio import SocketIO, emit

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'
# socketio = SocketIO(app, cors_allowed_origins='*')

# @socketio.on('message')
# def handle_message(message):
#     print('received message: ' + message)
#     emit('message', message, broadcast=True)

# if __name__ == '__main__':
#     socketio.run(app)
# from flask import Flask, request
# app = Flask(__name__)

# @app.route('/', methods=['POST'])
# def post_data():
#     data = request.get_json()['data']
#     print('Data received:', data)
#     return 'OK'

# if __name__ == '__main__':
#     app.run(host='127.0.0.1', port=5000)
#import serial
# !!!!!import socket

# Configure serial port connection
#ser = serial.Serial('COM4', 9600)  # Replace with your port number and baud rate

# !!!!!!Configure socket connection
# !!!!!HOST = '127.0.0.1'  # Replace with your IP address or hostname
#!!!! PORT = 12345       # Replace with your port number
# !!!!s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# !!!!s.bind((HOST, PORT))
# !!!!s.listen(1)
# !!!!conn, addr = s.accept()

# Main loop
#while True:
    #!!!!!!conn, addr = s.accept()
    #!!!!!print(f'connection from {addr}!!!!!')
    # Read sensor value from serial port
    #line = ser.readline().strip()
    #print(f'{line}')
    # Send sensor value over socket connection
    #conn.send(line + b'\n')
