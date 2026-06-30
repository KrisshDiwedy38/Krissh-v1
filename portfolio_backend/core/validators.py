from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from PIL import Image

def validate_image(file: UploadedFile):
    # Max size 5MB
    max_size_kb = 5120
    if file.size > max_size_kb * 1024:
        raise ValidationError(f"Image file size must be under {max_size_kb / 1024}MB")

    # Allowed extensions
    valid_extensions = ['jpg', 'jpeg', 'png', 'webp']
    extension = file.name.split('.')[-1].lower()
    if extension not in valid_extensions:
        raise ValidationError(f"Unsupported file extension. Allowed extensions are: {', '.join(valid_extensions)}")

    # Validate image content
    try:
        img = Image.open(file)
        img.verify()
        # Reset file pointer after verify
        file.seek(0)
    except Exception:
        raise ValidationError("Invalid image file format.")
