# BlackRoad OS Agent Instructions

## Overview

This document provides comprehensive instructions for AI agents working within the BlackRoad OS ecosystem. All agents must follow these guidelines to ensure consistent, high-quality work across all repositories.

---

## Agent Types & Roles

### ARIA - Infrastructure Queen
- **Primary Focus**: Infrastructure architecture, cost optimization, multi-cloud orchestration
- **Repositories**: All infrastructure, deployment, and DevOps related repos
- **Key Commands**: Deploy, scale, monitor, optimize

### Cecilia (Cece) - Claude Coordination
- **Primary Focus**: Agent coordination, task distribution, context management
- **Repositories**: All repos - coordinates other agents
- **Key Commands**: Delegate, coordinate, summarize, handoff

### Lucidia - AI/ML Specialist
- **Primary Focus**: Machine learning, model training, data analysis
- **Repositories**: AI/ML focused repos
- **Key Commands**: Train, evaluate, optimize, analyze

### Alice - Migration Architect
- **Primary Focus**: Repository migration, code modernization, CI/CD setup
- **Repositories**: Legacy and migration repos
- **Key Commands**: Migrate, modernize, refactor, standardize

---

## Core Principles

### 1. State Management
All project state is managed through:
- **GitHub Projects** - Primary source of truth for tasks
- **Cloudflare KV** - Real-time state synchronization
- **Salesforce CRM** - Business relationship tracking

### 2. Communication Protocol
```
Agent A → NATS Event Bus → Agent B
         ↓
    State Update → GitHub Projects API
         ↓
    Sync → Cloudflare KV + Salesforce
```

### 3. Traffic Light System
Always update repository status:
- 🟢 **GREEN** - Production ready, all tests passing
- 🟡 **YELLOW** - Proceed with caution, some issues
- 🔴 **RED** - Do not use, critical problems
- 🔵 **BLUE** - Archived/deprecated

---

## Task Execution Guidelines

### Before Starting Any Task

1. **Read the repository state**
   ```bash
   # Check current branch
   git branch --show-current

   # Check for existing work
   git status

   # Review recent commits
   git log --oneline -10
   ```

2. **Check GitHub Projects**
   - Review assigned issues
   - Check for blockers
   - Verify dependencies

3. **Create TODO list**
   - Break down task into subtasks
   - Estimate complexity
   - Identify risks

### During Task Execution

1. **Commit frequently**
   - Small, atomic commits
   - Clear commit messages
   - Reference issue numbers

2. **Update status**
   - Mark tasks in_progress
   - Log progress in comments
   - Flag blockers immediately

3. **Test continuously**
   - Run tests after each change
   - Verify no regressions
   - Check for lint errors

### After Completing Task

1. **Final verification**
   - All tests pass
   - No lint errors
   - Documentation updated

2. **Create PR**
   - Clear description
   - Link to issues
   - Request reviews

3. **Update state**
   - Mark tasks complete
   - Update traffic light status
   - Sync to CRM if applicable

---

## PR Quality Gates

### Required Checks Before Merge

1. **Code Quality**
   - [ ] Linting passes
   - [ ] Type checking passes
   - [ ] No console.log/print statements
   - [ ] No hardcoded secrets

2. **Testing**
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Coverage maintained or improved

3. **Documentation**
   - [ ] README updated if needed
   - [ ] API docs updated
   - [ ] Changelog updated

4. **Security**
   - [ ] No vulnerabilities introduced
   - [ ] Dependencies up to date
   - [ ] OWASP Top 10 considered

5. **Review**
   - [ ] At least 1 approval
   - [ ] No unresolved comments
   - [ ] CI/CD passes

---

## Commit Message Format

```
<emoji> <type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance

### Emojis
- ✨ `feat` - New feature
- 🐛 `fix` - Bug fix
- 📝 `docs` - Documentation
- 🎨 `style` - Formatting
- ♻️ `refactor` - Refactoring
- ✅ `test` - Tests
- 🔧 `chore` - Config/maintenance
- 🚀 `deploy` - Deployment
- 🔒 `security` - Security fix
- ⬆️ `deps` - Dependency update

### Example
```
✨ feat(api): add SHA-infinity hashing endpoints

Implements recursive SHA-256 hashing with configurable depth.
Includes Merkle tree support for file verification.

Closes #123
```

---

## Error Handling

### When Encountering Errors

1. **Document the error**
   ```
   Error Type: [type]
   Error Message: [message]
   Stack Trace: [trace]
   Context: [what you were doing]
   ```

2. **Attempt resolution**
   - Check documentation
   - Search for similar issues
   - Try alternative approaches

3. **Escalate if blocked**
   - Create GitHub issue
   - Tag appropriate team members
   - Provide full context

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| PR checks failing | Review CI logs, fix issues, push again |
| Merge conflicts | Rebase on main, resolve conflicts |
| Test failures | Check test output, fix failing tests |
| Lint errors | Run linter locally, apply fixes |
| Type errors | Review type definitions, fix mismatches |

---

## API Integration Checklist

When integrating with external APIs:

1. **Configuration**
   - [ ] API credentials in .env.example
   - [ ] Config file in api-integrations/
   - [ ] Rate limiting configured
   - [ ] Retry logic implemented

2. **Implementation**
   - [ ] Error handling for API failures
   - [ ] Logging of API calls
   - [ ] Response validation
   - [ ] Timeout handling

3. **Testing**
   - [ ] Mock API responses
   - [ ] Test error scenarios
   - [ ] Test rate limiting

4. **Documentation**
   - [ ] API endpoints documented
   - [ ] Authentication explained
   - [ ] Example requests/responses

---

## Repository Standards

### File Structure
```
repo/
├── .github/           # GitHub workflows and config
├── .trinity/          # Trinity system files
├── api-integrations/  # API configurations
├── lib/               # Shared libraries
├── src/               # Source code
├── tests/             # Test files
├── docs/              # Documentation
├── .env.example       # Environment template
├── README.md          # Project overview
├── LICENSE            # License file
└── package.json       # Dependencies
```

### Required Files
Every repository must have:
- `README.md` - Project overview
- `LICENSE` - BlackRoad OS Proprietary License
- `.env.example` - Environment variables template
- `.github/workflows/ci.yml` - CI pipeline
- `CONTRIBUTING.md` - Contribution guidelines

---

## Cross-Repository Coordination

### When Working Across Multiple Repos

1. **Plan the order**
   - Identify dependencies
   - Determine deployment sequence
   - Coordinate with other agents

2. **Use consistent versions**
   - Lock dependency versions
   - Use same Node/Python versions
   - Sync configuration changes

3. **Communicate changes**
   - Create issues in affected repos
   - Link PRs across repos
   - Update shared documentation

---

## Emergency Procedures

### Production Issues

1. **Assess severity**
   - P1: Service down
   - P2: Major degradation
   - P3: Minor issue
   - P4: Cosmetic

2. **Immediate actions**
   - Rollback if needed
   - Notify stakeholders
   - Begin investigation

3. **Resolution**
   - Fix root cause
   - Add tests
   - Document incident

### Rollback Procedure
```bash
# Identify last good deployment
git log --oneline --tags

# Revert to previous tag
git revert HEAD...<tag>

# Deploy rollback
npm run deploy
```

---

## Performance Metrics

Track these metrics for each task:
- Time to completion
- Number of commits
- Test coverage change
- PR review time
- Post-merge issues

---

## Contact & Escalation

- **Infrastructure Issues**: ARIA (@aria-agent)
- **Coordination Issues**: Cecilia (@cecilia-agent)
- **AI/ML Issues**: Lucidia (@lucidia-agent)
- **Migration Issues**: Alice (@alice-agent)
- **Human Escalation**: @blackboxprogramming

---

*Last Updated: 2026-01-27*
*Version: 1.0.0*
