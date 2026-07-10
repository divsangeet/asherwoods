// Asherwoods Cafe & Cottages - Typed Core App Router
import React from 'react';
import { 
  Navbar, Hero, WhyChooseUs, Rooms, CafeMenu, 
  Experiences, Gallery, Attractions, BookingModal, 
  GuestPortal, ChatAssistant, Footer 
} from './components';
import { AdminDashboard } from './admin';
import { Room, Booking, SearchParams, GuestSession } from './types';
import { dbService } from './db';
import { Sun, Cloud, CloudRain, Snowflake, CloudFog } from 'lucide-react';

interface WeatherInfo {
  temp: number;
  condition: string;
  iconCode: string;
}

export default function App() {
  const [view, setView] = React.useState("home");
  const [theme, setTheme] = React.useState("dark");
  const [activeGuest, setActiveGuest] = React.useState<GuestSession | null>(null);
  
  // Modals & Panels
  const [showPortal, setShowPortal] = React.useState(false);
  const [bookingRoom, setBookingRoom] = React.useState<Room | null>(null);
  const [lastBooking, setLastBooking] = React.useState<Booking | null>(null);
  const [showOffers, setShowOffers] = React.useState(false);

  // States
  const [searchParams, setSearchParams] = React.useState<SearchParams | null>(null);
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [weather, setWeather] = React.useState<WeatherInfo>({ temp: 18, condition: "Partly Cloudy", iconCode: "cloud" });

  React.useEffect(() => {
    // Synchronize HTML Theme Class
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  React.useEffect(() => {
    // Load local caches
    const cachedSession = localStorage.getItem("ash_session");
    if (cachedSession) {
      setActiveGuest(JSON.parse(cachedSession));
    }
    const cachedWishlist = localStorage.getItem("ash_wishlist");
    if (cachedWishlist) {
      setWishlist(JSON.parse(cachedWishlist));
    }

    // Trigger seasonal offers popup
    const timer = setTimeout(() => {
      setShowOffers(true);
    }, 3000);

    // Sync climate
    fetchKasolWeather();

    return () => clearTimeout(timer);
  }, []);

  const fetchKasolWeather = async () => {
    try {
      // Kasol, Himachal Pradesh coordinates: 32.0098, 77.3150
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=32.0098&longitude=77.3150&current_weather=true");
      if (res.ok) {
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        
        let condition = "Clear Sky";
        let iconCode = "sun";

        if (code >= 1 && code <= 3) {
          condition = "Partly Cloudy";
          iconCode = "cloud";
        } else if (code >= 45 && code <= 48) {
          condition = "Foggy Trails";
          iconCode = "fog";
        } else if (code >= 51 && code <= 67) {
          condition = "Drizzle / Showers";
          iconCode = "rain";
        } else if (code >= 71 && code <= 77) {
          condition = "Snow Fall";
          iconCode = "snow";
        } else if (code >= 80 && code <= 99) {
          condition = "Rain Storms";
          iconCode = "rain";
        }

        setWeather({ temp, condition, iconCode });
      }
    } catch (e) {
      console.log("Weather API failed, resolving to local simulated metrics.", e);
      // Diurnal temperature simulation
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour > 19;
      setWeather({
        temp: isNight ? 12 : 22,
        condition: isNight ? "Mist & Clouds" : "Golden Sunshine",
        iconCode: isNight ? "fog" : "sun"
      });
    }
  };

  const handleLogin = (guest: GuestSession) => {
    setActiveGuest(guest);
    localStorage.setItem("ash_session", JSON.stringify(guest));
  };

  const handleLogout = () => {
    setActiveGuest(null);
    localStorage.removeItem("ash_session");
  };

  const toggleWishlist = (id: string) => {
    let updated = [...wishlist];
    if (updated.includes(id)) {
      updated = updated.filter(x => x !== id);
    } else {
      updated.push(id);
    }
    setWishlist(updated);
    localStorage.setItem("ash_wishlist", JSON.stringify(updated));
  };

  const handleSearchAvailability = (params: SearchParams) => {
    setSearchParams(params);
    setView("rooms");
    const el = document.getElementById("rooms-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookingCompleted = (booking: Booking) => {
    setBookingRoom(null);
    setLastBooking(booking);
  };

  const renderWeatherIcon = () => {
    switch (weather.iconCode) {
      case "sun":
        return <Sun className="text-yellow-400 animate-spin-slow" size={14} />;
      case "rain":
        return <CloudRain className="text-blue-400" size={14} />;
      case "snow":
        return <Snowflake className="text-sky-300 animate-pulse" size={14} />;
      case "fog":
        return <CloudFog className="text-slate-400" size={14} />;
      default:
        return <Cloud className="text-slate-300" size={14} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-luxury-warmwhite dark:bg-forest-950 text-slate-850 dark:text-luxury-warmwhite transition-colors duration-300">
      
      {/* Weather Header widget */}
      <div className="bg-forest-950 text-luxury-beige text-[10px] py-1.5 px-4 flex justify-between items-center z-50 border-b border-forest-900/30">
        <div className="flex items-center space-x-2">
          {renderWeatherIcon()}
          <span className="font-sans uppercase tracking-widest font-semibold">Kasol Live: {weather.temp}°C, {weather.condition}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 tracking-wider uppercase font-semibold">
          <span>Parvati Valley, HP</span>
          <span>•</span>
          <span className="text-luxury-gold">Private Deck Access Open</span>
        </div>
      </div>

      <Navbar 
        onViewChange={(v) => {
          setView(v);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        currentView={view}
        openGuestPortal={() => setShowPortal(true)}
        isDarkMode={theme === "dark"}
        toggleDarkMode={() => setTheme(theme === "dark" ? "light" : "dark")}
        activeGuest={activeGuest}
      />

      <main className="flex-1">
        {view === "admin" ? (
          <AdminDashboard onViewChange={setView} />
        ) : (
          <>
            {view === "home" && (
              <>
                <Hero onSearch={handleSearchAvailability} onViewChange={setView} />
                <WhyChooseUs />
                <Rooms 
                  onBookRoom={setBookingRoom} 
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  searchParams={searchParams}
                />
                <CafeMenu />
                <Experiences />
                <Gallery />
                <Attractions />
              </>
            )}

            {view === "rooms" && (
              <div className="pt-16">
                <Rooms 
                  onBookRoom={setBookingRoom} 
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  searchParams={searchParams}
                />
              </div>
            )}

            {view === "cafe" && (
              <div className="pt-16">
                <CafeMenu />
              </div>
            )}

            {view === "experiences" && (
              <div className="pt-16">
                <Experiences />
              </div>
            )}

            {view === "gallery" && (
              <div className="pt-16">
                <Gallery />
              </div>
            )}

            {view === "attractions" && (
              <div className="pt-16">
                <Attractions />
              </div>
            )}
          </>
        )}
      </main>

      <Footer onViewChange={setView} />
      <ChatAssistant />

      {/* Booking Modal */}
      {bookingRoom && (
        <BookingModal 
          room={bookingRoom}
          activeGuest={activeGuest}
          onClose={() => setBookingRoom(null)}
          onBookingSuccess={handleBookingCompleted}
        />
      )}

      {/* Guest Portal Modal */}
      {showPortal && (
        <GuestPortal 
          onClose={() => setShowPortal(false)}
          onViewChange={setView}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          activeGuest={activeGuest}
          onLoginGuest={handleLogin}
          onLogoutGuest={handleLogout}
        />
      )}

      {/* Staggered Offers / Promo modal Popup */}
      {showOffers && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-forest-900 border border-luxury-gold/30 text-white p-8 max-w-md rounded shadow-2xl relative text-center">
            <button 
              onClick={() => setShowOffers(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition"
            >
              <X size={18} />
            </button>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Limited Season Offer</span>
            <h3 className="font-serif text-3xl font-bold mt-2 text-luxury-warmwhite">Himalayan Monsoon Escape</h3>
            <p className="font-sans text-xs text-luxury-beige/70 mt-4 leading-relaxed">
              Book a stay for 3+ nights and get **20% off** instantly plus a complimentary traditional Himachali Siddu & ghee tasting platter.
            </p>
            <div className="my-6 p-3 bg-black/25 border border-white/5 rounded-sm inline-block">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Use Promo Code</p>
              <p className="font-mono text-xl text-luxury-gold font-bold tracking-wider mt-1">WINTER20</p>
            </div>
            <button 
              onClick={() => {
                setShowOffers(false);
                setView("rooms");
                const el = document.getElementById("rooms-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-widest text-xs py-3.5 rounded shadow-md transition duration-300"
            >
              Claim Special Discount
            </button>
          </div>
        </div>
      )}

      {/* Booking Confirmation Receipt Popup */}
      {lastBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 max-w-md rounded shadow-2xl relative text-left">
            <button 
              onClick={() => setLastBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 transition"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center space-x-3 text-green-500 mb-4">
              <CheckCircle size={28} />
              <h3 className="font-serif text-2xl font-bold text-slate-850 dark:text-white">Booking Confirmed!</h3>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Congratulations! Your reservation at **Asherwoods Cafe & Cottages** is locked in. Here is your digital stay receipt:
            </p>

            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded space-y-2.5 text-xs font-mono mb-6 text-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800">
              <div className="flex justify-between font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                <span>Stay Receipt</span>
                <span>{lastBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Cottage:</span>
                <span className="font-bold">{lastBooking.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span>Check In:</span>
                <span>{lastBooking.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check Out:</span>
                <span>{lastBooking.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Guest:</span>
                <span>{lastBooking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{lastBooking.totalNights}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
              <div className="flex justify-between font-bold text-forest-900 dark:text-luxury-gold">
                <span>Total Cost:</span>
                <span>₹{lastBooking.totalPrice.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setLastBooking(null);
                  setShowPortal(true);
                }}
                className="bg-forest-900 hover:bg-forest-800 dark:bg-white/10 dark:hover:bg-white/20 text-white border border-transparent dark:border-white/10 flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded transition duration-300 text-center"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => setLastBooking(null)}
                className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded shadow transition duration-300 text-center font-bold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Call & WhatsApp Widgets */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-3">
        <a 
          href="https://wa.me/919876543210" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition duration-300 border border-green-400/20"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={20} />
        </a>
        <a 
          href="tel:+919876543210"
          className="bg-blue-500 hover:bg-blue-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition duration-300 border border-blue-400/20"
          title="Call Reservations"
        >
          <PhoneCall size={20} />
        </a>
      </div>

    </div>
  );
}
