# User Stories

## Epic 1: User Authentication & Registration

### US-001: User Registration
**As a** candidate  
**I want to** register an account  
**So that** I can apply for jobs and manage my profile

**Acceptance Criteria:**
- [x] User can register with email and password
- [x] User can input full name during registration
- [x] Profile is automatically created upon registration
- [x] User is redirected to dashboard after registration

### US-002: User Login
**As a** registered user  
**I want to** login to my account  
**So that** I can access my dashboard and applications

**Acceptance Criteria:**
- [x] User can login with email and password
- [x] User is redirected based on role (admin/candidate)
- [x] Session is persisted across browser refresh

### US-003: Change Password
**As a** logged in user  
**I want to** change my password  
**So that** I can maintain account security

**Acceptance Criteria:**
- [x] User can change password from profile settings
- [x] Current password verification required
- [x] Password confirmation field required

---

## Epic 2: Candidate Profile Management

### US-010: Complete Profile Information
**As a** candidate  
**I want to** fill out my personal information  
**So that** employers can learn about me

**Acceptance Criteria:**
- [x] User can update personal details (name, DOB, address, etc.)
- [x] User can add contact information
- [x] User can upload profile photo
- [x] Changes are saved to database

### US-011: Upload CV/Resume
**As a** candidate  
**I want to** upload my CV  
**So that** I can attach it to job applications

**Acceptance Criteria:**
- [x] User can upload PDF/DOC files
- [x] User can have multiple CVs
- [x] User can set default CV
- [x] Files stored securely in Supabase Storage

### US-012: Add Certificates
**As a** candidate  
**I want to** add my maritime certificates  
**So that** employers can verify my qualifications

**Acceptance Criteria:**
- [x] User can add certificate details (type, number, issue date)
- [x] User can upload certificate files
- [x] User can edit and delete certificates

### US-013: Add Work Experience
**As a** candidate  
**I want to** add my sea service experience  
**So that** employers can see my background

**Acceptance Criteria:**
- [x] User can add vessel experience details
- [x] User can specify position, vessel type, duration
- [x] User can upload sea service documents

### US-014: Add Education
**As a** candidate  
**I want to** add my education background  
**So that** employers can see my qualifications

**Acceptance Criteria:**
- [x] User can add education institutions
- [x] User can specify degree and field of study
- [x] User can add dates attended

### US-015: Add Travel Documents
**As a** candidate  
**I want to** add my travel documents (passport, seaman book)  
**So that** my documents are ready for deployment

**Acceptance Criteria:**
- [x] User can add passport details
- [x] User can add seaman book details
- [x] System tracks expiry dates

### US-016: Add Emergency Contacts
**As a** candidate  
**I want to** add emergency contact information  
**So that** the company can contact someone in case of emergency

**Acceptance Criteria:**
- [x] User can add multiple emergency contacts
- [x] Required fields: name, relationship, phone
- [x] Can designate primary contact

---

## Epic 3: Job Browsing & Application

### US-020: Browse Jobs
**As a** candidate  
**I want to** browse available job listings  
**So that** I can find suitable positions

**Acceptance Criteria:**
- [x] Jobs displayed in list/grid format
- [x] Jobs show key info (title, company, location, salary)
- [x] Can filter by category, location, job type
- [x] Can search by keyword

### US-021: View Job Details
**As a** candidate  
**I want to** view detailed job information  
**So that** I can decide if I want to apply

**Acceptance Criteria:**
- [x] Full job description displayed
- [x] Requirements and responsibilities listed
- [x] Salary range shown
- [x] Application button visible

### US-022: Save Jobs
**As a** candidate  
**I want to** save jobs for later  
**So that** I can review them before applying

**Acceptance Criteria:**
- [x] User can bookmark/save jobs
- [x] Saved jobs appear in dedicated page
- [x] User can unsave jobs

### US-023: Apply for Job
**As a** candidate  
**I want to** apply for a job  
**So that** I can be considered for the position

**Acceptance Criteria:**
- [x] User can select CV to attach
- [x] User can add cover letter
- [x] Application confirmation shown
- [x] Duplicate applications prevented

### US-024: Track Applications
**As a** candidate  
**I want to** track my application status  
**So that** I know where I stand in the process

**Acceptance Criteria:**
- [x] List of all submitted applications
- [x] Status shown for each application
- [x] Can view application details

---

## Epic 4: Interview Management

### US-030: View Interview Schedule
**As a** candidate  
**I want to** view my interview schedule  
**So that** I can prepare and attend on time

**Acceptance Criteria:**
- [x] Calendar/list view of scheduled interviews
- [x] Interview details (date, time, interviewer)
- [x] Status of interview shown

### US-031: Schedule Interview (Admin)
**As an** admin/interviewer  
**I want to** schedule interviews with candidates  
**So that** we can assess their qualifications

**Acceptance Criteria:**
- [x] Can select date and time
- [x] Can assign interviewer
- [x] Candidate is notified

### US-032: Record Interview Results (Admin)
**As an** interviewer  
**I want to** record interview results  
**So that** the hiring decision can be made

**Acceptance Criteria:**
- [x] Can mark pass/fail
- [x] Can add notes and comments
- [x] Results saved to application

---

## Epic 5: Admin Job Management

### US-040: Create Job Posting
**As an** admin  
**I want to** create job postings  
**So that** candidates can apply

**Acceptance Criteria:**
- [x] Form to input job details
- [x] Can set salary range
- [x] Can assign category
- [x] Can set expiry date

### US-041: Edit Job Posting
**As an** admin  
**I want to** edit existing job postings  
**So that** information stays current

**Acceptance Criteria:**
- [x] All fields editable
- [x] Changes saved immediately
- [x] History preserved

### US-042: Deactivate Job
**As an** admin  
**I want to** deactivate job postings  
**So that** filled positions stop accepting applications

**Acceptance Criteria:**
- [x] Can toggle active status
- [x] Inactive jobs hidden from candidates
- [x] Existing applications preserved

---

## Epic 6: Application Review

### US-050: View Applications
**As an** admin  
**I want to** view all job applications  
**So that** I can process them

**Acceptance Criteria:**
- [x] List of all applications
- [x] Filter by status, job, date
- [x] Search by candidate name

### US-051: Review Application Details
**As an** admin  
**I want to** review application details  
**So that** I can make hiring decisions

**Acceptance Criteria:**
- [x] Candidate profile visible
- [x] CV downloadable
- [x] Interview history shown
- [x] Status update possible

### US-052: Update Application Status
**As an** admin  
**I want to** update application status  
**So that** candidates know their standing

**Acceptance Criteria:**
- [x] Multiple status options available
- [x] Notes can be added
- [x] Status history tracked

---

## Epic 7: User Management

### US-060: Create Admin User
**As a** superadmin  
**I want to** create admin users  
**So that** they can help manage the system

**Acceptance Criteria:**
- [x] Can create user with role
- [x] Can assign to specific city/region
- [x] Welcome email sent

### US-061: Manage User Roles
**As a** superadmin  
**I want to** manage user roles and permissions  
**So that** access is properly controlled

**Acceptance Criteria:**
- [x] Role assignment/removal
- [x] Permission configuration
- [x] Changes take effect immediately

### US-062: Import/Export Users
**As an** admin  
**I want to** import/export user data  
**So that** bulk operations are efficient

**Acceptance Criteria:**
- [x] Export to Excel
- [x] Import from Excel
- [x] Validation on import

---

## Epic 8: Messaging

### US-070: Send Message
**As a** user  
**I want to** send messages to other users  
**So that** I can communicate within the system

**Acceptance Criteria:**
- [x] Compose new message
- [x] Select recipient
- [x] Message delivered to inbox

### US-071: View Messages
**As a** user  
**I want to** view my messages  
**So that** I can stay informed

**Acceptance Criteria:**
- [x] Inbox with all received messages
- [x] Unread indicator
- [x] Message details viewable

### US-072: Reply to Message
**As a** user  
**I want to** reply to messages  
**So that** I can continue conversations

**Acceptance Criteria:**
- [x] Reply button on messages
- [x] Original message quoted
- [x] Thread maintained

---

## Epic 9: Testimonials

### US-080: Submit Testimonial
**As a** candidate  
**I want to** submit a testimonial  
**So that** I can share my experience

**Acceptance Criteria:**
- [x] Form to submit testimonial
- [x] Rating system (1-5 stars)
- [x] Text area for comments

### US-081: Approve Testimonials (Admin)
**As an** admin  
**I want to** approve testimonials  
**So that** only appropriate content is displayed

**Acceptance Criteria:**
- [x] List of pending testimonials
- [x] Approve/reject buttons
- [x] Approved testimonials shown on homepage

---

## Epic 10: Contact & Support

### US-090: Submit Contact Form
**As a** visitor  
**I want to** submit a contact form  
**So that** I can get in touch with the company

**Acceptance Criteria:**
- [x] Public contact form
- [x] Required fields validation
- [x] Confirmation message shown

### US-091: View Contact Submissions (Admin)
**As an** admin  
**I want to** view contact submissions  
**So that** I can respond to inquiries

**Acceptance Criteria:**
- [x] List of all submissions
- [x] Mark as read/unread
- [x] Reply via email
