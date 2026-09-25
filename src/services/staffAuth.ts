export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: 'Owner & Principal Jeweler' | 'Master Gemologist' | 'Atelier Manager' | 'Senior Consultant';
  password: string;
  phone?: string;
  createdAt: string;
}

export interface StaffSession {
  staffId: string;
  name: string;
  email: string;
  role: string;
  token: string;
  loginTime: string;
}

const DEFAULT_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff-jigna-01',
    name: 'Jigna Khakhar',
    email: 'jigna@elitedesignerjewelry.com',
    role: 'Owner & Principal Jeweler',
    password: 'Atelier2026!',
    phone: '+91 98200 89201',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'staff-pooja-02',
    name: 'Pooja Shah',
    email: 'manager@elitedesignerjewelry.com',
    role: 'Atelier Manager',
    password: 'Diamond2026!',
    phone: '+91 98200 89202',
    createdAt: '2026-02-15T00:00:00.000Z',
  }
];

const STAFF_ACCOUNTS_STORAGE_KEY = 'edj_staff_accounts';
const STAFF_SESSION_STORAGE_KEY = 'edj_staff_session';

export function getStaffAccounts(): StaffAccount[] {
  try {
    const raw = localStorage.getItem(STAFF_ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load staff accounts from localStorage', e);
  }
  // Initialize default
  try {
    localStorage.setItem(STAFF_ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_STAFF_ACCOUNTS));
  } catch {
    // ignore
  }
  return DEFAULT_STAFF_ACCOUNTS;
}

export function saveStaffAccounts(accounts: StaffAccount[]): void {
  try {
    localStorage.setItem(STAFF_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save staff accounts', e);
  }
}

export function getActiveStaffSession(): StaffSession | null {
  try {
    const raw = localStorage.getItem(STAFF_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: StaffSession = JSON.parse(raw);
    // Optional: check session validity (e.g. 7 days)
    if (session && session.staffId && session.email) {
      return session;
    }
  } catch (e) {
    console.error('Failed to parse staff session', e);
  }
  return null;
}

export function authenticateStaff(email: string, password: string): { success: boolean; session?: StaffSession; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getStaffAccounts();
  const staff = accounts.find(a => a.email.toLowerCase() === normalizedEmail);

  if (!staff) {
    return { success: false, error: 'Staff account not found with this email address.' };
  }

  if (staff.password !== password) {
    return { success: false, error: 'Incorrect staff password. Please verify your credentials.' };
  }

  const session: StaffSession = {
    staffId: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    token: `edj_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    loginTime: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STAFF_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to store staff session', e);
  }

  return { success: true, session };
}

export function clearStaffSession(): void {
  try {
    localStorage.removeItem(STAFF_SESSION_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear staff session', e);
  }
}

export function updateStaffPassword(staffId: string, currentPass: string, newPass: string): { success: boolean; error?: string } {
  const accounts = getStaffAccounts();
  const index = accounts.findIndex(a => a.id === staffId);
  if (index === -1) {
    return { success: false, error: 'Staff account not found.' };
  }

  if (accounts[index].password !== currentPass) {
    return { success: false, error: 'Current password does not match.' };
  }

  if (newPass.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }

  accounts[index].password = newPass;
  saveStaffAccounts(accounts);
  return { success: true };
}

export function createStaffAccount(account: Omit<StaffAccount, 'id' | 'createdAt'>): { success: boolean; error?: string; account?: StaffAccount } {
  const accounts = getStaffAccounts();
  const normalizedEmail = account.email.trim().toLowerCase();

  if (accounts.some(a => a.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'A staff member with this email already exists.' };
  }

  const newAccount: StaffAccount = {
    ...account,
    id: `staff_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  saveStaffAccounts(accounts);
  return { success: true, account: newAccount };
}
