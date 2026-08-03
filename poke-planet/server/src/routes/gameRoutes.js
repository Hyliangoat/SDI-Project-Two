import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { pool, withTransaction } from '../db.js';
import { asyncRoute, HttpError } from '../errors.js';
import { getStarter } from '../starterCatalog.js';
import { readGameState, requireProfile } from '../gameStateRepository.js';
import { requireReward, requireString, requireUrl } from '../validation.js';

const router = Router();
router.use(requireAuth);

router.get('/state', asyncRoute(async (req, res) => {
  res.json(await readGameState(pool, req.user.id));
}));

router.post('/starter', asyncRoute(async (req, res) => {
  const starterId = requireString(req.body?.starterId, 'starterId');
  const avatarUrl = requireUrl(req.body?.avatarUrl, 'avatarUrl');
  const starter = getStarter(starterId);
  if (!starter) throw new HttpError(400, 'Unknown starter planet.');
  const state = await withTransaction(async (client) => {
    await client.query(`
      INSERT INTO player_profiles
        (user_id, starter_id, starter_name, avatar_url, description, special_move, favorite_element, hp, attack, defense, evasion, affinity, energy)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,500)
      ON CONFLICT (user_id) DO UPDATE SET
        starter_id=EXCLUDED.starter_id, starter_name=EXCLUDED.starter_name, avatar_url=EXCLUDED.avatar_url,
        description=EXCLUDED.description, special_move=EXCLUDED.special_move, favorite_element=EXCLUDED.favorite_element,
        hp=EXCLUDED.hp, attack=EXCLUDED.attack, defense=EXCLUDED.defense, evasion=EXCLUDED.evasion,
        affinity=0, energy=500, updated_at=NOW()`,
      [req.user.id, starter.id, starter.name, avatarUrl, starter.description, starter.specialMove, starter.favoriteElement,
       starter.baseStats.hp, starter.baseStats.attack, starter.baseStats.defense, starter.baseStats.evasion]);
    await client.query('DELETE FROM player_inventory WHERE user_id=$1', [req.user.id]);
    await client.query(`INSERT INTO campaign_progress (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET campaigns_completed=0, bosses_defeated=0, updated_at=NOW()`, [req.user.id]);
    return readGameState(client, req.user.id);
  });
  res.status(201).json(state);
}));

router.post('/purchase', asyncRoute(async (req, res) => {
  const itemCode = requireString(req.body?.itemCode, 'itemCode');
  const state = await withTransaction(async (client) => {
    await requireProfile(client, req.user.id);
    const itemResult = await client.query('SELECT * FROM shop_items WHERE code=$1 AND active=TRUE', [itemCode]);
    if (!itemResult.rows[0]) throw new HttpError(404, 'Shop item not found.');
    const item = itemResult.rows[0];
    const owned = await client.query('SELECT 1 FROM player_inventory WHERE user_id=$1 AND item_id=$2', [req.user.id, item.id]);
    if (owned.rowCount) throw new HttpError(409, 'Item already owned.');
    const update = await client.query(`UPDATE player_profiles SET energy=energy-$1, hp=hp+$2, attack=attack+$3, defense=defense+$4, evasion=evasion+$5, updated_at=NOW() WHERE user_id=$6 AND energy >= $1 RETURNING user_id`,
      [item.energy_cost, item.hp_bonus, item.attack_bonus, item.defense_bonus, item.evasion_bonus, req.user.id]);
    if (!update.rowCount) throw new HttpError(409, 'Not enough energy.');
    await client.query('INSERT INTO player_inventory (user_id,item_id) VALUES ($1,$2)', [req.user.id, item.id]);
    return readGameState(client, req.user.id);
  });
  res.json(state);
}));

router.post('/feed', asyncRoute(async (req, res) => {
  const state = await withTransaction(async (client) => {
    await requireProfile(client, req.user.id);
    const result = await client.query('UPDATE player_profiles SET energy=energy-5, affinity=affinity+5, updated_at=NOW() WHERE user_id=$1 AND energy>=5 RETURNING user_id', [req.user.id]);
    if (!result.rowCount) throw new HttpError(409, 'Not enough energy.');
    return readGameState(client, req.user.id);
  });
  res.json(state);
}));

router.post('/reward', asyncRoute(async (req, res) => {
  const { amount, campaignComplete } = requireReward(req.body);
  const state = await withTransaction(async (client) => {
    await requireProfile(client, req.user.id);
    await client.query('UPDATE player_profiles SET energy=energy+$1, updated_at=NOW() WHERE user_id=$2', [amount, req.user.id]);
    if (campaignComplete) await client.query(`INSERT INTO campaign_progress (user_id,campaigns_completed,bosses_defeated,last_reward_at) VALUES ($1,1,1,NOW()) ON CONFLICT (user_id) DO UPDATE SET campaigns_completed=campaign_progress.campaigns_completed+1, bosses_defeated=campaign_progress.bosses_defeated+1, last_reward_at=NOW(), updated_at=NOW()`, [req.user.id]);
    return readGameState(client, req.user.id);
  });
  res.json(state);
}));

export default router;