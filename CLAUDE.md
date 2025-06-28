# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VolleyCircle is a skill-level matching platform that solves the fundamental problem of finding volleyball games with players at your actual skill level. **The core feature is a sophisticated rating system** where players rate each other relative to the game's skill level (S, A+, A, B+, B, C, under C), helping everyone understand their true abilities and find more enjoyable, competitive games.

## Current State

This repository contains planning documentation (`volleyball_mvp_roadmap.md` and `system-architecture.md`) - no actual code implementation exists yet. The documentation details:

- **Core rating system design** (main feature that solves skill-level matching)
- Complete product specification and feature requirements  
- 12-week MVP development timeline (4 phases)
- Comprehensive UI/UX screen specifications
- Tech stack: React Native + Firebase (simplified architecture for MVP)
- Skill level system: S, A+, A, B+, B, C, under C

## Finalized Tech Stack

- **Frontend**: React Native (chosen for strong community support and team expertise)
- **Backend**: Firebase (Firestore + Functions + Authentication)
- **Notifications**: Firebase Cloud Messaging  
- **Hosting**: Firebase Hosting

## Key Features (MVP Scope)

**Phase 1 (Weeks 1-4)**: User auth, profiles, skill level system setup
**Phase 2 (Weeks 5-7)**: **Core Rating System** (main feature) - skill-level-relative rating collection and aggregation
**Phase 3 (Weeks 8-10)**: Enhanced event management with skill-based recommendations  
**Phase 4 (Weeks 11-12)**: Host dashboard, attendance tracking, app store submission

## Development Commands

No build/test commands exist yet - this is a planning phase repository.

## Architecture Notes

The system defines a **rating-centric mobile-first architecture** with:
- Cross-platform React Native app as primary interface
- **Skill-level-relative rating system** as the core feature solving skill-level matching
- Firebase backend (simplified for MVP timeline) with Firestore + Functions  
- **Skill levels**: S (pro), A+, A, B+, B, C, under C (beginner)
- **Anonymous rating system** with privacy-compliant design
- Multi-dimensional ratings: Friendliness, Punctuality, Skill Assessment (relative to game level)
- Event-based social features with external chat integration (LINE/Messenger)

**Key Implementation Priority**: The rating system is the main value proposition - prioritize this over other features during development.

When implementing, follow the detailed screen specifications and user flows outlined in the roadmap document.