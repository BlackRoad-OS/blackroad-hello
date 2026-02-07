# Agent TODO Templates

Comprehensive TODO templates for AI agents working in the BlackRoad OS ecosystem. Copy and customize these templates for consistent task tracking across all repositories.

---

## Quick Reference

### Status Icons
- `[ ]` - Pending
- `[~]` - In Progress
- `[x]` - Completed
- `[!]` - Blocked
- `[-]` - Cancelled

### Priority Levels
- 🚨 P1 - Critical (production down)
- 🔥 P2 - High (major feature/blocker)
- ⚡ P3 - Medium (standard work)
- 💧 P4 - Low (nice to have)

---

## Repository Setup Template

Use when initializing a new repository:

```markdown
## Repository Setup: {repo-name}

### Prerequisites
- [ ] Verify org membership and permissions
- [ ] Check for existing similar repos
- [ ] Review naming conventions

### Core Setup
- [ ] Create repository with correct visibility
- [ ] Add LICENSE (BlackRoad OS Proprietary)
- [ ] Create README.md with standard template
- [ ] Add .gitignore for project type
- [ ] Create .env.example with required vars

### Configuration
- [ ] Set up branch protection rules
- [ ] Configure required reviewers
- [ ] Add CODEOWNERS file
- [ ] Set up issue templates
- [ ] Set up PR template

### CI/CD
- [ ] Add ci.yml workflow
- [ ] Add deploy.yml workflow
- [ ] Add pr-quality-gates.yml
- [ ] Configure secrets in repo settings
- [ ] Test CI pipeline

### Trinity System
- [ ] Create .trinity/ directory structure
- [ ] Add greenlight/ project management docs
- [ ] Add yellowlight/ infrastructure docs
- [ ] Add redlight/ templates if needed
- [ ] Configure agent identity if applicable

### API Integrations
- [ ] Add api-integrations/ directory
- [ ] Configure required service configs
- [ ] Test API connections
- [ ] Document endpoints

### Final Steps
- [ ] Run initial tests
- [ ] Verify build passes
- [ ] Update traffic light status to 🟢
- [ ] Notify team of new repo
```

---

## Feature Development Template

Use when implementing new features:

```markdown
## Feature: {feature-name}

### Planning
- [ ] Review requirements document
- [ ] Identify affected components
- [ ] Design solution architecture
- [ ] Estimate complexity (S/M/L/XL)
- [ ] Identify dependencies

### Implementation
- [ ] Create feature branch
- [ ] Implement core functionality
  - [ ] Component 1
  - [ ] Component 2
  - [ ] Component 3
- [ ] Add error handling
- [ ] Add logging
- [ ] Write unit tests
- [ ] Write integration tests

### Documentation
- [ ] Update README if needed
- [ ] Add inline code comments
- [ ] Update API documentation
- [ ] Add usage examples

### Testing
- [ ] Run full test suite
- [ ] Test edge cases
- [ ] Test error scenarios
- [ ] Performance testing (if applicable)

### Review
- [ ] Self-review changes
- [ ] Create PR with description
- [ ] Address review comments
- [ ] Get approval

### Deployment
- [ ] Merge to main
- [ ] Verify CI/CD passes
- [ ] Monitor deployment
- [ ] Verify in production

### Cleanup
- [ ] Delete feature branch
- [ ] Update project board
- [ ] Close related issues
```

---

## Bug Fix Template

Use when fixing bugs:

```markdown
## Bug Fix: {bug-description}

### Investigation
- [ ] Reproduce the bug
- [ ] Identify root cause
- [ ] Document reproduction steps
- [ ] Check for related issues

### Root Cause Analysis
- [ ] Affected file(s): {files}
- [ ] Affected function(s): {functions}
- [ ] Impact scope: {scope}
- [ ] Introduced in: {commit/PR}

### Fix Implementation
- [ ] Create fix branch
- [ ] Implement fix
- [ ] Add regression test
- [ ] Verify fix locally

### Verification
- [ ] Reproduction steps no longer reproduce
- [ ] All tests pass
- [ ] No new issues introduced
- [ ] Edge cases handled

### PR & Merge
- [ ] Create PR with bug details
- [ ] Link to original issue
- [ ] Get code review
- [ ] Merge and deploy

### Post-Fix
- [ ] Verify fix in production
- [ ] Monitor for regressions
- [ ] Update documentation if needed
- [ ] Close issue
```

---

## API Integration Template

Use when adding new API integrations:

```markdown
## API Integration: {service-name}

### Research
- [ ] Review API documentation
- [ ] Identify required endpoints
- [ ] Understand authentication method
- [ ] Check rate limits
- [ ] Review pricing/quotas

### Configuration
- [ ] Create config file in api-integrations/
- [ ] Add env vars to .env.example
- [ ] Document required permissions
- [ ] Set up OAuth if needed

### Implementation
- [ ] Create API client module
- [ ] Implement authentication
- [ ] Implement core endpoints
  - [ ] GET endpoints
  - [ ] POST endpoints
  - [ ] PUT/PATCH endpoints
  - [ ] DELETE endpoints
- [ ] Add retry logic
- [ ] Add rate limiting
- [ ] Add error handling

### Testing
- [ ] Write unit tests with mocks
- [ ] Test authentication flow
- [ ] Test error scenarios
- [ ] Test rate limiting behavior
- [ ] Integration test with real API (sandbox)

### Documentation
- [ ] Document all endpoints
- [ ] Add usage examples
- [ ] Document error codes
- [ ] Add troubleshooting guide

### Deployment
- [ ] Add production credentials
- [ ] Deploy to staging
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor initial usage
```

---

## Migration Template

Use when migrating repositories or code:

```markdown
## Migration: {source} → {destination}

### Assessment
- [ ] Inventory all items to migrate
- [ ] Identify dependencies
- [ ] Assess compatibility issues
- [ ] Create rollback plan
- [ ] Estimate effort

### Preparation
- [ ] Back up source
- [ ] Set up destination
- [ ] Prepare migration scripts
- [ ] Test migration in sandbox

### Migration Checklist
- [ ] Code/Files
  - [ ] Source code
  - [ ] Configuration files
  - [ ] Assets/media
  - [ ] Documentation
- [ ] Data
  - [ ] Database schema
  - [ ] Database data
  - [ ] User data
- [ ] Configuration
  - [ ] Environment variables
  - [ ] Secrets/credentials
  - [ ] DNS records
- [ ] Integrations
  - [ ] API connections
  - [ ] Webhooks
  - [ ] CI/CD pipelines

### Execution
- [ ] Execute migration scripts
- [ ] Verify data integrity
- [ ] Update DNS/routing
- [ ] Test all functionality

### Validation
- [ ] All features working
- [ ] Performance acceptable
- [ ] No data loss
- [ ] Integrations functional

### Cutover
- [ ] Announce migration
- [ ] Switch traffic to new system
- [ ] Monitor closely
- [ ] Keep source available for rollback

### Cleanup
- [ ] Verify stability (48-72 hours)
- [ ] Archive source
- [ ] Update documentation
- [ ] Remove temporary resources
```

---

## Deployment Template

Use when deploying to production:

```markdown
## Deployment: {version/feature}

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review approved
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Dependencies up to date

### Staging Deployment
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Run integration tests
- [ ] Performance check
- [ ] Security scan

### Production Checklist
- [ ] Announce deployment window
- [ ] Backup current state
- [ ] Prepare rollback procedure
- [ ] Monitor dashboards ready

### Deployment Execution
- [ ] Deploy to production
- [ ] Verify deployment success
- [ ] Run production smoke tests
- [ ] Check error rates
- [ ] Check performance metrics

### Post-Deployment
- [ ] Monitor for 30 minutes
- [ ] Check logs for errors
- [ ] Verify key user flows
- [ ] Announce completion

### Rollback (if needed)
- [ ] Identify issue
- [ ] Execute rollback
- [ ] Verify rollback success
- [ ] Document incident
- [ ] Schedule fix
```

---

## Code Review Template

Use when reviewing PRs:

```markdown
## Code Review: PR #{pr-number}

### Overview Check
- [ ] PR description is clear
- [ ] Linked to issue (if applicable)
- [ ] Appropriate size (not too large)
- [ ] Follows branch naming conventions

### Code Quality
- [ ] Code is readable and well-organized
- [ ] Follows project conventions
- [ ] No unnecessary complexity
- [ ] DRY principles followed
- [ ] SOLID principles followed

### Functionality
- [ ] Solves the stated problem
- [ ] Edge cases handled
- [ ] Error handling appropriate
- [ ] No regressions introduced

### Testing
- [ ] Tests added for new code
- [ ] Tests pass locally
- [ ] Coverage maintained
- [ ] Edge cases tested

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities
- [ ] Proper authentication/authorization

### Performance
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Appropriate caching

### Documentation
- [ ] Code comments where needed
- [ ] API docs updated
- [ ] README updated if needed

### Decision
- [ ] Approve
- [ ] Request changes
- [ ] Comment only
```

---

## Incident Response Template

Use when responding to production incidents:

```markdown
## Incident: {incident-title}

### Detection
- **Time detected**: {timestamp}
- **Detected by**: {person/system}
- **Alert source**: {monitoring/user report}

### Initial Assessment
- [ ] Severity: P1/P2/P3/P4
- [ ] Impact: {description}
- [ ] Affected systems: {list}
- [ ] Affected users: {scope}

### Communication
- [ ] Acknowledge in status page
- [ ] Notify stakeholders
- [ ] Create incident channel

### Investigation
- [ ] Check error logs
- [ ] Check metrics/dashboards
- [ ] Identify timeline
- [ ] Identify root cause

### Mitigation
- [ ] Implement temporary fix
- [ ] Verify fix effective
- [ ] Monitor stability

### Resolution
- [ ] Implement permanent fix
- [ ] Deploy fix
- [ ] Verify resolution
- [ ] Update status page

### Post-Incident
- [ ] Write incident report
- [ ] Conduct post-mortem
- [ ] Identify preventive measures
- [ ] Create follow-up tasks
- [ ] Update runbooks
```

---

## Security Audit Template

Use for security reviews:

```markdown
## Security Audit: {scope}

### Authentication
- [ ] Password policy enforced
- [ ] MFA available/required
- [ ] Session management secure
- [ ] Token rotation implemented

### Authorization
- [ ] Role-based access control
- [ ] Least privilege principle
- [ ] Resource ownership verified
- [ ] Admin access audited

### Data Protection
- [ ] Data encrypted at rest
- [ ] Data encrypted in transit
- [ ] PII handling compliant
- [ ] Backup encryption

### Input Validation
- [ ] All inputs validated
- [ ] SQL injection prevented
- [ ] XSS prevented
- [ ] CSRF tokens used

### Dependencies
- [ ] Dependencies up to date
- [ ] No known vulnerabilities
- [ ] Minimal dependency footprint
- [ ] License compliance

### Infrastructure
- [ ] Firewall configured
- [ ] Unnecessary ports closed
- [ ] Secrets management secure
- [ ] Logging enabled

### Compliance
- [ ] OWASP Top 10 addressed
- [ ] Relevant standards met
- [ ] Audit trail maintained
- [ ] Privacy policy current

### Findings
- [ ] Document all findings
- [ ] Prioritize by severity
- [ ] Create remediation plan
- [ ] Schedule follow-up audit
```

---

## Daily Standup Template

Use for daily status updates:

```markdown
## Daily Update: {date}

### Yesterday
- Completed: {list}
- In progress: {list}
- Blocked: {list}

### Today
- Priority 1: {task}
- Priority 2: {task}
- Priority 3: {task}

### Blockers
- {blocker description + who can help}

### Notes
- {any relevant information}
```

---

## Sprint Planning Template

Use for sprint planning:

```markdown
## Sprint {number}: {dates}

### Sprint Goal
{One sentence describing the sprint objective}

### Committed Items
| Item | Points | Owner | Status |
|------|--------|-------|--------|
| {item} | {pts} | {owner} | [ ] |

### Capacity
- Total points available: {number}
- Points committed: {number}
- Buffer: {number}

### Risks
- {risk 1}
- {risk 2}

### Dependencies
- {dependency 1}
- {dependency 2}

### Definition of Done
- [ ] Code complete
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Deployed to staging
```

---

## Using These Templates

1. **Copy the relevant template** to your task tracking system
2. **Customize** the items for your specific task
3. **Check off items** as you complete them
4. **Add notes** for any deviations or learnings
5. **Reference** the completed template in your PR/commit

---

*Last Updated: 2026-01-27*
*Version: 1.0.0*
