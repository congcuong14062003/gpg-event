import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const ORDERS_SHEET = 'Orders';
const ORDER_ITEMS_SHEET = 'OrderItems';

export interface OrderRow {
  orderCode: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  company: string;
  address: string;
  note: string;
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
    'customerName',
    'phone',
    'email',
    'company',
    'address',
    'note',
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
          order.customerName,
          order.phone,
          order.email,
          order.company,
          order.address,
          order.note,
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

export function formatTimestamp(date: Date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}
