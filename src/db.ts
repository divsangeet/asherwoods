// Asherwoods Cafe & Cottages - Database Service
import { Room, CafeItem, Review, Coupon, Offer, BlogPost, Booking } from './types';

const INITIAL_ROOMS: Room[] = [
  {
    id: "mountain-view",
    name: "Mountain View Cottage",
    price: 2500,
    basePrice: 2500,
    occupancy: "2 Guests",
    size: "280 sq ft",
    bed: "Queen Size",
    image: "/mountain-view.jpg",
    images: [
      "/mountain-view.jpg",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Nestled amidst towering deodar trees, the Mountain View Cottage offers a perfect blend of rustic wooden aesthetics and modern comfort. Wake up to the sight of mist rising over the snow-capped Himalayan peaks.",
    amenities: ["Mountain View", "Private Balcony", "Free Wi-Fi", "Heater", "Tea/Coffee Maker", "Premium Linens"],
    featured: true,
    rating: 4.8,
    reviewsCount: 34
  },
  {
    id: "luxury-wooden",
    name: "Luxury Wooden Cottage",
    price: 3500,
    basePrice: 3500,
    occupancy: "3 Guests",
    size: "350 sq ft",
    bed: "King Size + Sofa Bed",
    image: "/luxury-wooden.jpg",
    images: [
      "/luxury-wooden.jpg",
      "https://images.unsplash.com/photo-1611891487122-2075b9624448?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507038772120-7bef2c145e52?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Crafted entirely from local cedarwood, this cottage offers a spacious layout, premium glass facade, fireplace simulation, and a luxury bathtub. Ideal for those who wish to experience Kasol in ultimate style.",
    amenities: ["Forest View", "Bathtub", "Electric Fireplace", "Private Balcony", "Mini Bar", "Dedicated Workspace"],
    featured: true,
    rating: 4.9,
    reviewsCount: 48
  },
  {
    id: "deluxe-riverside",
    name: "Deluxe Riverside Cottage",
    price: 3200,
    basePrice: 3200,
    occupancy: "2 Guests",
    size: "310 sq ft",
    bed: "King Size",
    image: "/deluxe-riverside.jpg",
    images: [
      "/deluxe-riverside.jpg",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Located just steps away from the gushing waters of the Parvati River, this cottage allows you to sleep to the soothing sound of the rapids. Features an outdoor glass deck right above the water boundaries.",
    amenities: ["River Access", "Glass Deck", "Free Wi-Fi", "Hammock", "Heater", "Bluetooth Speakers"],
    featured: true,
    rating: 4.9,
    reviewsCount: 52
  },
  {
    id: "family-cottage",
    name: "Family Cottage",
    price: 4500,
    basePrice: 4500,
    occupancy: "5 Guests",
    size: "520 sq ft",
    bed: "2 Double Beds + 1 Single Bed",
    image: "/family-cottage.jpg",
    images: [
      "/family-cottage.jpg",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    description: "A split-level wooden villa perfect for families and small groups. Features a glass ceiling panel in the master bedroom for night stargazing, a large living room, and direct yard access for bonfire sessions.",
    amenities: ["Stargazing Ceiling", "Living Room", "Microwave", "Private Yard", "2 Bathrooms", "Smart TV"],
    featured: false,
    rating: 4.7,
    reviewsCount: 29
  }
];

const INITIAL_CAFE_ITEMS: CafeItem[] = [
  { id: "c1", category: "Coffee", name: "Asherwoods Special Latte", price: 190, desc: "Double shot espresso with steamed milk, walnut extract, and a pinch of cinnamon.", type: "Veg", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80" },
  { id: "c2", category: "Coffee", name: "Himachali Honey Cappuccino", price: 180, desc: "Classic cappuccino sweetened with organic local forest honey.", type: "Veg", image: "https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&w=400&q=80" },
  { id: "c3", category: "Coffee", name: "French Press Mountain Brew", price: 160, desc: "Single-origin Arabica beans sourced from organic estates, freshly pressed.", type: "Veg", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80" },
  { id: "i1", category: "Israeli Food", name: "Premium Shakshuka", price: 320, desc: "Poached eggs in a rich, spiced tomato and bell pepper sauce, served with warm pita bread.", type: "Non-Veg", image: "https://images.unsplash.com/photo-1590412200988-a436bb705300?auto=format&fit=crop&w=400&q=80" },
  { id: "i2", category: "Israeli Food", name: "Asherwoods Hummus Platter", price: 290, desc: "Creamy homemade hummus topped with warm olive oil, chickpeas, and warm pita bread.", type: "Veg", image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80" },
  { id: "i3", category: "Israeli Food", name: "Falafel Laffa Wrap", price: 240, desc: "Crispy falafel balls rolled in fresh flatbread with tahini, salad, and amba sauce.", type: "Veg", image: "https://images.unsplash.com/photo-1547058881-aa0edd92aab3?auto=format&fit=crop&w=400&q=80" },
  { id: "b1", category: "Breakfast", name: "Mountain Hiker's Platter", price: 350, desc: "Two eggs your style, baked beans, grilled tomatoes, hash browns, chicken sausages, and butter toast.", type: "Non-Veg", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80" },
  { id: "b2", category: "Breakfast", name: "Avocado & Goat Cheese Toast", price: 280, desc: "Mashed avocado, crumbled local goat cheese, cherry tomatoes on sourdough bread.", type: "Veg", image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80" },
  { id: "p1", category: "Pizza", name: "Wild Mushroom & Truffle Pizza", price: 420, desc: "Hand-tossed thin crust, wild Himalayan mushrooms, white truffle oil, fresh mozzarella.", type: "Veg", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80" },
  { id: "p2", category: "Pasta", name: "Pesto Genovese Penne", price: 340, desc: "Penne tossed in creamy fresh basil and pine nut pesto with extra virgin olive oil.", type: "Veg", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80" },
  { id: "bu1", category: "Burgers", name: "Paneer Chimichurri Burger", price: 260, desc: "Crispy paneer patty, chimichurri mayo, lettuce, tomato in brioche bun.", type: "Veg", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
  { id: "d1", category: "Desserts", name: "Apple Pie with Ice Cream", price: 220, desc: "Traditional pie stuffed with local Himachali apples, served with vanilla bean ice cream.", type: "Veg", image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80" },
  { id: "h1", category: "Himachali Specials", name: "Siddu with Ghee & Honey", price: 180, desc: "Traditional steamed wheat bun stuffed with poppy seed paste, served hot with liquid ghee.", type: "Veg", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400&q=80" }
];

const INITIAL_REVIEWS: Review[] = [
  { id: "r1", guestName: "Aarav Sharma", rating: 5, date: "2026-06-15", text: "Absolute heaven! The riverside cottage allows you to fall asleep to the river sound. The cafe serves the best Israeli food in Kasol.", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80", source: "Google Reviews" },
  { id: "r2", guestName: "Sarah Jenkins", rating: 5, date: "2026-07-02", text: "Beautiful wooden cottages with stunning views of the valley. Exceptional hospitality and the honeycomb cappuccino is a must-try!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", source: "Booking.com" },
  { id: "r3", guestName: "Vikram Malhotra", rating: 5, date: "2026-07-08", text: "Top-notch luxury resort experience. The bonfire nights and nature walks organized by them were memorable. Highly recommended.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", source: "Google Reviews" }
];

const INITIAL_COUPONS: Coupon[] = [
  { code: "WELCOME10", discountType: "percentage", value: 10, minNights: 1, desc: "Get 10% off on any stay duration." },
  { code: "WINTER20", discountType: "percentage", value: 20, minNights: 3, desc: "Stay 3 nights or more and get 20% off." },
  { code: "RIVERSIDE", discountType: "flat", value: 1000, minNights: 2, desc: "Flat ₹1000 off on minimum 2 nights stay." }
];

const INITIAL_OFFERS: Offer[] = [
  { id: "o1", title: "Monsoon Serenity Package", desc: "Enjoy 15% off plus a complimentary Himachali Siddu platter and local apple cider upon arrival. Valid for stays until Sept 30.", code: "MONSOON15" },
  { id: "o2", title: "Workcation Long Stay Offer", desc: "Book for 7+ days and receive high-speed dedicated router access and daily complimentary espresso.", code: "WORK7" }
];

const INITIAL_BLOGS: BlogPost[] = [
  { id: "b1", title: "Top 5 Treks Around Kasol: A Guide for Adventure Lovers", date: "2026-05-12", excerpt: "Kasol is the gateway to some of the most breath-taking trekking trails in the Himalayas. From the hot springs of Kheerganga to the ancient independent village of Malana...", author: "Resort Naturalist", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", content: "Details about treks..." },
  { id: "b2", title: "Savoring Siddu: The Culinary Soul of Himachal Pradesh", date: "2026-06-20", excerpt: "Siddu is more than just food; it is a tradition passed down through generations in Himachali families. Learn how we make Siddu at our cafe using local herbs and fresh ghee...", author: "Head Chef, Asherwoods", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80", content: "Details about Siddu..." }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-98472",
    roomId: "luxury-wooden",
    roomName: "Luxury Wooden Cottage",
    guestName: "Rajesh Kumar",
    guestEmail: "rajesh.k@gmail.com",
    guestPhone: "9876543211",
    checkIn: "2026-07-12",
    checkOut: "2026-07-15",
    guestsCount: 2,
    basePrice: 3500,
    totalNights: 3,
    discount: 2100,
    gst: 1512,
    totalPrice: 9912,
    couponCode: "WINTER20",
    status: "Confirmed",
    paymentId: "pay_xyz789",
    createdAt: "2026-07-09T14:30:00Z"
  },
  {
    id: "BK-43289",
    roomId: "mountain-view",
    roomName: "Mountain View Cottage",
    guestName: "Emma Watson",
    guestEmail: "emma.w@gmail.com",
    guestPhone: "9123456780",
    checkIn: "2026-07-20",
    checkOut: "2026-07-22",
    guestsCount: 1,
    basePrice: 2500,
    totalNights: 2,
    discount: 500,
    gst: 810,
    totalPrice: 5310,
    couponCode: "WELCOME10",
    status: "Checked In",
    paymentId: "pay_abc123",
    createdAt: "2026-07-08T09:15:00Z"
  }
];

class DatabaseService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("ash_rooms")) {
      localStorage.setItem("ash_rooms", JSON.stringify(INITIAL_ROOMS));
    }
    if (!localStorage.getItem("ash_cafe")) {
      localStorage.setItem("ash_cafe", JSON.stringify(INITIAL_CAFE_ITEMS));
    }
    if (!localStorage.getItem("ash_reviews")) {
      localStorage.setItem("ash_reviews", JSON.stringify(INITIAL_REVIEWS));
    }
    if (!localStorage.getItem("ash_coupons")) {
      localStorage.setItem("ash_coupons", JSON.stringify(INITIAL_COUPONS));
    }
    if (!localStorage.getItem("ash_offers")) {
      localStorage.setItem("ash_offers", JSON.stringify(INITIAL_OFFERS));
    }
    if (!localStorage.getItem("ash_blogs")) {
      localStorage.setItem("ash_blogs", JSON.stringify(INITIAL_BLOGS));
    }
    if (!localStorage.getItem("ash_bookings")) {
      localStorage.setItem("ash_bookings", JSON.stringify(INITIAL_BOOKINGS));
    }
  }

  getRooms(): Room[] {
    return JSON.parse(localStorage.getItem("ash_rooms") || "[]");
  }
  
  getCafeItems(): CafeItem[] {
    return JSON.parse(localStorage.getItem("ash_cafe") || "[]");
  }

  getReviews(): Review[] {
    return JSON.parse(localStorage.getItem("ash_reviews") || "[]");
  }

  getCoupons(): Coupon[] {
    return JSON.parse(localStorage.getItem("ash_coupons") || "[]");
  }

  getOffers(): Offer[] {
    return JSON.parse(localStorage.getItem("ash_offers") || "[]");
  }

  getBlogs(): BlogPost[] {
    return JSON.parse(localStorage.getItem("ash_blogs") || "[]");
  }

  getBookings(): Booking[] {
    return JSON.parse(localStorage.getItem("ash_bookings") || "[]");
  }

  saveRooms(rooms: Room[]) {
    localStorage.setItem("ash_rooms", JSON.stringify(rooms));
  }

  saveCafeItems(items: CafeItem[]) {
    localStorage.setItem("ash_cafe", JSON.stringify(items));
  }

  saveBookings(bookings: Booking[]) {
    localStorage.setItem("ash_bookings", JSON.stringify(bookings));
  }

  saveReviews(reviews: Review[]) {
    localStorage.setItem("ash_reviews", JSON.stringify(reviews));
  }

  saveCoupons(coupons: Coupon[]) {
    localStorage.setItem("ash_coupons", JSON.stringify(coupons));
  }

  saveOffers(offers: Offer[]) {
    localStorage.setItem("ash_offers", JSON.stringify(offers));
  }

  saveBlogs(blogs: BlogPost[]) {
    localStorage.setItem("ash_blogs", JSON.stringify(blogs));
  }

  addBooking(booking: Booking): Booking {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.saveBookings(bookings);
    return booking;
  }

  updateBookingStatus(id: string, status: Booking["status"]) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index].status = status;
      this.saveBookings(bookings);
    }
  }

  updateRoomPrice(id: string, newPrice: number) {
    const rooms = this.getRooms();
    const index = rooms.findIndex(r => r.id === id);
    if (index !== -1) {
      rooms[index].price = Number(newPrice);
      this.saveRooms(rooms);
    }
  }

  addReview(review: Partial<Review> & { guestName: string; rating: number; text: string }) {
    const reviews = this.getReviews();
    const newRev: Review = {
      id: "r_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      source: "Guest Website Review",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      guestName: review.guestName,
      rating: review.rating,
      text: review.text,
      roomId: review.roomId
    };
    reviews.unshift(newRev);
    this.saveReviews(reviews);
    
    if (review.roomId) {
      const rooms = this.getRooms();
      const rIdx = rooms.findIndex(r => r.id === review.roomId);
      if (rIdx !== -1) {
        const roomReviews = reviews.filter(rev => rev.roomId === review.roomId);
        const totalRating = roomReviews.reduce((sum, rev) => sum + rev.rating, 0);
        rooms[rIdx].rating = Number((totalRating / roomReviews.length).toFixed(1));
        rooms[rIdx].reviewsCount += 1;
        this.saveRooms(rooms);
      }
    }
  }
}

export const dbService = new DatabaseService();
