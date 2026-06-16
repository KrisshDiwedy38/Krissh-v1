from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        # Custom logic to format the error response
        error_message = ""
        
        # If response data is a dictionary, extract the first error message
        if isinstance(response.data, dict):
            # Often DRF returns {"detail": "message"} or {"field": ["message"]}
            if 'detail' in response.data:
                error_message = str(response.data['detail'])
            else:
                # Get the first error from the first field
                for field, errors in response.data.items():
                    if isinstance(errors, list) and len(errors) > 0:
                        error_message = f"{field}: {errors[0]}"
                        break
                    else:
                        error_message = str(errors)
                        break
        elif isinstance(response.data, list) and len(response.data) > 0:
            error_message = str(response.data[0])
        else:
            error_message = str(response.data)

        if not error_message:
            error_message = "An error occurred."
            
        # Reformat the response body to match the required standard { "error": "message" }
        response.data = {"error": error_message}

    return response
