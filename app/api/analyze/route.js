import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { results, stack, description } = body;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: "No results to analyze" },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;

    // Determine how many results to analyze based on auth status
    const resultsToAnalyze = isAuthenticated ? results : results.slice(0, 3);

    // Analyze each result with Claude
    const analyzedResults = await Promise.all(
      resultsToAnalyze.map((result) => analyzeWithClaude(result, stack, description))
    );

    // Sort by confidence score
    const sortedResults = analyzedResults.sort(
      (a, b) => b.confidenceScore - a.confidenceScore
    );

    // Limit final results: 10 for authenticated, 3 for anonymous
    const limitedResults = isAuthenticated 
      ? sortedResults.slice(0, 10) 
      : sortedResults.slice(0, 3);

    return NextResponse.json({
      results: limitedResults,
      isAuthenticated,
      totalAvailable: results.length,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze boilerplates" },
      { status: 500 }
    );
  }
}

async function analyzeWithClaude(boilerplate, stack, userNotes) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error("Anthropic API key not configured");
    return {
      ...boilerplate,
      techStack: [],
      summary: "Unable to analyze - API key missing",
      confidenceScore: 0,
    };
  }

  try {
    const prompt = buildClaudePrompt(boilerplate, stack, userNotes);
    
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );

    const analysis = parseClaudeResponse(response.data.content[0].text);

    return {
      ...boilerplate,
      techStack: analysis.techStack,
      summary: analysis.summary,
      confidenceScore: analysis.confidenceScore,
      source: boilerplate.source,
      sourceType: boilerplate.sourceType,
    };
  } catch (error) {
    console.error("Claude API error:", error.message);
    return {
      ...boilerplate,
      techStack: [],
      summary: boilerplate.description || "Unable to analyze",
      confidenceScore: 50,
    };
  }
}

function buildClaudePrompt(boilerplate, stack, userNotes) {
  const stackString = Object.entries(stack)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  return `Given the following project description: "${userNotes}"
And the desired stack: ${stackString}
Review the following repository URL: ${boilerplate.url}

Based on the repository name "${boilerplate.name}" and description "${boilerplate.description || 'No description available'}", please analyze:

Pay special attention to whether this boilerplate supports the requested database/data store if specified.

Return a JSON object with:
- techStack: array of detected technologies including any databases (max 8 items)
- suitability: score from 1-100 based on how well it matches the user's needs
- summary: 1-2 sentence summary of what the boilerplate includes

Format your response as valid JSON only, no additional text.`;
}

function parseClaudeResponse(text) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        techStack: parsed.techStack || [],
        confidenceScore: parsed.suitability || 50,
        summary: parsed.summary || "Boilerplate analysis completed",
      };
    }
  } catch (error) {
    console.error("Failed to parse Claude response:", error);
  }

  // Fallback parsing
  return {
    techStack: extractTechStack(text),
    confidenceScore: extractScore(text),
    summary: extractSummary(text),
  };
}

function extractTechStack(text) {
  const techKeywords = [
    "react", "vue", "angular", "svelte", "nextjs", "nuxt", "gatsby",
    "nodejs", "express", "fastify", "nestjs", "python", "django", "flask",
    "ruby", "rails", "php", "laravel", "java", "spring", "dotnet",
    "typescript", "javascript", "tailwind", "bootstrap", "sass",
    "postgresql", "mysql", "mongodb", "redis", "sqlite", "dynamodb", "fauna",
    "supabase", "firebase", "appwrite", "surrealdb", "planetscale", "neon", "cockroachdb",
    "prisma", "typeorm", "sequelize", "mongoose", "drizzle",
    "stripe", "auth0", "clerk", "lemonsqueezy", "paddle"
  ];

  const foundTech = [];
  const lowerText = text.toLowerCase();

  for (const tech of techKeywords) {
    if (lowerText.includes(tech)) {
      foundTech.push(tech.charAt(0).toUpperCase() + tech.slice(1));
    }
  }

  return foundTech.slice(0, 8);
}

function extractScore(text) {
  const scoreMatch = text.match(/(\d+)\s*(?:\/100|%|score)/i);
  if (scoreMatch) {
    return Math.min(100, Math.max(0, parseInt(scoreMatch[1])));
  }
  return 75; // Default score
}

function extractSummary(text) {
  // Try to find a summary section
  const summaryMatch = text.match(/summary[:\s]+(.*?)(?:\n|$)/i);
  if (summaryMatch) {
    return summaryMatch[1].trim();
  }
  
  // Return first sentence as fallback
  const firstSentence = text.match(/[A-Z][^.!?]*[.!?]/);
  if (firstSentence) {
    return firstSentence[0];
  }
  
  return "A boilerplate template for your project";
}