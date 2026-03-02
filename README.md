🛡️ E-Permit Safety Management System

A modern digital platform for managing workplace safety permits and ensuring regulatory compliance across seven critical work areas.

📌 Overview

The E-Permit Safety Management System is a React-based web application designed to digitize and streamline the entire safety permit lifecycle — from request initiation to final closure.

It helps organizations improve workplace safety, maintain regulatory compliance, and monitor permit workflows in real time.

🚀 Core Features
🔐 Role-Based Access Control

The system supports four user roles:

Requester – Submit and track permit requests

Safety Officer – Review safety checklists and conduct inspections

Approver – Management-level approval authority

Admin – System configuration and monitoring

🔄 Complete Permit Workflow

Request Initiation – Submit detailed work request

Safety Checklist – Area-specific safety validation

Inspection – Safety officer verification

Approval – Management authorization

Issue & Notify – PDF generation and notifications

Work Execution – Active monitoring

Closure – Completion confirmation and restoration

🏗️ Supported Work Areas (7 Categories)

Confined Space (CS) – Isolation & atmospheric testing

Hot Work (HW) – Fire safety & spark control

Electrical Work (EW) – Lockout/Tagout & PPE compliance

Excavation (EXCA) – Utility detection & trench safety

Working at Heights (WAH) – Fall protection systems

Lifting Operations (LO) – Load safety & equipment checks

Maintenance (MAINT) – Equipment isolation & safety procedures

📊 Dashboard & Monitoring

Real-time permit tracking

Risk and compliance analytics

Performance reporting

User activity monitoring

System status overview

📄 Document & Record Management

Automatic PDF permit generation

Digital approvals and signatures

Email alerts & notifications

7-year document retention

Complete audit trail

🛠️ Technology Stack

Frontend: React 18, React Router DOM

HTTP Client: Axios

Styling: CSS-in-JS

Icons: React Icons

Notifications: React Toastify

PDF Generation: jsPDF

Testing: Jest & React Testing Library

⚙️ Installation & Setup
Prerequisites

Node.js 14+

npm or yarn

Steps
# Clone the repository
git clone https://github.com/your-org/e-permit-system.git

# Navigate into the project folder
cd e-permit-system

# Install dependencies
npm install

# Start development server
npm start

Open:

http://localhost:3000
📁 Project Structure
src/
│
├── components/
│   ├── auth/
│   ├── common/
│   ├── dashboard/
│   ├── permits/
│   └── workflow/
│
├── context/
├── pages/
├── services/
├── styles/
└── utils/
🔑 Demo Credentials
Role	Username	Password
Requester	requester	password
Safety Officer	safety	password
Approver	approver	password
Admin	admin	password

⚠️ These credentials are for demonstration purposes only.

🔐 Security Highlights

Role-based authorization

Activity audit logs

Secure session management

Digital signature support

Document access control

📈 Reporting & Analytics

Permit lifecycle metrics

Risk assessment trends

Compliance monitoring

Performance dashboards

Custom reports

📄 License

This project is licensed under the MIT License.

🤝 Support

For bug reports, feature requests, or improvements, please open an issue in this repository.

✨ Version

E-Permit Safety Management System v2.0
Enhancing Workplace Safety Through Digital Transformation.
