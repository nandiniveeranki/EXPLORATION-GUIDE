const homePage = document.getElementById('homePage');
const exploreMenu = document.getElementById('exploreMenu');
const categoriesSection = document.getElementById('categoriesSection');
const gallerySection = document.getElementById('gallerySection');
const mapsSection = document.getElementById('mapsSection');
const reviewsSection = document.getElementById('reviewsSection');
const exploreBtn = document.getElementById('exploreBtn');

function showMenu() {
  if (homePage && exploreMenu) {
    homePage.style.display = "none";
    exploreMenu.style.display = "block";
  }
}

function showSection(id) {
  const sections = [homePage, categoriesSection, gallerySection, mapsSection, reviewsSection, exploreMenu];

  sections.forEach(section => {
    if (section) { // Ensure section element exists before trying to access style
      section.style.display = "none";
    }
  });

  const targetSection = document.getElementById(id);
  if (targetSection) {
    targetSection.style.display = "block";
  }

  // Logic to ensure exploreMenu is visible when a content section is shown
  if (id !== "homePage" && id !== "exploreMenu" && exploreMenu) {
    exploreMenu.style.display = "block";
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else if (id === "exploreMenu" && exploreMenu) {
    exploreMenu.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Event listener for the "Start Exploring" button on the homepage
if (exploreBtn) {
  exploreBtn.addEventListener('click', showMenu);
}

// Chat toggle functionality
document.getElementById('chatToggle').addEventListener('click', () => {
  const chatBox = document.getElementById('chatBox');
  if (chatBox) {
    chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
  }
});

// Initial state and URL hash handling (if needed)
document.addEventListener('DOMContentLoaded', () => {
  // Hide all sections initially, then show only homepage or the section specified by hash
  const allContentSections = [categoriesSection, gallerySection, mapsSection, reviewsSection, exploreMenu];
  allContentSections.forEach(section => {
    if (section) section.style.display = 'none';
  });

  const hash = window.location.hash.substring(1); // Remove '#'
  if (hash && document.getElementById(hash)) {
    showSection(hash); // Show section if valid hash is present
  } else if (homePage) {
    homePage.style.display = 'block'; // Default to homepage
  }
});