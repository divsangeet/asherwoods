// Asherwoods Cafe & Cottages - TypeScript Types

export interface Room {
  id: string;
  name: string;
  price: number;
  basePrice: number;
  occupancy: string;
  size: string;
  bed: string;
  image: string;
  images: string[];
  description: string;
  amenities: string[];
  featured: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CafeItem {
  id: string;
  category: string;
  name: string;
  price: number;
  desc: string;
  type: "Veg" | "Non-Veg";
  image: string;
}

export interface Review {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
  source: string;
  roomId?: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "flat";
  value: number;
  minNights: number;
  desc: string;
}

export interface Offer {
  id: string;
  title: string;
  desc: string;
  code: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  image: string;
  content: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  basePrice: number;
  totalNights: number;
  discount: number;
  gst: number;
  totalPrice: number;
  couponCode: string;
  status: "Pending" | "Confirmed" | "Checked In" | "Checked Out" | "Cancelled";
  paymentId?: string;
  createdAt: string;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
}

export interface GuestSession {
  email: string;
  name: string;
  phone: string;
}
