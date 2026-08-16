BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(40) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  starter_id VARCHAR(30) NOT NULL,
  starter_name VARCHAR(100) NOT NULL,
  avatar_url TEXT NOT NULL,
  description TEXT NOT NULL,
  special_move VARCHAR(100) NOT NULL,
  favorite_element VARCHAR(50) NOT NULL,
  hp INTEGER NOT NULL CHECK (hp > 0),
  attack INTEGER NOT NULL CHECK (attack >= 0),
  defense INTEGER NOT NULL CHECK (defense >= 0),
  evasion INTEGER NOT NULL CHECK (evasion >= 0),
  affinity INTEGER NOT NULL DEFAULT 0 CHECK (affinity >= 0),
  energy INTEGER NOT NULL DEFAULT 500 CHECK (energy >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shop_items (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image_key VARCHAR(100) NOT NULL,
  energy_cost INTEGER NOT NULL CHECK (energy_cost >= 0),
  hp_bonus INTEGER NOT NULL DEFAULT 0,
  attack_bonus INTEGER NOT NULL DEFAULT 0,
  defense_bonus INTEGER NOT NULL DEFAULT 0,
  evasion_bonus INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS player_inventory (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id BIGINT NOT NULL REFERENCES shop_items(id) ON DELETE RESTRICT,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  equipped BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE IF NOT EXISTS campaign_progress (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  campaigns_completed INTEGER NOT NULL DEFAULT 0 CHECK (campaigns_completed >= 0),
  bosses_defeated INTEGER NOT NULL DEFAULT 0 CHECK (bosses_defeated >= 0),
  last_reward_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_user ON player_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_items_active ON shop_items(active);

COMMIT;