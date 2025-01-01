import init, { preprocess_image, process_prediction } from '../rust/pkg/giovani_ai_rust';

export async function initRust() {
    await init();
}

export async function preprocessImageWithRust(imageData: Uint8Array) {
    return await preprocess_image(imageData);
}

export function processRegionPrediction(prediction: number): string {
    return process_prediction(prediction);
}
