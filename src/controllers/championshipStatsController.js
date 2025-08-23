const { ChampionshipStats } = require('../models');

// Ensure a single stats row exists and return it
const ensureStats = async () => {
  let stats = await ChampionshipStats.findOne();
  if (!stats) {
    stats = await ChampionshipStats.create({
      competitors: 0,
      countries: 0,
      events: 0,
      champions: 0,
    });
  }
  return stats;
};

// GET /api/championship-stats
const getStats = async (req, res) => {
  try {
    const stats = await ensureStats();
    res.json(stats);
  } catch (err) {
    console.error('getStats error:', err);
    res.status(500).json({ message: 'Failed to fetch championship stats' });
  }
};

// PUT /api/championship-stats
const updateStats = async (req, res) => {
  try {
    const stats = await ensureStats();
    const { competitors, countries, events, champions } = req.body;

    if (
      competitors === undefined &&
      countries === undefined &&
      events === undefined &&
      champions === undefined
    ) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const payload = {};
    if (competitors !== undefined) payload.competitors = Number(competitors) || 0;
    if (countries !== undefined) payload.countries = Number(countries) || 0;
    if (events !== undefined) payload.events = Number(events) || 0;
    if (champions !== undefined) payload.champions = Number(champions) || 0;

    await stats.update(payload);
    res.json(stats);
  } catch (err) {
    console.error('updateStats error:', err);
    res.status(500).json({ message: 'Failed to update championship stats' });
  }
};

module.exports = { getStats, updateStats };
