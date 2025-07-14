// This is a temporary, in-memory store for the QuickBooks tokens.
// In a real production application, you would store this securely in a database (like Firestore)
// associated with the user's account.

interface TokenData {
    accessToken: string;
    refreshToken: string;
    realmId: string;
    expiresAt: number; // Timestamp in milliseconds
    refreshTokenExpiresAt: number; // Timestamp in milliseconds
}

class TemporaryTokenStore {
    private tokens: TokenData | null = null;

    setTokens(tokenData: TokenData) {
        console.log("Storing tokens in temporary store:", tokenData);
        this.tokens = tokenData;
    }

    getTokens(): TokenData | null {
        return this.tokens;
    }

    clearTokens() {
        this.tokens = null;
    }
}

// Export a singleton instance
export const temporaryTokenStore = new TemporaryTokenStore();
