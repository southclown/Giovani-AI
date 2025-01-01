{
  "targets": [
    {
      "target_name": "giovani_ai_cpp",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [ 
        "src/main.cpp",
        "src/image_processor.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "conditions": [
        ["OS==\"win\"", {
          "defines": [
            "_HAS_EXCEPTIONS=1"
          ],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 1
            }
          }
        }]
      ]
    }
  ]
}
