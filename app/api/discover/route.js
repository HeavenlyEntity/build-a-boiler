import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { stack, description } = body;

    if (!stack?.frontend || !stack?.backend) {
      return NextResponse.json(
        { error: "Frontend and Backend selections are required" },
        { status: 400 }
      );
    }

    // Build search query from stack and description
    const searchQuery = buildSearchQuery(stack, description);

    // Execute API calls in parallel
    const [firecrawlResults, simStudioResults] = await Promise.all([
      fetchFromFirecrawl(searchQuery),
      fetchFromSimStudio(stack),
    ]);

    // Combine and dedupe results
    const combinedResults = deduplicateResults([
      ...firecrawlResults,
      ...simStudioResults,
    ]);

    // Limit to 15 results max for Claude analysis (we'll show 10 to users)
    const limitedResults = combinedResults.slice(0, 15);

    return NextResponse.json({
      results: limitedResults,
      total: combinedResults.length,
    });
  } catch (error) {
    console.error("Discovery error:", error);
    return NextResponse.json(
      { error: "Failed to discover boilerplates" },
      { status: 500 }
    );
  }
}

function buildSearchQuery(stack, description) {
  const parts = [];
  
  if (stack.frontend) parts.push(stack.frontend);
  if (stack.backend) parts.push(stack.backend);
  if (stack.database) parts.push(stack.database);
  if (stack.orm) parts.push(stack.orm);
  if (stack.auth) parts.push(stack.auth);
  if (stack.payment) parts.push(stack.payment);
  
  // Add repository-specific keywords
  parts.push("boilerplate", "starter", "template", "scaffold");
  
  // Add git platform keywords to find repositories
  parts.push("github.com", "gitlab.com", "bitbucket.org", "repository", "git");
  
  if (description) {
    parts.push(description.slice(0, 100));
  }
  
  return parts.join(" ");
}

async function fetchFromFirecrawl(query) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    console.warn("Firecrawl API key not configured");
    return [];
  }

  try {
    const response = await axios.post(
      "https://api.firecrawl.dev/v1/search",
      {
        query,
        limit: 50, // Increased limit since we'll filter many out
        scrapeOptions: {
          formats: ["markdown", "links"],
          onlyMainContent: true,
          includeTags: ["a"], // Include anchor tags to find repo links
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Filter and process results to only include repository links
    const results = response.data.data || [];
    return results
      .filter((item) => isRepositoryUrl(item.url))
      .map((item) => {
        const repoInfo = extractRepositoryInfo(item.url);
        return {
          name: repoInfo.name || item.metadata?.title || extractNameFromUrl(item.url),
          url: repoInfo.url,
          description: item.metadata?.description || "",
          source: repoInfo.platform,
          sourceType: repoInfo.type,
          raw: item,
        };
      });
  } catch (error) {
    console.error("Firecrawl API error:", error.message);
    return [];
  }
}

async function fetchFromSimStudio(stack) {
  const apiKey = process.env.SIM_STUDIO_API_KEY;
  
  if (!apiKey) {
    console.warn("Sim Studio API key not configured");
    return [];
  }

  try {
    const filters = {
      languages: [],
      frameworks: [],
    };

    // Map stack to Sim Studio filters
    if (stack.frontend) {
      filters.frameworks.push(stack.frontend);
    }
    if (stack.backend) {
      filters.languages.push(stack.backend);
    }

    const response = await axios.post(
      "https://www.simstudio.ai/api/webhooks/trigger/d9c4b4eb-625e-4b04-b8ad-bc5556366363",
      {
        query: "boilerplate",
        filters,
        limit: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.repositories?.map((repo) => ({
      name: repo.name || repo.full_name,
      url: repo.html_url,
      description: repo.description || "",
      stars: repo.stargazers_count,
      source: "github.com",
      sourceType: "github",
      raw: repo,
    })) || [];
  } catch (error) {
    console.error("Sim Studio API error:", error.message);
    return [];
  }
}

function deduplicateResults(results) {
  const seen = new Set();
  return results.filter((result) => {
    // Normalize URL for comparison
    const normalizedUrl = result.url
      .toLowerCase()
      .replace(/\/$/, "")
      .replace(/^https?:\/\//, "");
    
    if (seen.has(normalizedUrl)) {
      return false;
    }
    seen.add(normalizedUrl);
    return true;
  });
}

function extractNameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    return pathParts[pathParts.length - 1] || urlObj.hostname;
  } catch {
    return url;
  }
}

function extractDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'web';
  }
}

// Repository URL patterns for different platforms
const REPO_PATTERNS = {
  github: {
    pattern: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/,
    platform: 'github.com',
    type: 'github',
    extractName: (url) => {
      const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
      return match ? match[2].replace(/\.git$/, '') : null;
    }
  },
  gitlab: {
    pattern: /^https?:\/\/(www\.)?gitlab\.com\/[\w-]+\/[\w.-]+\/?$/,
    platform: 'gitlab.com',
    type: 'gitlab',
    extractName: (url) => {
      const match = url.match(/gitlab\.com\/([\w-]+)\/([\w.-]+)/);
      return match ? match[2].replace(/\.git$/, '') : null;
    }
  },
  bitbucket: {
    pattern: /^https?:\/\/(www\.)?bitbucket\.org\/[\w-]+\/[\w.-]+\/?$/,
    platform: 'bitbucket.org',
    type: 'bitbucket',
    extractName: (url) => {
      const match = url.match(/bitbucket\.org\/([\w-]+)\/([\w.-]+)/);
      return match ? match[2].replace(/\.git$/, '') : null;
    }
  },
  gitea: {
    pattern: /^https?:\/\/[\w.-]+\/([\w-]+)\/([\w.-]+)(\.git)?\/?$/,
    platform: 'gitea',
    type: 'gitea',
    extractName: (url) => {
      const match = url.match(/\/\/([\w.-]+)\/([\w-]+)\/([\w.-]+)/);
      return match ? match[3].replace(/\.git$/, '') : null;
    }
  },
  codeberg: {
    pattern: /^https?:\/\/(www\.)?codeberg\.org\/[\w-]+\/[\w.-]+\/?$/,
    platform: 'codeberg.org',
    type: 'codeberg',
    extractName: (url) => {
      const match = url.match(/codeberg\.org\/([\w-]+)\/([\w.-]+)/);
      return match ? match[2].replace(/\.git$/, '') : null;
    }
  },
  sourceforge: {
    pattern: /^https?:\/\/(www\.)?sourceforge\.net\/projects\/[\w-]+\/?$/,
    platform: 'sourceforge.net',
    type: 'sourceforge',
    extractName: (url) => {
      const match = url.match(/sourceforge\.net\/projects\/([\w-]+)/);
      return match ? match[1] : null;
    }
  }
};

function isRepositoryUrl(url) {
  if (!url) return false;
  
  // Clean the URL
  const cleanUrl = url.trim().replace(/\/$/, '');
  
  // Check against all known repository patterns
  for (const [, config] of Object.entries(REPO_PATTERNS)) {
    if (config.pattern.test(cleanUrl)) {
      return true;
    }
  }
  
  // Additional checks for generic git URLs
  if (cleanUrl.includes('/git/') || cleanUrl.endsWith('.git')) {
    return true;
  }
  
  return false;
}

function extractRepositoryInfo(url) {
  if (!url) return { url, name: null, platform: 'unknown', type: 'web' };
  
  const cleanUrl = url.trim().replace(/\/$/, '');
  
  // Check against known patterns
  for (const [, config] of Object.entries(REPO_PATTERNS)) {
    if (config.pattern.test(cleanUrl)) {
      return {
        url: cleanUrl,
        name: config.extractName(cleanUrl),
        platform: config.platform,
        type: config.type
      };
    }
  }
  
  // Fallback for unrecognized git repositories
  if (cleanUrl.includes('/git/') || cleanUrl.endsWith('.git')) {
    try {
      const urlObj = new URL(cleanUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return {
        url: cleanUrl,
        name: pathParts[pathParts.length - 1]?.replace(/\.git$/, ''),
        platform: urlObj.hostname,
        type: 'git'
      };
    } catch {
      // Fallback
    }
  }
  
  return {
    url: cleanUrl,
    name: extractNameFromUrl(cleanUrl),
    platform: extractDomainFromUrl(cleanUrl),
    type: 'web'
  };
}