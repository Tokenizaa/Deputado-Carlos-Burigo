-- Corrige o arbiter usado pelos loaders eleitorais.
-- O índice anterior era parcial (WHERE tse_party_code IS NOT NULL), o que
-- não podia ser inferido pelo ON CONFLICT (tse_party_code) usado pelo loader.
drop index if exists public.electoral_parties_tse_code_uidx;

create unique index electoral_parties_tse_code_uidx
  on public.electoral_parties (tse_party_code);
