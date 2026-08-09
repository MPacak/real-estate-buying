# House Buying Tracker — Implementation Plan

## 1. Project Goal

Build a small private web application for tracking houses that we are considering buying.

The application replaces the current Excel-based workflow.

It should be optimized for:

- very fast use on mobile
- easy property entry and editing
- quickly seeing which houses matter
- tracking viewing status and priority
- remembering which agency and agent listed each house
- immediately accessing the agent's telephone number
- opening the original listing
- comparing shortlisted houses
- estimating the actual total acquisition cost
- retaining rejected houses so they are not accidentally reconsidered later

This is a private application, not a public real-estate platform.

Do not over-engineer it.

---

# 2. Technology Stack

Use:

- Next.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Drizzle migrations / code-first database schema
- Better Auth
- Tailwind CSS
- shadcn/ui
- Zod validation

Use the Next.js App Router.

The application should contain both the frontend and backend logic.

Do not create a separate .NET backend or separate API service.

Use:

- Server Components where appropriate
- Server Actions for mutations where practical
- Route handlers only where genuinely useful

Avoid adding unnecessary architectural layers.

Do not introduce:

- Redux
- GraphQL
- microservices
- CQRS
- event buses
- repository patterns unless clearly useful
- external state-management libraries unless actually necessary

The project should remain easy to understand and modify.

---

# 3. Primary Application Areas

The application should initially contain these main sections:

1. Houses
2. Compare
3. Add House

No map feature is required.

On mobile, use bottom navigation where appropriate.

On desktop, the navigation can adapt to a sidebar or header navigation.

The application must remain fully usable on a phone.

Mobile usability is a primary requirement rather than an afterthought.

---

# 4. Authentication

Authentication is required.

Users may log in but may not publicly register.

Requirements:

- `/login` page
- email/password authentication
- no public registration page
- signup disabled
- no user administration interface required initially
- users can be created manually through a seed script or CLI command

Example:

```bash
npm run create-user
```

There is no need initially for:

- account registration
- OAuth
- social login
- password reset
- roles
- permissions system
- administrator dashboard

Every application route except authentication routes must require authentication.

All authenticated users work with one shared household property list.

Do not scope properties to individual users.

Authentication and authorization must be checked inside server-side queries,
Server Actions, and Route Handlers. Route middleware may provide early redirects,
but it must not be the only protection.

The manual user-creation command must use Better Auth-compatible APIs so password
hashes and authentication records remain compatible with the configured auth
adapter.

---

# 5. Core Domain Model

The central entity is `Property`.

Keep the schema reasonably simple.

Do not excessively normalize the database.

---

# 6. Property Fields

Create a Property entity with approximately the following fields.

## Identity

```text
id
name
```

`name` is our own recognizable name for the property.

Examples:

```text
Rugvica big garden
Kerestinec new construction
Sašinovec dream house
Trstenik white house
```

Do not force users to use the listing title.

---

## Location

```text
address
location
```

`address`:

Actual street/address if known.

`location`:

Human-readable area or settlement.

Examples:

```text
Rugvica
Trstenik
Kerestinec
Sašinovec
Dugo Selo
```

No latitude or longitude is required.

No mapping integration is required.

---

## Property information

```text
livingAreaM2
landAreaM2
bedrooms
bathrooms
yearBuilt
furnished
newConstruction
```

Most of these fields should be optional.

Do not make property entry frustrating because some listing does not provide the information.

Use sensible database types.

Examples:

```text
livingAreaM2: numeric
landAreaM2: numeric
bedrooms: integer
bathrooms: integer
yearBuilt: integer
furnished: boolean/null
newConstruction: boolean/null
```

Allow unknown values.

---

# 7. Listing Information

Each property can contain:

```text
listingUrl
```

The listing URL should be immediately accessible from the property card and property details screen.

Display a clear action:

```text
Open listing
```

Open the link in a new tab.

Do not hide the listing URL deep inside an edit screen.

---

# 8. Agency and Agent Information

Tracking the agency and individual agent is important.

Property should initially contain:

```text
agencyName
agentName
agentPhone
agentEmail
```

Examples:

```text
Agency:
Dogma Nekretnine

Agent:
Ivan Horvat

Phone:
091 123 4567
```

`agentName`, `agentEmail`, and `agencyName` may be unknown.

`agentPhone` should be easy to see.

On mobile the phone number should use a `tel:` link.

Display a prominent:

```text
Call
```

button.

The user should not have to open an edit form just to find the phone number.

Initially store agency/agent details directly on the property.

Do NOT create separate Agency and Agent tables yet.

The same agency or agent appearing more than once is acceptable.

Normalization can be introduced later if the application genuinely needs it.

---

# 9. Property Status

Status and priority must be separate concepts.

Create a property status enum.

Suggested statuses:

```text
NEW
CONSIDERING
VIEWING_PLANNED
VIEWED
INTERESTED
REJECTED
SOLD
ARCHIVED
```

New properties default to:

```text
NEW
```

Meaning:

### NEW

Property has been added but not properly evaluated.

### CONSIDERING

Potentially interesting and currently being considered.

### VIEWING_PLANNED

We have decided to see it or have arranged a viewing.

### VIEWED

We have already seen the property but have not made a final decision.

### INTERESTED

A serious candidate.

### REJECTED

We have decided not to proceed.

Rejected properties remain stored.

### SOLD

The property has been sold or is otherwise no longer available.

### ARCHIVED

Property is kept for historical reasons but should normally stay out of active views.

---

# 10. Priority

Priority is independent from status.

Create a priority enum such as:

```text
LOW
NORMAL
HIGH
VERY_HIGH
```

New properties default to:

```text
NORMAL
```

This represents how urgently or strongly we want to investigate the property.

Example:

```text
Status: VIEWING_PLANNED
Priority: VERY_HIGH
```

or:

```text
Status: CONSIDERING
Priority: LOW
```

In the UI priority can optionally be represented using stars.

Example:

```text
LOW       ★
NORMAL    ★★
HIGH      ★★★
VERY_HIGH ★★★★
```

Do not encode priority into the property status.

---

# 11. Rejected Properties

Rejected properties must not be deleted by default.

When status becomes:

```text
REJECTED
```

allow storing:

```text
rejectionReason
```

Example:

```text
Too close to main road.
Rooms too small.
Garden has no privacy.
Needs too much renovation.
Bad location.
```

The purpose is to remember why the property was rejected.

This is important because the same property may later appear through another agency.

---

# 12. Viewing Information

Initially each property can contain:

```text
viewingAt
viewingNotes
```

`viewingAt` is optional.

Store `viewingAt` as PostgreSQL `timestamptz`.

Display viewing dates and times in the `Europe/Zagreb` timezone.

When a property has a viewing scheduled, it should be easy to see this directly from the property card.

Example:

```text
Viewing
Tuesday, 18:00
```

Eventually multiple viewings could be supported, but do not add that complexity initially unless necessary.

For the first version, a single viewing date/time is sufficient.

---

# 13. Notes

The current Excel workflow includes subjective information.

Support:

```text
notes
pros
cons
```

These can initially be long text fields.

Example:

### Pros

```text
Large garden
Very quiet street
Good room layout
Modern heating
```

### Cons

```text
Bathroom needs renovation
Garage is small
Neighbouring house is very close
```

For the first version these can remain plain multiline text.

Do not build complex tags yet.

---

# 14. Property Financial Fields

Support:

```text
askingPrice
targetOfferPrice
```

Additional acquisition cost inputs:

```text
propertyTaxPercent
agencyFeePercent
solemnizationCost
additionalCosts
furnishingCost
```

All should be optional.

Use PostgreSQL numeric/decimal types for money.

Use bounded numeric types. A suitable initial convention is:

```text
money values: numeric(14, 2)
percentage values: numeric(7, 4)
```

Do not use floating point types for financial values.

An entered percentage value of `3` means `3%`, not `0.03`.

`agencyFeePercent` is the final VAT-inclusive commission rate. Do not add VAT
automatically.

---

# 15. Calculated Financial Values

Do not store values that can reliably be calculated from other stored values.

Calculate approximately:

```text
propertyTax =
targetOfferPrice × propertyTaxPercent
```

```text
agencyFee =
targetOfferPrice × agencyFeePercent
```

Then:

```text
estimatedTotal =
targetOfferPrice
+ propertyTax
+ agencyFee
+ solemnizationCost
+ additionalCosts
+ furnishingCost
```

If no target offer exists, allow the calculation to use asking price where appropriate.

Use this explicit calculation base:

```text
calculationBase = targetOfferPrice ?? askingPrice
```

If neither price exists, calculated costs that require a price should be unknown
rather than zero.

Treat missing optional fixed costs and percentage values as zero once a calculation
base exists.

Round displayed monetary results to cents. Use exact decimal arithmetic for
financial calculations rather than JavaScript binary floating-point arithmetic.

Also calculate:

```text
askingPricePerM2
targetPricePerM2
```

when living area is available.

Example:

```text
1.860 €/m²
```

Do not persist these calculated values unless there is a strong technical reason.

---

# 16. Property Dashboard

The main Houses page is the core screen.

It should answer:

```text
What properties currently deserve our attention?
```

The default view should primarily show active properties.

Active could include:

```text
NEW
CONSIDERING
VIEWING_PLANNED
VIEWED
INTERESTED
```

Rejected, sold, and archived properties should normally be excluded unless requested using filters.

---

# 17. Property Cards

Mobile should use cards.

Each card should display at minimum:

```text
Property name
Location
Asking price
Living area
Status
Priority
Agency
Agent
Phone
Viewing date if applicable
Listing link
```

Example:

```text
Rugvica Big Garden

Rugvica

455.000 €
245 m²
1.857 €/m²

Interested
★★★★ Very High

Dogma Nekretnine
Ivan Horvat
091 123 4567

Viewing: Tuesday 18:00

[Call] [Listing] [Details]
```

Not every value must be displayed if unknown.

Do not render empty labels such as:

```text
Agent:
Phone:
Bedrooms:
```

when data does not exist.

---

# 18. Visual Status Indicators

Use visual indicators but do not rely only on color.

Suggested visual direction:

```text
NEW               neutral
CONSIDERING       yellow
VIEWING_PLANNED   blue
VIEWED             blue/neutral
INTERESTED         green
REJECTED           red
SOLD               muted
ARCHIVED           muted
```

Always show the text status as well.

For example:

```text
🟢 Interested
```

rather than only showing a green border.

---

# 19. Dashboard Quick Filters

Provide prominent quick filters.

Suggested filters:

```text
All Active
High Priority
Interested
To View
Viewed
Rejected
```

Also provide detailed filters.

---

# 20. Detailed Filters

Support filtering by:

```text
status
priority
minimum price
maximum price
minimum living area
location
agency
viewing scheduled
furnished
new construction
```

Search should also support:

```text
property name
location
address
agency
agent
phone
```

---

# 21. Sorting

Allow useful sorting.

Initially support:

```text
Priority
Recently added
Price low → high
Price high → low
Living area
Upcoming viewing
```

Default sort should make high-priority active properties easy to find.

A reasonable default:

```text
priority descending
then updatedAt descending
```

---

# 22. Property Details Page

Route:

```text
/houses/[id]
```

Property detail layout should prioritize the information most frequently needed.

Top section should include:

```text
Property name
Status
Priority
Asking price
Target offer
Living area
Location
```

Immediately visible actions:

```text
Call agent
Open listing
Edit
```

Then organize information into logical sections.

Suggested sections:

```text
Overview
Contact
Viewing
Pros & Cons
Financials
Notes
```

---

# 23. Contact Section

Example:

```text
Agency
Dogma Nekretnine

Agent
Ivan Horvat

Phone
091 123 4567

Email
ivan@example.com

[Call]
```

Phone must be tappable on mobile.

Email can use `mailto:`.

---

# 24. Financial Section

Example:

```text
Asking price
455.000 €

Target offer
420.000 €

Target €/m²
1.714 €/m²

Property tax
12.600 €

Agency fee
10.500 €

Solemnization
2.000 €

Additional costs
5.000 €

Furnishing
20.000 €

Estimated total
470.100 €
```

Calculated fields should be visually distinguished from editable inputs where appropriate.

---

# 25. Add Property Form

Route:

```text
/houses/new
```

The form should be mobile-friendly.

Do not create one enormous intimidating form.

Split it into logical sections.

Suggested order:

## Basic information

```text
Name *
Location
Address
Listing URL
```

## Price

```text
Asking price
Target offer
```

## Property

```text
Living area
Land area
Bedrooms
Bathrooms
Year built
Furnished
New construction
```

## Contact

```text
Agency
Agent name
Agent phone
Agent email
```

## Decision

```text
Status
Priority
```

## Viewing

```text
Viewing date/time
```

## Evaluation

```text
Pros
Cons
Notes
```

## Additional costs

```text
Property tax %
Agency fee %
Solemnization
Additional costs
Furnishing
```

Only `name` should initially be strictly required unless another field becomes technically necessary.

Users must be able to save an incomplete property.

This is important because listings often contain incomplete information.

---

# 26. Edit Property

Route:

```text
/houses/[id]/edit
```

Use the same form components as Add Property where possible.

Do not duplicate the entire form implementation.

Changes should update:

```text
updatedAt
```

---

# 27. Archive vs Delete

Prefer archiving over deletion.

Provide:

```text
Archive property
```

as the normal removal action.

Archiving means setting status to:

```text
ARCHIVED
```

Do not implement hard deletion in the MVP.

---

# 28. Duplicate Detection

Add basic duplicate detection after the core property flow works.

When creating or editing a property, check for likely duplicates using:

```text
listingUrl
address
agentPhone
```

Canonicalize listing URLs before matching, including removing common tracking
parameters and insignificant trailing slashes.

Normalize addresses and phone numbers before matching.

An agent phone match is only a supporting signal because one agent may list many
different properties. Never warn based on agent phone alone.

Do not automatically block creation.

Instead warn:

```text
This may already exist.
```

Then show possible matches.

Example:

```text
Possible duplicate:

Rugvica Big Garden
Added 12 days ago

[Open existing]
[Save anyway]
```

This matters because the same house may be advertised by several agencies.

Do not attempt sophisticated fuzzy matching initially.

---

# 29. Comparison Feature

Route:

```text
/compare
```

Users should be able to select multiple properties from the dashboard and compare them.

Practical initial limit:

```text
2–4 properties
```

The comparison should work on mobile, potentially using horizontally scrollable cards/table content.

Compare at least:

```text
Asking price
Target offer
Estimated total
Living area
Land area
Price per m²
Bedrooms
Bathrooms
Year built
Furnished
New construction
Location
Agency
Priority
Status
```

Also show:

```text
Pros
Cons
```

where practical.

---

# 30. Comparison Selection

Dashboard cards should support:

```text
Select for comparison
```

Selected properties can then be opened using:

```text
Compare selected
```

Do not implement complicated persistent comparison sessions initially.

URL query parameters are acceptable.

Example:

```text
/compare?ids=id1,id2,id3
```

---

# 31. Ratings — Later Phase

After the comparison feature works, optionally support subjective ratings.

Potential rating fields:

```text
locationRating
layoutRating
conditionRating
gardenRating
privacyRating
valueRating
```

Each:

```text
1–10
```

Do not automatically combine these into one mysterious overall score initially.

Display them separately.

Example:

```text
Location       9/10
Layout         8/10
Condition      6/10
Garden         10/10
Privacy        8/10
Value          7/10
```

This is a later enhancement, not part of the first CRUD implementation.

---

# 32. Suggested Database Schema

Start with roughly:

```text
users
properties
sessions / auth tables
```

All authenticated users share the same property records. Do not add a property
owner column for the initial shared-household model.

Do not introduce additional domain tables without a concrete need.

A conceptual Property schema:

```text
id

name

address
location

askingPrice
targetOfferPrice

livingAreaM2
landAreaM2

bedrooms
bathrooms
yearBuilt

furnished
newConstruction

listingUrl

agencyName
agentName
agentPhone
agentEmail

status
priority

viewingAt
viewingNotes

pros
cons
notes
rejectionReason

propertyTaxPercent
agencyFeePercent
solemnizationCost
additionalCosts
furnishingCost

createdAt
updatedAt
```

Use UUID or another appropriate modern ID strategy.

Add practical indexes for the main dashboard queries. Initially index:

```text
status
priority
updatedAt
viewingAt
```

Add an index for a canonical listing URL if it is stored for duplicate detection.

---

# 33. Data Validation

Use Zod.

Validation should be shared where reasonable between server and client.

Examples:

```text
askingPrice >= 0
targetOfferPrice >= 0
livingAreaM2 > 0
landAreaM2 >= 0
bedrooms >= 0
bathrooms >= 0
yearBuilt within reasonable range
percentage values >= 0
```

URLs should be validated when entered.

Listing URLs must use `http:` or `https:`. Do not accept executable or unsupported
URL schemes.

Do not prevent users from saving because optional data is missing.

Server-side validation is mandatory even if client-side validation exists.

---

# 34. Currency

Primary currency:

```text
EUR
```

The UI language is English.

Use `hr-HR` for number, currency, and date formatting, and use the
`Europe/Zagreb` timezone for date/time display.

Centralize formatting.

Use:

```text
Intl.NumberFormat
```

Do not manually concatenate formatting throughout components.

Example:

```text
455000
```

should display as:

```text
455.000 €
```

Use one consistent formatting strategy throughout the application.

---

# 35. Database Migration Strategy

Use Drizzle schema as the database source of truth.

Use Neon PostgreSQL as the initial database provider.

Use a pooled connection string for application runtime and a direct connection
string for migrations where required. Keep environment variable names centralized
and validated.

All schema changes must use migrations.

Never manually modify the production PostgreSQL schema without migration files.

Suggested folders:

```text
src/db/schema
src/db/migrations
```

---

# 36. Suggested Project Structure

Use approximately:

```text
src/
  app/
    (auth)/
      login/
        page.tsx

    (app)/
      layout.tsx

      houses/
        page.tsx

        new/
          page.tsx

        [id]/
          page.tsx

          edit/
            page.tsx

      compare/
        page.tsx

  actions/
    properties.ts

  components/
    houses/
      property-card.tsx
      property-form.tsx
      property-filters.tsx
      property-status.tsx
      property-priority.tsx
      financial-summary.tsx

    layout/

    ui/

  db/
    schema/
      auth.ts
      properties.ts

    index.ts

  lib/
    auth/
    calculations/
      property-costs.ts

    formatting/
      currency.ts

    validation/
      property.ts
```

Keep components focused.

Avoid generic abstractions before they are actually useful.

---

# 37. Phase 1 — Project Foundation

Goal:

Create the technical foundation only.

Tasks:

1. Create Next.js TypeScript project.
2. Configure Tailwind.
3. Configure shadcn/ui.
4. Configure PostgreSQL environment variables.
5. Add Drizzle.
6. Configure Drizzle migrations.
7. Configure Better Auth.
8. Implement login.
9. Disable signup.
10. Implement the Better Auth-compatible `npm run create-user` command.
11. Protect application routes.
12. Create reusable server-side authentication checks for queries and mutations.
13. Create authenticated application layout.
14. Add responsive navigation.
15. Add environment variable validation.
16. Create basic error/loading handling.

Target Neon PostgreSQL and document the pooled runtime and direct migration
connection variables in the example environment file.

Do NOT create Property functionality yet.

Definition of done:

- application starts successfully
- PostgreSQL connection works
- migrations work
- a user can be created with `npm run create-user`
- user can log in
- unauthenticated user is redirected to login
- server-side application access rejects unauthenticated requests
- authenticated user can access empty application shell
- signup is unavailable
- layout works on phone and desktop

Commit after completion.

Suggested commit:

```text
feat: initialize app foundation and authentication
```

---

# 38. Phase 2 — Property Database Model

Goal:

Create the Property domain model.

Tasks:

1. Create property status enum.
2. Create property priority enum.
3. Create properties schema.
4. Add all initial fields.
5. Use appropriate numeric database types.
6. Add timestamps.
7. Generate migration.
8. Apply migration.
9. Create Zod schemas.
10. Create reusable TypeScript types.

Do NOT build the dashboard yet.

Definition of done:

- migration successfully creates properties table
- schema matches requirements
- financial fields use safe numeric types
- optional fields are truly optional
- status and priority are separate

Commit:

```text
feat: add property database model
```

---

# 39. Phase 3 — Property CRUD

Goal:

Allow properties to be created, viewed, edited, and archived.

Tasks:

1. Create property server actions.
2. Add create property action.
3. Add update property action.
4. Add archive property action.
5. Implement `/houses/new`.
6. Implement `/houses/[id]`.
7. Implement `/houses/[id]/edit`.
8. Build reusable PropertyForm.
9. Add server-side Zod validation.
10. Add useful mutation errors.
11. Revalidate appropriate pages after changes.

Definition of done:

- property can be created
- incomplete property can be saved
- property can be viewed
- property can be edited
- property can be archived
- validation works
- no duplicate form implementations

Commit:

```text
feat: implement property CRUD
```

---

# 40. Phase 4 — Dashboard

Goal:

Make the application useful for daily house tracking.

Tasks:

1. Implement `/houses`.
2. Query active properties.
3. Create responsive property cards.
4. Display price.
5. Display m².
6. Display location.
7. Display agency.
8. Display agent.
9. Display phone.
10. Add `tel:` call action.
11. Add listing action.
12. Display status.
13. Display priority.
14. Display upcoming viewing.
15. Add empty state.
16. Add loading state.
17. Add sensible default sorting.

Mobile UX is especially important in this phase.

Definition of done:

From a phone, we can open the application and immediately:

- see interesting houses
- see priority
- see price
- see square meters
- see agency and agent
- call agent
- open original listing
- open details

Commit:

```text
feat: add property dashboard
```

---

# 41. Phase 5 — Filters, Search and Sorting

Goal:

Make larger property lists manageable.

Tasks:

1. Add quick filters.
2. Add status filter.
3. Add priority filter.
4. Add price range.
5. Add minimum area.
6. Add location filter.
7. Add agency filter.
8. Add furnished filter.
9. Add new-construction filter.
10. Add viewing-scheduled filter.
11. Add text search.
12. Search names, location, agency, agent and phone.
13. Add sorting.
14. Preserve filters in URL parameters where practical.

Example:

```text
/houses?status=INTERESTED&priority=VERY_HIGH
```

Definition of done:

A user can quickly answer:

```text
Show me all serious houses.
Show me what we still need to view.
Show me everything rejected.
Show me properties from this agency.
Show me houses under 450.000 €.
```

Commit:

```text
feat: add property filtering and search
```

---

# 42. Phase 6 — Financial Calculations

Goal:

Replace Excel acquisition-cost calculations.

Tasks:

1. Create pure calculation utilities.
2. Calculate property tax.
3. Calculate agency commission.
4. Calculate total acquisition cost.
5. Calculate asking €/m².
6. Calculate target €/m².
7. Add financial summary to details page.
8. Add live financial preview to property form.
9. Handle missing values safely.
10. Unit-test calculations.

Important:

Financial calculation functions should not depend directly on React.

Example:

```text
calculatePropertyCosts(...)
```

should be a pure function.

Definition of done:

We can enter expected purchase and additional expenses and immediately see realistic total acquisition cost.

Commit:

```text
feat: add property financial calculations
```

---

# 43. Phase 7 — Rejected Property Workflow

Goal:

Prevent forgotten properties from resurfacing unnoticed.

Tasks:

1. Improve REJECTED UI.
2. Add rejection reason input.
3. Show rejection reason prominently on rejected property details.
4. Add Rejected dashboard filter.
5. Keep rejected properties outside default active view.
6. Ensure search can still find rejected houses.

Definition of done:

A previously rejected property can be found and the reason for rejection is immediately obvious.

Commit:

```text
feat: improve rejected property workflow
```

---

# 44. Phase 8 — Duplicate Detection

Goal:

Detect when the same house appears again.

Tasks:

1. Check exact listing URL matches.
2. Check normalized address matches.
3. Check agent phone matches as a weaker signal.
4. Display potential duplicate warning before creation.
5. Allow user to ignore warning.
6. Link to existing matching property.

Do not overbuild fuzzy matching.

Definition of done:

The app helps identify obvious duplicate entries without preventing legitimate entries.

Commit:

```text
feat: add property duplicate warnings
```

---

# 45. Phase 9 — Property Comparison

Goal:

Make shortlisted property decisions easier.

Tasks:

1. Add selection checkbox/action to property cards.
2. Allow 2–4 properties to be selected.
3. Add Compare Selected action.
4. Implement `/compare`.
5. Display important values side-by-side.
6. Support horizontal scrolling on mobile.
7. Highlight missing values gracefully.
8. Include financial totals.
9. Include price/m².
10. Include agency and agent.
11. Include pros and cons.

Definition of done:

We can select our strongest candidates and objectively compare them without switching repeatedly between detail pages.

Commit:

```text
feat: add property comparison
```

---

# 46. Phase 10 — Subjective Ratings

Goal:

Improve comparison after we have actually viewed properties.

This phase is optional until the basic comparison has been used.

Potential fields:

```text
locationRating
layoutRating
conditionRating
gardenRating
privacyRating
valueRating
```

Use 1–10 values.

Tasks:

1. Add rating fields.
2. Create migration.
3. Add rating UI to edit/detail pages.
4. Add ratings to comparison.
5. Make ratings optional.

Do not introduce weighted automatic scoring yet.

Commit:

```text
feat: add property evaluation ratings
```

---

# 47. Phase 11 — UX Polish

Goal:

Make the app pleasant enough that using it is easier than returning to Excel.

Tasks:

1. Audit mobile layout.
2. Improve form spacing.
3. Improve tap target sizes.
4. Improve loading states.
5. Add skeletons where useful.
6. Improve empty states.
7. Improve confirmation dialogs.
8. Ensure destructive actions are clear.
9. Check keyboard navigation.
10. Check contrast/accessibility.
11. Improve responsive comparison table.
12. Add useful toast notifications.
13. Ensure phone and listing actions remain obvious.
14. Improve form autosave protection if accidental navigation becomes an issue.

Commit:

```text
feat: polish responsive house tracking UX
```

---

# 48. Explicitly Out of Scope

Do not implement these unless separately requested later:

```text
Map
GPS
geocoding
listing scraping
automatic listing imports
AI house scoring
AI recommendations
native mobile app
push notifications
email notifications
mortgage management
bank integrations
complex user roles
public registration
public property sharing
agency CRM
automatic valuation
price history scraping
multi-currency
real-estate marketplace features
```

If one of these appears useful while coding, do not add it automatically.

Discuss it separately first.

---

# 49. Development Rules for the Coding Agent

Follow these rules throughout the project.

## Rule 1

Implement only the current phase.

Do not prematurely implement later phases.

## Rule 2

Do not change unrelated code while implementing a feature.

## Rule 3

Do not change the database schema unless the current task explicitly requires it.

## Rule 4

Use existing components before introducing another abstraction.

## Rule 5

Do not add dependencies unless they solve a concrete problem.

## Rule 6

Keep server-side validation even when client-side validation exists.

## Rule 7

Maintain mobile usability for every new screen.

## Rule 8

Prefer simple and readable code over clever abstractions.

## Rule 9

All database changes must have migrations.

## Rule 10

Do not silently change business rules.

## Rule 11

Before finishing each phase:

```text
run lint
run typecheck
run tests if available
run production build
```

Fix issues introduced by the phase.

## Rule 12

After each phase, provide:

```text
What was implemented
Files added
Files changed
Database changes
Important architectural decisions
Known limitations
Manual testing steps
```

---

# 50. MVP Completion Point

The application should be considered a successful MVP after Phase 9.

At that point it supports:

```text
Authentication
Property entry
Editing
Property details
Agency tracking
Agent tracking
Immediate phone access
Original listing links
Status
Priority
Viewing information
Rejected properties
Search
Filters
Sorting
Financial estimates
Price per m²
Duplicate warnings
Property comparisons
Responsive mobile use
```

That is enough functionality to replace the current Excel workflow.

Do not delay the MVP by adding optional functionality before this point.

---

# 51. Core Product Principle

The application should optimize for this loop:

```text
Find house online
↓
Add it quickly
↓
Decide how interesting it is
↓
Call agency / agent
↓
Schedule viewing
↓
Record impressions
↓
Reject or shortlist
↓
Compare finalists
↓
Make purchasing decision
```

Every feature should support this workflow.

If a proposed feature does not materially improve this loop, it probably does not belong in the initial application.