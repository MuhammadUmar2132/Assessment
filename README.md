# The Small Web & The Browser You Read It In

A full-stack implementation of the **Full Stack Technical Test (Web Engineering)**.

## Architecture
- **Server**: NestJS with MongoDB (Mongoose), Full-Text Indexing, RESTful Site, Search, History, and Persona APIs.
- **Client**: Next.js 14 (React, TypeScript, Tailwind CSS) custom browser simulation running within a browser tab.
- **Security**: Strict iframe sandbox with postMessage bridge for hyperlinking and scroll restoration. Untrusted user HTML cannot access the outer application context.

## Five Lifecycle States
1. `01 Typed`: Address entered in the address bar.
2. `02 Loading`: Network request in progress.
3. `03 Shown`: Site rendered and recorded in personal history.
4. `04 In history`: User has previously visited this address.
5. `05 Nowhere`: 404 address not found (with support for broken link navigation).

## Setup & Running
```bash
# 1. Install dependencies
npm run install:all

# 2. Seed database (seeds 200+ personal sites, webrings, wikis, and directories)
npm run seed

# 3. Start development servers (NestJS on :3001, Next.js on :3000)
npm run dev
```
