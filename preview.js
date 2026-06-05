const state = {
  skins: [],
  cards: [],
  metricLoad: 20,
  playing: true,
  timerId: null,
};

const grid = document.querySelector("#skin-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search");
const playToggle = document.querySelector("#play-toggle");
const speedInput = document.querySelector("#speed");
const speedValue = document.querySelector("#speed-value");
const template = document.querySelector("#skin-card-template");

init();

async function init() {
  try {
    const response = await fetch("manifest.json");
    if (!response.ok) {
      throw new Error(`Manifest request failed with ${response.status}`);
    }

    const manifest = await response.json();
    state.skins = manifest.skins ?? [];
    renderStats(state.skins);
    renderCards(state.skins);
    bindControls();
    scheduleNextFrame();
  } catch (error) {
    grid.innerHTML = `<p class="empty-state">Unable to load manifest.json.</p>`;
    console.error(error);
  }
}

function renderStats(skins) {
  const totalFrames = skins.reduce((sum, skin) => sum + skin.frames.length, 0);
  const authors = new Set(skins.map((skin) => skin.author));

  document.querySelector("#skin-count").textContent = skins.length;
  document.querySelector("#frame-count").textContent = totalFrames;
  document.querySelector("#author-count").textContent = authors.size;
}

function renderCards(skins) {
  grid.innerHTML = "";
  state.cards = skins.map((skin) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const image = node.querySelector("img");
    const title = node.querySelector("h2");
    const framePill = node.querySelector(".frame-pill");
    const author = node.querySelector(".author");
    const source = node.querySelector(".source");
    const localFrames = skin.frames.map((frame) => `skins/${skin.id}/${frame}`);

    node.dataset.search = [
      skin.id,
      skin.author,
      skin.source_from,
      skin.frames.join(" "),
    ].join(" ").toLowerCase();

    title.textContent = skin.id;
    framePill.textContent = `${skin.frames.length} frames`;
    author.textContent = skin.author;
    source.href = skin.source_from;
    source.textContent = skin.source_from;
    image.alt = `${skin.id} animation preview`;
    image.src = localFrames[0];
    const preloadedFrames = preloadFrames(localFrames);

    grid.append(node);

    return {
      node,
      image,
      frames: localFrames,
      preloadedFrames,
      index: 0,
    };
  });
}

function bindControls() {
  searchInput.addEventListener("input", applySearch);

  speedInput.addEventListener("input", () => {
    state.metricLoad = Number(speedInput.value);
    updateMetricOutput();
  });

  playToggle.addEventListener("click", () => {
    state.playing = !state.playing;
    playToggle.textContent = state.playing ? "Pause" : "Play";
    playToggle.setAttribute("aria-pressed", String(!state.playing));
  });
}

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  state.cards.forEach((card) => {
    const visible = !query || card.node.dataset.search.includes(query);
    card.node.classList.toggle("is-hidden", !visible);
    if (visible) {
      visibleCount += 1;
    }
  });

  emptyState.hidden = visibleCount > 0;
}

function scheduleNextFrame() {
  window.clearTimeout(state.timerId);
  state.timerId = window.setTimeout(advanceFrames, computeFrameMs(state.metricLoad));
}

function advanceFrames() {
  if (state.playing) {
    state.cards.forEach((card) => {
      if (card.node.classList.contains("is-hidden") || card.frames.length <= 1) {
        return;
      }

      const nextIndex = (card.index + 1) % card.frames.length;
      const nextFrame = card.preloadedFrames[nextIndex];
      if (!nextFrame.complete || nextFrame.naturalWidth === 0) {
        return;
      }

      card.index = nextIndex;
      card.image.src = nextFrame.src;
    });
  }

  scheduleNextFrame();
}

function computeFrameMs(metricLoad) {
  const normalizedValue = clamp(metricLoad, 0, 100);
  const intervalSeconds = Math.max(0.025, 0.10 - 0.12 * (normalizedValue / 100));
  return intervalSeconds * 1000;
}

function updateMetricOutput() {
  const frameMs = computeFrameMs(state.metricLoad);
  const fps = Math.round(1000 / frameMs);
  speedValue.textContent = `${state.metricLoad}% / ${fps}fps`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function preloadFrames(frames) {
  return frames.map((frame) => {
    const image = new Image();
    image.decoding = "async";
    image.src = frame;
    return image;
  });
}
