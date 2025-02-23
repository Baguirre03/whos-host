export enum PartyStatus {
  PLANNING = "PLANNING",
  PLANNED = "PLANNED",
  COMPLETED = "COMPLETED",
}

export enum HostType {
  CLOSEST = "CLOSEST",
  RANDOM = "RANDOM",
  CHOOSE = "CHOOSE",
}

// Base interfaces (without relations)
export interface UserBase {
  username: string;
  password: string;
  name: string;
  description?: string | null;
  lattitude?: number | null;
  longitude?: number | null;
  createdAt?: Date; // DateTime comes as string from API
  updatedAt?: Date;
  address?: string | null;
}

export interface PartyBase {
  id?: string;
  name: string;
  description?: string | null;
  time: Date; // DateTime comes as string from API
  createdAt?: string;
  updatedAt?: string;
  hostId: string;
  status?: PartyStatus;
}

// Extended interfaces (with relations)
export interface Party extends PartyBase {
  adminId: string;
  hostType: HostType;
  host: UserBase;
  members: UserBase[];
}

export interface User extends UserBase {
  hostedParties: PartyBase[];
  partiesAdmin: PartyBase[];
  parties: PartyBase[];
}

// Request body interfaces
export interface CreateUserRequest {
  username: string;
  name: string;
  password: string;
  description?: string;
  lattitude?: number;
  longitude?: number;
  statusCode?: number;
  address?: string;
}

export interface UpdateUserRequest {
  name?: string;
  description?: string;
  lattitude?: number;
  longitude?: number;
  address?: string;
}

export interface CreatePartyRequest {
  name: string;
  description?: string;
  time: string;
  status?: PartyStatus;
}

export interface UpdatePartyRequest {
  name?: string;
  description?: string;
  time?: string;
  status?: PartyStatus;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  statusCode?: number;
  message?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: string[];
}

/**
 *
 * examples usages
import { User, Party, CreatePartyRequest } from './types';

// Get user
const user = await getter<User>(true, `users/${userId}`);

// Create party
const newParty: CreatePartyRequest = {
  name: "Birthday Party",
  description: "Come celebrate!",
  time: "2024-04-01T18:00:00Z"
};
const party = await post<Party>(true, "parties", newParty);

// Get party with all relations
const partyWithMembers = await getter<Party>(true, `parties/${partyId}`);
console.log(partyWithMembers.members); // TypeScript knows this is UserBase[]
 */
