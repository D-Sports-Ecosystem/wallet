---
inclusion: manual
---

# Linear Spec Task Integration

This steering guide provides instructions for automatically creating Linear issues from spec tasks using the MCP Linear integration.

## Overview

When working with spec tasks in `.kiro/specs/{feature_name}/tasks.md` files, each task should have a corresponding Linear issue created for proper project tracking and team coordination.

## Team & Project Configuration

- **Team ID**: `26a37a4b-f1bb-494e-823a-ec11330515b7` (d-sports team)
- **Project ID**: `1c915b30-deed-4317-b1c5-e646e69345b6` (D-Sports-Native Sprint July 20)
- **Team Name**: `d-sports`
- **Project Name**: `D-Sports-Native Sprint July 20`

## Task-to-Issue Creation Process

### When to Create Issues

Create Linear issues for:
- Each top-level task in a `tasks.md` file
- Sub-tasks that represent significant implementation work
- Tasks that require tracking and coordination across team members

### Issue Creation Template

When creating Linear issues from spec tasks, use this format:

```markdown
**Spec Task**: [Task Number] [Task Title]

**Feature**: [Feature Name from spec directory]

**Requirements Reference**: [Referenced requirements from task details]

**Implementation Details**:
[Copy the task description and any sub-bullets from the tasks.md file]

**Acceptance Criteria**:
- [ ] Task implementation completed
- [ ] Code reviewed and merged
- [ ] Tests passing
- [ ] Requirements validated

**Related Files**:
- Requirements: `.kiro/specs/{feature_name}/requirements.md`
- Design: `.kiro/specs/{feature_name}/design.md`
- Tasks: `.kiro/specs/{feature_name}/tasks.md`
```

### MCP Tool Usage

Use the Linear MCP tools with these parameters:

```typescript
// Create issue
mcp_linear_create_issue({
  title: "[SPEC] {Feature Name}: {Task Title}",
  description: "// Use template above",
  teamId: "26a37a4b-f1bb-494e-823a-ec11330515b7",
  projectId: "1c915b30-deed-4317-b1c5-e646e69345b6",
  // Optional: Add labels like ["SPEC", "DEVELOPMENT"]
})
```

## Example Implementation

For a task like:
```markdown
- [ ] 1.2 Implement User model with validation
  - Write User class with validation methods
  - Create unit tests for User model validation
  - _Requirements: 1.2_
```

Create a Linear issue with:
- **Title**: `[SPEC] User Authentication: Implement User model with validation`
- **Description**: Following the template above
- **Team**: d-sports
- **Project**: D-Sports-Native Sprint July 20

## Workflow Integration

1. **During Spec Creation**: When tasks are finalized and approved, automatically create corresponding Linear issues
2. **During Task Execution**: Reference the Linear issue ID in commits and pull requests
3. **Task Completion**: Update the Linear issue status when spec tasks are completed

## Best Practices

- Use consistent naming: `[SPEC] {Feature Name}: {Task Title}`
- Include all relevant context from the spec documents
- Link back to the spec files in the issue description
- Use appropriate labels for filtering and organization
- Update issue status as tasks progress through implementation

## Testing Verification

The Linear MCP integration has been tested and verified:
- ✅ Team lookup successful
- ✅ Project lookup successful  
- ✅ Issue creation working
- ✅ Proper metadata attachment

Test issue created: `DSP-71` - "Test Issue - Spec Task Integration"