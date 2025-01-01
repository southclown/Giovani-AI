/**
 * Bridge module for C++ native addon implementation
 * Provides high-performance image processing capabilities
 */

const addon = require('../cpp/build/Release/giovani_ai_cpp.node');

class CppImageProcessor {
    private processor: any;

    constructor() {
        this.processor = new addon.ImageProcessor();
    }

    /**
     * Preprocesses image data using C++ implementation
     * @param imageData Raw image data as Uint8Array
     * @returns Processed image features
     */
    async preprocessImage(imageData: Uint8Array) {
        return this.processor.preprocessImage(imageData);
    }

    /**
     * Processes region prediction using C++ implementation
     * @param prediction Prediction value between 0 and 1
     * @returns Predicted region name
     */
    processRegionPrediction(prediction: number): string {
        return this.processor.processPrediction(prediction);
    }
}

export const cppProcessor = new CppImageProcessor();
