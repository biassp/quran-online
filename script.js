// Quran Online Application
class QuranApp {
    constructor() {
        this.currentSurah = null;
        this.currentAyah = null;
        this.bookmarks = JSON.parse(localStorage.getItem('quranBookmarks')) || [];
        this.audioPlayer = null;
        this.isPlaying = false;
        this.nightMode = localStorage.getItem('nightMode') === 'true';

        this.init();
    }

    init() {
        try {
            console.log('Initializing Quran Online Pakistan...');
            
            // Verify homepage elements exist
            this.verifyHomepageElements();
            
            this.setupEventListeners();
            this.setupNightMode();
            this.loadPopularSurahs(); // Start with popular Surahs
            this.setupSmoothScrolling();
            this.setupPerformanceOptimizations();
            
            console.log('✅ Quran Online Pakistan initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            this.showError('Failed to initialize the website. Please refresh the page.');
        }
    }

    verifyHomepageElements() {
        const requiredElements = [
            'theme-toggle',
            'mobile-menu-btn', 
            'mobile-menu',
            'surah-grid'
        ];

        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.warn('⚠️ Missing elements:', missingElements);
        }

        // Verify sections exist
        const sections = ['home', 'surahs', 'about', 'faq'];
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (!element) {
                console.warn(`⚠️ Section missing: ${section}`);
            }
        });

        console.log('✅ Homepage elements verified');
    }

    setupPerformanceOptimizations() {
        // Lazy load images if any are added later
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }

        // Preload critical resources
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    preloadCriticalResources() {
        // Preload popular Surah audio
        const popularSurahs = [1, 36, 67, 112, 113, 114];
        popularSurahs.forEach(surahId => {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = `https://server8.mp3quran.net/afs/${surahId.toString().padStart(3, '0')}.mp3`;
        });
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleNightMode());
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('show');
            });
        }

        // Close mobile menu when clicking outside or on links
        document.addEventListener('click', (e) => {
            if (mobileMenu && !e.target.closest('#mobile-menu-btn') && !e.target.closest('#mobile-menu')) {
                mobileMenu.classList.remove('show');
            }
        });

        // Close mobile menu when clicking on navigation links
        if (mobileMenu) {
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    mobileMenu.classList.remove('show');
                    // Ensure smooth scrolling works on mobile
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    if (targetId.startsWith('#')) {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                });
            });
        }

        // Handle desktop navigation with smooth scrolling
        const desktopLinks = document.querySelectorAll('nav a[href^="#"]');
        desktopLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Surah loading buttons
        const loadAllBtn = document.getElementById('load-all-surahs');
        const loadPopularBtn = document.getElementById('load-popular-surahs');
        
        if (loadAllBtn) {
            loadAllBtn.addEventListener('click', () => {
                console.log('Load all Surahs button clicked');
                this.loadAllSurahs();
            });
        }
        
        if (loadPopularBtn) {
            loadPopularBtn.addEventListener('click', () => {
                console.log('Load popular Surahs button clicked');
                this.loadPopularSurahs();
            });
        }
    }

    setupNightMode() {
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');

        if (this.nightMode) {
            body.classList.add('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        } else {
            body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        }
    }

    toggleNightMode() {
        this.nightMode = !this.nightMode;
        localStorage.setItem('nightMode', this.nightMode);
        this.setupNightMode();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async loadSurahs() {
        try {
            console.log('🔄 Loading all 114 Surahs from API...');
            
            // Show loading state
            this.showSurahLoading();
            
            // Set timeout for API call
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            // Try multiple API sources for better reliability
            const apiSources = [
                'https://api.quran.com/api/v4/chapters?language=en',
                'https://cdn.jsdelivr.net/gh/risan/quran-json@main/dist/chapters.json',
                'https://raw.githubusercontent.com/semarketir/quraan-corpus/master/QuranicArabicCorpus.json'
            ];
            
            let response = null;
            let lastError = null;
            
            for (const apiUrl of apiSources) {
                try {
                    console.log(`Trying API: ${apiUrl}`);
                    response = await fetch(apiUrl, {
                        signal: controller.signal,
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json',
                        }
                    });
                    
                    if (response.ok) {
                        console.log(`✅ Successfully connected to: ${apiUrl}`);
                        break;
                    }
                } catch (error) {
                    console.warn(`❌ Failed to connect to: ${apiUrl}`, error);
                    lastError = error;
                    response = null;
                }
            }
            
            if (!response || !response.ok) {
                throw lastError || new Error('All API sources failed');
            }
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ API response received:', data);
            
            // Handle different API response formats
            let surahs = null;
            
            if (data.chapters && Array.isArray(data.chapters)) {
                // Format: { chapters: [...] }
                surahs = data.chapters;
                console.log(`Found ${surahs.length} Surahs in chapters format`);
            } else if (Array.isArray(data)) {
                // Format: [...]
                surahs = data;
                console.log(`Found ${surahs.length} Surahs in array format`);
            } else if (data.data && Array.isArray(data.data)) {
                // Format: { data: [...] }
                surahs = data.data;
                console.log(`Found ${surahs.length} Surahs in data format`);
            }
            
            if (surahs && surahs.length >= 100) {
                // Accept if we have at least 100 Surahs (close to 114)
                this.displaySurahs(surahs);
                this.showNotification(`Loaded ${surahs.length} Surahs successfully`);
                console.log(`✅ Successfully loaded ${surahs.length} Surahs from API`);
            } else {
                console.warn(`Unexpected API response format or insufficient data:`, data);
                throw new Error(`Invalid API response: expected array of Surahs, got ${typeof data}`);
            }
        } catch (error) {
            console.error('❌ Error loading Surahs:', error);
            
            if (error.name === 'AbortError') {
                this.showError('Connection timeout. Loading offline Surahs...');
            } else {
                this.showError('Failed to load all Surahs. Loading full offline list instead.');
            }
            
            // Always load full offline list as fallback
            this.showFallbackSurahs();
        }
    }

    displaySurahs(surahs) {
        console.log('displaySurahs called with', surahs.length, 'surahs');
        
        // Hide loading indicator
        const loading = document.getElementById('surah-loading');
        if (loading) loading.classList.add('hidden');
        
        const surahGrid = document.getElementById('surah-grid');
        if (!surahGrid) {
            console.error('Surah grid element not found! Looking for #surah-grid');
            console.log('Available elements with id:', document.querySelectorAll('[id]'));
            return;
        }

        console.log('Surah grid found, clearing and adding', surahs.length, 'Surahs');
        surahGrid.innerHTML = '';

        surahs.forEach((surah, index) => {
            console.log(`Creating card ${index + 1}:`, surah.name_arabic);
            const surahCard = this.createSurahCard(surah);
            surahGrid.appendChild(surahCard);
        });
        
        console.log('All Surah cards added to grid');
    }

    showSurahLoading() {
        const loading = document.getElementById('surah-loading');
        const grid = document.getElementById('surah-grid');
        
        if (loading) loading.classList.remove('hidden');
        if (grid) grid.innerHTML = '';
        
        console.log('Showing Surah loading indicator');
    }

    showFallbackSurahs() {
        try {
            console.log('📚 Loading complete offline Surah database...');
            const allSurahs = this.getCompleteSurahDatabase();
            
            if (allSurahs && allSurahs.length === 114) {
                this.displaySurahs(allSurahs);
                this.showNotification('Loaded all 114 Surahs from offline database');
                console.log('✅ Successfully loaded offline Surah database');
            } else {
                throw new Error('Offline database failed to load');
            }
        } catch (error) {
            console.error('❌ Critical error: Offline database failed', error);
            this.showCriticalError();
        }
    }

    showCriticalError() {
        const grid = document.getElementById('surah-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                        <h3 class="text-xl font-semibold text-red-700 mb-4">Critical Loading Error</h3>
                        <p class="text-red-600 mb-6">Unable to load Surahs from any source. This may be a temporary issue.</p>
                        <div class="space-y-3">
                            <button onclick="location.reload()" class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                                <i class="fas fa-redo mr-2"></i>Refresh Page
                            </button>
                            <button onclick="app.loadPopularSurahs()" class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                                <i class="fas fa-star mr-2"></i>Try Popular Surahs
                            </button>
                            <a href="https://quran.com" target="_blank" rel="noopener" class="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors inline-block">
                                <i class="fas fa-external-link-alt mr-2"></i>Read on Quran.com
                            </a>
                        </div>
                        <div class="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                            <strong>Quick Solutions:</strong><br>
                            • Check internet connection<br>
                            • Clear browser cache<br>
                            • Try different browser<br>
                            • Use Quran.com for guaranteed access
                        </div>
                    </div>
                </div>
            `;
        }
        this.hideLoading();
    }

    getQuranComUrl(surahId) {
        // Generate Quran.com URL for each Surah
        const surahSlugs = {
            1: 'al-fatihah', 2: 'al-baqarah', 3: 'ali-imran', 4: 'an-nisa', 5: 'al-maidah',
            6: 'al-anam', 7: 'al-araf', 8: 'al-anfal', 9: 'at-tawbah', 10: 'yunus',
            11: 'hud', 12: 'yusuf', 13: 'ar-rad', 14: 'ibrahim', 15: 'al-hijr',
            16: 'an-nahl', 17: 'al-isra', 18: 'al-kahf', 19: 'maryam', 20: 'taha',
            21: 'al-anbiya', 22: 'al-hajj', 23: 'al-muminun', 24: 'an-nur', 25: 'al-furqan',
            26: 'ash-shuara', 27: 'an-naml', 28: 'al-qasas', 29: 'al-ankabut', 30: 'ar-rum',
            31: 'luqman', 32: 'as-sajdah', 33: 'al-ahzab', 34: 'saba', 35: 'fatir',
            36: 'yasin', 37: 'as-saffat', 38: 'sad', 39: 'az-zumar', 40: 'ghafir',
            41: 'fussilat', 42: 'ash-shura', 43: 'az-zukhruf', 44: 'ad-dukhan', 45: 'al-jathiyah',
            46: 'al-ahqaf', 47: 'muhammad', 48: 'al-fath', 49: 'al-hujurat', 50: 'qaf',
            51: 'ad-dhariyat', 52: 'at-tur', 53: 'an-najm', 54: 'al-qamar', 55: 'ar-rahman',
            56: 'al-waqiah', 57: 'al-hadid', 58: 'al-mujadila', 59: 'al-hashr', 60: 'al-mumtahanah',
            61: 'as-saff', 62: 'al-jumuah', 63: 'al-munafiqun', 64: 'at-taghabun', 65: 'at-talaq',
            66: 'at-tahrim', 67: 'al-mulk', 68: 'al-qalam', 69: 'al-haqqah', 70: 'al-maarij',
            71: 'nuh', 72: 'al-jinn', 73: 'al-muzzammil', 74: 'al-muddaththir', 75: 'al-qiyamah',
            76: 'al-insan', 77: 'al-mursalat', 78: 'an-naba', 79: 'an-naziat', 80: 'abasa',
            81: 'at-takwir', 82: 'al-infitar', 83: 'al-mutaffifin', 84: 'al-inshiqaq', 85: 'al-buruj',
            86: 'at-tariq', 87: 'al-ala', 88: 'al-ghashiyah', 89: 'al-fajr', 90: 'al-balad',
            91: 'ash-shams', 92: 'al-layl', 93: 'ad-duha', 94: 'ash-sharh', 95: 'at-tin',
            96: 'al-alaq', 97: 'al-qadr', 98: 'al-bayyinah', 99: 'az-zalzalah', 100: 'al-adiyat',
            101: 'al-qariah', 102: 'at-takathur', 103: 'al-asr', 104: 'al-humazah', 105: 'al-fil',
            106: 'quraysh', 107: 'al-maun', 108: 'al-kawthar', 109: 'al-kafirun', 110: 'an-nasr',
            111: 'al-masad', 112: 'al-ikhlas', 113: 'al-falaq', 114: 'an-nas'
        };
        
        const slug = surahSlugs[surahId] || `surah-${surahId}`;
        return `https://quran.com/${surahId}`;
    }

    getCompleteSurahDatabase() {
        // Complete database of all 114 Surahs with accurate information
        return [
            { id: 1, name_arabic: 'الفاتحة', translated_name: { name: 'Al-Fatihah (The Opening)' }, verses_count: 7, revelation_place: 'makkah' },
            { id: 2, name_arabic: 'البقرة', translated_name: { name: 'Al-Baqarah (The Cow)' }, verses_count: 286, revelation_place: 'madinah' },
            { id: 3, name_arabic: 'آل عمران', translated_name: { name: 'Ali Imran (Family of Imran)' }, verses_count: 200, revelation_place: 'madinah' },
            { id: 4, name_arabic: 'النساء', translated_name: { name: 'An-Nisa (The Women)' }, verses_count: 176, revelation_place: 'madinah' },
            { id: 5, name_arabic: 'المائدة', translated_name: { name: 'Al-Maidah (The Table Spread)' }, verses_count: 120, revelation_place: 'madinah' },
            { id: 6, name_arabic: 'الأنعام', translated_name: { name: 'Al-Anam (The Cattle)' }, verses_count: 165, revelation_place: 'makkah' },
            { id: 7, name_arabic: 'الأعراف', translated_name: { name: 'Al-Araf (The Heights)' }, verses_count: 206, revelation_place: 'makkah' },
            { id: 8, name_arabic: 'الأنفال', translated_name: { name: 'Al-Anfal (The Spoils of War)' }, verses_count: 75, revelation_place: 'madinah' },
            { id: 9, name_arabic: 'التوبة', translated_name: { name: 'At-Tawbah (The Repentance)' }, verses_count: 129, revelation_place: 'madinah' },
            { id: 10, name_arabic: 'يونس', translated_name: { name: 'Yunus (Jonah)' }, verses_count: 109, revelation_place: 'makkah' },
            { id: 11, name_arabic: 'هود', translated_name: { name: 'Hud' }, verses_count: 123, revelation_place: 'makkah' },
            { id: 12, name_arabic: 'يوسف', translated_name: { name: 'Yusuf (Joseph)' }, verses_count: 111, revelation_place: 'makkah' },
            { id: 13, name_arabic: 'الرعد', translated_name: { name: 'Ar-Rad (The Thunder)' }, verses_count: 43, revelation_place: 'madinah' },
            { id: 14, name_arabic: 'إبراهيم', translated_name: { name: 'Ibrahim (Abraham)' }, verses_count: 52, revelation_place: 'makkah' },
            { id: 15, name_arabic: 'الحجر', translated_name: { name: 'Al-Hijr (The Rocky Tract)' }, verses_count: 99, revelation_place: 'makkah' },
            { id: 16, name_arabic: 'النحل', translated_name: { name: 'An-Nahl (The Bee)' }, verses_count: 128, revelation_place: 'makkah' },
            { id: 17, name_arabic: 'الإسراء', translated_name: { name: 'Al-Isra (The Night Journey)' }, verses_count: 111, revelation_place: 'makkah' },
            { id: 18, name_arabic: 'الكهف', translated_name: { name: 'Al-Kahf (The Cave)' }, verses_count: 110, revelation_place: 'makkah' },
            { id: 19, name_arabic: 'مريم', translated_name: { name: 'Maryam (Mary)' }, verses_count: 98, revelation_place: 'makkah' },
            { id: 20, name_arabic: 'طه', translated_name: { name: 'Ta-Ha' }, verses_count: 135, revelation_place: 'makkah' },
            { id: 21, name_arabic: 'الأنبياء', translated_name: { name: 'Al-Anbiya (The Prophets)' }, verses_count: 112, revelation_place: 'makkah' },
            { id: 22, name_arabic: 'الحج', translated_name: { name: 'Al-Hajj (The Pilgrimage)' }, verses_count: 78, revelation_place: 'madinah' },
            { id: 23, name_arabic: 'المؤمنون', translated_name: { name: 'Al-Muminun (The Believers)' }, verses_count: 118, revelation_place: 'makkah' },
            { id: 24, name_arabic: 'النور', translated_name: { name: 'An-Nur (The Light)' }, verses_count: 64, revelation_place: 'madinah' },
            { id: 25, name_arabic: 'الفرقان', translated_name: { name: 'Al-Furqan (The Criterion)' }, verses_count: 77, revelation_place: 'makkah' },
            { id: 26, name_arabic: 'الشعراء', translated_name: { name: 'Ash-Shuara (The Poets)' }, verses_count: 227, revelation_place: 'makkah' },
            { id: 27, name_arabic: 'النمل', translated_name: { name: 'An-Naml (The Ant)' }, verses_count: 93, revelation_place: 'makkah' },
            { id: 28, name_arabic: 'القصص', translated_name: { name: 'Al-Qasas (The Stories)' }, verses_count: 88, revelation_place: 'makkah' },
            { id: 29, name_arabic: 'العنكبوت', translated_name: { name: 'Al-Ankabut (The Spider)' }, verses_count: 69, revelation_place: 'makkah' },
            { id: 30, name_arabic: 'الروم', translated_name: { name: 'Ar-Rum (The Romans)' }, verses_count: 60, revelation_place: 'makkah' },
            { id: 31, name_arabic: 'لقمان', translated_name: { name: 'Luqman' }, verses_count: 34, revelation_place: 'makkah' },
            { id: 32, name_arabic: 'السجدة', translated_name: { name: 'As-Sajdah (The Prostration)' }, verses_count: 30, revelation_place: 'makkah' },
            { id: 33, name_arabic: 'الأحزاب', translated_name: { name: 'Al-Ahzab (The Clans)' }, verses_count: 73, revelation_place: 'madinah' },
            { id: 34, name_arabic: 'سبأ', translated_name: { name: 'Saba (Sheba)' }, verses_count: 54, revelation_place: 'makkah' },
            { id: 35, name_arabic: 'فاطر', translated_name: { name: 'Fatir (The Creator)' }, verses_count: 45, revelation_place: 'makkah' },
            { id: 36, name_arabic: 'يس', translated_name: { name: 'Ya-Sin' }, verses_count: 83, revelation_place: 'makkah' },
            { id: 37, name_arabic: 'الصافات', translated_name: { name: 'As-Saffat (Those Who Set The Ranks)' }, verses_count: 182, revelation_place: 'makkah' },
            { id: 38, name_arabic: 'ص', translated_name: { name: 'Sad' }, verses_count: 88, revelation_place: 'makkah' },
            { id: 39, name_arabic: 'الزمر', translated_name: { name: 'Az-Zumar (The Troops)' }, verses_count: 75, revelation_place: 'makkah' },
            { id: 40, name_arabic: 'غافر', translated_name: { name: 'Ghafir (The Forgiver)' }, verses_count: 85, revelation_place: 'makkah' },
            { id: 41, name_arabic: 'فصلت', translated_name: { name: 'Fussilat (Explained In Detail)' }, verses_count: 54, revelation_place: 'makkah' },
            { id: 42, name_arabic: 'الشورى', translated_name: { name: 'Ash-Shura (The Consultation)' }, verses_count: 53, revelation_place: 'makkah' },
            { id: 43, name_arabic: 'الزخرف', translated_name: { name: 'Az-Zukhruf (The Ornaments of Gold)' }, verses_count: 89, revelation_place: 'makkah' },
            { id: 44, name_arabic: 'الدخان', translated_name: { name: 'Ad-Dukhan (The Smoke)' }, verses_count: 59, revelation_place: 'makkah' },
            { id: 45, name_arabic: 'الجاثية', translated_name: { name: 'Al-Jathiyah (The Crouching)' }, verses_count: 37, revelation_place: 'makkah' },
            { id: 46, name_arabic: 'الأحقاف', translated_name: { name: 'Al-Ahqaf (The Wind-Curved Sandhills)' }, verses_count: 35, revelation_place: 'makkah' },
            { id: 47, name_arabic: 'محمد', translated_name: { name: 'Muhammad' }, verses_count: 38, revelation_place: 'madinah' },
            { id: 48, name_arabic: 'الفتح', translated_name: { name: 'Al-Fath (The Victory)' }, verses_count: 29, revelation_place: 'madinah' },
            { id: 49, name_arabic: 'الحجرات', translated_name: { name: 'Al-Hujurat (The Rooms)' }, verses_count: 18, revelation_place: 'madinah' },
            { id: 50, name_arabic: 'ق', translated_name: { name: 'Qaf' }, verses_count: 45, revelation_place: 'makkah' },
            { id: 51, name_arabic: 'الذاريات', translated_name: { name: 'Adh-Dhariyat (The Winnowing Winds)' }, verses_count: 60, revelation_place: 'makkah' },
            { id: 52, name_arabic: 'الطور', translated_name: { name: 'At-Tur (The Mount)' }, verses_count: 49, revelation_place: 'makkah' },
            { id: 53, name_arabic: 'النجم', translated_name: { name: 'An-Najm (The Star)' }, verses_count: 62, revelation_place: 'makkah' },
            { id: 54, name_arabic: 'القمر', translated_name: { name: 'Al-Qamar (The Moon)' }, verses_count: 55, revelation_place: 'makkah' },
            { id: 55, name_arabic: 'الرحمن', translated_name: { name: 'Ar-Rahman (The Beneficent)' }, verses_count: 78, revelation_place: 'madinah' },
            { id: 56, name_arabic: 'الواقعة', translated_name: { name: 'Al-Waqiah (The Inevitable)' }, verses_count: 96, revelation_place: 'makkah' },
            { id: 57, name_arabic: 'الحديد', translated_name: { name: 'Al-Hadid (The Iron)' }, verses_count: 29, revelation_place: 'madinah' },
            { id: 58, name_arabic: 'المجادلة', translated_name: { name: 'Al-Mujadilah (The Pleading Woman)' }, verses_count: 22, revelation_place: 'madinah' },
            { id: 59, name_arabic: 'الحشر', translated_name: { name: 'Al-Hashr (The Exile)' }, verses_count: 24, revelation_place: 'madinah' },
            { id: 60, name_arabic: 'الممتحنة', translated_name: { name: 'Al-Mumtahanah (She That Is To Be Examined)' }, verses_count: 13, revelation_place: 'madinah' },
            { id: 61, name_arabic: 'الصف', translated_name: { name: 'As-Saff (The Ranks)' }, verses_count: 14, revelation_place: 'madinah' },
            { id: 62, name_arabic: 'الجمعة', translated_name: { name: 'Al-Jumuah (The Congregation, Friday)' }, verses_count: 11, revelation_place: 'madinah' },
            { id: 63, name_arabic: 'المنافقون', translated_name: { name: 'Al-Munafiqun (The Hypocrites)' }, verses_count: 11, revelation_place: 'madinah' },
            { id: 64, name_arabic: 'التغابن', translated_name: { name: 'At-Taghabun (The Mutual Disillusion)' }, verses_count: 18, revelation_place: 'madinah' },
            { id: 65, name_arabic: 'الطلاق', translated_name: { name: 'At-Talaq (The Divorce)' }, verses_count: 12, revelation_place: 'madinah' },
            { id: 66, name_arabic: 'التحريم', translated_name: { name: 'At-Tahrim (The Prohibition)' }, verses_count: 12, revelation_place: 'madinah' },
            { id: 67, name_arabic: 'الملك', translated_name: { name: 'Al-Mulk (The Sovereignty)' }, verses_count: 30, revelation_place: 'makkah' },
            { id: 68, name_arabic: 'القلم', translated_name: { name: 'Al-Qalam (The Pen)' }, verses_count: 52, revelation_place: 'makkah' },
            { id: 69, name_arabic: 'الحاقة', translated_name: { name: 'Al-Haqqah (The Reality)' }, verses_count: 52, revelation_place: 'makkah' },
            { id: 70, name_arabic: 'المعارج', translated_name: { name: 'Al-Maarij (The Ascending Stairways)' }, verses_count: 44, revelation_place: 'makkah' },
            { id: 71, name_arabic: 'نوح', translated_name: { name: 'Nuh (Noah)' }, verses_count: 28, revelation_place: 'makkah' },
            { id: 72, name_arabic: 'الجن', translated_name: { name: 'Al-Jinn (The Jinn)' }, verses_count: 28, revelation_place: 'makkah' },
            { id: 73, name_arabic: 'المزمل', translated_name: { name: 'Al-Muzzammil (The Enshrouded One)' }, verses_count: 20, revelation_place: 'makkah' },
            { id: 74, name_arabic: 'المدثر', translated_name: { name: 'Al-Muddaththir (The Cloaked One)' }, verses_count: 56, revelation_place: 'makkah' },
            { id: 75, name_arabic: 'القيامة', translated_name: { name: 'Al-Qiyamah (The Resurrection)' }, verses_count: 40, revelation_place: 'makkah' },
            { id: 76, name_arabic: 'الإنسان', translated_name: { name: 'Al-Insan (The Man)' }, verses_count: 31, revelation_place: 'madinah' },
            { id: 77, name_arabic: 'المرسلات', translated_name: { name: 'Al-Mursalat (The Emissaries)' }, verses_count: 50, revelation_place: 'makkah' },
            { id: 78, name_arabic: 'النبأ', translated_name: { name: 'An-Naba (The Tidings)' }, verses_count: 40, revelation_place: 'makkah' },
            { id: 79, name_arabic: 'النازعات', translated_name: { name: 'An-Naziat (Those Who Drag Forth)' }, verses_count: 46, revelation_place: 'makkah' },
            { id: 80, name_arabic: 'عبس', translated_name: { name: 'Abasa (He Frowned)' }, verses_count: 42, revelation_place: 'makkah' },
            { id: 81, name_arabic: 'التكوير', translated_name: { name: 'At-Takwir (The Overthrowing)' }, verses_count: 29, revelation_place: 'makkah' },
            { id: 82, name_arabic: 'الانفطار', translated_name: { name: 'Al-Infitar (The Cleaving)' }, verses_count: 19, revelation_place: 'makkah' },
            { id: 83, name_arabic: 'المطففين', translated_name: { name: 'Al-Mutaffifin (The Defrauding)' }, verses_count: 36, revelation_place: 'makkah' },
            { id: 84, name_arabic: 'الانشقاق', translated_name: { name: 'Al-Inshiqaq (The Splitting Open)' }, verses_count: 25, revelation_place: 'makkah' },
            { id: 85, name_arabic: 'البروج', translated_name: { name: 'Al-Buruj (The Mansions of The Stars)' }, verses_count: 22, revelation_place: 'makkah' },
            { id: 86, name_arabic: 'الطارق', translated_name: { name: 'At-Tariq (The Morning Star)' }, verses_count: 17, revelation_place: 'makkah' },
            { id: 87, name_arabic: 'الأعلى', translated_name: { name: 'Al-Ala (The Most High)' }, verses_count: 19, revelation_place: 'makkah' },
            { id: 88, name_arabic: 'الغاشية', translated_name: { name: 'Al-Ghashiyah (The Overwhelming)' }, verses_count: 26, revelation_place: 'makkah' },
            { id: 89, name_arabic: 'الفجر', translated_name: { name: 'Al-Fajr (The Dawn)' }, verses_count: 30, revelation_place: 'makkah' },
            { id: 90, name_arabic: 'البلد', translated_name: { name: 'Al-Balad (The City)' }, verses_count: 20, revelation_place: 'makkah' },
            { id: 91, name_arabic: 'الشمس', translated_name: { name: 'Ash-Shams (The Sun)' }, verses_count: 15, revelation_place: 'makkah' },
            { id: 92, name_arabic: 'الليل', translated_name: { name: 'Al-Layl (The Night)' }, verses_count: 21, revelation_place: 'makkah' },
            { id: 93, name_arabic: 'الضحى', translated_name: { name: 'Ad-Duhaa (The Morning Hours)' }, verses_count: 11, revelation_place: 'makkah' },
            { id: 94, name_arabic: 'الشرح', translated_name: { name: 'Ash-Sharh (The Relief)' }, verses_count: 8, revelation_place: 'makkah' },
            { id: 95, name_arabic: 'التين', translated_name: { name: 'At-Tin (The Fig)' }, verses_count: 8, revelation_place: 'makkah' },
            { id: 96, name_arabic: 'العلق', translated_name: { name: 'Al-Alaq (The Clot)' }, verses_count: 19, revelation_place: 'makkah' },
            { id: 97, name_arabic: 'القدر', translated_name: { name: 'Al-Qadr (The Power, Fate)' }, verses_count: 5, revelation_place: 'makkah' },
            { id: 98, name_arabic: 'البينة', translated_name: { name: 'Al-Bayyinah (The Evidence)' }, verses_count: 8, revelation_place: 'madinah' },
            { id: 99, name_arabic: 'الزلزلة', translated_name: { name: 'Az-Zalzalah (The Earthquake)' }, verses_count: 8, revelation_place: 'madinah' },
            { id: 100, name_arabic: 'العاديات', translated_name: { name: 'Al-Adiyat (The Courser)' }, verses_count: 11, revelation_place: 'makkah' },
            { id: 101, name_arabic: 'القارعة', translated_name: { name: 'Al-Qariah (The Calamity)' }, verses_count: 11, revelation_place: 'makkah' },
            { id: 102, name_arabic: 'التكاثر', translated_name: { name: 'At-Takathur (The Rivalry In World Increase)' }, verses_count: 8, revelation_place: 'makkah' },
            { id: 103, name_arabic: 'العصر', translated_name: { name: 'Al-Asr (The Declining Day)' }, verses_count: 3, revelation_place: 'makkah' },
            { id: 104, name_arabic: 'الهمزة', translated_name: { name: 'Al-Humazah (The Traducer)' }, verses_count: 9, revelation_place: 'makkah' },
            { id: 105, name_arabic: 'الفيل', translated_name: { name: 'Al-Fil (The Elephant)' }, verses_count: 5, revelation_place: 'makkah' },
            { id: 106, name_arabic: 'قريش', translated_name: { name: 'Quraysh' }, verses_count: 4, revelation_place: 'makkah' },
            { id: 107, name_arabic: 'الماعون', translated_name: { name: 'Al-Maun (The Small Kindnesses)' }, verses_count: 7, revelation_place: 'makkah' },
            { id: 108, name_arabic: 'الكوثر', translated_name: { name: 'Al-Kawthar (The Abundance)' }, verses_count: 3, revelation_place: 'makkah' },
            { id: 109, name_arabic: 'الكافرون', translated_name: { name: 'Al-Kafirun (The Disbelievers)' }, verses_count: 6, revelation_place: 'makkah' },
            { id: 110, name_arabic: 'النصر', translated_name: { name: 'An-Nasr (The Divine Support)' }, verses_count: 3, revelation_place: 'madinah' },
            { id: 111, name_arabic: 'المسد', translated_name: { name: 'Al-Masad (The Palm Fibre)' }, verses_count: 5, revelation_place: 'makkah' },
            { id: 112, name_arabic: 'الإخلاص', translated_name: { name: 'Al-Ikhlas (The Sincerity)' }, verses_count: 4, revelation_place: 'makkah' },
            { id: 113, name_arabic: 'الفلق', translated_name: { name: 'Al-Falaq (The Daybreak)' }, verses_count: 5, revelation_place: 'makkah' },
            { id: 114, name_arabic: 'الناس', translated_name: { name: 'An-Nas (Mankind)' }, verses_count: 6, revelation_place: 'makkah' }
        ];
    }

    async loadAllSurahs() {
        try {
            console.log('🔄 loadAllSurahs method called');
            console.log('📊 App state:', { 
                gridExists: !!document.getElementById('surah-grid'),
                loadingExists: !!document.getElementById('surah-loading'),
                appInitialized: true
            });
            
            this.showSurahLoading();
            console.log('📋 Loading indicator shown, calling loadSurahs...');
            
            await this.loadSurahs();
            console.log('✅ loadSurahs completed successfully');
            
        } catch (error) {
            console.error('❌ Critical error in loadAllSurahs:', error);
            this.hideLoading();
            this.showError(`Failed to load Surahs: ${error.message}`);
        }
    }

    loadPopularSurahs() {
        console.log('Loading popular Surahs...');
        const popularSurahs = [
            { id: 1, name_arabic: 'الفاتحة', translated_name: { name: 'Al-Fatihah (The Opening)' }, verses_count: 7, revelation_place: 'makkah' },
            { id: 2, name_arabic: 'البقرة', translated_name: { name: 'Al-Baqarah (The Cow)' }, verses_count: 286, revelation_place: 'madinah' },
            { id: 18, name_arabic: 'الكهف', translated_name: { name: 'Al-Kahf (The Cave)' }, verses_count: 110, revelation_place: 'makkah' },
            { id: 36, name_arabic: 'يس', translated_name: { name: 'Ya-Sin' }, verses_count: 83, revelation_place: 'makkah' },
            { id: 55, name_arabic: 'الرحمن', translated_name: { name: 'Ar-Rahman (The Beneficent)' }, verses_count: 78, revelation_place: 'madinah' },
            { id: 67, name_arabic: 'الملك', translated_name: { name: 'Al-Mulk (The Sovereignty)' }, verses_count: 30, revelation_place: 'makkah' },
            { id: 112, name_arabic: 'الإخلاص', translated_name: { name: 'Al-Ikhlas (The Sincerity)' }, verses_count: 4, revelation_place: 'makkah' },
            { id: 113, name_arabic: 'الفلق', translated_name: { name: 'Al-Falaq (The Daybreak)' }, verses_count: 5, revelation_place: 'makkah' },
            { id: 114, name_arabic: 'الناس', translated_name: { name: 'An-Nas (Mankind)' }, verses_count: 6, revelation_place: 'makkah' }
        ];

        this.displaySurahs(popularSurahs);
    }

    createSurahCard(surah) {
        const card = document.createElement('div');
        card.className = 'surah-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer';
        card.onclick = () => this.loadSurahContent(surah.id);

        const quranComUrl = this.getQuranComUrl(surah.id);

        card.innerHTML = `
            <div class="card-header text-center">
                <h3 class="text-lg font-bold">${surah.name_arabic}</h3>
                <p class="text-sm opacity-90">${surah.translated_name.name}</p>
            </div>
            <div class="card-body text-center p-4">
                <div class="text-2xl font-bold text-quran-green mb-2">${surah.id}</div>
                <p class="text-sm text-gray-600 mb-2">${surah.verses_count} verses</p>
                <p class="text-xs text-gray-500">${surah.revelation_place === 'makkah' ? 'Makki' : 'Madani'}</p>
                <div class="mt-3 flex justify-center space-x-2">
                    <button onclick="event.stopPropagation(); app.previewSurah(${surah.id})" class="text-quran-green hover:text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors" title="Preview audio">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <a href="${quranComUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation();" class="text-quran-blue hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Read on Quran.com">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <i class="fas fa-book-open text-quran-blue"></i>
                </div>
            </div>
        `;

        return card;
    }

    async loadSurahContent(surahId) {
        try {
            console.log(`📖 Opening Surah ${surahId}...`);
            this.showLoading();

            // Validate Surah ID
            const surahIdNum = parseInt(surahId);
            if (isNaN(surahIdNum) || surahIdNum < 1 || surahIdNum > 114) {
                throw new Error(`Invalid Surah ID: ${surahId}. Must be between 1-114.`);
            }

            // Create or show surah content section
            this.createSurahPage(surahIdNum);

            // Load surah data with enhanced error handling
            let surahInfo, verses;
            
            try {
                surahInfo = await this.fetchSurahInfo(surahIdNum);
                console.log(`✅ Loaded Surah info for ${surahInfo.name_arabic}`);
            } catch (error) {
                console.warn('Surah info failed, using offline data:', error);
                surahInfo = this.getSurahInfoFromDatabase(surahIdNum);
            }

            try {
                verses = await this.fetchSurahVerses(surahIdNum);
                console.log(`✅ Loaded ${verses.length} verses`);
            } catch (error) {
                console.warn('Verse loading failed, using offline data:', error);
                verses = this.getFallbackVerses(surahIdNum);
            }

            // Ensure we have valid data
            if (!surahInfo) {
                surahInfo = this.getSurahInfoFromDatabase(surahIdNum);
            }
            if (!verses || verses.length === 0) {
                verses = this.getFallbackVerses(surahIdNum);
            }

            this.displaySurahContent(surahInfo, verses);
            this.hideLoading();

            console.log(`✅ Successfully opened Surah ${surahIdNum}: ${surahInfo.name_arabic}`);

        } catch (error) {
            console.error('❌ Critical error loading Surah:', error);
            this.hideLoading();
            
            // Show user-friendly error with retry option
            this.showSurahError(surahId, error.message);
        }
    }

    showSurahError(surahId, errorMessage) {
        const surahPage = document.getElementById('surah-page');
        if (surahPage) {
            const quranComUrl = this.getQuranComUrl(surahId);
            
            const errorContent = `
                <div class="container mx-auto px-4 py-8">
                    <div class="text-center">
                        <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                            <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                            <h3 class="text-xl font-semibold text-red-700 mb-2">Error Loading Surah ${surahId}</h3>
                            <p class="text-red-600 mb-4">${errorMessage}</p>
                            <div class="flex justify-center space-x-4">
                                <button onclick="app.loadSurahContent(${surahId})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                                    <i class="fas fa-redo mr-2"></i>Retry
                                </button>
                                <button onclick="app.goBackToHome()" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                                    <i class="fas fa-arrow-left mr-2"></i>Back to Home
                                </button>
                                <a href="${quranComUrl}" target="_blank" rel="noopener" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                                    <i class="fas fa-external-link-alt mr-2"></i>Read on Quran.com
                                </a>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 class="font-semibold text-blue-700 mb-2">Troubleshooting Tips:</h4>
                            <ul class="text-blue-600 text-sm space-y-1">
                                <li>• Check your internet connection</li>
                                <li>• Try refreshing the page</li>
                                <li>• Clear your browser cache</li>
                                <li>• Try a different Surah first</li>
                                <li>• Use the "Read on Quran.com" button above for guaranteed access</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            surahPage.innerHTML = errorContent;
            surahPage.style.display = 'block';
        }
    }

    createSurahPage(surahId) {
        // Hide homepage content and show surah page
        document.querySelectorAll('section:not(#surah-page)').forEach(section => {
            section.style.display = 'none';
        });

        // Create surah page if it doesn't exist
        if (!document.getElementById('surah-page')) {
            const surahPage = document.createElement('section');
            surahPage.id = 'surah-page';
            surahPage.className = 'py-8 bg-gradient-to-br from-blue-50 to-quran-light min-h-screen';
            surahPage.innerHTML = `
                <div class="container mx-auto px-4">
                    <div class="mb-6">
                        <button onclick="app.goBackToHome()" class="bg-quran-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors mb-4">
                            <i class="fas fa-arrow-left mr-2"></i>Back to Home
                        </button>
                        <div class="bg-white rounded-xl shadow-md p-6">
                            <div id="surah-header" class="text-center mb-6">
                                <!-- Surah info will be loaded here -->
                            </div>
                            <div class="search-container mb-6">
                                <input type="text" id="ayah-search" placeholder="Search within this Surah..." class="search-input">
                                <button class="search-btn"><i class="fas fa-search"></i></button>
                            </div>
                            <div id="surah-content" class="space-y-4">
                                <!-- Verses will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(surahPage);
        } else {
            document.getElementById('surah-page').style.display = 'block';
        }

        // Setup search functionality
        const searchInput = document.getElementById('ayah-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchWithinSurah(e.target.value));
        }
    }

    async fetchSurahInfo(surahId) {
        try {
            // Try multiple sources for Surah info
            const apiSources = [
                `https://api.quran.com/api/v4/chapters/${surahId}?language=en`,
                `https://cdn.jsdelivr.net/gh/risan/quran-json@main/dist/chapters.json`
            ];

            for (const apiUrl of apiSources) {
                try {
                    const response = await fetch(apiUrl, {
                        mode: 'cors',
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        // Handle different API response formats
                        if (data.chapter) {
                            return data.chapter;
                        } else if (Array.isArray(data)) {
                            // Find the specific surah from array
                            const surah = data.find(s => s.id === parseInt(surahId));
                            if (surah) return surah;
                        } else if (data.id) {
                            return data;
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to fetch Surah info from ${apiUrl}:`, error);
                }
            }

            // Fallback to offline data
            return this.getSurahInfoFromDatabase(surahId);
            
        } catch (error) {
            console.error('All Surah info sources failed:', error);
            return this.getSurahInfoFromDatabase(surahId);
        }
    }

    getSurahInfoFromDatabase(surahId) {
        const allSurahs = this.getCompleteSurahDatabase();
        const surah = allSurahs.find(s => s.id === parseInt(surahId));
        
        if (surah) {
            return {
                id: surah.id,
                name_arabic: surah.name_arabic,
                name_simple: surah.translated_name.name,
                translated_name: surah.translated_name,
                verses_count: surah.verses_count,
                revelation_place: surah.revelation_place
            };
        }
        
        // Default fallback
        return {
            id: surahId,
            name_arabic: `سورة ${surahId}`,
            name_simple: `Surah ${surahId}`,
            translated_name: { name: `Surah ${surahId}` },
            verses_count: 10,
            revelation_place: 'makkah'
        };
    }

    async fetchSurahVerses(surahId) {
        try {
            console.log(`📖 Loading verses for Surah ${surahId}...`);
            
            // Multiple API sources for reliability
            const apiSources = {
                arabic: [
                    `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}`,
                    `https://cdn.jsdelivr.net/gh/risan/quran-json@main/dist/verses/${surahId}.json`
                ],
                english: [
                    `https://api.quran.com/api/v4/quran/translations/20?chapter_number=${surahId}`,
                    `https://cdn.jsdelivr.net/gh/risan/quran-json@main/dist/translations/en/${surahId}.json`
                ],
                urdu: [
                    `https://api.quran.com/api/v4/quran/translations/158?chapter_number=${surahId}`,
                    `https://cdn.jsdelivr.net/gh/risan/quran-json@main/dist/translations/ur/${surahId}.json`
                ]
            };

            const fetchWithFallback = async (urls) => {
                for (const url of urls) {
                    try {
                        const response = await fetch(url, {
                            mode: 'cors',
                            headers: { 'Accept': 'application/json' }
                        });
                        if (response.ok) {
                            return await response.json();
                        }
                    } catch (error) {
                        console.warn(`Failed to fetch from ${url}:`, error);
                    }
                }
                return null;
            };

            const [arabicData, englishData, urduData] = await Promise.all([
                fetchWithFallback(apiSources.arabic),
                fetchWithFallback(apiSources.english),
                fetchWithFallback(apiSources.urdu)
            ]);

            if (!arabicData) {
                throw new Error('Failed to fetch Arabic verses from all sources');
            }

            // Extract verses from API response format
            const verses = arabicData.verses || arabicData;
            
            if (!Array.isArray(verses)) {
                throw new Error('Invalid verse data format');
            }

            console.log(`✅ Loaded ${verses.length} verses for Surah ${surahId}`);

            return verses.map((verse, index) => ({
                ...verse,
                englishTranslation: englishData?.translations?.[index]?.text || 
                                   englishData?.[index]?.text || 
                                   'English translation not available',
                urduTranslation: urduData?.translations?.[index]?.text || 
                                urduData?.[index]?.text || 
                                'اردو ترجمہ دستیاب نہیں'
            }));
        } catch (error) {
            console.error('Error fetching verses:', error);
            console.log(`🔄 Loading offline verses for Surah ${surahId}...`);
            return this.getFallbackVerses(surahId);
        }
    }

    getFallbackVerses(surahId) {
        // Enhanced fallback verses with sample content for major Surahs
        const popularSurahVerses = {
            1: [ // Al-Fatihah
                {
                    verse_number: 1,
                    text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
                    verse_key: '1:1',
                    englishTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
                    urduTranslation: 'اللہ کے نام سے جو بہت مہربان، نہایت رحم والا ہے'
                },
                {
                    verse_number: 2,
                    text_uthmani: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
                    verse_key: '1:2',
                    englishTranslation: '[All] praise is [due] to Allah, Lord of the worlds.',
                    urduTranslation: 'تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے'
                },
                {
                    verse_number: 3,
                    text_uthmani: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
                    verse_key: '1:3',
                    englishTranslation: 'The Entirely Merciful, the Especially Merciful.',
                    urduTranslation: 'بہت مہربان، نہایت رحم والا'
                },
                {
                    verse_number: 4,
                    text_uthmani: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
                    verse_key: '1:4',
                    englishTranslation: 'Sovereign of the Day of Recompense.',
                    urduTranslation: 'روز جزا کا مالک'
                },
                {
                    verse_number: 5,
                    text_uthmani: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
                    verse_key: '1:5',
                    englishTranslation: 'It is You we worship and You we ask for help.',
                    urduTranslation: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں'
                },
                {
                    verse_number: 6,
                    text_uthmani: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
                    verse_key: '1:6',
                    englishTranslation: 'Guide us to the straight path.',
                    urduTranslation: 'ہمیں سیدھا راستہ دکھا'
                },
                {
                    verse_number: 7,
                    text_uthmani: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
                    verse_key: '1:7',
                    englishTranslation: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
                    urduTranslation: 'ان لوگوں کا راستہ جن پر تو نے انعام کیا ہے، ان کا نہیں جن پر غضب ہوا اور نہ گمراہوں کا'
                }
            ],
            36: [ // Ya-Sin
                {
                    verse_number: 1,
                    text_uthmani: 'يس',
                    verse_key: '36:1',
                    englishTranslation: 'Ya, Sin.',
                    urduTranslation: 'یٰس'
                },
                {
                    verse_number: 2,
                    text_uthmani: 'وَٱلْقُرْءَانِ ٱلْحَكِيمِ',
                    verse_key: '36:2',
                    englishTranslation: 'By the wise Qur\'an.',
                    urduTranslation: 'حکمت والے قرآن کی قسم'
                }
            ],
            67: [ // Al-Mulk
                {
                    verse_number: 1,
                    text_uthmani: 'تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ',
                    verse_key: '67:1',
                    englishTranslation: 'Blessed is He in whose hand is dominion, and He is over all things competent.',
                    urduTranslation: 'بابرکت ہے وہ جس کے ہاتھ میں بادشاہی ہے اور وہ ہر چیز پر قادر ہے'
                }
            ],
            112: [ // Al-Ikhlas
                {
                    verse_number: 1,
                    text_uthmani: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
                    verse_key: '112:1',
                    englishTranslation: 'Say, "He is Allah, [who is] One.',
                    urduTranslation: 'کہو: وہ اللہ یکتا ہے'
                },
                {
                    verse_number: 2,
                    text_uthmani: 'ٱللَّهُ ٱلصَّمَدُ',
                    verse_key: '112:2',
                    englishTranslation: 'Allah, the Eternal Refuge.',
                    urduTranslation: 'اللہ بے نیاز ہے'
                },
                {
                    verse_number: 3,
                    text_uthmani: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
                    verse_key: '112:3',
                    englishTranslation: 'He neither begets nor is born.',
                    urduTranslation: 'نہ وہ کسی کا باپ ہے اور نہ کسی کا بیٹا'
                },
                {
                    verse_number: 4,
                    text_uthmani: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
                    verse_key: '112:4',
                    englishTranslation: 'Nor is there to Him any equivalent.',
                    urduTranslation: 'اور کوئی اس کا ہمسر نہیں'
                }
            ],
            113: [ // Al-Falaq
                {
                    verse_number: 1,
                    text_uthmani: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
                    verse_key: '113:1',
                    englishTranslation: 'Say, "I seek refuge in the Lord of daybreak.',
                    urduTranslation: 'کہو کہ میں صبح کے رب کی پناہ مانگتا ہوں'
                },
                {
                    verse_number: 2,
                    text_uthmani: 'مِن شَرِّ مَا خَلَقَ',
                    verse_key: '113:2',
                    englishTranslation: 'From the evil of that which He created.',
                    urduTranslation: 'جو کچھ اس نے پیدا کیا ہے اس کے شر سے'
                }
            ],
            114: [ // An-Nas
                {
                    verse_number: 1,
                    text_uthmani: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
                    verse_key: '114:1',
                    englishTranslation: 'Say, "I seek refuge in the Lord of mankind.',
                    urduTranslation: 'کہو کہ میں لوگوں کے رب کی پناہ مانگتا ہوں'
                },
                {
                    verse_number: 2,
                    text_uthmani: 'مَلِكِ ٱلنَّاسِ',
                    verse_key: '114:2',
                    englishTranslation: 'The Sovereign of mankind.',
                    urduTranslation: 'لوگوں کے بادشاہ کی'
                }
            ]
        };

        // If we have specific verses for this Surah, return them
        if (popularSurahVerses[surahId]) {
            console.log(`✅ Loaded offline verses for Surah ${surahId}`);
            return popularSurahVerses[surahId];
        }

        // For other Surahs, generate sample verses based on Surah info
        const surahInfo = this.getSurahInfoFromDatabase(surahId);
        const verseCount = Math.min(surahInfo.verses_count, 5); // Show up to 5 sample verses
        
        const sampleVerses = [];
        for (let i = 1; i <= verseCount; i++) {
            sampleVerses.push({
                verse_number: i,
                text_uthmani: `بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ`, // Default Arabic text
                verse_key: `${surahId}:${i}`,
                englishTranslation: `This is verse ${i} of Surah ${surahInfo.translated_name.name}. Please connect to the internet to load complete verses with accurate translations.`,
                urduTranslation: `یہ سورہ ${surahInfo.translated_name.name} کی آیت ${i} ہے۔ مکمل آیات اور درست ترجمے کے لیے برائے کرم انٹرنیٹ سے جڑیں۔`
            });
        }

        // Add a note about offline mode
        sampleVerses.push({
            verse_number: verseCount + 1,
            text_uthmani: '• وصل بالإنترنت لتحميل جميع الآيات •',
            verse_key: `${surahId}:${verseCount + 1}`,
            englishTranslation: '• Connect to internet to load all verses with complete translations •',
            urduTranslation: '• تمام آیات اور مکمل ترجمے کے لیے انٹرنیٹ سے جڑیں •'
        });

        console.log(`📚 Generated ${sampleVerses.length} sample verses for Surah ${surahId}`);
        return sampleVerses;
    }

    displaySurahContent(surahInfo, verses) {
        const header = document.getElementById('surah-header');
        const content = document.getElementById('surah-content');

        if (header) {
            const quranComUrl = this.getQuranComUrl(surahInfo.id);
            
            header.innerHTML = `
                <h2 class="text-3xl font-bold text-quran-dark mb-2">${surahInfo.name_arabic}</h2>
                <p class="text-xl text-quran-blue mb-2">${surahInfo.translated_name.name}</p>
                <p class="text-gray-600">${surahInfo.verses_count} verses • ${surahInfo.revelation_place === 'makkah' ? 'Makki' : 'Madani'}</p>
                <div class="mt-4 flex justify-center space-x-4">
                    <button onclick="app.playSurah(${surahInfo.id})" id="surah-play-btn-${surahInfo.id}" class="bg-quran-green hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-play mr-2"></i>Play Surah
                    </button>
                    <button onclick="app.shareSurah(${surahInfo.id})" class="bg-quran-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-share mr-2"></i>Share
                    </button>
                    <button onclick="app.bookmarkSurah(${surahInfo.id})" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-bookmark mr-2"></i>Bookmark
                    </button>
                    <a href="${quranComUrl}" target="_blank" rel="noopener" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-external-link-alt mr-2"></i>Read on Quran.com
                    </a>
                </div>
                <div class="mt-4">
                    <audio id="surah-audio-${surahInfo.id}" preload="none" controls class="w-full hidden">
                        <source src="https://server8.mp3quran.net/afs/${surahInfo.id.toString().padStart(3, '0')}.mp3" type="audio/mpeg">
                        <source src="https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahInfo.id}.mp3" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            `;
        }

        if (content) {
            content.innerHTML = verses.map(verse => this.createVerseElement(verse)).join('');
        }

        this.currentSurah = surahInfo.id;
    }

    createVerseElement(verse) {
        const isBookmarked = this.isBookmarked(verse.verse_key);

        return `
            <div class="ayah-container bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow" data-verse="${verse.verse_key}">
                <div class="flex justify-between items-start mb-4">
                    <span class="ayah-number">${verse.verse_number}</span>
                    <div class="flex space-x-2">
                        <button onclick="app.bookmarkAyah('${verse.verse_key}')" class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" title="Bookmark this verse">
                            <i class="fas ${isBookmarked ? 'fa-bookmark' : 'fa-bookmark-o'}"></i>
                        </button>
                    </div>
                </div>
                <div class="arabic-text mb-4 text-right leading-loose" dir="rtl">
                    ${verse.text_uthmani}
                </div>
                <div class="translations-container">
                    <div class="translation-controls mb-3 flex justify-center space-x-4">
                        <button onclick="app.showTranslation('${verse.verse_key}', 'english')" 
                                class="translation-toggle active px-3 py-1 rounded-full text-sm bg-quran-blue text-white hover:bg-blue-600 transition-colors"
                                data-lang="english" data-verse="${verse.verse_key}">
                            English
                        </button>
                        <button onclick="app.showTranslation('${verse.verse_key}', 'urdu')" 
                                class="translation-toggle px-3 py-1 rounded-full text-sm bg-gray-300 text-gray-700 hover:bg-quran-green hover:text-white transition-colors"
                                data-lang="urdu" data-verse="${verse.verse_key}">
                            اردو
                        </button>
                        <button onclick="app.showTranslation('${verse.verse_key}', 'both')" 
                                class="translation-toggle px-3 py-1 rounded-full text-sm bg-gray-300 text-gray-700 hover:bg-quran-green hover:text-white transition-colors"
                                data-lang="both" data-verse="${verse.verse_key}">
                            Both
                        </button>
                    </div>
                    <div class="translation-text-english translation-content active" data-verse="${verse.verse_key}" data-lang="english">
                        <div class="text-left mb-2">
                            <span class="text-sm font-semibold text-quran-blue">English:</span>
                            <p class="mt-1">${verse.englishTranslation || verse.translation || 'English translation not available'}</p>
                        </div>
                    </div>
                    <div class="translation-text-urdu translation-content hidden" data-verse="${verse.verse_key}" data-lang="urdu">
                        <div class="text-right mb-2" dir="rtl">
                            <span class="text-sm font-semibold text-quran-green">اردو:</span>
                            <p class="mt-1">${verse.urduTranslation || 'اردو ترجمہ دستیاب نہیں'}</p>
                        </div>
                    </div>
                    <div class="translation-text-both translation-content hidden" data-verse="${verse.verse_key}" data-lang="both">
                        <div class="text-left mb-3">
                            <span class="text-sm font-semibold text-quran-blue">English:</span>
                            <p class="mt-1">${verse.englishTranslation || verse.translation || 'English translation not available'}</p>
                        </div>
                        <div class="text-right" dir="rtl">
                            <span class="text-sm font-semibold text-quran-green">اردو:</span>
                            <p class="mt-1">${verse.urduTranslation || 'اردو ترجمہ دستیاب نہیں'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    playSurah(surahId) {
        console.log('🎵 Attempting to play Surah', surahId);
        
        // Stop any currently playing audio
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }

        const audioElement = document.getElementById(`surah-audio-${surahId}`);
        const playBtn = document.getElementById(`surah-play-btn-${surahId}`);
        
        if (!audioElement) {
            console.error('❌ Audio element not found for Surah', surahId);
            this.showNotification('Audio player not available for this Surah');
            return;
        }

        // Test audio support
        if (!this.canPlayAudio()) {
            console.error('❌ Audio not supported on this device');
            this.showNotification('Audio playback not supported on this device');
            return;
        }

        if (this.isPlaying && this.audioPlayer === audioElement) {
            // Pause if currently playing this Surah
            this.pauseSurah(surahId);
            return;
        }

        // Show audio controls
        audioElement.classList.remove('hidden');
        
        // Update button
        if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
            playBtn.disabled = true;
        }

        // Set up audio events
        audioElement.onloadstart = () => {
            console.log('Audio loading started...');
        };

        audioElement.oncanplay = () => {
            console.log('Audio can play');
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';
                playBtn.disabled = false;
            }
        };

        audioElement.onerror = (e) => {
            console.error('Audio error:', e);
            this.showNotification('Failed to load audio. Please try again.');
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Play Surah';
                playBtn.disabled = false;
            }
            audioElement.classList.add('hidden');
        };

        audioElement.onended = () => {
            console.log('Audio ended');
            this.isPlaying = false;
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Play Surah';
            }
        };

        audioElement.onpause = () => {
            this.isPlaying = false;
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Play Surah';
            }
        };

        audioElement.onplay = () => {
            this.isPlaying = true;
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';
            }
        };

        // Start playing
        this.audioPlayer = audioElement;
        audioElement.play().catch(error => {
            console.error('Play failed:', error);
            this.showNotification('Failed to play audio. Please check your internet connection.');
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Play Surah';
                playBtn.disabled = false;
            }
            audioElement.classList.add('hidden');
        });
    }

    pauseSurah(surahId) {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.isPlaying = false;
            
            const playBtn = document.getElementById(`surah-play-btn-${surahId}`);
            if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Play Surah';
            }
        }
    }

    previewSurah(surahId) {
        console.log('Previewing Surah', surahId);
        
        // Stop any currently playing audio
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }

        // Create a temporary audio element for preview
        if (this.previewAudio) {
            this.previewAudio.pause();
            this.previewAudio = null;
        }

        const audio = new Audio();
        const surahNumber = surahId.toString().padStart(3, '0');
        
        // Try multiple audio sources
        const audioSources = [
            `https://server8.mp3quran.net/afs/${surahNumber}.mp3`,
            `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahId}.mp3`
        ];

        let currentSourceIndex = 0;

        const tryNextSource = () => {
            if (currentSourceIndex < audioSources.length) {
                audio.src = audioSources[currentSourceIndex];
                audio.load();
                currentSourceIndex++;
            } else {
                this.showNotification('Audio preview not available for this Surah');
            }
        };

        audio.onerror = () => {
            console.log(`Failed to load audio source ${currentSourceIndex}: ${audio.src}`);
            tryNextSource();
        };

        audio.oncanplay = () => {
            console.log('Preview audio loaded successfully');
            this.showNotification('Playing preview...');
        };

        audio.onended = () => {
            this.previewAudio = null;
        };

        // Start with first source
        tryNextSource();
        
        // Play for 30 seconds then stop
        audio.play().then(() => {
            this.previewAudio = audio;
            setTimeout(() => {
                if (this.previewAudio === audio) {
                    audio.pause();
                    this.previewAudio = null;
                }
            }, 30000); // 30 seconds preview
        }).catch(error => {
            console.error('Preview play failed:', error);
            this.showNotification('Failed to play preview');
        });
    }

    bookmarkAyah(verseKey) {
        const index = this.bookmarks.indexOf(verseKey);
        const btn = document.querySelector(`[data-verse="${verseKey}"] .bookmark-btn`);
        const icon = btn?.querySelector('i');

        if (index > -1) {
            // Remove bookmark
            this.bookmarks.splice(index, 1);
            if (btn) btn.classList.remove('bookmarked');
            if (icon) {
                icon.className = 'fas fa-bookmark-o';
                btn.title = 'Bookmark this verse';
            }
            this.showNotification('Bookmark removed');
        } else {
            // Add bookmark
            this.bookmarks.push(verseKey);
            if (btn) btn.classList.add('bookmarked');
            if (icon) {
                icon.className = 'fas fa-bookmark';
                btn.title = 'Remove bookmark';
            }
            this.showNotification('Bookmark added');
        }

        localStorage.setItem('quranBookmarks', JSON.stringify(this.bookmarks));
        
        // Update bookmark count in UI (if you want to show total bookmarks)
        this.updateBookmarkCount();
    }

    updateBookmarkCount() {
        const count = this.bookmarks.length;
        // You can add a bookmark counter in the UI here if needed
        console.log(`Total bookmarks: ${count}`);
    }

    getBookmarkedVerses() {
        return this.bookmarks;
    }

    exportBookmarks() {
        const bookmarksData = {
            bookmarks: this.bookmarks,
            exportDate: new Date().toISOString(),
            totalCount: this.bookmarks.length
        };
        
        const dataStr = JSON.stringify(bookmarksData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `quran-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Bookmarks exported successfully');
    }

    bookmarkSurah(surahId) {
        // Bookmark entire surah (you could implement this differently)
        const surahKey = `surah-${surahId}`;
        const index = this.bookmarks.indexOf(surahKey);

        if (index > -1) {
            this.bookmarks.splice(index, 1);
        } else {
            this.bookmarks.push(surahKey);
        }

        localStorage.setItem('quranBookmarks', JSON.stringify(this.bookmarks));
        this.showNotification(index > -1 ? 'Surah bookmark removed' : 'Surah bookmarked');
    }

    isBookmarked(verseKey) {
        return this.bookmarks.includes(verseKey);
    }

    showTranslation(verseKey, language) {
        // Update toggle buttons
        const toggleButtons = document.querySelectorAll(`[data-verse="${verseKey}"].translation-toggle`);
        toggleButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-quran-blue', 'bg-quran-green', 'text-white');
            btn.classList.add('bg-gray-300', 'text-gray-700');
        });

        const activeButton = document.querySelector(`[data-verse="${verseKey}"][data-lang="${language}"]`);
        if (activeButton) {
            activeButton.classList.remove('bg-gray-300', 'text-gray-700');
            activeButton.classList.add('active');
            if (language === 'english') {
                activeButton.classList.add('bg-quran-blue', 'text-white');
            } else {
                activeButton.classList.add('bg-quran-green', 'text-white');
            }
        }

        // Show/hide translation content
        const translationContents = document.querySelectorAll(`[data-verse="${verseKey}"].translation-content`);
        translationContents.forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('active');
        });

        const targetContent = document.querySelector(`[data-verse="${verseKey}"][data-lang="${language}"].translation-content`);
        if (targetContent) {
            targetContent.classList.remove('hidden');
            targetContent.classList.add('active');
        }
    }

    searchWithinSurah(query) {
        const verses = document.querySelectorAll('.ayah-container');
        const lowerQuery = query.toLowerCase();
        let visibleCount = 0;

        verses.forEach(verse => {
            const arabicText = verse.querySelector('.arabic-text')?.textContent.toLowerCase() || '';
            const englishText = verse.querySelector('.translation-text-english')?.textContent.toLowerCase() || '';
            const urduText = verse.querySelector('.translation-text-urdu')?.textContent.toLowerCase() || '';
            const verseNumber = verse.querySelector('.ayah-number')?.textContent || '';

            const isVisible = !query ||
                arabicText.includes(lowerQuery) ||
                englishText.includes(lowerQuery) ||
                urduText.includes(lowerQuery) ||
                verseNumber.includes(query);

            if (isVisible) {
                verse.style.display = 'block';
                visibleCount++;
                
                // Highlight search terms
                if (query) {
                    this.highlightSearchTerms(verse, query);
                }
            } else {
                verse.style.display = 'none';
            }
        });

        // Show search results count
        this.updateSearchResults(visibleCount, query);
    }

    highlightSearchTerms(verse, query) {
        const textElements = verse.querySelectorAll('.translation-content p, .arabic-text');
        textElements.forEach(element => {
            const originalText = element.textContent;
            const highlightedText = originalText.replace(
                new RegExp(query, 'gi'),
                `<mark class="bg-yellow-300 px-1 rounded">${query}</mark>`
            );
            if (originalText !== highlightedText) {
                element.innerHTML = highlightedText;
            }
        });
    }

    updateSearchResults(count, query) {
        let resultDiv = document.getElementById('search-results');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = 'search-results';
            resultDiv.className = 'text-center text-sm text-gray-600 mb-4 p-2 bg-blue-50 rounded-lg';
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.appendChild(resultDiv);
            }
        }

        if (query) {
            resultDiv.innerHTML = `Found ${count} verse${count !== 1 ? 's' : ''} matching "${query}"`;
            resultDiv.style.display = 'block';
        } else {
            resultDiv.style.display = 'none';
        }
    }

    shareSurah(surahId) {
        const url = `${window.location.origin}${window.location.pathname}?surah=${surahId}`;

        if (navigator.share) {
            navigator.share({
                title: 'Quran Online - Surah',
                text: `Read Surah ${surahId} on Quran Online Pakistan`,
                url: url
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copied to clipboard!');
            });
        }
    }

    goBackToHome() {
        // Hide surah page and show homepage sections
        document.getElementById('surah-page').style.display = 'none';
        document.querySelectorAll('section:not(#surah-page)').forEach(section => {
            section.style.display = 'block';
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-overlay';
        loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loadingDiv.innerHTML = `
            <div class="bg-white rounded-lg p-6 text-center">
                <div class="loading-spinner mx-auto mb-4"></div>
                <p class="text-gray-600">Loading Surah...</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loadingDiv = document.getElementById('loading-overlay');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                ${message}
            </div>
        `;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    canPlayAudio() {
        const audio = document.createElement('audio');
        return !!(audio.canPlayType && audio.canPlayType('audio/mpeg').replace(/no/, ''));
    }

    testAudioConnectivity() {
        const testAudio = new Audio();
        testAudio.preload = 'metadata';
        testAudio.src = 'https://server8.mp3quran.net/afs/001.mp3';
        
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.warn('⚠️ Audio connectivity test timeout');
                resolve(false);
            }, 5000);

            testAudio.onloadedmetadata = () => {
                clearTimeout(timeout);
                console.log('✅ Audio connectivity test passed');
                resolve(true);
            };

            testAudio.onerror = () => {
                clearTimeout(timeout);
                console.warn('⚠️ Audio connectivity test failed');
                resolve(false);
            };
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                ${message}
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Test function to verify all Surahs can be opened
    async testAllSurahs() {
        console.log('🔬 Testing all 114 Surahs...');
        const results = {
            successful: [],
            failed: [],
            total: 114
        };

        for (let surahId = 1; surahId <= 114; surahId++) {
            try {
                // Test Surah info loading
                const surahInfo = await this.fetchSurahInfo(surahId);
                
                // Test verse loading
                const verses = await this.fetchSurahVerses(surahId);
                
                if (surahInfo && verses && verses.length > 0) {
                    results.successful.push(surahId);
                    console.log(`✅ Surah ${surahId}: ${surahInfo.name_arabic} - ${verses.length} verses`);
                } else {
                    throw new Error('Invalid data received');
                }
            } catch (error) {
                results.failed.push(surahId);
                console.warn(`❌ Surah ${surahId} failed:`, error.message);
                
                // Test fallback system
                try {
                    const fallbackInfo = this.getSurahInfoFromDatabase(surahId);
                    const fallbackVerses = this.getFallbackVerses(surahId);
                    
                    if (fallbackInfo && fallbackVerses) {
                        console.log(`🔄 Surah ${surahId}: Fallback working - ${fallbackInfo.name_arabic}`);
                    }
                } catch (fallbackError) {
                    console.error(`💥 Surah ${surahId}: Even fallback failed!`, fallbackError);
                }
            }
        }

        console.log(`📊 Surah Test Results:`);
        console.log(`✅ Successful: ${results.successful.length}/${results.total}`);
        console.log(`❌ Failed: ${results.failed.length}/${results.total}`);
        console.log(`📋 Failed Surahs:`, results.failed);

        return results;
    }
}

// Global functions for onclick handlers
function loadAllSurahs() {
    if (window.app) {
        console.log('🔄 Global loadAllSurahs called');
        app.loadAllSurahs();
    } else {
        console.error('❌ App not initialized yet, retrying in 1 second...');
        setTimeout(() => {
            if (window.app) {
                app.loadAllSurahs();
            } else {
                console.error('❌ App still not initialized after retry');
            }
        }, 1000);
    }
}

function loadPopularSurahs() {
    if (window.app) {
        console.log('🔄 Global loadPopularSurahs called');
        app.loadPopularSurahs();
    } else {
        console.error('❌ App not initialized yet, retrying in 1 second...');
        setTimeout(() => {
            if (window.app) {
                app.loadPopularSurahs();
            } else {
                console.error('❌ App still not initialized after retry');
            }
        }, 1000);
    }
}

function shareSurah(surahId) {
    if (window.app) {
        app.shareSurah(surahId);
    } else {
        console.error('App not initialized yet');
    }
}

function bookmarkSurah(surahId) {
    app.bookmarkSurah(surahId);
}

function bookmarkAyah(verseKey) {
    app.bookmarkAyah(verseKey);
}

function playSurah(surahId) {
    if (window.app) {
        window.app.playSurah(surahId);
    } else {
        console.error('App not initialized yet');
        setTimeout(() => playSurah(surahId), 100);
    }
}

function loadAllSurahs() {
    if (window.app) {
        window.app.loadAllSurahs();
    } else {
        console.error('App not initialized yet');
        setTimeout(() => loadAllSurahs(), 100);
    }
}

function loadPopularSurahs() {
    if (window.app) {
        window.app.loadPopularSurahs();
    } else {
        console.error('App not initialized yet');
        setTimeout(() => loadPopularSurahs(), 100);
    }
}

function loadSurahFromFooter(surahId) {
    if (window.app) {
        window.app.loadSurahContent(surahId);
    } else {
        console.error('App not initialized yet');
        setTimeout(() => loadSurahFromFooter(surahId), 100);
    }
}

function showTranslation(verseKey, language) {
    if (window.app) {
        window.app.showTranslation(verseKey, language);
    } else {
        console.error('App not initialized yet');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM loaded, initializing Quran Online Pakistan...');
    
    try {
        // Initialize the main app
        window.app = new QuranApp();
        
        // Run system checks
        await runSystemChecks();
        
        // Check if URL has surah parameter or `all=1` to auto-load all Surahs
        const urlParams = new URLSearchParams(window.location.search);
        const surahId = urlParams.get('surah');
        const loadAll = urlParams.get('all');
        if (surahId) {
            console.log(`📖 Loading Surah ${surahId} from URL parameter`);
            app.loadSurahContent(parseInt(surahId));
        } else if (loadAll === '1') {
            console.log('📚 URL parameter all=1 detected, loading all 114 Surahs');
            // Ensure the Surahs section is visible
            const surahsSection = document.getElementById('surahs');
            if (surahsSection) surahsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Load immediately
            app.loadAllSurahs();
        }
        
        console.log('✅ Website fully loaded and ready for students!');
        
    } catch (error) {
        console.error('❌ Critical error during initialization:', error);
    }
});

async function runSystemChecks() {
    console.log('🔍 Running system checks...');
    
    const checks = {
        homepage: checkHomepageElements(),
        navigation: checkNavigation(),
        audio: await app.testAudioConnectivity(),
        api: await checkAPIConnectivity(),
        responsive: checkResponsiveDesign()
    };
    
    console.log('📊 System Check Results:', checks);
    
    // Report any issues
    const failedChecks = Object.entries(checks).filter(([_, passed]) => !passed);
    if (failedChecks.length > 0) {
        console.warn('⚠️ Some systems failed checks:', failedChecks.map(([name]) => name));
    } else {
        console.log('✅ All system checks passed!');
    }
    
    return checks;
}

function checkHomepageElements() {
    const requiredElements = [
        'theme-toggle', 'mobile-menu-btn', 'mobile-menu', 'surah-grid',
        'load-all-surahs', 'load-popular-surahs'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('❌ Missing homepage elements:', missingElements);
        return false;
    }
    
    console.log('✅ All homepage elements present');
    return true;
}

function checkNavigation() {
    const sections = ['home', 'surahs', 'about', 'faq'];
    const missingSections = sections.filter(id => !document.getElementById(id));
    
    if (missingSections.length > 0) {
        console.error('❌ Missing navigation sections:', missingSections);
        return false;
    }
    
    // Test smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    if (navLinks.length === 0) {
        console.error('❌ No navigation links found');
        return false;
    }
    
    console.log('✅ Navigation structure verified');
    return true;
}

async function checkAPIConnectivity() {
    const apiSources = [
        'https://api.quran.com/api/v4/chapters/1?language=en',
        'https://cdn.jsdelivr.net/gh/risan/quran-json@main/dist/chapters.json'
    ];
    
    for (const apiUrl of apiSources) {
        try {
            const response = await fetch(apiUrl, {
                method: 'HEAD',
                mode: 'cors',
                signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
                console.log(`✅ API connectivity confirmed: ${apiUrl}`);
                return true;
            }
        } catch (error) {
            console.warn(`⚠️ API test failed for ${apiUrl}:`, error.message);
        }
    }
    
    console.warn('⚠️ All API sources failed - will use offline database');
    return false;
}

function checkResponsiveDesign() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
        console.error('❌ Viewport meta tag missing');
        return false;
    }
    
    // Check if CSS has responsive rules
    const mediaQueries = Array.from(document.styleSheets)
        .flatMap(sheet => {
            try {
                return Array.from(sheet.cssRules);
            } catch {
                return [];
            }
        })
        .filter(rule => rule instanceof CSSMediaRule);
    
    if (mediaQueries.length === 0) {
        console.warn('⚠️ No media queries found in CSS');
        return false;
    }
    
    console.log('✅ Responsive design elements verified');
    return true;
}
