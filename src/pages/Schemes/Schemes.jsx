// src/pages/Schemes/Schemes.jsx
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Btn from '../../components/common/Button';
import { theme } from '../../styles/theme';

const Schemes = () => {
  const [expanded, setExpanded] = useState(null);

  const schemes = [
    {
      name: "PM Fasal Bima Yojana (PMFBY)",
      category: "Insurance",
      state: "All India",
      deadline: "August 14, 2025",
      benefit: "Up to ₹2 lakh crop insurance coverage at subsidized premium of 2% for Kharif crops",
      link: "https://www.pmfby.gov.in/",
      about: `PMFBY provides financial support to farmers suffering crop loss or damage due to unforeseen events like floods, drought, pests, or diseases. Farmers pay a very low premium — just 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial crops — and the rest is covered by the government. Claims are settled quickly using satellite and drone technology. It covers pre-sowing to post-harvest losses, including losses due to prevented sowing. Any farmer growing notified crops in notified areas is eligible — both loanee and non-loanee farmers can apply through their bank or CSC center.`,
    },
    {
      name: "Kisan Credit Card (KCC)",
      category: "Credit",
      state: "All India",
      deadline: "Ongoing",
      benefit: "Flexible credit up to ₹3 lakh at 4% interest rate for agriculture needs",
      link: "https://fasalrin.gov.in/",
      about: `KCC gives farmers easy access to affordable credit for buying seeds, fertilizers, pesticides, and other farming inputs — without needing to visit the bank repeatedly. The credit limit is set based on land holding and crop type, going up to ₹3 lakh at just 4% interest per year (after government interest subvention). It works like a revolving credit — repay after harvest and reuse. It also covers post-harvest expenses and household needs. Fishermen and animal husbandry farmers are also eligible. Apply at any nationalized bank, cooperative bank, or regional rural bank with your land records and ID proof.`,
    },
    {
      name: "PM-KISAN Samman Nidhi",
      category: "Income Support",
      state: "All India",
      deadline: "Ongoing",
      benefit: "₹6,000 per year in 3 installments directly to farmer's bank account",
      link: "https://pmkisan.gov.in/",
      about: `PM-KISAN gives all landholding farmer families ₹6,000 per year as direct income support, paid in three equal installments of ₹2,000 every four months straight into the farmer's Aadhaar-linked bank account — no middlemen. The money can be used for anything: seeds, fertilizers, daily needs, or loan repayment. To be eligible, you must own cultivable land. Exclusions include government employees, income taxpayers, and institutional landholders. Registration is free — visit your local patwari, revenue officer, or the PM-KISAN portal with your Aadhaar, bank passbook, and land documents.`,
    },
    {
      name: "Pradhan Mantri Krishi Sinchayee Yojana",
      category: "Irrigation",
      state: "All India",
      deadline: "2026",
      benefit: "Drip & sprinkler irrigation subsidy up to 90% for small & marginal farmers",
      link: "https://www.pmksy.gov.in/",
      about: `PMKSY follows the motto "Har Khet Ko Paani, More Crop Per Drop" — ensuring every farm gets water while using it efficiently. It subsidizes drip and sprinkler irrigation systems by up to 55% for large farmers and up to 90% for small and marginal farmers. This reduces water usage by up to 50% while increasing yield by 40–50%. The scheme also funds watershed development, groundwater recharge, and canal repair. Farmers can apply through their state agriculture department or district irrigation office. Having updated land records is important as the benefit is linked directly to them.`,
    },
    {
      name: "Soil Health Card Scheme",
      category: "Soil Testing",
      state: "All India",
      deadline: "Ongoing",
      benefit: "Free soil testing and customized fertilizer recommendations every 3 years",
      link: "https://soilhealth.dac.gov.in/home",
      about: `The Soil Health Card scheme provides every farmer a printed card every three years showing the nutrient status of their soil across 12 parameters — including NPK (Nitrogen, Phosphorus, Potassium), pH, organic carbon, and micronutrients. Along with the report, it gives crop-wise fertilizer recommendations so farmers stop over-using chemicals, saving money and improving soil long-term. Soil samples are collected by trained local workers from your field at no cost. Farmers who follow the recommendations typically see a 10–15% reduction in fertilizer costs and noticeable improvement in yield quality within one season.`,
    },
  ];

  const catColors = {
    Insurance:        theme.alert,
    Credit:           theme.rain,
    "Income Support": theme.wheat,
    Irrigation:       theme.leaf,
    "Soil Testing":   theme.clay,
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

            <p style={{ color: theme.cream, lineHeight: 1.7, marginBottom: 10, fontSize: 14 }}>{s.benefit}</p>

            {/* Toggle button */}
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: catColors[s.category] || theme.wheat,
                fontSize: 12, fontWeight: 600, padding: 0, marginBottom: 10,
                fontFamily: "'Poppins', sans-serif",
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {expanded === i ? '▲ Hide details' : '▼ About this scheme'}
            </button>

            {/* Expandable description */}
            {expanded === i && (
              <p style={{
                color: theme.mist, fontSize: 13, lineHeight: 1.85,
                marginBottom: 14, padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 8,
                borderLeft: `2px solid ${catColors[s.category] || theme.wheat}`,
              }}>
                {s.about}
              </p>
            )}

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ color: theme.mist, fontSize: 12 }}> {s.state}</span>
              <span style={{ color: theme.mist, fontSize: 12 }}> Deadline: {s.deadline}</span>
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "auto", textDecoration: "none" }}
              >
                <Btn variant="outline" style={{ padding: "6px 14px", fontSize: 12 }}>
                  Apply Now →
                </Btn>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Schemes;