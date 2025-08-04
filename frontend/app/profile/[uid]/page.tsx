/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

// Safely parse, format time
function formatTime(ts: string) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ProfilePage() {
  const { uid } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    // Fetch user profile
    fetch(`http://localhost:5000/user/${uid}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));

    // Fetch user posts
    fetch(`http://localhost:5000/user/${uid}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .finally(() => setLoading(false));
  }, [uid]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Nav bar back to Home */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4"
      >
        <nav className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:underline px-4 text-lg"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Profile
          </h2>
          <span />
        </nav>
      </motion.header>

      <section className="pt-32 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card p-8 rounded-2xl mb-8 flex flex-col md:flex-row gap-8 items-center"
          >
            <div>
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mb-4" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                {user?.name || <span className="opacity-50">Loading...</span>}
              </h2>
              <p className="text-gray-400 mb-1">
                <span className="font-semibold">Email: </span>
                {user?.email || <span className="opacity-50">Loading...</span>}
              </p>
              <p className="text-gray-400 mb-1">
                <span className="font-semibold">Bio: </span>
                {user?.bio
                  ? user.bio
                  : user && <span className="italic text-gray-600">No bio provided</span>}
              </p>
            </div>
          </motion.div>

          {/* Posts */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Posts</h3>
            {loading ? (
              <div className="text-gray-400 mb-2">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-gray-400 mb-2">No posts yet.</div>
            ) : (
              posts.map((post, idx) => (
                <motion.div
                  key={post.id || idx}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + idx * 0.08 }}
                  whileHover={{ scale: 1.01, rotateX: 2 }}
                  onHoverStart={() => setHoveredPost(post.id || idx)}
                  onHoverEnd={() => setHoveredPost(null)}
                  className="glass-card p-6 rounded-2xl relative overflow-hidden mb-5"
                >
                  <div className="flex justify-between mb-2">
                    <div className="text-gray-400 text-sm">{formatTime(post.timestamp)}</div>
                  </div>
                  <div className="text-gray-200 mb-2">{post.content}</div>
                  {/* Demo random "likes/comments" for consistency */}
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <span>❤️</span>
                      <span>{Math.floor(Math.random() * 170 + 30)}</span>
                    </motion.span>
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 43 + 8)}</span>
                    </motion.span>
                  </div>
                  {hoveredPost === (post.id || idx) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"
                    />
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
