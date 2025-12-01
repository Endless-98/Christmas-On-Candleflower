# S3 Now Playing Setup Guide

This is a simplified setup using **S3 only** (no Lambda, no DynamoDB, no API Gateway needed!)

## Architecture

```
Python Script (your PC) → S3 Bucket → Website (direct fetch)
```

**Benefits:**
- ✅ Simpler (no Lambda functions)
- ✅ Cheaper (~$0.05/month vs $1-2/month)
- ✅ Faster (fewer hops)
- ✅ Smart polling (only checks when songs should change)

---

## Step 1: Create S3 Bucket (5 minutes)

### 1.1 Create Bucket

1. Go to **AWS Console** → **S3** → **Create bucket**
2. Settings:
   - **Bucket name**: `christmas-now-playing-2025` (must be globally unique)
   - **Region**: `us-east-1` (or your preferred region)
   - **Block Public Access**: **UNCHECK** "Block all public access"
     - ⚠️ Confirm the warning (we need public read access for the website)
   - Leave other settings as default
3. Click **Create bucket**

### 1.2 Enable CORS

1. Click your bucket → **Permissions** tab → **Cross-origin resource sharing (CORS)**
2. Paste this configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["Last-Modified"]
    }
]
```

3. Click **Save changes**

### 1.3 Set Bucket Policy (Public Read)

1. Stay in **Permissions** tab → **Bucket policy**
2. Paste this policy (replace `YOUR-BUCKET-NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/current.json"
        }
    ]
}
```

3. Click **Save changes**

### 1.4 Create Initial File

1. Go to **Objects** tab → **Upload**
2. Create a file named `current.json` with this content:

```json
{
    "songTitle": "No song playing",
    "artist": "Show not started",
    "songDuration": 180
}
```

3. Upload it
4. **Test the URL**: `https://YOUR-BUCKET-NAME.s3.us-east-1.amazonaws.com/current.json`
   - Should return the JSON in your browser

---

## Step 2: Configure AWS Credentials (Your PC)

### Option A: AWS CLI (Recommended)

1. Install AWS CLI: https://aws.amazon.com/cli/
2. Run: `aws configure`
3. Enter:
   - **Access Key ID**: (create in IAM)
   - **Secret Access Key**: (from IAM)
   - **Region**: `us-east-1`
   - **Output format**: `json`

### Option B: Environment Variables

```bash
export AWS_ACCESS_KEY_ID=your_key_here
export AWS_SECRET_ACCESS_KEY=your_secret_here
export AWS_DEFAULT_REGION=us-east-1
```

### 2.1 Create IAM User (for your PC)

1. Go to **IAM** → **Users** → **Create user**
2. Username: `christmas-light-updater`
3. **Attach policies directly** → **Create policy**
4. JSON policy (replace `YOUR-BUCKET-NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/current.json"
        }
    ]
}
```

5. Name it `ChristmasS3WriteOnly`
6. Attach to the user
7. **Create access key** → Save the credentials

---

## Step 3: Configure Python Script

1. Install dependencies:
   ```bash
   cd scripts
   pip install -r requirements.txt
   ```

2. Edit `update_now_playing.py`:
   ```python
   S3_BUCKET = "christmas-now-playing-2025"  # Your actual bucket name
   S3_KEY = "current.json"
   AWS_REGION = "us-east-1"  # Your region
   ```

3. Test it:
   ```bash
   python update_now_playing.py "Jingle Bells" "Michael Bublé" --duration 180
   ```

4. Verify: Check the S3 URL in your browser - should show updated data

---

## Step 4: Configure Website

1. Edit `site/.env`:
   ```env
   VITE_NOW_PLAYING_S3_URL=https://christmas-now-playing-2025.s3.us-east-1.amazonaws.com/current.json
   ```

2. Build and deploy:
   ```bash
   cd site
   npm install
   npm run build
   # Deploy via Amplify
   ```

---

## Step 5: Integration with Light Show

### Example: Call from sequence start

```python
import subprocess

# When song starts playing
subprocess.run([
    "python", 
    "/path/to/update_now_playing.py",
    "Carol of the Bells",
    "Lindsey Stirling",
    "--duration", "240"  # 4 minutes
])
```

### Example: From playlist file

```python
from update_now_playing import update_now_playing

# Your light show controller
def on_song_start(song_title, artist, duration_seconds):
    update_now_playing(song_title, artist, duration_seconds)
```

---

## How the Smart Polling Works

1. **Page loads** → Fetch S3 file
2. **Calculate** when song should end using:
   - `Last-Modified` header (when song started)
   - `songDuration` field (how long song is)
3. **Schedule** next check for when song ends + 1 second
4. **If data unchanged** → Exponential backoff retries
5. **Show hours (5-10PM MT)** → Only fetch during active hours

**Console logging shows everything:**
```
🎵 Song: "Jingle Bells" by Michael Bublé
   Duration: 180s, Elapsed: 45s, Remaining: 135s
⏰ Next check in 136s (when song should end + 1s grace)
```

---

## Testing the Complete System

### Test 1: Manual S3 Upload
```bash
python update_now_playing.py "Test Song" "Test Artist" --duration 30
```

### Test 2: Check S3 URL
```bash
curl https://YOUR-BUCKET.s3.us-east-1.amazonaws.com/current.json
```

### Test 3: Website
1. Open your website
2. Open browser console (F12)
3. Should see detailed logs of fetch timing
4. Upload a new song → should update when predicted

### Test 4: Retry Logic
1. Don't update S3 for a while
2. Watch console logs show exponential backoff
3. Update S3 → should recover immediately

---

## Troubleshooting

### "Access Denied" when uploading from Python
- Check IAM user permissions
- Verify bucket name is correct
- Try `aws s3 cp test.json s3://your-bucket/` to debug

### Website shows "Not connected"
- Check `VITE_NOW_PLAYING_S3_URL` in `.env`
- Verify S3 URL is publicly accessible (test in browser)
- Check browser console for CORS errors

### Song updates not appearing
- Check `Last-Modified` header: `curl -I https://...`
- Verify Python script uploads successfully
- Look for retry logs in browser console

### "Show not active" outside 5-10PM
- This is correct! Show only runs 5-10PM Mountain Time
- Test by temporarily changing `isShowTime()` logic

---

## Cost Estimate

**S3 Pricing:**
- Storage: $0.023/GB/month (file is <1KB)
- GET requests: $0.0004 per 1,000 requests
- PUT requests: $0.005 per 1,000 requests

**Example (100 visitors/day):**
- Storage: <$0.01/month
- GET requests: ~3,000/day × 30 = 90,000/month = $0.036
- PUT requests: ~500/month (song changes) = $0.003

**Total: ~$0.05/month** 🎉

---

## Security Notes

✅ **Secure:**
- S3 file is read-only for public
- Only your IAM user can write
- No credentials exposed in website code

⚠️ **Keep secret:**
- Your AWS access keys (on your PC only)
- Never commit to Git

---

## Next Steps

- [ ] Test with a few manual uploads
- [ ] Integrate with your light show scheduler
- [ ] Monitor console logs first few nights
- [ ] Consider adding song history tracking
