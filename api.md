## API Documentation
20/10/2024

The API is a RESTful API that uses JSON for serialization and a predefined token for authentication.
Only specific endpoints require authentication, and the token is passed in the header of the request.

### Card information:
- **GET /cards**:
  - Description: Get all cards
  - Authentication: No
  - Response: List of cards
  
- **GET /cards/{id}**:
  - Description: Get a card by ID
  - Authentication: No
  - Request: None
  - Response: Card object including all charge sessions associated with the card

### Charge session information:
- **Get /charge-sessions**:
  - Description: Get all charge sessions
  - Authentication: No
  - Response: List of charge sessions
  
- **GET /charge-sessions/{id}**:
  - Description: Get a charge session by ID
  - Authentication: No
  - Request: None
  - Response: Charge session object including all the logs associated with the charge session

### Logs information:

- **GET /logs**:
  - Description: Get all logs
  - Authentication: No
  - Response: List of logs (last 100)
  - Request: None

### Totals information:
- **GET /totals**:
  - Description: Get the totals Wh's
  - Authentication: Yes
  - Response: Total Wh, charge Wh and idle Wh