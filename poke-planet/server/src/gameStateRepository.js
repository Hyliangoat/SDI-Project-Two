import { HttpError } from "./errors.js";

const STATE_QUERY = `
SELECT p.user_id, p.starter_id, p.starter_name, p.avatar_url, p.description,
       p.special_move, p.favorite_element, p.hp, p.attack, p.defense, p.evasion,
       p.affinity, p.energy,
       COALESCE(cp.campaigns_completed, 0) AS campaigns_completed,
       COALESCE(cp.bosses_defeated, 0) AS bosses_defeated
FROM player_profiles p
LEFT JOIN campaign_progress cp ON cp.user_id = p.user_id
WHERE p.user_id = $1`;

export async function readGameState(client, userId) {
  const profileResult = await client.query(STATE_QUERY, [userId]);
  const shopResult = await client.query(
    `
    SELECT s.id, s.code, s.name, s.description, s.image_key, s.energy_cost,
           s.hp_bonus, s.attack_bonus, s.defense_bonus, s.evasion_bonus,
           (i.item_id IS NOT NULL) AS owned, COALESCE(i.equipped, FALSE) AS equipped
    FROM shop_items s
    LEFT JOIN player_inventory i ON i.item_id = s.id AND i.user_id = $1
    WHERE s.active = TRUE
    ORDER BY s.id`,
    [userId],
  );

  if (profileResult.rowCount === 0) {
    return {
      player: null,
      energy: { amount: 0 },
      inventory: [],
      shop: shopResult.rows,
      progress: { campaignsCompleted: 0, bossesDefeated: 0 },
    };
  }

  const p = profileResult.rows[0];
  const inventory = shopResult.rows.filter((item) => item.owned);
  return {
    player: {
      id: p.starter_id,
      name: p.starter_name,
      avatar: p.avatar_url,
      description: p.description,
      specialMove: p.special_move,
      favoriteElement: p.favorite_element,
      affinity: p.affinity,
      baseStats: {
        hp: p.hp,
        attack: p.attack,
        defense: p.defense,
        evasion: p.evasion,
      },
      currOutfit: inventory
        .filter((item) => item.equipped)
        .map((item) => item.code),
    },
    energy: { amount: p.energy },
    inventory,
    shop: shopResult.rows,
    progress: {
      campaignsCompleted: Number(p.campaigns_completed),
      bossesDefeated: Number(p.bosses_defeated),
    },
  };
}

export async function requireProfile(client, userId) {
  const result = await client.query(
    "SELECT user_id FROM player_profiles WHERE user_id = $1 FOR UPDATE",
    [userId],
  );
  if (result.rowCount === 0)
    throw new HttpError(409, "Select a starter planet first.");
}
