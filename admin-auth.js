// Netlify serverless function for admin authentication
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const { adminId, securityKey } = JSON.parse(event.body);
    
    // Validate credentials (update with your actual values)
    const validAdminId = '6575412146';
    const validSecurityKey = 'Asdfghjkl@123'; // CHANGE THIS!
    
    if (adminId === validAdminId && securityKey === validSecurityKey) {
      // Generate session token
      const sessionToken = Buffer.from(`${Date.now()}:${adminId}`).toString('base64');
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `admin_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`
        },
        body: JSON.stringify({
          success: true,
          token: sessionToken,
          message: 'Login successful'
        })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};