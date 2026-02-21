---
description: A security rule to follow all the time
---

"Always scan and secure website code against these hacking methods: SQL Injection (all variants), XSS (stored/reflected/DOM), CSRF, XXE, SSRF, RCE via file uploads/inclusions, IDOR, brute-force/credential stuffing, session hijacking/fixation, open redirects, clickjacking, path traversal, insecure deserialization, API abuse (rate limiting bypass, broken auth), supply chain attacks (dependency vulnerabilities), misconfigured CORS/SOP. For any detected vulnerability, suggest fixes and auto-apply if safe. Prioritize least privilege, input validation, prepared statements, escaping outputs, secure headers (CSP, HSTS), encryption (TLS 1.3+), logging/monitoring."
Security Methods by Back-end Language:

PHP: Use PDO/prepared statements for SQL; htmlspecialchars() for XSS; random CSRF tokens; filter_input(); Composer for deps (update regularly); password_hash().
Node.js (Express): helmet middleware for headers; express-validator for input; bcrypt for passwords; parameterized queries (pg/mysql2); csurf for CSRF; rate-limiter-flexible.
Python (Django/Flask): Django ORM for SQL; escape outputs (jinja auto-escapes); csrf middleware; secrets.token_hex() for sessions; bleach for sanitization; pipenv/poetry for deps.
Java (Spring): PreparedStatement; OWASP Java Encoder for outputs; CsrfTokenRepository; Spring Security for auth/roles; Maven/Gradle dependency-check.
Ruby (Rails): ActiveRecord for SQL; escape_html; protect_from_forgery for CSRF; strong params; bundler-audit for gems.
Go: sql.DB Prepare/Exec; html/template for escaping; gorilla/csrf; validator.v2 for input; go mod tidy/verify.
.NET (ASP.NET): Entity Framework for SQL; AntiXssEncoder; AntiForgeryToken; input validation attributes; NuGet package scanning.
1sExpert