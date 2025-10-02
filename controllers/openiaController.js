const dotenv = require("dotenv");
dotenv.config();

// Option 1: Directly import the client from the package property (common for CJS modules)
const { GoogleGenAI } = require("@google/genai");

// Instantiate the client
const genai = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

// --- Helper function for text generation ---
const generateText = async (prompt, model, max_tokens, temperature) => {
  const response = await genai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      maxOutputTokens: max_tokens,
      temperature: temperature,
    }
  });
  return response.text;
};

// ====================================================================
//                                 CONTROLLERS
// ====================================================================

// ## SUMMARY CONTROLLER
exports.summaryController = async (req, res) => {
  try {
    const { text } = req.body;
    
    const summaryPrompt = `Summarize this text: \n\n${text}`;
    
    const resultText = await generateText(
      summaryPrompt,
      "gemini-2.5-flash",
      500, 
      0.5  
    );

    if (resultText) {
      return res.status(200).json(resultText.trim());
    } else {
      return res.status(500).json({ message: "Summary generation failed or returned no text." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred during summarization.",
      error: err.message,
    });
  }
};

// ## PARAGRAPH CONTROLLER
exports.paragraphController = async (req, res) => {
  try {
    const { text } = req.body;
    
    const paragraphPrompt = `Write a detailed paragraph about the following topic: \n\n${text}`;
    
    const resultText = await generateText(
      paragraphPrompt,
      "gemini-2.5-flash",
      500, 
      0.5  
    );

    if (resultText) {
      return res.status(200).json(resultText.trim());
    } else {
      return res.status(500).json({ message: "Paragraph generation failed or returned no text." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred during paragraph generation.",
      error: err.message,
    });
  }
};

// ## CHATBOT CONTROLLER (Yoda Style)
exports.chatbotController = async (req, res) => {
  try {
    const { text } = req.body;
    
    const chatPrompt = `Answer the following question in the style of Yoda from Star Wars.
      Me: 'What is your name?'
      Yoda: 'Yoda is my name.'
      Me: '${text}'
      Yoda:`; 
    
    const resultText = await generateText(
      chatPrompt,
      "gemini-2.5-flash",
      300, 
      0.7  
    );

    if (resultText) {
      const cleanedText = resultText.trim().replace(/^yoda: /i, '').trim(); 
      return res.status(200).json(cleanedText);
    } else {
      return res.status(500).json({ message: "Chatbot response failed or returned no text." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred during chatbot interaction.",
      error: err.message,
    });
  }
};

// ## JAVASCRIPT CONVERTER CONTROLLER
exports.jsconverterController = async (req, res) => {
  try {
    const { text } = req.body;
    
    const converterPrompt = `Convert the following instructions into complete, functional JavaScript code. Wrap the code in standard markdown formatting with 'javascript'. Do not add any extra explanation or text outside the code block.
      Instructions: \n\n${text}`;
    
    const resultText = await generateText(
      converterPrompt,
      "gemini-2.5-flash", 
      800, 
      0.25 
    );

    if (resultText) {
      return res.status(200).json(resultText.trim());
    } else {
      return res.status(500).json({ message: "Code conversion failed or returned no text." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred during code conversion.",
      error: err.message,
    });
  }
};

// ## SCI-FI IMAGE CONTROLLER (Non-functional Placeholder)
exports.scifiImageController = async (req, res) => {
  return res.status(501).json({
    message: "Image generation is not supported by the current Google GenAI SDK.",
    suggestion: "Use a dedicated Image API client (like Imagen) for image generation functionality."
  });
};