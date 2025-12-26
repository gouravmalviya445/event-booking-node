import { Event } from "../models/eventModel";

const events = [
  {
    title: "Tech Innovators Summit 2024",
    description: "Annual conference featuring tech leaders and groundbreaking innovations",
    location: "San Francisco Convention Center",
    date: new Date("2024-06-15T09:00:00"),
    price: 299,
    totalSeats: 1000,
    availableSeats: 245,
    status: "active",
    category: "tech",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Marathon City Run",
    description: "Annual city marathon supporting local charities",
    location: "Central Park, New York",
    date: new Date("2024-05-20T07:00:00"),
    price: 45,
    totalSeats: 5000,
    availableSeats: 1250,
    status: "active",
    category: "sport",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd8facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80"
  },
  {
    title: "Jazz & Blues Festival",
    description: "Weekend festival with local and international jazz artists",
    location: "Grant Park, Chicago",
    date: new Date("2024-07-12T14:00:00"),
    price: 89,
    totalSeats: 8000,
    availableSeats: 1200,
    status: "active",
    category: "music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Startup Investment Forum",
    description: "Connect with investors and pitch your startup ideas",
    location: "London Business Hub",
    date: new Date("2024-08-05T10:30:00"),
    price: 149,
    totalSeats: 300,
    availableSeats: 87,
    status: "active",
    category: "business",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Modern Art Exhibition",
    description: "Featuring contemporary artists from around the world",
    location: "Tate Modern, London",
    date: new Date("2024-09-22T11:00:00"),
    price: 25,
    totalSeats: 200,
    availableSeats: 45,
    status: "active",
    category: "art",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Wellness Retreat",
    description: "Mindfulness and yoga retreat in the mountains",
    location: "Aspen Retreat Center",
    date: new Date("2024-08-30T08:00:00"),
    price: 349,
    totalSeats: 50,
    availableSeats: 12,
    status: "active",
    category: "health",
    image: "https://images.unsplash.com/photo-1577223625816-71c9c7d2c88c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Local Food Festival",
    description: "Taste local cuisines from various vendors and chefs",
    location: "Downtown Market Square",
    date: new Date("2024-06-08T12:00:00"),
    price: 15,
    totalSeats: 2000,
    availableSeats: 650,
    status: "active",
    category: "other",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Champions League Watch Party",
    description: "Watch the final on giant screens with fellow fans",
    location: "Sports Arena, Berlin",
    date: new Date("2024-06-01T19:00:00"),
    price: 20,
    totalSeats: 1500,
    availableSeats: 320,
    status: "active",
    category: "sport",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Blockchain & Crypto Conference",
    description: "Exploring the future of blockchain and cryptocurrency",
    location: "Singapore Expo",
    date: new Date("2024-10-10T09:00:00"),
    price: 399,
    totalSeats: 800,
    availableSeats: 210,
    status: "active",
    category: "tech",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Symphony Orchestra Performance",
    description: "Beethoven's 9th Symphony by the National Orchestra",
    location: "Royal Albert Hall, London",
    date: new Date("2024-11-15T19:30:00"),
    price: 75,
    totalSeats: 1200,
    availableSeats: 180,
    status: "active",
    category: "music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Basketball Championship Finals",
    description: "National basketball championship finals",
    location: "Madison Square Garden, NY",
    date: new Date("2024-07-05T18:00:00"),
    price: 120,
    totalSeats: 18000,
    availableSeats: 2400,
    status: "active",
    category: "sport",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Digital Marketing Workshop",
    description: "Learn advanced digital marketing strategies",
    location: "Online & Seattle Conference Center",
    date: new Date("2024-07-22T10:00:00"),
    price: 199,
    totalSeats: 150,
    availableSeats: 42,
    status: "active",
    category: "business",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

async function seedDummyEvents() {
  await Event.insertMany(events);
}
 
export {
  seedDummyEvents
}