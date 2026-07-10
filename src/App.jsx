// Asherwoods Cafe & Cottages - Main React App (Babel Compilable)

// Fetching Components from window globals
const {
  Icon,
  Navbar,
  Hero,
  WhyChooseUs,
  Rooms,
  CafeMenu,
  Experiences,
  Gallery,
  Attractions,
  BookingModal,
  GuestPortal,
  ChatAssistant,
  Footer
} = window.AsherwoodsComponents;

const AdminDashboard = window.AdminDashboard;

// Live Weather Widget Component
const WeatherWidget = () => {
  const [weather, setWeather] = React.useState({ temp: 15, desc: "Chilly Breeze", icon: "cloud-sun" });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=32.0097&longitude=77.3150&current_weather=true");
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        const code = data.current_weather.weathercode;
        let desc = "Chilly Breeze";
        let icon = "cloud";

        if (code === 0) { desc = "Clear Sky"; icon = "sun"; }
        else if (code >= 1 && code <= 3) { desc = "Partly Cloudy"; icon = "cloud-sun"; }
        else if (code === 45 || code === 48) { desc = "Foggy Trails"; icon = "cloud-fog"; }
        else if (code >= 51 && code <= 67) { desc = "Light Drizzle"; icon = "cloud-drizzle"; }
        else if (code >= 71 && code <= 77) { desc = "Snow Fall"; icon = "snowflake"; }
        else if (code >= 80 && code <= 82) { desc = "Rain Showers"; icon = "cloud-rain"; }

        setWeather({
          temp: Math.round(data.current_weather.temperature),
          desc,
          icon
        });
      } catch (err) {
        // Fallback simulation based on current local hour
        const hour = new Date().getHours();
        let temp = 14;
        let desc = "Cool Breeze";
        let icon = "cloud-sun";

        if (hour >= 20 || hour < 6) {
          temp = 8;
          desc = "Chilling Night";
          icon = "moon-star";
        } else if (hour >= 12 && hour < 16) {
          temp = 21;
          desc = "Sunny Valley";
          icon = "sun";
        } else if (hour >= 6 && hour < 12) {
          temp = 15;
          desc = "Crisp Morning";
          icon = "cloud-sun";
        }

        setWeather({ temp, desc, icon });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Syncing Climate...</div>;

  return (
    <div className="bg-white/10 dark:bg-forest-900/40 border border-white/20 dark:border-white/5 backdrop-blur-md rounded-sm p-3 flex items-center space-x-3 text-white">
      <div className="text-luxury-gold">
        <Icon name={weather.icon} size={24} />
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Kasol Weather</p>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-serif text-lg font-bold">{weather.temp}°C</span>
          <span className="text-[10px] text-luxury-beige font-medium">{weather.desc}</span>
        </div>
      </div>
    </div>
  );
};

// Offers Popup Alert Modal
const OffersPopup = ({ onClose }) => {
  const [activeOffer, setActiveOffer] = React.useState(null);

  React.useEffect(() => {
    const list = window.dbService.getOffers();
    if (list && list.length > 0) {
      setActiveOffer(list[0]);
    }
  }, []);

  if (!activeOffer) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-forest-900 text-white border border-luxury-gold/30 rounded-sm max-w-md w-full p-8 shadow-2xl relative text-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition"
        >
          <Icon name="x" size={18} />
        </button>

        <div className="h-12 w-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold flex items-center justify-center mx-auto mb-4">
          <Icon name="tag" size={24} />
        </div>

        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Special Resort Offer</span>
        <h3 className="font-serif text-2xl font-bold mt-2 text-luxury-warmwhite">{activeOffer.title}</h3>
        <p className="text-xs text-luxury-beige/70 mt-3.5 leading-relaxed font-light">{activeOffer.desc}</p>
        
        <div className="bg-forest-950 p-4 border border-white/5 mt-6 rounded flex items-center justify-between">
          <div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest text-left">Coupon Code</p>
            <p className="text-md font-bold text-luxury-gold uppercase tracking-wider">{activeOffer.code}</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(activeOffer.code);
              alert(`Copied coupon code: ${activeOffer.code}`);
            }}
            className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition duration-300"
          >
            Copy Code
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Controller Component
const App = () => {
  const [view, setView] = React.useState("home");
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [activeGuest, setActiveGuest] = React.useState(null);
  const [wishlist, setWishlist] = React.useState([]);
  
  // Modals controller
  const [bookingRoom, setBookingRoom] = React.useState(null);
  const [isGuestPortalOpen, setIsGuestPortalOpen] = React.useState(false);
  const [showOfferPopup, setShowOfferPopup] = React.useState(false);

  // Search parameters for rooms filter
  const [searchParams, setSearchParams] = React.useState(null);

  React.useEffect(() => {
    // Theme sync
    const savedTheme = localStorage.getItem("ash_theme") || "dark";
    setIsDarkMode(savedTheme === "dark");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Guest Profile sync
    const savedGuest = localStorage.getItem("ash_active_guest");
    if (savedGuest) {
      setActiveGuest(JSON.parse(savedGuest));
    }

    // Wishlist sync
    const savedWish = localStorage.getItem("ash_wishlist");
    if (savedWish) {
      setWishlist(JSON.parse(savedWish));
    }

    // Delay Popup Offer alert by 4s (if not shown in session)
    const popupShown = sessionStorage.getItem("ash_popup_shown");
    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowOfferPopup(true);
        sessionStorage.setItem("ash_popup_shown", "true");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem("ash_theme", newVal ? "dark" : "light");
    if (newVal) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLoginGuest = (guestData) => {
    setActiveGuest(guestData);
    localStorage.setItem("ash_active_guest", JSON.stringify(guestData));
    setIsGuestPortalOpen(false);
  };

  const handleLogoutGuest = () => {
    setActiveGuest(null);
    localStorage.removeItem("ash_active_guest");
  };

  const toggleWishlist = (roomId) => {
    let updated = [...wishlist];
    if (updated.includes(roomId)) {
      updated = updated.filter(id => id !== roomId);
    } else {
      updated.push(roomId);
    }
    setWishlist(updated);
    localStorage.setItem("ash_wishlist", JSON.stringify(updated));
  };

  const handleSearchAvailability = (params) => {
    setSearchParams(params);
    setView("rooms");
    // Scroll to section
    setTimeout(() => {
      const el = document.getElementById("rooms-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBookingCompleted = (booking) => {
    setBookingRoom(null);
    alert(`Success! Cottage stay reserved under booking ID: ${booking.id}. Simulated receipts forwarded via Email & WhatsApp confirmation!`);
    
    // Automatically open Guest Portal to show check logs
    setTimeout(() => {
      setIsGuestPortalOpen(true);
    }, 500);
  };

  // Google Reviews / Testimonials Scroll
  const reviewsList = window.dbService.getReviews();

  return (
    <div className="flex flex-col min-h-screen bg-luxury-warmwhite dark:bg-forest-950 text-slate-800 dark:text-white transition-colors duration-500">
      
      {/* Sticky Blur Header */}
      {view !== "admin" && (
        <Navbar 
          onViewChange={setView} 
          currentView={view} 
          openGuestPortal={() => setIsGuestPortalOpen(true)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          activeGuest={activeGuest}
        />
      )}

      {/* Weather widget overlay (fixed top right just below nav) */}
      {view !== "admin" && (
        <div className="fixed top-20 right-6 z-40 hidden md:block">
          <WeatherWidget />
        </div>
      )}

      {/* Main Views Routing */}
      <main className="flex-1">
        {view === "home" && (
          <div className="animate-fade-in">
            {/* Hero & booking search widget */}
            <Hero onSearch={handleSearchAvailability} onViewChange={setView} />
            
            {/* why choose us grids */}
            <WhyChooseUs />

            {/* Room cards showcase */}
            <Rooms 
              onBookRoom={setBookingRoom} 
              wishlist={wishlist} 
              toggleWishlist={toggleWishlist}
              searchParams={searchParams}
            />

            {/* Himachali experiences */}
            <Experiences />

            {/* Gourmet Cafe Gallery preview */}
            <section className="py-24 bg-forest-950 text-white relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold">Resort Dining & Lounge</span>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold mt-2">
                    The Culinary Soul of Parvati Valley
                  </h2>
                  <p className="font-sans text-sm text-luxury-beige/70 mt-6 leading-relaxed font-light">
                    Our wooden mountain cafe blends international Israel platters with local Himachal recipes like hot wheat bun Siddu. Rest in the garden, listening to the rapids.
                  </p>
                  <button 
                    onClick={() => setView("cafe")}
                    className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-widest text-xs px-8 py-3.5 mt-8 rounded-sm shadow-md transition duration-300"
                  >
                    View Cafe Menu
                  </button>
                </div>
                <div className="md:w-1/2 grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80" className="h-44 w-full object-cover rounded-sm shadow-md hover:scale-105 transition" />
                  <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80" className="h-44 w-full object-cover rounded-sm shadow-md hover:scale-105 transition" />
                </div>
              </div>
            </section>

            {/* Pinterest masonry gallery */}
            <Gallery />

            {/* Attractions and interactive Guide */}
            <Attractions />

            {/* Animated Reviews Carousel */}
            <section className="py-24 bg-luxury-beige dark:bg-forest-900/30 transition-colors duration-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold font-semibold">Verified Guest Stays</span>
                <h2 className="font-serif text-3xl md:text-4xl text-forest-900 dark:text-white font-bold mt-2">What Our Guests Say</h2>
                <div className="h-0.5 w-16 bg-luxury-gold mx-auto mt-4 mb-16"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {reviewsList.slice(0, 3).map((r, i) => (
                    <div key={i} className="bg-white dark:bg-forest-900/40 p-8 border border-forest-800/10 dark:border-white/5 rounded-sm shadow-md flex flex-col justify-between text-left">
                      <div>
                        <div className="flex text-luxury-gold mb-4 text-sm">
                          {Array.from({ length: r.rating }).map((_, idx) => (
                            <span key={idx}>★</span>
                          ))}
                        </div>
                        <p className="font-sans text-xs text-slate-650 dark:text-luxury-beige/80 italic leading-relaxed">
                          "{r.text}"
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3.5 border-t border-forest-800/10 dark:border-white/5 pt-6 mt-6">
                        <img src={r.avatar} className="h-10 w-10 rounded-full object-cover shadow" />
                        <div>
                          <p className="font-sans font-bold text-xs text-slate-800 dark:text-white">{r.guestName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{r.source}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* About and Story */}
            <section className="py-24 bg-luxury-warmwhite dark:bg-forest-950 transition-colors duration-300">
              <div className="max-w-5xl mx-auto px-4 text-center">
                <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold">The Story of Asherwoods</span>
                <h3 className="font-serif text-3xl md:text-4xl text-forest-900 dark:text-white font-bold mt-2">Family Hospitality and Nature</h3>
                <p className="font-sans text-sm text-slate-600 dark:text-luxury-beige/70 mt-6 leading-relaxed max-w-3xl mx-auto font-light">
                  Built by a family of mountain lovers, Asherwoods was conceptualized as a serene buffer away from Kasol's tourist rushes. Nested beside pine clusters and the river's rushing rapids, we offer our visitors standard wooden warmth, home-style food care, and complete peace. Come discover your Himalayan home.
                </p>
              </div>
            </section>

            {/* Contact Panel */}
            <section className="py-24 bg-luxury-beige dark:bg-forest-900/30 transition-colors duration-300 border-t border-forest-800/10 dark:border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Form */}
                  <div className="bg-white dark:bg-forest-900/40 p-8 md:p-10 border border-forest-800/10 dark:border-white/5 rounded-sm shadow-xl">
                    <h3 className="font-serif text-2xl text-forest-900 dark:text-luxury-gold font-bold">Direct Reservations</h3>
                    <p className="text-xs text-slate-500 dark:text-luxury-beige/60 mt-2">Send us your queries and stay requirements</p>
                    
                    <form onSubmit={(e) => { e.preventDefault(); alert("Your contact inquiry has been sent!"); }} className="space-y-4 font-sans text-xs mt-8">
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Name" required className="bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white p-3 rounded" />
                        <input type="email" placeholder="Email" required className="bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white p-3 rounded" />
                      </div>
                      <input type="tel" placeholder="Phone" className="bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white p-3 w-full rounded" />
                      <textarea rows="4" placeholder="Your Message..." required className="bg-slate-50 dark:bg-forest-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white p-3 w-full rounded resize-none"></textarea>
                      <button type="submit" className="w-full bg-forest-900 hover:bg-forest-800 dark:bg-luxury-gold dark:hover:bg-yellow-600 text-white dark:text-forest-950 font-bold uppercase tracking-wider py-3.5 rounded shadow">
                        Send message
                      </button>
                    </form>
                  </div>

                  {/* Right Details & Map embed mockup */}
                  <div className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-serif text-2xl text-forest-900 dark:text-luxury-gold font-bold">Contact Asherwoods</h3>
                      <div className="space-y-3.5 text-sm text-slate-700 dark:text-luxury-beige/95 font-medium">
                        <div className="flex items-center space-x-3">
                          <Icon name="phone" size={16} className="text-luxury-gold" />
                          <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Icon name="mail" size={16} className="text-luxury-gold" />
                          <span>contact@asherwoodskasol.com</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Icon name="map-pin" size={16} className="text-luxury-gold" />
                          <span>Parvati Valley, near Chalal Path, Kasol, HP</span>
                        </div>
                      </div>
                    </div>

                    {/* Styled Map Image placeholder */}
                    <div className="h-64 rounded-sm overflow-hidden border border-forest-800/10 dark:border-white/5 shadow-md relative group">
                      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-forest-950/20 group-hover:bg-forest-950/40 transition flex items-center justify-center">
                        <a 
                          href="https://maps.google.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white text-slate-900 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-lg flex items-center space-x-2"
                        >
                          <Icon name="external-link" size={12} className="text-slate-900" />
                          <span>Open Google Maps</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === "rooms" && (
          <div className="pt-20">
            <Rooms 
              onBookRoom={setBookingRoom} 
              wishlist={wishlist} 
              toggleWishlist={toggleWishlist}
              searchParams={searchParams}
            />
          </div>
        )}

        {view === "cafe" && (
          <div className="pt-20">
            <CafeMenu />
          </div>
        )}

        {view === "experiences" && (
          <div className="pt-20">
            <Experiences />
          </div>
        )}

        {view === "gallery" && (
          <div className="pt-20">
            <Gallery />
          </div>
        )}

        {view === "attractions" && (
          <div className="pt-20">
            <Attractions />
          </div>
        )}

        {view === "admin" && (
          <AdminDashboard onClose={() => setView("home")} onViewChange={setView} />
        )}
      </main>

      {/* Foot Links Footer */}
      {view !== "admin" && (
        <Footer onViewChange={setView} />
      )}

      {/* Floating Action Contacts */}
      {view !== "admin" && (
        <div className="fixed bottom-6 left-6 z-40 flex flex-col space-y-3">
          {/* WhatsApp Direct */}
          <a 
            href="https://wa.me/919876543210?text=Hello%20Asherwoods,%20I'd%20like%20to%20inquire%20about%20cottage%20reservations." 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition duration-300"
            title="WhatsApp Reservation Desk"
          >
            <Icon name="message-circle" size={24} />
          </a>
          {/* Call Direct */}
          <a 
            href="tel:+919876543210" 
            className="bg-forest-900 hover:bg-forest-800 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition duration-300 border border-white/10"
            title="Call Reservation Desk"
          >
            <Icon name="phone-call" size={24} />
          </a>
        </div>
      )}

      {/* Live FAQ AI assistant panel drawer */}
      {view !== "admin" && (
        <ChatAssistant />
      )}

      {/* Stepper booking overlay check modal */}
      {bookingRoom && (
        <BookingModal 
          room={bookingRoom}
          activeGuest={activeGuest}
          onClose={() => setBookingRoom(null)}
          onBookingSuccess={handleBookingCompleted}
        />
      )}

      {/* Guest Portal overlay (bookings & wishlist) */}
      {isGuestPortalOpen && (
        <GuestPortal 
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          activeGuest={activeGuest}
          onLoginGuest={handleLoginGuest}
          onLogoutGuest={handleLogoutGuest}
          onViewChange={setView}
          onClose={() => setIsGuestPortalOpen(false)}
        />
      )}

      {/* Promo Special Offer alert popup */}
      {showOfferPopup && (
        <OffersPopup onClose={() => setShowOfferPopup(false)} />
      )}

    </div>
  );
};

// Render React App
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
