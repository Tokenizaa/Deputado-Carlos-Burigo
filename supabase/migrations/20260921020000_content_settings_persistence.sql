begin;

alter table public.site_settings
  add column if not exists mandate_slogan text not null default '',
  add column if not exists bio_highlights jsonb not null default '[]'::jsonb,
  add column if not exists cta_title text not null default '',
  add column if not exists cta_subtitle text not null default '',
  add column if not exists gabinete_phone_caxias text not null default '',
  add column if not exists campaign_official_name text not null default '';

update public.site_settings
set
  mandate_slogan = case when mandate_slogan = '' then 'Responsabilidade fiscal, apoio ao setor produtivo e defesa contínua dos municípios da Serra Gaúcha e de todo o Estado.' else mandate_slogan end,
  bio_highlights = case when bio_highlights = '[]'::jsonb then '["Prefeito de São José dos Ausentes por dois mandatos","9 anos Secretário da Fazenda de Caxias do Sul","Secretário-Geral e Planejamento do Governo do RS","Autor da Lei da Silvicultura (PL 332/2025)"]'::jsonb else bio_highlights end,
  cta_title = case when cta_title = '' then 'Fale com o Gabinete de Carlos Búrigo' else cta_title end,
  cta_subtitle = case when cta_subtitle = '' then 'Apresente demandas para o seu bairro, solicitações de apoio hospitalar ou sugestões para novos projetos de lei com protocolo rastreável.' else cta_subtitle end,
  gabinete_phone_caxias = case when gabinete_phone_caxias = '' then '(54) 3218-1200' else gabinete_phone_caxias end,
  campaign_official_name = case when campaign_official_name = '' then 'ELEIÇÃO 2026 CARLOS ROBERTO BÚRIGO DEPUTADO ESTADUAL' else campaign_official_name end
where id = true;

commit;
