# Lovable Prompt: Burooj Dynamic Intake Backend

Build the dynamic backend and admin workflow for `buroojconsulting.com` using Supabase. `iinvestinsaudi.com` will remain a static opportunity-discovery site and will refer serious investors to Burooj using URLs such as:

`https://buroojconsulting.com/?source=iinvestinsaudi&service=opportunity&opportunity=12&title=Example&sector=Manufacturing#request`

## Required Outcome

Create a secure request-intake system where clients can submit:

- Management consulting requests
- Legal consulting coordination requests
- Legal representation requests through the partner law firm
- Feasibility study requests
- SIDF submission preparation requests
- Foreign investor soft-landing requests
- Opportunity inquiries coming from `iinvestinsaudi.com`

The system must send email notifications to `fhindi@iinvestinsaudi.com`, store the request in Supabase, store attachments privately, and allow an admin to review and change status to:

- `under_review`
- `accepted`
- `pending_more_information`
- `rejected`
- `closed`

## Database

Create these tables:

### `requests`

Fields:

- `id uuid primary key default gen_random_uuid()`
- `reference text unique not null`
- `source_site text`
- `source_path text`
- `opportunity_id text`
- `service_path text not null`
- `status text not null default 'under_review'`
- `priority text default 'normal'`
- `applicant_type text`
- `full_name text not null`
- `email text not null`
- `phone text`
- `company text`
- `country text`
- `preferred_language text`
- `preferred_contact text`
- `request_title text`
- `message text not null`
- `sector text`
- `investment_size text`
- `timeline text`
- `project_type text`
- `current_study_status text`
- `misa_status text`
- `legal_matter_type text`
- `counterparty text`
- `metadata jsonb default '{}'::jsonb`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### `request_documents`

- `id uuid primary key default gen_random_uuid()`
- `request_id uuid references requests(id) on delete cascade`
- `bucket text not null`
- `path text not null`
- `file_name text not null`
- `mime_type text`
- `file_size bigint`
- `uploaded_by text default 'client'`
- `created_at timestamptz default now()`

### `request_events`

- `id uuid primary key default gen_random_uuid()`
- `request_id uuid references requests(id) on delete cascade`
- `event_type text not null`
- `from_status text`
- `to_status text`
- `note text`
- `created_by uuid`
- `created_at timestamptz default now()`

### `request_messages`

- `id uuid primary key default gen_random_uuid()`
- `request_id uuid references requests(id) on delete cascade`
- `direction text not null`
- `subject text`
- `body text`
- `created_by uuid`
- `created_at timestamptz default now()`

## Storage

Create a private Supabase Storage bucket:

- `request-documents`

Rules:

- Anonymous users cannot read files.
- Clients can upload only through the Edge Function flow.
- Admin users can generate short-lived signed URLs for review.
- Allowed file types: PDF, DOCX, XLSX, PPTX, CSV, JPG, PNG.
- Maximum 10 files per request.
- Maximum 25 MB per file.
- Maximum 100 MB total per request.

## Edge Functions

### `create-request`

Accept `multipart/form-data`.

Validate:

- Full name required.
- Valid email required.
- Message required.
- Service pathway required.
- Legal representation requests require partner-law-firm acknowledgement.
- Honeypot and rate-limit protection.
- File type and file size restrictions.

Process:

1. Generate a reference number like `BRJ-2026-000001`.
2. Insert request row.
3. Upload files to private Storage under `request-documents/{request_id}/`.
4. Insert file metadata into `request_documents`.
5. Insert a `request_events` row: `submitted -> under_review`.
6. Send internal email to `fhindi@iinvestinsaudi.com`.
7. Send confirmation email to the applicant.
8. Return `{ success: true, reference, status: "under_review" }`.

The internal email should include:

- Reference number
- Source site
- Opportunity ID/title if present
- Service pathway
- Applicant details
- Request summary
- Attachment list
- Admin dashboard link

Do not attach sensitive documents directly to email. Include secure admin review links or file names only.

### `update-request-status`

Admin-only.

Accept:

- `request_id`
- `status`
- `note`
- `send_email`

Allowed statuses:

- `under_review`
- `accepted`
- `pending_more_information`
- `rejected`
- `closed`

Process:

1. Validate authenticated admin.
2. Update request status.
3. Insert row into `request_events`.
4. Optionally send applicant a polished status email.

## Admin Dashboard

Create `/admin` for authenticated admin users only.

Views:

- New / under review
- Pending more information
- Accepted
- Rejected / closed

Admin actions:

- Open request.
- View structured fields.
- View attachment list.
- Generate signed download link.
- Add internal note.
- Change status.
- Send status email.

## Client Experience

After submission, show:

- Reference number
- Status: Under review
- Expected initial review timing: 2-3 business days
- What happens next

Future optional feature:

- Public reference lookup page where a client can enter reference + email to see status and upload missing documents.

## Security

- Never expose Supabase service role key to the browser.
- RLS must prevent public reads of request data and documents.
- Keep clean JSON error responses.
- Log internal errors server-side only.
- Use environment variables for SMTP or Resend credentials.

