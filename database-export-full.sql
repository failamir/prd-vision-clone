-- ============================================
-- FULL DATABASE EXPORT
-- Generated: 2026-01-21
-- Project: CWT Job Portal
-- ============================================

-- IMPORTANT: Run this in your NEW Supabase project AFTER running all schema migrations
-- The order of inserts respects foreign key dependencies

-- ============================================
-- SKILLS (no dependencies)
-- ============================================
-- No data in skills table

-- ============================================
-- JOB CATEGORIES (no dependencies)
-- ============================================
-- No data in job_categories table

-- ============================================
-- PERMISSIONS (no dependencies)
-- ============================================
INSERT INTO public.permissions (id, name, category, description, created_at) VALUES 
('7a0981e9-b2d0-4364-b08c-0b273296dd9d', 'manage_users', 'Users', 'Can manage user accounts', '2025-11-21 13:48:49.664019+00'),
('4cd81d08-1235-4e39-a83e-f3a83f2dee2f', 'manage_roles', 'Users', 'Can assign and remove roles', '2025-11-21 13:48:49.664019+00'),
('cd61b6f0-672f-40e8-9f5d-fef1c5ef3265', 'view_users', 'Users', 'Can view user list', '2025-11-21 13:48:49.664019+00'),
('515fb4bf-f50d-4023-944e-4562623f3c1c', 'manage_jobs', 'Jobs', 'Can create, edit, and delete jobs', '2025-11-21 13:48:49.664019+00'),
('0fd3ea71-d00b-4710-9155-c62523bc3554', 'view_jobs', 'Jobs', 'Can view job listings', '2025-11-21 13:48:49.664019+00'),
('267233f5-d37a-4bd5-a568-d804cfc900f7', 'manage_applications', 'Applications', 'Can manage job applications', '2025-11-21 13:48:49.664019+00'),
('65cd1a1a-ab54-4601-84c8-a34eacc4411c', 'view_applications', 'Applications', 'Can view job applications', '2025-11-21 13:48:49.664019+00'),
('1d0e45d1-9491-4f5d-abdd-b9c260622292', 'conduct_interviews', 'Interviews', 'Can schedule and conduct interviews', '2025-11-21 13:48:49.664019+00'),
('d0b8501f-535f-4d09-93ec-5e347d392865', 'view_interviews', 'Interviews', 'Can view interview schedules', '2025-11-21 13:48:49.664019+00'),
('478a7ce3-048e-4107-a149-2958e5aa3fff', 'manage_departments', 'Departments', 'Can manage departments', '2025-11-21 13:48:49.664019+00'),
('21a4a36e-8e1a-462a-9295-de580603d23f', 'view_reports', 'Reports', 'Can view system reports', '2025-11-21 13:48:49.664019+00'),
('6d364362-de09-4aca-a869-21053272e1d1', 'manage_testimonials', 'Content', 'Can approve and manage testimonials', '2025-11-21 13:48:49.664019+00'),
('41fe73d0-c800-400a-86a6-7ea3caa2ad92', 'send_messages', 'Messages', 'Can send messages to users', '2025-11-21 13:48:49.664019+00'),
('f233f482-cae4-4759-bb8b-2ecde9102a13', 'view_messages', 'Messages', 'Can view messages', '2025-11-21 13:48:49.664019+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- USER ROLES (depends on auth.users - insert after users are created)
-- ============================================
INSERT INTO public.user_roles (id, user_id, role, created_at) VALUES 
('5c2baed6-5efb-47c0-b40d-2b162142d6bf', '6d893660-ebe6-464a-a7f3-483036bd764d', 'admin', '2025-11-10 13:13:19.534071+00'),
('83c3e22e-8fdf-490c-810a-9433a7f6953b', '174f4259-3a29-4de4-84dc-ebce7d66f46d', 'admin', '2025-11-16 10:18:04.548141+00'),
('e80720a5-01d1-443f-9b1f-a1f9f7d80a0f', '073ed85b-4e33-45ff-86f1-4b6c770b661a', 'admin', '2025-11-16 13:32:57.095713+00'),
('98ad1ffb-c820-4c40-9c7f-b5b73c5240d1', 'd9fa71b9-550e-4dac-88b8-867836ba70e5', 'candidate', '2025-11-16 13:45:45.106387+00'),
('df30315a-943a-4a50-80f4-97ab740f9e4f', '7786ac36-bfe7-49dd-b005-43e7de326d09', 'candidate', '2025-11-16 13:45:51.098078+00'),
('a8f40609-3a61-49fc-b93b-455cd48b6684', 'adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15', 'candidate', '2025-11-16 13:46:07.890573+00'),
('bb0cc60b-c5d1-4b95-857b-e99fd6ef9e6c', '43c9a184-cea8-47de-8777-c4bfecb58e06', 'interviewer', '2025-11-21 14:41:50.64784+00'),
('425cb88e-0d50-4ff3-9852-e03d109ddedf', 'de153e3a-b560-42b9-a294-bb1bd5fc58d1', 'candidate', '2025-11-21 15:37:49.444448+00'),
('017c6045-dcd0-45af-b4a7-332a7280d3e6', '35f8fda1-4f1c-47e9-861e-4f0050794344', 'interviewer_principal', '2025-11-21 17:28:30.324349+00'),
('2be74e60-68f8-45a4-a7d2-ea31b7618450', '69b24358-8abb-4e4b-b0f8-59dfc1ade97c', 'candidate', '2025-11-24 16:07:34.230378+00'),
('c584c8d7-fbb9-46c2-b213-c1d700842d9d', '3da385ee-0c36-4956-affa-d68ec9fc6134', 'candidate', '2025-11-29 17:29:08.750369+00'),
('73daf66d-05a3-42a3-9abc-ef9591114f99', 'e4396935-f120-4ed3-975b-770d120f7540', 'pic', '2025-12-27 22:27:49.105374+00'),
('67e1f101-a58e-4b09-bbec-4ff52e5a227d', '56582a9f-e500-4f44-b0bc-d6644ce08d1d', 'pic', '2025-12-28 05:22:45.962684+00'),
('805890f8-eff4-4b45-82fa-e12fdd528e4e', '7ea3593a-ac88-44f5-8ae6-ff49c5054967', 'pic', '2025-12-28 05:23:29.78025+00'),
('a7dfcaf8-5356-4a5c-818e-2260e4e79c97', '005aacf7-b13f-4c3c-815a-6414478d07f1', 'pic', '2025-12-28 05:24:25.940509+00'),
('0b054689-fbab-4be3-9161-dca98abd30c0', '5113254d-abd8-4e1c-b474-3c0d32483229', 'pic', '2025-12-28 05:24:52.804107+00'),
('804b2de7-6ec9-4c2e-8b91-29918b913c12', 'cecc6dfb-7ca7-44f2-a609-af51c1fdbc3b', 'candidate', '2026-01-09 02:58:34.197144+00'),
('558ed416-97d5-4298-94ab-f9c7a2be6ecd', '9e1c80b7-9450-4623-8b76-3e5be68d5903', 'candidate', '2026-01-09 06:24:00.95266+00'),
('f505c3c5-9c98-4ad5-974c-9f78064b8849', '9e1c80b7-9450-4623-8b76-3e5be68d5903', 'hrd', '2026-01-09 06:24:01.238045+00'),
('eef69716-9915-4107-832e-c0dc580d88f5', '9368b6dd-4052-46a5-9b14-916ac292a74d', 'candidate', '2026-01-09 06:24:21.684836+00'),
('583ab0ac-8ed2-49ef-9e71-1f67845375d8', '9368b6dd-4052-46a5-9b14-916ac292a74d', 'hrd', '2026-01-09 06:24:21.936221+00'),
('0b973a9d-5c72-4feb-96dc-fab2ebaa0d7c', '8638907d-b593-41c3-9d7a-23810e36c36e', 'candidate', '2026-01-09 06:24:51.182758+00'),
('519dc072-01c5-423c-98c6-c90b5b5deb10', '8638907d-b593-41c3-9d7a-23810e36c36e', 'hrd', '2026-01-09 06:24:51.381601+00'),
('c5109172-d2bb-4b07-88ef-430239dfa83e', 'feb0d1c0-ab9f-4f5d-ba8d-5b2cf39fe2f8', 'candidate', '2026-01-09 06:53:29.101303+00'),
('9a77853f-aca4-46a2-aff1-cd63bc2ffbe4', 'cbb34f62-99fd-4204-b6b3-47453c3e4b0b', 'candidate', '2026-01-09 06:59:44.237309+00'),
('42165cf6-6aa0-479f-b5a6-0adf3319696b', '7ab3520d-24a1-46cb-8c93-4229d38481f2', 'candidate', '2026-01-09 07:45:08.693466+00'),
('6b49fbf4-d2b0-4d6d-b69f-a28a61e17515', '3274708b-3be9-447d-9726-5a400d0f62d6', 'candidate', '2026-01-09 10:41:37.839968+00'),
('b382d838-9879-468d-bd9f-2659a618b861', '033a084d-12dd-4126-bf22-76e6e3dedf01', 'candidate', '2026-01-09 13:39:41.945857+00'),
('e1fcd719-cb92-4c25-8734-d94a0676a174', 'a79da859-2be2-42aa-bf29-9f45b41e8e8d', 'candidate', '2026-01-09 14:14:11.517634+00'),
('6c5346d3-5de8-4865-8558-88af110ac073', '7cfdb595-8111-4181-b3bc-d19bb174b9f2', 'candidate', '2026-01-09 14:50:04.382585+00'),
('2ba05491-0934-4427-9b27-e3b365c6f9f3', '8cc097c2-1d9e-448e-9eb3-72488a256d55', 'candidate', '2026-01-09 16:08:27.883444+00'),
('6cf02817-c0d4-4b1b-97c1-6baaddedb9d9', '97598735-5368-405e-af9c-9713c412219a', 'candidate', '2026-01-09 18:11:24.474584+00'),
('ee54ceca-10d4-40e6-a478-3372b728a0aa', 'a909cc3e-cbe2-4270-8dbd-ef78dd574c79', 'candidate', '2026-01-09 23:27:14.663377+00'),
('f986aa8b-72ad-4c38-bf5c-e295ffc4ceec', '297419bc-453e-4985-8b4d-8e71c4e8b6f5', 'candidate', '2026-01-10 05:20:52.021072+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CONTACT SUBMISSIONS (no dependencies)
-- ============================================
INSERT INTO public.contact_submissions (id, name, email, subject, message, is_read, status, created_at) VALUES 
('cfed2f3f-67fc-4b1e-9766-e6e43187a2f5', 'Cici', 'ciciwulandari643@gmail.com', 'Job Apllications', 'Excuse me, sir/ma''am.
I would like to inquire about the job application I submitted for a position as a waiter. Have you made a decision yet, sir/ma''am?
Thank you in advance.', true, 'new', '2025-12-13 02:29:02.28435+00'),
('3fb4e811-5c23-4906-9e06-da9d82b27580', 'agus sutiyono', 'agussutiyono@gmail.com', 'job application-laundry attendant', 'i am writing to apply for the position of Laundry attendant on board your cruise ship', false, 'new', '2025-12-13 16:07:34.12221+00'),
('51306a27-afa7-406f-afc5-eb4c69c8e0e5', 'Khoirudin', 'khoirudin100184@gmail.com', 'How to apply ', 'I need job plumber ', false, 'new', '2025-12-16 05:20:07.828409+00'),
('f94257d0-fe50-4097-ba3e-c25d256cebd2', 'Syaiful Rahman', 'radenrahman997@gmail.com', 'GOOD DAY SIR / MADAM', 'GOOD DAY SIR / MADAM

EXCAUSME , LET ME INTRODUCE MY SELF
MY NAME IS : SYAIFUL RAHMAN
I AM                :  20 YEARS OLD
AND I AM SEAMEN WITH THE POSITION OF : WIPPER
MY PURPOSE HERE IS TO APPLY FOR A JOB AT YOUR COMPANY IF THERE IS STILL A VACANCY FOR ME', false, 'new', '2025-12-17 02:52:16.478117+00'),
('385a5d56-bcec-4fac-aca1-912aaec29bb0', 'I wayan gede pratama', 'pratamagede010312@gmail.com', 'Job search', 'Hello good evening
I just want to ask , is there any opening job ousekeeping attendant on cruise??', false, 'new', '2025-12-20 13:09:53.177798+00'),
('4fda03dc-b4f1-42f7-86d6-c8d599db2575', 'SHUBHAM MANSARAM SHARMA ', '786tanisharma@gmail.com', 'How to join in cruise ship ?', 'I AM INTERESTED TO JOIN IN UR CRUISE SHIP ', false, 'new', '2025-12-25 11:00:38.481811+00'),
('ad98e778-7f22-495e-a707-9846f4326a99', 'Vishal Singh', 'vishalsingh5398@gmail.com', 'Querie regarding ktp number', 'I am Indian i don''t have ktp number so what should i fill in that column and also what should i fill in which city i want to register in profile section.', false, 'new', '2025-12-26 06:23:53.93948+00'),
('8659cad4-fd99-4c05-93d1-378d711c4b05', 'Putu doni Pradika', 'putudonipradika@gmail.com', 'Please help me.i want join work in the cruise ship', 'Can you help me to work on a cruise ship? I want to change my family''s economy.', false, 'new', '2025-12-29 08:17:07.444391+00'),
('b610b820-e632-4246-bdda-26b6c8715c53', 'Singgih Bayu Sukmawan', 'Sbayu2207@gmail.com', 'Application for Housekeeping Attendant', 'I am writing to express my interest in the HouseKeeping Attendant position . With my background in Banana Island resort Doha by Anantara Qatar as a Housekeeping attendant for 2 years, I am confident in my ability to contribute to your team.', false, 'new', '2025-12-30 05:08:32.717934+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- NOTE: The following tables require candidate_profiles to be inserted first
-- candidate_profiles depends on auth.users existing
-- ============================================

-- IMPORTANT: Users must be manually exported from Supabase Authentication dashboard
-- Go to: Authentication > Users > Export
-- Then import to new project BEFORE running these INSERT statements

-- ============================================
-- END OF EXPORT
-- ============================================

-- Additional tables with data (truncated for file size):
-- - candidate_profiles: Contains profile data for all candidates
-- - jobs: Contains 3 job listings  
-- - job_applications: Contains job application data
-- - candidate_experience: Contains work experience records
-- - candidate_education: Contains education records
-- - candidate_certificates: Contains certificate records
-- - candidate_travel_documents: Contains passport/visa records
-- - candidate_cvs: Contains CV file references
-- - candidate_medical_tests: Contains medical test records
-- - candidate_emergency_contacts: Contains emergency contact info
-- - candidate_next_of_kin: Contains next of kin info
-- - candidate_references: Contains reference contacts
-- - candidate_form_letters: Contains form letter files
-- - saved_jobs: Contains saved job records
-- - messages: Contains internal messages
-- - testimonials: Contains testimonial data

-- For full data export of all tables, use the Cloud Database Export feature:
-- 1. Go to Cloud tab in Lovable
-- 2. Navigate to Database > Tables
-- 3. Select each table and click Export

