(function () {
  "use strict";

  const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const COLORS = {
    "A+": "#d62728",
    "A-": "#1f77b4",
    "B+": "#2ca02c",
    "B-": "#ff7f0e",
    "O+": "#9467bd",
    "O-": "#17becf",
    "AB+": "#e377c2",
    "AB-": "#111827",
  };
  const HISTORY_URL = "/assets/blood-history.json";
  const LEGACY_HISTORY_URL = "/assets/blood.json";
  const LATEST_URL = "https://raw.githubusercontent.com/frizensami/red-cross-blood-stocks/main/blood-stocks.json";
  const LATEST_COMMIT_URL = "https://api.github.com/repos/frizensami/red-cross-blood-stocks/commits/main";

  const state = {
    records: [],
    latest: [],
    aggregation: "weekly",
    range: "365",
    group: "all",
    selected: new Set(BLOOD_TYPES),
    showAnnotations: true,
  };

  function parseDate(date) {
    return new Date(`${date}T00:00:00Z`);
  }

  function formatLongDate(dateString) {
    if (!dateString || dateString === "unavailable") return "unavailable";
    const date = parseDate(dateString);
    const day = date.getUTCDate();
    const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
    const month = date.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
    return `${day}${suffix} ${month} ${date.getUTCFullYear()}`;
  }

  function mean(values) {
    if (values.length === 0) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function isoWeekStart(dateString) {
    const date = parseDate(dateString);
    const day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() - day + 1);
    return date.toISOString().slice(0, 10);
  }

  function monthStart(dateString) {
    return `${dateString.slice(0, 7)}-01`;
  }

  function normaliseHistory(payload) {
    const records = Array.isArray(payload) ? payload : payload.records;
    return records
      .filter((row) => row && BLOOD_TYPES.includes(row.bloodType))
      .map((row) => ({
        date: row.date,
        bloodType: row.bloodType,
        fillLevel: Number(row.fillLevel),
        status: row.status || null,
        sourceCommit: row.sourceCommit || null,
      }))
      .filter((row) => row.date && Number.isFinite(row.fillLevel))
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return BLOOD_TYPES.indexOf(a.bloodType) - BLOOD_TYPES.indexOf(b.bloodType);
      });
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    return response.json();
  }

  async function loadHistory() {
    try {
      return normaliseHistory(await fetchJson(HISTORY_URL));
    } catch (error) {
      console.warn("Falling back to legacy blood history asset", error);
      return normaliseHistory(await fetchJson(LEGACY_HISTORY_URL));
    }
  }

  function latestFromHistory(records) {
    const byType = new Map();
    for (const record of records) {
      byType.set(record.bloodType, record);
    }
    return BLOOD_TYPES.map((type) => byType.get(type)).filter(Boolean);
  }

  function normaliseLatest(rows, sourceDate) {
    return rows
      .filter((row) => row && BLOOD_TYPES.includes(row.bloodType))
      .map((row) => ({
        date: sourceDate,
        bloodType: row.bloodType,
        fillLevel: Number(row.fillLevel),
        status: row.status || null,
      }))
      .filter((row) => Number.isFinite(row.fillLevel));
  }

  function mergedRecords(records, latestRows) {
    const byKey = new Map(records.map((row) => [`${row.date}:${row.bloodType}`, row]));
    for (const row of latestRows) {
      byKey.set(`${row.date}:${row.bloodType}`, row);
    }
    return [...byKey.values()].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return BLOOD_TYPES.indexOf(a.bloodType) - BLOOD_TYPES.indexOf(b.bloodType);
    });
  }

  function recordsForCurrentSelection() {
    const selectedTypes = BLOOD_TYPES.filter((type) => state.selected.has(type)).filter((type) => {
      if (state.group === "positive") return type.includes("+");
      if (state.group === "negative") return type.includes("-");
      return true;
    });
    const latestDate = state.records.length ? state.records[state.records.length - 1].date : null;
    const minDate = latestDate && state.range !== "all" ? dateDaysBefore(latestDate, Number(state.range)) : null;

    return state.records.filter((row) => {
      return selectedTypes.includes(row.bloodType) && (!minDate || row.date >= minDate);
    });
  }

  function dateDaysBefore(dateString, days) {
    const date = parseDate(dateString);
    date.setUTCDate(date.getUTCDate() - days);
    return date.toISOString().slice(0, 10);
  }

  function aggregate(records) {
    if (state.aggregation === "daily") return records;

    const groups = new Map();
    for (const row of records) {
      const bucket = state.aggregation === "monthly" ? monthStart(row.date) : isoWeekStart(row.date);
      const key = `${row.bloodType}:${bucket}`;
      if (!groups.has(key)) {
        groups.set(key, { date: bucket, bloodType: row.bloodType, values: [] });
      }
      groups.get(key).values.push(row.fillLevel);
    }

    return [...groups.values()]
      .map((row) => ({
        date: row.date,
        bloodType: row.bloodType,
        fillLevel: mean(row.values),
      }))
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return BLOOD_TYPES.indexOf(a.bloodType) - BLOOD_TYPES.indexOf(b.bloodType);
      });
  }

  function renderCards(root) {
    const latestRows = state.latest.length ? state.latest : latestFromHistory(state.records);
    const container = root.querySelector("[data-blood-cards]");
    container.innerHTML = latestRows
      .map((row) => {
        const level = Math.max(0, Math.min(100, row.fillLevel));
        return `
          <div class="blood-card">
            <div class="blood-card__top">
              <span class="blood-card__type">${row.bloodType}</span>
              <span class="blood-card__level">${level}%</span>
            </div>
            <div class="blood-card__status">${row.status || "Status unavailable"}</div>
            <div class="blood-card__bar" aria-hidden="true"><span style="width:${level}%"></span></div>
          </div>
        `;
      })
      .join("");
  }

  function findLargestDrop(records) {
    let best = null;
    for (const type of BLOOD_TYPES) {
      const rows = records.filter((row) => row.bloodType === type).sort((a, b) => a.date.localeCompare(b.date));
      for (let index = 0; index < rows.length; index += 1) {
        const current = rows[index];
        const windowStart = dateDaysBefore(current.date, 30);
        const previousRows = rows.filter((row) => row.date >= windowStart && row.date < current.date);
        const previousPeak = [...previousRows].sort((a, b) => b.fillLevel - a.fillLevel)[0];
        if (!previousPeak) continue;

        const drop = previousPeak.fillLevel - current.fillLevel;
        if (drop > 0 && (!best || drop > best.drop)) {
          best = {
            type,
            drop,
            date: current.date,
            fillLevel: current.fillLevel,
            previousDate: previousPeak.date,
            previousFillLevel: previousPeak.fillLevel,
          };
        }
      }
    }
    return best;
  }

  function findLowestPoint(records) {
    return [...records].sort((a, b) => a.fillLevel - b.fillLevel)[0] || null;
  }

  function chartDateRangeLabel(records) {
    if (records.length === 0) return "no data";
    const dates = records.map((row) => row.date).sort();
    return `${formatLongDate(dates[0])} to ${formatLongDate(dates[dates.length - 1])}`;
  }

  function chartAnnotations(records) {
    const lowest = findLowestPoint(records);
    const largestDrop = findLargestDrop(records);
    const annotations = [];

    if (lowest) {
      annotations.push({
        x: lowest.date,
        y: lowest.fillLevel,
        text: `Lowest: ${lowest.bloodType} ${lowest.fillLevel.toFixed(1)}%`,
        showarrow: true,
        arrowhead: 2,
        ax: 20,
        ay: 42,
        bgcolor: "rgba(255,255,255,0.92)",
        bordercolor: COLORS[lowest.bloodType],
        borderwidth: 1,
      });
    }

    if (largestDrop && (!lowest || largestDrop.date !== lowest.date || largestDrop.type !== lowest.bloodType)) {
      annotations.push({
        x: largestDrop.date,
        y: largestDrop.fillLevel,
        text: `Largest 30-day drop: ${largestDrop.type} -${largestDrop.drop.toFixed(1)}%`,
        showarrow: true,
        arrowhead: 2,
        ax: -35,
        ay: -45,
        bgcolor: "rgba(255,255,255,0.92)",
        bordercolor: COLORS[largestDrop.type],
        borderwidth: 1,
      });
    }

    return annotations;
  }

  function annotationMarkerTraces(records) {
    const lowest = findLowestPoint(records);
    const largestDrop = findLargestDrop(records);
    const points = [];
    if (lowest) points.push({ ...lowest, label: "Lowest point" });
    if (largestDrop && (!lowest || largestDrop.date !== lowest.date || largestDrop.type !== lowest.bloodType)) {
      points.push({
        date: largestDrop.date,
        bloodType: largestDrop.type,
        fillLevel: largestDrop.fillLevel,
        label: "Largest drop",
      });
    }
    return points.map((point) => ({
      x: [point.date],
      y: [point.fillLevel],
      type: "scatter",
      mode: "markers",
      name: point.label,
      marker: {
        color: COLORS[point.bloodType],
        size: 11,
        symbol: "diamond",
        line: { color: "#ffffff", width: 2 },
      },
      hovertemplate: `${point.label}<br>${point.bloodType}<br>%{x}<br>%{y:.1f}%<extra></extra>`,
      showlegend: false,
    }));
  }

  function renderChart(root) {
    const rows = aggregate(recordsForCurrentSelection());
    const isNarrow = window.matchMedia("(max-width: 600px)").matches;
    const lineTraces = BLOOD_TYPES.filter((type) => state.selected.has(type)).map((type) => {
      const typeRows = rows.filter((row) => row.bloodType === type);
      return {
        x: typeRows.map((row) => row.date),
        y: typeRows.map((row) => row.fillLevel),
        type: "scatter",
        mode: "lines",
        name: type,
        line: { color: COLORS[type], width: 2 },
        hovertemplate: `${type}<br>%{x}<br>%{y:.1f}%<extra></extra>`,
      };
    }).filter((trace) => trace.x.length > 0);
    const traces = state.showAnnotations ? [...lineTraces, ...annotationMarkerTraces(rows)] : lineTraces;

    const title = isNarrow
      ? `${capitalize(state.aggregation)} blood stocks<br><span style="font-size:11px">${chartDateRangeLabel(rows)}</span>`
      : `${capitalize(state.aggregation)} Singapore blood stock levels<br><span style="font-size:12px">${chartDateRangeLabel(rows)}</span>`;
    Plotly.react(
      root.querySelector("[data-blood-chart]"),
      traces,
      {
        title: { text: title, font: { size: isNarrow ? 14 : 16 } },
        margin: { l: isNarrow ? 42 : 48, r: isNarrow ? 8 : 18, t: 70, b: isNarrow ? 80 : 100 },
        xaxis: { title: { text: "Date", standoff: 18 }, type: "date", tickformat: "%b %Y" },
        yaxis: { title: "Fill level (%)", range: [0, 105] },
        legend: { orientation: "h", x: 0.5, xanchor: "center", y: isNarrow ? -0.24 : -0.32, yanchor: "top" },
        annotations: state.showAnnotations ? chartAnnotations(rows) : [],
        hovermode: "closest",
        hoverlabel: { align: "left" },
      },
      { responsive: true, displaylogo: false, displayModeBar: !isNarrow }
    );
  }

  function capitalize(value) {
    return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
  }

  function renderStatus(root, latestFetchError) {
    const firstDate = state.records.length ? state.records[0].date : "unavailable";
    const latestDate = state.records.length ? state.records[state.records.length - 1].date : "unavailable";
    const suffix = latestFetchError ? " Latest live fetch failed; showing generated history." : "";
    root.querySelector("[data-blood-status]").textContent = `Data range: ${formatLongDate(firstDate)} to ${formatLongDate(latestDate)}.${suffix}`;
  }

  function render(root, latestFetchError) {
    renderCards(root);
    renderChart(root);
    renderStatus(root, latestFetchError);
  }

  function bindControls(root) {
    root.querySelectorAll("[data-blood-aggregation]").forEach((button) => {
      button.addEventListener("click", () => {
        state.aggregation = button.dataset.bloodAggregation;
        root.querySelectorAll("[data-blood-aggregation]").forEach((item) => {
          item.setAttribute("aria-pressed", String(item === button));
        });
        renderChart(root);
      });
    });

    root.querySelector("[data-blood-range]").addEventListener("change", (event) => {
      state.range = event.target.value;
      renderChart(root);
    });

    root.querySelector("[data-blood-group]").addEventListener("change", (event) => {
      state.group = event.target.value;
      renderChart(root);
    });

    root.querySelector("[data-blood-annotations]").addEventListener("change", (event) => {
      state.showAnnotations = event.target.checked;
      renderChart(root);
    });

    root.querySelectorAll("[data-blood-type]").forEach((input) => {
      input.addEventListener("change", () => {
        state.selected = new Set(
          [...root.querySelectorAll("[data-blood-type]:checked")].map((item) => item.value)
        );
        renderChart(root);
      });
    });
  }

  async function init() {
    const root = document.querySelector("[data-blood-dashboard]");
    if (!root) return;

    if (!window.Plotly) {
      root.innerHTML = '<div class="blood-dashboard__error">Plotly did not load, so the dashboard cannot render.</div>';
      return;
    }

    let latestFetchError = false;
    try {
      state.records = await loadHistory();
      try {
        const latestRows = await fetchJson(LATEST_URL);
        let sourceDate = state.records.length ? state.records[state.records.length - 1].date : new Date().toISOString().slice(0, 10);
        try {
          const latestCommit = await fetchJson(LATEST_COMMIT_URL);
          sourceDate = latestCommit.commit.committer.date.slice(0, 10);
        } catch (error) {
          console.warn("Could not fetch latest commit date", error);
        }
        state.latest = normaliseLatest(latestRows, sourceDate);
        state.records = mergedRecords(state.records, state.latest);
      } catch (error) {
        latestFetchError = true;
        console.warn("Could not fetch latest blood stocks", error);
      }
      bindControls(root);
      render(root, latestFetchError);
    } catch (error) {
      console.error(error);
      root.innerHTML = '<div class="blood-dashboard__error">Blood stock data could not be loaded.</div>';
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
