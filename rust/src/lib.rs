use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct ImageFeatures {
    width: u32,
    height: u32,
    channels: u8,
    data: Vec<f32>,
}

#[wasm_bindgen]
pub fn preprocess_image(image_data: &[u8]) -> Result<JsValue, JsValue> {
    // Convert raw image data to ImageFeatures
    let img = image::load_from_memory(image_data)
        .map_err(|e| format!("Failed to load image: {}", e))?;
    
    // Convert to RGB
    let rgb_img = img.to_rgb8();
    
    // Resize to 224x224 (same as TypeScript model)
    let resized = image::imageops::resize(
        &rgb_img,
        224,
        224,
        image::imageops::FilterType::Triangle
    );
    
    // Convert to floating point and normalize
    let mut normalized_data = Vec::with_capacity((224 * 224 * 3) as usize);
    for pixel in resized.pixels() {
        normalized_data.push(pixel[0] as f32 / 255.0);
        normalized_data.push(pixel[1] as f32 / 255.0);
        normalized_data.push(pixel[2] as f32 / 255.0);
    }
    
    let features = ImageFeatures {
        width: 224,
        height: 224,
        channels: 3,
        data: normalized_data,
    };
    
    // Serialize to JS
    Ok(JsValue::from_serde(&features)
        .map_err(|e| format!("Serialization error: {}", e))?)
}

#[wasm_bindgen]
pub fn process_prediction(prediction: f32) -> String {
    let regions = ["North America", "South America", "Europe", "Asia", "Africa", "Oceania"];
    let index = (prediction * (regions.len() as f32)) as usize;
    let index = index.min(regions.len() - 1);
    regions[index].to_string()
}
