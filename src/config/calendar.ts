/**
 * ============================================================
 *  CENTRAL CONFIG — edit almost everything here!
 * ============================================================
 *
 * How to customise:
 * 1. Change recipientName / senderName / year
 * 2. Set previewMode to false when you're ready to share
 * 3. Change lock.password and add your music file under public/audio/
 * 4. Edit each day's game + gift below
 * 5. Put images in public/gifts/ and reference them as "/gifts/my-photo.jpg"
 *
 * Game types available:
 *   wordGuess | emojiRiddle | memory | quiz | connections
 *   photoGuess | musicQuiz | songClip | crossword | picturePuzzle | whenTaken
 */

import type { CalendarConfig } from '../types'

export const calendarConfig: CalendarConfig = {
  recipientName: 'Louise',
  senderName: 'Johanna',
  year: 2026,

  // IMPORTANT: set this to false before sharing — otherwise every day opens early
  previewMode: true,

  lock: {
    // Change this to whatever password Louise should type
    password: 'lollojojjo',
    // Audio file lives in public/audio/
    musicSrc: '/audio/fairytale-of-new-york.m4a',
    musicVolume: 0.45,
  },

  days: [
    // —— Day 1 ———————————————————————————————————————————————
    {
      day: 1,
      doorTheme: 'snowflake',
      teaser: 'A little word',
      game: {
        type: 'wordGuess',
        title: 'Guess the Word',
        instructions:
          'Guess the 5-letter word. Green = correct spot, yellow = wrong spot, grey = not in the word.',
        word: 'NORTH',
        maxAttempts: 6,
      },
      gift: {
        title: 'The North Wind',
        message:
          'Din första gåva är en bok: The North Wind av Alexandria Warwick.\n\nA mortal woman. An ageless god. Wren of Edgewood is chosen as a sacrifice to the North Wind — a cold, immortal force of winter. Instead of death, she finds herself bound to him in a dangerous bargain. Between icy magic, old gods and a love that could save the world or destroy it, Wren must decide how much of herself she is willing to give to the storm.',
        image: '/gifts/north-wind.jpg',
        physicalGift: 'The North Wind — Alexandria Warwick (väntar på dig).',
      },
    },

    // —— Day 2 ———————————————————————————————————————————————
    {
      day: 2,
      doorTheme: 'pine',
      teaser: 'När togs fotot?',
      game: {
        type: 'whenTaken',
        title: 'When Taken',
        instructions:
          'Titta på fotot. Gissa år och månad med reglagen, zooma in på kartan och placera nålen så exakt du kan. Poängen styr vilken present du får!',
        image: '/gifts/when-taken-day2.jpg',
        year: 2020,
        month: 7,
        day: 23,
        lat: 58.35364,
        lng: 11.22414,
        placeLabel: 'Bohuslän (Smögen / Kungshamn)',
        yearMin: 2015,
        yearMax: 2025,
      },
      gift: {
        title: 'På tal om blommor…',
        message: 'En parfymtestare väntar på dig.',
        physicalGift: 'En parfymtestare.',
        rewardItems: [
          { image: '/gifts/perfume-tester.png', label: 'Parfymtestare' },
        ],
      },
      giftTiers: [
        {
          minScore: 9000,
          levelLabel: 'Nivå 4',
          title: 'På tal om blommor…',
          message:
            'Så nära — både i tid och på kartan! Du får parfymtestaren och tre Geisha.',
          physicalGift: 'En parfymtestare + 3 Geisha.',
          rewardItems: [
            { image: '/gifts/perfume-tester.png', label: 'Parfymtestare' },
            { image: '/gifts/geisha.png', label: 'Geisha', count: 3 },
          ],
        },
        {
          minScore: 6500,
          levelLabel: 'Nivå 3',
          title: 'På tal om blommor…',
          message:
            'Riktigt fin gissning! Du får parfymtestaren och två Geisha.',
          physicalGift: 'En parfymtestare + 2 Geisha.',
          rewardItems: [
            { image: '/gifts/perfume-tester.png', label: 'Parfymtestare' },
            { image: '/gifts/geisha.png', label: 'Geisha', count: 2 },
          ],
        },
        {
          minScore: 3500,
          levelLabel: 'Nivå 2',
          title: 'På tal om blommor…',
          message:
            'Bra känsel! Du får parfymtestaren och en Geisha.',
          physicalGift: 'En parfymtestare + 1 Geisha.',
          rewardItems: [
            { image: '/gifts/perfume-tester.png', label: 'Parfymtestare' },
            { image: '/gifts/geisha.png', label: 'Geisha', count: 1 },
          ],
        },
        {
          minScore: 0,
          levelLabel: 'Nivå 1',
          title: 'På tal om blommor…',
          message:
            'Du klarade dagen! På tal om blommor — här är en parfymtestare.',
          physicalGift: 'En parfymtestare.',
          rewardItems: [
            { image: '/gifts/perfume-tester.png', label: 'Parfymtestare' },
          ],
        },
      ],
    },

    // —— Day 3 ———————————————————————————————————————————————
    {
      day: 3,
      doorTheme: 'star',
      teaser: 'En ton…',
      game: {
        type: 'songClip',
        title: 'Gissa låten',
        instructions:
          'Spela den första tonen och gissa låten. Ju mer du behöver höra, desto färre poäng.',
        audio: '/audio/whistle.m4a',
        clipSeconds: [0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1],
        maxScore: 5000,
        answers: [
          'whistle',
          'flo rida',
          'florida',
          'flo rida whistle',
          'florida whistle',
          'whistle flo rida',
        ],
        hint: 'Flo Rida…',
      },
      gift: {
        title: 'Whistle',
        message: 'Flo Rida — hoppas du kände igen visslingen!',
      },
    },

    // —— Day 4 ———————————————————————————————————————————————
    {
      day: 4,
      doorTheme: 'candle',
      teaser: 'Friendship quiz',
      game: {
        type: 'quiz',
        title: 'How well do you know us?',
        instructions: 'Answer every question correctly to unlock today’s gift.',
        questions: [
          {
            question: 'Where did we first meet?',
            options: ['At school', 'Through mutual friends', 'At work', 'Online'],
            correctIndex: 0, // ← change this to the real answer
          },
          {
            question: 'What is our favourite shared snack?',
            options: ['Chocolate', 'Crisps', 'Ice cream', 'Popcorn'],
            correctIndex: 0,
          },
          {
            question: 'Ideal winter evening together?',
            options: ['Cinema', 'Walk in the snow', 'Board games & tea', 'Cooking'],
            correctIndex: 2,
          },
        ],
      },
      gift: {
        title: 'Day 4 — You know me',
        message: 'Of course you got these right. Here’s something just for you.',
        physicalGift: 'A small something I’ll give you next time we meet.',
      },
    },

    // —— Day 5 ———————————————————————————————————————————————
    {
      day: 5,
      doorTheme: 'gift',
      teaser: 'Find the groups',
      game: {
        type: 'connections',
        title: 'Christmas Connections',
        instructions:
          'Select 4 items that belong together, then submit. Find all 4 groups!',
        groups: [
          {
            label: 'Christmas sweets',
            items: ['Candy cane', 'Gingerbread', 'Chocolate coin', 'Peppermint'],
            colour: 'yellow',
          },
          {
            label: 'Tree decorations',
            items: ['Bauble', 'Tinsel', 'Star topper', 'Fairy lights'],
            colour: 'green',
          },
          {
            label: 'Winter weather',
            items: ['Snow', 'Frost', 'Blizzard', 'Icicle'],
            colour: 'blue',
          },
          {
            label: 'Festive drinks',
            items: ['Glögg', 'Hot chocolate', 'Eggnog', 'Mulled wine'],
            colour: 'red',
          },
        ],
      },
      gift: {
        title: 'Day 5 — Connected',
        message: 'You found every group. Today’s gift is a reminder that the best things come in fours… friends, laughs, secrets, and cocoa.',
      },
    },

    // —— Day 6 ———————————————————————————————————————————————
    {
      day: 6,
      doorTheme: 'bell',
      teaser: 'Name that tune',
      game: {
        type: 'musicQuiz',
        title: 'Name That Carol',
        instructions: 'Read the lyric clue and guess the song title.',
        clue: '“…let your heart be light. From now on, our troubles will be out of sight.”',
        answers: [
          'have yourself a merry little christmas',
          'have yourself a merry little christmas!',
        ],
        hint: 'Judy Garland sang a famous version…',
      },
      gift: {
        title: 'Day 6 — A song for you',
        message: 'Music always finds us in December. Here’s something to listen to.',
        link: {
          url: 'https://open.spotify.com/',
          label: 'Listen on Spotify',
        },
      },
    },

    // —— Day 7 ———————————————————————————————————————————————
    {
      day: 7,
      doorTheme: 'holly',
      teaser: 'Blurry guess',
      game: {
        type: 'photoGuess',
        title: 'What is this?',
        instructions:
          'The photo starts very blurred. Wrong guesses make it clearer. Type what you see!',
        // Replace with your own photo in public/gifts/
        image: '/gifts/placeholder-photo.svg',
        answers: ['christmas tree', 'tree', 'julgran'],
        hint: 'Something you decorate in December…',
        startBlur: 28,
      },
      gift: {
        title: 'Day 7 — Coming into focus',
        message: 'Sharp eyes! The picture is clearer now — and so is how glad I am you’re opening these doors.',
      },
    },

    // —— Day 8 ———————————————————————————————————————————————
    {
      day: 8,
      doorTheme: 'ornament',
      teaser: 'Tiny crossword',
      game: {
        type: 'crossword',
        title: 'Mini Christmas Crossword',
        instructions: 'Fill in the grid using the clues. Tap a cell, then type a letter.',
        solution: ['#NOEL', 'SNOW#', '#TREE', 'GIFT#', '#STAR'],
        numbers: {
          '0-1': 1,
          '1-0': 2,
          '2-1': 3,
          '3-0': 4,
          '4-1': 5,
        },
        clues: {
          across: [
            { number: 1, clue: 'French word for Christmas (4)' },
            { number: 2, clue: 'White winter weather (4)' },
            { number: 3, clue: 'Evergreen we decorate (4)' },
            { number: 4, clue: 'Present under the tree (4)' },
            { number: 5, clue: 'Shines atop the tree (4)' },
          ],
          down: [
            { number: 1, clue: 'December 25th celebration starts with N… (read down from 1)' },
          ],
        },
      },
      gift: {
        title: 'Day 8 — Across & down',
        message: 'Crossword champion! A little puzzle gift for a little puzzle mind.',
      },
    },

    // —— Day 9 ———————————————————————————————————————————————
    {
      day: 9,
      doorTheme: 'mitten',
      teaser: 'Slide to reveal',
      game: {
        type: 'picturePuzzle',
        title: 'Picture Puzzle',
        instructions: 'Slide the tiles to rebuild the picture. Tap a tile next to the empty space.',
        image: '/gifts/placeholder-photo.svg',
        size: 3,
      },
      gift: {
        title: 'Day 9 — Piece by piece',
        message: 'You put it all together. Some friendships feel exactly like that.',
      },
    },

    // —— Days 10–24: more variety (edit freely!) ———————————————
    {
      day: 10,
      doorTheme: 'cookie',
      teaser: 'Another word',
      game: {
        type: 'wordGuess',
        title: 'Guess the Word',
        instructions: 'A cosy 5-letter Christmas word. Same rules as day 1.',
        word: 'COCOA',
        maxAttempts: 6,
      },
      gift: {
        title: 'Day 10 — Warm hands',
        message: 'Cocoa weather is here. Consider this your permission to slow down today.',
      },
    },
    {
      day: 11,
      doorTheme: 'lantern',
      teaser: 'Emoji again',
      game: {
        type: 'emojiRiddle',
        title: 'Emoji Riddle',
        instructions: 'Decode the emoji phrase.',
        emojis: '🧊👸',
        answers: ['frozen', 'frosty', 'ice queen', 'elsa'],
        hint: 'A winter film… or a queen of ice.',
      },
      gift: {
        title: 'Day 11 — Let it glow',
        message: 'Correct! May your day sparkle a little extra.',
      },
    },
    {
      day: 12,
      doorTheme: 'deer',
      teaser: 'Memory round 2',
      game: {
        type: 'memory',
        title: 'Winter Memory',
        instructions: 'Match all the pairs again — a few new faces this time.',
        cards: ['🎅', '🤶', '🦌', '🧦', '🍪', '🥛', '🌟', '🛷'],
      },
      gift: {
        title: 'Day 12 — Halfway cheer',
        message: 'Twelve doors down! You’re halfway through the magic.',
      },
    },
    {
      day: 13,
      doorTheme: 'snowflake',
      teaser: 'Quiz night',
      game: {
        type: 'quiz',
        title: 'December Trivia',
        instructions: 'Get every question right.',
        questions: [
          {
            question: 'How many days are in a traditional advent calendar?',
            options: ['12', '24', '25', '31'],
            correctIndex: 1,
          },
          {
            question: 'What colour is mistletoe’s berry?',
            options: ['Red', 'White', 'Gold', 'Blue'],
            correctIndex: 1,
          },
          {
            question: 'In Sweden, who brings gifts on Christmas Eve?',
            options: ['Santa Claus', 'Tomten', 'The Yule Goat only', 'St. Nicholas'],
            correctIndex: 1,
          },
        ],
      },
      gift: {
        title: 'Day 13 — Clever cookie',
        message: 'Trivia queen. Tomten would be proud.',
      },
    },
    {
      day: 14,
      doorTheme: 'pine',
      teaser: 'Connections',
      game: {
        type: 'connections',
        title: 'More Connections',
        instructions: 'Group the 16 words into 4 categories of 4.',
        groups: [
          {
            label: 'Reindeer names',
            items: ['Dasher', 'Dancer', 'Prancer', 'Vixen'],
            colour: 'yellow',
          },
          {
            label: 'Things you wrap',
            items: ['Present', 'Parcel', 'Box', 'Gift'],
            colour: 'green',
          },
          {
            label: 'Cold adjectives',
            items: ['Chilly', 'Icy', 'Frozen', 'Wintry'],
            colour: 'blue',
          },
          {
            label: 'Fireplace words',
            items: ['Mantel', 'Logs', 'Embers', 'Hearth'],
            colour: 'red',
          },
        ],
      },
      gift: {
        title: 'Day 14 — Sorted',
        message: 'Beautiful sorting. Here’s today’s little treasure.',
      },
    },
    {
      day: 15,
      doorTheme: 'star',
      teaser: 'Song clue',
      game: {
        type: 'musicQuiz',
        title: 'Name That Song',
        instructions: 'Guess the song from the lyric.',
        clue: '“I don’t want a lot for Christmas / There is just one thing I need…”',
        answers: ['all i want for christmas is you', 'all i want for christmas'],
        hint: 'Mariah…',
      },
      gift: {
        title: 'Day 15 — On repeat',
        message: 'Obviously. This song owns December — and you own today’s gift.',
      },
    },
    {
      day: 16,
      doorTheme: 'candle',
      teaser: 'Photo guess',
      game: {
        type: 'photoGuess',
        title: 'Blurry Mystery',
        instructions: 'Guess the photo as the blur fades with each try.',
        image: '/gifts/placeholder-photo.svg',
        answers: ['candle', 'candles', 'ljus'],
        hint: 'It flickers…',
        startBlur: 24,
      },
      gift: {
        title: 'Day 16 — Soft light',
        message: 'Warm light, warm heart. Enjoy today’s surprise.',
      },
    },
    {
      day: 17,
      doorTheme: 'gift',
      teaser: 'Word again',
      game: {
        type: 'wordGuess',
        title: 'Guess the Word',
        instructions: 'Five letters. Think winter evenings.',
        word: 'PEACE',
        maxAttempts: 6,
      },
      gift: {
        title: 'Day 17 — Quiet joy',
        message: 'Peace looks good on you. Holding you in my thoughts today.',
      },
    },
    {
      day: 18,
      doorTheme: 'bell',
      teaser: 'Emoji tale',
      game: {
        type: 'emojiRiddle',
        title: 'Emoji Riddle',
        instructions: 'What are these emojis saying?',
        emojis: '🔔🔔🔔',
        answers: ['jingle bells', 'jingle bell', 'ring bells', 'sleigh bells'],
        hint: 'A song you hear in every shop…',
      },
      gift: {
        title: 'Day 18 — Ring-a-ling',
        message: 'Ding dong! Gift unlocked.',
      },
    },
    {
      day: 19,
      doorTheme: 'holly',
      teaser: 'Memory spark',
      game: {
        type: 'memory',
        title: 'Sparkle Memory',
        instructions: 'Find every pair.',
        cards: ['💎', '✨', '🌙', '🦊', '🧣', '☕'],
      },
      gift: {
        title: 'Day 19 — Spark found',
        message: 'You’re glowing. Almost at the final stretch!',
      },
    },
    {
      day: 20,
      doorTheme: 'ornament',
      teaser: 'Friendship quiz',
      game: {
        type: 'quiz',
        title: 'Us, again',
        instructions: 'Personal round — answer all correctly.',
        questions: [
          {
            question: 'My go-to hot drink in winter?',
            options: ['Coffee', 'Tea', 'Hot chocolate', 'Glögg'],
            correctIndex: 2,
          },
          {
            question: 'Best season for a long walk?',
            options: ['Spring', 'Summer', 'Autumn', 'Winter'],
            correctIndex: 3,
          },
        ],
      },
      gift: {
        title: 'Day 20 — Still us',
        message: 'You get me. That’s the real gift — but here’s another one anyway.',
      },
    },
    {
      day: 21,
      doorTheme: 'mitten',
      teaser: 'Slide puzzle',
      game: {
        type: 'picturePuzzle',
        title: 'One more puzzle',
        instructions: 'Slide tiles until the picture makes sense.',
        image: '/gifts/placeholder-photo.svg',
        size: 3,
      },
      gift: {
        title: 'Day 21 — Almost there',
        message: 'Three doors left after this. Can you feel Christmas approaching?',
      },
    },
    {
      day: 22,
      doorTheme: 'cookie',
      teaser: 'Sweet word',
      game: {
        type: 'wordGuess',
        title: 'Guess the Word',
        instructions: 'Something sweet and baked…',
        word: 'SUGAR',
        maxAttempts: 6,
      },
      gift: {
        title: 'Day 22 — Sugar & spice',
        message: 'Sweet victory. Save room for Christmas treats.',
      },
    },
    {
      day: 23,
      doorTheme: 'lantern',
      teaser: 'Final connections',
      game: {
        type: 'connections',
        title: 'Eve-Eve Connections',
        instructions: 'One last grouping challenge before Christmas Eve.',
        groups: [
          {
            label: 'Christmas Eve words',
            items: ['Eve', 'Vigil', 'Feast', 'Midnight'],
            colour: 'yellow',
          },
          {
            label: 'Things in a stocking',
            items: ['Orange', 'Chocolate', 'Toy', 'Coin'],
            colour: 'green',
          },
          {
            label: 'Winter clothes',
            items: ['Scarf', 'Mittens', 'Beanie', 'Coat'],
            colour: 'blue',
          },
          {
            label: 'Storybook magic',
            items: ['Fairy', 'Spell', 'Wand', 'Wish'],
            colour: 'red',
          },
        ],
      },
      gift: {
        title: 'Day 23 — The night before the night',
        message: 'Tomorrow is the last door. Thank you for playing along all month.',
      },
    },
    {
      day: 24,
      doorTheme: 'deer',
      teaser: 'Christmas Eve',
      game: {
        type: 'emojiRiddle',
        title: 'The Final Riddle',
        instructions: 'One last emoji puzzle for Christmas Eve.',
        emojis: '🎄🎁❤️',
        answers: [
          'merry christmas',
          'god jul',
          'christmas',
          'christmas gifts',
          'love christmas',
        ],
        hint: 'What we say on the 24th…',
      },
      gift: {
        title: 'Day 24 — God Jul, Louise',
        message:
          'You made it to Christmas Eve. This whole calendar was made with so much care for you. I hope December felt warmer because of it. Glad jul — and thank you for being you.',
        physicalGift: 'Your real Christmas present — see you soon.',
        link: {
          url: 'https://open.spotify.com/',
          label: 'Our Christmas playlist',
        },
      },
    },
  ],
}

/** Helper: get one day's config by number */
export function getDayConfig(day: number) {
  return calendarConfig.days.find((d) => d.day === day)
}
