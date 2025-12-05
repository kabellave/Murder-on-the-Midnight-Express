import React, { useState, useEffect, useRef } from 'react';
import { Book, Volume2, VolumeX } from 'lucide-react';

const MysteryTrainGame = () => {
  const [gameState, setGameState] = useState('intro');
  const [evidence, setEvidence] = useState([]);
  const [suspicion, setSuspicion] = useState({});
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deathCount, setDeathCount] = useState(1);
  const [deadSuspects, setDeadSuspects] = useState(['Mr. Richard Ashford']);
  const [currentTime, setCurrentTime] = useState('2:47 AM');
  const [wrongAccusations, setWrongAccusations] = useState(0);
  const [deathDetails, setDeathDetails] = useState([
    { name: 'Mr. Richard Ashford', method: 'Stabbed with letter opener after being drugged', time: '2:47 AM' }
  ]);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [currentVocabulary, setCurrentVocabulary] = useState([]);
  const audioRef = useRef(null);

  const vocabularyBySection = {
    intro: [
      { word: 'luxurious', definition: 'extremely comfortable and expensive' },
      { word: 'piercing', definition: 'sharp and loud (sound)' },
      { word: 'prominent', definition: 'important and well-known' },
      { word: 'lodged', definition: 'firmly stuck or fixed in place' }
    ],
    crimeScene: [
      { word: 'intricate', definition: 'very detailed and complicated' },
      { word: 'engravings', definition: 'designs cut into a hard surface' },
      { word: 'residue', definition: 'a small amount of something that remains' },
      { word: 'willingly', definition: 'in a ready and happy way, without being forced' }
    ],
    interview: [
      { word: 'inheritance', definition: 'money or property received from someone who has died' },
      { word: 'dispute', definition: 'a disagreement or argument' },
      { word: 'governess', definition: 'a woman employed to teach children in their home' },
      { word: 'testified', definition: 'gave evidence as a witness in court or investigation' }
    ],
    searchTrain: [
      { word: 'ornate', definition: 'highly decorated with complex patterns' },
      { word: 'velvet-lined', definition: 'covered on the inside with soft, luxurious fabric' },
      { word: 'prescribed', definition: 'officially recommended as a medical treatment' },
      { word: 'insomnia', definition: 'the condition of being unable to sleep' }
    ]
  };

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_d0e5816d58.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;
    
    if (musicEnabled && gameState !== 'death-scene' && gameState !== 'detective-death') {
      setTimeout(() => {
        audioRef.current.play().catch(err => console.log('Audio playback failed'));
      }, 500);
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [musicEnabled, gameState]);

  const addEvidence = (item) => {
    if (!evidence.includes(item)) {
      setEvidence([...evidence, item]);
      const times = ['2:47 AM', '3:00 AM', '3:15 AM', '3:30 AM', '3:45 AM', '4:00 AM', '4:15 AM', '4:30 AM', '4:45 AM'];
      if (evidence.length < times.length) {
        setCurrentTime(times[evidence.length]);
      }
    }
  };

  const addSuspicion = (suspect, points) => {
    setSuspicion({...suspicion, [suspect]: (suspicion[suspect] || 0) + points});
  };

  const suspects = [
    { name: 'Lady Victoria Ashford', role: 'Wealthy Heiress' },
    { name: 'Dr. Marcus Webb', role: 'Renowned Surgeon' },
    { name: 'Colonel James Hartley', role: 'Retired Military Officer' },
    { name: 'Miss Eleanor Price', role: 'Governess' },
    { name: 'Mr. Thomas Blackwood', role: 'Businessman' }
  ];

  const aliveSuspects = suspects.filter(s => !deadSuspects.includes(s.name));

  const getNextTime = () => {
    const times = ['3:15 AM', '3:45 AM', '4:20 AM', '4:50 AM', '5:15 AM', '5:45 AM'];
    return times[wrongAccusations] || '5:55 AM';
  };

  const killInnocentSuspect = (accusedName) => {
    const innocent = aliveSuspects.filter(s => s.name !== 'Dr. Marcus Webb' && s.name !== accusedName);
    if (innocent.length === 0) {
      setGameState('detective-death');
      return;
    }
    
    const victim = innocent[Math.floor(Math.random() * innocent.length)];
    const deathMethods = [
      { method: 'Poisoned with cyanide in their evening tea', time: getNextTime() },
      { method: 'Pushed from the moving train during the night', time: getNextTime() },
      { method: 'Strangled with a curtain cord in their compartment', time: getNextTime() },
      { method: 'Throat slit with a razor blade while sleeping', time: getNextTime() },
      { method: 'Suffocated with a pillow—no signs of struggle', time: getNextTime() }
    ];
    
    const death = deathMethods[wrongAccusations % deathMethods.length];
    
    setDeadSuspects([...deadSuspects, victim.name]);
    setDeathDetails([...deathDetails, { name: victim.name, method: death.method, time: death.time }]);
    setDeathCount(deathCount + 1);
    setWrongAccusations(wrongAccusations + 1);
    setCurrentTime(death.time);
    setGameState('death-scene');
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
          <div className="flex items-center justify-between mb-6 border-b-2 border-amber-900 pb-4">
            <div className="flex items-center gap-3">
              <Book size={32} className="text-red-800" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Murder on the Midnight Express</h1>
                <p className="text-sm text-gray-700">An Interactive Mystery Novel - Level B2</p>
              </div>
            </div>
            <button onClick={() => setMusicEnabled(!musicEnabled)} className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition">
              {musicEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 flex items-center justify-center">
              <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <rect width="400" height="300" fill="#0a0a1a"/>
                <circle cx="350" cy="50" r="30" fill="#f0e68c" opacity="0.9"/>
                <circle cx="50" cy="40" r="2" fill="white"/>
                <circle cx="120" cy="60" r="1.5" fill="white"/>
                <circle cx="200" cy="30" r="2" fill="white"/>
                <line x1="0" y1="240" x2="400" y2="240" stroke="#4a4a4a" strokeWidth="3"/>
                <rect x="100" y="140" width="200" height="80" fill="#1a472a" stroke="#2d5016" strokeWidth="3" rx="5"/>
                <rect x="120" y="155" width="35" height="40" fill="#ffeb99" stroke="#2d5016" strokeWidth="2" rx="3"/>
                <rect x="165" y="155" width="35" height="40" fill="#ffeb99" stroke="#2d5016" strokeWidth="2" rx="3"/>
                <rect x="210" y="155" width="35" height="40" fill="#ff6b6b" stroke="#2d5016" strokeWidth="2" rx="3"/>
                <circle cx="227" cy="175" r="8" fill="#8B0000" opacity="0.7"/>
                <rect x="255" y="155" width="35" height="40" fill="#ffeb99" stroke="#2d5016" strokeWidth="2" rx="3"/>
                <rect x="95" y="130" width="210" height="15" fill="#0d2818" stroke="#2d5016" strokeWidth="2" rx="5"/>
                <circle cx="140" cy="235" r="15" fill="#333" stroke="#666" strokeWidth="3"/>
                <circle cx="200" cy="235" r="15" fill="#333" stroke="#666" strokeWidth="3"/>
                <circle cx="260" cy="235" r="15" fill="#333" stroke="#666" strokeWidth="3"/>
                <text x="200" y="215" fontFamily="serif" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#d4af37">MIDNIGHT EXPRESS</text>
              </svg>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-red-800">Murder on the Midnight Express</h2>
              <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-800 space-y-3 text-justify">
                <p>The year is 1925. You are Detective Inspector James Morrison, traveling aboard the <span className="font-semibold">luxurious</span> Midnight Express, a train bound for Vienna through the snow-covered Alps.</p>
                <p>At precisely 2:47 AM, a <span className="font-semibold">piercing</span> scream shatters the silence of the sleeping carriages. You rush to compartment seven to discover Mr. Richard Ashford, a <span className="font-semibold">prominent</span> banker from London, lying dead on the floor with an ornate letter opener <span className="font-semibold">lodged</span> deep in his back.</p>
                <p className="font-bold text-red-700">The killer is still aboard. The train won't reach the next station until dawn. You must solve this case before more innocent lives are lost... including your own.</p>
              </div>
              
              <button 
                onClick={() => {
                  setCurrentVocabulary(vocabularyBySection.intro);
                  setShowVocabulary(!showVocabulary);
                }} 
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition"
              >
                📚 {showVocabulary ? 'Hide' : 'Show'} New Vocabulary
              </button>
              
              {showVocabulary && (
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                  <h3 className="font-bold text-blue-900 mb-2">Vocabulary:</h3>
                  <ul className="space-y-2">
                    {currentVocabulary.map((item, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-bold text-blue-800">{item.word}:</span> {item.definition}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => {
              setGameState('investigation');
              setShowVocabulary(false);
            }} 
            className="w-full bg-red-800 text-white py-3 rounded-lg hover:bg-red-900 font-bold text-lg transition shadow-lg"
          >
            Begin Investigation
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'investigation') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
          <div className="flex items-center justify-between mb-6 border-b-2 border-amber-900 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">🔍 Investigation Hub</h1>
            <button onClick={() => setMusicEnabled(!musicEnabled)} className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition">
              {musicEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>

          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 rounded-lg mb-4 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-gray-900 bg-opacity-50 p-3 rounded">
                <p className="text-xs text-gray-300">Time</p>
                <p className="font-bold text-lg">{currentTime}</p>
              </div>
              <div className="bg-gray-900 bg-opacity-50 p-3 rounded">
                <p className="text-xs text-gray-300">Evidence</p>
                <p className="font-bold text-lg">{evidence.length}/9</p>
              </div>
              <div className="bg-gray-900 bg-opacity-50 p-3 rounded">
                <p className="text-xs text-gray-300">Deaths</p>
                <p className="font-bold text-lg text-red-400">{deathCount}</p>
              </div>
              <div className="bg-gray-900 bg-opacity-50 p-3 rounded">
                <p className="text-xs text-gray-300">Suspects</p>
                <p className="font-bold text-lg text-green-400">{aliveSuspects.length}</p>
              </div>
            </div>
          </div>

          {wrongAccusations > 0 && (
            <div className="bg-red-100 border-l-4 border-red-600 p-4 mb-4 rounded">
              <p className="text-red-800 font-bold text-sm">
                ⚠️ Warning: {wrongAccusations} wrong {wrongAccusations === 1 ? 'accusation' : 'accusations'} made. 
                Be more careful - innocent lives depend on your decisions!
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button onClick={() => setGameState('crime-scene')} className="bg-white p-4 rounded-lg border-2 hover:border-red-600 text-left transition shadow-md hover:shadow-xl">
              <h3 className="font-bold text-lg mb-2 text-red-800">🔍 Examine Crime Scene</h3>
              <p className="text-sm text-gray-600">Search for physical evidence and clues</p>
              <div className="mt-2 text-xs">
                {['Letter opener with initials V.A.', 'Torn blackmail letter', 'Glass with sleeping medication'].filter(e => evidence.includes(e)).length}/3 items found
              </div>
            </button>

            <button onClick={() => setGameState('interview')} className="bg-white p-4 rounded-lg border-2 hover:border-purple-600 text-left transition shadow-md hover:shadow-xl">
              <h3 className="font-bold text-lg mb-2 text-purple-800">👥 Interview Passengers</h3>
              <p className="text-sm text-gray-600">Question suspects about their whereabouts</p>
              <div className="mt-2 text-xs">
                {aliveSuspects.filter(s => evidence.includes(`Interviewed ${s.name}`)).length}/{aliveSuspects.length} suspects interviewed
              </div>
            </button>

            <button onClick={() => setGameState('search-train')} className="bg-white p-4 rounded-lg border-2 hover:border-green-600 text-left transition shadow-md hover:shadow-xl">
              <h3 className="font-bold text-lg mb-2 text-green-800">🚂 Search Train</h3>
              <p className="text-sm text-gray-600">Investigate compartments and common areas</p>
              <div className="mt-2 text-xs">
                {['Empty letter opener box', 'Sleeping medication bottle', 'Brandy glass with residue'].filter(e => evidence.includes(e)).length}/3 locations searched
              </div>
            </button>

            <button onClick={() => setGameState('analyze')} className="bg-white p-4 rounded-lg border-2 hover:border-blue-600 text-left transition shadow-md hover:shadow-xl">
              <h3 className="font-bold text-lg mb-2 text-blue-800">📋 Analyze Evidence</h3>
              <p className="text-sm text-gray-600">Review findings and draw connections</p>
              <div className="mt-2 text-xs">
                {evidence.length} {evidence.length === 1 ? 'piece' : 'pieces'} of evidence to analyze
              </div>
            </button>
          </div>

          {evidence.length >= 3 && (
            <div className="bg-gradient-to-r from-green-700 to-green-600 p-1 rounded-lg shadow-lg">
              <button onClick={() => setGameState('accusation')} className="w-full bg-white py-4 rounded-lg font-bold text-green-800 text-lg hover:bg-green-50 transition">
                ⚖️ Make Your Accusation
              </button>
            </div>
          )}

          {evidence.length < 3 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-800 text-sm">
                💡 <strong>Tip:</strong> Collect at least 3 pieces of evidence before making an accusation. 
                Interview suspects, examine the crime scene thoroughly, and search the train for clues.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'crime-scene') {
    if (selectedItem) {
      const descriptions = {
        weapon: {
          title: '🗡️ The Murder Weapon',
          svg: '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e8e8e8"/><stop offset="50%" style="stop-color:#ffffff"/><stop offset="100%" style="stop-color:#a0a0a0"/></linearGradient></defs><rect x="0" y="0" width="300" height="300" fill="#2c2c2c"/><path d="M 145 50 L 155 50 L 160 200 L 140 200 Z" fill="url(#blade)" stroke="#666" stroke-width="2"/><ellipse cx="150" cy="205" rx="20" ry="8" fill="#b8860b" stroke="#8b7355" stroke-width="2"/><rect x="135" y="210" width="30" height="60" rx="8" fill="#8b7355" stroke="#654321" stroke-width="2"/><circle cx="150" cy="225" r="6" fill="#daa520"/><circle cx="150" cy="245" r="6" fill="#daa520"/><text x="150" y="238" font-family="serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#2c2c2c">V.A.</text><ellipse cx="148" cy="100" rx="4" ry="25" fill="#8B0000" opacity="0.7"/></svg>',
          text: 'You carefully examine the sterling silver letter opener protruding from the victim\'s back. The blade bears intricate floral engravings along its length, clearly the work of a master craftsman. Upon closer inspection, you notice the initials "V.A." elegantly engraved on the ornate handle. Dark crimson stains mar the polished surface—undoubtedly the victim\'s blood. The weapon appears to have been thrust with considerable force, suggesting either great strength or intense rage. This is no ordinary letter opener; it\'s an expensive piece that someone would greatly miss.',
          clue: 'The weapon belongs to Lady Victoria Ashford—either she is the killer, or someone deliberately used her possession to frame her.',
          vocab: [
            { word: 'protruding', definition: 'sticking out from a surface' },
            { word: 'intricate', definition: 'very detailed and complicated' },
            { word: 'ornate', definition: 'highly decorated with complex patterns' },
            { word: 'crimson', definition: 'a deep, rich red color' }
          ]
        },
        desk: {
          title: '📄 The Desk Papers',
          svg: '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="300" height="300"/><rect x="30" y="200" width="240" height="60" fill="#4a2511" stroke="#2d1508" stroke-width="2"/><path d="M 40 90 L 120 90 L 122 200 L 38 200 Z" fill="#f5f5dc" stroke="#333" stroke-width="2"/><text x="80" y="135" font-size="10" fill="#8B0000" font-weight="bold">BLACKMAIL</text><line x1="50" y1="150" x2="110" y2="150" stroke="#333"/><rect x="140" y="80" width="100" height="130" fill="#fffacd" stroke="#333" stroke-width="2" transform="rotate(-5 190 145)"/><text x="190" y="135" font-size="9" fill="#8B0000" text-anchor="middle">£50,000</text><text x="190" y="155" font-size="8" fill="#333" text-anchor="middle">or I expose</text><text x="190" y="170" font-size="8" fill="#333" text-anchor="middle">everything...</text></svg>',
          text: 'Scattered across the mahogany desk are numerous financial documents and correspondence. Among the chaos, you discover a torn letter written in desperate, hasty handwriting. The fragments reveal a chilling blackmail demand: "Pay £50,000 by the end of this week, or I shall expose your fraudulent dealings to the medical board and the authorities." The letter is unsigned, but the paper quality suggests education and means. Bank statements show multiple large withdrawals over the past month—Ashford was clearly paying someone to keep quiet. But about what? And did the blackmailer follow through with their threat?',
          clue: 'Mr. Ashford was being blackmailed for £50,000, likely related to illegal or unethical activities involving the medical profession.',
          vocab: [
            { word: 'correspondence', definition: 'letters or emails exchanged between people' },
            { word: 'fraudulent', definition: 'involving deception for illegal gain' },
            { word: 'authorities', definition: 'people or organizations with official power' },
            { word: 'blackmail', definition: 'demanding money by threatening to reveal secrets' }
          ]
        },
        nightstand: {
          title: '🥃 The Nightstand',
          svg: '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="300" height="300"/><rect x="50" y="220" width="200" height="60" fill="#5c3317"/><path d="M 120 150 L 130 220 L 180 220 L 190 150 Z" fill="none" stroke="#87CEEB" stroke-width="4"/><ellipse cx="155" cy="150" rx="35" ry="10" fill="none" stroke="#87CEEB" stroke-width="4"/><ellipse cx="155" cy="218" rx="30" ry="8" fill="#b0d4e3"/><ellipse cx="155" cy="215" rx="25" ry="6" fill="#8B0000" opacity="0.5"/><circle cx="210" cy="180" r="35" fill="#FFD700" stroke="#b8860b" stroke-width="3"/><circle cx="210" cy="180" r="30" fill="#f5f5f5"/><text x="210" y="160" font-size="9" fill="#333" text-anchor="middle">12</text><text x="230" y="183" font-size="9" fill="#333">3</text><line x1="210" y1="180" x2="210" y2="165" stroke="#333" stroke-width="3"/><line x1="210" y1="180" x2="225" y2="185" stroke="#333" stroke-width="2"/><text x="155" y="270" font-size="11" fill="#8B0000" text-anchor="middle" font-weight="bold">2:43 AM</text></svg>',
          text: 'On the nightstand beside the bed sits a crystal glass containing the remnants of what appears to be brandy. You lift it carefully and detect a faint, bitter smell mixed with the alcohol—definitely not just brandy. A chemical analysis would be needed to confirm, but your experience tells you this drink was laced with some form of sedative, possibly chloral hydrate or another sleeping medication. Next to the glass, you notice the victim\'s gold pocket watch has stopped precisely at 2:43 AM—four minutes before the scream was heard. The victim must have consumed the drugged beverage willingly, suggesting he trusted whoever offered it to him.',
          clue: 'The victim was deliberately drugged with sleeping medication before being murdered—this required medical knowledge and access to pharmaceuticals.',
          vocab: [
            { word: 'remnants', definition: 'small remaining parts of something' },
            { word: 'sedative', definition: 'a drug that makes you calm or sleepy' },
            { word: 'laced', definition: 'mixed with a substance, often secretly' },
            { word: 'pharmaceuticals', definition: 'medicinal drugs' }
          ]
        }
      };

      const desc = descriptions[selectedItem];
      return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
          <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
            <h2 className="text-2xl font-bold text-red-800 mb-4">{desc.title}</h2>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 mb-4">
              <div dangerouslySetInnerHTML={{ __html: desc.svg }} className="w-full max-w-sm mx-auto" />
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-800 mb-4">
              <p className="text-gray-800 leading-relaxed mb-4 text-justify">{desc.text}</p>
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-600">
                <p className="font-bold text-blue-900 text-sm">Key Discovery:</p>
                <p className="text-gray-800 text-sm">{desc.clue}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setCurrentVocabulary(desc.vocab);
                setShowVocabulary(!showVocabulary);
              }} 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition mb-3"
            >
              📚 {showVocabulary ? 'Hide' : 'Show'} New Vocabulary
            </button>
            
            {showVocabulary && (
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300 mb-3">
                <h3 className="font-bold text-blue-900 mb-2">Vocabulary:</h3>
                <ul className="space-y-2">
                  {currentVocabulary.map((item, idx) => (
                    <li key={idx} className="text-sm">
                      <span className="font-bold text-blue-800">{item.word}:</span> {item.definition}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => {
                setSelectedItem(null);
                setShowVocabulary(false);
              }} className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-bold transition">
                ← Back
              </button>
              <button onClick={() => {
                setSelectedItem(null);
                setShowVocabulary(false);
                setGameState('investigation');
              }} className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition">
                Continue →
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
          <h2 className="text-2xl font-bold text-red-800 mb-4">🔍 Crime Scene Investigation</h2>
          <p className="mb-4 bg-amber-50 p-4 rounded text-justify">
            You enter the victim's compartment with cautious steps. The metallic scent of blood hangs heavy in the air. 
            Mr. Ashford lies face down on the Persian carpet, the ornate letter opener protruding from between his shoulder blades. 
            The room shows no signs of struggle—whoever did this, the victim trusted them enough to turn his back. 
            You must examine every detail carefully; the smallest clue could reveal the killer's identity.
          </p>

          <div className="space-y-3">
            <button onClick={() => {
              if (!evidence.includes('Letter opener with initials V.A.')) {
                addEvidence('Letter opener with initials V.A.');
              }
              setSelectedItem('weapon');
            }} 
            className="w-full bg-white p-4 rounded-lg border-2 hover:border-red-600 text-left transition shadow-md hover:shadow-lg">
              <strong className="text-lg block">🗡️ Examine the murder weapon</strong>
              <p className="text-sm text-gray-600">A sterling silver letter opener lodged in the victim's back</p>
              {evidence.includes('Letter opener with initials V.A.') && (
                <span className="text-green-600 text-sm font-bold">✓ Examined</span>
              )}
            </button>

            <button onClick={() => {
              if (!evidence.includes('Torn blackmail letter')) {
                addEvidence('Torn blackmail letter');
              }
              setSelectedItem('desk');
            }}
            className="w-full bg-white p-4 rounded-lg border-2 hover:border-red-600 text-left transition shadow-md hover:shadow-lg">
              <strong className="text-lg block">📄 Search the mahogany desk</strong>
              <p className="text-sm text-gray-600">Scattered papers, correspondence, and financial documents</p>
              {evidence.includes('Torn blackmail letter') && (
                <span className="text-green-600 text-sm font-bold">✓ Examined</span>
              )}
            </button>

            <button onClick={() => {
              if (!evidence.includes('Glass with sleeping medication')) {
                addEvidence('Glass with sleeping medication');
              }
              setSelectedItem('nightstand');
            }}
            className="w-full bg-white p-4 rounded-lg border-2 hover:border-red-600 text-left transition shadow-md hover:shadow-lg">
              <strong className="text-lg block">🥃 Inspect the nightstand</strong>
              <p className="text-sm text-gray-600">Crystal glass with suspicious residue and a stopped pocket watch</p>
              {evidence.includes('Glass with sleeping medication') && (
                <span className="text-green-600 text-sm font-bold">✓ Examined</span>
              )}
            </button>
          </div>

          <button onClick={() => setGameState('investigation')} className="w-full mt-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold transition">
            Return to Investigation
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'interview') {
    if (selectedItem !== null) {
      const interviews = [
        {
          name: 'Lady Victoria Ashford',
          role: 'Wealthy Heiress',
          svg: '<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="200" height="250"/><ellipse cx="100" cy="90" rx="40" ry="50" fill="#ffd1dc"/><circle cx="100" cy="60" r="30" fill="#ffd1dc"/><path d="M 75 55 Q 70 48 78 45" stroke="#000" stroke-width="2" fill="none"/><path d="M 125 55 Q 130 48 122 45" stroke="#000" stroke-width="2" fill="none"/><circle cx="88" cy="58" r="3" fill="#000"/><circle cx="112" cy="58" r="3" fill="#000"/><path d="M 90 70 Q 100 73 110 70" stroke="#c62828" stroke-width="2" fill="none"/><ellipse cx="100" cy="45" rx="35" ry="18" fill="#8b4513"/><rect x="70" y="140" width="60" height="80" fill="#4b0082"/><path d="M 70 140 L 55 165 L 55 220 L 70 220" fill="#4b0082"/><path d="M 130 140 L 145 165 L 145 220 L 130 220" fill="#4b0082"/><circle cx="100" cy="165" r="10" fill="#ffd700"/><ellipse cx="80" cy="75" rx="8" ry="4" fill="#ff69b4" opacity="0.6"/><ellipse cx="120" cy="75" rx="8" ry="4" fill="#ff69b4" opacity="0.6"/></svg>',
          dialogue: '"Detective, I find your implications utterly preposterous! Richard was my elder brother, yes, and we had our disagreements about Father\'s estate—but murder? That\'s simply barbaric. I\'m a lady of society, not some common criminal. That letter opener belongs to a set I inherited from our grandmother. Anyone could have taken it from my compartment; I rarely lock the door during the day. As for my whereabouts, I retired to my quarters around midnight with a terrible migraine. Miss Price, my governess, brought me chamomile tea at half past two—she can corroborate my statement. I was devastated when I heard poor Richard had been killed. We may have quarreled over money, but blood is thicker than water, Inspector."',
          analysis: 'Lady Victoria appears composed but defensive. Her alibi depends entirely on Miss Price\'s testimony. She admits to financial disputes with the victim—a clear motive for murder. The weapon belonged to her, though she claims it could have been stolen. Her emotional response seems calculated rather than genuine grief.',
          clues: ['Significant inheritance dispute with victim', 'Alibi: Miss Price at 2:30 AM', 'Letter opener belongs to her family set', 'Defensive and calculating demeanor'],
          vocab: [
            { word: 'preposterous', definition: 'completely unreasonable or ridiculous' },
            { word: 'barbaric', definition: 'extremely cruel or brutal' },
            { word: 'corroborate', definition: 'to confirm or support with evidence' },
            { word: 'demeanor', definition: 'outward behavior or manner' }
          ]
        },
        {
          name: 'Dr. Marcus Webb',
          role: 'Renowned Surgeon',
          svg: '<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="200" height="250"/><ellipse cx="100" cy="90" rx="38" ry="48" fill="#ffd7b5"/><circle cx="100" cy="62" r="28" fill="#ffd7b5"/><rect x="92" y="45" width="16" height="10" fill="#4a4a4a"/><rect x="80" y="54" width="40" height="15" rx="7" fill="none" stroke="#000" stroke-width="2"/><circle cx="90" cy="62" r="3" fill="#000"/><circle cx="110" cy="62" r="3" fill="#000"/><path d="M 92 75 Q 100 78 108 75" stroke="#000" stroke-width="2" fill="none"/><rect x="70" y="138" width="60" height="90" fill="#ffffff"/><path d="M 70 138 L 58 163 L 58 228 L 70 228" fill="#ffffff"/><path d="M 130 138 L 142 163 L 142 228 L 130 228" fill="#ffffff"/><circle cx="100" cy="175" r="18" fill="#ff0000"/><line x1="100" y1="161" x2="100" y2="189" stroke="#fff" stroke-width="3"/><line x1="86" y1="175" x2="114" y2="175" stroke="#fff" stroke-width="3"/></svg>',
          dialogue: '"I resent the insinuation that my medical expertise somehow implicates me in this tragedy, Inspector. Yes, I have access to various medications—sedatives, analgesics, and the like—but that\'s an occupational necessity, not evidence of wrongdoing. Mr. Ashford owed me a substantial sum for medical consultations I provided to his associates, but we had reached an amicable arrangement for repayment. I spent the evening reviewing medical journals in my compartment and retired around one o\'clock. I heard nothing unusual until that dreadful scream awakened me. I immediately went to offer assistance, but the poor man was already deceased. As a physician, I\'ve dedicated my life to preserving life, not taking it. This interrogation is becoming rather tedious, Detective."',
          analysis: 'Dr. Webb maintains professional composure but shows irritation when questioned. He admits to financial dealings with the victim and has clear access to sedatives. No alibi for the critical time period. His defensive tone when discussing his medical knowledge is noteworthy—perhaps he\'s hiding something about his practice?',
          clues: ['Financial dispute with victim—owed money', 'Complete access to sedatives and medical knowledge', 'No verifiable alibi for murder timeframe', 'Irritable when medical expertise questioned'],
          vocab: [
            { word: 'insinuation', definition: 'an indirect suggestion of something bad' },
            { word: 'analgesics', definition: 'pain-relieving medications' },
            { word: 'amicable', definition: 'characterized by friendliness and goodwill' },
            { word: 'interrogation', definition: 'formal and intensive questioning' }
          ]
        },
        {
          name: 'Colonel James Hartley',
          role: 'Retired Military Officer',
          svg: '<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="200" height="250"/><ellipse cx="100" cy="90" rx="40" ry="50" fill="#ffd7b5"/><circle cx="100" cy="60" r="30" fill="#ffd7b5"/><rect x="75" y="42" width="50" height="8" fill="#4a4a4a"/><path d="M 82 56 Q 78 50 84 48" stroke="#000" stroke-width="2" fill="none"/><path d="M 118 56 Q 122 50 116 48" stroke="#000" stroke-width="2" fill="none"/><circle cx="90" cy="60" r="3" fill="#000"/><circle cx="110" cy="60" r="3" fill="#000"/><rect x="88" y="70" width="24" height="6" fill="#8b4513"/><rect x="70" y="140" width="60" height="90" fill="#2f4f2f"/><circle cx="82" cy="158" r="6" fill="#ffd700"/><circle cx="100" cy="158" r="6" fill="#ffd700"/><circle cx="118" cy="158" r="6" fill="#ffd700"/><rect x="94" y="175" width="12" height="4" fill="#ffd700"/><rect x="94" y="182" width="12" height="4" fill="#ffd700"/></svg>',
          dialogue: '"I shall be frank with you, Inspector—I despised Richard Ashford. During the Great War, while brave men were dying in the trenches, he profited handsomely from supplying substandard medical equipment to field hospitals. Men under my command perished because of his greed. However, despising a man and murdering him are entirely different matters. I possess the training and temperament to kill, certainly—twenty years of military service ensures that—but I also possess honor and discipline. I was in the smoking car playing cards with the conductor until approximately two o\'clock. He can verify my presence. After that, I returned to my compartment, which happens to adjoin the victim\'s. I heard some muffled conversation around half past two, but nothing that alarmed me at the time. Make of that what you will, Inspector."',
          analysis: 'The Colonel displays controlled anger toward the victim—a strong motive rooted in wartime grievances. He openly admits to military training in lethal techniques. His alibi is partial: verified until 2 AM, but alone afterward. He was next door during the critical time and heard conversation—potentially valuable testimony, or a calculated admission to seem cooperative.',
          clues: ['Deep moral resentment toward victim—war profiteering', 'Military training in combat and killing', 'Partial alibi—verified until 2:00 AM only', 'Compartment adjacent to crime scene—heard voices'],
          vocab: [
            { word: 'substandard', definition: 'below the usual or required quality' },
            { word: 'perished', definition: 'died, especially in a violent or sudden way' },
            { word: 'temperament', definition: 'a person\'s nature or personality' },
            { word: 'adjoin', definition: 'to be next to and joined with' }
          ]
        },
        {
          name: 'Miss Eleanor Price',
          role: 'Governess',
          svg: '<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="200" height="250"/><ellipse cx="100" cy="95" rx="38" ry="50" fill="#ffd7b5"/><circle cx="100" cy="65" r="28" fill="#ffd7b5"/><ellipse cx="100" cy="50" rx="32" ry="22" fill="#654321"/><circle cx="90" cy="64" r="3" fill="#4a90e2"/><circle cx="110" cy="64" r="3" fill="#4a90e2"/><path d="M 92 75 Q 100 78 108 75" stroke="#ff69b4" stroke-width="2" fill="none"/><rect x="72" y="145" width="56" height="85" fill="#4682b4"/><circle cx="100" cy="178" r="8" fill="#fff" opacity="0.7"/><circle cx="100" cy="195" r="8" fill="#fff" opacity="0.7"/><circle cx="100" cy="212" r="8" fill="#fff" opacity="0.7"/></svg>',
          dialogue: '"Oh, Inspector, this is all so dreadfully frightening! I scarcely knew Mr. Ashford—I\'m merely employed by Lady Victoria to assist with correspondence and household management. I can confirm that I brought her ladyship chamomile tea at precisely half past two this morning. She was in her nightgown, reading by lamplight, and complained of a severe headache. That letter opener... I recognize it! It\'s from Lady Victoria\'s writing desk—a beautiful heirloom set. I dust them regularly. I can\'t fathom who would take it, or why. Lady Victoria has been terribly distraught since learning of her brother\'s death. Their relationship was strained, certainly, but I\'ve witnessed her genuine affection for him on numerous occasions. Please, you must believe me—my lady is incapable of such violence!"',
          analysis: 'Miss Price appears nervous and eager to defend her employer—perhaps too eager. She confirms Lady Victoria\'s alibi and identifies the weapon definitively. Her testimony could be truthful, or she might be protecting her mistress out of loyalty or fear of losing her position. Her limited interaction with the victim reduces her own motive, but she had access to the weapon.',
          clues: ['Confirms Lady Victoria\'s alibi at 2:30 AM', 'Definitively identifies weapon as Lady Victoria\'s', 'Displays strong loyalty to employer', 'Limited personal connection to victim'],
          vocab: [
            { word: 'scarcely', definition: 'barely; hardly at all' },
            { word: 'heirloom', definition: 'a valuable object passed down through generations' },
            { word: 'fathom', definition: 'to understand or comprehend' },
            { word: 'distraught', definition: 'extremely worried, upset, or confused' }
          ]
        },
        {
          name: 'Mr. Thomas Blackwood',
          role: 'Businessman',
          svg: '<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="200" height="250"/><ellipse cx="100" cy="92" rx="40" ry="50" fill="#ffd7b5"/><circle cx="100" cy="62" r="30" fill="#ffd7b5"/><rect x="70" y="38" width="60" height="18" fill="#2c2c2c"/><circle cx="88" cy="62" r="3" fill="#654321"/><circle cx="112" cy="62" r="3" fill="#654321"/><path d="M 90 76 Q 100 73 110 76" stroke="#000" stroke-width="2" fill="none"/><rect x="72" y="142" width="56" height="88" fill="#1a1a1a"/><rect x="94" y="158" width="12" height="40" fill="#fff"/><line x1="94" y1="172" x2="106" y2="172" stroke="#1a1a1a"/><line x1="94" y1="185" x2="106" y2="185" stroke="#1a1a1a"/><rect x="84" y="205" width="8" height="6" fill="#ffd700"/><rect x="108" y="205" width="8" height="6" fill="#ffd700"/></svg>',
          dialogue: '"Business is business, Inspector, and Ashford was a ruthless competitor. He systematically undermined my trading ventures, spread malicious rumors to discredit my firm, and poached my most lucrative clients through underhanded tactics. Did I detest the man? Absolutely. Did I benefit from his demise? Undoubtedly—his death removes a significant obstacle to my commercial success. However, I\'m a pragmatist, not a fool. Murdering someone on a train where escape is impossible would be absurdly reckless. I spent the night reviewing contracts and financial projections in my compartment. No witnesses, I\'m afraid—I prefer working in solitude. I\'m accustomed to being suspected due to my reputation, Inspector, but I assure you my methods are aggressive, not homicidal."',
          analysis: 'Blackwood is remarkably candid about his hatred for the victim and admits he benefits from the death—unusual honesty that could indicate either innocence or extreme cunning. He acknowledges no alibi and seems unconcerned by this fact. His business background suggests strategic thinking, but his blunt approach seems inconsistent with the calculated nature of this murder.',
          clues: ['Intense business rivalry—victim destroyed his ventures', 'Openly admits benefiting from victim\'s death', 'No alibi whatsoever—alone all night', 'Remarkably calm and analytical about situation'],
          vocab: [
            { word: 'systematically', definition: 'in an organized and methodical way' },
            { word: 'lucrative', definition: 'producing a great deal of profit' },
            { word: 'pragmatist', definition: 'a person who deals with things practically' },
            { word: 'homicidal', definition: 'related to or capable of murder' }
          ]
        }
      ];

      const interview = interviews[selectedItem];
      return (
        <div className="max-w-5xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
          <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
            <h2 className="text-2xl font-bold text-purple-800 mb-2">{interview.name}</h2>
            <p className="text-sm text-gray-600 mb-4 italic">{interview.role}</p>
            
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg p-4 mb-4">
              <div dangerouslySetInnerHTML={{ __html: interview.svg }} className="w-full max-w-xs mx-auto" />
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-400 mb-4">
              <p className="text-gray-800 italic leading-relaxed text-justify">{interview.dialogue}</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-600 mb-4">
              <h3 className="font-bold text-amber-900 mb-2">🔍 Your Analysis:</h3>
              <p className="text-sm text-gray-800 text-justify leading-relaxed">{interview.analysis}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-400 mb-4">
              <h3 className="font-bold text-blue-900 mb-2">Key Points Noted:</h3>
              <ul className="space-y-1">
                {interview.clues.map((clue, idx) => (
                  <li key={idx} className="text-sm text-gray-800">• {clue}</li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => {
                setCurrentVocabulary(interview.vocab);
                setShowVocabulary(!showVocabulary);
              }} 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition mb-3"
            >
              📚 {showVocabulary ? 'Hide' : 'Show'} New Vocabulary
            </button>
            
            {showVocabulary && (
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300 mb-3">
                <h3 className="font-bold text-blue-900 mb-2">Vocabulary:</h3>
                <ul className="space-y-2">
                  {currentVocabulary.map((item, idx) => (
                    <li key={idx} className="text-sm">
                      <span className="font-bold text-blue-800">{item.word}:</span> {item.definition}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => {
                setSelectedItem(null);
                setShowVocabulary(false);
              }} className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-bold transition">
                ← Back
              </button>
              <button onClick={() => {
                setSelectedItem(null);
                setShowVocabulary(false);
                setGameState('investigation');
              }} className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition">
                Continue →
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
          <h2 className="text-2xl font-bold text-red-800 mb-4">👥 Interview Passengers</h2>
          <p className="mb-4 bg-amber-50 p-4 rounded text-justify">
            Five passengers remain under suspicion. Each has a potential motive, means, and opportunity. 
            You must question them carefully—their words, tone, and body language may reveal crucial information. 
            Remember: the guilty often hide behind layers of truth mixed with carefully crafted lies. 
            Who is telling the truth? Who is concealing something? The answers lie in their testimonies.
          </p>

          <div className="space-y-3">
            {aliveSuspects.map((suspect, index) => (
              <button key={suspect.name} onClick={() => {
                if (!evidence.includes(`Interviewed ${suspect.name}`)) {
                  addEvidence(`Interviewed ${suspect.name}`);
                }
                setSelectedItem(index);
              }} className="w-full bg-white p-4 rounded-lg border-2 hover:border-purple-600 text-left transition shadow-md hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-lg block">{suspect.name}</strong>
                    <p className="text-sm text-gray-600">{suspect.role}</p>
                  </div>
                  {evidence.includes(`Interviewed ${suspect.name}`) && (
                    <span className="text-green-600 font-bold">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => setGameState('investigation')} className="w-full mt-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold transition">
            Return to Investigation
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'search-train') {
    if (selectedItem) {
      const locations = {
        victoria: {
          title: '👑 Lady Victoria\'s Compartment',
          svg: '<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="300" height="200"/><rect x="50" y="80" width="200" height="100" fill="#6d4c41" stroke="#4a2511" stroke-width="3"/><rect x="65" y="95" width="170" height="70" fill="#8d6e63"/><rect x="90" y="110" width="120" height="40" rx="5" fill="#5c3317" stroke="#3e2723" stroke-width="2"/><rect x="110" y="120" width="80" height="8" fill="#daa520"/><rect x="110" y="132" width="80" height="8" fill="#daa520"/><ellipse cx="150" cy="145" rx="25" ry="8" fill="#4a2511" opacity="0.3"/><text x="150" y="148" font-size="12" fill="#8B0000" text-anchor="middle" font-weight="bold">EMPTY</text><circle cx="220" cy="130" r="8" fill="#ffd700"/><circle cx="235" cy="130" r="8" fill="#ffd700"/></svg>',
          text: 'You carefully search Lady Victoria\'s opulent quarters. The compartment reeks of expensive perfume and displays immaculate taste—silk curtains, embroidered cushions, and fine mahogany furniture. On her writing desk sits an ornate wooden box lined with crimson velvet. It\'s designed to hold a complete set of silver letter openers, but one slot lies conspicuously empty. The remaining pieces bear matching floral engravings and the same "V.A." initials you saw on the murder weapon. There are no signs of forced entry or tampering with the lock. Either Lady Victoria used her own letter opener, or someone with access to her private quarters deliberately took it to frame her. The question is: who would dare enter a lady\'s compartment uninvited?',
          clue: 'The murder weapon definitively belongs to Lady Victoria\'s heirloom set. Either she\'s the killer, or someone with intimate access to her compartment framed her.',
          vocab: [
            { word: 'opulent', definition: 'extremely luxurious and expensive' },
            { word: 'immaculate', definition: 'perfectly clean and tidy' },
            { word: 'conspicuously', definition: 'in a way that attracts attention; obviously' },
            { word: 'tampering', definition: 'interfering with something to cause damage' }
          ]
        },
        webb: {
          title: '💼 Dr. Webb\'s Medical Bag',
          svg: '<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="300" height="200"/><rect x="70" y="60" width="160" height="100" rx="8" fill="#654321" stroke="#3e2723" stroke-width="3"/><rect x="140" y="50" width="20" height="20" fill="#8b7355"/><line x1="80" y1="70" x2="220" y2="70" stroke="#3e2723" stroke-width="2"/><rect x="90" y="85" width="120" height="60" fill="#4a2511" opacity="0.3"/><rect x="100" y="95" width="25" height="40" rx="3" fill="#8B4513" stroke="#654321" stroke-width="2"/><text x="112" y="112" font-size="8" fill="#fff" text-anchor="middle">Sleep</text><text x="112" y="122" font-size="8" fill="#fff" text-anchor="middle">Aid</text><ellipse cx="112" cy="130" rx="8" ry="3" fill="#fff" opacity="0.3"/><rect x="135" y="100" width="15" height="30" fill="#c0c0c0"/><rect x="160" y="105" width="15" height="25" fill="#c0c0c0"/><circle cx="195" cy="115" r="8" fill="#ff0000"/><line x1="190" y1="115" x2="200" y2="115" stroke="#fff" stroke-width="2"/></svg>',
          text: 'Searching Dr. Webb\'s compartment, you discover his leather medical bag tucked beneath the bed. Inside, you find an array of surgical instruments, bandages, and various pharmaceutical bottles. One bottle immediately catches your attention: chloral hydrate, a potent sedative commonly prescribed for severe insomnia. The prescription label indicates it was dispensed to Dr. Webb himself merely two weeks ago, yet the bottle is already half depleted. Either the doctor suffers from extraordinarily severe sleep difficulties, or he\'s been using the medication for other purposes. The chemical composition matches what you detected in the victim\'s brandy glass. This evidence is damning—Webb possessed both the means and the medical expertise to administer a fatal dose disguised as a nightcap.',
          clue: 'Dr. Webb had immediate access to the sedative used to drug the victim. The depleted bottle suggests he\'s been using it far more than necessary for personal medical needs.',
          vocab: [
            { word: 'array', definition: 'an impressive display or range of things' },
            { word: 'potent', definition: 'having great power or effect; strong' },
            { word: 'dispensed', definition: 'distributed or provided, especially medicine' },
            { word: 'depleted', definition: 'reduced in quantity; used up' }
          ]
        },
        dining: {
          title: '🍷 The Dining Car',
          svg: '<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg"><rect fill="#1a1a1a" width="300" height="200"/><rect x="50" y="120" width="200" height="15" fill="#4a2511"/><rect x="60" y="135" width="180" height="50" fill="#3e2723"/><path d="M 90 80 L 100 120 L 140 120 L 150 80 Z" fill="none" stroke="#87CEEB" stroke-width="3"/><ellipse cx="120" cy="80" rx="30" ry="8" fill="none" stroke="#87CEEB" stroke-width="3"/><ellipse cx="120" cy="118" rx="25" ry="6" fill="#b0d4e3"/><ellipse cx="120" cy="115" rx="20" ry="5" fill="#8B0000" opacity="0.4"/><path d="M 160 80 L 170 120 L 210 120 L 220 80 Z" fill="none" stroke="#87CEEB" stroke-width="3"/><ellipse cx="190" cy="80" rx="30" ry="8" fill="none" stroke="#87CEEB" stroke-width="3"/><ellipse cx="190" cy="118" rx="25" ry="6" fill="#b0d4e3"/><ellipse cx="188" cy="115" rx="8" ry="3" fill="#ff69b4" opacity="0.6"/><text x="150" y="170" font-size="11" fill="#daa520" text-anchor="middle">Victoria & Webb</text><text x="150" y="185" font-size="10" fill="#999" text-anchor="middle">11 PM meeting</text></svg>',
          text: 'The dining car steward proves remarkably observant. He recalls that Lady Victoria and Dr. Webb shared a private table around 11 PM, engaging in what appeared to be an intense, hushed conversation. Two crystal brandy glasses still sit on their table, unwashed. The first glass bears traces of crimson lipstick along the rim—unmistakably Lady Victoria\'s shade. The second glass contains a faint residue that smells distinctly medicinal, similar to what you found in the victim\'s compartment. The steward noticed Webb preparing both drinks himself at the bar, though he couldn\'t see exactly what went into them. This clandestine meeting occurred just hours before the murder. Were they conspiring together, or did Webb deceive Lady Victoria into an unknowing alliance? The evidence suggests these two had more than a casual acquaintance.',
          clue: 'Lady Victoria and Dr. Webb had a secret late-night meeting where Webb prepared drugged drinks. They may be accomplices, or Webb manipulated Victoria as part of his scheme.',
          vocab: [
            { word: 'steward', definition: 'a person who serves passengers on a train or ship' },
            { word: 'clandestine', definition: 'kept secret or done secretively' },
            { word: 'conspiring', definition: 'making secret plans together to do something harmful' },
            { word: 'alliance', definition: 'a partnership or agreement to work together' }
          ]
        }
      };

      const location = locations[selectedItem];
      return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
          <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
            <h2 className="text-2xl font-bold text-green-800 mb-4">{location.title}</h2>
            
            <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-lg p-4 mb-4">
              <div dangerouslySetInnerHTML={{ __html: location.svg }} className="w-full max-w-md mx-auto" />
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-600 mb-4">
              <p className="text-gray-800 leading-relaxed mb-4 text-justify">{location.text}</p>
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-600">
                <p className="font-bold text-blue-900 text-sm">Critical Discovery:</p>
                <p className="text-gray-800 text-sm">{location.clue}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setCurrentVocabulary(location.vocab);
                setShowVocabulary(!showVocabulary);
              }} 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition mb-3"
            >
              📚 {showVocabulary ? 'Hide' : 'Show'} New Vocabulary
            </button>
            
            {showVocabulary && (
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300 mb-3">
                <h3 className="font-bold text-blue-900 mb-2">Vocabulary:</h3>
                <ul className="space-y-2">
                  {currentVocabulary.map((item, idx) => (
                    <li key={idx} className="text-sm">
                      <span className="font-bold text-blue-800">{item.word}:</span> {item.definition}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => {
                setSelectedItem(null);
                setShowVocabulary(false);
              }} className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-bold transition">
                ← Back
              </button>
              <button onClick={() => {
                setSelectedItem(null);
                setShowVocabulary(false);
                setGameState('investigation');
              }} className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition">
                Continue →
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
          <h2 className="text-2xl font-bold text-red-800 mb-4">🔦 Search the Train</h2>
          <p className="mb-4 bg-amber-50 p-4 rounded text-justify">
            The murderer left traces beyond the immediate crime scene. You must conduct a thorough search of the suspect's quarters and public areas. 
            Physical evidence doesn't lie—unlike people, objects reveal the truth without deception. 
            Each compartment may contain crucial clues that either confirm or contradict the testimonies you've heard. 
            Search methodically and leave no stone unturned.
          </p>

          <div className="space-y-3">
            <button onClick={() => {
              if (!evidence.includes('Empty letter opener box')) {
                addEvidence('Empty letter opener box');
              }
              setSelectedItem('victoria');
            }}
            className="w-full bg-white p-4 rounded-lg border-2 hover:border-green-600 text-left transition shadow-md hover:shadow-lg">
              <strong className="text-lg block">👑 Lady Victoria's Private Compartment</strong>
              <p className="text-sm text-gray-600">Luxurious quarters with elegant furnishings and a writing desk</p>
              {evidence.includes('Empty letter opener box') && (
                <span className="text-green-600 text-sm font-bold">✓ Searched</span>
              )}
            </button>

            <button onClick={() => {
              if (!evidence.includes('Sleeping medication bottle')) {
                addEvidence('Sleeping medication bottle');
              }
              setSelectedItem('webb');
            }}
            className="w-full bg-white p-4 rounded-lg border-2 hover:border-green-600 text-left transition shadow-md hover:shadow-lg">
              <strong className="text-lg block">💼 Dr. Webb's Medical Equipment</strong>
              <p className="text-sm text-gray-600">Professional physician's bag containing instruments and pharmaceuticals</p>
              {evidence.includes('Sleeping medication bottle') && (
                <span className="text-green-600 text-sm font-bold">✓ Searched</span>
              )}
            </button>

            <button onClick={() => {
              if (!evidence.includes('Brandy glass with residue')) {
                addEvidence('Brandy glass with residue');
              }
              setSelectedItem('dining');
            }}
            className="w-full bg-white p-4 rounded-lg border-2 hover:border-green-600 text-left transition shadow-md hover:shadow-lg">
              <strong className="text-lg block">🍷 The Dining Car Investigation</strong>
              <p className="text-sm text-gray-600">Question staff and examine evidence of late-night activities</p>
              {evidence.includes('Brandy glass with residue') && (
                <span className="text-green-600 text-sm font-bold">✓ Searched</span>
              )}
            </button>
          </div>

          <button onClick={() => setGameState('investigation')} className="w-full mt-4 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold transition">
            Return to Investigation
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'analyze') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
          <h2 className="text-2xl font-bold text-red-800 mb-4">📋 Evidence Analysis</h2>
          
          <div className="bg-gray-100 p-3 rounded mb-4">
            <p className="text-sm">
              <strong>Current Status:</strong> Time: {currentTime} | Deaths: {deathCount} | Suspects Alive: {aliveSuspects.length}
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg mb-4 border-2 border-amber-700">
            <h3 className="font-bold mb-3 text-amber-900">📦 Collected Evidence ({evidence.length}/9):</h3>
            {evidence.length === 0 ? (
              <p className="text-gray-600 italic text-center py-4">No evidence collected yet. Search the crime scene and train thoroughly.</p>
            ) : (
              <div className="space-y-2">
                {evidence.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border-l-4 border-green-600 shadow-sm">
                    <div className="flex gap-2 items-start">
                      <span className="text-green-600 font-bold text-lg">✓</span>
                      <div>
                        <p className="font-semibold text-gray-800">{item}</p>
                        <p className="text-xs text-gray-500">Evidence #{idx + 1} - Collected at {currentTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4 border-2 border-blue-400">
            <h3 className="font-bold mb-3 text-blue-900">🎯 Key Findings Summary:</h3>
            {evidence.length < 3 ? (
              <p className="text-gray-600 italic text-sm">Collect more evidence to see patterns and connections...</p>
            ) : (
              <div className="space-y-3 text-sm">
                {evidence.includes('Letter opener with initials V.A.') && (
                  <div className="bg-white p-3 rounded border-l-4 border-purple-600">
                    <p className="font-bold text-purple-800">Weapon Analysis:</p>
                    <p className="text-gray-700">The murder weapon belongs to Lady Victoria Ashford's personal collection.</p>
                  </div>
                )}
                {evidence.includes('Glass with sleeping medication') && (
                  <div className="bg-white p-3 rounded border-l-4 border-red-600">
                    <p className="font-bold text-red-800">Toxicology Finding:</p>
                    <p className="text-gray-700">Victim was drugged with sedatives before being killed - requires medical knowledge.</p>
                  </div>
                )}
                {evidence.includes('Sleeping medication bottle') && (
                  <div className="bg-white p-3 rounded border-l-4 border-orange-600">
                    <p className="font-bold text-orange-800">Medical Evidence:</p>
                    <p className="text-gray-700">Dr. Webb has access to the exact sedative used on the victim.</p>
                  </div>
                )}
                {evidence.includes('Brandy glass with residue') && evidence.includes('Empty letter opener box') && (
                  <div className="bg-white p-3 rounded border-l-4 border-yellow-600">
                    <p className="font-bold text-yellow-800">Conspiracy Theory:</p>
                    <p className="text-gray-700">Webb and Victoria met secretly. The evidence suggests possible collaboration or manipulation.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-600">
            <h3 className="font-bold mb-3 text-green-900">👥 Suspects Overview:</h3>
            <div className="space-y-2 text-sm">
              {aliveSuspects.map((suspect) => {
                const isInterviewed = evidence.includes(`Interviewed ${suspect.name}`);
                return (
                  <div key={suspect.name} className={`p-3 rounded ${isInterviewed ? 'bg-white border-l-4 border-blue-500' : 'bg-gray-100 border-l-4 border-gray-400'}`}>
                    <p className="font-bold text-gray-800">{suspect.name}</p>
                    <p className="text-xs text-gray-600">{suspect.role}</p>
                    <p className="text-xs mt-1 font-semibold">
                      {isInterviewed ? (
                        <span className="text-green-600">✓ Interviewed</span>
                      ) : (
                        <span className="text-gray-500">Not yet interviewed</span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {evidence.length >= 5 && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border-2 border-yellow-600">
              <h3 className="font-bold text-yellow-900 mb-2">💡 Detective's Notes:</h3>
              <p className="text-sm text-gray-800 italic">
                "The evidence is mounting. The victim was drugged with sedatives, then stabbed with Victoria's letter opener. 
                Dr. Webb has both the means (sedatives) and opportunity (secret meeting). But is Victoria involved, or is she being framed? 
                I must be absolutely certain before making an accusation—one wrong move could cost innocent lives..."
              </p>
            </div>
          )}

          {evidence.length >= 3 && (
            <div className="bg-red-50 p-4 rounded-lg mb-4 border-2 border-red-500 text-center">
              <p className="font-bold text-red-800 mb-2">⚠️ Ready to Accuse?</p>
              <p className="text-sm text-gray-700">You have enough evidence to make an accusation. Review everything carefully before proceeding.</p>
            </div>
          )}

          <button onClick={() => setGameState('investigation')} className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold transition">
            Return to Investigation
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'death-scene') {
    const latestDeath = deathDetails[deathDetails.length - 1];
    const remainingCount = aliveSuspects.length;
    
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-red-900 to-black min-h-screen">
        <div className="bg-red-100 rounded-lg shadow-2xl p-6 border-4 border-red-900">
          <h2 className="text-3xl font-bold text-red-800 mb-4 text-center">💀 Another Death!</h2>
          
          <div className="bg-white p-6 rounded-lg mb-4 border-4 border-red-600">
            <p className="text-xl font-bold text-red-800 mb-3">Time: {latestDeath.time}</p>
            <p className="text-lg mb-3">
              A blood-curdling scream pierces the night once again. You rush through the corridors to find <span className="font-bold text-red-700">{latestDeath.name}</span> dead.
            </p>
            <p className="text-gray-800 italic mb-4 bg-gray-100 p-3 rounded">{latestDeath.method}</p>
            <p className="font-bold text-red-700 text-center text-lg">
              The killer strikes again! Your wrong accusation gave them the opportunity they needed.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-600 mb-4">
            <h3 className="font-bold text-yellow-900 mb-2">⚠️ Situation Critical:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Total deaths: <span className="font-bold text-red-700">{deathCount}</span></li>
              <li>• Suspects remaining: <span className="font-bold">{remainingCount}</span></li>
              <li>• Wrong accusations: <span className="font-bold text-red-700">{wrongAccusations}</span></li>
              <li>• Time until dawn: <span className="font-bold text-red-700">Running out fast...</span></li>
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-bold mb-3 text-gray-900">🗣️ The Survivors React:</h3>
            <div className="space-y-3 text-sm">
              {aliveSuspects.map((suspect) => {
                if (suspect.name === 'Dr. Marcus Webb') {
                  const webbReactions = [
                    { behavior: 'nervous and perspiring', quote: '"This is madness, Inspector! You must find the killer before we all perish! My medical expertise tells me we\'re running out of time..."' },
                    { behavior: 'visibly shaken, hands trembling as he lights a cigarette', quote: '"Good God! Another one dead! Inspector, your methods are clearly failing us. Perhaps... perhaps we should all lock ourselves in our compartments until dawn?"' },
                    { behavior: 'pale and avoiding eye contact, pacing frantically', quote: '"I can\'t take this anymore! Every moment we waste, the killer could be planning their next move. You need to act NOW, Inspector!"' },
                    { behavior: 'chain-smoking, his usual composure completely shattered', quote: '"We\'re all going to die if you don\'t catch them soon! I have patients waiting for me in Vienna—I can\'t... I won\'t end up like poor Ashford!"' }
                  ];
                  const reaction = webbReactions[Math.min(wrongAccusations - 1, webbReactions.length - 1)];
                  return (
                    <div key={suspect.name} className="bg-red-50 p-3 rounded border-l-4 border-red-600">
                      <p className="italic text-gray-800">
                        <span className="font-bold text-red-800">{suspect.name}</span> appears {reaction.behavior}.
                      </p>
                      <p className="text-gray-700 mt-1 italic">
                        {reaction.quote}
                      </p>
                    </div>
                  );
                } else {
                  const reactions = [
                    '"We\'re all going to die! Oh God, we\'re trapped on this train with a madman!"',
                    '"Inspector, you MUST do something! How many more must perish before you catch this monster?"',
                    '*sits in shocked silence, face drained of all color, unable to speak*',
                    '"I demand you lock us all in our compartments! At least then we\'ll be safe until dawn!"',
                    '"This is YOUR fault, Detective! Your incompetence is getting innocent people killed!"'
                  ];
                  return (
                    <div key={suspect.name} className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <p className="italic text-gray-800">
                        <span className="font-bold text-blue-800">{suspect.name}</span>: {reactions[Math.floor(Math.random() * reactions.length)]}
                      </p>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-400 mb-4">
            <p className="text-sm text-red-800 text-center font-semibold">
              Fear grips the remaining passengers. The atmosphere is suffocating with paranoia and terror. 
              You must solve this case NOW before more innocent lives are lost—or before the killer decides YOU are the next target.
            </p>
          </div>

          <button 
            onClick={() => setGameState('investigation')} 
            className="w-full bg-red-700 text-white py-4 rounded-lg hover:bg-red-800 font-bold text-lg transition shadow-lg"
          >
            Continue Investigation - Find The Killer NOW!
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'accusation') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="bg-amber-100 rounded-lg shadow-2xl p-6 border-4 border-amber-900">
          <h2 className="text-3xl font-bold text-red-800 mb-4 text-center">⚖️ The Final Accusation</h2>
          
          <div className="bg-red-50 p-5 rounded-lg mb-4 border-2 border-red-600">
            <h3 className="font-bold text-red-800 mb-3 text-center text-xl">⚠️ CRITICAL WARNING ⚠️</h3>
            <div className="space-y-2 text-sm text-gray-800">
              <p className="text-center">
                You are about to make your final accusation. This decision will determine the fate of everyone aboard this train.
              </p>
              <ul className="list-disc list-inside space-y-1 bg-white p-3 rounded">
                <li><strong>If you're correct:</strong> The killer will be arrested and justice served.</li>
                <li><strong>If you're wrong:</strong> Another innocent person will die while the real killer strikes again.</li>
                <li><strong>Too many mistakes:</strong> The killer may eliminate you before you can solve the case.</li>
              </ul>
              <p className="text-center font-bold text-red-700 mt-3">
                Choose wisely, Detective. Lives depend on your decision.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded mb-4 border-2 border-gray-400">
            <h3 className="font-bold mb-2 text-center">📊 Investigation Summary</h3>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <p className="text-gray-600">Evidence</p>
                <p className="font-bold text-2xl">{evidence.length}/9</p>
              </div>
              <div>
                <p className="text-gray-600">Deaths</p>
                <p className="font-bold text-2xl text-red-700">{deathCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="font-bold text-lg">{currentTime}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg mb-4 border-2 border-amber-600">
            <h3 className="font-bold text-amber-900 mb-3 text-center">Select Your Suspect:</h3>
            <div className="space-y-3">
              {aliveSuspects.map((suspect) => (
                <button 
                  key={suspect.name}
                  onClick={() => {
                    if (suspect.name === 'Dr. Marcus Webb') {
                      if (deathCount === 1) {
                        setGameState('perfect-ending');
                      } else {
                        setGameState('neutral-ending');
                      }
                    } else {
                      killInnocentSuspect(suspect.name);
                    }
                  }}
                  className="w-full bg-white p-4 rounded-lg border-2 hover:border-red-600 text-left transition shadow-md hover:shadow-xl hover:scale-105 transform"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-lg block text-gray-900">{suspect.name}</strong>
                      <p className="text-sm text-gray-600">{suspect.role}</p>
                      {evidence.includes(`Interviewed ${suspect.name}`) && (
                        <span className="text-xs text-green-600 font-semibold">✓ Interviewed</span>
                      )}
                    </div>
                    <div className="text-3xl">⚖️</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setGameState('investigation')} 
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold transition"
          >
            ← Return to Investigation (Gather More Evidence)
          </button>

          <p className="text-center text-xs text-gray-600 mt-3 italic">
            "In the detective's game, there are no second chances. Each accusation could be your last." - Inspector Morrison
          </p>
        </div>
      </div>
    );
  }

  if (gameState === 'perfect-ending') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-green-900 to-green-800 min-h-screen">
        <div className="bg-green-100 rounded-lg shadow-2xl p-6 border-4 border-green-900">
          <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">🎉 Perfect Resolution!</h2>
          
          <div className="bg-white p-6 rounded-lg mb-4 space-y-4">
            <p className="text-xl font-bold text-green-700 mb-3">Dr. Marcus Webb is the murderer!</p>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600 mb-4">
              <p className="text-justify italic text-gray-800">
                "You're absolutely correct, Inspector Morrison," Webb says, his professional composure finally cracking like thin ice. 
                His hands tremble as he realizes escape is impossible. The other passengers gasp in shock as the truth unfolds.
              </p>
            </div>
            
            <p className="text-justify">
              "Ashford discovered my illegal practice—I've been selling morphine and other controlled substances on the black market for years. 
              The money was too good, and my gambling debts were mounting. He threatened to report me to the medical board unless I paid him 
              an exorbitant sum every month. I couldn't allow my career to be destroyed by that greedy parasite."
            </p>
            
            <p className="text-justify">
              "I befriended Lady Victoria weeks ago during her London season, knowing she possessed those antique letter openers. 
              During our meeting in the dining car, I slipped chloral hydrate into a brandy glass intended for Ashford—he thought 
              Victoria had sent it as a peace offering. Once he was unconscious in his compartment, I used Victoria's letter opener 
              to frame her for the murder. The perfect crime... or so I believed until you pieced it together, Inspector."
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-700 mt-4">
              <p className="font-bold text-green-800 text-center text-lg">
                ⚖️ Justice Prevails! No innocent lives lost. ⚖️
              </p>
            </div>

            <p className="text-sm text-gray-700 italic text-center mt-3">
              As dawn breaks over the Alps, the train pulls into the station. 
              Local authorities take Webb into custody. You've saved innocent lives through brilliant deductive work.
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg mb-4 border-2 border-green-600">
            <h3 className="font-bold text-green-900 mb-3 text-center">📊 Perfect Detective Work</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Only the guilty party died</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Evidence collected: {evidence.length}/9</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Investigation time: {currentTime}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>All innocent passengers saved</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Dr. Marcus Webb arrested - will face trial for murder</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-bold text-green-700">FLAWLESS INVESTIGATION</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-green-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition shadow-lg"
          >
            🎮 Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'neutral-ending') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-yellow-900 to-orange-900 min-h-screen">
        <div className="bg-yellow-100 rounded-lg shadow-2xl p-6 border-4 border-yellow-900">
          <h2 className="text-3xl font-bold text-yellow-800 mb-4 text-center">⚖️ Bittersweet Victory</h2>
          
          <div className="bg-white p-6 rounded-lg mb-4 space-y-4">
            <p className="text-xl font-bold text-yellow-700 mb-3">You caught the killer... but at what cost?</p>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
              <p className="text-justify">
                Dr. Marcus Webb confesses to the murder of Richard Ashford, exactly as you suspected. The evidence was overwhelming: 
                the sedatives, the secret meeting with Victoria, the opportunity and motive. Justice will be served—Webb will hang for his crimes.
              </p>
            </div>
            
            <p className="text-justify">
              But your wrong accusations gave him precious time to eliminate witnesses who might have testified against him. 
              <span className="font-bold text-red-700"> {deathCount - 1} innocent {deathCount - 1 === 1 ? 'person has' : 'people have'} died</span> because 
              you accused the wrong suspects. Each death is a stain on your conscience, a reminder that even good detectives make fatal mistakes.
            </p>
            
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 italic">
              <p className="text-gray-800">
                "Thank you for your... <span className="font-semibold">persistence</span>, Inspector," Webb says coldly as the police take him away at the next station, 
                dawn breaking over the snow-covered peaks. "Though I must say, your investigative methods left something to be desired. 
                Perhaps next time you'll be more careful before throwing around accusations. Those people didn't have to die."
              </p>
            </div>
            
            <p className="text-center font-bold text-yellow-800 text-lg mt-4">
              The killer is caught, but the shadow of unnecessary deaths will haunt you forever.
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg mb-4 border-2 border-red-400">
            <h3 className="font-bold text-red-800 mb-3">💀 Casualties of Your Mistakes:</h3>
            <ul className="space-y-2 text-sm">
              {deathDetails.map((death, idx) => (
                <li key={idx} className="text-gray-800 border-b border-red-200 pb-2">
                  <span className="font-bold text-red-700">{death.name}</span>
                  <br />
                  <span className="text-xs text-gray-600">{death.method} ({death.time})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg mb-4 border-2 border-yellow-600">
            <h3 className="font-bold text-yellow-900 mb-3 text-center">📊 Final Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-xs">Total Deaths</p>
                <p className="font-bold text-2xl text-red-700">{deathCount}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-xs">Evidence Collected</p>
                <p className="font-bold text-2xl text-blue-700">{evidence.length}/9</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-xs">Final Time</p>
                <p className="font-bold text-lg text-gray-700">{currentTime}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="text-gray-600 text-xs">Wrong Accusations</p>
                <p className="font-bold text-2xl text-red-700">{wrongAccusations}</p>
              </div>
            </div>
            <div className="mt-3 bg-green-100 p-2 rounded text-center">
              <p className="text-sm">✅ Killer Apprehended: <span className="font-bold text-green-700">Dr. Marcus Webb</span></p>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-yellow-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-yellow-800 transition shadow-lg"
          >
            🔄 Try Again - Can You Save Everyone?
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'detective-death') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-black to-red-900 min-h-screen">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-6 border-4 border-red-900">
          <h2 className="text-3xl font-bold text-red-500 mb-4 text-center">☠️ GAME OVER ☠️</h2>
          
          <div className="bg-black p-6 rounded-lg mb-4 border-4 border-red-800 text-white space-y-4">
            <p className="text-2xl font-bold mb-4 text-center text-red-400">You Have Failed</p>
            
            <div className="bg-red-950 p-4 rounded-lg mb-4">
              <p className="mb-3 text-justify">
                Dawn breaks over the snow-covered Alps, but you don't see it. Your lifeless body lies cold in your compartment, 
                a victim of your own investigative incompetence. Dr. Marcus Webb stands over you, an empty syringe of lethal morphine in his gloved hand, 
                a cold smile on his lips.
              </p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-600 italic">
              <p className="text-red-200 text-justify">
                "A pity, Inspector Morrison. You were so close to the truth, yet so far from catching me. If only you had trusted the evidence 
                instead of making those reckless accusations. Now you join the others—unfortunate casualties of my need for freedom and survival. 
                Your bumbling investigation bought me exactly the time I needed to plan my escape. Thank you for being so... predictable."
              </p>
            </div>
            
            <p className="text-red-400 font-bold text-center text-lg mt-4">
              The killer escapes at the Vienna station, leaving only corpses behind.
            </p>

            <p className="text-gray-400 text-sm text-center italic mt-3">
              The case remains officially unsolved. Dr. Webb disappeared into the criminal underworld of Europe, 
              never to be seen again. Your failure becomes a cautionary tale in detective academies worldwide.
            </p>
          </div>

          <div className="bg-red-950 p-4 rounded-lg mb-4 border-2 border-red-700">
            <h3 className="font-bold text-red-300 mb-3 text-center">💀 Final Body Count</h3>
            <ul className="space-y-2 text-sm text-red-200">
              {deathDetails.map((death, idx) => (
                <li key={idx} className="border-b border-red-800 pb-2">
                  <span className="font-bold text-red-400">{death.name}</span>
                  <br />
                  <span className="text-xs text-gray-400">{death.method}</span>
                </li>
              ))}
              <li className="border-b border-red-800 pb-2 bg-red-900 p-2 rounded">
                <span className="font-bold text-red-300">Detective Inspector James Morrison (You)</span>
                <br />
                <span className="text-xs text-gray-300">Poisoned with morphine injection - {currentTime}</span>
              </li>
            </ul>
            
            <div className="mt-4 text-center">
              <p className="text-red-300 font-bold">Total Deaths: <span className="text-2xl">{deathCount + 1}</span></p>
              <p className="text-gray-400 text-sm mt-1">(including you)</p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-gray-300 mb-2">Your Final Statistics:</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• Evidence collected: <span className="text-white font-bold">{evidence.length}/9</span></li>
              <li>• Wrong accusations: <span className="text-red-400 font-bold">{wrongAccusations}</span></li>
              <li>• Time of death: <span className="text-white font-bold">{currentTime}</span></li>
              <li>• The killer: <span className="text-red-400 font-bold">Dr. Marcus Webb (escaped)</span></li>
              <li>• Case status: <span className="text-red-500 font-bold">UNSOLVED - DETECTIVE KILLED</span></li>
            </ul>
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-red-700 text-white py-4 rounded-lg hover:bg-red-600 font-bold text-lg transition shadow-lg"
          >
            💀 Try Again - Don't Make The Same Mistakes
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MysteryTrainGame;