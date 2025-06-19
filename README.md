**User Authentication**

    JWT-based secure login, logout, token refresh, and password update fully implemented

    Supports cookie-based session handling with HTTP-only, secure tokens

**Messaging System**

    End-to-End Encrypted messaging backend completed

    **Features include:**

        Sending encrypted messages (AES + ECDH-ready structure)

        Fetching undelivered messages only (WhatsApp-style sync behavior)

        Marking messages as read or delivered

        Deleting messages by sender only

    Routes are protected via middleware using verifyJWT for secure access

**Schema Enhancements**

    Message schema now includes: conversationId, cipherText, iv, messageType, isDelivered, and isRead flags
