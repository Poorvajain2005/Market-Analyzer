# **App Name**: MarketMind AI

## Core Features:

- Idea Input: A textarea where users can input their product idea (1-2 lines).
- AI-Powered Market Analysis: Analyzes the market, competitors, growth potential, and profit strategy based on the user's product idea, acting as a helpful tool for business strategy. LLM should decide what pieces of information need to be presented
- Structured Report Generation: Generates a structured report containing a verdict, growth score, risk level, one-line summary, key insights, detailed AI explanation, profit strategy, competitor landscape, and next recommended action based on the AI analysis.
- Data Visualization (Radar Chart): Presents a radar chart visualizing market opportunity based on the AI analysis, providing a snapshot of market demand, competitive pressure, differentiation potential, profitability potential, and execution complexity.
- User Authentication: Securely authenticates users using Firebase Authentication.
- Data Storage: Stores analysis reports in Firestore for persistence and retrieval.
- History Tracking: Stores past searches in firestore. Shows a list of past analyses for the user, sorted from most recent to least recent.

## Style Guidelines:

- Primary color: Deep Blue (#1A237E) to convey trust, intelligence, and authority, reflecting the data-driven insights provided by the application.
- Background color: Light Gray (#F5F5F5), offering a clean, neutral backdrop that ensures optimal readability and reduces visual fatigue.
- Accent color: Vivid Orange (#FF5722), strategically used for CTAs and highlights to draw user attention to key interactive elements, adding a sense of urgency and innovation.
- Headline font: 'Space Grotesk' sans-serif for headlines and short descriptions. The computerized, techy look enhances the AI feel.
- Body font: 'Inter' sans-serif for body text. Its neutral and modern look provides clear readability.
- Use a set of crisp, minimalist icons to represent various aspects of the report. Icons should align with the 'Inter' typeface.
- Left sidebar should have a fixed width of 260px and contain logo and dashboard links. Ensure adequate spacing.
- Loading state animation: a smooth, unobtrusive progress bar to provide continuous feedback during the analysis.