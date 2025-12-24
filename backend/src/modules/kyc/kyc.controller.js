import { query } from '../../shared/db.js';

export const submitKYC = async (req, res) => {
  const userId = req.user.id;
  
  // req.files contains the uploaded images
  // We assume the frontend sends 'idFront' and 'idBack'
  if (!req.files || !req.files.idFront || !req.files.idBack) {
    return res.status(400).json({ error: 'Both ID Front and Back are required' });
  }

  const idFrontPath = req.files.idFront[0].path;
  const idBackPath = req.files.idBack[0].path;

  try {
    // 1. Update User Status to "SUBMITTED" (Waiting for review)
    // We also store the file paths (In a real app, you'd save these paths to a separate kyc_docs table)
    await query(
      `UPDATE users 
       SET kyc_status = 'SUBMITTED', 
           details = jsonb_set(COALESCE(details, '{}'), '{kyc_docs}', $1)
       WHERE id = $2`,
      [JSON.stringify({ front: idFrontPath, back: idBackPath }), userId]
    );

    res.json({ message: 'KYC Submitted Successfully. Waiting for verification.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving KYC' });
  }
};