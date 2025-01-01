import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';
import { initRust, preprocessImageWithRust, processRegionPrediction } from './rust-bridge';

export class GiovaniAI {
    private model: tf.LayersModel | null = null;
    private readonly labels: string[] = [
        'North America', 'South America', 'Europe', 
        'Asia', 'Africa', 'Oceania'
    ];
    private rustInitialized: boolean = false;

    constructor() {
        this.initializeModel();
        this.initializeRust();
    }

    private async initializeRust() {
        if (!this.rustInitialized) {
            await initRust();
            this.rustInitialized = true;
        }
    }

    private async initializeModel() {
        // Create a simple model for image classification
        const model = tf.sequential();
        
        model.add(tf.layers.conv2d({
            inputShape: [224, 224, 3],
            filters: 32,
            kernelSize: 3,
            activation: 'relu',
        }));
        
        model.add(tf.layers.maxPooling2d({poolSize: 2}));
        model.add(tf.layers.conv2d({filters: 64, kernelSize: 3, activation: 'relu'}));
        model.add(tf.layers.maxPooling2d({poolSize: 2}));
        model.add(tf.layers.flatten());
        model.add(tf.layers.dense({units: 128, activation: 'relu'}));
        model.add(tf.layers.dense({units: this.labels.length, activation: 'softmax'}));

        model.compile({
            optimizer: 'adam',
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });

        this.model = model;
    }

    public async predictLocation(imageUrl: string): Promise<string> {
        try {
            // Download image
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });

            // Use Rust for image preprocessing
            const imageFeatures = await preprocessImageWithRust(new Uint8Array(response.data));
            
            // Convert preprocessed features to tensor
            const tensor = tf.tensor3d(imageFeatures.data, [
                imageFeatures.height,
                imageFeatures.width,
                imageFeatures.channels
            ]);
            
            // Add batch dimension
            const batched = tensor.expandDims(0);

            if (!this.model) {
                throw new Error("Model has not been initialized!");
            }

            // Make prediction
            const predictions = await this.model.predict(batched) as tf.Tensor;
            const predictionArray = await predictions.array() as number[][];
            
            // Use Rust for prediction processing
            const maxIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
            const region = processRegionPrediction(maxIndex / this.labels.length);
            
            // Cleanup
            tensor.dispose();
            batched.dispose();
            predictions.dispose();

            return region;
        } catch (error) {
            console.error('Error in prediction:', error);
            throw error;
        }
    }

    public async train(images: string[], labels: number[], epochs: number = 10) {
        // Training implementation will be added here
        console.log('Training started...');
        // TODO: Implement training logic
    }
}