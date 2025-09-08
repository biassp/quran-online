# Quran Online - Free Islamic Education Platform

A modern, responsive, and SEO-optimized web application for reading the Quran online, specifically designed for students in Pakistan. Built with HTML5, CSS3, and JavaScript using the Quran.com API.

##  Features

### Core Features
- **Complete Quran Access**: All 114 Surahs with Arabic text
- **Multiple Translations**: English (Sahih International) and support for Urdu
- **Audio Recitations**: High-quality audio by renowned Qaris (Al-Afasy)
- **Advanced Search**: Search within Surahs or across the entire Quran
- **Bookmark System**: Save favorite verses and Surahs
- **Night Mode**: Comfortable reading with dark theme toggle
- **Mobile-First Design**: Fully responsive for all devices
- **Fast Loading**: Optimized for performance

### Educational Features
- **Student-Friendly Interface**: Clean, modern design
- **Progressive Web App Ready**: Can be installed as an app
- **Offline-Ready Structure**: Prepared for offline functionality
- **SEO Optimized**: Full meta tags and structured data
- **Accessibility**: Screen reader friendly

##  Design

- **Color Scheme**: Green (#27AE60), Blue (#3498DB), and White theme
- **Typography**: Amiri font for Arabic text, modern sans-serif for UI
- **Layout**: Clean, minimal, and spiritual aesthetic
- **Components**: Rounded buttons, smooth animations, card-based design

##  Technical Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **API**: Quran.com API for content, Islamic Network for audio
- **Fonts**: Google Fonts (Amiri, Noto Sans Arabic)
- **Icons**: Font Awesome
- **Storage**: LocalStorage for bookmarks and preferences

##  Project Structure

```
quran.login.ac.pk/
├── index.html          # Main homepage
├── styles.css          # Custom styling and themes
├── script.js           # Application logic and API integration
└── README.md           # Project documentation
```

##  Quick Start

1. **Clone or Download** the project files
2. **Upload to Web Server** - Place all files in your web root directory
3. **Open in Browser** - Navigate to `index.html`
4. **No Build Required** - Ready to use immediately

##  Deployment

### For XAMPP (Windows)
1. Copy all files to `C:\xampp\htdocs\quran.login.ac.pk\`
2. Start XAMPP Apache server
3. Open `http://localhost/quran.login.ac.pk/` in your browser

### For Other Servers
- Upload all files to your web hosting
- Ensure the domain points to the directory containing the files
- No database required - uses localStorage for bookmarks

##  Usage

### For Students
1. **Browse Surahs**: Click on any Surah card to start reading
2. **Listen to Audio**: Click the play button next to any Ayah
3. **Search Content**: Use the search bar to find specific verses
4. **Bookmark Favorites**: Click the bookmark icon to save verses
5. **Night Mode**: Toggle for comfortable reading at night

### Features Overview
- **Arabic Text**: Beautiful Uthmani script rendering
- **Translations**: Clear English translations alongside Arabic
- **Audio Controls**: Play, pause, and navigate through recitations
- **Search Functionality**: Find verses by content or number
- **Responsive Design**: Works perfectly on phones, tablets, and desktops

##  Customization

### Colors
Edit the Tailwind config in `index.html`:
```javascript
theme: {
    extend: {
        colors: {
            'quran-green': '#27AE60',
            'quran-blue': '#3498DB',
            'quran-dark': '#2C3E50'
        }
    }
}
```

### API Endpoints
The app uses these APIs:
- **Quran Text**: `https://api.quran.com/api/v4/quran/verses/uthmani`
- **Translations**: `https://api.quran.com/api/v4/quran/translations/20`
- **Audio**: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/`

### Adding Languages
To add Urdu translation:
1. Find Urdu translation ID from Quran.com API
2. Update the translation fetch URL in `script.js`
3. Add language toggle in the UI

##  SEO Features

- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Structured Data**: JSON-LD for FAQ and content
- **Performance**: Optimized loading and rendering
- **Mobile SEO**: Mobile-first indexing ready
- **Accessibility**: WCAG compliant structure

##  Night Mode

- Automatically saves preference to localStorage
- Smooth transitions between themes
- Optimized contrast for comfortable reading
- Preserves user preference across sessions

##  Bookmark System

- **Verse Bookmarks**: Save individual Ayahs
- **Surah Bookmarks**: Save entire Surahs
- **Local Storage**: Persists across browser sessions
- **Visual Indicators**: Clear bookmark status display

##  Mobile Optimization

- **Touch-Friendly**: Large buttons and touch targets
- **Responsive Layout**: Adapts to all screen sizes
- **Fast Loading**: Optimized assets and caching
- **PWA Ready**: Can be installed as a mobile app

##  Contributing

This is an educational project for the benefit of Muslim students worldwide. Contributions are welcome:

1. **Bug Reports**: Report issues via GitHub issues
2. **Feature Requests**: Suggest improvements
3. **Code Contributions**: Submit pull requests
4. **Translations**: Help add more languages

##  License

This project is created for educational purposes and is free to use, modify, and distribute for Islamic educational purposes.

##  Acknowledgments

- **Quran.com API**: For providing Quran text and translations
- **Islamic Network**: For high-quality audio recitations
- **Al-Afasy**: For beautiful Quran recitation
- **Font Awesome**: For beautiful icons
- **Google Fonts**: For Arabic typography

##  Support

For technical support or questions:
- Check the FAQ section on the website
- Report issues through the contact form
- Email: support@quran.login.ac.pk (if configured)

## LIVE WEBSITE
quran.login.ac.pk
---

**Made with ❤️ for Islamic Education in Pakistan**

*May Allah accept this effort and make it beneficial for all Muslim students. Ameen.*


