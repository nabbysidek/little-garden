import torch
import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

labels = [
    "a blue flower drawing", 
    "not a flower", 
    "a random doodle", 
    "scribble", 
    "animal", 
    "random lines", 
    "abstract doodle"
]

mapping = ["flower", "not a flower", "doodle", "doodle", "not a flower", "doodle", "doodle"]

def classify_flower(image_path):
	image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

	text_tokens = clip.tokenize(labels).to(device)

	with torch.no_grad():
		logits_per_image, _ = model(image, text_tokens)
		probs = logits_per_image.softmax(dim=-1)

		best_idx = probs.argmax().item()

	return mapping[best_idx], probs[0][best_idx].item()
