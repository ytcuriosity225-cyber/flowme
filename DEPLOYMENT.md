# 🚀 Deployment & Setup Guide

## Quick Start

### 1. Environment Setup

```bash
# Ensure .env.local has all required keys:
NEXT_PUBLIC_SUPABASE_URL=https://jrwqwbeegqvluaftepjn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
GEMINI_API_KEY=AIzaSyBM_pbK2fEpHdtoTylckIsfF1qfthFC004
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 2. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### 3. Testing New Features

#### Test AI Analyst
```bash
# 1. Go to /day
# 2. AI Analyst widget should load automatically
# 3. Should show critique and advice based on logs
```

#### Test Roadmap
```bash
# 1. Navigate to /roadmap from sidebar
# 2. Should show 3 books, 4 YouTube links, 3 dev tools
# 3. All external links should work
```

#### Test Night Owl Mode
```bash
# 1. Go to /settings
# 2. Toggle "Night Owl Mode" 
# 3. Should persist after page refresh
```

#### Test Updated Tasks
```bash
# 1. Go to /day/execute
# 2. Should see 4 high-impact, 3 medium, 3 low tasks
# 3. Complete a day and check saved score calculation
```

---

## Vercel Deployment

### Step 1: Push Code
```bash
git add .
git commit -m "feat: High-Performance Execution Workspace v2"
git push origin main
```

### Step 2: Vercel Configuration

1. Go to [vercel.com](https://vercel.com)
2. Import the repository
3. Set Environment Variables in Project Settings:
   ```
   GEMINI_API_KEY=AIzaSyBM_pbK2fEpHdtoTylckIsfF1qfthFC004
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
4. Click "Deploy"

### Step 3: Verify Deployment

```bash
# After deployment, test:
1. Lock screen works
2. Dashboard shows animations
3. AI Analyst loads (requires logs)
4. Roadmap page loads
5. Settings save properly
```

---

## Architecture Summary

### New Files Created
```
✨ src/app/api/analyze/route.ts      - AI analysis endpoint
✨ src/app/roadmap/page.tsx          - Learning roadmap page
✨ src/components/AIAnalyst.tsx       - AI widget component
✨ UPGRADE.md                         - Full feature documentation
✨ DEPLOYMENT.md                      - This file
```

### Files Modified
```
✏️  src/types/index.ts               - Updated task definitions
✏️  src/app/day/page.tsx             - New layout with AI analyst
✏️  src/app/settings/page.tsx        - Added Night Owl Mode toggle
✏️  src/components/Sidebar.tsx       - Added Roadmap navigation
✏️  .env.local                       - Added GEMINI_API_KEY
```

### Files Unchanged (Backward Compatible)
```
✅ src/app/dashboard/page.tsx        - Animations already in place
✅ src/context/AppContext.tsx        - nightOwlMode auto-handled
✅ src/lib/utils.ts                  - All functions compatible
✅ Database schema                   - No changes needed
```

---

## Performance Metrics

### Bundle Size Impact
- Core features: +~50KB
- API endpoint: Serverless (no size impact)
- GSAP: Already included (~45KB)
- Total increase: ~2-3%

### API Usage
- **AI Analyst**: 1 request per page load (if in /day)
- **Gemini API**: Free tier supports ~1,000 requests/month
- **Supabase**: Logs fetch cached locally

### Optimization Tips
```typescript
// AIAnalyst only renders in /day
// Gemini analysis uses last 7 days (lightweight)
// GSAP animations use requestAnimationFrame
// Images: None (icon-based UI)
```

---

## Troubleshooting

### Issue: Build fails with TypeScript errors
```bash
# Solution:
npm install
npm run build -- --no-lint
```

### Issue: AI Analyst shows "Ready to analyze..."
```
Possible causes:
1. No logs saved yet - Complete a day first
2. Gemini API key invalid - Check .env.local
3. Network issue - Check DevTools Network tab

Solution: Check /api/analyze response in DevTools
```

### Issue: Night Owl Mode not applying colors globally
```
Status: CSS implementation pending (v2.1)
Current: Preference stored in localStorage
Future: Global CSS variables will activate on toggle
```

### Issue: Animations not smooth
```
Solution:
1. Check Settings → GSAP Animations is enabled
2. Clear browser cache
3. Check GPU acceleration (DevTools → Rendering)
4. Test on latest browser version
```

---

## Monitoring & Maintenance

### Daily
- ✅ Check Supabase dashboard for new logs
- ✅ Monitor Gemini API quota (if needed)

### Weekly
- ✅ Review user feedback
- ✅ Check error logs in Vercel

### Monthly
- ✅ Analyze performance metrics
- ✅ Update Roadmap resources if needed

---

## Rollback Plan

If issues arise:

```bash
# Revert to last stable version
git revert HEAD

# Or checkout previous version
git checkout [last-commit-hash]

# Redeploy on Vercel
```

---

## Next Steps

### Immediate (v2.0 - Current)
- [x] Task system redesign
- [x] Roadmap page
- [x] AI Analyst integration
- [x] Night Owl Mode toggle
- [x] GSAP animations verification

### Short Term (v2.1)
- [ ] Global CSS theme variables
- [ ] Night Owl Mode color implementation
- [ ] Mobile responsiveness enhancements
- [ ] Offline support

### Medium Term (v2.5)
- [ ] Advanced analytics dashboard
- [ ] Weekly performance reports
- [ ] Custom task templates
- [ ] Team collaboration features

### Long Term (v3.0)
- [ ] Mobile app (React Native)
- [ ] Slack/Discord integration
- [ ] Advanced AI (GPT-4)
- [ ] Social sharing features

---

## Contact & Support

For issues or questions:
1. Check UPGRADE.md for comprehensive docs
2. Review error logs in Vercel dashboard
3. Check DevTools console for client-side errors
4. Verify .env.local configuration

---

**Deployment Status**: ✅ Ready for Production  
**Last Updated**: April 13, 2026  
**Version**: 2.0.0
