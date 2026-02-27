# Portfolio Website

A modern, multilingual portfolio website built with Next.js 14, featuring real-time GitHub integration to showcase your projects.

## Features

- **GitHub Integration**: Automatically fetch and display your GitHub repositories with real-time statistics
- **Internationalization**: Full support for English and Portuguese languages
- **Server-Side Rendering**: Fast page loads with Next.js App Router
- **Responsive Design**: Beautiful UI that works on all devices
- **Smart Caching**: Intelligent data caching to minimize API calls and improve performance

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- A GitHub account (for GitHub integration)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd resume-next
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (see [GitHub Integration Setup](#github-integration-setup) below)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## GitHub Integration Setup

The portfolio automatically fetches your GitHub repositories to display authentic project information. Follow these steps to configure the integration:

### 1. Obtain a GitHub Personal Access Token

A personal access token is required for authenticated API requests, which provides higher rate limits (5000 requests/hour vs 60 requests/hour for unauthenticated requests).

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give your token a descriptive name (e.g., "Portfolio Website")
4. Set an expiration date (recommended: 90 days or custom)
5. Select the following scopes:
   - `public_repo` - Access public repositories (required)
   - `repo` - Full control of private repositories (optional, only if you want to display private repos)
6. Click "Generate token"
7. **Important**: Copy the token immediately - you won't be able to see it again!

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# Required: Your GitHub username
GITHUB_USERNAME=your-github-username

# Recommended: Your GitHub personal access token
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Cache revalidation time in seconds (default: 3600 = 1 hour)
GITHUB_REVALIDATE=3600

# Optional: Filter specific repositories (comma-separated)
GITHUB_REPOSITORIES=repo1,repo2,repo3
```

### Environment Variables Explained

| Variable | Required | Description | Default | Example |
|----------|----------|-------------|---------|---------|
| `GITHUB_USERNAME` | Yes | Your GitHub username | - | `octocat` |
| `GITHUB_TOKEN` | Recommended | Personal access token for authentication | - | `ghp_abc123...` |
| `GITHUB_REVALIDATE` | No | Cache duration in seconds | `3600` | `3600` (1 hour) |
| `GITHUB_REPOSITORIES` | No | Comma-separated list of repos to display | All public repos | `project1,project2` |

### 3. Repository Filtering

By default, the portfolio displays all your public repositories. To show only specific repositories:

1. Set the `GITHUB_REPOSITORIES` environment variable with a comma-separated list:
```env
GITHUB_REPOSITORIES=my-awesome-project,portfolio-website,cool-app
```

2. Only repositories matching these exact names will be displayed

3. Leave empty or unset to display all public repositories

### 4. Understanding Caching and Revalidation

The portfolio uses Next.js's built-in caching system to optimize performance and reduce API calls:

- **Cache Duration**: Controlled by `GITHUB_REVALIDATE` (default: 1 hour)
- **How it works**:
  - First request fetches fresh data from GitHub API
  - Subsequent requests within the cache period use cached data
  - After cache expires, Next.js automatically refetches data in the background
  - Users always see fast responses, even during refetch

- **Recommended Settings**:
  - Development: `GITHUB_REVALIDATE=60` (1 minute) for frequent updates
  - Production: `GITHUB_REVALIDATE=3600` (1 hour) to minimize API calls
  - High-traffic sites: `GITHUB_REVALIDATE=7200` (2 hours) or more

- **Rate Limits**:
  - Without token: 60 requests/hour
  - With token: 5000 requests/hour
  - The caching system helps you stay well within these limits

### 5. Fallback Behavior

If GitHub integration is not configured or fails, the portfolio automatically falls back to mock data, ensuring your site always works.

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── actions/           # Server actions
│   └── [locale]/          # Internationalized routes
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── github/           # GitHub integration modules
│   └── i18n/             # Internationalization
├── messages/             # Translation files
│   ├── en.json          # English translations
│   └── pt.json          # Portuguese translations
├── public/              # Static assets
└── __tests__/           # Test files
    ├── unit/           # Unit tests
    └── properties/     # Property-based tests
```

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Testing**: Jest + fast-check (property-based testing)
- **API Integration**: GitHub REST API v3

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
