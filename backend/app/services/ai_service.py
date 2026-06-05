from pathlib import Path

import joblib
import numpy as np

from app.ai.train_model import train_and_save_model
from app.core.config import get_settings


class AIService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.model = None
        self.labels = {0: "normal", 1: "warning", 2: "critical"}

    def load_model(self) -> None:
        model_path = Path(self.settings.model_path)
        if not model_path.exists():
            model_path.parent.mkdir(parents=True, exist_ok=True)
            train_and_save_model(str(model_path))
        self.model = joblib.load(model_path)

    def predict(self, features: list[float]) -> dict:
        if self.model is None:
            self.load_model()
        array = np.array([features], dtype=float)
        prediction = int(self.model.predict(array)[0])
        probabilities = self.model.predict_proba(array)[0]
        confidence = float(probabilities[prediction])
        return {"prediction": self.labels[prediction], "confidence": round(confidence, 4)}


ai_service = AIService()
