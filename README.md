# little-garden

little-garden is a small experimental drawing app built with React and TypeScript where users can sketch directly on a canvas. The drawing is then analyzed using OpenAI CLIP to determine whether the sketch resembles a flower. If the prediction confidence passes a threshold, the drawing becomes part of the garden.

This project was built as a way to explore machine learning + frontend interaction, combining a simple creative UI with image classification.

## Technologies

- React.js
- TypeScript
- TailwindCSS
- Flask
- Python
- OpenAI CLIP

## Features

- Draw freely on a canvas
- Submit the drawing for classification
- Image is processed with CLIP
- If the prediction matches *flower* above a confidence threshold, the drawing is added to the garden

## The Process

This project was created to explore how a machine learning model could interact with a simple drawing interface.

- I started by experimenting with the CLIP repository to understand how image–text similarity works.
- I set up a backend using Flask and Python to run the model locally and handle image processing.
- On the frontend, I built a canvas drawing interface using React and TypeScript.
- When a user submits a drawing, the canvas image is sent to the Flask API, where CLIP compares it against prompts such as “a flower”.
- The model returns confidence scores, which determine whether the drawing is accepted and added to the garden.


## Lessons Learned

- Integrating machine learning models with a web interface
- Handling canvas image processing in React
- Understanding how CLIP compares images with text prompts

## Future Improvements


## Running the Project Locally
This project requires running both the Flask backend and the React frontend.

1. Clone the repository to your local machine.

```
git clone <repo-url>
cd little-garden
```

2. Install the required packages for the React app:

```
npm install
```

3. Navigate to the `src` folder and install Python dependencies:

```
pip install -r requirements.txt
```

4. Run the Flask server through cmd:

```
python app.py
```

5. Start the React frontend:

```
npm run dev
```

6. Open http://localhost:5173 (or the address shown in your console) in your web browser to view the app.


![little garden placeholder](/src/assets/little-garden-placeholder.gif)
