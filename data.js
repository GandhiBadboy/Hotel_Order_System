/* =============================================
   Gandhi Hotel — Data Layer
   Menyimpan data kamar & pemesanan di localStorage
   browser, dipakai bersama oleh halaman publik
   (index, kamar, booking, konfirmasi) dan admin.html
   ============================================= */

const GH_ROOMS_KEY = 'gh_rooms';
const GH_BOOKINGS_KEY = 'gh_bookings';
const GH_AUTH_KEY = 'gh_admin_auth';

const GHData = (function () {

  const defaultRooms = [
    {
      id: 'room-1',
      nama: 'Deluxe Sawah View',
      tag: 'Terlaris',
      luas: 28,
      kapasitas: 2,
      fasilitas: ['Wifi', 'AC', 'Sarapan', 'Balkon'],
      harga: 850000,
      gambar: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&q=80',
      status: 'aktif'
    },
    {
      id: 'room-2',
      nama: 'Suite Kolam Pribadi',
      tag: 'Favorit Pasangan',
      luas: 42,
      kapasitas: 2,
      fasilitas: ['Wifi', 'AC', 'Sarapan', 'Kolam Privat', 'Bathtub'],
      harga: 1450000,
      gambar: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&q=80',
      status: 'aktif'
    },
    {
      id: 'room-3',
      nama: 'Villa Keluarga',
      tag: 'Untuk Keluarga',
      luas: 65,
      kapasitas: 4,
      fasilitas: ['Wifi', 'AC', 'Sarapan', 'Dapur Kecil', 'Ruang Tamu'],
      harga: 2100000,
      gambar: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=80',
      status: 'aktif'
    },
    {
      id: 'room-4',
      nama: 'Superior Taman',
      tag: 'Hemat',
      luas: 22,
      kapasitas: 2,
      fasilitas: ['Wifi', 'AC', 'Sarapan'],
      harga: 600000,
      gambar: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80',
      status: 'aktif'
    }
  ];

  function safeParse(str, fallback) {
    try {
      const val = JSON.parse(str);
      return val === null || val === undefined ? fallback : val;
    } catch (e) {
      return fallback;
    }
  }

  function init() {
    if (!localStorage.getItem(GH_ROOMS_KEY)) {
      localStorage.setItem(GH_ROOMS_KEY, JSON.stringify(defaultRooms));
    }
    if (!localStorage.getItem(GH_BOOKINGS_KEY)) {
      localStorage.setItem(GH_BOOKINGS_KEY, JSON.stringify([]));
    }
  }

  function getRooms() {
    init();
    return safeParse(localStorage.getItem(GH_ROOMS_KEY), []);
  }

  function saveRooms(rooms) {
    localStorage.setItem(GH_ROOMS_KEY, JSON.stringify(rooms));
  }

  function getActiveRooms() {
    return getRooms().filter(r => r.status === 'aktif');
  }

  function getRoomById(id) {
    return getRooms().find(r => r.id === id) || null;
  }

  function upsertRoom(room) {
    const rooms = getRooms();
    const idx = rooms.findIndex(r => r.id === room.id);
    if (idx >= 0) {
      rooms[idx] = room;
    } else {
      rooms.push(room);
    }
    saveRooms(rooms);
    return room;
  }

  function deleteRoom(id) {
    const rooms = getRooms().filter(r => r.id !== id);
    saveRooms(rooms);
  }

  function getBookings() {
    init();
    return safeParse(localStorage.getItem(GH_BOOKINGS_KEY), []);
  }

  function saveBookings(bookings) {
    localStorage.setItem(GH_BOOKINGS_KEY, JSON.stringify(bookings));
  }

  function generateKode() {
    return 'GH-' + Math.floor(100000 + Math.random() * 900000);
  }

  function addBooking(booking) {
    const bookings = getBookings();
    booking.kode = generateKode();
    booking.status = 'Menunggu Konfirmasi';
    booking.createdAt = new Date().toISOString();
    bookings.unshift(booking);
    saveBookings(bookings);
    return booking;
  }

  function getBookingByKode(kode) {
    return getBookings().find(b => b.kode === kode) || null;
  }

  function updateBookingStatus(kode, status) {
    const bookings = getBookings();
    const idx = bookings.findIndex(b => b.kode === kode);
    if (idx >= 0) {
      bookings[idx].status = status;
      saveBookings(bookings);
    }
  }

  function deleteBooking(kode) {
    const bookings = getBookings().filter(b => b.kode !== kode);
    saveBookings(bookings);
  }

  function formatRupiah(n) {
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
  }

  // ---- Auth sederhana untuk admin ----
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'gandhi123';

  function login(user, pass) {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(GH_AUTH_KEY, '1');
      return true;
    }
    return false;
  }

  function isLoggedIn() {
    return sessionStorage.getItem(GH_AUTH_KEY) === '1';
  }

  function logout() {
    sessionStorage.removeItem(GH_AUTH_KEY);
  }

  return {
    getRooms, saveRooms, getActiveRooms, getRoomById, upsertRoom, deleteRoom,
    getBookings, saveBookings, addBooking, getBookingByKode, updateBookingStatus, deleteBooking,
    formatRupiah, login, isLoggedIn, logout, generateKode
  };

})();
