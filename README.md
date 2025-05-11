## oath2 explanation:

[User] ──> [GET /login42] ──> Redirect to 42 API ──> Login on 42

[42 API redirects with ?code=...] ──> [GET /callback] ──> Exchange code for 42 access_token

[GET /v2/me] with 42 token ──> Fetch user data ──> Register/Login in Django

[Generate JWT tokens] ──> Redirect to frontend with tokens

[User clicks "Logout"] ──> Delete local JWT tokens

[Optional: User clicks "Logout from 42 as well"] ──> Redirect to the intra to click on the logout button

