# Aliens Attack Game - Netlify Deployment Guide

## 📋 Prerequisites
1. Netlify account (free tier works)
2. All game files ready
3. Firebase project configured

## 🚀 Quick Deploy
1. **Method A: Drag & Drop**
   - Zip all files (excluding node_modules)
   - Go to Netlify → Sites → Drag zip file

2. **Method B: Connect Git Repository**
   - Push code to GitHub/GitLab
   - Netlify → New site from Git
   - Connect repository

## ⚙️ Environment Variables (Set in Netlify Dashboard)
Required variables:
- `TON_API_KEY` = "af1dc37ce74748bf3db5e951b3775cf8873d1b98eed3ae43b3f299676a1453c2"
- `BOT_TOKEN` = "8535275737:AAGfrBE6fGOG7tZPGZcqf7mmGD3f7IBqov4"
- `ADMIN_ID` = "6575412146"
- `ADMIN_PASSWORD` = "Asdfghjkl@123" (CHANGE THIS!)

## 🔐 Admin Panel Access
- URL: `https://yoursite.netlify.app/admin-panel.html`
- Username: `admin`
- Password: `Asdfghjkl@123`

## 🌐 Custom Domain (Optional)
1. Netlify → Site settings → Domain management
2. Add custom domain
3. Configure DNS with your domain provider

## 📊 Monitoring
- Netlify Analytics (built-in)
- Function logs in Netlify dashboard
- Form submissions (if using forms)

## 🔧 Troubleshooting
- 404 errors: Check `_redirects` file
- CORS issues: Check `netlify.toml` headers
- Function errors: Check logs in Netlify dashboard