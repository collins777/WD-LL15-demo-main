// Wait for the page to load before setting up event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Get references to all the buttons and response area
  const iceBtn = document.getElementById("iceBtn");
  const factBtn = document.getElementById("factBtn");
  const jokeBtn = document.getElementById("jokeBtn");
  const weatherBtn = document.getElementById("weatherBtn");
  const responseDiv = document.getElementById("response");

  // Add click event listeners to each button
  iceBtn.addEventListener("click", () => generateResponse("icebreaker"));
  factBtn.addEventListener("click", () => generateResponse("fact"));
  jokeBtn.addEventListener("click", () => generateResponse("joke"));
  weatherBtn.addEventListener("click", () => generateResponse("weather"));

  // Function to generate responses using OpenAI API
  async function generateResponse(type) {
    // Show loading message while waiting for API response
    responseDiv.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    try {
      // Create the appropriate prompt based on button type
      let prompt = "";

      if (type === "icebreaker") {
        prompt =
          "Generate a fun, engaging icebreaker question that would help people at a party or meeting get to know each other better. Make it interesting and not too personal.";
      } else if (type === "fact") {
        prompt =
          "Share a surprising, weird, or fascinating fact that most people probably don't know. Make it interesting and fun to share in conversation.";
      } else if (type === "joke") {
        prompt =
          "Tell a clean, friendly joke that would be appropriate to share in any social setting. Make it clever and lighthearted.";
      } else if (type === "weather") {
        prompt =
          "Create a weather-related conversation starter that encourages people to share what the weather is like where they are. Make it engaging and fun.";
      }

      // Make API call to OpenAI
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`, // Using the API key from secrets.js
          },
          body: JSON.stringify({
            model: "gpt-4.1", // Using the gpt-4.1 model as specified
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 150, // Limit response length for conversation starters
            temperature: 0.8, // Make responses creative but not too random
          }),
        }
      );

      // Check if the API call was successful
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      // Parse the JSON response from OpenAI
      const data = await response.json();

      // Extract the generated text from the API response
      const generatedText = data.choices[0].message.content.trim();

      // Display the response on the page
      responseDiv.innerHTML = `<div class="ai-response">${generatedText}</div>`;
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error generating response:", error);
      responseDiv.innerHTML =
        '<div class="error">Sorry, something went wrong. Please try again!</div>';
    }
  }
});
