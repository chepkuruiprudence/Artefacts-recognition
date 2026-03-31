import onnx
import onnxruntime as ort
import numpy as np
import os
from PIL import Image

MODEL_PATH = "src/assets/model/kikuyu_culture_model.onnx"
TEST_IMAGE = "src/assets/images/bottle.jpg"
REPORT_FILE = "onnx_report.txt"

def log(msg, f):
    print(msg)
    f.write(msg + "\n")

with open(REPORT_FILE, "w") as report:
    log("=== ONNX MODEL CHECK REPORT ===\n", report)

    if not os.path.exists(MODEL_PATH):
        log(f"ERROR: {MODEL_PATH} not found", report)
        exit()

    model = onnx.load(MODEL_PATH)
    onnx.checker.check_model(model)
    log("Model loaded and validated\n", report)

    session = ort.InferenceSession(MODEL_PATH)

    input_meta = session.get_inputs()[0]
    input_name = input_meta.name
    input_shape = input_meta.shape # Expected: [None, 256, 256, 3]

    log("=== INPUT INFO ===", report)
    log(f"Name: {input_name}", report)
    log(f"Shape: {input_shape}", report)
    log(f"Type: {input_meta.type}\n", report)

    # -------------------------
    # Fix: Extract H and W correctly for HWC model
    # -------------------------
    h = input_shape[1] if isinstance(input_shape[1], int) else 256
    w = input_shape[2] if isinstance(input_shape[2], int) else 256

    # -------------------------
    # Dummy Prediction
    # -------------------------
    log("=== DUMMY PREDICTION ===", report)
    # Correct shape for TensorFlow/Keras ONNX: (Batch, H, W, C)
    dummy = np.random.rand(1, h, w, 3).astype(np.float32)
    output = session.run(None, {input_name: dummy})
    log(f"Output: {output}", report)
    log(f"Sum: {np.sum(output)}\n", report)

    # -------------------------
    # Test Image
    # -------------------------
    if os.path.exists(TEST_IMAGE):
        log("=== IMAGE TEST ===", report)

        img = Image.open(TEST_IMAGE).convert("RGB")
        img = img.resize((w, h))
        img_array = np.array(img).astype(np.float32)

        # For HWC model, we just add the batch dimension (1, 256, 256, 3)
        img_final = np.expand_dims(img_array, axis=0)

        # Run predictions
        out_raw = session.run(None, {input_name: img_final})
        # Important: Check if your model needs 0-1 normalization
        out_norm = session.run(None, {input_name: img_final / 255.0})

        log(f"Raw Prediction: {out_raw}", report)
        log(f"Normalized Prediction: {out_norm}", report)
        log(f"Raw Sum: {np.sum(out_raw)}", report)
        log(f"Norm Sum: {np.sum(out_norm)}\n", report)
    else:
        log(f"No test image found at {TEST_IMAGE}\n", report)

    log("=== END ===", report)