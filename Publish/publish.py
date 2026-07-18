# 1. Initialize everything
python automate.py init

# 2. Make changes to your code
# ... edit files ...

# 3. Auto-commit with backup
python automate.py commit "Added responsive design"

# 4. Create backup before deployment
python automate.py backup

# 5. Create deployment package
python automate.py deploy

# 6. Push to GitHub
python automate.py push origin main

# 7. Optional: Start file watcher for auto-commits
python automate.py watch 300