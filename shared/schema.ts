import { pgTable, text, serial, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("employee"),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  
  // Basic Details
  employeeId: text("employee_id"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: date("date_of_birth"),
  dateOfJoining: date("date_of_joining"),
  nationality: text("nationality"),
  religion: text("religion"),
  maritalStatus: text("marital_status"),
  designation: text("designation"),
  
  // Contact Details
  mobileNumber: text("mobile_number"),
  personalEmail: text("personal_email"),
  emergencyContact: text("emergency_contact"),
  
  // About
  about: text("about"),
  
  // Address Details
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  pincode: text("pincode"),
  workLocation: text("work_location"),

  // Banking Details
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountType: text("account_type"),
  ifscCode: text("ifsc_code"),
  swiftCode: text("swift_code"),
  branchName: text("branch_name"),
  
  // Passport Details
  passportNumber: text("passport_number"),
  passportExpiry: date("passport_expiry"),
  hasPassport: text("has_passport"),
  
  // Photo
  profilePhoto: text("profile_photo"),
  
  // Resume
  resumeUrl: text("resume_url"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
