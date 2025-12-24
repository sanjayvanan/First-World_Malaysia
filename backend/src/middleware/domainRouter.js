export const domainRouter = (req, res, next) => {
  const host = req.get('host'); 
  
  const isProductionSuperuser = host === 'srfirstworld.org' || host === 'www.srfirstworld.org';
  
  // FIXED: Added "host.includes('localhost')" so it works for you right now
  const isDevSuperuser = host.startsWith('superuser.') || host.includes('localhost');

  if (isProductionSuperuser || isDevSuperuser) {
    req.isSuperuserDomain = true;
  } else {
    req.isSuperuserDomain = false;
  }
  
  next();
};