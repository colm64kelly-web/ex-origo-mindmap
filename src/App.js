import React, { useState, useEffect, useRef, useCallback } from "react";

// ── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0A0A18",
  bgPanel: "#12122A",
  bgCard:  "#1A1A35",
  gold:    "#C9A84C",
  goldL:   "#E8CC7A",
  cream:   "#E8E0D0",
  muted:   "#8A8AA0",
  blue:    "#2C3E6B",
  blueL:   "#4A6090",
  crimson: "#8B1A1A",
  crimsonL:"#B53030",
  green:   "#3A6040",
  greenL:  "#5A8060",
  earth:   "#6B4C2A",
  earthL:  "#8B6A40",
  amber:   "#C17F24",
  amberL:  "#E0A040",
  violet:  "#4A2A6B",
  violetL: "#6A4A8B",
  slate:   "#3A4A5A",
  slateL:  "#5A6A7A",
  border:  "#2A2A45",
  red:     "#8B1A1A",
};

// ── DATA ───────────────────────────────────────────────────────────────────
const NOVEL_DATA = {
  center: { id: "center", label: "EX ORIGO", sub: "From the Source", color: C.gold },
  branches: [
    {
      id: "objects", label: "THE OBJECTS", color: C.amber, icon: "◈",
      detail: "The two primary objects found in the fire-damaged Connemara cottage. Neither appears in any probate or insurance schedule. Both survived the fire. Both are the novel's load-bearing evidence.",
      children: [
        { id: "chest", label: "THE CHEST", color: C.amberL,
          detail: "British Army campaign chest, Boer War era. Pine, old brass, military markings. Carvings inconsistent with any military tradition — San rock art, migration diagrams, Tsodilo spiral motifs. Inventory number matches no traceable War Office series. Was present in the South African cave when Thomas murdered Alderton. Sent to Connemara as burial of evidence. Pulled Doyle — Alderton's descendant — back to its location.",
          children: [
            { id: "chest-natures", label: "Five Possible Natures", color: C.earth,
              detail: "A: Intelligence selecting witnesses for 2M years. B: Mnemonic artifact carrying Thomas's last moment. C: Removes barrier to inherited memory. D: Recurring archetypal manifestation across epochs. E: Human consciousness itself — a mirror. TRUE SIXTH: The organisation's most dangerous liability and most reliable intelligence asset simultaneously." },
            { id: "chest-carvings", label: "The Carvings", color: C.earth,
              detail: "San rock art elements. Spiral motifs consistent with Tsodilo Hills tradition. Migration route diagrams. Star maps or memory encoding. The organisation cannot fully read them. This is why the chest must remain obscure — it is the murder's witness in a language the organisation does not control." },
          ]
        },
        { id: "cope", label: "THE COPE", color: C.amberL,
          detail: "Medieval ecclesiastical vestment. Italian silk, Flemish embroidery. Human figures in rows along the orphrey bands in Passion scenes. Brass morse at the throat. Found folded deliberately. Completely inconsistent with a Boer War military chest. PHYSICAL REFERENCE: The Embroidered Cope, National Museum of Ireland, Glendalough exhibition.",
          children: [
            { id: "cope-provenance", label: "Provenance Chain", color: C.earth,
              detail: "13th-century Augustinian priory, Var département, Provence → 1787 priory inventory lists it → 1793 Revolutionary auction sale → private hands in Provence → Loftus-Burton family member acquires during Napoleonic travels → brought to Ireland → Connemara cottage. Edward Alderton owns the priory ruins on the Domaine de la Valdonne." },
            { id: "cope-questions", label: "Three Open Questions", color: C.earth,
              detail: "1. Did Thomas bring it from Africa — was it Alderton's? 2. Did it predate Thomas in the cottage? 3. Are the cope and chest connected by design or by different routes across centuries? PERMANENTLY UNRESOLVED." },
          ]
        },
      ]
    },
    {
      id: "generations", label: "THREE GENERATIONS", color: C.crimson, icon: "⊗",
      detail: "The novel's deepest architecture. Three generations. Three crimes. The same choice made three times across 120 years. The pattern does not break. It accelerates.",
      children: [
        { id: "thomas", label: "THOMAS LOFTUS-BURTON", color: C.crimsonL,
          detail: "Generation One. 1899-1902. Third son, Anglo-Irish estate family, Wicklow. Escapes Boer POW camp with the real James Alderton. Hides for months in South African bush. Learns what Alderton has: Kenyan land, title, future. Murders Alderton in a cave near Makapan Valley. Body consumed by wild animals. Walks out as James Alderton. Walks north along elephant trails for three years. Arrives Kenya 1906. Marries into Van der Berg family (diamond money, Kimberley). Builds tea plantation on stolen land. Recruited by the organisation. Serves them for life. Dies as James Alderton.",
          children: [
            { id: "thomas-crime", label: "The Cave Murder", color: C.crimson,
              detail: "The foundational crime. South African cave, Makapan Valley region, 1902. Thomas and Alderton hiding after POW camp escape. Thomas learns Alderton's assets. Murders him. Body consumed. British Army records Alderton KIA. Thomas assumes his identity. The chest witnesses the murder. Chapter: CAEDES." },
            { id: "thomas-escape", label: "The Elephant Trail North", color: C.crimson,
              detail: "Thomas walks north along ancient elephant migration routes: Zimbabwe, Zambia, Tanzania, into British East Africa. Approximately three years. Immerses himself in the communities he passes through. Arrives Kenya 1906 as Lieutenant James Alderton. The deepest connection between the human threads and the prehistoric consciousness thread." },
          ]
        },
        { id: "doyle", label: "PATRICK DOYLE", color: C.crimsonL,
          detail: "Generation Two. Insurance loss assessor, Galway. James Alderton's direct descendant. Organisation operative sent to retrieve the chest and cope and bury the evidence permanently. The professional breach — taking the chest without recording it — was always the mission. Causes deaths across Ireland, Italy, and France through operational reports. Dies in the Connemara cottage back room at Browne's hand. Chapter: CONFESSIO.",
          children: [
            { id: "doyle-alderton", label: "The Blood Connection", color: C.crimson,
              detail: "Doyle is James Alderton's direct descendant. The real Alderton's bloodline continued through a sibling's family, dispersed through 20th century English obscurity, crossed to Ireland, produced Patrick Doyle. He does not know this until CONFESSIO. The chest pulled him to the cottage because of Alderton blood — the object returning to its owner's family." },
            { id: "doyle-wound", label: "The Wound", color: C.crimson,
              detail: "Failed father. The marriage ended. Michael grew up in the gap. The distance was not only failure — it was protection, guilt, and the impossibility of full presence with a child placed in his life by people who owned them both. He may have known what Michael was and loved him entirely anyway, choosing not to press the knowledge. Option C." },
          ]
        },
        { id: "michael", label: "MICHAEL DOYLE", color: C.crimsonL,
          detail: "Generation Three. ADOPTED. Organisation-placed. Not Doyle's biological son. Told what he was when he left boarding school. Has known since his late teens. Made his accommodation. Loves Doyle genuinely. The love and the role coexist without cancelling each other. Steps out of the shadows in Chapter 27 CONFESSIO. Kills Browne. Assumes control of the organisation. Walks out of the cottage with the chest and the cope. Chapter: CINIS.",
          children: [
            { id: "michael-adoption", label: "The Placement", color: C.crimson,
              detail: "Michael was placed with Doyle by the organisation as a young child. Doyle was told — or worked it out and chose not to press the knowledge (Option C). Boarding school arranged by the organisation, giving them access Michael's father's presence would have complicated. Told everything on leaving school: Thomas, the murder, Doyle's role, the succession." },
            { id: "michael-florence", label: "Florence", color: C.crimson,
              detail: "Instructed to accompany Doyle. The Renaissance module was real — the organisation uses existing circumstances. Watched his father work in the Uffizi. Was paying attention to the operation, not the paintings. Summoned from the Florence dinner by the organisation — not a social engagement. Told the timeline had accelerated. Arrived in Connemara before Doyle." },
            { id: "michael-line", label: "His Line", color: C.crimson,
              detail: "Working title: NOW IT IS MINE. Three words containing: the organisation, the secret, the chest, the cope, the century of crime, the name Alderton, the inheritance Thomas took with violence and Michael now takes with violence. Said aloud because Michael has nothing left to conceal. Thomas said its equivalent looking at Alderton's body. He did not say it aloud." },
          ]
        },
      ]
    },
    {
      id: "characters", label: "CHARACTERS", color: C.blue, icon: "◉",
      detail: "The novel's complete character register. Every character carries both a surface function and a true function that is only fully visible after CONFESSIO.",
      children: [
        { id: "browne", label: "WILLIE BROWNE", color: C.blueL,
          detail: "The true investigator. Sleeper operative inside the organisation's network for thirty years. Filed parallel reports to his actual handlers while apparently serving the Dublin solicitor's firm. Knows the full truth: the founding murder, the organisation's structure, Doyle's bloodline, Michael's placement. His miscalculation: underestimated how much the organisation trusted Michael. Moves on Doyle believing he had more time. Michael was already in the building. Kills Doyle in self-defence. Killed by Michael. Chapter: CONFESSIO.",
          children: [
            { id: "browne-ballynahinch", label: "The Ballynahinch Lunch", color: C.blue,
              detail: "SURFACE: Browne managing Doyle, establishing local authority. TRUE: Doyle assessing Browne's threat level while allowing Browne to think he is managing the situation. Both men performing for each other. The couple near the door: Belgian church interest, noted by Doyle, reported. The fish: the one genuine moment in an afternoon of performance — Browne ordering something that pleases him, unwatched." },
          ]
        },
        { id: "sheehy", label: "DR COLMAN SHEEHY", color: C.blueL,
          detail: "National Museum of Ireland, Kildare Street. Senior Irish Antiquities Division. Seventies. Connected to Browne's network, not the organisation's. SURFACE: Helpful archivist, generous with a back room invitation. TRUE: An operational contact. His invitation was planned. The back room meeting gave Doyle what he needed at the rate he was ready to receive it. Working name — adjust before drafting." },
        { id: "nifhaolain", label: "DR ÁINE NÍ FHAOLÁIN", color: C.blueL,
          detail: "National Library of Ireland. Manuscript specialist, late 50s. Latin and Church Irish. The most honest character in the novel. SURFACE: Found the letter in the wrong hand by chance. TRUE: Identified years earlier by Browne as the person who, when the right researcher arrived, would connect the right documents. Browne did not plant the letter. He waited. When Doyle asks if what he has found could be what he thinks: 'I do not know, but I do not think you are wrong.' Working name — adjust before drafting." },
        { id: "edward", label: "EDWARD ALDERTON", color: C.blueL,
          detail: "Thomas's great-grandson. Late 50s. Chelsea and Geneva. Manages Alderton Family Office SA through a Liechtenstein structure. Was told the full truth at age 42 — spent a year unable to function, then made his accommodation. Discovers Doyle's bloodline approximately three weeks before the Connemara confrontation. Manages the organisation's European operations. Does not order the deaths directly — the operational layer acts on Doyle's reports." },
        { id: "grace", label: "GRACE ALDERTON-KAMAU", color: C.blueL,
          detail: "Kenyan branch. Late 40s. Managing director, Alderton Tea Holdings Ltd, Kericho. Approximately 800 hectares, 1,200 employees. Knows there is a family secret around the land's origin. Has chosen not to press it. Her life's work sits on a fraudulent foundation she has elected not to examine. The weakest point in the family's information security." },
      ]
    },
    {
      id: "organisation", label: "THE ORGANISATION", color: C.crimson, icon: "◎",
      detail: "The secretive group that recruited Thomas in Kenya after the murder. Has operated for over a century through legitimate corporate and financial structures. Not ideological in the conventional sense — interested in leverage. Control of information, control of money flows, control of the people who control both. Never named in the novel. Remains a set of capabilities and a pattern of behaviour.",
      children: [
        { id: "org-origin", label: "Origin and Recruitment", color: C.crimsonL,
          detail: "Thomas Loftus-Burton murdered Alderton in 1902. Years later in Kenya, representatives visited him. They knew about the cave. Offered protection in exchange for his becoming a conduit. Thomas accepted. The arrangement: they protect the secret; he serves as a node in their operations. The Kenya plantation processed certain things beyond tea. The financial structures carried certain flows beyond legitimate earnings." },
        { id: "org-fortune", label: "The Alderton Fortune", color: C.crimsonL,
          detail: "Thomas married into Van der Berg family (Afrikaner settlers, Kimberley diamond capital from De Beers minority stakes acquired during Rhodes consolidation). Tea plantation profits + compounded diamond investment returns + European property acquisition = Alderton Family Office SA, Geneva. Liechtenstein Anstalt → Luxembourg SICAV → Cayman Islands → operating companies across multiple jurisdictions. European properties: Chelsea, Fiesole (Thomas's African journals in the library), Cascais, Paris (16th arrondissement), Domaine de la Valdonne (Provence)." },
        { id: "org-domaine", label: "Domaine de la Valdonne", color: C.crimsonL,
          detail: "Near Barjols, Var, Provence. Fictional. 165 hectares, 18th-century mas, vineyard, olive grove, ornamental lake. The ruins of a 13th-century Augustinian priory on the northeastern edge — the priory from which the cope originated. Edward Alderton owns the ground the cope came from. He controls the provenance chain from the ground up. He purchased this property specifically for this reason." },
        { id: "org-apex", label: "The Apex Individual", color: C.crimsonL,
          detail: "HELD. The most prominent person currently controlling the organisation. The name Browne gives Doyle in Chapter 27 CONFESSIO. Is this someone the reader has already encountered in the novel under a different description? TO BE REVEALED. The architecture supports a reveal that reframes someone the reader has already met." },
      ]
    },
    {
      id: "locations", label: "LOCATIONS", color: C.green, icon: "◈",
      detail: "Eight primary locations across four countries plus the deep time sites. Each location has a surface function in Doyle's investigation and a true function in the organisation's operations.",
      children: [
        { id: "loc-ireland", label: "IRELAND", color: C.greenL,
          detail: "Connemara: the fire-damaged cottage, the back room the fire did not reach, the novel's alpha and omega. Ballynahinch Castle, Recess: the Ranji Room, the Owenmore Restaurant, the Humanity Dick plaque, the Thomas Martin Room. National Museum, Kildare Street: the Faddan More Psalter, the Embroidered Cope, the Egyptian false door. National Library: the Loftus-Burton estate papers, the letter in the wrong hand. Galway: Doyle's professional base.",
          children: [
            { id: "loc-ballynahinch", label: "Ballynahinch Castle", color: C.green,
              detail: "Recess, Co. Galway. The Ranji Room: five framed photographs of Ranjitsinhji in three identities — Indian prince, English cricketer, Connemara fisherman. The chronological parallel: Ranji played cricket for England while Thomas fought in the Boer War. The same imperial structure. The Owenmore Restaurant: the intelligence lunch. The fish Browne orders: the one genuine moment. Ranji's 72 stone piers still in the river." },
          ]
        },
        { id: "loc-italy", label: "ITALY", color: C.greenL,
          detail: "Florence: Uffizi (cover and genuine love simultaneously), Ponte Vecchio after 10pm, Piazzale degli Uffizi (the old man, the click consonants). Brindisi: Colonne del Porto (Via Appia terminus, two millennia of departure), Diocesan Museum (skull reliquaries, Frederick II parchment). Lecce: Piazza Sant'Oronzo and the donated Roman column, Santa Croce grotesque facade. Gallipoli: the Confraternita della Buona Morte. Matera: the Sassi (9,000 years, forced evacuation), Santa Maria di Idris." },
        { id: "loc-france", label: "FRANCE — PROVENCE", color: C.greenL,
          detail: "Draguignan: Archives départementales du Var — the Valdonne priory inventory of 1787, the cope listed. Barjols: the medieval tanning vats, the Argens river, the oak gall ink connection. The road to the Domaine de la Valdonne: PROPRIÉTÉ PRIVÉE. The estate manager. The African landscape oils. Thomas's photograph on the side table. Aix-en-Provence: where Doyle reads the news of the archivist's death. Twice." },
        { id: "loc-kenya", label: "KENYA", color: C.greenL,
          detail: "Kericho highlands: the tea plantation, the Kericho Tea Hotel (colonial period), the Mau Escarpment behind the old man in Thomas's photograph. Grace Alderton-Kamau's domain. The place where Thomas's escape ended and his other life began. The photograph on the Domaine de la Valdonne side table eventually matched to this landscape." },
        { id: "loc-safrica", label: "SOUTH AFRICA — THE CAVE", color: C.greenL,
          detail: "Makapan Valley, Limpopo Province. The cave systems where Thomas and Alderton hid for months after escaping the Boer POW camp. The foundational crime scene. The chest was here. Chapter CAEDES. Site visit required before drafting this chapter. The prehistoric sequences are set in this same geography — two million years of human ancestry in the landscape where the 20th century's founding crime occurred." },
        { id: "loc-deeptime", label: "DEEP TIME SITES", color: C.greenL,
          detail: "Makapan Valley: Australopithecus africanus fossil site, 2-3 million years. The ochre, the first abstraction, the first burial. McCarthy register — wordless, sparse, no modern consciousness projected backward. Tsodilo Hills, Botswana: UNESCO World Heritage. The Python Cave: 70,000-year-old ritual space, spiral carvings. The mountains of the gods in San and Hambukushu cosmology. The player/reader has no agency in these sequences. They can only observe." },
      ]
    },
    {
      id: "chapters", label: "LATIN CHAPTERS", color: C.earth, icon: "I",
      detail: "29 chapters, each with a Latin title carrying two simultaneous meanings: the surface reading (what the reader believes) and the true reading (what is actually happening). Read in sequence after CONFESSIO, the titles tell the novel's true story in 29 words.",
      children: [
        { id: "act1-chapters", label: "ACT I — CUSTOS to TABULA", color: C.earthL,
          detail: "Ch.0 CUSTOS (Guardian): reconnaissance mission at the National Museum. Ch.1 INVENTIO (Discovery): the cottage, the mission confirmed. Ch.2 CONVIVIUM (A Feast): the Ballynahinch intelligence lunch. Ch.3 FILIUS (Son): Thomas departing for the Boer War. Ch.4 VIGIL (Watcher): Browne as sleeper operative. Ch.5 TABULA (Record): War Office possessions list — clean, as the organisation arranged." },
        { id: "act2a-chapters", label: "ACT II — FUNDUS to SPELUNCA", color: C.earthL,
          detail: "Ch.6 FUNDUS (Deep Ground): prehistoric Makapan. Ch.7 ITER (Journey): Dublin Airport, the duty free book. Ch.8 PICTURA (Painting): the Uffizi, Michael watching Doyle work. Ch.9 DIMISSIO (Sending Away): Michael's departure to the organisation meeting. Ch.10 NOCTUA (Night Owl): the Uffizi encounter — Doyle identified. Ch.11 VIGILIA (Night Watch): recalibration after recognition. Ch.12 PROFECTIO (Setting Out): Thomas shipped to South Africa. Ch.13 EXTENSIO (Extension): Doyle extends the mission south. Ch.14 TERMINUS (Boundary): Brindisi, the operational edge. Ch.15 LAPIDES (Stones): Lecce, the pattern of relocation. Ch.16 MEMORIA (Memory): the elephant thread. Ch.17 CONFRATERNITAS (Brotherhood): Gallipoli, Doyle recognising the parallel structure. Ch.18 SPELUNCA (Cave): Matera, approaching the cave psychology." },
        { id: "act2b-chapters", label: "ACT II — VECTIGAL to PYTHIA", color: C.earthL,
          detail: "Ch.19 VECTIGAL (Tribute Extracted): the trade routes thread. Ch.20 CAEDES (Murder): Thomas and Alderton. The cave. The founding crime. Ch.21 PYTHIA (Oracle): Tsodilo Hills. The reader knows more than Doyle." },
        { id: "act3-chapters", label: "ACT III — VULNUS to CINIS", color: C.earthL,
          detail: "Ch.22 VULNUS (Wound): the chest finds Doyle's wound, the operational fracture. Ch.23 EPISTOLA (Letter): Dr Ní Fhaoláin's discovery. Ch.24 ULTIMA VERBA (Last Words): Thomas's unsent letter ends mid-sentence. Ch.25 ORBIS (Circle): the carvings as celestial geometry. Ch.26 OSTIUM FALSUM (False Door): the National Museum, Edward Alderton present. Ch.27 CONFESSIO (Confession): Browne reveals everything. Doyle dies. Michael steps out. Ch.28 CINIS (Ash): ash, dust, remains. The ending. All five readings open." },
      ]
    },
    {
      id: "threads", label: "SEVEN THREADS", color: C.violet, icon: "≋",
      detail: "Seven narrative threads woven through the novel, each with its own register, timeline, and function. No thread explains itself. Meaning accumulates through proximity and contrast.",
      children: [
        { id: "thread1", label: "Present-Day Ireland & Italy", color: C.violetL,
          detail: "Doyle's investigation (cover) and mission (true). Galway, Connemara, Dublin, Ballynahinch, Florence, Puglia, Provence. The primary thread. Banville register in Act I, darkening through Act II, Le Carré in Act III. The thread that carries both the surface narrative and the true one simultaneously." },
        { id: "thread2", label: "Historical — Boer War", color: C.violetL,
          detail: "Thomas Loftus-Burton, 1899-1902. Dublin departure, Boer War, POW camp escape, months in hiding, the cave murder, the elephant trail north. Two dedicated historical chapters on the moral ambiguity of the 1901-02 campaign. Thomas not heroic — a participant in something he does not understand, becoming something worse." },
        { id: "thread3", label: "Deep Prehistory", color: C.violetL,
          detail: "Makapan Valley, 2-3 million years ago. Australopithecus africanus. The first ochre. The first abstraction. The first burial. McCarthy register: elemental, wordless, near-wordless. The player/reader has no agency in these sequences — they can only observe. The elephant migration thread interwoven: routes held in muscle and bone." },
        { id: "thread4", label: "Trade Routes 600-1500 AD", color: C.violetL,
          detail: "The chest or its precursor on the Swahili coast routes. Blue-green beads (Kilwa or Chinese origin). Ivory token. The carvings already present before European contact. A Swahili, Arab, or interior African merchant's perspective — the object as one item among many. Does not reach the coast. Turns back into the interior." },
        { id: "thread5", label: "Mythic — Tsodilo Hills", color: C.violetL,
          detail: "The Tsodilo Hills, northwestern Botswana. UNESCO World Heritage. The Python Cave: carved boa constrictors, ceremony evidence 70,000 years old. San and Hambukushu cosmology. The chest in an older manifestation: not yet military, not yet a chest, but the same essential form. Written from inside the ceremony — the reader should feel meaning without having it explained." },
        { id: "thread6", label: "Italian Thread", color: C.violetL,
          detail: "Florence and Puglia. The cope's ecclesiastical provenance assembles through Brindisi, Lecce, Gallipoli, Matera. Doyle's operational mission continuing under the cover of cultural curiosity and professional research. Michael's parallel presence in Florence watching Doyle work. The old man in the Piazzale degli Uffizi — the organisation's operative identified by the African protective faction." },
        { id: "thread7", label: "Colonial History", color: C.violetL,
          detail: "The diamond fields, the Kenyan land seizure, the Van der Berg family, the Alderton fortune. Empire's logic applied personally by Thomas: take what someone else has, use their name, build on their absence, pass the structure to the next generation. Doyle — Alderton's descendant — serving the organisation built on his ancestor's murder. Michael inheriting the organisation. Empire reproducing itself." },
      ]
    },
    {
      id: "open", label: "OPEN QUESTIONS", color: C.amber, icon: "▶",
      detail: "Decisions deferred. The novel can be drafted in parallel with resolving them, but the corresponding chapters cannot be finalised until each answer is confirmed.",
      children: [
        { id: "oq1", label: "Michael's University Subject", color: C.amberL,
          detail: "URGENT — must be fixed before Florence chapters drafted. Must have a plausible Renaissance history component requiring primary source research in Florence. Law, history, art history, and architecture are all plausible. The subject determines Michael's vocabulary and his specific mode of attention in the Uffizi." },
        { id: "oq2", label: "Browne's Allegiance", color: C.amberL,
          detail: "Who is Browne's actual handler? Intelligence agency deep cover? Lone operator who eventually connected with the African protective faction? The African protective faction from the start? This determines his operational resources and the nature of his files — whether they are institution-grade evidence or a private investigator's assembled case." },
        { id: "oq3", label: "The Apex Individual", color: C.amberL,
          detail: "HELD. The most prominent person currently controlling the organisation. The name Browne gives Doyle in CONFESSIO. Is this someone the reader has already encountered under a different description? TO BE REVEALED when ready. The architecture supports a final-act reframe of someone already present in the novel." },
        { id: "oq4", label: "The Lecce Correspondence Address", color: C.amberL,
          detail: "What does Doyle find there? A religious house still active? A legal office holding Loftus-Burton papers? A private palazzo whose owner knows nothing? A derelict building with the family name still on an inscription? Must be fixed before Chapter 13 EXTENSIO is drafted." },
        { id: "oq5", label: "The Old Man in the Uffizi", color: C.amberL,
          detail: "Confirmed: a representative of the African protective faction who recognises Doyle as an organisation operative and delivers a warning. Doyle understood more than he reported. What exactly did he say in Khoisan? Does Doyle ever establish the full meaning, or does it remain permanently partial? Fix before Chapter 10 NOCTUA." },
        { id: "oq6", label: "Thomas at Makapan", color: C.amberL,
          detail: "The author must know before CAEDES is drafted, even if the novel never states it. Three options: A) Thomas encounters something non-human in the cave system. B) Psychological event of extreme intensity near the fossil sites. C) Thomas exchanges one object for another and does not understand what he has done. Which?" },
        { id: "oq7", label: "Michael's Line", color: C.amberL,
          detail: "Working title: NOW IT IS MINE. Three words. Contains everything: the organisation, the secret, the chest, the cope, the century of crime. Thomas said its equivalent when he looked at Alderton's body. He did not say it aloud. Michael says it aloud because Michael has nothing left to conceal. Confirm or replace before CONFESSIO is drafted." },
        { id: "oq8", label: "Willie Browne's Exact Identity", color: C.amberL,
          detail: "Estate agent, local insurance intermediary, pub owner, or something else entirely? His specific role determines what authority he has over the cottage, how he knows what he knows, and why the organisation trusted him for thirty years. Fix before Chapter 4 VIGIL." },
      ]
    },
  ]
};

const GAME_DATA = {
  center: { id: "game-center", label: "EX ORIGO", sub: "The Investigator's Journey", color: C.gold },
  branches: [
    {
      id: "mechanics", label: "CORE MECHANICS", color: C.blue, icon: "⚙",
      detail: "The game has no combat. No death states. No fail conditions. The mechanic is the assessor's eye: the trained capacity to notice what does not fit, to evaluate what is selectively true, and to decide — always — what to record and what to withhold.",
      children: [
        { id: "assessment", label: "The Assessment Tool", color: C.blueL,
          detail: "Doyle's professional tablet interface. The player photographs rooms, tags objects, records condition and value. The first action in the game is the assessment of the fire-damaged cottage. The first decision is what to do with the chest and cope. The game rewards the irrational choice: the player who takes the chest without logging it discovers more." },
        { id: "notebook", label: "The Notebook", color: C.blueL,
          detail: "A physical notebook (digitally rendered) where the player's thinking happens. Entries can be linked, annotated, revised. When understanding changes, earlier entries can be re-read differently. The blood connection reveal happens here: the player makes the connection themselves from two entries recorded weeks of game-time apart. The game does not make it for them." },
        { id: "dialogue", label: "Dialogue Assessment", color: C.blueL,
          detail: "Conversations are not choice trees with percentage outcomes. The player evaluates: CONFIRMED, UNVERIFIED, MISLEADING, or WITHHELD. Each character builds a reliability profile. Browne's profile after the Ballynahinch lunch: accurate on family history, selective on estate timeline, withheld on employer identity." },
        { id: "surveillance", label: "Surveillance Awareness", color: C.blueL,
          detail: "Invisible to the player as a meter but present as atmosphere. Certain actions increase monitoring intensity. The attentive player notices: the same car in two locations, the same figure in two different cities. The game never confirms the surveillance. It makes it visible only to those who are looking." },
      ]
    },
    {
      id: "evidence", label: "EVIDENCE ECOSYSTEM", color: C.amber, icon: "◈",
      detail: "Five types of evidence. Three unlock depths. The game rewards every form of serious engagement with the historical material — from physical travel to library research to documentary viewing — regardless of geography or economic means.",
      children: [
        { id: "ev-virtual", label: "Type 1: Virtual Gameplay", color: C.amberL,
          detail: "Standard narrative discoveries made through the game's 3D environments. Completing each chapter location unlocks the corresponding evidence layer. The foundation experience, available to all players regardless of ability to travel. Unlock depth: STANDARD." },
        { id: "ev-photo", label: "Type 2: Timestamped Photograph", color: C.amberL,
          detail: "The player visits a real-world location and photographs the specific target through the companion app. GPS coordinates, timestamp, and image match verified automatically. No institutional agreement required. Examples: Humanity Dick plaque at Ballynahinch, Faddan More Psalter at the National Museum, Ponte Vecchio after 9pm, tanning vats at Barjols, Mau Escarpment profile in Kericho. Unlock depth: DEEP." },
        { id: "ev-doc", label: "Type 3: Documentary Evidence", color: C.amberL,
          detail: "The player photographs real-world reference material: books, museum catalogues, brochures, archive documents, maps. App image recognition identifies qualifying content. Examples: The Mind in the Cave (Lewis-Williams), Ballynahinch Castle brochure Ranji period page, Archives du Var catalogue listing. Unlock depth: STANDARD to DEEP depending on specificity." },
        { id: "ev-research", label: "Type 4: Research Evidence", color: C.amberL,
          detail: "Demonstrated engagement with the historical material. MOOC completion certificate in African archaeology, colonial history, or medieval art. Wikipedia article created or improved on qualifying topic. Library borrowing record showing relevant titles. Academic essay or dissertation submission. Podcast completion screenshot. Quiz: 80%+ on advanced historical quiz. Unlock depth: DEEP to MAXIMUM." },
        { id: "ev-cultural", label: "Type 5: Cultural Attendance", color: C.amberL,
          detail: "Ticket to any qualifying museum, heritage site, lecture, film, or theatre. Any national museum with African, medieval European, or Irish prehistoric holdings. Any Augustinian priory ruins, any country. Any Boer War battlefield or memorial site. Any colonial-era tea plantation open to visitors. Unlock depth: DEEP." },
      ]
    },
    {
      id: "itineraries", label: "FIVE ITINERARIES", color: C.green, icon: "◈",
      detail: "Five physical itineraries, each complete in itself. The home player who never travels experiences a full virtual investigation. The player who completes all five within twelve months unlocks the Master Archive.",
      children: [
        { id: "it1", label: "The Irish Journey", color: C.greenL,
          detail: "3-5 DAYS. IRELAND ONLY. Dublin: National Museum, National Library. Galway: Doyle's professional world. Connemara: Ballynahinch Castle, the bog road west toward the Twelve Bens. Photographs: Faddan More Psalter, Embroidered Cope, Thomas Martin Room sign, Humanity Dick plaque, Owenmore river, Twelve Bens profile. Unlocks: Browne's internal monologue, Dr Sheehy's private cope assessment, Loftus-Burton family tree, Rungs 1-4." },
        { id: "it2", label: "The Italian Thread", color: C.greenL,
          detail: "5-7 DAYS. ITALY. Florence: Uffizi, Ponte Vecchio after 9pm, Piazzale degli Uffizi. Brindisi: Colonne del Porto, Diocesan Museum. Lecce: Piazza Sant'Oronzo, Santa Croce facade. Gallipoli: Confraternita della Buona Morte. Matera: Sassi, Santa Maria di Idris. Photographs: Primavera room, Ponte Vecchio after 9pm, Brindisi Roman columns, Santa Croce grotesque detail, donated column Lecce, Santa Maria di Idris entrance, Sassi canyon view. Unlocks: Surveillance team's Florence report, old man's statement with translation, cope ecclesiastical provenance, Rungs 5-8." },
        { id: "it3", label: "The Provence Investigation", color: C.greenL,
          detail: "3-4 DAYS. FRANCE. Draguignan: Archives départementales du Var. Barjols: market square, medieval tanning vats, Argens river. Brignoles: old town, Musée du Pays Brignolais. Aix-en-Provence. DRIVING ITINERARY — public transport minimal in Var interior. Photographs: Archives du Var exterior, tanning vats from specific angle, Argens river from medieval bridge, garrigue landscape, Cours Mirabeau plane trees. Unlocks: Full priory inventory including hidden second page, Edward Alderton's suppressed research, cope complete provenance chain." },
        { id: "it4", label: "The Full European Arc", color: C.greenL,
          detail: "12-14 DAYS. IRELAND + ITALY + FRANCE. All locations from Itineraries 1, 2, and 3 in sequence, completed within a six-month window. Unlocks the MASTER ARCHIVE: complete casefile never submitted, all suppressed documents, all faction communications, full Thomas journals, all surveillance reports, Doyle's unsent letter to Grace Alderton-Kamau." },
        { id: "it5", label: "The Deep Journey — Kenya", color: C.greenL,
          detail: "5-7 DAYS. KENYA. Nairobi: National Museum of Kenya. Kericho: Kericho Tea Hotel, tea gardens. The Mau Escarpment: the viewpoint from Thomas's photograph — app overlays the old man's image against the player's photograph of the same hills. The match is visual and immediate. Thomas was here. Unlocks: Final pages of Thomas's African journals, Grace Alderton-Kamau's private correspondence, complete elephant trail route, the ending the novel withholds." },
      ]
    },
    {
      id: "levels", label: "29 LEVELS", color: C.earth, icon: "I",
      detail: "The game's 29 levels map directly to the novel's 29 chapters. Same Latin titles. Same dual meaning — the player discovers the true reading in Level 27 CONFESSIO when the perspective shifts from Doyle to Michael.",
      children: [
        { id: "level-act1", label: "Act I Levels 0-5", color: C.earthL,
          detail: "CUSTOS through TABULA. Reconnaissance, assessment, Ballynahinch lunch, the oral history layer, War Office documentation. The player files reports they do not know are operational. The assessment tool teaches them to look. Every choice is building a profile of what the organisation knows." },
        { id: "level-act2", label: "Act II Levels 6-21", color: C.earthL,
          detail: "FUNDUS through PYTHIA. Dublin Airport, Florence with Michael, the Uffizi encounter, the extension south through Puglia, the Provence archives. The evidence ecosystem fully active. Physical photographs unlocking deep content. The deaths accumulating. The player following Doyle believing they are on the right side." },
        { id: "level-confessio", label: "Level 27 — CONFESSIO", color: C.crimson,
          detail: "THE PERSPECTIVE SHIFT. For the first and only time, the player is no longer in Doyle's body. They are in the shadows of the Connemara cottage. They have been in this building longer than Doyle has. They are Michael. They watch the confrontation. They see every choice they made throughout the game from the outside. Then they must decide." },
        { id: "level-cinis", label: "Level 28 — CINIS", color: C.crimson,
          detail: "THE PLAYER'S DECISION. As Michael: step forward or let Browne walk out with the files. Whether the organisation continues or ends in this room. The game does not make this easy. Whatever the player chooses, CINIS closes the same way. The wind. The ash. The room is the same room. The source is what it always was. The player is the last witness." },
      ]
    },
    {
      id: "reveal", label: "THE GREAT REVERSAL", color: C.crimson, icon: "⊗",
      detail: "The game's central structural achievement: the player has been the antagonist for 27 chapters without knowing it. The most sophisticated unreliable narrator mechanic ever built into a transmedia property.",
      children: [
        { id: "rev-doyle", label: "The Player Was Doyle", color: C.crimsonL,
          detail: "For 27 chapters, the player inhabited Doyle. They filed the reports. They took the chest without recording it. They caused the deaths — not directly, but the choices that produced the reports that produced the operational responses were the player's choices. Every discovery they believed they were making was a mission they were completing. Every archive they searched was intelligence gathering for the organisation." },
        { id: "rev-michael", label: "The Player Becomes Michael", color: C.crimsonL,
          detail: "In Chapter 27 CONFESSIO, the perspective shifts. The player is in the shadows. They have been in this building since before Doyle arrived. From this position they see everything they did as Doyle from the outside. The surveillance they sensed as threat was their own network. The paranoia was performance — or genuine anxiety in a man doing terrible things. Both true." },
        { id: "rev-endings", label: "Three Endings", color: C.crimsonL,
          detail: "As Michael: 1. Step forward — the organisation continues, Browne's files disappear, Michael assumes control. 2. Let Browne walk — the organisation is exposed, the truth emerges, Michael's inheritance changes form. 3. Tell Doyle before the confrontation escalates — the pattern breaks for the first time in three generations. Whatever the player chooses, CINIS closes the same way. The game does not confirm whether the choice mattered." },
      ]
    },
    {
      id: "pitch", label: "TRANSMEDIA PITCH", color: C.slate, icon: "◎",
      detail: "EX ORIGO as a pitch-ready entertainment property: literary novel + narrative game + travel experience + educational platform. Four products sharing one story engine.",
      children: [
        { id: "pitch-agent", label: "Literary Agent Pitch", color: C.slateL,
          detail: "A debut literary novel with a built-in global audience development mechanism. The transmedia architecture does not compete with the novel — it extends it. Every game player is a potential reader. Every reader is a potential player. Not just a novel. A property. With five itineraries, eight locations, an evidence ecosystem serving players on three continents, an educational platform with classroom module potential, and a story that sustains adaptation in television, film, podcast, and audio drama." },
        { id: "pitch-game", label: "Game Studio Pitch", color: C.slateL,
          detail: "A narrative investigation game with real-world location partnerships, a built-in audience from the novel's readership, and an evidence system that drives organic engagement. Closest comparables: Return of the Obra Dinn (investigative mechanic, insurance assessor protagonist), Disco Elysium (literary ambition, proven commercial viability), Heaven's Vault (archaeological decipherment). PROVENANCE goes further: real-world locations, real historical evidence, the unreliable narrator operating at maximum depth." },
        { id: "pitch-tourism", label: "Tourism & Heritage Pitch", color: C.slateL,
          detail: "Target partners: Fáilte Ireland (Connemara and Dublin, under-visited heritage sites), Puglia and Basilicata regional tourism boards (Brindisi, Lecce, Matera), Atout France and Var département (Barjols, Draguignan, Var interior), Kenya Tourism Board (Kericho tea country). Co-funding: European Cultural Heritage Fund, Creative Europe, national arts councils across Ireland, Italy, France." },
        { id: "pitch-edu", label: "Educational Platform Pitch", color: C.slateL,
          detail: "A research evidence platform that makes historical engagement a game action. The student who submits a library research record on the Boer War earns the same discovery as the traveller who photographs the Kimberley Mine Museum. Classroom module: six-week structured investigation for secondary and university students. Target: national arts council education funds, Heritage Council, Creative Europe education strands." },
      ]
    },
    {
      id: "comparables", label: "COMPARABLE GAMES", color: C.slate, icon: "≈",
      detail: "EX ORIGO is genuinely without direct precedent. Individual elements exist elsewhere. No existing product combines all five: literary novel foundation, investigative game mechanic, GPS real-world verification, five-tier evidence ecosystem, and multi-country institutional pitch architecture.",
      children: [
        { id: "comp-obra", label: "Return of the Obra Dinn", color: C.slateL,
          detail: "Closest single-game analogue. Insurance investigator protagonist. Documentary reconstruction mechanic. No combat. The notebook as primary interface. DIFFERENCE: Obra Dinn is entirely virtual and self-contained. EX ORIGO spans eight real-world countries and real archives. Obra Dinn has a definitive solution. EX ORIGO holds five readings open." },
        { id: "comp-disco", label: "Disco Elysium", color: C.slateL,
          detail: "Proof of concept: literary fiction of genuine quality can succeed commercially in game form (Metacritic 97). DIFFERENCE: Disco Elysium is entirely fictional. EX ORIGO is grounded in verifiable historical reality. Disco Elysium has no real-world physical layer." },
        { id: "comp-heaven", label: "Heaven's Vault", color: C.slateL,
          detail: "Archaeological decipherment as core mechanic. Patient, contemplative pacing. The investigator's conclusions can be wrong. DIFFERENCE: Heaven's Vault is set in a fictional science-fiction universe. EX ORIGO's carvings are real. Heaven's Vault has no physical real-world layer." },
        { id: "comp-80days", label: "80 Days", color: C.slateL,
          detail: "Multiple travel routes through real-world cities. Colonial history as active moral terrain. Replayability through route variation. DIFFERENCE: 80 Days is entirely virtual. No investigative or documentary mechanic. No educational platform dimension." },
      ]
    },
  ]
};

// ── COMPONENTS ─────────────────────────────────────────────────────────────

function NodeDetail({ node, onClose }) {
  if (!node) return null;
  return (
    <div style={{
      position:"fixed", right:0, top:0, bottom:0, width:"min(420px,100vw)",
      background:C.bgPanel, borderLeft:`1px solid ${C.border}`,
      zIndex:1000, overflowY:"auto", padding:"28px 24px",
      boxShadow:"-8px 0 40px rgba(0,0,0,0.6)",
      fontFamily:"'Courier New', monospace",
    }}>
      <button onClick={onClose} style={{
        position:"absolute", top:16, right:16,
        background:"none", border:`1px solid ${C.border}`,
        color:C.muted, cursor:"pointer", padding:"4px 10px",
        fontFamily:"inherit", fontSize:12, borderRadius:2,
        transition:"all 0.2s",
      }} onMouseEnter={e=>e.target.style.color=C.cream}
         onMouseLeave={e=>e.target.style.color=C.muted}>✕ CLOSE</button>

      <div style={{
        fontSize:9, letterSpacing:3, color:C.muted,
        marginBottom:8, textTransform:"uppercase",
      }}>EX ORIGO — NODE DETAIL</div>

      <div style={{
        fontSize:16, fontWeight:"bold", color:node.color || C.gold,
        letterSpacing:2, marginBottom:16, lineHeight:1.3,
        fontFamily:"Georgia, serif",
      }}>{node.label}</div>

      <div style={{ height:1, background:C.border, marginBottom:16 }}/>

      <div style={{
        fontSize:12, color:C.cream, lineHeight:1.8,
        whiteSpace:"pre-wrap",
      }}>{node.detail || "Detail forthcoming."}</div>

      {node.children && node.children.length > 0 && (
        <>
          <div style={{ height:1, background:C.border, margin:"20px 0 12px" }}/>
          <div style={{ fontSize:9, letterSpacing:3, color:C.muted, marginBottom:10, textTransform:"uppercase" }}>
            SUB-NODES ({node.children.length})
          </div>
          {node.children.map(child => (
            <div key={child.id} style={{
              padding:"8px 10px", marginBottom:6,
              background:C.bgCard, border:`1px solid ${C.border}`,
              borderRadius:2, fontSize:11, color:C.cream,
              cursor:"default",
            }}>
              <span style={{ color:child.color || C.gold, fontWeight:"bold", fontSize:10, letterSpacing:1 }}>
                {child.label}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// Radial Mindmap (Desktop)
function RadialMindmap({ data, onNodeClick }) {
  const svgRef = useRef(null);
  const [dims, setDims] = useState({ w: 900, h: 700 });

  useEffect(() => {
    const update = () => {
      const el = svgRef.current?.parentElement;
      if (el) setDims({ w: el.offsetWidth, h: el.offsetHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const R = Math.min(cx, cy) * 0.58;
  const branches = data.branches;
  const n = branches.length;

  const branchPos = branches.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle), angle };
  });

  return (
    <svg ref={svgRef} width={dims.w} height={dims.h} style={{ display:"block" }}>
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor={C.gold} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <style>{`
          @keyframes pulse {
            0%,100%{r:38}
            50%{r:44}
          }
          .center-pulse { animation: pulse 4s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Connection lines */}
      {branchPos.map((pos, i) => (
        <line key={i}
          x1={cx} y1={cy} x2={pos.x} y2={pos.y}
          stroke={branches[i].color} strokeWidth={1.5} strokeOpacity={0.35}
          strokeDasharray="4 3"
        />
      ))}

      {/* Branch nodes */}
      {branches.map((branch, i) => {
        const pos = branchPos[i];
        const isLeft = pos.x < cx;
        const labelX = pos.x + (isLeft ? -14 : 14);
        const anchor = isLeft ? "end" : "start";
        const nodeR = 32;

        return (
          <g key={branch.id} style={{ cursor:"pointer" }}
             onClick={() => onNodeClick(branch)}>
            <circle cx={pos.x} cy={pos.y} r={nodeR + 6}
              fill={branch.color} fillOpacity={0.08}/>
            <circle cx={pos.x} cy={pos.y} r={nodeR}
              fill={C.bgCard} stroke={branch.color} strokeWidth={1.5}/>
            <text x={pos.x} y={pos.y - 6} textAnchor="middle"
              fill={branch.color} fontSize={16} fontFamily="Georgia, serif">
              {branch.icon}
            </text>
            <text x={pos.x} y={pos.y + 8} textAnchor="middle"
              fill={C.cream} fontSize={7.5} letterSpacing={1.5}
              fontFamily="'Courier New', monospace" fontWeight="bold">
              {branch.label.split(" ").slice(0,2).join(" ")}
            </text>
            {branch.label.split(" ").length > 2 && (
              <text x={pos.x} y={pos.y + 18} textAnchor="middle"
                fill={C.cream} fontSize={7.5} letterSpacing={1.5}
                fontFamily="'Courier New', monospace" fontWeight="bold">
                {branch.label.split(" ").slice(2).join(" ")}
              </text>
            )}
            {/* Child indicators */}
            {branch.children && branch.children.slice(0, 4).map((child, j) => {
              const childAngle = branchPos[i].angle + (j - 1.5) * 0.28;
              const childR = R * 0.3;
              const cx2 = pos.x + childR * Math.cos(childAngle);
              const cy2 = pos.y + childR * Math.sin(childAngle);
              return (
                <g key={child.id} style={{ cursor:"pointer" }}
                   onClick={e => { e.stopPropagation(); onNodeClick(child); }}>
                  <line x1={pos.x} y1={pos.y} x2={cx2} y2={cy2}
                    stroke={child.color || branch.color} strokeWidth={0.8} strokeOpacity={0.3}/>
                  <circle cx={cx2} cy={cy2} r={14}
                    fill={C.bgCard} stroke={child.color || branch.color}
                    strokeWidth={1} opacity={0.8}/>
                  <text x={cx2} y={cy2 + 4} textAnchor="middle"
                    fill={child.color || branch.color} fontSize={8}
                    fontFamily="'Courier New', monospace">
                    {child.label.split(" ")[0].slice(0,7)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Central node */}
      <g style={{ cursor:"pointer" }} onClick={() => onNodeClick(data.center)}>
        <circle cx={cx} cy={cy} r={80} fill="url(#centerGlow)"/>
        <circle className="center-pulse" cx={cx} cy={cy} r={38}
          fill={C.bg} stroke={C.gold} strokeWidth={2} filter="url(#glow)"/>
        <circle cx={cx} cy={cy} r={35}
          fill={C.bg} stroke={C.gold} strokeWidth={1.5} strokeDasharray="3 2"/>
        <text x={cx} y={cy - 8} textAnchor="middle"
          fill={C.gold} fontSize={14} letterSpacing={4}
          fontFamily="Georgia, serif" fontWeight="bold">
          {data.center.label}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle"
          fill={C.muted} fontSize={7.5} letterSpacing={2}
          fontFamily="'Courier New', monospace">
          {data.center.sub}
        </text>
      </g>
    </svg>
  );
}

// Hierarchical Mindmap (Mobile)
function HierarchicalMindmap({ data, onNodeClick }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{ padding:"16px 12px", overflowY:"auto", height:"100%" }}>
      {/* Center */}
      <div onClick={() => onNodeClick(data.center)}
        style={{
          background:C.bgCard, border:`2px solid ${C.gold}`,
          borderRadius:4, padding:"14px 16px", marginBottom:16,
          cursor:"pointer", textAlign:"center",
        }}>
        <div style={{ fontSize:18, letterSpacing:4, color:C.gold,
          fontFamily:"Georgia, serif", fontWeight:"bold" }}>
          {data.center.label}
        </div>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:2, marginTop:4 }}>
          {data.center.sub}
        </div>
      </div>

      {/* Branches */}
      {data.branches.map(branch => (
        <div key={branch.id} style={{ marginBottom:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8,
            background:C.bgCard, border:`1px solid ${branch.color}`,
            borderRadius:4, padding:"10px 14px", cursor:"pointer",
          }}>
            <span style={{ color:branch.color, fontSize:16 }}>{branch.icon}</span>
            <span style={{ flex:1, fontSize:11, letterSpacing:2, color:C.cream,
              fontFamily:"'Courier New', monospace", fontWeight:"bold" }}
              onClick={() => onNodeClick(branch)}>
              {branch.label}
            </span>
            <span onClick={() => toggle(branch.id)}
              style={{ color:branch.color, fontSize:14, padding:"0 4px", cursor:"pointer" }}>
              {expanded[branch.id] ? "−" : "+"}
            </span>
          </div>

          {expanded[branch.id] && branch.children && (
            <div style={{ marginLeft:16, marginTop:4 }}>
              {branch.children.map(child => (
                <div key={child.id} style={{ marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8,
                    background:C.bg, border:`1px solid ${C.border}`,
                    borderLeft:`3px solid ${child.color || branch.color}`,
                    borderRadius:"0 4px 4px 0", padding:"8px 12px", cursor:"pointer",
                  }}
                    onClick={() => onNodeClick(child)}>
                    <span style={{ flex:1, fontSize:10, color:C.cream,
                      fontFamily:"'Courier New', monospace" }}>
                      {child.label}
                    </span>
                    {child.children && (
                      <span style={{ color:C.muted, fontSize:10 }}>
                        {child.children.length} sub
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function ExOrigoMindmap() {
  const [mode, setMode] = useState("novel"); // "novel" | "game"
  const [selectedNode, setSelectedNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const data = mode === "novel" ? NOVEL_DATA : GAME_DATA;
  const isNovel = mode === "novel";

  return (
    <div style={{
      background:C.bg, minHeight:"100vh", height:"100vh",
      display:"flex", flexDirection:"column",
      fontFamily:"'Courier New', monospace",
      color:C.cream, overflow:"hidden",
    }}>

      {/* ── HEADER ── */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"12px 20px", borderBottom:`1px solid ${C.border}`,
        background:C.bgPanel, flexShrink:0, flexWrap:"wrap", gap:8,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:11, letterSpacing:4, color:C.gold,
            fontFamily:"Georgia, serif", fontWeight:"bold" }}>
            EX ORIGO
          </div>
          <div style={{ width:1, height:20, background:C.border }}/>
          <div style={{ fontSize:9, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>
            {isNovel ? "Novel Architecture" : "Game Architecture"} · v5.0
          </div>
        </div>

        <div style={{ display:"flex", gap:0, border:`1px solid ${C.border}`, borderRadius:2 }}>
          {["novel","game"].map(m => (
            <button key={m} onClick={() => { setMode(m); setSelectedNode(null); }}
              style={{
                padding:"6px 18px", background:mode===m ? C.gold : "none",
                border:"none", color:mode===m ? C.bg : C.muted,
                cursor:"pointer", fontSize:9, letterSpacing:2,
                fontFamily:"'Courier New', monospace", textTransform:"uppercase",
                fontWeight:"bold", transition:"all 0.2s",
              }}>
              {m === "novel" ? "◈ NOVEL" : "⚙ GAME"}
            </button>
          ))}
        </div>

        <div style={{ fontSize:9, color:C.muted, letterSpacing:1 }}>
          {isMobile ? "TAP" : "CLICK"} ANY NODE TO EXPAND
        </div>
      </div>

      {/* ── SUBTITLE BAR ── */}
      <div style={{
        padding:"6px 20px", background:C.bgCard,
        borderBottom:`1px solid ${C.border}`, flexShrink:0,
        display:"flex", gap:16, flexWrap:"wrap",
      }}>
        {data.branches.map(b => (
          <span key={b.id} style={{ fontSize:8, letterSpacing:1.5,
            color:b.color, textTransform:"uppercase", cursor:"pointer",
          }} onClick={() => setSelectedNode(b)}>
            {b.icon} {b.label}
          </span>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        {isMobile
          ? <HierarchicalMindmap data={data} onNodeClick={setSelectedNode}/>
          : <RadialMindmap data={data} onNodeClick={setSelectedNode}/>
        }

        {/* Detail panel */}
        <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)}/>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        padding:"8px 20px", borderTop:`1px solid ${C.border}`,
        background:C.bgPanel, flexShrink:0,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexWrap:"wrap", gap:4,
      }}>
        <div style={{ fontSize:8, color:C.muted, letterSpacing:1 }}>
          EX ORIGO · TRANSMEDIA PROPERTY · CONFIDENTIAL
        </div>
        <div style={{ fontSize:8, color:C.muted, letterSpacing:1 }}>
          {data.branches.length} PRIMARY BRANCHES ·{" "}
          {data.branches.reduce((a,b) => a + (b.children?.length||0), 0)} SUB-NODES ·{" "}
          LIVING DOCUMENT — ADD AS REQUIRED
        </div>
        <div style={{ fontSize:8, color:C.muted, letterSpacing:1 }}>
          v5.0 · JULY 2026
        </div>
      </div>
    </div>
  );
}
 
