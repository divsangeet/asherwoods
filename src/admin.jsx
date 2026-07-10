// Asherwoods Cafe & Cottages - Admin Dashboard Component (Babel Compilable)

const AdminDashboard = ({ onClose, onViewChange }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [pinInput, setPinInput] = React.useState("");
  const [pinError, setPinError] = React.useState("");
  
  // Dashboard Management States
  const [activeTab, setActiveTab] = React.useState("analytics");
  const [bookings, setBookings] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [coupons, setCoupons] = React.useState([]);
  const [blogs, setBlogs] = React.useState([]);
  
  // Modifying states
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  
  // New Coupon state
  const [newCouponCode, setNewCouponCode] = React.useState("");
  const [newCouponType, setNewCouponType] = React.useState("percentage");
  const [newCouponVal, setNewCouponVal] = React.useState(10);
  const [newCouponNights, setNewCouponNights] = React.useState(1);

  // New Blog state
  const [newBlogTitle, setNewBlogTitle] = React.useState("");
  const [newBlogExcerpt, setNewBlogExcerpt] = React.useState("");
  const [newBlogAuthor, setNewBlogAuthor] = React.useState("Admin Manager");

  React.useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    setBookings(window.dbService.getBookings());
    setRooms(window.dbService.getRooms());
    setReviews(window.dbService.getReviews());
    setCoupons(window.dbService.getCoupons());
    setBlogs(window.dbService.getBlogs());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === "admin123" || pinInput === "1234") {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Invalid Admin PIN");
    }
  };

  // Actions
  const handleUpdateBookingStatus = (id, newStatus) => {
    window.dbService.updateBookingStatus(id, newStatus);
    loadData();
  };

  const handleUpdateRoomPrice = (id, newPrice) => {
    if (isNaN(newPrice) || newPrice <= 0) return;
    window.dbService.updateRoomPrice(id, newPrice);
    loadData();
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode) return;
    
    const activeCoupons = window.dbService.getCoupons();
    const isDup = activeCoupons.find(c => c.code.toUpperCase() === newCouponCode.toUpperCase());
    if (isDup) {
      alert("Coupon already exists!");
      return;
    }

    const couponObj = {
      code: newCouponCode.toUpperCase(),
      discountType: newCouponType,
      value: Number(newCouponVal),
      minNights: Number(newCouponNights),
      desc: newCouponType === "percentage" ? `Get ${newCouponVal}% off your stay.` : `Flat ₹${newCouponVal} off on stay.`
    };

    const updated = [couponObj, ...activeCoupons];
    window.dbService.saveCoupons(updated);
    
    // Clear form
    setNewCouponCode("");
    setNewCouponVal(10);
    setNewCouponNights(1);
    loadData();
  };

  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogExcerpt) return;

    const activeBlogs = window.dbService.getBlogs();
    const blogObj = {
      id: "b_" + Date.now(),
      title: newBlogTitle,
      excerpt: newBlogExcerpt,
      date: new Date().toISOString().split("T")[0],
      author: newBlogAuthor,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      content: "Detailed post body placeholder."
    };

    const updated = [blogObj, ...activeBlogs];
    window.dbService.saveBlogs(updated);

    // Clear form
    setNewBlogTitle("");
    setNewBlogExcerpt("");
    loadData();
  };

  const handleReviewStatus = (id, approve) => {
    let activeReviews = window.dbService.getReviews();
    if (approve) {
      const idx = activeReviews.findIndex(r => r.id === id);
      if (idx !== -1) {
        // Mock approving review: add a source tag or change status
        activeReviews[idx].source = "Verified Asherwoods Review";
      }
    } else {
      activeReviews = activeReviews.filter(r => r.id !== id);
    }
    window.dbService.saveReviews(activeReviews);
    loadData();
  };

  // Calculations for dashboard
  const analyticsData = React.useMemo(() => {
    if (!bookings.length) return { revenue: 0, count: 0, pending: 0, confirmed: 0 };
    const revenue = bookings
      .filter(b => b.status === "Confirmed" || b.status === "Checked In" || b.status === "Checked Out")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const pending = bookings.filter(b => b.status === "Pending").length;
    const confirmed = bookings.filter(b => b.status === "Confirmed").length;
    
    return { revenue, count: bookings.length, pending, confirmed };
  }, [bookings]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col justify-center items-center px-4 py-12">
        <button 
          onClick={() => onViewChange("home")}
          className="absolute top-8 left-8 text-luxury-gold flex items-center space-x-2 hover:underline"
        >
          <span className="inline-flex items-center justify-center">
            <i data-lucide="arrow-left" className="h-4 w-4"></i>
          </span>
          <span className="text-sm font-semibold tracking-wider uppercase">Back to Website</span>
        </button>

        <div className="bg-forest-900 border border-forest-800/35 p-8 max-w-sm w-full rounded-sm shadow-2xl text-center">
          <span className="font-serif text-2xl tracking-widest text-luxury-gold font-bold">ASHERWOODS</span>
          <h2 className="font-serif text-lg text-white font-bold mt-2">Staff Portal Login</h2>
          <p className="text-xs text-luxury-beige/60 mt-1">Enter your reservation manager passcode</p>
          
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <input
              type="password"
              placeholder="PIN passcode (e.g. 1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="bg-forest-950 border border-forest-800/40 text-center text-white font-bold p-3.5 tracking-widest w-full focus:outline-none focus:border-luxury-gold rounded-sm"
            />
            {pinError && <p className="text-red-500 text-xs font-semibold">{pinError}</p>}
            <button
              type="submit"
              className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-wider text-xs py-3.5 mt-2 rounded shadow-md transition duration-300"
            >
              Access CMS Panel
            </button>
          </form>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-6">Dev Passcode: 1234 or admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col md:flex-row dark:bg-forest-950 dark:text-white transition-colors duration-300">
      
      {/* Sidebar navigation */}
      <div className="md:w-64 bg-forest-900 dark:bg-forest-950 text-white flex flex-col border-r border-forest-800/20 shadow-lg">
        <div className="p-6 border-b border-forest-800/20 text-center flex-shrink-0">
          <span className="font-serif text-xl tracking-widest text-luxury-gold font-bold">ASHERWOODS</span>
          <p className="text-[9px] uppercase tracking-wider text-luxury-beige/60 mt-1">Management Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2.5">
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`w-full text-left p-3 text-xs uppercase font-bold tracking-wider rounded-sm flex items-center space-x-3 transition ${
              activeTab === "analytics" ? "bg-luxury-gold text-forest-950" : "text-white/80 hover:bg-white/5"
            }`}
          >
            <span>📊 Overview & Revenue</span>
          </button>
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`w-full text-left p-3 text-xs uppercase font-bold tracking-wider rounded-sm flex items-center space-x-3 transition ${
              activeTab === "bookings" ? "bg-luxury-gold text-forest-950" : "text-white/80 hover:bg-white/5"
            }`}
          >
            <span>🛎️ Room Reservations</span>
          </button>
          <button 
            onClick={() => setActiveTab("rooms")}
            className={`w-full text-left p-3 text-xs uppercase font-bold tracking-wider rounded-sm flex items-center space-x-3 transition ${
              activeTab === "rooms" ? "bg-luxury-gold text-forest-950" : "text-white/80 hover:bg-white/5"
            }`}
          >
            <span>🏠 Cottage Rates</span>
          </button>
          <button 
            onClick={() => setActiveTab("coupons")}
            className={`w-full text-left p-3 text-xs uppercase font-bold tracking-wider rounded-sm flex items-center space-x-3 transition ${
              activeTab === "coupons" ? "bg-luxury-gold text-forest-950" : "text-white/80 hover:bg-white/5"
            }`}
          >
            <span>🎟️ Promos & Coupons</span>
          </button>
          <button 
            onClick={() => setActiveTab("reviews")}
            className={`w-full text-left p-3 text-xs uppercase font-bold tracking-wider rounded-sm flex items-center space-x-3 transition ${
              activeTab === "reviews" ? "bg-luxury-gold text-forest-950" : "text-white/80 hover:bg-white/5"
            }`}
          >
            <span>⭐ Guest Reviews</span>
          </button>
          <button 
            onClick={() => setActiveTab("blogs")}
            className={`w-full text-left p-3 text-xs uppercase font-bold tracking-wider rounded-sm flex items-center space-x-3 transition ${
              activeTab === "blogs" ? "bg-luxury-gold text-forest-950" : "text-white/80 hover:bg-white/5"
            }`}
          >
            <span>✍️ Trails Blog</span>
          </button>
        </nav>

        <div className="p-4 border-t border-forest-800/20">
          <button 
            onClick={() => onViewChange("home")}
            className="w-full border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-forest-950 text-xs font-bold py-2.5 uppercase tracking-wider rounded-sm text-center transition duration-300 block"
          >
            Live Site Preview
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[500px]">
        {/* Top Header */}
        <header className="bg-white dark:bg-forest-900 border-b border-forest-800/10 dark:border-white/5 px-8 py-5 flex justify-between items-center flex-shrink-0">
          <h2 className="font-serif text-xl font-bold dark:text-white capitalize">
            {activeTab} Management Panel
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-green-150 text-green-700 px-3 py-1 font-bold rounded-full flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>Resort Server Connected</span>
            </span>
          </div>
        </header>

        {/* Dynamic Panels */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* 1. Analytics & Overview Panel */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-fade-in">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-forest-900/40 p-6 border border-slate-200 dark:border-white/5 rounded-sm shadow-sm">
                  <p className="text-[10px] text-slate-400 dark:text-luxury-beige/50 uppercase tracking-widest">Total Income (Gross)</p>
                  <p className="font-serif text-2xl text-forest-900 dark:text-luxury-gold font-bold mt-2">
                    ₹{analyticsData.revenue.toLocaleString("en-IN")}
                  </p>
                  <span className="text-[9px] text-green-600 font-semibold mt-1 block">▲ +12.4% vs last week</span>
                </div>
                <div className="bg-white dark:bg-forest-900/40 p-6 border border-slate-200 dark:border-white/5 rounded-sm shadow-sm">
                  <p className="text-[10px] text-slate-400 dark:text-luxury-beige/50 uppercase tracking-widest">Active Bookings</p>
                  <p className="font-serif text-2xl text-forest-900 dark:text-white font-bold mt-2">{analyticsData.count}</p>
                  <span className="text-[9px] text-slate-400 dark:text-luxury-beige/40 mt-1 block">In local database service</span>
                </div>
                <div className="bg-white dark:bg-forest-900/40 p-6 border border-slate-200 dark:border-white/5 rounded-sm shadow-sm">
                  <p className="text-[10px] text-slate-400 dark:text-luxury-beige/50 uppercase tracking-widest">Resort Occupancy</p>
                  <p className="font-serif text-2xl text-forest-900 dark:text-white font-bold mt-2">78%</p>
                  <span className="text-[9px] text-green-600 font-semibold mt-1 block">Optimal threshold achieved</span>
                </div>
                <div className="bg-white dark:bg-forest-900/40 p-6 border border-slate-200 dark:border-white/5 rounded-sm shadow-sm">
                  <p className="text-[10px] text-slate-400 dark:text-luxury-beige/50 uppercase tracking-widest">Verified Guest Rating</p>
                  <p className="font-serif text-2xl text-forest-900 dark:text-luxury-gold font-bold mt-2">4.9 / 5.0</p>
                  <span className="text-[9px] text-slate-400 dark:text-luxury-beige/40 mt-1 block">Based on Google & Direct reviews</span>
                </div>
              </div>

              {/* Graphic Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SVG Revenue Graph */}
                <div className="lg:col-span-8 bg-white dark:bg-forest-900/30 p-6 border border-slate-200 dark:border-white/5 rounded shadow-sm">
                  <h3 className="font-serif text-md font-bold mb-6 text-forest-900 dark:text-luxury-gold">Resort Weekly Revenue Stream</h3>
                  <div className="h-64 flex items-end justify-between px-2 pt-4 relative">
                    {/* Fake Y Axis lines */}
                    <div className="absolute left-0 right-0 top-1/4 border-t border-slate-100 dark:border-white/5 pointer-events-none"></div>
                    <div className="absolute left-0 right-0 top-2/4 border-t border-slate-100 dark:border-white/5 pointer-events-none"></div>
                    <div className="absolute left-0 right-0 top-3/4 border-t border-slate-100 dark:border-white/5 pointer-events-none"></div>
                    
                    {/* Bars */}
                    {[
                      { label: "Mon", val: 3200 },
                      { label: "Tue", val: 5600 },
                      { label: "Wed", val: 4500 },
                      { label: "Thu", val: 7500 },
                      { label: "Fri", val: 9900 },
                      { label: "Sat", val: 12500 },
                      { label: "Sun", val: 15310 }
                    ].map((bar, i) => {
                      const maxVal = 16000;
                      const heightPercent = `${(bar.val / maxVal) * 100}%`;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                          <span className="opacity-0 group-hover:opacity-100 bg-forest-950 text-white dark:bg-luxury-gold dark:text-forest-950 text-[10px] font-bold px-2 py-1 absolute -top-8 rounded shadow transition-all duration-300">
                            ₹{bar.val}
                          </span>
                          <div 
                            style={{ height: heightPercent }}
                            className="bg-forest-900/80 dark:bg-luxury-gold/70 group-hover:bg-luxury-gold w-8 sm:w-10 rounded-t-sm transition-all duration-500 shadow-md"
                          ></div>
                          <span className="text-[10px] text-slate-500 mt-2 font-semibold uppercase">{bar.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SVG/HTML Occupancy Share */}
                <div className="lg:col-span-4 bg-white dark:bg-forest-900/30 p-6 border border-slate-200 dark:border-white/5 rounded shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-md font-bold mb-4 text-forest-900 dark:text-luxury-gold">Cottage Occupancy Rate</h3>
                    <p className="text-xs text-slate-400 mb-6">Distribution breakdown by active cabins</p>
                  </div>
                  
                  <div className="space-y-4 font-sans text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Mountain View Cottage</span>
                        <span>85%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-luxury-gold w-[85%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Luxury Wooden Cottage</span>
                        <span>90%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-forest-900 dark:bg-luxury-gold w-[90%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Deluxe Riverside Cottage</span>
                        <span>95%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[95%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Family Cottage</span>
                        <span>42%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-600 w-[42%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Bookings Reservations Panel */}
          {activeTab === "bookings" && (
            <div className="bg-white dark:bg-forest-900/30 border border-slate-200 dark:border-white/5 rounded shadow-sm overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-forest-950 text-slate-500 uppercase tracking-widest font-bold border-b border-slate-200 dark:border-white/5">
                      <th className="p-4">Reference</th>
                      <th className="p-4">Guest</th>
                      <th className="p-4">Stay Dates</th>
                      <th className="p-4">Cottage</th>
                      <th className="p-4">Paid Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                        <td className="p-4 font-bold">{b.id}</td>
                        <td className="p-4">
                          <p className="font-semibold">{b.guestName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-white/40">{b.guestEmail}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">{b.checkIn} to {b.checkOut}</p>
                          <p className="text-[10px] text-slate-500">{b.totalNights} nights</p>
                        </td>
                        <td className="p-4 font-semibold">{b.roomName}</td>
                        <td className="p-4 font-bold">₹{Number(b.totalPrice).toFixed(0)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            b.status === "Confirmed" ? "bg-green-100 text-green-700" :
                            b.status === "Checked In" ? "bg-blue-100 text-blue-700" :
                            b.status === "Checked Out" ? "bg-slate-200 text-slate-700" : "bg-red-100 text-red-700"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 flex space-x-1.5">
                          {b.status === "Pending" && (
                            <button 
                              onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")}
                              className="bg-green-600 hover:bg-green-700 text-white text-[9px] px-2 py-1 rounded font-bold transition"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === "Confirmed" && (
                            <button 
                              onClick={() => handleUpdateBookingStatus(b.id, "Checked In")}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] px-2 py-1 rounded font-bold transition"
                            >
                              Check In
                            </button>
                          )}
                          {b.status === "Checked In" && (
                            <button 
                              onClick={() => handleUpdateBookingStatus(b.id, "Checked Out")}
                              className="bg-slate-800 hover:bg-slate-700 text-white text-[9px] px-2 py-1 rounded font-bold transition"
                            >
                              Check Out
                            </button>
                          )}
                          {b.status !== "Checked Out" && b.status !== "Cancelled" && (
                            <button 
                              onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")}
                              className="border border-red-500 hover:bg-red-500 hover:text-white text-red-500 text-[9px] px-2 py-1 rounded font-bold transition"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Manage Room Pricing Panel */}
          {activeTab === "rooms" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {rooms.map((room) => {
                return (
                  <div key={room.id} className="bg-white dark:bg-forest-900/30 p-6 border border-slate-200 dark:border-white/5 rounded shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-3">
                        <h4 className="font-serif text-lg font-bold text-forest-900 dark:text-luxury-gold">{room.name}</h4>
                        <span className="text-[10px] bg-forest-900/10 dark:bg-white/10 text-slate-500 dark:text-luxury-beige px-2 py-0.5 rounded font-bold">{room.occupancy}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-luxury-beige/60 mt-3">{room.description}</p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 flex justify-between items-end">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-400 block mb-1 font-bold">Edit Price / Night</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">₹</span>
                          <input 
                            type="number"
                            defaultValue={room.price}
                            onBlur={(e) => handleUpdateRoomPrice(room.id, e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdateRoomPrice(room.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm p-1.5 focus:outline-none focus:border-luxury-gold w-24 rounded font-bold dark:bg-forest-950 dark:border-white/10 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] uppercase text-slate-400">Current Base Price</p>
                        <p className="text-lg font-bold text-forest-900 dark:text-luxury-gold">₹{room.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. Promos & Coupons Panel */}
          {activeTab === "coupons" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              {/* Creator Form */}
              <div className="lg:col-span-5 bg-white dark:bg-forest-900/30 p-6 border border-slate-200 dark:border-white/5 rounded shadow-sm h-fit">
                <h3 className="font-serif text-md font-bold mb-6 text-forest-900 dark:text-luxury-gold">Create Promo Code</h3>
                <form onSubmit={handleAddCoupon} className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 block mb-1 font-bold">Coupon Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. MONSOON25"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded dark:bg-forest-950 dark:border-white/10 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 block mb-1 font-bold">Discount Type</label>
                      <select 
                        value={newCouponType}
                        onChange={(e) => setNewCouponType(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-900 text-sm p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded dark:bg-forest-950 dark:border-white/10 dark:text-white"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat Cash (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 block mb-1 font-bold">Discount Value</label>
                      <input 
                        type="number"
                        value={newCouponVal}
                        onChange={(e) => setNewCouponVal(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-900 text-sm p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded dark:bg-forest-950 dark:border-white/10 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-slate-400 block mb-1 font-bold">Min Nights Stay Required</label>
                    <input 
                      type="number"
                      value={newCouponNights}
                      onChange={(e) => setNewCouponNights(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded dark:bg-forest-950 dark:border-white/10 dark:text-white"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-wider py-3 rounded shadow transition"
                  >
                    Add Coupon
                  </button>
                </form>
              </div>

              {/* Coupons List */}
              <div className="lg:col-span-7 bg-white dark:bg-forest-900/30 p-6 border border-slate-200 dark:border-white/5 rounded shadow-sm">
                <h3 className="font-serif text-md font-bold mb-6 text-forest-900 dark:text-luxury-gold">Active Promo Codes</h3>
                <div className="space-y-4">
                  {coupons.map((c, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-forest-950 p-4 border border-slate-200 dark:border-white/10 rounded flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 text-xs font-bold px-2 py-0.5 rounded tracking-wider">{c.code}</span>
                          <span className="text-[10px] text-slate-500">Min {c.minNights} nights stay</span>
                        </div>
                        <p className="text-xs text-slate-650 dark:text-luxury-beige/80 mt-2 font-medium">{c.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Rate Reduction</p>
                        <p className="text-sm font-bold text-forest-900 dark:text-luxury-gold">
                          {c.discountType === "percentage" ? `${c.value}% Off` : `₹${c.value} Off`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Guest Reviews Approval Panel */}
          {activeTab === "reviews" && (
            <div className="bg-white dark:bg-forest-900/30 p-6 border border-slate-200 dark:border-white/5 rounded shadow-sm animate-fade-in space-y-6">
              <h3 className="font-serif text-md font-bold text-forest-900 dark:text-luxury-gold">Approve Guest Testimonials</h3>
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 dark:bg-forest-950 p-5 border border-slate-200 dark:border-white/10 rounded flex justify-between items-start">
                    <div className="flex space-x-3.5">
                      <img src={rev.avatar} className="h-10 w-10 rounded-full object-cover shadow" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-sans font-bold text-xs text-slate-800 dark:text-white">{rev.guestName}</span>
                          <span className="text-[9px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex text-luxury-gold py-1">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <span key={idx}>★</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-650 dark:text-luxury-beige/80 mt-1">{rev.text}</p>
                        <span className="text-[10px] text-slate-400 mt-2 block font-semibold">Source: {rev.source}</span>
                      </div>
                    </div>

                    <div className="flex space-x-1.5 flex-shrink-0">
                      {rev.source === "Guest Website Review" && (
                        <button 
                          onClick={() => handleReviewStatus(rev.id, true)}
                          className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-3 py-1.5 rounded font-bold transition"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => handleReviewStatus(rev.id, false)}
                        className="border border-red-500 hover:bg-red-500 hover:text-white text-red-500 text-[10px] px-3 py-1.5 rounded font-bold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Trails Blog Panel */}
          {activeTab === "blogs" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              {/* Add Blog Post */}
              <div className="lg:col-span-5 bg-white dark:bg-forest-900/30 p-6 border border-slate-200 dark:border-white/5 rounded shadow-sm h-fit">
                <h3 className="font-serif text-md font-bold mb-6 text-forest-900 dark:text-luxury-gold">Publish Blog Article</h3>
                <form onSubmit={handleAddBlog} className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 block mb-1 font-bold">Article Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Guide to Kheerganga Springs"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded dark:bg-forest-950 dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 block mb-1 font-bold">Article Excerpt</label>
                    <textarea 
                      rows="4"
                      placeholder="Short teaser synopsis to display on feeds..."
                      value={newBlogExcerpt}
                      onChange={(e) => setNewBlogExcerpt(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded dark:bg-forest-950 dark:border-white/10 dark:text-white resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 block mb-1 font-bold">Author Persona</label>
                    <input 
                      type="text" 
                      value={newBlogAuthor}
                      onChange={(e) => setNewBlogAuthor(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm p-2.5 focus:outline-none focus:border-luxury-gold w-full rounded dark:bg-forest-950 dark:border-white/10 dark:text-white"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-wider py-3 rounded shadow transition"
                  >
                    Publish Article
                  </button>
                </form>
              </div>

              {/* Blogs List */}
              <div className="lg:col-span-7 bg-white dark:bg-forest-900/30 p-6 border border-slate-200 dark:border-white/5 rounded shadow-sm">
                <h3 className="font-serif text-md font-bold mb-6 text-forest-900 dark:text-luxury-gold">Active Articles</h3>
                <div className="space-y-4">
                  {blogs.map((b, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-forest-950 p-4 border border-slate-200 dark:border-white/10 rounded flex space-x-4 items-center">
                      <img src={b.image} className="h-16 w-20 object-cover rounded shadow flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-sans font-bold text-xs text-slate-800 dark:text-white leading-snug">{b.title}</span>
                          <span className="text-[9px] text-slate-400 flex-shrink-0">{b.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-550 dark:text-luxury-beige/60 mt-1 line-clamp-2">{b.excerpt}</p>
                        <p className="text-[9px] text-slate-400 mt-2 font-semibold">Author: {b.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

// Bind to window
window.AdminDashboard = AdminDashboard;
