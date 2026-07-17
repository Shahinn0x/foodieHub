require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = require("./src/models/user.model");
const foodPartnerModel = require("./src/models/foodpartner.model");
const restaurantModel = require("./src/models/restaurant.model");
const foodModel = require("./src/models/food.model");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB\n");

  await userModel.deleteMany({});
  await foodPartnerModel.deleteMany({});
  await restaurantModel.deleteMany({});
  await foodModel.deleteMany({});
  console.log("Cleared existing data\n");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // ==================== USERS ====================

  const users = [
    {
      fullName: "Shahin Alam",
      email: "user@foodiehub.com",
      password: hashedPassword,
      phone: "9876543210",
      city: "Bangalore",
      address: "42 MG Road, Indiranagar, Bangalore 560038"
    },
    {
      fullName: "Priya Sharma",
      email: "priya@foodiehub.com",
      password: hashedPassword,
      phone: "9123456780",
      city: "Mumbai",
      address: "12/A Linking Road, Bandra West, Mumbai 400050"
    },
    {
      fullName: "Rahul Verma",
      email: "rahul@foodiehub.com",
      password: hashedPassword,
      phone: "9988776655",
      city: "Delhi",
      address: "56 Connaught Place, Block B, New Delhi 110001"
    },
    {
      fullName: "Ananya Patel",
      email: "ananya@foodiehub.com",
      password: hashedPassword,
      phone: "9812345678",
      city: "Bangalore",
      address: "78 Koramangala 5th Block, Bangalore 560095"
    },
    {
      fullName: "Vikram Singh",
      email: "vikram@foodiehub.com",
      password: hashedPassword,
      phone: "9900112233",
      city: "Hyderabad",
      address: "23 Banjara Hills, Road No 2, Hyderabad 500034"
    }
  ];

  for (const u of users) {
    await userModel.create(u);
    console.log(`✅ User: ${u.fullName} (${u.email})`);
  }
  console.log();

  // ==================== ADMIN ====================

  await userModel.create({
    fullName: "Admin",
    email: "admin@foodiehub.com",
    password: hashedPassword,
    phone: "9999999999",
    city: "Bangalore",
    address: "FoodieHub HQ, MG Road, Bangalore 560001"
  });
  console.log("✅ Admin: admin@foodiehub.com / password123\n");

  // ==================== FOOD PARTNERS & RESTAURANTS ====================

  // --- Restaurant 1: Spice Garden (North Indian) ---
  const partner1 = await foodPartnerModel.create({
    name: "Spice Garden",
    contactName: "Ravi Kumar",
    phone: "9876543210",
    address: "42 MG Road, Indiranagar, Bangalore 560038",
    email: "partner@foodiehub.com",
    password: hashedPassword
  });

  const r1 = await restaurantModel.create({
    name: "Spice Garden",
    owner: partner1._id,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    address: "42 MG Road, Indiranagar, Bangalore 560038",
    city: "Bangalore",
    phone: "9876543210",
    category: "North Indian",
    openingTime: "10:00",
    closingTime: "23:00",
    rating: 4.5,
    deliveryTime: "25-35 min",
    isOpen: true
  });

  const r1Menu = [
    { name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken pieces", price: 320, category: "Main Course", isVeg: false, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop" },
    { name: "Paneer Tikka", description: "Char-grilled cottage cheese marinated in yogurt and spices", price: 250, category: "Starters", isVeg: true, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop" },
    { name: "Dal Makhani", description: "Slow-cooked black lentils in rich creamy gravy", price: 200, category: "Main Course", isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
    { name: "Naan Butter", description: "Soft leavened bread brushed with butter, baked in tandoor", price: 45, category: "Breads", isVeg: true, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop" },
    { name: "Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken and saffron", price: 280, category: "Rice", isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop" },
    { name: "Gulab Jamun", description: "Deep-fried milk dumplings soaked in rose-scented sugar syrup", price: 120, category: "Desserts", isVeg: true, image: "https://images.unsplash.com/photo-1666190050265-ee921b0dda84?w=400&h=300&fit=crop" },
    { name: "Masala Dosa", description: "Crispy golden rice crepe filled with spiced potato masala", price: 160, category: "South Indian", isVeg: true, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop" },
    { name: "Mango Lassi", description: "Creamy yogurt drink blended with ripe Alphonso mango", price: 90, category: "Beverages", isVeg: true, image: "https://images.unsplash.com/photo-1626208718944-1139d3c3fb51?w=400&h=300&fit=crop" },
    { name: "Tandoori Chicken", description: "Whole chicken marinated in yogurt and spices, cooked in clay oven", price: 350, category: "Starters", isVeg: false, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Palak Paneer", description: "Cottage cheese cubes simmered in creamy spinach gravy", price: 230, category: "Main Course", isVeg: true, image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=400&h=300&fit=crop" },
  ];

  for (const item of r1Menu) {
    await foodModel.create({ ...item, restaurant: r1._id });
  }
  console.log(`✅ ${r1.name} — ${r1Menu.length} items | partner@foodiehub.com / password123\n`);

  // --- Restaurant 2: Pizza Planet (Italian) ---
  const partner2 = await foodPartnerModel.create({
    name: "Pizza Planet",
    contactName: "John D'Costa",
    phone: "9988776655",
    address: "15 Church Street, MG Road, Bangalore 560001",
    email: "partner2@foodiehub.com",
    password: hashedPassword
  });

  const r2 = await restaurantModel.create({
    name: "Pizza Planet",
    owner: partner2._id,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    address: "15 Church Street, MG Road, Bangalore 560001",
    city: "Bangalore",
    phone: "9988776655",
    category: "Italian",
    openingTime: "11:00",
    closingTime: "23:00",
    rating: 4.2,
    deliveryTime: "20-30 min",
    isOpen: true
  });

  const r2Menu = [
    { name: "Margherita Pizza", description: "Classic San Marzano tomato, fresh mozzarella, and basil", price: 299, category: "Pizza", isVeg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop" },
    { name: "Pepperoni Pizza", description: "Loaded with spicy pepperoni and melted mozzarella cheese", price: 399, category: "Pizza", isVeg: false, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
    { name: "Garlic Bread", description: "Toasted ciabatta with garlic butter, herbs, and parmesan", price: 149, category: "Starters", isVeg: true, image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&h=300&fit=crop" },
    { name: "Pasta Alfredo", description: "Fettuccine in creamy white sauce with sautéed mushrooms", price: 259, category: "Pasta", isVeg: true, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop" },
    { name: "BBQ Chicken Pizza", description: "Grilled chicken, BBQ sauce, red onions, and smoked cheese", price: 449, category: "Pizza", isVeg: false, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
    { name: "Tiramisu", description: "Classic Italian dessert with espresso-soaked ladyfingers", price: 199, category: "Desserts", isVeg: true, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
    { name: "Cold Coffee", description: "Chilled coffee blended with vanilla ice cream", price: 149, category: "Beverages", isVeg: true, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop" },
    { name: "Bruschetta", description: "Toasted bread topped with fresh tomatoes, basil, and balsamic", price: 179, category: "Starters", isVeg: true, image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop" },
    { name: "Penne Arrabiata", description: "Penne pasta in spicy tomato sauce with garlic and chili", price: 239, category: "Pasta", isVeg: true, image: "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?w=400&h=300&fit=crop" },
    { name: "Caesar Salad", description: "Crisp romaine lettuce with parmesan, croutons, and Caesar dressing", price: 189, category: "Salads", isVeg: true, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop" },
  ];

  for (const item of r2Menu) {
    await foodModel.create({ ...item, restaurant: r2._id });
  }
  console.log(`✅ ${r2.name} — ${r2Menu.length} items | partner2@foodiehub.com / password123\n`);

  // --- Restaurant 3: Dragon Wok (Chinese) ---
  const partner3 = await foodPartnerModel.create({
    name: "Dragon Wok",
    contactName: "Lee Wei",
    phone: "9011223344",
    address: "88 Brigade Road, Bangalore 560025",
    email: "partner3@foodiehub.com",
    password: hashedPassword
  });

  const r3 = await restaurantModel.create({
    name: "Dragon Wok",
    owner: partner3._id,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
    address: "88 Brigade Road, Bangalore 560025",
    city: "Bangalore",
    phone: "9011223344",
    category: "Chinese",
    openingTime: "11:30",
    closingTime: "22:30",
    rating: 4.3,
    deliveryTime: "20-30 min",
    isOpen: true
  });

  const r3Menu = [
    { name: "Kung Pao Chicken", description: "Stir-fried chicken with peanuts, chili, and vegetables", price: 280, category: "Main Course", isVeg: false, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop" },
    { name: "Veg Hakka Noodles", description: "Wok-tossed noodles with crunchy vegetables and soy sauce", price: 180, category: "Noodles", isVeg: true, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop" },
    { name: "Chicken Manchurian", description: "Crispy chicken balls in spicy, tangy Manchurian gravy", price: 260, category: "Starters", isVeg: false, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop" },
    { name: "Spring Rolls", description: "Crispy golden rolls stuffed with vegetables, served with chili dip", price: 160, category: "Starters", isVeg: true, image: "https://images.unsplash.com/photo-1606525437819-1e07da572797?w=400&h=300&fit=crop" },
    { name: "Fried Rice", description: "Wok-fried rice with egg, vegetables, and aromatic soy", price: 200, category: "Rice", isVeg: false, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { name: "Dim Sum Basket", description: "Assorted steamed dumplings with chili oil and soy dip", price: 320, category: "Starters", isVeg: false, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop" },
    { name: "Hot & Sour Soup", description: "Spicy, tangy soup with tofu, mushrooms, and bamboo shoots", price: 140, category: "Soups", isVeg: true, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop" },
    { name: "Chilli Paneer", description: "Crispy paneer cubes tossed in spicy soy-chili sauce", price: 240, category: "Starters", isVeg: true, image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop" },
  ];

  for (const item of r3Menu) {
    await foodModel.create({ ...item, restaurant: r3._id });
  }
  console.log(`✅ ${r3.name} — ${r3Menu.length} items | partner3@foodiehub.com / password123\n`);

  // --- Restaurant 4: Tandoori Flames (Mughlai) ---
  const partner4 = await foodPartnerModel.create({
    name: "Tandoori Flames",
    contactName: "Ahmed Khan",
    phone: "8884445555",
    address: "33 JP Nagar, Bangalore 560078",
    email: "partner4@foodiehub.com",
    password: hashedPassword
  });

  const r4 = await restaurantModel.create({
    name: "Tandoori Flames",
    owner: partner4._id,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    address: "33 JP Nagar, Bangalore 560078",
    city: "Bangalore",
    phone: "8884445555",
    category: "Mughlai",
    openingTime: "12:00",
    closingTime: "23:30",
    rating: 4.6,
    deliveryTime: "30-40 min",
    isOpen: true
  });

  const r4Menu = [
    { name: "Mutton Rogan Josh", description: "Slow-cooked lamb in aromatic Kashmiri spice gravy", price: 380, category: "Main Course", isVeg: false, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop" },
    { name: "Chicken Tikka", description: "Boneless chicken chunks marinated and grilled in tandoor", price: 290, category: "Starters", isVeg: false, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop" },
    { name: "Veg Dum Biryani", description: "Slow-cooked basmati rice with vegetables, saffron, and dry fruits", price: 240, category: "Rice", isVeg: true, image: "https://images.unsplash.com/photo-1630851840633-f96999247032?w=400&h=300&fit=crop" },
    { name: "Seekh Kebab", description: "Minced lamb skewers with herbs, grilled to perfection", price: 320, category: "Starters", isVeg: false, image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop" },
    { name: "Shahi Tukda", description: "Fried bread pudding with reduced milk, nuts, and saffron", price: 160, category: "Desserts", isVeg: true, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
    { name: "Roomali Roti", description: "Paper-thin hand-stretched flatbread cooked on inverted griddle", price: 40, category: "Breads", isVeg: true, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop" },
    { name: "Chicken Korma", description: "Mild, creamy curry with tender chicken and ground cashews", price: 310, category: "Main Course", isVeg: false, image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop" },
    { name: "Jaljeera", description: "Tangy cumin-spiced refreshment drink — perfect palate cleanser", price: 70, category: "Beverages", isVeg: true, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop" },
  ];

  for (const item of r4Menu) {
    await foodModel.create({ ...item, restaurant: r4._id });
  }
  console.log(`✅ ${r4.name} — ${r4Menu.length} items | partner4@foodiehub.com / password123\n`);

  console.log("=".repeat(55));
  console.log("🌱 SEED COMPLETE");
  console.log("=".repeat(55));
  console.log(`   ${users.length} users + 1 admin`);
  console.log(`   4 partners → 4 restaurants`);
  console.log(`   ${r1Menu.length + r2Menu.length + r3Menu.length + r4Menu.length} total menu items`);
  console.log();

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
