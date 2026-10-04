// shared.js — used by both index.html (viewer) and admin.html (uploader)

const DEFAULT_SITE_META = {"Roshn": {"label": "Roshn", "full": "Roshn Site Duty", "color": "#7FA8D9", "bg": "#D6E4F0", "text": "#2c4a6e"}, "T-AIR": {"label": "T-AIR", "full": "T-Airport Test", "color": "#D9A86C", "bg": "#F5E6D6", "text": "#7a5220"}, "T-OLY": {"label": "T-OLY", "full": "T-Olaya Test", "color": "#A89A5C", "bg": "#C4BD97", "text": "#4a4420"}, "T-HYT": {"label": "T-HYT", "full": "T-Hayat Mall Test", "color": "#B39DDB", "bg": "#EAE0F5", "text": "#4a3070"}, "R": {"label": "R", "full": "On Rest", "color": "#B0B0B0", "bg": "#F0F0F0", "text": "#666"}, "PNU": {"label": "PNU", "full": "PNU Site Duty", "color": "#7FC9A0", "bg": "#DCF0E4", "text": "#1e5c39"}, "WDO": {"label": "WDO", "full": "Work Day Off", "color": "#C9C9C9", "bg": "#EDEDED", "text": "#555"}, "C/O": {"label": "C/O", "full": "Comp Off", "color": "#E8B4B4", "bg": "#FBE4E4", "text": "#8a2c2c"}, "H": {"label": "H", "full": "Public Holiday", "color": "#E8D24A", "bg": "#FBF3C4", "text": "#6b5c00"}, "S": {"label": "S", "full": "Sick", "color": "#E89999", "bg": "#FADCDC", "text": "#8a2020"}, "V": {"label": "V", "full": "Vacation", "color": "#8FCB8F", "bg": "#DFF2DF", "text": "#2c5c2c"}, "H/D": {"label": "H/D", "full": "Half Day", "color": "#D9C77F", "bg": "#F3EBC9", "text": "#6b5c20"}};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function siteMetaFor(data, code){
  if(data.site_meta && data.site_meta[code]) return data.site_meta[code];
  let hash = 0;
  for(let i=0;i<code.length;i++){ hash = code.charCodeAt(i) + ((hash<<5)-hash); }
  const hue = Math.abs(hash) % 360;
  return {
    label: code, full: code,
    color: 'hsl('+hue+',55%,55%)',
    bg: 'hsl('+hue+',55%,90%)',
    text: 'hsl('+hue+',55%,28%)'
  };
}

// Parses a roster workbook (same layout as SO_ROSTER_AUG_2026.xlsx) into our DATA shape.
function parseRosterWorkbook(workbook, filename){
  const sheetName = workbook.SheetNames[0];
  const ws = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, {header:1, defval: null, raw:true});

  // Find header row: a row with several cells matching "<day>\n<WEEKDAY>" pattern
  let headerRowIdx = -1;
  let dayCols = [];
  for(let r=0; r<Math.min(rows.length, 8); r++){
    const row = rows[r];
    if(!row) continue;
    const found = [];
    for(let c=0;c<row.length;c++){
      const v = row[c];
      if(typeof v === 'string'){
        const m = v.match(/^(\d{1,2})\s*[\r\n]+([A-Za-z]{3,9})/);
        if(m){ found.push({colIndex:c, day: parseInt(m[1]), weekday: m[2].toUpperCase().slice(0,3)}); }
      }
    }
    if(found.length >= 5){ headerRowIdx = r; dayCols = found; break; }
  }
  if(headerRowIdx === -1) throw new Error('Could not find the day-header row (expected cells like "1\\nSAT").');

  let monthLabel = null, year = null, month = null;
  for(let r=0; r<headerRowIdx; r++){
    const row = rows[r] || [];
    for(const v of row){
      if(typeof v === 'string' && /ROSTER/i.test(v)){
        const m = v.match(/([A-Za-z]+)\s+(\d{4})/);
        if(m){
          const idx = MONTH_NAMES.findIndex(mn => mn.toUpperCase() === m[1].toUpperCase());
          if(idx >= 0){ month = idx+1; year = parseInt(m[2]); monthLabel = MONTH_NAMES[idx] + ' ' + year; }
        }
      }
    }
  }

  const employees = [];
  for(let r = headerRowIdx+1; r < rows.length; r++){
    const row = rows[r];
    if(!row) break;
    const num = row[0];
    const name = row[2];
    if(typeof num !== 'number' || typeof name !== 'string' || name.trim() === '') break;
    const emp = {
      num: num,
      status: row[1] || '',
      name: name.trim(),
      task: row[3] || '',
      title: row[4] || '',
      days_off: row[5] || '',
      days: {}
    };
    dayCols.forEach(dc=>{
      const val = row[dc.colIndex];
      emp.days[String(dc.day)] = (val === null || val === undefined || val === '') ? 'R' : String(val).trim();
    });
    employees.push(emp);
  }
  if(employees.length === 0) throw new Error('No employee rows found below the header row.');

  const days_info = dayCols.sort((a,b)=>a.day-b.day).map(dc=>{
    let isoName = dc.weekday;
    if(year && month){
      try{
        const d = new Date(year, month-1, dc.day);
        isoName = d.toLocaleDateString('en-US', {weekday:'long'});
      }catch(e){}
    }
    return { day: dc.day, weekday: dc.weekday, iso_weekday_name: isoName };
  });

  return {
    employees,
    days_info,
    site_meta: DEFAULT_SITE_META,
    month_label: monthLabel || (year && month ? (MONTH_NAMES[month-1]+' '+year) : 'Roster'),
    month_short: month ? MONTH_NAMES[month-1].slice(0,3) : '',
    year: year,
    month: month,
    source_name: filename
  };
}
