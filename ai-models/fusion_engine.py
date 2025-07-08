import torch
import numpy as np
from PIL import Image
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from transformers import CLIPProcessor, CLIPModel
import cv2
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class NFTFusionEngine:
    def __init__(self, model_path: str = "stabilityai/stable-diffusion-2-1"):
        """Initialize the NFT Fusion Engine with AI models."""
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
        
        # Initialize Stable Diffusion
        self.pipeline = StableDiffusionPipeline.from_pretrained(
            model_path,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
        )
        self.pipeline.scheduler = DPMSolverMultistepScheduler.from_config(
            self.pipeline.scheduler.config
        )
        self.pipeline = self.pipeline.to(self.device)
        
        # Initialize CLIP for attribute analysis
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
        
    def analyze_nft_attributes(self, image: Image.Image) -> Dict[str, Any]:
        """Analyze NFT image and extract visual attributes."""
        try:
            # Convert image to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Process image with CLIP
            inputs = self.clip_processor(images=image, return_tensors="pt").to(self.device)
            
            # Get image features
            image_features = self.clip_model.get_image_features(**inputs)
            
            # Analyze color palette
            color_palette = self._extract_color_palette(image)
            
            # Analyze composition
            composition = self._analyze_composition(image)
            
            # Analyze style
            style = self._analyze_style(image)
            
            return {
                'color_palette': color_palette,
                'composition': composition,
                'style': style,
                'features': image_features.cpu().numpy().tolist()
            }
        except Exception as e:
            logger.error(f"Error analyzing NFT attributes: {e}")
            return {}
    
    def _extract_color_palette(self, image: Image.Image) -> Dict[str, List[int]]:
        """Extract dominant colors from the image."""
        # Convert to numpy array
        img_array = np.array(image)
        
        # Reshape to 2D array of pixels
        pixels = img_array.reshape(-1, 3)
        
        # Use k-means to find dominant colors
        from sklearn.cluster import KMeans
        kmeans = KMeans(n_clusters=5, random_state=42)
        kmeans.fit(pixels)
        
        # Get dominant colors
        colors = kmeans.cluster_centers_.astype(int)
        labels = kmeans.labels_
        
        # Calculate color percentages
        unique, counts = np.unique(labels, return_counts=True)
        percentages = counts / len(labels)
        
        return {
            'colors': colors.tolist(),
            'percentages': percentages.tolist()
        }
    
    def _analyze_composition(self, image: Image.Image) -> Dict[str, Any]:
        """Analyze image composition and layout."""
        img_array = np.array(image)
        height, width = img_array.shape[:2]
        
        # Calculate aspect ratio
        aspect_ratio = width / height
        
        # Analyze brightness
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        brightness = np.mean(gray)
        
        # Analyze contrast
        contrast = np.std(gray)
        
        return {
            'aspect_ratio': aspect_ratio,
            'brightness': float(brightness),
            'contrast': float(contrast),
            'dimensions': {'width': width, 'height': height}
        }
    
    def _analyze_style(self, image: Image.Image) -> Dict[str, Any]:
        """Analyze artistic style of the image."""
        img_array = np.array(image)
        
        # Convert to different color spaces for analysis
        hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        
        # Analyze saturation
        saturation = np.mean(hsv[:, :, 1])
        
        # Analyze color temperature
        color_temp = self._estimate_color_temperature(lab)
        
        return {
            'saturation': float(saturation),
            'color_temperature': color_temp,
            'style_confidence': 0.85  # Placeholder
        }
    
    def _estimate_color_temperature(self, lab_image: np.ndarray) -> str:
        """Estimate color temperature (warm/cool/neutral)."""
        a_channel = lab_image[:, :, 1]  # Green-Red channel
        b_channel = lab_image[:, :, 2]  # Blue-Yellow channel
        
        a_mean = np.mean(a_channel)
        b_mean = np.mean(b_channel)
        
        if b_mean > 0:
            return "warm"
        elif b_mean < 0:
            return "cool"
        else:
            return "neutral"
    
    def generate_fusion_prompt(self, nft_attributes: List[Dict[str, Any]]) -> str:
        """Generate a fusion prompt based on NFT attributes."""
        if not nft_attributes:
            return "abstract digital art, vibrant colors, modern style"
        
        # Combine color palettes
        all_colors = []
        for attr in nft_attributes:
            if 'color_palette' in attr and 'colors' in attr['color_palette']:
                all_colors.extend(attr['color_palette']['colors'])
        
        # Analyze dominant styles
        styles = [attr.get('style', {}) for attr in nft_attributes]
        
        # Generate descriptive prompt
        prompt_parts = []
        
        # Add style descriptions
        if styles:
            style_descriptions = []
            for style in styles:
                if style.get('saturation', 0) > 100:
                    style_descriptions.append("vibrant")
                elif style.get('saturation', 0) < 50:
                    style_descriptions.append("muted")
                
                temp = style.get('color_temperature', 'neutral')
                if temp == 'warm':
                    style_descriptions.append("warm-toned")
                elif temp == 'cool':
                    style_descriptions.append("cool-toned")
            
            if style_descriptions:
                prompt_parts.append(f"{', '.join(set(style_descriptions))} digital art")
        
        # Add composition hints
        compositions = [attr.get('composition', {}) for attr in nft_attributes]
        if compositions:
            avg_contrast = np.mean([c.get('contrast', 0) for c in compositions])
            if avg_contrast > 50:
                prompt_parts.append("high contrast")
            elif avg_contrast < 20:
                prompt_parts.append("soft contrast")
        
        # Add artistic style
        prompt_parts.append("NFT fusion, unique, artistic, detailed")
        
        return ", ".join(prompt_parts)
    
    def fuse_nfts(self, nft_images: List[Image.Image], fusion_params: Dict[str, Any]) -> Image.Image:
        """Fuse multiple NFT images using AI."""
        try:
            # Analyze all NFT attributes
            nft_attributes = []
            for image in nft_images:
                attributes = self.analyze_nft_attributes(image)
                nft_attributes.append(attributes)
            
            # Generate fusion prompt
            prompt = self.generate_fusion_prompt(nft_attributes)
            
            # Add custom parameters
            if fusion_params.get('style'):
                prompt += f", {fusion_params['style']}"
            
            if fusion_params.get('mood'):
                prompt += f", {fusion_params['mood']}"
            
            # Generate negative prompt
            negative_prompt = "blurry, low quality, distorted, ugly, bad anatomy"
            
            # Generate the fusion image
            with torch.no_grad():
                result = self.pipeline(
                    prompt=prompt,
                    negative_prompt=negative_prompt,
                    num_inference_steps=fusion_params.get('steps', 50),
                    guidance_scale=fusion_params.get('guidance_scale', 7.5),
                    width=fusion_params.get('width', 512),
                    height=fusion_params.get('height', 512),
                    seed=fusion_params.get('seed', None)
                )
            
            return result.images[0]
            
        except Exception as e:
            logger.error(f"Error fusing NFTs: {e}")
            raise
    
    def enhance_fusion(self, image: Image.Image, enhancement_params: Dict[str, Any]) -> Image.Image:
        """Enhance the fusion result with post-processing."""
        try:
            # Convert to numpy array
            img_array = np.array(image)
            
            # Apply enhancements based on parameters
            if enhancement_params.get('sharpen', False):
                img_array = self._sharpen_image(img_array)
            
            if enhancement_params.get('adjust_contrast', False):
                img_array = self._adjust_contrast(img_array)
            
            if enhancement_params.get('color_correction', False):
                img_array = self._color_correct(img_array)
            
            return Image.fromarray(img_array)
            
        except Exception as e:
            logger.error(f"Error enhancing fusion: {e}")
            return image
    
    def _sharpen_image(self, img_array: np.ndarray) -> np.ndarray:
        """Sharpen the image using unsharp masking."""
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        return cv2.filter2D(img_array, -1, kernel)
    
    def _adjust_contrast(self, img_array: np.ndarray) -> np.ndarray:
        """Adjust image contrast."""
        lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        l = clahe.apply(l)
        
        # Merge channels
        lab = cv2.merge([l, a, b])
        return cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    
    def _color_correct(self, img_array: np.ndarray) -> np.ndarray:
        """Apply color correction."""
        # Simple white balance
        result = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
        avg_a = np.average(result[:, :, 1])
        avg_b = np.average(result[:, :, 2])
        result[:, :, 1] = result[:, :, 1] - ((avg_a - 128) * (result[:, :, 0] / 255.0) * 1.1)
        result[:, :, 2] = result[:, :, 2] - ((avg_b - 128) * (result[:, :, 0] / 255.0) * 1.1)
        return cv2.cvtColor(result, cv2.COLOR_LAB2RGB) 