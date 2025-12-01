# Python Scripts for Now Playing Integration

This directory contains Python scripts to update your Christmas light show website with the currently playing song using **S3 direct upload**.

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure AWS credentials:**
   ```bash
   aws configure
   # OR set environment variables
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   ```

3. **Configure the script by editing `update_now_playing.py`:**
   ```python
   S3_BUCKET = "christmas-now-playing-2025"  # Your bucket name
   AWS_REGION = "us-east-1"  # Your region
   ```

4. **Test the script:**
   ```bash
   python update_now_playing.py "Carol of the Bells" "Lindsey Stirling" --duration 240
   ```

## Files

### `update_now_playing.py`
Main script for uploading song info to S3. Can be used:
- **Command-line**: `python update_now_playing.py "Song" "Artist" --duration 180`
- **Import in Python**: `from update_now_playing import update_now_playing`

**Required argument:** `--duration` (song length in seconds)

### `integration_examples.py`
Example integrations for common light show controllers (needs updating for S3)

### `requirements.txt`
Python dependencies: `boto3` for S3 uploads

## Usage Examples

### Basic Usage
```bash
python update_now_playing.py "Jingle Bells" "Michael Bublé" --duration 180
```

### From Python Code
```python
from update_now_playing import update_now_playing

# When your song starts playing
update_now_playing(
    song_title="Carol of the Bells",
    artist="Lindsey Stirling", 
    song_duration=240  # seconds
)
```

### Integration with Light Show Software

#### Option 1: Subprocess call
```python
import subprocess

subprocess.run([
    "python",
    "/path/to/update_now_playing.py",
    song_title,
    artist,
    "--duration", str(duration_seconds)
])
```

#### Option 2: Direct import
```python
import sys
sys.path.append('/path/to/scripts')
from update_now_playing import update_now_playing

update_now_playing(song_title, artist, duration_seconds)
```

## Requirements

```
boto3>=1.28.0
```

## AWS Setup

See `S3_SETUP.md` in the project root for complete S3 bucket configuration instructions.

**Quick checklist:**
- [ ] S3 bucket created with public read access
- [ ] CORS enabled on bucket
- [ ] IAM user with PutObject permission
- [ ] AWS credentials configured on your PC

## Troubleshooting

### "Bucket not configured" error
- Update `S3_BUCKET` in `update_now_playing.py`

### "NoCredentialsError"  
- Run `aws configure` to set up credentials
- Or set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables

### "AccessDenied" error
- Verify IAM user has `s3:PutObject` permission
- Check bucket name is correct
- Ensure you're targeting the right AWS region

### Upload succeeds but website doesn't update
- Verify S3 URL is publicly accessible (test in browser)
- Check `VITE_NOW_PLAYING_S3_URL` in website `.env` file
- Look at browser console logs for fetch errors

## How It Works

1. **Your Python script** uploads JSON to S3 when song starts
2. **S3** serves the file with `Last-Modified` header
3. **Website** calculates when song ends using:
   - `Last-Modified` timestamp (when song started)
   - `songDuration` field (how long it runs)
4. **Smart polling** checks S3 only when next song should start
5. **Exponential backoff** handles edge cases gracefully

## Advanced Usage

### Custom bucket/region
```bash
python update_now_playing.py "Song" "Artist" \
  --duration 180 \
  --bucket my-other-bucket \
  --region us-west-2
```

### Environment variables
```bash
export S3_BUCKET=christmas-now-playing-2025
export AWS_REGION=us-east-1
# Then modify script to read from os.getenv()
```
