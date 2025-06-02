# PowerShell Syntax Reminder

## ⚠️ IMPORTANT: PowerShell Command Syntax

### ❌ DO NOT USE:
```bash
cd "folder" && npm run dev
```
**ERROR:** `The token '&&' is not a valid statement separator in this version.`

### ✅ USE INSTEAD:
```powershell
# Option 1: Separate commands
cd "folder"
npm run dev

# Option 2: Use semicolon
cd "folder"; npm run dev

# Option 3: Use PowerShell operators
cd "folder" -and npm run dev
```

### Other PowerShell Differences:
- Use `dir` or `Get-ChildItem` instead of `ls`
- Use `dir -Hidden` or `Get-ChildItem -Force` to see hidden files
- Use `Test-Path filename` to check if file exists

## Remember: This is Windows PowerShell, not Bash! 