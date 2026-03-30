import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactLead {
    name: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bootstrapAdmin(): Promise<boolean>;
    deleteLead(id: bigint): Promise<void>;
    getAllLeads(): Promise<Array<ContactLead>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeadById(id: bigint): Promise<ContactLead | null>;
    getLeadsByPhone(phone: string): Promise<Array<ContactLead>>;
    getLeadsInTimeRange(startTimestamp: bigint, endTimestamp: bigint): Promise<Array<ContactLead>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    storeLead(name: string, phone: string, message: string, timestamp: bigint): Promise<void>;
}
