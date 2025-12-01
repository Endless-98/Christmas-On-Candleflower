# Python Script Setup - Quick Start

## Prerequisites
- Python 3.7+
- AWS account with IAM credentials

## Installation Steps

1. **Install Python dependencies:**
   ```bash
   pip install boto3
   ```

2. **Configure AWS credentials** (one-time setup):
   ```bash
   aws configure
   ```
   - Enter your AWS Access Key ID
   - Enter your AWS Secret Access Key
   - Region: `us-east-1`
   - Output format: `json`

3. **Test the script** (dry-run, no AWS needed):
   ```bash
   python update_now_playing.py "Test Song" "Test Artist" --duration 180 --dry-run
   ```

4. **Upload a song** (requires AWS credentials):
   ```bash
   python update_now_playing.py "Jingle Bells" "Michael Bublé" --duration 180
   ```

## IAM Credentials Setup

Create an IAM user in AWS Console with this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::christmas-on-candleflower-now-playing-december-2025/current.json"
        }
    ]
}
```

## Integration Examples

**From another Python script:**
```python
from update_now_playing import update_now_playing

update_now_playing("Carol of the Bells", "Lindsey Stirling", 240)
```

**From command line/scheduler:**
```bash
python update_now_playing.py "Silent Night" "Pentatonix" -d 210
```

## Troubleshooting

- **"No credentials found"** → Run `aws configure`
- **"Access Denied"** → Check IAM user has `s3:PutObject` permission
- **"No module named 'boto3'"** → Run `pip install boto3`
