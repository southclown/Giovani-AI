import { GiovaniAI } from './function';
import { sampleImages } from './utils/images';

// Example usage of GiovaniAI
async function main() {
    const giovaniAI = new GiovaniAI();
    
    for (const [region, imageInfo] of Object.entries(sampleImages)) {
        try {
            console.log(`\nTesting with image: ${imageInfo.description}`);
            const prediction = await giovaniAI.predictLocation(imageInfo.url);
            console.log(`Location prediction: ${prediction}`);
            console.log(`Expected region: ${imageInfo.expectedRegion}`);
            console.log(`Prediction ${prediction === imageInfo.expectedRegion ? 'correct! ✅' : 'incorrect ❌'}`);
        } catch (error) {
            console.error(`Error processing ${imageInfo.description}:`, error);
        }
    }
}

// Run the main function if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

// Export GiovaniAI for use in other files
export { GiovaniAI };