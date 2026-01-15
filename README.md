
# Abragim Fitness - Incentivized Savings Platform

Abragim Fitness is a cutting-edge FinTech web application that merges physical health with financial wealth. Built for the modern user, it provides a "Fit-Savings" flow where physical activity directly impacts financial stability.

## Core Business Logic

### 1. Fit-Savings Flow
The primary value proposition is the automated transfer of funds from a user's **Main Balance** (Spending) to their **HSA Balance** (Savings) based on activity.
- **Trigger**: 1,000 steps synced.
- **Action**: Deduction from Main Balance -> Addition to HSA Balance.
- **Incentive**: Users are psychologically motivated to walk more to grow their "Healthy Future" fund.

### 2. Tiered Subscription Model
The platform monetizes through two tiers, creating a clear upgrade path for high-activity users:
- **BASIC (€0/mo)**: Earns €1.00 per 1k steps. Standard lending rates apply.
- **PREMIUM (€9.99/mo)**: Earns €1.50 per 1k steps. High-yield savings rates and 0% interest on equipment loans.

### 3. Micro-Lending (Risk Mitigation)
Users can apply for "Equipment Loans."
- **Data-Driven Risk**: The platform uses activity history (steps) as a proxy for reliability and creditworthiness.
- **Admin Governance**: A back-office panel allows admins to review "Activity Scores" and approve/reject loan requests.

## Tech Stack
- **React 18+** with TypeScript
- **Tailwind CSS** for NeoBank-style UI/UX
- **Lucide-React** for iconography
- **Recharts** for data visualization
- **Firebase Mock Layer**: A custom-built persistence layer using LocalStorage to simulate Firebase Auth & Firestore for a seamless, stable live demo experience without external dependencies.

## Key Features
- **Onboarding**: Plan selection during sign-up.
- **Unified Dashboard**: Real-time balance and step tracking.
- **Admin Back-Office**: Full CRUD for user management and lending operations.
- **Transaction Logs**: Immutable-style record of all system events.
