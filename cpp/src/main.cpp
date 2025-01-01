#include <napi.h>
#include "image_processor.h"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    return ImageProcessor::Init(env, exports);
}

NODE_API_MODULE(giovani_ai_cpp, InitAll)
