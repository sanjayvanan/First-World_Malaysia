export const domainRouter = (req, res, next) => {
  const host = req.get('host'); // e.g., "localhost:3000" or "superuser.com"
  
  // Logic: Check if the URL starts with "superuser"
  // NOTE: For local testing, we often use a header or specific port. 
  // This logic works for standard subdomains.
  if (host.startsWith('superuser.')) {
    req.isSuperuserDomain = true;
  } else {
    req.isSuperuserDomain = false;
  }
  
  next();
};