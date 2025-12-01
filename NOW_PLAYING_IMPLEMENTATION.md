# Now Playing Feature - Implementation Summary

## What We Built

A real-time "Now Playing" feature for your Christmas light show website that:
- ✅ Updates from your local Python script when songs change
- ✅ Uses **smart polling** - only checks S3 when songs should end
- ✅ Shows "Show starts at 5PM" / "Show ended at 10PM" outside 5-10PM MT
- ✅ Exponential backoff retry logic with detailed console logging
- ✅ Simple S3-only architecture (no Lambda/DynamoDB needed)

## Architecture

```
┌─────────────────────────┐
│ Light Show Controller   │
│ (Your PC)               │
└────────┬────────────────┘
         │ Python script uploads
         │ when song starts
         ▼
┌─────────────────────────┐
│ S3 Bucket               │
│ current.json            │
│ (public read only)      │
└────────┬────────────────┘
         │ Direct HTTPS fetch
         │ with Last-Modified header
         ▼
┌─────────────────────────┐
│ Website Visitors        │
│ (Smart polling logic)   │
└─────────────────────────┘
```

## How Smart Polling Works

1. **Page loads** → Fetch `current.json` from S3
2. **Calculate song end time:**
   ```
   Last-Modified: 7:00:00 PM (from S3 header)
   songDuration: 180 seconds (from JSON)
   Current time: 7:01:30 PM
   
   Elapsed: 90 seconds
   Remaining: 180 - 90 = 90 seconds
   Next check: in 91 seconds (90 + 1s grace)
   ```
3. **Wait** until song should end
4. **Fetch again** - if data unchanged, retry with exponential backoff
5. **Repeat** for each song throughout the show

## Files Created/Modified

### Frontend (React)
- `site/src/App.jsx` - Smart polling logic with show hours check
- `site/.env.example` - S3 URL configuration

### Backend (Python)
- `scripts/update_now_playing.py` - S3 upload script
- `scripts/requirements.txt` - Updated to use `boto3`

### Documentation
- `S3_SETUP.md` - Complete AWS S3 setup guide
- `scripts/README_S3.md` - Python script usage guide
- `NOW_PLAYING_IMPLEMENTATION.md` - This file

### Original Files (kept for reference)
- `lambda/` - Lambda/DynamoDB approach (alternative method)
- `lambda/AWS_SETUP.md` - Original AWS setup guide

## Key Features

### 1. Smart Polling
```javascript
// Only fetches when songs should actually change
const secondsRemaining = songDuration - secondsSinceStart;
const nextCheckIn = secondsRemaining + 1; // 1s grace period
setTimeout(() => fetchNowPlaying(true), nextCheckIn * 1000);
```

### 2. Exponential Backoff
```javascript
// If data unchanged: 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s, 512s, then 15min
const waitTime = Math.pow(2, retryCount) * 1000;
```

### 3. Show Hours Check
```javascript
// Only active 5-10PM Mountain Time, December only
if (hour < 17) return "Show starts at 5:00 PM MT";
if (hour >= 22) return "Show ended at 10:00 PM MT";
```

### 4. Detailed Console Logging
```javascript
console.log(`🎵 Song: "${data.songTitle}" by ${data.artist}`);
console.log(`   Duration: ${songDuration}s, Elapsed: ${secondsSinceStart}s, Remaining: ${secondsRemaining}s`);
console.log(`⏰ Next check in ${nextCheckIn}s (when song should end + 1s grace)`);
```

## Setup Checklist

- [ ] **Create S3 bucket** with public read access
- [ ] **Enable CORS** on bucket to expose `Last-Modified` header
- [ ] **Create IAM user** with `s3:PutObject` permission
- [ ] **Configure AWS credentials** on your PC (`aws configure`)
- [ ] **Update `update_now_playing.py`** with bucket name
- [ ] **Test Python script**: `python update_now_playing.py "Test" "Artist" --duration 30`
- [ ] **Update `site/.env`** with S3 URL
- [ ] **Build and deploy** website
- [ ] **Test end-to-end** with browser console open

## Usage Example

```bash
# When your light show starts a song:
python update_now_playing.py "Carol of the Bells" "Lindsey Stirling" --duration 240
```

JSON uploaded to S3:
```json
{
    "songTitle": "Carol of the Bells",
    "artist": "Lindsey Stirling",
    "songDuration": 240,
    "timestamp": "2025-12-01T19:00:00Z"
}
```

Website calculates:
- If visitor arrives at 19:02:00 (2 min after upload)
- Song has 2 minutes remaining (240 - 120 = 120s)
- Next check in 121 seconds (120 + 1s grace)

## Cost Estimate

### S3 Pricing
- **Storage**: <$0.01/month (tiny JSON file)
- **PUT requests**: ~500/month × $0.005/1000 = **$0.003**
- **GET requests**: ~3,000/day × 30 days = 90,000/month × $0.0004/1000 = **$0.036**

**Total: ~$0.05/month** 🎉

Compare to Lambda+DynamoDB approach: ~$1-2/month

## Testing Tips

1. **Browser Console**: Open F12 to see detailed logs
2. **Test retries**: Don't update S3 - watch exponential backoff
3. **Test recovery**: Update S3 after retries - should recover immediately  
4. **Test show hours**: Change time check to test "show ended" message
5. **Test song timing**: Use short duration (30s) for quick testing

## Troubleshooting

### Website shows "Not connected"
- Check `VITE_NOW_PLAYING_S3_URL` in `.env`
- Test S3 URL in browser - should return JSON

### Python script fails
- Run `aws configure` to set up credentials
- Check bucket name in script matches actual bucket
- Verify IAM permissions include `s3:PutObject`

### Updates not appearing
- Check browser console for errors
- Verify `Last-Modified` header: `curl -I https://...`
- Look for retry warnings in console

### CORS errors
- Ensure CORS config includes `ExposeHeaders: ["Last-Modified"]`
- Check bucket policy allows public `GetObject`

## Next Steps

1. **Integrate with your light show software**
   - Call Python script when songs start
   - Pass song duration as parameter
   
2. **Monitor first few shows**
   - Watch browser console logs
   - Verify timing is accurate
   - Check for excessive retries

3. **Optional enhancements**
   - Add song progress bar
   - Store song history
   - Add "Next up" preview

## Benefits of This Approach

✅ **Simple** - S3 only, no Lambda/DynamoDB/API Gateway  
✅ **Cheap** - ~$0.05/month vs $1-2/month  
✅ **Efficient** - Smart polling only when needed  
✅ **Reliable** - Exponential backoff handles edge cases  
✅ **Transparent** - Detailed console logging for debugging  
✅ **Time-aware** - Respects show hours (5-10PM MT)  

## Questions?

See the detailed guides:
- `S3_SETUP.md` - AWS S3 configuration
- `scripts/README_S3.md` - Python script usage
- Browser console logs - Real-time debugging info
