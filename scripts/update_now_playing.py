#!/usr/bin/env python3
"""
Christmas Light Show - Now Playing Updater (S3 Version)

This script sends the currently playing song information to your S3 bucket.
You can integrate this with your music player or light show controller.

Requirements:
    pip install boto3

Usage:
    python update_now_playing.py "Song Title" "Artist Name" --duration 180
    
    Or import and use programmatically:
    from update_now_playing import update_now_playing
    update_now_playing("Carol of the Bells", "Lindsey Stirling", 180)
"""

import sys
import json
import argparse
from datetime import datetime
from typing import Optional
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

# ============================================================================
# CONFIGURATION - Update these values after setting up S3 bucket
# ============================================================================

# Your S3 bucket name
S3_BUCKET = "your-bucket-name"

# The key (filename) in the bucket
S3_KEY = "current.json"

# AWS Region
AWS_REGION = "us-east-1"

# AWS Credentials (Option 1: hardcode - NOT RECOMMENDED for production)
# Better: use AWS CLI credentials or environment variables
AWS_ACCESS_KEY_ID = None  # Set via 'aws configure' instead
AWS_SECRET_ACCESS_KEY = None  # Set via 'aws configure' instead

# ============================================================================


def update_now_playing(
    song_title: str,
    artist: str,
    song_duration: int,
    bucket: str = S3_BUCKET,
    key: str = S3_KEY,
    region: str = AWS_REGION
) -> dict:
    """
    Upload now playing information to S3 bucket.
    
    Args:
        song_title: The title of the currently playing song
        artist: The artist name
        song_duration: Song length in seconds
        bucket: S3 bucket name
        key: S3 object key (filename)
        region: AWS region
        
    Returns:
        dict: Response from S3
        
    Raises:
        ClientError: If the S3 upload fails
        NoCredentialsError: If AWS credentials are not configured
        ValueError: If required configuration is missing
    """
    # Validate configuration
    if not bucket or bucket == "your-bucket-name":
        raise ValueError(
            "S3_BUCKET not configured. Please update S3_BUCKET in this script "
            "with your actual S3 bucket name."
        )
    
    # Prepare the payload
    payload = {
        "songTitle": song_title,
        "artist": artist,
        "songDuration": song_duration,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    # Create S3 client
    try:
        if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=region
            )
        else:
            # Use default credentials (from ~/.aws/credentials or environment)
            s3_client = boto3.client('s3', region_name=region)
    except NoCredentialsError:
        print("✗ AWS credentials not found. Run 'aws configure' or set AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY", 
              file=sys.stderr)
        raise
    
    # Upload to S3
    try:
        response = s3_client.put_object(
            Bucket=bucket,
            Key=key,
            Body=json.dumps(payload),
            ContentType='application/json',
            CacheControl='no-cache, no-store, must-revalidate'
        )
        
        print(f"✓ Successfully updated S3: {song_title} - {artist} ({song_duration}s)")
        print(f"  Bucket: s3://{bucket}/{key}")
        return response
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_msg = e.response['Error']['Message']
        print(f"✗ S3 upload failed ({error_code}): {error_msg}", file=sys.stderr)
        
        if error_code == 'NoSuchBucket':
            print(f"  Bucket '{bucket}' does not exist. Create it first.", file=sys.stderr)
        elif error_code == 'AccessDenied':
            print(f"  Access denied. Check your IAM permissions for s3:PutObject", file=sys.stderr)
        
        raise


def main():
    """Command-line interface for updating now playing."""
    parser = argparse.ArgumentParser(
        description="Update the currently playing song on your Christmas light show website"
    )
    parser.add_argument(
        "song_title",
        help="The title of the song"
    )
    parser.add_argument(
        "artist",
        help="The artist name"
    )
    parser.add_argument(
        "-d", "--duration",
        type=int,
        required=True,
        help="Song duration in seconds"
    )
    parser.add_argument(
        "--bucket",
        help="Override the default S3 bucket name",
        default=S3_BUCKET
    )
    parser.add_argument(
        "--key",
        help="Override the default S3 key (filename)",
        default=S3_KEY
    )
    parser.add_argument(
        "--region",
        help="Override the default AWS region",
        default=AWS_REGION
    )
    
    args = parser.parse_args()
    
    try:
        update_now_playing(
            song_title=args.song_title,
            artist=args.artist,
            song_duration=args.duration,
            bucket=args.bucket,
            key=args.key,
            region=args.region
        )
        sys.exit(0)
    except Exception as e:
        print(f"Failed to update now playing: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
