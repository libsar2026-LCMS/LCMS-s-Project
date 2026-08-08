"use client";

import { Printer } from "lucide-react";

export function PrintCardButton() {
  const handlePrint = () => {
    const card = document.getElementById("membership-card");
    if (!card) return;

    const html = card.outerHTML;
    const win = window.open("", "_blank", "width=600,height=500");
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>LIBSAR Membership Card</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 32px; background: #f1f5f9; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    @media print {
      body { padding: 0; background: white; }
      @page { margin: 10mm; size: 85.6mm 53.98mm landscape; }
    }
  </style>
</head>
<body>
  ${html}
  <script>
    window.onload = () => { window.print(); window.onafterprint = () => window.close(); };
  <\/script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary shadow-sm transition hover:border-primary/30 hover:text-primary print:hidden"
    >
      <Printer size={15} /> Print Card
    </button>
  );
}
