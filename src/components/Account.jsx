import { useEffect, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

import { Button } from '@/components/Button'

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="form-widget">
      <div className="p-6 text-sm transition bg-white rounded-md text-zinc-500 ring-1 ring-zinc-900/10 hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20">
        <div>
          <h2
            id="payment-details-heading"
            className="text-lg font-medium leading-6 text-zinc-900 dark:text-white"
          >
            Profile
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-white">
            Update your information.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="col-span-4 sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-500 dark:text-white"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              className="hidden h-8 w-full items-center gap-2 rounded-md bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&:not(:focus-visible)]:outline-none"
              value={session.user.email}
              disabled
            />
          </div>

          <div className="col-span-4 sm:col-span-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-500 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              className="hidden h-8 w-full items-center gap-2 rounded-md bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&:not(:focus-visible)]:outline-none"
            />
          </div>

          <div className="col-span-4 sm:col-span-2">
            <label
              htmlFor="website"
              className="block text-sm font-medium text-zinc-500 dark:text-white"
            >
              Website
            </label>
            <input
              type="website"
              id="website"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden h-8 w-full items-center gap-2 rounded-md bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&:not(:focus-visible)]:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end gap-3 py-3 text-right">
          <Button onClick={() => supabase.auth.signOut()} variant="secondary">
            Sign Out
          </Button>
          <Button
            onClick={() => updateProfile({ username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </Button>
        </div>
      </div>
    </section>
  )
}
