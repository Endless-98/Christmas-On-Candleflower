# 🚨 Fix S3 Access Errors Now

## Problem: 403 Forbidden Error

Your S3 bucket needs two configurations:
1. **Bucket Policy** (for public read access)
2. **CORS** (for cross-origin requests)

## Fix 1: Bucket Policy (REQUIRED - Do This First!)

## Fix 1: Bucket Policy (REQUIRED - Do This First!)

1. Go to **AWS Console** → **S3**
2. Click your bucket: `christmas-on-candleflower-now-playing-december-2025`
3. Click **Permissions** tab
4. Scroll to **Bucket policy** → Click **Edit**
5. Paste this JSON:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::christmas-on-candleflower-now-playing-december-2025/current.json"
        }
    ]
}
```

6. Click **Save changes**

## Fix 2: CORS Configuration (Also Required)

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

## Fix 2: CORS Configuration (Also Required)

1. Still in **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)** → Click **Edit**
3. Paste this JSON:

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

4. Click **Save changes**

## Fix 3: Block Public Access Settings

1. Still in **Permissions** tab
2. Scroll to **Block public access (bucket settings)** → Click **Edit**
3. **UNCHECK** "Block all public access"
4. Click **Save changes**
5. Type `confirm` when prompted

## Test It

1. Open this URL directly in your browser:
   ```
   https://christmas-on-candleflower-now-playing-december-2025.s3.us-east-1.amazonaws.com/current.json
   ```
   - Should show JSON, not an error
   
2. Refresh your website - the 403 error should be gone

## Quick Checklist

- [ ] Bucket policy added (allows public read)
- [ ] CORS configured (allows cross-origin)
- [ ] Block public access disabled
- [ ] Test URL works in browser
- [ ] Website loads without 403 error

## What This Does

- **AllowedOrigins: ["*"]** - Allows your website (and any domain) to fetch from S3
- **AllowedMethods: ["GET", "HEAD"]** - Allows reading the file
- **ExposeHeaders: ["Last-Modified"]** - Lets JavaScript see when the file was updated (critical for our smart polling)

## Security Note

Using `"*"` for AllowedOrigins is safe here because:
- The file is already public (anyone can access it via direct URL)
- It only contains song info, not sensitive data
- It's read-only (write access still requires your AWS credentials)

If you want to restrict it to only your domain:

```json
"AllowedOrigins": ["https://www.christmasoncandleflower.com", "https://christmasoncandleflower.com"]
```

But `"*"` is fine for this use case.
