import OBR, { buildImage, buildShape } from "@owlbear-rodeo/sdk";
import "./style.css";

const CONDITION_METADATA_KEY = "com.kilic.condition-icons/effects";
const AURA_METADATA_KEY = "com.kilic.condition-icons/auras";

const CONDITION_ICON_METADATA_KEY = "com.kilic.condition-icons/icon";
const AURA_ITEM_METADATA_KEY = "com.kilic.condition-icons/aura-item";

const LEGACY_CUSTOM_MARKERS_METADATA_KEY =
  "com.kilic.condition-icons/custom-markers";
const LEGACY_CUSTOM_ICON_METADATA_KEY =
  "com.kilic.condition-icons/custom-icon";

const ICON_LAYER = "ATTACHMENT";
const AURA_LAYER = "ATTACHMENT";

const ICON_BASE_PATH = `${import.meta.env.BASE_URL}icons/`;
const ICON_SCALE = 0.34;
const ICON_SPACING_RATIO = 0.6;
const ICON_Y_OFFSET_RATIO = 0.4;

const conditionMarkers = [
  {
    id: "advantage",
    label: "Advantage",
    file: "advantage.png"
  },
  {
    id: "disadvantage",
    label: "Disadvantage",
    file: "disadvantage.png"
  },
  {
    id: "bless",
    label: "Bless",
    file: "bless.png"
  },
  {
    id: "concentration",
    label: "Concentration",
    file: "concentration.png"
  },
  {
    id: "temp-hp",
    label: "Temp HP",
    file: "temp-hp.png"
  },
  {
    id: "poisoned",
    label: "Poisoned",
    file: "poisoned.png"
  },
  {
    id: "prone",
    label: "Prone",
    file: "prone.png"
  },
  {
    id: "rage",
    label: "Rage",
    file: "rage.png"
  },
  {
    id: "cursed",
    label: "Cursed",
    file: "cursed.png"
  },
  {
    id: "observation-haki",
    label: "Observation Haki",
    file: "observation-haki.png"
  },
  {
    id: "armament-haki",
    label: "Armament Haki",
    file: "armament-haki.png"
  },
  {
    id: "conquerors-haki",
    label: "Conqueror's Haki",
    file: "conquerors-haki.png"
  }
];

const auraOptions = [
  { id: "aura5", label: "5 ft", feet: 5 },
  { id: "aura10", label: "10 ft", feet: 10 },
  { id: "aura15", label: "15 ft", feet: 15 },
  { id: "aura20", label: "20 ft", feet: 20 },
  { id: "aura30", label: "30 ft", feet: 30 },
  { id: "aura60", label: "60 ft", feet: 60 }
];

const diceOptions = [
  { id: "d4", label: "d4", sides: 4 },
  { id: "d6", label: "d6", sides: 6 },
  { id: "d8", label: "d8", sides: 8 },
  { id: "d10", label: "d10", sides: 10 },
  { id: "d12", label: "d12", sides: 12 },
  { id: "d20", label: "d20", sides: 20 },
  { id: "d100", label: "d100", sides: 100 }
];

const auraColors = {
  aura5: {
    fill: "#22c55e",
    stroke: "#bbf7d0"
  },
  aura10: {
    fill: "#3b82f6",
    stroke: "#bfdbfe"
  },
  aura15: {
    fill: "#a855f7",
    stroke: "#e9d5ff"
  },
  aura20: {
    fill: "#f97316",
    stroke: "#fed7aa"
  },
  aura30: {
    fill: "#ef4444",
    stroke: "#fecaca"
  },
  aura60: {
    fill: "#eab308",
    stroke: "#fef08a"
  }
};

let selectedItemId = null;
let isRendering = false;
let diceHistory = [];
let diceStack = [];

function createAppShell() {
  document.querySelector("#app").innerHTML = `
    <div class="panel">
      <h1>OP Tayfa Hizmet</h1>
      <p class="subtitle">Condition, aura & dice tools</p>
      <p class="status" id="status">Owlbear bekleniyor...</p>

      <div id="tokenInfo" class="token-info hidden"></div>

      <div class="marker-section">
        <div class="section-title">Condition Marker</div>
        <div class="add-row">
          <select id="conditionSelect"></select>
          <button id="addConditionButton" class="add-button">Add</button>
        </div>
        <div id="activeConditions" class="chips"></div>
      </div>

      <div class="marker-section">
        <div class="section-title">Aura Marker</div>
        <div class="add-row">
          <select id="auraSelect"></select>
          <button id="addAuraButton" class="add-button">Add</button>
        </div>
        <div id="activeAuras" class="chips"></div>
      </div>

      <button id="clearAllButton" class="clear-button hidden">Clear All</button>

      <div class="marker-section dice-section">
        <div class="section-title">Dice Roller</div>

        <div class="dice-inputs">
          <label>
            <span>Count</span>
            <input id="diceCount" type="number" min="1" max="50" value="1" />
          </label>

          <label>
            <span>Repeat</span>
            <input id="diceRepeat" type="number" min="1" max="20" value="1" />
          </label>

          <label class="modifier-label">
            <span>Modifier</span>
            <input id="diceModifier" type="number" value="0" />
          </label>
        </div>

        <div id="diceButtons" class="dice-buttons"></div>

        <div class="dice-stack-wrap">
          <div class="dice-history-title">Stack</div>
          <div id="diceStack" class="dice-stack">
            <span class="empty-history">No dice stacked</span>
          </div>

          <div class="dice-actions">
            <button id="rollStackButton" class="roll-stack-button">Roll Stack</button>
            <button id="clearStackButton" class="clear-stack-button">Clear Stack</button>
          </div>
        </div>

        <div id="diceResult" class="dice-result">
          Zar sonucu burada görünecek.
        </div>

        <div class="dice-history-wrap">
          <div class="dice-history-title">History</div>
          <div id="diceHistory" class="dice-history">
            <span class="empty-history">No rolls yet</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getIconUrl(fileName) {
  return `${window.location.origin}${ICON_BASE_PATH}${encodeURIComponent(
    fileName
  )}`;
}

function getActiveConditions(item) {
  return item?.metadata?.[CONDITION_METADATA_KEY] ?? [];
}

function getActiveAuras(item) {
  return item?.metadata?.[AURA_METADATA_KEY] ?? [];
}

function isConditionIcon(item) {
  return Boolean(item?.metadata?.[CONDITION_ICON_METADATA_KEY]);
}

function isAuraItem(item) {
  return Boolean(item?.metadata?.[AURA_ITEM_METADATA_KEY]);
}

function isLegacyCustomMarkerIcon(item) {
  return Boolean(item?.metadata?.[LEGACY_CUSTOM_ICON_METADATA_KEY]);
}

function isGeneratedMarkerItem(item) {
  return isConditionIcon(item) || isAuraItem(item) || isLegacyCustomMarkerIcon(item);
}

function getOptionById(options, id) {
  return options.find((option) => option.id === id);
}

function renderSelect(selectId, options) {
  const select = document.querySelector(selectId);

  select.innerHTML = options
    .map((option) => {
      return `<option value="${option.id}">${option.label}</option>`;
    })
    .join("");
}

function renderEmptyChip(container, text) {
  container.innerHTML = `<span class="empty-chip">${text}</span>`;
}

function rollSingleDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function getDiceCount() {
  const value = Number(document.querySelector("#diceCount")?.value ?? 1);

  if (Number.isNaN(value)) return 1;

  return Math.min(Math.max(Math.floor(value), 1), 50);
}

function getDiceRepeat() {
  const value = Number(document.querySelector("#diceRepeat")?.value ?? 1);

  if (Number.isNaN(value)) return 1;

  return Math.min(Math.max(Math.floor(value), 1), 20);
}

function getDiceModifier() {
  const value = Number(document.querySelector("#diceModifier")?.value ?? 0);

  if (Number.isNaN(value)) return 0;

  return Math.floor(value);
}

function formatModifier(modifier) {
  if (modifier === 0) return "";
  return modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
}

function getDiceStackFormula(modifier = getDiceModifier()) {
  if (!diceStack.length) return "";

  const dicePart = diceStack
    .map((entry) => `${entry.count}d${entry.sides}`)
    .join(" + ");

  return `${dicePart}${formatModifier(modifier)}`;
}

function addDieToStack(sides) {
  const count = getDiceCount();
  const existing = diceStack.find((entry) => entry.sides === sides);

  if (existing) {
    existing.count += count;
  } else {
    diceStack.push({
      sides,
      count
    });
  }

  renderDiceStack();
}

function removeDieFromStack(sides) {
  diceStack = diceStack.filter((entry) => entry.sides !== sides);
  renderDiceStack();
}

function clearDiceStack() {
  diceStack = [];
  renderDiceStack();

  const resultElement = document.querySelector("#diceResult");
  if (resultElement) {
    resultElement.innerHTML = "Zar sonucu burada görünecek.";
  }
}

function renderDiceStack() {
  const stackElement = document.querySelector("#diceStack");

  if (!stackElement) return;

  if (!diceStack.length) {
    stackElement.innerHTML = `<span class="empty-history">No dice stacked</span>`;
    return;
  }

  stackElement.innerHTML = diceStack
    .map((entry) => {
      return `
        <button class="stack-chip" data-remove-stack="${entry.sides}">
          <span>${entry.count}d${entry.sides}</span>
          <strong>×</strong>
        </button>
      `;
    })
    .join("");

  stackElement.querySelectorAll("[data-remove-stack]").forEach((button) => {
    button.onclick = () => {
      removeDieFromStack(Number(button.dataset.removeStack));
    };
  });
}

function renderDiceHistory() {
  const historyElement = document.querySelector("#diceHistory");

  if (!historyElement) return;

  if (!diceHistory.length) {
    historyElement.innerHTML = `<span class="empty-history">No rolls yet</span>`;
    return;
  }

  historyElement.innerHTML = diceHistory
    .map((entry) => {
      const resultText =
        entry.results.length === 1
          ? `${entry.results[0].total}`
          : entry.results.map((result) => result.total).join(" / ");

      return `
        <div class="history-item">
          <div class="history-main">
            <strong>${resultText}</strong>
            <span>${entry.formula}</span>
          </div>
          <div class="history-rolls">
            ${entry.results
              .map((result, index) => {
                return `#${index + 1}: ${result.total} (${result.groups
                  .map((group) => `${group.label}: ${group.rolls.join(", ")}`)
                  .join(" | ")})`;
              })
              .join("<br>")}
          </div>
        </div>
      `;
    })
    .join("");
}

function addDiceHistory(entry) {
  diceHistory = [entry, ...diceHistory].slice(0, 10);
  renderDiceHistory();
}

function rollDiceStack() {
  if (!diceStack.length) {
    const resultElement = document.querySelector("#diceResult");
    resultElement.innerHTML = `
      <div class="dice-formula">Stack boş.</div>
      <div class="dice-rolls">Önce Count seçip bir zar butonuna basarak stack oluştur.</div>
    `;
    return;
  }

  const repeat = getDiceRepeat();
  const modifier = getDiceModifier();
  const formula = getDiceStackFormula(modifier);

  const results = Array.from({ length: repeat }, () => {
    const groups = diceStack.map((entry) => {
      const rolls = Array.from({ length: entry.count }, () =>
        rollSingleDie(entry.sides)
      );

      const subtotal = rolls.reduce((sum, value) => sum + value, 0);

      return {
        label: `${entry.count}d${entry.sides}`,
        sides: entry.sides,
        count: entry.count,
        rolls,
        subtotal
      };
    });

    const diceTotal = groups.reduce((sum, group) => sum + group.subtotal, 0);
    const total = diceTotal + modifier;

    return {
      groups,
      diceTotal,
      total
    };
  });

  const resultElement = document.querySelector("#diceResult");

  if (repeat === 1) {
    const result = results[0];

    resultElement.innerHTML = `
      <div class="dice-total">${result.total}</div>
      <div class="dice-formula">${formula}</div>
      <div class="dice-rolls">
        ${result.groups
          .map((group) => {
            return `${group.label}: ${group.rolls.join(", ")}`;
          })
          .join("<br>")}
      </div>
    `;
  } else {
    resultElement.innerHTML = `
      <div class="dice-formula multi-title">${repeat} separate rolls · ${formula}</div>
      <div class="multi-rolls">
        ${results
          .map((result, index) => {
            return `
              <div class="multi-roll-item">
                <div class="multi-roll-head">
                  <span>#${index + 1}</span>
                  <strong>${result.total}</strong>
                </div>
                <div class="dice-rolls">
                  ${result.groups
                    .map((group) => {
                      return `${group.label}: ${group.rolls.join(", ")}`;
                    })
                    .join("<br>")}
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  addDiceHistory({
    formula,
    results
  });
}

function renderDiceRoller() {
  const diceButtons = document.querySelector("#diceButtons");

  if (!diceButtons) return;

  diceButtons.innerHTML = diceOptions
    .map((dice) => {
      return `
        <button class="dice-button" data-sides="${dice.sides}">
          Add ${dice.label}
        </button>
      `;
    })
    .join("");

  diceButtons.querySelectorAll("[data-sides]").forEach((button) => {
    button.onclick = () => {
      addDieToStack(Number(button.dataset.sides));
    };
  });

  document.querySelector("#rollStackButton").onclick = () => {
    rollDiceStack();
  };

  document.querySelector("#clearStackButton").onclick = () => {
    clearDiceStack();
  };

  renderDiceStack();
}

function renderNoSelection() {
  document.querySelector("#status").textContent = "Bir token seç.";
  document.querySelector("#tokenInfo").classList.add("hidden");

  renderSelect("#conditionSelect", conditionMarkers);
  renderSelect("#auraSelect", auraOptions);

  renderEmptyChip(document.querySelector("#activeConditions"), "No conditions");
  renderEmptyChip(document.querySelector("#activeAuras"), "No auras");

  document.querySelector("#clearAllButton").classList.add("hidden");
}

function renderPanel(item) {
  const activeConditions = getActiveConditions(item);
  const activeAuras = getActiveAuras(item);

  document.querySelector("#status").textContent = "Token seçildi.";

  const tokenInfo = document.querySelector("#tokenInfo");
  tokenInfo.classList.remove("hidden");
  tokenInfo.innerHTML = `
    <strong>${item.name ?? "İsimsiz Token"}</strong>
    <span>${item.id}</span>
  `;

  renderSelect("#conditionSelect", conditionMarkers);
  renderSelect("#auraSelect", auraOptions);

  renderActiveConditionChips(activeConditions);
  renderActiveAuraChips(activeAuras);

  document.querySelector("#addConditionButton").onclick = async () => {
    const selectedConditionId = document.querySelector("#conditionSelect").value;
    await addCondition(selectedConditionId);
  };

  document.querySelector("#addAuraButton").onclick = async () => {
    const selectedAuraId = document.querySelector("#auraSelect").value;
    await addAura(selectedAuraId);
  };

  const clearButton = document.querySelector("#clearAllButton");
  clearButton.classList.remove("hidden");
  clearButton.onclick = async () => {
    await clearAllMarkers();
  };
}

function renderActiveConditionChips(activeConditions) {
  const container = document.querySelector("#activeConditions");

  if (!activeConditions.length) {
    renderEmptyChip(container, "No conditions");
    return;
  }

  container.innerHTML = activeConditions
    .map((conditionId) => {
      const condition = getOptionById(conditionMarkers, conditionId);
      const label = condition?.label ?? conditionId;

      return `
        <button class="chip" data-remove-condition="${conditionId}">
          <span>${label}</span>
          <strong>×</strong>
        </button>
      `;
    })
    .join("");

  container.querySelectorAll("[data-remove-condition]").forEach((button) => {
    button.onclick = async () => {
      await removeCondition(button.dataset.removeCondition);
    };
  });
}

function renderActiveAuraChips(activeAuras) {
  const container = document.querySelector("#activeAuras");

  if (!activeAuras.length) {
    renderEmptyChip(container, "No auras");
    return;
  }

  container.innerHTML = activeAuras
    .map((auraId) => {
      const aura = getOptionById(auraOptions, auraId);
      const label = aura?.label ?? auraId;
      const color = auraColors[auraId]?.fill ?? "#ffffff";

      return `
        <button class="chip" data-remove-aura="${auraId}">
          <span class="chip-dot" style="background:${color}"></span>
          <span>${label}</span>
          <strong>×</strong>
        </button>
      `;
    })
    .join("");

  container.querySelectorAll("[data-remove-aura]").forEach((button) => {
    button.onclick = async () => {
      await removeAura(button.dataset.removeAura);
    };
  });
}

async function deleteConditionIconsForToken(tokenId) {
  const icons = await OBR.scene.items.getItems((item) => {
    return item.metadata?.[CONDITION_ICON_METADATA_KEY]?.tokenId === tokenId;
  });

  if (icons.length > 0) {
    await OBR.scene.items.deleteItems(icons.map((icon) => icon.id));
  }
}

async function deleteLegacyCustomIconsForToken(tokenId) {
  const icons = await OBR.scene.items.getItems((item) => {
    return item.metadata?.[LEGACY_CUSTOM_ICON_METADATA_KEY]?.tokenId === tokenId;
  });

  if (icons.length > 0) {
    await OBR.scene.items.deleteItems(icons.map((icon) => icon.id));
  }
}

async function deleteAuraItemsForToken(tokenId) {
  const auras = await OBR.scene.items.getItems((item) => {
    return item.metadata?.[AURA_ITEM_METADATA_KEY]?.tokenId === tokenId;
  });

  if (auras.length > 0) {
    await OBR.scene.items.deleteItems(auras.map((aura) => aura.id));
  }
}

async function renderConditionIconsForToken(token) {
  const activeConditions = getActiveConditions(token).filter((conditionId) => {
    return conditionMarkers.some((condition) => condition.id === conditionId);
  });

  await deleteConditionIconsForToken(token.id);
  await deleteLegacyCustomIconsForToken(token.id);

  if (!activeConditions.length) return;

  const bounds = await OBR.scene.items.getItemBounds([token.id]);

  const tokenSize = Math.max(bounds.width, bounds.height);

  const iconScale = ICON_SCALE;
  const spacing = tokenSize * ICON_SPACING_RATIO;

  const startX = bounds.center.x - ((activeConditions.length - 1) * spacing) / 2;
  const y = bounds.min.y - tokenSize * ICON_Y_OFFSET_RATIO;

  const visibleConditions = activeConditions
    .map((conditionId) => getOptionById(conditionMarkers, conditionId))
    .filter(Boolean);

  if (!visibleConditions.length) return;

  const iconItems = visibleConditions.map((condition, index) => {
    const iconUrl = getIconUrl(condition.file);

    return buildImage(
      {
        height: 512,
        width: 512,
        url: iconUrl,
        mime: "image/png"
      },
      {
        dpi: 512,
        offset: {
          x: 256,
          y: 256
        }
      }
    )
      .name(`OP Tayfa Hizmet Condition Icon - ${condition.label}`)
      .position({
        x: startX + index * spacing,
        y
      })
      .scale({
        x: iconScale,
        y: iconScale
      })
      .layer(ICON_LAYER)
      .attachedTo(token.id)
      .disableHit(true)
      .metadata({
        [CONDITION_ICON_METADATA_KEY]: {
          tokenId: token.id,
          conditionId: condition.id
        }
      })
      .build();
  });

  await OBR.scene.items.addItems(iconItems);
}

async function renderAuraItemsForToken(token) {
  const activeAuras = getActiveAuras(token);

  await deleteAuraItemsForToken(token.id);

  if (!activeAuras.length) return;

  const bounds = await OBR.scene.items.getItemBounds([token.id]);

  const tokenWidth = Math.max(bounds.width, bounds.height);
  const gridSize = tokenWidth;
  const center = bounds.center;

  const auraItems = activeAuras.map((auraId) => {
    const aura = auraOptions.find((option) => option.id === auraId);
    const feet = aura?.feet ?? 5;

    const radiusSquares = feet / 5;
    const diameter = radiusSquares * 2 * gridSize;

    const colors = auraColors[auraId] ?? {
      fill: "#a855f7",
      stroke: "#e9d5ff"
    };

    return buildShape()
      .name(`OP Tayfa Hizmet Aura - ${feet} ft`)
      .shapeType("CIRCLE")
      .width(diameter)
      .height(diameter)
      .position({
        x: center.x,
        y: center.y
      })
      .fillColor(colors.fill)
      .fillOpacity(0.18)
      .strokeColor(colors.stroke)
      .strokeOpacity(0.85)
      .strokeWidth(4)
      .layer(AURA_LAYER)
      .attachedTo(token.id)
      .disableHit(true)
      .metadata({
        [AURA_ITEM_METADATA_KEY]: {
          tokenId: token.id,
          auraId,
          feet
        }
      })
      .build();
  });

  await OBR.scene.items.addItems(auraItems);
}

async function refreshSelectedTokenMarkers() {
  if (!selectedItemId || isRendering) return;

  isRendering = true;

  try {
    const items = await OBR.scene.items.getItems([selectedItemId]);
    const token = items[0];

    if (!token || isGeneratedMarkerItem(token)) return;

    await renderConditionIconsForToken(token);
    await renderAuraItemsForToken(token);
  } finally {
    isRendering = false;
  }
}

async function updateTokenArray(metadataKey, updater) {
  if (!selectedItemId) return;

  await OBR.scene.items.updateItems([selectedItemId], (items) => {
    for (const item of items) {
      const current = item.metadata[metadataKey] ?? [];
      item.metadata[metadataKey] = updater(current);
    }
  });
}

async function addCondition(conditionId) {
  await updateTokenArray(CONDITION_METADATA_KEY, (current) => [
    ...new Set([...current, conditionId])
  ]);

  await refreshSelectedTokenMarkers();
  await loadSelectedItem();
}

async function removeCondition(conditionId) {
  await updateTokenArray(CONDITION_METADATA_KEY, (current) =>
    current.filter((id) => id !== conditionId)
  );

  await refreshSelectedTokenMarkers();
  await loadSelectedItem();
}

async function addAura(auraId) {
  await updateTokenArray(AURA_METADATA_KEY, (current) => [
    ...new Set([...current, auraId])
  ]);

  await refreshSelectedTokenMarkers();
  await loadSelectedItem();
}

async function removeAura(auraId) {
  await updateTokenArray(AURA_METADATA_KEY, (current) =>
    current.filter((id) => id !== auraId)
  );

  await refreshSelectedTokenMarkers();
  await loadSelectedItem();
}

async function clearAllMarkers() {
  if (!selectedItemId) return;

  await OBR.scene.items.updateItems([selectedItemId], (items) => {
    for (const item of items) {
      item.metadata[CONDITION_METADATA_KEY] = [];
      item.metadata[AURA_METADATA_KEY] = [];
      item.metadata[LEGACY_CUSTOM_MARKERS_METADATA_KEY] = [];
    }
  });

  await deleteConditionIconsForToken(selectedItemId);
  await deleteLegacyCustomIconsForToken(selectedItemId);
  await deleteAuraItemsForToken(selectedItemId);
  await loadSelectedItem();
}

async function loadSelectedItem() {
  if (isRendering) return;

  const selection = await OBR.player.getSelection();

  if (!selection || selection.length === 0) {
    selectedItemId = null;
    renderNoSelection();
    return;
  }

  const selectedItems = await OBR.scene.items.getItems(selection);

  const selectedToken = selectedItems.find((item) => {
    return item && !isGeneratedMarkerItem(item);
  });

  if (!selectedToken) {
    selectedItemId = null;
    renderNoSelection();
    return;
  }

  selectedItemId = selectedToken.id;
  renderPanel(selectedToken);
}

createAppShell();
renderDiceRoller();
renderDiceHistory();

if (!OBR.isAvailable) {
  document.querySelector("#status").textContent =
    "Bu sayfa Owlbear dışında açıldı. Owlbear içinde çalışınca token seçimi aktif olacak.";
} else {
  OBR.onReady(async () => {
    document.querySelector("#status").textContent = "Owlbear hazır.";

    await loadSelectedItem();

    OBR.player.onChange(async () => {
      await loadSelectedItem();
    });
  });
}