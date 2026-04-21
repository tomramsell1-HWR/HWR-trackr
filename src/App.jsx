import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

// â”€â”€â”€ Theme â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const T = {
  bg: "#F7F3EE",
  border: "#EAE0D5",
  text: "#2A2118",
  muted: "#9B8E83",
  feed:     { base: "#E8734A", light: "#FDF1EB", dark: "#C25A34" },
  poo:      { base: "#8B5E3C", light: "#F5EDE4", dark: "#6B4428" },
  mood:     { base: "#E8A838", light: "#FDF6E8", dark: "#C48920" },
  activity: { base: "#4A9E8B", light: "#EAF5F3", dark: "#357A6A" },
  sleep:    { base: "#6B7EC4", light: "#EEF0FA", dark: "#4F62B0" },
  ai:       { base: "#A855B5", light: "#F8EEFA", dark: "#8B3D9A" },
};

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const fmtTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fmtDate = (iso) => new Date(iso).toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
const nowISO = () => new Date().toISOString();
const toLocal = (iso) => {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocal = (val) => (val ? new Date(val).toISOString() : nowISO());

// â”€â”€â”€ Shared UI â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Pill = ({ label, active, color, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 14px", borderRadius: 20,
    border: `2px solid ${active ? color : T.border}`,
    background: active ? color : "#fff",
    color: active ? "#fff" : T.muted,
    fontWeight: 700, fontSize: 13, cursor: "pointer",
    transition: "all .15s", fontFamily: "inherit",
  }}>{label}</button>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 800, color: T.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{children}</div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <Label>{label}</Label>}
    {children}
  </div>
);

const iBase = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: `1.5px solid ${T.border}`, fontSize: 14, background: "#fff",
  color: T.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};
const Inp = (props) => <input style={iBase} {...props} />;
const Sel = ({ children, ...props }) => <select style={iBase} {...props}>{children}</select>;
const Txt = (props) => <textarea style={{ ...iBase, minHeight: 60, resize: "vertical" }} {...props} />;

const AddBtn = ({ color, onClick, label = "Add Entry", disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: "100%", padding: 13, borderRadius: 12, border: "none",
    background: disabled ? "#ccc" : color, color: "#fff",
    fontWeight: 800, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : `0 4px 16px ${color}44`,
    fontFamily: "inherit", marginTop: 4, transition: "all .2s",
  }}>{disabled ? "Savingâ€¦" : `${label} âœ“`}</button>
);

const Section = ({ title, emoji, color, children, count }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 14, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px #00000009" }}>
      <div onClick={() => setOpen((o) => !o)} style={{
        background: color.light, padding: "16px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", userSelect: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>{emoji}</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: color.dark }}>{title}</span>
          {count > 0 && (
            <span style={{ background: color.base, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 800, padding: "2px 8px" }}>{count}</span>
          )}
        </div>
        <span style={{ color: color.base, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{open ? "âˆ’" : "+"}</span>
      </div>
      {open && <div style={{ background: "#fff", padding: 18 }}>{children}</div>}
    </div>
  );
};

const EntryCard = ({ entry, color, summary, onDelete }) => (
  <div style={{
    background: color.light, borderRadius: 12, padding: "10px 14px", marginBottom: 8,
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    border: `1px solid ${color.base}22`, animation: "fadeUp .25s ease",
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 2 }}>
        {fmtDate(entry.timestamp)} Â· {fmtTime(entry.timestamp)}
      </div>
      <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{summary}</div>
      {entry.notes && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", marginTop: 2 }}>"{entry.notes}"</div>}
    </div>
    <button onClick={() => onDelete(entry.id)} style={{
      background: "none", border: "none", color: T.muted,
      fontSize: 20, cursor: "pointer", paddingLeft: 10, lineHeight: 1, flexShrink: 0,
    }}>Ã—</button>
  </div>
);

// â”€â”€â”€ FEEDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FEED_TYPES = ["Breast milk", "Formula", "Cow's milk", "Solid food", "Puree", "Snack", "Water", "Juice", "Other"];
const FEED_SIZES = ["Small", "Medium", "Large"];

function FeedSection({ entries, onAdd, onDelete }) {
  const [what, setWhat] = useState("");
  const [size, setSize] = useState("");
  const [startTime, setStartTime] = useState(toLocal(nowISO()));
  const [durationMins, setDurationMins] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!what) return;
    setSaving(true);
    await onAdd({ id: uid(), type: "feed", timestamp: fromLocal(startTime), what, size, duration_mins: durationMins ? parseInt(durationMins) : null, notes });
    setWhat(""); setSize(""); setDurationMins(""); setNotes(""); setStartTime(toLocal(nowISO()));
    setSaving(false);
  };

  return (
    <Section title="Feeds" emoji="ðŸ¼" color={T.feed} count={entries.length}>
      <Field label="What was she fed?">
        <Sel value={what} onChange={(e) => setWhat(e.target.value)}>
          <option value="">Select food / drinkâ€¦</option>
          {FEED_TYPES.map((f) => <option key={f}>{f}</option>)}
        </Sel>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Estimated size">
          <Sel value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Sizeâ€¦</option>
            {FEED_SIZES.map((s) => <option key={s}>{s}</option>)}
          </Sel>
        </Field>
        <Field label="Duration (mins)">
          <Inp type="number" min="1" placeholder="e.g. 15" value={durationMins} onChange={(e) => setDurationMins(e.target.value)} />
        </Field>
      </div>
      <Field label="Time of feed">
        <Inp type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </Field>
      <Field label="Notes">
        <Txt placeholder="Any observations about how she fedâ€¦" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <AddBtn color={T.feed.base} onClick={add} disabled={saving} />
      {entries.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {entries.slice(0, 10).map((e) => (
            <EntryCard key={e.id} entry={e} color={T.feed} onDelete={onDelete}
              summary={[e.what, e.size && `(${e.size})`, e.duration_mins && `${e.duration_mins} min`].filter(Boolean).join(" Â· ")} />
          ))}
        </div>
      )}
    </Section>
  );
}

// â”€â”€â”€ NAPPIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const POO_SIZES = ["Small", "Medium", "Large"];
const POO_COLOURS = ["Yellow", "Mustard", "Brown", "Dark brown", "Green", "Black", "Red-tinged", "White / Pale"];
const POO_CONSISTENCY = ["Runny / Watery", "Soft / Seedy", "Pasty", "Formed / Solid", "Hard pellets"];

function NappySection({ entries, onAdd, onDelete }) {
  const [tab, setTab] = useState("poo");
  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [consistency, setConsistency] = useState("");
  const [pooTime, setPooTime] = useState(toLocal(nowISO()));
  const [pooNotes, setPooNotes] = useState("");
  const [weeTime, setWeeTime] = useState(toLocal(nowISO()));
  const [weeNotes, setWeeNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const addPoo = async () => {
    setSaving(true);
    await onAdd({ id: uid(), type: "poo", timestamp: fromLocal(pooTime), size, colour, consistency, notes: pooNotes });
    setSize(""); setColour(""); setConsistency(""); setPooNotes(""); setPooTime(toLocal(nowISO()));
    setSaving(false);
  };

  const addWee = async () => {
    setSaving(true);
    await onAdd({ id: uid(), type: "wee", timestamp: fromLocal(weeTime), notes: weeNotes });
    setWeeNotes(""); setWeeTime(toLocal(nowISO()));
    setSaving(false);
  };

  const poos = entries.filter((e) => e.type === "poo");
  const wees = entries.filter((e) => e.type === "wee");
  const today = new Date().toDateString();
  const weesToday = wees.filter((e) => new Date(e.timestamp).toDateString() === today).length;

  const tabBtn = (t, label) => (
    <button onClick={() => setTab(t)} style={{
      flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
      background: tab === t ? T.poo.base : T.poo.light,
      color: tab === t ? "#fff" : T.poo.dark,
      fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
    }}>{label}</button>
  );

  return (
    <Section title="Nappies" emoji="ðŸ’©" color={T.poo} count={entries.length}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabBtn("poo", `ðŸ’© Poos (${poos.length})`)}
        {tabBtn("wee", `ðŸ’§ Wees (${wees.length})`)}
      </div>

      {tab === "poo" && <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Size">
            <Sel value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Sizeâ€¦</option>
              {POO_SIZES.map((s) => <option key={s}>{s}</option>)}
            </Sel>
          </Field>
          <Field label="Colour">
            <Sel value={colour} onChange={(e) => setColour(e.target.value)}>
              <option value="">Colourâ€¦</option>
              {POO_COLOURS.map((c) => <option key={c}>{c}</option>)}
            </Sel>
          </Field>
        </div>
        <Field label="Consistency">
          <Sel value={consistency} onChange={(e) => setConsistency(e.target.value)}>
            <option value="">Consistencyâ€¦</option>
            {POO_CONSISTENCY.map((c) => <option key={c}>{c}</option>)}
          </Sel>
        </Field>
        <Field label="Time">
          <Inp type="datetime-local" value={pooTime} onChange={(e) => setPooTime(e.target.value)} />
        </Field>
        <Field label="Notes">
          <Txt placeholder="Any concerns to noteâ€¦" value={pooNotes} onChange={(e) => setPooNotes(e.target.value)} />
        </Field>
        <AddBtn color={T.poo.base} onClick={addPoo} disabled={saving} label="Log Poo" />
        {poos.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Label>Recent poos</Label>
            {poos.slice(0, 8).map((e) => (
              <EntryCard key={e.id} entry={e} color={T.poo} onDelete={onDelete}
                summary={[e.colour, e.consistency, e.size && `(${e.size})`].filter(Boolean).join(" Â· ") || "Poo logged"} />
            ))}
          </div>
        )}
      </>}

      {tab === "wee" && <>
        {weesToday > 0 && (
          <div style={{ background: T.poo.light, borderRadius: 10, padding: "8px 14px", marginBottom: 14, fontSize: 13, fontWeight: 700, color: T.poo.dark }}>
            ðŸ’§ {weesToday} wee{weesToday !== 1 ? "s" : ""} logged today
          </div>
        )}
        <Field label="Time of wee">
          <Inp type="datetime-local" value={weeTime} onChange={(e) => setWeeTime(e.target.value)} />
        </Field>
        <Field label="Notes (optional)">
          <Txt placeholder="e.g. 'very light', 'normal amount'â€¦" value={weeNotes} onChange={(e) => setWeeNotes(e.target.value)} />
        </Field>
        <AddBtn color={T.poo.base} onClick={addWee} disabled={saving} label="Log Wee" />
        {wees.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Label>Recent wees ({wees.length} total)</Label>
            {wees.slice(0, 10).map((e) => (
              <EntryCard key={e.id} entry={e} color={{ base: "#6B9EC4", light: "#EEF6FF", dark: "#4A7FA8" }} onDelete={onDelete}
                summary={`Wee logged${e.notes ? ` Â· ${e.notes}` : ""}`} />
            ))}
          </div>
        )}
      </>}
    </Section>
  );
}

// â”€â”€â”€ MOOD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MOOD_OPTIONS = ["Very happy ðŸ˜„", "Happy ðŸ˜Š", "Content ðŸ˜Œ", "Unsettled ðŸ˜•", "Fussy ðŸ˜¤", "Crying ðŸ˜­"];
const DAY_PARTS = ["Morning", "Afternoon", "Evening", "Night"];

function MoodSection({ entries, onAdd, onDelete }) {
  const [period, setPeriod] = useState("");
  const [mood, setMood] = useState("");
  const [date, setDate] = useState(nowISO().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!period || !mood) return;
    setSaving(true);
    await onAdd({ id: uid(), type: "mood", timestamp: new Date(date + "T12:00:00").toISOString(), period, mood, notes });
    setPeriod(""); setMood(""); setNotes("");
    setSaving(false);
  };

  return (
    <Section title="Daily Mood" emoji="ðŸŒ¤ï¸" color={T.mood} count={entries.length}>
      <Field label="Date">
        <Inp type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
      <Field label="Time of day">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {DAY_PARTS.map((p) => <Pill key={p} label={p} active={period === p} color={T.mood.base} onClick={() => setPeriod(p)} />)}
        </div>
      </Field>
      <Field label="Mood">
        <Sel value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">Select moodâ€¦</option>
          {MOOD_OPTIONS.map((m) => <option key={m}>{m}</option>)}
        </Sel>
      </Field>
      <Field label="Notes">
        <Txt placeholder="What was going on? Any triggers?" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <AddBtn color={T.mood.base} onClick={add} disabled={saving} />
      {entries.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {entries.slice(0, 10).map((e) => (
            <EntryCard key={e.id} entry={e} color={T.mood} onDelete={onDelete}
              summary={`${e.period}: ${e.mood}`} />
          ))}
        </div>
      )}
    </Section>
  );
}

// â”€â”€â”€ ACTIVITIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ACTIVITY_LIST = ["Tummy time", "Bath time", "Walk / Pram", "Play on mat", "Reading", "Singing / Music", "Sensory play", "Swimming", "Baby massage", "Park visit", "Baby class", "Other"];

function ActivitySection({ entries, onAdd, onDelete }) {
  const [activity, setActivity] = useState("");
  const [custom, setCustom] = useState("");
  const [timestamp, setTimestamp] = useState(toLocal(nowISO()));
  const [durationMins, setDurationMins] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const add = async () => {
    const name = activity === "Other" ? custom : activity;
    if (!name) return;
    setSaving(true);
    await onAdd({ id: uid(), type: "activity", timestamp: fromLocal(timestamp), activity: name, duration_mins: durationMins ? parseInt(durationMins) : null, notes });
    setActivity(""); setCustom(""); setDurationMins(""); setNotes(""); setTimestamp(toLocal(nowISO()));
    setSaving(false);
  };

  return (
    <Section title="Activities" emoji="ðŸŽ¯" color={T.activity} count={entries.length}>
      <Field label="Activity">
        <Sel value={activity} onChange={(e) => setActivity(e.target.value)}>
          <option value="">Choose activityâ€¦</option>
          {ACTIVITY_LIST.map((a) => <option key={a}>{a}</option>)}
        </Sel>
      </Field>
      {activity === "Other" && (
        <Field label="Describe">
          <Inp placeholder="What did you do?" value={custom} onChange={(e) => setCustom(e.target.value)} />
        </Field>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Time">
          <Inp type="datetime-local" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
        </Field>
        <Field label="Duration (mins)">
          <Inp type="number" min="1" placeholder="e.g. 20" value={durationMins} onChange={(e) => setDurationMins(e.target.value)} />
        </Field>
      </div>
      <Field label="Notes">
        <Txt placeholder="How did she respond? Any reactions?" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <AddBtn color={T.activity.base} onClick={add} disabled={saving} />
      {entries.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {entries.slice(0, 10).map((e) => (
            <EntryCard key={e.id} entry={e} color={T.activity} onDelete={onDelete}
              summary={[e.activity, e.duration_mins && `${e.duration_mins} min`].filter(Boolean).join(" Â· ")} />
          ))}
        </div>
      )}
    </Section>
  );
}

// â”€â”€â”€ SLEEP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SLEEP_QUALITY = ["Low", "Medium", "High"];
const qualityColor = { Low: "#E8734A", Medium: "#E8A838", High: "#4A9E8B" };

function SleepSection({ entries, onAdd, onDelete }) {
  const [sleepStart, setSleepStart] = useState(toLocal(nowISO()));
  const [sleepEnd, setSleepEnd] = useState(toLocal(nowISO()));
  const [quality, setQuality] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const calcDur = () => {
    const diff = (new Date(fromLocal(sleepEnd)) - new Date(fromLocal(sleepStart))) / 60000;
    return diff > 0 ? diff : null;
  };

  const add = async () => {
    const dur = calcDur();
    if (!dur) return;
    setSaving(true);
    await onAdd({
      id: uid(), type: "sleep",
      timestamp: fromLocal(sleepStart),
      sleep_start: fromLocal(sleepStart),
      sleep_end
