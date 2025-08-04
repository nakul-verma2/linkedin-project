"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Briefcase, Home, MessageCircle, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FeedPost = {
  uid?: string;
  author_uid?: string;
  authorId?: string;
  user_id?: string;
  author_name?: string;
  author?: string;
  name?: string;
  title?: string;
  author_title?: string;
  timestamp?: string;
  time?: string;
  content?: string;
  likes?: number;
  comments?: number;
  id?: string | number;
};

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/auth");
    }
  }, [router]);
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Network", path: "/TBD" },
    { icon: Briefcase, label: "Jobs", path: "/TBD" },
    { icon: MessageCircle, label: "Messages", path: "/TBD" },
    { icon: Bell, label: "Notifications", path: "/TBD" },
  ];
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);

const [user, setUser] = useState(() => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("user") || "null");
  }
  return null;
});


const [postContent, setPostContent] = useState("");
const [posting, setPosting] = useState(false);


async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (!postContent.trim()) return; // Don't allow empty post

  if (!user?.uid) {
    alert("You must be logged in to post!");
    return;
  }

  setPosting(true);
  try {
    const res = await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: user.uid, content: postContent.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setPostContent("");
      fetchFeed()
      window.location.reload(); // crude, or refetch posts more smoothly
    } else {
      alert(data.error || "Could not create post");
    }
  } catch {
    alert("Network error while posting");
  }
  setPosting(false);
}

const fetchFeed = async () => {
  const res = await fetch("http://localhost:5000/posts");
  const data = await res.json();
  const posts = (data.posts || []).map((post: FeedPost) => ({
  ...post,
  likes: Math.floor(Math.random() * 170 + 30),
  comments: Math.floor(Math.random() * 43 + 8),
}));

  setFeedPosts(posts);
};



  useEffect(() => {
  fetchFeed();
}, []);


  const trendingTopics = [
    "AI & Machine Learning",
    "Remote Work Culture",
    "Sustainable Tech",
    "Web3 Development",
    "Design Systems",
  ];

  const suggestedConnections = [
    { name: "Alex Thompson", title: "DevOps Engineer", mutualConnections: 12 },
    { name: "Lisa Park", title: "Data Scientist", mutualConnections: 8 },
    { name: "David Kim", title: "Product Manager", mutualConnections: 15 },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Floating Navigation */}
     <motion.header
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4"
>
  <nav className="glass-card rounded-2xl px-6 py-3 flex items-center justify-left">
    <div className="flex items-center space-x-8">
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
      >
        Linked In
      </motion.div>

      {/* Nav buttons */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <Link href={item.path} key={item.label}>
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </motion.div>
          </Link>
        ))}

        {/* Place logout and profile right after the nav items */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow"
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/auth");
          }}
        >
          Logout
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5"
        >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
          </div>
        </motion.div>
      </div>
    </div>
    {/* Optionally, leave search alone or move before nav if you wish */}
  </nav>
</motion.header>


      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="text-white glow-text">Linked in</span>
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10"></div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Connect with professionals, share your journey, and discover opportunities in the future of work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 glass-card rounded-full font-semibold text-lg"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-1"
          
        >
          <div className="glass-card p-6 rounded-2xl">
            <div className="text-center">
              <motion.div whileHover={{ scale: 1.05, rotateY: 5 }} className="relative mx-auto w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-full blur-lg"></div>
              </motion.div>
            
              <h3 className="text-xl font-bold mb-1">{user?.name || "—"}</h3>
<p className="text-gray-400 mb-2">{user?.email || "—"}</p>
<p className="text-sm text-gray-500 mb-4">{user?.bio || <span className="italic text-gray-600">No bio provided</span>}</p>


              <div className="space-y-3">
                <motion.button
  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
  whileTap={{ scale: 0.98 }}
  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-300"
  onClick={() => {
    if (user?.uid) {
      router.push(`/profile/${user.uid}`);
    } else {
      alert("You must be logged in!");
    }
  }}
>
  Your Profile
</motion.button>

                
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold">1,247</p>
                    <p className="text-gray-400">Connections</p>
                  </div>
                  <div>
                    <p className="font-semibold">89</p>
                    <p className="text-gray-400">Posts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

       {/* FEED */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
{/* Create Post */}
          <div className="glass-card p-4 rounded-2xl">
  <form onSubmit={handleCreatePost}>
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
      <textarea
        className="flex-1 text-left px-4 py-3 glass-input rounded-full text-white bg-transparent resize-none placeholder-gray-400"
        style={{ minHeight: 48 }}
        placeholder="Share your thoughts..."
        value={postContent}
        onChange={e => setPostContent(e.target.value)}
        disabled={posting}
        maxLength={500}
        rows={1}
      />
      <button
        type="submit"
        disabled={posting || !postContent.trim()}
        className="ml-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition"
      >
        {posting ? "Posting..." : "Post"}
      </button>
    </div>
    {/* Rest of your demo buttons */}
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
      <div className="flex space-x-4">
        {["Photo", "Video", "Event", "Article"].map((type) => (
          <motion.button
            key={type}
            type="button"
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            tabIndex={-1}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">{type}</span>
          </motion.button>
        ))}
      </div>
    </div>
  </form>
</div>


          {/* Feed Items */}
          {feedPosts.map((item, index) => {
            // FIX 2: Compute userId for this post robustly
            const userId =
              item.uid ||
              item.author_uid ||
              item.authorId ||
              item.user_id ||
              "";

            return (
              <motion.button
                type="button"
                key={item.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.01, rotateX: 2 }}
                onHoverStart={() => setHoveredCard(Number(item.id) || index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="w-full text-left glass-card p-6 rounded-2xl relative overflow-hidden focus:outline-none"
                onClick={() => {
                  if (userId) {
                    router.push(`/profile/${userId}`);
                  } else {
                    alert("This post does not have a valid user!");
                  }
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">
                        {item.author_name || item.author || item.name || "Unknown"}
                      </h4>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-400">
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleString([], {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : item.time || ""}
                  </span>

                    </div>
                    {(item.author_title || item.title) && (
                      <p className="text-sm text-gray-400 mb-3">{item.author_title || item.title}</p>
                    )}
                    <p className="text-gray-200 mb-4">{item.content}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                      >
                        <span>❤️</span>
                        <span>{item.likes}</span>
                      </motion.span>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{item.comments}</span>
                      </motion.span>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center space-x-2 hover:text-green-400 transition-colors"
                      >
                        <span>🔄</span>
                        <span>Share</span>
                      </motion.span>
                    </div>
                  </div>
                </div>
                {hoveredCard === (item.id || index) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>




        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Trending Topics */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Trending Topics</h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-300"
                >
                  <p className="text-sm font-medium">{topic}</p>
                  <p className="text-xs text-gray-400">{Math.floor(Math.random() * 1000) + 100}k posts</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suggested Connections */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">People You May Know</h3>
            <div className="space-y-4">
              {suggestedConnections.map((person, index) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-orange-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="text-xs text-gray-400">{person.title}</p>
                    <p className="text-xs text-gray-500">{person.mutualConnections} mutual connections</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                  >
                    Connect
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="mt-16 mb-8 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-wrap justify-center items-center space-x-6 text-sm text-gray-400">
              {["About", "Privacy Policy", "Terms", "Advertising", "Business Services", "Get the App", "More"].map(
                (link) => (
                  <motion.a
                    key={link}
                    href="#"
                    whileHover={{ scale: 1.05, color: "#60a5fa" }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {link}
                  </motion.a>
                ),
              )}
            </div>
            
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
