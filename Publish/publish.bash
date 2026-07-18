# ============================================================
#  INITIAL SETUP
# ============================================================

# Initialize Git repository in your project folder
git init

# Configure your identity (required before first commit)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Check status of your files
git status

# ============================================================
#  ADDING FILES TO STAGING
# ============================================================

# Add all files in current directory
git add .

# Add specific files
git add index.html
git add ../Configuration/style.css
git add ../Interaction/script.js

# Add only certain file types
git add *.html
git add *.css
git add *.js

# Check what's staged
git status

# ============================================================
#  COMMITTING CHANGES
# ============================================================

# Commit with a descriptive message
git commit -m "Initial commit: Advanced AI-Powered Calculator"

# Commit with detailed message (opens editor)
git commit

# Commit all tracked files (skip staging)
git commit -a -m "Update: Fixed font loading issues"

# ============================================================
#  VIEWING HISTORY
# ============================================================

# View commit history
git log

# View history with one line per commit
git log --oneline

# View history with graph
git log --graph --oneline --all

# View last commit details
git show

# ============================================================
#  BRANCHING
# ============================================================

# Create a new branch
git branch feature/responsive-design

# Switch to a branch
git checkout feature/responsive-design

# Create and switch to new branch
git checkout -b feature/security-fixes

# List all branches
git branch

# See which branch you're on
git branch --show-current

# ============================================================
#  REMOTE REPOSITORY (GitHub/GitLab)
# ============================================================

# Add remote repository
git remote add origin https://github.com/yourusername/calculator.git

# View remotes
git remote -v

# Push to remote
git push -u origin main

# Push current branch to remote
git push

# Pull latest changes from remote
git pull

# ============================================================
#  MERGING
# ============================================================

# Switch to main branch
git checkout main

# Merge feature branch into main
git merge feature/responsive-design

# Delete branch after merge
git branch -d feature/responsive-design

# ============================================================
#  UNDOING CHANGES
# ============================================================

# Unstage a file (remove from staging)
git reset HEAD filename

# Discard changes to a file (restore to last commit)
git checkout -- filename

# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1

# ============================================================
#  STASHING (save uncommitted changes temporarily)
# ============================================================

# Save current changes
git stash

# Save with a message
git stash save "WIP: Calculator UI updates"

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply and remove stash
git stash pop

# Remove stash
git stash drop

# ============================================================
#  .gitignore (create this file)
# ============================================================

cat > .gitignore << EOF
# Node modules
node_modules/
npm-debug.log

# Environment files
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Build files
dist/
build/
*.min.js
*.min.css

# Logs
logs/
*.log

# Temporary files
*.tmp
*.temp
EOF

# ============================================================
#  COMPLETE WORKFLOW EXAMPLE
# ============================================================

# 1. Initialize repository
git init

# 2. Create .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo ".DS_Store" >> .gitignore

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: Advanced AI-Powered Calculator"

# 5. Create feature branch
git checkout -b feature/font-fixes

# 6. Make changes and commit
git add .
git commit -m "Fix: Corrected font path for all devices"

# 7. Switch back to main
git checkout main

# 8. Merge feature
git merge feature/font-fixes

# 9. Push to GitHub
git remote add origin https://github.com/yourusername/calculator.git
git push -u origin main

# ============================================================
#  USEFUL SHORTCUTS
# ============================================================

# Show all changes in current directory
git diff

# Show changes in specific file
git diff filename

# Show changed files
git diff --name-only

# View last 5 commits
git log -5 --oneline

# Check who changed what in a file
git blame filename

# ============================================================
#  BRANCH MANAGEMENT
# ============================================================

# List branches with last commit
git branch -v

# Delete remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-branch-name

# ============================================================
#  TAGGING (for releases)
# ============================================================

# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"

# List tags
git tag

# Push tags to remote
git push --tags

# ============================================================
#  CLONING AN EXISTING REPOSITORY
# ============================================================

# Clone a repository
git clone https://github.com/username/repository.git

# Clone into specific folder
git clone https://github.com/username/repository.git my-project

# Clone a specific branch
git clone -b branch-name https://github.com/username/repository.git

# ============================================================
#  RESCUE COMMANDS (when things go wrong)
# ============================================================

# Recover accidentally deleted file from last commit
git checkout HEAD -- filename

# Recover a file from a specific commit
git checkout commit-hash -- filename

# Undo a merge
git merge --abort

# Undo a rebase
git rebase --abort

# Reset to a specific commit (keep changes)
git reset --soft commit-hash

# Reset to a specific commit (discard changes)
git reset --hard commit-hash

# Restore deleted branch (if you know commit hash)
git branch branch-name commit-hash

# ============================================================
#  RECOMMENDED .gitignore FOR WEB PROJECTS
# ============================================================

cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
.project
.classpath
.settings/
*.sublime-workspace
*.sublime-project

# Local configuration
config.local.js
config.local.css

# Build outputs
dist/
build/
*.min.js
*.min.css

# Test outputs
test-results/
coverage/

# Debug files
*.log
*.tmp
*.temp

# Environment specific
*.local
*.development
*.production

# Lock files (choose one)
package-lock.json
yarn.lock
pnpm-lock.yaml

# Server specific
server.js
app.js
index.js

# Font files (if they are large)
*.ttf
*.otf
*.woff
*.woff2
EOF