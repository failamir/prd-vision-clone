-- ============================================
-- DATA EXPORT SCRIPT
-- Run this script in your CURRENT Supabase project
-- to export all data for migration
-- ============================================

-- Instructions:
-- 1. Go to your Lovable project backend (click "View Backend" button)
-- 2. Run this script in the SQL Editor
-- 3. Copy all the INSERT statements generated
-- 4. Run them in your NEW Supabase project after running all migrations

-- ============================================
-- EXPORT SKILLS (no dependencies)
-- ============================================
SELECT 
  'INSERT INTO public.skills (id, name, category, created_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(name) || ', ' ||
  COALESCE(quote_literal(category), 'NULL') || ', ' ||
  quote_literal(created_at::text) || '::timestamptz);'
FROM public.skills;

-- ============================================
-- EXPORT JOB CATEGORIES (no dependencies)
-- ============================================
SELECT 
  'INSERT INTO public.job_categories (id, name, description, slug, created_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(name) || ', ' ||
  COALESCE(quote_literal(description), 'NULL') || ', ' ||
  quote_literal(slug) || ', ' ||
  quote_literal(created_at::text) || '::timestamptz);'
FROM public.job_categories;

-- ============================================
-- EXPORT USER ROLES (depends on auth.users)
-- ============================================
SELECT 
  'INSERT INTO public.user_roles (id, user_id, role, created_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(user_id::text) || '::uuid, ' ||
  quote_literal(role::text) || '::app_role, ' ||
  quote_literal(created_at::text) || '::timestamptz);'
FROM public.user_roles;

-- ============================================
-- EXPORT CANDIDATE PROFILES (depends on auth.users)
-- ============================================
SELECT 
  'INSERT INTO public.candidate_profiles (id, user_id, full_name, email, phone, professional_title, bio, date_of_birth, gender, address, city, country, website, avatar_url, linkedin_url, facebook_url, twitter_url, expected_salary_min, expected_salary_max, salary_currency, is_profile_public, height_cm, weight_kg, place_of_birth, ktp_number, registration_city, referral_name, how_found_us, covid_vaccinated, created_at, updated_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(user_id::text) || '::uuid, ' ||
  quote_literal(full_name) || ', ' ||
  quote_literal(email) || ', ' ||
  COALESCE(quote_literal(phone), 'NULL') || ', ' ||
  COALESCE(quote_literal(professional_title), 'NULL') || ', ' ||
  COALESCE(quote_literal(bio), 'NULL') || ', ' ||
  COALESCE(quote_literal(date_of_birth::text), 'NULL') || '::date, ' ||
  COALESCE(quote_literal(gender), 'NULL') || ', ' ||
  COALESCE(quote_literal(address), 'NULL') || ', ' ||
  COALESCE(quote_literal(city), 'NULL') || ', ' ||
  COALESCE(quote_literal(country), 'NULL') || ', ' ||
  COALESCE(quote_literal(website), 'NULL') || ', ' ||
  COALESCE(quote_literal(avatar_url), 'NULL') || ', ' ||
  COALESCE(quote_literal(linkedin_url), 'NULL') || ', ' ||
  COALESCE(quote_literal(facebook_url), 'NULL') || ', ' ||
  COALESCE(quote_literal(twitter_url), 'NULL') || ', ' ||
  COALESCE(expected_salary_min::text, 'NULL') || ', ' ||
  COALESCE(expected_salary_max::text, 'NULL') || ', ' ||
  COALESCE(quote_literal(salary_currency), 'NULL') || ', ' ||
  COALESCE(is_profile_public::text, 'true') || ', ' ||
  COALESCE(height_cm::text, 'NULL') || ', ' ||
  COALESCE(weight_kg::text, 'NULL') || ', ' ||
  COALESCE(quote_literal(place_of_birth), 'NULL') || ', ' ||
  COALESCE(quote_literal(ktp_number), 'NULL') || ', ' ||
  COALESCE(quote_literal(registration_city), 'NULL') || ', ' ||
  COALESCE(quote_literal(referral_name), 'NULL') || ', ' ||
  COALESCE(quote_literal(how_found_us), 'NULL') || ', ' ||
  COALESCE(quote_literal(covid_vaccinated), 'NULL') || ', ' ||
  quote_literal(created_at::text) || '::timestamptz, ' ||
  quote_literal(updated_at::text) || '::timestamptz);'
FROM public.candidate_profiles;

-- ============================================
-- EXPORT JOBS (depends on auth.users as employer)
-- ============================================
SELECT 
  'INSERT INTO public.jobs (id, employer_id, category_id, title, description, company_name, location, department, job_type, experience_level, education_level, salary_min, salary_max, salary_currency, positions_available, requirements, responsibilities, benefits, is_active, is_featured, is_urgent, created_at, updated_at, expires_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(employer_id::text) || '::uuid, ' ||
  COALESCE(quote_literal(category_id::text), 'NULL') || '::uuid, ' ||
  quote_literal(title) || ', ' ||
  quote_literal(description) || ', ' ||
  quote_literal(company_name) || ', ' ||
  quote_literal(location) || ', ' ||
  COALESCE(quote_literal(department), 'NULL') || ', ' ||
  quote_literal(job_type) || ', ' ||
  COALESCE(quote_literal(experience_level), 'NULL') || ', ' ||
  COALESCE(quote_literal(education_level), 'NULL') || ', ' ||
  COALESCE(salary_min::text, 'NULL') || ', ' ||
  COALESCE(salary_max::text, 'NULL') || ', ' ||
  COALESCE(quote_literal(salary_currency), '''USD''') || ', ' ||
  COALESCE(positions_available::text, '1') || ', ' ||
  COALESCE(quote_literal(requirements), 'NULL') || ', ' ||
  COALESCE(quote_literal(responsibilities), 'NULL') || ', ' ||
  COALESCE(quote_literal(benefits), 'NULL') || ', ' ||
  COALESCE(is_active::text, 'true') || ', ' ||
  COALESCE(is_featured::text, 'false') || ', ' ||
  COALESCE(is_urgent::text, 'false') || ', ' ||
  quote_literal(created_at::text) || '::timestamptz, ' ||
  quote_literal(updated_at::text) || '::timestamptz, ' ||
  COALESCE(quote_literal(expires_at::text), 'NULL') || '::timestamptz);'
FROM public.jobs;

-- ============================================
-- EXPORT CANDIDATE CVS (depends on candidate_profiles)
-- ============================================
SELECT 
  'INSERT INTO public.candidate_cvs (id, candidate_id, file_name, file_path, file_type, file_size, is_default, created_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(candidate_id::text) || '::uuid, ' ||
  quote_literal(file_name) || ', ' ||
  quote_literal(file_path) || ', ' ||
  COALESCE(quote_literal(file_type), 'NULL') || ', ' ||
  COALESCE(file_size::text, 'NULL') || ', ' ||
  COALESCE(is_default::text, 'false') || ', ' ||
  quote_literal(created_at::text) || '::timestamptz);'
FROM public.candidate_cvs;

-- ============================================
-- EXPORT CANDIDATE DOCUMENTS (depends on candidate_profiles)
-- ============================================
SELECT 
  'INSERT INTO public.candidate_documents (id, candidate_id, document_type, title, description, file_name, file_path, file_type, file_size, issue_date, expiry_date, created_at, updated_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(candidate_id::text) || '::uuid, ' ||
  quote_literal(document_type) || ', ' ||
  COALESCE(quote_literal(title), 'NULL') || ', ' ||
  COALESCE(quote_literal(description), 'NULL') || ', ' ||
  quote_literal(file_name) || ', ' ||
  quote_literal(file_path) || ', ' ||
  COALESCE(quote_literal(file_type), 'NULL') || ', ' ||
  COALESCE(file_size::text, 'NULL') || ', ' ||
  COALESCE(quote_literal(issue_date::text), 'NULL') || '::date, ' ||
  COALESCE(quote_literal(expiry_date::text), 'NULL') || '::date, ' ||
  quote_literal(created_at::text) || '::timestamptz, ' ||
  quote_literal(updated_at::text) || '::timestamptz);'
FROM public.candidate_documents;

-- ============================================
-- EXPORT CANDIDATE EDUCATION (depends on candidate_profiles)
-- ============================================
SELECT 
  'INSERT INTO public.candidate_education (id, candidate_id, institution, degree, field_of_study, start_date, end_date, is_current, description, created_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(candidate_id::text) || '::uuid, ' ||
  quote_literal(institution) || ', ' ||
  quote_literal(degree) || ', ' ||
  COALESCE(quote_literal(field_of_study), 'NULL') || ', ' ||
  COALESCE(quote_literal(start_date::text), 'NULL') || '::date, ' ||
  COALESCE(quote_literal(end_date::text), 'NULL') || '::date, ' ||
  COALESCE(is_current::text, 'false') || ', ' ||
  COALESCE(quote_literal(description), 'NULL') || ', ' ||
  quote_literal(created_at::text) || '::timestamptz);'
FROM public.candidate_education;

-- ============================================
-- EXPORT CANDIDATE EXPERIENCE (depends on candidate_profiles)
-- ============================================
SELECT 
  'INSERT INTO public.candidate_experience (id, candidate_id, company, position, location, start_date, end_date, is_current, description, created_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(candidate_id::text) || '::uuid, ' ||
  quote_literal(company) || ', ' ||
  quote_literal(position) || ', ' ||
  COALESCE(quote_literal(location), 'NULL') || ', ' ||
  COALESCE(quote_literal(start_date::text), 'NULL') || '::date, ' ||
  COALESCE(quote_literal(end_date::text), 'NULL') || '::date, ' ||
  COALESCE(is_current::text, 'false') || ', ' ||
  COALESCE(quote_literal(description), 'NULL') || ', ' ||
  quote_literal(created_at::text) || '::timestamptz);'
FROM public.candidate_experience;

-- ============================================
-- EXPORT CANDIDATE MEDICAL TESTS (depends on candidate_profiles)
-- ============================================
SELECT 
  'INSERT INTO public.candidate_medical_tests (id, candidate_id, test_name, score, file_name, file_path, created_at, updated_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(candidate_id::text) || '::uuid, ' ||
  quote_literal(test_name) || ', ' ||
  COALESCE(score::text, 'NULL') || ', ' ||
  COALESCE(quote_literal(file_name), 'NULL') || ', ' ||
  COALESCE(quote_literal(file_path), 'NULL') || ', ' ||
  quote_literal(created_at::text) || '::timestamptz, ' ||
  quote_literal(updated_at::text) || '::timestamptz);'
FROM public.candidate_medical_tests;

-- ============================================
-- EXPORT CANDIDATE SKILLS (depends on candidate_profiles and skills)
-- ============================================
SELECT 
  'INSERT INTO public.candidate_skills (candidate_id, skill_id, proficiency_level) VALUES (' ||
  quote_literal(candidate_id::text) || '::uuid, ' ||
  quote_literal(skill_id::text) || '::uuid, ' ||
  COALESCE(quote_literal(proficiency_level), 'NULL') || ');'
FROM public.candidate_skills;

-- ============================================
-- EXPORT JOB APPLICATIONS (depends on jobs, candidate_profiles)
-- ============================================
SELECT 
  'INSERT INTO public.job_applications (id, job_id, candidate_id, cv_id, cover_letter, status, notes, crew_code, office_registered, source, second_position, ship_experience, previous_experience, education_background, contact_no, emergency_contact, photo_url, cv_url, letter_form_url, bst_cc, suitable, interview_by, interview_result, interview_result_notes, approved_position, marlin_english_score, neha_ces_test, test_result, principal_interview_by, principal_interview_result, approved_as, employment_offer, eo_acceptance, remarks, date_of_entry, c1d_expiry_date, interview_date, principal_interview_date, vaccin_covid_booster, applied_at, updated_at) VALUES (' ||
  quote_literal(id::text) || '::uuid, ' ||
  quote_literal(job_id::text) || '::uuid, ' ||
  quote_literal(candidate_id::text) || '::uuid, ' ||
  COALESCE(quote_literal(cv_id::text), 'NULL') || '::uuid, ' ||
  COALESCE(quote_literal(cover_letter), 'NULL') || ', ' ||
  COALESCE(quote_literal(status), '''pending''') || ', ' ||
  COALESCE(quote_literal(notes), 'NULL') || ', ' ||
  COALESCE(quote_literal(crew_code), 'NULL') || ', ' ||
  COALESCE(quote_literal(office_registered), 'NULL') || ', ' ||
  COALESCE(quote_literal(source), 'NULL') || ', ' ||
  COALESCE(quote_literal(second_position), 'NULL') || ', ' ||
  COALESCE(quote_literal(ship_experience), 'NULL') || ', ' ||
  COALESCE(quote_literal(previous_experience), 'NULL') || ', ' ||
  COALESCE(quote_literal(education_background), 'NULL') || ', ' ||
  COALESCE(quote_literal(contact_no), 'NULL') || ', ' ||
  COALESCE(quote_literal(emergency_contact), 'NULL') || ', ' ||
  COALESCE(quote_literal(photo_url), 'NULL') || ', ' ||
  COALESCE(quote_literal(cv_url), 'NULL') || ', ' ||
  COALESCE(quote_literal(letter_form_url), 'NULL') || ', ' ||
  COALESCE(quote_literal(bst_cc), 'NULL') || ', ' ||
  COALESCE(quote_literal(suitable), 'NULL') || ', ' ||
  COALESCE(quote_literal(interview_by), 'NULL') || ', ' ||
  COALESCE(quote_literal(interview_result), 'NULL') || ', ' ||
  COALESCE(quote_literal(interview_result_notes), 'NULL') || ', ' ||
  COALESCE(quote_literal(approved_position), 'NULL') || ', ' ||
  COALESCE(quote_literal(marlin_english_score), 'NULL') || ', ' ||
  COALESCE(quote_literal(neha_ces_test), 'NULL') || ', ' ||
  COALESCE(quote_literal(test_result), 'NULL') || ', ' ||
  COALESCE(quote_literal(principal_interview_by), 'NULL') || ', ' ||
  COALESCE(quote_literal(principal_interview_result), 'NULL') || ', ' ||
  COALESCE(quote_literal(approved_as), 'NULL') || ', ' ||
  COALESCE(quote_literal(employment_offer), 'NULL') || ', ' ||
  COALESCE(quote_literal(eo_acceptance), 'NULL') || ', ' ||
  COALESCE(quote_literal(remarks), 'NULL') || ', ' ||
  COALESCE(quote_literal(date_of_entry::text), 'NULL') || '::date, ' ||
  COALESCE(quote_literal(c1d_expiry_date::text), 'NULL') || '::date, ' ||
  COALESCE(quote_literal(interview_date::text), 'NULL') || '::date, ' ||
  COALESCE(quote_literal(principal_interview_date::text), 'NULL') || '::date, ' ||
  COALESCE(vaccin_covid_booster::text, 'false') || ', ' ||
  quote_literal(applied_at::text) || '::timestamptz, ' ||
  quote_literal(updated_at::text) || '::timestamptz);'
FROM public.job_applications;

-- ============================================
-- EXPORT SAVED JOBS (depends on candidate_profiles and jobs)
-- ============================================
SELECT 
  'INSERT INTO public.saved_jobs (candidate_id, job_id, saved_at) VALUES (' ||
  quote_literal(candidate_id::text) || '::uuid, ' ||
  quote_literal(job_id::text) || '::uuid, ' ||
  quote_literal(saved_at::text) || '::timestamptz);'
FROM public.saved_jobs;

-- ============================================
-- EXPORT COMPLETE
-- ============================================
-- Note: You also need to manually export auth.users data from Supabase Dashboard
-- Go to Authentication > Users and export to CSV
-- Then import to new Supabase project before running these INSERT statements
