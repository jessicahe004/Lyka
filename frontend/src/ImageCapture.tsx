import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Text,
  Image as ChakraImage,
} from '@chakra-ui/react';
import * as bodySegmentation from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';

interface ImageCaptureProps {
  onImageCapture: (image: File, rating: number) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCapture }) => {
  const [capturing, setCapturing] = useState(false);
  const [rating, setRating] = useState(5);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [model, setModel] = useState<bodySegmentation.BodyPix | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Initialize BodyPix model
        const net = await bodySegmentation.load();
        setModel(net);
      } catch (error) {
        console.error('Error loading BodyPix model:', error);
      }
    };

    loadModel();
  }, []);

  const handleCaptureImage = async () => {
    if (!model) {
      console.error('Model is not loaded yet');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = createVideoElement(stream);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      setCapturing(true);

      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      });

      setTimeout(async () => {
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageBlob = await getCanvasBlob(canvas);
          if (imageBlob) {
            const imageUrl = URL.createObjectURL(imageBlob);
            const imageFile = new File([imageBlob], 'image.png', { type: 'image/png' });
            onImageCapture(imageFile, rating);
            setCapturedImage(imageUrl);
            await processImageWithBodyPix(imageUrl);
          }
          cleanUp(video, stream);
        }
      }, 3000); 

    } catch (error) {
      console.error('Error accessing camera:', error);
      setCapturing(false);
    }
  };

  const createVideoElement = (stream: MediaStream): HTMLVideoElement => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = 'auto';
    document.body.appendChild(video);
    return video;
  };

  const getCanvasBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const processImageWithBodyPix = async (imageUrl: string) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = async () => {
      if (canvasRef.current && model) {
        try {
          // Segment the image using BodyPix
          const segmentation = await model.segmentPersonParts(img);
    
          // Check if segmentation is defined
          if (segmentation) {
            // Convert the segmentation to a colored mask
            const coloredMask = await bodySegmentation.toColoredPartMask(
              segmentation,
              [0, 0, 0, 255] // Background color as an array [R, G, B, A]
            );
    
            // Draw the colored mask on the canvas
            bodySegmentation.drawMask(
              canvasRef.current,
              img,
              coloredMask,
              0.7, 
              0,  
              false 
            );
          } else {
            console.error('Segmentation result is undefined');
          }
        } catch (error) {
          console.error('Error during segmentation or processing:', error);
        }
      } else {
        console.error('Canvas or model is not available');
      }
    };
  };
  
  

  const cleanUp = (video: HTMLVideoElement, stream: MediaStream) => {
    stream.getTracks().forEach((track) => track.stop());
    document.body.removeChild(video);
    setCapturing(false);
  };

  return (
    <Box textAlign="center" mt={4}>
      <Text>Please point to the affected area and rate the pain.</Text>
      <Button onClick={handleCaptureImage} isDisabled={capturing} mb={4}>
        {capturing ? 'Capturing Image...' : 'Capture Image'}
      </Button>
      <Box mt={4}>
        <Text mb={2}>Rate from 1 to 10:</Text>
        <Slider
          defaultValue={5}
          min={1}
          max={10}
          step={1}
          value={rating}
          onChange={(value) => setRating(value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Text mt={2}>Rating: {rating}</Text>
      </Box>
      {capturedImage && (
        <Box mt={4}>
          <Text mb={2}>Captured Image:</Text>
          <ChakraImage src={capturedImage} alt="Captured" boxSize="300px" objectFit="cover" />
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </Box>
      )}
    </Box>
  );
};

export default ImageCapture;
