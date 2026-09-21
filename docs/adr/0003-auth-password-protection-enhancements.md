# ADR 0003: Auth/password protection enhancements

## Status
Proposed

## Date
2026-09-21

## Context
The application requires robust authentication and password protection mechanisms to secure administrative access and protect citizen data. Current implementation includes basic authentication endpoints and password validation, but enhancements are needed to meet security best practices.

## Current Implementation
### Authentication Endpoints (in worker.ts)
- `/api/auth/bootstrap-status` - Checks if admin bootstrap is required
- `/api/auth/bootstrap-admin` - Creates first admin user
- `/api/auth/config` - Returns auth configuration
- `/api/auth/me` - Returns current authenticated user info

### Password Validation
- Minimum length of 8 characters enforced in:
  - `/api/auth/bootstrap-admin` endpoint (worker.ts line 277-278)
  - Citizen registration endpoint (worker.ts line 1128-1129)
  - AdminBootstrapView component (src/components/auth/AdminBootstrapView.tsx line 19)
- Password confirmation validation in bootstrap flows

### Authentication Helpers
- `requireAuth(request)` - Validates admin JWT token and returns user info
- `requireCitizenAuth(request)` - Validates citizen JWT token and returns user info
- Both functions used throughout worker.ts to protect endpoints

### Frontend Components
- `AdminAuthView` - Standard admin login form
- `AdminBootstrapView` - First admin user creation form

## Decision
Enhance auth/password protection with the following security improvements:

### 1. Password Policy Enhancements
- Implement multi-factor password complexity requirements:
  - Minimum 12 characters (increased from 8)
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character
- Implement password history to prevent reuse of last 5 passwords
- Secure password storage using industry-standard bcrypt hashing (via Supabase)

### 2. Authentication Security
- Implement rate limiting on authentication endpoints:
  - Maximum 5 failed attempts per username/IP per 15 minutes
  - Account lockout after 10 failed attempts (requires admin unlock)
- Implement secure password reset functionality:
  - Email-based reset with time-limited tokens
  - Server-side validation of reset requests
  - Prevention of username enumeration
- Implement email verification for new account registrations
- Implement session management:
  - Short-lived access tokens (15 minutes)
  - Refresh token rotation
  - Secure token storage recommendations

### 3. Monitoring and Auditing
- Log all authentication attempts (success and failure)
- Alert on suspicious activity (brute force attempts, impossible travel)
- Regular security audits of auth logs
- Integration with audit logging system

## Consequences
### Positive
- Significantly improved security posture
- Protection against brute force and credential stuffing attacks
- Better compliance with security standards and regulations
- Enhanced user trust in the system
- Reduced risk of unauthorized access

### Trade-offs
- Increased complexity in authentication flow
- Potential user friction from stronger password requirements
- Development effort required for implementation
- Possible need for user education on new security features

## Implementation Plan
1. Enhance password validation in all entry points (API endpoints and frontend forms)
2. Implement rate limiting middleware for auth endpoints
3. Add secure password reset endpoints and frontend UI
4. Enhance audit logging for authentication events
5. Update documentation and user guidance
6. Conduct security testing of implemented features

## Related
- ADR 0004: Admin bootstrap and Row Level Security implementation
- ADR 0005: Role-Based Access Control matrix finalization
- Source: Supabase Auth documentation
- Industry standards: OWASP Authentication Security Cheat Sheet, NIST SP 800-63B

## Validation
- All auth endpoints enforce enhanced password policies
- Rate limiting prevents brute force attacks
- Password reset flow is secure and functional
- Audit logs capture all authentication events
- Security testing confirms resistance to common attacks