#include "image_processor.h"
#include <algorithm>

Napi::FunctionReference ImageProcessor::constructor;

// Initialize the class and export it to Node.js
Napi::Object ImageProcessor::Init(Napi::Env env, Napi::Object exports) {
    Napi::HandleScope scope(env);

    // Define the class with its methods
    Napi::Function func = DefineClass(env, "ImageProcessor", {
        InstanceMethod("preprocessImage", &ImageProcessor::PreprocessImage),
        InstanceMethod("processPrediction", &ImageProcessor::ProcessPrediction),
    });

    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();

    exports.Set("ImageProcessor", func);
    return exports;
}

ImageProcessor::ImageProcessor(const Napi::CallbackInfo& info) 
    : Napi::ObjectWrap<ImageProcessor>(info) {
    Napi::Env env = info.Env();
    
    // Initialize the list of world regions
    regions = {"North America", "South America", "Europe", "Asia", "Africa", "Oceania"};
}

// Process image data and return normalized features
Napi::Value ImageProcessor::PreprocessImage(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // Validate input parameters
    if (info.Length() < 1 || !info[0].IsTypedArray()) {
        Napi::TypeError::New(env, "Uint8Array expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    // Get input image data
    Napi::TypedArray array = info[0].As<Napi::TypedArray>();
    Napi::Uint8Array uint8Array = array.As<Napi::Uint8Array>();
    
    // Convert to vector for processing
    std::vector<uint8_t> imageData(uint8Array.Data(), uint8Array.Data() + uint8Array.ByteLength());
    
    // Normalize the image data
    std::vector<float> normalizedData = NormalizeImageData(imageData);
    
    // Prepare return object
    Napi::Object result = Napi::Object::New(env);
    
    // Convert normalized data to Float32Array for JavaScript
    Napi::Float32Array normalizedArray = Napi::Float32Array::New(env, normalizedData.size());
    for (size_t i = 0; i < normalizedData.size(); i++) {
        normalizedArray[i] = normalizedData[i];
    }
    
    result.Set("data", normalizedArray);
    return result;
}

// Process prediction value and return corresponding region
Napi::Value ImageProcessor::ProcessPrediction(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // Validate input parameters
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    float prediction = info[0].As<Napi::Number>().FloatValue();
    std::string region = GetRegionFromPrediction(prediction);
    
    return Napi::String::New(env, region);
}

// Helper function to normalize image data to range [0, 1]
std::vector<float> ImageProcessor::NormalizeImageData(const std::vector<uint8_t>& imageData) {
    std::vector<float> normalized(imageData.size());
    
    for (size_t i = 0; i < imageData.size(); i++) {
        normalized[i] = static_cast<float>(imageData[i]) / 255.0f;
    }
    
    return normalized;
}

// Helper function to map prediction value to region name
std::string ImageProcessor::GetRegionFromPrediction(float prediction) {
    size_t index = static_cast<size_t>(prediction * regions.size());
    index = std::min(index, regions.size() - 1);
    return regions[index];
}
