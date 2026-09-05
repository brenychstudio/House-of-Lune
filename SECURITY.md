# Security policy

Report suspected vulnerabilities privately to the repository owner. Do not open a public issue containing credentials, personal data, exploit details, or customer information.

## Repository rules

- Never commit `.env`, `.dev.vars`, tokens, passwords, production connection strings, or customer data.
- Use least-privilege runtime secret management for external services.
- Keep raw payment data outside BRENYCH application infrastructure.
- Treat authentication, authorization, idempotency, immutable commercial records, and audit history as release gates.
- Use synthetic records only in local tests and development seeds.

This milestone does not authorize production deployment or changes to the live `brenych.com` domain.
