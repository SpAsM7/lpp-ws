SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
00000000-0000-0000-0000-000000000000	104df90c-85cf-4a7e-bea2-498b326bd753	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chris+1@uheau.com","user_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","user_phone":""}}	2024-11-21 17:47:42.174028+00	
00000000-0000-0000-0000-000000000000	1cdbd251-11cc-48f0-9f0e-21d2383be25a	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 17:47:59.600999+00	
00000000-0000-0000-0000-000000000000	0952c139-79cc-47e1-b069-fed779f27909	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-21 18:20:46.210832+00	
00000000-0000-0000-0000-000000000000	16f258ff-377a-4862-b21e-349190a8abfb	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 18:20:56.148412+00	
00000000-0000-0000-0000-000000000000	764468fd-a7fb-4565-971a-41a968b19bb4	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-21 18:31:15.272479+00	
00000000-0000-0000-0000-000000000000	07732a72-7cb0-491e-8031-07f5f4ff1b2e	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 18:41:27.276095+00	
00000000-0000-0000-0000-000000000000	336092dd-12e5-4a00-bd4b-79435098129c	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-21 18:42:07.57731+00	
00000000-0000-0000-0000-000000000000	5e7dbf46-3450-4128-90c9-4a79a77f5933	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 18:47:47.080232+00	
00000000-0000-0000-0000-000000000000	b8d39de8-e6ed-4a5c-a497-8ddc59e3595d	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-21 18:49:26.161077+00	
00000000-0000-0000-0000-000000000000	1636f035-1e35-4282-8d10-b9ddf2cab44a	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 19:45:03.860952+00	
00000000-0000-0000-0000-000000000000	13d12e1c-88b9-4bd6-ab18-2bc5da6a0246	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-21 20:24:44.420746+00	
00000000-0000-0000-0000-000000000000	9f77d5ba-9608-42a4-babe-d80f67c6b126	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 20:26:53.746187+00	
00000000-0000-0000-0000-000000000000	24432a99-19b9-4102-ab4e-c6df2d0a2e65	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-21 20:45:25.840464+00	
00000000-0000-0000-0000-000000000000	c4f3af50-8037-460a-89bd-c8e2ae4e5afd	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 21:16:07.273935+00	
00000000-0000-0000-0000-000000000000	92221797-8180-4268-bd7c-11fa4fde09a6	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-21 21:16:15.877234+00	
00000000-0000-0000-0000-000000000000	fda33e0e-2026-4e40-b3cd-8403c933ca24	{"action":"user_signedup","actor_id":"50246c08-2248-4fbc-a833-d6fddc477245","actor_username":"chris+2@uheau.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2024-11-21 21:16:54.759006+00	
00000000-0000-0000-0000-000000000000	377b4a34-5664-4937-a259-1c7a1133df26	{"action":"login","actor_id":"50246c08-2248-4fbc-a833-d6fddc477245","actor_username":"chris+2@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 21:16:54.762916+00	
00000000-0000-0000-0000-000000000000	2e943d4e-bafc-441f-be92-28a47e23d3c1	{"action":"logout","actor_id":"50246c08-2248-4fbc-a833-d6fddc477245","actor_username":"chris+2@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-21 21:17:36.065113+00	
00000000-0000-0000-0000-000000000000	d927e103-b65e-4162-b383-2f25032fb3a6	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-21 21:26:10.598361+00	
00000000-0000-0000-0000-000000000000	6308b6bc-b76b-4c6d-b351-b6e6ecb4c054	{"action":"token_refreshed","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"token"}	2024-11-22 03:12:53.687594+00	
00000000-0000-0000-0000-000000000000	398c53d3-90c9-4377-bef2-454566b84d09	{"action":"token_revoked","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"token"}	2024-11-22 03:12:53.696126+00	
00000000-0000-0000-0000-000000000000	0ae95d39-2bf6-4f4a-b989-137d8fea100f	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-22 03:13:19.367819+00	
00000000-0000-0000-0000-000000000000	0d464bdb-30b2-4b5a-bef0-2e47476343bd	{"action":"user_confirmation_requested","actor_id":"b320b5a6-2956-48fa-b171-90b1b619a200","actor_username":"chris+3@uheau.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-22 04:57:11.975287+00	
00000000-0000-0000-0000-000000000000	5e3adb34-e5cc-4015-9e4c-1dc0e1187e70	{"action":"user_confirmation_requested","actor_id":"b320b5a6-2956-48fa-b171-90b1b619a200","actor_username":"chris+3@uheau.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-22 05:00:58.008253+00	
00000000-0000-0000-0000-000000000000	b6fa39a2-e3ee-451d-b749-5abcd1bdb6a7	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-22 14:41:31.170416+00	
00000000-0000-0000-0000-000000000000	dbf410e5-4955-4bb3-b263-b41da968fbe8	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-22 21:45:33.030037+00	
00000000-0000-0000-0000-000000000000	9aaee1ea-7fcf-44fc-ac4e-ff78aee9bd90	{"action":"user_recovery_requested","actor_id":"50246c08-2248-4fbc-a833-d6fddc477245","actor_username":"chris+2@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-22 21:58:28.926135+00	
00000000-0000-0000-0000-000000000000	d23df54a-2468-48a2-a411-4b2b94234697	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-22 22:06:36.578787+00	
00000000-0000-0000-0000-000000000000	b44aef9a-0674-4680-ad08-d032b4f11422	{"action":"user_recovery_requested","actor_id":"50246c08-2248-4fbc-a833-d6fddc477245","actor_username":"chris+2@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-22 22:10:59.273175+00	
00000000-0000-0000-0000-000000000000	b95cfa08-4679-42bb-9979-fdc42e661bc2	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-22 22:25:35.521224+00	
00000000-0000-0000-0000-000000000000	ef23ca87-3df7-4656-8315-4366c4d39451	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-22 22:53:22.705437+00	
00000000-0000-0000-0000-000000000000	05663baf-d473-45b5-a723-4d7a08ccdf37	{"action":"user_confirmation_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-23 04:22:23.641998+00	
00000000-0000-0000-0000-000000000000	7e6a53b3-dd1d-4c6a-acac-b1fa6c231544	{"action":"user_signedup","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"team"}	2024-11-23 04:22:43.218169+00	
00000000-0000-0000-0000-000000000000	1fe6c197-3435-4ed8-91b4-25ec4c84f25c	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}	2024-11-23 04:22:43.889098+00	
00000000-0000-0000-0000-000000000000	8581ee76-ae8c-41e1-a447-14eab0dec308	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-23 04:23:30.514431+00	
00000000-0000-0000-0000-000000000000	b81ed19a-f74c-4f8e-b871-8f1d73132ddd	{"action":"logout","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 04:24:26.697162+00	
00000000-0000-0000-0000-000000000000	f2e4fb1c-9d4c-4f81-89cf-722e1fb33c44	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 04:24:33.239565+00	
00000000-0000-0000-0000-000000000000	2393299f-c920-47b6-85de-a91b92fcc0d5	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 04:25:09.37524+00	
00000000-0000-0000-0000-000000000000	9ce0bee1-fdd1-4dd1-b363-7b4e8f380011	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 04:32:58.523932+00	
00000000-0000-0000-0000-000000000000	782ba14a-d1a1-45b7-aae6-dee51ab09b88	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 04:33:15.785781+00	
00000000-0000-0000-0000-000000000000	06a3c74a-cd99-49a9-bb58-229cf64537b3	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 04:38:02.376748+00	
00000000-0000-0000-0000-000000000000	e249ce99-9b87-44bf-9dd4-c87b57de760b	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 04:38:25.69722+00	
00000000-0000-0000-0000-000000000000	9a4fd992-1b9e-477e-97cb-de0a7964d3f9	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 05:15:28.670715+00	
00000000-0000-0000-0000-000000000000	29810b9f-374c-4bf0-b867-42771784799b	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:16:06.967805+00	
00000000-0000-0000-0000-000000000000	1f2bf9de-307e-4502-8ce3-e7d07b6071bd	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 05:19:56.71091+00	
00000000-0000-0000-0000-000000000000	42aabaeb-2397-4530-b9fc-7377092c1ab6	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:20:11.500661+00	
00000000-0000-0000-0000-000000000000	93a869b8-e3c0-489a-8c8e-0644e832984f	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 05:23:47.617683+00	
00000000-0000-0000-0000-000000000000	5a43723b-a1ec-4222-b81c-f88b570b69ad	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:23:57.711402+00	
00000000-0000-0000-0000-000000000000	f5ee5ee7-ae3e-4c54-b50e-2333dd562445	{"action":"token_refreshed","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"token"}	2024-11-23 05:25:21.432176+00	
00000000-0000-0000-0000-000000000000	727927ef-f8a3-4855-8563-33ded390a06f	{"action":"token_revoked","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"token"}	2024-11-23 05:25:21.433035+00	
00000000-0000-0000-0000-000000000000	453ddac2-426d-4503-a5bb-e358dbe14905	{"action":"logout","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:25:46.342019+00	
00000000-0000-0000-0000-000000000000	b0ee7054-e7bc-41e8-b750-ff4cfd7980af	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 05:25:54.146029+00	
00000000-0000-0000-0000-000000000000	3dcc6a6c-7304-418b-975f-27f2a4ca244d	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:26:03.71277+00	
00000000-0000-0000-0000-000000000000	c4912c53-d1bb-4546-ac1b-982056bc7370	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:31:00.23702+00	
00000000-0000-0000-0000-000000000000	d227bc22-5983-4a45-b2e3-0ca5498df71d	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 05:31:08.783666+00	
00000000-0000-0000-0000-000000000000	c48f0d73-9459-44c8-965d-52d836287676	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:31:17.425827+00	
00000000-0000-0000-0000-000000000000	1199adb9-78b8-4606-9f2c-445c7c2a753a	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:32:40.197769+00	
00000000-0000-0000-0000-000000000000	ba8a5f52-842e-4ce2-895e-3418348d5e2b	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 05:32:50.54369+00	
00000000-0000-0000-0000-000000000000	75c01213-eac8-4d6d-9ae2-90be55061da2	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:33:01.742384+00	
00000000-0000-0000-0000-000000000000	1f0c43f1-7f51-491e-ac2c-989f18d68c0f	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:36:36.617419+00	
00000000-0000-0000-0000-000000000000	7c1b3c31-87a0-496b-bc87-8bc659741e54	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 05:48:27.88343+00	
00000000-0000-0000-0000-000000000000	70adabbe-0fde-41b8-b45f-038762530e03	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 05:48:36.712768+00	
00000000-0000-0000-0000-000000000000	051cf74e-cd21-46d8-8795-814ea4cda5ad	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 13:40:57.095641+00	
00000000-0000-0000-0000-000000000000	79d8f9d5-5d72-4c79-b084-76c13c590309	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 13:41:13.339117+00	
00000000-0000-0000-0000-000000000000	d6248513-ec06-4a52-bcda-86c43ea6bb4d	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 13:48:18.11655+00	
00000000-0000-0000-0000-000000000000	e6dc1ff2-87be-4eac-bb96-af1bd879c7b9	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 13:48:33.940363+00	
00000000-0000-0000-0000-000000000000	c5adf392-0cb7-4202-b796-548974949894	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 17:48:43.794385+00	
00000000-0000-0000-0000-000000000000	d406d839-85d7-4e21-8666-7424a7035bf9	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 17:48:59.272738+00	
00000000-0000-0000-0000-000000000000	2fd6c4ec-9079-4d0a-9cb0-d6ccac9db308	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 17:57:41.535352+00	
00000000-0000-0000-0000-000000000000	f0a612ce-6ffc-4c78-9588-da3cd85c1c66	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 17:57:53.87288+00	
00000000-0000-0000-0000-000000000000	c6e68b7c-5750-45d6-b70d-73f505603654	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-23 17:59:24.012255+00	
00000000-0000-0000-0000-000000000000	c0a7ec39-303d-472a-84d7-c9e40f912c2b	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 17:59:27.798395+00	
00000000-0000-0000-0000-000000000000	3dd5e791-b16d-411e-bd92-42ca9b42b917	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 18:15:42.448441+00	
00000000-0000-0000-0000-000000000000	2552dce0-4e11-46da-8c02-080c277493b0	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:15:54.020557+00	
00000000-0000-0000-0000-000000000000	68d12d11-bc82-4c01-8440-1bc6f8a7bb67	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 18:20:27.45871+00	
00000000-0000-0000-0000-000000000000	b3986a99-81bb-403e-b78f-c1b6d1a9b308	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:20:41.968134+00	
00000000-0000-0000-0000-000000000000	e92cd3a1-d97a-411b-9ca9-3786fc7a54dc	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 18:27:01.444932+00	
00000000-0000-0000-0000-000000000000	3f5e2ef6-f755-4512-8a71-01861183afcf	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:27:14.381968+00	
00000000-0000-0000-0000-000000000000	a0491411-8a1d-4b20-bcd8-e54799a1c1f1	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 18:29:14.154887+00	
00000000-0000-0000-0000-000000000000	0c909fef-c247-48fd-9aab-db1ce4462ed9	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:29:24.319063+00	
00000000-0000-0000-0000-000000000000	60c32f8f-a9d4-4494-8309-c6dcb9d21bbd	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 18:31:05.065057+00	
00000000-0000-0000-0000-000000000000	6a9af8bf-0948-4f04-9afb-f329a7307b28	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:31:15.013451+00	
00000000-0000-0000-0000-000000000000	6d7323e1-c50a-4b84-9088-32b2402b8177	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 18:34:53.806526+00	
00000000-0000-0000-0000-000000000000	9bd0d914-2aeb-4e4c-a82e-8811af750403	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:34:58.611013+00	
00000000-0000-0000-0000-000000000000	d5164832-901b-4c8c-8da4-d35f061a279b	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:35:14.118628+00	
00000000-0000-0000-0000-000000000000	d3374fac-8005-48e4-910f-0fef25b106f1	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:37:53.666516+00	
00000000-0000-0000-0000-000000000000	ffe186d8-cffe-4ec8-8a89-2185db09b59b	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-23 18:41:40.632282+00	
00000000-0000-0000-0000-000000000000	925e6587-f2d1-4bc5-854e-220abae8b041	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:41:53.467065+00	
00000000-0000-0000-0000-000000000000	e797cfe6-74be-43e4-8216-64a0bd915844	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 18:42:02.635047+00	
00000000-0000-0000-0000-000000000000	5f356725-7c94-47e6-8577-ff52dd4197ca	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:42:14.043725+00	
00000000-0000-0000-0000-000000000000	97add6c1-94b2-4943-8f77-d6e80b5e1c94	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 18:42:24.761326+00	
00000000-0000-0000-0000-000000000000	3f8e0b8a-4cbc-4ec1-9eae-22bb485822ce	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-23 19:02:15.361034+00	
00000000-0000-0000-0000-000000000000	d47a3c0e-0dc4-4cd6-8af9-35c9b7250150	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 19:02:23.871416+00	
00000000-0000-0000-0000-000000000000	0f1229d0-2e6d-4f71-868c-2e5138c1080b	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 19:02:33.929185+00	
00000000-0000-0000-0000-000000000000	3a94e4b1-ba24-41b9-b329-5ecd38191742	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 19:02:53.13697+00	
00000000-0000-0000-0000-000000000000	c3aa1a99-1f6a-4444-b555-db0eb28ede4d	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 19:03:02.605827+00	
00000000-0000-0000-0000-000000000000	74d0b830-8415-4254-9311-e723d9401890	{"action":"user_confirmation_requested","actor_id":"7ea6b609-daef-41bb-8572-51bec68005cb","actor_username":"test@example.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-23 19:08:36.371807+00	
00000000-0000-0000-0000-000000000000	de10a194-99d8-4e61-be7c-efc9e064fad5	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 19:42:37.1903+00	
00000000-0000-0000-0000-000000000000	2f5a0339-771d-4c26-852c-e32ba5ec0403	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 19:42:51.634441+00	
00000000-0000-0000-0000-000000000000	94e596df-3829-48a9-bfc1-178621692ef7	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}	2024-11-23 19:42:52.930075+00	
00000000-0000-0000-0000-000000000000	85770ab7-15ce-4eff-a56a-0ebc5e05b774	{"action":"logout","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 19:53:04.007713+00	
00000000-0000-0000-0000-000000000000	caa96c52-3480-4709-93a7-732510ab373d	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 19:54:24.770941+00	
00000000-0000-0000-0000-000000000000	fc93ae1c-6830-44a1-a041-5ba76a9ca96a	{"action":"user_recovery_requested","actor_id":"7ea6b609-daef-41bb-8572-51bec68005cb","actor_username":"test@example.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 19:59:35.3342+00	
00000000-0000-0000-0000-000000000000	eff20990-482d-4c7c-ba90-2f0bae2f7e24	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 20:00:36.101819+00	
00000000-0000-0000-0000-000000000000	f71c5da7-2836-445f-a093-f79033f45626	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 20:09:53.878648+00	
00000000-0000-0000-0000-000000000000	3cfb6cfd-9190-4747-871b-2588b30317d7	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 20:36:48.275711+00	
00000000-0000-0000-0000-000000000000	8d0496cc-c067-4bb9-8cea-66a09a2c9ab3	{"action":"user_confirmation_requested","actor_id":"30863578-bd0f-4067-8163-2ff0cc3e723e","actor_username":"chris+5@uheau.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-23 20:38:45.20805+00	
00000000-0000-0000-0000-000000000000	cb01100d-3a10-4bb2-9657-78ee28832239	{"action":"user_signedup","actor_id":"30863578-bd0f-4067-8163-2ff0cc3e723e","actor_username":"chris+5@uheau.com","actor_via_sso":false,"log_type":"team"}	2024-11-23 20:39:48.977504+00	
00000000-0000-0000-0000-000000000000	dee9affe-3e1d-435c-9f22-82fae32d8699	{"action":"login","actor_id":"30863578-bd0f-4067-8163-2ff0cc3e723e","actor_username":"chris+5@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}	2024-11-23 20:39:49.934025+00	
00000000-0000-0000-0000-000000000000	e36afb47-4f91-40a7-b37f-d0d3973c6d8b	{"action":"logout","actor_id":"30863578-bd0f-4067-8163-2ff0cc3e723e","actor_username":"chris+5@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 20:40:05.832249+00	
00000000-0000-0000-0000-000000000000	0af4ffa8-60b3-4aaa-9552-509cf3a3cdb2	{"action":"user_confirmation_requested","actor_id":"b855870e-cd5c-482e-b818-1c3a440edd9d","actor_username":"chris+6@uheau.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-23 20:41:01.78688+00	
00000000-0000-0000-0000-000000000000	63d1d0ae-89de-4e1c-b2be-66a460cabb65	{"action":"user_signedup","actor_id":"b855870e-cd5c-482e-b818-1c3a440edd9d","actor_username":"chris+6@uheau.com","actor_via_sso":false,"log_type":"team"}	2024-11-23 20:41:19.434779+00	
00000000-0000-0000-0000-000000000000	44abcb82-44cf-4cd1-be70-a18dfb4e0b04	{"action":"login","actor_id":"b855870e-cd5c-482e-b818-1c3a440edd9d","actor_username":"chris+6@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}	2024-11-23 20:41:20.279414+00	
00000000-0000-0000-0000-000000000000	80f90d5c-629f-4e9c-b1ca-567c02a9f655	{"action":"logout","actor_id":"b855870e-cd5c-482e-b818-1c3a440edd9d","actor_username":"chris+6@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 20:41:25.43022+00	
00000000-0000-0000-0000-000000000000	73d38457-06b2-45b5-827a-2b58a54e8d84	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-23 20:42:46.339273+00	
00000000-0000-0000-0000-000000000000	6b104c15-265a-4079-a8d9-45c50dbbd323	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-23 20:43:02.098768+00	
00000000-0000-0000-0000-000000000000	a564ece0-d234-4c64-bb55-a20d47519a53	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}	2024-11-23 20:43:02.925978+00	
00000000-0000-0000-0000-000000000000	94a885bb-298c-49ef-ab3f-00fdbf6a285a	{"action":"token_refreshed","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"token"}	2024-11-24 14:40:24.959714+00	
00000000-0000-0000-0000-000000000000	7f138e34-e5ad-438a-a529-c915ec1fabeb	{"action":"token_revoked","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"token"}	2024-11-24 14:40:24.97779+00	
00000000-0000-0000-0000-000000000000	6d5d3fb7-2b20-47a0-95d2-17b68371dfad	{"action":"logout","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 14:40:32.401868+00	
00000000-0000-0000-0000-000000000000	bc6e66ee-4315-4e95-aa1f-cf6d5af3558e	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 19:02:06.429974+00	
00000000-0000-0000-0000-000000000000	820da03d-5cd1-4027-a3cb-48989a56698b	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 19:02:21.038464+00	
00000000-0000-0000-0000-000000000000	488ae3b1-1806-470a-8c40-728b2edcb8ec	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 19:16:07.240494+00	
00000000-0000-0000-0000-000000000000	fe94ca47-550a-456d-8f52-7c8137ca5726	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 19:16:25.578123+00	
00000000-0000-0000-0000-000000000000	18cb29de-c8d8-425e-870b-3b18a4cef2f3	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-24 20:49:11.227023+00	
00000000-0000-0000-0000-000000000000	8002b58d-360a-4103-b12e-2ad079317602	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 20:49:29.751098+00	
00000000-0000-0000-0000-000000000000	ba3b19ea-5ebc-40a1-9376-4b4b0c84356a	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 20:50:28.822963+00	
00000000-0000-0000-0000-000000000000	7f9c90ee-39f5-4018-8b45-00ca5bf0cc10	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 20:50:57.06643+00	
00000000-0000-0000-0000-000000000000	7b67bc9b-d661-4631-8fb2-4ae57d974f70	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}	2024-11-24 20:50:58.539049+00	
00000000-0000-0000-0000-000000000000	f525dd34-9001-493a-8f9d-ae5eeeb1308c	{"action":"logout","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 20:52:14.617277+00	
00000000-0000-0000-0000-000000000000	3dd3fda1-601a-4a7b-b7f4-787619db4e74	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 20:52:42.399543+00	
00000000-0000-0000-0000-000000000000	b6dfbe4e-8bac-4e20-9b13-8ce99baf3985	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 20:52:54.585793+00	
00000000-0000-0000-0000-000000000000	41e1eafa-9e84-4748-8233-0b5073910793	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}	2024-11-24 20:52:55.444067+00	
00000000-0000-0000-0000-000000000000	22b5b661-2ae9-426a-b320-30bc71262247	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 20:55:37.771873+00	
00000000-0000-0000-0000-000000000000	dd985893-35e4-4df0-a816-105fed6c1108	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 20:55:47.557197+00	
00000000-0000-0000-0000-000000000000	9c2161de-f5fa-412d-9189-2b4e65cc91fe	{"action":"logout","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 20:56:22.05145+00	
00000000-0000-0000-0000-000000000000	0173d8d8-f2de-43a9-8e7e-fcd9836ee56c	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 20:59:37.646623+00	
00000000-0000-0000-0000-000000000000	2deffc9c-c73d-4190-abc3-adb724efe473	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 20:59:48.47744+00	
00000000-0000-0000-0000-000000000000	4e659968-c405-44ac-be8f-5a334bf9acf5	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}	2024-11-24 20:59:49.624751+00	
00000000-0000-0000-0000-000000000000	a0f5b13f-9761-4455-bb98-0db2beff5e81	{"action":"user_updated_password","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:00:08.279856+00	
00000000-0000-0000-0000-000000000000	218ed84d-e086-488b-8637-5a3ebe662e4c	{"action":"user_modified","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:00:08.280923+00	
00000000-0000-0000-0000-000000000000	f7c14163-247c-4316-a808-09d03ce88a39	{"action":"logout","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 21:04:27.894375+00	
00000000-0000-0000-0000-000000000000	3198cbba-b210-42d7-a1b3-926600a7ecc2	{"action":"user_recovery_requested","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:06:35.151879+00	
00000000-0000-0000-0000-000000000000	d6448a6b-db8a-473c-bc49-6308961e6f86	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 21:07:20.461037+00	
00000000-0000-0000-0000-000000000000	333b3bf4-8840-4c6c-81d6-294395786727	{"action":"login","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}	2024-11-24 21:07:21.923329+00	
00000000-0000-0000-0000-000000000000	351a7bac-5d8b-4a20-860e-0710d2a0251e	{"action":"user_updated_password","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:07:52.169646+00	
00000000-0000-0000-0000-000000000000	ed4cba5f-ab3e-4a3c-8d6f-584f64609cc3	{"action":"user_modified","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:07:52.170256+00	
00000000-0000-0000-0000-000000000000	7d0c848d-ae14-42dc-aeb1-1de55b5bef06	{"action":"logout","actor_id":"c009bb9a-0f84-4009-8a45-ce173c081ae7","actor_username":"chris+4@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 21:07:54.244286+00	
00000000-0000-0000-0000-000000000000	be141c88-b5a8-4493-85b2-a13b93d28404	{"action":"user_recovery_requested","actor_id":"b320b5a6-2956-48fa-b171-90b1b619a200","actor_username":"chris+3@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:09:53.957096+00	
00000000-0000-0000-0000-000000000000	d5bcc4b6-178b-4550-9139-4bfbb1cfbf7e	{"action":"user_signedup","actor_id":"b320b5a6-2956-48fa-b171-90b1b619a200","actor_username":"chris+3@uheau.com","actor_via_sso":false,"log_type":"team"}	2024-11-24 21:10:11.414144+00	
00000000-0000-0000-0000-000000000000	b67028bb-37f3-4f84-99a2-20c22324893e	{"action":"login","actor_id":"b320b5a6-2956-48fa-b171-90b1b619a200","actor_username":"chris+3@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}	2024-11-24 21:10:12.273248+00	
00000000-0000-0000-0000-000000000000	a4eadbd3-b7eb-4f5d-bddf-25d8c516d94b	{"action":"user_updated_password","actor_id":"b320b5a6-2956-48fa-b171-90b1b619a200","actor_username":"chris+3@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:10:24.217578+00	
00000000-0000-0000-0000-000000000000	7fb15f81-9ea7-47a6-af90-f1a84b64af40	{"action":"user_modified","actor_id":"b320b5a6-2956-48fa-b171-90b1b619a200","actor_username":"chris+3@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:10:24.218198+00	
00000000-0000-0000-0000-000000000000	fe85d0cc-21e0-409d-ac7c-a3ece9699b3c	{"action":"logout","actor_id":"b320b5a6-2956-48fa-b171-90b1b619a200","actor_username":"chris+3@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 21:10:26.32563+00	
00000000-0000-0000-0000-000000000000	01047e27-72f8-49a6-ae95-b8cd62b07f37	{"action":"user_recovery_requested","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-24 21:11:32.115181+00	
00000000-0000-0000-0000-000000000000	28230475-3f24-449c-97ac-f5538a2e0958	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 21:11:46.239127+00	
00000000-0000-0000-0000-000000000000	1e471d63-5493-46ee-ad11-1419a946a7b1	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}	2024-11-24 21:11:47.14437+00	
00000000-0000-0000-0000-000000000000	88e7c5cb-890d-47a6-8b3e-1ce1f0879881	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-24 21:25:29.192344+00	
00000000-0000-0000-0000-000000000000	88d865be-55b8-43a7-ba9d-7b645b03de74	{"action":"user_confirmation_requested","actor_id":"e831b23b-588e-411e-9c04-744e0998c4ce","actor_username":"chris+7@uheau.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-24 21:39:51.146645+00	
00000000-0000-0000-0000-000000000000	640ef596-95ec-4cfd-a30a-1051929b7e91	{"action":"user_confirmation_requested","actor_id":"0fe31f15-73be-4d04-bc4d-26918da91e0a","actor_username":"chris+8@uheau.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-24 21:40:43.460214+00	
00000000-0000-0000-0000-000000000000	0ef0495b-5f2f-4b4a-85d1-ac7efb30711a	{"action":"user_signedup","actor_id":"e831b23b-588e-411e-9c04-744e0998c4ce","actor_username":"chris+7@uheau.com","actor_via_sso":false,"log_type":"team"}	2024-11-24 21:40:55.849677+00	
00000000-0000-0000-0000-000000000000	28c76970-fa4f-44b2-be2f-3b5ea2f243c6	{"action":"user_confirmation_requested","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2024-11-25 02:03:59.122428+00	
00000000-0000-0000-0000-000000000000	36257db2-6440-4cb9-98a1-cd1c0e5d38da	{"action":"user_signedup","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"team"}	2024-11-25 02:04:23.19361+00	
00000000-0000-0000-0000-000000000000	65c6e79a-a922-46f7-9178-017a6e35b0b1	{"action":"login","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}	2024-11-25 02:04:24.979289+00	
00000000-0000-0000-0000-000000000000	af43d64d-c4e8-4ba4-b050-49c287abc97f	{"action":"logout","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-25 02:05:45.71745+00	
00000000-0000-0000-0000-000000000000	373f0bad-54e3-4081-aae0-6f5f8dc052d8	{"action":"login","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-25 02:06:12.688346+00	
00000000-0000-0000-0000-000000000000	93e8bd3c-9ff0-44ac-a7f5-aa0dfccc27f3	{"action":"logout","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-25 02:06:29.488178+00	
00000000-0000-0000-0000-000000000000	c45020d9-ce21-4fb1-8a19-173fbf579187	{"action":"user_recovery_requested","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-25 02:06:42.649665+00	
00000000-0000-0000-0000-000000000000	a896d409-c689-42ed-9bee-65e893c40db5	{"action":"login","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-25 02:06:53.409341+00	
00000000-0000-0000-0000-000000000000	04b25214-a536-45ef-af67-848da2afbb9e	{"action":"login","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"recovery"}}	2024-11-25 02:06:54.291375+00	
00000000-0000-0000-0000-000000000000	3b9164a7-33e6-4d0a-b6a0-9abcc5eec275	{"action":"user_updated_password","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-25 02:07:06.403438+00	
00000000-0000-0000-0000-000000000000	e8684fe7-36b6-44b3-a96b-989ed9c6d93a	{"action":"user_modified","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"user"}	2024-11-25 02:07:06.404673+00	
00000000-0000-0000-0000-000000000000	8ddcc6d8-61b5-4bd0-8383-60dc036f86ec	{"action":"logout","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-25 02:07:08.473682+00	
00000000-0000-0000-0000-000000000000	385e174d-960f-4c0d-b0d8-7f347f10798c	{"action":"login","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-25 02:07:23.136716+00	
00000000-0000-0000-0000-000000000000	2e73e4a2-aa6e-46c1-9613-585987623b3f	{"action":"logout","actor_id":"b3468397-0bc1-42d1-a575-de461669dee9","actor_username":"chris+9@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-25 02:07:35.179263+00	
00000000-0000-0000-0000-000000000000	a777d03b-8dc7-436b-8855-24ddfaea4a4e	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-25 23:29:41.224778+00	
00000000-0000-0000-0000-000000000000	8be100f6-8b6f-4e74-b742-d25324be6733	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-25 23:29:58.867727+00	
00000000-0000-0000-0000-000000000000	f3cd90f8-fc98-4493-8eb8-384f489597ac	{"action":"login","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2024-11-27 14:32:37.280229+00	
00000000-0000-0000-0000-000000000000	c527e2a9-c9d2-43fb-a2c3-d9dbc06bfcd8	{"action":"logout","actor_id":"677115f7-3167-4e8e-92ef-a2ae5c2cf945","actor_username":"chris+1@uheau.com","actor_via_sso":false,"log_type":"account"}	2024-11-27 14:33:02.265342+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
7e8968bd-20c1-418c-80d1-c322af8c11a0	b320b5a6-2956-48fa-b171-90b1b619a200	5fbf9b4d-36d1-4b50-a878-8b12969e023d	s256	ndUDwmiEQ3Ole9w8yNPV-tY56aJApPhfR8OdT3GP_Us	email			2024-11-22 04:57:11.976591+00	2024-11-22 04:57:11.976591+00	email/signup	\N
220040e7-0030-4cde-97d1-6c2ab532ad3e	e831b23b-588e-411e-9c04-744e0998c4ce	1d55279e-1219-4800-80bc-0ba24812cdaf	s256	HUsCltKO4OwCEIDHD5DoeTNB6sdNXGAm-P7mSO2Jd_8	email			2024-11-24 21:39:51.148084+00	2024-11-24 21:40:55.853665+00	email/signup	2024-11-24 21:40:55.853621+00
07372f4c-9937-49b8-b96f-c6105ed8bf99	7ea6b609-daef-41bb-8572-51bec68005cb	0c0f63df-5d39-43b9-992d-65b2ae886393	s256	w5XXHeH8_C6I5_Whc9B1AXbkc0PvjrThI5iiC0QDXDo	email			2024-11-23 19:08:36.373323+00	2024-11-23 19:08:36.373323+00	email/signup	\N
95daa3cd-bb05-47d5-8ab4-f5afc54e2186	c009bb9a-0f84-4009-8a45-ce173c081ae7	545336f4-65cf-480d-92a0-2cb3b8bc4337	s256	9c6tZrnMDL2kFc-xUE10Do5dK2DhiyKIeG6EtcUEYEs	recovery			2024-11-23 19:54:24.768797+00	2024-11-23 19:54:24.768797+00	recovery	\N
11bbd2c0-070e-4efd-8f8f-3dc1ee1d97db	7ea6b609-daef-41bb-8572-51bec68005cb	511706d8-9766-4f3e-8a1e-ea92867a3c8b	s256	F1NyipIqsNrP7UTPftIQSkbs3xjc4ndM-Bz08vXQlKM	recovery			2024-11-23 19:59:35.33221+00	2024-11-23 19:59:35.33221+00	recovery	\N
fd45f1cd-382a-44a2-a16b-50a74e5131c2	c009bb9a-0f84-4009-8a45-ce173c081ae7	e50d5f5c-8c82-4e27-b9a2-f90b404c256b	s256	XaAtILcMlHw6VWP1cXcM2X9z7Z9qX5dRX6uF8mPG3w0	recovery			2024-11-23 20:00:36.100069+00	2024-11-23 20:00:36.100069+00	recovery	\N
56065b04-17b6-43af-818e-9bc6aa61fe2e	c009bb9a-0f84-4009-8a45-ce173c081ae7	c3837c59-8b99-4a5f-b7c8-9d97e172f358	s256	1OCsGe4CM_Bm-HEZcjiJxFeeYHFuWNqfofSflgFtmZg	recovery			2024-11-23 20:09:53.875921+00	2024-11-23 20:09:53.875921+00	recovery	\N
e3db8f25-7113-4430-9f16-f92185441fbb	c009bb9a-0f84-4009-8a45-ce173c081ae7	8bf88cf0-703d-4330-b9e7-20a437712605	s256	DtwEjSjNi1rCvnX2MsE4kXVncNuYJIm0_Q81CERiMx8	magiclink			2024-11-23 20:36:48.273046+00	2024-11-23 20:36:48.273046+00	magiclink	\N
0ef14795-1db5-4e8f-bc4c-45ef6f57e3cc	677115f7-3167-4e8e-92ef-a2ae5c2cf945	2bd6d64a-434d-4a13-b511-1d72f63e61a7	s256	LbNbFjZpDQtp0w3_wbfkKqBK0kqrkqLtvn6BMS3wtJ4	magiclink			2024-11-24 19:02:06.423259+00	2024-11-24 19:02:21.045429+00	magiclink	2024-11-24 19:02:21.045383+00
7fb58112-261c-49bb-8de3-80dcefa860c7	677115f7-3167-4e8e-92ef-a2ae5c2cf945	d4ec2ec5-6eee-4511-b20f-484f88cd1798	s256	v6pngtHJHqDRBH3M4oJ_u3oL7xWJ262euxYOSCOG0Ow	magiclink			2024-11-24 19:16:07.238379+00	2024-11-24 19:16:25.58225+00	magiclink	2024-11-24 19:16:25.582196+00
32d54cd7-f167-4997-a58b-d39399fab127	c009bb9a-0f84-4009-8a45-ce173c081ae7	80250b48-fc27-4427-9baf-8398aad47961	s256	G6ozeMcYUJHrDRBBo4_Ub_VqkyDoeskh43nxX9spt2w	recovery			2024-11-24 20:55:37.769315+00	2024-11-24 20:55:47.560548+00	recovery	2024-11-24 20:55:47.560508+00
f15165b3-571f-43d2-a3d9-84bcfa1bd281	0fe31f15-73be-4d04-bc4d-26918da91e0a	7f65c725-2c3b-4175-baba-9534cefca7bb	s256	3c6apVZhUZO6hpTZ8iGdx9STjK0_J9TDL-uTsJAKYtI	email			2024-11-24 21:40:43.460827+00	2024-11-24 21:40:43.460827+00	email/signup	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	e831b23b-588e-411e-9c04-744e0998c4ce	authenticated	authenticated	chris+7@uheau.com	$2a$10$l/i1uMZAICHHOMd.RoDx1.Enu8qeeQt0aT.5QISOPu/3GzPgjgwdm	2024-11-24 21:40:55.850251+00	\N		2024-11-24 21:39:51.14932+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "e831b23b-588e-411e-9c04-744e0998c4ce", "email": "chris+7@uheau.com", "email_verified": false, "phone_verified": false}	\N	2024-11-24 21:39:51.131308+00	2024-11-24 21:40:55.85179+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	50246c08-2248-4fbc-a833-d6fddc477245	authenticated	authenticated	chris+2@uheau.com	$2a$10$M2JINy6wlJwK/8cC13dp/Ox.rflgoYBTzxD.QxxyGb5.krVvHp.WC	2024-11-21 21:16:54.759637+00	\N		\N	7800e7dc8e0cc538581efc927504acf850f6c1ec182f8df38af1f186	2024-11-22 22:10:59.274064+00			\N	2024-11-21 21:16:54.763607+00	{"provider": "email", "providers": ["email"]}	{"sub": "50246c08-2248-4fbc-a833-d6fddc477245", "email": "chris+2@uheau.com", "email_verified": false, "phone_verified": false}	\N	2024-11-21 21:16:54.749834+00	2024-11-22 22:10:59.401289+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b3468397-0bc1-42d1-a575-de461669dee9	authenticated	authenticated	chris+9@uheau.com	$2a$10$yqwQY8hW5uAlHNuLj5wuxuYXxnfueu5rq9ny1a8hUAwL8QlIdUh7K	2024-11-25 02:04:23.194233+00	\N		\N		\N			\N	2024-11-25 02:07:23.137369+00	{"provider": "email", "providers": ["email"]}	{"sub": "b3468397-0bc1-42d1-a575-de461669dee9", "email": "chris+9@uheau.com", "email_verified": false, "phone_verified": false}	\N	2024-11-25 02:03:59.114266+00	2024-11-25 02:07:23.139023+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	677115f7-3167-4e8e-92ef-a2ae5c2cf945	authenticated	authenticated	chris+1@uheau.com	$2a$10$J7DmYyPzVDPGsgXGMVv0aeit60jQEGvgjzNUHdruawCspsk.YG0Qu	2024-11-21 17:47:42.18514+00	\N		\N		2024-11-24 21:11:32.115951+00			\N	2024-11-27 14:32:37.296082+00	{"provider": "email", "providers": ["email"]}	{}	\N	2024-11-21 17:47:42.134583+00	2024-11-27 14:32:37.326178+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	7ea6b609-daef-41bb-8572-51bec68005cb	authenticated	authenticated	test@example.com	$2a$10$lPfxBmIj1q3TUuO4NUXm6e885kHP/L18ADlKjJXnUJlgqzvqZE1bS	\N	\N	pkce_edcb9df30b2a36f01330be47b84d6db716cab83cf04cc0b49c22ac3c	2024-11-23 19:08:36.377653+00	pkce_07a5ab042b7c3c0eb5023ebac25b2eedbe4173758557a056ce846f17	2024-11-23 19:59:35.336176+00			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "7ea6b609-daef-41bb-8572-51bec68005cb", "email": "test@example.com", "email_verified": false, "phone_verified": false}	\N	2024-11-23 19:08:36.357246+00	2024-11-23 19:59:35.812301+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b855870e-cd5c-482e-b818-1c3a440edd9d	authenticated	authenticated	chris+6@uheau.com	$2a$10$SCCBHWYrFMQuMmfstAChG./RpYGC3OYor/NR3ARxFdsKoZjhopMMa	2024-11-23 20:41:19.435438+00	\N		2024-11-23 20:41:01.788195+00		\N			\N	2024-11-23 20:41:20.279939+00	{"provider": "email", "providers": ["email"]}	{"sub": "b855870e-cd5c-482e-b818-1c3a440edd9d", "email": "chris+6@uheau.com", "email_verified": false, "phone_verified": false}	\N	2024-11-23 20:41:01.781768+00	2024-11-23 20:41:20.281532+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	30863578-bd0f-4067-8163-2ff0cc3e723e	authenticated	authenticated	chris+5@uheau.com	$2a$10$HOoty2MzGHZWHNHjOqjPKOHL/rzPrn4VsfBoD0mNybRWazr69V73y	2024-11-23 20:39:48.980077+00	\N		2024-11-23 20:38:45.210635+00		\N			\N	2024-11-23 20:39:49.93453+00	{"provider": "email", "providers": ["email"]}	{"sub": "30863578-bd0f-4067-8163-2ff0cc3e723e", "email": "chris+5@uheau.com", "email_verified": false, "phone_verified": false}	\N	2024-11-23 20:38:45.198726+00	2024-11-23 20:39:49.938639+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b320b5a6-2956-48fa-b171-90b1b619a200	authenticated	authenticated	chris+3@uheau.com	$2a$10$GZAbRKECLdoTZCYPw6Af6..WzOqaZE28xRUq7fAm4pwMLHHiPjlFi	2024-11-24 21:10:11.414685+00	\N		\N		\N			\N	2024-11-24 21:10:12.273747+00	{"provider": "email", "providers": ["email"]}	{"sub": "b320b5a6-2956-48fa-b171-90b1b619a200", "email": "chris+3@uheau.com", "email_verified": false, "phone_verified": false}	\N	2024-11-22 04:57:11.95644+00	2024-11-24 21:10:24.216261+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c009bb9a-0f84-4009-8a45-ce173c081ae7	authenticated	authenticated	chris+4@uheau.com	$2a$10$7yLmZUfi4DQpAgVzLz0nCOdQte7DwGDUJcS/GOTLtH8c3yiMZ5PTO	2024-11-23 04:22:43.218729+00	\N		\N		\N			\N	2024-11-24 21:07:21.923842+00	{"provider": "email", "providers": ["email"]}	{"sub": "c009bb9a-0f84-4009-8a45-ce173c081ae7", "email": "chris+4@uheau.com", "email_verified": false, "phone_verified": false}	\N	2024-11-23 04:22:23.626505+00	2024-11-24 21:07:52.168345+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	0fe31f15-73be-4d04-bc4d-26918da91e0a	authenticated	authenticated	chris+8@uheau.com	$2a$10$kz25xzGCIkbE.vaJYHyIHe5tLKilYLvKIcdtwgn/p/4bfw5Wr2s06	\N	\N	pkce_f78a9152953e76d5b68cef32e724650d5fa1f86bd1ade40a62fbf017	2024-11-24 21:40:43.461344+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "0fe31f15-73be-4d04-bc4d-26918da91e0a", "email": "chris+8@uheau.com", "email_verified": false, "phone_verified": false}	\N	2024-11-24 21:40:43.455118+00	2024-11-24 21:40:44.165633+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
677115f7-3167-4e8e-92ef-a2ae5c2cf945	677115f7-3167-4e8e-92ef-a2ae5c2cf945	{"sub": "677115f7-3167-4e8e-92ef-a2ae5c2cf945", "email": "chris+1@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-21 17:47:42.166926+00	2024-11-21 17:47:42.166991+00	2024-11-21 17:47:42.166991+00	af31e4ac-e27e-4cb8-afee-9abf5a957f67
50246c08-2248-4fbc-a833-d6fddc477245	50246c08-2248-4fbc-a833-d6fddc477245	{"sub": "50246c08-2248-4fbc-a833-d6fddc477245", "email": "chris+2@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-21 21:16:54.755718+00	2024-11-21 21:16:54.75577+00	2024-11-21 21:16:54.75577+00	53c7b921-069c-4425-93dd-b10842714ef8
b320b5a6-2956-48fa-b171-90b1b619a200	b320b5a6-2956-48fa-b171-90b1b619a200	{"sub": "b320b5a6-2956-48fa-b171-90b1b619a200", "email": "chris+3@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-22 04:57:11.971668+00	2024-11-22 04:57:11.971723+00	2024-11-22 04:57:11.971723+00	16e875d9-9faf-45cd-87a9-2fc53d5f9b01
c009bb9a-0f84-4009-8a45-ce173c081ae7	c009bb9a-0f84-4009-8a45-ce173c081ae7	{"sub": "c009bb9a-0f84-4009-8a45-ce173c081ae7", "email": "chris+4@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-23 04:22:23.637899+00	2024-11-23 04:22:23.637953+00	2024-11-23 04:22:23.637953+00	cbfc9907-4aa3-4e05-9a11-7541bc87f4f2
7ea6b609-daef-41bb-8572-51bec68005cb	7ea6b609-daef-41bb-8572-51bec68005cb	{"sub": "7ea6b609-daef-41bb-8572-51bec68005cb", "email": "test@example.com", "email_verified": false, "phone_verified": false}	email	2024-11-23 19:08:36.366723+00	2024-11-23 19:08:36.366787+00	2024-11-23 19:08:36.366787+00	280a2cb4-8b87-4018-9288-45acef17ba4d
30863578-bd0f-4067-8163-2ff0cc3e723e	30863578-bd0f-4067-8163-2ff0cc3e723e	{"sub": "30863578-bd0f-4067-8163-2ff0cc3e723e", "email": "chris+5@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-23 20:38:45.204791+00	2024-11-23 20:38:45.204856+00	2024-11-23 20:38:45.204856+00	738afe13-dfb5-4287-8075-5f03c8141f20
b855870e-cd5c-482e-b818-1c3a440edd9d	b855870e-cd5c-482e-b818-1c3a440edd9d	{"sub": "b855870e-cd5c-482e-b818-1c3a440edd9d", "email": "chris+6@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-23 20:41:01.784589+00	2024-11-23 20:41:01.784635+00	2024-11-23 20:41:01.784635+00	c03ab79c-a3ca-4607-813e-8fa7e3ded134
e831b23b-588e-411e-9c04-744e0998c4ce	e831b23b-588e-411e-9c04-744e0998c4ce	{"sub": "e831b23b-588e-411e-9c04-744e0998c4ce", "email": "chris+7@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-24 21:39:51.14284+00	2024-11-24 21:39:51.14291+00	2024-11-24 21:39:51.14291+00	887d1634-25b3-4314-84fd-d06b2639bd37
0fe31f15-73be-4d04-bc4d-26918da91e0a	0fe31f15-73be-4d04-bc4d-26918da91e0a	{"sub": "0fe31f15-73be-4d04-bc4d-26918da91e0a", "email": "chris+8@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-24 21:40:43.457441+00	2024-11-24 21:40:43.457487+00	2024-11-24 21:40:43.457487+00	333d9796-b24f-4dcf-9b78-5780c371160a
b3468397-0bc1-42d1-a575-de461669dee9	b3468397-0bc1-42d1-a575-de461669dee9	{"sub": "b3468397-0bc1-42d1-a575-de461669dee9", "email": "chris+9@uheau.com", "email_verified": false, "phone_verified": false}	email	2024-11-25 02:03:59.119644+00	2024-11-25 02:03:59.119701+00	2024-11-25 02:03:59.119701+00	884d2fbc-4afe-460d-8411-5890dc0299f0
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
4e7cc404-ade3-4e34-a31c-ca7a0d2ffa6a	50246c08-2248-4fbc-a833-d6fddc477245	recovery_token	7800e7dc8e0cc538581efc927504acf850f6c1ec182f8df38af1f186	chris+2@uheau.com	2024-11-22 22:10:59.406737	2024-11-22 22:10:59.406737
d1eb84d9-1c46-439c-b751-3f29a8e72e64	7ea6b609-daef-41bb-8572-51bec68005cb	confirmation_token	pkce_edcb9df30b2a36f01330be47b84d6db716cab83cf04cc0b49c22ac3c	test@example.com	2024-11-23 19:08:36.959342	2024-11-23 19:08:36.959342
3d2e24d4-8551-4b62-ac9e-675f8ec6e7a4	7ea6b609-daef-41bb-8572-51bec68005cb	recovery_token	pkce_07a5ab042b7c3c0eb5023ebac25b2eedbe4173758557a056ce846f17	test@example.com	2024-11-23 19:59:35.815528	2024-11-23 19:59:35.815528
69146583-d7d6-4247-b421-f5e513e0b2a5	0fe31f15-73be-4d04-bc4d-26918da91e0a	confirmation_token	pkce_f78a9152953e76d5b68cef32e724650d5fa1f86bd1ade40a62fbf017	chris+8@uheau.com	2024-11-24 21:40:44.171311	2024-11-24 21:40:44.171311
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY "pgsodium"."key" ("id", "status", "created", "expires", "key_type", "key_id", "key_context", "name", "associated_data", "raw_key", "raw_key_nonce", "parent_key", "comment", "user_data") FROM stdin;
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."accounts" ("account_id", "account_name", "account_type", "status", "kyc_status", "accreditation_status", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: accreditation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."accreditation" ("id", "account_id", "qualification_type", "qualification_details", "verified_at", "expires_at", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."activities" ("activity_id", "activity_type", "title", "description", "entity_type", "entity_id", "metadata", "importance", "read_status", "user_id", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: aml_verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."aml_verification" ("id", "account_id", "verification_type", "verification_details", "pep_status", "sanctions_check", "verified_at", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: bank_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."bank_info" ("id", "account_id", "bank_name", "account_name", "account_number", "routing_number", "swift_code", "bank_address", "bank_country", "primary_account", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: beneficial_owners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."beneficial_owners" ("id", "parent_id", "parent_type", "owner_type", "name", "ownership_percent", "relationship_type", "control_person", "tax_id", "citizenship", "employment_info", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."companies" ("company_id", "company_name", "status", "description", "industry", "founded_date", "website", "logo_url", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."roles" ("id", "account_id", "user_id", "role_type", "can_remove_self", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: contact_designations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."contact_designations" ("id", "role_id", "designation_type", "contact_preferences", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: entity_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."entity_details" ("id", "account_id", "entity_type", "tax_id", "jurisdiction", "formation_date", "us_person", "tax_year_end", "tax_exempt", "investment_company_status", "bank_entity_status", "formed_to_invest", "public_reporting_entity", "fatf_jurisdiction", "mailing_address", "principal_place_business", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: erisa_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."erisa_status" ("id", "parent_id", "parent_type", "subject_to_erisa", "benefit_plan_percentage", "fiduciary_name", "governmental_plan", "church_plan", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."investments" ("investment_id", "account_id", "company_id", "investment_status", "investment_type", "initial_investment_date", "total_committed_capital", "total_called_capital", "total_distributions", "current_nav", "last_valuation_date", "investment_metrics", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."files" ("file_id", "file_name", "file_type", "storage_path", "company_id", "investment_id", "account_id", "visibility_scope", "modification_access", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: file_access_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."file_access_logs" ("log_id", "file_id", "user_id", "access_type", "access_timestamp") FROM stdin;
\.


--
-- Data for Name: gp_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."gp_roles" ("id", "user_id", "role_type", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: individual_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."individual_details" ("id", "account_id", "tax_id_type", "tax_id", "us_person", "tax_year_end", "joint_account", "joint_holder_info", "professional_title", "employer", "acting_as_nominee", "mailing_address", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: retirement_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."retirement_details" ("id", "account_id", "plan_type", "tax_id", "tax_year_end", "self_directed", "custodian_info", "mailing_address", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: trust_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."trust_details" ("id", "account_id", "trust_type", "tax_id", "us_person", "tax_year_end", "revocable", "formation_date", "formed_to_invest", "grantor_trust", "mailing_address", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."user_profiles" ("user_id", "first_name", "last_name", "phone", "professional_title", "company_name", "linkedin_url", "profile_image_url", "timezone", "is_gp_user", "is_lp_user", "communication_preferences", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 57, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
