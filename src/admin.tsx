// Asherwoods Cafe & Cottages - Staff CMS Portal
import React from 'react';
import { 
  Building, Calendar, DollarSign, Award, FileText, Check, 
  X, CheckCircle, RefreshCw, Plus, Edit2, TrendingUp, Users 
} from 'lucide-react';
import { Room, CafeItem, Review, Coupon, Booking, BlogPost } from './types';
import { dbService } from './db';

interface AdminDashboardProps {
  onViewChange: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewChange }) => {
  const [passcode, setPasscode] = React.useState("");
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("bookings");

  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);

  // Form states
  const [editingRoomId, setEditingRoomId] = React.useState<string | null>(null);
  const [newRoomPrice, setNewRoomPrice] = React.useState<number>(0);

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = React.useState("");
  const [newCouponType, setNewCouponType] = React.useState<"percentage" | "flat">("percentage");
  const [newCouponVal, setNewCouponVal] = React.useState<number>(0);
  const [newCouponMin, setNewCouponMin] = React.useState<number>(1);
  const [newCouponDesc, setNewCouponDesc] = React.useState("");

  // New Blog Form
  const [newBlogTitle, setNewBlogTitle] = React.useState("");
  const [newBlogExcerpt, setNewBlogExcerpt] = React.useState("");
  const [newBlogContent, setNewBlogContent] = React.useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    setRooms(dbService.getRooms());
    setBookings(dbService.getBookings());
    setReviews(dbService.getReviews());
    setCoupons(dbService.getCoupons());
    setBlogs(dbService.getBlogs());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "1234" || passcode.toLowerCase() === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid passcode pin. Hint: Use 1234");
    }
  };

  // Metrics calculations
  const metrics = React.useMemo(() => {
    const totalRevenue = bookings
      .filter(b => b.status !== "Cancelled")
      .reduce((sum, b) => sum + Number(b.totalPrice), 0);
    const confirmedCount = bookings.filter(b => b.status === "Confirmed" || b.status === "Checked In").length;
    const occupancyRate = rooms.length > 0 ? Math.round((confirmedCount / rooms.length) * 100) : 0;
    
    return {
      totalRevenue,
      bookingsCount: bookings.length,
      occupancyRate,
      activeCoupons: coupons.length
    };
  }, [bookings, rooms, coupons]);

  const handleStatusUpdate = (id: string, status: Booking["status"]) => {
    dbService.updateBookingStatus(id, status);
    loadAllData();
  };

  const startPriceEdit = (room: Room) => {
    setEditingRoomId(room.id);
    setNewRoomPrice(room.price);
  };

  const savePriceEdit = (id: string) => {
    if (newRoomPrice <= 0) {
      alert("Please enter a valid price");
      return;
    }
    dbService.updateRoomPrice(id, newRoomPrice);
    setEditingRoomId(null);
    loadAllData();
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newCop: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      discountType: newCouponType,
      value: Number(newCouponVal),
      minNights: Number(newCouponMin),
      desc: newCouponDesc
    };
    const updated = [...coupons, newCop];
    dbService.saveCoupons(updated);
    
    // Reset form
    setNewCouponCode("");
    setNewCouponVal(0);
    setNewCouponMin(1);
    setNewCouponDesc("");
    loadAllData();
  };

  const handlePublishBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) return;
    const newPost: BlogPost = {
      id: "blog_" + Date.now(),
      title: newBlogTitle,
      date: new Date().toISOString().split("T")[0],
      excerpt: newBlogExcerpt || newBlogContent.substring(0, 120) + "...",
      author: "Resort Manager",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      content: newBlogContent
    };
    const updated = [newPost, ...blogs];
    dbService.saveBlogs(updated);
    
    // Reset form
    setNewBlogTitle("");
    setNewBlogExcerpt("");
    setNewBlogContent("");
    loadAllData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col justify-center items-center px-4">
        <div className="bg-forest-900/40 p-8 border border-forest-800/30 backdrop-blur-md rounded-sm w-full max-w-sm shadow-2xl text-center">
          <span className="text-[10px] tracking-widest text-luxury-gold font-bold uppercase">Staff Secure Gate</span>
          <h2 className="font-serif text-2xl text-white font-bold mt-2 mb-6">Asherwoods CMS Portal</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[9px] uppercase tracking-wider text-luxury-gold block mb-2 font-bold text-left">Security Passcode PIN</label>
              <input 
                type="password"
                required
                placeholder="Enter staff security code"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="bg-black/20 border border-white/20 text-white text-sm p-3 focus:outline-none focus:border-luxury-gold rounded-sm w-full text-center"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-955 font-bold uppercase tracking-widest text-xs py-3 rounded-sm shadow-md transition duration-300"
            >
              Authorize Login
            </button>
          </form>

          <button 
            onClick={() => onViewChange("home")}
            className="text-xs text-white/50 hover:text-white mt-6 block mx-auto transition"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <p className="text-xs uppercase tracking-widest text-slate-400">Staff Dashboard Connected</p>
            </div>
            <h1 className="font-serif text-3xl font-bold mt-1">Asherwoods Cafe & Cottages Manager</h1>
          </div>

          <button
            onClick={() => onViewChange("home")}
            className="bg-slate-800 hover:bg-slate-700 text-luxury-gold border border-slate-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition mt-4 md:mt-0"
          >
            Live Site Preview
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-955 p-6 border border-slate-800 rounded">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-bold tracking-wider">Gross Revenue</span>
              <DollarSign size={20} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">₹{metrics.totalRevenue.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-green-500 font-semibold mt-1">↑ 14% vs last week</p>
          </div>

          <div className="bg-slate-955 p-6 border border-slate-800 rounded">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-bold tracking-wider">Occupancy Index</span>
              <Building size={20} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.occupancyRate}%</p>
            <p className="text-[10px] text-blue-500 font-semibold mt-1">Stays: {bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').length} cabins</p>
          </div>

          <div className="bg-slate-955 p-6 border border-slate-800 rounded">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-bold tracking-wider">Total Bookings</span>
              <Calendar size={20} className="text-yellow-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.bookingsCount}</p>
            <p className="text-[10px] text-yellow-500 font-semibold mt-1">Logs including historicals</p>
          </div>

          <div className="bg-slate-955 p-6 border border-slate-800 rounded">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs uppercase font-bold tracking-wider">Active Promos</span>
              <Award size={20} className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{metrics.activeCoupons} codes</p>
            <p className="text-[10px] text-purple-500 font-semibold mt-1">Dynamic markdown discounts</p>
          </div>
        </div>

        {/* Workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-3 bg-slate-955 border border-slate-800 rounded p-4 flex flex-col space-y-1 h-fit">
            <button 
              onClick={() => setActiveTab("bookings")}
              className={`p-3 text-xs font-bold uppercase tracking-wider text-left rounded transition ${
                activeTab === "bookings" ? "bg-slate-900 text-luxury-gold" : "text-slate-400 hover:text-white"
              }`}
            >
              Room Reservations
            </button>
            <button 
              onClick={() => setActiveTab("rates")}
              className={`p-3 text-xs font-bold uppercase tracking-wider text-left rounded transition ${
                activeTab === "rates" ? "bg-slate-900 text-luxury-gold" : "text-slate-400 hover:text-white"
              }`}
            >
              Cottage Rates Editor
            </button>
            <button 
              onClick={() => setActiveTab("coupons")}
              className={`p-3 text-xs font-bold uppercase tracking-wider text-left rounded transition ${
                activeTab === "coupons" ? "bg-slate-900 text-luxury-gold" : "text-slate-400 hover:text-white"
              }`}
            >
              Coupons Generator
            </button>
            <button 
              onClick={() => setActiveTab("blogs")}
              className={`p-3 text-xs font-bold uppercase tracking-wider text-left rounded transition ${
                activeTab === "blogs" ? "bg-slate-900 text-luxury-gold" : "text-slate-400 hover:text-white"
              }`}
            >
              Himalayan Blog Editor
            </button>
          </div>

          {/* Tab Contents */}
          <div className="lg:col-span-9 bg-slate-955 border border-slate-800 rounded p-6 lg:p-8">
            
            {/* BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h2 className="font-serif text-xl font-bold">Room Reservations logs</h2>
                  <button onClick={loadAllData} className="text-slate-400 hover:text-white transition flex items-center space-x-1.5 text-xs">
                    <RefreshCw size={12} />
                    <span>Sync database</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                        <th className="py-3 px-2">Order ID</th>
                        <th className="py-3 px-2">Cottage</th>
                        <th className="py-3 px-2">Guest</th>
                        <th className="py-3 px-2">Check In/Out</th>
                        <th className="py-3 px-2 text-right">Cost</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-900/40">
                          <td className="py-4 px-2 font-mono font-bold text-slate-400">{b.id}</td>
                          <td className="py-4 px-2 font-semibold">{b.roomName}</td>
                          <td className="py-4 px-2">
                            <p className="font-bold">{b.guestName}</p>
                            <p className="text-[10px] text-slate-505">{b.guestPhone}</p>
                          </td>
                          <td className="py-4 px-2">
                            <p className="font-medium">{b.checkIn}</p>
                            <p className="text-[10px] text-slate-505">to {b.checkOut}</p>
                          </td>
                          <td className="py-4 px-2 text-right font-bold text-luxury-gold">₹{b.totalPrice.toFixed(0)}</td>
                          <td className="py-4 px-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              b.status === "Confirmed" ? "bg-green-900/50 text-green-300" :
                              b.status === "Checked In" ? "bg-blue-900/50 text-blue-300" :
                              b.status === "Checked Out" ? "bg-slate-800 text-slate-400" :
                              "bg-red-900/50 text-red-300"
                            }`}>{b.status}</span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <div className="flex justify-end space-x-1.5">
                              {b.status === "Pending" && (
                                <button 
                                  onClick={() => handleStatusUpdate(b.id, "Confirmed")}
                                  className="bg-green-600 hover:bg-green-700 text-white p-1 rounded"
                                  title="Confirm booking"
                                >
                                  <Check size={12} />
                                </button>
                              )}
                              {b.status === "Confirmed" && (
                                <button 
                                  onClick={() => handleStatusUpdate(b.id, "Checked In")}
                                  className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                                  title="Check In Guest"
                                >
                                  <TrendingUp size={12} />
                                </button>
                              )}
                              {b.status === "Checked In" && (
                                <button 
                                  onClick={() => handleStatusUpdate(b.id, "Checked Out")}
                                  className="bg-slate-700 hover:bg-slate-600 text-white p-1 rounded"
                                  title="Check Out Guest"
                                >
                                  <CheckCircle size={12} />
                                </button>
                              )}
                              {b.status !== "Cancelled" && b.status !== "Checked Out" && (
                                <button 
                                  onClick={() => handleStatusUpdate(b.id, "Cancelled")}
                                  className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                                  title="Cancel Booking"
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* RATES TAB */}
            {activeTab === "rates" && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="font-serif text-xl font-bold">Cottage Rates Editor</h2>
                  <p className="text-xs text-slate-500 mt-1">Modify cottage night prices. Updates will reflect immediately on the cottages cards.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-slate-900 p-5 border border-slate-800 rounded flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm">{room.name}</h4>
                        <p className="text-xs text-slate-550 mt-1">Base Cost: ₹{room.basePrice}/night</p>
                        {editingRoomId === room.id ? (
                          <div className="flex items-center space-x-2 mt-3">
                            <input 
                              type="number"
                              value={newRoomPrice}
                              onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                              className="bg-slate-955 border border-slate-800 text-white text-xs p-2 w-24 rounded focus:outline-none focus:border-luxury-gold"
                            />
                            <button 
                              onClick={() => savePriceEdit(room.id)}
                              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                            >
                              <Check size={12} />
                            </button>
                            <button 
                              onClick={() => setEditingRoomId(null)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-400 p-2 rounded"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <p className="font-serif text-lg font-bold text-luxury-gold mt-2">₹{room.price}/night</p>
                        )}
                      </div>
                      
                      {editingRoomId !== room.id && (
                        <button 
                          onClick={() => startPriceEdit(room)}
                          className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded border border-slate-700"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === "coupons" && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="font-serif text-xl font-bold">Promo Codes Generator</h2>
                  <p className="text-xs text-slate-505 mt-1">Configure active coupons for the booking engine.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form */}
                  <form onSubmit={handleAddCoupon} className="bg-slate-900 p-5 border border-slate-800 rounded space-y-4">
                    <h3 className="font-bold text-sm">Create New Coupon</h3>
                    <div>
                      <label className="text-[10px] uppercase text-slate-505 block mb-1">Coupon Code</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. SUMMER15"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="bg-slate-955 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase text-slate-505 block mb-1">Type</label>
                        <select
                          value={newCouponType}
                          onChange={(e) => setNewCouponType(e.target.value as "percentage" | "flat")}
                          className="bg-slate-955 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="flat">Flat Value (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-505 block mb-1">Value</label>
                        <input 
                          type="number" 
                          required
                          value={newCouponVal}
                          onChange={(e) => setNewCouponVal(Number(e.target.value))}
                          className="bg-slate-955 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-505 block mb-1">Minimum Nights</label>
                      <input 
                        type="number" 
                        required
                        value={newCouponMin}
                        onChange={(e) => setNewCouponMin(Number(e.target.value))}
                        className="bg-slate-955 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-505 block mb-1">Display Description</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Save 15% on summer bookings"
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        className="bg-slate-955 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-955 font-bold uppercase tracking-wider text-xs py-3 rounded shadow transition duration-300"
                    >
                      Publish Promo Code
                    </button>
                  </form>

                  {/* Active List */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm">Active Promo Codes</h3>
                    {coupons.map((c) => (
                      <div key={c.code} className="bg-slate-900 p-4 border border-slate-800 rounded flex justify-between items-center">
                        <div>
                          <span className="font-mono font-bold text-luxury-gold text-sm bg-slate-955 px-2 py-1 rounded border border-luxury-gold/20">{c.code}</span>
                          <p className="text-xs text-slate-400 mt-2">{c.desc}</p>
                          <p className="text-[10px] text-slate-505 mt-1">Condition: Min {c.minNights} nights stay</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{c.discountType === 'percentage' ? `${c.value}% Off` : `₹${c.value} Off`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === "blogs" && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="font-serif text-xl font-bold">Himalayan Blog Publisher</h2>
                  <p className="text-xs text-slate-505 mt-1">Publish nature guides, local trekking trails or cafe news.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form */}
                  <form onSubmit={handlePublishBlog} className="bg-slate-900 p-5 border border-slate-800 rounded space-y-4">
                    <h3 className="font-bold text-sm">Write New Post</h3>
                    <div>
                      <label className="text-[10px] uppercase text-slate-505 block mb-1">Blog Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Sunrise Hikes in Tosh"
                        value={newBlogTitle}
                        onChange={(e) => setNewBlogTitle(e.target.value)}
                        className="bg-slate-955 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-505 block mb-1">Excerpt Summary</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Short 1-sentence synopsis"
                        value={newBlogExcerpt}
                        onChange={(e) => setNewBlogExcerpt(e.target.value)}
                        className="bg-slate-955 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-505 block mb-1">Full Article Content</label>
                      <textarea 
                        required
                        rows={6}
                        placeholder="Write article details here..."
                        value={newBlogContent}
                        onChange={(e) => setNewBlogContent(e.target.value)}
                        className="bg-slate-955 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-955 font-bold uppercase tracking-wider text-xs py-3 rounded shadow transition duration-300"
                    >
                      Publish Article
                    </button>
                  </form>

                  {/* Blogs List */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm">Published Articles</h3>
                    {blogs.map((post) => (
                      <div key={post.id} className="bg-slate-900 p-4 border border-slate-800 rounded flex space-x-4">
                        <img src={post.image} className="h-16 w-16 object-cover rounded" alt={post.title} />
                        <div>
                          <h4 className="font-bold text-xs">{post.title}</h4>
                          <p className="text-[10px] text-slate-505 mt-1">By {post.author} on {post.date}</p>
                          <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">{post.excerpt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
