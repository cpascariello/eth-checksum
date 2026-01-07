# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ETH Address Checksummer - A single-page web app that validates and converts Ethereum addresses to EIP-55 checksummed format.

## Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # TypeScript check + production build to dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- **Vite** - Build tool
- **React 19** + TypeScript
- **Tailwind CSS v4** - Uses `@tailwindcss/postcss` plugin (configured in `postcss.config.js`)
- **ethers.js v6** - For `getAddress()` EIP-55 checksum utility

## Architecture

Single-component app with all UI and logic in `src/App.tsx`:
- Uses `getAddress()` from ethers.js to validate and checksum addresses
- Triggers on button click, Enter key, or input blur
- State: `inputValue`, `checksummed`, `error`, `copied`, `isDark`, `mousePos`

Build outputs static files to `dist/` for deployment.

## Decorative Squares

Configurable animated squares behind the main form (`src/App.tsx` lines 4-9):

| Constant | Description |
|----------|-------------|
| `SQUARE_COUNT` | Number of squares |
| `SQUARE_STEP` | Base size increment per square (px) |
| `SQUARE_STEP_INCREMENT` | Additional pixels added to each gap |
| `SQUARE_ROTATION` | Max rotation degrees (responds to mouse X) |
| `PARALLAX_MULTIPLIER` | Parallax intensity (0 to disable) |

Features:
- Gradient opacity (outer squares fade)
- Mouse-driven parallax translation
- Mouse-driven rotation (left = negative, right = positive)
