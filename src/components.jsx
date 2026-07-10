// Asherwoods Cafe & Cottages - React UI Components (Babel Compilable)

// 1. Icon Wrapper Component for Vanilla Lucide
const Icon = ({ name, className = "", size = 20 }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = "";
      const iconEl = document.createElement("i");
      iconEl.setAttribute("data-lucide", name);
      if (className) iconEl.className = className;
      iconEl.style.width = `${size}px`;
      iconEl.style.height = `${size}px`;
      ref.current.appendChild(iconEl);
      window.lucide.createIcons({
        attrs: {
          class: className,
          width: size,
          height: size
        },
        nameAttr: "data-lucide"
      });
    }
  }, [name, className, size]);
  return <span ref={ref} className="inline-flex items-center justify-center"></span>;
};

// 2. Sticky Glassmorphic Navbar
const Navbar = ({ onViewChange, currentView, openGuestPortal, isDarkMode, toggleDarkMode, activeGuest }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", view: "home" },
    { name: "Rooms", view: "rooms" },
    { name: "Cafe Menu", view: "cafe" },
    { name: "Experiences", view: "experiences" },
    { name: "Gallery", view: "gallery" },
    { name: "Attractions", view: "attractions" }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-forest-900/80 dark:bg-forest-950/80 backdrop-blur-md shadow-lg border-b border-forest-800/20 py-3" 
        : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onViewChange("home")}>
            <span className="font-serif text-2xl tracking-widest text-luxury-gold hover:text-luxury-warmwhite transition duration-300 font-bold">
              ASHERWOODS
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => onViewChange(link.view)}
                className={`font-sans text-sm tracking-widest uppercase transition duration-300 ${
                  currentView === link.view 
                    ? "text-luxury-gold font-bold border-b border-luxury-gold pb-1" 
                    : "text-luxury-warmwhite/80 hover:text-luxury-gold"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="text-luxury-warmwhite hover:text-luxury-gold transition duration-300"
              title="Toggle Dark/Light Mode"
            >
              <Icon name={isDarkMode ? "sun" : "moon"} size={20} />
            </button>

            {/* Guest Portal */}
            <button 
              onClick={openGuestPortal}
              className="text-luxury-warmwhite hover:text-luxury-gold transition duration-300 flex items-center space-x-2"
            >
              <Icon name="user" size={20} />
              <span className="text-xs uppercase tracking-wider font-semibold">
                {activeGuest ? activeGuest.name.split(" ")[0] : "Login"}
              </span>
            </button>

            {/* Admin Dashboard Entry */}
            <button
              onClick={() => onViewChange("admin")}
              className={`text-xs uppercase tracking-wider hover:text-luxury-gold transition duration-300 ${
                currentView === "admin" ? "text-luxury-gold" : "text-luxury-warmwhite/60"
              }`}
            >
              Portal
            </button>

            {/* CTA Button */}
            <button 
              onClick={() => onViewChange("rooms")}
              className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md transform hover:-translate-y-0.5 rounded-sm"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="text-luxury-warmwhite">
              <Icon name={isDarkMode ? "sun" : "moon"} size={20} />
            </button>
            <button onClick={openGuestPortal} className="text-luxury-warmwhite">
              <Icon name="user" size={20} />
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-luxury-warmwhite hover:text-luxury-gold transition duration-300"
            >
              <Icon name={isOpen ? "x" : "menu"} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-forest-950/95 backdrop-blur-lg border-t border-forest-800/30 transition-all duration-300">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  onViewChange(link.view);
                  setIsOpen(false);
                }}
                className={`block w-full text-left py-2 text-base font-medium tracking-wide ${
                  currentView === link.view ? "text-luxury-gold font-bold" : "text-luxury-warmwhite/80"
                }`}
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => {
                onViewChange("admin");
                setIsOpen(false);
              }}
              className="block w-full text-left py-2 text-base font-medium tracking-wide text-luxury-warmwhite/60"
            >
              Admin Dashboard
            </button>
            <div className="pt-4">
              <button 
                onClick={() => {
                  onViewChange("rooms");
                  setIsOpen(false);
                }}
                className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-950 text-center py-3 font-bold uppercase tracking-wider rounded-sm transition duration-300 block"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// 3. Hero Slideshow with Floating Widget
const Hero = ({ onSearch, onViewChange }) => {
  const slides = [
    {
      img: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1200&q=80",
      title: "Escape to Nature",
      sub: "Stay. Relax. Explore."
    },
    {
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      title: "Majestic Mountain Lodging",
      sub: "Cozy wood design at Parvati river boundaries"
    },
    {
      img: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80",
      title: "Unwind by the Embers",
      sub: "Israel delicacies & Himachali bonfire nights"
    }
  ];

  const [activeSlide, setActiveSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-forest-950">
      {/* Background Slideshow with Zoom effect */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === activeSlide ? "opacity-40" : "opacity-0"
          }`}
        >
          <img
            src={slide.img}
            alt="Resort Backdrop"
            className={`w-full h-full object-cover transform scale-105 transition-transform duration-[6000ms] ease-out ${
              idx === activeSlide ? "scale-100" : "scale-105"
            }`}
          />
        </div>
      ))}

      {/* Forest Green Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-transparent to-forest-950/60 pointer-events-none"></div>

      {/* Floating Booking Widget */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 max-w-7xl mx-auto text-center">
        {/* Animated Badge */}
        <div className="mb-4 inline-flex items-center space-x-2 bg-luxury-gold/10 border border-luxury-gold/30 px-3 py-1 text-xs tracking-widest text-luxury-gold uppercase rounded-full animate-pulse">
          <Icon name="sparkles" size={12} className="text-luxury-gold" />
          <span>Premier Himalayan Sanctuary</span>
        </div>

        {/* Dynamic Titles */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-luxury-warmwhite font-bold leading-tight drop-shadow-md">
          {slides[activeSlide].title}
        </h1>
        <p className="font-sans text-lg md:text-2xl text-luxury-beige tracking-widest mt-4 uppercase drop-shadow-sm font-light">
          {slides[activeSlide].sub}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-luxury-gold italic mt-6 font-semibold">
          Asherwoods Cafe & Cottages
        </h2>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
          <button 
            onClick={() => onViewChange("rooms")}
            className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-widest text-sm px-8 py-4 transition-all duration-300 shadow-xl rounded-sm hover:-translate-y-0.5"
          >
            Book Now
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById("rooms-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="border border-luxury-warmwhite/40 hover:border-luxury-gold text-luxury-warmwhite hover:text-luxury-gold font-bold uppercase tracking-widest text-sm px-8 py-4 bg-white/5 backdrop-blur-xs transition-all duration-300 rounded-sm hover:-translate-y-0.5"
          >
            Explore Rooms
          </button>
        </div>

        {/* Floating Booking Widget */}
        <div className="absolute bottom-10 md:bottom-16 w-full max-w-5xl px-4 left-1/2 transform -translate-x-1/2">
          <BookingWidget onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};

// 4. Floating Booking Widget
const BookingWidget = ({ onSearch }) => {
  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");
  const [guests, setGuests] = React.useState(2);
  const [roomType, setRoomType] = React.useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    onSearch({ checkIn, checkOut, guests, roomType });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-forest-900/60 dark:bg-forest-950/70 border border-forest-800/30 backdrop-blur-md p-4 md:p-6 shadow-2xl flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 rounded-sm text-left"
    >
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Check In */}
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-1 flex items-center space-x-1">
            <Icon name="calendar-days" size={10} className="text-luxury-gold" />
            <span>Check In</span>
          </label>
          <input
            type="date"
            required
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckIn(e.target.value)}
            className="bg-white/10 border border-white/20 text-white text-sm p-3 focus:outline-none focus:border-luxury-gold rounded-sm w-full dark:bg-black/20"
          />
        </div>

        {/* Check Out */}
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-1 flex items-center space-x-1">
            <Icon name="calendar-days" size={10} className="text-luxury-gold" />
            <span>Check Out</span>
          </label>
          <input
            type="date"
            required
            value={checkOut}
            min={checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckOut(e.target.value)}
            className="bg-white/10 border border-white/20 text-white text-sm p-3 focus:outline-none focus:border-luxury-gold rounded-sm w-full dark:bg-black/20"
          />
        </div>

        {/* Guests */}
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-1 flex items-center space-x-1">
            <Icon name="users" size={10} className="text-luxury-gold" />
            <span>Guests</span>
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="bg-white/10 border border-white/20 text-white text-sm p-3 focus:outline-none focus:border-luxury-gold rounded-sm w-full dark:bg-black/20"
          >
            <option value="1" className="text-forest-950">1 Guest</option>
            <option value="2" className="text-forest-950">2 Guests</option>
            <option value="3" className="text-forest-950">3 Guests</option>
            <option value="4" className="text-forest-950">4 Guests</option>
            <option value="5" className="text-forest-950">5 Guests</option>
          </select>
        </div>

        {/* Room Type */}
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-1 flex items-center space-x-1">
            <Icon name="door-open" size={10} className="text-luxury-gold" />
            <span>Cottage Type</span>
          </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="bg-white/10 border border-white/20 text-white text-sm p-3 focus:outline-none focus:border-luxury-gold rounded-sm w-full dark:bg-black/20"
          >
            <option value="all" className="text-forest-950">All Cottages</option>
            <option value="mountain-view" className="text-forest-950">Mountain View</option>
            <option value="luxury-wooden" className="text-forest-950">Luxury Wooden</option>
            <option value="deluxe-riverside" className="text-forest-950">Deluxe Riverside</option>
            <option value="family-cottage" className="text-forest-950">Family Cottage</option>
          </select>
        </div>
      </div>

      <div className="lg:w-48 flex items-end">
        <button
          type="submit"
          className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-950 py-3 font-bold uppercase tracking-widest text-xs transition duration-300 rounded-sm shadow-md"
        >
          Check Availability
        </button>
      </div>
    </form>
  );
};

// 5. Why Choose Us Section
const WhyChooseUs = () => {
  const perks = [
    { title: "River Side Property", desc: "Listen to the murmurs of the Parvati River flows directly bordering our private grass lawn decks.", icon: "waves" },
    { title: "Mountain Views", desc: "Wake up to unobstructed, cinematic views of snow-dusted Himalayan peaks and pine forests.", icon: "mountain" },
    { title: "Private Balconies", desc: "Every cabin includes a private cedarwood balcony perfect for sipping honey cappuccino.", icon: "coffee" },
    { title: "Bonfire Nights", desc: "Relax by our cozy central bonfire pit with Israel dining and local music every evening.", icon: "flame" },
    { title: "Gourmet Cafe", desc: "Enjoy an expansive multi-cuisine menu featuring Himachali and Israeli artisan delicacies.", icon: "utensils" },
    { title: "High-Speed WiFi", desc: "Stay connected in the deep woods with fiber high-speed wireless networks for digital nomads.", icon: "wifi" },
    { title: "Secured Parking", desc: "Hassle-free onsite secured parking space for private vehicles and motorcycles.", icon: "shield" },
    { title: "Peaceful Environment", desc: "A sanctuary set away from the commercial crowds, deep in nature walks.", icon: "trees" }
  ];

  return (
    <section className="py-24 bg-luxury-beige dark:bg-forest-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold">Uncompromising Mountain Luxury</span>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 dark:text-luxury-warmwhite font-bold mt-2 leading-tight">
            Why Asherwoods is the Finest Sanctuary in Kasol
          </h2>
          <div className="h-0.5 w-20 bg-luxury-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {perks.map((p, idx) => (
            <div 
              key={idx}
              className="bg-white/40 dark:bg-forest-900/40 p-8 border border-forest-800/10 dark:border-white/5 backdrop-blur-md rounded-sm group hover:border-luxury-gold/50 hover:shadow-xl transition-all duration-500"
            >
              <div className="h-12 w-12 rounded-sm bg-forest-900/10 dark:bg-luxury-gold/10 flex items-center justify-center text-forest-900 dark:text-luxury-gold group-hover:bg-luxury-gold group-hover:text-forest-950 transition-colors duration-500">
                <Icon name={p.icon} size={24} />
              </div>
              <h3 className="font-serif text-lg text-forest-900 dark:text-luxury-warmwhite font-bold mt-6 group-hover:text-luxury-gold transition-colors duration-300">
                {p.title}
              </h3>
              <p className="font-sans text-sm text-slate-600 dark:text-luxury-beige/70 mt-3 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Rooms Section
const Rooms = ({ onBookRoom, wishlist = [], toggleWishlist, searchParams }) => {
  const [rooms, setRooms] = React.useState([]);
  const [selectedCottage, setSelectedCottage] = React.useState(null);

  React.useEffect(() => {
    setRooms(window.dbService.getRooms());
  }, [searchParams]);

  const filteredRooms = React.useMemo(() => {
    if (!searchParams || searchParams.roomType === "all") return rooms;
    return rooms.filter(r => r.id === searchParams.roomType);
  }, [rooms, searchParams]);

  return (
    <section id="rooms-section" className="py-24 bg-luxury-warmwhite dark:bg-forest-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold">Unwind in Alpine Splendor</span>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 dark:text-luxury-warmwhite font-bold mt-2">
            Our Luxurious Wooden Cottages
          </h2>
          <p className="font-sans text-sm text-slate-600 dark:text-luxury-beige/70 mt-4 max-w-2xl mx-auto">
            Each cedarwood cabin is custom-crafted to blend organic architecture with premium comfort. Wake up to the rapids of the river or the peaks of Kasol.
          </p>
          <div className="h-0.5 w-20 bg-luxury-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
          {filteredRooms.map((room) => {
            const isWishlisted = wishlist.includes(room.id);
            return (
              <div 
                key={room.id}
                className="bg-white dark:bg-forest-950/40 border border-forest-800/10 dark:border-white/5 rounded-sm overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"></div>

                  <div className="absolute top-4 left-4 bg-forest-900/80 backdrop-blur-xs text-luxury-gold text-xs font-bold py-1 px-2.5 rounded-sm flex items-center space-x-1 border border-luxury-gold/30">
                    <Icon name="star" size={10} className="fill-luxury-gold text-luxury-gold" />
                    <span>{room.rating}</span>
                  </div>

                  <button 
                    onClick={() => toggleWishlist(room.id)}
                    className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all duration-300 animate-fade-in"
                  >
                    <Icon 
                      name="heart" 
                      size={16} 
                      className={isWishlisted ? "fill-red-500 text-red-500" : "text-white"} 
                    />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">{room.size} | {room.occupancy}</p>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-bold mt-1">{room.name}</h3>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <p className="font-sans text-sm text-slate-600 dark:text-luxury-beige/70 leading-relaxed flex-1">
                    {room.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-6 border-t border-b border-forest-800/10 dark:border-white/5 my-6">
                    {room.amenities.slice(0, 3).map((am, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-luxury-beige/90">
                        <Icon name="check-circle" size={12} className="text-luxury-gold" />
                        <span className="truncate">{am}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-luxury-beige/60 uppercase tracking-widest">Starting Nightly</p>
                      <p className="font-serif text-2xl text-forest-900 dark:text-luxury-gold font-bold">
                        ₹{room.price} <span className="text-xs text-slate-500 font-sans font-normal"> + taxes</span>
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedCottage(room)}
                        className="border border-forest-800/30 dark:border-white/20 text-forest-900 dark:text-luxury-warmwhite hover:bg-forest-900 hover:text-white dark:hover:bg-white dark:hover:text-forest-950 px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-sm transition duration-300"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => onBookRoom(room)}
                        className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 px-5 py-2.5 text-xs uppercase tracking-wider font-bold rounded-sm transition duration-300 shadow-md"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCottage && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm">
          <div className="bg-luxury-warmwhite dark:bg-forest-950 border border-forest-800/20 dark:border-white/10 rounded-sm w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setSelectedCottage(null)}
              className="absolute top-4 right-4 h-10 w-10 bg-forest-900/10 dark:bg-white/10 hover:bg-luxury-gold text-slate-800 dark:text-white rounded-full flex items-center justify-center transition duration-300 z-10"
            >
              <Icon name="x" size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-forest-950 relative">
                <img 
                  src={selectedCottage.image} 
                  alt={selectedCottage.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-serif text-2xl font-bold">{selectedCottage.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">{selectedCottage.size} | {selectedCottage.occupancy}</p>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <h4 className="font-serif text-lg text-forest-900 dark:text-luxury-gold font-bold font-semibold">Cottage Overview</h4>
                <p className="font-sans text-sm text-slate-600 dark:text-luxury-beige/70 mt-3 leading-relaxed">
                  {selectedCottage.description}
                </p>

                <h4 className="font-serif text-lg text-forest-900 dark:text-luxury-gold font-bold mt-8 font-semibold">Premium Amenities Included</h4>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {selectedCottage.amenities.map((am, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm text-slate-700 dark:text-luxury-beige/90">
                      <Icon name="check" size={14} className="text-luxury-gold" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-forest-800/10 dark:border-white/5 pt-8 mt-8 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Rate Per Night</p>
                    <p className="font-serif text-3xl text-forest-900 dark:text-luxury-gold font-bold">₹{selectedCottage.price}</p>
                  </div>

                  <button 
                    onClick={() => {
                      onBookRoom(selectedCottage);
                      setSelectedCottage(null);
                    }}
                    className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-widest text-xs px-8 py-3.5 rounded-sm transition duration-300 shadow-md"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// 7. Cafe Menu Section
const CafeMenu = () => {
  const categories = ["All", "Coffee", "Israeli Food", "Breakfast", "Pizza", "Pasta", "Burgers", "Desserts", "Himachali Specials"];
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [menuItems, setMenuItems] = React.useState([]);

  React.useEffect(() => {
    setMenuItems(window.dbService.getCafeItems());
  }, []);

  const filteredItems = React.useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [menuItems, activeCategory]);

  return (
    <section className="py-24 bg-forest-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold">The Forest Gourmet Experience</span>
          <h2 className="font-serif text-4xl md:text-5xl text-luxury-warmwhite font-bold mt-2">
            Asherwoods Cafe & Fine Dining
          </h2>
          <p className="font-sans text-sm text-luxury-beige/70 mt-4 max-w-xl mx-auto">
            Experience culinary arts with local forest honeys, flatbreads, and custom mountain herbs.
          </p>
          <div className="h-0.5 w-20 bg-luxury-gold mx-auto mt-4"></div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 rounded-sm border ${
                activeCategory === cat 
                  ? "bg-luxury-gold text-forest-950 border-luxury-gold font-bold shadow-lg" 
                  : "bg-forest-900/50 hover:bg-forest-900 border-white/10 text-luxury-warmwhite/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-forest-900/30 border border-white/5 hover:border-luxury-gold/30 rounded-sm overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent"></div>
                <div className={`absolute top-4 right-4 flex items-center space-x-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase ${
                  item.type === "Veg" ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${item.type === "Veg" ? "bg-green-300" : "bg-red-300"}`}></span>
                  <span>{item.type}</span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-lg font-bold text-luxury-warmwhite group-hover:text-luxury-gold transition-colors duration-300">
                    {item.name}
                  </h3>
                  <span className="font-serif text-lg text-luxury-gold font-bold ml-4 font-semibold">
                    ₹{item.price}
                  </span>
                </div>
                <p className="font-sans text-xs text-luxury-beige/60 mt-3 leading-relaxed flex-1">
                  {item.desc}
                </p>
                <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-luxury-gold uppercase tracking-widest font-semibold flex items-center space-x-1">
                    <Icon name="chef-hat" size={10} className="text-luxury-gold" />
                    <span>Gourmet Standard</span>
                  </span>
                  <button className="bg-luxury-gold/10 hover:bg-luxury-gold hover:text-forest-950 text-luxury-gold px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-wider border border-luxury-gold/30 rounded-sm transition duration-300">
                    Order to Cabin
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 8. Experiences Section
const Experiences = () => {
  const exps = [
    { title: "Riverside Bonfire Nights", desc: "Share music, tales and Israeli cuisine around our glowing log pit right beside the Parvati river.", image: "https://images.unsplash.com/photo-1526495124232-a02e18494d17?auto=format&fit=crop&w=600&q=80" },
    { title: "Guided Alpine Treks", desc: "Hike the legendary pine paths up to Chalal, Kheerganga, or Tosh guided by local mountaineers.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
    { title: "Acoustic Cafe Evenings", desc: "Live instrumental strings, acoustic jams and gourmet plates under the warm amber cafe lights.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80" },
    { title: "Pine Forest Camping", desc: "Sleep under a starry Kasol sky in specialized glamping tents pitched in wilderness buffers.", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <section className="py-24 bg-luxury-beige dark:bg-forest-950/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold">Resort Life & Adventures</span>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 dark:text-luxury-warmwhite font-bold mt-2">
            Curated Himachali Experiences
          </h2>
          <div className="h-0.5 w-20 bg-luxury-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {exps.map((ex, i) => (
            <div 
              key={i}
              className="h-80 relative overflow-hidden rounded-sm group shadow-lg cursor-pointer"
            >
              <img 
                src={ex.image} 
                alt={ex.title} 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-luxury-gold">{ex.title}</h3>
                <p className="font-sans text-xs md:text-sm text-luxury-beige/80 mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 font-light">
                  {ex.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 9. Pinterest Masonry Gallery
const Gallery = () => {
  const images = [
    { src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=600&q=80", cat: "Cottages" },
    { src: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80", cat: "Cottages" },
    { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80", cat: "Cafe" },
    { src: "https://images.unsplash.com/photo-1526495124232-a02e18494d17?auto=format&fit=crop&w=600&q=80", cat: "Bonfire" },
    { src: "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=600&q=80", cat: "Cottages" },
    { src: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80", cat: "Cafe" },
    { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", cat: "River" },
    { src: "https://images.unsplash.com/photo-1507038772120-7bef2c145e52?auto=format&fit=crop&w=600&q=80", cat: "River" },
    { src: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80", cat: "Cafe" }
  ];

  const cats = ["All", "Cottages", "Cafe", "Bonfire", "River"];
  const [activeCat, setActiveCat] = React.useState("All");

  const filteredImages = React.useMemo(() => {
    if (activeCat === "All") return images;
    return images.filter(img => img.cat === activeCat);
  }, [activeCat]);

  return (
    <section className="py-24 bg-luxury-warmwhite dark:bg-forest-900/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold">Immersive Visual Journey</span>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 dark:text-luxury-warmwhite font-bold mt-2">
            The Asherwoods Gallery
          </h2>
          <div className="h-0.5 w-20 bg-luxury-gold mx-auto mt-4"></div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold border transition duration-300 rounded-sm ${
                activeCat === c 
                  ? "bg-forest-900 border-forest-900 text-luxury-gold font-bold dark:bg-luxury-gold dark:border-luxury-gold dark:text-forest-950" 
                  : "border-forest-800/10 hover:border-luxury-gold text-forest-900 dark:text-luxury-warmwhite/80 dark:border-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mt-16 space-y-6">
          {filteredImages.map((img, i) => (
            <div 
              key={i} 
              className="break-inside-avoid relative overflow-hidden rounded-sm shadow-md group cursor-pointer border border-forest-800/5 dark:border-white/5"
            >
              <img 
                src={img.src} 
                alt={`Gallery ${img.cat}`} 
                className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-luxury-gold text-forest-950 px-4 py-2 text-xs tracking-widest uppercase font-bold rounded-sm shadow-md">
                  {img.cat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 10. Attractions & Interactive SVG Map
const Attractions = () => {
  const points = [
    { id: "kasol", name: "Kasol Market", dist: "1.2 km", desc: "The bustling core of Parvati Valley, packed with Israeli diners, local handicraft stalls, and Himalayan organic bakeries.", color: "#D4AF37", cx: 120, cy: 150 },
    { id: "chalal", name: "Chalal Village", dist: "2.0 km", desc: "Walk down an evergreen pine path bordering the gushing rapids. Renowned for its calm traditional ambiance.", color: "#8C6239", cx: 180, cy: 190 },
    { id: "manikaran", name: "Manikaran Sahib", dist: "4.0 km", desc: "Ancient Gurudwara located right by geothermal hot water springs. Famous for community kitchens (langar).", color: "#14462B", cx: 280, cy: 90 },
    { id: "tosh", name: "Tosh Village", dist: "20 km", desc: "A traditional hill hamlet perched high on cliffs, offering panoramic glacial views and hippie cafes.", color: "#4A3B32", cx: 380, cy: 220 },
    { id: "kheerganga", name: "Kheerganga Trek", dist: "22 km", desc: "A world-renowned 12km pine woods trek that terminates in natural volcanic hot baths on mountain meadows.", color: "#D4AF37", cx: 480, cy: 140 },
    { id: "malana", name: "Malana Clan", dist: "21 km", desc: "An ancient, isolated village with its own unique democratic parliament and custom laws, situated on steep ridges.", color: "#8C6239", cx: 50, cy: 80 }
  ];

  const [activePoint, setActivePoint] = React.useState(points[0]);

  return (
    <section className="py-24 bg-luxury-beige dark:bg-forest-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-serif text-sm tracking-widest text-luxury-gold uppercase font-bold">Himalayan Explorer Guide</span>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-900 dark:text-luxury-warmwhite font-bold mt-2">
            Local Attractions & Trails
          </h2>
          <div className="h-0.5 w-20 bg-luxury-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 items-center">
          <div className="lg:col-span-7 bg-forest-900/10 dark:bg-forest-900/50 p-6 rounded-sm border border-forest-800/10 dark:border-white/5 relative shadow-inner overflow-x-auto">
            <div className="min-w-[500px] h-[300px] relative mx-auto">
              <svg viewBox="0 0 550 300" className="w-full h-full">
                <path 
                  d="M 10 90 Q 150 110, 250 170 T 540 210" 
                  fill="none" 
                  stroke="#4ba3e3" 
                  strokeWidth="8" 
                  strokeDasharray="4 2" 
                  className="opacity-70"
                />
                <text x="320" y="195" fill="#4ba3e3" className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-60">Parvati River</text>
                
                <path d="M 30 250 L 90 180 L 150 250 Z" fill="none" stroke="currentColor" className="text-forest-800/20 dark:text-white/10" strokeWidth="2" />
                <path d="M 120 270 L 220 190 L 320 270 Z" fill="none" stroke="currentColor" className="text-forest-800/20 dark:text-white/10" strokeWidth="2" />
                <path d="M 380 180 L 460 110 L 520 180 Z" fill="none" stroke="currentColor" className="text-forest-800/20 dark:text-white/10" strokeWidth="2" />

                <g className="cursor-pointer">
                  <circle cx="210" cy="140" r="10" fill="#D4AF37" className="animate-ping opacity-75" />
                  <circle cx="210" cy="140" r="6" fill="#0A2F1D" stroke="#D4AF37" strokeWidth="2" />
                  <text x="222" y="144" fill="#D4AF37" className="text-xs font-serif font-bold uppercase tracking-wider">Asherwoods</text>
                </g>

                {points.map((p) => {
                  const isActive = activePoint.id === p.id;
                  return (
                    <g 
                      key={p.id} 
                      onClick={() => setActivePoint(p)}
                      className="cursor-pointer group"
                    >
                      <circle 
                        cx={p.cx} 
                        cy={p.cy} 
                        r={isActive ? "10" : "7"} 
                        fill={isActive ? "#D4AF37" : "rgba(255,255,255,0.2)"}
                        stroke={p.color}
                        strokeWidth="2.5"
                        className="transition-all duration-300 hover:scale-125"
                      />
                      <text 
                        x={p.cx + 10} 
                        y={p.cy + 4} 
                        fill={isActive ? "#D4AF37" : "currentColor"} 
                        className={`text-[10px] font-sans font-semibold transition-all duration-300 ${
                          isActive ? "text-[11px] font-bold" : "text-slate-500 dark:text-white/60"
                        }`}
                      >
                        {p.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="absolute bottom-4 left-4 text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-widest font-semibold">
              * Click pins to reveal trail descriptions
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-forest-900/30 p-8 border border-forest-800/10 dark:border-white/5 rounded-sm shadow-xl flex flex-col justify-between h-[350px]">
            <div>
              <div className="flex items-center justify-between border-b border-forest-800/10 dark:border-white/10 pb-4">
                <h3 className="font-serif text-2xl text-forest-900 dark:text-luxury-gold font-bold">
                  {activePoint.name}
                </h3>
                <span className="bg-forest-900/10 dark:bg-luxury-gold/10 text-forest-900 dark:text-luxury-gold text-xs font-bold px-3 py-1 rounded-sm border border-luxury-gold/20">
                  {activePoint.dist}
                </span>
              </div>
              <p className="font-sans text-sm text-slate-600 dark:text-luxury-beige/70 mt-6 leading-relaxed">
                {activePoint.desc}
              </p>
            </div>

            <div className="pt-6 border-t border-forest-800/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-white/40 flex items-center space-x-1.5 font-semibold">
                <Icon name="navigation" size={12} className="text-luxury-gold" />
                <span>Directions from Asherwoods available</span>
              </span>
              <button 
                onClick={() => alert(`Simulating navigation map to ${activePoint.name} (${activePoint.dist})`)}
                className="bg-forest-900 hover:bg-forest-800 dark:bg-luxury-gold dark:hover:bg-yellow-600 text-white dark:text-forest-950 font-bold uppercase tracking-wider text-[10px] px-5 py-2.5 rounded-sm transition duration-300"
              >
                Navigate
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 11. Custom Simulated Razorpay Portal Modal
const RazorpayModal = ({ bookingDetails, onPaymentSuccess, onPaymentCancel }) => {
  const [method, setMethod] = React.useState("upi");
  const [loading, setLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");

  const [cardNo, setCardNo] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCVV, setCardCVV] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [upiId, setUpiId] = React.useState("");

  const triggerPayment = () => {
    setLoading(true);
    setStatusMessage("Connecting to bank server...");
    
    setTimeout(() => {
      setStatusMessage("Securing payment portal gateway...");
      setTimeout(() => {
        setStatusMessage("Deducting funds securely...");
        setTimeout(() => {
          setLoading(false);
          const paymentId = "pay_" + Math.random().toString(36).substring(2, 10).toUpperCase();
          onPaymentSuccess(paymentId);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const formattedAmount = Number(bookingDetails.totalPrice).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR"
  });

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-md w-full max-w-md shadow-2xl overflow-hidden border border-slate-800">
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white relative">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-6 w-6 rounded-sm bg-white text-blue-600 font-bold flex items-center justify-center text-sm shadow">R</span>
              <span className="font-sans font-bold tracking-tight text-lg">Razorpay</span>
            </div>
            <p className="text-[10px] text-blue-100 uppercase tracking-widest mt-1">Order: {bookingDetails.id}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-100 uppercase">Amount Due</p>
            <p className="font-sans font-bold text-xl">{formattedAmount}</p>
          </div>
          <button 
            disabled={loading}
            onClick={onPaymentCancel} 
            className="absolute top-4 right-4 text-blue-200 hover:text-white transition"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            <p className="font-sans text-sm text-slate-300 mt-6">{statusMessage}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-2">Do not close or reload this window</p>
          </div>
        ) : (
          <div className="flex">
            <div className="w-1/3 bg-slate-950 border-r border-slate-800 flex flex-col">
              <button 
                onClick={() => setMethod("upi")}
                className={`p-4 text-left text-xs uppercase font-bold tracking-wider transition ${
                  method === "upi" ? "bg-slate-900 text-blue-400 border-l-2 border-blue-500" : "text-slate-400 hover:text-white"
                }`}
              >
                UPI / GPay
              </button>
              <button 
                onClick={() => setMethod("card")}
                className={`p-4 text-left text-xs uppercase font-bold tracking-wider transition ${
                  method === "card" ? "bg-slate-900 text-blue-400 border-l-2 border-blue-500" : "text-slate-400 hover:text-white"
                }`}
              >
                Cards
              </button>
              <button 
                onClick={() => setMethod("net")}
                className={`p-4 text-left text-xs uppercase font-bold tracking-wider transition ${
                  method === "net" ? "bg-slate-900 text-blue-400 border-l-2 border-blue-500" : "text-slate-400 hover:text-white"
                }`}
              >
                Net Banking
              </button>
              <button 
                onClick={() => setMethod("wallet")}
                className={`p-4 text-left text-xs uppercase font-bold tracking-wider transition ${
                  method === "wallet" ? "bg-slate-900 text-blue-400 border-l-2 border-blue-500" : "text-slate-400 hover:text-white"
                }`}
              >
                Wallets
              </button>
            </div>

            <div className="w-2/3 p-6 flex flex-col justify-between min-h-[300px]">
              {method === "upi" && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Pay via UPI App</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setUpiId("guest@gpay")} className="bg-slate-950 hover:bg-slate-800 p-2 border border-slate-800 text-[10px] text-center rounded">GPay</button>
                    <button onClick={() => setUpiId("guest@ybl")} className="bg-slate-950 hover:bg-slate-800 p-2 border border-slate-800 text-[10px] text-center rounded">PhonePe</button>
                    <button onClick={() => setUpiId("guest@paytm")} className="bg-slate-950 hover:bg-slate-800 p-2 border border-slate-800 text-[10px] text-center rounded">Paytm</button>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-slate-500 block mb-1">Enter UPI ID / VPA</label>
                    <input 
                      type="text" 
                      placeholder="e.g. mobile@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-white text-xs p-2.5 focus:outline-none focus:border-blue-500 w-full rounded"
                    />
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-950 p-2.5 border border-slate-800 rounded">
                    <div className="h-12 w-12 bg-white flex items-center justify-center text-slate-900 font-bold p-1 rounded">
                      <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-80">
                        <div className="bg-black"></div><div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
                        <div className="bg-white"></div><div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div>
                        <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div>
                        <div className="bg-black"></div><div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold">Simulate QR Scan</p>
                      <p className="text-[9px] text-slate-500">Scan this QR code in your UPI application to pay.</p>
                    </div>
                  </div>
                </div>
              )}

              {method === "card" && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Pay via Debit/Credit Card</h4>
                  <div>
                    <label className="text-[9px] uppercase text-slate-500 block mb-0.5">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4111 2222 3333 4444"
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-white text-xs p-2 focus:outline-none focus:border-blue-500 w-full rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] uppercase text-slate-500 block mb-0.5">Expiry (MM/YY)</label>
                      <input 
                        type="text" 
                        placeholder="12/29"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white text-xs p-2 focus:outline-none focus:border-blue-500 w-full rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-slate-500 block mb-0.5">CVV</label>
                      <input 
                        type="password" 
                        placeholder="***"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white text-xs p-2 focus:outline-none focus:border-blue-500 w-full rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-slate-500 block mb-0.5">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-white text-xs p-2 focus:outline-none focus:border-blue-500 w-full rounded"
                    />
                  </div>
                </div>
              )}

              {(method === "net" || method === "wallet") && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                    {method === "net" ? "Popular Banks" : "Popular Wallets"}
                  </h4>
                  <div className="space-y-2">
                    <button onClick={triggerPayment} className="w-full bg-slate-950 hover:bg-slate-800 p-3 border border-slate-800 text-xs text-left rounded flex items-center justify-between">
                      <span>{method === "net" ? "State Bank of India" : "Paytm Wallet"}</span>
                      <Icon name="chevron-right" size={12} className="text-blue-500" />
                    </button>
                    <button onClick={triggerPayment} className="w-full bg-slate-950 hover:bg-slate-800 p-3 border border-slate-800 text-xs text-left rounded flex items-center justify-between">
                      <span>{method === "net" ? "HDFC Bank" : "Amazon Pay"}</span>
                      <Icon name="chevron-right" size={12} className="text-blue-500" />
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={triggerPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs py-3.5 mt-6 rounded shadow-md"
              >
                Pay {formattedAmount}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 12. Interactive Booking Engine Modal
const BookingModal = ({ room, onClose, onBookingSuccess, activeGuest }) => {
  const [step, setStep] = React.useState(1);
  const [checkIn, setCheckIn] = React.useState("");
  const [checkOut, setCheckOut] = React.useState("");
  const [guestsCount, setGuestsCount] = React.useState(2);
  const [couponCode, setCouponCode] = React.useState("");
  const [couponError, setCouponError] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState(null);

  const [guestName, setGuestName] = React.useState(activeGuest ? activeGuest.name : "");
  const [guestEmail, setGuestEmail] = React.useState(activeGuest ? activeGuest.email : "");
  const [guestPhone, setGuestPhone] = React.useState(activeGuest ? activeGuest.phone : "");

  const [showPaymentPortal, setShowPaymentPortal] = React.useState(false);
  const [generatedBooking, setGeneratedBooking] = React.useState(null);

  const nightsCount = React.useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }, [checkIn, checkOut]);

  const pricingDetails = React.useMemo(() => {
    const baseTotal = room.price * nightsCount;
    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        discount = baseTotal * (appliedCoupon.value / 100);
      } else if (appliedCoupon.discountType === "flat") {
        discount = appliedCoupon.value;
      }
    }

    const subtotal = Math.max(0, baseTotal - discount);
    const gst = subtotal * 0.18; 
    const totalPrice = subtotal + gst;

    return { baseTotal, discount, subtotal, gst, totalPrice };
  }, [room, nightsCount, appliedCoupon]);

  const verifyCoupon = () => {
    setCouponError("");
    const coupons = window.dbService.getCoupons();
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    
    if (!found) {
      setCouponError("Invalid Coupon Code");
      setAppliedCoupon(null);
      return;
    }

    if (nightsCount < found.minNights) {
      setCouponError(`This code requires minimum ${found.minNights} nights stay.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(found);
    setCouponError("");
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!checkIn || !checkOut) {
        alert("Please select stay dates");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!guestName || !guestEmail || !guestPhone) {
        alert("Please fill in all guest contact details.");
        return;
      }

      const bookingData = {
        id: "BK-" + Math.floor(10000 + Math.random() * 90000),
        roomId: room.id,
        roomName: room.name,
        guestName,
        guestEmail,
        guestPhone,
        checkIn,
        checkOut,
        guestsCount,
        basePrice: room.price,
        totalNights: nightsCount,
        discount: pricingDetails.discount,
        gst: pricingDetails.gst,
        totalPrice: pricingDetails.totalPrice,
        couponCode: appliedCoupon ? appliedCoupon.code : "",
        status: "Pending",
        createdAt: new Date().toISOString()
      };
      setGeneratedBooking(bookingData);
      setShowPaymentPortal(true);
    }
  };

  const handlePaymentCompleted = (paymentId) => {
    const confirmedBooking = {
      ...generatedBooking,
      status: "Confirmed",
      paymentId
    };

    window.dbService.addBooking(confirmedBooking);
    setShowPaymentPortal(false);
    onBookingSuccess(confirmedBooking);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm">
        <div className="bg-luxury-warmwhite dark:bg-forest-950 border border-forest-800/20 dark:border-white/10 rounded-sm w-full max-w-3xl overflow-hidden shadow-2xl relative">
          
          <div className="bg-forest-900 dark:bg-forest-950 text-white p-6 border-b border-forest-800/20 dark:border-white/5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Booking Engine</span>
              <h3 className="font-serif text-xl font-bold">{room.name}</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-luxury-gold transition duration-300"
            >
              <Icon name="x" size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-7 p-6 md:p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1.5">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 1 ? "bg-luxury-gold text-forest-950 font-bold" : "bg-forest-900 text-white font-bold"
                  }`}>1</span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-forest-900 dark:text-luxury-beige">Dates</span>
                </div>
                <div className="h-px w-8 bg-forest-800/20"></div>
                <div className="flex items-center space-x-1.5">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === 2 ? "bg-luxury-gold text-forest-950 font-bold" : "bg-forest-800/30 text-slate-500"
                  }`}>2</span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-luxury-beige/50">Details</span>
                </div>
              </div>

              {step === 1 && (
                <form onSubmit={handleNextStep} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Check In</label>
                      <input 
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white p-3 text-sm focus:outline-none focus:border-luxury-gold rounded-sm w-full"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Check Out</label>
                      <input 
                        type="date"
                        required
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white p-3 text-sm focus:outline-none focus:border-luxury-gold rounded-sm w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Guests Count</label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white p-3 text-sm focus:outline-none focus:border-luxury-gold rounded-sm w-full"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-forest-800/10 dark:border-white/5">
                    <label className="text-[10px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Coupon Code</label>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        placeholder="e.g. WELCOME10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white px-3 py-2 text-sm focus:outline-none focus:border-luxury-gold rounded-sm flex-1"
                      />
                      <button 
                        type="button"
                        onClick={verifyCoupon}
                        className="bg-forest-900 hover:bg-forest-800 dark:bg-white/10 dark:hover:bg-white/20 text-white dark:text-luxury-warmwhite border border-transparent dark:border-white/10 px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-sm transition duration-300"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-1.5">{couponError}</p>}
                    {appliedCoupon && (
                      <p className="text-green-600 text-xs mt-1.5 font-semibold flex items-center space-x-1">
                        <Icon name="check" size={12} />
                        <span>Code '{appliedCoupon.code}' applied! ({appliedCoupon.desc})</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-widest text-xs py-3.5 mt-8 rounded-sm shadow-md transition duration-300"
                  >
                    Continue to Details
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleNextStep} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Guest Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter full name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white p-3 text-sm focus:outline-none focus:border-luxury-gold rounded-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. guest@email.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white p-3 text-sm focus:outline-none focus:border-luxury-gold rounded-sm w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="10-digit phone number"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white p-3 text-sm focus:outline-none focus:border-luxury-gold rounded-sm w-full"
                    />
                  </div>

                  <div className="flex space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="border border-forest-800/30 dark:border-white/20 text-slate-850 dark:text-white px-5 py-3 text-xs uppercase tracking-wider font-bold rounded-sm transition duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-widest text-xs py-3 rounded-sm shadow-md transition duration-300"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="md:col-span-5 bg-forest-900 dark:bg-forest-950 text-white p-6 md:p-8 border-l border-forest-800/20 dark:border-white/5 flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-md text-luxury-gold font-bold mb-4 font-semibold">Pricing Breakdown</h4>
                <div className="space-y-3.5 text-sm font-sans">
                  <div className="flex justify-between text-white/70">
                    <span>Rate / Night</span>
                    <span>₹{room.price}</span>
                  </div>
                  <div className="flex justify-between text-white/70 font-semibold">
                    <span>Stay Duration</span>
                    <span>{nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between text-white/70 font-semibold">
                    <span>Base Total</span>
                    <span>₹{pricingDetails.baseTotal}</span>
                  </div>
                  {pricingDetails.discount > 0 && (
                    <div className="flex justify-between text-green-400 text-xs font-semibold">
                      <span>Discount Coupon</span>
                      <span>-₹{pricingDetails.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/70">
                    <span>CGST + SGST (18%)</span>
                    <span>₹{pricingDetails.gst.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold">Total Stay Cost</span>
                  <span className="font-serif text-2xl md:text-3xl text-white font-bold">₹{pricingDetails.totalPrice.toFixed(0)}</span>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed font-light">
                  * Instant receipts will be simulation-forwarded to your email & WhatsApp dashboard. Cancellation policies apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentPortal && (
        <RazorpayModal 
          bookingDetails={generatedBooking}
          onPaymentSuccess={handlePaymentCompleted}
          onPaymentCancel={() => setShowPaymentPortal(false)}
        />
      )}
    </>
  );
};

// 13. Guest Portal / Profile & Wishlist
const GuestPortal = ({ onClose, onViewChange, wishlist = [], toggleWishlist, activeGuest, onLoginGuest, onLogoutGuest }) => {
  const [activeTab, setActiveTab] = React.useState("bookings");
  const [rooms, setRooms] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);

  // Login states
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginName, setLoginName] = React.useState("");
  const [isRegistering, setIsRegistering] = React.useState(false);

  React.useEffect(() => {
    setRooms(window.dbService.getRooms());
    setBookings(window.dbService.getBookings());
  }, [activeGuest]);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;

    if (isRegistering && !loginName) {
      alert("Please provide a name.");
      return;
    }

    const userData = {
      email: loginEmail,
      name: isRegistering ? loginName : (loginEmail.split("@")[0].charAt(0).toUpperCase() + loginEmail.split("@")[0].slice(1)),
      phone: "9876543210"
    };

    onLoginGuest(userData);
  };

  const guestBookings = React.useMemo(() => {
    if (!activeGuest) return [];
    return bookings.filter(b => b.guestEmail.toLowerCase() === activeGuest.email.toLowerCase());
  }, [bookings, activeGuest]);

  const wishlistedRooms = React.useMemo(() => {
    return rooms.filter(r => wishlist.includes(r.id));
  }, [rooms, wishlist]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-luxury-warmwhite dark:bg-forest-950 border border-forest-800/20 dark:border-white/10 rounded-sm w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-forest-900 dark:bg-forest-950 text-white p-6 border-b border-forest-800/20 dark:border-white/5 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Guest Portal</span>
            <h3 className="font-serif text-xl font-bold">
              {activeGuest ? `Welcome, ${activeGuest.name}` : "Access Asherwoods Club"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-luxury-gold transition"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {!activeGuest ? (
          /* Login Screen */
          <div className="p-8 max-w-md mx-auto w-full my-auto flex flex-col justify-center items-center">
            <h4 className="font-serif text-xl text-forest-900 dark:text-luxury-gold font-bold mb-2">
              {isRegistering ? "Register Guest Profile" : "Guest Login"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-luxury-beige/60 mb-6 text-center">
              Sign in to view booking logs, manage cabin wishlists, and unlock member-exclusive gold rates.
            </p>

            <form onSubmit={handleAuthSubmit} className="space-y-4 w-full">
              {isRegistering && (
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Your Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white p-3 text-sm focus:outline-none focus:border-luxury-gold rounded-sm w-full"
                  />
                </div>
              )}
              <div>
                <label className="text-[9px] uppercase tracking-wider text-forest-900 dark:text-luxury-gold block mb-1 font-bold">Email Address</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. guest@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white p-3 text-sm focus:outline-none focus:border-luxury-gold rounded-sm w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-widest text-xs py-3.5 rounded-sm shadow shadow-md transition duration-300"
              >
                {isRegistering ? "Create Profile" : "Sign In"}
              </button>
            </form>

            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-forest-900 dark:text-luxury-gold hover:underline mt-6"
            >
              {isRegistering ? "Already have a profile? Sign In" : "New guest? Create a profile"}
            </button>
          </div>
        ) : (
          /* Profile Details and tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Nav */}
            <div className="bg-forest-900/5 dark:bg-forest-900/20 border-b border-forest-800/10 dark:border-white/5 flex px-4">
              <button 
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                  activeTab === "bookings" ? "border-luxury-gold text-forest-900 dark:text-luxury-gold" : "border-transparent text-slate-400 hover:text-slate-650"
                }`}
              >
                Booking Logs
              </button>
              <button 
                onClick={() => setActiveTab("wishlist")}
                className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                  activeTab === "wishlist" ? "border-luxury-gold text-forest-900 dark:text-luxury-gold" : "border-transparent text-slate-400 hover:text-slate-650"
                }`}
              >
                My Wishlist
              </button>
              <button 
                onClick={onLogoutGuest}
                className="ml-auto px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-red-500 hover:underline"
              >
                Sign Out
              </button>
            </div>

            {/* Tab Pane contents */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "bookings" && (
                <div className="space-y-4">
                  {guestBookings.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Icon name="history" size={32} className="text-slate-400 mx-auto mb-3" />
                      <p className="text-sm">No historical stays or bookings recorded.</p>
                      <button 
                        onClick={() => {
                          onViewChange("rooms");
                          onClose();
                        }}
                        className="text-luxury-gold font-bold text-xs uppercase tracking-wider hover:underline mt-2 block mx-auto"
                      >
                        Explore Cottages
                      </button>
                    </div>
                  ) : (
                    guestBookings.map((b) => (
                      <div key={b.id} className="bg-white dark:bg-forest-900/30 p-5 border border-forest-800/15 dark:border-white/5 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{b.id}</span>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              b.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-forest-800/15 text-forest-900"
                            }`}>{b.status}</span>
                          </div>
                          <h4 className="font-serif text-lg text-forest-900 dark:text-luxury-gold font-bold mt-1.5">{b.roomName}</h4>
                          <p className="text-xs text-slate-500 dark:text-luxury-beige/60 mt-1">
                            Stay: {b.checkIn} to {b.checkOut} ({b.totalNights} {b.totalNights === 1 ? 'Night' : 'Nights'})
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Paid Total</p>
                          <p className="font-sans font-bold text-lg text-forest-900 dark:text-luxury-gold">₹{b.totalPrice.toFixed(0)}</p>
                          <button 
                            onClick={() => alert(`Visualizing booking receipt order ref: ${b.paymentId}`)}
                            className="text-[10px] text-blue-500 font-bold hover:underline mt-1 block"
                          >
                            Receipt details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlistedRooms.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-slate-500">
                      <Icon name="heart" size={32} className="text-slate-400 mx-auto mb-3" />
                      <p className="text-sm">Your cabin wishlist is currently empty.</p>
                    </div>
                  ) : (
                    wishlistedRooms.map((room) => (
                      <div key={room.id} className="bg-white dark:bg-forest-900/30 border border-forest-800/10 dark:border-white/5 rounded-sm overflow-hidden shadow-md relative group flex flex-col h-full">
                        <img src={room.image} className="h-40 w-full object-cover" />
                        <button 
                          onClick={() => toggleWishlist(room.id)}
                          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white hover:text-red-500 transition duration-300"
                        >
                          <Icon name="x" size={12} />
                        </button>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-md font-bold text-forest-900 dark:text-luxury-gold">{room.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-luxury-beige/60 mt-1">{room.occupancy}</p>
                          </div>
                          <div className="border-t border-forest-800/10 dark:border-white/5 pt-3 mt-3 flex justify-between items-center">
                            <span className="font-serif text-md font-bold text-forest-900 dark:text-luxury-gold">₹{room.price}/n</span>
                            <button 
                              onClick={() => {
                                onViewChange("rooms");
                                onClose();
                              }}
                              className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 font-bold uppercase tracking-wider text-[9px] px-3.5 py-1.5 rounded-sm transition duration-300"
                            >
                              Check dates
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 14. Live FAQ AI Chat Assistant Drawer
const ChatAssistant = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { sender: "bot", text: "Greetings! I am Asher, your virtual mountain concierge. How may I guide your luxury stay at Asherwoods today?" }
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  const faqs = [
    { q: "How to reach?", a: "We are located 1.2km from Kasol Market, right beside the Parvati River. Bhuntar (Kullu) Airport is 31km away. We can arrange luxury private cabs from Chandigarh or Delhi." },
    { q: "Is there river access?", a: "Yes! Asherwoods has direct private grass lawn decks right next to the Parvati River boundaries, allowing guests to relax and read to the sound of the rapids." },
    { q: "Pet-friendly policy?", a: "Absolutely! We love pets. We have a dedicated river play yard for dogs. Please let us know during booking so we can arrange pet bedding." },
    { q: "Is Wi-Fi high-speed?", a: "We have dedicated high-speed fiber routers inside every cottage (up to 100 Mbps) to ensure seamless workcations for digital nomads." }
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Formulate response
    setTimeout(() => {
      let reply = "I'm still learning the paths of the mountains! For detailed reservations or queries, please feel free to call our direct reservation desk at +91 98765 43210.";
      
      const cleanText = text.toLowerCase();
      if (cleanText.includes("reach") || cleanText.includes("location") || cleanText.includes("airport") || cleanText.includes("distance")) {
        reply = faqs[0].a;
      } else if (cleanText.includes("river") || cleanText.includes("sound") || cleanText.includes("creek")) {
        reply = faqs[1].a;
      } else if (cleanText.includes("pet") || cleanText.includes("dog") || cleanText.includes("cat")) {
        reply = faqs[2].a;
      } else if (cleanText.includes("wifi") || cleanText.includes("internet") || cleanText.includes("work")) {
        reply = faqs[3].a;
      } else if (cleanText.includes("food") || cleanText.includes("cafe") || cleanText.includes("menu") || cleanText.includes("israeli") || cleanText.includes("veg")) {
        reply = "Our cafe serves gourmet Israeli dishes, wood-fired pizzas, Himachali specials (like Siddu), and organic coffees. We cater to vegetarian, vegan, and gluten-free diets upon request.";
      } else if (cleanText.includes("price") || cleanText.includes("rate") || cleanText.includes("cost") || cleanText.includes("discount")) {
        reply = "Cottage prices start at approximately ₹2500 per night for Mountain View up to ₹4500 for the Family Cottage. Use promo code 'WELCOME10' to get 10% off instantly.";
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-forest-900 hover:bg-forest-800 dark:bg-luxury-gold dark:hover:bg-yellow-600 text-white dark:text-forest-950 p-4 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition duration-300 border border-luxury-gold/20"
      >
        <Icon name={isOpen ? "x" : "message-square"} size={24} />
      </button>

      {/* Chat Box Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-luxury-warmwhite dark:bg-forest-950 border border-forest-800/20 dark:border-white/10 rounded-sm shadow-2xl overflow-hidden flex flex-col h-[450px]">
          {/* Header */}
          <div className="bg-forest-900 p-4 border-b border-forest-800/10 text-white flex items-center space-x-3">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
            <div>
              <h4 className="font-serif font-bold text-sm text-luxury-gold">Asher</h4>
              <p className="text-[9px] uppercase tracking-wider text-luxury-beige/60">Live Resort Concierge</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
            {messages.map((m, i) => (
              <div 
                key={i}
                className={`max-w-[75%] p-3 text-xs leading-relaxed rounded-sm ${
                  m.sender === "bot" 
                    ? "bg-forest-900/10 dark:bg-white/5 text-slate-850 dark:text-luxury-warmwhite self-start" 
                    : "bg-forest-900 text-white self-end"
                }`}
              >
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className="max-w-[50px] p-2 bg-slate-100 dark:bg-white/5 text-slate-400 self-start text-xs rounded animate-pulse">
                ...
              </div>
            )}
          </div>

          {/* Suggested FAQs */}
          <div className="px-4 py-2 border-t border-forest-800/10 dark:border-white/5 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {faqs.map((f, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(f.q)}
                className="text-[9px] bg-forest-900/5 dark:bg-white/5 border border-forest-800/10 dark:border-white/10 hover:border-luxury-gold text-slate-800 dark:text-luxury-beige/80 px-2 py-1.5 rounded-sm transition"
              >
                {f.q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-3 border-t border-forest-800/10 dark:border-white/5 flex space-x-2">
            <input 
              type="text" 
              placeholder="Ask me anything about Asherwoods..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              className="bg-white/80 dark:bg-forest-900/50 border border-forest-800/10 dark:border-white/10 text-slate-800 dark:text-white px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold rounded-sm flex-1"
            />
            <button 
              onClick={() => handleSend(input)}
              className="bg-forest-900 hover:bg-forest-800 dark:bg-luxury-gold text-white dark:text-forest-950 px-3 flex items-center justify-center rounded-sm transition duration-300"
            >
              <Icon name="send" size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 15. Premium Footer
const Footer = ({ onViewChange }) => {
  return (
    <footer className="bg-forest-950 text-white border-t border-forest-900/50 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Col 1 Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl tracking-widest text-luxury-gold font-bold">ASHERWOODS</h3>
            <p className="font-sans text-xs text-luxury-beige/60 leading-relaxed font-light">
              Premium Luxury Resort & Cafe nestled along the banking banks of Parvati River in Kasol, Himachal Pradesh.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-white hover:text-luxury-gold transition"><Icon name="instagram" size={16} /></a>
              <a href="#" className="text-white hover:text-luxury-gold transition"><Icon name="facebook" size={16} /></a>
              <a href="#" className="text-white hover:text-luxury-gold transition"><Icon name="twitter" size={16} /></a>
            </div>
          </div>

          {/* Col 2 Quick Links */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-luxury-gold font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-luxury-beige/70">
              <li><button onClick={() => onViewChange("home")} className="hover:text-luxury-gold transition">Home</button></li>
              <li><button onClick={() => onViewChange("rooms")} className="hover:text-luxury-gold transition">Rooms & Cottages</button></li>
              <li><button onClick={() => onViewChange("cafe")} className="hover:text-luxury-gold transition">Gourmet Cafe</button></li>
              <li><button onClick={() => onViewChange("experiences")} className="hover:text-luxury-gold transition">Curated Experiences</button></li>
            </ul>
          </div>

          {/* Col 3 Policies */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-luxury-gold font-bold mb-4">Policies</h4>
            <ul className="space-y-2 text-xs text-luxury-beige/70">
              <li><button onClick={() => alert("Simulation Refund Policy: Free cancellations up to 72 hours prior to check-in. 50% charge if within 72 hours.")} className="hover:text-luxury-gold transition">Refund Policy</button></li>
              <li><button onClick={() => alert("Simulation Privacy: Guest details are secured internally for booking reference log validation only.")} className="hover:text-luxury-gold transition">Privacy Policy</button></li>
              <li><button onClick={() => alert("Terms & Conditions: Guests must show government identity verification check during resort arrival.")} className="hover:text-luxury-gold transition">Terms & Conditions</button></li>
            </ul>
          </div>

          {/* Col 4 Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-luxury-gold font-bold mb-4 font-semibold">Resort Newsletter</h4>
            <p className="font-sans text-xs text-luxury-beige/60 font-light">
              Subscribe to receive updates about seasonal snowy packages and gourmet offers.
            </p>
            <div className="flex space-x-1.5">
              <input 
                type="email" 
                placeholder="Your email address"
                className="bg-forest-900 border border-white/10 text-white text-xs px-3 py-2 focus:outline-none focus:border-luxury-gold rounded-sm flex-1"
              />
              <button 
                onClick={() => alert("Newsletter subscription recorded! Thank you.")}
                className="bg-luxury-gold hover:bg-yellow-600 text-forest-950 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition duration-300 shadow"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-luxury-beige/40">
          <p>© 2026 Asherwoods Cafe & Cottages. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed in partnership with Antigravity AI.</p>
        </div>
      </div>
    </footer>
  );
};

// Bind to window for global access
window.AsherwoodsComponents = {
  Icon,
  Navbar,
  Hero,
  BookingWidget,
  WhyChooseUs,
  Rooms,
  CafeMenu,
  Experiences,
  Gallery,
  Attractions,
  RazorpayModal,
  BookingModal,
  GuestPortal,
  ChatAssistant,
  Footer
};

