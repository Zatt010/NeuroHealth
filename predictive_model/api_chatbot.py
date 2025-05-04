from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import numpy as np
import pickle

app = FastAPI()

# Cargar modelo
model_path = "modelo_emociones_final"
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizer.from_pretrained(model_path)
with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

model.eval()

class EntradaTexto(BaseModel):
    texto: str

@app.post("/emocion")
def detectar_emocion(datos: EntradaTexto):
    inputs = tokenizer(datos.texto, return_tensors="pt", truncation=True, padding=True, max_length=128)
    outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1).detach().numpy()[0]
    idx = np.argmax(probs)
    emocion = label_encoder.inverse_transform([idx])[0]
    confianza = float(probs[idx])
    return {"emocion": emocion, "confianza": confianza}
