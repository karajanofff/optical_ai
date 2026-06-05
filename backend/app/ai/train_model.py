from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split


def generate_training_data(samples: int = 1200) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    per_class = max(100, samples // 3)

    normal = pd.DataFrame(
        {
            "signal_strength": rng.normal(-18, 2.4, per_class).round(2),
            "latency": rng.normal(2.8, 0.9, per_class).clip(0.3, 6).round(2),
            "packet_loss": rng.normal(0.35, 0.18, per_class).clip(0, 1.2).round(2),
            "traffic_load": rng.uniform(120, 780, per_class).round(2),
            "uptime": rng.uniform(1200, 24000, per_class).round(2),
            "temperature": rng.normal(33, 4, per_class).clip(18, 52).round(2),
            "label": np.zeros(per_class, dtype=int),
        }
    )

    warning = pd.DataFrame(
        {
            "signal_strength": rng.normal(-24, 2.8, per_class).round(2),
            "latency": rng.normal(7.5, 1.8, per_class).clip(3, 15).round(2),
            "packet_loss": rng.normal(2.1, 0.8, per_class).clip(0.6, 5.5).round(2),
            "traffic_load": rng.uniform(600, 1100, per_class).round(2),
            "uptime": rng.uniform(240, 4000, per_class).round(2),
            "temperature": rng.normal(49, 6, per_class).clip(28, 68).round(2),
            "label": np.ones(per_class, dtype=int),
        }
    )

    critical = pd.DataFrame(
        {
            "signal_strength": rng.normal(-31, 2.5, per_class).round(2),
            "latency": rng.normal(15, 3.2, per_class).clip(8, 30).round(2),
            "packet_loss": rng.normal(5.8, 1.5, per_class).clip(2.5, 12).round(2),
            "traffic_load": rng.uniform(900, 1400, per_class).round(2),
            "uptime": rng.uniform(1, 500, per_class).round(2),
            "temperature": rng.normal(67, 7, per_class).clip(45, 90).round(2),
            "label": np.full(per_class, 2, dtype=int),
        }
    )

    dataset = pd.concat([normal, warning, critical], ignore_index=True)
    return dataset.sample(frac=1, random_state=42).reset_index(drop=True)


def train_and_save_model(model_path: str) -> None:
    dataset = generate_training_data()
    features = dataset.drop(columns=["label"])
    target = dataset["label"]
    x_train, _, y_train, _ = train_test_split(features, target, test_size=0.2, random_state=42, stratify=target)
    model = RandomForestClassifier(
        n_estimators=180,
        max_depth=10,
        class_weight="balanced",
        random_state=42,
    )
    model.fit(x_train, y_train)
    output = Path(model_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, output)


if __name__ == "__main__":
    train_and_save_model("app/ai/model.joblib")
