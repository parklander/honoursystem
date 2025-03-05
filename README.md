# **HonourSystem - Project Requirements Document (PRD)**

## **📌 Overview**
HonourSystem is a **PWA-enabled** web application for tracking **consumable usage**, **tool and space booking**, **inventory tracking**, and **machine access control** in makerspaces. Users can log consumable usage, book tools or workspaces, receive **Discord notifications** for spending and restock alerts, and manage tool access via **RFID authentication** (future). The system integrates with **Supabase for authentication and database**, **Stripe for billing**, and is deployed on **Vercel with Turbopack**.

## **📑 Table of Contents**
1. [Overview](#-overview)
2. [Core Infrastructure Setup](#-phase-1-core-infrastructure-setup)
   - [Next.js App Router Setup](#step-11-initialize-nextjs-app-router-with-turbopack)
   - [Supabase Configuration](#step-12-configure-supabase-for-backend-services)
   - [Vercel Deployment](#step-13-deploy-to-vercel)
3. [Authentication & User Management](#-phase-2-authentication--user-management)
   - [Discord Authentication](#step-21-discord-authentication)
   - [User Profile Management](#step-22-user-profile-management)
   - [User Dashboard](#step-23-user-dashboard)
   - [Membership Management](#step-24-membership-management)
   - [User Communication](#step-25-user-communication)
   - [User Activity Tracking](#step-26-user-activity-tracking)
   - [Compliance & Safety](#step-27-compliance--safety)
   - [Admin User Management](#step-28-admin-user-management)
4. [Role-Based Access Control](#-phase-3-role-based-access-control)
   - [Core Roles & Permissions](#step-31-core-roles--permissions)
   - [Role Management Features](#step-32-role-management-features)
   - [Role-Based Tool Access](#step-33-role-based-tool-access)
   - [Role-Based Reporting](#step-34-role-based-reporting)
5. [Asset Management System](#-phase-4-asset-management-system)
   - [Tool Inventory Management](#step-41-tool-inventory-management)
   - [Inspection System](#step-42-inspection-system)
   - [Maintenance Management](#step-43-maintenance-management)
   - [Issue Tracking](#step-44-issue-tracking)
   - [Analytics & Reporting](#step-45-analytics--reporting)
   - [User Interface](#step-46-user-interface)
   - [Notifications & Alerts](#step-47-notifications--alerts)
6. [Tool Certification Management](#-phase-5-tool-certification-management)
   - [Certification System](#step-51-certification-system)
   - [Certification Tracking](#step-52-certification-tracking)
   - [Tool-Specific Requirements](#step-53-tool-specific-requirements)
   - [Certification Workflow](#step-54-certification-workflow)
   - [Notifications & Reminders](#step-55-notifications--reminders)
7. [Booking System for Tools & Spaces](#-phase-6-booking-system-for-tools--spaces)
   - [Tool & Space Reservations](#step-61-tool--space-reservations)
   - [Conflict Prevention & Check-Ins](#step-62-conflict-prevention--check-ins)
   - [Admin & Reporting Features](#step-63-admin--reporting-features)
8. [Machine Access Control](#-phase-7-machine-access-control)
   - [RFID-Based Machine Authentication](#step-71-rfid-based-machine-authentication)
   - [Time Tracking for Machine Usage](#step-72-time-tracking-for-machine-usage)
9. [Consumable Tracking System](#-phase-8-consumable-tracking-system)
   - [Consumable Logging](#step-81-consumable-logging)
   - [Spending Summary & Threshold Notifications](#step-82-spending-summary--threshold-notifications)
10. [Inventory Management System](#-phase-9-inventory-management-system)
    - [Inventory Tracking](#step-91-inventory-tracking)
    - [Auto-Restock Alerts](#step-92-auto-restock-alerts)
11. [Payment & Billing Integration](#-phase-10-payment--billing-integration)
    - [Stripe Subscription & Billing](#step-101-stripe-subscription--billing)
    - [Admin Controls for Billing Adjustments](#step-102-admin-controls-for-billing-adjustments)
12. [Project Management & Collaboration](#-phase-11-project-management--collaboration)
    - [Project Workspace](#step-111-project-workspace)
    - [Collaboration Tools](#step-112-collaboration-tools)
13. [Analytics & Reporting](#-phase-12-analytics--reporting)
    - [User Activity Dashboard](#step-121-user-activity-dashboard)
    - [Booking & Tool Usage Reports](#step-122-booking--tool-usage-reports)
14. [PWA Integration & Offline Support](#-phase-13-pwa-integration--offline-support)
    - [Enable PWA Features](#step-131-enable-pwa-features)
    - [Install Prompt & Offline Sync](#step-132-install-prompt--offline-sync)
15. [Goals](#-goals)
16. [Deployment Process](#-deployment-process)
17. [Next Steps](#-next-steps)

---

## **📍 Phase 1: Core Infrastructure Setup**
### **Step 1.1: Initialize Next.js App Router with Turbopack**
- Use **Next.js App Router (`app/` directory)**
- Enable **Turbopack for faster builds**
- Set up **custom import aliases** for better organization

### **Step 1.2: Configure Supabase for Backend Services**
- Create **Supabase Project**
- Enable **PostgreSQL database**
- Set up **Row-Level Security (RLS)** for data protection

### **Step 1.3: Deploy to Vercel**
- Configure **environment variables**
- Ensure **Turbopack is used for development**
- Enable **Webpack in production for PWA compatibility**

---

## **📍 Phase 2: Authentication & User Management**
### **Step 2.1: Discord Authentication**
- Enable **Discord OAuth** in Supabase
- Store **user profiles** with:
  - **Discord ID**
  - **Username**
  - **Email**
  - **Created at timestamp**
  - **Profile picture**
  - **Discord roles** (for role mapping)
  - **Last login**
  - **Account status** (active/suspended)

### **Step 2.2: User Profile Management**
- **Profile Information**
  - Full name
  - Phone number
  - Emergency contact
  - Medical conditions/allergies
  - Preferred notification methods
  - Language preferences
  - Time zone

- **Account Settings**
  - Password management
  - Two-factor authentication
  - Email preferences
  - Notification settings
  - Privacy settings
  - Account deletion

### **Step 2.3: User Dashboard**
- **Personal Overview**
  - Current membership status
  - Active certifications
  - Upcoming training sessions
  - Recent activity log
  - Spending summary
  - Current and upcoming reservations

- **Quick Actions**
  - Book tools/spaces
  - Log consumables
  - View training materials
  - Access project workspace
  - Contact support
  - View notifications

### **Step 2.4: Membership Management**
- **Membership Levels**
  - Basic (day pass)
  - Monthly
  - Annual
  - Family
  - Corporate

- **Membership Features**
  - Automatic renewal
  - Grace period handling
  - Membership pause
  - Upgrade/downgrade options
  - Guest passes
  - Membership transfer

### **Step 2.5: User Communication**
- **Notification System**
  - Email notifications
  - Discord messages
  - In-app notifications
  - SMS alerts (optional)
  - Custom notification preferences

- **Communication Channels**
  - Support ticket system
  - Direct messaging with staff
  - Announcement board
  - Community forums
  - Feedback system

### **Step 2.6: User Activity Tracking**
- **Usage History**
  - Tool usage logs
  - Space bookings
  - Consumable usage
  - Training attendance
  - Project participation
  - Payment history

- **Analytics**
  - Usage patterns
  - Popular tools/spaces
  - Peak usage times
  - Spending trends
  - Training progress

### **Step 2.7: Compliance & Safety**
- **Safety Records**
  - Incident reports
  - Safety training completion
  - Tool certifications
  - Safety violations
  - Warning system

- **Document Management**
  - Waivers
  - Insurance information
  - Medical forms
  - Training certificates
  - Project documentation

### **Step 2.8: Admin User Management**
- **User Administration**
  - User search and filtering
  - Bulk user operations
  - User status management
  - Role assignment
  - Access control

- **Reporting Tools**
  - User activity reports
  - Membership statistics
  - Usage analytics
  - Compliance reports
  - Financial summaries

---

## **📍 Phase 3: Role-Based Access Control**
### **Step 3.1: Core Roles & Permissions**
- **Member**
  - Basic tool access
  - Consumable logging
  - Space/tool booking
  - View own usage history
  - Access to training materials

- **Trainer**
  - All member permissions
  - Schedule training sessions
  - Mark certifications complete
  - Create training materials
  - View trainee progress

- **Admin**
  - All trainer permissions
  - Manage inventory
  - Adjust user roles
  - View system analytics
  - Manage billing
  - Configure system settings

- **Super Admin**
  - All admin permissions
  - Manage other admins
  - Access audit logs
  - Configure role permissions
  - System-wide settings

### **Step 3.2: Role Management Features**
- **Role Assignment**
  - Assign roles through admin dashboard
  - Role request system for members
  - Role approval workflow
  - Temporary role assignments

- **Permission Management**
  - Granular permission controls
  - Role-based access to features
  - Custom permission sets
  - Permission inheritance rules

- **Role-Based UI**
  - Dynamic navigation based on role
  - Role-specific dashboards
  - Custom views for different roles
  - Role-based notifications

### **Step 3.3: Role-Based Tool Access**
- **Tool Access Levels**
  - Basic tools (all members)
  - Intermediate tools (certified members)
  - Advanced tools (trainers/admins)
  - Specialized equipment (role-specific)

- **Access Control**
  - Role-based booking restrictions
  - Tool usage monitoring by role
  - Emergency override capabilities
  - Access history tracking

### **Step 3.4: Role-Based Reporting**
- **Usage Reports**
  - Role-specific analytics
  - Tool usage by role
  - Training completion rates
  - Role-based spending patterns

- **Audit Logs**
  - Role change history
  - Permission modifications
  - Access attempts
  - Administrative actions

---

## **📍 Phase 4: Asset Management System**
### **Step 4.1: Tool Inventory Management**
- **Tool Database**
  - Unique asset ID
  - Tool name and model
  - Serial number
  - Purchase date
  - Warranty information
  - Location in makerspace
  - Current status (active/maintenance/retired)
  - Purchase cost and supplier
  - Replacement value
  - Insurance information

- **Tool Categorization**
  - Tool type (power tools, hand tools, etc.)
  - Safety classification
  - Required certifications
  - Usage restrictions
  - Maintenance schedule
  - Expected lifespan

### **Step 4.2: Inspection System**
- **Regular Inspections**
  - Daily safety checks
  - Weekly maintenance inspections
  - Monthly detailed inspections
  - Quarterly safety audits
  - Annual comprehensive review

- **Inspection Checklist**
  - Safety features
  - Wear and tear
  - Calibration status
  - Cleanliness
  - Functionality tests
  - Documentation review
  - Compliance verification

- **Inspection Records**
  - Date and time
  - Inspector name
  - Findings and notes
  - Required actions
  - Follow-up dates
  - Photo documentation
  - Digital signatures

### **Step 4.3: Maintenance Management**
- **Maintenance Schedule**
  - Preventive maintenance calendar
  - Regular service intervals
  - Calibration requirements
  - Cleaning schedules
  - Parts replacement timeline
  - Tool-specific maintenance tasks

- **Maintenance Records**
  - Service date
  - Performed by
  - Parts replaced
  - Cost tracking
  - Service notes
  - Next service due date
  - Warranty claims

- **Maintenance Types**
  - Routine maintenance
  - Emergency repairs
  - Calibration
  - Deep cleaning
  - Parts replacement
  - Software updates
  - Safety upgrades

### **Step 4.4: Issue Tracking**
- **Problem Reporting**
  - User-reported issues
  - Inspection findings
  - Maintenance discoveries
  - Safety concerns
  - Performance problems
  - Documentation issues

- **Issue Management**
  - Issue priority levels
  - Assignment to staff
  - Resolution tracking
  - Communication with users
  - Cost tracking
  - Timeline management

### **Step 4.5: Analytics & Reporting**
- **Asset Analytics**
  - Usage statistics
  - Maintenance costs
  - Downtime tracking
  - Common issues
  - Lifecycle analysis
  - ROI calculations

- **Reporting Tools**
  - Maintenance reports
  - Inspection summaries
  - Issue resolution rates
  - Cost analysis
  - Compliance reports
  - Asset utilization

### **Step 4.6: User Interface**
- **Tool Status Dashboard**
  - Current tool status
  - Upcoming maintenance
  - Recent inspections
  - Active issues
  - Usage statistics
  - Maintenance history

- **Admin Controls**
  - Add/edit tools
  - Schedule inspections
  - Assign maintenance tasks
  - Update tool status
  - Manage issues
  - Generate reports

### **Step 4.7: Notifications & Alerts**
- **Automated Alerts**
  - Maintenance due dates
  - Inspection reminders
  - Issue notifications
  - Safety recalls
  - Warranty expirations
  - Calibration due dates

- **Communication**
  - Staff notifications
  - User announcements
  - Maintenance updates
  - Safety alerts
  - Tool availability changes

---

## **📍 Phase 5: Tool Certification Management**
### **Step 5.1: Certification System**
- **Certification Levels**
  - Basic Safety (required for all tools)
  - Basic Operation
  - Advanced Operation
  - Maintenance & Troubleshooting
  - Training Authorization

- **Certification Requirements**
  - Prerequisites for each level
  - Required training hours
  - Practical assessments
  - Written tests
  - Observation periods

### **Step 5.2: Certification Tracking**
- **User Certification Dashboard**
  - Current certification status for each tool
  - Certification history
  - Expiration dates
  - Renewal requirements
  - Training progress

- **Certification Management**
  - Issue new certifications
  - Renew expired certifications
  - Revoke certifications if needed
  - Track certification changes
  - Export certification reports

### **Step 5.3: Tool-Specific Requirements**
- **Basic Tools** (e.g., hand tools, basic power tools)
  - Basic safety certification
  - Quick orientation
  - No expiration

- **Intermediate Tools** (e.g., table saw, drill press)
  - Basic safety + operation certification
  - 2-hour training requirement
  - Annual renewal

- **Advanced Tools** (e.g., CNC, laser cutter)
  - All previous certifications
  - 4+ hours training
  - Practical assessment
  - 6-month renewal

- **Specialized Equipment** (e.g., welding, metal shop)
  - Specialized safety training
  - Industry-specific certifications
  - Regular competency checks

### **Step 5.4: Certification Workflow**
- **Training Process**
  - Schedule training sessions
  - Track attendance
  - Record training completion
  - Document trainer notes
  - Upload training materials

- **Assessment System**
  - Online safety quizzes
  - Practical demonstrations
  - Written tests
  - Observation checklists
  - Trainer evaluations

### **Step 5.5: Notifications & Reminders**
- **Automated Alerts**
  - Certification expiration warnings
  - Renewal reminders
  - Training session reminders
  - Assessment due dates
  - Recertification requirements

- **Compliance Reporting**
  - Certification status reports
  - Expired certifications
  - Pending renewals
  - Training completion rates
  - Tool access compliance

---

## **📍 Phase 6: Booking System for Tools & Spaces**
### **Step 6.1: Tool & Space Reservations**
- Allow users to **book tools** (e.g., CNC machines, 3D printers)
- Allow users to **book workspaces** (e.g., workbenches, private rooms)
- Display **availability calendar** for tools and spaces
- Implement **time slot selection** with configurable duration limits

### **Step 6.2: Conflict Prevention & Check-Ins**
- Prevent **double bookings** via real-time availability checks
- Require users to **check-in within a grace period** (or cancel the reservation)
- Enable **auto-cancelation** if a user does not check in
- Notify users via **Discord reminders before reservation time**

### **Step 6.3: Admin & Reporting Features**
- Admin dashboard for:
  - Viewing **upcoming reservations**
  - Adjusting **tool availability**
  - **Approving/denying booking requests** (if required)
- Generate **usage reports** on tool bookings

---

## **📍 Phase 7: Machine Access Control**
### **Step 7.1: RFID-Based Machine Authentication**
- Integrate **RFID scanning for tool access**
- Allow **tap-in/tap-out system**
- Restrict access based on **user roles & permissions**

### **Step 7.2: Time Tracking for Machine Usage**
- Track **usage duration for billing**
- Display **time remaining per session**
- Warn users about **overuse or violations**

---

## **📍 Phase 8: Consumable Tracking System**
### **Step 8.1: Consumable Logging**
- Users log **material usage** from a preset list
- Auto-suggest **frequently used items**
- Batch entry for **multiple consumables at once**
- Allow **manual editing before submission**

### **Step 8.2: Spending Summary & Threshold Notifications**
- Track **cumulative spending per user**
- Notify users via **Discord webhook** when:
  - **Spending reaches $25**
  - **New items are added to inventory**
  - **Billing cycle is near**

---

## **📍 Phase 9: Inventory Management System**
### **Step 9.1: Inventory Tracking**
- Maintain stock levels in Supabase
- Display **low-stock warnings** for admins
- Implement **usage analytics** (top used items, trends)

### **Step 9.2: Auto-Restock Alerts**
- Trigger **Discord notifications** when:
  - **Stock drops below reorder level**
  - **New inventory is added**
  - **Admin approves a restock request**

---

## **📍 Phase 10: Payment & Billing Integration**
### **Step 10.1: Stripe Subscription & Billing**
- Connect **Stripe API** for monthly billing
- Enable **automatic payment retries**
- Notify users of **failed payments** via Discord

### **Step 10.2: Admin Controls for Billing Adjustments**
- Allow **manual adjustment of logged consumables**
- Generate **CSV export of spending reports**
- Implement **review period before final charges**

---

## **📍 Phase 11: Project Management & Collaboration**
### **Step 11.1: Project Workspace**
- Allow users to **create and manage projects**
- Enable **project sharing** with other members
- Track **project-specific consumable usage**
- Store **project documentation** and files
- Link **project bookings** to specific tools/spaces

### **Step 11.2: Collaboration Tools**
- Add **project comments** and discussions
- Enable **file sharing** between project members
- Create **project-specific chat channels** in Discord
- Allow **project progress tracking**
- Enable **mentor/mentee relationships** for skill sharing

---

## **📍 Phase 12: Analytics & Reporting**
### **Step 12.1: User Activity Dashboard**
- Graphs for **top used consumables**
- Spending trends over **time and user groups**

### **Step 12.2: Booking & Tool Usage Reports**
- Identify **high-demand tools and spaces**
- Suggest **inventory adjustments** based on trends

---

## **📍 Phase 13: PWA Integration & Offline Support**
### **Step 13.1: Enable PWA Features**
- Add **Web App Manifest** for installability
- Implement **service worker** for caching:
  - **Dashboard and consumable logs**
  - **Offline consumable logging**
  - **Booking history**

### **Step 13.2: Install Prompt & Offline Sync**
- Prompt users to **install the app on mobile/desktop**
- Sync offline **logged consumables** when online
- Improve **load times with cache-first strategies**

---

## **🎯 Goals**
✔ **Next.js App Router & Turbopack Setup**  
✔ **Supabase Authentication with Discord**  
✔ **Consumable & Inventory Tracking**  
✔ **Stripe Payments & Notifications**  
✔ **PWA Features & Offline Logging**  
✔ **Booking System for Tools & Workspaces**  
🔜 **RFID-Based Tool Access (Future Phase)**  

---

## **🛠 Deployment Process**
1. **Push to GitHub**
2. **Deploy to Vercel (`vercel deploy`)**
3. **Test PWA Installability & Offline Mode**
4. **Verify Stripe & Discord Webhooks**
5. **Monitor Usage & Optimize**

---

## **🔜 Next Steps**
- **Enhance analytics dashboards**
- **Develop RFID tool access**
- **Integrate push notifications for spending alerts**
- **Expand PWA offline capabilities**

This PRD outlines the **feature roadmap**, ensuring a structured development process with **scalable phases**. 🚀
