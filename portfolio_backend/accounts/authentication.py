from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # We first check if the 'Authorization' header has a token
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            # If not in header, we can optionally check a cookie.
            # However, for access tokens, we agreed on in-memory storage (sent via Header),
            # and refresh tokens in httpOnly cookies.
            # But just in case we need to support cookie-based access token later:
            raw_token = request.COOKIES.get('access_token')

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
