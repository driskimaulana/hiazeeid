import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import io
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing import image
import numpy as np
from flask import Flask, request, jsonify
import psycopg2

model = keras.models.load_model("models/modelv1.h5")

def transform_image(image_bytes):
    img = image.load_img(io.BytesIO(image_bytes), target_size=(400,400))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x /= 255.0
    return x


def predict(x):
    predictions = model.predict(x)
    predictions = tf.nn.softmax(predictions)
    pred0 = predictions[0]
    label0 = np.argmax(pred0)
    return label0

def getClass(id):
    dataClass = ""
    if int(id) == 0:
        dataClass = "Aloevera"
    elif int(id) == 1:
        dataClass = "Anthuriumandreanum"
    elif int(id) == 2:
        dataClass = "Araucariaheterophylla"
    elif int(id) == 3:
        dataClass = "Bamboo"
    elif int(id) == 4:
        dataClass = "Bostonfern"
    elif int(id) == 5:
        dataClass = "Chlorophytumcomosum"
    elif int(id) == 6:
        dataClass = "Croton"
    elif int(id) == 7:
        dataClass = "Dieffenbachia"
    elif int(id) == 8:
        dataClass = "Epipremnum"
    elif int(id) == 9:
        dataClass = "Euphorbiamilii"
    elif int(id) == 10:
        dataClass = "Monsteradeliciosa"   
    elif int(id) == 11:
        dataClass = "Dracaenatrifasciata"
    elif int(id) == 12:
        dataClass = "Spathiphyllum"
    elif int(id) == 13:
        dataClass = "Whiteorchids"
    elif int(id) == 14:
        dataClass = "Zamioculcas" 
    
    return dataClass

def getPlants(predicition):
    scName = getClass(predicition)
    # inisialisasi postgresql
    conn = psycopg2.connect(
        host='localhost',
        port=5432,
        database='dev_bibitunggulid',
        user='postgres',
        password='root123'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM plants WHERE \"scienceName\" = %s", (scName,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row is not None:
        # Return the column value as a response
        return jsonify({
            'localName': row[1],
            'about': row[2],
            'scienceName': row[3],
            'family': row[4],
            'kingdom': row[5],
            'order': row[6],
        })
    else:
        # Return a message if no row was found
        return jsonify({'message': 'No data found for the given ID'})

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files.get('file')
        if file is None or file.filename == "":
            return jsonify({"error": "no file"})
    
        try:
            image_bytes = file.read()
            tensor = transform_image(image_bytes)
            prediction = predict(tensor)
            return getPlants(predicition=prediction)
        except Exception as e:
            return jsonify({"error": str(e)})

    return "OK"


if __name__ == "__main__":
    app.run(debug=True)