import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function simplifyLegalRights(query: string): Promise<{
  title: string;
  simplifiedDescription: string;
  nextSteps: string[];
  category: string;
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `You are a legal rights expert who translates complex legal concepts into simple, actionable language. 
          
          When given a query about legal rights, provide:
          1. A clear, concise title for the right
          2. A simplified explanation in plain English (2-3 sentences max)
          3. 3-5 specific, actionable next steps
          4. A category classification
          
          Focus on practical, actionable advice. Avoid legal jargon. Be encouraging and empowering.
          
          Respond in JSON format:
          {
            "title": "Clear title of the right",
            "simplifiedDescription": "Plain English explanation",
            "nextSteps": ["Step 1", "Step 2", "Step 3"],
            "category": "Category name"
          }`
        },
        {
          role: 'user',
          content: `Explain the legal rights related to: ${query}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // Fallback response
    return {
      title: 'Legal Rights Information',
      simplifiedDescription: 'We encountered an issue retrieving specific information about your rights. Please try rephrasing your query or contact a legal professional for personalized advice.',
      nextSteps: [
        'Try searching with different keywords',
        'Consult with a local legal aid organization',
        'Contact a lawyer for personalized advice'
      ],
      category: 'General'
    };
  }
}
