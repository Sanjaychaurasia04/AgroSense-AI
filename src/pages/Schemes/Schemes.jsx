// src/pages/Schemes/Schemes.jsx
import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Btn from '../../components/common/Button';
import { theme } from '../../styles/theme';

const Schemes = () => {
  const schemes = [
    { name: "PM Fasal Bima Yojana (PMFBY)", category: "Insurance", state: "All India", deadline: "March 31, 2025", benefit: "Up to ₹2 lakh crop insurance coverage at subsidized premium of 2% for Kharif crops", link: "#" },
    { name: "Kisan Credit Card (KCC)", category: "Credit", state: "All India", deadline: "Ongoing", benefit: "Flexible credit up to ₹3 lakh at 4% interest rate for agriculture needs", link: "#" },
    { name: "PM-KISAN Samman Nidhi", category: "Income Support", state: "All India", deadline: "Ongoing", benefit: "₹6,000 per year in 3 installments directly to farmer's bank account", link: "#" },
    { name: "Pradhan Mantri Krishi Sinchayee Yojana", category: "Irrigation", state: "All India", deadline: "2026", benefit: "Drip & sprinkler irrigation subsidy up to 90% for small & marginal farmers", link: "#" },
    { name: "Soil Health Card Scheme", category: "Soil Testing", state: "All India", deadline: "Ongoing", benefit: "Free soil testing and customized fertilizer recommendations every 3 years", link: "#" },
  ];

  const catColors = {
    Insurance: theme.alert,
    Credit: theme.rain,
    "Income Support": theme.wheat,
    Irrigation: theme.leaf,
    "Soil Testing": theme.clay
  };

  return (
    <div>
      <h2 style={{ color: theme.wheat, fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 8 }}>
        Government Schemes
      </h2>
      <p style={{ color: theme.mist, marginBottom: 24, opacity: 0.8, fontSize: 14 }}>
        Latest subsidies, insurance schemes, and financial support for farmers
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {schemes.map((s, i) => (
          <Card key={i} style={{ borderLeft: `3px solid ${catColors[s.category] || theme.wheat}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <h3 style={{ color: theme.cream, fontSize: 16, flex: 1 }}>{s.name}</h3>
              <Badge color={catColors[s.category] || theme.wheat}>{s.category}</Badge>
            </div>
            <p style={{ color: theme.cream, lineHeight: 1.7, marginBottom: 12, fontSize: 14 }}>{s.benefit}</p>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ color: theme.mist, fontSize: 12 }}>📍 {s.state}</span>
              <span style={{ color: theme.mist, fontSize: 12 }}>⏰ Deadline: {s.deadline}</span>
              <Btn variant="outline" style={{ marginLeft: "auto", padding: "6px 14px", fontSize: 12 }}>
                Apply Now →
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schemes;