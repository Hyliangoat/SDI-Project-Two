INSERT INTO shop_items
  (code, name, description, image_key, energy_cost, hp_bonus, attack_bonus, defense_bonus, evasion_bonus)
VALUES
  ('crown', 'Crown', 'A royal upgrade that greatly increases combat statistics.', 'crown', 350, 0, 100, 30, 20),
  ('flat-bill', 'Flat Bill', 'A defensive cosmetic that increases defense.', 'hat', 60, 0, 0, 20, 0),
  ('shades', 'Shades', 'Stylish shades that increase evasion.', 'shades', 60, 0, 0, 0, 20),
  ('smart-glasses', 'Anime Smart Glasses', 'Analytical glasses that increase attack.', 'smart-glasses', 60, 0, 20, 0, 0),
  ('bling', 'Bling', 'Heavy cosmic jewelry that increases health.', 'bling', 60, 100, 0, 0, 0)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_key = EXCLUDED.image_key,
  energy_cost = EXCLUDED.energy_cost,
  hp_bonus = EXCLUDED.hp_bonus,
  attack_bonus = EXCLUDED.attack_bonus,
  defense_bonus = EXCLUDED.defense_bonus,
  evasion_bonus = EXCLUDED.evasion_bonus,
  active = TRUE;