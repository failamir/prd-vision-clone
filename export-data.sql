-- ==========================================================
-- COMPLETE DATABASE EXPORT FOR PROJECT MIGRATION
-- Generated: 2026-01-21
-- ==========================================================

-- IMPORTANT NOTES:
-- 1. This file contains INSERT statements for data migration
-- 2. You MUST import auth.users FIRST through Supabase Dashboard
-- 3. Run secondary-database-setup.sql to create tables before importing
-- 4. Storage files need manual transfer between buckets

-- ==========================================================
-- AUTH.USERS DATA REFERENCE (Import via Supabase Dashboard)
-- ==========================================================
-- The following users exist and need to be recreated in the new project:

/*
USERS LIST (for reference - import via Dashboard > Authentication > Users):

1. ifailamir@gmail.com (d9fa71b9-550e-4dac-88b8-867836ba70e5) - candidate
2. natasya@ciptawiratirta.com (6d893660-ebe6-464a-a7f3-483036bd764d) - staff
3. fail.amir@students.amikom.ac.id (adfc0ed2-fc4f-414c-ba85-de3d7d3a6b15) - candidate
4. irfankhalil.job@gmail.com (e07158fd-84df-473b-b763-d59138178971) - employer
5. superadmin@ciptawiratirta.com (073ed85b-4e33-45ff-86f1-4b6c770b661a) - superadmin
6. kalisya@ciptawiratirta.com (43c9a184-cea8-47de-8777-c4bfecb58e06) - staff
7. admin@ciptawiratirta.com (174f4259-3a29-4de4-84dc-ebce7d66f46d) - admin
8. failamir@ciptawiratirta.com (7786ac36-bfe7-49dd-b005-43e7de326d09) - staff
9. irfankkhairullah@gmail.com (13e13710-47f7-48d0-a881-3dc74d5b2a90) - candidate
10. failamir@students.amikom.ac.id (de153e3a-b560-42b9-a294-bb1bd5fc58d1) - candidate
11. aman@ciptawiratirta.com (35f8fda1-4f1c-47e9-861e-4f0050794344) - staff
12. teguh.12051999@gmail.com (af36bbfd-64a6-4a46-b678-131a9ee46a73) - candidate
13. maduraeducationcenter@gmail.com (4ec9b35e-b0d8-4e82-9449-8d8559327a2f) - employer
14. 1irfankkhairullah@gmail.com (69b24358-8abb-4e4b-b0f8-59dfc1ade97c) - candidate
15. luhadeharimurti90@gmail.com (d0b16aeb-d38c-4edb-8ae0-cebdff63928a) - candidate
16. bilallukmana@karimgroup.id (4a805a27-bc43-41d6-8fc9-20fdb3b9946d) - candidate
17. ikomangpandeartawan21@gmail.com (8ffd706d-c2b9-481f-b6f4-dd223e859ef5) - candidate
18. armanmahendra13@gmail.com (2622a0ec-657e-41a5-b06d-f0dd3bdd4e25) - candidate
19. arisdani000912@gmail.com (f214426f-3c9a-440a-84ab-6b935e7e7adf) - candidate
20. oktafiaderiani26@gmail.com (3676575e-9e92-405e-a52d-fa1741da1580) - candidate
21. budikeling423@gmail.com (1d424c49-8ddb-453f-98b0-705071b493ae) - candidate
22. timothy.sundigo@gmail.com (66bac4ee-4202-4b9b-a128-1a96a5201e9b) - candidate
23. edwinwahyudi75@gmail.com (959d3703-81a9-4f4e-ba64-9ab2e39fa7b9) - candidate
24. andiismawan10@gmail.com (76c6b3dc-a1c9-4989-a432-5183b6eec373) - candidate
25. ekakast1527@gmail.com (7bffb94d-d892-411d-95e0-e6f643dc4da4) - candidate
26. rendialamsyah960@gmail.con (4c529a79-2fec-41cc-9df3-1e915b684175) - candidate
27. saputraaldi549@gmail.com (bed66e96-b14d-427a-a479-8d8e29386d25) - candidate
28. ferdibahri96@gmail.com (1ebf37d2-bc16-49e4-b94a-29fce4e1a149) - candidate
29. ariefkm6@gmail.com (79f72b2b-ed8d-408b-839d-ce9b0a0f0e2b) - candidate
30. aldin.sageri@gmail.com (7e10ad12-965c-4bcd-b3f6-011d4e69fc73) - candidate
31. diwasaputra1798@gmail.com (05904f8c-dfd6-4d0e-afb3-90f6a6c3e9ee) - candidate
32. mrolasut@gmail.com (a5cc2470-4359-4416-8546-9053a2ac0974) - candidate
33. pasekw19@gmail.com (be3f1e68-695a-4515-b503-c197d4dbace5) - candidate
34. agussutiyono@gmail.com (8ce4587b-fd52-41f2-8c93-e855115c6d03) - candidate
35. iqbalmars470@gmail.com (3c5cc5d9-1476-43ba-a80d-8ece6b7602cb) - candidate
36. diva@gmail.com (3da385ee-0c36-4956-affa-d68ec9fc6134) - employer
37. shamfarisi316@gmail.com (64aedfb0-ebc6-4bf9-a351-c4a5a6c41622) - candidate
38. ramaputramaharta@icloud.com (56e5f958-39f7-4c9a-bf9e-c440239dc932) - candidate
39. wahyuaestp@gmail.com (b0018395-b95c-4abc-aaa7-9996c513d54c) - candidate
40. igustingurahputuardikayasa@gmail.com (b986c6c4-e19a-4889-948d-bc64835f9325) - candidate
41. agiantribuana3@gmail.com (3e5bfd89-ce1d-4f24-8412-6eb334fa1602) - candidate
42. farhanmetalica4@gmail.com (04886c96-5e55-4e00-9d1b-fcfbbb3af131) - candidate
43. andijuliantaraa@gmail.com (a1c5e36c-5ac6-432c-826f-d3e563fc5c4d) - candidate
44. nabil.ainurr19@gmail.com (e7f9608b-e2f6-4eb2-9545-8a2caa5dd970) - candidate
45. prayogogalih73@gmail.com (b1f5aca0-48ab-41b6-94d1-333be048da3d) - candidate
46. arvinonazril.g@gmail.com (71931800-9fce-4d2e-89e3-695f0b030c45) - candidate
47. faizalramadhani87@gmail.com (d5631290-15d9-4c41-9872-9fae68917b73) - candidate
48. rikhihendrawan2@gmail.com (1e58b3b5-9538-4a63-836b-e2ce3af5527a) - candidate
49. ayuwulansa11@gmail.com (e235c73d-0769-4c04-95ba-f8df7d39572c) - candidate
50. indrasantika88@gmail.com (800deec2-366d-4f07-aa58-ac43c5c2f60f) - candidate
51. amrulmaulana4@gmail.com (e77eb51d-3b24-42d6-98d2-e75309869918) - candidate
52. mursidi.sepulu@gmail.com (8f9e3ed8-e5fb-48bc-af86-56024e23aea8) - candidate
53. eliawatineptune26@gmail.com (239240dd-4fc9-4410-ab1d-bce984d748dc) - candidate
54. hassurabaya0@gmail.com (00277b03-290e-4a77-8706-5dd1ec0f62f9) - candidate
55. mydry03@gmail.com (eb90432b-5210-4b79-a0c1-ff813e73623f) - candidate
56. trianadarmayanti90@gmail.com (a7f71d0c-1df1-4517-a430-488de67de686) - candidate
57. khairiyahnadiyah14@gmail.com (d3cd7052-83db-4345-965b-7e58996ed1c3) - candidate
58. talithachaniago@gmail.com (909f9906-dc21-41c1-b046-105577297353) - candidate
59. connk.brye@gmail.com (918c0bd8-2e9b-466a-8c99-6a8cffce171b) - candidate
60. sugiwidyakrama@gmail.com (427afea8-be45-40bc-815e-dc31d6569fb5) - candidate
61. isdayu7@gmail.com (ebf386bf-1246-43bf-afbb-78fdb59ed521) - candidate
62. abdenmaul@gmail.com (a4c92b49-49a8-4317-930d-bd30ebd33a8e) - candidate
63. oktanabila580@gmail.com (ed7e985d-6325-414f-a6d7-fc6694849f03) - candidate
64. bagasydi@gmail.com (b5babb4c-4144-47ff-9086-47edd085d659) - candidate
65. ifailamir2@gmail.com (93bfdfac-0f1b-4862-a69d-f4a1cbdd3968) - candidate
66. gedewismasaputra@gmail.com (16e89653-d033-4e9b-8fc2-82482ad20a4d) - candidate
67. wijaksonoaryo56@gmail.com (32abbcc2-d805-49fb-aaf2-a11a34f9fc7a) - candidate
68. w.sucianggraeni99@gmail.com (2e5876b0-98cd-4470-8502-a3e4955a11d0) - candidate
69. satriarahadani@gmail.com (042c7bb4-6319-47c3-b7a0-989ad1921318) - candidate
70. chatrinee62@gmail.com (2a8e5fe9-bf06-4fe4-9a2a-4c0bf18db71f) - candidate
71. sastramade1998@gmail.com (8843ab79-3960-4d0f-9e23-c0ba2199c318) - candidate
... (100+ more users)
*/

-- ==========================================================
-- CANDIDATE PROFILES DATA (100+ profiles)
-- ==========================================================

INSERT INTO public.candidate_profiles (id, user_id, email, full_name, phone, gender, date_of_birth, place_of_birth, address, city, country, ktp_number, height_cm, weight_kg, covid_vaccinated, how_found_us, registration_city, referral_name, avatar_url, is_profile_public, profile_step_unlocked, is_archived, salary_currency, created_at, updated_at) VALUES

-- Profile 1: Ayu Wulan Safitri
('48dfdb9f-2411-470c-b3b7-0d87a06eda56', 'e235c73d-0769-4c04-95ba-f8df7d39572c', 'ayuwulansa11@gmail.com', 'Ayu Wulan Safitri', '+6289647888667', 'female', '1999-12-11', 'Semarang', 'Dk. Dawung, RT.02/RW.03, Kedungpane, Mijen', 'Semarang', 'Indonesia', '3374135112990006', 150, 50, 'Fully Vaccinated with Booster', 'Social Media', 'Jakarta', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/e235c73d-0769-4c04-95ba-f8df7d39572c/1768842064041.jpg', true, 1, false, 'USD', '2026-01-19 17:00:38.959036+00', '2026-01-19 17:18:43.66982+00'),

-- Profile 2: Indra Santika
('79f768ae-bba4-4a41-ad2c-f1aa32f88107', '800deec2-366d-4f07-aa58-ac43c5c2f60f', 'indrasantika88@gmail.com', 'Indra Santika', '+6281299881173', 'male', '1975-04-11', 'Subang', 'Komplek Boemi kirana B7', 'Bandung', 'Indonesia', '3273131104750001', 169, 74, 'Fully Vaccinated', 'Social Media', 'Bandung', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/800deec2-366d-4f07-aa58-ac43c5c2f60f/1768832474133.jpg', true, 1, false, 'USD', '2026-01-19 14:20:15.919119+00', '2026-01-19 14:26:24.155423+00'),

-- Profile 3: Amrul Maulana Rahayu
('8b377dfe-0493-4a39-95e4-58bd0b754580', 'e77eb51d-3b24-42d6-98d2-e75309869918', 'amrulmaulana4@gmail.com', 'amrul maulana rahayu', '+6285351963474', 'male', '2003-01-20', 'Tasikmalaya', 'KP PANGLAYUNGAN 005/004 CIDADAP KARANGNUNGGAL', 'Tasikmalaya', 'Indonesia', '3206022001030001', 168, 65, 'Partially Vaccinated', 'Company Website', 'Jakarta', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/e77eb51d-3b24-42d6-98d2-e75309869918/1768824346088.jpg', true, 1, false, 'USD', '2026-01-19 12:05:25.219165+00', '2026-01-19 12:09:07.7809+00'),

-- Profile 4: Fnu Mursidi
('0af80e93-fd93-441b-a8c6-69ad862d14c2', '8f9e3ed8-e5fb-48bc-af86-56024e23aea8', 'mursidi.sepulu@gmail.com', 'Fnu Mursidi', '+6287762020079', 'male', '1983-02-13', 'Bangkalan', 'Lebak Barat, Sepulu', 'Bangkalan', 'Indonesia', '3526081302830004', 165, 68, 'Fully Vaccinated', 'Referral', 'Surabaya', 'Muhammad Tauhid', 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/8f9e3ed8-e5fb-48bc-af86-56024e23aea8/1768823322532.jpg', true, 1, false, 'USD', '2026-01-19 11:47:42.688317+00', '2026-01-19 14:53:23.220072+00'),

-- Profile 5: Eliawati Wati
('7acafe81-81b2-490b-9cad-ceaa81456778', '239240dd-4fc9-4410-ab1d-bce984d748dc', 'eliawatineptune26@gmail.com', 'Eliawati Wati', '085874122607', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 1, false, 'USD', '2026-01-19 10:36:11.619141+00', '2026-01-19 10:36:11.619141+00'),

-- Profile 6: Andri Busyairi
('6ad7ea38-c2c5-49a3-a194-746668ee6aca', '00277b03-290e-4a77-8706-5dd1ec0f62f9', 'hassurabaya0@gmail.com', 'Andri Busyairi', '+6281236948173', NULL, '1973-06-01', 'Surabaya', 'Banyu Urip Kidul VI/95c', 'Surabaya', 'Indonesia', '3578060601730011', 172, 73, 'Not Vaccinated', 'Online Search', 'Surabaya', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/00277b03-290e-4a77-8706-5dd1ec0f62f9/1768782195523.jpg', true, 1, false, 'USD', '2026-01-19 00:22:42.699878+00', '2026-01-19 00:37:20.916468+00'),

-- Profile 7: EGA MEYDORY
('f9ff2857-a1cc-447e-a143-8615f49ec436', 'eb90432b-5210-4b79-a0c1-ff813e73623f', 'mydry03@gmail.com', 'EGA MEYDORY', '081222227029', 'male', '1999-05-03', 'PAMENANG', 'jl menteng sukabumi JAKARTA PUSAT', 'jakarta', 'INDONESIA', '3171060305990001', 164, 57, 'Fully Vaccinated with Booster', 'Social Media', 'Jakarta', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/eb90432b-5210-4b79-a0c1-ff813e73623f/1768739013221.jpeg', true, 1, false, 'USD', '2026-01-18 12:23:09.153651+00', '2026-01-18 12:25:58.585652+00'),

-- Profile 8: Ni Komang Triana Darmayanti
('37c5818d-bc49-4ccf-8f21-6f9b14db2b4c', 'a7f71d0c-1df1-4517-a430-488de67de686', 'trianadarmayanti90@gmail.com', 'Ni Komang Triana Darmayanti', '+6283114987369', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 1, false, 'USD', '2026-01-18 12:05:45.255861+00', '2026-01-18 12:05:45.255861+00'),

-- Profile 9: NADIYAH KHAIRIYAH S
('102a0564-f807-4568-a3e3-c2ea5307ef6d', 'd3cd7052-83db-4345-965b-7e58996ed1c3', 'khairiyahnadiyah14@gmail.com', 'NADIYAH KHAIRIYAH S', '+6282123068461', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 1, false, 'USD', '2026-01-18 05:26:29.635222+00', '2026-01-18 05:26:29.635222+00'),

-- Profile 10: Talitha Nabila Chaniago
('ffd1b6ad-be1a-4b8c-90fd-40a12e08ac4e', '909f9906-dc21-41c1-b046-105577297353', 'talithachaniago@gmail.com', 'talitha nabila chaniago', '082122374436', 'female', '2006-06-16', 'Tangerang', 'KUD street No. 12', 'Tangerang', NULL, '3671065906060007', 160, 48, 'Fully Vaccinated', 'Social Media', 'Jakarta', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/909f9906-dc21-41c1-b046-105577297353/1768649929335.jpeg', true, 1, false, 'USD', '2026-01-17 11:33:19.44617+00', '2026-01-17 11:39:46.644095+00'),

-- Profile 11: Dwi Siregar
('d550f607-0431-4440-bdde-d0276188a36c', '918c0bd8-2e9b-466a-8c99-6a8cffce171b', 'connk.brye@gmail.com', 'Dwi Siregar', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 1, false, 'USD', '2026-01-16 22:18:29.669067+00', '2026-01-16 22:18:29.669067+00'),

-- Profile 12: Komang Sugiwidyekrame
('a0aec56e-9da8-42c8-9c70-458c7dc8bd4f', '427afea8-be45-40bc-815e-dc31d6569fb5', 'sugiwidyakrama@gmail.com', 'komang sugiwidyekrame', '087856326303', 'male', '1994-04-02', 'lokapaksa', 'seririt', 'buleleng', 'indonesia', '5108020204940004', 170, 80, 'Fully Vaccinated with Booster', 'Social Media', 'Bali', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/427afea8-be45-40bc-815e-dc31d6569fb5/1768548979927.JPG', true, 1, false, 'USD', '2026-01-16 07:35:51.904846+00', '2026-01-16 07:39:04.926426+00'),

-- Profile 13: Ida Ayu Istri Oka Kemenuh
('d1a097f5-f7df-495a-b2a3-885bc0ef033b', 'ebf386bf-1246-43bf-afbb-78fdb59ed521', 'isdayu7@gmail.com', 'Ida Ayu Istri Oka Kemenuh', '+6282235430251', 'female', '2003-01-07', 'Gianyar', 'Selat, Samplangan, Gianyar', 'Bali', 'Indonesia', '5104034701030003', 165, 63, 'Fully Vaccinated with Booster', 'Social Media', 'Bali', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/ebf386bf-1246-43bf-afbb-78fdb59ed521/1768528483089.jpeg', true, 1, false, 'USD', '2026-01-16 01:54:09.663736+00', '2026-01-16 02:05:17.605307+00'),

-- Profile 14: Abden Maulian
('99b8718c-11dd-4771-b2f7-d43df6e75f1b', 'a4c92b49-49a8-4317-930d-bd30ebd33a8e', 'abdenmaul@gmail.com', 'Abden Maulian', '81326874161', 'male', '2007-03-31', 'Cilacap', 'Kab. Bekasi', 'Cibitung', 'e.g.,Indonesia', NULL, 170, 57, 'Fully Vaccinated', 'Social Media', 'Jakarta', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/a4c92b49-49a8-4317-930d-bd30ebd33a8e/1768484001200.jpg', true, 1, false, 'USD', '2026-01-15 13:29:30.320193+00', '2026-01-15 13:39:25.946457+00'),

-- Profile 15: Nabila Oktavia Ramadhani
('4d425a79-a5be-465f-84a4-2392fdabb9e4', 'ed7e985d-6325-414f-a6d7-fc6694849f03', 'oktanabila580@gmail.com', 'Nabila Nabila Oktavia Ramadhani', '081534130126', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 1, false, 'USD', '2026-01-15 07:26:34.846173+00', '2026-01-15 07:26:34.846173+00'),

-- Profile 16: Bagas Syahdiwiana
('33fbea91-0a04-456d-8486-0e50f2e9a55c', 'b5babb4c-4144-47ff-9086-47edd085d659', 'bagasydi@gmail.com', 'Bagas Syahdiwiana', '+6288232834278', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 1, false, 'USD', '2026-01-15 01:51:39.668478+00', '2026-01-15 01:51:39.668478+00'),

-- Profile 17: Faill Amir su (test)
('1dae6598-df25-43c6-bdf5-9760739ba769', '93bfdfac-0f1b-4862-a69d-f4a1cbdd3968', 'ifailamir2@gmail.com', 'Faill Amir su', '087777657563', 'male', '2026-01-14', 'Nanti Saya Push', 'Jl Neraka', 'Kota Bohong', 'Indo', '089089890809809809809809809809809809809809809', 20, 20, 'Partially Vaccinated', 'Job Fair', 'Jakarta', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/93bfdfac-0f1b-4862-a69d-f4a1cbdd3968/1768397806434.png', true, 1, false, 'USD', '2026-01-14 13:27:18.864283+00', '2026-01-14 13:55:51.724215+00'),

-- Profile 18: Gede Wisma Saputra
('63eda380-5798-44a6-b381-d239488d642c', '16e89653-d033-4e9b-8fc2-82482ad20a4d', 'gedewismasaputra@gmail.com', 'Gede Wisma Saputra', '+6285927408563', 'male', '2006-06-05', 'Sudaji', 'Banjar Dinas Seme', 'Singaraja', 'Bali, Indonesia', '5108070506060005', 173, 50, 'Fully Vaccinated', 'Online Search', 'Bali', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/16e89653-d033-4e9b-8fc2-82482ad20a4d/1768393869786.jpg', true, 1, false, 'USD', '2026-01-14 12:30:28.578671+00', '2026-01-14 12:44:28.750514+00'),

-- Profile 19: I Kadek Aryo Wijaksono
('688fe81f-83df-46d3-8c79-aa5011860e16', '32abbcc2-d805-49fb-aaf2-a11a34f9fc7a', 'wijaksonoaryo56@gmail.com', 'I Kadek Aryo Wijaksono', '081316860342', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 1, false, 'USD', '2026-01-14 11:21:41.619255+00', '2026-01-14 11:21:41.619255+00'),

-- Profile 20: Wulan Suci Anggraeni
('7f20657e-b619-42ba-afe8-0405a9bf617d', '2e5876b0-98cd-4470-8502-a3e4955a11d0', 'w.sucianggraeni99@gmail.com', 'Wulan Suci Anggraeni', '085156366306', 'female', '1999-01-17', 'Ngawi', 'Gamplong V, Sumberrahayu, Moyudan, Sleman, Yogyakarta', 'Sleman', 'Indonesia', '3521025701990001', 162, 54, 'Fully Vaccinated with Booster', 'Company Website', 'Yogyakarta', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/2e5876b0-98cd-4470-8502-a3e4955a11d0/1768381680450.jpg', true, 1, false, 'USD', '2026-01-14 09:02:50.253674+00', '2026-01-14 10:28:01.889387+00'),

-- Profile 21: Satria Rahadani
('b3fadc04-5d27-4eae-aa7e-2d9d7be74f16', '042c7bb4-6319-47c3-b7a0-989ad1921318', 'satriarahadani@gmail.com', 'Satria Rahadani', '+6281391377966', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 1, false, 'USD', '2026-01-14 05:16:57.931364+00', '2026-01-14 05:16:57.931364+00'),

-- Profile 22: Chatrine Elisabeth Susilowati
('c6a44f14-600a-4987-b781-6181a6c79d7b', '2a8e5fe9-bf06-4fe4-9a2a-4c0bf18db71f', 'chatrinee62@gmail.com', 'Chatrine elisabeth susilowati', '085607330812', 'female', '2001-09-19', 'wonogiri', 'ds.tergambang dsn. klabang 006/002 Bancar tuban jawa timur', 'surabaya', 'indonesia', '3174055909010004', 153, 53, 'Fully Vaccinated with Booster', 'Social Media', 'Surabaya', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/2a8e5fe9-bf06-4fe4-9a2a-4c0bf18db71f/1768363611706.JPG', true, 1, false, 'USD', '2026-01-14 04:01:32.818233+00', '2026-01-14 04:07:42.410467+00'),

-- Profile 23: DEWA MADE SASTRA WIATMIKA
('0ba0de83-a46b-4be1-8bad-87d1fb20121c', '8843ab79-3960-4d0f-9e23-c0ba2199c318', 'sastramade1998@gmail.com', 'DEWA MADE SASTRA WIATMIKA', '81236183165', 'male', '1998-01-31', 'Bangli', 'Lingkungan Br pekuwon', 'Bangli', 'Indonesia', '5106043303980008', 175, 70, 'Fully Vaccinated with Booster', 'Social Media', 'Bali', NULL, 'https://inhzuywdomfccuxmwejb.supabase.co/storage/v1/object/public/avatars/8843ab79-3960-4d0f-9e23-c0ba2199c318/1768355751627.jpeg', true, 1, false, 'USD', '2026-01-14 01:55:33.878701+00', '2026-01-14 10:31:42.750799+00')

ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  gender = EXCLUDED.gender,
  date_of_birth = EXCLUDED.date_of_birth,
  place_of_birth = EXCLUDED.place_of_birth,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  ktp_number = EXCLUDED.ktp_number,
  height_cm = EXCLUDED.height_cm,
  weight_kg = EXCLUDED.weight_kg,
  covid_vaccinated = EXCLUDED.covid_vaccinated,
  how_found_us = EXCLUDED.how_found_us,
  registration_city = EXCLUDED.registration_city,
  referral_name = EXCLUDED.referral_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = EXCLUDED.updated_at;

-- ==========================================================
-- NOTE: For complete data export including all candidate profiles,
-- please also use the database-export-complete.sql file
-- which contains more data from jobs, job_applications,
-- candidate_experience, candidate_education, etc.
-- ==========================================================

-- ==========================================================
-- MIGRATION STEPS:
-- 1. Export auth.users from Dashboard > Authentication > Users
-- 2. Create new project and import auth.users first
-- 3. Run secondary-database-setup.sql to create tables
-- 4. Run this file to import candidate_profiles
-- 5. Run database-export-complete.sql to import other data
-- 6. Transfer storage files manually
-- ==========================================================
