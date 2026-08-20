import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const ORDERS_SHEET = 'Orders';
const ORDER_ITEMS_SHEET = 'OrderItems';

export interface OrderRow {
  orderCode: string;
  createdAt: string;
  dealerName: string;
  customerName: string;
  phone: string;
  note: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
}

export interface OrderItemRow {
  orderCode: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderRegistration {
  orderCode: string;
  createdAt: string;
  dealerName: string;
  customerName: string;
  phone: string;
  note: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: string;
}

function isConfigured(): boolean {
  return Boolean(SHEET_ID && CLIENT_EMAIL && PRIVATE_KEY);
}

export function getGoogleSheetsClient() {
  if (!isConfigured()) {
    throw new Error('Google Sheets credentials are not configured');
  }
  const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function ensureHeaders(
  sheets: ReturnType<typeof getGoogleSheetsClient>,
  sheetName: string,
  headers: string[]
) {
  const range = `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  });
  const existing = res.data.values?.[0];
  const expected = headers.join(',');
  if (!existing || existing.join(',') !== expected) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
  }
}

export async function appendOrder(order: OrderRow): Promise<void> {
  if (!isConfigured()) {
    console.warn('[google-sheets] Skipped appendOrder — credentials not set');
    return;
  }
  const sheets = getGoogleSheetsClient();
  const headers = [
    'orderCode',
    'createdAt',
    'dealerName',
    'customerName',
    'phone',
    'note',
    'subtotalAmount',
    'discountAmount',
    'totalAmount',
    'status',
  ];
  await ensureHeaders(sheets, ORDERS_SHEET, headers);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${ORDERS_SHEET}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          order.orderCode,
          order.createdAt,
          order.dealerName,
          order.customerName,
          order.phone,
          order.note,
          order.subtotalAmount,
          order.discountAmount,
          order.totalAmount,
          order.status,
        ],
      ],
    },
  });
}

export async function appendOrderItems(items: OrderItemRow[]): Promise<void> {
  if (!isConfigured()) {
    console.warn('[google-sheets] Skipped appendOrderItems — credentials not set');
    return;
  }
  if (items.length === 0) return;
  const sheets = getGoogleSheetsClient();
  const headers = [
    'orderCode',
    'productId',
    'productName',
    'productCode',
    'quantity',
    'unitPrice',
    'totalPrice',
  ];
  await ensureHeaders(sheets, ORDER_ITEMS_SHEET, headers);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${ORDER_ITEMS_SHEET}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: items.map((i) => [
        i.orderCode,
        i.productId,
        i.productName,
        i.productCode,
        i.quantity,
        i.unitPrice,
        i.totalPrice,
      ]),
    },
  });
}

export async function getOrderRegistrations(): Promise<OrderRegistration[]> {
  if (!isConfigured()) {
    throw new Error('Google Sheets credentials are not configured');
  }

  const sheets = getGoogleSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${ORDERS_SHEET}!A:Z`,
  });
  const rows = res.data.values ?? [];
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => String(header));
  const valueAt = (row: unknown[], key: string): string => {
    const index = headers.indexOf(key);
    return index === -1 ? '' : String(row[index] ?? '');
  };
  const amountAt = (row: unknown[], key: string): number => {
    const value = Number(valueAt(row, key));
    return Number.isFinite(value) ? value : 0;
  };

  return rows.slice(1).map((row) => ({
    orderCode: valueAt(row, 'orderCode'),
    createdAt: valueAt(row, 'createdAt'),
    dealerName: valueAt(row, 'dealerName'),
    customerName: valueAt(row, 'customerName'),
    phone: valueAt(row, 'phone'),
    note: valueAt(row, 'note'),
    subtotalAmount: amountAt(row, 'subtotalAmount'),
    discountAmount: amountAt(row, 'discountAmount'),
    totalAmount: amountAt(row, 'totalAmount'),
    status: valueAt(row, 'status'),
  }));
}

export async function getOrderItems(): Promise<OrderItemRow[]> {
  if (!isConfigured()) {
    throw new Error('Google Sheets credentials are not configured');
  }

  const sheets = getGoogleSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${ORDER_ITEMS_SHEET}!A:Z`,
  });
  const rows = res.data.values ?? [];
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => String(header));
  const valueAt = (row: unknown[], key: string): string => {
    const index = headers.indexOf(key);
    return index === -1 ? '' : String(row[index] ?? '');
  };
  const amountAt = (row: unknown[], key: string): number => {
    const value = Number(valueAt(row, key));
    return Number.isFinite(value) ? value : 0;
  };

  return rows.slice(1).map((row) => ({
    orderCode: valueAt(row, 'orderCode'),
    productId: valueAt(row, 'productId'),
    productName: valueAt(row, 'productName'),
    productCode: valueAt(row, 'productCode'),
    quantity: amountAt(row, 'quantity'),
    unitPrice: amountAt(row, 'unitPrice'),
    totalPrice: amountAt(row, 'totalPrice'),
  }));
}

export function formatTimestamp(date: Date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}
