from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile

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
