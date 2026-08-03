import React, { useState, useEffect, useRef } from "react";

const C = {
  bg:      "#0A0A18",
  bgP:     "#12122A",
  bgC:     "#1A1A35",
  gold:    "#C9A84C",
  cream:   "#E8E0D0",
  muted:   "#8A8AA0",
  blue:    "#2C3E6B",
  blueL:   "#4A6090",
  crimson: "#8B1A1A",
  crimsonL:"#C53030",
  green:   "#3A6040",
  greenL:  "#5A8060",
  earth:   "#6B4C2A",
  earthL:  "#8B6A40",
  amber:   "#C17F24",
  amberL:  "#E0A040",
  violet:  "#4A2A6B",
  violetL: "#7A5AAB",
  slate:   "#3A4A5A",
  slateL:  "#6A7A8A",
  border:  "#2A2A45",
  red:     "#8B1A1A",
};

// Wrap a node label across up to 3 lines without dropping words.
// Greedily packs words onto a line until it would exceed maxChars,
// then overflows any remainder onto the last line rather than truncating.
function wrapLabel(label, maxChars = 8, maxLines = 3) {
  const words = (label || "").split(" ").filter(Boolean);
  const lines = [];
  let current = "";
  for (const w of words) {
    const test = current ? current + " " + w : w;
    if (test.length > maxChars && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const head = lines.slice(0, maxLines - 1);
    const tail = lines.slice(maxLines - 1).join(" ");
    return [...head, tail];
  }
  return lines;
}

function cloneData(d) {
  return JSON.parse(JSON.stringify(d));
}

// Immutably find a node by id anywhere in the tree (center, branch, or
// child) and merge `updates` into it. Returns a new data object.
function updateNodeInData(data, id, updates) {
  const next = cloneData(data);
  if (next.center && next.center.id === id) {
    Object.assign(next.center, updates);
    return next;
  }
  for (const br of next.branches) {
    if (br.id === id) {
      Object.assign(br, updates);
      return next;
    }
    if (br.children) {
      for (const ch of br.children) {
        if (ch.id === id) {
          Object.assign(ch, updates);
          return next;
        }
      }
    }
  }
  return next;
}

const NOVEL = {
  center: { id:"c", label:"EX ORIGO", sub:"From the Source" },
  branches: [
    { id:"objects", label:"THE OBJECTS", color:C.amber, icon:"◈",
      detail:"Two primary objects found in the fire-damaged Connemara cottage. Neither appears in any probate or insurance schedule. Both survived the fire.",
      children:[
        { id:"chest", label:"THE CHEST", color:C.amberL, detail:"British Army campaign chest, Boer War era. Carvings inconsistent with any military tradition — San rock art, migration diagrams, Tsodilo spiral motifs. Inventory number matches no War Office series. Was present when Thomas murdered Alderton in the cave. Sent to Connemara as burial of evidence." },
        { id:"cope", label:"THE COPE", color:C.amberL, detail:"Medieval ecclesiastical vestment. Italian silk, Flemish embroidery. Human figures in rows in Passion scenes. Found folded deliberately. Completely inconsistent with a Boer War chest. Provenance: 13th-century Augustinian priory, Var, Provence — 1787 inventory — Revolutionary auction 1793 — Loftus-Burton family — Connemara cottage." },
        { id:"chest5", label:"Five Possible Natures", color:C.earth, detail:"A: Intelligence selecting witnesses 2M years. B: Mnemonic artifact, Thomas last moment. C: Removes barrier to inherited memory. D: Recurring archetypal manifestation. E: Human consciousness — a mirror. SIXTH (true): The organisation most dangerous liability and most reliable asset simultaneously." },
      ]
    },
    { id:"generations", label:"THREE GENERATIONS", color:C.crimson, icon:"⊗",
      detail:"Three generations. Three crimes. The same choice made three times across 120 years. The pattern does not break. It accelerates.",
      children:[
        { id:"thomas", label:"THOMAS LOFTUS-BURTON", color:C.crimsonL, detail:"Gen.1. Escapes Boer POW camp with real James Alderton. Hides for months. Murders Alderton in a cave near Makapan Valley. Walks north along elephant trails 3 years. Arrives Kenya 1906 as Alderton. Marries into Van der Berg family (diamond money). Builds tea plantation. Recruited by the organisation. Dies as James Alderton." },
        { id:"doyle", label:"PATRICK DOYLE", color:C.crimsonL, detail:"Gen.2. Insurance assessor, Galway. James Alderton direct descendant. Organisation operative sent to retrieve the chest and cope. The professional breach was always the mission. Causes deaths across Ireland, Italy, France through operational reports. Dies in the Connemara cottage back room." },
        { id:"michael", label:"MICHAEL DOYLE", color:C.crimsonL, detail:"Gen.3. ADOPTED. Organisation-placed. Told what he was leaving boarding school. Loves Doyle genuinely. Summoned from Florence dinner by the organisation. Already in the cottage before Doyle arrives. Steps out of shadows in Ch.27. Kills Browne. Assumes control. Walks out with the chest and cope. His line: NOW IT IS MINE." },
      ]
    },
    { id:"characters", label:"CHARACTERS", color:C.blue, icon:"◉",
      detail:"Complete character register. Every character carries both a surface function and a true function visible only after CONFESSIO.",
      children:[
        { id:"browne", label:"WILLIE BROWNE", color:C.blueL, detail:"The true investigator. Sleeper operative inside the organisation for thirty years. Knows the full truth: the founding murder, organisation structure, Doyle bloodline, Michael placement. His miscalculation: underestimated how much the organisation trusted Michael. Kills Doyle in self-defence. Killed by Michael. Chapter: CONFESSIO." },
        { id:"edward", label:"EDWARD ALDERTON", color:C.blueL, detail:"Thomas great-grandson. Chelsea and Geneva. Manages Alderton Family Office SA. Told the full truth at age 42. Discovers Doyle bloodline approximately three weeks before the Connemara confrontation." },
        { id:"sheehy", label:"DR COLMAN SHEEHY", color:C.blueL, detail:"National Museum of Ireland. Connected to Browne network. SURFACE: Helpful archivist. TRUE: Operational contact. His back room invitation was planned. Working name." },
        { id:"nif", label:"DR AINE NI FHAOLAIN", color:C.blueL, detail:"National Library of Ireland. Manuscript specialist. The most honest character in the novel. When Doyle asks if what he found could be what he thinks: I do not know, but I do not think you are wrong. Working name." },
      ]
    },
    { id:"organisation", label:"THE ORGANISATION", color:C.crimson, icon:"◎",
      detail:"Recruited Thomas in Kenya after the murder. Operates for over a century through legitimate corporate and financial structures. Not ideological — interested in leverage. Never named in the novel.",
      children:[
        { id:"org-origin", label:"Origin", color:C.crimsonL, detail:"Representatives visited Thomas in Kenya years after the murder. They knew about the cave. Offered protection in exchange for becoming a conduit. The Kenya plantation processed certain things beyond tea. The arrangement persists across generations to Edward Alderton today." },
        { id:"org-fortune", label:"The Fortune", color:C.crimsonL, detail:"Tea plantation plus compounded Van der Berg De Beers diamond investment returns plus European property = Alderton Family Office SA, Geneva. Liechtenstein Anstalt — Luxembourg SICAV — Cayman Islands — operating companies. Properties: Chelsea, Fiesole (Thomas African journals), Cascais, Paris 16th, Domaine de la Valdonne Provence." },
        { id:"org-domaine", label:"Domaine de la Valdonne", color:C.crimsonL, detail:"Near Barjols, Var, Provence. FICTIONAL. 165 hectares, 18th-century mas, vineyard, olive grove, ornamental lake. Ruins of a 13th-century Augustinian priory on the northeastern edge — the priory from which the cope originated. Edward Alderton owns the cope provenance ground." },
        { id:"org-apex", label:"The Apex Individual", color:C.red, detail:"HELD. The most prominent person currently controlling the organisation. The name Browne gives Doyle in CONFESSIO. Is this someone the reader has already encountered under a different description? TO BE REVEALED." },
      ]
    },
    { id:"locations", label:"LOCATIONS", color:C.green, icon:"◈",
      detail:"Eight primary locations across four countries plus the deep time sites. Each has a surface function in Doyle investigation and a true function in organisation operations.",
      children:[
        { id:"ireland", label:"IRELAND", color:C.greenL, detail:"Connemara: the fire-damaged cottage, the back room the fire did not reach. Ballynahinch Castle, Recess: the Ranji Room, Owenmore Restaurant, Humanity Dick plaque, Thomas Martin Room. National Museum Kildare Street: Faddan More Psalter, Embroidered Cope, Egyptian false door. National Library: estate papers, the letter in the wrong hand." },
        { id:"italy", label:"ITALY", color:C.greenL, detail:"Florence: Uffizi, Ponte Vecchio after 10pm, Piazzale degli Uffizi (the old man, click consonants). Brindisi: Colonne del Porto, Diocesan Museum (skull reliquaries, Frederick II parchment). Lecce: Piazza Sant Oronzo and donated Roman column, Santa Croce grotesque facade. Gallipoli: Confraternita della Buona Morte. Matera: Sassi 9000 years." },
        { id:"france", label:"FRANCE PROVENCE", color:C.greenL, detail:"Draguignan: Archives departementales du Var — the Valdonne priory inventory of 1787, the cope listed. Barjols: medieval tanning vats, the Argens river, oak gall ink connection. The road to the Domaine de la Valdonne: PROPRIETE PRIVEE. The estate manager. The African landscape oils. Thomas photograph on the side table. Aix-en-Provence: where Doyle reads of the archivist death. Twice." },
        { id:"kenya", label:"KENYA", color:C.greenL, detail:"Kericho highlands: the tea plantation, the Kericho Tea Hotel colonial period, the Mau Escarpment behind the old man in Thomas photograph. Grace Alderton-Kamau domain. The place where Thomas escape ended and his other life began." },
        { id:"safrica", label:"SOUTH AFRICA THE CAVE", color:C.greenL, detail:"Makapan Valley, Limpopo Province. Where Thomas and Alderton hid for months after escaping the Boer POW camp. The founding crime scene. The chest was present. Chapter: CAEDES. Site visit required before drafting this chapter." },
      ]
    },
    { id:"chapters", label:"LATIN CHAPTERS", color:C.earth, icon:"I",
      detail:"29 chapters, each with a Latin title carrying two simultaneous meanings: the surface reading (what the reader believes) and the true reading (what is actually happening).",
      children:[
        { id:"act1c", label:"ACT I: CUSTOS to TABULA", color:C.earthL, detail:"Ch.0 CUSTOS (Guardian): reconnaissance at the National Museum. Ch.1 INVENTIO (Discovery): the cottage, mission confirmed. Ch.2 CONVIVIUM (A Feast): Ballynahinch intelligence lunch. Ch.3 FILIUS (Son): Thomas departing for the Boer War. Ch.4 VIGIL (Watcher): Browne as sleeper operative. Ch.5 TABULA (Record): War Office list — clean, as the organisation arranged." },
        { id:"act2c", label:"ACT II: FUNDUS to PYTHIA", color:C.earthL, detail:"Ch.6 FUNDUS to Ch.21 PYTHIA. Spanning Dublin Airport (ITER), Florence with Michael (PICTURA, DIMISSIO), the Uffizi encounter (NOCTUA), Thomas in the field (PROFECTIO, CAEDES), Puglia (TERMINUS, LAPIDES, CONFRATERNITAS, SPELUNCA), deep time sequences (MEMORIA, VECTIGAL), and the Tsodilo ritual (PYTHIA)." },
        { id:"act3c", label:"ACT III: VULNUS to CINIS", color:C.crimson, detail:"Ch.22 VULNUS (Wound): the operational fracture. Ch.23 EPISTOLA (Letter): Dr Ni Fhaolain discovery. Ch.24 ULTIMA VERBA (Last Words): Thomas unsent letter ends mid-sentence. Ch.25 ORBIS (Circle): the carvings as celestial geometry. Ch.26 OSTIUM FALSUM (False Door): the National Museum, Edward Alderton present. Ch.27 CONFESSIO: Browne reveals all. Doyle dies. Michael steps out. Ch.28 CINIS: Ash. The end." },
      ]
    },
    { id:"threads", label:"SEVEN THREADS", color:C.violet, icon:"≋",
      detail:"Seven narrative threads, each with its own register, timeline, and function. No thread explains itself. Meaning accumulates through proximity and contrast.",
      children:[
        { id:"t1", label:"Present Day Ireland and Italy", color:C.violetL, detail:"Doyle investigation (cover) and mission (true). Galway, Connemara, Dublin, Ballynahinch, Florence, Puglia, Provence. The primary thread. Banville register in Act I, darkening through Act II, Le Carre in Act III." },
        { id:"t2", label:"Historical Boer War", color:C.violetL, detail:"Thomas Loftus-Burton, 1899-1902. Dublin departure, Boer War, POW camp escape, months in hiding, the cave murder, the elephant trail north. Two dedicated war chapters on the moral ambiguity of the 1901-02 campaign." },
        { id:"t3", label:"Deep Prehistory", color:C.violetL, detail:"Makapan Valley, 2-3 million years ago. Australopithecus africanus. The first ochre. The first abstraction. The first burial. McCarthy register: elemental, wordless. The player reader has no agency — they can only observe." },
        { id:"t4", label:"Trade Routes 600-1500", color:C.violetL, detail:"The chest precursor on Swahili coast routes. Blue-green beads Kilwa or Chinese origin. Ivory token. The carvings already present before European contact. Does not reach the coast — turns back into the interior." },
        { id:"t5", label:"Mythic Tsodilo Hills", color:C.violetL, detail:"The Tsodilo Hills, Botswana. UNESCO World Heritage. The Python Cave: 70000-year-old ritual space, spiral carvings. The chest in an older manifestation. Written from inside the ceremony — meaning felt without being explained." },
        { id:"t6", label:"Italian Thread", color:C.violetL, detail:"Florence and Puglia. The cope ecclesiastical provenance assembles through Brindisi, Lecce, Gallipoli, Matera. Doyle mission continuing under cultural cover. Michael in Florence watching his father work. The old man in the Piazzale degli Uffizi." },
        { id:"t7", label:"Colonial History", color:C.violetL, detail:"The diamond fields, Kenyan land seizure, Van der Berg family, the Alderton fortune. Empire logic applied personally by Thomas. Doyle — Alderton descendant — serving the organisation built on his ancestor murder. Michael inheriting the organisation. Empire reproducing itself." },
      ]
    },
    { id:"openq", label:"OPEN QUESTIONS", color:C.amber, icon:"▶",
      detail:"Decisions deferred. The novel can be drafted in parallel with resolving them, but the corresponding chapters cannot be finalised until each answer is confirmed.",
      children:[
        { id:"oq1", label:"Michael University Subject", color:C.amberL, detail:"URGENT. Must have a plausible Renaissance history component requiring primary source research in Florence. Law, history, art history, architecture are all plausible. Fix before Florence chapters drafted." },
        { id:"oq2", label:"Browne Allegiance", color:C.amberL, detail:"Intelligence agency deep cover? Lone operator who connected with the African protective faction? The African protective faction from the start? Determines operational resources and the nature of his files." },
        { id:"oq3", label:"The Apex Individual", color:C.red, detail:"HELD. The most prominent person controlling the organisation. The name Browne gives Doyle in CONFESSIO. Is this someone the reader has already encountered under a different description? TO BE REVEALED." },
        { id:"oq4", label:"Thomas at Makapan", color:C.amberL, detail:"The author must know before CAEDES is drafted. Three options: A encounters something non-human. B psychological event of extreme intensity near fossil sites. C exchanges one object for another and does not understand what he has done." },
        { id:"oq5", label:"The Uffizi Old Man", color:C.amberL, detail:"Confirmed as representative of African protective faction who recognises Doyle as an operative and delivers a warning. What exactly did he say in Khoisan? Does Doyle ever establish the full meaning? Fix before Chapter 10 NOCTUA." },
        { id:"oq6", label:"Michael Line", color:C.amberL, detail:"Working: NOW IT IS MINE. Three words. Confirm or replace before CONFESSIO drafted." },
      ]
    },
  ]
};

const GAME = {
  center: { id:"gc", label:"EX ORIGO", sub:"The Investigator Journey" },
  branches: [
    { id:"mechanics", label:"CORE MECHANICS", color:C.blue, icon:"⚙",
      detail:"No combat. No death states. No fail conditions. The mechanic is the assessor eye: the trained capacity to notice what does not fit, evaluate what is selectively true, and decide what to record and what to withhold.",
      children:[
        { id:"assessment", label:"The Assessment Tool", color:C.blueL, detail:"Doyle professional tablet interface. Photograph rooms, tag objects, record condition and value. The first action is the assessment of the fire-damaged cottage. The game rewards the irrational choice: take the chest without logging it, discover more." },
        { id:"notebook", label:"The Notebook", color:C.blueL, detail:"A physical notebook digitally rendered. Entries can be linked, annotated, revised. The blood connection reveal happens here: the player makes the connection themselves from two entries recorded weeks of game-time apart." },
        { id:"dialogue", label:"Dialogue Assessment", color:C.blueL, detail:"Conversations are not choice trees. The player evaluates: CONFIRMED, UNVERIFIED, MISLEADING, or WITHHELD. Each character builds a reliability profile. Browne profile after the Ballynahinch lunch: accurate on family history, selective on estate timeline, withheld on employer identity." },
        { id:"surveillance", label:"Surveillance Awareness", color:C.blueL, detail:"Invisible as a meter but present as atmosphere. Certain actions increase monitoring intensity. The attentive player notices: the same car in two locations, the same figure in two different cities. The game never confirms the surveillance." },
      ]
    },
    { id:"evidence", label:"EVIDENCE ECOSYSTEM", color:C.amber, icon:"◈",
      detail:"Five types of evidence. Three unlock depths. The game rewards every form of serious engagement with the historical material regardless of geography or economic means.",
      children:[
        { id:"ev1", label:"Type 1: Virtual Gameplay", color:C.amberL, detail:"Standard discoveries through the game 3D environments. Completing each chapter location unlocks the corresponding evidence layer. Unlock depth: STANDARD." },
        { id:"ev2", label:"Type 2: Timestamped Photo", color:C.amberL, detail:"Visit a real-world location and photograph the specific target through the companion app. GPS, timestamp, and image match verified automatically. No institutional agreement required. Unlock depth: DEEP." },
        { id:"ev3", label:"Type 3: Documentary Evidence", color:C.amberL, detail:"Photograph real-world reference material: books, museum catalogues, brochures, archive documents. App image recognition identifies qualifying content. Unlock depth: STANDARD to DEEP." },
        { id:"ev4", label:"Type 4: Research Evidence", color:C.amberL, detail:"MOOC completion certificate. Wikipedia article created or improved. Library borrowing record. Academic essay submission. Podcast completion. Quiz 80 percent or above on advanced historical quiz. Unlock depth: DEEP to MAXIMUM." },
        { id:"ev5", label:"Type 5: Cultural Attendance", color:C.amberL, detail:"Ticket to any qualifying museum, heritage site, lecture, film, or theatre. Any national museum with African, medieval European, or Irish prehistoric holdings. Any Boer War site. Unlock depth: DEEP." },
      ]
    },
    { id:"itineraries", label:"FIVE ITINERARIES", color:C.green, icon:"◈",
      detail:"Five physical itineraries, each complete in itself. The home player who never travels experiences a full virtual investigation. Complete all five within twelve months to unlock the Master Archive.",
      children:[
        { id:"it1", label:"The Irish Journey", color:C.greenL, detail:"3-5 DAYS. IRELAND ONLY. Dublin: National Museum, National Library. Galway: Doyle professional world. Connemara: Ballynahinch Castle, bog road toward the Twelve Bens. Unlocks: Browne internal monologue, Dr Sheehy private cope assessment, Loftus-Burton family tree, Rungs 1-4." },
        { id:"it2", label:"The Italian Thread", color:C.greenL, detail:"5-7 DAYS. ITALY. Florence, Brindisi, Lecce, Gallipoli, Matera. Unlocks: surveillance team Florence report, old man statement with translation, cope ecclesiastical provenance, Rungs 5-8." },
        { id:"it3", label:"The Provence Investigation", color:C.greenL, detail:"3-4 DAYS. FRANCE. Draguignan, Barjols, Brignoles, Aix-en-Provence. DRIVING ITINERARY. Unlocks: full priory inventory including hidden second page, Edward Alderton suppressed research, cope complete provenance chain." },
        { id:"it4", label:"Full European Arc", color:C.greenL, detail:"12-14 DAYS. IRELAND plus ITALY plus FRANCE. All Itineraries 1-3 in sequence within six months. Unlocks: MASTER ARCHIVE — complete casefile, all suppressed documents, all faction communications, full Thomas journals." },
        { id:"it5", label:"The Deep Journey Kenya", color:C.greenL, detail:"5-7 DAYS. KENYA. Nairobi, Kericho, the Mau Escarpment. The app overlays the old man image against the player photograph of the same hills. The match is visual and immediate. Thomas was here. Unlocks: final pages of Thomas African journals." },
      ]
    },
    { id:"reversal", label:"THE GREAT REVERSAL", color:C.crimson, icon:"⊗",
      detail:"The game central structural achievement: the player has been the antagonist for 27 chapters without knowing it. The most sophisticated unreliable narrator mechanic ever built into a transmedia property.",
      children:[
        { id:"rev1", label:"The Player Was Doyle", color:C.crimsonL, detail:"For 27 chapters, the player inhabited Doyle. They filed the reports. They took the chest without recording it. They caused the deaths. Every discovery they believed they were making was a mission they were completing." },
        { id:"rev2", label:"Chapter 27 CONFESSIO", color:C.crimsonL, detail:"THE PERSPECTIVE SHIFT. The player is no longer Doyle. They are in the shadows of the Connemara cottage. They are Michael. They watch the confrontation. They see every choice they made as Doyle from the outside." },
        { id:"rev3", label:"Chapter 28 CINIS", color:C.crimsonL, detail:"THE PLAYER DECISION. As Michael: step forward or let Browne walk. Whatever the player chooses, CINIS closes the same way. The wind. The ash. The room is the same room. The player is the last witness." },
      ]
    },
    { id:"levels", label:"29 LEVELS", color:C.earth, icon:"I",
      detail:"29 levels mapping directly to the novel 29 chapters. Same Latin titles. Same dual meaning — the player discovers the true reading in Level 27 CONFESSIO when the perspective shifts from Doyle to Michael.",
      children:[
        { id:"lev1", label:"Act I: Levels 0-5", color:C.earthL, detail:"CUSTOS through TABULA. Reconnaissance, assessment, Ballynahinch lunch, oral history, War Office documentation. The player files reports they do not know are operational." },
        { id:"lev2", label:"Act II: Levels 6-21", color:C.earthL, detail:"FUNDUS through PYTHIA. Dublin Airport, Florence with Michael, the Uffizi encounter, extension south through Puglia, the Provence archives. Evidence ecosystem fully active. The deaths accumulate." },
        { id:"lev3", label:"Level 27 CONFESSIO", color:C.crimson, detail:"THE PERSPECTIVE SHIFT. The player is no longer Doyle. They are in the shadows. They are Michael. They watch the confrontation. They see every choice they made from the outside. Then they must decide." },
      ]
    },
    { id:"pitch", label:"TRANSMEDIA PITCH", color:C.slate, icon:"◎",
      detail:"EX ORIGO as a pitch-ready entertainment property: literary novel plus narrative game plus travel experience plus educational platform. Four products sharing one story engine.",
      children:[
        { id:"p1", label:"Literary Agent Pitch", color:C.slateL, detail:"A debut literary novel with a built-in global audience development mechanism. Not just a novel — a property. Five itineraries, eight locations, an evidence ecosystem serving players on three continents, an educational platform, and a story that sustains adaptation in every direction." },
        { id:"p2", label:"Game Studio Pitch", color:C.slateL, detail:"A narrative investigation game with real-world location partnerships. Closest comparables: Return of the Obra Dinn (investigative mechanic), Disco Elysium (literary ambition, Metacritic 97), Heaven Vault (archaeological decipherment). EX ORIGO goes further: real-world locations, real historical evidence." },
        { id:"p3", label:"Tourism and Heritage Pitch", color:C.slateL, detail:"Target partners: Failte Ireland, Puglia and Basilicata regional tourism boards, Atout France and Var department, Kenya Tourism Board. Co-funding: European Cultural Heritage Fund, Creative Europe, national arts councils across Ireland, Italy, France." },
        { id:"p4", label:"Educational Platform Pitch", color:C.slateL, detail:"A research evidence platform that makes historical engagement a game action. The student who submits a library research record on the Boer War earns the same discovery as the traveller who photographs the Kimberley Mine Museum." },
      ]
    },
    { id:"comparables", label:"COMPARABLE GAMES", color:C.slate, icon:"≈",
      detail:"EX ORIGO is genuinely without direct precedent. Individual elements exist elsewhere. No existing product combines all five defining attributes simultaneously.",
      children:[
        { id:"comp1", label:"Return of the Obra Dinn", color:C.slateL, detail:"Closest single-game analogue. Insurance investigator protagonist. Documentary reconstruction mechanic. No combat. The notebook as primary interface. DIFFERENCE: Entirely virtual and self-contained. EX ORIGO spans eight real-world countries." },
        { id:"comp2", label:"Disco Elysium", color:C.slateL, detail:"Proof of concept: literary fiction of genuine quality can succeed commercially in game form (Metacritic 97). DIFFERENCE: Entirely fictional world. EX ORIGO is grounded in verifiable historical reality." },
        { id:"comp3", label:"Heaven Vault", color:C.slateL, detail:"Archaeological decipherment as core mechanic. Patient, contemplative pacing. DIFFERENCE: Fictional science-fiction universe. EX ORIGO carvings are real." },
        { id:"comp4", label:"80 Days", color:C.slateL, detail:"Multiple travel routes through real-world cities. Colonial history as active moral terrain. DIFFERENCE: Entirely virtual. No investigative mechanic. No educational platform dimension." },
      ]
    },
  ]
};

function Detail({ node, onSelect, onClose, editMode, onUpdateNode }) {
  if (!node) return null;
  const inputStyle = {
    width:"100%", background:C.bg, color:C.cream,
    border:"1px solid "+C.gold, borderRadius:2,
    fontFamily:"inherit", padding:"6px 8px", boxSizing:"border-box",
  };
  return (
    <div style={{
      position:"fixed", right:0, top:0, bottom:0, width:"min(400px,100vw)",
      background:C.bgP, borderLeft:"1px solid "+C.border,
      zIndex:100, overflowY:"auto", padding:"24px 20px",
      boxShadow:"-6px 0 32px rgba(0,0,0,0.7)",
      fontFamily:"Courier New, monospace",
    }}>
      <button onClick={onClose} style={{
        position:"absolute", top:12, right:12,
        background:"none", border:"1px solid "+C.border,
        color:C.muted, cursor:"pointer", padding:"3px 8px",
        fontSize:11, fontFamily:"inherit", borderRadius:2,
      }}>x CLOSE</button>

      <div style={{ fontSize:8, letterSpacing:3, color:C.muted, marginBottom:6, textTransform:"uppercase" }}>
        EX ORIGO NODE DETAIL {editMode && "— EDITING"}
      </div>

      {editMode ? (
        <input
          value={node.label}
          onChange={e => onUpdateNode(node.id, { label:e.target.value })}
          style={{
            ...inputStyle, fontSize:15, fontWeight:"bold",
            color:node.color || C.gold, letterSpacing:1, marginBottom:12,
            fontFamily:"Georgia, serif",
          }}
        />
      ) : (
        <div style={{
          fontSize:15, fontWeight:"bold", color:node.color || C.gold,
          letterSpacing:2, marginBottom:12, lineHeight:1.3,
          fontFamily:"Georgia, serif",
        }}>{node.label}</div>
      )}

      <div style={{ height:1, background:C.border, marginBottom:12 }}/>

      {editMode ? (
        <textarea
          value={node.detail || ""}
          onChange={e => onUpdateNode(node.id, { detail:e.target.value })}
          rows={8}
          style={{ ...inputStyle, fontSize:11, lineHeight:1.6, resize:"vertical" }}
        />
      ) : (
        <div style={{ fontSize:11, color:C.cream, lineHeight:1.8 }}>
          {node.detail || "Detail forthcoming."}
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <div>
          <div style={{ height:1, background:C.border, margin:"16px 0 10px" }}/>
          <div style={{ fontSize:8, letterSpacing:2, color:C.muted, marginBottom:8, textTransform:"uppercase" }}>
            SUB-NODES ({node.children.length}) - CLICK TO NAVIGATE
          </div>
          {node.children.map(ch => (
            <div key={ch.id} onClick={() => onSelect(ch)} style={{
              padding:"8px 10px", marginBottom:5,
              background:C.bgC,
              borderLeft:"3px solid "+(ch.color || C.gold),
              border:"1px solid "+C.border,
              borderRadius:2, cursor:"pointer",
            }}>
              <span style={{ color:ch.color || C.gold, fontWeight:"bold", fontSize:9, letterSpacing:1 }}>
                &gt; {ch.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RadialMap({ data, selected, onSelect, editMode, onUpdateNode, onToggleEdit, onReset }) {
  const ref = useRef(null);
  const wrapRef = useRef(null);
  const [dim, setDim] = useState({ w:900, h:700 });
  const [hovered, setHovered] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x:0, y:0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x:0, y:0, panX:0, panY:0 });
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const upd = () => {
      if (ref.current && ref.current.parentElement) {
        setDim({
          w: ref.current.parentElement.offsetWidth,
          h: ref.current.parentElement.offsetHeight
        });
      }
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Wheel-to-zoom, non-passive so preventDefault actually stops page scroll
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = e => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(z => Math.min(2.5, Math.max(0.5, +(z + delta).toFixed(2))));
    };
    el.addEventListener("wheel", onWheel, { passive:false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Drag-to-pan (mouse down on empty map background, not on a node)
  useEffect(() => {
    const onMove = e => {
      if (!dragging.current) return;
      setPan({
        x: dragStart.current.panX + (e.clientX - dragStart.current.x),
        y: dragStart.current.panY + (e.clientY - dragStart.current.y),
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const startPan = e => {
    dragging.current = true;
    dragStart.current = { x:e.clientX, y:e.clientY, panX:pan.x, panY:pan.y };
  };

  const resetView = () => { setZoom(1); setPan({ x:0, y:0 }); };

  const startEdit = (node, e) => {
    if (e) e.stopPropagation();
    setEditingId(node.id);
    setDraft(node.label);
  };
  const commitEdit = () => {
    if (editingId && draft.trim()) onUpdateNode(editingId, { label: draft.trim() });
    setEditingId(null);
  };

  const cx = dim.w / 2;
  const cy = dim.h / 2;
  // Branch nodes sit at inner ring
  const R1 = Math.min(cx, cy) * 0.38;
  // Child nodes sit on two staggered outer radii - crowded branches
  // (5+ children) alternate near/far so nodes don't pack onto one ring
  const R2a = Math.min(cx, cy) * 0.66;
  const R2b = Math.min(cx, cy) * 0.88;
  const BNR = 28; // branch node radius
  const CNR = 15; // child node radius

  // Give each branch an angular SECTOR proportional to its own child
  // count, packed sequentially around the circle. This guarantees - by
  // construction, not by a tuned constant - that one branch's children
  // can never bleed into a neighbouring branch's sector, regardless of
  // how many children either branch has.
  const totalWeight = data.branches.reduce(
    (s, br) => s + Math.max((br.children || []).length, 1), 0
  );
  let cum = -Math.PI / 2;
  const layout = data.branches.map(br => {
    const weight = Math.max((br.children || []).length, 1);
    const sectorWidth = (weight / totalWeight) * 2 * Math.PI;
    const angle = cum + sectorWidth / 2;
    cum += sectorWidth;
    return { br, angle, sectorWidth };
  });

  return (
    <div
      ref={wrapRef}
      onMouseDown={e => { if (e.target === ref.current) startPan(e); }}
      style={{
        width:"100%", height:"100%", overflow:"hidden", position:"relative",
        cursor: dragging.current ? "grabbing" : "grab",
      }}
    >
      <svg
        ref={ref}
        width={dim.w}
        height={dim.h}
        onMouseDown={startPan}
        style={{
          display:"block",
          transform:`translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin:"center center",
        }}
      >
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <style>{`
          @keyframes breathe { 0%,100%{r:38px} 50%{r:44px} }
          .cpulse { animation: breathe 4s ease-in-out infinite; }
        `}</style>
      </defs>

      {layout.map(({ br, angle: brAngle, sectorWidth }) => {
        const bx = cx + R1 * Math.cos(brAngle);
        const by = cy + R1 * Math.sin(brAngle);
        const isSel = selected && selected.id === br.id;
        const isHov = hovered === br.id;
        const nodeR = isSel ? BNR + 12 : isHov ? BNR + 5 : BNR;

        // Children stay within 65% of the branch's own sector half-width,
        // leaving a guaranteed buffer to the neighbouring branch on
        // both sides no matter how the child counts are distributed.
        const children = br.children || [];
        const fanSpread = children.length > 1 ? (sectorWidth / 2) * 0.65 : 0;

        return (
          <g key={br.id}>
            {/* Centre to branch line */}
            <line
              x1={cx} y1={cy} x2={bx} y2={by}
              stroke={br.color}
              strokeWidth={isSel ? 2 : 1}
              strokeOpacity={isSel ? 0.7 : 0.35}
              strokeDasharray="5 3"
            />

            {/* Child nodes with their own branch sticks */}
            {children.map((ch, j) => {
              const total = children.length;
              const offset = total > 1
                ? -fanSpread + (j / (total - 1)) * fanSpread * 2
                : 0;
              const chAngle = brAngle + offset;
              // Crowded branches (5+) alternate between the near and far
              // ring so adjacent nodes aren't fighting for the same arc
              const chR = (total > 4 && j % 2 === 1) ? R2b : R2a;
              const chx = cx + chR * Math.cos(chAngle);
              const chy = cy + chR * Math.sin(chAngle);
              const chSel = selected && selected.id === ch.id;
              const chLines = wrapLabel(ch.label);
              const longest = Math.max(...chLines.map(l => l.length));
              const chFontSize = longest > 8 ? Math.max(4.5, 6 - (longest - 8) * 0.35) : 6;

              return (
                <g key={ch.id}>
                  {/* Branch to child stick */}
                  <line
                    x1={bx} y1={by}
                    x2={chx} y2={chy}
                    stroke={ch.color || br.color}
                    strokeWidth={chSel ? 1.5 : 0.8}
                    strokeOpacity={chSel ? 0.8 : 0.45}
                  />
                  {/* Child node circle */}
                  <g
                    onClick={e => { e.stopPropagation(); onSelect(ch); }}
                    onDoubleClick={e => editMode && startEdit(ch, e)}
                    style={{ cursor: editMode ? "text" : "pointer" }}
                  >
                    <circle
                      cx={chx} cy={chy}
                      r={chSel ? CNR + 5 : CNR}
                      fill={chSel ? (ch.color || br.color) : C.bgC}
                      stroke={ch.color || br.color}
                      strokeWidth={chSel ? 2 : 1}
                    />
                    {editingId === ch.id ? (
                      <foreignObject x={chx - 45} y={chy - 10} width={90} height={22}>
                        <input
                          autoFocus
                          value={draft}
                          onChange={e => setDraft(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingId(null); }}
                          style={{
                            width:"100%", fontSize:9, textAlign:"center",
                            background:C.bg, color:C.cream,
                            border:"1px solid "+C.gold, borderRadius:2,
                            fontFamily:"Courier New, monospace",
                          }}
                        />
                      </foreignObject>
                    ) : (
                      /* Child label - wraps up to 3 lines, no words dropped,
                         font shrinks a little if the longest line is wide */
                      chLines.map((line, li, arr) => (
                        <text
                          key={li}
                          x={chx}
                          y={chy + (li - (arr.length - 1) / 2) * 8}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={chSel ? "#fff" : (ch.color || br.color)}
                          fontSize={chFontSize}
                          fontFamily="Courier New, monospace"
                          fontWeight="bold"
                        >
                          {line}
                        </text>
                      ))
                    )}
                  </g>
                </g>
              );
            })}

            {/* Branch node */}
            <g
              onClick={() => onSelect(br)}
              onDoubleClick={e => editMode && startEdit(br, e)}
              onMouseEnter={() => setHovered(br.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: editMode ? "text" : "pointer" }}
            >
              <circle
                cx={bx} cy={by}
                r={nodeR + 8}
                fill={br.color}
                fillOpacity={isSel ? 0.3 : isHov ? 0.15 : 0.07}
              />
              <circle
                cx={bx} cy={by}
                r={nodeR}
                fill={isSel ? br.color : isHov ? C.bgP : C.bgC}
                stroke={br.color}
                strokeWidth={isSel ? 3 : 1.5}
                filter={isSel ? "url(#glow)" : "none"}
              />
              {editingId === br.id ? (
                <foreignObject x={bx - 55} y={by - 11} width={110} height={24}>
                  <input
                    autoFocus
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingId(null); }}
                    style={{
                      width:"100%", fontSize:10, textAlign:"center",
                      background:C.bg, color:C.cream,
                      border:"1px solid "+C.gold, borderRadius:2,
                      fontFamily:"Courier New, monospace",
                    }}
                  />
                </foreignObject>
              ) : (
                <>
                  <text
                    x={bx} y={by - 6}
                    textAnchor="middle"
                    fill={isSel ? "#fff" : br.color}
                    fontSize={isSel ? 17 : 14}
                    fontFamily="Georgia, serif"
                  >
                    {br.icon}
                  </text>
                  {br.label.split(" ").map((w, wi) => (
                    <text
                      key={wi}
                      x={bx} y={by + 5 + wi * 9}
                      textAnchor="middle"
                      fill={isSel ? "#fff" : C.cream}
                      fontSize={isSel ? 7.5 : 6.5}
                      letterSpacing={0.8}
                      fontFamily="Courier New, monospace"
                      fontWeight="bold"
                    >
                      {w}
                    </text>
                  ))}
                </>
              )}
              {isSel && (
                <circle
                  cx={bx} cy={by}
                  r={nodeR + 16}
                  fill="none"
                  stroke={br.color}
                  strokeWidth={0.8}
                  strokeOpacity={0.4}
                  strokeDasharray="3 5"
                />
              )}
            </g>
          </g>
        );
      })}

      {/* Central node */}
      <g onClick={() => onSelect(data.center)} style={{ cursor:"pointer" }}>
        <circle cx={cx} cy={cy} r={75} fill="url(#cg)"/>
        <circle cx={cx} cy={cy} r={36} className="cpulse"
          fill={C.bg} stroke={C.gold} strokeWidth={2}/>
        <circle cx={cx} cy={cy} r={33}
          fill="none" stroke={C.gold} strokeWidth={0.8} strokeDasharray="3 2"/>
        <text x={cx} y={cy - 4} textAnchor="middle"
          fill={C.gold} fontSize={11} letterSpacing={3.5}
          fontFamily="Georgia, serif" fontWeight="bold">EX ORIGO</text>
        <text x={cx} y={cy + 10} textAnchor="middle"
          fill={C.muted} fontSize={6.5} letterSpacing={1.5}
          fontFamily="Courier New, monospace">{data.center.sub}</text>
      </g>
      </svg>

      {/* Map controls - top-left, deliberately clear of the sidebar
          (which is fixed top:0 to bottom:0 on the right and was hiding
          these when they lived in the header or bottom-right) */}
      <div style={{
        position:"absolute", left:12, top:12, display:"flex",
        flexDirection:"column", gap:6, zIndex:5,
      }}>
        <div style={{ display:"flex", gap:4 }}>
          <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)))}
            style={zoomBtnStyle}>-</button>
          <button onClick={resetView} style={{ ...zoomBtnStyle, width:44, fontSize:8 }}>
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={() => setZoom(z => Math.min(2.5, +(z + 0.15).toFixed(2)))}
            style={zoomBtnStyle}>+</button>
        </div>

        <button onClick={onToggleEdit} style={{
          padding:"6px 10px", border:"1px solid "+(editMode ? C.gold : C.border),
          borderRadius:3, background: editMode ? C.gold : C.bgP,
          color: editMode ? C.bg : C.cream, cursor:"pointer",
          fontSize:9, letterSpacing:1, fontWeight:"bold",
          fontFamily:"Courier New, monospace", textTransform:"uppercase",
        }}>
          {editMode ? "Editing: ON" : "Edit Mode"}
        </button>

        {editMode && (
          <>
            <button onClick={onReset} style={{
              padding:"5px 10px", border:"1px solid "+C.border, borderRadius:3,
              background:C.bgP, color:C.muted, cursor:"pointer",
              fontSize:8, letterSpacing:1, fontFamily:"Courier New, monospace",
            }}>
              Reset this map
            </button>
            <div style={{
              fontSize:8, letterSpacing:0.5, color:C.gold, background:C.bgP,
              border:"1px solid "+C.gold, borderRadius:2, padding:"4px 8px",
              maxWidth:150, lineHeight:1.4,
            }}>
              Double-click any node to rename, or edit in the sidebar
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const zoomBtnStyle = {
  width:26, height:26, background:C.bgP, border:"1px solid "+C.border,
  color:C.cream, fontSize:14, cursor:"pointer", borderRadius:3,
  fontFamily:"Courier New, monospace", lineHeight:1,
};

function HierMap({ data, selected, onSelect }) {
  const [exp, setExp] = useState({});
  const tog = id => setExp(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{ padding:"12px", overflowY:"auto", height:"100%" }}>
      <div onClick={() => onSelect(data.center)} style={{
        background:C.bgC, border:"2px solid "+C.gold,
        borderRadius:4, padding:"12px", marginBottom:12,
        cursor:"pointer", textAlign:"center",
      }}>
        <div style={{ fontSize:16, letterSpacing:4, color:C.gold, fontFamily:"Georgia, serif", fontWeight:"bold" }}>
          {data.center.label}
        </div>
        <div style={{ fontSize:9, color:C.muted, letterSpacing:2, marginTop:4 }}>
          {data.center.sub}
        </div>
      </div>

      {data.branches.map(br => (
        <div key={br.id} style={{ marginBottom:6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8,
            background:C.bgC, border:"1px solid "+br.color,
            borderRadius:4, padding:"8px 12px" }}>
            <span style={{ color:br.color, fontSize:14 }}>{br.icon}</span>
            <span style={{ flex:1, fontSize:10, letterSpacing:2, color:C.cream,
              fontFamily:"Courier New, monospace", fontWeight:"bold", cursor:"pointer" }}
              onClick={() => onSelect(br)}>{br.label}</span>
            <span style={{ color:br.color, fontSize:14, cursor:"pointer", padding:"0 4px" }}
              onClick={() => tog(br.id)}>{exp[br.id] ? "-" : "+"}</span>
          </div>
          {exp[br.id] && br.children && (
            <div style={{ marginLeft:14, marginTop:3 }}>
              {br.children.map(ch => (
                <div key={ch.id} onClick={() => onSelect(ch)} style={{
                  marginBottom:3, display:"flex", alignItems:"center", gap:6,
                  background:C.bg, borderLeft:"3px solid "+(ch.color || br.color),
                  border:"1px solid "+C.border, borderRadius:"0 3px 3px 0",
                  padding:"6px 10px", cursor:"pointer" }}>
                  <span style={{ flex:1, fontSize:9, color:C.cream, fontFamily:"Courier New, monospace" }}>
                    {ch.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const STORAGE_KEY = { novel:"exorigo-mindmap-novel-v1", game:"exorigo-mindmap-game-v1" };

function loadData(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY[key]);
    return raw ? JSON.parse(raw) : cloneData(fallback);
  } catch {
    return cloneData(fallback);
  }
}

export default function App() {
  const [mode, setMode] = useState("novel");
  const [selected, setSelected] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [novelData, setNovelData] = useState(() => loadData("novel", NOVEL));
  const [gameData, setGameData] = useState(() => loadData("game", GAME));

  useEffect(() => {
    const chk = () => setMobile(window.innerWidth < 768);
    chk();
    window.addEventListener("resize", chk);
    return () => window.removeEventListener("resize", chk);
  }, []);

  // Persist edits per mode so they survive a refresh (browser-local only —
  // see note below on what this does and doesn't cover).
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY.novel, JSON.stringify(novelData)); } catch {}
  }, [novelData]);
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY.game, JSON.stringify(gameData)); } catch {}
  }, [gameData]);

  const data = mode === "novel" ? novelData : gameData;
  const setData = mode === "novel" ? setNovelData : setGameData;

  const updateNode = (id, updates) => {
    setData(d => updateNodeInData(d, id, updates));
    setSelected(sel => (sel && sel.id === id) ? { ...sel, ...updates } : sel);
  };

  const resetMode = () => {
    if (!window.confirm(`Reset ${mode.toUpperCase()} map to the last deployed version? This discards edits made in this browser.`)) return;
    const fresh = cloneData(mode === "novel" ? NOVEL : GAME);
    setData(fresh);
    setSelected(null);
  };

  return (
    <div style={{
      background:C.bg, height:"100vh", display:"flex", flexDirection:"column",
      fontFamily:"Courier New, monospace", color:C.cream, overflow:"hidden",
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 16px", borderBottom:"1px solid "+C.border,
        background:C.bgP, flexShrink:0, flexWrap:"wrap", gap:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:13, letterSpacing:4, color:C.gold, fontFamily:"Georgia, serif", fontWeight:"bold" }}>
            EX ORIGO
          </div>
          <div style={{ width:1, height:18, background:C.border }}/>
          <div style={{ fontSize:8, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>
            {mode === "novel" ? "Novel Architecture" : "Game Architecture"} v5.0
          </div>
        </div>

        <div style={{ display:"flex", border:"1px solid "+C.border, borderRadius:2 }}>
          {["novel","game"].map(m => (
            <button key={m} onClick={() => { setMode(m); setSelected(null); }} style={{
              padding:"5px 16px",
              background: mode === m ? C.gold : "transparent",
              border:"none",
              color: mode === m ? C.bg : C.muted,
              cursor:"pointer", fontSize:9, letterSpacing:2,
              fontFamily:"Courier New, monospace",
              textTransform:"uppercase", fontWeight:"bold",
            }}>
              {m === "novel" ? "NOVEL" : "GAME"}
            </button>
          ))}
        </div>

        <div style={{ fontSize:8, color:C.muted }}>CLICK ANY NODE TO EXPAND</div>
      </div>

      <div style={{ padding:"5px 16px", background:C.bgC, borderBottom:"1px solid "+C.border,
        flexShrink:0, display:"flex", gap:4, flexWrap:"wrap", overflowX:"auto" }}>
        {data.branches.map(b => (
          <button key={b.id} onClick={() => setSelected(b)} style={{
            background:"none", border:"none", cursor:"pointer",
            fontSize:9, letterSpacing:1.5, fontWeight:"bold",
            color: selected && selected.id === b.id ? C.gold : C.cream,
            textTransform:"uppercase", padding:"2px 6px",
            borderBottom: selected && selected.id === b.id
              ? "2px solid "+C.gold : "2px solid transparent",
            fontFamily:"Courier New, monospace",
            whiteSpace:"nowrap",
          }}>
            {b.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        {mobile
          ? <HierMap data={data} selected={selected} onSelect={setSelected}/>
          : <RadialMap data={data} selected={selected} onSelect={setSelected}
              editMode={editMode} onUpdateNode={updateNode}
              onToggleEdit={() => setEditMode(e => !e)} onReset={resetMode}/>
        }
        <Detail node={selected} onSelect={setSelected} onClose={() => setSelected(null)}
          editMode={!mobile && editMode} onUpdateNode={updateNode}/>
      </div>

      <div style={{ padding:"6px 16px", borderTop:"1px solid "+C.border, background:C.bgP,
        flexShrink:0, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
        <div style={{ fontSize:7.5, color:C.muted, letterSpacing:1 }}>EX ORIGO TRANSMEDIA PROPERTY CONFIDENTIAL</div>
        <div style={{ fontSize:7.5, color:C.muted, letterSpacing:1 }}>
          {data.branches.length} BRANCHES v5.0 JULY 2026
        </div>
      </div>
    </div>
  );
}
