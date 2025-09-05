# Contratos de API - Mensura Maat Website

## Backend Implementation Plan

### 1. Database Models

#### Contact Model (contacts collection)
```
{
  id: string (auto-generated)
  name: string (required)
  email: string (required, validated)
  phone: string (optional)
  service: string (optional)
  message: string (required)
  status: string (enum: 'new', 'contacted', 'converted', 'closed')
  created_at: datetime
  updated_at: datetime
}
```

#### Service Inquiry Stats (for analytics - optional)
```
{
  service_name: string
  inquiry_count: number
  last_inquiry: datetime
}
```

### 2. API Endpoints

#### POST /api/contacts
**Purpose**: Create new contact from form submission
**Request Body**:
```json
{
  "name": "string (required, min 2 chars)",
  "email": "string (required, valid email)",
  "phone": "string (optional)",
  "service": "string (optional)",
  "message": "string (required, min 10 chars)"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Contato enviado com sucesso! Entraremos em contato em breve.",
  "contact_id": "string"
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "message": "string",
  "errors": ["field specific errors"]
}
```

#### GET /api/contacts (Admin only - for future)
**Purpose**: Get all contacts for admin dashboard
**Response**:
```json
{
  "success": true,
  "contacts": [Contact],
  "total": number,
  "page": number,
  "limit": number
}
```

#### GET /api/stats (Optional analytics)
**Purpose**: Get basic stats about inquiries
**Response**:
```json
{
  "total_contacts": number,
  "contacts_this_month": number,
  "popular_services": [
    {"service": "string", "count": number}
  ]
}
```

### 3. Frontend Integration Changes

#### Files to modify:
1. **Contact.jsx** - Replace mock form submission with real API call
2. **mock.js** - Keep for static content, remove form handling mock

#### Contact Form Integration:
- Replace `handleSubmit` function to call `/api/contacts`
- Add loading state during submission
- Add success/error message display
- Form validation before API call
- Reset form on successful submission

#### API Integration Pattern:
```javascript
// In Contact.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await axios.post(`${API}/contacts`, formData);
    if (response.data.success) {
      // Show success message
      // Reset form
      // Optional: redirect to thank you section
    }
  } catch (error) {
    // Show error message
  } finally {
    setLoading(false);
  }
};
```

### 4. Email Notification (Future Enhancement)
- Send email to admin when new contact is created
- Send auto-reply to user confirming receipt

### 5. Data Mock vs Real Implementation

#### Currently Mocked in mock.js:
- Company info (keep as static)
- Hero content (keep as static) 
- About content (keep as static)
- Services list (keep as static)
- Contact form labels (keep as static)

#### To be replaced with real backend:
- Form submission handling
- Contact storage
- Form validation and error handling

### 6. Error Handling Strategy
- Client-side validation before API call
- Server-side validation with detailed error messages
- User-friendly error display
- Fallback to WhatsApp if form fails

### 7. Success Flow
1. User fills contact form
2. Frontend validates data
3. API call to POST /api/contacts
4. Backend validates and stores in MongoDB
5. Success response returned
6. Form reset + success message shown
7. Optional: Show suggestion to also contact via WhatsApp

### 8. Security Considerations
- Input sanitization on backend
- Email validation
- Rate limiting for form submissions
- CORS properly configured (already done)

This implementation will make the contact form fully functional while keeping all the existing design and features intact.