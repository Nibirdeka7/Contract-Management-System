# Contract Management Platform (Full Stack)

An end-to-end **Contract Management Platform** built as a full-stack assignment.  
The system allows creating reusable contract blueprints, generating contracts from those blueprints, and managing contracts through a **strictly enforced lifecycle**.

The focus of this project is **backend architecture, data modeling, lifecycle enforcement, and clean frontend–backend integration**, rather than UI polish.

---

## 🧠 Architecture Overview

### Tech Stack
- **Frontend**: React (Vite), JavaScript
- **State Management**: Zustand
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **API Style**: REST
- **Authentication**: Mocked / Not implemented (by design)

### High-Level Architecture
React (Frontend)
|
| REST APIs
|
Express (Backend)
|
MongoDB


The frontend consumes REST APIs exposed by the backend.  
All **business rules and lifecycle validation** are enforced on the backend.

---

## 📦 Core Concepts

### Blueprint
A **Blueprint** is a reusable contract template containing configurable fields.

Supported field types:
- Text
- Date
- Signature (represented as a checkbox)
- Checkbox

Each field stores:
- `type`
- `label`
- `position { x, y }`

---

### Contract
A **Contract** is an instance created from a Blueprint.

- Inherits all blueprint fields
- Stores values entered by the user
- Has a controlled lifecycle
- Becomes immutable once locked

---

## 🔁 Contract Lifecycle (CRITICAL)

Each contract follows a strictly enforced lifecycle:

- CREATED → APPROVED → SENT → SIGNED → LOCKED
- CREATED → REVOKED
- SENT → REVOKED

## Routes

```javascript

router.route('/')
  .post(createBlueprint)
  .get(getBlueprints);

router.route('/:id')
  .get(getBlueprint);
```
---
```javascript
router.route('/')
  .post(createContract)
  .get(getContracts);

router.route('/:id')
  .get(getContract);

router.route('/:id/fields')
  .put(updateContractFields);

router.route('/:id/status')
  .put(updateContractStatus);

router.route('/:id/next-statuses')
  .get(getNextAvailableStatuses);


```