import React, { useState, useEffect, useRef } from 'react';
import {
  ListMusic,
  Moon,
  Cpu,
  Sparkles,
  Zap,
  Heart,
  Briefcase,
  Lightbulb,
  Gem,
  Sun,
  Share2,
  X,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import {
  redirectToSpotifyAuth,
  exchangeCodeForToken,
  getStoredToken,
  createPlaylistFromTracks,
  getRedirectUri,
  isRedirectUriSafeForSpotify,
} from './spotify';
import welcomeBgVideo from './assets/welcome-bg.mp4';

const App = () => {
  // --- ARCHIVE DATABASE ---
  const TRACK_ARCHIVE = {
    modernist: [
      { artist: "Fockewulf 190", title: "Body Heat", year: 1984 },
      { artist: "Krisma", title: "Many Kisses", year: 1980 },
      { artist: "Dario Dell'Aere", title: "Eagles in the Night", year: 1985 },
      { artist: "Amin-Peck", title: "Suicidal", year: 1983 },
      { artist: "N.O.I.A.", title: "Stranger In A Strange Land", year: 1983 },
      { artist: "East Wall", title: "Eyes of Ice", year: 1984 },
      { artist: "Lectric Workers", title: "The Garden", year: 1982 },
      { artist: "Video", title: "Somebody", year: 1983 },
      { artist: "Neon", title: "My Blues Is You", year: 1983 },
      { artist: "Monuments", title: "Ice Age", year: 1984 },
      { artist: "Gaznevada", title: "I.C. Love Affair", year: 1983 },
      { artist: "Krisma", title: "A Love Story", year: 1981 },
      { artist: "N.O.I.A.", title: "True Love", year: 1983 },
      { artist: "Rational Youth", title: "City of Night", year: 1982 },
      { artist: "Klein + M.B.O.", title: "Wonderful", year: 1983 },
      { artist: "International Music System", title: "Dancing Therapy", year: 1984 },
      { artist: "Miko Mission", title: "How Old Are You", year: 1984 },
      { artist: "Gary Low", title: "You Are a Danger", year: 1982 },
      { artist: "Pankow", title: "Me and My Ding Dong", year: 1983 },
      { artist: "Fockewulf 190", title: "Rasputin", year: 1982 },
    ],

    engineer: [
      { artist: "Alexander Robotnick", title: "Problèmes d'amour", year: 1983 },
      { artist: "Mr. Flagio", title: "Take a Chance", year: 1983 },
      { artist: "Lectric Workers", title: "Robot Is Systematic", year: 1982 },
      { artist: "Cyber People", title: "Polaris", year: 1984 },
      { artist: "Hypnosis", title: "Pulstar", year: 1983 },
      { artist: "Koto", title: "Chinese Revenge", year: 1982 },
      { artist: "X-Ray Connection", title: "Get It On", year: 1983 },
      { artist: "Doctor's Cat", title: "Watch Out", year: 1983 },
      { artist: "Koto", title: "Japanese War Game", year: 1983 },
      { artist: "Expansives", title: "Life With You", year: 1982 },
      { artist: "Koto", title: "Visitors", year: 1983 },
      { artist: "Koto", title: "Jabdah", year: 1982 },
      { artist: "Cyber People", title: "Void Vision", year: 1985 },
      { artist: "Casco", title: "Cybernetic Love", year: 1983 },
      { artist: "International Music System", title: "Nonline", year: 1983 },
      { artist: "Klein + M.B.O.", title: "Dirty Talk", year: 1982 },
      { artist: "Number One Ensemble", title: "Back to Heaven", year: 1983 },
      { artist: "Baricentro", title: "Tittle Tattle", year: 1983 },
      { artist: "Digital Emotion", title: "Get Up, Action", year: 1984 },
      { artist: "Wish Key", title: "Orient Express", year: 1984 },
    ],

    cosmic: [
      { artist: "Charlie", title: "Spacer Woman", year: 1983 },
      { artist: "Kano", title: "I'm Ready", year: 1980 },
      { artist: "Casco", title: "Cybernetic Love", year: 1983 },
      { artist: "The Creatures", title: "Believe In Yourself", year: 1983 },
      { artist: "Koto", title: "Visitors", year: 1983 },
      { artist: "Xenon", title: "Galaxy", year: 1983 },
      { artist: "Steel Mind", title: "Bad Passion", year: 1982 },
      { artist: "Cellophane", title: "Music Colors", year: 1982 },
      { artist: "M-Basic", title: "Mokba", year: 1984 },
      { artist: "Siberian Nights", title: "The Moscow Night", year: 1984 },
      { artist: "Capricorn", title: "I Need Love", year: 1982 },
      { artist: "Miko Mission", title: "The World Is You", year: 1984 },
      { artist: "Hypnosis", title: "Oxygene", year: 1984 },
      { artist: "Koto", title: "Dragon's Legend", year: 1984 },
      { artist: "Azoto", title: "San Salvador", year: 1982 },
      { artist: "Radiorama", title: "Aliens", year: 1986 },
      { artist: "Laserdance", title: "Power Run", year: 1984 },
      { artist: "Patrick Cowley", title: "Menergy", year: 1981 },
      { artist: "Koto", title: "The Runner", year: 1985 },
      { artist: "Charlie", title: "It's Impossible", year: 1983 },
    ],

    mechanic: [
      { artist: "B.W.H.", title: "Stop", year: 1983 },
      { artist: "Doctor's Cat", title: "Feel the Drive", year: 1983 },
      { artist: "Gino Soccio", title: "Remember", year: 1979 },
      { artist: "Easy Going", title: "Baby I Love You", year: 1979 },
      { artist: "B.W.H.", title: "Livin' Up", year: 1982 },
      { artist: "Klein + M.B.O.", title: "Dirty Talk (Instrumental)", year: 1982 },
      { artist: "Tension", title: "My Dream", year: 1983 },
      { artist: "Gino Soccio", title: "Dancer", year: 1979 },
      { artist: "Scotch", title: "Disco Band", year: 1983 },
      { artist: "Amin-Peck", title: "Girls on Me", year: 1982 },
      { artist: "Mr. Flagio", title: "Take a Chance", year: 1983 },
      { artist: "Doctor's Cat", title: "Watch Out", year: 1983 },
      { artist: "Fun Fun", title: "Happy Station", year: 1983 },
      { artist: "Ken Laszlo", title: "Hey Hey Guy", year: 1984 },
      { artist: "Fancy", title: "Slice Me Nice", year: 1984 },
      { artist: "Trilogy", title: "Not Love", year: 1983 },
      { artist: "Gaznevada", title: "Special Agent", year: 1983 },
      { artist: "Brian Ice", title: "Walking Away", year: 1984 },
      { artist: "Radiorama", title: "Desire", year: 1985 },
      { artist: "P. Lion", title: "Happy Children", year: 1983 },
    ],

    dreamer: [
      { artist: "Valerie Dore", title: "The Night", year: 1984 },
      { artist: "My Mine", title: "Hypnotic Tango", year: 1983 },
      { artist: "Savage", title: "Don't Cry Tonight", year: 1983 },
      { artist: "Plustwo", title: "Melody", year: 1983 },
      { artist: "Dharma", title: "Plastic Doll", year: 1982 },
      { artist: "Savage", title: "Only You", year: 1984 },
      { artist: "Den Harrow", title: "Mad Desire", year: 1984 },
      { artist: "Rose", title: "Magic Carillon", year: 1983 },
      { artist: "Gazebo", title: "Love in Your Eyes", year: 1983 },
      { artist: "P. Lion", title: "Dream", year: 1984 },
      { artist: "Silver Pozzoli", title: "Around My Dream", year: 1984 },
      { artist: "Max Him", title: "Lady Fantasy", year: 1984 },
      { artist: "Fun Fun", title: "Color My Love", year: 1984 },
      { artist: "Miko Mission", title: "How Old Are You", year: 1984 },
      { artist: "Albert One", title: "Secrets", year: 1984 },
      { artist: "Ryan Paris", title: "Fall in Love", year: 1984 },
      { artist: "Linda Jo Rizzo", title: "You're My First, You're My Last", year: 1986 },
      { artist: "Clio", title: "Eyes", year: 1983 },
      { artist: "Radiorama", title: "Yeti", year: 1986 },
      { artist: "Valerie Dore", title: "Get Closer", year: 1984 },
    ],

    professional: [
      { artist: "Change", title: "A Lover's Holiday", year: 1980 },
      { artist: "Kano", title: "It's a War", year: 1980 },
      { artist: "Firefly", title: "Love Is Gonna Be On Your Side", year: 1981 },
      { artist: "Peter Jacques Band", title: "Walking on Music", year: 1979 },
      { artist: "Change", title: "Hold Tight", year: 1981 },
      { artist: "Gino Soccio", title: "Try It Out", year: 1981 },
      { artist: "B.B. & Q. Band", title: "On The Beat", year: 1981 },
      { artist: "High Fashion", title: "Feelin' Lucky Lately", year: 1982 },
      { artist: "Revanche", title: "Music Man", year: 1979 },
      { artist: "Vivien Vee", title: "Give Me a Break", year: 1979 },
      { artist: "Change", title: "The Glow of Love", year: 1980 },
      { artist: "Change", title: "Searching", year: 1980 },
      { artist: "Kano", title: "Another Life", year: 1983 },
      { artist: "Kano", title: "I'm Ready", year: 1980 },
      { artist: "B.B. & Q. Band", title: "Dreamer", year: 1981 },
      { artist: "D-Train", title: "You're the One for Me", year: 1981 },
      { artist: "Skyy", title: "Call Me", year: 1981 },
      { artist: "Kleeer", title: "Tonight's the Night", year: 1981 },
      { artist: "Change", title: "Paradise", year: 1981 },
      { artist: "Peter Jacques Band", title: "Devil's Run", year: 1979 },
    ],

    visionary: [
      { artist: "Clio", title: "Faces", year: 1982 },
      { artist: "Baby's Gang", title: "Challenger", year: 1984 },
      { artist: "P. Lion", title: "Happy Children", year: 1983 },
      { artist: "Scotch", title: "Penguins' Invasion", year: 1983 },
      { artist: "Sandy Marton", title: "People from Ibiza", year: 1984 },
      { artist: "Albert One", title: "Turbo Diesel", year: 1984 },
      { artist: "Ryan Paris", title: "Dolce Vita", year: 1983 },
      { artist: "Baby's Gang", title: "Happy Song", year: 1983 },
      { artist: "Kano", title: "Queen of Witches", year: 1983 },
      { artist: "Fun Fun", title: "Happy Station", year: 1983 },
      { artist: "Den Harrow", title: "Future Brain", year: 1985 },
      { artist: "Radiorama", title: "Aliens", year: 1986 },
      { artist: "Ken Laszlo", title: "Tonight", year: 1985 },
      { artist: "Fancy", title: "Bolero", year: 1984 },
      { artist: "Miko Mission", title: "Two for Love", year: 1984 },
      { artist: "Spagna", title: "Easy Lady", year: 1986 },
      { artist: "Baltimora", title: "Tarzan Boy", year: 1985 },
      { artist: "Sabrina", title: "Boys (Summertime Love)", year: 1987 },
      { artist: "Scotch", title: "Take Me Up", year: 1985 },
      { artist: "Fun Fun", title: "Baila Bolero", year: 1985 },
    ],

    minimalist: [
      { artist: "Klein + M.B.O.", title: "Dirty Talk", year: 1982 },
      { artist: "Sylvi Foster", title: "Hookey", year: 1983 },
      { artist: "Vivien Vee", title: "Blue Disease", year: 1983 },
      { artist: "Jennifer Munday", title: "Invisible", year: 1984 },
      { artist: "Caprice", title: "100% Love", year: 1983 },
      { artist: "Flowchart", title: "Ask the Boss", year: 1983 },
      { artist: "East Wall", title: "Eyes of Ice", year: 1984 },
      { artist: "Amin-Peck", title: "Anxiety", year: 1982 },
      { artist: "Vivien Vee", title: "Remember", year: 1983 },
      { artist: "Tommy", title: "One Night", year: 1983 },
      { artist: "Klein + M.B.O.", title: "Wonderful", year: 1983 },
      { artist: "International Music System", title: "Dancing Therapy", year: 1984 },
      { artist: "Mr. Flagio", title: "Take a Chance", year: 1983 },
      { artist: "Gary Low", title: "You Are a Danger", year: 1982 },
      { artist: "Casco", title: "Cybernetic Love", year: 1983 },
      { artist: "Lectric Workers", title: "Robot Is Systematic", year: 1982 },
      { artist: "N.O.I.A.", title: "True Love", year: 1983 },
      { artist: "Krisma", title: "A Love Story", year: 1981 },
      { artist: "Gaznevada", title: "I.C. Love Affair", year: 1983 },
      { artist: "Capricorn", title: "I Need Love", year: 1982 },
    ],

    escapist: [
      { artist: "Sandy Marton", title: "People from Ibiza", year: 1984 },
      { artist: "Gazebo", title: "Love in Your Eyes", year: 1983 },
      { artist: "Ryan Paris", title: "Dolce Vita (Instrumental)", year: 1983 },
      { artist: "Righeira", title: "Vamos a la Playa", year: 1983 },
      { artist: "Raf", title: "Self Control", year: 1984 },
      { artist: "Tullio De Piscopo", title: "Stop Bajon", year: 1984 },
      { artist: "Kano", title: "Another Life", year: 1983 },
      { artist: "Gazebo", title: "Masterpiece", year: 1982 },
      { artist: "Sandy Marton", title: "Camel by Camel", year: 1984 },
      { artist: "Valerie Dore", title: "The Night", year: 1984 },
      { artist: "Ryan Paris", title: "Dolce Vita", year: 1983 },
      { artist: "Gazebo", title: "I Like Chopin", year: 1983 },
      { artist: "Righeira", title: "No Tengo Dinero", year: 1983 },
      { artist: "Spagna", title: "Call Me", year: 1987 },
      { artist: "Baltimora", title: "Tarzan Boy", year: 1985 },
      { artist: "Sabrina", title: "All of Me", year: 1988 },
      { artist: "Eddy Huntington", title: "U.S.S.R.", year: 1986 },
      { artist: "Albert One", title: "Secrets", year: 1984 },
      { artist: "Fun Fun", title: "Color My Love", year: 1984 },
      { artist: "Silver Pozzoli", title: "Around My Dream", year: 1984 },
    ],
  };

  const ARCHETYPE_IMAGES = {
    cosmic: '/archetypes/cosmic-romantic.png',
    engineer: '/archetypes/cybernetic-engineer.png',
    modernist: '/archetypes/nocturnal-modernist.png',
    mechanic: '/archetypes/body-mechanic.png',
    dreamer: '/archetypes/romantic-dreamer.png',
    professional: '/archetypes/transatlantic-professional.png',
    visionary: '/archetypes/naive-visionary.png',
    minimalist: '/archetypes/erotic-minimalist.png',
    escapist: '/archetypes/mediterranean-escapist.png',
  };

  const ARCHETYPE_ICONS = {
    modernist: Moon,      // nocturnal
    engineer: Cpu,        // cybernetic
    cosmic: Sparkles,     // cosmic / space
    mechanic: Zap,        // body, drive
    dreamer: Heart,       // romantic
    professional: Briefcase, // transatlantic
    visionary: Lightbulb, // naïve visionary
    minimalist: Gem,      // erotic minimalist
    escapist: Sun,        // Mediterranean
  };

  const ARCHETYPES = {
    modernist: { title: "THE NOCTURNAL MODERNIST", subtitle: "After midnight, before regret.", content: "There is a new sound moving through Europe's darker rooms. Sharp synthesizers. Cold lights. Voices that do not ask for love — they observe it. This is music for black leather interiors, for mirrors, for people who know exactly who is watching them.\nMinor chords, disciplined machines, emotional distance worn like couture.\nNot romantic. Not friendly.\nModern." },
    engineer: { title: "THE CYBERNETIC ENGINEER", subtitle: "Programmed to move the body.", content: "Here the future is precise. Basslines calculated. Rhythm assembled piece by piece. This is not fantasy — this is control.\nMachines speak in pulses. Funk is redesigned. Dancefloors become laboratories.\nNo sentimentality. No mistakes.\nOnly the perfect sequence." },
    cosmic: { title: "THE COSMIC ROMANTIC", subtitle: "Love songs from another galaxy.", content: "Dreams of tomorrow, written today. Floating melodies, shining arpeggios, voices aimed at the stars.\nThis is the sound of believing the future will be kind.\nRobots that feel. Space that loves you back.\nOptimism, amplified." },
    mechanic: { title: "THE BODY MECHANIC", subtitle: "Built for sweat, not radio.", content: "Low ceilings. Hot rooms. Relentless bass.\nThis music does not wait — it pushes.\nDesigned for bodies, not charts. Repetition as force. Rhythm as obsession.\nIndustrial, raw, unapologetic.\nIf it doesn't move you, it doesn't matter." },
    dreamer: { title: "THE ROMANTIC DREAMER", subtitle: "Melancholy you can dance to.", content: "Tears under neon lights.\nSimple words. Big feelings. Melodies that ache just enough.\nLove is fragile. Distance hurts. Night lasts too long.\nThis is sincerity without defense — emotional, melodic, unforgettable.\nEmbarrassing? Maybe.\nBeautiful? Absolutely." },
    professional: { title: "THE TRANSATLANTIC PROFESSIONAL", subtitle: "European soul. American polish.", content: "Studio perfection. Groove first.\nThis is Italo with ambition — tight arrangements, real funk, international confidence.\nDesigned to cross borders, radios, oceans.\nMusic that dresses well, travels well, and never apologizes for success." },
    visionary: { title: "THE NAÏVE VISIONARY", subtitle: "Too honest to fail.", content: "Big hooks. Cheap keyboards. Total belief.\nThis music doesn't know what it's 'supposed' to be — and that's why it works.\nDreams louder than technique. Emotion bigger than budget.\nPure heart. Zero irony.\nTomorrow starts here." },
    minimalist: { title: "THE EROTIC MINIMALIST", subtitle: "Less sound. More tension.", content: "A whisper instead of a chorus.\nRepetition that seduces. Rhythm that waits.\nThis is desire slowed down — music that stares instead of touching.\nFashionable. Dangerous. Intimate.\nNothing explodes. Everything burns." },
    escapist: { title: "THE MEDITERRANEAN ESCAPIST", subtitle: "Sunset in stereo.", content: "Warm nights. Coastal highways. Drinks sweating in glass.\nThis is music as vacation — light, melodic, quietly nostalgic.\nA fantasy of Europe where time moves slower and love feels easier.\nDance now. Remember later." },
  };

  const MASTER_QUESTION_POOL = [
    { text: "The Italian Riviera at dusk. What are you driving?", options: [{ text: "A matte-black Lancia Delta with tinted windows", type: "modernist" }, { text: "A custom-tuned Porsche with digital dash", type: "engineer" }, { text: "A silver Alfa Romeo Spider with the top down", type: "escapist" }, { text: "A white Ferrari Testarossa, headed for the city", type: "professional" }, { text: "A beat-up Fiat with 'I Love You' scratched in the paint", type: "visionary" }] },
    { text: "A synthesizer melody begins. What is its shape?", options: [{ text: "A cold, disciplined line that repeats forever", type: "engineer" }, { text: "A sweeping, emotional arc that breaks your heart", type: "dreamer" }, { text: "A shimmering arpeggio floating into space", type: "cosmic" }, { text: "A low, growling pulse that shakes the floor", type: "mechanic" }, { text: "A sparse, seductive whisper of a sound", type: "minimalist" }] },
    { text: "You are designing the cover for your debut 12-inch. What's the image?", options: [{ text: "A grainy photograph of an empty concrete room", type: "modernist" }, { text: "A hand-drawn romantic sunset", type: "dreamer" }, { text: "A sleek airbrushed chrome robot", type: "cosmic" }, { text: "A polaroid of the band, no retouching", type: "visionary" }, { text: "Minimalist geometric shapes on black card", type: "engineer" }] },
    { text: "The dancefloor is packed. What is your role?", options: [{ text: "Sweating in the center, obsessed with the beat", type: "mechanic" }, { text: "Watching the crowd from behind dark glasses", type: "modernist" }, { text: "Dancing too hard, singing every word, not noticing who's watching", type: "visionary" }, { text: "Closing your eyes and imagining you're on Saturn", type: "cosmic" }, { text: "Staring intensely at the person across the room", type: "minimalist" }] },
    { text: "What is the ultimate purpose of music?", options: [{ text: "To capture a feeling before it disappears", type: "visionary" }, { text: "To cross oceans and achieve success", type: "professional" }, { text: "To say the things I'm too shy to speak", type: "dreamer" }, { text: "To make the world feel like a long Sunday", type: "escapist" }, { text: "To push the body until it forgets the mind", type: "mechanic" }] },
    { text: "Describe the lighting in your ideal midnight session:", options: [{ text: "A single dim violet light at the far end", type: "minimalist" }, { text: "Piercing white strobes through industrial fog", type: "mechanic" }, { text: "Moving lasers cutting through total darkness", type: "cosmic" }, { text: "A single warm spotlight on the singer", type: "visionary" }, { text: "Warm amber floods and golden accents, like a beach club at closing time", type: "escapist" }] },
    { text: "You're at a bar in Milan. What are you ordering?", options: [{ text: "A classic Campari and soda, no ice", type: "escapist" }, { text: "A glowing blue futuristic cocktail", type: "cosmic" }, { text: "A fresh glass of water and a sincere smile", type: "visionary" }, { text: "The most expensive Champagne on the list", type: "professional" }, { text: "A warm espresso and a single cigarette", type: "modernist" }] },
    { text: "How should the vocals make you feel?", options: [{ text: "Distant, ghostly, and slightly menacing", type: "modernist" }, { text: "Soulful, high-energy, and ready for the world", type: "professional" }, { text: "Like a breeze coming off the Tyrrhenian Sea", type: "escapist" }, { text: "Sincere, fragile, and deeply emotional", type: "dreamer" }, { text: "Obsessive, repetitive, and breathy", type: "minimalist" }] },
    { text: "It's 1983. What is your primary obsession?", options: [{ text: "The texture of fine silk and leather", type: "minimalist" }, { text: "The upcoming launch of the space colony", type: "cosmic" }, { text: "Finding a love that doesn't hurt", type: "dreamer" }, { text: "Improving the efficiency of the sequence", type: "engineer" }, { text: "Escaping the city for the coast", type: "escapist" }] },
    { text: "You walk home as the sun rises. What are you thinking?", options: [{ text: "I hope no one saw me", type: "minimalist" }, { text: "The machines never sleep", type: "engineer" }, { text: "That was the greatest night of my life", type: "visionary" }, { text: "I should have said something, but it's too late now", type: "dreamer" }, { text: "Everything is already changing", type: "modernist" }] },
  ];

  const [activeQuestions, setActiveQuestions] = useState([]);
  const [step, setStep] = useState('welcome');
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState(null);
  const [circling, setCircling] = useState(null);
  const [spotifyStatus, setSpotifyStatus] = useState('idle'); // idle | auth-needed | creating | success | error
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState(null);
  const [spotifyError, setSpotifyError] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareImageLoading, setShareImageLoading] = useState(false);
  const welcomeVideoRef = useRef(null);
  const storyCardRef = useRef(null);

  // Handle OAuth callback when returning from Spotify
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      exchangeCodeForToken(code)
        .then(() => {
          window.history.replaceState({}, '', window.location.pathname);
          setSpotifyStatus('idle');
        })
        .catch((err) => {
          setSpotifyError(err.message);
          setSpotifyStatus('error');
          window.history.replaceState({}, '', window.location.pathname);
        });
    }
  }, []);

  // Force welcome video to play when on welcome step (retry until it plays)
  useEffect(() => {
    if (step !== 'welcome') return;
    const video = welcomeVideoRef.current;
    if (!video) return;
    const tryPlay = () => {
      video.play().then(() => {}).catch(() => {
        setTimeout(tryPlay, 300);
      });
    };
    tryPlay();
    const onCanPlay = () => video.play().catch(() => {});
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('loadeddata', onCanPlay);
    const t = setTimeout(tryPlay, 500);
    return () => {
      clearTimeout(t);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('loadeddata', onCanPlay);
    };
  }, [step]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const setupQuiz = () => {
    const selected = shuffleArray(MASTER_QUESTION_POOL).slice(0, 5);
    setActiveQuestions(selected);
    setAnswers([]);
    setCurrentQuestion(0);
    setStep('quiz');
  };

  const handleAnswer = (type, idx) => {
    setCircling(idx);
    setTimeout(() => {
      const newAnswers = [...answers, type];
      if (currentQuestion + 1 < activeQuestions.length) {
        setAnswers(newAnswers);
        setCurrentQuestion(currentQuestion + 1);
        setCircling(null);
      } else {
        calculateResult(newAnswers);
      }
    }, 600);
  };

  const calculateResult = (finalAnswers) => {
    const counts = finalAnswers.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const winner = Object.keys(counts).reduce((a, b) => (counts[a] || 0) > (counts[b] || 0) ? a : b);
    const selectedTracks = shuffleArray(TRACK_ARCHIVE[winner]).slice(0, 13);
    setResult({ id: winner, ...ARCHETYPES[winner], tracks: selectedTracks });
    setSpotifyStatus('idle');
    setSpotifyPlaylistUrl(null);
    setSpotifyError(null);
    setStep('result');
  };

  const copyToClipboard = async () => {
    const text = result.tracks.map((t) => `${t.artist} - ${t.title}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus(null), 3000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus(null), 3000);
    }
  };

  const createPlaylistInSpotify = async () => {
    const token = getStoredToken();
    setSpotifyError(null);

    if (!token) {
      try {
        setSpotifyStatus('auth-needed');
        await redirectToSpotifyAuth();
      } catch (err) {
        setSpotifyError(err.message);
        setSpotifyStatus('error');
      }
      return;
    }

    setSpotifyStatus('creating');
    try {
      const playlistName = `${result.title} — After Midnight`;
      const playlistDescription = `${result.subtitle} — Your Italo Disco archetype playlist from Who Are You After Midnight?`;
      const { url, tracksAdded, tracksSkipped } = await createPlaylistFromTracks(
        result.tracks,
        playlistName,
        playlistDescription
      );
      setSpotifyPlaylistUrl(url);
      setSpotifyStatus('success');
      if (tracksSkipped > 0) {
        setSpotifyError(`${tracksSkipped} track(s) not found on Spotify`);
      }
    } catch (err) {
      setSpotifyError(err.message);
      setSpotifyStatus('error');
    }
  };

  const getQuizUrl = () => typeof window !== 'undefined' ? window.location.origin : '';
  const getShareBlurb = (content) => (content || '').replace(/\s+/g, ' ').trim().slice(0, 120) + (content && content.length > 120 ? '…' : '');

  const captureStoryCard = async () => {
    const el = storyCardRef.current;
    if (!el) return null;
    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0e0a',
        logging: false,
      });
      return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png', 1));
    } catch (e) {
      console.error('Story capture failed', e);
      return null;
    }
  };

  const handleShareDownload = async () => {
    setShareImageLoading(true);
    try {
      const blob = await captureStoryCard();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `after-midnight-${result?.id || 'archetype'}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setShareImageLoading(false);
    }
  };

  const handleShareNative = async () => {
    setShareImageLoading(true);
    try {
      const blob = await captureStoryCard();
      if (!blob) return;
      const file = new File([blob], 'after-midnight-story.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: result?.title || 'Who Are You After Midnight?',
          text: `I got ${result?.title || 'an archetype'} — find yours at ${getQuizUrl()}`,
        });
      } else {
        handleShareDownload();
      }
    } catch (e) {
      if (e.name !== 'AbortError') handleShareDownload();
    } finally {
      setShareImageLoading(false);
    }
  };

  const SpotifyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.302c-.216.354-.675.465-1.028.249-2.852-1.741-6.442-2.135-10.67-1.168-.406.092-.816-.164-.908-.57-.092-.406.164-.816.57-.908 4.629-1.058 8.591-.611 11.787 1.34.354.216.465.675.249 1.028zm1.47-3.252c-.272.441-.849.581-1.29.309-3.264-2.003-8.239-2.585-12.098-1.413-.497.151-1.022-.132-1.173-.629-.151-.497.132-1.022.629-1.173 4.417-1.34 9.894-.693 13.623 1.597.441.272.581.849.309 1.29zm.126-3.4c-3.914-2.324-10.364-2.538-14.128-1.396-.599.182-1.23-.153-1.412-.752-.182-.599.153-1.23.752-1.412 4.316-1.311 11.442-1.06 15.908 1.59.54.321.716 1.021.395 1.561-.321.54-1.021.716-1.561.395z"/>
    </svg>
  );

  const glitchBgUrl = "https://cdn.midjourney.com/a97ac3f6-e1e8-439f-a0da-cbe839d758f3/0_0.jpeg";

  /* 80s terminal-style icons for each quiz question (by index) */
  const TERMINAL_ICONS = [
    /* 0: car / drive */
    <svg key="car" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-8 h-8 shrink-0">
      <path d="M2 14h2l2-4h12l2 4h2v2h-2l-1 2H5l-1-2H2v-2z" />
      <path d="M6 18v-4M18 18v-4" />
    </svg>,
    /* 1: synth / waveform */
    <svg key="synth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-8 h-8 shrink-0">
      <path d="M3 12h2M7 8v8M11 6v12M15 10v4M19 4v16" />
      <rect x="2" y="10" width="20" height="6" rx="0.5" />
    </svg>,
    /* 2: cover / frame */
    <svg key="frame" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-8 h-8 shrink-0">
      <rect x="4" y="4" width="16" height="16" />
      <path d="M4 4l4 4M20 4l-4 4M4 20l4-4M20 20l-4-4" />
    </svg>,
    /* 3: dancefloor / person */
    <svg key="dance" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-8 h-8 shrink-0">
      <circle cx="12" cy="6" r="2.5" />
      <path d="M8 22v-8l4-4 4 4v8M12 14v4" />
      <path d="M6 12h2M16 12h2" />
    </svg>,
    /* 4: mission / star */
    <svg key="mission" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" className="w-8 h-8 shrink-0">
      <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
      <path d="M4 18h2M18 18h2M11 22v-2" />
    </svg>,
  ];

  return (
    <div className={`h-screen w-screen relative overflow-hidden transition-all duration-700 ${step === 'result' ? 'overflow-y-auto bg-[#0a0e0a]' : 'bg-black'}`}>

      {/* CRT OVERLAY ENGINE */}
      <div className="crt-overlay pointer-events-none fixed inset-0 z-[999]" />

      {/* BACKGROUNDS */}
      {step === 'welcome' && (
        <div className="fixed inset-0 z-0 bg-black" style={{ minHeight: '100vh', minWidth: '100vw' }}>
          <video
            ref={welcomeVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            key="welcome-bg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={welcomeBgVideo}
          />
          <div className="absolute inset-0 bg-black/45 pointer-events-none" aria-hidden />
        </div>
      )}

      {step === 'quiz' && (
        <div className="absolute inset-0 z-0 animate-in fade-in duration-500 terminal-grid-bg">
          <div className="absolute inset-4 border border-[#00ff88] pointer-events-none opacity-30" />
          <div className="absolute inset-8 border border-[#00ff88] pointer-events-none opacity-10" />
        </div>
      )}

      {step === 'result' && (
        <div className="fixed inset-0 pointer-events-none z-0 terminal-grid-bg">
          <div className="absolute inset-4 border border-[#00ff88] opacity-20" />
        </div>
      )}

      <main className={`relative z-10 w-full max-w-2xl mx-auto px-6 flex flex-col items-center ${step === 'result' ? 'pt-8 pb-16 justify-start' : step === 'quiz' ? 'min-h-full pt-6 pb-16 justify-start' : 'h-full justify-center'}`}>

        {step === 'welcome' && (
          <div className="w-full text-center space-y-10 animate-in fade-in zoom-in duration-1000 flex flex-col items-center font-terminal-mono">
            <div className="space-y-5">
              <div className="inline-block max-w-full min-w-0 px-1">
                <h1 className="title-chromatic crt-glitch-title font-title-crt uppercase font-normal text-white"
                    style={{
                      fontSize: 'clamp(1.25rem, 4.5vw, 4.5rem)',
                      lineHeight: 1.2
                    }}>
                  WHO ARE YOU
                  <br />
                  AFTER MIDNIGHT?
                </h1>
              </div>

              <p className="text-white text-sm md:text-base uppercase tracking-[0.25em] max-w-md mx-auto">
                <span className="block">THERE ARE NO RIGHT ANSWERS.</span>
                <span className="block">ONLY CONSEQUENCES.</span>
              </p>
            </div>

            <button
              onClick={setupQuiz}
              style={{ borderWidth: 4 }}
              className="px-6 py-2.5 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black transition-all duration-300 font-terminal-mono text-sm uppercase tracking-[0.2em] active:scale-95 terminal-option"
            >
              START THE TEST
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="w-full flex flex-col space-y-6 animate-in slide-in-from-bottom-12 duration-700 font-terminal-mono text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-4 border-b border-[#00ff88] border-opacity-40 pb-3">
              <span className="terminal-glow-cyan text-[#00ff88]">{TERMINAL_ICONS[currentQuestion % TERMINAL_ICONS.length]}</span>
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] terminal-text-dim">QUESTION</div>
                <div className="terminal-glow-cyan text-lg tracking-widest">
                  {String(currentQuestion + 1).padStart(2, '0')} / 05
                </div>
              </div>
            </div>
            <div className="terminal-panel bg-black/40 p-5 md:p-6">
              <div className="terminal-text-green text-base md:text-lg leading-snug uppercase tracking-wide">
                {activeQuestions[currentQuestion].text}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.4em] terminal-text-dim mb-3">SELECT OPTION ===&gt;</div>
              {activeQuestions[currentQuestion].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.type, idx)}
                  className={`w-full terminal-option flex items-center gap-4 py-3 px-4 text-left font-terminal-mono text-sm md:text-base uppercase tracking-wide ${circling === idx ? 'terminal-option-selected' : 'terminal-text-green'}`}
                >
                  <span className="terminal-text-dim w-6">{idx + 1}.</span>
                  <span className={circling === idx ? 'terminal-glow-orange' : ''}>{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="w-full space-y-10 animate-in fade-in duration-1000 font-terminal-mono">
            <div className="relative terminal-panel bg-black/60 p-6 md:p-10 overflow-hidden">
              <div className="space-y-6">
                <div className="flex justify-between items-baseline gap-4 border-b border-[#00ff88] border-opacity-50 pb-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] terminal-text-dim">TEST RESULT #84-09</p>
                    <h2 className="terminal-glow-cyan text-3xl md:text-4xl uppercase leading-tight tracking-wider">{result.title}</h2>
                  </div>
                  <span className="terminal-glow-orange flex-shrink-0 self-center" aria-hidden>
                    {React.createElement(ARCHETYPE_ICONS[result.id] || Sparkles, { className: 'w-10 h-10 md:w-12 md:h-12' })}
                  </span>
                </div>
                <p className="terminal-glow-orange text-xl md:text-2xl uppercase tracking-wide">{result.subtitle}</p>
                {ARCHETYPE_IMAGES[result.id] && (
                  <div
                    className="relative left-1/2 flex justify-center overflow-hidden -translate-x-1/2"
                    style={{ width: '100vw', maxWidth: '100vw' }}
                  >
                    <div className="w-full max-w-2xl aspect-square overflow-hidden flex-shrink-0">
                      <img
                        src={ARCHETYPE_IMAGES[result.id]}
                        alt=""
                        className="block w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                )}
                <div className="text-base leading-relaxed terminal-text-green text-opacity-90 pt-2 whitespace-pre-line max-w-none">{result.content}</div>

                <div className="pt-8 border-t border-[#00ff88] border-opacity-40 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h3 className="uppercase tracking-[0.2em] text-sm terminal-glow-cyan flex items-center gap-3">
                      <ListMusic className="w-5 h-5 text-[#00ff88]" /> RECOMMENDED DISCOGRAPHY
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {spotifyStatus === 'success' && spotifyPlaylistUrl ? (
                        <a
                          href={spotifyPlaylistUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] uppercase border border-[#00ff88] text-[#00ff88] px-4 py-2 hover:bg-[#00ff88] hover:text-black transition-all active:scale-95 flex items-center gap-2 terminal-option"
                        >
                          OPEN IN SPOTIFY
                        </a>
                      ) : (
                        <button
                          onClick={createPlaylistInSpotify}
                          disabled={spotifyStatus === 'creating' || spotifyStatus === 'auth-needed' || !isRedirectUriSafeForSpotify()}
                          title={!isRedirectUriSafeForSpotify() ? 'Open the app at http://127.0.0.1:5173 on the computer where you run npm run dev' : undefined}
                          className="text-[10px] uppercase border border-[#00ff88] text-[#00ff88] px-4 py-2 hover:bg-[#00ff88] hover:text-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 terminal-option"
                        >
                          {spotifyStatus === 'creating' && (
                            <span className="w-3 h-3 border-2 border-[#00ff88] border-t-transparent animate-spin" />
                          )}
                          CREATE IN SPOTIFY
                        </button>
                      )}
                      <button onClick={copyToClipboard} className="text-[10px] uppercase border border-[#00ff88] text-[#00ff88] px-4 py-2 hover:bg-[#00ff88] hover:text-black transition-all terminal-option">
                        {copyStatus === 'success' ? 'COPIED' : 'COPY TRACKLIST'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShareModalOpen(true)}
                        className="text-[10px] uppercase border border-[#00ff88] text-[#00ff88] px-4 py-2 hover:bg-[#00ff88] hover:text-black transition-all terminal-option flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" /> SHARE TO STORY
                      </button>
                    </div>
                    <p className="text-[10px] terminal-text-dim uppercase tracking-wider mt-1">
                      {typeof window !== 'undefined' && window.location.protocol === 'https:'
                        ? 'Keep this tab open — Spotify will redirect you back here after you sign in.'
                        : isRedirectUriSafeForSpotify()
                          ? <>Open this app at <span className="terminal-glow-cyan">{getRedirectUri().replace(/\/$/, '')}</span> and add <span className="break-all">{getRedirectUri()}</span> in Spotify Dashboard. Keep this tab open — Spotify redirects back here.</>
                          : <>Create in Spotify only works at <span className="terminal-glow-cyan">http://127.0.0.1:5173</span> (same computer as <code className="text-[9px]">npm run dev</code>). You are on {window.location.host}.</>
                      }
                    </p>
                  </div>
                  {spotifyError && spotifyStatus === 'error' && (
                    <p className="text-sm text-[#ff6b6b]">{spotifyError}</p>
                  )}
                  {spotifyError && spotifyStatus === 'success' && (
                    <p className="text-xs terminal-glow-orange">{spotifyError}</p>
                  )}

                  <div className="space-y-2">
                    {result.tracks.map((track, i) => (
                      <div key={i} className="flex justify-between items-center gap-4 group border-b border-[#00ff88] border-opacity-20 pb-2 hover:border-opacity-50 transition-colors">
                        <div className="flex items-baseline gap-3">
                          <span className="terminal-text-dim text-[10px] w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                          <div className="flex flex-col">
                            <span className="terminal-text-green uppercase tracking-wide text-sm leading-none">{track.title}</span>
                            <span className="text-[10px] terminal-text-dim uppercase mt-1 tracking-widest">{track.artist}</span>
                          </div>
                        </div>
                        <a
                          href={`https://open.spotify.com/search/${encodeURIComponent(track.artist + " " + track.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00ff88] hover:text-[#ff8c00] transition-colors p-2"
                        >
                          <SpotifyIcon />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6 pb-12">
              <button onClick={() => setStep('welcome')} className="text-xs uppercase tracking-[0.3em] terminal-text-dim hover:terminal-glow-orange transition-colors border-b border-transparent hover:border-[#ff8c00]">
                RETAKE THE TEST
              </button>
            </div>

            {/* Share to story modal — fits viewport height on mobile */}
            {shareModalOpen && (
              <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 h-full min-h-[100dvh] max-h-[100dvh] sm:max-h-none sm:items-center sm:justify-center sm:p-4" onClick={() => setShareModalOpen(false)}>
                <div className="flex flex-col h-full max-h-[100dvh] sm:h-auto sm:max-h-none w-full max-w-[min(100vw,400px)] sm:gap-4 gap-3 p-4 flex-1 min-h-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="w-full flex justify-end shrink-0">
                    <button type="button" onClick={() => setShareModalOpen(false)} className="p-2 text-[#00ff88] hover:bg-[#00ff88]/20 rounded" aria-label="Close">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 flex items-center justify-center shrink-0">
                    <div
                      ref={storyCardRef}
                      className="h-full max-h-full w-auto max-w-[360px] rounded-lg overflow-hidden border-2 border-[#00ff88]/50 shrink-0"
                      style={{ aspectRatio: '9/16', background: '#0a0e0a', maxHeight: 'min(640px, 100%)' }}
                    >
                    <div className="relative w-full h-full flex flex-col justify-end p-5 text-white font-terminal-mono">
                      {ARCHETYPE_IMAGES[result.id] ? (
                        <>
                          <img
                            src={ARCHETYPE_IMAGES[result.id]}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e0a] via-[#0d1a0d] to-[#0a0e0a]" />
                      )}
                      <div className="relative z-10 space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#00ff88]/90">TEST RESULT</p>
                        <h2 className="text-xl md:text-2xl uppercase leading-tight tracking-wider text-[#00ff88] font-bold" style={{ textShadow: '0 0 12px rgba(0,255,136,0.5)' }}>{result.title}</h2>
                        <p className="text-sm uppercase tracking-wide text-[#ff8c00]" style={{ textShadow: '0 0 8px rgba(255,140,0,0.4)' }}>{result.subtitle}</p>
                        <p className="text-xs text-[#00ff88]/95 leading-relaxed line-clamp-3">{getShareBlurb(result.content)}</p>
                        <p className="text-[10px] uppercase tracking-wider text-[#00ff88] pt-2 border-t border-[#00ff88]/40 mt-3">
                          Find your archetype — {getQuizUrl()}
                        </p>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full shrink-0">
                    <button
                      type="button"
                      onClick={handleShareDownload}
                      disabled={shareImageLoading}
                      className="flex-1 text-[10px] uppercase border border-[#00ff88] text-[#00ff88] px-4 py-2.5 hover:bg-[#00ff88] hover:text-black transition-all terminal-option disabled:opacity-60"
                    >
                      {shareImageLoading ? '…' : 'DOWNLOAD IMAGE'}
                    </button>
                    <button
                      type="button"
                      onClick={handleShareNative}
                      disabled={shareImageLoading}
                      className="flex-1 text-[10px] uppercase border border-[#00ff88] text-[#00ff88] px-4 py-2.5 hover:bg-[#00ff88] hover:text-black transition-all terminal-option disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" /> {shareImageLoading ? '…' : 'SHARE'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {step === 'quiz' && (
        <div className="fixed right-3 top-1/2 -rotate-90 origin-right text-[10px] font-terminal-mono uppercase tracking-[0.4em] terminal-text-dim pointer-events-none">
          SYSTEM 84-09 • MODERN MUSIC EDITIONS
        </div>
      )}
    </div>
  );
};

export default App;
