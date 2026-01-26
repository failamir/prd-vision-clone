-- ============================================
-- SEED DATA FOR CIPTA WIRA TIRTA PROJECT
-- ============================================
-- This file will automatically run when project is remixed
-- Run order: migrations first, then seed.sql
-- ============================================

-- ============================================
-- 1. SKILLS TABLE
-- ============================================
INSERT INTO skills (id, name, category, created_at) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Navigation', 'Deck', NOW()),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Engine Maintenance', 'Engine', NOW()),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Food & Beverage', 'Hotel', NOW()),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'Housekeeping', 'Hotel', NOW()),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'Customer Service', 'Hotel', NOW()),
('f6a7b8c9-d0e1-2345-fabc-456789012345', 'Safety Training', 'Deck', NOW()),
('a7b8c9d0-e1f2-3456-abcd-567890123456', 'Marine Electronics', 'Engine', NOW()),
('b8c9d0e1-f2a3-4567-bcde-678901234567', 'First Aid', 'General', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. JOB CATEGORIES TABLE
-- ============================================
INSERT INTO job_categories (id, name, slug, description, created_at) VALUES
('c0000001-0001-0001-0001-000000000001', 'Deck Department', 'deck-department', 'All deck-related positions including navigation and safety', NOW()),
('c0000001-0001-0001-0001-000000000002', 'Engine Department', 'engine-department', 'All engine-related positions including mechanics and engineers', NOW()),
('c0000001-0001-0001-0001-000000000003', 'Hotel Department', 'hotel-department', 'All hospitality positions including F&B, housekeeping, and entertainment', NOW()),
('c0000001-0001-0001-0001-000000000004', 'Galley Department', 'galley-department', 'All kitchen and culinary positions', NOW()),
('c0000001-0001-0001-0001-000000000005', 'Entertainment', 'entertainment', 'Entertainment and recreation positions', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. PERMISSIONS TABLE
-- ============================================
INSERT INTO permissions (id, name, description, category, created_at) VALUES
('b03fb3c7-de55-48e6-a06a-4c3ea8d20e32', 'view_applications', 'Can view job applications', 'Applications', NOW()),
('be69a37a-6da3-4c47-82af-ed9cba15f88a', 'manage_applications', 'Can manage job applications', 'Applications', NOW()),
('e3a0b41d-04b7-4cf3-9f4e-dc4f3f5cf1e5', 'view_interviews', 'Can view interview schedules', 'Interviews', NOW()),
('d46af6ae-a1d2-44d6-a4e9-3f1f3dd9c0b2', 'manage_interviews', 'Can manage interview schedules', 'Interviews', NOW()),
('bf1d4bf9-64b6-433a-a7c9-ec6621f20e92', 'view_users', 'Can view users list', 'Users', NOW()),
('25acb20e-5b58-4f63-8b73-02f8d800a422', 'manage_users', 'Can manage users', 'Users', NOW()),
('67a63e01-9e81-4a95-a5e9-fba69ae2f891', 'view_jobs', 'Can view job listings', 'Jobs', NOW()),
('eab91ab9-e51d-4d06-9b6a-a85fb8f9f6e2', 'manage_jobs', 'Can create and edit job listings', 'Jobs', NOW()),
('bc7d0fb9-7fac-438f-b9e7-d3f5eb9e1b26', 'view_departures', 'Can view departure schedules', 'Departures', NOW()),
('e3d8d0c8-1f8a-4820-bb96-b5e6a9d7c0e3', 'manage_departures', 'Can manage departure schedules', 'Departures', NOW()),
('a1f2e3d4-c5b6-7a89-0123-456789abcdef', 'view_messages', 'Can view messages', 'Messages', NOW()),
('b2e3f4a5-d6c7-8b90-1234-567890abcdef', 'send_messages', 'Can send messages', 'Messages', NOW()),
('c3f4a5b6-e7d8-9c01-2345-678901abcdef', 'manage_messages', 'Can manage all messages', 'Messages', NOW()),
('d4a5b6c7-f8e9-0d12-3456-789012abcdef', 'view_testimonials', 'Can view testimonials', 'Testimonials', NOW()),
('e5b6c7d8-a9f0-1e23-4567-890123abcdef', 'manage_testimonials', 'Can approve/reject testimonials', 'Testimonials', NOW()),
('f6c7d8e9-b0a1-2f34-5678-901234abcdef', 'view_contact_submissions', 'Can view contact submissions', 'Contact', NOW()),
('a7d8e9f0-c1b2-3a45-6789-012345abcdef', 'manage_contact_submissions', 'Can manage contact submissions', 'Contact', NOW()),
('b8e9f0a1-d2c3-4b56-7890-123456abcdef', 'view_reports', 'Can view reports and analytics', 'Reports', NOW()),
('c9f0a1b2-e3d4-5c67-8901-234567abcdef', 'manage_roles', 'Can manage user roles', 'Roles', NOW()),
('d0a1b2c3-f4e5-6d78-9012-345678abcdef', 'manage_permissions', 'Can manage role permissions', 'Permissions', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. ROLE PERMISSIONS (Default mappings)
-- ============================================
-- Admin gets all permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Superadmin gets all permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'superadmin', id FROM permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Staff permissions
INSERT INTO role_permissions (role, permission_id) VALUES
('staff', 'b03fb3c7-de55-48e6-a06a-4c3ea8d20e32'), -- view_applications
('staff', 'e3a0b41d-04b7-4cf3-9f4e-dc4f3f5cf1e5'), -- view_interviews
('staff', '67a63e01-9e81-4a95-a5e9-fba69ae2f891'), -- view_jobs
('staff', 'bc7d0fb9-7fac-438f-b9e7-d3f5eb9e1b26'), -- view_departures
('staff', 'a1f2e3d4-c5b6-7a89-0123-456789abcdef'), -- view_messages
('staff', 'b2e3f4a5-d6c7-8b90-1234-567890abcdef')  -- send_messages
ON CONFLICT (role, permission_id) DO NOTHING;

-- HRD permissions
INSERT INTO role_permissions (role, permission_id) VALUES
('hrd', 'b03fb3c7-de55-48e6-a06a-4c3ea8d20e32'), -- view_applications
('hrd', 'be69a37a-6da3-4c47-82af-ed9cba15f88a'), -- manage_applications
('hrd', 'e3a0b41d-04b7-4cf3-9f4e-dc4f3f5cf1e5'), -- view_interviews
('hrd', 'd46af6ae-a1d2-44d6-a4e9-3f1f3dd9c0b2'), -- manage_interviews
('hrd', 'bf1d4bf9-64b6-433a-a7c9-ec6621f20e92'), -- view_users
('hrd', '67a63e01-9e81-4a95-a5e9-fba69ae2f891'), -- view_jobs
('hrd', 'eab91ab9-e51d-4d06-9b6a-a85fb8f9f6e2'), -- manage_jobs
('hrd', 'bc7d0fb9-7fac-438f-b9e7-d3f5eb9e1b26'), -- view_departures
('hrd', 'e3d8d0c8-1f8a-4820-bb96-b5e6a9d7c0e3'), -- manage_departures
('hrd', 'a1f2e3d4-c5b6-7a89-0123-456789abcdef'), -- view_messages
('hrd', 'b2e3f4a5-d6c7-8b90-1234-567890abcdef'), -- send_messages
('hrd', 'c3f4a5b6-e7d8-9c01-2345-678901abcdef')  -- manage_messages
ON CONFLICT (role, permission_id) DO NOTHING;

-- PIC permissions
INSERT INTO role_permissions (role, permission_id) VALUES
('pic', 'b03fb3c7-de55-48e6-a06a-4c3ea8d20e32'), -- view_applications
('pic', 'e3a0b41d-04b7-4cf3-9f4e-dc4f3f5cf1e5'), -- view_interviews
('pic', '67a63e01-9e81-4a95-a5e9-fba69ae2f891'), -- view_jobs
('pic', 'bc7d0fb9-7fac-438f-b9e7-d3f5eb9e1b26'), -- view_departures
('pic', 'a1f2e3d4-c5b6-7a89-0123-456789abcdef'), -- view_messages
('pic', 'b2e3f4a5-d6c7-8b90-1234-567890abcdef')  -- send_messages
ON CONFLICT (role, permission_id) DO NOTHING;

-- Interviewer permissions
INSERT INTO role_permissions (role, permission_id) VALUES
('interviewer', 'b03fb3c7-de55-48e6-a06a-4c3ea8d20e32'), -- view_applications
('interviewer', 'e3a0b41d-04b7-4cf3-9f4e-dc4f3f5cf1e5'), -- view_interviews
('interviewer', 'd46af6ae-a1d2-44d6-a4e9-3f1f3dd9c0b2'), -- manage_interviews
('interviewer', '67a63e01-9e81-4a95-a5e9-fba69ae2f891'), -- view_jobs
('interviewer', 'a1f2e3d4-c5b6-7a89-0123-456789abcdef'), -- view_messages
('interviewer', 'b2e3f4a5-d6c7-8b90-1234-567890abcdef')  -- send_messages
ON CONFLICT (role, permission_id) DO NOTHING;

-- Interviewer Principal permissions (same as interviewer + manage_applications)
INSERT INTO role_permissions (role, permission_id) VALUES
('interviewer_principal', 'b03fb3c7-de55-48e6-a06a-4c3ea8d20e32'), -- view_applications
('interviewer_principal', 'be69a37a-6da3-4c47-82af-ed9cba15f88a'), -- manage_applications
('interviewer_principal', 'e3a0b41d-04b7-4cf3-9f4e-dc4f3f5cf1e5'), -- view_interviews
('interviewer_principal', 'd46af6ae-a1d2-44d6-a4e9-3f1f3dd9c0b2'), -- manage_interviews
('interviewer_principal', '67a63e01-9e81-4a95-a5e9-fba69ae2f891'), -- view_jobs
('interviewer_principal', 'a1f2e3d4-c5b6-7a89-0123-456789abcdef'), -- view_messages
('interviewer_principal', 'b2e3f4a5-d6c7-8b90-1234-567890abcdef')  -- send_messages
ON CONFLICT (role, permission_id) DO NOTHING;

-- ============================================
-- SEED COMPLETE!
-- ============================================
-- 
-- NOTE: User accounts cannot be seeded via SQL because they 
-- require auth.users which is managed by Supabase Auth.
-- 
-- To create staff accounts after remix:
-- 1. Create superadmin account via /admin/setup
-- 2. Login as superadmin
-- 3. Go to /admin/setup and click "Seed Staff Accounts"
--    OR call the edge function: seed-staff-accounts
-- 
-- Default staff accounts that will be created:
-- - kalisya@ciptawiratirta.com (interviewer)
-- - aman@ciptawiratirta.com (interviewer_principal)
-- - pic.jakarta@ciptawiratirta.com (pic)
-- - pic.bali@ciptawiratirta.com (pic)
-- - pic.yogyakarta@ciptawiratirta.com (pic)
-- - pic.surabaya@ciptawiratirta.com (pic)
-- - pic.bandung@ciptawiratirta.com (pic)
-- - hrd1.internal@ciptawiratirta.com (hrd)
-- - hrd2.internal@ciptawiratirta.com (hrd)
-- - hrd.external@ciptawiratirta.com (hrd)
-- 
-- Default password: Cwt@2025!
-- ============================================
