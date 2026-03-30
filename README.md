# FlowMe Sales Dashboard

A Next.js application for tracking daily sales and tasks.

## Setup

### Local Development
1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Supabase Configuration
This app requires Supabase for data storage. Get your credentials from your Supabase project:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Vercel Deployment

### Prerequisites
- GitHub repository connected to Vercel
- Supabase account with a project set up

### Steps
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import your GitHub repository
4. Add environment variables in **Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
5. Deploy the project

**Important**: Environment variables must be set BEFORE deployment for a successful build.

## Build

```bash
npm run build
```

## Start Production Server

```bash
npm start
```