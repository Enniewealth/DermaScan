import os
import uuid
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.config import settings

# Initialize Cloudinary if settings are provided
is_cloudinary_configured = bool(
    settings.CLOUDINARY_CLOUD_NAME and
    settings.CLOUDINARY_API_KEY and
    settings.CLOUDINARY_API_SECRET
)

if is_cloudinary_configured:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET
    )

# Static directory setup for local uploads fallback
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def upload_image(file: UploadFile) -> str:
    """
    Uploads an image file to Cloudinary. 
    If Cloudinary is not configured, saves the file locally in static directory and returns local URL.
    """
    if is_cloudinary_configured:
        try:
            # Read bytes of file
            contents = await file.read()
            # Upload to Cloudinary
            response = cloudinary.uploader.upload(
                contents,
                folder="dermascan",
                resource_type="image"
            )
            # Reset file pointer for any subsequent reads
            await file.seek(0)
            return response.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload failed: {e}. Falling back to local upload.")
    
    # Local Upload Fallback
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Read file content and write it locally
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    await file.seek(0)
    
    # Return path relative to server root
    return f"/static/uploads/{filename}"
