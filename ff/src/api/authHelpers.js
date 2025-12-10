export function ensureSelectedNoteOrReject(selectedNote) {
  if (!selectedNote) {
    throw new Error("Please select a document before asking the AI.");
  }
}

export function checkTokenValidity(user) {
  // assume user.tokens_expires_at exists
  if (user && user.tokens_expires_at) {
    const exp = new Date(user.tokens_expires_at);
    if (exp < new Date()) throw new Error("Your tokens have expired. Please purchase tokens.");
  }
}