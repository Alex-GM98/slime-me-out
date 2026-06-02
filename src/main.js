import './style.css';

// Game State
let goo = 0;
let gooPerClick = 1;
let gooPerSecond = 0;
let slimeSouls = 0;
let companionCount = 0;
let currentBiome = 0;

const biomes = [
  { id: 'forest', name: 'Mystical Forest', bg: '/bg.png', slime: '/slime_transparent.png', threshold: 0, costMult: 1, prodMult: 1 },
  { id: 'volcano', name: 'Volcanic Underworld', bg: '/volcano_bg.png', slime: '/magma_slime_transparent.png', threshold: 10000000, costMult: 10, prodMult: 50 },
  { id: 'void', name: 'Cosmic Void', bg: '/cosmic_bg.png', slime: '/cosmic_slime_transparent.png', threshold: 1000000000, costMult: 100, prodMult: 2500 }
];

// Base Data for prestige resets
const baseGenerators = [
  { id: 'goo-farmer', name: 'Goo Farmer', desc: '+1 Goo/s', baseCost: 15, costMultiplier: 1.15, count: 0, baseProduction: 1 },
  { id: 'goo-pump', name: 'Goo Pump', desc: '+5 Goo/s', baseCost: 100, costMultiplier: 1.15, count: 0, baseProduction: 5 },
  { id: 'goo-factory', name: 'Goo Factory', desc: '+50 Goo/s', baseCost: 1100, costMultiplier: 1.15, count: 0, baseProduction: 50 },
  { id: 'goo-mage', name: 'Goo Mage', desc: '+200 Goo/s', baseCost: 12000, costMultiplier: 1.15, count: 0, baseProduction: 200 },
  { id: 'slime-knight', name: 'Slime Knight', desc: '+1k Goo/s', baseCost: 80000, costMultiplier: 1.15, count: 0, baseProduction: 1000 },
  { id: 'goo-castle', name: 'Goo Castle', desc: '+5k Goo/s', baseCost: 500000, costMultiplier: 1.15, count: 0, baseProduction: 5000 },
  { id: 'slime-dragon', name: 'Slime Dragon', desc: '+25k Goo/s', baseCost: 4000000, costMultiplier: 1.15, count: 0, baseProduction: 25000 },
  { id: 'demon-lord', name: 'Demon Lord Slime', desc: '+100k Goo/s', baseCost: 25000000, costMultiplier: 1.15, count: 0, baseProduction: 100000 },
  { id: 'goo-portal', name: 'Goo Portal', desc: '+1M Goo/s', baseCost: 500000000, costMultiplier: 1.15, count: 0, baseProduction: 1000000 }
];

const baseUpgrades = [
  { id: 'click-power-1', name: 'Sticky Fingers', desc: '+1 Goo per click', cost: 50, purchased: false },
  { id: 'click-power-2', name: 'Gooey Gloves', desc: 'Clicks are x2 effective', cost: 500, purchased: false },
  { id: 'farmer-efficiency', name: 'Better Pitchforks', desc: 'Farmers are x2 fast', cost: 1000, purchased: false },
  { id: 'pump-efficiency', name: 'Turbo Pumps', desc: 'Pumps are x2 fast', cost: 5000, purchased: false },
  { id: 'factory-efficiency', name: 'Automated Assembly', desc: 'Factories are x2 fast', cost: 50000, purchased: false },
  { id: 'mage-efficiency', name: 'Arcane Slime', desc: 'Mages are x2 fast', cost: 500000, purchased: false },
  { id: 'click-power-3', name: 'Slime Fists', desc: 'Clicks are x5 effective', cost: 1000000, purchased: false },
  { id: 'knight-efficiency', name: 'Mithril Armor', desc: 'Knights are x2 fast', cost: 5000000, purchased: false },
  { id: 'upg-rimuru', name: 'Lord Rimuru\'s Blessing', desc: 'Summon Rimuru (x10 Global)', cost: 1000000000, purchased: false }
];

const baseSkills = [
  { id: 'skill-click', name: 'Aura of Slime', desc: 'Base Click power x2', cost: 1, purchased: false },
  { id: 'skill-idle', name: 'Slime Breeding', desc: 'All Idle production x2', cost: 2, purchased: false },
  { id: 'skill-click-2', name: 'Predator', desc: 'Base Click power x3', cost: 5, purchased: false },
  { id: 'skill-click-3', name: 'Gluttony', desc: 'Base Click power x5', cost: 25, purchased: false },
  
  // The Great Sage Evolution Path
  { id: 'skill-sage', name: 'Great Sage', desc: 'Global x3', cost: 10, purchased: false },
  { id: 'skill-raphael', name: 'Lord of Wisdom, Raphael', desc: 'Global x5', cost: 25, purchased: false, req: 'skill-sage' },
  { id: 'skill-ciel', name: 'Manas: Ciel', desc: 'Global x10', cost: 100, purchased: false, req: 'skill-raphael' },
  { id: 'skill-azathoth', name: 'Void God Azathoth', desc: 'Global x100', cost: 500, purchased: false, req: 'skill-ciel' },
  
  // Auto Clicker
  { id: 'skill-autoclick', name: 'Auto-Battle Mode', desc: 'Auto-clicks 5 times a sec', cost: 50, purchased: false }
];

// Current State Data
let generators = JSON.parse(JSON.stringify(baseGenerators));
let upgrades = JSON.parse(JSON.stringify(baseUpgrades));
let skills = JSON.parse(JSON.stringify(baseSkills));

// DOM Elements
const gooAmountEl = document.getElementById('goo-amount');
const gooPerSecEl = document.getElementById('goo-per-sec');
const slimeBtn = document.getElementById('slime-container');
const mainSlimeImg = document.getElementById('slime');
const dialoguePortrait = document.getElementById('dialogue-portrait');
const floatingContainer = document.getElementById('floating-numbers-container');
const companionsContainer = document.getElementById('companions-container');
const generatorsTab = document.getElementById('generators-tab');
const upgradesTab = document.getElementById('upgrades-tab');
const skillsTab = document.getElementById('skills-tab');
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
const dialogueSpeaker = document.getElementById('dialogue-speaker');
const dialoguePortrait = document.getElementById('dialogue-portrait');
const dialogueBox2 = document.getElementById('dialogue-box-2');
const dialogueText2 = document.getElementById('dialogue-text-2');
const dialogueSpeaker2 = document.getElementById('dialogue-speaker-2');
const dialoguePortrait2 = document.getElementById('dialogue-portrait-2');
const prestigeBtn = document.getElementById('prestige-btn');
const travelBtn = document.getElementById('travel-btn');
const soulsContainer = document.getElementById('souls-container');
const soulsAmountEl = document.getElementById('souls-amount');
const skillTreeTabBtn = document.getElementById('skill-tree-tab-btn');
const backgroundEl = document.getElementById('background');

function formatNumber(num) {
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return Math.floor(num).toString();
}

function calculatePrestigeSouls() {
  return Math.floor(Math.cbrt(goo / 10000));
}

function updateCompanions() {
  const targetSlimes = Math.min(companionCount, 15);
  
  while (companionsContainer.children.length < targetSlimes) {
    const img = document.createElement('img');
    img.src = biomes[currentBiome].slime;
    img.className = 'mini-slime';
    
    const randomHue = Math.floor(Math.random() * 360);
    img.style.filter = `hue-rotate(${randomHue}deg) drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))`;
    img.style.animationDelay = `${Math.random() * 2}s`;
    
    companionsContainer.appendChild(img);
  }
  
  if (targetSlimes === 0) {
    companionsContainer.innerHTML = '';
  }
}

function updateUI() {
  gooAmountEl.textContent = formatNumber(goo);
  gooPerSecEl.textContent = formatNumber(gooPerSecond);
  soulsAmountEl.textContent = formatNumber(slimeSouls);
  
  document.getElementById('header').classList.add('glass-panel');
  document.getElementById('sidebar').classList.add('glass-panel');
  
  if (goo >= 10000 || slimeSouls > 0) {
    prestigeBtn.classList.remove('hidden');
    const soulsToGain = calculatePrestigeSouls();
    document.getElementById('prestige-btn-text').textContent = `Ascend (+${soulsToGain} Souls)`;
  } else {
    prestigeBtn.classList.add('hidden');
  }

  // Biome Travel Logic
  const nextBiome = biomes[currentBiome + 1];
  if (nextBiome && goo >= nextBiome.threshold) {
    travelBtn.classList.remove('hidden');
    document.getElementById('travel-btn-text').textContent = `Travel to ${nextBiome.name}`;
  } else {
    travelBtn.classList.add('hidden');
  }

  if (slimeSouls > 0) {
    soulsContainer.classList.remove('hidden');
    skillTreeTabBtn.classList.remove('hidden');
  }

  backgroundEl.style.backgroundImage = `url('${biomes[currentBiome].bg}')`;

  const upgRimuru = upgrades.find(u => u.id === 'upg-rimuru');
  if (upgRimuru && upgRimuru.purchased) {
    mainSlimeImg.src = '/slime_transparent.png'; // Rimuru is base slime tinted
    mainSlimeImg.style.filter = 'hue-rotate(200deg) drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))';
    dialoguePortrait.src = '/slime_transparent.png';
    dialoguePortrait.style.filter = 'hue-rotate(200deg)';
  } else {
    mainSlimeImg.src = biomes[currentBiome].slime;
    mainSlimeImg.style.filter = 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))';
    dialoguePortrait.src = biomes[currentBiome].slime;
    dialoguePortrait.style.filter = 'none';
  }

  const biomeCostMult = biomes[currentBiome].costMult;

  document.querySelectorAll('.generator-item').forEach(el => {
    const id = el.dataset.id;
    const gen = generators.find(g => g.id === id);
    if (!gen) return;
    const cost = Math.floor(gen.baseCost * Math.pow(gen.costMultiplier, gen.count) * biomeCostMult);
    if (goo >= cost) el.classList.remove('disabled');
    else el.classList.add('disabled');
  });

  document.querySelectorAll('.upgrade-item').forEach(el => {
    const id = el.dataset.id;
    const upg = upgrades.find(u => u.id === id);
    if (upg && !upg.purchased) {
      if (goo >= upg.cost * biomeCostMult) el.classList.remove('disabled');
      else el.classList.add('disabled');
    }
  });

  document.querySelectorAll('.skill-item').forEach(el => {
    const id = el.dataset.id;
    const skill = skills.find(s => s.id === id);
    if (skill && !skill.purchased) {
      if (slimeSouls >= skill.cost) el.classList.remove('disabled');
      else el.classList.add('disabled');
    }
  });
}

function recalculateMultipliers() {
  let clickMulti = 1;
  let idleMulti = 1;

  const prestigeMulti = 1 + (slimeSouls * 0.1);
  const companionMulti = 1 + (companionCount * 0.1);
  const biomeProdMult = biomes[currentBiome].prodMult;
  
  clickMulti *= prestigeMulti * companionMulti * biomeProdMult;
  idleMulti *= prestigeMulti * companionMulti * biomeProdMult;

  const skillClick = skills.find(s => s.id === 'skill-click');
  const skillIdle = skills.find(s => s.id === 'skill-idle');
  const skillClick2 = skills.find(s => s.id === 'skill-click-2');
  const skillClick3 = skills.find(s => s.id === 'skill-click-3');
  
  if (skillClick && skillClick.purchased) clickMulti *= 2;
  if (skillClick2 && skillClick2.purchased) clickMulti *= 3;
  if (skillClick3 && skillClick3.purchased) clickMulti *= 5;
  
  if (skillIdle && skillIdle.purchased) idleMulti *= 2;

  const upgRimuru = upgrades.find(u => u.id === 'upg-rimuru');
  if (upgRimuru && upgRimuru.purchased) {
    clickMulti *= 10;
    idleMulti *= 10;
  }

  const skillSage = skills.find(s => s.id === 'skill-sage');
  if (skillSage && skillSage.purchased) { clickMulti *= 3; idleMulti *= 3; }
  const skillRaphael = skills.find(s => s.id === 'skill-raphael');
  if (skillRaphael && skillRaphael.purchased) { clickMulti *= 5; idleMulti *= 5; }
  const skillCiel = skills.find(s => s.id === 'skill-ciel');
  if (skillCiel && skillCiel.purchased) { clickMulti *= 10; idleMulti *= 10; }
  const skillAzathoth = skills.find(s => s.id === 'skill-azathoth');
  if (skillAzathoth && skillAzathoth.purchased) { clickMulti *= 100; idleMulti *= 100; }

  let finalClick = 1;
  const upgClick1 = upgrades.find(u => u.id === 'click-power-1');
  const upgClick2 = upgrades.find(u => u.id === 'click-power-2');
  const upgClick3 = upgrades.find(u => u.id === 'click-power-3');
  if (upgClick1 && upgClick1.purchased) finalClick += 1;
  if (upgClick2 && upgClick2.purchased) finalClick *= 2;
  if (upgClick3 && upgClick3.purchased) finalClick *= 5;
  
  gooPerClick = finalClick * clickMulti;

  const upgFarmer = upgrades.find(u => u.id === 'farmer-efficiency');
  const upgPump = upgrades.find(u => u.id === 'pump-efficiency');
  const upgFactory = upgrades.find(u => u.id === 'factory-efficiency');
  const upgMage = upgrades.find(u => u.id === 'mage-efficiency');
  const upgKnight = upgrades.find(u => u.id === 'knight-efficiency');
  
  gooPerSecond = generators.reduce((total, gen) => {
    let prod = gen.baseProduction;
    if (gen.id === 'goo-farmer' && upgFarmer && upgFarmer.purchased) prod *= 2;
    if (gen.id === 'goo-pump' && upgPump && upgPump.purchased) prod *= 2;
    if (gen.id === 'goo-factory' && upgFactory && upgFactory.purchased) prod *= 2;
    if (gen.id === 'goo-mage' && upgMage && upgMage.purchased) prod *= 2;
    if (gen.id === 'slime-knight' && upgKnight && upgKnight.purchased) prod *= 2;
    return total + (gen.count * prod);
  }, 0) * idleMulti;
}

function renderShop() {
  const biomeCostMult = biomes[currentBiome].costMult;

  generatorsTab.innerHTML = generators.map(gen => {
    const cost = Math.floor(gen.baseCost * Math.pow(gen.costMultiplier, gen.count) * biomeCostMult);
    return `
      <div class="shop-item generator-item" data-id="${gen.id}">
        <div class="item-info">
          <span class="item-name">${gen.name}</span>
          <span class="item-desc">${gen.desc}</span>
        </div>
        <div class="item-cost">${formatNumber(cost)} Goo</div>
        <div class="item-count">${gen.count}</div>
      </div>
    `;
  }).join('');

  const companionCost = Math.floor(500 * Math.pow(1.5, companionCount) * biomeCostMult);
  
  upgradesTab.innerHTML = `
    <div class="shop-item repeatable-item ${goo >= companionCost && companionCount < 15 ? '' : 'disabled'}" id="buy-companion-btn">
      <div class="item-info">
        <span class="item-name text-purple">Summon Companion</span>
        <span class="item-desc">+10% Global Production</span>
      </div>
      <div class="item-cost">${formatNumber(companionCost)} Goo</div>
      <div class="item-count">${companionCount}/15</div>
    </div>
  ` + upgrades.filter(u => !u.purchased).map(upg => `
    <div class="shop-item upgrade-item" data-id="${upg.id}">
      <div class="item-info">
        <span class="item-name">${upg.name}</span>
        <span class="item-desc">${upg.desc}</span>
      </div>
      <div class="item-cost">${formatNumber(upg.cost * biomeCostMult)} Goo</div>
    </div>
  `).join('');

  skillsTab.innerHTML = skills.filter(s => {
    if (s.req) {
      const reqSkill = skills.find(rs => rs.id === s.req);
      return reqSkill && reqSkill.purchased;
    }
    return true;
  }).map(skill => `
    <div class="shop-item skill-item ${skill.purchased ? 'disabled' : ''}" data-id="${skill.id}">
      <div class="item-info">
        <span class="item-name text-purple">${skill.name} ${skill.purchased ? '(Owned)' : ''}</span>
        <span class="item-desc">${skill.desc}</span>
      </div>
      ${!skill.purchased ? `<div class="item-cost text-purple" style="color:var(--accent-purple);">${skill.cost} Souls</div>` : ''}
    </div>
  `).join('');

  document.querySelectorAll('.generator-item').forEach(el => {
    el.addEventListener('click', () => buyGenerator(el.dataset.id));
  });
  
  document.querySelectorAll('.upgrade-item').forEach(el => {
    el.addEventListener('click', () => buyUpgrade(el.dataset.id));
  });

  document.querySelectorAll('.skill-item').forEach(el => {
    el.addEventListener('click', () => buySkill(el.dataset.id));
  });
  
  const companionBtn = document.getElementById('buy-companion-btn');
  if (companionBtn) companionBtn.addEventListener('click', buyCompanion);
}

function buyCompanion() {
  if (companionCount >= 15) return;
  const cost = Math.floor(500 * Math.pow(1.5, companionCount) * biomes[currentBiome].costMult);
  if (goo >= cost) {
    goo -= cost;
    companionCount++;
    recalculateMultipliers();
    renderShop();
    updateUI();
    updateCompanions();
  }
}

function buyGenerator(id) {
  const gen = generators.find(g => g.id === id);
  const cost = Math.floor(gen.baseCost * Math.pow(gen.costMultiplier, gen.count) * biomes[currentBiome].costMult);
  if (goo >= cost) {
    goo -= cost;
    gen.count++;
    recalculateMultipliers();
    renderShop();
    updateUI();
  }
}

function buyUpgrade(id) {
  const upg = upgrades.find(u => u.id === id);
  const cost = Math.floor(upg.cost * biomes[currentBiome].costMult);
  if (!upg.purchased && goo >= cost) {
    goo -= cost;
    upg.purchased = true;
    recalculateMultipliers();
    renderShop();
    updateUI();
  }
}

function buySkill(id) {
  const skill = skills.find(s => s.id === id);
  if (!skill.purchased && slimeSouls >= skill.cost) {
    slimeSouls -= skill.cost;
    skill.purchased = true;
    recalculateMultipliers();
    renderShop();
    updateUI();
  }
}

prestigeBtn.addEventListener('click', () => {
  const soulsToGain = calculatePrestigeSouls();
  if (soulsToGain > 0) {
    if (confirm(`Are you sure you want to ascend? You will lose all Goo, Generators, Upgrades, and Biome progress, but gain ${soulsToGain} Slime Souls.`)) {
      slimeSouls += soulsToGain;
      goo = 0;
      companionCount = 0;
      currentBiome = 0;
      generators = JSON.parse(JSON.stringify(baseGenerators));
      upgrades = JSON.parse(JSON.stringify(baseUpgrades));
      recalculateMultipliers();
      renderShop();
      updateUI();
      updateCompanions();
      showDialogue(`Ascension complete! You gained ${soulsToGain} Slime Souls.`);
    }
  } else {
    alert("You need more Goo to ascend!");
  }
});

travelBtn.addEventListener('click', () => {
  const nextBiome = biomes[currentBiome + 1];
  if (nextBiome && goo >= nextBiome.threshold) {
    if (confirm(`Travel to ${nextBiome.name}? This will reset your Goo, Generators, and Upgrades, but massively scale your production in the new area.`)) {
      goo = 0;
      companionCount = 0;
      currentBiome++;
      generators = JSON.parse(JSON.stringify(baseGenerators));
      upgrades = JSON.parse(JSON.stringify(baseUpgrades));
      recalculateMultipliers();
      renderShop();
      updateUI();
      updateCompanions();
      showDialogue(`Welcome to the ${nextBiome.name}! Things are much more expensive here, but the Goo flows like a river.`);
    }
  }
});

let typeWriterTimeout;
let typeWriterTimeout2;

function showDialogue(text, speakerName = 'Slime', duration = 4000) {
  dialogueBox.classList.remove('hidden');
  dialogueText.textContent = '';
  dialogueSpeaker.textContent = speakerName;
  dialoguePortrait.src = biomes[currentBiome].slime;
  clearTimeout(typeWriterTimeout);
  
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      dialogueText.textContent += text.charAt(i);
      i++;
      typeWriterTimeout = setTimeout(typeWriter, 28);
    } else {
      typeWriterTimeout = setTimeout(() => dialogueBox.classList.add('hidden'), duration);
    }
  }
  typeWriter();
}

function showConversation(line1, line2, speaker1 = 'Slime A', speaker2 = 'Slime B') {
  // Show first bubble
  dialogueBox2.classList.add('hidden');
  showDialogue(line1, speaker1, 99999); // keep open until conversation ends
  
  // After line1 finishes typing, show line2
  const line1Duration = line1.length * 28 + 800;
  clearTimeout(typeWriterTimeout2);
  typeWriterTimeout2 = setTimeout(() => {
    dialogueBox2.classList.remove('hidden');
    dialogueText2.textContent = '';
    dialogueSpeaker2.textContent = speaker2;
    dialoguePortrait2.src = biomes[currentBiome].slime;
    
    let i = 0;
    function typeWriter2() {
      if (i < line2.length) {
        dialogueText2.textContent += line2.charAt(i);
        i++;
        typeWriterTimeout2 = setTimeout(typeWriter2, 28);
      } else {
        // Auto-close both after response is read
        typeWriterTimeout2 = setTimeout(() => {
          dialogueBox.classList.add('hidden');
          dialogueBox2.classList.add('hidden');
        }, 4000);
      }
    }
    typeWriter2();
  }, line1Duration);
}

// Solo lines
const slimeSoloQuotes = [
  "Did you see that anime about reincarnating as a slime?",
  "I wish I could absorb skills like Rimuru...",
  "We need more Goo for the village!",
  "I'm just a humble slime farmer.",
  "Raphael says we should optimize Goo production.",
  "That Time I Got Reincarnated as a Clicker Game...",
  "I heard a true Demon Lord is coming...",
  "Gluttony is such a scary skill.",
  "If I eat enough Goo, will I evolve?",
  "Is it me, or is the Great Sage ignoring my questions?",
  "Shion's cooking... terrifies me.",
  "Tempest is the best town ever!",
  "I wonder if Rimuru would be proud of us...",
  "More Goo means more power. That's just science.",
  "Every click brings us closer to becoming a True Dragon!",
  "I've absorbed so much Goo I think I'm glowing.",
  "Benimaru could never manage a farm like this.",
  "With the Great Sage's help, we'll reach the top!",
  "Souei is probably spying on us right now.",
  "I heard Milim eats Goo for breakfast.",
  "One day I'll evolve into a Demon Lord...",
  "My Predator skill keeps trying to eat the Goo bucket.",
  "Just a slime trying to make it in this world.",
  "The Goo must flow."
];

// Two-slime conversations [line1, line2, speaker1, speaker2]
const slimeConversations = [
  ["Have you read 'That Time I Got Reincarnated as a Slime'?", "Read it? I'm LIVING it!", "Slime A", "Slime B"],
  ["Why do we click the big slime?", "It produces Goo. Don't question it.", "Slime A", "Slime B"],
  ["Do you think Rimuru knows about this farm?", "He probably already named it.", "Slime A", "Slime B"],
  ["I absorbed a rock today.", "How was it?", "Slime A", "Slime B"],
  ["Raphael keeps calling me 'inefficient'.", "Same. I think she's right though.", "Slime A", "Slime B"],
  ["What's your favorite flavor of Goo?", "The luminescent blue kind. You?", "Slime A", "Slime B"],
  ["I think I'm evolving...", "Me too. I feel... rounder.", "Slime A", "Slime B"],
  ["Rapha... I need to feed my family.", "We ALL need to feed our families. Keep clicking.", "Slime A", "Slime B"],
  ["Should we unionize?", "Against who? The giant slime we worship?", "Slime A", "Slime B"],
  ["Milim visited last night.", "Did she eat all the Goo again?!", "Slime A", "Slime B"],
  ["Great Sage, what is the meaning of life?", "Insufficient data. Please click more.", "Slime A", "Great Sage"],
  ["I heard Ciel replaced Raphael.", "They're the same entity. Read the manga.", "Slime A", "Slime B"],
  ["Are we the good guys?", "We're slimes. We're always the good guys.", "Slime A", "Slime B"],
  ["What happens if we reach the Cosmic Void?", "We become gods. Probably.", "Slime A", "Slime B"],
  ["I tried to use Predator on the Goo Pump.", "Did it work?", "Slime A", "Slime B"],
  ["I tried to use Predator on the Goo Pump.", "It exploded. But I'm stronger now.", "Slime A", "Slime B"],
  ["This lava is HOT.", "We're fire slimes. That's literally our thing.", "Slime A", "Slime B"],
  ["I miss the forest.", "You say that every time we travel.", "Slime A", "Slime B"]
];

let lastDialogueTime = 0;

function triggerRandomDialogue() {
  if (companionCount === 0) return;
  
  const now = Date.now();
  // Base interval 6s, shrinks to 2s at max companions
  const minInterval = Math.max(2000, 6000 - companionCount * 300);
  if (now - lastDialogueTime < minInterval) return;
  lastDialogueTime = now;

  // Chance to trigger a conversation vs a solo line
  const doConversation = companionCount >= 2 && Math.random() < 0.5;
  
  if (doConversation) {
    const conv = slimeConversations[Math.floor(Math.random() * slimeConversations.length)];
    showConversation(conv[0], conv[1], conv[2], conv[3]);
  } else {
    const quote = slimeSoloQuotes[Math.floor(Math.random() * slimeSoloQuotes.length)];
    showDialogue(quote, 'Slime', 4000);
  }
}

setInterval(triggerRandomDialogue, 3000);

const clickTimes = [];
let autoClickerWarned = false;
let firstClick = true;

function performClick(isAuto, e) {
  if (!isAuto) {
    const now = Date.now();
    clickTimes.push(now);
    while(clickTimes.length > 0 && clickTimes[0] < now - 1000) {
      clickTimes.shift();
    }
    
    if (clickTimes.length > 15 && !autoClickerWarned) {
      showDialogue("Rapha i need to feed my family", 4000);
      autoClickerWarned = true;
      setTimeout(() => { autoClickerWarned = false; }, 6000);
    }
  }

  goo += gooPerClick;
  
  const rect = slimeBtn.getBoundingClientRect();
  let x, y;
  if (e) {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  } else {
    x = rect.width / 2 + (Math.random() * 80 - 40);
    y = rect.height / 2 + (Math.random() * 80 - 40);
  }

  const floater = document.createElement('div');
  floater.className = 'floating-number';
  floater.textContent = '+' + formatNumber(gooPerClick);
  floater.style.left = `${x + Math.random() * 20 - 10}px`;
  floater.style.top = `${y + Math.random() * 20 - 10}px`;
  floatingContainer.appendChild(floater);
  
  setTimeout(() => floater.remove(), 800);
  updateUI();

  if(!isAuto && firstClick) {
    showDialogue("Ouch! Keep clicking!");
    firstClick = false;
  }
}

slimeBtn.addEventListener('mousedown', (e) => performClick(false, e));

setInterval(() => {
  const autoClickSkill = skills.find(s => s.id === 'skill-autoclick');
  if (autoClickSkill && autoClickSkill.purchased) {
    performClick(true);
  }
}, 200);

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
  });
});

function saveGame() {
  const save = {
    goo, slimeSouls, companionCount, currentBiome, generators, upgrades, skills, lastSaveTime: Date.now()
  };
  localStorage.setItem('slimeClickerSave', JSON.stringify(save));
}

function loadGame() {
  const saveJSON = localStorage.getItem('slimeClickerSave');
  if (saveJSON) {
    const save = JSON.parse(saveJSON);
    goo = save.goo || 0;
    slimeSouls = save.slimeSouls || 0;
    companionCount = save.companionCount || 0;
    currentBiome = save.currentBiome || 0;
    
    generators.forEach(g => {
      const savedG = save.generators.find(sg => sg.id === g.id);
      if (savedG) g.count = savedG.count;
    });
    upgrades.forEach(u => {
      const savedU = save.upgrades.find(su => su.id === u.id);
      if (savedU) u.purchased = savedU.purchased;
    });
    skills.forEach(s => {
      const savedS = save.skills.find(ss => ss.id === s.id);
      if (savedS) s.purchased = savedS.purchased;
    });

    recalculateMultipliers();
    
    if (save.lastSaveTime) {
      const secondsOffline = (Date.now() - save.lastSaveTime) / 1000;
      if (secondsOffline > 60 && gooPerSecond > 0) { 
        const gained = secondsOffline * gooPerSecond;
        goo += gained;
        setTimeout(() => showDialogue(`Welcome back! You earned ${formatNumber(gained)} Goo while offline.`, 6000), 1000);
      }
    }
  } else {
    setTimeout(() => showDialogue("Welcome to the forest! Click the slime to gather Goo.", 5000), 500);
  }
  recalculateMultipliers();
  renderShop();
  updateUI();
  updateCompanions();
}

let lastTime = performance.now();
function gameLoop(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  
  if (gooPerSecond > 0) {
    goo += gooPerSecond * deltaTime;
    updateUI();
  }
  requestAnimationFrame(gameLoop);
}

loadGame();
requestAnimationFrame(gameLoop);
setInterval(saveGame, 5000);
