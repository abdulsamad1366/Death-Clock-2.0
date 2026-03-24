console.clear();

// Sound Control
const tickSound = document.getElementById('tick-sound');
const soundToggle = document.getElementById('sound-toggle');

// Initialize sound state from localStorage or default to muted
let isMuted = localStorage.getItem('isMuted') === 'false' ? false : true;

// Set initial volume
tickSound.volume = 0.2; // Set volume to 20%

updateSoundState();

function updateSoundState() {
  soundToggle.setAttribute('data-muted', isMuted);
  if (isMuted) {
    tickSound.pause();
  } else {
    // Ensure volume is set and play
    tickSound.volume = 0.2;
    tickSound.play().catch(e => console.log('Audio play failed:', e));
  }
  localStorage.setItem('isMuted', isMuted);
}

soundToggle.addEventListener('click', () => {
  isMuted = !isMuted;
  updateSoundState();
});

// Ensure sound starts playing when user interacts with the page
document.addEventListener('click', () => {
  if (!isMuted) {
    tickSound.volume = 0.2;
    tickSound.play().catch(e => console.log('Audio play failed:', e));
  }
}, { once: true });

// Search functionality
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchEngineBtn = document.getElementById('search-engine-btn');
const searchEngineIcon = document.getElementById('search-engine-icon');
const searchEngineDropdown = document.querySelector('.search-engine-dropdown');
const searchEngineOptions = document.querySelectorAll('.search-engine-option');

// Initialize with Google as default search engine
let currentSearchEngine = {
  engine: 'google',
  icon: 'https://www.google.com/favicon.ico',
  url: 'https://www.google.com/search?q='
};

// Load saved search engine preference
const savedEngine = localStorage.getItem('searchEngine');
if (savedEngine) {
  const saved = JSON.parse(savedEngine);
  currentSearchEngine = saved;
  searchEngineIcon.src = saved.icon;
}

// Toggle dropdown
searchEngineBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  searchEngineDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!searchEngineBtn.contains(e.target)) {
    searchEngineDropdown.classList.remove('show');
  }
});

// Handle search engine selection
searchEngineOptions.forEach(option => {
  option.addEventListener('click', (e) => {
    e.stopPropagation();
    currentSearchEngine = {
      engine: option.dataset.engine,
      icon: option.dataset.icon,
      url: option.dataset.url
    };
    searchEngineIcon.src = option.dataset.icon;
    localStorage.setItem('searchEngine', JSON.stringify(currentSearchEngine));
    searchEngineDropdown.classList.remove('show');
  });
});

function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    window.open(currentSearchEngine.url + encodeURIComponent(query), '_blank', 'noopener,noreferrer');
    searchInput.value = '';
  }
}

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// array of JavaScript supported languages for local dates (not definitive)
const languageFlags = [
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', flag: '🇸🇦' },
  { code: 'cs-CZ', name: 'Czech (Czech Republic)', flag: '🇨🇿' },
  { code: 'da-DK', name: 'Danish (Denmark)', flag: '🇩🇰' },
  { code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪' },
  { code: 'el-GR', name: 'Greek (Greece)', flag: '🇬🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'fi-FI', name: 'Finnish (Finland)', flag: '🇫🇮' },
  { code: 'fr-CA', name: 'French (Canada)', flag: '🇨🇦' },
  { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
  { code: 'he-IL', name: 'Hebrew (Israel)', flag: '🇮🇱' },
  { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
  { code: 'hu-HU', name: 'Hungarian (Hungary)', flag: '🇭🇺' },
  { code: 'it-IT', name: 'Italian (Italy)', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean (South Korea)', flag: '🇰🇷' },
  { code: 'nl-NL', name: 'Dutch (Netherlands)', flag: '🇳🇱' },
  { code: 'no-NO', name: 'Norwegian (Norway)', flag: '🇳🇴' },
  { code: 'pl-PL', name: 'Polish (Poland)', flag: '🇵🇱' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'ro-RO', name: 'Romanian (Romania)', flag: '🇷🇴' },
  { code: 'ru-RU', name: 'Russian (Russia)', flag: '🇷🇺' },
  { code: 'sv-SE', name: 'Swedish (Sweden)', flag: '🇸🇪' },
  { code: 'th-TH', name: 'Thai (Thailand)', flag: '🇹🇭' },
  { code: 'tr-TR', name: 'Turkish (Turkey)', flag: '🇹🇷' },
  { code: 'vi-VN', name: 'Vietnamese (Vietnam)', flag: '🇻🇳' },
  { code: 'zh-CN', name: 'Chinese (Simplified, China)', flag: '🇨🇳' },
];

const RADIUS = 140; // Radius of the circle for flag buttons
/*

  { code: 'zh-TW', name: 'Chinese (Traditional, Taiwan)', flag: '🇹🇼' },
*/

// map for default regions based on languageFlags
const defaultRegions = languageFlags.reduce((map, lang) => {
  const baseLang = lang.code.split('-')[0]; // Extract the base language (e.g., 'en' from 'en-US')
  if (!map[baseLang]) {
    map[baseLang] = lang.code;
  }
  return map;
}, {});

function getLocale() {
  // cet the primary language from navigator.languages or fallback to navigator.language
  let language = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';

  // not all browsers return the complete lang code so we have to add it from the mapped values
  if (language.length === 2) {
    language = defaultRegions[language] || `${language}-${language.toUpperCase()}`;
  }
  return language;
}

let locale = getLocale();
const isMobileViewport = window.matchMedia('(max-width: 900px)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const currentLangDisplay = document.getElementById('current-lang');
const languageDialog = document.getElementById('language-dialog');
const languageOptionsContainer = document.getElementById('language-options');
const closeButton = document.getElementById('btn-dialog-close');

let deathYear = null;
const deathYearDialog = document.getElementById('death-year-dialog');
const deathYearInput = document.getElementById('death-year');
const submitDeathYear = document.getElementById('submit-death-year');
const btnDeathDialogClose = document.getElementById('btn-death-dialog-close');
const countdownTimer = document.getElementById('countdown-timer');

// Add new functionality at the top of the file
const greetingElement = document.getElementById('greeting');
const currentDateElement = document.getElementById('current-date');
const quoteTextElement = document.querySelector('.quote-text');
const quoteAuthorElement = document.querySelector('.quote-author');
const balanceAmount = document.getElementById('balance-amount');
const lastUpdated = document.getElementById('last-updated');
const editBalanceBtn = document.getElementById('edit-balance');

// Update greeting based on time of day
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17) {
    greeting = 'Good evening';
  }
  
  greetingElement.textContent = greeting;
}

// Update current date
function updateDate() {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString(locale, options);
  currentDateElement.textContent = currentDate;
}

// Fetch daily quote
async function fetchDailyQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    quoteTextElement.textContent = data.content;
    quoteAuthorElement.textContent = `- ${data.author}`;
  } catch (error) {
    console.error('Error fetching quote:', error);
    quoteTextElement.textContent = 'The future belongs to those who believe in the beauty of their dreams.';
    quoteAuthorElement.textContent = '- Eleanor Roosevelt';
  }
}

// Handle balance updates
function handleBalanceUpdate() {
  const now = new Date();
  lastUpdated.textContent = `Last updated: ${now.toLocaleString()}`;
  
  // Remove currency symbol and commas, then parse the number
  const amount = parseFloat(balanceAmount.textContent.replace(/[₹,]/g, ''));
  
  // Update color based on amount
  if (amount < 10000) {
    balanceAmount.style.color = '#ff4d4d'; // Red for low balance
  } else if (amount >= 10000 && amount <= 50000) {
    balanceAmount.style.color = '#ffa64d'; // Orange for average balance
  } else {
    balanceAmount.style.color = '#4dff88'; // Green for high balance
  }
  
  localStorage.setItem('balance', balanceAmount.textContent);
  localStorage.setItem('lastUpdated', now.toLocaleString());
}

// Load saved balance
function loadSavedBalance() {
  const savedBalance = localStorage.getItem('balance') || '₹0.00';
  const savedLastUpdated = localStorage.getItem('lastUpdated');
  
  balanceAmount.textContent = savedBalance;
  
  // Apply color coding on load
  const amount = parseFloat(savedBalance.replace(/[₹,]/g, ''));
  if (amount < 10000) {
    balanceAmount.style.color = '#ff4d4d';
  } else if (amount >= 10000 && amount <= 50000) {
    balanceAmount.style.color = '#ffa64d';
  } else {
    balanceAmount.style.color = '#4dff88';
  }
  
  if (savedLastUpdated) {
    lastUpdated.textContent = `Last updated: ${savedLastUpdated}`;
  }
}

// Format balance with rupee symbol and commas
function formatBalance(amount) {
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Event listeners for balance
balanceAmount.addEventListener('blur', () => {
  // Format the number when the user finishes editing
  const amount = parseFloat(balanceAmount.textContent.replace(/[₹,]/g, '')) || 0;
  balanceAmount.textContent = formatBalance(amount);
  handleBalanceUpdate();
});

balanceAmount.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    balanceAmount.blur();
  }
});

editBalanceBtn.addEventListener('click', () => {
  balanceAmount.focus();
});

// Initialize everything
function initializeStartupPage() {
  updateGreeting();
  updateDate();
  fetchDailyQuote();
  loadSavedBalance();
  
  // Update greeting and date every minute
  setInterval(() => {
    updateGreeting();
    updateDate();
  }, 60000);
  
  // Fetch new quote every day
  setInterval(fetchDailyQuote, 24 * 60 * 60 * 1000);
}

// Show death year dialog on page load
window.addEventListener('load', () => {
  initializeStartupPage();
  
  // Check if death year is already stored
  const storedDeathYear = localStorage.getItem('deathYear');
  if (storedDeathYear) {
    deathYear = parseInt(storedDeathYear);
    updateCountdownTimer();
    setInterval(updateCountdownTimer, 1000);
  } else {
    deathYearDialog.showModal();
  }
});

// Handle death year submission
submitDeathYear.addEventListener('click', () => {
  const year = parseInt(deathYearInput.value);
  if (year >= 2024 && year <= 2100) {
    deathYear = year;
    localStorage.setItem('deathYear', year.toString());
    deathYearDialog.close();
    updateCountdownTimer();
    setInterval(updateCountdownTimer, 1000);
  } else {
    alert('Please enter a year between 2024 and 2100');
  }
});

// Handle death year dialog close
btnDeathDialogClose.addEventListener('click', () => {
  deathYearDialog.close();
});

// Update countdown timer
function updateCountdownTimer() {
  if (!deathYear) return;
  
  const now = new Date();
  const deathDate = new Date(deathYear, 0, 1); // January 1st of death year
  const timeLeft = deathDate - now;

  if (timeLeft <= 0) {
    countdownTimer.textContent = 'Time\'s up!';
    return;
  }

  const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365));
  const days = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  countdownTimer.textContent = `Time left: ${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function drawClockFaces() {
    const clockFaces = document.querySelectorAll('.clock-face');

    // Get the current date details
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentWeekday = currentDate.getDay();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const weekdayNames = Array.from({ length: 7 }, (_, i) =>
        new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2021, 0, i + 3))
    );
    const monthNames = Array.from({ length: 12 }, (_, i) =>
        new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2021, i))
    );

    clockFaces.forEach(clockFace => {
        clockFace.innerHTML = '';

        const clockType = clockFace.getAttribute('data-clock');
        const numbers = parseInt(clockFace.getAttribute('data-numbers'), 10);
        const RADIUS = (clockFace.offsetWidth / 2) - 20;
        const center = clockFace.offsetWidth / 2;

        let valueSet;
        let currentValue;

        switch (clockType) {
            case 'seconds':
                valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentSeconds).padStart(2, '0');
                break;
            case 'minutes':
                valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentMinutes).padStart(2, '0');
                break;
            case 'hours':
                valueSet = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
                currentValue = String(currentHours).padStart(2, '0');
                break;
            case 'days':
                valueSet = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
                currentValue = currentDay;
                break;
            case 'months':
                valueSet = monthNames;
                currentValue = currentMonth;
                break;
            case 'years':
                valueSet = Array.from({ length: 101 }, (_, i) => 2000 + i);
                currentValue = currentYear;
                break;
            case 'day-names':
                valueSet = weekdayNames;
                currentValue = currentWeekday;
                break;
            default:
                return;
        }

        valueSet.forEach((value, i) => {
            const angle = (i * (360 / numbers));
            const x = center + RADIUS * Math.cos((angle * Math.PI) / 180);
            const y = center + RADIUS * Math.sin((angle * Math.PI) / 180);

            const element = document.createElement('span');
            element.classList.add('number');
            
            // Add 'dead' class to years that are past the death year
            if (clockType === 'years' && deathYear && parseInt(value) >= deathYear) {
                element.classList.add('dead');
            }
            
            element.textContent = value;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

            clockFace.appendChild(element);
        });

        const currentIndex = valueSet.indexOf(
            typeof valueSet[0] === 'string' ? String(currentValue) : currentValue
        );
        const rotationAngle = -((currentIndex / numbers) * 360);
        clockFace.style.transform = `rotate(${rotationAngle}deg)`;
    });
}

function rotateClockFaces() {
    const clockFaces = document.querySelectorAll('.clock-face');

    const lastAngles = {};
    function updateRotations() {
        const now = new Date();
        const currentSecond = now.getSeconds();
        const currentMinute = now.getMinutes();
        const currentHour = now.getHours();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth(); // 0-indexed
        const currentYear = now.getFullYear();
        const currentWeekday = now.getDay(); // 0 = Sunday, 6 = Saturday

        clockFaces.forEach(clockFace => {
            const clockType = clockFace.getAttribute('data-clock');
            const totalNumbers = parseInt(clockFace.getAttribute('data-numbers'), 10);

            let currentValue;
            switch (clockType) {
                case 'seconds':
                    currentValue = currentSecond;
                    break;
                case 'minutes':
                    currentValue = currentMinute;
                    break;
                case 'hours':
                    currentValue = currentHour;
                    break;
                case 'days':
                    currentValue = currentDay - 1;
                    break;
                case 'months':
                    currentValue = currentMonth;
                    break;
                case 'years':
                    currentValue = currentYear - 2000;
                    break;
                case 'day-names':
                    currentValue = currentWeekday; // 0 = Sunday
                    break;
                default:
                    return;
            }

            const targetAngle = (360 / totalNumbers) * currentValue;

            // Retrieve the last angle for this clock face
            const clockId = clockFace.id || clockType;
            const lastAngle = lastAngles[clockId] || 0;

            // Adjust for shortest rotation direction
            const delta = targetAngle - lastAngle;
            const shortestDelta = ((delta + 540) % 360) - 180; // Normalize between -180 and 180

            // update the clock face rotation
            const newAngle = lastAngle + shortestDelta;
            clockFace.style.transform = `rotate(${newAngle * -1}deg)`;

            // store the new angle
            lastAngles[clockId] = newAngle;

            // "active" class
            const numbers = clockFace.querySelectorAll('.number');
            numbers.forEach((number, index) => {
                if (index === currentValue) {
                    number.classList.add('active');
                } else {
                    number.classList.remove('active');
                }
            });
        });
        // Use lower-frequency updates on mobile/reduced motion devices
        if (!isMobileViewport && !prefersReducedMotion) {
          requestAnimationFrame(updateRotations);
        }
    }

    // Listen for viewport/orientation changes to adjust performance
    const mediaQueryMobile = window.matchMedia('(max-width: 900px)');
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    mediaQueryMobile.addListener(() => {
      isMobileViewport = mediaQueryMobile.matches;
    });
    mediaQueryReducedMotion.addListener(() => {
      prefersReducedMotion = mediaQueryReducedMotion.matches;
    });
    
    updateRotations();
    if (isMobileViewport || prefersReducedMotion) {
      setInterval(updateRotations, 1000);
    }
  }

// create language options
function createLanguageOptions() {
  const centerX = languageOptionsContainer.offsetWidth / 2;
  const centerY = languageOptionsContainer.offsetHeight / 2;

  languageFlags.forEach((lang, index, arr) => {
    const angle = (index / arr.length) * 2 * Math.PI;
    const x = centerX + RADIUS * Math.cos(angle);
    const y = centerY + RADIUS * Math.sin(angle);

    const radioWrapper = document.createElement('label');
    radioWrapper.title = lang.name;
    radioWrapper.style.left = `${x}px`;
    radioWrapper.style.top = `${y}px`;

    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'language';
    radioInput.value = lang.code;

    if (lang.code === locale) {
      radioInput.checked = true;
      radioWrapper.classList.add('active');
    }

    const flag = document.createElement('span');
    flag.classList.add('flag-icon');
    flag.innerText = lang.flag;

    radioWrapper.appendChild(radioInput);
    radioWrapper.appendChild(flag);
    languageOptionsContainer.appendChild(radioWrapper);

    // Handle hover: display language name in the center of the parent container
    radioWrapper.addEventListener('mouseover', () => showTitle(lang.name, radioWrapper));
    radioWrapper.addEventListener('mouseleave', () => hideTitle());
  
    radioInput.addEventListener('change', () => {
      locale = radioInput.value;
      setCurrentLangDisplay(lang);
      drawClockFaces();
      document.querySelector('label.active')?.classList.remove('active');
      radioWrapper.classList.add('active');
      closeDialog();
    });
  });
}

// Show title (language name) in the center
let titleDisplay = null; // Declare titleDisplay globally for reuse
function showTitle(languageName) {
  if (titleDisplay) {
    titleDisplay.remove();
  }
  titleDisplay = document.createElement('div');
    titleDisplay.classList.add('language-title');
    titleDisplay.textContent = languageName;  // Update the title with the language name
    languageOptionsContainer.appendChild(titleDisplay);
 
  
}
function hideTitle() {
  if (titleDisplay) {
    titleDisplay.textContent = '';
  }
}
// Set current language display button flag and title
function setCurrentLangDisplay(lang) {
  currentLangDisplay.textContent = lang.flag;
  currentLangDisplay.title = lang.name;
  showTitle(lang.name)
}
function openDialog() {
  languageDialog.showModal();
  createLanguageOptions();
  addDialogCloseListener();
}
function closeDialog() {
  languageDialog.close();
  removeLanguageOptions();
  removeDialogCloseListener();
}
function removeLanguageOptions() {
  languageOptionsContainer.innerHTML = '';
}
function addDialogCloseListener() {
  languageDialog.addEventListener('click', closeDialogOnClickOutside);
}
function removeDialogCloseListener() {
  languageDialog.removeEventListener('click', closeDialogOnClickOutside);
}
function closeDialogOnClickOutside(e) {
  if (e.target === languageDialog) {
    closeDialog();
  }
}

// dialog close button event
closeButton.addEventListener('click', closeDialog);

// current language display - open dialog with lang buttons
currentLangDisplay.addEventListener('click', openDialog);
//console.log(locale);

// initalize
drawClockFaces();
rotateClockFaces();
setCurrentLangDisplay(languageFlags.find(lang => lang.code === locale));

// Goal input auto-save functionality
const goalInput = document.querySelector('.goal-input');

// Load saved goal from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedGoal = localStorage.getItem('dailyGoal');
  if (savedGoal) {
    goalInput.value = savedGoal;
  }
  
  loadTodos();

  // Load notes system
  loadNotesData();
  renderFolders();

  // Initialize clock swiper
  initClockSwiper();
  
  // Start digital/analog clocks
  updateNewClocks(); // Run once immediately
  setInterval(updateNewClocks, 1000); // Then update every second

  // Initialize Fullscreen button
  initFullscreen();
});

// Save goal with debounce
let saveTimeout;
goalInput.addEventListener('input', (e) => {
  const goal = e.target.value;
  
  // Add saving indicator
  goalInput.classList.add('saving');
  goalInput.classList.remove('saved');
  
  // Clear previous timeout
  clearTimeout(saveTimeout);
  
  // Set new timeout to save after 500ms of no typing
  saveTimeout = setTimeout(() => {
    localStorage.setItem('dailyGoal', goal);
    goalInput.classList.remove('saving');
    goalInput.classList.add('saved');
    
    // Remove saved class after animation
    setTimeout(() => {
      goalInput.classList.remove('saved');
    }, 3000);
  }, 500);
});

// Save on blur (when user clicks away)
goalInput.addEventListener('blur', (e) => {
  const goal = e.target.value;
  localStorage.setItem('dailyGoal', goal);
  goalInput.classList.remove('saving');
  goalInput.classList.add('saved');
  
  // Remove saved class after animation
  setTimeout(() => {
    goalInput.classList.remove('saved');
  }, 3000);
});

// TO-DO LIST FUNCTIONALITY
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = [];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    todos = JSON.parse(savedTodos);
    renderTodos();
  }
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;
    if (todo.completed) {
      li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '&times;'; // '×' character

    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text !== '') {
    todos.push({ text: text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }
});

todoList.addEventListener('click', (e) => {
  // Check if delete button was clicked
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.parentElement.dataset.index;
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  } 
  // Check if the li or span was clicked to toggle complete
  else if (e.target.tagName === 'LI' || e.target.tagName === 'SPAN') {
    const li = e.target.closest('li');
    const index = li.dataset.index;
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  }
});
// END: TO-DO LIST FUNCTIONALITY


// START: NOTES (FOLDER) FUNCTIONALITY
const folderView = document.getElementById('folder-view');
const noteView = document.getElementById('note-view');
const newFolderForm = document.getElementById('new-folder-form');
const newFolderInput = document.getElementById('new-folder-input');
const folderList = document.getElementById('folder-list');
const backToFoldersBtn = document.getElementById('back-to-folders-btn');
const currentFolderName = document.getElementById('current-folder-name');
const newNoteForm = document.getElementById('new-note-form');
const newNoteInput = document.getElementById('new-note-input');
const noteList = document.getElementById('note-list');

let notesData = [];
let currentFolderId = null;

function saveNotesData() {
  localStorage.setItem('notesData', JSON.stringify(notesData));
}

function loadNotesData() {
  const savedNotesData = localStorage.getItem('notesData');
  if (savedNotesData) {
    notesData = JSON.parse(savedNotesData);
  }
}

function showView(viewName) {
  if (viewName === 'noteView') {
    folderView.style.display = 'none';
    noteView.style.display = 'flex';
  } else {
    folderView.style.display = 'flex';
    noteView.style.display = 'none';
    currentFolderId = null;
  }
}

function renderFolders() {
  folderList.innerHTML = '';
  notesData.forEach(folder => {
    const li = document.createElement('li');
    li.dataset.id = folder.id;
    
    const span = document.createElement('span');
    span.textContent = folder.name;
    li.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '&times;';
    li.appendChild(deleteBtn);

    folderList.appendChild(li);
  });
}

function renderNotes() {
  noteList.innerHTML = '';
  const folder = notesData.find(f => f.id === currentFolderId);
  if (!folder) return;

  currentFolderName.textContent = folder.name;
  folder.notes.forEach(note => {
    const li = document.createElement('li');
    li.dataset.id = note.id;

    const span = document.createElement('span');
    span.textContent = note.text;
    li.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '&times;';
    li.appendChild(deleteBtn);

    noteList.appendChild(li);
  });
}

// Event Listeners for Notes
newFolderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const folderName = newFolderInput.value.trim();
  if (folderName) {
    const newFolder = {
      id: Date.now(),
      name: folderName,
      notes: []
    };
    notesData.push(newFolder);
    saveNotesData();
    renderFolders();
    newFolderInput.value = '';
  }
});

newNoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const noteText = newNoteInput.value.trim();
  if (noteText && currentFolderId) {
    const newNote = {
      id: Date.now(),
      text: noteText
    };
    const folder = notesData.find(f => f.id === currentFolderId);
    folder.notes.push(newNote);
    saveNotesData();
    renderNotes();
    newNoteInput.value = '';
  }
});

backToFoldersBtn.addEventListener('click', () => {
  showView('folderView');
});

folderList.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  
  const folderId = Number(li.dataset.id);

  if (e.target.classList.contains('delete-btn')) {
    // Delete folder
    notesData = notesData.filter(f => f.id !== folderId);
    saveNotesData();
    renderFolders();
  } else {
    // Open folder
    currentFolderId = folderId;
    renderNotes();
    showView('noteView');
  }
});

noteList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const li = e.target.closest('li');
    const noteId = Number(li.dataset.id);
    const folder = notesData.find(f => f.id === currentFolderId);
    if (folder) {
      folder.notes = folder.notes.filter(n => n.id !== noteId);
      saveNotesData();
      renderNotes();
    }
  }
});
// END: NOTES (FOLDER) FUNCTIONALITY


// START: CLOCK SWIPER AND DESIGNS
const clockPrevBtn = document.getElementById('clock-prev');
const clockNextBtn = document.getElementById('clock-next');
const clockDesigns = document.querySelectorAll('.clock-face-container');
let currentClockIndex = 0;

function initClockSwiper() {
  const goToPrevClock = () => {
    currentClockIndex--;
    if (currentClockIndex < 0) {
      currentClockIndex = clockDesigns.length - 1;
    }
    showClock(currentClockIndex);
  };

  const goToNextClock = () => {
    currentClockIndex++;
    if (currentClockIndex >= clockDesigns.length) {
      currentClockIndex = 0;
    }
    showClock(currentClockIndex);
  };

  clockPrevBtn.addEventListener('click', () => {
    goToPrevClock();
  });

  clockNextBtn.addEventListener('click', () => {
    goToNextClock();
  });

  const clockSwiper = document.querySelector('.clock-swiper');
  if (!clockSwiper) return;

  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 40;

  clockSwiper.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  clockSwiper.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < swipeThreshold) return;

    if (deltaX < 0) {
      goToNextClock();
    } else {
      goToPrevClock();
    }
  }, { passive: true });
}

function showClock(index) {
  clockDesigns.forEach((clock, i) => {
    if (i === index) {
      clock.classList.add('active');
    } else {
      clock.classList.remove('active');
    }
  });
}

// Functions to update the new clocks
function updateNewClocks() {
  const now = new Date();

  // Update Digital Clock
  const digitalTimeEl = document.getElementById('digital-time');
  const digitalAmPmEl = document.getElementById('digital-ampm');
  const digitalDateEl = document.getElementById('digital-date');

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0');

  digitalTimeEl.textContent = `${strHours}:${minutes}:${seconds}`;
  digitalAmPmEl.textContent = ampm;
  digitalDateEl.textContent = now.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  // Update Analog Clock
  const analogHourEl = document.getElementById('analog-hour');
  const analogMinuteEl = document.getElementById('analog-minute');
  const analogSecondEl = document.getElementById('analog-second');

  const secondsRatio = now.getSeconds() / 60;
  const minutesRatio = (secondsRatio + now.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + now.getHours()) / 12;

  analogHourEl.style.transform = `translateX(-50%) rotate(${hoursRatio * 360}deg)`;
  analogMinuteEl.style.transform = `translateX(-50%) rotate(${minutesRatio * 360}deg)`;
  analogSecondEl.style.transform = `translateX(-50%) rotate(${secondsRatio * 360}deg)`;
}
// END: CLOCK SWIPER AND DESIGNS

// START: FULLSCREEN FUNCTIONALITY
function initFullscreen() {
  const fullscreenBtn = document.getElementById('fullscreen-toggle');
  
  // Set initial icon state
  fullscreenBtn.setAttribute('data-fullscreen', 'false');

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  // Listen for changes to fullscreen state (e.g., user pressing ESC)
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fullscreenBtn.setAttribute('data-fullscreen', 'true');
    } else {
      fullscreenBtn.setAttribute('data-fullscreen', 'false');
    }
  });
}
// END: FULLSCREEN FUNCTIONALITYv