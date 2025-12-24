export const domainRouter = (req, res, next) => {
  const host = req.get('host'); // e.g., "srfirstworld.org" or "localhost:5000"
  
  // Logic: 
  // 1. Production: Check for exact domain "srfirstworld.org"
  // 2. Development: Check for subdomain "superuser.localhost"
  
  const isProductionSuperuser = host === 'srfirstworld.org' || host === 'www.srfirstworld.org';
  const isDevSuperuser = host.startsWith('superuser.');

  if (isProductionSuperuser || isDevSuperuser) {
    req.isSuperuserDomain = true;
  } else {
    // Falls back to "srfirstworld.com" or localhost logic
    req.isSuperuserDomain = false;
  }
  
  next();
};