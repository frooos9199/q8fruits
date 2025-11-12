#!/bin/bash
# Quick Live Deployment Script for q8fruit.com

echo "🚀 Q8 Fruit API - Live Deployment"
echo "================================="

# Step 1: Upload files
echo "📤 Files to upload to q8fruit.com:"
echo "   - api-server-live.js"
echo "   - package.json"
echo ""

# Step 2: Commands to run on server
echo "💻 Commands to run on q8fruit.com server:"
echo ""
echo "# 1. Upload files and install"
echo "npm install"
echo ""
echo "# 2. Start the API server"
echo "node api-server-live.js"
echo ""
echo "# 3. For production (with PM2)"
echo "npm install -g pm2"
echo "pm2 start api-server-live.js --name 'q8fruit-api'"
echo "pm2 startup"
echo "pm2 save"
echo ""

# Step 3: Server configuration
echo "⚙️ Add to Nginx/Apache config:"
echo ""
echo "location /api {"
echo "    proxy_pass http://localhost:3001;"
echo "    proxy_set_header Host \$host;"
echo "    proxy_set_header X-Real-IP \$remote_addr;"
echo "}"
echo ""

# Step 4: Test
echo "🧪 Test after deployment:"
echo "curl https://q8fruit.com/api/health"
echo ""

echo "🎉 After deployment, your iOS app will show LIVE data!"
echo "📱 No more 'غير متصل بالخادم' - Real products will appear!"