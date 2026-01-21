-- ============================================
-- COMPLETE DATABASE EXPORT SCRIPT
-- Generated: 2026-01-21
-- ============================================
-- 
-- IMPORTANT: Before running this script in a new project:
-- 1. Export auth.users from Supabase Dashboard → Authentication → Users → Export
-- 2. Import auth.users to the new project FIRST
-- 3. Then run this script
-- 
-- Run the secondary-database-setup.sql first to create all tables!
-- ============================================

-- Disable triggers temporarily for bulk insert
SET session_replication_role = replica;

-- ============================================
-- 1. SKILLS TABLE
-- ============================================
INSERT INTO skills (id, name, category, created_at) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Navigation', 'Deck', NOW()),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Engine Maintenance', 'Engine', NOW()),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Food & Beverage', 'Hotel', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. JOB CATEGORIES TABLE
-- ============================================
INSERT INTO job_categories (id, name, slug, description, created_at) VALUES
('cat-deck-0001', 'Deck Department', 'deck-department', 'All deck-related positions', NOW()),
('cat-engine-001', 'Engine Department', 'engine-department', 'All engine-related positions', NOW()),
('cat-hotel-001', 'Hotel Department', 'hotel-department', 'All hospitality positions', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. PERMISSIONS TABLE
-- ============================================
INSERT INTO permissions (id, name, description, category, created_at) VALUES
('b03fb3c7-de55-48e6-a06a-4c3ea8d20e32', 'view_applications', 'Can view job applications', 'Applications', '2025-11-10 13:14:20.858949+00'),
('be69a37a-6da3-4c47-82af-ed9cba15f88a', 'manage_applications', 'Can manage job applications', 'Applications', '2025-11-10 13:14:20.858949+00'),
('e3a0b41d-04b7-4cf3-9f4e-dc4f3f5cf1e5', 'view_interviews', 'Can view interview schedules', 'Interviews', '2025-11-10 13:14:20.858949+00'),
('d46af6ae-a1d2-44d6-a4e9-3f1f3dd9c0b2', 'manage_interviews', 'Can manage interview schedules', 'Interviews', '2025-11-10 13:14:20.858949+00'),
('bf1d4bf9-64b6-433a-a7c9-ec6621f20e92', 'view_users', 'Can view users list', 'Users', '2025-11-10 13:14:20.858949+00'),
('25acb20e-5b58-4f63-8b73-02f8d800a422', 'manage_users', 'Can manage users', 'Users', '2025-11-10 13:14:20.858949+00'),
('67a63e01-9e81-4a95-a5e9-fba69ae2f891', 'view_jobs', 'Can view job listings', 'Jobs', '2025-11-10 13:14:20.858949+00'),
('eab91ab9-e51d-4d06-9b6a-a85fb8f9f6e2', 'manage_jobs', 'Can create and edit job listings', 'Jobs', '2025-11-10 13:14:20.858949+00'),
('bc7d0fb9-7fac-438f-b9e7-d3f5eb9e1b26', 'view_departures', 'Can view departure schedules', 'Departures', '2025-11-10 13:14:20.858949+00'),
('e3d8d0c8-1f8a-4820-bb96-b5e6a9d7c0e3', 'manage_departures', 'Can manage departure schedules', 'Departures', '2025-11-10 13:14:20.858949+00'),
('a1f2e3d4-c5b6-7a89-0123-456789abcdef', 'view_messages', 'Can view messages', 'Messages', '2025-11-10 13:14:20.858949+00'),
('b2e3f4a5-d6c7-8b90-1234-567890abcdef', 'send_messages', 'Can send messages', 'Messages', '2025-11-10 13:14:20.858949+00'),
('c3f4a5b6-e7d8-9c01-2345-678901abcdef', 'manage_messages', 'Can manage all messages', 'Messages', '2025-11-10 13:14:20.858949+00'),
('d4a5b6c7-f8e9-0d12-3456-789012abcdef', 'view_testimonials', 'Can view testimonials', 'Testimonials', '2025-11-10 13:14:20.858949+00'),
('e5b6c7d8-a9f0-1e23-4567-890123abcdef', 'manage_testimonials', 'Can approve/reject testimonials', 'Testimonials', '2025-11-10 13:14:20.858949+00'),
('f6c7d8e9-b0a1-2f34-5678-901234abcdef', 'view_contact_submissions', 'Can view contact submissions', 'Contact', '2025-11-10 13:14:20.858949+00'),
('a7d8e9f0-c1b2-3a45-6789-012345abcdef', 'manage_contact_submissions', 'Can manage contact submissions', 'Contact', '2025-11-10 13:14:20.858949+00'),
('b8e9f0a1-d2c3-4b56-7890-123456abcdef', 'view_reports', 'Can view reports and analytics', 'Reports', '2025-11-10 13:14:20.858949+00'),
('c9f0a1b2-e3d4-5c67-8901-234567abcdef', 'manage_roles', 'Can manage user roles', 'Roles', '2025-11-10 13:14:20.858949+00'),
('d0a1b2c3-f4e5-6d78-9012-345678abcdef', 'manage_permissions', 'Can manage role permissions', 'Permissions', '2025-11-10 13:14:20.858949+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. USER ROLES TABLE
-- (Requires auth.users to exist first!)
-- ============================================
INSERT INTO user_roles (id, user_id, role, created_at) VALUES
('6e60e8aa-d97a-47dc-8458-5e60b2e6f9bc', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15', 'candidate', '2025-11-10 12:27:59.846262+00'),
('b4fd69e5-5119-44f9-a4c3-ea7c73077bbe', '174f4259-3a29-4de4-84dc-ebce7d66f46d', 'admin', '2025-11-10 13:08:29.29849+00'),
('82c4dd1a-8b60-4bcb-bbf3-33aeec7f2a75', '073ed85b-4e33-45ff-86f1-4b6c770b661a', 'superadmin', '2025-11-10 13:11:27.507873+00'),
('5db3b7f9-88c3-47f2-a9e7-f4e1a7a89f42', '7786ac36-bfe7-49dd-b005-43e7de326d09', 'staff', '2025-11-10 13:11:40.579035+00'),
('f6c2e8a1-3d4b-5a6c-7890-1234567890ab', '43c9a184-cea8-47de-8777-c4bfecb58e06', 'manajer', '2025-11-10 13:12:00.049273+00'),
('a7d3f9b2-4e5c-6b7d-8901-2345678901bc', '6d893660-ebe6-464a-a7f3-483036bd764d', 'interviewer', '2025-11-10 13:13:18.166856+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. JOBS TABLE
-- ============================================
INSERT INTO jobs (id, employer_id, title, company_name, department, description, requirements, responsibilities, benefits, location, job_type, salary_min, salary_max, salary_currency, experience_level, education_level, positions_available, is_urgent, is_featured, is_active, created_at, updated_at) VALUES
('d3981ac1-322d-433b-9957-80b76e48111f', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15', 'Waiters', 'Norwegian Cruise Line', 'Hotel Department', 'We are seeking professional and customer-oriented Waiters to join our Hotel Department aboard our luxury cruise ships. This is an excellent opportunity for individuals passionate about hospitality and eager to work in an international environment.

As a Waiter, you will be responsible for providing exceptional dining experiences to our guests, ensuring their comfort and satisfaction throughout their journey with us.', '• Minimum 1 year experience in hospitality or food service
• Excellent communication and interpersonal skills
• Ability to work in a fast-paced environment
• Physical stamina to stand for extended periods
• Basic English proficiency (additional languages a plus)
• Customer service oriented with positive attitude
• Willingness to work flexible hours including weekends', '• Provide excellent customer service to all guests
• Take orders and serve food and beverages efficiently
• Maintain cleanliness and organization of dining areas
• Work collaboratively with kitchen and service staff
• Handle guest requests and resolve issues professionally
• Follow health and safety regulations', '• Competitive salary with tips
• Free accommodation and meals
• Travel opportunities worldwide
• Health and accident insurance
• Training and career development
• International work experience', 'International Waters', 'Full-time', 2000, 3500, 'USD', 'Entry Level', 'High School', 5, true, true, true, '2025-11-10 12:30:18.247419+00', '2025-11-10 12:30:18.247419+00'),

('1fb981ae-aa45-446c-8cd9-08ec4cb71726', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15', 'Deck Officer', 'SeaChef Maritime', 'Deck Department', 'Join our fleet as a Deck Officer responsible for navigation, safety, and ship operations. This role offers excellent career progression opportunities in the maritime industry.', '• Valid STCW certification and Deck Officer license
• Minimum 2 years experience on commercial vessels
• Strong knowledge of maritime regulations
• Excellent leadership and decision-making skills
• Proficient in navigation systems and equipment
• Good physical fitness and medical certificate
• Strong English communication skills', '• Assist in navigation and watchkeeping duties
• Maintain deck equipment and cargo operations
• Ensure compliance with maritime safety regulations
• Supervise deck crew and coordinate activities
• Conduct safety drills and emergency procedures
• Maintain accurate logs and documentation', '• Competitive international salary
• Rotation schedule with paid leave
• Career advancement opportunities
• Comprehensive insurance coverage
• Professional training and certifications
• Travel to international ports', 'International Waters', 'Full-time', 4000, 6000, 'USD', 'Mid Level', 'Bachelor Degree', 3, true, true, true, '2025-11-10 12:30:18.247419+00', '2025-11-10 12:30:18.247419+00'),

('38c7bccb-cc15-4879-adb5-80504e97cbfd', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15', 'Engine Mechanic', 'NYK Ship Management', 'Engine Department', 'We are looking for experienced Engine Mechanics to maintain and repair marine engines and machinery. Join one of the world''s leading shipping companies.', '• Marine engineering diploma or equivalent
• Minimum 3 years experience with marine engines
• Knowledge of diesel and auxiliary systems
• Strong troubleshooting and problem-solving skills
• Ability to work in confined spaces
• Valid STCW and medical certificates
• Team player with good work ethic', '• Perform maintenance and repairs on engines and machinery
• Monitor engine performance and diagnose issues
• Maintain inventory of spare parts and tools
• Follow safety procedures and regulations
• Document all maintenance activities
• Assist with emergency repairs as needed', '• Attractive salary package
• Regular rotation schedule
• Health and life insurance
• Retirement benefits
• Ongoing technical training
• Modern accommodation facilities', 'Asia Pacific', 'Full-time', 3500, 5500, 'USD', 'Mid Level', 'Diploma', 2, false, false, true, '2025-11-10 12:30:18.247419+00', '2025-11-10 12:30:18.247419+00'),

('06a57861-bbd3-475e-aeb5-2032370c8a84', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15', 'Cruise Director', 'Celebrity Cruises', 'Hotel Department', 'Lead the entertainment and guest services team aboard our world-class cruise ships. As Cruise Director, you will be the face of our onboard entertainment program.', '• Minimum 3 years experience in entertainment or hospitality management
• Excellent public speaking and hosting abilities
• Strong leadership and team management skills
• Fluent English (additional languages preferred)
• Creative and energetic personality
• Experience with event planning and execution
• Valid STCW certification', '• Oversee all entertainment programming and activities
• Host main events, shows, and announcements
• Manage entertainment team and schedules
• Interact with guests and ensure satisfaction
• Coordinate with other departments
• Handle guest concerns and feedback', '• Top-tier salary and bonus potential
• Premium single cabin accommodation
• Full medical and dental coverage
• Travel the world
• Career advancement to shore-side positions
• Access to crew facilities and amenities', 'Caribbean & Mediterranean', 'Full-time', 5000, 8000, 'USD', 'Senior Level', 'Bachelor Degree', 1, false, true, true, '2025-11-10 12:30:18.247419+00', '2025-11-10 12:30:18.247419+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. CANDIDATE PROFILES TABLE
-- (Main candidate data - requires auth.users to exist!)
-- ============================================
INSERT INTO candidate_profiles (id, user_id, full_name, email, phone, date_of_birth, gender, address, city, country, professional_title, bio, height_cm, weight_kg, ktp_number, place_of_birth, how_found_us, registration_city, referral_name, covid_vaccinated, avatar_url, profile_step_unlocked, is_profile_public, created_at, updated_at) VALUES
('7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15', 'fail amir', 'fail.amir@students.amikom.ac.id', '083148263597', '1996-01-30', 'male', 'jln condong catur', 'sleman', 'Indonesia', 'Senior Deck Officer', 'got to beyond', 157, 55, '213123122323232222', 'jakarta', 'Social Media', 'Jakarta', 'kalisya', 'Fully Vaccinated with Booster', 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15/1762783316775.png', 3, true, '2025-11-10 12:27:59.846262+00', '2026-01-09 14:55:11.039825+00')
ON CONFLICT (id) DO NOTHING;

-- Note: Add more candidate_profiles as needed from your data

-- ============================================
-- 7. CANDIDATE CVs TABLE
-- ============================================
INSERT INTO candidate_cvs (id, candidate_id, file_name, file_path, file_size, file_type, is_default, created_at) VALUES
('3ff178f2-d60f-4ba3-8b8b-7d905e73dc8b', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'CV_FAIL-AMIR_17-OCT.pdf', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15/1762778907294.pdf', 68296, 'application/pdf', true, '2025-11-10 12:48:28.688856+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. CANDIDATE EDUCATION TABLE
-- ============================================
INSERT INTO candidate_education (id, candidate_id, institution, degree, field_of_study, start_date, end_date, is_current, created_at) VALUES
('d42506b1-b4f6-4b0b-91b7-dadf4f47ec77', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'QWERTY', 'QWERTY', NULL, '2025-11-01', '2025-11-16', false, '2025-11-16 05:11:53.803126+00'),
('310faa3e-492d-4bd3-927a-d185c24e7083', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'assas', 'asas', NULL, '2025-10-28', '2025-12-06', false, '2025-11-16 09:36:24.947181+00'),
('d95e1fb1-8fba-4a52-a1f4-8ffbf947d5f3', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'qweqweqw', 'qweqweqw', NULL, '2025-11-19', '2025-12-06', false, '2025-11-22 13:17:51.796707+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. CANDIDATE EXPERIENCE TABLE
-- ============================================
INSERT INTO candidate_experience (id, candidate_id, position, company, vessel_name_type, gt_loa, route, start_date, end_date, is_current, job_description, reason, experience_type, file_name, file_path, created_at) VALUES
('f6bcb6bb-9b38-4bda-a586-f943b137489a', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'testing', NULL, 'testing', 'testing', 'Foreign Going', '2025-10-29', '2025-11-16', false, 'testing', 'Finished Contract', 'Hotel', '1763264799220.pdf', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15/deck-experiences/1763264799220.pdf', '2025-11-16 03:46:40.329859+00'),
('d3c9db10-5c85-4533-8815-21d6690672d6', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'qwerty', NULL, 'qwerty', 'qwerty', 'Foreign Going', '2025-10-29', '2025-11-28', false, 'eqweqewqqw
asdasdas
xzczxczx', 'Finished Contract', 'Hotel', NULL, NULL, '2025-11-22 13:08:47.474082+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 10. CANDIDATE CERTIFICATES TABLE
-- ============================================
INSERT INTO candidate_certificates (id, candidate_id, type_certificate, cert_number, date_of_issue, institution, place, file_name, file_path, created_at, updated_at) VALUES
('620cd587-273f-48b5-a500-e820613859ec', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'BASIC SAFETY TRAINING (BST)', '12312312', '2025-11-16', 'QWERTY', 'QWERTY', '1763269891228.pdf', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15/deck-certificates/1763269891228.pdf', '2025-11-16 05:11:32.829662+00', '2025-11-16 05:11:32.829662+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 11. CANDIDATE TRAVEL DOCUMENTS TABLE
-- ============================================
INSERT INTO candidate_travel_documents (id, candidate_id, document_type, document_number, issue_date, expiry_date, issuing_authority, file_name, file_path, created_at, updated_at) VALUES
('22717861-8980-497a-bcc1-72f8557cc617', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'PASSPORT', '123123123', '2025-10-29', '2025-12-06', 'dsasda', '1763288164815.pdf', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15/travel-documents/1763288164815.pdf', '2025-11-16 10:16:06.210293+00', '2025-11-16 10:16:06.210293+00'),
('2ed0fe6f-0be8-4069-b6c1-a1046809d1b0', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'VISA (US / LIBERIA / PANAMA )', '12312312312322', '2025-10-28', '2025-11-22', 'dasdas', NULL, NULL, '2025-11-22 13:41:22.180602+00', '2025-11-22 13:41:22.180602+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 12. CANDIDATE MEDICAL TESTS TABLE
-- ============================================
INSERT INTO candidate_medical_tests (id, candidate_id, test_name, score, file_name, file_path, created_at, updated_at) VALUES
('1f4a5f50-24b7-43ed-90d3-29cf82d58601', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'Marlins', 80, '1765641757979.pdf', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15/medical-tests/1765641757979.pdf', '2025-12-13 16:02:55.020619+00', '2025-12-13 16:02:55.020619+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 13. CANDIDATE REFERENCES TABLE
-- ============================================
INSERT INTO candidate_references (id, candidate_id, full_name, company, position, relationship, phone, email, created_at, updated_at) VALUES
('39b815bb-90f0-4f33-b659-a37ec80782bf', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'fail amir', 'amikom', 'sadasda', 'asdasda', '083148263597', 'fail.amir@students.amikom.ac.id', '2025-11-16 09:43:09.541667+00', '2025-11-16 09:43:09.541667+00'),
('0061831a-1207-4c9c-9d3e-6e66aa44c9d8', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'fail amir', 'amikom', 'sadasda', 'asdasda', '083148263597', 'fail.amir@students.amikom.ac.id', '2025-11-16 09:43:09.794612+00', '2025-11-16 09:43:09.794612+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 14. CANDIDATE EMERGENCY CONTACTS TABLE
-- ============================================
INSERT INTO candidate_emergency_contacts (id, candidate_id, full_name, relationship, phone, email, is_primary, created_at, updated_at) VALUES
('c9639291-bb33-4c25-bb20-f81c993fb109', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'fail amir', 'Husband', '+6283148263597', 'fail.amir@students.amikom.ac.id', false, '2025-11-16 09:43:48.815724+00', '2025-11-16 09:43:48.815724+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 15. CANDIDATE NEXT OF KIN TABLE
-- ============================================
INSERT INTO candidate_next_of_kin (id, candidate_id, full_name, relationship, date_of_birth, place_of_birth, signature, created_at, updated_at) VALUES
('955ce183-cf41-41a7-b0b6-6af5b94947ba', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'fail amir', 'Husband', '2025-11-16', 'qweqweqw', 'qwewqeqw', '2025-11-16 09:51:23.297451+00', '2025-11-16 09:51:23.297451+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 16. JOB APPLICATIONS TABLE
-- ============================================
INSERT INTO job_applications (id, job_id, candidate_id, cv_id, cover_letter, status, crew_code, interview_date, interview_by, interview_result, interview_result_notes, approved_position, principal_interview_date, principal_interview_by, principal_interview_result, approved_as, employment_offer, eo_acceptance, remarks, applied_at, updated_at) VALUES
('24cc601d-05ca-490a-9205-c9b52b52416c', '06a57861-bbd3-475e-aeb5-2032370c8a84', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', '3ff178f2-d60f-4ba3-8b8b-7d905e73dc8b', 'i want this job

please hire me !!!!!!!!!!!!!!!!!!', 'interview', 'SGP-0001', '2025-12-06', 'fail amir', 'Approved', 'bagus banget', 'Cruise Director', '2025-12-06', 'fail amir', 'Reclassed', 'Cruise Director', 'Received', 'Yes', 'Step 3', '2025-11-10 13:19:30.967466+00', '2026-01-09 14:55:10.584394+00'),
('21a15073-de9c-461e-8d17-150fff191c03', '1fb981ae-aa45-446c-8cd9-08ec4cb71726', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', '3ff178f2-d60f-4ba3-8b8b-7d905e73dc8b', 'please hire me !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', 'pending', 'SGP-0004', NULL, NULL, 'Review', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Step 3', '2025-11-21 17:44:42.068763+00', '2026-01-09 14:55:05.544969+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 17. SAVED JOBS TABLE
-- ============================================
INSERT INTO saved_jobs (candidate_id, job_id, saved_at) VALUES
('7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'd3981ac1-322d-433b-9957-80b76e48111f', '2025-11-10 13:19:02.123209+00'),
('7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', '06a57861-bbd3-475e-aeb5-2032370c8a84', '2025-11-10 13:19:39.253949+00')
ON CONFLICT (candidate_id, job_id) DO NOTHING;

-- ============================================
-- 18. TESTIMONIALS TABLE
-- ============================================
INSERT INTO testimonials (id, candidate_id, testimonial, rating, is_approved, created_at, updated_at) VALUES
('76440300-efaa-49a6-877c-1b53e1da2446', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'keren banget web nya, membantu apply saya', 5, true, '2025-11-16 11:46:41.923127+00', '2025-11-21 11:40:34.766919+00'),
('05d32937-a4e5-490f-a17b-9c3ebdd05283', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'terimakasih sudah memudahkan saya :)', 5, false, '2025-11-21 17:48:43.652713+00', '2025-11-21 17:48:43.652713+00'),
('6511bb91-27b6-4441-8095-b1496592643d', '7a9d4190-83e0-4e14-aa3b-a2d07d3f752b', 'qwerty', 3, false, '2025-11-21 17:48:57.10943+00', '2025-11-21 17:48:57.10943+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 19. MESSAGES TABLE
-- ============================================
INSERT INTO messages (id, sender_id, receiver_id, subject, message, is_read, created_at, updated_at) VALUES
('a5599e5c-1eef-4e33-ba33-9cff775c1341', 'e07158fd-84df-473b-b763-d59138178971', 'e07158fd-84df-473b-b763-d59138178971', 'werwerw', 'fsdfsdfsds', true, '2025-11-21 11:41:43.548768+00', '2025-11-21 14:28:56.25032+00'),
('5d1f3d01-dda3-49e0-a748-00e8ec95d411', 'e07158fd-84df-473b-b763-d59138178971', 'e07158fd-84df-473b-b763-d59138178971', 'Re: werwerw', 'hallo', true, '2025-11-21 14:29:06.925961+00', '2025-11-21 14:34:47.490803+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 20. CONTACT SUBMISSIONS TABLE
-- ============================================
INSERT INTO contact_submissions (id, name, email, subject, message, is_read, status, created_at) VALUES
('0c0b1a2b-3c4d-5e6f-7890-abcdef123456', 'Test User', 'test@example.com', 'Test Subject', 'This is a test message', false, 'new', NOW())
ON CONFLICT (id) DO NOTHING;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- ============================================
-- EXPORT COMPLETE!
-- ============================================
-- 
-- NEXT STEPS:
-- 1. Make sure auth.users are imported first in the new project
-- 2. Run secondary-database-setup.sql to create tables
-- 3. Run this script to import all data
-- 4. Storage files (CVs, certificates, etc.) need to be
--    manually transferred between storage buckets
--
-- For complete data export, use the Cloud tab in Lovable:
-- Cloud → Database → Tables → Export for each table
-- ============================================
