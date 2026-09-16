-- Migration: arquivo documental ALRS (212 PDFs, fonte primaria NoPaper)
-- Gerado automaticamente a partir de /tmp/burigo_pdfs/manifest.csv (scraper)
-- Todos os documentos: bytes reais recuperados (PDF_ARCHIVED), sha256 verificados.

begin;

insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 35455, '5e97631f8e1e3599d44dd48affc1baecce7bbe2bf73e0201cf94dab2866c69a6', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 79634, '852e73589ad3d9c0acdf865bdb13173907054c4f114b17d2e17a584194d0bcbc', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/02_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 2082040, 'e0566618a27ad25b1704a93e2bf515812cf750b4aba55bdc597df9f4bd41b450', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/02_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/03_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 212309, '2ccc83ebaaf97bb1130b2b5067783864f31f54d67d0ac7efe84e1ce36a99682d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/03_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/04_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 239828, 'a24ddbdf61bb9aca0771193a224d407a7ae8a48b5560fe733d36516b14774926', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/04_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/05_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 207777, 'ebc98171387eecd3228099750717f10dde8d022027154310b1323237a1235478', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/05_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/06_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 178080, 'f71d21fed1b4ffd894af11b2c87165272c7045d27d4db8b653ab3b75499c0c73', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/06_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/07_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 147952, 'c0776853b2b776078487af29c2f41680e13b2163e2f5ec24afb83c42194d5f28', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/07_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/08_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 303182, '03ff05f4b3bc3ee0be36617f5eda0c7d7d45cdf4d881a507a02993a9e194f527', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/08_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-8', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/09_ANEXO_Anexo_Anexo_8.pdf',
   'application/pdf', 201706, '49ffcd4e41974a93242109110231e1fcd8355684eaa01b8101a16e7c6c0b128a', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/09_ANEXO_Anexo_Anexo_8.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'ANEXO', 'Anexo Anexo-9', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/10_ANEXO_Anexo_Anexo_9.pdf',
   'application/pdf', 200108, '24f60c754793bc024c6f2c0859ddd569737e4f8114a072fb5850036bb90b2c64', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/10_ANEXO_Anexo_Anexo_9.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f6042840-8192-41b9-89c9-9a1bbeb439a0', 'PARECER', 'Parecer CCJ - rel. Cláudio Tatsch - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/100/2021', 'documents/alrs/PL100_2021/11_PARECER_Parecer_CCJ_rel_Cl_udio_Tatsch_Favor_vel_Aprovado.pdf',
   'application/pdf', 143664, '2ad09f4ec960bcf45d1cd5a7409a2b0400f9abfcd32880832cd420d8b2b778a9', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL100_2021/11_PARECER_Parecer_CCJ_rel_Cl_udio_Tatsch_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d256f34b-d4f3-4469-8329-9e5432c8656a', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/132/2024', 'documents/alrs/PL132_2024/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 223463, '6153be225cad2af573502d7782cd8516bfdf9745969a68cb5f0a8097e4658ee1', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL132_2024/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d256f34b-d4f3-4469-8329-9e5432c8656a', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/132/2024', 'documents/alrs/PL132_2024/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 111916, 'a9812d528265feb26226fa4c0c056d8a53579a0834e2fb27a6bbc9beb08e1ee4', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL132_2024/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d256f34b-d4f3-4469-8329-9e5432c8656a', 'PARECER', 'Parecer CCJ - rel. Professor Bonatto - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/132/2024', 'documents/alrs/PL132_2024/02_PARECER_Parecer_CCJ_rel_Professor_Bonatto_Favor_vel_Aprovado.pdf',
   'application/pdf', 185295, 'adbae80ee725bf06b5cf678140d7b73b8b7b21db2a89541c2010b29b5ffd422b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL132_2024/02_PARECER_Parecer_CCJ_rel_Professor_Bonatto_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d256f34b-d4f3-4469-8329-9e5432c8656a', 'PARECER', 'Parecer CECDCT - rel. Luiz Marenco - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/132/2024', 'documents/alrs/PL132_2024/03_PARECER_Parecer_CECDCT_rel_Luiz_Marenco_Favor_vel_Aprovado.pdf',
   'application/pdf', 160307, 'b345f57512fd95be36dfb7edcbff0a28c09b77943e3cf58a998f0b0ade9b7d98', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL132_2024/03_PARECER_Parecer_CECDCT_rel_Luiz_Marenco_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('8d2819ae-005b-4cf2-ac26-554439c9721f', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/178/2020', 'documents/alrs/PL178_2020/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 40467, '9b1c5e43e38bef5f62da38ec172a179359e2c4eea02a10071e8e4794aeb1077a', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL178_2020/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('8d2819ae-005b-4cf2-ac26-554439c9721f', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/178/2020', 'documents/alrs/PL178_2020/01_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 229364, '86840e2db12bb98522387b66174c20af612bd6ae9aa1be68c5b7a58643bf6647', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL178_2020/01_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('18e98a6c-1c70-4c75-9de8-f749ff02508e', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/183/2025', 'documents/alrs/PL183_2025/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 191913, '826db16b559869f8c649190396d1efb877c6e0244176e1bd23f2848218ea2562', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL183_2025/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('18e98a6c-1c70-4c75-9de8-f749ff02508e', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/183/2025', 'documents/alrs/PL183_2025/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 108468, 'df6d75023d903479dff56f6429e0a76c6445f2741997c0c3e03fd6ece245deaf', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL183_2025/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 43284, '2598f74430f1ff50b4b896f1c5227b182e266905be8fb80c45dfd236c52e45d2', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 86438, '3088382c210eecdf50be90bee3624f98294318a60294e2988f2866aed45e9c5e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/02_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 135539, 'ec48e9fa267957b4168ad304f4bc751ec90c9cb1b7a325ee7c8a9658869f146d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/02_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/03_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 191123, 'a9651f830427082d182314e8005877cd4b8b68c7889ff889719d3bab3063f35f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/03_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/04_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 188261, 'a02c8ba60882dfa1aaa86f09382930aef8ab95835909d0879aa56ed00f1395d1', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/04_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/05_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 190371, '7cc654ede38cfa1d332dfa03c85d1c9a96b0d2977aa2a0478cf82c46f27452b6', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/05_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/06_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 208673, '9ff68a5f0a9d584de301f77e10edcdfe2fb763d4a6fb31f01d5778175c1719e8', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/06_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/07_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 367315, '1bc049d43ba331d142ede0faa67a1ae9d5ee32c602d61dbadf434d0ebad219d6', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/07_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/08_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 93446, '65cf4a12384fdfdb484b7d4d2f4bb051018d0d0418d746a2e1167247d6f4f5bd', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/08_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-8', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/09_ANEXO_Anexo_Anexo_8.pdf',
   'application/pdf', 186791, '4d83f4b2970addfaec55ae18e90ed9bfb9dfefee43119eb2c81da662b1c1064c', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/09_ANEXO_Anexo_Anexo_8.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-9', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/10_ANEXO_Anexo_Anexo_9.pdf',
   'application/pdf', 188387, '082eef1fdd603165a21ee4c8f07d41fa1603ac01af0607f12f717e00b47e008a', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/10_ANEXO_Anexo_Anexo_9.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-10', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/11_ANEXO_Anexo_Anexo_10.pdf',
   'application/pdf', 199126, 'da02855ba0465d0b108dbbd47c5198ef590e3c92acb87d5bf83b6af4ece896ab', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/11_ANEXO_Anexo_Anexo_10.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-11', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/12_ANEXO_Anexo_Anexo_11.pdf',
   'application/pdf', 190963, '725a73bcbf24434fff24cd7de558a707b587346b22e8b022fd297e30abbd5982', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/12_ANEXO_Anexo_Anexo_11.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-12', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/13_ANEXO_Anexo_Anexo_12.pdf',
   'application/pdf', 261558, '40cdc40f1d106f0699dd6d41c7d049da2bb4efd132690275e6717e9b36a717ce', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/13_ANEXO_Anexo_Anexo_12.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-13', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/14_ANEXO_Anexo_Anexo_13.pdf',
   'application/pdf', 205034, 'f4367c288b5fd618ad6839f5e78dcf7e97965bba64ed6c9d6443f868153af03d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/14_ANEXO_Anexo_Anexo_13.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-14', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/15_ANEXO_Anexo_Anexo_14.pdf',
   'application/pdf', 395318, '245aadb3dae5a90f03daf0fbe57edf23ca5469d3401292dfa26e32435055b913', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/15_ANEXO_Anexo_Anexo_14.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-15', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/16_ANEXO_Anexo_Anexo_15.pdf',
   'application/pdf', 207678, '26c560171ac6f91ffddd8be87ae9749aa63764519c50808bf3500dfa17768a38', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/16_ANEXO_Anexo_Anexo_15.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-16', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/17_ANEXO_Anexo_Anexo_16.pdf',
   'application/pdf', 204378, '8013c59db24759bdf8c455354404d3f3009d0207a19a3d96fc85690b6433699b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/17_ANEXO_Anexo_Anexo_16.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-17', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/18_ANEXO_Anexo_Anexo_17.pdf',
   'application/pdf', 197499, '161134b38858979f183f2f35e61a434e0b6c79ab1402deaf15fb1793d371b5bd', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/18_ANEXO_Anexo_Anexo_17.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-18', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/19_ANEXO_Anexo_Anexo_18.pdf',
   'application/pdf', 206894, 'a8f1c50ee9aaf108900ca732f379d433b5473eeccb64bd6ccd756f5c06c56ec3', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/19_ANEXO_Anexo_Anexo_18.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-19', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/20_ANEXO_Anexo_Anexo_19.pdf',
   'application/pdf', 232099, 'e0375b875896c5482107fc1094008d1f4d95efd2eb6cd341105e7d9d9f785f3b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/20_ANEXO_Anexo_Anexo_19.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-20', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/21_ANEXO_Anexo_Anexo_20.pdf',
   'application/pdf', 205103, '56de33ec2bd5d7bea2ae2913a33187d1bde5d68ef433548b844dbce5e8eb996d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/21_ANEXO_Anexo_Anexo_20.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'ANEXO', 'Anexo Anexo-21', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/22_ANEXO_Anexo_Anexo_21.pdf',
   'application/pdf', 198676, '8a1162767534791b7ec17a9bd1450ec6bac62da3f746133dbe5fefea24d79e77', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/22_ANEXO_Anexo_Anexo_21.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('ff2efdfc-b02a-4059-bf4d-44117c465ef6', 'PARECER', 'Parecer CCJ - rel. Professor Bonatto - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/243/2021', 'documents/alrs/PL243_2021/23_PARECER_Parecer_CCJ_rel_Professor_Bonatto_Favor_vel_Aprovado.pdf',
   'application/pdf', 192733, '0b62eecd021c9a68674941ca3ce9f6d936c585b9878f1ec833816231b28095bd', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL243_2021/23_PARECER_Parecer_CCJ_rel_Professor_Bonatto_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 31695, '4d933c0705b5f752a2ce88c66fe879e9d57fec8e46fa4520429ddd55a824222e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 75313, '2e18f7b1ae4522a8743c5ad393d3cfa2e8a303c841607c772bc1d1144593ead9', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'OFICIO', 'Ofício', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/02_OFICIO_Of_cio.pdf',
   'application/pdf', 163649, '4a907c92a7cd77aae167965b2bd9d2aa8982c3510312e1d7248a07a19fe47a45', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/02_OFICIO_Of_cio.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/03_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 211831, '17b4d53e7a4d9ed8653de7beb4ba7496a1370ee0ae2a12e4325af064f41e1b4c', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/03_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/04_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 201882, 'a18d9746d874fbf6f791f46990dbb6eb5ab27ee34c692ad3dbfdc35f805bcc10', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/04_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/05_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 172888, 'dffbae26c0ff12b9033f4ddea734744f04c17e71a071ce06e2b95ec38e1280b9', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/05_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/06_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 341029, 'd0da3334a9dbcccaba5f7129444c4a26c285e7bbef7663175f1636e952cffc43', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/06_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/07_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 338177, 'a1afde9f96e316930415ec409fa3c572f55c5e342da609977059f396bb11fdf2', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/07_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/08_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 196722, '4e9bc6b3fc528b8b91623817e571c85f0d200c75175775a61a9092146cdf411a', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/08_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/09_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 221673, 'c42bb61987346d360fa39a32cb9ad0eb7541c54e3288a4f408f0a3e650fef41d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/09_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-8', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/10_ANEXO_Anexo_Anexo_8.pdf',
   'application/pdf', 207521, 'd0323bd1fe145c9e1fa412a9e69a01b9971f6032d8c1fc3f48c802e4bbc88b10', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/10_ANEXO_Anexo_Anexo_8.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-9', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/11_ANEXO_Anexo_Anexo_9.pdf',
   'application/pdf', 180115, '1951d4bc5819719ba3fcfeabf3e059af8c5c12c0a634f25cbe80a7ee1156545a', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/11_ANEXO_Anexo_Anexo_9.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-10', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/12_ANEXO_Anexo_Anexo_10.pdf',
   'application/pdf', 606073, '1a328077ca0d19f8707f039f54d2d716c0adb0deb63f5e8f60426e738939b75b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/12_ANEXO_Anexo_Anexo_10.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-11', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/13_ANEXO_Anexo_Anexo_11.pdf',
   'application/pdf', 283462, 'f92c56019ba3aecff1c1f13a920500d67b154a7b17e9bc0b5a9f68e7e78c6164', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/13_ANEXO_Anexo_Anexo_11.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-12', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/14_ANEXO_Anexo_Anexo_12.pdf',
   'application/pdf', 605889, '7a14b8ecb8e9190afbaa64b1950afb97c1d5439f3b2cc1c3f6e3180a02dbceb4', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/14_ANEXO_Anexo_Anexo_12.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-13', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/15_ANEXO_Anexo_Anexo_13.pdf',
   'application/pdf', 605574, '5178b6199d98255e2ffb8228371d4b847d1f78d9d7f4ec7a781ce2c788f074b4', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/15_ANEXO_Anexo_Anexo_13.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-14', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/16_ANEXO_Anexo_Anexo_14.pdf',
   'application/pdf', 209722, '45f579293326a4b94ac3d8c09f6d919d936820cd85fb0b9816da89c956dca983', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/16_ANEXO_Anexo_Anexo_14.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-15', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/17_ANEXO_Anexo_Anexo_15.pdf',
   'application/pdf', 44764, '4d4ba311a411c701625a8ed60bf1585f9c5b3ea3e8d7a31b68a934e5786e8569', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/17_ANEXO_Anexo_Anexo_15.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-16', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/18_ANEXO_Anexo_Anexo_16.pdf',
   'application/pdf', 210510, '9d67e0ab59ed49ef768e7dfddcfc045e71a071de4b0acc494d9bd9e044d62435', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/18_ANEXO_Anexo_Anexo_16.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-17', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/19_ANEXO_Anexo_Anexo_17.pdf',
   'application/pdf', 209863, 'ef4e0d577cc4fb307bf8bd4d59a4c312ce003a6a4e1c569a241b494cc7592ba9', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/19_ANEXO_Anexo_Anexo_17.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-18', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/20_ANEXO_Anexo_Anexo_18.pdf',
   'application/pdf', 44764, '4d4ba311a411c701625a8ed60bf1585f9c5b3ea3e8d7a31b68a934e5786e8569', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/20_ANEXO_Anexo_Anexo_18.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-19', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/21_ANEXO_Anexo_Anexo_19.pdf',
   'application/pdf', 104200, 'a66aa1afbcde55766b29febbfcb3614d5688d73769d843effd6f1a8e521c5367', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/21_ANEXO_Anexo_Anexo_19.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-20', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/22_ANEXO_Anexo_Anexo_20.pdf',
   'application/pdf', 115956, 'b78eab3e75eb1eac8eeabe1255a3f65061a91bc114452f6eb93d4a981bc19db5', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/22_ANEXO_Anexo_Anexo_20.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-21', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/23_ANEXO_Anexo_Anexo_21.pdf',
   'application/pdf', 205046, 'ab2604d4356fb961663095b9ac9a943ef509267e392f6c60e1e0e1be0712979d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/23_ANEXO_Anexo_Anexo_21.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-22', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/24_ANEXO_Anexo_Anexo_22.pdf',
   'application/pdf', 209052, 'b1b045a6bc90702ed82042b381fdda0a5b455c7c0e6fcb939147199f18793c3f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/24_ANEXO_Anexo_Anexo_22.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'ANEXO', 'Anexo Anexo-23', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/25_ANEXO_Anexo_Anexo_23.pdf',
   'application/pdf', 222216, 'dd39c692a9ddcea9c2f98347930e644c3f48d33a73fb18cc8f8f196761e72f36', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/25_ANEXO_Anexo_Anexo_23.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('9b6d9abc-7cb4-4048-b72d-f29cfdf3deb6', 'PARECER', 'Parecer CCJ - rel. Delegada Nadine - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/265/2023', 'documents/alrs/PL265_2023/26_PARECER_Parecer_CCJ_rel_Delegada_Nadine_Favor_vel_Aprovado.pdf',
   'application/pdf', 158165, '078ffdbe7a68d1401eac96f5a546b52e6da4b87928040653e52a1720c397174e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL265_2023/26_PARECER_Parecer_CCJ_rel_Delegada_Nadine_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 34304, '05221dc09e573938a32da10aa3db93c344c711e997ef926a909a96ea8e45c407', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 79794, '779e5d9cbec68219bb84b42fce356292754d03840223f00c071cdc4d56957f5e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'OFICIO', 'Ofício', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/02_OFICIO_Of_cio.pdf',
   'application/pdf', 191062, '4375e99509c9c1aff9fe30cfa625d3827b8e0b2dd79d54cea90ccf441d21daae', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/02_OFICIO_Of_cio.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/03_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 212993, '2766c86af4479ec10aa46c7adcafcbda5e1746b7dbdbb482b346bb1cc18e15c9', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/03_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/04_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 209947, '3ba80fbec522373afc6efb20fe6c14202486dba55c6ce528802fa99acfeff4ce', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/04_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/05_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 185865, '841be8a440d404763cc7774ec649ba997b20aee8c7b12f5a6cace81125cd0212', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/05_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/06_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 599863, '45b94a99376c63cf275fa5bc0ba0518eca278c4fe21851d8bc49603bf05a442d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/06_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/07_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 152688, 'aaaeb908f33f825d98669a28a99fe99d4f21f1acd13999212bf7a1410a576c99', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/07_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/08_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 207037, '1ee9b80c2390d19bed190dc0fa0d8a1a9c0ffdc077a242a28bb105ea41be8f27', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/08_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/09_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 208577, '37071a1bd9a14edfa83891e174d428e3c9a1f79629e8345a1868307b0817bfe0', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/09_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-8', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/10_ANEXO_Anexo_Anexo_8.pdf',
   'application/pdf', 200457, 'bab65f7bf02014decce0919a1e6a118faa4b844956d0d8d6f0451cec4891054f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/10_ANEXO_Anexo_Anexo_8.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-9', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/11_ANEXO_Anexo_Anexo_9.pdf',
   'application/pdf', 310383, 'f813ab4fb45dfbd3eeeeb8f380fbd0814341afbe2bf9a5bc90021fa12088c7a3', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/11_ANEXO_Anexo_Anexo_9.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-10', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/12_ANEXO_Anexo_Anexo_10.pdf',
   'application/pdf', 376345, 'ae35e4a17964b8377353e31372d042d1b77bf9867179a8e21cb17263664e65ac', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/12_ANEXO_Anexo_Anexo_10.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-11', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/13_ANEXO_Anexo_Anexo_11.pdf',
   'application/pdf', 378264, '3ba7165cc6515dbf7f329df6d895ad1805b4e9a238be0355cff7482f395ebcc7', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/13_ANEXO_Anexo_Anexo_11.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-12', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/14_ANEXO_Anexo_Anexo_12.pdf',
   'application/pdf', 190364, 'e40d2a280c7814c755e7156baf9c6de8d616f3b534692065d07731594a9f07cb', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/14_ANEXO_Anexo_Anexo_12.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-13', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/15_ANEXO_Anexo_Anexo_13.pdf',
   'application/pdf', 45817, 'bf019da0e534b2ca29476ddfba25cfdd383b9df26bb0b25429e99b49b9f93f2d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/15_ANEXO_Anexo_Anexo_13.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-14', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/16_ANEXO_Anexo_Anexo_14.pdf',
   'application/pdf', 45817, 'bf019da0e534b2ca29476ddfba25cfdd383b9df26bb0b25429e99b49b9f93f2d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/16_ANEXO_Anexo_Anexo_14.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-15', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/17_ANEXO_Anexo_Anexo_15.pdf',
   'application/pdf', 105987, '59a28e43975d72dfe04a94a8e6c138dec7905b2887272e2bb3e4398fbd8f49fd', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/17_ANEXO_Anexo_Anexo_15.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-16', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/18_ANEXO_Anexo_Anexo_16.pdf',
   'application/pdf', 116489, '2dc46649a313e720a3d27b1e6f74d7ef98f7160555bcdc55cbdce49148874f68', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/18_ANEXO_Anexo_Anexo_16.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-17', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/19_ANEXO_Anexo_Anexo_17.pdf',
   'application/pdf', 77486, '481d0c7870cf7ad7fa15065696dd7cc109d44f47af859f7ecb17b81155e99451', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/19_ANEXO_Anexo_Anexo_17.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-18', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/20_ANEXO_Anexo_Anexo_18.pdf',
   'application/pdf', 188998, '82745ec9ea004f01fa098d86a14d19109be5c7a5291b1ff8fd7052b09fde0aba', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/20_ANEXO_Anexo_Anexo_18.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'ANEXO', 'Anexo Anexo-19', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/21_ANEXO_Anexo_Anexo_19.pdf',
   'application/pdf', 201833, 'a07350d829ca230df11d4bc7dc958061f70e75950e22ffc1729bfc41e08f1dfe', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/21_ANEXO_Anexo_Anexo_19.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'PARECER', 'Parecer CCJ - rel. Professor Bonatto - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/22_PARECER_Parecer_CCJ_rel_Professor_Bonatto_Favor_vel_Aprovado.pdf',
   'application/pdf', 217711, 'b3823a67b0e63cffa5b1a43a8e4f667ad9edf9a3f5088e686fc1d94f4c6e6321', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/22_PARECER_Parecer_CCJ_rel_Professor_Bonatto_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5651d51b-22b4-44ff-8893-e0d2aaf59e1e', 'PARECER', 'Parecer CSSP - rel. Delegada Nadine - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/266/2023', 'documents/alrs/PL266_2023/23_PARECER_Parecer_CSSP_rel_Delegada_Nadine_Favor_vel_Aprovado.pdf',
   'application/pdf', 184146, '5494291554ea0899a31e8b2a6c96d17177cab17756bfa0448d622f97a89797c4', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL266_2023/23_PARECER_Parecer_CSSP_rel_Delegada_Nadine_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 38835, 'd21ce239ed09be68aafedd06ee1c20ce6933830c3bf49708fa013c802e858fe0', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 86916, '6a2fabf334092de63e33fca8771ff9b35d40e64cdf130eec1790141f0c128a37', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/02_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 30790, 'b5cefc83356845fcd122af113666aeb60e4c61ae3ade9db16b1155f9836f8752', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/02_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/03_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 21055, '920407ea954d411784f7d12646c5a63bda6a8ebead8eb3df658f56ae910e98f2', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/03_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/04_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 691878, '19c7cff58f21f739251bba9a1b58a0731d0921838732e479bea128d80f08405f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/04_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/05_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 203555, '04e7fc6007fd196aa199f6869cd1871c75b0307cfd36625022b113ebd137b724', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/05_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/06_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 227810, 'a84218debc2ae07f32bcd77de2a296e6b9a6e89b3be9298b53777dc22d740e3f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/06_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/07_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 225202, '9b6242d77aec317801b60909eba16e267ea5610555501213245d8d52a4029759', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/07_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/08_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 202197, 'a15abbb02eb1b52489ce66f219a3c8e2913b32109dbc76b5868699c2a0d5379b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/08_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'PARECER', 'Parecer CCJ - rel. Carlos Búrigo - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/09_PARECER_Parecer_CCJ_rel_Carlos_B_rigo_Favor_vel_Aprovado.pdf',
   'application/pdf', 30790, 'b5cefc83356845fcd122af113666aeb60e4c61ae3ade9db16b1155f9836f8752', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/09_PARECER_Parecer_CCJ_rel_Carlos_B_rigo_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('cdc6d82f-fe31-443d-8d71-9c3c46ad7363', 'PARECER', 'Parecer CAM - rel. Dirceu Franciscon - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/280/2019', 'documents/alrs/PL280_2019/10_PARECER_Parecer_CAM_rel_Dirceu_Franciscon_Favor_vel_Aprovado.pdf',
   'application/pdf', 21055, '920407ea954d411784f7d12646c5a63bda6a8ebead8eb3df658f56ae910e98f2', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL280_2019/10_PARECER_Parecer_CAM_rel_Dirceu_Franciscon_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('af01d0b2-dc79-4eaf-a112-1764139f5a6c', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/292/2019', 'documents/alrs/PL292_2019/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 39867, 'e81728c98ff6297fd2978fb0f1f2e28ed29d83a94c535f3eeff39634300b81c3', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL292_2019/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('af01d0b2-dc79-4eaf-a112-1764139f5a6c', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/292/2019', 'documents/alrs/PL292_2019/01_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 33098, 'fcd45c1c16539b363b9cbe2c70972225b7e3280d0ab9064d6c88b7fdd5a3e0e6', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL292_2019/01_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('af01d0b2-dc79-4eaf-a112-1764139f5a6c', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/292/2019', 'documents/alrs/PL292_2019/02_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 46176, '0e90573a8aa53a4dcf4810b1ccf83fc1daae1c1743b997f305d0a2f606fd9adc', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL292_2019/02_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('af01d0b2-dc79-4eaf-a112-1764139f5a6c', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/292/2019', 'documents/alrs/PL292_2019/03_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 56549, 'caac3be6f7ab5b94ad3624515b701652379aee39e1bfeceb455f1c1fe3aca950', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL292_2019/03_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('af01d0b2-dc79-4eaf-a112-1764139f5a6c', 'PARECER', 'Parecer CCJ - rel. Fran Somensi - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/292/2019', 'documents/alrs/PL292_2019/04_PARECER_Parecer_CCJ_rel_Fran_Somensi_Favor_vel_Aprovado.pdf',
   'application/pdf', 33098, 'fcd45c1c16539b363b9cbe2c70972225b7e3280d0ab9064d6c88b7fdd5a3e0e6', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL292_2019/04_PARECER_Parecer_CCJ_rel_Fran_Somensi_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('af01d0b2-dc79-4eaf-a112-1764139f5a6c', 'PARECER', 'Parecer CEDST - rel. Eric Lins  - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/292/2019', 'documents/alrs/PL292_2019/05_PARECER_Parecer_CEDST_rel_Eric_Lins_Favor_vel_Aprovado.pdf',
   'application/pdf', 46176, '0e90573a8aa53a4dcf4810b1ccf83fc1daae1c1743b997f305d0a2f606fd9adc', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL292_2019/05_PARECER_Parecer_CEDST_rel_Eric_Lins_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('da2b9942-e207-459e-ad2e-2f008902f834', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/332/2025', 'documents/alrs/PL332_2025/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 312746, 'a98897b993cffed026ead2c0cd2383ff2da33cf8dbf4d61667336aa2d7a68ba8', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL332_2025/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('da2b9942-e207-459e-ad2e-2f008902f834', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/332/2025', 'documents/alrs/PL332_2025/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 114685, 'fe5f9736d01b8353172900f8a043bf58eab0c87f38fcca7378d22d92de8dbd79', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL332_2025/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('da2b9942-e207-459e-ad2e-2f008902f834', 'PARECER', 'Parecer CCJ - rel. Gustavo Victorino - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/332/2025', 'documents/alrs/PL332_2025/02_PARECER_Parecer_CCJ_rel_Gustavo_Victorino_Favor_vel_Aprovado.pdf',
   'application/pdf', 180348, '69c7372b311dece35c69633217824c804c011f4962f6a733ed41d4a2968e435a', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL332_2025/02_PARECER_Parecer_CCJ_rel_Gustavo_Victorino_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('da2b9942-e207-459e-ad2e-2f008902f834', 'PARECER', 'Parecer CSMA - rel. Airton Artus - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/332/2025', 'documents/alrs/PL332_2025/03_PARECER_Parecer_CSMA_rel_Airton_Artus_Favor_vel_Aprovado.pdf',
   'application/pdf', 160115, '71eea5924c1138bce3d8d1a98555b3239f978fa6cfffcdb8395008bafa792e39', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL332_2025/03_PARECER_Parecer_CSMA_rel_Airton_Artus_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b9d87524-b571-4bc9-9bf6-031673c564d9', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/347/2019', 'documents/alrs/PL347_2019/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 42110, 'd5f2daa3e2759ec5b741cf7d4df6ef17cb91ceadcdffeef737022fc352ff4e88', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL347_2019/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b9d87524-b571-4bc9-9bf6-031673c564d9', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/347/2019', 'documents/alrs/PL347_2019/01_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 962678, '6084e6395fe1af258dfa9ba265d377eedc2ca41fa0ebd5b158c25dd8cb942038', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL347_2019/01_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b9d87524-b571-4bc9-9bf6-031673c564d9', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/347/2019', 'documents/alrs/PL347_2019/02_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 27420, '0bf58baefb3aee8fa39edf3def7e72a63888439ac0ce34ff86cad5d4dd89a68e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL347_2019/02_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b9d87524-b571-4bc9-9bf6-031673c564d9', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/347/2019', 'documents/alrs/PL347_2019/03_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 49291, '7a8cd6fa2819721bfce6a7eb3cd7db65a04ca85936959a03c3fe0e976650718b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL347_2019/03_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b9d87524-b571-4bc9-9bf6-031673c564d9', 'PARECER', 'Parecer CCJ - rel. Tenente Coronel Zucco - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/347/2019', 'documents/alrs/PL347_2019/04_PARECER_Parecer_CCJ_rel_Tenente_Coronel_Zucco_Favor_vel_Aprovado.pdf',
   'application/pdf', 27420, '0bf58baefb3aee8fa39edf3def7e72a63888439ac0ce34ff86cad5d4dd89a68e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL347_2019/04_PARECER_Parecer_CCJ_rel_Tenente_Coronel_Zucco_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f65ac383-884e-4418-9842-1e37c885240d', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/362/2019', 'documents/alrs/PL362_2019/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 34590, 'd873be1c556d5c18cb271e98203104c777cced4541dbd208915e5453993e510f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL362_2019/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f65ac383-884e-4418-9842-1e37c885240d', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/362/2019', 'documents/alrs/PL362_2019/01_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 26016, '86821735cb0e5f9c0200255b23063e309b08e36e7cd7a0b65b32d4309415bcdc', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL362_2019/01_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f65ac383-884e-4418-9842-1e37c885240d', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/362/2019', 'documents/alrs/PL362_2019/02_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 47161, 'df99515afc36b84573667e4aa7b2265a0dad66acb47b9f381450b689aec32ff3', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL362_2019/02_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('f65ac383-884e-4418-9842-1e37c885240d', 'PARECER', 'Parecer CCJ - rel. Sérgio Turra - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/362/2019', 'documents/alrs/PL362_2019/03_PARECER_Parecer_CCJ_rel_S_rgio_Turra_Favor_vel_Aprovado.pdf',
   'application/pdf', 26016, '86821735cb0e5f9c0200255b23063e309b08e36e7cd7a0b65b32d4309415bcdc', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL362_2019/03_PARECER_Parecer_CCJ_rel_S_rgio_Turra_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 81687, '35e6fd3c5ff2df0f7a508580d36a998840462fa2ea5d0d1c650bb61bf8e644ab', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 151914, '0a97d786c77b9425a0f0dc9b9ea4bfea505cdae4b6f838a222d5e87673607bd1', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'OFICIO', 'Ofício', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/02_OFICIO_Of_cio.pdf',
   'application/pdf', 191784, '630e4e5fe790601fe2996271be11720269435a1e5b9da7a7b5deaa8b139a4592', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/02_OFICIO_Of_cio.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/03_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 27206, 'fafc2d1394a71cb2880b0bff9ce8cb411601d01298611221fe455ae23de9aafd', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/03_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/04_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 299627, '92f2e4cb552c062794112b74311e9f6a9f423c5e357d09b530f23759a60f3468', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/04_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/05_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 207507, 'f9a785909d2d458185bd6f04ccc16e63b2fa83b5461b13c4706607ce95ca9f34', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/05_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/06_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 211296, '9626ec7ecbfc2bc14a7ef929ef898bef48bd83a43555693602f6a5e7b30aa1c9', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/06_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/07_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 256313, '3f5cdad6e6cd024d8f1bfeac0077d1939732b4a4bece94e033ea5fccc857dc3d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/07_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/08_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 564583, '2a23779968b7fe96fc5261ca495d9672a9f3283b2d64f28dbec9e2ba7acd374c', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/08_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/09_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 508100, 'e7009c3d11dade26e7bd94fc9deea16e9ea9ba7a10d65de64e0cc0036556e21b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/09_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-8', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/10_ANEXO_Anexo_Anexo_8.pdf',
   'application/pdf', 206331, '8b3808ab7565f98d90be7b1232546c19ec62c2a62776b88fe6790e044e2b66eb', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/10_ANEXO_Anexo_Anexo_8.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-9', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/11_ANEXO_Anexo_Anexo_9.pdf',
   'application/pdf', 210312, 'e367d0dc7cfa93baab51b84887f038b6dad11bacd9a453b00f264cae58d8af3a', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/11_ANEXO_Anexo_Anexo_9.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-10', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/12_ANEXO_Anexo_Anexo_10.pdf',
   'application/pdf', 210934, '84d3074ae80c217cf8e3bae3bdd533d1229b240b52c633c19572f9539a51dd49', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/12_ANEXO_Anexo_Anexo_10.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-11', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/13_ANEXO_Anexo_Anexo_11.pdf',
   'application/pdf', 210156, '90fa26384f4c627483d3d7a8533c07bc780bfedbd582b4f041976d23a95a06b5', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/13_ANEXO_Anexo_Anexo_11.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-12', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/14_ANEXO_Anexo_Anexo_12.pdf',
   'application/pdf', 244035, 'd1d050cedf8729e22aa0aa5a37befaa33b589f2d9be5ce5aea082930ef3a8985', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/14_ANEXO_Anexo_Anexo_12.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-13', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/15_ANEXO_Anexo_Anexo_13.pdf',
   'application/pdf', 168472, 'd2a3c0e26c440dde2a2104fef3a9be87657a4a09e28cabf74e9090ae35b7f516', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/15_ANEXO_Anexo_Anexo_13.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-14', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/16_ANEXO_Anexo_Anexo_14.pdf',
   'application/pdf', 332050, '465e1ad0cca24e9037e5f7c70ff2edefd29fe1039b646d676bef6580be9ef029', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/16_ANEXO_Anexo_Anexo_14.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-15', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/17_ANEXO_Anexo_Anexo_15.pdf',
   'application/pdf', 166757, 'a2b45f50e5a89765a346e9592e5a2fbb4be99f5943577c4dc947b739f69fbd4b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/17_ANEXO_Anexo_Anexo_15.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-16', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/18_ANEXO_Anexo_Anexo_16.pdf',
   'application/pdf', 210645, '8008bcf258f554296de4a0956c0b95988d453d91a02c7bcb30ba9a9192c6c5c2', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/18_ANEXO_Anexo_Anexo_16.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-17', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/19_ANEXO_Anexo_Anexo_17.pdf',
   'application/pdf', 112686, '65769357460fe352d2059e8b2d9dd0ce2218a526f4482ee002fdfa7719986966', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/19_ANEXO_Anexo_Anexo_17.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-18', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/20_ANEXO_Anexo_Anexo_18.pdf',
   'application/pdf', 200221, '1d848a18e107cc546cf7c8ee8ac7380f5a4cc9cb1d362681dd82f2b930e6b354', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/20_ANEXO_Anexo_Anexo_18.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-19', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/21_ANEXO_Anexo_Anexo_19.pdf',
   'application/pdf', 138320, '907dc911d8905bb5a11e399a061e6bb33517294a9df966d51b58efde9462973e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/21_ANEXO_Anexo_Anexo_19.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-20', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/22_ANEXO_Anexo_Anexo_20.pdf',
   'application/pdf', 138366, 'ef78b1983e0dbac7fbbac55d97ff5ed1fc4436aa7ded3f2a46c369acbaa91502', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/22_ANEXO_Anexo_Anexo_20.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-21', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/23_ANEXO_Anexo_Anexo_21.pdf',
   'application/pdf', 209338, 'fc9d6091a4653c207041eb1db90e3d6949bb56c4b2bad52e41d1c2f69108db2f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/23_ANEXO_Anexo_Anexo_21.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'ANEXO', 'Anexo Anexo-22', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/24_ANEXO_Anexo_Anexo_22.pdf',
   'application/pdf', 187616, '12b3a2bf5da52acad99efe38c00fc91b4924526a4049caeb440ae3e89e5b2136', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/24_ANEXO_Anexo_Anexo_22.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'PARECER', 'Parecer CCJ - rel. Professor Bonatto - Favorável c/Emenda(s) (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/25_PARECER_Parecer_CCJ_rel_Professor_Bonatto_Favor_vel_c_Emenda_s_Aprov.pdf',
   'application/pdf', 27206, 'fafc2d1394a71cb2880b0bff9ce8cb411601d01298611221fe455ae23de9aafd', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/25_PARECER_Parecer_CCJ_rel_Professor_Bonatto_Favor_vel_c_Emenda_s_Aprov.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b808a3c2-d83c-48c2-a0a0-0a8e0f4a795b', 'PARECER', 'Parecer CSMA - rel. Valdeci Oliveira - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/388/2023', 'documents/alrs/PL388_2023/26_PARECER_Parecer_CSMA_rel_Valdeci_Oliveira_Favor_vel_Aprovado.pdf',
   'application/pdf', 240359, '503df9b3e2f321238c468c8b480566d326fe54afbeb5f486cb580bcc1413e1c8', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL388_2023/26_PARECER_Parecer_CSMA_rel_Valdeci_Oliveira_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 39151, 'b52b373c6345eff67aff041a171edce68eccaaee58a17087b33044f8374d2861', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 104571, '099b5b9de4443a74da0fc44afa5b936b5552fddcc4a27ee0d62cda51a62a1719', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/02_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 46954, '0193af93bad4688233e83ffff6647816ca88819a07c8e8a4d7ee29d31b22f73f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/02_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/03_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 40158, '708d82a2f362d4b736748ed9b32b0e473d6303205993e93bc5098cd0fa5426b0', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/03_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/04_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 212096, '5f91bfee744c05d6b7f96253b93667da9ca1e5e80485697073d3c437a334194a', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/04_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/05_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 212316, '64722cb200819d1099c10b6346ed9f4a9be1ef8a19845f7c360f8d9ced07fbb7', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/05_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/06_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 223898, '0408658ab46a2b1e17845357ec531eccd4ca226823415d313a9c3b844c1836c5', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/06_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/07_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 207138, 'f970a0066489acaedc45475e6975b318064217b7cc7de252382e8f58361461dd', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/07_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/08_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 223920, 'd9112ea69df2f2005893878c613b5e11704603704a8753526a21525e9a2772e9', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/08_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'ANEXO', 'Anexo Anexo-8', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/09_ANEXO_Anexo_Anexo_8.pdf',
   'application/pdf', 200462, '32bcc98fe7c23e3da6ed35ea4159c358385936c162a84c0a33bf4187c0760c23', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/09_ANEXO_Anexo_Anexo_8.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'PARECER', 'Parecer CCJ - rel. Carlos Búrigo - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/10_PARECER_Parecer_CCJ_rel_Carlos_B_rigo_Favor_vel_Aprovado.pdf',
   'application/pdf', 46954, '0193af93bad4688233e83ffff6647816ca88819a07c8e8a4d7ee29d31b22f73f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/10_PARECER_Parecer_CCJ_rel_Carlos_B_rigo_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('dda18446-2ad6-4eba-8e7f-f01feab899a3', 'PARECER', 'Parecer CSSP - rel. Fábio Ostermann - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/480/2021', 'documents/alrs/PL480_2021/11_PARECER_Parecer_CSSP_rel_F_bio_Ostermann_Favor_vel_Aprovado.pdf',
   'application/pdf', 40158, '708d82a2f362d4b736748ed9b32b0e473d6303205993e93bc5098cd0fa5426b0', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL480_2021/11_PARECER_Parecer_CSSP_rel_F_bio_Ostermann_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 40797, '6235acec5f2ed1de40e1936534098f67c664f49bee432cc4920835eaa145717e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 85771, '6abf61a362c528c0acc5a0578ea0e55960e5e99d808931eee4355f0037eb2374', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/02_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 213359, '0422de56841c261709b78cdc392e68113463d1a355090331f14eba53aa9e489b', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/02_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/03_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 572399, 'a59228b933e06ed4b2656e3cf5ea99890a53b9f741deeebbf5ab3ffde6c77bb1', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/03_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/04_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 152201, '3b8f5a71271865dae4c29fbe82b25caedbd5e2046d3696a82ce57a6a624a42f2', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/04_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/05_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 207467, '7e5071c9a774e0d8249963bf14732e27ee126e6bb499ccd3c11a27a91698d975', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/05_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/06_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 211564, '8fee41099f3844a2b78b388ce7dc9facb4e0b0582564fffc805469addbde2fe1', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/06_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/07_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 192626, 'e3dd5ae87147b7c8169a15914b986a4aab30b153cd77b2367862c7d5c67d93d1', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/07_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/08_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 181697, 'c3cca774af92a528739bc940fd2a0db3e378ae397b6b3e8a5e9391586a889570', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/08_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-8', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/09_ANEXO_Anexo_Anexo_8.pdf',
   'application/pdf', 321819, 'fffd845bf632348bc0eb5aafb0ae99193647fe9c0da9951264d6ea2592b25699', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/09_ANEXO_Anexo_Anexo_8.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-9', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/10_ANEXO_Anexo_Anexo_9.pdf',
   'application/pdf', 509245, '49a84892891b1fd8ba6ff5edea0cb5509ff3879b472cdef6a1a3ebc4253d133f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/10_ANEXO_Anexo_Anexo_9.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-10', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/11_ANEXO_Anexo_Anexo_10.pdf',
   'application/pdf', 196108, 'a73da087f185c74a1be783b3bb5002201fca302fcfcdd35181c47da2847afa05', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/11_ANEXO_Anexo_Anexo_10.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-11', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/12_ANEXO_Anexo_Anexo_11.pdf',
   'application/pdf', 220946, '464e3a50d8fd8dd87cab14b27b33c37d07c88699f35d99ad6868a105acf1a153', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/12_ANEXO_Anexo_Anexo_11.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-12', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/13_ANEXO_Anexo_Anexo_12.pdf',
   'application/pdf', 209531, 'c8de6a86d9bc3dfbe82d3b8799905946e00505ea60937ee15a4d5d42966a0d68', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/13_ANEXO_Anexo_Anexo_12.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-13', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/14_ANEXO_Anexo_Anexo_13.pdf',
   'application/pdf', 210636, 'afca693e2f37fe8c82486e4836aee7ca1d12cbedb9b5f6276848733f30c9ad31', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/14_ANEXO_Anexo_Anexo_13.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-14', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/15_ANEXO_Anexo_Anexo_14.pdf',
   'application/pdf', 200141, '549f57fc3d4f70161fc723bf110fdff1810f93487c0ce420ef703c0a5d1e73e3', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/15_ANEXO_Anexo_Anexo_14.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-15', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/16_ANEXO_Anexo_Anexo_15.pdf',
   'application/pdf', 207360, 'f1bbb0c72297736156e98dd086150fb9e1c33e7174752b817a1552069c734cf0', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/16_ANEXO_Anexo_Anexo_15.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'ANEXO', 'Anexo Anexo-16', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/17_ANEXO_Anexo_Anexo_16.pdf',
   'application/pdf', 200389, 'ae8b2c02e24aa55d99c0066c488fc4912343b333f62b07c987479445889bdab6', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/17_ANEXO_Anexo_Anexo_16.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'PARECER', 'Parecer CCJ - rel. Frederico Antunes - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/18_PARECER_Parecer_CCJ_rel_Frederico_Antunes_Favor_vel_Aprovado.pdf',
   'application/pdf', 248379, 'd018bf693f9c34aee39eae7d5ba044f9a32d58632f90d27be5d29cf605bce5aa', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/18_PARECER_Parecer_CCJ_rel_Frederico_Antunes_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d8bbdc42-3c74-4ce1-8c99-e17e430bce05', 'PARECER', 'Parecer CSMA - rel. Eliana Bayer - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/481/2023', 'documents/alrs/PL481_2023/19_PARECER_Parecer_CSMA_rel_Eliana_Bayer_Favor_vel_Aprovado.pdf',
   'application/pdf', 183718, 'ec452d506d72ef31e372b7f396d016f6a678dab186484a4687c8d4a43fa6f309', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL481_2023/19_PARECER_Parecer_CSMA_rel_Eliana_Bayer_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5456d90f-cc3c-493c-a6ae-57c1b725b54a', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/60/2021', 'documents/alrs/PL60_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 35126, '27261a86014b5510e46713c7754b4995a757e93eb1cc64e38826e188797b0ed0', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL60_2021/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5456d90f-cc3c-493c-a6ae-57c1b725b54a', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/60/2021', 'documents/alrs/PL60_2021/01_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 31300, '00cb6e60f3cc3b2ad6effd22a95cbf940cae5795c737cab2273aaec92444ba58', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL60_2021/01_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5456d90f-cc3c-493c-a6ae-57c1b725b54a', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/60/2021', 'documents/alrs/PL60_2021/02_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 21251, '13f762318f6418111833315a6d4994cef19c81f45b222e4074e8547ef5e8909d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL60_2021/02_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5456d90f-cc3c-493c-a6ae-57c1b725b54a', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/60/2021', 'documents/alrs/PL60_2021/03_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 45904, '879de4f7d128b4b6f9b89f5a4a4fccd21306667447502a1dac3fe2258b16133c', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL60_2021/03_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5456d90f-cc3c-493c-a6ae-57c1b725b54a', 'PARECER', 'Parecer CCJ - rel. Pepe Vargas - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/60/2021', 'documents/alrs/PL60_2021/04_PARECER_Parecer_CCJ_rel_Pepe_Vargas_Favor_vel_Aprovado.pdf',
   'application/pdf', 31300, '00cb6e60f3cc3b2ad6effd22a95cbf940cae5795c737cab2273aaec92444ba58', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL60_2021/04_PARECER_Parecer_CCJ_rel_Pepe_Vargas_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('5456d90f-cc3c-493c-a6ae-57c1b725b54a', 'PARECER', 'Parecer CECDCT - rel. Fernando Marroni - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PL/60/2021', 'documents/alrs/PL60_2021/05_PARECER_Parecer_CECDCT_rel_Fernando_Marroni_Favor_vel_Aprovado.pdf',
   'application/pdf', 21251, '13f762318f6418111833315a6d4994cef19c81f45b222e4074e8547ef5e8909d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL60_2021/05_PARECER_Parecer_CECDCT_rel_Fernando_Marroni_Favor_vel_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 48367, '78d15103021e5130d002b10256b8ae001b10be9c0f793584eeec58ce47bfccdb', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (ultima versao)', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf',
   'application/pdf', 110212, '0743d30263343280c521cd223ee366fcc0534e143e7f2aeb462e0049279dbdce', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/01_TEXTO_JUSTIFICATIVA_Texto_Justificativa_ultima_versao.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/02_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 167008, 'dbb6fc834d148298af71aae8427cd030880e2414a927ea333a983cd44b068382', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/02_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/03_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 5010925, '6b8e10067d731f66dff263195a5f16e108685ad8369a8b0100f16199dc6ce937', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/03_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/04_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 132666, '671ea3bd24ce255bbdaa07a6eed97eedf57c130662f29518feae31dc5d579223', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/04_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/05_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 201299, '9a919ea87f49d9098a473ddc96ffebca992e5458671d7279fc448726d572ea7f', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/05_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'ANEXO', 'Anexo Anexo-5', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/06_ANEXO_Anexo_Anexo_5.pdf',
   'application/pdf', 229874, '5da04e3895ed6bd37fc7e3938a2208041b1e2182ce4dbb19c4378a9f85714e34', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/06_ANEXO_Anexo_Anexo_5.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'ANEXO', 'Anexo Anexo-6', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/07_ANEXO_Anexo_Anexo_6.pdf',
   'application/pdf', 201555, '5fd6ee36b43fa24329ae0f5a4ddd84ab928cfb5cca9127cf3bb6383bbdc57d63', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/07_ANEXO_Anexo_Anexo_6.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('b67596e2-e3bc-4c6b-9fe1-0800fdba01c6', 'ANEXO', 'Anexo Anexo-7', 'https://ww4.al.rs.gov.br/proposicao/PL/83/2023', 'documents/alrs/PL83_2023/08_ANEXO_Anexo_Anexo_7.pdf',
   'application/pdf', 201272, 'cb47da47439fd15ba2b887331ef36ae246946bc17a63630d6de58a89efe3970d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PL83_2023/08_ANEXO_Anexo_Anexo_7.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('bd0f6acf-abd5-4e1f-9f0b-a69ce7000895', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/PLC/143/2020', 'documents/alrs/PLC143_2020/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 62031, '4889cd1952ce6f42aa1e001e77527f1ccaaaba88fcdba28c2d2bbf4de22d9608', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PLC143_2020/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('bd0f6acf-abd5-4e1f-9f0b-a69ce7000895', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/PLC/143/2020', 'documents/alrs/PLC143_2020/01_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 57818, '9d4d781576ceed7edf854722088c8643375495cd8fd849c72a310a545d5dfa38', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PLC143_2020/01_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('bd0f6acf-abd5-4e1f-9f0b-a69ce7000895', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/PLC/143/2020', 'documents/alrs/PLC143_2020/02_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 35416, '4ebcea8d470413f1556e3ac1bf58d9c358eab13b05a9ee85a92f3028e16d118d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PLC143_2020/02_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('bd0f6acf-abd5-4e1f-9f0b-a69ce7000895', 'ANEXO', 'Anexo Anexo-3', 'https://ww4.al.rs.gov.br/proposicao/PLC/143/2020', 'documents/alrs/PLC143_2020/03_ANEXO_Anexo_Anexo_3.pdf',
   'application/pdf', 45066, 'c043c513091ebeec1a0bba644499fb7454b11b93027a407aefa2fba8f19a7d09', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PLC143_2020/03_ANEXO_Anexo_Anexo_3.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('bd0f6acf-abd5-4e1f-9f0b-a69ce7000895', 'ANEXO', 'Anexo Anexo-4', 'https://ww4.al.rs.gov.br/proposicao/PLC/143/2020', 'documents/alrs/PLC143_2020/04_ANEXO_Anexo_Anexo_4.pdf',
   'application/pdf', 64208, '74e573ae7c42a72a657cecf30b3274eed0e01b1786e9d94e74e963dd59abed3e', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PLC143_2020/04_ANEXO_Anexo_Anexo_4.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('bd0f6acf-abd5-4e1f-9f0b-a69ce7000895', 'PARECER', 'Parecer CCJ - rel. Sérgio Turra - Favorável c/Emenda(s) (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PLC/143/2020', 'documents/alrs/PLC143_2020/05_PARECER_Parecer_CCJ_rel_S_rgio_Turra_Favor_vel_c_Emenda_s_Aprovado.pdf',
   'application/pdf', 57818, '9d4d781576ceed7edf854722088c8643375495cd8fd849c72a310a545d5dfa38', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PLC143_2020/05_PARECER_Parecer_CCJ_rel_S_rgio_Turra_Favor_vel_c_Emenda_s_Aprovado.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('bd0f6acf-abd5-4e1f-9f0b-a69ce7000895', 'PARECER', 'Parecer CSSP - rel. Jeferson Fernandes - Favorável c/Emenda(s) (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PLC/143/2020', 'documents/alrs/PLC143_2020/06_PARECER_Parecer_CSSP_rel_Jeferson_Fernandes_Favor_vel_c_Emenda_s_Apr.pdf',
   'application/pdf', 35416, '4ebcea8d470413f1556e3ac1bf58d9c358eab13b05a9ee85a92f3028e16d118d', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PLC143_2020/06_PARECER_Parecer_CSSP_rel_Jeferson_Fernandes_Favor_vel_c_Emenda_s_Apr.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('bd0f6acf-abd5-4e1f-9f0b-a69ce7000895', 'PARECER', 'Parecer CAM - rel. Dirceu Franciscon - Favorável c/Emenda(s) (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/PLC/143/2020', 'documents/alrs/PLC143_2020/07_PARECER_Parecer_CAM_rel_Dirceu_Franciscon_Favor_vel_c_Emenda_s_Aprov.pdf',
   'application/pdf', 45066, 'c043c513091ebeec1a0bba644499fb7454b11b93027a407aefa2fba8f19a7d09', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/PLC143_2020/07_PARECER_Parecer_CAM_rel_Dirceu_Franciscon_Favor_vel_c_Emenda_s_Aprov.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d6ed9074-c7b9-48e9-86be-fec8938559e0', 'TEXTO_JUSTIFICATIVA', 'Texto | Justificativa (versao atual)', 'https://ww4.al.rs.gov.br/proposicao/RDI/19/2022', 'documents/alrs/RDI19_2022/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf',
   'application/pdf', 17995, '7b7db30bc060611956a0795ef2303321f511c5634e7a5160f512684fcdb20ce8', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/RDI19_2022/00_TEXTO_JUSTIFICATIVA_Texto_Justificativa_versao_atual.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d6ed9074-c7b9-48e9-86be-fec8938559e0', 'OFICIO', 'Ofício', 'https://ww4.al.rs.gov.br/proposicao/RDI/19/2022', 'documents/alrs/RDI19_2022/01_OFICIO_Of_cio.pdf',
   'application/pdf', 103378, '39e6f9fde7286b9c4228bb42d8a90d5dd0592f993d27828dcdc081fa61f40d70', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/RDI19_2022/01_OFICIO_Of_cio.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d6ed9074-c7b9-48e9-86be-fec8938559e0', 'ANEXO', 'Anexo Anexo-1', 'https://ww4.al.rs.gov.br/proposicao/RDI/19/2022', 'documents/alrs/RDI19_2022/02_ANEXO_Anexo_Anexo_1.pdf',
   'application/pdf', 247592, '9fb9fba388cdd2a98220959b0cd24881adf909c0d76252dad6497597cd57cb15', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/RDI19_2022/02_ANEXO_Anexo_Anexo_1.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d6ed9074-c7b9-48e9-86be-fec8938559e0', 'ANEXO', 'Anexo Anexo-2', 'https://ww4.al.rs.gov.br/proposicao/RDI/19/2022', 'documents/alrs/RDI19_2022/03_ANEXO_Anexo_Anexo_2.pdf',
   'application/pdf', 25329, 'ba25aa5722a5c62cc5c118b91b4c3f904d3eecd3e1277cb5bfeeef124e3c8ff8', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/RDI19_2022/03_ANEXO_Anexo_Anexo_2.pdf.')
on conflict do nothing;
insert into public.documents
  (legislative_item_id, document_type, title, original_url, storage_path,
   mime_type, file_size, sha256, source_name, downloaded_at,
   verification_status, rights_status, notes)
values
  ('d6ed9074-c7b9-48e9-86be-fec8938559e0', 'PARECER', 'Parecer CFPFC - rel. Luiz Fernando Mainardi - Favorável (Aprovado)', 'https://ww4.al.rs.gov.br/proposicao/RDI/19/2022', 'documents/alrs/RDI19_2022/04_PARECER_Parecer_CFPFC_rel_Luiz_Fernando_Mainardi_Favor_vel_Aprovado.pdf',
   'application/pdf', 25329, 'ba25aa5722a5c62cc5c118b91b4c3f904d3eecd3e1277cb5bfeeef124e3c8ff8', 'Assembleia Legislativa do Rio Grande do Sul (ALRS)', now(),
   'VERIFIED_PRIMARY', 'PUBLIC', 'Blob assinado ALRS (expira 2026-09-16). Chave: documents/alrs/RDI19_2022/04_PARECER_Parecer_CFPFC_rel_Luiz_Fernando_Mainardi_Favor_vel_Aprovado.pdf.')
on conflict do nothing;

-- 212 documentos inseridos

commit;