// Komentar: Data produk yang tersedia (harus sama dengan di HTML)
const products = [
    { name: '911 Carrera S', price: '150,000' },
    { name: '911 Turbo S', price: '250,000' },
    { name: '911 GT3', price: '190,000' }
];

// Komentar: Ambil elemen-elemen penting dari DOM
const navToggle = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const addButtons = document.querySelectorAll('.product-card .secondary-btn');
const garageToggleBtn = document.getElementById('garage-toggle');
const carGarage = document.getElementById('car-garage');
const garageList = document.getElementById('garage-list');
const emptyGarageMessage = document.getElementById('empty-garage');

// Komentar: Inisialisasi garasi dari localStorage atau array kosong
let garage = JSON.parse(localStorage.getItem('porscheGarage')) || [];

/* ========================================= */
/* 1. FUNGSI NAVIGASI MOBILE (BURGER MENU)   */
/* ========================================= */
navToggle.addEventListener('click', () => {
    // Toggle class untuk menampilkan/menyembunyikan menu
    navLinks.classList.toggle('nav-active');
    // Toggle class untuk animasi ikon burger
    navToggle.classList.toggle('toggle');
    // Tutup garasi jika menu dibuka
    if (carGarage.classList.contains('open')) {
        carGarage.classList.remove('open');
    }
});

/* ========================================= */
/* 2. FUNGSI GARASI (ADD & TOGGLE)           */
/* ========================================= */

// Komentar: Fungsi untuk menampilkan item di garasi
function updateGarageDisplay() {
    garageList.innerHTML = ''; // Kosongkan daftar saat ini
    
    if (garage.length === 0) {
        emptyGarageMessage.style.display = 'block';
    } else {
        emptyGarageMessage.style.display = 'none';
        
        garage.forEach((car, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${car.name}</span>
                <span>$${car.price} USD 
                    <button class="remove-car" data-index="${index}"><i class="fas fa-times-circle"></i></button>
                </span>
            `;
            garageList.appendChild(listItem);
        });
    }

    // Komentar: Pasang listener untuk tombol hapus setelah item dibuat
    document.querySelectorAll('.remove-car').forEach(button => {
        button.addEventListener('click', removeCarFromGarage);
    });

    // Komentar: Simpan data garasi ke localStorage
    localStorage.setItem('porscheGarage', JSON.stringify(garage));
}

// Komentar: Fungsi untuk menambah mobil ke garasi
function addCarToGarage(event) {
    const carName = event.target.dataset.name;
    const carPrice = event.target.dataset.price;

    const newCar = {
        name: carName,
        price: carPrice
    };

    // Komentar: Batasan sederhana agar tidak ada duplikasi mobil yang sama persis
    const isDuplicate = garage.some(car => car.name === newCar.name);

    if (!isDuplicate) {
        garage.push(newCar);
        updateGarageDisplay();
        alert(`Porsche ${carName} has been added to your Garage!`);
    } else {
        alert(`Porsche ${carName} is already in your Garage.`);
    }

    // Komentar: Buka garasi setelah ditambahkan (opsional)
    carGarage.classList.add('open');
}

// Komentar: Fungsi untuk menghapus mobil dari garasi
function removeCarFromGarage(event) {
    const indexToRemove = event.currentTarget.dataset.index;
    garage.splice(indexToRemove, 1); // Hapus 1 item di index tersebut
    updateGarageDisplay();
    alert('Model removed from your Garage.');
}

// Komentar: Toggle buka/tutup garasi saat tombol di header diklik
garageToggleBtn.addEventListener('click', () => {
    carGarage.classList.toggle('open');
    // Tutup menu mobile jika garasi dibuka
    if (navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
        navToggle.classList.remove('toggle');
    }
});

// Komentar: Tambahkan event listener ke setiap tombol 'Add to Garage'
addButtons.forEach(button => {
    button.addEventListener('click', addCarToGarage);
});

// Komentar: Panggil saat halaman dimuat untuk menampilkan konten garasi yang tersimpan
updateGarageDisplay();


// Komentar: Tutup garasi saat user mengklik di luar area garasi (opsional)
document.addEventListener('click', (event) => {
    // Cek apakah klik tidak terjadi di dalam garasi, tidak di tombol toggle, dan garasi sedang terbuka
    const isClickInsideGarage = carGarage.contains(event.target);
    const isClickOnToggle = garageToggleBtn.contains(event.target) || garageToggleBtn === event.target;

    if (!isClickInsideGarage && !isClickOnToggle && carGarage.classList.contains('open')) {
        // Abaikan klik pada tombol hapus di dalam list
        if (!event.target.classList.contains('remove-car') && !event.target.closest('.remove-car')) {
             carGarage.classList.remove('open');
        }
    }
});