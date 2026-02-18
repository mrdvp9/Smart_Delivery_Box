// OTP Storage
var otpHistory = {
    food: [],
    package: []
};

var isLockedOut = false;

// Google Drive Configuration
var DRIVE_FOLDER_ID = '1jghyPM951sBjU54vo8-MsDgpvIahOC0R';
var GOOGLE_API_KEY = 'AIzaSyDAk8rFYA849BMEo2UJ8Gg3b45lBgtg888';

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(function(page) {
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    
    // Update history display when going to page 3
    if (pageId === 'page3') {
        updateHistoryDisplay();
    }
    
    // Load photos when going to page 4
    if (pageId === 'page4') {
        loadPhotos();
    }
}

// Generate OTP for specific type
function generateOTP(type) {
    if (isLockedOut) {
        alert('System is locked out!');
        return;
    }
    
    var otp = Math.floor(1000 + Math.random() * 9000);
    var timestamp = new Date();
    
    // Store in history
    otpHistory[type].push({
        code: otp,
        time: timestamp
    });
    
    // Display OTP
    var displayId = type === 'food' ? 'otpFood' : 'otpPackage';
    var otpDisplay = document.getElementById(displayId);
    otpDisplay.textContent = otp;
    otpDisplay.classList.add('show');
    
    setTimeout(function() {
        otpDisplay.classList.remove('show');
    }, 5000);
}

// Update OTP history display
function updateHistoryDisplay() {
    // Food history
    var foodHistoryDiv = document.getElementById('foodHistory');
    if (otpHistory.food.length === 0) {
        foodHistoryDiv.innerHTML = '<div class="empty-state">No OTPs generated yet</div>';
    } else {
        foodHistoryDiv.innerHTML = '';
        otpHistory.food.slice().reverse().forEach(function(item) {
            var historyItem = document.createElement('div');
            historyItem.className = 'otp-history-item';
            historyItem.innerHTML = '<span class="otp-code">' + item.code + '</span><span class="otp-time">' + formatTime(item.time) + '</span>';
            foodHistoryDiv.appendChild(historyItem);
        });
    }
    
    // Package history
    var packageHistoryDiv = document.getElementById('packageHistory');
    if (otpHistory.package.length === 0) {
        packageHistoryDiv.innerHTML = '<div class="empty-state">No OTPs generated yet</div>';
    } else {
        packageHistoryDiv.innerHTML = '';
        otpHistory.package.slice().reverse().forEach(function(item) {
            var historyItem = document.createElement('div');
            historyItem.className = 'otp-history-item';
            historyItem.innerHTML = '<span class="otp-code">' + item.code + '</span><span class="otp-time">' + formatTime(item.time) + '</span>';
            packageHistoryDiv.appendChild(historyItem);
        });
    }
}

// Format time
function formatTime(date) {
    var now = new Date();
    var diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' mins ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
    return date.toLocaleDateString();
}

// Toggle lockout
function toggleLockout() {
    isLockedOut = !isLockedOut;
    
    var statusElement = document.getElementById('lockStatus');
    var btnElement = document.getElementById('lockBtn');
    
    if (isLockedOut) {
        statusElement.textContent = 'LOCKED';
        statusElement.classList.add('locked');
        btnElement.textContent = 'Unlock';
    } else {
        statusElement.textContent = 'NORMAL';
        statusElement.classList.remove('locked');
        btnElement.textContent = 'Lockout';
    }
}

// Load photos from Google Drive
function loadPhotos() {
    var gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '<div class="loading">Loading photos...</div>';
    
    // If using Google Drive API
    if (DRIVE_FOLDER_ID !== 'YOUR_FOLDER_ID_HERE' && GOOGLE_API_KEY !== 'YOUR_API_KEY_HERE') {
        loadFromGoogleDrive();
    } else {
        // Demo mode with placeholder images
        loadDemoPhotos();
    }
}

// Load photos from Google Drive using API
function loadFromGoogleDrive() {
    var url = 'https://www.googleapis.com/drive/v3/files?q="' + DRIVE_FOLDER_ID + '"+in+parents+and+mimeType+contains+"image/"&key=' + GOOGLE_API_KEY + '&fields=files(id,name,createdTime,webContentLink,thumbnailLink)&orderBy=createdTime%20desc';
    
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            displayPhotos(data.files);
        })
        .catch(function(error) {
            console.error('Error loading photos:', error);
            document.getElementById('photoGallery').innerHTML = '<div class="empty-state">Error loading photos. Check console.</div>';
        });
}

// Display photos in gallery
function displayPhotos(files) {
    var gallery = document.getElementById('photoGallery');
    
    if (!files || files.length === 0) {
        gallery.innerHTML = '<div class="empty-state">No photos found</div>';
        return;
    }
    
    gallery.innerHTML = '';
    
    files.forEach(function(file) {
        var item = document.createElement('div');
        item.className = 'gallery-item';
        
        // Use thumbnail for grid, full image for modal
        var thumbnailUrl = file.thumbnailLink || 'https://drive.google.com/thumbnail?id=' + file.id;
        var fullImageUrl = 'https://drive.google.com/uc?id=' + file.id;
        
        item.innerHTML = '<img src="' + thumbnailUrl + '" alt="' + file.name + '">';
        item.onclick = function() {
            openPhotoModal(fullImageUrl, file.name, file.createdTime);
        };
        
        gallery.appendChild(item);
    });
}

// Load demo photos (for testing without Google Drive)
function loadDemoPhotos() {
    var gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '';
    
    // Create 9 demo photo slots
    for (var i = 1; i <= 9; i++) {
        var item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = '<img src="https://via.placeholder.com/300x300/f0f0f0/999?text=Photo+' + i + '" alt="Demo Photo ' + i + '">';
        item.onclick = (function(num) {
            return function() {
                openPhotoModal('https://via.placeholder.com/800x800/f0f0f0/999?text=Photo+' + num, 'Demo Photo ' + num, new Date());
            };
        })(i);
        gallery.appendChild(item);
    }
}

// Open photo in modal
function openPhotoModal(imageUrl, name, time) {
    var modal = document.getElementById('photoModal');
    var modalImage = document.getElementById('modalImage');
    var photoInfo = document.getElementById('photoInfo');
    
    modalImage.src = imageUrl;
    photoInfo.textContent = name + ' • ' + formatPhotoTime(time);
    
    modal.classList.remove('hidden');
}

// Close photo modal
function closePhotoModal() {
    document.getElementById('photoModal').classList.add('hidden');
}

// Format photo time
function formatPhotoTime(time) {
    if (typeof time === 'string') {
        time = new Date(time);
    }
    return time.toLocaleString();
}