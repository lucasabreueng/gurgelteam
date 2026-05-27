import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

const reps = [
  ["REVENUE_SOURCES", "FinancialServiceMock.getRevenueSources()"],
  ["EXPENSE_CATEGORIES", "FinancialServiceMock.getExpenseCategories()"],
  ["PACKAGE_CREDITS", "FinancialServiceMock.getPackageCredits()"],
  ["PACKAGE_STATUS_LABEL", "FinancialServiceMock.getPackageStatusLabels()"],
  ["DELINQUENCY_ITEMS", "FinancialServiceMock.getDelinquencyItems()"],
  ["DELINQUENCY_TOTAL", "FinancialServiceMock.getDelinquencyTotal()"],
  ["KART_FINANCIALS", "FinancialServiceMock.getKartFinancials()"],
  ["CLIENT_FINANCIALS", "FinancialServiceMock.getClientFinancials()"],
  ["FINANCIAL_REPORTS", "FinancialServiceMock.getFinancialReports()"],
  ["PAYMENT_METHODS", "FinancialServiceMock.getPaymentMethods()"],
  ["REVENUE_BY_SERVICE", "FinancialServiceMock.getRevenueByService()"],
  ["IN_OUT_CHART", "FinancialServiceMock.getInOutChart()"],
  ["FINANCIAL_EVOLUTION", "FinancialServiceMock.getFinancialEvolution()"],
];

const serviceImport =
  'import { FinancialServiceMock } from "@/services/finance/financialServiceMock";';

for (const file of walk("components/admin/financial")) {
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("admin-financial-mocks")) continue;
  const orig = c;

  for (const [from, to] of reps) {
    c = c.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  }

  c = c.replace(
    /import\s*\{[^}]*\}\s*from\s*"@\/lib\/admin-financial-mocks"\s*;?\n?/g,
    "",
  );

  if (c.includes("FinancialServiceMock.") && !c.includes(serviceImport)) {
    c = c.replace('"use client";', `"use client";\n\n${serviceImport}`);
    if (!c.includes(serviceImport)) c = `${serviceImport}\n${c}`;
  }

  if (c.includes("PackageCreditStatus") && !c.includes("@/lib/contracts/finance")) {
    c = c.replace(
      /("use client";\s*\n)?/,
      '$1import type { PackageCreditStatus } from "@/lib/contracts/finance";\n',
    );
  }

  if (c !== orig) fs.writeFileSync(file, c);
}

console.log("financial ui migrated");
