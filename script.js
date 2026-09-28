/**
 * AGUKO OSMAN & CO. ADVOCATES - INTERACTIVE ENGINE
 * Tailored for Senior Partner Gad Aguko & Managing Partner Abdikadir Osman Mohamed
 * Nairobi, Kenya
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initHeaderScroll();
  initStampDutyCalculator();
  initCaseAssessmentWizard();
  initPracticeFilterAndModals();
  initConsultationForms();
  initQuickValChips();
  initScrollSpy();
  initBackToTop();
  initBriefs();
  initNotices();
  initMotion();
  initSpotlight();
});

function initSpotlight() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const cards = document.querySelectorAll('.practice-card, .pillar-card, .advocate-showcase-card, .insight-card, .contact-box, .hero-card, .calc-container-card, .assessment-card');
  cards.forEach(card => {
    card.classList.add('ao-spot');
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    });
  });
}

/* --------------------------------------------------------------------------
   Theme Switcher (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('ao_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(toggleBtn, currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('ao_theme', activeTheme);
    updateThemeIcon(toggleBtn, activeTheme);
  });
}

function updateThemeIcon(btn, theme) {
  if (theme === 'light') {
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    btn.setAttribute('title', 'Switch to Dark Mode');
  } else {
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    btn.setAttribute('title', 'Switch to Light Mode');
  }
}

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('closeMobileNav');
  const overlay = document.getElementById('drawerOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (!document.querySelector('.modal-backdrop.active')) document.body.style.overflow = '';
  };

  window.aoCloseDrawer = closeDrawer;

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   Header Scroll State
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   Kenyan Conveyancing & Stamp Duty Calculator (2026 Statutory Formula)
   -------------------------------------------------------------------------- */
function initStampDutyCalculator() {
  const propertyValInput = document.getElementById('calcPropertyVal');
  const locationTypeSelect = document.getElementById('calcLocationType');
  const transactionTypeSelect = document.getElementById('calcTransactionType');

  // Breakdown output elements
  const stampDutyRateEl = document.getElementById('outStampDutyRate');
  const stampDutyAmountEl = document.getElementById('outStampDutyAmount');
  const registrationFeeEl = document.getElementById('outRegFees');
  const searchDisbursementEl = document.getElementById('outDisbursements');
  const legalFeesEl = document.getElementById('outLegalFees');
  const vatEl = document.getElementById('outVAT');
  const totalCostEl = document.getElementById('outTotalEstimate');

  if (!propertyValInput) return;

  function calculate() {
    let rawVal = parseFloat(propertyValInput.value.replace(/[^0-9.]/g, '')) || 0;
    if (rawVal < 0) rawVal = 0;

    const locationType = locationTypeSelect ? locationTypeSelect.value : 'urban';
    const txType = transactionTypeSelect ? transactionTypeSelect.value : 'purchase';

    // 1. Kenyan Stamp Duty: Urban/Cities (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret) = 4%, Rural/Agricultural = 2%
    // In mortgages/charges, stamp duty is 0.1%
    let stampRate = 0.04;
    let rateLabel = '4.0% (Urban / City)';

    if (txType === 'charge') {
      stampRate = 0.001;
      rateLabel = '0.1% (Bank Charge/Mortgage)';
    } else if (locationType === 'rural') {
      stampRate = 0.02;
      rateLabel = '2.0% (Rural / Agricultural)';
    }

    const stampDuty = rawVal * stampRate;

    // 2. Statutory Land Registry & Ardhisasa Valuation fees
    const regFee = rawVal > 0 ? 5050 : 0;
    const disbursements = rawVal > 0 ? 15000 : 0;

    // 3. Estimated Legal Fees (Kenya Advocates Remuneration Order guidance)
    let baseLegalFee = 0;
    if (rawVal > 0) {
      if (rawVal <= 5000000) {
        baseLegalFee = Math.max(45000, rawVal * 0.02);
      } else if (rawVal <= 20000000) {
        baseLegalFee = 100000 + (rawVal - 5000000) * 0.015;
      } else if (rawVal <= 50000000) {
        baseLegalFee = 325000 + (rawVal - 20000000) * 0.0125;
      } else {
        baseLegalFee = 700000 + (rawVal - 50000000) * 0.01;
      }
    }

    // 4. Kenya VAT (16%) on legal services
    const vat = baseLegalFee * 0.16;

    // 5. Total
    const totalEst = stampDuty + regFee + disbursements + baseLegalFee + vat;

    // Update UI
    if (stampDutyRateEl) stampDutyRateEl.textContent = rateLabel;
    if (stampDutyAmountEl) stampDutyAmountEl.textContent = formatKES(stampDuty);
    if (registrationFeeEl) registrationFeeEl.textContent = formatKES(regFee);
    if (searchDisbursementEl) searchDisbursementEl.textContent = formatKES(disbursements);
    if (legalFeesEl) legalFeesEl.textContent = formatKES(baseLegalFee);
    if (vatEl) vatEl.textContent = formatKES(vat);
    if (totalCostEl) totalCostEl.textContent = formatKES(totalEst);
  }

  // Format input with commas while typing
  propertyValInput.addEventListener('input', (e) => {
    let cleanVal = e.target.value.replace(/[^0-9]/g, '');
    if (cleanVal) {
      e.target.value = parseInt(cleanVal, 10).toLocaleString('en-US');
    }
    calculate();
  });

  if (locationTypeSelect) locationTypeSelect.addEventListener('change', calculate);
  if (transactionTypeSelect) transactionTypeSelect.addEventListener('change', calculate);

  calculate();
}

function formatKES(num) {
  return 'KES ' + Math.round(num).toLocaleString('en-US');
}

function initQuickValChips() {
  const chips = document.querySelectorAll('.val-chip');
  const input = document.getElementById('calcPropertyVal');
  if (!input) return;

  const markActive = () => {
    const current = parseInt(input.value.replace(/[^0-9]/g, ''), 10);
    chips.forEach(chip => {
      chip.classList.toggle('active', parseInt(chip.getAttribute('data-value'), 10) === current);
    });
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-value');
      input.value = parseInt(val, 10).toLocaleString('en-US');
      input.dispatchEvent(new Event('input'));
    });
  });

  input.addEventListener('input', markActive);
  markActive();
}

/* --------------------------------------------------------------------------
   Practice Filter & Detail Modals (12 Comprehensive Practice Areas)
   -------------------------------------------------------------------------- */
const practiceDetailsData = {
  litigation: {
    title: 'Dispute Resolution & Litigation',
    leadPartner: 'Gad Aguko (Senior Partner)',
    statute: 'Civil Procedure Act (Cap 21), Appellate Jurisdiction Act',
    overview: 'Directed by Senior Partner Gad Aguko (recognised by The Lawyer Africa as a Top Litigation Lawyer), our team represents corporate entities, institutions, and individuals across high-stakes trial and appellate benches.',
    services: [
      'Commercial Contract Litigation & Urgent High Court Injunctions',
      'Shareholder & Boardroom Governance Conflicts',
      'Fraud-Related Disputes & Asset Tracing Litigation',
      'Land & Property Dispute Defense before the Environment & Land Court',
      'Commercial Arbitration & Mediation proceedings'
    ],
    highlight: 'Direct partner courtroom advocacy in the Commercial and Admiralty, Constitutional, and Appellate benches in Nairobi.'
  },
  corporate: {
    title: 'Corporate & Commercial Law',
    leadPartner: 'Abdikadir Osman Mohamed & Gad Aguko',
    statute: 'Companies Act No. 17 of 2015, Competition Act 2010',
    overview: 'Strategic transactional and commercial advisory for domestic enterprises, multinationals, and joint ventures navigating Kenya and the wider East African Community.',
    services: [
      'Company Registration, Capital Structuring & BRS Compliance',
      'Mergers, Acquisitions & Corporate Reorganizations',
      'Commercial Contracts, Distribution & Agency Agreements',
      'Corporate Governance Audits & Boardroom Advisory',
      'East African Regional Expansion & Foreign Direct Investment (FDI)'
    ],
    highlight: 'Combining legal precision with commercial acumen to facilitate smooth, compliant transactions.'
  },
  conveyancing: {
    title: 'Real Estate & Conveyancing',
    leadPartner: 'Gad Aguko (Recognised in Top Real Estate & Finance Lawyers)',
    statute: 'Land Registration Act 2012, Land Act 2012, Sectional Properties Act 2020',
    overview: 'Comprehensive property advisory managing residential and commercial conveyancing across Kenya with specialized mastery of the digital Ardhisasa platform.',
    services: [
      'Digital Land Searches, Green Card Verification & Ardhisasa Transfers',
      'Commercial Property Leases, Development Joint Ventures & Subdivisions',
      'Perfection of Bank Security (Charges, Mortgages, Debentures)',
      'Sectional Property Conversion & Sectional Title Issuance',
      'Litigation representation in the Environment and Land Court (ELC)'
    ],
    highlight: 'Complete due diligence shielding buyers, lenders, and developers from defective titles and land fraud.'
  },
  banking: {
    title: 'Banking, Finance & Capital Markets',
    leadPartner: 'Gad Aguko & Banking Advisory Team',
    statute: 'Banking Act (Cap 488), Capital Markets Act (Cap 485A), Insolvency Act 2015',
    overview: 'Counsel to commercial banks, SACCOs, private equity funds, and corporate borrowers on debt financing, capital raising, and securities perfection.',
    services: [
      'Drafting & Perfection of Legal Charges, Guarantees & Debentures',
      'Loan Syndication Agreements & Project Finance Documentation',
      'Capital Markets Issuances & Regulatory Compliance with CMA',
      'Secured Asset Realization & Statutory Power of Sale execution',
      'Debt Restructuring, Workouts & Insolvency Advisory'
    ],
    highlight: 'High-turnaround security documentation maintaining unassailable legal priority for institutional lenders.'
  },
  employment: {
    title: 'Employment & Labour Relations',
    leadPartner: 'Abdikadir Osman Mohamed (Certified Mediator MTI-K)',
    statute: 'Employment Act 2007, Labour Relations Act, Labour Institutions Act',
    overview: 'Proactive advisory and contentious representation in workplace legal relations, protecting employers and executive employees in contentious disputes.',
    services: [
      'Structuring Statutory Redundancy Procedures under the Employment Act',
      'Drafting Executive Employment Contracts & Restrictive Covenants',
      'Workplace Investigations, Disciplinary Hearings & Separation Agreements',
      'Collective Bargaining Agreement (CBA) Negotiations & Union Relations',
      'Defense in the Employment and Labour Relations Court (ELRC)'
    ],
    highlight: 'Expert mediation to de-escalate sensitive workplace disputes before costly public litigation.'
  },
  family: {
    title: 'Family Law & Succession Planning',
    leadPartner: 'Private Client Practice Group',
    statute: 'Law of Succession Act (Cap 160), Matrimonial Property Act 2013',
    overview: 'Discreet, compassionate, and legally robust estate administration and family dispute resolution for Kenyan families and diaspora estate owners.',
    services: [
      'Probate Petitions & Letters of Administration in the High Court',
      'Drafting Wills, Living Trusts & Generational Wealth Vehicles',
      'Distribution of Deceased Estates & Confirmation of Grants',
      'Matrimonial Property Division & Pre-nuptial Agreements',
      'Mediation of Family Inheritance Disputes'
    ],
    highlight: 'Preserving family harmony and asset stability through expert succession planning.'
  },
  tax: {
    title: 'Tax Advisory & KRA Dispute Resolution',
    leadPartner: 'Tax Practice Department',
    statute: 'Tax Procedures Act 2015, Income Tax Act, Value Added Tax Act 2013',
    overview: 'Proactive tax structuring and formidable advocacy in contentious disputes before the Kenya Revenue Authority (KRA) and the Tax Appeals Tribunal.',
    services: [
      'KRA Audit Defense & Notice of Assessment Objections',
      'Representation before the Tax Appeals Tribunal & High Court Tax Appeals',
      'Transaction Tax Structuring for Real Estate and M&A Transactions',
      'Value Added Tax (VAT), Capital Gains Tax (CGT) & Withholding Tax Advice',
      'Alternative Dispute Resolution (ADR) negotiations with the KRA'
    ],
    highlight: 'Protecting clients against aggressive and arbitrary revenue assessments.'
  },
  debt: {
    title: 'Debt Collection & Recovery',
    leadPartner: 'Commercial Recovery Division',
    statute: 'Insolvency Act 2015, Civil Procedure Rules',
    overview: 'Aggressive yet commercially tactical recovery of outstanding commercial, institutional, and individual debts across Kenya.',
    services: [
      'Issuance of Statutory Demand Letters & Pre-Litigation Negotiations',
      'Fast-Track Commercial Court Summary Judgments',
      'Attachment of Debtor Assets & Garnishee Proceedings',
      'Bankruptcy & Corporate Liquidation Petitions',
      'Cross-Border Debt Recovery across East Africa'
    ],
    highlight: 'Rapid recovery from initial debtor contact through to court judgment enforcement.'
  },
  ip: {
    title: 'Intellectual Property Protection',
    leadPartner: 'IP & Technology Department',
    statute: 'Trade Marks Act (Cap 506), Copyright Act 2001, Industrial Property Act',
    overview: 'Securing trademarks, patents, software rights, and trade secrets for Kenyan entrepreneurs, institutions, and international brand owners.',
    services: [
      'Trademark, Patent & Industrial Design Filings at KIPI',
      'Copyright Protection & Anti-Counterfeit Authority (ACA) Actions',
      'Software Licensing, SaaS Agreements & Data Protection (ODPC) Audits',
      'Brand Infringement Litigation & Cease-and-Desist Enforcement',
      'Franchising & Technology Transfer Contracts'
    ],
    highlight: 'Comprehensive brand and innovation defense across Kenya and the ARIPO region.'
  },
  policy: {
    title: 'Government, Policy & Legislative Drafting',
    leadPartner: 'Gad Aguko (Senior Partner)',
    statute: 'Constitution of Kenya 2010, Statutory Instruments Act, Public Procurement Act',
    overview: 'Advising public bodies, regulatory authorities, trade associations, and private corporations on legislative frameworks and administrative policy.',
    services: [
      'Drafting Bills, Regulations, Codes of Practice & By-Laws',
      'Public Procurement and Asset Disposal Review Board (PPARB) Appeals',
      'Statutory & Constitutional Compliance Audits',
      'Regulatory Impact Assessments & Stakeholder Submissions',
      'Judicial Review of Administrative Agency Actions'
    ],
    highlight: 'Extensive experience in high-impact public interest jurisprudence and regulatory reform.'
  },
  energy: {
    title: 'Telecoms, Mining, Energy & Natural Resources',
    leadPartner: 'Energy & Natural Resources Group',
    statute: 'Mining Act 2016, Energy Act 2019, Kenya Information and Communications Act',
    overview: 'Sector-specific regulatory, environmental, and commercial counsel in capital-intensive extractive and network industries.',
    services: [
      'Mineral Prospecting, Mining Licenses & Royalty Structuring',
      'Renewable Energy Project Development & Power Purchase Agreements (PPAs)',
      'Communications Authority of Kenya (CAK) Telecoms Licensing',
      'Environmental Impact Assessment (EIA) Compliance with NEMA',
      'Community Land Access & Local Content Compliance'
    ],
    highlight: 'Navigating Kenya\'s stringent regulatory and licensing frameworks for major infrastructure assets.'
  },
  forensic: {
    title: 'Forensic & Litigation Consulting',
    leadPartner: 'Dispute Resolution & Forensic Team',
    statute: 'Evidence Act (Cap 80), Computer Misuse and Cybercrimes Act',
    overview: 'Technical litigation support combining electronic evidence, forensic accounting, and damages assessment for complex fraud and corporate trials.',
    services: [
      'Electronic Digital Evidence Extraction & Chain of Custody Protocol',
      'Forensic Audit Support & Asset Tracing in Corporate Fraud',
      'Damages Quantification & Lost Profit Valuations in Breach of Contract',
      'Expert Witness Coordination for High Court Commercial Bench',
      'Internal Corporate Investigations & Anti-Bribery Compliance'
    ],
    highlight: 'Empowering courtroom advocacy with unassailable forensic proof and financial documentation.'
  }
};

function initPracticeFilterAndModals() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.practice-card');
  const modalBackdrop = document.getElementById('practiceDetailModal');
  const closeBtn = document.getElementById('closePracticeModal');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal detail trigger
  const triggerDetail = (key) => {
    const data = practiceDetailsData[key];
    if (!data || !modalBackdrop) return;

    document.getElementById('modalPracticeTitle').textContent = data.title;
    document.getElementById('modalPracticeLead').textContent = data.leadPartner;
    document.getElementById('modalPracticeStatute').textContent = data.statute;
    document.getElementById('modalPracticeOverview').textContent = data.overview;
    document.getElementById('modalPracticeHighlight').textContent = data.highlight;

    const listEl = document.getElementById('modalPracticeServicesList');
    listEl.innerHTML = '';
    data.services.forEach(srv => {
      const li = document.createElement('li');
      li.className = 'card-feature';
      li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${srv}</span>`;
      listEl.appendChild(li);
    });

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('.open-practice-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-practice-key');
      triggerDetail(key);
    });
  });

  const closeModal = () => {
    if (modalBackdrop) closeNamedModal(modalBackdrop.id);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Quick book from modal
  const modalBookBtn = document.getElementById('modalBookConsultationBtn');
  if (modalBookBtn) {
    modalBookBtn.addEventListener('click', () => {
      closeModal();
      const consultSection = document.getElementById('consultation');
      if (consultSection) consultSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   Interactive Legal Assessment Wizard
   -------------------------------------------------------------------------- */
function initCaseAssessmentWizard() {
  const wizardContainer = document.getElementById('legalAssessmentWizard');
  if (!wizardContainer) return;

  let wizardState = {
    domain: '',
    urgency: '',
    advocate: 'Gad Aguko'
  };

  const steps = [
    document.getElementById('wizardStep1'),
    document.getElementById('wizardStep2'),
    document.getElementById('wizardStep3')
  ];

  const bullets = document.querySelectorAll('.wizard-step-bullet');

  function setStep(stepIndex) {
    steps.forEach((step, idx) => {
      if (step) {
        step.classList.toggle('active', idx === stepIndex);
      }
    });
    bullets.forEach((bullet, idx) => {
      bullet.classList.toggle('active', idx <= stepIndex);
    });
  }

  // Step 1 Options
  const domainButtons = document.querySelectorAll('.assessment-opt-domain');
  domainButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      domainButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      wizardState.domain = btn.getAttribute('data-val');
      setStep(1);
    });
  });

  // Step 2 Options
  const urgencyButtons = document.querySelectorAll('.assessment-opt-urgency');
  urgencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      urgencyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      wizardState.urgency = btn.getAttribute('data-val');
      generateRecommendation();
      setStep(2);
    });
  });

  function generateRecommendation() {
    const recTextEl = document.getElementById('wizardRecommendationText');
    const recAdvocateEl = document.getElementById('wizardRecAdvocate');

    let recTitle = '';
    let assignedAdvocate = 'Gad Aguko (Senior Partner)';

    if (wizardState.domain === 'litigation') {
      recTitle = 'High Court Litigation & Injunction Strategy';
      assignedAdvocate = 'Gad Aguko (Senior Partner - Litigation Specialist)';
    } else if (wizardState.domain === 'property') {
      recTitle = 'Conveyancing & Land Title Due Diligence';
      assignedAdvocate = 'Gad Aguko (Recognised Top Real Estate & Finance Lawyer)';
    } else if (wizardState.domain === 'corporate') {
      recTitle = 'Commercial Advisory & Mediation Framework';
      assignedAdvocate = 'Abdikadir Osman Mohamed (Managing Partner & Certified Mediator)';
    } else if (wizardState.domain === 'employment') {
      recTitle = 'Employment Dispute & Redundancy Advisory';
      assignedAdvocate = 'Abdikadir Osman Mohamed & Labour Practice Group';
    } else {
      recTitle = 'Private Legal Counsel & Strategic Review';
      assignedAdvocate = 'Senior Partners Desk';
    }

    if (recTextEl) {
      recTextEl.textContent = `${recTitle}: Based on your matter urgency (${wizardState.urgency}), our advocates recommend an immediate formal consultation at our Cianda House chambers or via phone/WhatsApp (+254 743 923 365).`;
    }
    if (recAdvocateEl) {
      recAdvocateEl.textContent = assignedAdvocate;
    }

    // Prefill consultation form
    const consultPracticeSelect = document.getElementById('consultPractice');
    const consultAdvocateSelect = document.getElementById('consultAdvocate');
    const practiceForDomain = {
      litigation: 'litigation',
      property: 'conveyancing',
      corporate: 'corporate',
      employment: 'employment'
    };
    if (consultPracticeSelect && practiceForDomain[wizardState.domain]) {
      consultPracticeSelect.value = practiceForDomain[wizardState.domain];
    }
    if (consultAdvocateSelect) {
      if (wizardState.domain === 'litigation' || wizardState.domain === 'property') {
        consultAdvocateSelect.value = 'Gad Aguko (Senior Partner)';
      } else if (wizardState.domain === 'corporate' || wizardState.domain === 'employment') {
        consultAdvocateSelect.value = 'Abdikadir Osman Mohamed (Managing Partner)';
      }
    }
  }

  // Wizard reset
  const resetBtn = document.getElementById('wizardResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      wizardState = { domain: '', urgency: '', advocate: 'Gad Aguko' };
      setStep(0);
      domainButtons.forEach(b => b.classList.remove('selected'));
      urgencyButtons.forEach(b => b.classList.remove('selected'));
    });
  }
}

/* --------------------------------------------------------------------------
   Consultation Booking & Contact Forms
   -------------------------------------------------------------------------- */
function initConsultationForms() {
  const consultForm = document.getElementById('consultationBookingForm');

  const dateInput = document.getElementById('consultDate');
  const setDateMin = () => {
    if (!dateInput) return;
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    dateInput.min = local.toISOString().slice(0, 10);
  };
  setDateMin();

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('consultName')?.value.trim() || 'Client';
      const phone = document.getElementById('consultPhone')?.value.trim() || '';
      const email = document.getElementById('consultEmail')?.value.trim() || '';
      const advocate = document.getElementById('consultAdvocate')?.value || 'First available partner';
      const practiceSelect = document.getElementById('consultPractice');
      const practice = practiceSelect?.selectedOptions?.[0]?.text || 'General';
      const date = document.getElementById('consultDate')?.value || 'Next available date';
      const notes = document.getElementById('consultNotes')?.value.trim() || '';

      const brief = [
        'Consultation request for Aguko Osman & Co. Advocates',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Preferred advocate: ${advocate}`,
        `Matter: ${practice}`,
        `Preferred date: ${date}`,
        notes ? `Notes: ${notes}` : ''
      ].filter(Boolean).join('\n');

      const url = 'https://wa.me/254743923365?text=' + encodeURIComponent(brief);
      const opened = window.open(url, '_blank', 'noopener');
      if (opened) {
        showToast('WhatsApp is opening with your brief. Send that message so the chambers can confirm the consultation.');
        consultForm.reset();
        setDateMin();
      } else {
        showToast('Your browser blocked the WhatsApp window. Allow pop-ups for this site, or use the WhatsApp button below the form.');
      }
    });
  }
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-link, .mobile-nav-link'));
  const groups = new Map();
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#') || href === '#') return;
    const section = document.querySelector(href);
    if (!section) return;
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(link);
  });
  const place = (section) => section.getBoundingClientRect().top + window.scrollY;
  const items = Array.from(groups.entries()).sort((a, b) => place(a[0]) - place(b[0]));
  if (!items.length) return;

  const mark = () => {
    const line = window.scrollY + 140;
    let active = items[0];
    items.forEach(([section, group]) => {
      if (place(section) <= line) active = [section, group];
    });
    links.forEach((link) => link.classList.remove('is-active'));
    active[1].forEach((link) => link.classList.add('is-active'));
  };

  window.addEventListener('scroll', mark, { passive: true });
  mark();
}

function initBriefs() {
  const modal = document.getElementById('insightModal');
  const title = document.getElementById('insightModalTitle');
  const tag = document.getElementById('insightModalTag');
  const body = document.getElementById('insightModalBody');
  if (!modal || !title || !tag || !body) return;

  const briefs = {
    conveyancing: {
      tag: 'Real estate',
      title: 'Due diligence before a transfer',
      paragraphs: [
        'Before money moves, confirm who is registered as proprietor and whether the title the seller is offering matches the land being sold.',
        'Ask what else sits on the title: a charge, a caution, or unpaid land rent and rates. Where the title is on Ardhisasa, the search is done on that system. Older titles may still need a registry search.',
        'Consent to transfer depends on the tenure. A leasehold from the government, a chargee, or a lessor can each require a different consent. The file should show which one applies before the agreement is treated as ready to complete.'
      ]
    },
    redundancy: {
      tag: 'Employment',
      title: 'Redundancy is a process, not only a reason',
      paragraphs: [
        'A genuine loss of a role is not, by itself, a fair dismissal. The Employment Act also looks at how the employer carried it out.',
        'That process includes notice, consultation, and a way of choosing who goes when more than one person could be selected. The labour officer is part of that sequence. Skipping it is what usually turns a real redundancy into an unfair termination claim.',
        'Severance and the other terminal dues still have to be calculated. The notice period and the amount depend on the contract and the statute, so they should be checked against the particular letters, not assumed from a template.'
      ]
    },
    arbitration: {
      tag: 'Disputes',
      title: 'Arbitration or the court',
      paragraphs: [
        'If the contract has an arbitration clause, that is usually the forum, unless the parties agree otherwise or a court is asked to deal with a point the clause does not cover.',
        'The practical differences are privacy, who picks the tribunal, how easy an appeal is, and what the process costs. A court judgment and an award are enforced in different ways.',
        'A foreign award is not automatically a Kenyan judgment. Enforcement depends on the Arbitration Act and, where it applies, the New York Convention. The clause, the seat, and the award all have to be read together.'
      ]
    }
  };

  const open = (key) => {
    const brief = briefs[key];
    if (!brief) return;
    tag.textContent = brief.tag;
    title.textContent = brief.title;
    body.replaceChildren();
    brief.paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      body.appendChild(p);
    });
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('[data-brief]').forEach((button) => {
    button.addEventListener('click', () => open(button.getAttribute('data-brief')));
  });
}

function initNotices() {
  const modal = document.getElementById('noticeModal');
  if (!modal) return;
  const open = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  document.querySelectorAll('[data-notice]').forEach((button) => {
    button.addEventListener('click', open);
  });
}

function closeNamedModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  if (!document.querySelector('.modal-backdrop.active')) document.body.style.overflow = '';
}

document.addEventListener('click', (event) => {
  const closer = event.target.closest('[data-close-modal]');
  if (closer) {
    const id = closer.getAttribute('data-close-modal');
    if (closer.tagName !== 'A') event.preventDefault();
    closeNamedModal(id);
    return;
  }
  if (event.target.classList && event.target.classList.contains('modal-backdrop') && event.target.id) {
    closeNamedModal(event.target.id);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.modal-backdrop.active').forEach((modal) => {
    modal.classList.remove('active');
  });
  if (typeof window.aoCloseDrawer === 'function') window.aoCloseDrawer();
  document.body.style.overflow = '';
});

const copyrightYear = document.getElementById('copyrightYear');
if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());

function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = document.querySelectorAll([
    '.section-header',
    '.section-head',
    '.pillar-card',
    '.advocate-showcase-card',
    '.practice-card',
    '.insight-card',
    '.contact-box',
    '.consultation-form-card',
    '.assessment-card',
    '.calc-container-card',
    '.stat-item'
  ].join(','));

  if (reduce) {
    nodes.forEach((node) => node.classList.add('ao-in'));
    return;
  }

  nodes.forEach((node) => {
    node.classList.add('ao-reveal');
    const parent = node.parentElement;
    const siblings = parent ? [...parent.children].filter((child) => child.classList.contains('ao-reveal')) : [];
    const index = Math.max(0, siblings.indexOf(node));
    node.style.transitionDelay = Math.min(index, 8) * 90 + 'ms';
  });

  const show = (node) => {
    node.classList.add('ao-in');
    node.querySelectorAll('.stat-number').forEach(countUp);
    if (node.classList.contains('stat-item')) countUp(node.querySelector('.stat-number'));
  };

  if (!('IntersectionObserver' in window)) {
    nodes.forEach(show);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  nodes.forEach((node) => observer.observe(node));
}

function countUp(el) {
  if (!el || el.dataset.counted) return;
  const raw = el.textContent.trim();
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return;
  el.dataset.counted = '1';
  const target = Number(match[1]);
  const suffix = match[2] || '';
  const start = performance.now();
  const duration = 900;
  const tick = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initBackToTop() {
  const button = document.getElementById('toTop');
  if (!button) return;
  const toggle = () => button.classList.toggle('is-visible', window.scrollY > 700);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  button.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon-success">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </span>
    <div>
      <strong style="color: var(--gold-400); display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Aguko Osman & Co. Advocates</strong>
      <span class="toast-message"></span>
    </div>
  `;
  const messageNode = toast.querySelector('.toast-message');
  if (messageNode) messageNode.textContent = message;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 6000);
}
