# User Stories - GiftLink

**Title:** User Registration
_As a_ new user,
_I want_ to register an account with my name, email, and password,
_so that_ I can securely access the GiftLink platform.

**Acceptance Criteria:**
1. Given I am on the registration page, when I submit valid details, then my account is created.
2. Given I submit an email that is already registered, then I receive an error message.

**Priority:** High
**Story Points:** 3
**Notes:** Requires secure password hashing.

---

**Title:** User Login
_As a_ registered user,
_I want_ to log in with my email and password,
_so that_ I can access my account and listings.

**Acceptance Criteria:**
1. Given valid credentials, when I log in, then I receive an auth token.
2. Given invalid credentials, then I receive an error message.

**Priority:** High
**Story Points:** 2
**Notes:** Uses JWT for session handling.

---

**Title:** Browse Item Listings
_As a_ user,
_I want_ to view all available items,
_so that_ I can find something I need.

**Acceptance Criteria:**
1. Given I visit the homepage, when items exist, then they are displayed in a list.

**Priority:** High
**Story Points:** 2

---

**Title:** Search Items by Category
_As a_ user,
_I want_ to filter items by category,
_so that_ I can quickly find relevant items.

**Acceptance Criteria:**
1. Given I select a category, when I search, then only matching items are shown.

**Priority:** Medium
**Story Points:** 3

---

**Title:** View Item Details
_As a_ user,
_I want_ to view detailed information about an item,
_so that_ I can decide whether to request it.

**Acceptance Criteria:**
1. Given I click on an item, then its full details are displayed.

**Priority:** Medium
**Story Points:** 2

---

**Title:** Comment on Items
_As a_ user,
_I want_ to leave comments on an item listing,
_so that_ I can ask questions or express interest.

**Acceptance Criteria:**
1. Given I am logged in, when I submit a comment, then it appears under the item.

**Priority:** Low
**Story Points:** 3

---

**Title:** Edit User Profile
_As a_ registered user,
_I want_ to update my profile information,
_so that_ my details stay current.

**Acceptance Criteria:**
1. Given I am logged in, when I update my name, then the change is saved.

**Priority:** Medium
**Story Points:** 2

---

**Title:** Recommendation Engine
_As a_ user,
_I want_ to receive suggestions based on item descriptions,
_so that_ I can discover relevant items faster.

**Acceptance Criteria:**
1. Given an item description, when analyzed, then relevant keywords and sentiment are returned.

**Priority:** Low
**Story Points:** 5
