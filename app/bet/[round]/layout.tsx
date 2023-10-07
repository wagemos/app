import { BASE_URL, rounds } from '@/utils'

interface Idea {
  id: number
  text: string
  elo: number
  tracks: string
}

async function getLeaderboard(track: string | undefined) {
  if (!track) throw new Error('Track not specified')

  const round = rounds.find((round) => round.id === parseInt(track))
  if (!round) throw new Error('Could not find round')

  const res = await fetch(BASE_URL + 'api/leaderboard?track=' + round.name)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function RoundLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { round: string }
}) {
  const { leaderboard } = await getLeaderboard(params.round)

  return (
    <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-8 max-h-[87vh]">
      <div className="rounded-lg border col-span-2 border-zinc-800 p-6 md:h-[87vh]">
        {children}
      </div>
      <div className="bg-zinc-800 rounded-lg p-6 md:h-[87vh]">
        <p className="font-calsans text-3xl lg:text-4xl text-left w-full">
          Community Opinion
        </p>
        <div className="flex flex-col space-y-2 mt-4 w-full">
          {leaderboard.map((item: Idea, key: number) => (
            <div
              key={key}
              className="rounded-md border border-zinc-900 py-3 grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
            >
              <p className="text-sm text-white/50 mt-0.5 text-center">
                #{key + 1}
              </p>
              <p className="font-semibold col-span-3 lg:col-span-5 xl:col-span-7">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
