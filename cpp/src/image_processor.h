#pragma once
#include <napi.h>
#include <vector>
#include <string>

class ImageProcessor : public Napi::ObjectWrap<ImageProcessor> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    ImageProcessor(const Napi::CallbackInfo& info);

private:
    static Napi::FunctionReference constructor;
    
    // Methods to be exposed to JavaScript
    Napi::Value PreprocessImage(const Napi::CallbackInfo& info);
    Napi::Value ProcessPrediction(const Napi::CallbackInfo& info);
    
    // Helper methods
    std::vector<float> NormalizeImageData(const std::vector<uint8_t>& imageData);
    std::string GetRegionFromPrediction(float prediction);

    // Internal state if needed
    std::vector<std::string> regions;
};
