# AGENTS.md

## Project Name
MediStock

## Project Goal
Build a Next.js web app for an SDG 3 hackathon. The app helps users find nearby clinics or pharmacies with essential medicines or vaccines in stock. Clinic staff can update inventory levels, and a public dashboard highlights low-stock and out-of-stock risks.

## Core Principle
This app supports health access and digital health literacy. It must not diagnose, prescribe, or replace professional medical advice.

## Success Criteria
- The app runs with `npm run dev`.
- The project uses Next.js, TypeScript, Tailwind CSS, Prisma, and shadcn/ui.
- The codebase has no README file before PresentMe analysis.
- The UI is clean, calm, accessible, and healthcare-oriented.
- The database schema is clear and located in `prisma/schema.prisma`.
- The app includes mock seed data for clinics, medicines, inventory, and requests.
- All public health guidance includes a disclaimer that it is not medical advice.
- The app has these pages:
  - Home
  - Find Medicine
  - Clinics
  - Clinic Detail
  - Update Stock
  - Request Medicine
  - Dashboard
  - Education

## Technical Rules
- Use the Next.js App Router.
- Use TypeScript.
- Use Prisma for database access.
- Use Tailwind CSS and shadcn/ui for components.
- Use Recharts for charts.
- Use Animate.css lightly for entrance animations.
- Do not add complex authentication.
- Do not add payment, diagnosis, prescriptions, or real patient data.
- Use mock data only.
- Keep forms simple and validated.
- Keep function names descriptive.

## UX Rules
- Use calm healthcare colors: teal, green, blue, white, soft gray.
- Prefer cards, badges, clean spacing, and readable typography.
- Avoid flashy animations.
- Every risk or low-stock warning must be clear but not alarming.
- Use plain language for citizens.

## Safety Rules
- Never claim the app gives medical advice.
- Never tell users to start, stop, or change medication.
- Always encourage users to contact a qualified healthcare professional for medical decisions.
- Emergency situations should direct users to local emergency services.

## Verification Checklist
Before finishing any implementation task:
1. Run `npm run lint`.
2. Run `npm run build`.
3. Check that no README.md exists.
4. Check that all navigation links work.
5. Check that seeded data appears correctly.
6. Check that forms do not crash.
7. Check that health disclaimers are visible.
