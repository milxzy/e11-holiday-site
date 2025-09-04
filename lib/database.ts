// Fake in-memory database for tracking users and generations
import fs from 'fs/promises';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
}

export interface Generation {
  id: string;
  userId: string;
  company: string;
  mode: 'staff' | 'upload';
  imageUrl: string;
  prompt: string;
  createdAt: string;
  userDetails: {
    name: string;
    email: string;
  };
}

export interface CompanyStats {
  company: string;
  totalGenerations: number;
  limit: number;
  remainingGenerations: number;
  users: User[];
  recentGenerations: Generation[];
}

// In-memory storage (will reset on server restart)
let users: User[] = [];
let generations: Generation[] = [];

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const GENERATIONS_FILE = path.join(DATA_DIR, 'generations.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Load data from files
async function loadData() {
  try {
    await ensureDataDir();
    
    try {
      const usersData = await fs.readFile(USERS_FILE, 'utf-8');
      users = JSON.parse(usersData);
    } catch {
      users = [];
    }
    
    try {
      const generationsData = await fs.readFile(GENERATIONS_FILE, 'utf-8');
      generations = JSON.parse(generationsData);
    } catch {
      generations = [];
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Save data to files
async function saveData() {
  try {
    await ensureDataDir();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    await fs.writeFile(GENERATIONS_FILE, JSON.stringify(generations, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Initialize data loading
loadData();

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export async function createUser(name: string, email: string, company: string): Promise<User> {
  const existingUser = users.find(u => u.email === email && u.company === company);
  if (existingUser) {
    return existingUser;
  }

  const user: User = {
    id: generateId(),
    name,
    email,
    company: company.toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await saveData();
  return user;
}

export async function createGeneration(
  userId: string,
  company: string,
  mode: 'staff' | 'upload',
  imageUrl: string,
  prompt: string,
  userDetails: { name: string; email: string }
): Promise<Generation> {
  const generation: Generation = {
    id: generateId(),
    userId,
    company: company.toLowerCase(),
    mode,
    imageUrl,
    prompt,
    createdAt: new Date().toISOString(),
    userDetails,
  };

  generations.push(generation);
  await saveData();
  return generation;
}

export function getCompanyLimits(): Record<string, number> {
  try {
    return JSON.parse(process.env.COMPANY_LIMITS || '{}');
  } catch {
    return {};
  }
}

export function getCompanyGenerationCount(company: string): number {
  return generations.filter(g => g.company.toLowerCase() === company.toLowerCase()).length;
}

export function canCompanyGenerate(company: string): boolean {
  const limits = getCompanyLimits();
  const companyLower = company.toLowerCase();
  const limit = limits[companyLower] || 10; // default limit
  const currentCount = getCompanyGenerationCount(companyLower);
  return currentCount < limit;
}

export function getCompanyStats(company: string): CompanyStats {
  const companyLower = company.toLowerCase();
  const limits = getCompanyLimits();
  const limit = limits[companyLower] || 10;
  const totalGenerations = getCompanyGenerationCount(companyLower);
  const companyUsers = users.filter(u => u.company === companyLower);
  const companyGenerations = generations
    .filter(g => g.company === companyLower)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10); // latest 10

  return {
    company: companyLower,
    totalGenerations,
    limit,
    remainingGenerations: Math.max(0, limit - totalGenerations),
    users: companyUsers,
    recentGenerations: companyGenerations,
  };
}

export function getAllStats(): CompanyStats[] {
  const limits = getCompanyLimits();
  const companies = Object.keys(limits);
  
  return companies.map(company => getCompanyStats(company));
}

export function getAllGenerations(): Generation[] {
  return generations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllUsers(): User[] {
  return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getGenerationById(id: string): Generation | undefined {
  return generations.find(g => g.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}