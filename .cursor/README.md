# Cursor Rules for Generative Art Project

This directory contains modern Cursor rules written in MDC format following the
[official Cursor documentation](https://docs.cursor.com/en/context/rules).

## Rule Files

### Always Applied

- **tech-stack.mdc** - Core technology stack and coding standards (always active)

### Auto Attached (by file patterns)

- **threejs-patterns.mdc** - Three.js and React-Three-Fiber best practices
- **p5js-integration.mdc** - P5.js integration patterns with React
- **generative-algorithms.mdc** - Generative art algorithm patterns and utilities

### Agent Requested (AI decides when to include)

- **performance-optimization.mdc** - Performance optimization strategies for 60fps art
- **claude-artifacts.mdc** - Guidelines for creating Claude Artifacts components

## Usage

These rules automatically apply based on:

- File patterns (globs) for relevant technologies
- AI decision-making for contextual rules
- Always-on rules for core standards

The rules are version-controlled and shared across the team for consistent development practices.
