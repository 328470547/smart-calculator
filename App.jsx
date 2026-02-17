import { useState } from "react";

const categories = [
  {
    id: "percent",
    icon: "%",
    label: "אחוזים",
    color: "#FF6B35",
    tools: [
      {
        id: "discount",
        label: "חישוב הנחה",
        fields: [
          { id: "price", label: "מחיר מקורי (₪)", type: "number" },
          { id: "discount", label: "אחוז הנחה (%)", type: "number" },
        ],
        calculate: (f) => {
          const saved = (f.price * f.discount) / 100;
          const final = f.price - saved;
          return "מחיר סופי: ₪" + final.toFixed(2) + "\nחסכת: ₪" + saved.toFixed(2);
        },
      },
      {
        id: "vat_add",
        label: 'הוספת מע"מ (18%)',
        fields: [
          { id: "price", label: 'סכום לפני מע"מ (₪)', type: "number" },
        ],
        calculate: (f) => {
          const vat = f.price * 0.18;
          const total = f.price + vat;
          return 'מע"מ (18%): ₪' + vat.toFixed(2) + '\nסה"כ כולל מע"מ: ₪' + total.toFixed(2);
        },
      },
      {
        id: "vat_remove",
        label: 'הוצאת מע"מ (18%)',
        fields: [
          { id: "total", label: 'סכום כולל מע"מ (₪)', type: "number" },
        ],
        calculate: (f) => {
          const before = f.total / 1.18;
          const vat = f.total - before;
          return 'סכום לפני מע"מ: ₪' + before.toFixed(2) + '\nמע"מ בתוך הסכום: ₪' + vat.toFixed(2);
        },
      },
      {
        id: "price_before_rise",
        label: "מחיר לפני עלייה",
        fields: [
          { id: "current", label: "המחיר הנוכחי (₪)", type: "number" },
          { id: "rise", label: "אחוז העלייה (%)", type: "number" },
        ],
        calculate: (f) => {
          const before = f.current / (1 + f.rise / 100);
          const diff = f.current - before;
          return "מחיר לפני העלייה: ₪" + before.toFixed(2) + "\nכמה עלה: ₪" + diff.toFixed(2);
        },
      },
      {
        id: "tip",
        label: "חישוב טיפ",
        fields: [
          { id: "bill", label: "סכום החשבון (₪)", type: "number" },
          { id: "tip", label: "אחוז טיפ (%)", type: "number" },
        ],
        calculate: (f) => {
          const tip = (f.bill * f.tip) / 100;
          const total = f.bill + tip;
          return "טיפ: ₪" + tip.toFixed(2) + '\nסה"כ: ₪' + total.toFixed(2);
        },
      },
      {
        id: "percent_of",
        label: "כמה אחוז X מתוך Y",
        fields: [
          { id: "part", label: "החלק (X)", type: "number" },
          { id: "total", label: "הסכום הכולל (Y)", type: "number" },
        ],
        calculate: (f) => {
          const pct = (f.part / f.total) * 100;
          return pct.toFixed(2) + "%";
        },
      },
    ],
  },
  {
    id: "money",
    icon: "₪",
    label: "כסף",
    color: "#2EC4B6",
    tools: [
      {
        id: "mortgage",
        label: "תשלום משכנתא חודשי",
        fields: [
          { id: "loan", label: "סכום ההלוואה (₪)", type: "number" },
          { id: "rate", label: "ריבית שנתית (%)", type: "number" },
          { id: "years", label: "מספר שנים", type: "number" },
        ],
        calculate: (f) => {
          const r = f.rate / 100 / 12;
          const n = f.years * 12;
          const monthly = (f.loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
          const total = monthly * n;
          return "תשלום חודשי: ₪" + monthly.toFixed(2) + '\nסה"כ תשלומים: ₪' + total.toFixed(0) + "\nריבית כוללת: ₪" + (total - f.loan).toFixed(0);
        },
      },
      {
        id: "savings",
        label: "חיסכון עם ריבית דריבית",
        fields: [
          { id: "amount", label: "סכום התחלתי (₪)", type: "number" },
          { id: "monthly", label: "הפקדה חודשית (₪)", type: "number" },
          { id: "rate", label: "ריבית שנתית (%)", type: "number" },
          { id: "years", label: "מספר שנים", type: "number" },
        ],
        calculate: (f) => {
          const r = f.rate / 100 / 12;
          const n = f.years * 12;
          const future = f.amount * Math.pow(1 + r, n) + f.monthly * ((Math.pow(1 + r, n) - 1) / r);
          const invested = f.amount + f.monthly * n;
          return 'סה"כ בחיסכון: ₪' + future.toFixed(0) + "\nהפקדת: ₪" + invested.toFixed(0) + "\nרווח מריבית: ₪" + (future - invested).toFixed(0);
        },
      },
      {
        id: "split",
        label: "חלוקת חשבון",
        fields: [
          { id: "bill", label: "סכום החשבון (₪)", type: "number" },
          { id: "people", label: "מספר אנשים", type: "number" },
        ],
        calculate: (f) => {
          const per = f.bill / f.people;
          return "כל אחד משלם: ₪" + per.toFixed(2);
        },
      },
    ],
  },
  {
    id: "health",
    icon: "❤️",
    label: "בריאות",
    color: "#E63946",
    tools: [
      {
        id: "bmi",
        label: "חישוב BMI",
        fields: [
          { id: "weight", label: 'משקל (ק"ג)', type: "number" },
          { id: "height", label: "גובה במטרים (לדוגמה 1.75)", type: "number" },
        ],
        calculate: (f) => {
          const bmi = f.weight / (f.height * f.height);
          let status = "";
          if (bmi < 18.5) status = "תת משקל";
          else if (bmi < 25) status = "משקל תקין";
          else if (bmi < 30) status = "עודף משקל";
          else status = "השמנה";
          return "BMI: " + bmi.toFixed(1) + "\nסטטוס: " + status;
        },
      },
      {
        id: "calories",
        label: "צריכת קלוריות יומית",
        fields: [
          { id: "weight", label: 'משקל (ק"ג)', type: "number" },
          { id: "height", label: 'גובה (ס"מ)', type: "number" },
          { id: "age", label: "גיל", type: "number" },
          { id: "gender", label: "מין (1=זכר  2=נקבה)", type: "number" },
        ],
        calculate: (f) => {
          let bmr;
          if (f.gender === 1) bmr = 10 * f.weight + 6.25 * f.height - 5 * f.age + 5;
          else bmr = 10 * f.weight + 6.25 * f.height - 5 * f.age - 161;
          return 'קלוריות בסיסיות: ' + bmr.toFixed(0) + ' קק"ל\nפעילות קלה: ' + (bmr * 1.375).toFixed(0) + ' קק"ל\nפעילות בינונית: ' + (bmr * 1.55).toFixed(0) + ' קק"ל';
        },
      },
      {
        id: "ideal_weight",
        label: "משקל אידיאלי",
        fields: [
          { id: "height", label: 'גובה (ס"מ)', type: "number" },
        ],
        calculate: (f) => {
          const min = (f.height / 100) * (f.height / 100) * 18.5;
          const max = (f.height / 100) * (f.height / 100) * 24.9;
          return "טווח משקל תקין: " + min.toFixed(1) + " עד " + max.toFixed(1) + ' ק"ג';
        },
      },
    ],
  },
  {
    id: "car",
    icon: "🚗",
    label: "רכב",
    color: "#F4A261",
    tools: [
      {
        id: "fuel_cost",
        label: "עלות נסיעה בבנזין",
        fields: [
          { id: "km", label: 'מרחק (ק"מ)', type: "number" },
          { id: "consumption", label: 'צריכת דלק (ל/100ק"מ)', type: "number" },
          { id: "price", label: "מחיר בנזין (₪ לליטר)", type: "number" },
        ],
        calculate: (f) => {
          const liters = (f.km * f.consumption) / 100;
          const cost = liters * f.price;
          return "ליטרים שתצרוך: " + liters.toFixed(2) + "\nעלות הנסיעה: ₪" + cost.toFixed(2);
        },
      },
      {
        id: "travel_time",
        label: "זמן נסיעה משוער",
        fields: [
          { id: "km", label: 'מרחק (ק"מ)', type: "number" },
          { id: "speed", label: 'מהירות ממוצעת (קמ"ש)', type: "number" },
        ],
        calculate: (f) => {
          const hours = f.km / f.speed;
          const h = Math.floor(hours);
          const m = Math.round((hours - h) * 60);
          return "זמן נסיעה: " + (h > 0 ? h + " שעות ו-" : "") + m + " דקות";
        },
      },
      {
        id: "monthly_fuel",
        label: "הוצאה חודשית על דלק",
        fields: [
          { id: "daily_km", label: 'ק"מ ביום בממוצע', type: "number" },
          { id: "consumption", label: 'צריכת דלק (ל/100ק"מ)', type: "number" },
          { id: "price", label: "מחיר בנזין (₪ לליטר)", type: "number" },
        ],
        calculate: (f) => {
          const monthly_km = f.daily_km * 30;
          const liters = (monthly_km * f.consumption) / 100;
          const cost = liters * f.price;
          return 'ק"מ בחודש: ' + monthly_km + "\nליטרים: " + liters.toFixed(1) + "\nעלות חודשית: ₪" + cost.toFixed(0);
        },
      },
    ],
  },
  {
    id: "kitchen",
    icon: "🍳",
    label: "מטבח",
    color: "#8AC926",
    tools: [
      {
        id: "convert_cups",
        label: 'כוסות למ"ל',
        fields: [
          { id: "cups", label: "כמות בכוסות", type: "number" },
        ],
        calculate: (f) => f.cups + ' כוסות = ' + (f.cups * 240).toFixed(0) + ' מ"ל',
      },
      {
        id: "recipe_scale",
        label: "שינוי כמות במתכון",
        fields: [
          { id: "original", label: "מנות במקור", type: "number" },
          { id: "desired", label: "מנות רצויות", type: "number" },
          { id: "ingredient", label: "כמות מרכיב", type: "number" },
        ],
        calculate: (f) => {
          const ratio = f.desired / f.original;
          const newAmount = f.ingredient * ratio;
          return "פקטור שינוי: x" + ratio.toFixed(2) + "\nכמות חדשה: " + newAmount.toFixed(2);
        },
      },
      {
        id: "temp_convert",
        label: "המרת טמפרטורה",
        fields: [
          { id: "celsius", label: "מעלות צלזיוס", type: "number" },
        ],
        calculate: (f) => {
          const fahr = (f.celsius * 9) / 5 + 32;
          return f.celsius + " מעלות צלזיוס = " + fahr.toFixed(1) + " פרנהייט";
        },
      },
    ],
  },
  {
    id: "math",
    icon: "📐",
    label: "מתמטיקה",
    color: "#A855F7",
    tools: [
      {
        id: "quadratic",
        label: "פתרון משוואה ריבועית",
        fields: [
          { id: "a", label: "מקדם a", type: "number" },
          { id: "b", label: "מקדם b", type: "number" },
          { id: "c", label: "מקדם c", type: "number" },
        ],
        calculate: (f) => {
          const disc = f.b * f.b - 4 * f.a * f.c;
          if (disc < 0) return "אין פתרון ממשי";
          const x1 = (-f.b + Math.sqrt(disc)) / (2 * f.a);
          const x2 = (-f.b - Math.sqrt(disc)) / (2 * f.a);
          if (disc === 0) return "פתרון יחיד: x = " + x1.toFixed(4);
          return "x1 = " + x1.toFixed(4) + "\nx2 = " + x2.toFixed(4);
        },
      },
      {
        id: "fraction",
        label: "חיבור שברים",
        fields: [
          { id: "n1", label: "מונה שבר 1", type: "number" },
          { id: "d1", label: "מכנה שבר 1", type: "number" },
          { id: "n2", label: "מונה שבר 2", type: "number" },
          { id: "d2", label: "מכנה שבר 2", type: "number" },
        ],
        calculate: (f) => {
          const n = f.n1 * f.d2 + f.n2 * f.d1;
          const d = f.d1 * f.d2;
          const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
          const g = gcd(Math.abs(n), Math.abs(d));
          return "התוצאה: " + (n / g) + "/" + (d / g) + "\nבצורה עשרונית: " + (n / d).toFixed(4);
        },
      },
      {
        id: "pythagoras",
        label: "משפט פיתגורס",
        fields: [
          { id: "a", label: "צלע א", type: "number" },
          { id: "b", label: "צלע ב", type: "number" },
        ],
        calculate: (f) => {
          const c = Math.sqrt(f.a * f.a + f.b * f.b);
          return "היתר (c): " + c.toFixed(4);
        },
      },
    ],
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Heebo', sans-serif;
    direction: rtl;
  }

  .app {
    min-height: 100vh;
    background: #0d1117;
    color: #e6edf3;
    font-family: 'Heebo', sans-serif;
    direction: rtl;
    position: relative;
    overflow-x: hidden;
  }

  .bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .bg-glow {
    position: fixed;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.07;
    pointer-events: none;
    z-index: 0;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(circle, #FF6B35, #A855F7);
    animation: glow-pulse 6s ease-in-out infinite;
  }

  @keyframes glow-pulse {
    0%, 100% { opacity: 0.07; transform: translateX(-50%) scale(1); }
    50% { opacity: 0.12; transform: translateX(-50%) scale(1.1); }
  }

  .header {
    position: relative;
    z-index: 10;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(20px);
    background: rgba(13,17,23,0.8);
    display: flex;
    align-items: center;
    gap: 14px;
    position: sticky;
    top: 0;
  }

  .back-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e6edf3;
    border-radius: 10px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    font-family: 'Heebo', sans-serif;
    font-weight: 500;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .back-btn:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.2);
  }

  .header-title {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .header-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    margin-top: 2px;
    font-weight: 400;
  }

  .content {
    position: relative;
    z-index: 5;
    padding: 28px 20px;
    max-width: 480px;
    margin: 0 auto;
  }

  /* Category Grid */
  .category-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .category-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 24px 16px;
    cursor: pointer;
    color: #e6edf3;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .category-card::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.25s;
    border-radius: 20px;
  }

  .category-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.15);
  }

  .category-card:hover::before {
    opacity: 1;
  }

  .category-icon {
    font-size: 30px;
    line-height: 1;
  }

  .category-label {
    font-size: 15px;
    font-weight: 700;
  }

  .category-count {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    font-weight: 400;
  }

  /* Tool List */
  .tool-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tool-list-header {
    font-size: 12px;
    color: rgba(255,255,255,0.3);
    margin-bottom: 8px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .tool-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 16px 18px;
    cursor: pointer;
    color: #e6edf3;
    text-align: right;
    font-size: 15px;
    font-weight: 500;
    font-family: 'Heebo', sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
  }

  .tool-card:hover {
    background: rgba(255,255,255,0.08);
    transform: translateX(-3px);
  }

  .tool-arrow {
    opacity: 0.4;
    font-size: 18px;
    transition: all 0.2s;
  }

  .tool-card:hover .tool-arrow {
    opacity: 0.9;
    transform: translateX(-3px);
  }

  /* Calculator Form */
  .calc-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 12px;
    color: rgba(255,255,255,0.45);
    font-weight: 500;
  }

  .field-input {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 13px 16px;
    color: #e6edf3;
    font-size: 16px;
    font-family: 'Heebo', sans-serif;
    outline: none;
    direction: ltr;
    text-align: right;
    transition: all 0.2s;
  }

  .field-input:focus {
    border-color: rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.09);
  }

  .field-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .calc-btn {
    border: none;
    border-radius: 14px;
    padding: 15px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Heebo', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }

  .calc-btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }

  .calc-btn:active {
    transform: translateY(0);
  }

  /* Error */
  .error-box {
    background: rgba(255, 68, 85, 0.12);
    border: 1px solid rgba(255, 68, 85, 0.3);
    border-radius: 10px;
    padding: 10px 14px;
    color: #ff8899;
    font-size: 13px;
    font-weight: 500;
  }

  /* Result */
  .result-card {
    margin-top: 14px;
    border-radius: 20px;
    padding: 22px;
    animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .result-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 14px;
    opacity: 0.8;
  }

  .result-line {
    line-height: 1.6;
    margin-bottom: 4px;
  }

  .result-line-primary {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .result-line-secondary {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255,255,255,0.6);
  }

  /* Page animations */
  .page-enter {
    animation: fade-in 0.25s ease;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function SmartCalc() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [fields, setFields] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const selectCategory = (catId) => {
    setActiveCategory(catId);
    setActiveTool(null);
    setFields({});
    setResult(null);
    setError(null);
  };

  const selectTool = (tool) => {
    setActiveTool(tool);
    setFields({});
    setResult(null);
    setError(null);
  };

  const goBack = () => {
    if (activeTool) {
      setActiveTool(null);
      setFields({});
      setResult(null);
      setError(null);
    } else {
      selectCategory(null);
    }
  };

  const handleCalc = () => {
    const parsed = {};
    for (const f of activeTool.fields) {
      const val = parseFloat(fields[f.id]);
      if (isNaN(val)) {
        setError("נא למלא את כל השדות");
        return;
      }
      parsed[f.id] = val;
    }
    try {
      const res = activeTool.calculate(parsed);
      setResult(res);
      setError(null);
    } catch (e) {
      setError("שגיאה בחישוב");
    }
  };

  const cat = activeCategory ? categories.find((c) => c.id === activeCategory) : null;

  const getHeaderSub = () => {
    if (!activeCategory) return "בחר קטגוריה";
    if (!activeTool) return cat?.label;
    return activeTool.label;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="bg-grid" />
        <div className="bg-glow" />

        {/* Header */}
        <div className="header">
          {(activeCategory || activeTool) && (
            <button className="back-btn" onClick={goBack}>
              ← חזרה
            </button>
          )}
          <div>
            <div className="header-title">🧮 מחשבון חכם</div>
            <div className="header-sub">{getHeaderSub()}</div>
          </div>
        </div>

        <div className="content">

          {/* Category Selection */}
          {!activeCategory && (
            <div className="category-grid page-enter">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className="category-card"
                  onClick={() => selectCategory(c.id)}
                  style={{
                    "--cat-color": c.color,
                    borderColor: c.color + "30",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.color + "18";
                    e.currentTarget.style.borderColor = c.color + "60";
                    e.currentTarget.style.boxShadow = `0 8px 32px ${c.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = c.color + "30";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span className="category-icon">{c.icon}</span>
                  <span className="category-label" style={{ color: c.color }}>{c.label}</span>
                  <span className="category-count">{c.tools.length} כלים</span>
                </button>
              ))}
            </div>
          )}

          {/* Tool List */}
          {activeCategory && !activeTool && cat && (
            <div className="tool-list page-enter">
              <div className="tool-list-header">בחר כלי חישוב</div>
              {cat.tools.map((tool) => (
                <button
                  key={tool.id}
                  className="tool-card"
                  onClick={() => selectTool(tool)}
                  style={{ borderColor: cat.color + "25" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = cat.color + "15";
                    e.currentTarget.style.borderColor = cat.color + "50";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = cat.color + "25";
                  }}
                >
                  <span>{tool.label}</span>
                  <span className="tool-arrow" style={{ color: cat.color }}>←</span>
                </button>
              ))}
            </div>
          )}

          {/* Calculator */}
          {activeTool && cat && (
            <div className="page-enter">
              <div className="calc-card" style={{ borderColor: cat.color + "25" }}>
                {activeTool.fields.map((f) => (
                  <div key={f.id} className="field-group">
                    <label className="field-label">{f.label}</label>
                    <input
                      className="field-input"
                      type="number"
                      value={fields[f.id] || ""}
                      onChange={(e) => {
                        setFields({ ...fields, [f.id]: e.target.value });
                        setResult(null);
                        setError(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleCalc()}
                      placeholder="הכנס מספר..."
                      style={{
                        "--focus-color": cat.color,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = cat.color + "80";
                        e.target.style.boxShadow = `0 0 0 3px ${cat.color}15`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.1)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                ))}

                {error && <div className="error-box">{error}</div>}

                <button
                  className="calc-btn"
                  onClick={handleCalc}
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`,
                    boxShadow: `0 4px 20px ${cat.color}40`,
                  }}
                >
                  חשב
                </button>
              </div>

              {result && (
                <div
                  className="result-card"
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}18, ${cat.color}08)`,
                    border: `1px solid ${cat.color}40`,
                  }}
                >
                  <div className="result-label" style={{ color: cat.color }}>✦ תוצאה</div>
                  {result.split("\n").map((line, i) => (
                    <div
                      key={i}
                      className={`result-line ${i === 0 ? "result-line-primary" : "result-line-secondary"}`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
