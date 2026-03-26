import os
import sys

# Check if required packages are installed
try:
    import tensorflow as tf
    import tensorflowjs as tfjs
except ImportError as e:
    print("❌ Missing required packages!")
    print("\nPlease install them with:")
    print("  pip install tensorflow tensorflowjs")
    sys.exit(1)

# Define paths
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)

# Input: H5 model
h5_model_path = os.path.join(
    backend_dir, 
    'src', 
    'assets', 
    'model', 
    'kikuyu culture model.h5'
)

# Output: TensorFlow.js model folder
tfjs_output_path = os.path.join(
    backend_dir,
    'src',
    'assets',
    'model',
    'tfjs_model'
)

print("🔄 Converting Keras H5 model to TensorFlow.js format...")
print(f"📂 Input:  {h5_model_path}")
print(f"📂 Output: {tfjs_output_path}")

# Check if H5 file exists
if not os.path.exists(h5_model_path):
    print(f"\n❌ Error: Model file not found at {h5_model_path}")
    sys.exit(1)

try:
    # Load the H5 model
    print("\n⏳ Loading H5 model...")
    model = tf.keras.models.load_model(h5_model_path)
    
    print(f"✅ Model loaded successfully!")
    print(f"   Input shape: {model.input_shape}")
    print(f"   Output shape: {model.output_shape}")
    
    # Create output directory if it doesn't exist
    os.makedirs(tfjs_output_path, exist_ok=True)
    
    # Convert to TensorFlow.js format
    print("\n⏳ Converting to TensorFlow.js format...")
    tfjs.converters.save_keras_model(model, tfjs_output_path)
    
    print("\n✅ Conversion completed successfully!")
    print(f"📁 TensorFlow.js model saved to: {tfjs_output_path}")
    print("\n📄 Generated files:")
    for file in os.listdir(tfjs_output_path):
        file_path = os.path.join(tfjs_output_path, file)
        file_size = os.path.getsize(file_path) / 1024  # KB
        print(f"   - {file} ({file_size:.2f} KB)")
    
    print("\n✅ You can now use this model in your backend!")
    
except Exception as e:
    print(f"\n❌ Conversion failed: {str(e)}")
    sys.exit(1)