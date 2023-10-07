import { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'

// Load PostgreSQL configuration from environment variables
const postgresConfig = {
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASS!,
  host: process.env.POSTGRES_HOST!,
  database: process.env.POSTGRES_DB!,
  port: 5432,
  ssl: { rejectUnauthorized: false },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { track } = req.query

    if (!track) {
      return res.status(400).json({ error: 'Track is required.' })
    }

    const pool = new Pool(postgresConfig)

    try {
      const client = await pool.connect()

      // Query to retrieve ideas for the specific track
      const ideasByTrackQuery = `
        SELECT *
        FROM ideas
        WHERE $1 = ANY (string_to_array(tracks, ','))
        ORDER BY elo DESC
      `

      const result = await client.query(ideasByTrackQuery, [track])
      const ideas = result.rows

      client.release()

      res.status(200).json({ leaderboard: ideas })
    } catch (error) {
      res
        .status(500)
        .json({ error: 'An error occurred while fetching the leaderboard.' })
    } finally {
      pool.end()
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' })
  }
}
